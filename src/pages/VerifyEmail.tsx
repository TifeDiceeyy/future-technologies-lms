import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShieldCheck, RotateCcw, ChevronLeft } from "lucide-react";
import { useAuth } from "../store/AuthContext";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { confirmSignUp, resendCode } = useAuth();

  // Email / flags may be passed via navigate('/verify', { state: { email, fromAdminSignup } })
  const locationState = location.state as {
    email?: string;
    fromAdminSignup?: boolean;
  } | null;
  const [email, setEmail] = useState<string>(locationState?.email ?? "");
  const fromAdminSignup = locationState?.fromAdminSignup ?? false;
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [resendMsg, setResendMsg] = useState("");

  const isActive = code.length === 6;

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !code) {
      setError("Please enter your email and the 6-digit code.");
      return;
    }
    setLoading(true);
    try {
      await confirmSignUp(email, code);
      if (fromAdminSignup) {
        // Teacher/admin signup — skip student onboarding, go to admin login
        navigate("/admin-signup", {
          state: {
            message: "Email verified! Please sign in to your teacher account.",
          },
        });
      } else {
        // First-time students go through onboarding; returning users go to login
        const onboardingDone = localStorage.getItem(
          "mindcampus_onboarding_done",
        );
        if (!onboardingDone) {
          navigate("/onboarding/start");
        } else {
          navigate("/login", {
            state: { message: "Email verified! Please sign in." },
          });
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Verification failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setResendMsg("");
    setError("");
    if (!email) {
      setError("Please enter your email address first.");
      return;
    }
    setResending(true);
    try {
      await resendCode(email);
      setResendMsg("Code resent — check your inbox.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not resend code.";
      setError(msg);
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Back arrow */}
      <div className="p-4 md:p-6">
        <button
          onClick={() => navigate(fromAdminSignup ? "/admin-signup" : "/login")}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Back to sign in"
        >
          <ChevronLeft size={22} />
        </button>
      </div>

      {/* Form area */}
      <div className="flex-1 flex items-start md:items-center justify-center px-6 pb-12 pt-4">
        <div className="w-full max-w-md">
          {/* Icon */}
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
            <ShieldCheck size={22} className="text-primary" />
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-2">
            Verify your email
          </h1>
          <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
            We sent a 6-digit code to{" "}
            {email ? (
              <span className="text-foreground font-medium">{email}</span>
            ) : (
              "your email address"
            )}
            . Enter it below.
          </p>

          <form onSubmit={handleVerify} className="space-y-4">
            {/* Email field — only shown if not passed via state */}
            {!locationState?.email && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full h-12 bg-muted/50 border border-border rounded-xl px-4 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-colors"
                />
              </div>
            )}

            {/* Code field */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Confirmation code
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

            {/* Error / success messages */}
            {error && (
              <div
                role="alert"
                aria-live="polite"
                className="px-4 py-3 rounded-xl text-sm bg-orange-500/10 border border-orange-500/20 text-orange-400"
              >
                {error}
              </div>
            )}
            {resendMsg && (
              <div className="px-4 py-3 rounded-xl text-sm bg-green-500/10 border border-green-500/20 text-green-400">
                {resendMsg}
              </div>
            )}

            {/* Verify button — gray until code is 6 digits */}
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
              {loading ? "Verifying…" : "Verify email"}
            </button>
          </form>

          {/* Resend code */}
          <button
            onClick={handleResend}
            disabled={resending}
            className="w-full flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mt-4 py-2"
          >
            <RotateCcw size={14} />
            {resending ? "Sending…" : "Resend code"}
          </button>
        </div>
      </div>
    </div>
  );
}
