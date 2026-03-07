import { useState, useMemo } from "react";
import {
  Bell,
  BookOpen,
  FileText,
  Award,
  AlertCircle,
  ClipboardList,
  CheckCheck,
  Megaphone,
} from "lucide-react";
import { useApp } from "../store/AppContext";

const CARD_STYLE = {
  backgroundColor: "var(--bauhaus-card-bg)",
  border: "1px solid var(--bauhaus-card-separator)",
};

const baseNotifications = [
  {
    id: 1,
    type: "assignment",
    icon: FileText,
    title: "Assignment Due Tomorrow",
    body: "AWS S3 Bucket Setup Lab is due on Mar 7, 2026. Make sure to submit before 11:59 PM.",
    time: "2h ago",
    read: false,
    accentColor: "#fc6800",
  },
  {
    id: 2,
    type: "grade",
    icon: Award,
    title: "Assignment Graded — 95/100",
    body: "Your EC2 Instance Launch & SSH lab has been graded. Great work!",
    time: "5h ago",
    read: false,
    accentColor: "#24d200",
  },
  {
    id: 3,
    type: "course",
    icon: BookOpen,
    title: "New Module Unlocked",
    body: "Module 6 of AWS Cloud Fundamentals is now available: ECS Fargate Deployment.",
    time: "1d ago",
    read: false,
    accentColor: "#156ef6",
  },
  {
    id: 4,
    type: "exam",
    icon: ClipboardList,
    title: "Exam Reminder",
    body: "AWS Cloud Practitioner Mock Exam is scheduled for Mar 10 at 10:00 AM.",
    time: "1d ago",
    read: true,
    accentColor: "#8f10f6",
  },
  {
    id: 5,
    type: "alert",
    icon: AlertCircle,
    title: "Attendance Warning",
    body: "Your attendance in Python for Data Science has dropped below 80%. Please attend upcoming sessions.",
    time: "2d ago",
    read: true,
    accentColor: "#fc6800",
  },
  {
    id: 6,
    type: "course",
    icon: BookOpen,
    title: "New Course Available: Terraform IaC",
    body: "A new course on Terraform Infrastructure as Code is now available. Enroll to get started.",
    time: "3d ago",
    read: true,
    accentColor: "#156ef6",
  },
  {
    id: 7,
    type: "grade",
    icon: Award,
    title: "Quiz Results Posted",
    body: "Your Python Basics Quiz score: 87/100. Well done!",
    time: "5d ago",
    read: true,
    accentColor: "#24d200",
  },
];

const typeFilters = [
  "All",
  "Assignment",
  "Grade",
  "Course",
  "Exam",
  "Alert",
  "Announcement",
];

export default function Notifications() {
  const { announcements } = useApp();

  const merged = useMemo(() => {
    const announcementItems = announcements.map((a) => ({
      id: 1000 + a.id,
      type: "announcement",
      icon: Megaphone,
      title: a.title,
      body: a.body,
      time: a.createdAt,
      read: false,
      accentColor: "#156ef6",
    }));
    return [...announcementItems, ...baseNotifications];
  }, [announcements]);

  const [readIds, setReadIds] = useState<Set<number>>(new Set());
  const [activeType, setActiveType] = useState("All");

  const notifications = merged.map((n) => ({
    ...n,
    read: readIds.has(n.id) || n.read,
  }));
  const unread = notifications.filter((n) => !n.read).length;

  const filtered = notifications.filter((n) => {
    if (activeType === "All") return true;
    return n.type === activeType.toLowerCase();
  });

  const markAllRead = () => {
    setReadIds(new Set(notifications.map((n) => n.id)));
  };

  const markRead = (id: number) => {
    setReadIds((prev) => new Set([...prev, id]));
  };

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-3xl font-bold"
            style={{ color: "var(--bauhaus-card-inscription-main)" }}
          >
            Notifications
          </h1>
          <p
            className="mt-1"
            style={{ color: "var(--bauhaus-card-inscription-sub)" }}
          >
            {unread > 0 ? `${unread} unread notifications` : "All caught up"}
          </p>
        </div>
        {unread > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70"
            style={{ color: "#156ef6" }}
          >
            <CheckCheck size={16} /> Mark all as read
          </button>
        )}
      </div>

      {/* Type filters */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {typeFilters.map((f) => {
          const active = activeType === f;
          return (
            <button
              key={f}
              onClick={() => setActiveType(f)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:opacity-90"
              style={
                active
                  ? {
                      backgroundColor: "#156ef622",
                      border: "1px solid #156ef655",
                      color: "#156ef6",
                    }
                  : {
                      ...CARD_STYLE,
                      color: "var(--bauhaus-card-inscription-sub)",
                    }
              }
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* Notification list */}
      <div className="space-y-2">
        {filtered.map((n) => {
          const Icon = n.icon;
          return (
            <div
              key={n.id}
              className="relative flex gap-4 p-4 rounded-xl cursor-pointer transition-all hover:scale-[1.01] hover:shadow-sm"
              style={{
                ...CARD_STYLE,
                opacity: n.read ? 0.7 : 1,
                borderLeft: !n.read ? `3px solid ${n.accentColor}` : undefined,
              }}
              onClick={() => markRead(n.id)}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{
                  backgroundColor: `${n.accentColor}18`,
                  border: `1px solid ${n.accentColor}33`,
                }}
              >
                <Icon size={16} style={{ color: n.accentColor }} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p
                    className="text-sm font-medium leading-snug"
                    style={{ color: "var(--bauhaus-card-inscription-main)" }}
                  >
                    {n.title}
                  </p>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className="text-xs"
                      style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                    >
                      {n.time}
                    </span>
                    {!n.read && (
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: n.accentColor }}
                      />
                    )}
                  </div>
                </div>
                <p
                  className="text-xs mt-1 leading-relaxed"
                  style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                >
                  {n.body}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Bell
            size={40}
            className="mx-auto mb-4"
            style={{ color: "var(--bauhaus-card-separator)" }}
          />
          <p style={{ color: "var(--bauhaus-card-inscription-sub)" }}>
            No notifications in this category.
          </p>
        </div>
      )}
    </div>
  );
}
