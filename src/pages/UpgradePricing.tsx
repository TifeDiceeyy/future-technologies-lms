import { useNavigate } from "react-router-dom";
import { CheckCircle, Zap, Users, ArrowLeft } from "lucide-react";

const PLANS = [
  {
    name: "Pro",
    price: "$29",
    period: "per month",
    description: "For serious learners who want it all",
    color: "#7c3aed",
    icon: Zap,
    features: [
      "Unlimited paid & free courses",
      "Completion certificates",
      "Advanced progress analytics",
      "Priority support",
      "Live sessions",
      "Offline downloads",
    ],
  },
  {
    name: "Teams",
    price: "$79",
    period: "per month",
    description: "For organisations and cohorts",
    color: "#0891b2",
    icon: Users,
    features: [
      "Everything in Pro",
      "Up to 25 seats",
      "Admin dashboard",
      "Custom branding",
      "SSO / SAML",
      "Dedicated success manager",
    ],
  },
];

const CARD_STYLE = {
  backgroundColor: "var(--bauhaus-card-bg)",
  border: "1px solid var(--bauhaus-card-separator)",
};

export default function UpgradePricing() {
  const navigate = useNavigate();

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm mb-6 transition-colors hover:opacity-80"
        style={{ color: "var(--bauhaus-card-inscription-sub)" }}
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-2xl md:text-3xl font-bold mb-2"
          style={{ color: "var(--bauhaus-card-inscription-main)" }}
        >
          Upgrade Your Plan
        </h1>
        <p
          className="text-sm"
          style={{ color: "var(--bauhaus-card-inscription-sub)" }}
        >
          Unlock paid courses, certificates, and more.
        </p>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {PLANS.map((plan) => {
          const Icon = plan.icon;
          return (
            <div
              key={plan.name}
              className="rounded-2xl p-6 flex flex-col"
              style={{
                ...CARD_STYLE,
                border: `1px solid ${plan.color}44`,
              }}
            >
              {/* Plan header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: `${plan.color}20`,
                    border: `1px solid ${plan.color}40`,
                  }}
                >
                  <Icon size={18} style={{ color: plan.color }} />
                </div>
                <div>
                  <h2
                    className="font-bold text-lg leading-none"
                    style={{ color: "var(--bauhaus-card-inscription-main)" }}
                  >
                    {plan.name}
                  </h2>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                  >
                    {plan.description}
                  </p>
                </div>
              </div>

              {/* Price */}
              <div className="mb-5">
                <span
                  className="text-4xl font-bold"
                  style={{ color: "var(--bauhaus-card-inscription-main)" }}
                >
                  {plan.price}
                </span>
                <span
                  className="text-sm ml-1"
                  style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                >
                  /{plan.period}
                </span>
              </div>

              {/* Features */}
              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <CheckCircle
                      size={14}
                      style={{ color: plan.color, flexShrink: 0 }}
                    />
                    <span
                      style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={() =>
                  navigate("/checkout", {
                    state: { plan: plan.name.toLowerCase() },
                  })
                }
                className="w-full py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
                style={{ backgroundColor: plan.color, color: "#fff" }}
              >
                Get {plan.name} — Proceed to Payment
              </button>
            </div>
          );
        })}
      </div>

      {/* Free tier note */}
      <div className="rounded-xl p-4 text-center text-sm" style={CARD_STYLE}>
        <span style={{ color: "var(--bauhaus-card-inscription-sub)" }}>
          Just want free courses?{" "}
        </span>
        <button
          onClick={() => navigate("/courses")}
          className="font-medium underline underline-offset-2 transition-opacity hover:opacity-70"
          style={{ color: "var(--bauhaus-card-inscription-main)" }}
        >
          Browse free courses
        </button>
      </div>
    </div>
  );
}
