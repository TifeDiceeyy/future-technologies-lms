// ─── src/pages/AdminSignUp.tsx ───────────────
// PURPOSE: Teacher / Admin signup and login page
// ROUTES TO: /admin on success
// PUBLIC: No auth required

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Zap,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  KeyRound,
} from "lucide-react";
import {
  signUp,
  signIn as amplifySignIn,
  confirmSignIn,
  signOut as amplifySignOut,
} from "aws-amplify/auth";
import { useAuth } from "@/store/AuthContext";

// ─── Google button ────────────────────────────────────────────────────────────
// ─── Magic link panel ─────────────────────────────────────────────────────────
type MagicStep = "email" | "otp";

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
      "Unexpected response. Please use email + password instead.",
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
      setError(err instanceof Error ? err.message : "Failed to send code.");
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
      setError(err instanceof Error ? err.message : "Failed to resend code.");
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
      setError(err instanceof Error ? err.message : "Verification failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-2 rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-4">
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
            placeholder="teacher@school.com"
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
              className="h-10 px-4 rounded-xl text-sm text-muted-foreground hover:text-foreground border border-border transition-colors"
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
              className="h-10 px-4 rounded-xl text-sm text-muted-foreground hover:text-foreground border border-border transition-colors"
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

// ─── Main component ───────────────────────────────────────────────────────────
export default function AdminSignUp() {
  const navigate = useNavigate();
  const location = useLocation();
  const successMsg = (location.state as { message?: string })?.message ?? "";
  const { signIn: authSignIn, signOut, refreshUser } = useAuth();
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showMagic, setShowMagic] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    accessCode: "",
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const isFormValid =
    mode === "signup"
      ? form.name.trim() &&
        form.email.trim() &&
        form.password.trim() &&
        form.accessCode.trim()
      : form.email.trim() && form.password.trim();

  function friendlyError(err: unknown): string {
    if (!(err instanceof Error))
      return "Something went wrong. Please try again.";
    const msg = err.message;
    if (msg.includes("UsernameExistsException"))
      return "An account with this email already exists. Try logging in.";
    if (msg.includes("NotAuthorizedException"))
      return "Incorrect email or password.";
    if (msg.includes("UserNotFoundException"))
      return "No teacher account found with this email.";
    if (msg.includes("UserNotConfirmedException"))
      return "Please verify your email before signing in.";
    if (msg.includes("InvalidPasswordException"))
      return "Password must be at least 8 characters with uppercase, lowercase, and a number.";
    return msg;
  }

  async function handleSendCode() {
    const email = form.email.trim();
    if (!email) {
      setError("Enter your email address first.");
      return;
    }
    setSendingCode(true);
    setError("");
    try {
      const res = await fetch(
        "https://lx2i5gpnc9.execute-api.us-east-1.amazonaws.com/prod/send-teacher-code",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );
      const data = await res.json();
      if (!res.ok || !data.sent)
        throw new Error(data.error ?? "Failed to send code.");
      setCodeSent(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to send code. Try again.",
      );
    } finally {
      setSendingCode(false);
    }
  }

  const handleSubmit = async () => {
    if (!isFormValid) return;
    setError("");
    setLoading(true);
    try {
      if (mode === "signup") {
        // Server-side access code verification
        const verifyRes = await fetch(
          "https://lx2i5gpnc9.execute-api.us-east-1.amazonaws.com/prod/verify-teacher-code",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              code: form.accessCode.trim(),
              email: form.email.trim(),
            }),
          },
        );
        if (!verifyRes.ok) {
          const errData = await verifyRes.json().catch(() => ({}));
          setError(
            (errData as { message?: string }).message ||
              "Invalid teacher access code. Contact your institution admin for the code.",
          );
          setLoading(false);
          return;
        }
        await signUp({
          username: form.email,
          password: form.password,
          options: {
            userAttributes: {
              email: form.email,
              name: form.name,
              "custom:role": "admin",
            },
          },
        });
        navigate("/verify", {
          state: { email: form.email, fromAdminSignup: true },
        });
      } else {
        const user = await authSignIn(form.email, form.password);
        if (user.role !== "admin") {
          await signOut();
          setError(
            "Student accounts cannot sign in here. Please use the Student Portal.",
          );
          return;
        }
        navigate("/admin", { replace: true });
      }
    } catch (err: unknown) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  };

  async function handleMagicSuccess() {
    await refreshUser();
    navigate("/admin", { replace: true });
  }

  const inputClass =
    "w-full bg-card border border-border rounded-xl pl-10 pr-4 py-3 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-colors";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 mb-10"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent-foreground flex items-center justify-center">
            <Zap size={18} className="text-white" fill="white" />
          </div>
          <span className="font-bold text-foreground text-lg">
            Future Technologies
          </span>
        </button>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-accent-foreground/10 border border-accent-foreground/20 rounded-full px-3 py-1 mb-6">
          <ShieldCheck size={14} className="text-accent-foreground" />
          <span className="text-xs font-semibold text-accent-foreground">
            Teacher / Admin Portal
          </span>
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-2">
          {mode === "signup"
            ? "Create your teacher account"
            : "Welcome back, teacher"}
        </h1>
        <p className="text-muted-foreground mb-6">
          {mode === "signup"
            ? "Sign up below — we'll send your access code to your email."
            : "Sign in to access your admin dashboard."}
        </p>

        {/* Success message from verify flow */}
        {successMsg && (
          <div className="mb-5 px-4 py-3 rounded-xl text-sm bg-green-500/10 border border-green-500/20 text-green-400">
            {successMsg}
          </div>
        )}

        {/* Mode toggle */}
        <div className="flex bg-secondary rounded-xl p-1 mb-6">
          <button
            onClick={() => {
              setMode("signup");
              setError("");
              setShowMagic(false);
            }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === "signup"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            Sign Up
          </button>
          <button
            onClick={() => {
              setMode("login");
              setError("");
              setShowMagic(false);
            }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === "login"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            Log In
          </button>
        </div>

        {/* Magic link panel (login only) */}
        {mode === "login" && showMagic && (
          <div className="mb-4">
            <MagicLinkPanel
              onSuccess={handleMagicSuccess}
              onBack={() => setShowMagic(false)}
            />
          </div>
        )}

        {/* Main form (hidden when magic link panel is open in login mode) */}
        {!(mode === "login" && showMagic) && (
          <div className="space-y-4">
            {/* Name — signup only */}
            {mode === "signup" && (
              <div>
                <label className="block text-foreground text-sm font-medium mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    type="text"
                    placeholder="Dr. Jane Smith"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                    className={inputClass}
                  />
                </div>
                {touched.name && !form.name.trim() && (
                  <p className="text-red-500 text-xs mt-1">
                    Full name is required.
                  </p>
                )}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-foreground text-sm font-medium mb-2">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="email"
                  placeholder="teacher@school.com"
                  value={form.email}
                  onChange={(e) => {
                    setForm({ ...form, email: e.target.value });
                    setCodeSent(false);
                  }}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  className={inputClass}
                />
              </div>
              {touched.email && !form.email.trim() && (
                <p className="text-red-500 text-xs mt-1">
                  Email address is required.
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-foreground text-sm font-medium">
                  Password
                </label>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  className="w-full bg-card border border-border rounded-xl pl-10 pr-11 py-3 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {touched.password && !form.password.trim() && (
                <p className="text-red-500 text-xs mt-1">
                  Password is required.
                </p>
              )}
            </div>

            {/* Teacher access code — signup only */}
            {mode === "signup" && (
              <div>
                <label className="block text-foreground text-sm font-medium mb-2">
                  Teacher Access Code
                </label>

                {/* Self-service: send code to email */}
                {!codeSent ? (
                  <div className="mb-2 flex items-center gap-2">
                    <p className="text-xs text-muted-foreground flex-1">
                      Don't have a code? We'll email it to you.
                    </p>
                    <button
                      type="button"
                      onClick={handleSendCode}
                      disabled={sendingCode || !form.email.trim()}
                      className="text-xs px-3 py-1.5 rounded-lg border border-primary/40 text-primary hover:bg-primary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 flex-shrink-0"
                    >
                      {sendingCode && (
                        <span className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                      )}
                      {sendingCode ? "Sending…" : "Send code to my email"}
                    </button>
                  </div>
                ) : (
                  <div className="mb-2 px-3 py-2 rounded-lg text-xs bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-between">
                    <span>
                      Code sent to <strong>{form.email}</strong> — check your
                      inbox.
                    </span>
                    <button
                      type="button"
                      onClick={handleSendCode}
                      disabled={sendingCode}
                      className="text-green-400/70 hover:text-green-400 underline ml-2 disabled:opacity-50"
                    >
                      Resend
                    </button>
                  </div>
                )}

                <div className="relative">
                  <KeyRound
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    type="text"
                    placeholder="Enter your 8-character code"
                    value={form.accessCode}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        accessCode: e.target.value.toUpperCase(),
                      })
                    }
                    className={inputClass}
                  />
                </div>
              </div>
            )}

            {/* Error */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading || !isFormValid}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl transition-all shadow-sm mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading
                ? "Please wait..."
                : mode === "signup"
                  ? "Create Teacher Account"
                  : "Sign In to Dashboard"}
            </button>
          </div>
        )}

        {/* Magic link toggle (login only, when form is visible) */}
        {mode === "login" && !showMagic && (
          <button
            type="button"
            onClick={() => setShowMagic(true)}
            className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors mt-4 py-2 flex items-center justify-center gap-1.5"
          >
            <Sparkles size={14} />
            Sign in with magic link
          </button>
        )}

        <p className="text-center text-muted-foreground text-sm mt-6">
          Not a teacher?{" "}
          <button
            onClick={() => navigate("/get-started")}
            className="text-primary hover:underline font-medium"
          >
            Go back
          </button>
        </p>
      </div>
    </div>
  );
}
