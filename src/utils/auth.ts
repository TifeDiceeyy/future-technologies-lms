/**
 * Clears all Amplify / Cognito OAuth PKCE state from both localStorage
 * and sessionStorage. Call this before starting a fresh Google OAuth flow,
 * or on mount of the login/register page to wipe any stale state left by
 * a back-press or mid-flow page refresh.
 */
export function clearAmplifyOAuthState() {
  [localStorage, sessionStorage].forEach((storage) => {
    Object.keys(storage)
      .filter(
        (k) =>
          k.startsWith("CognitoIdentityServiceProvider") ||
          k.startsWith("amplify"),
      )
      .forEach((k) => storage.removeItem(k));
  });
}
