import {
  ClipboardList,
  Clock,
  Lock,
  CheckCircle2,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { useApp } from "../store/AppContext";
import { ChronicleButton } from "@/components/ui/chronicle-button";

const CARD_STYLE = {
  backgroundColor: "var(--bauhaus-card-bg)",
  border: "1px solid var(--bauhaus-card-separator)",
};

const ACCENT_COLORS = ["#fc6800", "#24d200", "#156ef6", "#8f10f6"];

export default function Exams() {
  const { exams } = useApp();
  const upcoming = exams.filter((e) => e.status === "upcoming");
  const past = exams.filter((e) => e.status === "completed");
  const locked = exams.filter((e) => e.status === "locked");

  const avgScore =
    past.length > 0
      ? Math.round(past.reduce((s, e) => s + (e.score ?? 0), 0) / past.length)
      : null;

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1
          className="text-3xl font-bold"
          style={{ color: "var(--bauhaus-card-inscription-main)" }}
        >
          Exams
        </h1>
        <p
          className="mt-1"
          style={{ color: "var(--bauhaus-card-inscription-sub)" }}
        >
          View upcoming and past examinations.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          {
            label: "Upcoming Exams",
            value: upcoming.length,
            accentColor: ACCENT_COLORS[0],
          },
          {
            label: "Completed",
            value: past.length,
            accentColor: ACCENT_COLORS[1],
          },
          {
            label: "Average Score",
            value: avgScore !== null ? `${avgScore}%` : "—",
            accentColor: ACCENT_COLORS[2],
          },
        ].map(({ label, value, accentColor }) => (
          <div key={label} className="rounded-xl p-5" style={CARD_STYLE}>
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
              style={{
                backgroundColor: `${accentColor}22`,
                border: `1px solid ${accentColor}44`,
              }}
            >
              <ClipboardList size={16} style={{ color: accentColor }} />
            </div>
            <p
              className="text-2xl font-bold"
              style={{ color: "var(--bauhaus-card-inscription-main)" }}
            >
              {value}
            </p>
            <p
              className="text-xs mt-0.5"
              style={{ color: "var(--bauhaus-card-inscription-sub)" }}
            >
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div className="mb-8">
          <h2
            className="font-semibold mb-4 flex items-center gap-2"
            style={{ color: "var(--bauhaus-card-inscription-main)" }}
          >
            <AlertTriangle size={16} style={{ color: "#fc6800" }} /> Upcoming
          </h2>
          <div className="space-y-3">
            {upcoming.map((exam) => (
              <div
                key={exam.id}
                className="rounded-xl p-5 hover:scale-[1.02] hover:shadow-md transition-all duration-200"
                style={CARD_STYLE}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3
                      className="font-medium mb-1"
                      style={{ color: "var(--bauhaus-card-inscription-main)" }}
                    >
                      {exam.title}
                    </h3>
                    <p
                      className="text-xs mb-3"
                      style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                    >
                      {exam.course}
                    </p>
                    <div
                      className="flex items-center gap-4 text-xs"
                      style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                    >
                      <span className="flex items-center gap-1.5">
                        <Calendar size={12} style={{ color: "#fc6800" }} />
                        {exam.date} at {exam.time}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={12} style={{ color: "#fc6800" }} />
                        {exam.duration}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <ClipboardList size={12} />
                        {exam.questions} questions
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <ChronicleButton
                      inscription="View Details"
                      variant="outlined"
                      backgroundColor="#fc6800"
                      textColor="#fc6800"
                      hoverTextColor="#fff"
                      borderColor="#fc680066"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Past */}
      {past.length > 0 && (
        <div className="mb-8">
          <h2
            className="font-semibold mb-4 flex items-center gap-2"
            style={{ color: "var(--bauhaus-card-inscription-main)" }}
          >
            <CheckCircle2 size={16} style={{ color: "#24d200" }} /> Completed
          </h2>
          <div className="space-y-3">
            {past.map((exam) => (
              <div key={exam.id} className="rounded-xl p-5" style={CARD_STYLE}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3
                      className="font-medium mb-1"
                      style={{ color: "var(--bauhaus-card-inscription-main)" }}
                    >
                      {exam.title}
                    </h3>
                    <p
                      className="text-xs"
                      style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                    >
                      {exam.course} · {exam.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className="text-2xl font-bold"
                      style={{ color: "#24d200" }}
                    >
                      {exam.score}%
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                    >
                      {exam.questions} questions · {exam.duration}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locked */}
      {locked.length > 0 && (
        <div>
          <h2
            className="font-semibold mb-4 flex items-center gap-2"
            style={{ color: "var(--bauhaus-card-inscription-sub)" }}
          >
            <Lock
              size={16}
              style={{ color: "var(--bauhaus-card-inscription-sub)" }}
            />{" "}
            Locked
          </h2>
          <div className="space-y-3">
            {locked.map((exam) => (
              <div
                key={exam.id}
                className="rounded-xl p-5 opacity-60"
                style={CARD_STYLE}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3
                      className="font-medium mb-1 flex items-center gap-2"
                      style={{ color: "var(--bauhaus-card-inscription-main)" }}
                    >
                      <Lock
                        size={14}
                        style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                      />
                      {exam.title}
                    </h3>
                    <p
                      className="text-xs"
                      style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                    >
                      {exam.course} · {exam.date}
                    </p>
                  </div>
                  <span
                    className="text-xs"
                    style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                  >
                    Complete prerequisites first
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
