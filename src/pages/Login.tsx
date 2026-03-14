import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, Eye, EyeOff, Sparkles } from "lucide-react";
import {
  signIn as amplifySignIn,
  confirmSignIn,
  signOut as amplifySignOut,
} from "aws-amplify/auth";
import { useAuth } from "@/store/AuthContext";
import { clearAmplifyOAuthState } from "@/utils/auth";

function GoogleButton({ label }: { label: string }) {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    setLoading(true);
    setError("");
    try {
      await signInWithGoogle();
      // Navigation is handled inside AuthContext (Hub listener for fresh OAuth,
      // direct navigate for UserAlreadyAuthenticatedException). This component
      // will unmount as the route changes, so no need to reset loading here.
    } catch (err) {
      console.error("Google sign-in error:", err);
      setError("Google sign-in failed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="w-full h-12 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/5 flex items-center justify-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors disabled:opacity-60"
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
              fill="#4285F4"
            />
            <path
              d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
              fill="#34A853"
            />
            <path
              d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
              fill="#FBBC05"
            />
            <path
              d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"
              fill="#EA4335"
            />
          </svg>
        )}
        {loading ? "Redirecting…" : label}
      </button>
      {error && (
        <p className="text-sm text-orange-400 text-center mt-2">{error}</p>
      )}
    </div>
  );
}

// Map Cognito error codes to human-readable messages
function friendlyError(err: unknown): string {
  if (!(err instanceof Error)) return "Something went wrong. Please try again.";
  const msg = err.message;
  if (msg.includes("UserNotConfirmedException"))
    return "Your email isn't verified yet. Check your inbox for the confirmation code.";
  if (msg.includes("NotAuthorizedException"))
    return "Incorrect email or password.";
  if (msg.includes("UserNotFoundException"))
    return "No account found with that email.";
  if (msg.includes("TooManyRequestsException"))
    return "Too many attempts. Please wait a moment and try again.";
  if (
    msg.includes("NotAuthorizedException") ||
    msg.includes("not enabled") ||
    msg.includes("NotEnabled")
  )
    return "Incorrect email or password.";
  return msg;
}

// ─── Magic Link Flow ───────────────────────────────────────────────────────────

type MagicStep = "idle" | "email" | "otp";

