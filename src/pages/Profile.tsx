import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Award,
  BookOpen,
  TrendingUp,
  Settings,
  ChevronRight,
  Star,
  Clock,
  LogOut,
  X,
  Pencil,
} from "lucide-react";
import { useApp } from "@/store/AppContext";
import { useAuth } from "@/store/AuthContext";

const CARD_STYLE = {
  backgroundColor: "var(--bauhaus-card-bg)",
  border: "1px solid var(--bauhaus-card-separator)",
};

const STAT_COLOR = ["#6366F1", "#10B981", "#F59E0B", "#06B6D4"];

function SignOutModal({
  onConfirm,
  onClose,
}: {
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6 shadow-2xl"
        style={CARD_STYLE}
        role="dialog"
        aria-modal="true"
        aria-label="Sign out confirmation"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "#EF444420" }}
            >
              <LogOut size={18} style={{ color: "#EF4444" }} />
            </div>
            <h2
              className="font-semibold"
              style={{ color: "var(--bauhaus-card-inscription-main)" }}
            >
              Sign out?
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:opacity-70">
            <X
              size={16}
              style={{ color: "var(--bauhaus-card-inscription-sub)" }}
            />
          </button>
        </div>
        <p
          className="text-sm mb-5"
          style={{ color: "var(--bauhaus-card-inscription-sub)" }}
        >
          You'll be returned to the login screen.
        </p>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl text-sm font-medium hover:opacity-70 transition-opacity"
            style={{
              backgroundColor: "var(--bauhaus-card-separator)",
              color: "var(--bauhaus-card-inscription-sub)",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-80"
            style={{ backgroundColor: "#EF4444" }}
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const { courses, assignments } = useApp();
  const { currentUser, signOut } = useAuth();
  const [signOutOpen, setSignOutOpen] = useState(false);

  const enrolledCourses = courses.filter((c) => c.enrolled);
  const completedAssignments = assignments.filter(
    (a) => a.status === "graded",
  ).length;
  const avgProgress = enrolledCourses.length
    ? Math.round(
        enrolledCourses.reduce((s, c) => s + c.progress, 0) /
          enrolledCourses.length,
      )
    : 0;

  const displayName = currentUser?.name ?? "Student";
  const displayEmail = currentUser?.email ?? "";
  const isPro = currentUser?.role === "admin";

  const stats = [
    { label: "Courses", value: enrolledCourses.length, color: STAT_COLOR[0] },
    { label: "Completed", value: completedAssignments, color: STAT_COLOR[1] },
    { label: "Avg Progress", value: `${avgProgress}%`, color: STAT_COLOR[2] },
    { label: "Hours", value: "24", color: STAT_COLOR[3] },
  ];

  const menuItems = [
    {
      label: "Edit Profile",
      icon: Pencil,
      onClick: () => navigate("/settings"),
    },
    { label: "Settings", icon: Settings, onClick: () => navigate("/settings") },
    {
      label: "My Courses",
      icon: BookOpen,
      onClick: () => navigate("/courses"),
    },
    {
      label: "Progress",
      icon: TrendingUp,
      onClick: () => navigate("/dashboard"),
    },
    { label: "Certificates", icon: Award, onClick: () => navigate("/library") },
  ];

  async function handleSignOut() {
    await signOut();
    navigate("/login");
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl">
      {/* Avatar + name */}
      <div className="flex flex-col items-center mb-8">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
          style={{ background: "linear-gradient(135deg, #6366F1, #06B6D4)" }}
        >
          <User size={36} className="text-white" />
        </div>

        <div className="flex items-center gap-2 mb-0.5">
          <h1
            className="text-xl font-bold"
            style={{ color: "var(--bauhaus-card-inscription-main)" }}
          >
            {displayName}
          </h1>
          <span
            className="px-2 py-0.5 rounded-full text-xs font-semibold"
            style={
              isPro
                ? {
                    backgroundColor: "#6366F120",
                    color: "#6366F1",
                    border: "1px solid #6366F140",
                  }
                : {
                    backgroundColor: "#5a617520",
                    color: "#5a6175",
                    border: "1px solid #5a617540",
                  }
            }
          >
            {isPro ? "Pro" : "Free"}
          </span>
        </div>

        <p
          className="text-sm"
          style={{ color: "var(--bauhaus-card-inscription-sub)" }}
        >
          {displayEmail}
        </p>

        {/* Stars */}
        <div className="flex items-center gap-1 mt-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              size={14}
              fill="#F59E0B"
              style={{ color: "#F59E0B" }}
            />
          ))}
          <span
            className="text-xs ml-1"
            style={{ color: "var(--bauhaus-card-inscription-sub)" }}
          >
            Top Learner
          </span>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        {stats.map(({ label, value, color }) => (
          <div
            key={label}
            className="rounded-xl p-3 text-center"
            style={CARD_STYLE}
          >
            <p
              className="text-xl font-bold"
              style={{ color: "var(--bauhaus-card-inscription-main)" }}
            >
              {value}
            </p>
            <p className="text-xs mt-0.5" style={{ color }}>
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Weekly streak */}
      <div className="rounded-xl p-4 mb-6" style={CARD_STYLE}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock size={15} style={{ color: "#F59E0B" }} />
            <p
              className="text-sm font-medium"
              style={{ color: "var(--bauhaus-card-inscription-main)" }}
            >
              Weekly streak
            </p>
          </div>
          <span className="text-sm font-bold" style={{ color: "#F59E0B" }}>
            🔥 5 days
          </span>
        </div>
        <div className="flex gap-1.5">
          {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full h-1.5 rounded-full"
                style={{
                  backgroundColor:
                    i < 5 ? "#F59E0B" : "var(--bauhaus-card-separator)",
                }}
              />
              <span
                className="text-xs"
                style={{ color: "var(--bauhaus-card-inscription-sub)" }}
              >
                {day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick nav */}
      <div className="space-y-2 mb-4">
        {menuItems.map(({ label, icon: Icon, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            className="w-full flex items-center gap-3 p-4 rounded-xl transition-all hover:scale-[1.01]"
            style={CARD_STYLE}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: "#6366F115",
                border: "1px solid #6366F130",
              }}
            >
              <Icon size={15} style={{ color: "#6366F1" }} />
            </div>
            <span
              className="flex-1 text-sm font-medium text-left"
              style={{ color: "var(--bauhaus-card-inscription-main)" }}
            >
              {label}
            </span>
            <ChevronRight
              size={16}
              style={{ color: "var(--bauhaus-card-inscription-sub)" }}
            />
          </button>
        ))}
      </div>

      {/* Sign out */}
      <button
        onClick={() => setSignOutOpen(true)}
        className="w-full flex items-center gap-3 p-4 rounded-xl transition-all hover:scale-[1.01]"
        style={{ ...CARD_STYLE, border: "1px solid #EF444430" }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: "#EF444415" }}
        >
          <LogOut size={15} style={{ color: "#EF4444" }} />
        </div>
        <span
          className="flex-1 text-sm font-medium text-left"
          style={{ color: "#EF4444" }}
        >
          Sign out
        </span>
      </button>

      {signOutOpen && (
        <SignOutModal
          onConfirm={handleSignOut}
          onClose={() => setSignOutOpen(false)}
        />
      )}
    </div>
  );
}
