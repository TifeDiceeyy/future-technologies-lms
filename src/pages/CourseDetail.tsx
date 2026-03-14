import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Star,
  Clock,
  Users,
  BookOpen,
  PlayCircle,
  CheckCircle2,
  Lock,
  ChevronDown,
  ChevronUp,
  Award,
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

// Generate mock modules for a course
function getMockModules(
  courseId: number,
  totalModules: number,
  completedModules: number,
) {
  const moduleNames: Record<number, string[]> = {
    1: [
      "AWS Foundations",
      "S3 & Storage",
      "EC2 Instances",
      "VPC Networking",
      "IAM & Security",
      "CloudFront CDN",
      "Route 53",
      "RDS Databases",
      "Lambda Functions",
      "API Gateway",
      "CloudWatch",
      "Final Project",
    ],
    2: [
      "TypeScript Basics",
      "React Fundamentals",
      "Hooks Deep Dive",
      "State Management",
      "Forms & Validation",
      "API Integration",
      "Testing",
      "Performance",
      "Deployment",
      "Final Project",
    ],
    3: [
      "Python Basics",
      "NumPy",
      "Pandas",
      "Data Visualisation",
      "Statistics",
      "Machine Learning Intro",
      "Scikit-Learn",
      "Matplotlib",
      "Data Cleaning",
      "Final Project",
      "Portfolio",
      "Certification",
      "Advanced Topics",
      "Capstone",
    ],
    4: [
      "Terraform Basics",
      "Providers & Resources",
      "Variables & Outputs",
      "Modules",
      "State Management",
      "Workspaces",
      "CI/CD Integration",
      "Final Project",
    ],
    5: [
      "Docker Basics",
      "Containers",
      "Dockerfile",
      "Docker Compose",
      "Kubernetes Intro",
      "Pods & Services",
      "Deployments",
      "Ingress",
      "Helm",
      "Production",
      "Monitoring",
    ],
    6: [
      "ML Fundamentals",
      "Python for ML",
      "Linear Regression",
      "Classification",
      "Neural Networks",
      "Deep Learning",
      "CNNs",
      "NLP Basics",
      "Model Deployment",
      "MLOps",
      "Capstone",
      "Advanced Topics",
      "Ethics in AI",
      "Final Project",
      "Portfolio",
      "Certification",
    ],
  };
  const names =
    moduleNames[courseId] ||
    Array.from({ length: totalModules }, (_, i) => `Module ${i + 1}`);
  return Array.from({ length: totalModules }, (_, i) => ({
    id: i + 1,
    title: names[i] || `Module ${i + 1}`,
    lessons: Math.floor(Math.random() * 3) + 3,
    duration: `${Math.floor(Math.random() * 60) + 30}min`,
    completed: i < completedModules,
    locked: i > completedModules,
  }));
}

