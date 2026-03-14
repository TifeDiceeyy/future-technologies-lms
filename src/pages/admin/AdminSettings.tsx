import { useState } from "react";
import {
  Settings,
  Bell,
  Shield,
  BookOpen,
  KeyRound,
  Copy,
  Check,
} from "lucide-react";
import { ChronicleButton } from "@/components/ui/chronicle-button";
import { generateTeacherCode } from "@/utils/teacherCode";

const CARD_STYLE = {
  backgroundColor: "var(--bauhaus-card-bg)",
  border: "1px solid var(--bauhaus-card-separator)",
};

const sections = [
  {
    id: "platform",
    icon: Settings,
    label: "Platform",
    fields: [
      {
        key: "platformName",
        label: "Platform Name",
        type: "text",
        placeholder: "Future Technologies",
      },
      {
        key: "tagline",
        label: "Tagline",
        type: "text",
        placeholder: "Your Gateway to the Innovations",
      },
      {
        key: "supportEmail",
        label: "Support Email",
        type: "email",
        placeholder: "support@futuretch.io",
      },
      {
        key: "maxStudents",
        label: "Max Students / Course",
        type: "number",
        placeholder: "200",
      },
    ],
  },
  {
    id: "grading",
    icon: BookOpen,
    label: "Grading",
    fields: [
      {
        key: "passMark",
        label: "Pass Mark (%)",
        type: "number",
        placeholder: "60",
      },
      {
        key: "distinction",
        label: "Distinction (%)",
        type: "number",
        placeholder: "85",
      },
      {
        key: "gradingScheme",
        label: "Grading Scheme",
        type: "text",
        placeholder: "A/B/C/D/F",
      },
      {
        key: "lateSubmission",
        label: "Late Penalty (% / day)",
        type: "number",
        placeholder: "5",
      },
    ],
  },
  {
    id: "notifications",
    icon: Bell,
    label: "Notifications",
    fields: [
      {
        key: "assignmentReminder",
        label: "Assignment Reminder (days before)",
        type: "number",
        placeholder: "2",
      },
      {
        key: "examReminder",
        label: "Exam Reminder (days before)",
        type: "number",
        placeholder: "3",
      },
      {
        key: "inactivityAlert",
        label: "Inactivity Alert (days)",
        type: "number",
        placeholder: "7",
      },
    ],
  },
  {
    id: "security",
    icon: Shield,
    label: "Security",
    fields: [
      {
        key: "sessionTimeout",
        label: "Session Timeout (min)",
        type: "number",
        placeholder: "60",
      },
      {
        key: "maxLoginAttempts",
        label: "Max Login Attempts",
        type: "number",
        placeholder: "5",
      },
      {
        key: "passwordMinLen",
        label: "Min Password Length",
        type: "number",
        placeholder: "8",
      },
    ],
  },
];

const STORAGE_KEY = "mindcampus_admin_settings";

type FormValues = Record<string, string>;

const defaults: FormValues = {
  platformName: "Future Technologies",
  tagline: "Your Gateway to the Innovations",
  supportEmail: "support@futuretch.io",
  maxStudents: "200",
  passMark: "60",
  distinction: "85",
  gradingScheme: "A/B/C/D/F",
  lateSubmission: "5",
  assignmentReminder: "2",
  examReminder: "3",
  inactivityAlert: "7",
  sessionTimeout: "60",
  maxLoginAttempts: "5",
  passwordMinLen: "8",
};

function loadFromStorage(): FormValues {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaults, ...JSON.parse(raw) };
  } catch {
    // ignore
  }
  return defaults;
}

// ─── Teacher Invite Panel ──────────────────────────────────────────────────────
function TeacherInvitePanel() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setGenerating(true);
    const result = await generateTeacherCode(email.trim());
    setCode(result);
    setGenerating(false);
    setCopied(false);
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-2xl p-6" style={CARD_STYLE}>
      <div className="flex items-center gap-2 mb-2">
        <KeyRound size={18} className="text-primary" />
        <h2 className="text-foreground font-semibold">Teacher Invite Codes</h2>
      </div>
      <p
        className="text-xs mb-6"
        style={{ color: "var(--bauhaus-card-inscription-sub)" }}
      >
        Enter a teacher's email to generate their unique sign-up code. Each code
        is tied to that email — only they can use it to register.
      </p>
      <form onSubmit={handleGenerate} className="space-y-4">
        <div>
          <label
            className="block text-xs font-medium mb-1.5"
            style={{ color: "var(--bauhaus-card-inscription-sub)" }}
          >
            Teacher's Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setCode("");
            }}
            placeholder="teacher@school.com"
            required
            className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors"
          />
        </div>
        <ChronicleButton
          inscription={generating ? "Generating…" : "Generate Code"}
          variant="filled"
          backgroundColor="#156ef6"
          textColor="#fff"
          hoverTextColor="#fff"
        />
      </form>

      {code && (
        <div
          className="mt-6 rounded-xl p-4 flex items-center justify-between gap-4"
          style={{
            backgroundColor: "#156ef610",
            border: "1px solid #156ef630",
          }}
        >
          <div>
            <p
              className="text-xs mb-1"
              style={{ color: "var(--bauhaus-card-inscription-sub)" }}
            >
              Code for{" "}
              <span
                className="font-medium"
                style={{ color: "var(--bauhaus-card-inscription-main)" }}
              >
                {email}
              </span>
            </p>
            <p
              className="font-mono text-2xl font-bold tracking-widest"
              style={{ color: "#156ef6" }}
            >
              {code}
            </p>
          </div>
          <button
            onClick={handleCopy}
            title="Copy code"
            className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border transition-colors"
            style={
              copied
                ? {
                    borderColor: "#24d200",
                    color: "#24d200",
                    backgroundColor: "#24d20010",
                  }
                : {
                    borderColor: "#156ef640",
                    color: "#156ef6",
                    backgroundColor: "#156ef610",
                  }
            }
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      )}

      <p
        className="text-xs mt-6 leading-relaxed"
        style={{ color: "var(--bauhaus-card-inscription-sub)" }}
      >
        Share this code with the teacher. They enter it in the "Teacher Access
        Code" field when signing up at{" "}
        <span className="font-mono">/admin-signup</span>. The code only works
        for the exact email it was generated for.
      </p>
    </div>
  );
}

