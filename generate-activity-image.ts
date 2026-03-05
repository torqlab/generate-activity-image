import { getProvider } from './providers';
import {
  GENERATE_ACTIVITY_IMAGE_MAX_PROMPT_LENGTH,
  GENERATE_ACTIVITY_IMAGE_MAX_RETRIES,
} from './constants';
import {
  GenerateActivityImageProviderName,
  GenerateActivityImageInput,
  GenerateActivityImageOutput,
  GenerateActivityImageProviderApiKeys,
} from './types';

/**
 * Attempts image generation with retry logic.
 * @internal
 * @param {string} prompt - Image generation prompt.
 * @param {string} defaultPrompt - Default prompt to use for retries.
 * @param {number} attempt - Current attempt number (0-based)
 * @param {number} maxAttempts - Maximum number of retries allowed
 * @param {GenerateActivityImageProviderName} [providerName] - Optional provider name
 * @param {GenerateActivityImageProviderApiKeys} [providerApiKeys] - Optional provider API keys.
 * @returns {Promise<string>} Promise resolving to base64-encoded image data URL
 * @throws {Error} Throws error if all retries fail
 */
const attemptGeneration = async (
  prompt: string,
  defaultPrompt: string,
  attempt: number,
  maxAttempts: number,
  providerName?: GenerateActivityImageProviderName,
  providerApiKeys?: GenerateActivityImageProviderApiKeys,
): Promise<string> => {
  const provider = getProvider(providerName, providerApiKeys);

  try {
    return await provider(prompt);
  } catch (error) {
    if (attempt < maxAttempts) {
      const nextAttempt = attempt + 1;

      return attemptGeneration(
        defaultPrompt,
        defaultPrompt,
        nextAttempt,
        maxAttempts,
        providerName,
        providerApiKeys,
      );
    } else {
      throw error;
    }
  }
};

/**
 * Generates activity image using configured AI provider.
 *
 * Provider is controlled by IMAGE_PROVIDER environment variable:
 * - 'pollinations' (default): Free, unlimited Pollinations.ai
 *
 * Implements retry logic with prompt simplification and fallback mechanism.
 * Attempts image generation up to GENERATE_ACTIVITY_IMAGE_MAX_RETRIES times, simplifying the prompt
 * on each retry. If all retries fail, uses a safe fallback prompt. Images are
 * downloaded from the provider and returned as base64-encoded data URLs.
 *
 * Generation process:
 * 1. Get configured provider based on IMAGE_PROVIDER env var (defaults to Pollinations)
 * 2. Validate prompt text length (max 600 characters)
 * 3. Attempt generation with original prompt
 * 4. On failure, retry with simplified prompt (max 2 retries)
 * 5. If all retries fail, use fallback prompt
 * 6. Images are downloaded from provider and returned as base64 data URLs
 * 7. Always returns a valid base64-encoded image data URL
 *
 * @param {GenerateActivityImageInput} input - Image generation input with prompt
 * @returns {Promise<GenerateActivityImageOutput>} Promise resolving to generated image data and metadata
 * @throws {Error} Throws error if generation fails
 *
 * @example
 * ```typescript
 * const result = await generateImage({ prompt });
 * console.log('Image data:', result.imageData);
 * console.log('Used fallback:', result.fallback);
 * ```
 */
const generateActivityImage = async ({
  prompt,
  defaultPrompt,
  provider,
  providerApiKeys,
  attempts,
}: GenerateActivityImageInput): Promise<GenerateActivityImageOutput> => {
  const isAllowedPromptLength = prompt.length <= GENERATE_ACTIVITY_IMAGE_MAX_PROMPT_LENGTH;

  if (isAllowedPromptLength) {
    try {
      const imageData = await attemptGeneration(
        prompt,
        defaultPrompt,
        0,
        GENERATE_ACTIVITY_IMAGE_MAX_RETRIES,
        provider,
        providerApiKeys,
      );

      return {
        fallback: false,
        attempts: attempts ?? 0,
        imageData,
      };
    } catch {
      const run = getProvider(provider, providerApiKeys);
      const fallbackImageData = await run(defaultPrompt);

      return {
        imageData: fallbackImageData,
        fallback: true,
        attempts: GENERATE_ACTIVITY_IMAGE_MAX_RETRIES,
      };
    }
  } else {
    const run = getProvider(provider, providerApiKeys);
    const fallbackImageData = await run(defaultPrompt);

    return {
      imageData: fallbackImageData,
      fallback: true,
      attempts: GENERATE_ACTIVITY_IMAGE_MAX_RETRIES,
    };
  }
};

export default generateActivityImage;