const TABS = ["Overview", "Curriculum", "Reviews"] as const;
type Tab = (typeof TABS)[number];

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { courses } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [expandedModule, setExpandedModule] = useState<number | null>(1);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const reviewInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!reviewOpen) return;
    reviewInputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setReviewOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [reviewOpen]);

  // Read completed lessons from localStorage for this course
  const completedLessons: Set<string> = (() => {
    const stored = localStorage.getItem(`completed_${id}`);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  })();

  const course = courses.find((c) => c.id === Number(id));
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
  const modules = getMockModules(
    course.id,
    course.modules,
    course.modulesCompleted,
  );

  return (
    <div className="max-w-4xl pb-24">
      {/* Header bar */}
      <div className="flex items-center gap-3 p-4 md:p-6">
        <button
          onClick={() => navigate("/courses")}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Back to courses"
        >
          <ChevronLeft size={22} />
        </button>
        <span
          className="text-sm font-medium"
          style={{ color: "var(--bauhaus-card-inscription-sub)" }}
        >
          My Courses
        </span>
      </div>

      {/* Course hero */}
      <div className="px-4 md:px-6 mb-6">
        <div
          className="rounded-2xl p-6 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${accent}22, ${accent}08)`,
            border: `1px solid ${accent}33`,
          }}
        >
          <div
            className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: accent }}
          />
          <div className="relative z-10">
            <span
              className="inline-block text-xs font-medium px-2.5 py-1 rounded-full mb-3"
              style={{
                backgroundColor: `${accent}25`,
                color: accent,
                border: `1px solid ${accent}40`,
              }}
            >
              {course.category} · {course.level}
            </span>
            <h1
              className="text-xl md:text-2xl font-bold mb-2 leading-tight"
              style={{ color: "var(--bauhaus-card-inscription-main)" }}
            >
              {course.title}
            </h1>
            <p
              className="text-sm mb-4"
              style={{ color: "var(--bauhaus-card-inscription-sub)" }}
            >
              by {course.instructor}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
              <span
                className="flex items-center gap-1.5"
                style={{ color: "#F59E0B" }}
              >
                <Star size={13} fill="currentColor" />
                {course.rating}
              </span>
              <span
                className="flex items-center gap-1.5"
                style={{ color: "var(--bauhaus-card-inscription-sub)" }}
              >
                <Users size={13} />
                {course.studentsEnrolled} students
              </span>
              <span
                className="flex items-center gap-1.5"
                style={{ color: "var(--bauhaus-card-inscription-sub)" }}
              >
                <Clock size={13} />
                {course.duration}
              </span>
              <span
                className="flex items-center gap-1.5"
                style={{ color: "var(--bauhaus-card-inscription-sub)" }}
              >
                <BookOpen size={13} />
                {course.modules} modules
              </span>
            </div>

            {/* Progress (if enrolled) */}
            {course.enrolled && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className="text-xs"
                    style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                  >
                    Your progress
                  </span>
                  <span
                    className="text-xs font-semibold"
                    style={{ color: accent }}
                  >
                    {course.progress}%
                  </span>
                </div>
                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ backgroundColor: `${accent}30` }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${course.progress}%`,
                      backgroundColor: accent,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex items-center gap-1 px-4 md:px-6 mb-6 overflow-x-auto whitespace-nowrap hide-scrollbar"
        style={{ borderBottom: "1px solid var(--bauhaus-card-separator)" }}
      >
        {TABS.map((tab) => {
          const active = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-shrink-0 px-4 py-3 text-sm font-medium transition-colors"
              style={{
                color: active
                  ? "var(--bauhaus-card-inscription-main)"
                  : "var(--bauhaus-card-inscription-sub)",
                borderBottom: active
                  ? `2px solid ${accent}`
                  : "2px solid transparent",
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      <div className="px-4 md:px-6">
        {/* Overview tab */}
        {activeTab === "Overview" && (
          <div className="space-y-6 animate-fade-in-up">
            <div>
              <h2
                className="font-semibold mb-2"
                style={{ color: "var(--bauhaus-card-inscription-main)" }}
              >
                About this course
              </h2>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--bauhaus-card-inscription-sub)" }}
              >
                {course.description} This comprehensive course will take you
                from the fundamentals all the way to advanced concepts, with
                hands-on projects and real-world scenarios.
              </p>
            </div>

            <div>
              <h2
                className="font-semibold mb-3"
                style={{ color: "var(--bauhaus-card-inscription-main)" }}
              >
                What you'll learn
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  "Understand core concepts and architecture",
                  "Apply best practices in real-world scenarios",
                  "Build and deploy production-grade projects",
                  "Pass industry certification exams",
                  "Work with modern tooling and workflows",
                  "Debug and optimize your implementations",
                ].map((point) => (
                  <div key={point} className="flex items-start gap-2">
                    <CheckCircle2
                      size={15}
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

            {/* Instructor bio */}
            <div className="rounded-xl p-4" style={CARD_STYLE}>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white text-base font-bold flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${accent}, ${accent}88)`,
                  }}
                >
                  {course.instructor.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--bauhaus-card-inscription-main)" }}
                  >
                    {course.instructor}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                  >
                    Senior Instructor · MindCampus
                  </p>
                </div>
              </div>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--bauhaus-card-inscription-sub)" }}
              >
                {course.instructor} is an industry practitioner with over 8
                years of hands-on experience. Their courses combine real-world
                case studies with practical exercises to help students build
                job-ready skills fast.
              </p>
            </div>

            {course.currentScore !== null && (
              <div className="rounded-xl p-4" style={CARD_STYLE}>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: "#F59E0B20",
                      border: "1px solid #F59E0B33",
                    }}
                  >
                    <Award size={18} style={{ color: "#F59E0B" }} />
                  </div>
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--bauhaus-card-inscription-main)" }}
                    >
                      Current score: {course.currentScore}%
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                    >
                      Keep it up — you're on track for a certificate
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Curriculum tab */}
        {activeTab === "Curriculum" && (
          <div className="space-y-2 animate-fade-in-up">
            <p
              className="text-sm mb-4"
              style={{ color: "var(--bauhaus-card-inscription-sub)" }}
            >
              {course.modules} modules · {course.modulesCompleted} completed
            </p>
            {modules.map((mod) => (
              <div
                key={mod.id}
                className="rounded-xl overflow-hidden transition-all"
                style={CARD_STYLE}
              >
                <button
                  className="w-full flex items-center gap-3 p-4 text-left"
                  onClick={() =>
                    setExpandedModule(expandedModule === mod.id ? null : mod.id)
                  }
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold"
                    style={
                      mod.completed
                        ? { backgroundColor: "#10B98120", color: "#10B981" }
                        : mod.locked
                          ? {
                              backgroundColor: "var(--bauhaus-card-separator)",
                              color: "var(--bauhaus-card-inscription-sub)",
                            }
                          : { backgroundColor: `${accent}20`, color: accent }
                    }
                  >
                    {mod.completed ? (
                      <CheckCircle2 size={14} />
                    ) : mod.locked ? (
                      <Lock size={12} />
                    ) : (
                      mod.id
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium"
                      style={{
                        color: mod.locked
                          ? "var(--bauhaus-card-inscription-sub)"
                          : "var(--bauhaus-card-inscription-main)",
                      }}
                    >
                      {mod.title}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                    >
                      {mod.lessons} lessons · {mod.duration}
                    </p>
                  </div>
                  {expandedModule === mod.id ? (
                    <ChevronUp
                      size={16}
                      style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                    />
                  ) : (
                    <ChevronDown
                      size={16}
                      style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                    />
                  )}
                </button>

                {expandedModule === mod.id && (
                  <div
                    className="px-4 pb-3"
                    style={{
                      borderTop: "1px solid var(--bauhaus-card-separator)",
                    }}
                  >
                    {Array.from({ length: mod.lessons }, (_, i) => {
                      const lid = `${mod.id}-${i + 1}`;
                      const lessonDone = completedLessons.has(lid);
                      return (
                        <button
                          key={i}
                          className="w-full flex items-center gap-3 py-2.5 text-left hover:opacity-70 transition-opacity"
                          onClick={() =>
                            !mod.locked &&
                            navigate(`/courses/${course.id}/lessons/${lid}`)
                          }
                          disabled={mod.locked}
                        >
                          {lessonDone ? (
                            <CheckCircle2
                              size={15}
                              style={{ color: "#10B981" }}
                              fill="#10B981"
                            />
                          ) : (
                            <PlayCircle
                              size={15}
                              style={{
                                color: mod.locked
                                  ? "var(--bauhaus-card-inscription-sub)"
                                  : accent,
                              }}
                            />
                          )}
                          <span
                            className="text-sm"
                            style={{
                              color: lessonDone
                                ? "#10B981"
                                : mod.locked
                                  ? "var(--bauhaus-card-inscription-sub)"
                                  : "var(--bauhaus-card-inscription-main)",
                            }}
                          >
                            Lesson {i + 1}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Reviews tab */}
        {activeTab === "Reviews" && (
          <div className="animate-fade-in-up">
            {/* Write a review button */}
            <div className="flex items-center justify-between mb-5">
              <span
                className="text-sm font-medium"
                style={{ color: "var(--bauhaus-card-inscription-sub)" }}
              >
                Student reviews
              </span>
              {reviewSubmitted ? (
                <span
                  className="text-xs px-3 py-1.5 rounded-lg"
                  style={{ backgroundColor: "#10B98115", color: "#10B981" }}
                >
                  ✓ Review submitted
                </span>
              ) : (
                <button
                  onClick={() => setReviewOpen(true)}
                  className="text-sm font-medium px-3 py-1.5 rounded-lg text-white hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: accent }}
                >
                  Write a Review
                </button>
              )}
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="text-center">
                <p
                  className="text-5xl font-bold"
                  style={{ color: "var(--bauhaus-card-inscription-main)" }}
                >
                  {course.rating}
                </p>
                <div className="flex items-center gap-0.5 mt-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={14}
                      fill={s <= Math.round(course.rating) ? "#F59E0B" : "none"}
                      style={{ color: "#F59E0B" }}
                    />
                  ))}
                </div>
                <p
                  className="text-xs mt-1"
                  style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                >
                  {course.studentsEnrolled} ratings
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                {
                  name: "Amara T.",
                  rating: 5,
                  comment:
                    "Absolutely brilliant course. The hands-on projects made everything click.",
                },
                {
                  name: "Kofi M.",
                  rating: 5,
                  comment:
                    "Best structured course I've taken. The instructor explains complex topics simply.",
                },
                {
                  name: "Priya K.",
                  rating: 4,
                  comment:
                    "Very thorough and well-paced. A few modules could be more concise but overall excellent.",
                },
              ].map((review) => (
                <div
                  key={review.name}
                  className="rounded-xl p-4"
                  style={CARD_STYLE}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--bauhaus-card-inscription-main)" }}
                    >
                      {review.name}
                    </p>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={11}
                          fill={s <= review.rating ? "#F59E0B" : "none"}
                          style={{ color: "#F59E0B" }}
                        />
                      ))}
                    </div>
                  </div>
                  <p
                    className="text-sm"
                    style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                  >
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Write Review modal */}
      {reviewOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setReviewOpen(false);
          }}
        >
          <div
            className="w-full max-w-sm rounded-2xl p-6 shadow-2xl"
            style={CARD_STYLE}
            role="dialog"
            aria-modal="true"
            aria-label="Write a review"
          >
            <div className="flex items-center justify-between mb-4">
              <h2
                className="font-semibold"
                style={{ color: "var(--bauhaus-card-inscription-main)" }}
              >
                Write a Review
              </h2>
              <button
                onClick={() => setReviewOpen(false)}
                className="p-1 hover:opacity-70"
              >
                <X
                  size={16}
                  style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                />
              </button>
            </div>
            {/* Star rating */}
            <div className="flex items-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} onClick={() => setReviewRating(s)}>
                  <Star
                    size={22}
                    fill={s <= reviewRating ? "#F59E0B" : "none"}
                    style={{ color: "#F59E0B" }}
                  />
                </button>
              ))}
            </div>
            <textarea
              ref={reviewInputRef}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your experience with this course..."
              rows={4}
              className="w-full px-3 py-2 rounded-xl text-sm outline-none resize-none"
              style={{
                backgroundColor: "var(--bauhaus-card-separator)",
                color: "var(--bauhaus-card-inscription-main)",
                border: "1px solid var(--bauhaus-card-separator)",
              }}
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setReviewOpen(false)}
                className="flex-1 py-2 rounded-xl text-sm font-medium hover:opacity-70"
                style={{
                  backgroundColor: "var(--bauhaus-card-separator)",
                  color: "var(--bauhaus-card-inscription-sub)",
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setReviewOpen(false);
                  setReviewSubmitted(true);
                  setReviewText("");
                }}
                disabled={!reviewText.trim()}
                className="flex-1 py-2 rounded-xl text-sm font-medium text-white disabled:opacity-40"
                style={{ backgroundColor: accent }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky bottom CTA */}
      <div
        className="fixed bottom-0 left-0 right-0 md:left-64 p-4 border-t"
        style={{
          backgroundColor: "var(--bauhaus-card-bg)",
          borderColor: "var(--bauhaus-card-separator)",
        }}
      >
        <button
          onClick={() => {
            if (!course.enrolled && course.isPaid) {
              setUpgradeOpen(true);
            } else {
              navigate(`/courses/${course.id}/lessons/1-1`);
            }
          }}
          className="w-full max-w-lg mx-auto flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
          style={{ backgroundColor: accent, color: "#fff" }}
        >
          {!course.enrolled && course.isPaid ? (
            <Lock size={18} />
          ) : (
            <PlayCircle size={18} />
          )}
          {course.enrolled
            ? course.progress > 0
              ? "Continue Learning"
              : "Start Course"
            : course.isPaid
              ? "Unlock Course"
              : "Enrol Now"}
        </button>
      </div>

      {/* Upgrade modal */}
      {upgradeOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setUpgradeOpen(false);
          }}
        >
          <div
            className="w-full max-w-sm rounded-2xl p-6 shadow-2xl"
            style={{
              backgroundColor: "var(--bauhaus-card-bg)",
              border: "1px solid var(--bauhaus-card-separator)",
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: `${accent}22`,
                  border: `1px solid ${accent}44`,
                }}
              >
                <Lock size={18} style={{ color: accent }} />
              </div>
              <div>
                <h2
                  className="font-semibold text-base"
                  style={{ color: "var(--bauhaus-card-inscription-main)" }}
                >
                  This is a paid course
                </h2>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                >
                  Upgrade your plan to unlock full access.
                </p>
              </div>
            </div>

            <p
              className="text-sm mb-6 leading-relaxed"
              style={{ color: "var(--bauhaus-card-inscription-sub)" }}
            >
              Get unlimited access to all paid courses, certificates, and live
              sessions with a Pro or Teams plan.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setUpgradeOpen(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-80"
                style={{
                  backgroundColor: "var(--bauhaus-card-separator)",
                  color: "var(--bauhaus-card-inscription-sub)",
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setUpgradeOpen(false);
                  navigate("/upgrade");
                }}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                style={{ backgroundColor: accent, color: "#fff" }}
              >
                Upgrade Plan →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