export default function AdminSettings() {
  const [values, setValues] = useState<FormValues>(loadFromStorage);
  const [savedValues, setSavedValues] = useState<FormValues>(loadFromStorage);
  const [showToast, setShowToast] = useState(false);
  const [activeSection, setActiveSection] = useState("platform");

  const isDirty = JSON.stringify(values) !== JSON.stringify(savedValues);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    setSavedValues({ ...values });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  }

  const currentSection =
    sections.find((s) => s.id === activeSection) ?? sections[0];

  // All nav items including the special invites tab
  const allNavItems = [
    ...sections.map(({ id, icon, label }) => ({ id, icon, label })),
    { id: "invites", icon: KeyRound, label: "Teacher Invites" },
  ];

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <div className="mb-6 md:mb-8">
        <h1
          className="text-2xl md:text-3xl font-bold"
          style={{ color: "var(--bauhaus-card-inscription-main)" }}
        >
          Settings
        </h1>
        <p
          className="mt-1"
          style={{ color: "var(--bauhaus-card-inscription-sub)" }}
        >
          Platform configuration and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 md:gap-6">
        {/* Section nav */}
        <div className="sm:col-span-1">
          <nav className="space-y-1">
            {allNavItems.map(({ id, icon: Icon, label }) => {
              const active = activeSection === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveSection(id)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
                  style={
                    active
                      ? {
                          backgroundColor: "#156ef618",
                          border: "1px solid #156ef633",
                          color: "#156ef6",
                        }
                      : { color: "var(--bauhaus-card-inscription-sub)" }
                  }
                >
                  <Icon
                    size={16}
                    style={{
                      color: active
                        ? "#156ef6"
                        : "var(--bauhaus-card-inscription-sub)",
                    }}
                  />
                  {label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Form panel */}
        <div className="sm:col-span-3">
          {activeSection === "invites" ? (
            <TeacherInvitePanel />
          ) : (
            <form
              onSubmit={handleSave}
              className="rounded-2xl p-6"
              style={CARD_STYLE}
            >
              <div className="flex items-center gap-2 mb-6">
                <currentSection.icon size={18} className="text-primary" />
                <h2 className="text-foreground font-semibold">
                  {currentSection.label} Settings
                </h2>
              </div>

              <div className="space-y-4">
                {currentSection.fields.map(
                  ({ key, label, type, placeholder }) => (
                    <div key={key}>
                      <label className="block text-muted-foreground text-xs font-medium mb-1.5">
                        {label}
                      </label>
                      <input
                        type={type}
                        value={values[key] ?? ""}
                        onChange={(e) =>
                          setValues({ ...values, [key]: e.target.value })
                        }
                        placeholder={placeholder}
                        className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors"
                      />
                    </div>
                  ),
                )}
              </div>

              <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
                <ChronicleButton
                  inscription="Reset to defaults"
                  variant="outlined"
                  backgroundColor="var(--bauhaus-card-inscription-sub)"
                  textColor="var(--bauhaus-card-inscription-sub)"
                  hoverTextColor="#fff"
                  borderColor="var(--bauhaus-card-separator)"
                  onClick={() => setValues(defaults)}
                />
                <div className="relative">
                  {isDirty && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-orange-400 z-10" />
                  )}
                  <ChronicleButton
                    inscription="Save Changes"
                    variant="filled"
                    backgroundColor="#156ef6"
                    textColor="#fff"
                    hoverTextColor="#fff"
                  />
                </div>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Success toast */}
      {showToast && (
        <div
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl text-sm font-medium text-white"
          style={{ backgroundColor: "#24d200" }}
        >
          ✓ Settings saved
        </div>
      )}
    </div>
  );
}
