import { useState } from "react";
import { CalendarCheck, Filter } from "lucide-react";
import { useApp } from "../../store/AppContext";

const CARD_STYLE = {
  backgroundColor: "var(--bauhaus-card-bg)",
  border: "1px solid var(--bauhaus-card-separator)",
};

const statusConfig = {
  good: {
    label: "Good",
    color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  },
  warning: {
    label: "Warning",
    color: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  },
  critical: {
    label: "Critical",
    color: "text-rose-400 bg-rose-400/10 border-rose-400/20",
  },
};

export default function AttendanceOverview() {
  const { attendance, courses } = useApp();
  const [courseFilter, setCourseFilter] = useState<number | "all">("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "good" | "warning" | "critical"
  >("all");

  const uniqueCourses = Array.from(
    new Map(attendance.map((a) => [a.courseId, a.courseName])).entries(),
  );

  const filtered = attendance.filter((a) => {
    const matchCourse = courseFilter === "all" || a.courseId === courseFilter;
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    return matchCourse && matchStatus;
  });

  // Summary stats
  const goodCount = attendance.filter((a) => a.status === "good").length;
  const warningCount = attendance.filter((a) => a.status === "warning").length;
  const criticalCount = attendance.filter(
    (a) => a.status === "critical",
  ).length;
  const avgPct =
    attendance.length > 0
      ? Math.round(
          attendance.reduce(
            (sum, a) => sum + (a.total > 0 ? (a.present / a.total) * 100 : 100),
            0,
          ) / attendance.length,
        )
      : 0;

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-8">
        <h1
          className="text-3xl font-bold"
          style={{ color: "var(--bauhaus-card-inscription-main)" }}
        >
          Attendance Overview
        </h1>
        <p
          className="mt-1"
          style={{ color: "var(--bauhaus-card-inscription-sub)" }}
        >
          {attendance.length} records across {courses.length} courses
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Avg Attendance",
            value: `${avgPct}%`,
            accentColor: "#156ef6",
          },
          { label: "Good (≥80%)", value: goodCount, accentColor: "#24d200" },
          {
            label: "Warning (60–79%)",
            value: warningCount,
            accentColor: "#fc6800",
          },
          {
            label: "Critical (<60%)",
            value: criticalCount,
            accentColor: "#fc6800",
          },
        ].map(({ label, value, accentColor }) => (
          <div key={label} className="rounded-xl p-4" style={CARD_STYLE}>
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center mb-2"
              style={{
                backgroundColor: `${accentColor}22`,
                border: `1px solid ${accentColor}44`,
              }}
            >
              <CalendarCheck size={15} style={{ color: accentColor }} />
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
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
          <Filter size={14} />
          <span>Filter:</span>
        </div>

        {/* Course filter */}
        <select
          value={courseFilter}
          onChange={(e) =>
            setCourseFilter(
              e.target.value === "all" ? "all" : Number(e.target.value),
            )
          }
          className="bg-card border border-border rounded-xl px-3 py-1.5 text-foreground text-sm focus:outline-none focus:border-primary/60 transition-colors"
        >
          <option value="all">All Courses</option>
          {uniqueCourses.map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>

        {/* Status filter */}
        <div className="flex items-center gap-2">
          {(["all", "good", "warning", "critical"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                statusFilter === f
                  ? "bg-primary text-white"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={CARD_STYLE}>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-5 py-3.5 text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                Student
              </th>
              <th className="text-left px-5 py-3.5 text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                Course
              </th>
              <th className="text-left px-5 py-3.5 text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                Sessions
              </th>
              <th className="text-left px-5 py-3.5 text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                Attendance %
              </th>
              <th className="text-left px-5 py-3.5 text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                Last Session
              </th>
              <th className="text-left px-5 py-3.5 text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((a) => {
              const pct =
                a.total > 0 ? Math.round((a.present / a.total) * 100) : 100;
              const s = statusConfig[a.status];
              return (
                <tr key={a.id} className="hover:bg-secondary transition-colors">
                  <td className="px-5 py-4">
                    <p className="text-foreground text-sm font-medium">
                      {a.studentName}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-muted-foreground text-sm">
                      {a.courseName}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-foreground text-sm">
                      {a.present}
                      <span className="text-muted-foreground">/{a.total}</span>
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            pct >= 80
                              ? "bg-gradient-to-r from-primary to-accent-foreground"
                              : pct >= 60
                                ? "bg-amber-400"
                                : "bg-rose-400"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-foreground text-sm font-medium">
                        {pct}%
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-muted-foreground text-sm">
                      {a.lastSession}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full border ${s.color}`}
                    >
                      {s.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground text-sm">
            No attendance records match your filters.
          </div>
        )}
      </div>
    </div>
  );
}
