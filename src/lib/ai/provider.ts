export type AIMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type StreamTextOptions = {
  messages: AIMessage[];
  systemPrompt?: string;
};

/**
 * Abstract interface for all AI providers.
 * The core application MUST work even if no provider is configured.
 */
export interface AIProvider {
  readonly name: string;
  readonly isAvailable: boolean;
  streamText(options: StreamTextOptions): Promise<Response>;
  generateText(options: StreamTextOptions): Promise<string>;
}

/**
 * Registry to retrieve the configured AI provider.
 * Returns null if no provider is available — consumers must handle gracefully.
 */
let _activeProvider: AIProvider | null = null;

export function registerProvider(provider: AIProvider): void {
  _activeProvider = provider;
}

export function getProvider(): AIProvider | null {
  return _activeProvider;
}

export function requireProvider(): AIProvider {
  if (!_activeProvider || !_activeProvider.isAvailable) {
    throw new Error("AI_PROVIDER_UNAVAILABLE");
  }
  return _activeProvider;
}
