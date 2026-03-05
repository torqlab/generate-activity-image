import {
  GenerateActivityImageProvider,
  GenerateActivityImageProviderApiKeys,
  GenerateActivityImageProviderName,
} from '../types';

/**
 * Gets the configured image generation provider.
 *
 * Supported providers:
 * - 'pollinations' (default): Free, unlimited, no authentication.
 *
 * @param {GenerateActivityImageProviderName} [providerName] - Image generation provider name (`pollinations` by default).
 * @param {GenerateActivityImageProviderApiKeys} [providerApiKeys] - Optional provider API keys.
 * @returns {GenerateActivityImageProvider} Image generation provider instance.
 * @throws {Error} Throws if provider name is invalid.
 *
 * @example
 * ```typescript
 * const provider2 = getProvider('pollinations');
 * ```
 */
const getProvider = (
  providerName: GenerateActivityImageProviderName = 'pollinations',
  providerApiKeys?: GenerateActivityImageProviderApiKeys,
): GenerateActivityImageProvider => {
  switch (providerName) {
    case 'pollinations': {
      return async (prompt: string) => {
        const { default: pollinations } = await import('./pollinations');

        return pollinations(prompt, providerApiKeys?.pollinations)
      };
    }
    default: {
      throw new Error(`Unknown image generation provider: ${String(providerName)}.`);
    }
  }
};

export default getProvider;
