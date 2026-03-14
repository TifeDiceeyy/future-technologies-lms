import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart2,
  Bell,
  Monitor,
  Eye,
  Search,
  BookOpen,
  Clock,
  ArrowRight,
} from "lucide-react";
import { AccordionComponent } from "@/components/ui/icon-accordion";
import { useApp } from "@/store/AppContext";

const WHAT_YOULL_LEARN = [
  {
    title: "Course Tracking",
    description: "Monitor your progress across all enrolled courses",
    icon: BarChart2,
    iconBg: "bg-blue-100 dark:bg-blue-900",
  },
  {
    title: "Assignment Alerts",
    description: "Never miss a deadline with smart notifications",
    icon: Bell,
    iconBg: "bg-yellow-100 dark:bg-yellow-900",
  },
  {
    title: "Live Sessions",
    description: "Join interactive live classes with your tutors",
    icon: Monitor,
    iconBg: "bg-green-100 dark:bg-green-900",
  },
  {
    title: "Progress Reports",
    description: "Detailed analytics on your learning performance",
    icon: Eye,
    iconBg: "bg-purple-100 dark:bg-purple-900",
  },
];

const ACCENT_POOL = [
  "#6366F1",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#06B6D4",
  "#EC4899",
];
const courseAccent = (id: number) => ACCENT_POOL[(id - 1) % ACCENT_POOL.length];

const FILTER_TABS = ["All", "Enrolled", "Available", "Completed"];

const CARD_STYLE = {
  backgroundColor: "var(--bauhaus-card-bg)",
  border: "1px solid var(--bauhaus-card-separator)",
};

