/**
 * Common interface for all image generation providers.
 * Generates an image from a text prompt.
 * @param {string} prompt - Text prompt for image generation.
 * @param {string} [apiKey] - Optional API key for the provider (if required).
 * @returns {Promise<string>} Promise resolving to base64-encoded image data URL (`data:image/png;base64,...`).
 * @throws {Error} Throws error if generation fails.
 */
export type GenerateActivityImageProvider = (prompt: string, apiKey?: string) => Promise<string>;

/**
 * Supported image generation providers:
 * - `pollinations`: Free, unlimited, no authentication.
 */
export type GenerateActivityImageProviderName = 'pollinations';

export interface GenerateActivityImageProviderApiKeys {
  pollinations?: string;
}

export interface GenerateActivityImageInput {
  prompt: string;
  defaultPrompt: string;
  attempts?: number;
  provider?: GenerateActivityImageProviderName;
  providerApiKeys?: GenerateActivityImageProviderApiKeys;
}

export interface GenerateActivityImageOutput {
  /** Base64-encoded image data URL. */
  imageData: string;
  /** Whether fallback was used. */
  fallback: boolean;
  /** Number of retry attempts performed. */
  attempts: number;
}
