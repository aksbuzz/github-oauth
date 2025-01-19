import { FetchError } from "../errors.js";
import { OAuthProvider } from "../OAuthProvider.js";

export class GithubProvider extends OAuthProvider {
  constructor(
    private clientId: string,
    private clientSecret: string,
    private redirectUri: string
  ) {
    super();
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
  }

  getAuthorizationURL(state: string, scope?: string[]): string {
    const baseURL = "https://github.com/login/oauth/authorize";
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      state,
      ...(scope ? { scope: scope.join(" ") } : null),
    });

    return `${baseURL}?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string): Promise<string> {
    const baseURL = "https://github.com/login/oauth/access_token";

    try {
      const response = await fetch(baseURL, {
        method: "POST",
        body: JSON.stringify({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code,
          redirect_uri: this.redirectUri,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      throw new FetchError(error);
    }
  }

  async getUserInfo<T>(token: string): Promise<T> {
    const baseURL = "https://api.github.com/user";

    const response = await fetch(baseURL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.json();
  }
}
