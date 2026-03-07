import { useState } from "react";
import { User, Bell, Shield, Palette, Globe } from "lucide-react";
import { ChronicleButton } from "@/components/ui/chronicle-button";
import { FileUpload } from "@/components/ui/file-upload";

const CARD_STYLE = {
  backgroundColor: "var(--bauhaus-card-bg)",
  border: "1px solid var(--bauhaus-card-separator)",
};

const INPUT_STYLE = {
  width: "100%",
  backgroundColor: "var(--bauhaus-card-bg)",
  border: "1px solid var(--bauhaus-card-separator)",
  borderRadius: "12px",
  padding: "10px 16px",
  color: "var(--bauhaus-card-inscription-main)",
  fontSize: "14px",
  outline: "none",
};

const sections = [
  { id: "profile", icon: User, label: "Profile" },
  { id: "notifications", icon: Bell, label: "Notifications" },
  { id: "security", icon: Shield, label: "Security" },
  { id: "appearance", icon: Palette, label: "Appearance" },
  { id: "language", icon: Globe, label: "Language & Region" },
];

function Toggle({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="relative rounded-full transition-colors flex items-center px-0.5"
      style={{
        width: "40px",
        height: "22px",
        backgroundColor: enabled ? "#156ef6" : "var(--bauhaus-card-separator)",
      }}
    >
      <div
        className="w-4 h-4 rounded-full bg-white shadow transition-transform"
        style={{ transform: enabled ? "translateX(16px)" : "translateX(0)" }}
      />
    </button>
  );
}

