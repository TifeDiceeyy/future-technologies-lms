import { useState } from "react";
import {
  Plus,
  Trash2,
  Megaphone,
  Info,
  AlertTriangle,
  CheckCircle,
  Calendar,
} from "lucide-react";
import { useApp } from "../../store/AppContext";
import type { Announcement } from "../../data/announcements";
import { ChronicleButton } from "@/components/ui/chronicle-button";

const CARD_STYLE = {
  backgroundColor: "var(--bauhaus-card-bg)",
  border: "1px solid var(--bauhaus-card-separator)",
};

const typeConfig: Record<
  Announcement["type"],
  { label: string; color: string; icon: React.ElementType }
> = {
  info: {
    label: "Info",
    color: "text-primary bg-primary/10 border-primary/20",
    icon: Info,
  },
  warning: {
    label: "Warning",
    color: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    icon: AlertTriangle,
  },
  success: {
    label: "Success",
    color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    icon: CheckCircle,
  },
  event: {
    label: "Event",
    color:
      "text-accent-foreground bg-accent-foreground/10 border-accent-foreground/20",
    icon: Calendar,
  },
};

const emptyForm = {
  title: "",
  body: "",
  type: "info" as Announcement["type"],
  author: "Admin",
  targetCourseId: null as number | null,
};

export default function Announcements() {
  const { announcements, courses, addAnnouncement, deleteAnnouncement } =
    useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [typeFilter, setTypeFilter] = useState<"all" | Announcement["type"]>(
    "all",
  );

  const filtered =
    typeFilter === "all"
      ? announcements
      : announcements.filter((a) => a.type === typeFilter);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    addAnnouncement(form);
    setForm(emptyForm);
    setShowForm(false);
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-3xl font-bold"
            style={{ color: "var(--bauhaus-card-inscription-main)" }}
          >
            Announcements
          </h1>
          <p
            className="mt-1"
            style={{ color: "var(--bauhaus-card-inscription-sub)" }}
          >
            {announcements.length} published · broadcast to all students
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl transition-all"
          style={{
            backgroundColor: "#24d20022",
            border: "1px solid #24d20044",
            color: "#24d200",
          }}
        >
          <Plus size={16} />
          New Announcement
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl p-6 mb-8 space-y-4"
          style={{
            backgroundColor: "var(--bauhaus-card-bg)",
            border: "1px solid #24d20033",
          }}
        >
          <h2 className="text-foreground font-semibold">New Announcement</h2>

          <div>
            <label className="block text-muted-foreground text-xs font-medium mb-1.5">
              Title
            </label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. New course available"
              required
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors"
            />
          </div>

          <div>
            <label className="block text-muted-foreground text-xs font-medium mb-1.5">
              Body
            </label>
            <textarea
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              placeholder="Write the full announcement here..."
              rows={3}
              required
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 resize-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-muted-foreground text-xs font-medium mb-1.5">
                Type
              </label>
              <select
                value={form.type}
                onChange={(e) =>
                  setForm({
                    ...form,
                    type: e.target.value as Announcement["type"],
                  })
                }
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-primary/60 transition-colors"
              >
                {(Object.keys(typeConfig) as Announcement["type"][]).map(
                  (t) => (
                    <option key={t} value={t}>
                      {typeConfig[t].label}
                    </option>
                  ),
                )}
              </select>
            </div>

            <div>
              <label className="block text-muted-foreground text-xs font-medium mb-1.5">
                Author
              </label>
              <input
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                placeholder="e.g. Sarah Chen"
                required
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors"
              />
            </div>

            <div>
              <label className="block text-muted-foreground text-xs font-medium mb-1.5">
                Target Course (optional)
              </label>
              <select
                value={form.targetCourseId ?? ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    targetCourseId: e.target.value
                      ? Number(e.target.value)
                      : null,
                  })
                }
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-primary/60 transition-colors"
              >
                <option value="">All Students</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
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
              inscription="Publish"
              variant="filled"
              backgroundColor="#24d200"
              textColor="#fff"
              hoverTextColor="#fff"
            />
          </div>
        </form>
      )}

      {/* Type filter */}
      <div className="flex items-center gap-2 mb-6">
        {(["all", "info", "success", "warning", "event"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setTypeFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
              typeFilter === f
                ? "bg-primary text-white"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Announcement list */}
      <div className="space-y-3">
        {filtered.map((a) => {
          const t = typeConfig[a.type];
          const TypeIcon = t.icon;
          return (
            <div
              key={a.id}
              className="rounded-2xl p-5 hover:scale-[1.005] transition-all"
              style={CARD_STYLE}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 mt-0.5 ${t.color}`}
                  >
                    <TypeIcon size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-foreground font-medium text-sm">
                        {a.title}
                      </p>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${t.color}`}
                      >
                        {t.label}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-2">
                      {a.body}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {a.createdAt} · by {a.author}
                      {a.targetCourseId && (
                        <>
                          {" "}
                          ·{" "}
                          <span className="text-accent-foreground">
                            {courses.find((c) => c.id === a.targetCourseId)
                              ?.title ?? "specific course"}
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => deleteAnnouncement(a.id)}
                  className="text-muted-foreground hover:text-rose-400 transition-colors flex-shrink-0"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <Megaphone
              size={32}
              className="text-muted-foreground mx-auto mb-3"
            />
            <p className="text-muted-foreground text-sm">
              No announcements yet. Create one above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
