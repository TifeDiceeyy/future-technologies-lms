import { useState, useEffect } from "react";
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  ChevronRight,
  ChevronLeft,
  Target,
  Clock,
  Video,
} from "lucide-react";
import { ChronicleButton } from "@/components/ui/chronicle-button";
import { FileUpload } from "@/components/ui/file-upload";
import { useAuth } from "@/store/AuthContext";
import {
  updateUserAttributes,
  updatePassword,
  getCurrentUser,
  fetchUserAttributes,
} from "aws-amplify/auth";

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
  { id: "interests", icon: Target, label: "Interests" },
  { id: "learning", icon: Clock, label: "Learning Reminders" },
  { id: "video", icon: Video, label: "Video Preferences" },
];

const INTEREST_OPTIONS = [
  "AWS",
  "React",
  "Python",
  "Data Science",
  "DevOps",
  "Kubernetes",
  "Machine Learning",
  "Terraform",
  "Node.js",
  "TypeScript",
  "Docker",
  "Cybersecurity",
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function loadReminders() {
  try {
    const raw = localStorage.getItem("mindcampus_reminders");
    return raw
      ? (JSON.parse(raw) as { enabled: boolean; days: string[]; time: string })
      : { enabled: false, days: ["Mon", "Wed", "Fri"], time: "09:00" };
  } catch {
    return { enabled: false, days: ["Mon", "Wed", "Fri"], time: "09:00" };
  }
}

function loadVideoPref() {
  try {
    const raw = localStorage.getItem("mindcampus_video_prefs");
    return raw
      ? (JSON.parse(raw) as {
          quality: string;
          autoplay: boolean;
          subtitles: boolean;
        })
      : { quality: "Auto", autoplay: true, subtitles: false };
  } catch {
    return { quality: "Auto", autoplay: true, subtitles: false };
  }
}

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
      className="relative rounded-full transition-colors flex items-center px-0.5 flex-shrink-0"
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
  const { currentUser, refreshUser } = useAuth();
  const [activeSection, setActiveSection] = useState("profile");
  // Bug 7 fix: mobile shows nav list OR panel — never both side-by-side
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);
  const activeLabel = sections.find((s) => s.id === activeSection)?.label ?? "";

  const [profile, setProfile] = useState({
    name: currentUser?.name ?? "",
    email: currentUser?.email ?? "",
    bio: currentUser?.bio ?? "AWS enthusiast & self-learner.",
  });
  const [notifSettings, setNotifSettings] = useState({
    assignments: true,
    grades: true,
    exams: true,
    courses: false,
    email: true,
  });

  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  const [security, setSecurity] = useState({
    oldPw: "",
    newPw: "",
    confirmPw: "",
  });
  const [securitySaving, setSecuritySaving] = useState(false);
  const [securityMsg, setSecurityMsg] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  // Interests
  const [interests, setInterests] = useState<Set<string>>(new Set());
  const [interestsSaving, setInterestsSaving] = useState(false);
  const [interestsMsg, setInterestsMsg] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);
  useEffect(() => {
    if (activeSection !== "interests") return;
    fetchUserAttributes()
      .then((attrs) => {
        const raw = attrs["custom:interests"];
        if (raw) setInterests(new Set(JSON.parse(raw) as string[]));
      })
      .catch(() => {});
  }, [activeSection]);

  async function saveInterests() {
    setInterestsSaving(true);
    setInterestsMsg(null);
    try {
      await updateUserAttributes({
        userAttributes: { "custom:interests": JSON.stringify([...interests]) },
      });
      setInterestsMsg({ type: "ok", text: "Interests saved." });
    } catch (err) {
      setInterestsMsg({
        type: "err",
        text: err instanceof Error ? err.message : "Failed to save.",
      });
    } finally {
      setInterestsSaving(false);
    }
  }

  // Learning reminders
  const [reminders, setReminders] = useState(loadReminders);
  function toggleDay(day: string) {
    setReminders((prev) => {
      const days = prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day];
      const next = { ...prev, days };
      localStorage.setItem("mindcampus_reminders", JSON.stringify(next));
      return next;
    });
  }
  function setReminderField<K extends keyof typeof reminders>(
    key: K,
    value: (typeof reminders)[K],
  ) {
    setReminders((prev) => {
      const next = { ...prev, [key]: value };
      localStorage.setItem("mindcampus_reminders", JSON.stringify(next));
      return next;
    });
  }

  // Video prefs
  const [videoPref, setVideoPref] = useState(loadVideoPref);
  function setVideoField<K extends keyof typeof videoPref>(
    key: K,
    value: (typeof videoPref)[K],
  ) {
    setVideoPref((prev) => {
      const next = { ...prev, [key]: value };
      localStorage.setItem("mindcampus_video_prefs", JSON.stringify(next));
      return next;
    });
  }

  useEffect(() => {
    if (currentUser) {
      setProfile((prev) => ({
        ...prev,
        name: currentUser.name || prev.name,
        email: currentUser.email || prev.email,
        bio: currentUser.bio || prev.bio,
      }));
    }
  }, [currentUser]);

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg(null);
    try {
      await updateUserAttributes({ userAttributes: { name: profile.name } });
      await refreshUser();
      setProfileMsg({ type: "ok", text: "Profile updated successfully." });
    } catch (err) {
      setProfileMsg({
        type: "err",
        text: err instanceof Error ? err.message : "Failed to update profile.",
      });
    } finally {
      setProfileSaving(false);
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setSecurityMsg(null);
    if (!security.oldPw || !security.newPw) {
      setSecurityMsg({
        type: "err",
        text: "Please fill in all password fields.",
      });
      return;
    }
    if (security.newPw !== security.confirmPw) {
      setSecurityMsg({ type: "err", text: "New passwords do not match." });
      return;
    }
    if (security.newPw.length < 8) {
      setSecurityMsg({
        type: "err",
        text: "New password must be at least 8 characters.",
      });
      return;
    }
    setSecuritySaving(true);
    try {
      const user = await getCurrentUser();
      await updatePassword({
        oldPassword: security.oldPw,
        newPassword: security.newPw,
      });
      void user;
      setSecurity({ oldPw: "", newPw: "", confirmPw: "" });
      setSecurityMsg({ type: "ok", text: "Password changed successfully." });
    } catch (err) {
      setSecurityMsg({
        type: "err",
        text: err instanceof Error ? err.message : "Failed to change password.",
      });
    } finally {
      setSecuritySaving(false);
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl">
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
          Manage your account and preferences.
        </p>
      </div>

      {/* Bug 7 fix: was "flex gap-6" (side-by-side — panel invisible on mobile)
          Now flex-col md:flex-row; mobile toggles between nav and panel */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {/* Sidebar nav — hidden on mobile when panel is open */}
        <div
          className={
            "w-full md:w-52 md:flex-shrink-0 " +
            (mobilePanelOpen ? "hidden md:block" : "block")
          }
        >
          <nav className="space-y-1">
            {sections.map(({ id, icon: Icon, label }) => {
              const active = activeSection === id;
              return (
                <button
                  key={id}
                  onClick={() => {
                    setActiveSection(id);
                    setMobilePanelOpen(true);
                  }}
                  className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
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
                  <span className="flex items-center gap-3">
                    <Icon
                      size={16}
                      style={{
                        color: active
                          ? "#156ef6"
                          : "var(--bauhaus-card-inscription-sub)",
                      }}
                    />
                    {label}
                  </span>
                  <ChevronRight size={14} className="md:hidden opacity-40" />
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content panel — hidden on mobile when nav is shown */}
        <div
          className={
            "flex-1 " + (mobilePanelOpen ? "block" : "hidden md:block")
          }
        >
          {/* Mobile back button */}
          <button
            onClick={() => setMobilePanelOpen(false)}
            className="flex md:hidden items-center gap-2 text-sm mb-4"
            style={{ color: "var(--bauhaus-card-inscription-sub)" }}
          >
            <ChevronLeft size={16} />
            {activeLabel}
          </button>

          <div className="rounded-2xl p-5 md:p-6" style={CARD_STYLE}>
            {/* Profile */}
            {activeSection === "profile" && (
              <form onSubmit={handleProfileSave}>
                <h2
                  className="font-semibold mb-6"
                  style={{ color: "var(--bauhaus-card-inscription-main)" }}
                >
                  Profile Information
                </h2>
                <div className="flex items-center gap-4 mb-5">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #156ef6, #8f10f6)",
                    }}
                  >
                    {profile.name.slice(0, 2).toUpperCase() || "U"}
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
                      type="button"
                      className="text-sm hover:opacity-70 transition-opacity px-2 py-2"
                      style={{ color: "#fc6800" }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
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
                        style={{
                          color: "var(--bauhaus-card-inscription-main)",
                        }}
                      >
                        {label}
                      </label>
                      <input
                        type={type}
                        value={profile[field as keyof typeof profile]}
                        onChange={(e) =>
                          setProfile({ ...profile, [field]: e.target.value })
                        }
                        disabled={field === "email"}
                        style={{
                          ...INPUT_STYLE,
                          opacity: field === "email" ? 0.6 : 1,
                        }}
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
                  {profileMsg && (
                    <p
                      className="text-xs px-3 py-2 rounded-lg"
                      style={{
                        color: profileMsg.type === "ok" ? "#24d200" : "#fc6800",
                        backgroundColor:
                          profileMsg.type === "ok" ? "#24d20015" : "#fc680015",
                        border: `1px solid ${profileMsg.type === "ok" ? "#24d20030" : "#fc680030"}`,
                      }}
                    >
                      {profileMsg.text}
                    </p>
                  )}
                  <ChronicleButton
                    inscription={profileSaving ? "Saving…" : "Save Changes"}
                    variant="filled"
                    backgroundColor="#156ef6"
                    textColor="#fff"
                    hoverTextColor="#fff"
                  />
                </div>
              </form>
            )}

            {/* Notifications */}
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
                      <div className="flex-1 min-w-0 pr-4">
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
                          style={{
                            color: "var(--bauhaus-card-inscription-sub)",
                          }}
                        >
                          {desc}
                        </p>
                      </div>
                      <Toggle
                        enabled={
                          notifSettings[key as keyof typeof notifSettings]
                        }
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

            {/* Security */}
            {activeSection === "security" && (
              <div>
                <h2
                  className="font-semibold mb-6"
                  style={{ color: "var(--bauhaus-card-inscription-main)" }}
                >
                  Security
                </h2>
                <form onSubmit={handlePasswordChange}>
                  <div className="space-y-4">
                    {[
                      { label: "Current Password", field: "oldPw" },
                      { label: "New Password", field: "newPw" },
                      { label: "Confirm New Password", field: "confirmPw" },
                    ].map(({ label, field }) => (
                      <div key={field}>
                        <label
                          className="block text-sm font-medium mb-2"
                          style={{
                            color: "var(--bauhaus-card-inscription-main)",
                          }}
                        >
                          {label}
                        </label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={security[field as keyof typeof security]}
                          onChange={(e) =>
                            setSecurity({
                              ...security,
                              [field]: e.target.value,
                            })
                          }
                          style={INPUT_STYLE}
                        />
                      </div>
                    ))}
                    {securityMsg && (
                      <p
                        className="text-xs px-3 py-2 rounded-lg"
                        style={{
                          color:
                            securityMsg.type === "ok" ? "#24d200" : "#fc6800",
                          backgroundColor:
                            securityMsg.type === "ok"
                              ? "#24d20015"
                              : "#fc680015",
                          border: `1px solid ${securityMsg.type === "ok" ? "#24d20030" : "#fc680030"}`,
                        }}
                      >
                        {securityMsg.text}
                      </p>
                    )}
                    <ChronicleButton
                      inscription={
                        securitySaving ? "Updating…" : "Update Password"
                      }
                      variant="filled"
                      backgroundColor="#156ef6"
                      textColor="#fff"
                      hoverTextColor="#fff"
                    />
                  </div>
                </form>
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
            )}

            {/* Appearance */}
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

            {/* Interests */}
            {activeSection === "interests" && (
              <div>
                <h2
                  className="font-semibold mb-2"
                  style={{ color: "var(--bauhaus-card-inscription-main)" }}
                >
                  Interests
                </h2>
                <p
                  className="text-xs mb-5"
                  style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                >
                  Select topics you want to focus on. Used to personalise course
                  recommendations.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {INTEREST_OPTIONS.map((topic) => {
                    const active = interests.has(topic);
                    return (
                      <button
                        key={topic}
                        onClick={() => {
                          setInterests((prev) => {
                            const next = new Set(prev);
                            if (next.has(topic)) next.delete(topic);
                            else next.add(topic);
                            return next;
                          });
                        }}
                        className="px-3 py-1.5 rounded-full text-sm font-medium transition-all"
                        style={
                          active
                            ? { backgroundColor: "#156ef6", color: "#fff" }
                            : {
                                ...CARD_STYLE,
                                color: "var(--bauhaus-card-inscription-sub)",
                              }
                        }
                      >
                        {topic}
                      </button>
                    );
                  })}
                </div>
                {interestsMsg && (
                  <p
                    className="text-xs px-3 py-2 rounded-lg mb-4"
                    style={{
                      color: interestsMsg.type === "ok" ? "#24d200" : "#fc6800",
                      backgroundColor:
                        interestsMsg.type === "ok" ? "#24d20015" : "#fc680015",
                      border: `1px solid ${interestsMsg.type === "ok" ? "#24d20030" : "#fc680030"}`,
                    }}
                  >
                    {interestsMsg.text}
                  </p>
                )}
                <ChronicleButton
                  inscription={interestsSaving ? "Saving…" : "Save Interests"}
                  variant="filled"
                  backgroundColor="#156ef6"
                  textColor="#fff"
                  hoverTextColor="#fff"
                  onClick={saveInterests}
                />
              </div>
            )}

            {/* Learning Reminders */}
            {activeSection === "learning" && (
              <div>
                <h2
                  className="font-semibold mb-6"
                  style={{ color: "var(--bauhaus-card-inscription-main)" }}
                >
                  Learning Reminders
                </h2>
                <div className="space-y-5">
                  {/* Master toggle */}
                  <div
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
                        Enable reminders
                      </p>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                      >
                        Get daily nudges to keep learning
                      </p>
                    </div>
                    <Toggle
                      enabled={reminders.enabled}
                      onToggle={() =>
                        setReminderField("enabled", !reminders.enabled)
                      }
                    />
                  </div>
                  {/* Days */}
                  <div
                    className={
                      reminders.enabled ? "" : "opacity-40 pointer-events-none"
                    }
                  >
                    <p
                      className="text-sm font-medium mb-3"
                      style={{ color: "var(--bauhaus-card-inscription-main)" }}
                    >
                      Study days
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {DAYS.map((day) => {
                        const on = reminders.days.includes(day);
                        return (
                          <button
                            key={day}
                            onClick={() => toggleDay(day)}
                            className="w-10 h-10 rounded-xl text-xs font-medium transition-all"
                            style={
                              on
                                ? { backgroundColor: "#156ef6", color: "#fff" }
                                : {
                                    ...CARD_STYLE,
                                    color:
                                      "var(--bauhaus-card-inscription-sub)",
                                  }
                            }
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  {/* Time */}
                  <div
                    className={
                      reminders.enabled ? "" : "opacity-40 pointer-events-none"
                    }
                  >
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "var(--bauhaus-card-inscription-main)" }}
                    >
                      Reminder time
                    </label>
                    <input
                      type="time"
                      value={reminders.time}
                      onChange={(e) => setReminderField("time", e.target.value)}
                      style={{ ...INPUT_STYLE, width: "auto" }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Video Preferences */}
            {activeSection === "video" && (
              <div>
                <h2
                  className="font-semibold mb-6"
                  style={{ color: "var(--bauhaus-card-inscription-main)" }}
                >
                  Video Preferences
                </h2>
                <div className="space-y-5">
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "var(--bauhaus-card-inscription-main)" }}
                    >
                      Default quality
                    </label>
                    <select
                      value={videoPref.quality}
                      onChange={(e) => setVideoField("quality", e.target.value)}
                      style={{ ...INPUT_STYLE, width: "auto" }}
                    >
                      {["Auto", "1080p", "720p", "480p", "360p"].map((q) => (
                        <option key={q} value={q}>
                          {q}
                        </option>
                      ))}
                    </select>
                  </div>
                  {[
                    {
                      key: "autoplay" as const,
                      label: "Autoplay next lesson",
                      desc: "Automatically play the next lesson when one ends",
                    },
                    {
                      key: "subtitles" as const,
                      label: "Subtitles / CC",
                      desc: "Show captions by default",
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
                          style={{
                            color: "var(--bauhaus-card-inscription-sub)",
                          }}
                        >
                          {desc}
                        </p>
                      </div>
                      <Toggle
                        enabled={videoPref[key]}
                        onToggle={() => setVideoField(key, !videoPref[key])}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Language */}
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
    </div>
  );
}
