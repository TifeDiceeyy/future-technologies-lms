import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, BookOpen, Lock, X, Zap } from "lucide-react";
import { useAuth } from "../store/AuthContext";
import { useApp } from "../store/AppContext";

const CARD_STYLE = {
  backgroundColor: "var(--bauhaus-card-bg)",
  border: "1px solid var(--bauhaus-card-separator)",
};

const ACCENT_POOL = [
  "#156ef6",
  "#24d200",
  "#fc6800",
  "#8f10f6",
  "#00b4d8",
  "#e91e8c",
];
const accent = (idx: number) => ACCENT_POOL[idx % ACCENT_POOL.length];

export default function PublicCourses() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { courses } = useApp();
  const isAuthenticated = !!currentUser;

  const [query, setQuery] = useState("");
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const filtered = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      (c.description ?? "").toLowerCase().includes(query.toLowerCase()) ||
      (c.category ?? "").toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header bar */}
      <div
        className="border-b px-5 md:px-12 py-5 flex items-center justify-between gap-4"
        style={{
          borderColor: "var(--bauhaus-card-separator)",
          backgroundColor: "var(--bauhaus-card-bg)",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent-foreground flex items-center justify-center">
            <BookOpen size={15} className="text-white" />
          </div>
          <span className="font-bold text-foreground text-base hidden sm:inline">
            Future Technologies — Courses
          </span>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <button
              onClick={() => navigate("/home")}
              className="text-sm font-medium px-4 py-2 rounded-lg transition-colors hover:opacity-80"
              style={{
                backgroundColor: "#156ef622",
                color: "#156ef6",
                border: "1px solid #156ef644",
              }}
            >
              Go to Dashboard
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => navigate("/register")}
                className="text-sm font-medium px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/80 transition-colors"
              >
                Register Free
              </button>
            </>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 md:px-8 py-10">
        {/* Hero text */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Explore Our{" "}
            <span className="bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
              Courses
            </span>
          </h1>
          <p className="text-muted-foreground text-base max-w-xl mx-auto">
            Browse all available courses. Register for free to enroll and start
            learning.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8 max-w-lg mx-auto">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search courses…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <BookOpen
              size={40}
              className="mx-auto mb-4 text-muted-foreground opacity-40"
            />
            <p className="text-muted-foreground text-sm">
              {query
                ? "No courses match your search."
                : "No courses available yet."}
            </p>
          </div>
        )}

        {/* Course grid */}
        {filtered.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((course, idx) => (
              <div
                key={course.id}
                className="rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform duration-200"
                style={CARD_STYLE}
              >
                {/* Color band */}
                <div
                  className="h-1.5 w-full"
                  style={{ backgroundColor: accent(idx) }}
                />

                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: `${accent(idx)}22`,
                        border: `1px solid ${accent(idx)}44`,
                      }}
                    >
                      <BookOpen size={14} style={{ color: accent(idx) }} />
                    </div>
                    {course.level && (
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded-full capitalize"
                        style={{
                          backgroundColor: `${accent(idx)}18`,
                          color: accent(idx),
                        }}
                      >
                        {course.level}
                      </span>
                    )}
                    {/* Free / Paid badge */}
                    <span
                      className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0"
                      style={
                        course.isPaid
                          ? {
                              backgroundColor: "#F59E0B18",
                              color: "#F59E0B",
                              border: "1px solid #F59E0B33",
                            }
                          : {
                              backgroundColor: "#10B98118",
                              color: "#10B981",
                              border: "1px solid #10B98133",
                            }
                      }
                    >
                      {course.isPaid && <Lock size={10} />}
                      {course.isPaid ? "Paid" : "Free"}
                    </span>
                  </div>

                  {course.category && (
                    <span className="text-xs text-muted-foreground block mb-2">
                      {course.category}
                    </span>
                  )}

                  <h3
                    className="font-semibold text-sm leading-snug mb-1"
                    style={{ color: "var(--bauhaus-card-inscription-main)" }}
                  >
                    {course.title}
                  </h3>

                  {course.description && (
                    <p
                      className="text-xs leading-relaxed mb-3 line-clamp-2"
                      style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                    >
                      {course.description}
                    </p>
                  )}

                  <div
                    className="flex items-center gap-3 text-xs mb-4"
                    style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                  >
                    {course.instructor && <span>By {course.instructor}</span>}
                    {course.modules && <span>· {course.modules} modules</span>}
                    {course.duration && <span>· {course.duration}</span>}
                  </div>

                  <button
                    onClick={() => {
                      if (course.isPaid) {
                        setUpgradeOpen(true);
                      } else {
                        navigate(
                          isAuthenticated
                            ? `/courses/${course.id}`
                            : "/register",
                        );
                      }
                    }}
                    className="w-full py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 flex items-center justify-center gap-1.5"
                    style={{
                      backgroundColor: course.isPaid ? "#F59E0B" : accent(idx),
                    }}
                  >
                    {course.isPaid ? (
                      <>
                        <Lock size={13} /> Upgrade to Access
                      </>
                    ) : isAuthenticated ? (
                      "View Course"
                    ) : (
                      "Enroll Free"
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA for unauthenticated */}
        {!isAuthenticated && filtered.length > 0 && (
          <div
            className="mt-12 rounded-2xl px-8 py-8 text-center"
            style={{
              backgroundColor: "#156ef60a",
              border: "1px solid #156ef622",
            }}
          >
            <h2 className="text-xl font-bold text-foreground mb-2">
              Ready to start learning?
            </h2>
            <p className="text-muted-foreground text-sm mb-5">
              Create a free account to enroll in any course and track your
              progress.
            </p>
            <button
              onClick={() => navigate("/register")}
              className="bg-primary text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-primary/80 transition-colors text-sm"
            >
              Create Free Account
            </button>
          </div>
        )}
      </div>

      {/* Upgrade modal */}
      {upgradeOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.65)" }}
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
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: "#F59E0B20" }}
                >
                  <Zap size={18} style={{ color: "#F59E0B" }} />
                </div>
                <h2
                  className="font-semibold"
                  style={{ color: "var(--bauhaus-card-inscription-main)" }}
                >
                  Premium Course
                </h2>
              </div>
              <button
                onClick={() => setUpgradeOpen(false)}
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
              This course requires a Pro plan. Upgrade to unlock all premium
              courses and features.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setUpgradeOpen(false)}
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
                  setUpgradeOpen(false);
                  navigate(isAuthenticated ? "/upgrade" : "/register");
                }}
                className="flex-1 py-2 rounded-xl text-sm font-semibold text-white"
                style={{ backgroundColor: "#F59E0B" }}
              >
                {isAuthenticated ? "Upgrade Plan →" : "Register Free →"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
