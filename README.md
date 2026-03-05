[![Publish](https://github.com/torqlab/generate-activity-image/actions/workflows/publish.yml/badge.svg)](https://github.com/torqlab/generate-activity-image/actions/workflows/publish.yml)

# @torqlab/generate-activity-image

AI-powered image generation for athletic activities using Pollinations.ai with automatic retry logic, fallback support, and comprehensive error handling.

This package provides a robust interface for generating creative images from text prompts describing activities. It handles retries automatically, falls back to default prompts on failure, and returns images as base64-encoded data URLs for easy integration.

## Install

Published to NPM.

```bash
npm i @torqlab/generate-activity-image
```

Or with Bun:

```bash
bun add @torqlab/generate-activity-image
```

## Quick start

```ts
import generateActivityImage from '@torqlab/generate-activity-image';
import type {
  GenerateActivityImageInput,
  GenerateActivityImageOutput,
} from '@torqlab/generate-activity-image';

const input: GenerateActivityImageInput = {
  prompt: 'A runner on a mountain trail at sunset, dynamic motion, vibrant colors',
  defaultPrompt: 'A person running outdoors',
  provider: 'pollinations',
};

const result: GenerateActivityImageOutput = await generateActivityImage(input);

console.log('Image generated successfully');
console.log('Data URL:', result.imageData.substring(0, 50) + '...');
console.log('Used fallback:', result.fallback);
console.log('Attempts:', result.attempts);
```

## Features

- **AIpowered Image Generation**: Uses Pollinations.ai for high-quality image generation from text prompts
- **Automatic Retries**: Built-in retry logic with automatic fallback to default prompts
- **Base64 Data URLs**: Returns images as base64-encoded `data:image/png;base64,...` URLs
- **Provider Pattern**: Extensible provider architecture for adding new image generation services
- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Error Handling**: Graceful error handling with fallback mechanisms
- **Zero Dependencies**: No external runtime dependencies
- **Configurable**: Support for custom prompts, retry attempts, and provider selection

## API Reference

### `generateActivityImage(input)`

Generate an image from a text prompt with automatic retry and fallback.

#### Parameters

```ts
interface GenerateActivityImageInput {
  // Text prompt for image generation (max 1000 characters)
  prompt: string;

  // Default/fallback prompt (used if main prompt fails)
  defaultPrompt: string;

  // Number of retry attempts (optional)
  attempts?: number;

  // Image generation provider (optional, defaults to 'pollinations')
  provider?: GenerateActivityImageProviderName;

  // API keys for providers (optional)
  providerApiKeys?: GenerateActivityImageProviderApiKeys;
}
```

#### Returns

```ts
interface GenerateActivityImageOutput {
  // Base64-encoded image data URL
  imageData: string;

  // Whether fallback prompt was used
  fallback: boolean;

  // Number of retry attempts performed
  attempts: number;
}
```

#### Example

```ts
const result = await generateActivityImage({
  prompt: 'A cyclist riding through a forest at golden hour',
  defaultPrompt: 'A person cycling outdoors',
  provider: 'pollinations',
  attempts: 3,
});

if (result.fallback) {
  console.log('Used fallback prompt after retries');
}

// Use result.imageData in an image element
document.getElementById('activity-image').src = result.imageData;
```

## Providers

### Pollinations (Default)

Free, unlimited image generation via [Pollinations.ai](https://pollinations.ai).

- **Model**: Flux (best for illustrations and balanced quality)
- **Cost**: Free
- **Rate Limiting**: None
- **Authentication**: Optional API key

#### Supported Models

- `flux` (default, best for illustrations)
- `seedream` (excellent prompt understanding)
- `gpt-image-large` (photorealism)
- `kontext` (context-aware)

The model is configurable via code customization.

## Constants

```ts
import {
  GENERATE_ACTIVITY_IMAGE_MAX_PROMPT_LENGTH,
  GENERATE_ACTIVITY_IMAGE_MAX_RETRIES,
} from '@torqlab/generate-activity-image';

// Maximum prompt length in characters
console.log(GENERATE_ACTIVITY_IMAGE_MAX_PROMPT_LENGTH); // 1000

// Maximum number of retries
console.log(GENERATE_ACTIVITY_IMAGE_MAX_RETRIES); // 2
```

## Type Definitions

```ts
// Supported provider names
export type GenerateActivityImageProviderName = 'pollinations';

// API keys configuration
export interface GenerateActivityImageProviderApiKeys {
  pollinations?: string;
}

// Input configuration
export interface GenerateActivityImageInput {
  prompt: string;
  defaultPrompt: string;
  attempts?: number;
  provider?: GenerateActivityImageProviderName;
  providerApiKeys?: GenerateActivityImageProviderApiKeys;
}

// Output result
export interface GenerateActivityImageOutput {
  imageData: string;
  fallback: boolean;
  attempts: number;
}

// Provider function type
export type GenerateActivityImageProvider = (prompt: string, apiKey?: string) => Promise<string>;
```

## Error Handling

The package provides comprehensive error handling with automatic fallback:

```ts
import generateActivityImage from '@torqlab/generate-activity-image';

try {
  const result = await generateActivityImage({
    prompt: 'A runner on a scenic trail',
    defaultPrompt: 'A person running',
  });

  if (result.fallback) {
    console.log('Image generated using fallback prompt');
    console.log('Prompt exceeded length or generation failed');
  }
} catch (error) {
  console.error('Image generation failed:', error);
  // Handle error appropriately
}
```

## Behavior

### Generation Flow

1. Validate prompt length (max 1000 characters)
2. Attempt generation with original prompt
3. On failure, retry with default prompt (up to 2 retries)
4. Return generated image as base64 data URL
5. If all retries fail, use fallback prompt for final attempt
6. Always returns a valid response (never throws if fallback succeeds)

### Retry Logic

- **Attempt 1**: Original prompt
- **Attempt 2**: Default prompt (if original fails)
- **Attempt 3**: Default prompt again (if Attempt 2 fails)
- **Fallback**: Uses default prompt if all retries exhausted

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

Issues and pull requests are welcome on [GitHub](https://github.com/torqlab/generate-activity-image).
