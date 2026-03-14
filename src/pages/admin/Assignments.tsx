import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  FileText,
  Clock,
  AlertCircle,
  AlertTriangle,
  X,
} from "lucide-react";
import { useApp } from "../../store/AppContext";
import type { Assignment } from "../../data/assignments";
import { ChronicleButton } from "@/components/ui/chronicle-button";

const CARD_STYLE = {
  backgroundColor: "var(--bauhaus-card-bg)",
  border: "1px solid var(--bauhaus-card-separator)",
};

const emptyForm = {
  title: "",
  course: "",
  courseId: 1,
  due: "",
  priority: "medium" as Assignment["priority"],
  points: 100,
  desc: "",
};

const priorityOptions: Assignment["priority"][] = ["high", "medium", "low"];

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: {
    label: "Pending",
    color: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  },
  "in-progress": {
    label: "In Progress",
    color:
      "text-accent-foreground bg-accent-foreground/10 border-accent-foreground/20",
  },
  submitted: {
    label: "Submitted",
    color: "text-primary bg-primary/10 border-primary/20",
  },
  graded: {
    label: "Graded",
    color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  },
};

export default function Assignments() {
  const { assignments, courses, addAssignment, deleteAssignment } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [statusFilter, setStatusFilter] = useState("all");
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (confirmDeleteId === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setConfirmDeleteId(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [confirmDeleteId]);

  async function confirmDelete() {
    if (confirmDeleteId === null) return;
    setIsDeleting(true);
    await new Promise((r) => setTimeout(r, 400));
    deleteAssignment(confirmDeleteId);
    setIsDeleting(false);
    setConfirmDeleteId(null);
  }

  const filtered =
    statusFilter === "all"
      ? assignments
      : assignments.filter((a) => a.status === statusFilter);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const course = courses.find((c) => c.id === form.courseId);
    addAssignment({
      ...form,
      course: course?.title ?? form.course,
      status: "pending",
      submissions: 0,
      avgScore: null,
    });
    setForm(emptyForm);
    setShowForm(false);
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1
            className="text-2xl md:text-3xl font-bold"
            style={{ color: "var(--bauhaus-card-inscription-main)" }}
          >
            Assignments
          </h1>
          <p
            className="mt-1"
            style={{ color: "var(--bauhaus-card-inscription-sub)" }}
          >
            {assignments.length} total ·{" "}
            {
              assignments.filter(
                (a) => a.status === "pending" || a.status === "in-progress",
              ).length
            }{" "}
            open
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl transition-all"
          style={{
            backgroundColor: "#fc680022",
            border: "1px solid #fc680044",
            color: "#fc6800",
          }}
        >
          <Plus size={16} />
          Create Assignment
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
          style={{
            backgroundColor: "var(--bauhaus-card-bg)",
            border: "1px solid #fc680033",
          }}
        >
          <div className="col-span-2">
            <h2 className="text-foreground font-semibold mb-4">
              New Assignment
            </h2>
          </div>

          <div className="col-span-2">
            <label className="block text-muted-foreground text-xs font-medium mb-1.5">
              Title
            </label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. AWS Lambda Deployment Lab"
              required
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors"
            />
          </div>

          <div>
            <label className="block text-muted-foreground text-xs font-medium mb-1.5">
              Course
            </label>
            <select
              value={form.courseId}
              onChange={(e) =>
                setForm({ ...form, courseId: Number(e.target.value) })
              }
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-primary/60 transition-colors"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-muted-foreground text-xs font-medium mb-1.5">
              Due Date
            </label>
            <input
              value={form.due}
              onChange={(e) => setForm({ ...form, due: e.target.value })}
              placeholder="e.g. Mar 20, 2026"
              required
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors"
            />
          </div>

          <div>
            <label className="block text-muted-foreground text-xs font-medium mb-1.5">
              Priority
            </label>
            <select
              value={form.priority}
              onChange={(e) =>
                setForm({
                  ...form,
                  priority: e.target.value as Assignment["priority"],
                })
              }
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-primary/60 transition-colors"
            >
              {priorityOptions.map((p) => (
                <option key={p} value={p} className="capitalize">
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-muted-foreground text-xs font-medium mb-1.5">
              Points
            </label>
            <input
              type="number"
              value={form.points}
              onChange={(e) =>
                setForm({ ...form, points: Number(e.target.value) })
              }
              min={1}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-primary/60 transition-colors"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-muted-foreground text-xs font-medium mb-1.5">
              Description
            </label>
            <textarea
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
              placeholder="Assignment instructions..."
              rows={2}
              required
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 resize-none transition-colors"
            />
          </div>

          <div className="col-span-2 flex justify-end gap-3 pt-2">
            <ChronicleButton
              inscription="Cancel"
              variant="outlined"
              backgroundColor="var(--bauhaus-card-inscription-sub)"
              textColor="var(--bauhaus-card-inscription-sub)"
              hoverTextColor="#fff"
              borderColor="var(--bauhaus-card-separator)"
              onClick={() => {
                setShowForm(false);
                setForm(emptyForm);
              }}
            />
            <ChronicleButton
              inscription="Create"
              variant="filled"
              backgroundColor="#fc6800"
              textColor="#fff"
              hoverTextColor="#fff"
            />
          </div>
        </form>
      )}

      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto whitespace-nowrap hide-scrollbar">
        {["all", "pending", "in-progress", "submitted", "graded"].map((f) => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
              statusFilter === f
                ? "bg-primary text-white"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.replace("-", " ")}
          </button>
        ))}
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
                  Assignment
                </th>
                <th className="text-left px-5 py-3.5 text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                  Course
                </th>
                <th className="text-left px-5 py-3.5 text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                  Due
                </th>
                <th className="text-left px-5 py-3.5 text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                  Submissions
                </th>
                <th className="text-left px-5 py-3.5 text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                  Status
                </th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((a) => {
                const s = statusConfig[a.status];
                return (
                  <tr
                    key={a.id}
                    className="hover:bg-secondary transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <FileText
                          size={15}
                          className={
                            a.priority === "high"
                              ? "text-rose-400"
                              : "text-muted-foreground"
                          }
                        />
                        <div>
                          <p className="text-foreground text-sm font-medium">
                            {a.title}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {a.points} pts · {a.priority} priority
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-muted-foreground text-sm">
                        {a.course}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 text-muted-foreground text-sm">
                        <Clock size={13} />
                        {a.due}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 text-foreground text-sm">
                        <AlertCircle
                          size={13}
                          className="text-muted-foreground"
                        />
                        {a.submissions}
                        {a.avgScore != null && (
                          <span className="text-muted-foreground text-xs ml-1">
                            avg {a.avgScore}%
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full border ${s.color}`}
                      >
                        {s.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setConfirmDeleteId(a.id)}
                        className="text-muted-foreground hover:text-rose-400 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-muted-foreground text-sm">
              No assignments found.
            </div>
          )}
        </div>
      </div>

      {confirmDeleteId !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setConfirmDeleteId(null);
          }}
        >
          <div
            className="w-full max-w-sm rounded-2xl p-6 shadow-2xl"
            style={CARD_STYLE}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: "#EF444420" }}
                >
                  <AlertTriangle size={18} style={{ color: "#EF4444" }} />
                </div>
                <h2
                  className="font-semibold"
                  style={{ color: "var(--bauhaus-card-inscription-main)" }}
                >
                  Delete assignment?
                </h2>
              </div>
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="p-1 hover:opacity-70"
              >
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
              This will permanently remove the assignment.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 py-2 rounded-xl text-sm font-medium hover:opacity-70"
                style={{
                  backgroundColor: "var(--bauhaus-card-separator)",
                  color: "var(--bauhaus-card-inscription-sub)",
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 py-2 rounded-xl text-sm font-medium text-white disabled:opacity-60"
                style={{ backgroundColor: "#EF4444" }}
              >
                {isDeleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
