import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  LayoutDashboard,
  FileText,
  ClipboardList,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { BauhausCard } from "@/components/ui/bauhaus-card";
import { useApp } from "@/store/AppContext";
import { useAuth } from "@/store/AuthContext";

const CARD_STYLE = {
  backgroundColor: "var(--bauhaus-card-bg)",
  border: "1px solid var(--bauhaus-card-separator)",
};

const ACCENT_POOL = [
  "#156ef6",
  "#24d200",
  "#fc6800",
  "#8f10f6",
  "#00b4d8",
  "#e91e8c",
];
const courseAccent = (id: number) => ACCENT_POOL[(id - 1) % ACCENT_POOL.length];

const TYPE_COLOR: Record<string, string> = {
  info: "#156ef6",
  success: "#24d200",
  warning: "#fc6800",
  event: "#8f10f6",
};

export default function Home() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { courses, assignments, exams, announcements } = useApp();

  const enrolledCourses = courses.filter((c) => c.enrolled);
  const overallProgress = enrolledCourses.length
    ? Math.round(
        enrolledCourses.reduce((s, c) => s + c.progress, 0) /
          enrolledCourses.length,
      )
    : 0;

  const pendingCount = assignments.filter(
    (a) => a.status === "pending" || a.status === "in-progress",
  ).length;
  const upcomingExams = exams.filter((e) => e.status === "upcoming").length;

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const quickLinks = [
    {
      to: "/courses",
      icon: BookOpen,
      label: "My Courses",
      desc: `${enrolledCourses.length} active`,
      accentColor: "#156ef6",
    },
    {
      to: "/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      desc: "View progress",
      accentColor: "#24d200",
    },
    {
      to: "/homework",
      icon: FileText,
      label: "Homework",
      desc: `${pendingCount} due soon`,
      accentColor: "#fc6800",
    },
    {
      to: "/exams",
      icon: ClipboardList,
      label: "Exams",
      desc: `${upcomingExams} upcoming`,
      accentColor: "#8f10f6",
    },
  ];

  const recentCourses = enrolledCourses.slice(0, 3);
  const recentAnnouncements = announcements.slice(0, 3);

  return (
    <div className="p-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <p
          className="text-sm mb-1"
          style={{ color: "var(--bauhaus-card-inscription-sub)" }}
        >
          {today}
        </p>
        {/* Bug 9 fix: was "text-3xl" — too large on mobile → text-2xl md:text-3xl */}
        <h1
          className="text-2xl md:text-3xl font-bold"
          style={{ color: "var(--bauhaus-card-inscription-main)" }}
        >
          Your Learning Organized in{" "}
          <span className="bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
            One Place
          </span>
        </h1>
        <p
          className="mt-1"
          style={{ color: "var(--bauhaus-card-inscription-sub)" }}
        >
          Welcome back, {currentUser?.name?.split(" ")[0] ?? "there"}. Keep the
          momentum going.
        </p>
      </div>

      {/* Progress summary strip */}
      <div
        className="rounded-2xl p-5 mb-8 flex items-center gap-8"
        style={CARD_STYLE}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              backgroundColor: "#156ef622",
              border: "1px solid #156ef644",
            }}
          >
            <TrendingUp size={18} style={{ color: "#156ef6" }} />
          </div>
          <div>
            <p
              className="font-bold text-xl"
              style={{ color: "var(--bauhaus-card-inscription-main)" }}
            >
              {overallProgress}%
            </p>
            <p
              className="text-xs"
              style={{ color: "var(--bauhaus-card-inscription-sub)" }}
            >
              Overall Progress
            </p>
          </div>
        </div>
        <div
          className="flex-1 h-px"
          style={{ backgroundColor: "var(--bauhaus-card-separator)" }}
        />
        {[
          { value: String(enrolledCourses.length), label: "Active Courses" },
          { value: String(pendingCount), label: "Pending Tasks" },
          { value: String(upcomingExams), label: "Upcoming Exams" },
        ].map(({ value, label }, i) => (
          <div key={label} className="flex items-center gap-8">
            {i > 0 && (
              <div
                className="w-px h-8"
                style={{ backgroundColor: "var(--bauhaus-card-separator)" }}
              />
            )}
            <div className="text-center">
              <p
                className="font-bold text-xl"
                style={{ color: "var(--bauhaus-card-inscription-main)" }}
              >
                {value}
              </p>
              <p
                className="text-xs"
                style={{ color: "var(--bauhaus-card-inscription-sub)" }}
              >
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {quickLinks.map(({ to, icon: Icon, label, desc, accentColor }) => (
          <Link
            key={to}
            to={to}
            className="group rounded-xl p-4 hover:scale-105 hover:shadow-lg hover:shadow-primary/10 transition-all duration-200"
            style={CARD_STYLE}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
              style={{
                backgroundColor: `${accentColor}22`,
                border: `1px solid ${accentColor}44`,
              }}
            >
              <Icon size={18} style={{ color: accentColor }} />
            </div>
            <p
              className="text-sm font-medium"
              style={{ color: "var(--bauhaus-card-inscription-main)" }}
            >
              {label}
            </p>
            <p
              className="text-xs mt-0.5"
              style={{ color: "var(--bauhaus-card-inscription-sub)" }}
            >
              {desc}
            </p>
          </Link>
        ))}
      </div>

      {/* Continue Learning — BauhausCards */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-5">
          <h2
            className="font-semibold"
            style={{ color: "var(--bauhaus-card-inscription-main)" }}
          >
            Continue Learning
          </h2>
          <Link
            to="/courses"
            className="text-sm flex items-center gap-1 hover:opacity-70 transition-opacity"
            style={{ color: "var(--bauhaus-card-inscription-top)" }}
          >
            All courses <ArrowRight size={14} />
          </Link>
        </div>
        {recentCourses.length === 0 ? (
          <div className="rounded-xl p-8 text-center" style={CARD_STYLE}>
            <p
              className="text-sm"
              style={{ color: "var(--bauhaus-card-inscription-sub)" }}
            >
              No courses enrolled yet.{" "}
              <Link
                to="/courses"
                className="underline"
                style={{ color: "var(--bauhaus-card-inscription-top)" }}
              >
                Browse courses
              </Link>{" "}
              to get started.
            </p>
          </div>
        ) : (
          <div className="flex gap-6 overflow-x-auto pb-2">
            {recentCourses.map((course) => (
              <div key={course.id} className="flex-shrink-0">
                <BauhausCard
                  id={String(course.id)}
                  accentColor={courseAccent(course.id)}
                  topInscription={`${course.modules - course.modulesCompleted} modules left`}
                  mainText={course.title}
                  subMainText={`Module ${course.modulesCompleted + 1} of ${course.modules}`}
                  progressBarInscription="Progress:"
                  progress={course.progress}
                  progressValue={`${course.progress}%`}
                  filledButtonInscription="Continue"
                  outlinedButtonInscription="Details"
                  onFilledButtonClick={() => navigate(`/courses/${course.id}`)}
                  onOutlinedButtonClick={() => navigate("/courses")}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Announcements */}
      <div className="rounded-2xl p-6 max-w-md" style={CARD_STYLE}>
        <h2
          className="font-semibold mb-5"
          style={{ color: "var(--bauhaus-card-inscription-main)" }}
        >
          Announcements
        </h2>
        {recentAnnouncements.length === 0 ? (
          <p
            className="text-sm py-2"
            style={{ color: "var(--bauhaus-card-inscription-sub)" }}
          >
            No announcements yet.
          </p>
        ) : (
          <div className="space-y-4">
            {recentAnnouncements.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div
                  className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                  style={{
                    backgroundColor: TYPE_COLOR[item.type] ?? "#156ef6",
                  }}
                />
                <div>
                  <p
                    className="text-sm leading-snug"
                    style={{ color: "var(--bauhaus-card-inscription-main)" }}
                  >
                    {item.title}
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                  >
                    {item.createdAt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
