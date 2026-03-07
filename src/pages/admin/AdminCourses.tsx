import { useState } from "react";
import {
  Plus,
  Trash2,
  BookOpen,
  Search,
  ToggleLeft,
  ToggleRight,
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
};

const categories = ["Cloud", "Frontend", "Data", "DevOps", "AI/ML", "Other"];
const levels: Course["level"][] = ["Beginner", "Intermediate", "Advanced"];

export default function AdminCourses() {
  const { courses, addCourse, deleteCourse, updateCourse } = useApp();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

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
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-3xl font-bold"
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
          className="rounded-2xl p-6 mb-8 grid grid-cols-2 gap-4"
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
      <div className="rounded-2xl overflow-hidden" style={CARD_STYLE}>
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
                      <ToggleLeft size={18} className="text-muted-foreground" />
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
                    onClick={() => deleteCourse(c.id)}
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
  );
}
