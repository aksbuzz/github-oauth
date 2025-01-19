export class ProviderNotFoundError extends Error {
  constructor(provider: string) {
    super(`Provider ${provider} not found`);
  }
}

export class FetchError extends Error {
  constructor(error: unknown) {
    super(
      `Failed to send request: ${error instanceof Error ? error.message : String(error)}`,
    );
    this.name = 'FetchError';
  }
}
