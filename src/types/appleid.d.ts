// Ambient types for Apple's Sign in with Apple JS SDK.
// Loaded from https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js
// Only the methods we call are typed.

export {};

declare global {
  interface AppleIDAuthInitOptions {
    clientId: string;
    scope?: string;
    redirectURI: string;
    state?: string;
    nonce?: string;
    usePopup?: boolean;
  }

  interface AppleIDSignInResponse {
    authorization: {
      code: string;
      id_token: string;
      state?: string;
    };
    user?: {
      email?: string;
      name?: { firstName?: string; lastName?: string };
    };
  }

  interface AppleIDAuth {
    init(options: AppleIDAuthInitOptions): void;
    renderButton?: () => void;
    signIn(): Promise<AppleIDSignInResponse>;
  }

  interface Window {
    AppleID?: {
      auth: AppleIDAuth;
    };
  }
}
