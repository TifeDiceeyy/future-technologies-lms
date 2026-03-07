import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  LayoutDashboard,
  FileText,
  ClipboardList,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { BauhausCard } from "@/components/ui/bauhaus-card";

const CARD_STYLE = {
  backgroundColor: "var(--bauhaus-card-bg)",
  border: "1px solid var(--bauhaus-card-separator)",
};

const quickLinks = [
  {
    to: "/courses",
    icon: BookOpen,
    label: "My Courses",
    desc: "4 active",
    accentColor: "#156ef6",
  },
  {
    to: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    desc: "View progress",
    accentColor: "#24d200",
  },
  {
    to: "/homework",
    icon: FileText,
    label: "Homework",
    desc: "2 due soon",
    accentColor: "#fc6800",
  },
  {
    to: "/exams",
    icon: ClipboardList,
    label: "Exams",
    desc: "1 upcoming",
    accentColor: "#8f10f6",
  },
];

const recentCourses = [
  {
    id: "1",
    title: "AWS Cloud Fundamentals",
    progress: 68,
    module: "Module 5: S3 + CloudFront",
    time: "2h left",
    accentColor: "#156ef6",
  },
  {
    id: "2",
    title: "React + TypeScript Mastery",
    progress: 42,
    module: "Module 3: Hooks & State",
    time: "4h left",
    accentColor: "#24d200",
  },
  {
    id: "3",
    title: "Python for Data Science",
    progress: 15,
    module: "Module 1: Getting Started",
    time: "8h left",
    accentColor: "#fc6800",
  },
];

const announcements = [
  {
    title: "New course available: Terraform IaC",
    time: "2h ago",
    accentColor: "#156ef6",
  },
  {
    title: "Assignment 3 graded — 92/100",
    time: "5h ago",
    accentColor: "#24d200",
  },
  {
    title: "Live session: AWS ECS Fargate — Mar 8",
    time: "1d ago",
    accentColor: "#8f10f6",
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="p-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <p
          className="text-sm mb-1"
          style={{ color: "var(--bauhaus-card-inscription-sub)" }}
        >
          Friday, March 6, 2026
        </p>
        <h1
          className="text-3xl font-bold"
          style={{ color: "var(--bauhaus-card-inscription-main)" }}
        >
          Your Learning Organized in{" "}
          <span className="bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
            One Place
          </span>
        </h1>
        <p
          className="mt-1"
          style={{ color: "var(--bauhaus-card-inscription-sub)" }}
        >
          Welcome back, Tife. Keep the momentum going.
        </p>
      </div>

      {/* Progress summary strip */}
      <div
        className="rounded-2xl p-5 mb-8 flex items-center gap-8"
        style={CARD_STYLE}
      >
        <div className="flex items-center gap-3">
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
              className="font-bold text-xl"
              style={{ color: "var(--bauhaus-card-inscription-main)" }}
            >
              42%
            </p>
            <p
              className="text-xs"
              style={{ color: "var(--bauhaus-card-inscription-sub)" }}
            >
              Overall Progress
            </p>
          </div>
        </div>
        <div
          className="flex-1 h-px"
          style={{ backgroundColor: "var(--bauhaus-card-separator)" }}
        />
        {[
          { value: "4", label: "Active Courses" },
          { value: "12", label: "Hours This Week" },
          { value: "3", label: "Certificates" },
        ].map(({ value, label }, i) => (
          <div key={label} className="flex items-center gap-8">
            {i > 0 && (
              <div
                className="w-px h-8"
                style={{ backgroundColor: "var(--bauhaus-card-separator)" }}
              />
            )}
            <div className="text-center">
              <p
                className="font-bold text-xl"
                style={{ color: "var(--bauhaus-card-inscription-main)" }}
              >
                {value}
              </p>
              <p
                className="text-xs"
                style={{ color: "var(--bauhaus-card-inscription-sub)" }}
              >
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {quickLinks.map(({ to, icon: Icon, label, desc, accentColor }) => (
          <Link
            key={to}
            to={to}
            className="group rounded-xl p-4 hover:scale-105 hover:shadow-lg hover:shadow-primary/10 transition-all duration-200"
            style={CARD_STYLE}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
              style={{
                backgroundColor: `${accentColor}22`,
                border: `1px solid ${accentColor}44`,
              }}
            >
              <Icon size={18} style={{ color: accentColor }} />
            </div>
            <p
              className="text-sm font-medium"
              style={{ color: "var(--bauhaus-card-inscription-main)" }}
            >
              {label}
            </p>
            <p
              className="text-xs mt-0.5"
              style={{ color: "var(--bauhaus-card-inscription-sub)" }}
            >
              {desc}
            </p>
          </Link>
        ))}
      </div>

      {/* Continue Learning — BauhausCards */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-5">
          <h2
            className="font-semibold"
            style={{ color: "var(--bauhaus-card-inscription-main)" }}
          >
            Continue Learning
          </h2>
          <Link
            to="/courses"
            className="text-sm flex items-center gap-1 hover:opacity-70 transition-opacity"
            style={{ color: "var(--bauhaus-card-inscription-top)" }}
          >
            All courses <ArrowRight size={14} />
          </Link>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-2">
          {recentCourses.map((course) => (
            <div key={course.id} className="flex-shrink-0">
              <BauhausCard
                id={course.id}
                accentColor={course.accentColor}
                topInscription={course.time}
                mainText={course.title}
                subMainText={course.module}
                progressBarInscription="Progress:"
                progress={course.progress}
                progressValue={`${course.progress}%`}
                filledButtonInscription="Continue"
                outlinedButtonInscription="Details"
                onFilledButtonClick={() => navigate(`/courses/${course.id}`)}
                onOutlinedButtonClick={() => navigate("/courses")}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Announcements */}
      <div className="rounded-2xl p-6 max-w-md" style={CARD_STYLE}>
        <h2
          className="font-semibold mb-5"
          style={{ color: "var(--bauhaus-card-inscription-main)" }}
        >
          Announcements
        </h2>
        <div className="space-y-4">
          {announcements.map((item) => (
            <div key={item.title} className="flex gap-3">
              <div
                className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                style={{ backgroundColor: item.accentColor }}
              />
              <div>
                <p
                  className="text-sm leading-snug"
                  style={{ color: "var(--bauhaus-card-inscription-main)" }}
                >
                  {item.title}
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                >
                  {item.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
