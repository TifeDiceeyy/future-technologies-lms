import { useNavigate } from "react-router-dom";
import { Zap, ArrowRight } from "lucide-react";

export default function OnboardingStart() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent-foreground flex items-center justify-center mb-6">
        <Zap size={30} className="text-white" fill="white" />
      </div>

      <h1
        className="text-2xl md:text-3xl font-bold mb-3"
        style={{ color: "var(--bauhaus-card-inscription-main)" }}
      >
        Welcome to Future Technologies
      </h1>
      <p
        className="text-sm leading-relaxed max-w-sm mb-10"
        style={{ color: "var(--bauhaus-card-inscription-sub)" }}
      >
        Let's personalise your learning experience. It only takes a moment.
      </p>

      {/* Step indicators */}
      <div className="flex items-center gap-2 mb-10">
        {[1, 2, 3].map((step) => (
          <div
            key={step}
            className="h-1 rounded-full transition-all"
            style={{
              width: step === 1 ? "2rem" : "0.5rem",
              backgroundColor: step === 1 ? "#6366F1" : "var(--bauhaus-card-separator)",
            }}
          />
        ))}
      </div>

      <button
        onClick={() => navigate("/onboarding/interests")}
        className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90 shadow-sm"
        style={{ backgroundColor: "#6366F1", color: "#fff" }}
      >
        Get started <ArrowRight size={16} />
      </button>
    </div>
  );
}
