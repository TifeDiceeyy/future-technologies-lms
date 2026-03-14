import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  PlayCircle,
  BookOpen,
  MessageSquare,
  X,
} from "lucide-react";
import { useApp } from "@/store/AppContext";

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

const LESSON_CONTENT: Record<string, { title: string; desc: string }> = {
  "1-1": {
    title: "Introduction & Overview",
    desc: "Welcome to the course. In this lesson we'll cover what you'll learn and how to get the most out of the material.",
  },
  "1-2": {
    title: "Setting Up Your Environment",
    desc: "We'll install all required tools, configure your local environment, and run your first example.",
  },
  "1-3": {
    title: "Core Concepts",
    desc: "Deep dive into the fundamental concepts that underpin everything in this module.",
  },
  "2-1": {
    title: "Module Introduction",
    desc: "An overview of what we'll cover in this module and why it matters.",
  },
  "2-2": {
    title: "Hands-On Lab",
    desc: "Put your knowledge into practice with a guided lab exercise.",
  },
  "2-3": {
    title: "Best Practices",
    desc: "Learn the industry best practices and common pitfalls to avoid.",
  },
};

export default function LessonDetail() {
  const { id: courseId, lessonId } = useParams<{
    id: string;
    lessonId: string;
  }>();
  const navigate = useNavigate();
  const { courses } = useApp();
  const [activeTab, setActiveTab] = useState<"content" | "notes">("content");
  const [showModal, setShowModal] = useState(false);

  // Player controls — load from localStorage (mindcampus_video_prefs)
  const [speed, setSpeed] = useState<string>(() => "1x");
  const [ccOn, setCcOn] = useState<boolean>(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("mindcampus_video_prefs") ?? "{}")
          .subtitles ?? false
      );
    } catch {
      return false;
    }
  });
  const [quality, setQuality] = useState<string>(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("mindcampus_video_prefs") ?? "{}")
          .quality ?? "Auto"
      );
    } catch {
      return "Auto";
    }
  });

  const [completedLessons, setCompletedLessons] = useState<Set<string>>(() => {
    const stored = localStorage.getItem(`completed_${courseId}`);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });

  const course = courses.find((c) => c.id === Number(courseId));
  const lesson = LESSON_CONTENT[lessonId ?? "1-1"] ?? {
    title: "Lesson",
    desc: "Lesson content.",
  };

  const parts = lessonId?.split("-").map(Number) ?? [1, 1];
  const [modNum, lesNum] = parts;

  // Build the full list of lesson IDs for this course (3 lessons per module)
  const allLessonIds = course
    ? Array.from({ length: course.modules }, (_, m) =>
        Array.from({ length: 3 }, (_, l) => `${m + 1}-${l + 1}`),
      ).flat()
    : [];

  const isCompleted = completedLessons.has(lessonId ?? "");

  function handleMarkComplete() {
    if (!lessonId || !courseId) return;
    const newSet = new Set(completedLessons);
    if (newSet.has(lessonId)) {
      newSet.delete(lessonId);
    } else {
      newSet.add(lessonId);
    }
    setCompletedLessons(newSet);
    localStorage.setItem(`completed_${courseId}`, JSON.stringify([...newSet]));

    // Check if all lessons are now complete
    if (!newSet.has(lessonId) === false) return; // was a remove, skip check
    const allDone =
      allLessonIds.length > 0 && allLessonIds.every((lid) => newSet.has(lid));
    if (allDone) setShowModal(true);
  }

  // Escape key closes modal
  useEffect(() => {
    if (!showModal) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setShowModal(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showModal]);

  if (!course) {
    return (
      <div className="p-8 text-center">
        <p style={{ color: "var(--bauhaus-card-inscription-sub)" }}>
          Course not found.
        </p>
      </div>
    );
  }

  const accent = courseAccent(course.id);

  function prevLesson() {
    if (lesNum > 1) {
      navigate(`/courses/${courseId}/lessons/${modNum}-${lesNum - 1}`);
    } else if (modNum > 1) {
      navigate(`/courses/${courseId}/lessons/${modNum - 1}-3`);
    }
  }

  function nextLesson() {
    if (lesNum < 3) {
      navigate(`/courses/${courseId}/lessons/${modNum}-${lesNum + 1}`);
    } else if (course && modNum < course.modules) {
      navigate(`/courses/${courseId}/lessons/${modNum + 1}-1`);
    } else {
      navigate(`/courses/${courseId}`);
    }
  }

  return (
    <div className="max-w-4xl pb-24">
      {/* Course complete modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            backgroundColor: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(6px)",
          }}
        >
          <div
            className="relative w-full max-w-sm rounded-2xl p-8 text-center"
            style={CARD_STYLE}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>
            <div className="text-6xl mb-4">🎓</div>
            <h2
              className="text-2xl font-bold mb-1"
              style={{ color: "var(--bauhaus-card-inscription-main)" }}
            >
              Course Complete!
            </h2>
            <p
              className="text-sm mb-6"
              style={{ color: "var(--bauhaus-card-inscription-sub)" }}
            >
              {course.title}
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate("/library")}
                className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90"
                style={{ backgroundColor: accent }}
              >
                View Certificate
              </button>
              <button
                onClick={() => navigate("/courses")}
                className="w-full py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-80"
                style={{
                  ...CARD_STYLE,
                  color: "var(--bauhaus-card-inscription-main)",
                }}
              >
                Browse More Courses
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top nav */}
      <div
        className="flex items-center justify-between p-4 md:p-6 sticky top-0 z-10"
        style={{
          backgroundColor: "var(--bauhaus-card-bg)",
          borderBottom: "1px solid var(--bauhaus-card-separator)",
        }}
      >
        <button
          onClick={() => navigate(`/courses/${courseId}`)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft size={18} />
          {course.title}
        </button>
        <span
          className="text-xs"
          style={{ color: "var(--bauhaus-card-inscription-sub)" }}
        >
          Module {modNum} · Lesson {lesNum}
        </span>
      </div>

      {/* Video area */}
      <div
        className="mx-4 md:mx-6 mt-4 rounded-2xl overflow-hidden aspect-video flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${accent}22, ${accent}08)`,
          border: `1px solid ${accent}33`,
        }}
      >
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 cursor-pointer hover:scale-110 transition-transform"
            style={{
              backgroundColor: `${accent}30`,
              border: `2px solid ${accent}`,
            }}
          >
            <PlayCircle size={32} style={{ color: accent }} />
          </div>
          <p
            className="text-sm font-medium"
            style={{ color: "var(--bauhaus-card-inscription-main)" }}
          >
            {lesson.title}
          </p>
          <p
            className="text-xs mt-1"
            style={{ color: "var(--bauhaus-card-inscription-sub)" }}
          >
            Click to play
          </p>
        </div>
      </div>

      {/* Player controls */}
      <div
        className="mx-4 md:mx-6 mt-3 flex items-center gap-3 flex-wrap"
        style={{ color: "var(--bauhaus-card-inscription-sub)" }}
      >
        {/* Speed */}
        <label className="flex items-center gap-1.5 text-xs">
          <span>Speed</span>
          <select
            value={speed}
            onChange={(e) => setSpeed(e.target.value)}
            className="rounded-lg px-2 py-1 text-xs outline-none"
            style={{
              backgroundColor: "var(--bauhaus-card-bg)",
              border: "1px solid var(--bauhaus-card-separator)",
              color: "var(--bauhaus-card-inscription-main)",
            }}
          >
            {["0.5x", "0.75x", "1x", "1.25x", "1.5x", "2x"].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        {/* Quality */}
        <label className="flex items-center gap-1.5 text-xs">
          <span>Quality</span>
          <select
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
            className="rounded-lg px-2 py-1 text-xs outline-none"
            style={{
              backgroundColor: "var(--bauhaus-card-bg)",
              border: "1px solid var(--bauhaus-card-separator)",
              color: "var(--bauhaus-card-inscription-main)",
            }}
          >
            {["Auto", "1080p", "720p", "480p", "360p"].map((q) => (
              <option key={q} value={q}>
                {q}
              </option>
            ))}
          </select>
        </label>

        {/* CC toggle */}
        <button
          onClick={() => setCcOn((v) => !v)}
          className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg transition-all"
          style={
            ccOn
              ? {
                  backgroundColor: `${accent}22`,
                  color: accent,
                  border: `1px solid ${accent}44`,
                }
              : {
                  backgroundColor: "var(--bauhaus-card-bg)",
                  border: "1px solid var(--bauhaus-card-separator)",
                }
          }
          aria-pressed={ccOn}
        >
          CC {ccOn ? "On" : "Off"}
        </button>
      </div>

      {/* Tabs */}
      <div
        className="flex items-center gap-1 px-4 md:px-6 mt-6"
        style={{ borderBottom: "1px solid var(--bauhaus-card-separator)" }}
      >
        {(["content", "notes"] as const).map((tab) => {
          const active = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex items-center gap-1.5 px-4 py-3 text-sm font-medium capitalize transition-colors"
              style={{
                color: active
                  ? "var(--bauhaus-card-inscription-main)"
                  : "var(--bauhaus-card-inscription-sub)",
                borderBottom: active
                  ? `2px solid ${accent}`
                  : "2px solid transparent",
              }}
            >
              {tab === "content" ? (
                <BookOpen size={14} />
              ) : (
                <MessageSquare size={14} />
              )}
              {tab}
            </button>
          );
        })}
      </div>

      <div className="px-4 md:px-6 mt-5">
        {activeTab === "content" && (
          <div className="animate-fade-in-up">
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: "var(--bauhaus-card-inscription-main)" }}
            >
              {lesson.title}
            </h2>
            <p
              className="text-sm leading-relaxed mb-6"
              style={{ color: "var(--bauhaus-card-inscription-sub)" }}
            >
              {lesson.desc} This lesson builds directly on the previous material
              and prepares you for the hands-on lab in the next section. Take
              your time, pause the video to take notes, and make sure to
              complete the exercise at the end.
            </p>

            {/* Key takeaways */}
            <div className="rounded-xl p-4 mb-6" style={CARD_STYLE}>
              <h3
                className="text-sm font-semibold mb-3"
                style={{ color: "var(--bauhaus-card-inscription-main)" }}
              >
                Key takeaways
              </h3>
              <div className="space-y-2">
                {[
                  "Understand the core principle behind this topic",
                  "Apply the concept in a real-world scenario",
                  "Avoid common mistakes and pitfalls",
                ].map((point) => (
                  <div key={point} className="flex items-start gap-2">
                    <CheckCircle2
                      size={14}
                      className="flex-shrink-0 mt-0.5"
                      style={{ color: accent }}
                    />
                    <span
                      className="text-sm"
                      style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                    >
                      {point}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mark complete */}
            <button
              onClick={handleMarkComplete}
              className="flex items-center gap-2 text-sm font-medium transition-all hover:opacity-80"
              style={{
                color: isCompleted
                  ? "#10B981"
                  : "var(--bauhaus-card-inscription-sub)",
              }}
            >
              <CheckCircle2 size={18} fill={isCompleted ? "#10B981" : "none"} />
              {isCompleted ? "Marked as complete" : "Mark as complete"}
            </button>
          </div>
        )}

        {activeTab === "notes" && (
          <div className="animate-fade-in-up">
            <textarea
              placeholder="Take notes as you watch…"
              className="w-full h-48 rounded-xl p-4 text-sm resize-none focus:outline-none focus:ring-1 transition-colors"
              style={{
                ...CARD_STYLE,
                color: "var(--bauhaus-card-inscription-main)",
              }}
            />
          </div>
        )}
      </div>

      {/* Sticky prev/next */}
      <div
        className="fixed bottom-0 left-0 right-0 md:left-64 p-4 flex items-center gap-3 border-t"
        style={{
          backgroundColor: "var(--bauhaus-card-bg)",
          borderColor: "var(--bauhaus-card-separator)",
        }}
      >
        <button
          onClick={prevLesson}
          className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:opacity-80"
          style={{
            ...CARD_STYLE,
            color: "var(--bauhaus-card-inscription-main)",
          }}
        >
          <ChevronLeft size={16} /> Prev
        </button>
        <button
          onClick={nextLesson}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
          style={{ backgroundColor: accent, color: "#fff" }}
        >
          Next lesson <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
