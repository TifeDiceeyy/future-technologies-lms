import { TrendingUp, AlertCircle } from "lucide-react";
import { useApp } from "@/store/AppContext";
import { useAuth } from "@/store/AuthContext";

const CARD_STYLE = {
  backgroundColor: "var(--bauhaus-card-bg)",
  border: "1px solid var(--bauhaus-card-separator)",
};
const PROGRESS_TRACK = {
  backgroundColor: "var(--bauhaus-card-progress-bar-bg)",
};

const ACCENT_POOL = [
  "#156ef6",
  "#24d200",
  "#fc6800",
  "#8f10f6",
  "#00b4d8",
  "#e91e8c",
];
const courseAccent = (id: number) => ACCENT_POOL[(id - 1) % ACCENT_POOL.length];

// Synthetic session dots: first `present` slots attended, rest missed
function buildSessionDots(present: number, total: number): number[] {
  return Array.from({ length: total }, (_, i) => (i < present ? 1 : 0));
}

export default function Attendance() {
  const { attendance } = useApp();
  const { currentUser } = useAuth();

  if (!currentUser)
    return <div className="p-8 text-muted-foreground text-sm">Loading...</div>;
  const myId = currentUser.id;
  const myAttendance = attendance.filter(
    (r) => String(r.studentId) === String(myId),
  );

  const totalPresent = myAttendance.reduce((s, r) => s + r.present, 0);
  const totalSessions = myAttendance.reduce((s, r) => s + r.total, 0);
  const overallRate =
    totalSessions > 0 ? Math.round((totalPresent / totalSessions) * 100) : 0;

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1
          className="text-3xl font-bold"
          style={{ color: "var(--bauhaus-card-inscription-main)" }}
        >
          Attendance
        </h1>
        <p
          className="mt-1"
          style={{ color: "var(--bauhaus-card-inscription-sub)" }}
        >
          Track your class attendance across all courses.
        </p>
      </div>

      {/* Overall stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {/* Overall rate card */}
        <div className="rounded-xl p-5" style={CARD_STYLE}>
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor: "#156ef622",
                border: "1px solid #156ef644",
              }}
            >
              <TrendingUp size={18} style={{ color: "#156ef6" }} />
            </div>
            <div>
              <p
                className="font-bold text-2xl"
                style={{ color: "var(--bauhaus-card-inscription-main)" }}
              >
                {overallRate}%
              </p>
              <p
                className="text-xs"
                style={{ color: "var(--bauhaus-card-inscription-sub)" }}
              >
                Overall Rate
              </p>
            </div>
          </div>
          <div
            className="h-2 rounded-full overflow-hidden"
            style={PROGRESS_TRACK}
          >
            <div
              className="h-full rounded-full"
              style={{ width: `${overallRate}%`, backgroundColor: "#156ef6" }}
            />
          </div>
        </div>

        {[
          {
            label: "Sessions Attended",
            value: totalPresent,
            accentColor: "#24d200",
          },
          {
            label: "Sessions Missed",
            value: totalSessions - totalPresent,
            accentColor: "#fc6800",
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
              <TrendingUp size={16} style={{ color: accentColor }} />
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

      {/* Per-course breakdown */}
      <div className="rounded-2xl p-6 mb-6" style={CARD_STYLE}>
        <h2
          className="font-semibold mb-5"
          style={{ color: "var(--bauhaus-card-inscription-main)" }}
        >
          By Course
        </h2>
        {myAttendance.length === 0 ? (
          <p
            className="text-sm py-4 text-center"
            style={{ color: "var(--bauhaus-card-inscription-sub)" }}
          >
            No attendance records yet. Records will appear once sessions are
            logged.
          </p>
        ) : null}
        <div className="space-y-6">
          {myAttendance.map((record) => {
            const rate = Math.round((record.present / record.total) * 100);
            const isWarning = rate < 75;
            const accentColor = isWarning
              ? "#fc6800"
              : courseAccent(record.courseId);
            const dots = buildSessionDots(record.present, record.total);
            return (
              <div key={record.id}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--bauhaus-card-inscription-main)" }}
                    >
                      {record.courseName}
                    </p>
                    {isWarning && (
                      <AlertCircle size={13} style={{ color: "#fc6800" }} />
                    )}
                  </div>
                  <div
                    className="flex items-center gap-3 text-xs"
                    style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                  >
                    <span>
                      {record.present}/{record.total} sessions
                    </span>
                    <span
                      className="font-semibold"
                      style={{ color: accentColor }}
                    >
                      {rate}%
                    </span>
                  </div>
                </div>
                <div
                  className="h-2 rounded-full overflow-hidden mb-2"
                  style={PROGRESS_TRACK}
                >
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${rate}%`, backgroundColor: accentColor }}
                  />
                </div>
                {/* Session dots */}
                <div className="flex gap-1 flex-wrap">
                  {dots.map((attended, i) => (
                    <div
                      key={i}
                      className="w-4 h-4 rounded-sm"
                      style={{
                        backgroundColor: attended
                          ? `${accentColor}99`
                          : "#fc680040",
                      }}
                      title={`Session ${i + 1}: ${attended ? "Present" : "Absent"}`}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