function MagicLinkPanel({
  onSuccess,
  onBack,
}: {
  onSuccess: () => void;
  onBack: () => void;
}) {
  const [step, setStep] = useState<MagicStep>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function sendCode(targetEmail: string) {
    const result = await amplifySignIn({
      username: targetEmail,
      options: { authFlowType: "CUSTOM_WITHOUT_SRP" },
    });
    if (
      result.nextStep.signInStep === "CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE"
    ) {
      return true;
    } else if (result.isSignedIn) {
      onSuccess();
      return false;
    }
    throw new Error(
      "Unexpected response. Please try email + password instead.",
    );
  }

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      // Clear any stale session first
      try {
        await amplifySignOut();
      } catch {
        /* ignore */
      }
      await sendCode(email.trim());
      setSent(true);
      setStep("otp");
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setResending(true);
    setError("");
    setOtp("");
    try {
      await sendCode(email.trim());
      setSent(true);
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setResending(false);
    }
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    if (!otp.trim()) {
      setError("Please enter the code.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const result = await confirmSignIn({ challengeResponse: otp.trim() });
      if (result.isSignedIn) {
        onSuccess();
      } else {
        setError("Code not accepted. Please try again.");
      }
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-2 rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Sparkles size={16} className="text-primary" />
        <span className="text-sm font-semibold text-foreground">
          {step === "email" ? "Sign in with magic link" : "Enter your code"}
        </span>
      </div>

      {step === "email" ? (
        <form onSubmit={handleSendCode} className="space-y-3">
          <p className="text-xs text-muted-foreground">
            We'll send a one-time code to your email — no password needed.
          </p>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
            className="w-full h-11 bg-muted/50 border border-border rounded-xl px-4 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-colors"
          />
          {error && <p className="text-xs text-orange-400">{error}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onBack}
              className="h-10 px-4 rounded-xl text-sm text-muted-foreground hover:text-foreground border border-border hover:border-border/80 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 h-10 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {loading ? "Sending…" : "Send code"}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleVerifyCode} className="space-y-3">
          <p className="text-xs text-muted-foreground">
            A 6-digit code was sent to{" "}
            <span className="text-foreground font-medium">{email}</span>.
            {sent && " Check your inbox and spam folder."}
          </p>
          <input
            type="text"
            inputMode="numeric"
            placeholder="000000"
            maxLength={8}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            autoFocus
            className="w-full h-11 bg-muted/50 border border-border rounded-xl px-4 text-foreground text-sm tracking-[0.3em] placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-colors"
          />
          {error && <p className="text-xs text-orange-400">{error}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setStep("email");
                setOtp("");
                setError("");
              }}
              className="h-10 px-4 rounded-xl text-sm text-muted-foreground hover:text-foreground border border-border hover:border-border/80 transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="h-10 px-4 rounded-xl text-sm text-muted-foreground hover:text-foreground border border-border transition-colors disabled:opacity-60 flex items-center gap-1.5"
            >
              {resending && (
                <span className="w-3 h-3 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" />
              )}
              {resending ? "Sending…" : "Resend"}
            </button>
            <button
              type="submit"
              disabled={loading || otp.length < 6}
              className="flex-1 h-10 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {loading ? "Verifying…" : "Verify code"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

// ─── Main Login Page ───────────────────────────────────────────────────────────

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, refreshUser } = useAuth();

  // On every mount (back-press or page refresh), wipe any stale Amplify
  // OAuth PKCE state UNLESS we're landing here as the OAuth callback return
  // (Cognito redirects back with ?code=...&state=... after successful Google auth).
  useEffect(() => {
    const isOAuthCallback = new URLSearchParams(window.location.search).has(
      "code",
    );
    if (!isOAuthCallback) {
      clearAmplifyOAuthState();
      amplifySignOut().catch(() => {});
    }
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showMagic, setShowMagic] = useState(false);

  // Success message passed from VerifyEmail or ForgotPassword
  const successMsg = (location.state as { message?: string })?.message ?? "";
  const isActive =
    form.email.trim().length > 0 && form.password.trim().length > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      const user = await signIn(form.email, form.password);
      if (user.role === "admin") {
        navigate("/admin", { replace: true });
        return;
      }
      navigate("/home", { replace: true });
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleMagicSuccess() {
    await refreshUser();
    // refreshUser sets currentUser; read role from the updated context
    // We can't read it synchronously — navigate to /home and let ProtectedRoute redirect admins
    navigate("/home", { replace: true });
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Back arrow */}
      <div className="p-4 md:p-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Go back"
        >
          <ChevronLeft size={22} />
        </button>
      </div>

      {/* Form area */}
      <div className="flex-1 flex items-start md:items-center justify-center px-6 pb-12 pt-4">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-foreground mb-2">Log in</h1>
          <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
            Enter your email and password that are related to your account.
          </p>

          {/* Success message from verify / forgot password flow */}
          {successMsg && (
            <div className="mb-5 px-4 py-3 rounded-xl text-sm bg-green-500/10 border border-green-500/20 text-green-400">
              {successMsg}
            </div>
          )}

          <GoogleButton label="Continue with Google" />

          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label
                htmlFor="login-email"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Email
              </label>
              <input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full h-12 bg-muted/50 border border-border rounded-xl px-4 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="login-password"
                  className="text-sm font-medium text-foreground"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="w-full h-12 bg-muted/50 border border-border rounded-xl px-4 pr-11 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div
                role="alert"
                aria-live="polite"
                className="px-4 py-3 rounded-xl text-sm bg-orange-500/10 border border-orange-500/20 text-orange-400"
              >
                {error}
              </div>
            )}

            {/* Submit — gray when inactive, indigo when active */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full h-12 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 mt-2 ${
                isActive && !loading
                  ? "bg-primary text-white hover:bg-primary/90 shadow-sm shadow-primary/20"
                  : "bg-muted text-muted-foreground cursor-not-allowed opacity-70"
              }`}
            >
              {loading && (
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              )}
              {loading ? "Signing in…" : "Log in"}
            </button>
          </form>

          {/* Magic link */}
          {!showMagic ? (
            <button
              type="button"
              onClick={() => setShowMagic(true)}
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors mt-4 py-2 flex items-center justify-center gap-1.5"
            >
              <Sparkles size={14} />
              Continue with magic link
            </button>
          ) : (
            <div className="mt-4">
              <MagicLinkPanel
                onSuccess={handleMagicSuccess}
                onBack={() => setShowMagic(false)}
              />
            </div>
          )}

          <p className="text-center text-muted-foreground text-sm mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Create one
            </Link>
          </p>

          <p className="text-center text-muted-foreground text-sm mt-3">
            Are you an admin?{" "}
            <Link
              to="/admin-signup"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Admin login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
