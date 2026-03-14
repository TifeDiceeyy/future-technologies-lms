import { useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function OnboardingComplete() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
      {/* Progress — all filled */}
      <div className="flex items-center gap-2 mb-10">
        {[1, 2, 3].map((step) => (
          <div
            key={step}
            className="h-1 rounded-full"
            style={{ width: "2rem", backgroundColor: "#6366F1" }}
          />
        ))}
      </div>

      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
        style={{ backgroundColor: "#10B98120", border: "2px solid #10B981" }}
      >
        <CheckCircle2 size={36} style={{ color: "#10B981" }} />
      </div>

      <h1
        className="text-2xl md:text-3xl font-bold mb-3"
        style={{ color: "var(--bauhaus-card-inscription-main)" }}
      >
        You're all set!
      </h1>
      <p
        className="text-sm leading-relaxed max-w-sm mb-10"
        style={{ color: "var(--bauhaus-card-inscription-sub)" }}
      >
        Your personalised learning path is ready. Let's start learning.
      </p>

      <button
        onClick={() => {
          localStorage.setItem("mindcampus_onboarding_done", "true");
          navigate("/login", {
            state: { message: "Email verified! Please sign in." },
          });
        }}
        className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
        style={{ backgroundColor: "#6366F1", color: "#fff" }}
      >
        Go to dashboard <ArrowRight size={16} />
      </button>
    </div>
  );
}
