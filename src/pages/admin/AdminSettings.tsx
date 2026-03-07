import { useState } from "react";
import { Settings, Bell, Shield, BookOpen } from "lucide-react";
import { ChronicleButton } from "@/components/ui/chronicle-button";

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

export default function AdminSettings() {
  const [values, setValues] = useState<FormValues>(defaults);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState("platform");

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const currentSection = sections.find((s) => s.id === activeSection)!;

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1
          className="text-3xl font-bold"
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

      <div className="grid grid-cols-4 gap-6">
        {/* Section nav */}
        <div className="col-span-1">
          <nav className="space-y-1">
            {sections.map(({ id, icon: Icon, label }) => {
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
        <div className="col-span-3">
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
              <ChronicleButton
                inscription={saved ? "Saved ✓" : "Save Changes"}
                variant="filled"
                backgroundColor={saved ? "#24d200" : "#156ef6"}
                textColor="#fff"
                hoverTextColor="#fff"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
