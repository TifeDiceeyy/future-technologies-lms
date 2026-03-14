import {
  TrendingUp,
  Award,
  BookOpen,
  Clock,
  Target,
  BarChart2,
  PlayCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BauhausCard } from "@/components/ui/bauhaus-card";
import { AccordionComponent } from "@/components/ui/icon-accordion";
import { useApp } from "@/store/AppContext";
import { useAuth } from "@/store/AuthContext";

const CARD_STYLE = {
  backgroundColor: "var(--bauhaus-card-bg)",
  border: "1px solid var(--bauhaus-card-separator)",
};

const PROGRESS_TRACK = {
  backgroundColor: "var(--bauhaus-card-progress-bar-bg)",
};

const ACCENT_POOL = [
  "#6366F1",
  "#10B981",
  "#F59E0B",
  "#8f10f6",
  "#06B6D4",
  "#EC4899",
];
const courseAccent = (id: number) => ACCENT_POOL[(id - 1) % ACCENT_POOL.length];

const LEARNING_TIPS = [
  {
    title: "Spaced Repetition",
    description:
      "Review material at increasing intervals to boost long-term retention",
    icon: Clock,
    iconBg: "bg-blue-100 dark:bg-blue-900",
  },
  {
    title: "Active Recall",
    description:
      "Test yourself frequently rather than passively re-reading notes",
    icon: Target,
    iconBg: "bg-orange-100 dark:bg-orange-900",
  },
  {
    title: "Project-Based Learning",
    description:
      "Build real projects with each new skill to solidify your understanding",
    icon: BookOpen,
    iconBg: "bg-green-100 dark:bg-green-900",
  },
  {
    title: "Track Your Streaks",
    description:
      "Consistent daily learning — even 20 minutes — compounds over time",
    icon: TrendingUp,
    iconBg: "bg-purple-100 dark:bg-purple-900",
  },
];

