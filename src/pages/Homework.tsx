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

export default function Homework() {
  const { assignments } = useApp();
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState<number | null>(null);

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
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1
          className="text-3xl font-bold"
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
      <div className="grid grid-cols-4 gap-4 mb-8">
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
      <div className="flex items-center gap-2 mb-6 flex-wrap">
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
              className="px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all hover:opacity-90"
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
        {filtered.map((a) => {
          const status = statusConfig[a.status];
          const StatusIcon = status.icon;
          const isExpanded = expanded === a.id;

          return (
            <div
              key={a.id}
              className="rounded-xl overflow-hidden transition-all"
              style={CARD_STYLE}
            >
              <button
                className="w-full flex items-center gap-4 p-5 text-left"
                onClick={() => setExpanded(isExpanded ? null : a.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3
                      className="font-medium text-sm"
                      style={{ color: "var(--bauhaus-card-inscription-main)" }}
                    >
                      {a.title}
                    </h3>
                    {a.priority === "high" && (
                      <AlertCircle size={14} style={{ color: "#fc6800" }} />
                    )}
                  </div>
                  <div
                    className="flex items-center gap-3 text-xs"
                    style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                  >
                    <span>{a.course}</span>
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

                <div className="flex items-center gap-3">
                  {a.score !== undefined && (
                    <span
                      className="text-sm font-semibold"
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
                  className="px-5 pb-5"
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
                  {(a.status === "pending" || a.status === "in-progress") && (
                    <ChronicleButton
                      inscription={
                        a.status === "in-progress"
                          ? "Continue Working"
                          : "Start Assignment"
                      }
                      variant="filled"
                      backgroundColor="#156ef6"
                      textColor="#fff"
                      hoverTextColor="#fff"
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit Assignment */}
      <div className="mt-12">
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