export default function Courses() {
  const navigate = useNavigate();
  const { courses } = useApp();
  const [activeFilter, setActiveFilter] = useState("All");
  const [query, setQuery] = useState("");

  const enrolledCourses = courses.filter((c) => c.enrolled);
  const availableCourses = courses.filter((c) => !c.enrolled);
  const completedCourses = courses.filter(
    (c) => c.enrolled && c.progress === 100,
  );

  const filtered = (() => {
    let base =
      activeFilter === "Enrolled"
        ? enrolledCourses
        : activeFilter === "Available"
          ? availableCourses
          : activeFilter === "Completed"
            ? completedCourses
            : courses;
    if (query.trim()) {
      const q = query.toLowerCase();
      base = base.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q),
      );
    }
    return base;
  })();

  return (
    <div className="p-4 md:p-8 max-w-6xl">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1
          className="text-2xl md:text-3xl font-bold"
          style={{ color: "var(--bauhaus-card-inscription-main)" }}
        >
          My Courses
        </h1>
        <p
          className="mt-1 text-sm"
          style={{ color: "var(--bauhaus-card-inscription-sub)" }}
        >
          Browse and continue your learning journey.
        </p>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          {
            label: "Total",
            value: courses.length,
            color: "#6366F1",
          },
          {
            label: "Enrolled",
            value: enrolledCourses.length,
            color: "#10B981",
          },
          {
            label: "Available",
            value: availableCourses.length,
            color: "#F59E0B",
          },
          {
            label: "Completed",
            value: completedCourses.length,
            color: "#06B6D4",
          },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="rounded-xl p-4 text-center"
            style={CARD_STYLE}
          >
            <p
              className="text-2xl font-bold"
              style={{ color: "var(--bauhaus-card-inscription-main)" }}
            >
              {value}
            </p>
            <p className="text-xs mt-0.5 font-medium" style={{ color }}>
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Search + filter row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2"
            style={{ color: "var(--bauhaus-card-inscription-sub)" }}
          />
          <input
            type="text"
            placeholder="Search courses…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl text-sm focus:outline-none focus:ring-1 transition-colors"
            style={{
              ...CARD_STYLE,
              color: "var(--bauhaus-card-inscription-main)",
            }}
          />
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap hide-scrollbar">
          {FILTER_TABS.map((tab) => {
            const active = activeFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className="flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:opacity-90"
                style={
                  active
                    ? {
                        backgroundColor: "#6366F122",
                        border: "1px solid #6366F155",
                        color: "#6366F1",
                      }
                    : {
                        ...CARD_STYLE,
                        color: "var(--bauhaus-card-inscription-sub)",
                      }
                }
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Course grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-12">
          {filtered.map((course) => {
            const accent = courseAccent(course.id);
            const isEnrolled = course.enrolled;
            return (
              <div
                key={course.id}
                className="rounded-2xl overflow-hidden hover:scale-[1.02] hover:shadow-lg transition-all duration-200 cursor-pointer"
                style={CARD_STYLE}
                onClick={() => navigate(`/courses/${course.id}`)}
              >
                {/* Color bar */}
                <div
                  className="h-1.5 w-full"
                  style={{ backgroundColor: accent }}
                />

                <div className="p-5">
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: `${accent}20`,
                        border: `1px solid ${accent}33`,
                      }}
                    >
                      <BookOpen size={18} style={{ color: accent }} />
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {/* Free / Paid badge */}
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded-full"
                        style={
                          course.isPaid
                            ? {
                                backgroundColor: "#F59E0B18",
                                color: "#F59E0B",
                                border: "1px solid #F59E0B33",
                              }
                            : {
                                backgroundColor: "#10B98118",
                                color: "#10B981",
                                border: "1px solid #10B98133",
                              }
                        }
                      >
                        {course.isPaid ? "Paid" : "Free"}
                      </span>
                      {/* Enrolled / Available badge */}
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: isEnrolled
                            ? "#10B98120"
                            : "#6366F120",
                          color: isEnrolled ? "#10B981" : "#6366F1",
                          border: `1px solid ${isEnrolled ? "#10B98133" : "#6366F133"}`,
                        }}
                      >
                        {isEnrolled ? "Enrolled" : "Available"}
                      </span>
                    </div>
                  </div>

                  {/* Title + desc */}
                  <h3
                    className="font-semibold mb-1 leading-snug"
                    style={{ color: "var(--bauhaus-card-inscription-main)" }}
                  >
                    {course.title}
                  </h3>
                  <p
                    className="text-xs mb-4 line-clamp-2"
                    style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                  >
                    {course.description}
                  </p>

                  {/* Meta row */}
                  <div
                    className="flex items-center gap-3 text-xs mb-4"
                    style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                  >
                    <span className="flex items-center gap-1">
                      <BookOpen size={11} />
                      {course.modules} modules
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {course.level}
                    </span>
                  </div>

                  {/* Progress bar */}
                  {isEnrolled && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className="text-xs"
                          style={{
                            color: "var(--bauhaus-card-inscription-sub)",
                          }}
                        >
                          Progress
                        </span>
                        <span
                          className="text-xs font-medium"
                          style={{ color: accent }}
                        >
                          {course.progress}%
                        </span>
                      </div>
                      <div
                        className="h-1.5 rounded-full overflow-hidden"
                        style={{
                          backgroundColor: "var(--bauhaus-card-separator)",
                        }}
                      >
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${course.progress}%`,
                            backgroundColor: accent,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  <button
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-90"
                    style={{
                      backgroundColor: `${accent}18`,
                      color: accent,
                      border: `1px solid ${accent}33`,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/courses/${course.id}`);
                    }}
                  >
                    {isEnrolled ? "Continue" : "View Course"}
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <BookOpen
            size={40}
            className="mx-auto mb-4"
            style={{ color: "var(--bauhaus-card-separator)" }}
          />
          <p style={{ color: "var(--bauhaus-card-inscription-sub)" }}>
            No courses found.
          </p>
        </div>
      )}

      {/* What You'll Learn */}
      <div className="mt-4 max-w-2xl">
        <h2
          className="text-xl font-bold mb-1"
          style={{ color: "var(--bauhaus-card-inscription-main)" }}
        >
          What You'll Learn
        </h2>
        <p
          className="text-sm mb-6"
          style={{ color: "var(--bauhaus-card-inscription-sub)" }}
        >
          Everything included with your courses
        </p>
        <AccordionComponent items={WHAT_YOULL_LEARN} />
      </div>
    </div>
  );
}
