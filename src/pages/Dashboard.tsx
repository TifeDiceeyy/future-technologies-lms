import {
  TrendingUp,
  Award,
  BookOpen,
  Clock,
  Target,
  BarChart2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BauhausCard } from "@/components/ui/bauhaus-card";
import { AccordionComponent } from "@/components/ui/icon-accordion";

const CARD_STYLE = {
  backgroundColor: "var(--bauhaus-card-bg)",
  border: "1px solid var(--bauhaus-card-separator)",
};

const PROGRESS_TRACK = {
  backgroundColor: "var(--bauhaus-card-progress-bar-bg)",
};

const stats = [
  {
    label: "Courses Enrolled",
    value: "4",
    change: "+1 this month",
    icon: BookOpen,
    accentColor: "#156ef6",
  },
  {
    label: "Hours Learned",
    value: "47h",
    change: "+12h this week",
    icon: Clock,
    accentColor: "#24d200",
  },
  {
    label: "Avg. Score",
    value: "88%",
    change: "+3% from last month",
    icon: Target,
    accentColor: "#fc6800",
  },
  {
    label: "Certificates",
    value: "3",
    change: "2 in progress",
    icon: Award,
    accentColor: "#8f10f6",
  },
];

const courses = [
  {
    id: "1",
    title: "AWS Cloud Fundamentals",
    progress: 68,
    score: 91,
    modules: 12,
    done: 8,
    accentColor: "#156ef6",
  },
  {
    id: "2",
    title: "React + TypeScript Mastery",
    progress: 42,
    score: 85,
    modules: 10,
    done: 4,
    accentColor: "#24d200",
  },
  {
    id: "3",
    title: "Python for Data Science",
    progress: 15,
    score: 78,
    modules: 14,
    done: 2,
    accentColor: "#fc6800",
  },
  {
    id: "4",
    title: "Terraform Infrastructure",
    progress: 5,
    score: null,
    modules: 8,
    done: 0,
    accentColor: "#8f10f6",
  },
];

const weeklyActivity = [
  { day: "Mon", hours: 2.5 },
  { day: "Tue", hours: 1 },
  { day: "Wed", hours: 3.5 },
  { day: "Thu", hours: 2 },
  { day: "Fri", hours: 4 },
  { day: "Sat", hours: 1.5 },
  { day: "Sun", hours: 0.5 },
];
const maxHours = Math.max(...weeklyActivity.map((d) => d.hours));

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

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-8">
        <h1
          className="text-3xl font-bold"
          style={{ color: "var(--bauhaus-card-inscription-main)" }}
        >
          Dashboard
        </h1>
        <p
          className="mt-1"
          style={{ color: "var(--bauhaus-card-inscription-sub)" }}
        >
          Your full learning overview, all in one place.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, change, icon: Icon, accentColor }) => (
          <div
            key={label}
            className="rounded-xl p-5 hover:scale-[1.02] hover:shadow-md transition-all duration-200"
            style={CARD_STYLE}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
              style={{
                backgroundColor: `${accentColor}22`,
                border: `1px solid ${accentColor}44`,
              }}
            >
              <Icon size={18} style={{ color: accentColor }} />
            </div>
            <p
              className="font-bold text-2xl"
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
      <div className="mb-8">
        <h2
          className="font-semibold mb-4"
          style={{ color: "var(--bauhaus-card-inscription-main)" }}
        >
          My Courses
        </h2>
        <div className="flex gap-6 overflow-x-auto pb-2">
          {courses.map((c) => (
            <div key={c.id} className="flex-shrink-0">
              <BauhausCard
                id={c.id}
                accentColor={c.accentColor}
                topInscription={`${c.done}/${c.modules} modules`}
                mainText={c.title}
                subMainText={
                  c.score !== null
                    ? `Current score: ${c.score}%`
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
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Course progress detail */}
        <div className="col-span-2 rounded-2xl p-6" style={CARD_STYLE}>
          <div className="flex items-center gap-2 mb-5">
            <BarChart2 size={18} className="text-primary" />
            <h2
              className="font-semibold"
              style={{ color: "var(--bauhaus-card-inscription-main)" }}
            >
              Course Progress
            </h2>
          </div>
          <div className="space-y-5">
            {courses.map((c) => (
              <div key={c.title}>
                <div className="flex items-center justify-between mb-1.5">
                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--bauhaus-card-inscription-main)" }}
                  >
                    {c.title}
                  </p>
                  <div
                    className="flex items-center gap-4 text-xs"
                    style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                  >
                    <span>
                      {c.done}/{c.modules} modules
                    </span>
                    {c.score !== null && (
                      <span
                        className="font-medium"
                        style={{ color: "#24d200" }}
                      >
                        {c.score}%
                      </span>
                    )}
                    <span
                      className="font-medium"
                      style={{ color: c.accentColor }}
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
                      backgroundColor: c.accentColor,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly activity */}
        <div className="rounded-2xl p-6" style={CARD_STYLE}>
          <h2
            className="font-semibold mb-5"
            style={{ color: "var(--bauhaus-card-inscription-main)" }}
          >
            Weekly Activity
          </h2>
          <div className="flex items-end gap-2 h-32">
            {weeklyActivity.map(({ day, hours }) => (
              <div
                key={day}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <div
                  className="w-full flex items-end justify-center"
                  style={{ height: "96px" }}
                >
                  <div
                    className="w-full rounded-t-sm opacity-80 hover:opacity-100 transition-all"
                    style={{
                      height: `${(hours / maxHours) * 96}px`,
                      backgroundColor: "#156ef6",
                    }}
                  />
                </div>
                <p
                  className="text-xs"
                  style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                >
                  {day}
                </p>
              </div>
            ))}
          </div>
          <p
            className="text-xs mt-4 text-center"
            style={{ color: "var(--bauhaus-card-inscription-sub)" }}
          >
            15h total this week
          </p>
        </div>
      </div>

      {/* Achievements */}
      <div className="rounded-2xl p-6 mb-8" style={CARD_STYLE}>
        <h2
          className="font-semibold mb-5"
          style={{ color: "var(--bauhaus-card-inscription-main)" }}
        >
          Achievements
        </h2>
        <div className="grid grid-cols-4 gap-4">
          {[
            {
              label: "First Course",
              desc: "Completed your first course",
              earned: true,
              color: "#156ef6",
            },
            {
              label: "Week Streak",
              desc: "7-day learning streak",
              earned: true,
              color: "#24d200",
            },
            {
              label: "High Scorer",
              desc: "Score 90%+ on any quiz",
              earned: true,
              color: "#fc6800",
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
