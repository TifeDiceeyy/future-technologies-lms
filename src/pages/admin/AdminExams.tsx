import { useState } from "react";
import { Plus, Trash2, ClipboardList, Calendar, Clock } from "lucide-react";
import { useApp } from "../../store/AppContext";
import type { Exam } from "../../data/exams";
import { ChronicleButton } from "@/components/ui/chronicle-button";

const CARD_STYLE = {
  backgroundColor: "var(--bauhaus-card-bg)",
  border: "1px solid var(--bauhaus-card-separator)",
};

const emptyForm = {
  title: "",
  courseId: 1,
  date: "",
  time: "",
  duration: "60 min",
  questions: 30,
};

const statusConfig: Record<string, { label: string; color: string }> = {
  upcoming: {
    label: "Upcoming",
    color:
      "text-accent-foreground bg-accent-foreground/10 border-accent-foreground/20",
  },
  completed: {
    label: "Completed",
    color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  },
  locked: {
    label: "Locked",
    color: "text-muted-foreground bg-secondary border-border",
  },
};

export default function AdminExams() {
  const { exams, courses, addExam, deleteExam } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered =
    statusFilter === "all"
      ? exams
      : exams.filter((e) => e.status === statusFilter);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const course = courses.find((c) => c.id === form.courseId);
    addExam({
      ...form,
      course: course?.title ?? "",
      status: "upcoming" as Exam["status"],
      score: null,
      submissions: 0,
      avgScore: null,
    });
    setForm(emptyForm);
    setShowForm(false);
  }

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-3xl font-bold"
            style={{ color: "var(--bauhaus-card-inscription-main)" }}
          >
            Exams
          </h1>
          <p
            className="mt-1"
            style={{ color: "var(--bauhaus-card-inscription-sub)" }}
          >
            {exams.length} total ·{" "}
            {exams.filter((e) => e.status === "upcoming").length} upcoming
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl transition-all"
          style={{
            backgroundColor: "#8f10f622",
            border: "1px solid #8f10f644",
            color: "#8f10f6",
          }}
        >
          <Plus size={16} />
          Create Exam
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl p-6 mb-8 grid grid-cols-2 gap-4"
          style={{
            backgroundColor: "var(--bauhaus-card-bg)",
            border: "1px solid #8f10f633",
          }}
        >
          <div className="col-span-2">
            <h2 className="text-foreground font-semibold mb-4">New Exam</h2>
          </div>

          <div className="col-span-2">
            <label className="block text-muted-foreground text-xs font-medium mb-1.5">
              Title
            </label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. AWS Solutions Architect Final"
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
              Date
            </label>
            <input
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              placeholder="e.g. Mar 25, 2026"
              required
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors"
            />
          </div>

          <div>
            <label className="block text-muted-foreground text-xs font-medium mb-1.5">
              Time
            </label>
            <input
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              placeholder="e.g. 10:00 AM"
              required
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors"
            />
          </div>

          <div>
            <label className="block text-muted-foreground text-xs font-medium mb-1.5">
              Duration
            </label>
            <input
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              placeholder="e.g. 90 min"
              required
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors"
            />
          </div>

          <div>
            <label className="block text-muted-foreground text-xs font-medium mb-1.5">
              Questions
            </label>
            <input
              type="number"
              value={form.questions}
              onChange={(e) =>
                setForm({ ...form, questions: Number(e.target.value) })
              }
              min={1}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-primary/60 transition-colors"
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
              backgroundColor="#8f10f6"
              textColor="#fff"
              hoverTextColor="#fff"
            />
          </div>
        </form>
      )}

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6">
        {["all", "upcoming", "completed", "locked"].map((f) => (
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

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={CARD_STYLE}>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-5 py-3.5 text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                Exam
              </th>
              <th className="text-left px-5 py-3.5 text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                Course
              </th>
              <th className="text-left px-5 py-3.5 text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                Date & Time
              </th>
              <th className="text-left px-5 py-3.5 text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                Details
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
            {filtered.map((e) => {
              const s = statusConfig[e.status];
              return (
                <tr key={e.id} className="hover:bg-secondary transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <ClipboardList
                        size={15}
                        className="text-primary flex-shrink-0"
                      />
                      <p className="text-foreground text-sm font-medium">
                        {e.title}
                      </p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-muted-foreground text-sm">
                      {e.course}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1 text-muted-foreground text-sm">
                      <Calendar size={13} />
                      <span>{e.date}</span>
                    </div>
                    <p className="text-muted-foreground text-xs mt-0.5 pl-4">
                      {e.time}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1 text-muted-foreground text-sm">
                      <Clock size={13} />
                      {e.duration}
                    </div>
                    <p className="text-muted-foreground text-xs mt-0.5">
                      {e.questions} questions
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-foreground text-sm">
                      {e.submissions}
                    </span>
                    {e.avgScore != null && (
                      <p className="text-muted-foreground text-xs mt-0.5">
                        avg {e.avgScore}%
                      </p>
                    )}
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
                      onClick={() => deleteExam(e.id)}
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
            No exams found.
          </div>
        )}
      </div>
    </div>
  );
}
