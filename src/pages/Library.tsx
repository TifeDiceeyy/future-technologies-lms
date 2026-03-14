import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookMarked,
  BookOpen,
  Award,
  Clock,
  ArrowRight,
  FileText,
  FolderPlus,
  Pencil,
  Trash2,
  X,
  Download,
} from "lucide-react";
import { useApp } from "@/store/AppContext";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Collection {
  id: string;
  name: string;
  courseIds: number[];
}

// ── Constants ─────────────────────────────────────────────────────────────────
const ACCENT_POOL = [
  "#6366F1",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#06B6D4",
  "#EC4899",
];
const courseAccent = (id: number) => ACCENT_POOL[(id - 1) % ACCENT_POOL.length];

const CARD_STYLE = {
  backgroundColor: "var(--bauhaus-card-bg)",
  border: "1px solid var(--bauhaus-card-separator)",
};

const RESOURCES = [
  {
    id: 1,
    title: "AWS Well-Architected Framework",
    type: "PDF",
    size: "2.4 MB",
    accentColor: "#F59E0B",
  },
  {
    id: 2,
    title: "React Design Patterns Cheatsheet",
    type: "PDF",
    size: "1.1 MB",
    accentColor: "#6366F1",
  },
  {
    id: 3,
    title: "Python Data Science Handbook",
    type: "PDF",
    size: "8.2 MB",
    accentColor: "#10B981",
  },
  {
    id: 4,
    title: "Terraform Best Practices Guide",
    type: "PDF",
    size: "3.7 MB",
    accentColor: "#06B6D4",
  },
];

const CERTIFICATES = [
  {
    id: 1,
    title: "AWS Cloud Practitioner — Mock Exam",
    date: "Feb 28, 2026",
    score: 94,
    accentColor: "#F59E0B",
  },
  {
    id: 2,
    title: "React Fundamentals",
    date: "Jan 20, 2026",
    score: 88,
    accentColor: "#6366F1",
  },
  {
    id: 3,
    title: "Python for Data Science — Module 1",
    date: "Jan 10, 2026",
    score: 91,
    accentColor: "#10B981",
  },
];

type Tab = "courses" | "collections" | "downloads" | "certificates";

