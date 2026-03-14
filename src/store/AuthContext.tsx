/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  signIn,
  signUp,
  signOut,
  confirmSignUp,
  getCurrentUser,
  fetchUserAttributes,
  resendSignUpCode,
  signInWithRedirect,
} from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import type { User } from "../types";
import { clearAmplifyOAuthState } from "../utils/auth";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  confirmSignUp: (email: string, code: string) => Promise<void>;
  resendCode: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | null>(null);

// ─── Helper — build User from Cognito attributes ──────────────────────────────

async function buildCurrentUser(): Promise<User> {
  const cognitoUser = await getCurrentUser();
  const attrs = await fetchUserAttributes();

  return {
    id: cognitoUser.userId,
    email: attrs.email ?? "",
    name: attrs.name ?? attrs.email ?? "",
    role: (attrs["custom:role"] as "student" | "admin") ?? "student",
    bio: attrs["custom:bio"] ?? undefined,
    photoUrl: attrs.picture ?? undefined,
  };
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // true while checking session
  const navigate = useNavigate();

  // Restore session on app load + listen for OAuth redirect completion
  useEffect(() => {
    (async () => {
      try {
        const user = await buildCurrentUser();
        setCurrentUser(user);
      } catch {
        // Do not call setCurrentUser(null) here — currentUser is already null
        // by default, and calling it can wipe a user that the Hub listener
        // set concurrently during the OAuth code-exchange flow.
      } finally {
        setIsLoading(false);
      }
    })();

    // Hub listener — fires after Google OAuth redirect completes (BUG-10 fix).
    // We both set the user AND navigate here so the app reliably lands on the
    // correct route regardless of which page is mounted at callback time.
    const unsubscribe = Hub.listen("auth", async ({ payload }) => {
      if (payload.event === "signInWithRedirect") {
        try {
          const user = await buildCurrentUser();
          setCurrentUser(user);
          navigate(user.role === "admin" ? "/admin" : "/home", {
            replace: true,
          });
        } catch {
          // token exchange failed — stay on current page
        }
      }
      if (payload.event === "signInWithRedirect_failure") {
        console.error("Google sign-in failed:", payload.data);
        navigate("/login", { replace: true });
      }
    });

    return unsubscribe;
  }, [navigate]);

  // ── signIn ────────────────────────────────────────────────────────────────
  const handleSignIn = useCallback(
    async (email: string, password: string): Promise<User> => {
      // Clear any stale Amplify session before signing in
      try {
        await signOut();
      } catch {
        // ignore — no existing session is fine
      }
      const result = await signIn({
        username: email.trim(),
        password,
      });
      if (!result.isSignedIn) {
        throw new Error(
          "Sign-in requires additional verification. Please check your email or contact support.",
        );
      }
      const user = await buildCurrentUser();
      setCurrentUser(user);
      return user;
    },
    [],
  );

  // ── signUp ────────────────────────────────────────────────────────────────
  const handleSignUp = useCallback(
    async (email: string, password: string, name: string) => {
      await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            name,
            "custom:role": "student",
          },
        },
      });
      // Don't set currentUser here — user must verify email first
    },
    [],
  );

  // ── confirmSignUp ─────────────────────────────────────────────────────────
  const handleConfirmSignUp = useCallback(
    async (email: string, code: string) => {
      await confirmSignUp({ username: email, confirmationCode: code });
    },
    [],
  );

  // ── resendCode ────────────────────────────────────────────────────────────
  const handleResendCode = useCallback(async (email: string) => {
    await resendSignUpCode({ username: email });
  }, []);

  // ── signOut ───────────────────────────────────────────────────────────────
  const handleSignOut = useCallback(async () => {
    await signOut();
    setCurrentUser(null);
  }, []);

  // ── refreshUser ───────────────────────────────────────────────────────────
  const handleRefreshUser = useCallback(async () => {
    try {
      const user = await buildCurrentUser();
      setCurrentUser(user);
    } catch {
      // Session expired — leave currentUser as-is
    }
  }, []);

  const value: AuthContextType = {
    currentUser,
    isAuthenticated: currentUser !== null,
    isAdmin: currentUser?.role === "admin",
    isLoading,
    signIn: handleSignIn,
    signInWithGoogle: async () => {
      // Wipe all stale Amplify/Cognito PKCE state (localStorage + sessionStorage)
      // and any partial Cognito session before starting a fresh OAuth flow.
      clearAmplifyOAuthState();
      try {
        await signOut();
      } catch {
        // no existing session — that's fine
      }
      try {
        await signInWithRedirect({ provider: "Google" });
      } catch (err) {
        // BUG-08 fix: Amplify throws UserAlreadyAuthenticatedException when a
        // valid session exists. Instead of silently failing, restore the user
        // and navigate directly — no need for another OAuth round-trip.
        if (
          (err as { name?: string }).name ===
          "UserAlreadyAuthenticatedException"
        ) {
          const user = await buildCurrentUser();
          setCurrentUser(user);
          navigate(user.role === "admin" ? "/admin" : "/home", {
            replace: true,
          });
          return;
        }
        throw err;
      }
    },
    signUp: handleSignUp,
    confirmSignUp: handleConfirmSignUp,
    resendCode: handleResendCode,
    signOut: handleSignOut,
    refreshUser: handleRefreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
