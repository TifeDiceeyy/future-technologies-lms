import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Award, Briefcase, TrendingUp, Star } from "lucide-react";
import { updateUserAttributes } from "aws-amplify/auth";

const GOALS = [
  {
    id: "certify",
    label: "Get certified",
    desc: "Earn an industry-recognised certificate",
    icon: Award,
    color: "#F59E0B",
  },
  {
    id: "portfolio",
    label: "Build a portfolio",
    desc: "Create real projects to show employers",
    icon: Star,
    color: "#6366F1",
  },
  {
    id: "career",
    label: "Change career",
    desc: "Transition into tech from another field",
    icon: Briefcase,
    color: "#10B981",
  },
  {
    id: "upskill",
    label: "Level up skills",
    desc: "Deepen expertise in my current role",
    icon: TrendingUp,
    color: "#06B6D4",
  },
];

export default function OnboardingGoals() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleContinue() {
    if (!selected) return;
    setSaving(true);
    try {
      await updateUserAttributes({
        userAttributes: {
          "custom:goals": selected,
        },
      });
    } catch {
      // Non-fatal — continue anyway
    }
    setSaving(false);
    navigate("/onboarding/complete");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 py-12 max-w-lg mx-auto">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-10">
        {[1, 2, 3].map((step) => (
          <div
            key={step}
            className="h-1 rounded-full transition-all"
            style={{
              width: step <= 2 ? "2rem" : "0.5rem",
              backgroundColor:
                step <= 2 ? "#6366F1" : "var(--bauhaus-card-separator)",
            }}
          />
        ))}
      </div>

      <h1
        className="text-2xl font-bold mb-2"
        style={{ color: "var(--bauhaus-card-inscription-main)" }}
      >
        What's your main goal?
      </h1>
      <p
        className="text-sm mb-8"
        style={{ color: "var(--bauhaus-card-inscription-sub)" }}
      >
        We'll tailor your learning path to match.
      </p>

      <div className="space-y-3 mb-10">
        {GOALS.map(({ id, label, desc, icon: Icon, color }) => {
          const active = selected === id;
          return (
            <button
              key={id}
              onClick={() => setSelected(id)}
              className="w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all hover:scale-[1.01]"
              style={
                active
                  ? {
                      backgroundColor: `${color}15`,
                      border: `1px solid ${color}55`,
                    }
                  : {
                      backgroundColor: "var(--bauhaus-card-bg)",
                      border: "1px solid var(--bauhaus-card-separator)",
                    }
              }
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: `${color}20`,
                  border: `1px solid ${color}33`,
                }}
              >
                <Icon size={18} style={{ color }} />
              </div>
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--bauhaus-card-inscription-main)" }}
                >
                  {label}
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                >
                  {desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={handleContinue}
        disabled={!selected || saving}
        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-sm transition-all"
        style={
          selected && !saving
            ? { backgroundColor: "#6366F1", color: "#fff" }
            : {
                backgroundColor: "var(--bauhaus-card-bg)",
                border: "1px solid var(--bauhaus-card-separator)",
                color: "var(--bauhaus-card-inscription-sub)",
              }
        }
      >
        {saving ? (
          "Saving…"
        ) : (
          <>
            Continue <ArrowRight size={16} />
          </>
        )}
      </button>
    </div>
  );
}