// ── Helpers ───────────────────────────────────────────────────────────────────
function loadCollections(): Collection[] {
  try {
    const raw = localStorage.getItem("mindcampus_collections");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCollections(cols: Collection[]) {
  localStorage.setItem("mindcampus_collections", JSON.stringify(cols));
}

function loadHiddenDownloads(): Set<number> {
  try {
    const raw = localStorage.getItem("mindcampus_hidden_downloads");
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveHiddenDownloads(hidden: Set<number>) {
  localStorage.setItem(
    "mindcampus_hidden_downloads",
    JSON.stringify([...hidden]),
  );
}

// ── Modal: New / Rename Collection ────────────────────────────────────────────
function NameModal({
  title,
  initial,
  onConfirm,
  onClose,
}: {
  title: string;
  initial: string;
  onConfirm: (name: string) => void;
  onClose: () => void;
}) {
  const [value, setValue] = useState(initial);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6 shadow-2xl"
        style={{
          backgroundColor: "var(--bauhaus-card-bg)",
          border: "1px solid var(--bauhaus-card-separator)",
        }}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="flex items-center justify-between mb-4">
          <h2
            className="font-semibold"
            style={{ color: "var(--bauhaus-card-inscription-main)" }}
          >
            {title}
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:opacity-70">
            <X
              size={16}
              style={{ color: "var(--bauhaus-card-inscription-sub)" }}
            />
          </button>
        </div>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Collection name"
          maxLength={60}
          className="w-full px-3 py-2 rounded-xl text-sm outline-none"
          style={{
            backgroundColor: "var(--bauhaus-card-separator)",
            color: "var(--bauhaus-card-inscription-main)",
            border: "1px solid var(--bauhaus-card-separator)",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && value.trim()) onConfirm(value.trim());
          }}
        />

        <div className="flex gap-2 mt-4">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl text-sm font-medium hover:opacity-70 transition-opacity"
            style={{
              backgroundColor: "var(--bauhaus-card-separator)",
              color: "var(--bauhaus-card-inscription-sub)",
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => value.trim() && onConfirm(value.trim())}
            disabled={!value.trim()}
            className="flex-1 py-2 rounded-xl text-sm font-medium text-white transition-opacity disabled:opacity-40"
            style={{ backgroundColor: "#6366F1" }}
          >
            {initial ? "Save" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modal: Delete Confirm ─────────────────────────────────────────────────────
function DeleteModal({
  name,
  onConfirm,
  onClose,
}: {
  name: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6 shadow-2xl"
        style={{
          backgroundColor: "var(--bauhaus-card-bg)",
          border: "1px solid var(--bauhaus-card-separator)",
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Delete collection"
      >
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "#EF444420" }}
          >
            <Trash2 size={18} style={{ color: "#EF4444" }} />
          </div>
          <h2
            className="font-semibold"
            style={{ color: "var(--bauhaus-card-inscription-main)" }}
          >
            Delete collection?
          </h2>
        </div>
        <p
          className="text-sm mb-4"
          style={{ color: "var(--bauhaus-card-inscription-sub)" }}
        >
          "
          <span
            className="font-medium"
            style={{ color: "var(--bauhaus-card-inscription-main)" }}
          >
            {name}
          </span>
          " will be permanently removed.
        </p>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl text-sm font-medium hover:opacity-70 transition-opacity"
            style={{
              backgroundColor: "var(--bauhaus-card-separator)",
              color: "var(--bauhaus-card-inscription-sub)",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 rounded-xl text-sm font-medium text-white transition-opacity"
            style={{ backgroundColor: "#EF4444" }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Library() {
  const navigate = useNavigate();
  const { courses } = useApp();
  const savedCourses = courses.filter((c) => c.enrolled);

  const [tab, setTab] = useState<Tab>("courses");
  const [collections, setCollections] = useState<Collection[]>(loadCollections);
  const [hiddenDownloads, setHiddenDownloads] =
    useState<Set<number>>(loadHiddenDownloads);

  // Modal state
  const [newCollectionOpen, setNewCollectionOpen] = useState(false);
  const [renaming, setRenaming] = useState<Collection | null>(null);
  const [deleting, setDeleting] = useState<Collection | null>(null);

  // Persist collections
  useEffect(() => {
    saveCollections(collections);
  }, [collections]);

  // Collection actions
  function createCollection(name: string) {
    const col: Collection = { id: crypto.randomUUID(), name, courseIds: [] };
    setCollections((prev) => [...prev, col]);
    setNewCollectionOpen(false);
  }

  function renameCollection(id: string, name: string) {
    setCollections((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name } : c)),
    );
    setRenaming(null);
  }

  function deleteCollection(id: string) {
    setCollections((prev) => prev.filter((c) => c.id !== id));
    setDeleting(null);
  }

  // Download actions
  function hideDownload(id: number) {
    setHiddenDownloads((prev) => {
      const next = new Set(prev);
      next.add(id);
      saveHiddenDownloads(next);
      return next;
    });
  }

  const visibleDownloads = RESOURCES.filter((r) => !hiddenDownloads.has(r.id));

  const TABS: { key: Tab; label: string }[] = [
    { key: "courses", label: "My Courses" },
    { key: "collections", label: "Collections" },
    { key: "downloads", label: "Downloads" },
    { key: "certificates", label: "Certificates" },
  ];

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <h1
          className="text-2xl md:text-3xl font-bold"
          style={{ color: "var(--bauhaus-card-inscription-main)" }}
        >
          Library
        </h1>
        <p
          className="mt-1 text-sm"
          style={{ color: "var(--bauhaus-card-inscription-sub)" }}
        >
          Your saved courses, collections, downloads, and certificates.
        </p>
      </div>

      {/* Tabs */}
      <div
        className="flex gap-1 mb-6 p-1 rounded-xl"
        style={{
          backgroundColor: "var(--bauhaus-card-bg)",
          border: "1px solid var(--bauhaus-card-separator)",
        }}
      >
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
            style={
              tab === key
                ? { backgroundColor: "#6366F1", color: "#fff" }
                : { color: "var(--bauhaus-card-inscription-sub)" }
            }
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── My Courses tab ── */}
      {tab === "courses" && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookMarked
                size={16}
                style={{ color: "var(--bauhaus-card-inscription-main)" }}
              />
              <h2
                className="font-semibold"
                style={{ color: "var(--bauhaus-card-inscription-main)" }}
              >
                Enrolled Courses
              </h2>
            </div>
            <button
              onClick={() => navigate("/courses")}
              className="flex items-center gap-1 text-sm hover:opacity-70 transition-opacity"
              style={{ color: "#6366F1" }}
            >
              View all <ArrowRight size={14} />
            </button>
          </div>

          {savedCourses.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-3xl mb-3">📚</p>
              <p
                className="text-sm font-medium"
                style={{ color: "var(--bauhaus-card-inscription-main)" }}
              >
                No enrolled courses yet
              </p>
              <button
                onClick={() => navigate("/courses")}
                className="mt-3 text-sm"
                style={{ color: "#6366F1" }}
              >
                Browse courses →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {savedCourses.map((course) => {
                const accent = courseAccent(course.id);
                return (
                  <button
                    key={course.id}
                    onClick={() => navigate(`/courses/${course.id}`)}
                    className="w-full text-left flex items-center gap-4 p-4 rounded-xl transition-all hover:scale-[1.01]"
                    style={CARD_STYLE}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: `${accent}20`,
                        border: `1px solid ${accent}33`,
                      }}
                    >
                      <BookOpen size={16} style={{ color: accent }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-medium truncate"
                        style={{
                          color: "var(--bauhaus-card-inscription-main)",
                        }}
                      >
                        {course.title}
                      </p>
                      <div
                        className="flex items-center gap-2 mt-1"
                        style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                      >
                        <span className="text-xs flex items-center gap-1">
                          <Clock size={10} />
                          {course.duration}
                        </span>
                        <span className="text-xs">
                          {course.progress}% complete
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{
                          background: `conic-gradient(${accent} ${course.progress * 3.6}deg, var(--bauhaus-card-separator) 0deg)`,
                        }}
                      >
                        <div
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: "var(--bauhaus-card-bg)" }}
                        />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* ── Collections tab ── */}
      {tab === "collections" && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2
              className="font-semibold"
              style={{ color: "var(--bauhaus-card-inscription-main)" }}
            >
              My Collections
            </h2>
            <button
              onClick={() => setNewCollectionOpen(true)}
              className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg font-medium text-white transition-opacity hover:opacity-80"
              style={{ backgroundColor: "#6366F1" }}
            >
              <FolderPlus size={14} /> New Collection
            </button>
          </div>

          {collections.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-3xl mb-3">📁</p>
              <p
                className="text-sm font-medium"
                style={{ color: "var(--bauhaus-card-inscription-main)" }}
              >
                No collections yet
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: "var(--bauhaus-card-inscription-sub)" }}
              >
                Group your courses into collections for easy access.
              </p>
              <button
                onClick={() => setNewCollectionOpen(true)}
                className="mt-4 text-sm font-medium px-4 py-2 rounded-lg text-white"
                style={{ backgroundColor: "#6366F1" }}
              >
                Create your first collection
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {collections.map((col) => (
                <div
                  key={col.id}
                  className="flex items-center gap-3 p-4 rounded-xl"
                  style={CARD_STYLE}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: "#6366F120",
                      border: "1px solid #6366F133",
                    }}
                  >
                    <BookMarked size={16} style={{ color: "#6366F1" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium truncate"
                      style={{ color: "var(--bauhaus-card-inscription-main)" }}
                    >
                      {col.name}
                    </p>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                    >
                      {col.courseIds.length}{" "}
                      {col.courseIds.length === 1 ? "course" : "courses"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => setRenaming(col)}
                      className="p-2 rounded-lg hover:opacity-70 transition-opacity"
                      aria-label={`Rename ${col.name}`}
                    >
                      <Pencil
                        size={14}
                        style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                      />
                    </button>
                    <button
                      onClick={() => setDeleting(col)}
                      className="p-2 rounded-lg hover:opacity-70 transition-opacity"
                      aria-label={`Delete ${col.name}`}
                    >
                      <Trash2 size={14} style={{ color: "#EF4444" }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── Downloads tab ── */}
      {tab === "downloads" && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Download
              size={16}
              style={{ color: "var(--bauhaus-card-inscription-main)" }}
            />
            <h2
              className="font-semibold"
              style={{ color: "var(--bauhaus-card-inscription-main)" }}
            >
              Downloads
            </h2>
          </div>

          {visibleDownloads.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-3xl mb-3">📭</p>
              <p
                className="text-sm font-medium"
                style={{ color: "var(--bauhaus-card-inscription-main)" }}
              >
                No downloads
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {visibleDownloads.map((res) => (
                <div
                  key={res.id}
                  className="flex items-center gap-3 p-4 rounded-xl"
                  style={CARD_STYLE}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: `${res.accentColor}20`,
                      border: `1px solid ${res.accentColor}33`,
                    }}
                  >
                    <FileText size={16} style={{ color: res.accentColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium truncate"
                      style={{ color: "var(--bauhaus-card-inscription-main)" }}
                    >
                      {res.title}
                    </p>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                    >
                      {res.type} · {res.size}
                    </p>
                  </div>
                  <button
                    onClick={() => hideDownload(res.id)}
                    className="p-2 rounded-lg hover:opacity-70 transition-opacity flex-shrink-0"
                    aria-label={`Remove ${res.title} from downloads`}
                  >
                    <Trash2 size={14} style={{ color: "#EF4444" }} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── Certificates tab ── */}
      {tab === "certificates" && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Award
              size={16}
              style={{ color: "var(--bauhaus-card-inscription-main)" }}
            />
            <h2
              className="font-semibold"
              style={{ color: "var(--bauhaus-card-inscription-main)" }}
            >
              Certificates
            </h2>
          </div>
          <div className="space-y-3">
            {CERTIFICATES.map((cert) => (
              <div
                key={cert.id}
                className="flex items-center gap-4 p-4 rounded-xl"
                style={CARD_STYLE}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: `${cert.accentColor}20`,
                    border: `1px solid ${cert.accentColor}33`,
                  }}
                >
                  <Award size={18} style={{ color: cert.accentColor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium truncate"
                    style={{ color: "var(--bauhaus-card-inscription-main)" }}
                  >
                    {cert.title}
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                  >
                    Issued {cert.date}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p
                    className="text-lg font-bold"
                    style={{ color: cert.accentColor }}
                  >
                    {cert.score}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Modals ── */}
      {newCollectionOpen && (
        <NameModal
          title="New Collection"
          initial=""
          onConfirm={createCollection}
          onClose={() => setNewCollectionOpen(false)}
        />
      )}

      {renaming && (
        <NameModal
          title="Rename Collection"
          initial={renaming.name}
          onConfirm={(name) => renameCollection(renaming.id, name)}
          onClose={() => setRenaming(null)}
        />
      )}

      {deleting && (
        <DeleteModal
          name={deleting.name}
          onConfirm={() => deleteCollection(deleting.id)}
          onClose={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
