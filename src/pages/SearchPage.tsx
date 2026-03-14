import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Search,
  BookOpen,
  Clock,
  Star,
  X,
  TrendingUp,
  SlidersHorizontal,
  LayoutGrid,
  LayoutList,
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

const CATEGORIES = ["All", "Cloud", "Frontend", "Data", "DevOps", "AI/ML"];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];
const SORT_OPTIONS = ["Relevance", "Newest", "Most Popular", "Highest Rated"];
const RECENT_SEARCHES = [
  "AWS Lambda",
  "React hooks",
  "Python pandas",
  "Terraform modules",
];

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { courses } = useApp();

  // Initialise from URL params
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const [activeCategory, setActiveCategory] = useState(
    () => searchParams.get("category") ?? "All",
  );
  const [sortBy, setSortBy] = useState(
    () => searchParams.get("sort") ?? "Relevance",
  );
  const [levels, setLevels] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterOpen, setFilterOpen] = useState(false);

  // Sync URL params on state change
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (activeCategory !== "All") params.set("category", activeCategory);
    if (sortBy !== "Relevance") params.set("sort", sortBy);
    navigate(`/search?${params.toString()}`, { replace: true });
  }, [query, activeCategory, sortBy]); // eslint-disable-line react-hooks/exhaustive-deps

  // Close filter sheet on Escape
  useEffect(() => {
    if (!filterOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFilterOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [filterOpen]);

  const toggleLevel = useCallback((lvl: string) => {
    setLevels((prev) => {
      const next = new Set(prev);
      if (next.has(lvl)) next.delete(lvl);
      else next.add(lvl);
      return next;
    });
  }, []);

  const activeFilterCount =
    (activeCategory !== "All" ? 1 : 0) +
    levels.size +
    (sortBy !== "Relevance" ? 1 : 0);

  const results = useMemo(() => {
    if (!query.trim() && activeCategory === "All" && levels.size === 0)
      return [];
    let filtered = courses.filter((c) => {
      const matchesQuery =
        !query.trim() ||
        c.title.toLowerCase().includes(query.toLowerCase()) ||
        c.description.toLowerCase().includes(query.toLowerCase()) ||
        c.instructor.toLowerCase().includes(query.toLowerCase());
      const matchesCategory =
        activeCategory === "All" || c.category === activeCategory;
      const matchesLevel = levels.size === 0 || levels.has(c.level);
      return matchesQuery && matchesCategory && matchesLevel;
    });
    if (sortBy === "Highest Rated")
      filtered = [...filtered].sort((a, b) => b.rating - a.rating);
    if (sortBy === "Most Popular")
      filtered = [...filtered].sort(
        (a, b) => b.studentsEnrolled - a.studentsEnrolled,
      );
    return filtered;
  }, [query, activeCategory, sortBy, levels, courses]);

  const showRecent =
    !query.trim() && activeCategory === "All" && levels.size === 0;

  function resetFilters() {
    setActiveCategory("All");
    setSortBy("Relevance");
    setLevels(new Set());
  }

  return (
    <div className="p-4 md:p-8 max-w-3xl">
      {/* Filter bottom sheet overlay */}
      {filterOpen && (
        <div
          className="fixed inset-0 z-50"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setFilterOpen(false)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 rounded-t-2xl p-6 max-h-[85vh] overflow-y-auto"
            style={CARD_STYLE}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle */}
            <div className="w-10 h-1 rounded-full bg-border mx-auto mb-5" />

            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-foreground">Filters</h2>
              <button
                onClick={resetFilters}
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Reset
              </button>
            </div>

            {/* Category */}
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                Type
              </p>
              <div className="space-y-2">
                {(["All", "Courses"] as const).map((t) => (
                  <label
                    key={t}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="type"
                      checked={
                        t === "All"
                          ? activeCategory === "All"
                          : activeCategory !== "All"
                      }
                      onChange={() =>
                        setActiveCategory(
                          t === "All"
                            ? "All"
                            : activeCategory === "All"
                              ? "Cloud"
                              : activeCategory,
                        )
                      }
                      className="accent-primary"
                    />
                    <span className="text-sm text-foreground">{t}</span>
                  </label>
                ))}
                <label className="flex items-center gap-3 opacity-40 cursor-not-allowed">
                  <input type="radio" disabled />
                  <span className="text-sm text-muted-foreground">
                    Shorts <span className="text-xs">(coming soon)</span>
                  </span>
                </label>
              </div>
            </div>

            {/* Level */}
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                Level
              </p>
              <div className="space-y-2">
                {LEVELS.map((lvl) => (
                  <label
                    key={lvl}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={levels.has(lvl)}
                      onChange={() => toggleLevel(lvl)}
                      className="accent-primary"
                    />
                    <span className="text-sm text-foreground">{lvl}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                Sort by
              </p>
              <div className="space-y-2">
                {SORT_OPTIONS.map((opt) => (
                  <label
                    key={opt}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="sort"
                      checked={sortBy === opt}
                      onChange={() => setSortBy(opt)}
                      className="accent-primary"
                    />
                    <span className="text-sm text-foreground">{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={() => setFilterOpen(false)}
              className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90"
              style={{ backgroundColor: "#6366F1" }}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h1
          className="text-2xl md:text-3xl font-bold mb-1"
          style={{ color: "var(--bauhaus-card-inscription-main)" }}
        >
          Search
        </h1>
        <p
          className="text-sm"
          style={{ color: "var(--bauhaus-card-inscription-sub)" }}
        >
          Find courses, lessons, and resources.
        </p>
      </div>

      {/* Search input + filter button */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2"
            style={{ color: "var(--bauhaus-card-inscription-sub)" }}
          />
          <input
            type="text"
            placeholder="Search for courses, topics…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full h-12 bg-muted/50 border border-border rounded-xl pl-11 pr-11 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-colors"
            style={{ color: "var(--bauhaus-card-inscription-main)" }}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
              style={{ color: "var(--bauhaus-card-inscription-sub)" }}
            >
              <X size={16} />
            </button>
          )}
        </div>
        {/* Filter button */}
        <div className="relative">
          <button
            onClick={() => setFilterOpen(true)}
            aria-label="Open filters"
            className="h-12 w-12 flex items-center justify-center rounded-xl border border-border transition-all hover:border-primary/40"
            style={CARD_STYLE}
          >
            <SlidersHorizontal
              size={18}
              style={{ color: "var(--bauhaus-card-inscription-sub)" }}
            />
          </button>
          {activeFilterCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </div>
      </div>

      {/* Category chips */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto whitespace-nowrap hide-scrollbar">
        {CATEGORIES.map((cat) => {
          const active = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:opacity-90"
              style={
                active
                  ? {
                      backgroundColor: "#6366F122",
                      border: "1px solid #6366F155",
                      color: "#6366F1",
                    }
                  : {
                      ...CARD_STYLE,
                      color: "var(--bauhaus-card-inscription-sub)",
                    }
              }
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Grid/List toggle (only when showing results) */}
      {!showRecent && (
        <div className="flex items-center justify-between mb-4">
          <p
            className="text-sm"
            style={{ color: "var(--bauhaus-card-inscription-sub)" }}
          >
            {results.length} result{results.length !== 1 ? "s" : ""}
            {query ? ` for "${query}"` : ""}
          </p>
          <div className="flex items-center gap-1">
            {(["grid", "list"] as const).map((mode) => {
              const Icon = mode === "grid" ? LayoutGrid : LayoutList;
              const active = viewMode === mode;
              return (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  aria-label={`${mode} view`}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                  style={
                    active
                      ? { backgroundColor: "#6366F1", color: "#fff" }
                      : {
                          ...CARD_STYLE,
                          color: "var(--bauhaus-card-inscription-sub)",
                        }
                  }
                >
                  <Icon size={15} />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent searches */}
      {showRecent && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp
              size={15}
              style={{ color: "var(--bauhaus-card-inscription-sub)" }}
            />
            <p
              className="text-sm font-medium"
              style={{ color: "var(--bauhaus-card-inscription-sub)" }}
            >
              Recent searches
            </p>
          </div>
          <div className="flex flex-wrap gap-2 mb-8">
            {RECENT_SEARCHES.map((s) => (
              <button
                key={s}
                onClick={() => setQuery(s)}
                className="px-3 py-1.5 rounded-lg text-sm transition-all hover:opacity-80"
                style={CARD_STYLE}
              >
                <span style={{ color: "var(--bauhaus-card-inscription-main)" }}>
                  {s}
                </span>
              </button>
            ))}
          </div>
          <p
            className="text-sm font-medium mb-4"
            style={{ color: "var(--bauhaus-card-inscription-sub)" }}
          >
            Browse all courses
          </p>
          <div className="space-y-3">
            {courses.map((course) => {
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
                      style={{ color: "var(--bauhaus-card-inscription-main)" }}
                    >
                      {course.title}
                    </p>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                    >
                      {course.instructor} · {course.category}
                    </p>
                  </div>
                  <div
                    className="flex items-center gap-1 text-xs flex-shrink-0"
                    style={{ color: "#F59E0B" }}
                  >
                    <Star size={11} fill="currentColor" />
                    {course.rating}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Results */}
      {!showRecent &&
        results.length > 0 &&
        (viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {results.map((course) => {
              const accent = courseAccent(course.id);
              return (
                <button
                  key={course.id}
                  onClick={() => navigate(`/courses/${course.id}`)}
                  className="text-left p-4 rounded-xl transition-all hover:scale-[1.01]"
                  style={CARD_STYLE}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{
                      backgroundColor: `${accent}20`,
                      border: `1px solid ${accent}33`,
                    }}
                  >
                    <BookOpen size={16} style={{ color: accent }} />
                  </div>
                  <p
                    className="text-sm font-medium mb-1"
                    style={{ color: "var(--bauhaus-card-inscription-main)" }}
                  >
                    {course.title}
                  </p>
                  <p
                    className="text-xs mb-2 line-clamp-2"
                    style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                  >
                    {course.description}
                  </p>
                  <div
                    className="flex items-center gap-3 text-xs"
                    style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                  >
                    <span
                      className="flex items-center gap-1"
                      style={{ color: "#F59E0B" }}
                    >
                      <Star size={11} fill="currentColor" />
                      {course.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {course.duration}
                    </span>
                    <span
                      className="px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: `${accent}15`, color: accent }}
                    >
                      {course.category}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3">
            {results.map((course) => {
              const accent = courseAccent(course.id);
              return (
                <button
                  key={course.id}
                  onClick={() => navigate(`/courses/${course.id}`)}
                  className="w-full text-left flex items-start gap-4 p-4 rounded-xl transition-all hover:scale-[1.01]"
                  style={CARD_STYLE}
                >
                  <div
                    className="w-20 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: `${accent}20`,
                      border: `1px solid ${accent}33`,
                    }}
                  >
                    <BookOpen size={20} style={{ color: accent }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--bauhaus-card-inscription-main)" }}
                    >
                      {course.title}
                    </p>
                    <p
                      className="text-xs mt-0.5 line-clamp-1"
                      style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                    >
                      {course.description}
                    </p>
                    <div
                      className="flex items-center gap-3 mt-2 text-xs"
                      style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                    >
                      <span
                        className="flex items-center gap-1"
                        style={{ color: "#F59E0B" }}
                      >
                        <Star size={11} fill="currentColor" />
                        {course.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {course.duration}
                      </span>
                      <span
                        className="px-1.5 py-0.5 rounded"
                        style={{
                          backgroundColor: `${accent}15`,
                          color: accent,
                        }}
                      >
                        {course.category}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ))}

      {/* Empty state */}
      {!showRecent && results.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">😢</div>
          <p
            className="font-semibold mb-1"
            style={{ color: "var(--bauhaus-card-inscription-main)" }}
          >
            No results for &ldquo;{query}&rdquo;
          </p>
          <p
            className="text-sm mb-6"
            style={{ color: "var(--bauhaus-card-inscription-sub)" }}
          >
            Try different keywords or filters
          </p>
          <button
            onClick={() => {
              setQuery("");
              setActiveCategory("All");
              setSortBy("Relevance");
              setLevels(new Set());
            }}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-90"
            style={{ backgroundColor: "#6366F1", color: "#fff" }}
          >
            Browse all courses
          </button>
        </div>
      )}
    </div>
  );
}
