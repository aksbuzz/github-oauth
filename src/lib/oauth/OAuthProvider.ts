export abstract class OAuthProvider {
  abstract getAuthorizationURL(state: string, scope?: string[]): string;
  abstract exchangeCodeForToken(code: string): Promise<string>;
  abstract getUserInfo(token: string): Promise<any>;
}
