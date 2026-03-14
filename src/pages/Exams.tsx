import { useState } from "react";
import {
  ClipboardList,
  Clock,
  Lock,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Lightbulb,
} from "lucide-react";
import { useApp } from "../store/AppContext";
import { ChronicleButton } from "@/components/ui/chronicle-button";

const CARD_STYLE = {
  backgroundColor: "var(--bauhaus-card-bg)",
  border: "1px solid var(--bauhaus-card-separator)",
};

const ACCENT_COLORS = ["#fc6800", "#24d200", "#156ef6", "#8f10f6"];

// Mock exam topics + study tips by exam id
const EXAM_DETAILS: Record<
  number,
  { topics: string[]; tips: string[] }
> = {
  1: {
    topics: ["IAM Roles & Policies", "VPC & Subnets", "S3 Bucket Policies", "EC2 Instance Types", "CloudWatch Metrics"],
    tips: [
      "Review the AWS Shared Responsibility Model",
      "Practice with mock questions on IAM permissions",
      "Understand the difference between NACLs and Security Groups",
    ],
  },
  2: {
    topics: ["Lambda Triggers", "API Gateway REST vs HTTP", "DynamoDB Keys", "Step Functions", "SQS vs SNS"],
    tips: [
      "Focus on serverless architecture patterns",
      "Understand cold start optimisation for Lambda",
      "Review DynamoDB partition key best practices",
    ],
  },
  3: {
    topics: ["ECS vs EKS", "ECR Image Management", "Fargate Task Definitions", "ALB Target Groups", "CloudFormation"],
    tips: [
      "Draw out the ECS deployment architecture from memory",
      "Review container security best practices",
      "Practice reading CloudFormation templates",
    ],
  },
};

export default function Exams() {
  const { exams } = useApp();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const upcoming = exams.filter((e) => e.status === "upcoming");
  const past = exams.filter((e) => e.status === "completed");
  const locked = exams.filter((e) => e.status === "locked");

  const avgScore =
    past.length > 0
      ? Math.round(past.reduce((s, e) => s + (e.score ?? 0), 0) / past.length)
      : null;

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <div className="mb-6 md:mb-8">
        <h1
          className="text-2xl md:text-3xl font-bold"
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

      {/* Stats — responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
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
            {upcoming.map((exam) => {
              const isExpanded = expandedId === exam.id;
              const details = EXAM_DETAILS[exam.id];
              return (
                <div
                  key={exam.id}
                  className="rounded-xl overflow-hidden transition-all"
                  style={CARD_STYLE}
                >
                  <button
                    className="w-full flex items-start justify-between gap-3 p-4 md:p-5 text-left"
                    onClick={() =>
                      setExpandedId(isExpanded ? null : exam.id)
                    }
                  >
                    <div className="flex-1 min-w-0">
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
                      {/* Bug 4 fix: flex-wrap */}
                      <div
                        className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs"
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
                    <div className="flex items-center gap-2 flex-shrink-0 mt-1">
                      <ChronicleButton
                        inscription="View Details"
                        variant="outlined"
                        backgroundColor="#fc6800"
                        textColor="#fc6800"
                        hoverTextColor="#fff"
                        borderColor="#fc680066"
                      />
                      {isExpanded ? (
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
                    </div>
                  </button>

                  {/* Expanded detail panel */}
                  {isExpanded && details && (
                    <div
                      className="px-4 md:px-5 pb-5"
                      style={{
                        borderTop: "1px solid var(--bauhaus-card-separator)",
                      }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        {/* Topics */}
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <BookOpen
                              size={14}
                              style={{ color: "#fc6800" }}
                            />
                            <p
                              className="text-sm font-medium"
                              style={{
                                color: "var(--bauhaus-card-inscription-main)",
                              }}
                            >
                              Topics covered
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {details.topics.map((t) => (
                              <span
                                key={t}
                                className="text-xs px-2.5 py-1 rounded-lg"
                                style={{
                                  backgroundColor: "#fc680015",
                                  color: "#fc6800",
                                  border: "1px solid #fc680030",
                                }}
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Study tips */}
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Lightbulb
                              size={14}
                              style={{ color: "#F59E0B" }}
                            />
                            <p
                              className="text-sm font-medium"
                              style={{
                                color: "var(--bauhaus-card-inscription-main)",
                              }}
                            >
                              Study tips
                            </p>
                          </div>
                          <ul className="space-y-1.5">
                            {details.tips.map((tip) => (
                              <li
                                key={tip}
                                className="flex items-start gap-2 text-xs"
                                style={{
                                  color: "var(--bauhaus-card-inscription-sub)",
                                }}
                              >
                                <span
                                  className="mt-1 w-1 h-1 rounded-full flex-shrink-0"
                                  style={{ backgroundColor: "#F59E0B" }}
                                />
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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
              <div
                key={exam.id}
                className="rounded-xl p-4 md:p-5"
                style={CARD_STYLE}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-medium mb-1"
                      style={{ color: "var(--bauhaus-card-inscription-main)" }}
                    >
                      {exam.title}
                    </h3>
                    {/* Bug 4 fix: was plain text — now flex-wrap text-xs */}
                    <div
                      className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs"
                      style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                    >
                      <span>{exam.course}</span>
                      <span>·</span>
                      <span>{exam.date}</span>
                      <span>·</span>
                      <span>{exam.questions} questions</span>
                      <span>·</span>
                      <span>{exam.duration}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p
                      className="text-2xl font-bold"
                      style={{ color: "#24d200" }}
                    >
                      {exam.score}%
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
            />
            Locked
          </h2>
          <div className="space-y-3">
            {locked.map((exam) => (
              <div
                key={exam.id}
                className="rounded-xl p-4 md:p-5 opacity-60"
                style={CARD_STYLE}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-medium mb-1 flex items-center gap-2"
                      style={{ color: "var(--bauhaus-card-inscription-main)" }}
                    >
                      <Lock
                        size={14}
                        style={{
                          color: "var(--bauhaus-card-inscription-sub)",
                        }}
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
                    className="text-xs flex-shrink-0"
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