export default function Settings() {
  const [activeSection, setActiveSection] = useState("profile");
  const [profile, setProfile] = useState({
    name: "Tife Abayomi",
    email: "tife@example.com",
    bio: "AWS enthusiast & self-learner.",
  });
  const [notifSettings, setNotifSettings] = useState({
    assignments: true,
    grades: true,
    exams: true,
    courses: false,
    email: true,
  });

  return (
    <div className="p-8 max-w-5xl">
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
          Manage your account and preferences.
        </p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar nav */}
        <div className="w-52 flex-shrink-0">
          <nav className="space-y-1">
            {sections.map(({ id, icon: Icon, label }) => {
              const active = activeSection === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveSection(id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
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

        {/* Content panel */}
        <div className="flex-1 rounded-2xl p-6" style={CARD_STYLE}>
          {/* ── Profile ── */}
          {activeSection === "profile" && (
            <div>
              <h2
                className="font-semibold mb-6"
                style={{ color: "var(--bauhaus-card-inscription-main)" }}
              >
                Profile Information
              </h2>

              {/* Avatar row */}
              <div className="flex items-center gap-4 mb-5">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #156ef6, #8f10f6)",
                  }}
                >
                  TA
                </div>
                <div className="flex items-center gap-2">
                  <ChronicleButton
                    inscription="Choose Photo"
                    variant="outlined"
                    backgroundColor="#156ef6"
                    textColor="#156ef6"
                    hoverTextColor="#fff"
                    borderColor="#156ef666"
                  />
                  <button
                    className="text-sm hover:opacity-70 transition-opacity px-2 py-2"
                    style={{ color: "#fc6800" }}
                  >
                    Remove
                  </button>
                </div>
              </div>

              {/* File upload for photo */}
              <div
                className="mb-6 pb-6"
                style={{
                  borderBottom: "1px solid var(--bauhaus-card-separator)",
                }}
              >
                <FileUpload />
              </div>

              <div className="space-y-4">
                {[
                  { label: "Full Name", field: "name", type: "text" },
                  { label: "Email", field: "email", type: "email" },
                ].map(({ label, field, type }) => (
                  <div key={field}>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "var(--bauhaus-card-inscription-main)" }}
                    >
                      {label}
                    </label>
                    <input
                      type={type}
                      value={profile[field as keyof typeof profile]}
                      onChange={(e) =>
                        setProfile({ ...profile, [field]: e.target.value })
                      }
                      style={INPUT_STYLE}
                    />
                  </div>
                ))}
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--bauhaus-card-inscription-main)" }}
                  >
                    Bio
                  </label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) =>
                      setProfile({ ...profile, bio: e.target.value })
                    }
                    rows={3}
                    style={{ ...INPUT_STYLE, resize: "none" }}
                  />
                </div>
                <ChronicleButton
                  inscription="Save Changes"
                  variant="filled"
                  backgroundColor="#156ef6"
                  textColor="#fff"
                  hoverTextColor="#fff"
                />
              </div>
            </div>
          )}

          {/* ── Notifications ── */}
          {activeSection === "notifications" && (
            <div>
              <h2
                className="font-semibold mb-6"
                style={{ color: "var(--bauhaus-card-inscription-main)" }}
              >
                Notification Preferences
              </h2>
              <div className="space-y-4">
                {[
                  {
                    key: "assignments",
                    label: "Assignment reminders",
                    desc: "Get notified when assignments are due",
                  },
                  {
                    key: "grades",
                    label: "Grade updates",
                    desc: "Receive notifications when grades are posted",
                  },
                  {
                    key: "exams",
                    label: "Exam reminders",
                    desc: "Alerts for upcoming exams",
                  },
                  {
                    key: "courses",
                    label: "New course announcements",
                    desc: "Notify when new courses are available",
                  },
                  {
                    key: "email",
                    label: "Email notifications",
                    desc: "Also receive notifications via email",
                  },
                ].map(({ key, label, desc }) => (
                  <div
                    key={key}
                    className="flex items-center justify-between py-4"
                    style={{
                      borderBottom: "1px solid var(--bauhaus-card-separator)",
                    }}
                  >
                    <div>
                      <p
                        className="text-sm font-medium"
                        style={{
                          color: "var(--bauhaus-card-inscription-main)",
                        }}
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
                    <Toggle
                      enabled={notifSettings[key as keyof typeof notifSettings]}
                      onToggle={() =>
                        setNotifSettings({
                          ...notifSettings,
                          [key]:
                            !notifSettings[key as keyof typeof notifSettings],
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Security ── */}
          {activeSection === "security" && (
            <div>
              <h2
                className="font-semibold mb-6"
                style={{ color: "var(--bauhaus-card-inscription-main)" }}
              >
                Security
              </h2>
              <div className="space-y-4">
                {[
                  "Current Password",
                  "New Password",
                  "Confirm New Password",
                ].map((label) => (
                  <div key={label}>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "var(--bauhaus-card-inscription-main)" }}
                    >
                      {label}
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      style={INPUT_STYLE}
                    />
                  </div>
                ))}
                <ChronicleButton
                  inscription="Update Password"
                  variant="filled"
                  backgroundColor="#156ef6"
                  textColor="#fff"
                  hoverTextColor="#fff"
                />

                <div
                  className="mt-6 pt-6"
                  style={{
                    borderTop: "1px solid var(--bauhaus-card-separator)",
                  }}
                >
                  <h3
                    className="font-medium mb-1"
                    style={{ color: "var(--bauhaus-card-inscription-main)" }}
                  >
                    Two-Factor Authentication
                  </h3>
                  <p
                    className="text-xs mb-3"
                    style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                  >
                    Add an extra layer of security to your account.
                  </p>
                  <ChronicleButton
                    inscription="Enable 2FA"
                    variant="outlined"
                    backgroundColor="#8f10f6"
                    textColor="#8f10f6"
                    hoverTextColor="#fff"
                    borderColor="#8f10f666"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── Appearance ── */}
          {activeSection === "appearance" && (
            <div>
              <h2
                className="font-semibold mb-6"
                style={{ color: "var(--bauhaus-card-inscription-main)" }}
              >
                Appearance
              </h2>
              <div className="space-y-6">
                <div>
                  <p
                    className="text-sm font-medium mb-3"
                    style={{ color: "var(--bauhaus-card-inscription-main)" }}
                  >
                    Theme
                  </p>
                  <div className="flex gap-3">
                    {["Dark", "Darker", "AMOLED"].map((theme) => (
                      <button
                        key={theme}
                        className="px-4 py-2 rounded-lg text-sm transition-all"
                        style={
                          theme === "Dark"
                            ? {
                                backgroundColor: "#156ef618",
                                border: "1px solid #156ef644",
                                color: "#156ef6",
                              }
                            : {
                                ...CARD_STYLE,
                                color: "var(--bauhaus-card-inscription-sub)",
                              }
                        }
                      >
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p
                    className="text-sm font-medium mb-3"
                    style={{ color: "var(--bauhaus-card-inscription-main)" }}
                  >
                    Accent Color
                  </p>
                  <div className="flex gap-3">
                    {[
                      { color: "#156ef6", label: "Blue", active: true },
                      { color: "#8f10f6", label: "Purple", active: false },
                      { color: "#24d200", label: "Green", active: false },
                      { color: "#fc6800", label: "Orange", active: false },
                    ].map(({ color, label, active }) => (
                      <button
                        key={label}
                        className="flex flex-col items-center gap-1.5"
                      >
                        <div
                          className="w-8 h-8 rounded-full transition-all"
                          style={{
                            backgroundColor: color,
                            opacity: active ? 1 : 0.6,
                            outline: active ? `2px solid ${color}` : "none",
                            outlineOffset: "2px",
                          }}
                        />
                        <span
                          className="text-xs"
                          style={{
                            color: "var(--bauhaus-card-inscription-sub)",
                          }}
                        >
                          {label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Language ── */}
          {activeSection === "language" && (
            <div>
              <h2
                className="font-semibold mb-6"
                style={{ color: "var(--bauhaus-card-inscription-main)" }}
              >
                Language & Region
              </h2>
              <div className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--bauhaus-card-inscription-main)" }}
                  >
                    Language
                  </label>
                  <select style={INPUT_STYLE}>
                    <option value="en">English (US)</option>
                    <option value="en-gb">English (UK)</option>
                    <option value="fr">Français</option>
                    <option value="es">Español</option>
                  </select>
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--bauhaus-card-inscription-main)" }}
                  >
                    Timezone
                  </label>
                  <select style={INPUT_STYLE}>
                    <option>Africa/Lagos (WAT, UTC+1)</option>
                    <option>Europe/London (GMT, UTC+0)</option>
                    <option>America/New_York (EST, UTC-5)</option>
                    <option>America/Los_Angeles (PST, UTC-8)</option>
                  </select>
                </div>
                <ChronicleButton
                  inscription="Save Preferences"
                  variant="filled"
                  backgroundColor="#156ef6"
                  textColor="#fff"
                  hoverTextColor="#fff"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
