import { useState } from "react";
import { Link } from "react-router-dom";
import { Zap, Eye, EyeOff, Mail, Lock } from "lucide-react";
import { DottedSurface } from "@/components/ui/dotted-surface";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  return (
    <div className="min-h-screen bg-background flex relative">
      <DottedSurface />
      {/* Left panel — brand */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-card border-r border-border p-12 relative z-10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent-foreground/8 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent-foreground flex items-center justify-center">
            <Zap size={18} className="text-white" fill="white" />
          </div>
          <span className="font-bold text-foreground text-lg">
            Future Technologies
          </span>
        </div>

        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-foreground mb-4 leading-tight">
            Welcome back to the{" "}
            <span className="bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
              future
            </span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Continue your learning journey. Your courses, progress, and
            assignments are waiting.
          </p>
        </div>

        <p className="relative z-10 text-muted-foreground text-sm">
          © 2026 Future Technologies
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12 relative z-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent-foreground flex items-center justify-center">
              <Zap size={18} className="text-white" fill="white" />
            </div>
            <span className="font-bold text-foreground text-lg">
              Future Technologies
            </span>
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back
          </h1>
          <p className="text-muted-foreground mb-8">
            Sign in to your account to continue learning.
          </p>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
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
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-3 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-foreground text-sm font-medium">
                  Password
                </label>
                <Link
                  to="#"
                  className="text-accent-foreground text-xs hover:text-muted-foreground transition-colors"
                >
                  Forgot password?
                </Link>
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
                  className="w-full bg-card border border-border rounded-xl pl-10 pr-11 py-3 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary/80 text-white font-semibold py-3 rounded-xl transition-all shadow-sm hover:shadow-sm mt-2"
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-muted-foreground text-sm mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
