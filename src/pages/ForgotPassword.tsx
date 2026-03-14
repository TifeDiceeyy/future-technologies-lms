import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound, ChevronLeft } from "lucide-react";
import { resetPassword, confirmResetPassword } from "aws-amplify/auth";

type Step = "request" | "confirm";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isStep1Active = email.trim().length > 0;
  const isStep2Active = code.length === 6 && newPassword.length >= 8;

  // Step 1 — request a reset code
  async function handleRequestCode(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    setLoading(true);
    try {
      await resetPassword({ username: email });
      setStep("confirm");
    } catch (err: unknown) {
      const e = err as { name?: string };
      if (e.name === "TooManyRequestsException") {
        setError("Too many attempts. Please wait before trying again.");
      } else if (e.name === "InvalidParameterException") {
        setError("Please enter a valid email address.");
      } else {
        setError(
          "If this email is registered, you will receive a reset link shortly. Check your inbox and spam folder.",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  // Step 2 — submit code + new password
  async function handleConfirmReset(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!code || !newPassword) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword,
      });
      navigate("/login", {
        state: { message: "Password reset! Please sign in." },
      });
    } catch (err: unknown) {
      const e = err as { name?: string; message?: string };
      if (e.name === "TooManyRequestsException") {
        setError("Too many attempts. Please wait before trying again.");
      } else if (e.name === "ExpiredCodeException") {
        setError("Reset code has expired. Please request a new one.");
      } else if (e.name === "CodeMismatchException") {
        setError("Incorrect code. Please check and try again.");
      } else {
        setError(e.message || "Failed to reset password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Back arrow */}
      <div className="p-4 md:p-6">
        <button
          onClick={() =>
            step === "confirm" ? setStep("request") : navigate("/login")
          }
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Go back"
        >
          <ChevronLeft size={22} />
        </button>
      </div>

      {/* Form area */}
      <div className="flex-1 flex items-start md:items-center justify-center px-6 pb-12 pt-4">
        <div className="w-full max-w-md">
          {/* Icon */}
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
            <KeyRound size={22} className="text-primary" />
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-2">
            {step === "request" ? "Forgot password?" : "Reset your password"}
          </h1>
          <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
            {step === "request"
              ? "Enter your email and we'll send you a reset code."
              : `Enter the code sent to ${email} and choose a new password.`}
          </p>

          {/* ── Step 1: email ───────────────────────────────────────── */}
          {step === "request" && (
            <form onSubmit={handleRequestCode} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full h-12 bg-muted/50 border border-border rounded-xl px-4 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-colors"
                />
              </div>

              {error && (
                <div
                  role="alert"
                  aria-live="polite"
                  className="px-4 py-3 rounded-xl text-sm bg-orange-500/10 border border-orange-500/20 text-orange-400"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full h-12 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 mt-2 ${
                  isStep1Active && !loading
                    ? "bg-primary text-white hover:bg-primary/90 shadow-sm shadow-primary/20"
                    : "bg-muted text-muted-foreground cursor-not-allowed opacity-70"
                }`}
              >
                {loading && (
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                )}
                {loading ? "Sending…" : "Send reset code"}
              </button>
            </form>
          )}

          {/* ── Step 2: code + new password ────────────────────────── */}
          {step === "confirm" && (
            <form onSubmit={handleConfirmReset} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Reset code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) =>
                    setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="123456"
                  maxLength={6}
                  className="w-full h-12 bg-muted/50 border border-border rounded-xl px-4 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-colors tracking-[0.4em] text-center font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  New password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 8 chars, 1 uppercase, 1 number"
                  className="w-full h-12 bg-muted/50 border border-border rounded-xl px-4 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-colors"
                />
              </div>

              {error && (
                <div
                  role="alert"
                  aria-live="polite"
                  className="px-4 py-3 rounded-xl text-sm bg-orange-500/10 border border-orange-500/20 text-orange-400"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full h-12 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 mt-2 ${
                  isStep2Active && !loading
                    ? "bg-primary text-white hover:bg-primary/90 shadow-sm shadow-primary/20"
                    : "bg-muted text-muted-foreground cursor-not-allowed opacity-70"
                }`}
              >
                {loading && (
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                )}
                {loading ? "Resetting…" : "Reset password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
