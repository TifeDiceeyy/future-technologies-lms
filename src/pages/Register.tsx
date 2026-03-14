import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import { signOut as amplifySignOut } from "aws-amplify/auth";
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
      // Navigation handled inside AuthContext — component unmounts on success.
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

// Validate password against Cognito default policy
function validatePassword(pw: string): string {
  if (!pw.trim()) return "Password cannot be blank.";
  if (pw.length < 8) return "Password must be at least 8 characters.";
  if (!/[a-z]/.test(pw))
    return "Password must contain at least one lowercase letter.";
  if (!/[A-Z]/.test(pw))
    return "Password must contain at least one uppercase letter.";
  if (!/[0-9]/.test(pw)) return "Password must contain at least one number.";
  return "";
}

function friendlyError(err: unknown): string {
  if (!(err instanceof Error)) return "Something went wrong. Please try again.";
  const msg = err.message;
  if (msg.includes("UsernameExistsException"))
    return "An account with that email already exists.";
  if (msg.includes("InvalidPasswordException"))
    return "Password doesn't meet requirements: min 8 chars, 1 uppercase, 1 number.";
  if (msg.includes("InvalidParameterException"))
    return "Please check your details and try again.";
  return msg;
}

export default function Register() {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  // Wipe stale Amplify OAuth state on every mount (back-press or refresh)
  // unless this is the OAuth callback return (URL has ?code=).
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
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isActive =
    form.name.trim().length > 0 &&
    form.email.trim().length > 0 &&
    form.password.length > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    const pwError = validatePassword(form.password);
    if (pwError) {
      setError(pwError);
      return;
    }

    setLoading(true);
    try {
      await signUp(form.email, form.password, form.name);
      // Pass email to verify page so user doesn't have to re-enter it
      navigate("/verify", { state: { email: form.email } });
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Back arrow */}
      <div className="p-4 md:p-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Go back"
        >
          <ChevronLeft size={22} />
        </button>
      </div>

      {/* Form area */}
      <div className="flex-1 flex items-start md:items-center justify-center px-6 pb-12 pt-4">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Create account
          </h1>
          <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
            Join thousands of students learning the future. It's free to get
            started.
          </p>

          <GoogleButton label="Continue with Google" />

          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div>
              <label
                htmlFor="reg-name"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Full Name
              </label>
              <input
                id="reg-name"
                type="text"
                placeholder="Tife Abayomi"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full h-12 bg-muted/50 border border-border rounded-xl px-4 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-colors"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="reg-email"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Email
              </label>
              <input
                id="reg-email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full h-12 bg-muted/50 border border-border rounded-xl px-4 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="reg-password"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Password
              </label>
              <p className="text-xs text-muted-foreground mb-2">
                Min 8 characters · 1 uppercase · 1 number
              </p>
              <div className="relative">
                <input
                  id="reg-password"
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
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="text-center text-muted-foreground text-sm mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
