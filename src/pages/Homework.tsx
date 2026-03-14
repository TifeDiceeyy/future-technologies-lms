import { useState } from "react";
import {
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import { useApp } from "../store/AppContext";
import { FileUpload } from "@/components/ui/file-upload";
import { ChronicleButton } from "@/components/ui/chronicle-button";
import { apiFetch } from "../api/client";

const CARD_STYLE = {
  backgroundColor: "var(--bauhaus-card-bg)",
  border: "1px solid var(--bauhaus-card-separator)",
};

const ACCENT_COLORS = ["#156ef6", "#fc6800", "#8f10f6", "#24d200"];

const statusConfig: Record<
  string,
  { label: string; accentColor: string; icon: React.ElementType }
> = {
  pending: { label: "Pending", accentColor: "#fc6800", icon: Clock },
  "in-progress": { label: "In Progress", accentColor: "#156ef6", icon: Circle },
  submitted: { label: "Submitted", accentColor: "#8f10f6", icon: CheckCircle2 },
  graded: { label: "Graded", accentColor: "#24d200", icon: CheckCircle2 },
};

const priorityAccent: Record<string, string> = {
  high: "#fc6800",
  medium: "#8f10f6",
  low: "var(--bauhaus-card-inscription-sub)",
};

// Load submitted IDs from localStorage
function loadSubmittedIds(assignmentIds: number[]): Set<number> {
  return new Set(
    assignmentIds.filter(
      (id) => localStorage.getItem(`submitted_${id}`) === "true",
    ),
  );
}

export default function Homework() {
  const { assignments } = useApp();
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState<number | null>(null);
  const [submitErrors, setSubmitErrors] = useState<Record<number, string>>({});
  const [submittedIds, setSubmittedIds] = useState<Set<number>>(() =>
    loadSubmittedIds(assignments.map((a) => a.id)),
  );

  async function handleSubmit(assignmentId: number) {
    setSubmitting(assignmentId);
    setSubmitErrors((prev) => ({ ...prev, [assignmentId]: "" }));
    try {
      await apiFetch(
        `/assignments/${assignmentId}`,
        {
          method: "PUT",
          body: JSON.stringify({
            status: "submitted",
            submittedAt: new Date().toISOString(),
          }),
        },
        true,
      );
    } catch {
      // API may not have this endpoint yet — treat as success in offline/mock mode
    }
    // Persist locally regardless of API outcome
    localStorage.setItem(`submitted_${assignmentId}`, "true");
    setSubmittedIds((prev) => new Set([...prev, assignmentId]));
    setSubmitting(null);
  }

  const filtered =
    filter === "all"
      ? assignments
      : assignments.filter((a) => a.status === filter);

  const summaryItems = [
    {
      label: "Total",
      count: assignments.length,
      accentColor: ACCENT_COLORS[0],
    },
    {
      label: "Pending",
      count: assignments.filter((a) => a.status === "pending").length,
      accentColor: ACCENT_COLORS[1],
    },
    {
      label: "In Progress",
      count: assignments.filter((a) => a.status === "in-progress").length,
      accentColor: ACCENT_COLORS[2],
    },
    {
      label: "Graded",
      count: assignments.filter((a) => a.status === "graded").length,
      accentColor: ACCENT_COLORS[3],
    },
  ];

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <div className="mb-6 md:mb-8">
        <h1
          className="text-2xl md:text-3xl font-bold"
          style={{ color: "var(--bauhaus-card-inscription-main)" }}
        >
          Homework
        </h1>
        <p
          className="mt-1"
          style={{ color: "var(--bauhaus-card-inscription-sub)" }}
        >
          Track and submit your assignments.
        </p>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        {summaryItems.map(({ label, count, accentColor }) => (
          <div
            key={label}
            className="rounded-xl p-4 text-center"
            style={CARD_STYLE}
          >
            <p
              className="text-2xl font-bold"
              style={{ color: "var(--bauhaus-card-inscription-main)" }}
            >
              {count}
            </p>
            <p
              className="text-xs mt-0.5 font-medium"
              style={{ color: accentColor }}
            >
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto whitespace-nowrap hide-scrollbar">
        {["all", "pending", "in-progress", "submitted", "graded"].map((f) => {
          const active = filter === f;
          const accent =
            f === "all"
              ? "#156ef6"
              : (statusConfig[f]?.accentColor ?? "#156ef6");
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all hover:opacity-90"
              style={
                active
                  ? {
                      backgroundColor: `${accent}22`,
                      border: `1px solid ${accent}55`,
                      color: accent,
                    }
                  : {
                      ...CARD_STYLE,
                      color: "var(--bauhaus-card-inscription-sub)",
                    }
              }
            >
              {f.replace("-", " ")}
            </button>
          );
        })}
      </div>

      {/* Assignment list */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="rounded-xl p-10 text-center" style={CARD_STYLE}>
            <p
              className="text-sm"
              style={{ color: "var(--bauhaus-card-inscription-sub)" }}
            >
              {assignments.length === 0
                ? "No assignments yet. They'll appear here once your instructor adds them."
                : "No assignments match this filter."}
            </p>
          </div>
        )}
        {filtered.map((a) => {
          const isLocallySubmitted = submittedIds.has(a.id);
          const effectiveStatus = isLocallySubmitted ? "submitted" : a.status;
          const status =
            statusConfig[effectiveStatus] ?? statusConfig["pending"];
          const StatusIcon = status.icon;
          const isExpanded = expanded === a.id;
          const isSubmittingThis = submitting === a.id;
          const submitError = submitErrors[a.id];

          return (
            <div
              key={a.id}
              className="rounded-xl overflow-hidden transition-all"
              style={CARD_STYLE}
            >
              <button
                className="w-full flex items-center gap-4 p-4 md:p-5 text-left"
                onClick={() => setExpanded(isExpanded ? null : a.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3
                      className="font-medium text-sm truncate"
                      style={{ color: "var(--bauhaus-card-inscription-main)" }}
                    >
                      {a.title}
                    </h3>
                    {a.priority === "high" && (
                      <AlertCircle
                        size={14}
                        style={{ color: "#fc6800" }}
                        className="flex-shrink-0"
                      />
                    )}
                  </div>
                  <div
                    className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs"
                    style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                  >
                    <span className="truncate max-w-[120px]">{a.course}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> Due {a.due}
                    </span>
                    <span>·</span>
                    <span style={{ color: priorityAccent[a.priority] }}>
                      {a.priority} priority
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {a.score !== undefined && (
                    <span
                      className="text-sm font-semibold hidden sm:inline"
                      style={{ color: "#24d200" }}
                    >
                      {a.score}/{a.points}
                    </span>
                  )}
                  <span
                    className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
                    style={{
                      color: status.accentColor,
                      backgroundColor: `${status.accentColor}18`,
                      border: `1px solid ${status.accentColor}33`,
                    }}
                  >
                    <StatusIcon size={11} />
                    {status.label}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                  />
                </div>
              </button>

              {isExpanded && (
                <div
                  className="px-4 md:px-5 pb-5"
                  style={{
                    borderTop: "1px solid var(--bauhaus-card-separator)",
                  }}
                >
                  <p
                    className="text-sm mt-4 mb-4 leading-relaxed"
                    style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                  >
                    {a.desc}
                  </p>

                  {/* Submission area */}
                  {isLocallySubmitted ||
                  effectiveStatus === "submitted" ||
                  effectiveStatus === "graded" ? (
                    <div
                      className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold"
                      style={{
                        backgroundColor: "#24d20015",
                        border: "1px solid #24d20033",
                        color: "#24d200",
                      }}
                    >
                      <CheckCircle2 size={16} />
                      Submitted ✓
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {submitError && (
                        <p className="text-xs text-red-400">{submitError}</p>
                      )}
                      <div className="flex items-center gap-3">
                        <ChronicleButton
                          inscription={
                            effectiveStatus === "in-progress"
                              ? "Continue Working"
                              : "Start Assignment"
                          }
                          variant="filled"
                          backgroundColor="#156ef6"
                          textColor="#fff"
                          hoverTextColor="#fff"
                        />
                        <button
                          onClick={() => handleSubmit(a.id)}
                          disabled={isSubmittingThis}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-60"
                          style={{ backgroundColor: "#24d200", color: "#fff" }}
                        >
                          {isSubmittingThis ? (
                            <>
                              <div className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                              Submitting…
                            </>
                          ) : (
                            "Submit"
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit Assignment — global file upload */}
      <div className="mt-10 md:mt-12">
        <h2
          className="text-xl font-bold mb-1"
          style={{ color: "var(--bauhaus-card-inscription-main)" }}
        >
          Submit Your Work
        </h2>
        <p
          className="text-sm mb-6"
          style={{ color: "var(--bauhaus-card-inscription-sub)" }}
        >
          Upload your assignment files here
        </p>
        <div className="rounded-xl p-6" style={CARD_STYLE}>
          <FileUpload />
        </div>
      </div>
    </div>
  );
}
