import { useNavigate } from "react-router-dom";
import { ChevronLeft, Zap, Globe, Shield, Users, Mail, Github } from "lucide-react";

const CARD_STYLE = {
  backgroundColor: "var(--bauhaus-card-bg)",
  border: "1px solid var(--bauhaus-card-separator)",
};

const TEAM = [
  { name: "Sarah Chen", role: "Lead Instructor — Cloud", accentColor: "#6366F1" },
  { name: "James Okafor", role: "Lead Instructor — Frontend", accentColor: "#10B981" },
  { name: "Aisha Patel", role: "Lead Instructor — Data Science", accentColor: "#F59E0B" },
  { name: "Marcus Webb", role: "Lead Instructor — DevOps", accentColor: "#06B6D4" },
];

const VALUES = [
  {
    icon: Globe,
    title: "Learn Anywhere",
    desc: "Access your courses from any device, at any time.",
    color: "#6366F1",
  },
  {
    icon: Shield,
    title: "AWS-Aligned",
    desc: "Curriculum built around real AWS certifications and deployments.",
    color: "#10B981",
  },
  {
    icon: Users,
    title: "Community First",
    desc: "A supportive cohort of learners growing together.",
    color: "#F59E0B",
  },
];

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="p-4 md:p-8 max-w-3xl">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ChevronLeft size={20} />
        <span className="text-sm">Back</span>
      </button>

      {/* Hero */}
      <div
        className="rounded-2xl p-8 mb-8 text-center relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #6366F120, #06B6D420)",
          border: "1px solid #6366F133",
        }}
      >
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 30% 50%, #6366F1, transparent 60%), radial-gradient(circle at 70% 50%, #06B6D4, transparent 60%)",
          }}
        />
        <div className="relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent-foreground flex items-center justify-center mx-auto mb-4">
            <Zap size={26} className="text-white" fill="white" />
          </div>
          <h1
            className="text-2xl md:text-3xl font-bold mb-2"
            style={{ color: "var(--bauhaus-card-inscription-main)" }}
          >
            Future Technologies
          </h1>
          <p
            className="text-sm leading-relaxed max-w-md mx-auto"
            style={{ color: "var(--bauhaus-card-inscription-sub)" }}
          >
            Your gateway to the innovations. We build the next generation of
            cloud and software engineers through hands-on, production-grade
            learning.
          </p>
        </div>
      </div>

      {/* Values */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {VALUES.map(({ icon: Icon, title, desc, color }) => (
          <div key={title} className="rounded-xl p-5" style={CARD_STYLE}>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{
                backgroundColor: `${color}20`,
                border: `1px solid ${color}33`,
              }}
            >
              <Icon size={18} style={{ color }} />
            </div>
            <p
              className="text-sm font-semibold mb-1"
              style={{ color: "var(--bauhaus-card-inscription-main)" }}
            >
              {title}
            </p>
            <p
              className="text-xs leading-relaxed"
              style={{ color: "var(--bauhaus-card-inscription-sub)" }}
            >
              {desc}
            </p>
          </div>
        ))}
      </div>

      {/* Team */}
      <div className="mb-10">
        <h2
          className="font-semibold mb-4"
          style={{ color: "var(--bauhaus-card-inscription-main)" }}
        >
          Our Instructors
        </h2>
        <div className="space-y-3">
          {TEAM.map(({ name, role, accentColor }) => (
            <div
              key={name}
              className="flex items-center gap-4 p-4 rounded-xl"
              style={CARD_STYLE}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}40, ${accentColor}20)`,
                  border: `1px solid ${accentColor}33`,
                }}
              >
                <span
                  className="text-sm font-bold"
                  style={{ color: accentColor }}
                >
                  {name.charAt(0)}
                </span>
              </div>
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--bauhaus-card-inscription-main)" }}
                >
                  {name}
                </p>
                <p
                  className="text-xs"
                  style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                >
                  {role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="rounded-xl p-6" style={CARD_STYLE}>
        <h2
          className="font-semibold mb-4"
          style={{ color: "var(--bauhaus-card-inscription-main)" }}
        >
          Get in touch
        </h2>
        <div className="space-y-3">
          <a
            href="mailto:hello@futuretechnologies.io"
            className="flex items-center gap-3 text-sm hover:opacity-70 transition-opacity"
            style={{ color: "var(--bauhaus-card-inscription-sub)" }}
          >
            <Mail size={16} />
            hello@futuretechnologies.io
          </a>
          <a
            href="https://github.com/TifeDiceeyy"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-sm hover:opacity-70 transition-opacity"
            style={{ color: "var(--bauhaus-card-inscription-sub)" }}
          >
            <Github size={16} />
            github.com/TifeDiceeyy
          </a>
        </div>
      </div>

      <p
        className="text-center text-xs mt-8"
        style={{ color: "var(--bauhaus-card-inscription-sub)", opacity: 0.6 }}
      >
        © 2026 Future Technologies · Built on AWS
      </p>
    </div>
  );
}