// Greeting based on time of day
function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { courses, assignments } = useApp();
  const { currentUser } = useAuth();

  const enrolledCourses = courses.filter((c) => c.enrolled);
  const mostRecentCourse =
    enrolledCourses.find((c) => c.progress > 0) ?? enrolledCourses[0];
  const scoredCourses = enrolledCourses.filter((c) => c.currentScore !== null);
  const avgScore =
    scoredCourses.length > 0
      ? Math.round(
          scoredCourses.reduce((s, c) => s + (c.currentScore ?? 0), 0) /
            scoredCourses.length,
        )
      : 0;
  const pendingCount = assignments.filter(
    (a) => a.status === "pending" || a.status === "in-progress",
  ).length;

  const stats = [
    {
      label: "Courses Enrolled",
      value: String(enrolledCourses.length),
      change: enrolledCourses.length > 0 ? "Active" : "None yet",
      icon: BookOpen,
      accentColor: "#6366F1",
    },
    {
      label: "Pending Tasks",
      value: String(pendingCount),
      change: pendingCount > 0 ? "Need attention" : "All clear",
      icon: Clock,
      accentColor: "#10B981",
    },
    {
      label: "Avg. Score",
      value: avgScore > 0 ? `${avgScore}%` : "—",
      change: avgScore > 0 ? "Based on scored courses" : "No scores yet",
      icon: Target,
      accentColor: "#F59E0B",
    },
    {
      label: "Certificates",
      value: "0",
      change: "Complete a course to earn one",
      icon: Award,
      accentColor: "#8f10f6",
    },
  ];

  return (
    <div className="p-4 md:p-8 max-w-6xl">
      {/* ── Hero greeting card ──────────────────────────────────────── */}
      <div
        className="rounded-2xl p-5 md:p-6 mb-6 md:mb-8 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #6366F120, #06B6D415)",
          border: "1px solid #6366F133",
        }}
      >
        {/* Decorative glow */}
        <div
          className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: "#6366F1" }}
        />
        <div
          className="absolute bottom-0 left-1/2 w-32 h-32 rounded-full blur-3xl opacity-10 pointer-events-none"
          style={{ backgroundColor: "#06B6D4" }}
        />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-5">
          {/* Greeting + streak */}
          <div className="flex-1">
            <h1
              className="text-xl md:text-2xl font-bold mb-1"
              style={{ color: "var(--bauhaus-card-inscription-main)" }}
            >
              {getGreeting()}, {currentUser?.name?.split(" ")[0] ?? "there"}! 👋
            </h1>
            <p
              className="text-sm mb-4"
              style={{ color: "var(--bauhaus-card-inscription-sub)" }}
            >
              Your full learning overview, all in one place.
            </p>
          </div>

          {/* Quick stats */}
          <div
            className="flex items-center gap-4 flex-shrink-0 p-4 rounded-xl"
            style={CARD_STYLE}
          >
            <div className="text-center">
              <p
                className="text-2xl font-bold"
                style={{ color: "var(--bauhaus-card-inscription-main)" }}
              >
                {pendingCount}
              </p>
              <p
                className="text-xs"
                style={{ color: "var(--bauhaus-card-inscription-sub)" }}
              >
                Pending
              </p>
            </div>
            <div
              className="w-px h-10"
              style={{ backgroundColor: "var(--bauhaus-card-separator)" }}
            />
            <div className="text-center">
              <p
                className="text-2xl font-bold"
                style={{ color: "var(--bauhaus-card-inscription-main)" }}
              >
                {avgScore}%
              </p>
              <p
                className="text-xs"
                style={{ color: "var(--bauhaus-card-inscription-sub)" }}
              >
                Avg score
              </p>
            </div>
          </div>
        </div>

        {/* Pick up where you left off */}
        {mostRecentCourse && (
          <div
            className="relative z-10 mt-5 flex items-center gap-4 p-4 rounded-xl"
            style={{
              backgroundColor: "var(--bauhaus-card-bg)",
              border: "1px solid var(--bauhaus-card-separator)",
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: `${courseAccent(mostRecentCourse.id)}20`,
                border: `1px solid ${courseAccent(mostRecentCourse.id)}33`,
              }}
            >
              <BookOpen
                size={18}
                style={{ color: courseAccent(mostRecentCourse.id) }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-xs mb-0.5"
                style={{ color: "var(--bauhaus-card-inscription-sub)" }}
              >
                Pick up where you left off
              </p>
              <p
                className="text-sm font-medium truncate"
                style={{ color: "var(--bauhaus-card-inscription-main)" }}
              >
                {mostRecentCourse.title}
              </p>
              <div
                className="mt-1.5 h-1 rounded-full overflow-hidden"
                style={{ backgroundColor: "var(--bauhaus-card-separator)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${mostRecentCourse.progress}%`,
                    backgroundColor: courseAccent(mostRecentCourse.id),
                  }}
                />
              </div>
            </div>
            <button
              onClick={() => navigate(`/courses/${mostRecentCourse.id}`)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium flex-shrink-0 transition-all hover:opacity-80"
              style={{
                backgroundColor: `${courseAccent(mostRecentCourse.id)}20`,
                color: courseAccent(mostRecentCourse.id),
                border: `1px solid ${courseAccent(mostRecentCourse.id)}33`,
              }}
            >
              <PlayCircle size={14} />
              Continue
            </button>
          </div>
        )}
      </div>

      {/* Stat cards — Bug 2 fix: was "grid grid-cols-4" → grid-cols-2 md:grid-cols-4 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        {stats.map(({ label, value, change, icon: Icon, accentColor }) => (
          <div
            key={label}
            className="rounded-xl p-4 md:p-5 hover:scale-[1.02] hover:shadow-md transition-all duration-200"
            style={CARD_STYLE}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 md:mb-4"
              style={{
                backgroundColor: `${accentColor}22`,
                border: `1px solid ${accentColor}44`,
              }}
            >
              <Icon size={18} style={{ color: accentColor }} />
            </div>
            <p
              className="font-bold text-xl md:text-2xl"
              style={{ color: "var(--bauhaus-card-inscription-main)" }}
            >
              {value}
            </p>
            <p
              className="text-xs mt-0.5"
              style={{ color: "var(--bauhaus-card-inscription-sub)" }}
            >
              {label}
            </p>
            <p
              className="text-xs mt-2 flex items-center gap-1"
              style={{ color: accentColor }}
            >
              <TrendingUp size={10} /> {change}
            </p>
          </div>
        ))}
      </div>

      {/* BauhausCard course row */}
      <div className="mb-6 md:mb-8">
        <h2
          className="font-semibold mb-4"
          style={{ color: "var(--bauhaus-card-inscription-main)" }}
        >
          My Courses
        </h2>
        {enrolledCourses.length === 0 ? (
          <div className="rounded-xl p-8 text-center" style={CARD_STYLE}>
            <p
              className="text-sm"
              style={{ color: "var(--bauhaus-card-inscription-sub)" }}
            >
              No courses enrolled yet. Enroll in a course to see it here.
            </p>
          </div>
        ) : (
          <div className="flex gap-6 overflow-x-auto pb-2">
            {enrolledCourses.map((c) => (
              <div key={c.id} className="flex-shrink-0">
                <BauhausCard
                  id={String(c.id)}
                  accentColor={courseAccent(c.id)}
                  topInscription={`${c.modulesCompleted}/${c.modules} modules`}
                  mainText={c.title}
                  subMainText={
                    c.currentScore !== null
                      ? `Current score: ${c.currentScore}%`
                      : "Not started yet"
                  }
                  progressBarInscription="Progress:"
                  progress={c.progress}
                  progressValue={`${c.progress}%`}
                  filledButtonInscription="Continue"
                  outlinedButtonInscription="Details"
                  onFilledButtonClick={() => navigate(`/courses/${c.id}`)}
                  onOutlinedButtonClick={() => navigate("/courses")}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Course progress + weekly activity — stack on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
        <div
          className="md:col-span-2 rounded-2xl p-5 md:p-6"
          style={CARD_STYLE}
        >
          <div className="flex items-center gap-2 mb-5">
            <BarChart2 size={18} className="text-primary" />
            <h2
              className="font-semibold"
              style={{ color: "var(--bauhaus-card-inscription-main)" }}
            >
              Course Progress
            </h2>
          </div>
          {enrolledCourses.length === 0 && (
            <p
              className="text-sm py-4 text-center"
              style={{ color: "var(--bauhaus-card-inscription-sub)" }}
            >
              Enroll in a course to track your progress here.
            </p>
          )}
          <div className="space-y-5">
            {enrolledCourses.map((c) => (
              <div key={c.title}>
                <div className="flex items-center justify-between mb-1.5">
                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--bauhaus-card-inscription-main)" }}
                  >
                    {c.title}
                  </p>
                  <div
                    className="flex items-center gap-3 text-xs"
                    style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                  >
                    <span>
                      {c.modulesCompleted}/{c.modules} modules
                    </span>
                    {c.currentScore !== null && (
                      <span
                        className="font-medium"
                        style={{ color: "#10B981" }}
                      >
                        {c.currentScore}%
                      </span>
                    )}
                    <span
                      className="font-medium"
                      style={{ color: courseAccent(c.id) }}
                    >
                      {c.progress}%
                    </span>
                  </div>
                </div>
                <div
                  className="h-2 rounded-full overflow-hidden"
                  style={PROGRESS_TRACK}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${c.progress}%`,
                      backgroundColor: courseAccent(c.id),
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-5 md:p-6" style={CARD_STYLE}>
          <h2
            className="font-semibold mb-5"
            style={{ color: "var(--bauhaus-card-inscription-main)" }}
          >
            Weekly Activity
          </h2>
          <div className="flex items-center justify-center h-32">
            <p
              className="text-sm text-center"
              style={{ color: "var(--bauhaus-card-inscription-sub)" }}
            >
              Activity tracking will appear here once you start learning.
            </p>
          </div>
        </div>
      </div>

      {/* Achievements — was: grid-cols-4 → grid-cols-2 md:grid-cols-4 */}
      <div className="rounded-2xl p-5 md:p-6 mb-6 md:mb-8" style={CARD_STYLE}>
        <h2
          className="font-semibold mb-5"
          style={{ color: "var(--bauhaus-card-inscription-main)" }}
        >
          Achievements
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[
            {
              label: "First Course",
              desc: "Complete your first course",
              earned: enrolledCourses.some((c) => c.progress === 100),
              color: "#6366F1",
            },
            {
              label: "Week Streak",
              desc: "7-day learning streak",
              earned: false,
              color: "#10B981",
            },
            {
              label: "High Scorer",
              desc: "Score 90%+ on any quiz",
              earned: avgScore >= 90,
              color: "#F59E0B",
            },
            {
              label: "AWS Ready",
              desc: "Complete AWS Fundamentals",
              earned: false,
              color: "#8f10f6",
            },
          ].map(({ label, desc, earned, color }) => (
            <div
              key={label}
              className="p-4 rounded-xl text-center"
              style={{
                backgroundColor: earned
                  ? `${color}18`
                  : "var(--bauhaus-card-bg)",
                border: `1px solid ${earned ? `${color}33` : "var(--bauhaus-card-separator)"}`,
                opacity: earned ? 1 : 0.55,
              }}
            >
              <div className="text-2xl mb-2">{earned ? "🏆" : "🔒"}</div>
              <p
                className="text-sm font-medium"
                style={{ color: "var(--bauhaus-card-inscription-main)" }}
              >
                {label}
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: "var(--bauhaus-card-inscription-sub)" }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Tips Accordion */}
      <div className="max-w-2xl">
        <h2
          className="font-semibold mb-1"
          style={{ color: "var(--bauhaus-card-inscription-main)" }}
        >
          Learning Tips
        </h2>
        <p
          className="text-sm mb-6"
          style={{ color: "var(--bauhaus-card-inscription-sub)" }}
        >
          Study strategies that accelerate progress
        </p>
        <AccordionComponent items={LEARNING_TIPS} />
      </div>
    </div>
  );
}
