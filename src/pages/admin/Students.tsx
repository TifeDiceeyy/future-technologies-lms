import { useState } from "react";
import {
  Search,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useApp } from "../../store/AppContext";
import { apiFetch } from "../../api/client";

const CARD_STYLE = {
  backgroundColor: "var(--bauhaus-card-bg)",
  border: "1px solid var(--bauhaus-card-separator)",
};

export default function Students() {
  const { students, courses, updateStudent } = useApp();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [toggling, setToggling] = useState<Record<number, boolean>>({});
  const [toggleErrors, setToggleErrors] = useState<Record<number, string>>({});

  const filtered = students.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getCourseNames = (ids: number[]) =>
    ids
      .map((id) => courses.find((c) => c.id === id)?.title ?? `Course ${id}`)
      .join(", ");

  return (
    <div className="p-4 md:p-8 max-w-6xl">
      <div className="mb-6 md:mb-8">
        <h1
          className="text-2xl md:text-3xl font-bold"
          style={{ color: "var(--bauhaus-card-inscription-main)" }}
        >
          Students
        </h1>
        <p
          className="mt-1"
          style={{ color: "var(--bauhaus-card-inscription-sub)" }}
        >
          {students.length} registered ·{" "}
          {students.filter((s) => s.status === "active").length} active
        </p>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        {[
          {
            label: "Total Students",
            value: students.length,
            icon: Users,
            accentColor: "#156ef6",
          },
          {
            label: "Active",
            value: students.filter((s) => s.status === "active").length,
            icon: CheckCircle,
            accentColor: "#24d200",
          },
          {
            label: "Inactive",
            value: students.filter((s) => s.status === "inactive").length,
            icon: XCircle,
            accentColor: "#fc6800",
          },
          {
            label: "Avg Score",
            value: `${Math.round(students.reduce((s, st) => s + st.avgScore, 0) / students.length)}%`,
            icon: TrendingUp,
            accentColor: "#8f10f6",
          },
        ].map(({ label, value, icon: Icon, accentColor }) => (
          <div key={label} className="rounded-xl p-4" style={CARD_STYLE}>
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center mb-2"
              style={{
                backgroundColor: `${accentColor}22`,
                border: `1px solid ${accentColor}44`,
              }}
            >
              <Icon size={15} style={{ color: accentColor }} />
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
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
        <div className="relative flex-1 sm:max-w-sm">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2"
            style={{ color: "var(--bauhaus-card-inscription-sub)" }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none transition-colors"
            style={{
              ...CARD_STYLE,
              color: "var(--bauhaus-card-inscription-main)",
            }}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap hide-scrollbar">
          {(["all", "active", "inactive"] as const).map((f) => {
            const active = statusFilter === f;
            return (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className="flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all"
                style={
                  active
                    ? {
                        backgroundColor: "#156ef622",
                        border: "1px solid #156ef655",
                        color: "#156ef6",
                      }
                    : {
                        ...CARD_STYLE,
                        color: "var(--bauhaus-card-inscription-sub)",
                      }
                }
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <div
          className="rounded-2xl overflow-hidden min-w-[640px]"
          style={CARD_STYLE}
        >
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3.5 text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                  Student
                </th>
                <th className="text-left px-5 py-3.5 text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                  Courses
                </th>
                <th className="text-left px-5 py-3.5 text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                  Avg Score
                </th>
                <th className="text-left px-5 py-3.5 text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                  Hours
                </th>
                <th className="text-left px-5 py-3.5 text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                  Joined
                </th>
                <th className="text-left px-5 py-3.5 text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                  Status
                </th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-secondary transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent-foreground flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {s.initials}
                      </div>
                      <div>
                        <p className="text-foreground text-sm font-medium">
                          {s.name}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {s.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p
                      className="text-muted-foreground text-xs max-w-[180px] truncate"
                      title={getCourseNames(s.enrolledCourseIds)}
                    >
                      {s.enrolledCourseIds.length} enrolled
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-sm font-semibold ${s.avgScore >= 85 ? "text-emerald-400" : s.avgScore >= 70 ? "text-amber-400" : "text-rose-400"}`}
                    >
                      {s.avgScore}%
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1 text-muted-foreground text-sm">
                      <Clock size={13} />
                      {s.hoursLearned}h
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-muted-foreground text-sm">
                      {s.joinDate}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                        s.status === "active"
                          ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                          : "text-muted-foreground bg-secondary border-border"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex flex-col items-end gap-1">
                      {toggleErrors[s.id] && (
                        <p className="text-xs text-rose-400 max-w-[120px] text-right leading-tight">
                          {toggleErrors[s.id]}
                        </p>
                      )}
                      <button
                        disabled={!!toggling[s.id]}
                        onClick={async () => {
                          const isActive = s.status === "active";
                          const action = isActive ? "disable" : "enable";
                          const newStatus = isActive ? "inactive" : "active";
                          setToggling((prev) => ({ ...prev, [s.id]: true }));
                          setToggleErrors((prev) => ({ ...prev, [s.id]: "" }));
                          try {
                            await apiFetch(
                              `/admin/students/${encodeURIComponent(s.email)}/${action}`,
                              { method: "POST" },
                              true,
                            );
                            updateStudent(s.id, { status: newStatus });
                          } catch (err) {
                            const msg =
                              err instanceof Error
                                ? err.message
                                : "Action failed";
                            setToggleErrors((prev) => ({
                              ...prev,
                              [s.id]: msg,
                            }));
                          } finally {
                            setToggling((prev) => ({
                              ...prev,
                              [s.id]: false,
                            }));
                          }
                        }}
                        className="text-xs text-muted-foreground hover:text-foreground border border-border hover:border-primary/40 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {toggling[s.id]
                          ? "…"
                          : s.status === "active"
                            ? "Deactivate"
                            : "Activate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-muted-foreground text-sm">
              No students match your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
