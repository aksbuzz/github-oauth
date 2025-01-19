import {ProviderNotFoundError} from './errors.js';
import {OAuthProvider} from './OAuthProvider.js';

export class OAuthClient {
  private static providers: Map<string, OAuthProvider> = new Map();

  static getProvider(name: string): OAuthProvider {
    const provider = this.providers.get(name);
    if (!provider) {
      throw new ProviderNotFoundError(name);
    }

    return provider;
  }

  static registerProvider(name: string, provider: OAuthProvider) {
    if (!this.providers.has(name)) {
      this.providers.set(name, provider);
    }
  }
}
