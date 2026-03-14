import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { updateUserAttributes } from "aws-amplify/auth";

const INTERESTS = [
  { id: "cloud", label: "☁️ Cloud Computing", color: "#6366F1" },
  { id: "frontend", label: "🖥️ Frontend Dev", color: "#10B981" },
  { id: "data", label: "📊 Data Science", color: "#F59E0B" },
  { id: "devops", label: "⚙️ DevOps & CI/CD", color: "#06B6D4" },
  { id: "ai", label: "🤖 AI & Machine Learning", color: "#EC4899" },
  { id: "backend", label: "🔧 Backend Dev", color: "#EF4444" },
  { id: "security", label: "🔒 Cybersecurity", color: "#8B5CF6" },
  { id: "mobile", label: "📱 Mobile Dev", color: "#F97316" },
];

export default function OnboardingInterests() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  async function handleContinue() {
    setSaving(true);
    try {
      await updateUserAttributes({
        userAttributes: {
          "custom:interests": JSON.stringify([...selected]),
        },
      });
    } catch {
      // Non-fatal — Cognito attribute may not be configured yet; continue anyway
    }
    setSaving(false);
    navigate("/onboarding/goals");
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
              width: step <= 1 ? "2rem" : "0.5rem",
              backgroundColor:
                step === 1
                  ? "#6366F1"
                  : step === 2
                    ? "#6366F180"
                    : "var(--bauhaus-card-separator)",
            }}
          />
        ))}
      </div>

      <h1
        className="text-2xl font-bold mb-2"
        style={{ color: "var(--bauhaus-card-inscription-main)" }}
      >
        What interests you?
      </h1>
      <p
        className="text-sm mb-8"
        style={{ color: "var(--bauhaus-card-inscription-sub)" }}
      >
        Select at least one topic to personalise your feed.
      </p>

      <div className="flex flex-wrap gap-2 mb-10">
        {INTERESTS.map(({ id, label, color }) => {
          const active = selected.has(id);
          return (
            <button
              key={id}
              onClick={() => toggle(id)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-90"
              style={
                active
                  ? {
                      backgroundColor: `${color}22`,
                      border: `1px solid ${color}55`,
                      color,
                    }
                  : {
                      backgroundColor: "var(--bauhaus-card-bg)",
                      border: "1px solid var(--bauhaus-card-separator)",
                      color: "var(--bauhaus-card-inscription-sub)",
                    }
              }
            >
              {label}
            </button>
          );
        })}
      </div>

      <button
        onClick={handleContinue}
        disabled={selected.size === 0 || saving}
        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-sm transition-all"
        style={
          selected.size > 0 && !saving
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
