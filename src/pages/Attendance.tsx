import { TrendingUp, AlertCircle } from "lucide-react";

const CARD_STYLE = {
  backgroundColor: "var(--bauhaus-card-bg)",
  border: "1px solid var(--bauhaus-card-separator)",
};
const PROGRESS_TRACK = {
  backgroundColor: "var(--bauhaus-card-progress-bar-bg)",
};

const COURSE_COLORS = ["#156ef6", "#24d200", "#fc6800"];

const attendanceData = {
  "AWS Cloud Fundamentals": {
    present: 14,
    total: 16,
    sessions: [1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    accentColor: "#156ef6",
  },
  "React + TypeScript Mastery": {
    present: 10,
    total: 12,
    sessions: [1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1],
    accentColor: "#24d200",
  },
  "Python for Data Science": {
    present: 7,
    total: 9,
    sessions: [1, 1, 1, 0, 1, 1, 1, 0, 1],
    accentColor: "#fc6800",
  },
};

const recentSessions = [
  {
    date: "Mar 5, 2026",
    course: "AWS Cloud Fundamentals",
    topic: "S3 + CloudFront Deep Dive",
    attended: true,
  },
  {
    date: "Mar 4, 2026",
    course: "React + TypeScript Mastery",
    topic: "Custom Hooks & Context API",
    attended: true,
  },
  {
    date: "Mar 3, 2026",
    course: "Python for Data Science",
    topic: "Pandas DataFrames",
    attended: false,
  },
  {
    date: "Mar 1, 2026",
    course: "AWS Cloud Fundamentals",
    topic: "EC2 Auto Scaling",
    attended: true,
  },
  {
    date: "Feb 28, 2026",
    course: "React + TypeScript Mastery",
    topic: "TypeScript Generics",
    attended: true,
  },
  {
    date: "Feb 27, 2026",
    course: "Python for Data Science",
    topic: "NumPy Arrays",
    attended: true,
  },
];

export default function Attendance() {
  const totalPresent = Object.values(attendanceData).reduce(
    (s, c) => s + c.present,
    0,
  );
  const totalSessions = Object.values(attendanceData).reduce(
    (s, c) => s + c.total,
    0,
  );
  const overallRate = Math.round((totalPresent / totalSessions) * 100);

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
        <div className="space-y-6">
          {Object.entries(attendanceData).map(([course, data], idx) => {
            const rate = Math.round((data.present / data.total) * 100);
            const isWarning = rate < 75;
            const accentColor = isWarning
              ? "#fc6800"
              : (COURSE_COLORS[idx] ?? "#156ef6");
            return (
              <div key={course}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--bauhaus-card-inscription-main)" }}
                    >
                      {course}
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
                      {data.present}/{data.total} sessions
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
                  {data.sessions.map((attended, i) => (
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

      {/* Recent sessions */}
      <div className="rounded-2xl p-6" style={CARD_STYLE}>
        <h2
          className="font-semibold mb-5"
          style={{ color: "var(--bauhaus-card-inscription-main)" }}
        >
          Recent Sessions
        </h2>
        <div className="space-y-2">
          {recentSessions.map((session, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-3"
              style={{
                borderBottom:
                  i < recentSessions.length - 1
                    ? "1px solid var(--bauhaus-card-separator)"
                    : "none",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: session.attended ? "#24d200" : "#fc6800",
                  }}
                />
                <div>
                  <p
                    className="text-sm"
                    style={{ color: "var(--bauhaus-card-inscription-main)" }}
                  >
                    {session.topic}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                  >
                    {session.course} · {session.date}
                  </p>
                </div>
              </div>
              <span
                className="text-xs font-medium px-2.5 py-0.5 rounded-full"
                style={{
                  color: session.attended ? "#24d200" : "#fc6800",
                  backgroundColor: session.attended ? "#24d20015" : "#fc680015",
                  border: `1px solid ${session.attended ? "#24d20033" : "#fc680033"}`,
                }}
              >
                {session.attended ? "Present" : "Absent"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
