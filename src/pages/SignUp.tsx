import { useState } from "react";
import { Link } from "react-router-dom";
import { Zap, Eye, EyeOff, Mail, Lock, User, Check } from "lucide-react";

const plans = [
  {
    id: "free",
    label: "Free",
    price: "$0/mo",
    perks: ["5 courses", "Community access", "Basic progress tracking"],
  },
  {
    id: "pro",
    label: "Pro",
    price: "$12/mo",
    perks: [
      "Unlimited courses",
      "Certificates",
      "Priority support",
      "Offline access",
    ],
  },
];

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-8 py-12">
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent-foreground flex items-center justify-center">
            <Zap size={18} className="text-white" fill="white" />
          </div>
          <span className="font-bold text-foreground text-lg">
            Future Technologies
          </span>
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-2">
          Get started for free
        </h1>
        <p className="text-muted-foreground mb-8">
          Choose your plan and start learning today.
        </p>

        {/* Plan selector */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {plans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`text-left p-4 rounded-xl border transition-all ${
                selectedPlan === plan.id
                  ? "border-primary bg-primary/10 shadow-sm"
                  : "border-border bg-card hover:border-border/80"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-foreground font-semibold text-sm">
                  {plan.label}
                </span>
                {selectedPlan === plan.id && (
                  <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                    <Check size={10} className="text-white" />
                  </div>
                )}
              </div>
              <p className="text-primary font-bold text-lg mb-3">
                {plan.price}
              </p>
              <ul className="space-y-1">
                {plan.perks.map((perk) => (
                  <li
                    key={perk}
                    className="text-muted-foreground text-xs flex items-center gap-1.5"
                  >
                    <Check
                      size={10}
                      className="text-accent-foreground flex-shrink-0"
                    />
                    {perk}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
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
                placeholder="Tife Abayomi"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-3 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-colors"
              />
            </div>
          </div>

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
            <label className="block text-foreground text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
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
            className="w-full bg-primary hover:bg-primary/80 text-white font-semibold py-3 rounded-xl transition-all shadow-sm mt-2"
          >
            Create Account — {selectedPlan === "free" ? "Free" : "$12/mo"}
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
  );
}
