import { Link } from "react-router-dom";
import {
  Users,
  BookOpen,
  FileText,
  ClipboardList,
  TrendingUp,
  AlertCircle,
  Megaphone,
  ArrowRight,
} from "lucide-react";
import { useApp } from "../../store/AppContext";
import { GradientButton } from "@/components/ui/gradient-button";

const CARD_STYLE = {
  backgroundColor: "var(--bauhaus-card-bg)",
  border: "1px solid var(--bauhaus-card-separator)",
};
const PROGRESS_TRACK = {
  backgroundColor: "var(--bauhaus-card-progress-bar-bg)",
};

const ACCENT_COLORS = ["#24d200", "#156ef6", "#fc6800", "#8f10f6"];

export default function AdminDashboard() {
  const { courses, students, assignments, exams, announcements } = useApp();

  const activeStudents = students.filter((s) => s.status === "active").length;
  const publishedCourses = courses.filter((c) => c.published).length;
  const pendingAssignments = assignments.filter(
    (a) => a.status === "pending" || a.status === "in-progress",
  ).length;
  const upcomingExams = exams.filter((e) => e.status === "upcoming").length;

  const stats = [
    {
      label: "Active Students",
      value: activeStudents,
      total: students.length,
      icon: Users,
      accentColor: ACCENT_COLORS[0],
      link: "/admin/students",
    },
    {
      label: "Published Courses",
      value: publishedCourses,
      total: courses.length,
      icon: BookOpen,
      accentColor: ACCENT_COLORS[1],
      link: "/admin/courses",
    },
    {
      label: "Open Assignments",
      value: pendingAssignments,
      total: assignments.length,
      icon: FileText,
      accentColor: ACCENT_COLORS[2],
      link: "/admin/assignments",
    },
    {
      label: "Upcoming Exams",
      value: upcomingExams,
      total: exams.length,
      icon: ClipboardList,
      accentColor: ACCENT_COLORS[3],
      link: "/admin/exams",
    },
  ];

  const avgScore =
    students.length > 0
      ? Math.round(
          students.reduce((sum, s) => sum + s.avgScore, 0) / students.length,
        )
      : 0;

  const totalEnrollments = courses.reduce(
    (sum, c) => sum + c.studentsEnrolled,
    0,
  );

  return (
    <div className="p-4 md:p-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <p
            className="text-sm mb-1"
            style={{ color: "var(--bauhaus-card-inscription-sub)" }}
          >
            Friday, March 6, 2026
          </p>
          <h1
            className="text-2xl md:text-3xl font-bold"
            style={{ color: "var(--bauhaus-card-inscription-main)" }}
          >
            Admin Dashboard
          </h1>
          <p
            className="mt-1"
            style={{ color: "var(--bauhaus-card-inscription-sub)" }}
          >
            Platform overview — {students.length} students, {courses.length}{" "}
            courses.
          </p>
        </div>
        <GradientButton>Export Report</GradientButton>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        {stats.map(({ label, value, total, icon: Icon, accentColor, link }) => (
          <Link
            key={label}
            to={link}
            className="group rounded-2xl p-5 hover:scale-[1.02] transition-all"
            style={CARD_STYLE}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{
                backgroundColor: `${accentColor}22`,
                border: `1px solid ${accentColor}44`,
              }}
            >
              <Icon size={18} style={{ color: accentColor }} />
            </div>
            <p
              className="text-2xl font-bold"
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
              className="text-xs mt-1 opacity-60"
              style={{ color: "var(--bauhaus-card-inscription-sub)" }}
            >
              {total} total
            </p>
          </Link>
        ))}
      </div>

      {/* Secondary metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
        {[
          {
            icon: TrendingUp,
            accentColor: "#156ef6",
            label: "Platform Avg Score",
            value: `${avgScore}`,
            suffix: "/100",
          },
          {
            icon: BookOpen,
            accentColor: "#24d200",
            label: "Total Enrollments",
            value: `${totalEnrollments}`,
            suffix: "",
          },
          {
            icon: AlertCircle,
            accentColor: "#fc6800",
            label: "Inactive Students",
            value: `${students.filter((s) => s.status === "inactive").length}`,
            suffix: "",
          },
        ].map(({ icon: Icon, accentColor, label, value, suffix }) => (
          <div key={label} className="rounded-2xl p-5" style={CARD_STYLE}>
            <div className="flex items-center gap-2 mb-2">
              <Icon size={16} style={{ color: accentColor }} />
              <p
                className="text-xs font-medium uppercase tracking-wide"
                style={{ color: "var(--bauhaus-card-inscription-sub)" }}
              >
                {label}
              </p>
            </div>
            <p
              className="text-3xl font-bold"
              style={{ color: "var(--bauhaus-card-inscription-main)" }}
            >
              {value}
              {suffix && (
                <span
                  className="text-lg"
                  style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                >
                  {suffix}
                </span>
              )}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Announcements */}
        <div
          className="md:col-span-2 rounded-2xl p-5 md:p-6"
          style={CARD_STYLE}
        >
          <div className="flex items-center justify-between mb-5">
            <h2
              className="font-semibold flex items-center gap-2"
              style={{ color: "var(--bauhaus-card-inscription-main)" }}
            >
              <Megaphone size={16} style={{ color: "#156ef6" }} />
              Recent Announcements
            </h2>
            <Link
              to="/admin/announcements"
              className="text-sm flex items-center gap-1 hover:text-primary hover:underline transition-colors duration-150"
              style={{ color: "var(--bauhaus-card-inscription-top)" }}
            >
              Manage <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {announcements.slice(0, 4).map((a) => {
              const dotColor =
                a.type === "warning"
                  ? "#fc6800"
                  : a.type === "success"
                    ? "#24d200"
                    : a.type === "event"
                      ? "#8f10f6"
                      : "#156ef6";
              return (
                <div
                  key={a.id}
                  className="flex items-start gap-3 p-3 rounded-xl"
                  style={{
                    backgroundColor: `${dotColor}0d`,
                    border: `1px solid ${dotColor}22`,
                  }}
                >
                  <div
                    className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                    style={{ backgroundColor: dotColor }}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium truncate"
                      style={{ color: "var(--bauhaus-card-inscription-main)" }}
                    >
                      {a.title}
                    </p>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                    >
                      {a.createdAt} · by {a.author}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top courses */}
        <div className="rounded-2xl p-6" style={CARD_STYLE}>
          <div className="flex items-center justify-between mb-5">
            <h2
              className="text-sm font-semibold"
              style={{ color: "var(--bauhaus-card-inscription-main)" }}
            >
              Top Courses
            </h2>
            <Link
              to="/admin/courses"
              className="text-xs flex items-center gap-1 hover:text-primary hover:underline transition-colors duration-150"
              style={{ color: "var(--bauhaus-card-inscription-top)" }}
            >
              All <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-4">
            {[...courses]
              .sort((a, b) => b.studentsEnrolled - a.studentsEnrolled)
              .slice(0, 4)
              .map((c, i) => (
                <div key={c.id}>
                  <div className="flex items-center justify-between mb-1">
                    <p
                      className="text-xs font-medium truncate max-w-[140px]"
                      style={{ color: "var(--bauhaus-card-inscription-main)" }}
                    >
                      {c.title}
                    </p>
                    <span
                      className="text-xs"
                      style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                    >
                      {c.studentsEnrolled}
                    </span>
                  </div>
                  <div
                    className="h-1.5 rounded-full overflow-hidden"
                    style={PROGRESS_TRACK}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.round((c.studentsEnrolled / (courses[0]?.studentsEnrolled || 1)) * 100)}%`,
                        backgroundColor:
                          ACCENT_COLORS[i % ACCENT_COLORS.length],
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
