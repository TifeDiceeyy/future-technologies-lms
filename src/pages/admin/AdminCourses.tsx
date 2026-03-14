import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  BookOpen,
  Search,
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
  X,
} from "lucide-react";
import { useApp } from "../../store/AppContext";
import type { Course } from "../../data/courses";
import { ChronicleButton } from "@/components/ui/chronicle-button";

const CARD_STYLE = {
  backgroundColor: "var(--bauhaus-card-bg)",
  border: "1px solid var(--bauhaus-card-separator)",
};

const emptyForm = {
  title: "",
  instructor: "",
  category: "Cloud",
  level: "Beginner" as Course["level"],
  duration: "",
  modules: 8,
  description: "",
  isPaid: false,
};

const categories = ["Cloud", "Frontend", "Data", "DevOps", "AI/ML", "Other"];
const levels: Course["level"][] = ["Beginner", "Intermediate", "Advanced"];

export default function AdminCourses() {
  const { courses, addCourse, deleteCourse, updateCourse } = useApp();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
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
    deleteCourse(confirmDeleteId);
    setIsDeleting(false);
    setConfirmDeleteId(null);
  }

  const filtered = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.instructor.toLowerCase().includes(search.toLowerCase()),
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    addCourse({
      ...form,
      rating: 0,
      studentsEnrolled: 0,
      published: false,
      createdAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      enrolled: false,
      progress: 0,
      modulesCompleted: 0,
      currentScore: null,
    });
    setForm(emptyForm);
    setShowForm(false);
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1
            className="text-2xl md:text-3xl font-bold"
            style={{ color: "var(--bauhaus-card-inscription-main)" }}
          >
            Courses
          </h1>
          <p
            className="mt-1"
            style={{ color: "var(--bauhaus-card-inscription-sub)" }}
          >
            {courses.length} total · {courses.filter((c) => c.published).length}{" "}
            published
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl transition-all"
          style={{
            backgroundColor: "#156ef622",
            border: "1px solid #156ef644",
            color: "#156ef6",
          }}
        >
          <Plus size={16} />
          Add Course
        </button>
      </div>

      {/* Add course form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
          style={{
            backgroundColor: "var(--bauhaus-card-bg)",
            border: "1px solid #156ef633",
          }}
        >
          <div className="col-span-2">
            <h2 className="text-foreground font-semibold mb-4">New Course</h2>
          </div>

          {[
            {
              field: "title",
              label: "Title",
              placeholder: "e.g. AWS Advanced Networking",
              span: 2,
            },
            {
              field: "instructor",
              label: "Instructor",
              placeholder: "e.g. Sarah Chen",
              span: 1,
            },
            {
              field: "duration",
              label: "Duration",
              placeholder: "e.g. 20h",
              span: 1,
            },
            {
              field: "description",
              label: "Description",
              placeholder: "Short course description…",
              span: 2,
            },
          ].map(({ field, label, placeholder, span }) => (
            <div key={field} className={span === 2 ? "col-span-2" : ""}>
              <label className="block text-muted-foreground text-xs font-medium mb-1.5">
                {label}
              </label>
              {field === "description" ? (
                <textarea
                  value={form[field as keyof typeof form] as string}
                  onChange={(e) =>
                    setForm({ ...form, [field]: e.target.value })
                  }
                  placeholder={placeholder}
                  rows={2}
                  required
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 resize-none transition-colors"
                />
              ) : (
                <input
                  value={form[field as keyof typeof form] as string}
                  onChange={(e) =>
                    setForm({ ...form, [field]: e.target.value })
                  }
                  placeholder={placeholder}
                  required
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors"
                />
              )}
            </div>
          ))}

          <div>
            <label className="block text-muted-foreground text-xs font-medium mb-1.5">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-primary/60 transition-colors"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-muted-foreground text-xs font-medium mb-1.5">
              Level
            </label>
            <select
              value={form.level}
              onChange={(e) =>
                setForm({ ...form, level: e.target.value as Course["level"] })
              }
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-primary/60 transition-colors"
            >
              {levels.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-muted-foreground text-xs font-medium mb-1.5">
              Pricing
            </label>
            <select
              value={form.isPaid ? "paid" : "free"}
              onChange={(e) =>
                setForm({ ...form, isPaid: e.target.value === "paid" })
              }
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-primary/60 transition-colors"
            >
              <option value="free">Free — accessible to all students</option>
              <option value="paid">Paid — requires student upgrade</option>
            </select>
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
              inscription="Create Course"
              variant="filled"
              backgroundColor="#156ef6"
              textColor="#fff"
              hoverTextColor="#fff"
            />
          </div>
        </form>
      )}

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2"
          style={{ color: "var(--bauhaus-card-inscription-sub)" }}
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search courses..."
          className="w-full rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none transition-colors"
          style={{
            ...CARD_STYLE,
            color: "var(--bauhaus-card-inscription-main)",
          }}
        />
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
                  Course
                </th>
                <th className="text-left px-5 py-3.5 text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                  Category
                </th>
                <th className="text-left px-5 py-3.5 text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                  Level
                </th>
                <th className="text-left px-5 py-3.5 text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                  Students
                </th>
                <th className="text-left px-5 py-3.5 text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                  Pricing
                </th>
                <th className="text-left px-5 py-3.5 text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                  Status
                </th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-secondary transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                        <BookOpen size={14} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-foreground text-sm font-medium">
                          {c.title}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {c.instructor} · {c.duration}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-muted-foreground text-sm">
                      {c.category}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                        c.level === "Beginner"
                          ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                          : c.level === "Intermediate"
                            ? "text-amber-400 bg-amber-400/10 border-amber-400/20"
                            : "text-rose-400 bg-rose-400/10 border-rose-400/20"
                      }`}
                    >
                      {c.level}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-foreground text-sm font-medium">
                      {c.studentsEnrolled}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => updateCourse(c.id, { isPaid: !c.isPaid })}
                      className="text-xs font-medium px-2.5 py-1 rounded-full border transition-all hover:opacity-70"
                      style={
                        c.isPaid
                          ? {
                              color: "#F59E0B",
                              backgroundColor: "#F59E0B18",
                              borderColor: "#F59E0B33",
                            }
                          : {
                              color: "#10B981",
                              backgroundColor: "#10B98118",
                              borderColor: "#10B98133",
                            }
                      }
                      title="Click to toggle pricing"
                    >
                      {c.isPaid ? "Paid" : "Free"}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() =>
                        updateCourse(c.id, { published: !c.published })
                      }
                      className="flex items-center gap-1.5 text-xs"
                    >
                      {c.published ? (
                        <ToggleRight
                          size={18}
                          className="text-accent-foreground"
                        />
                      ) : (
                        <ToggleLeft
                          size={18}
                          className="text-muted-foreground"
                        />
                      )}
                      <span
                        className={
                          c.published
                            ? "text-accent-foreground"
                            : "text-muted-foreground"
                        }
                      >
                        {c.published ? "Published" : "Draft"}
                      </span>
                    </button>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => setConfirmDeleteId(c.id)}
                      className="text-muted-foreground hover:text-rose-400 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-muted-foreground text-sm">
              No courses found.
            </div>
          )}
        </div>
      </div>

      {/* Confirm delete modal */}
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
                  Delete course?
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
              This will permanently remove the course and all associated data.
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
