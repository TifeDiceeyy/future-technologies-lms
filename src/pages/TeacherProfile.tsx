import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Star, Users, BookOpen, Award, Clock } from "lucide-react";
import { useApp } from "@/store/AppContext";

const CARD_STYLE = {
  backgroundColor: "var(--bauhaus-card-bg)",
  border: "1px solid var(--bauhaus-card-separator)",
};

const TEACHER_BIOS: Record<
  string,
  { bio: string; specialties: string[]; accentColor: string }
> = {
  "Sarah Chen": {
    bio: "AWS Solutions Architect with 8 years of enterprise cloud experience. Former Google SRE. Passionate about making cloud accessible to everyone.",
    specialties: ["AWS", "Cloud Architecture", "S3", "EC2", "CloudFront"],
    accentColor: "#6366F1",
  },
  "James Okafor": {
    bio: "Full-stack engineer and React core contributor. Previously at Meta and Shopify. Builds developer tools and loves TypeScript.",
    specialties: ["React", "TypeScript", "Next.js", "GraphQL"],
    accentColor: "#10B981",
  },
  "Aisha Patel": {
    bio: "Data scientist and PhD researcher in Machine Learning at Cambridge. Bridging academia and industry through practical, hands-on courses.",
    specialties: ["Python", "Pandas", "Machine Learning", "Data Viz"],
    accentColor: "#F59E0B",
  },
  "Marcus Webb": {
    bio: "DevOps engineer and Terraform contributor. 10 years in infrastructure automation, working with companies from startups to Fortune 500.",
    specialties: ["Terraform", "DevOps", "CI/CD", "Kubernetes", "IaC"],
    accentColor: "#06B6D4",
  },
  "Lin Zhao": {
    bio: "Container and Kubernetes expert, CKAD certified. Built and managed Kubernetes clusters for high-traffic applications at scale.",
    specialties: ["Docker", "Kubernetes", "Helm", "Service Mesh"],
    accentColor: "#EF4444",
  },
  "Dr. Priya Singh": {
    bio: "ML researcher and educator with 12 years of experience in deep learning, NLP, and computer vision. Published 40+ papers.",
    specialties: ["Deep Learning", "NLP", "PyTorch", "TensorFlow"],
    accentColor: "#EC4899",
  },
};

export default function TeacherProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { courses } = useApp();

  const teacherName = decodeURIComponent(id ?? "");
  const teacherData = TEACHER_BIOS[teacherName];
  const teacherCourses = courses.filter((c) => c.instructor === teacherName);
  const accent = teacherData?.accentColor ?? "#6366F1";

  if (!teacherData) {
    return (
      <div className="p-8 text-center">
        <p style={{ color: "var(--bauhaus-card-inscription-sub)" }}>
          Instructor not found.
        </p>
      </div>
    );
  }

  const avgRating =
    teacherCourses.length > 0
      ? (
          teacherCourses.reduce((s, c) => s + c.rating, 0) /
          teacherCourses.length
        ).toFixed(1)
      : "—";

  const totalStudents = teacherCourses.reduce(
    (s, c) => s + c.studentsEnrolled,
    0,
  );

  return (
    <div className="p-4 md:p-8 max-w-3xl">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Hero card */}
      <div
        className="rounded-2xl p-6 mb-6 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${accent}15, ${accent}05)`,
          border: `1px solid ${accent}33`,
        }}
      >
        <div className="flex items-start gap-5">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl font-bold"
            style={{
              background: `linear-gradient(135deg, ${accent}40, ${accent}20)`,
              border: `1px solid ${accent}40`,
              color: accent,
            }}
          >
            {teacherName.charAt(0)}
          </div>
          <div className="flex-1">
            <h1
              className="text-xl font-bold mb-1"
              style={{ color: "var(--bauhaus-card-inscription-main)" }}
            >
              {teacherName}
            </h1>
            <p
              className="text-sm mb-3 leading-relaxed"
              style={{ color: "var(--bauhaus-card-inscription-sub)" }}
            >
              {teacherData.bio}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
              <span
                className="flex items-center gap-1"
                style={{ color: "#F59E0B" }}
              >
                <Star size={12} fill="currentColor" />
                {avgRating} rating
              </span>
              <span
                className="flex items-center gap-1"
                style={{ color: "var(--bauhaus-card-inscription-sub)" }}
              >
                <Users size={12} />
                {totalStudents} students
              </span>
              <span
                className="flex items-center gap-1"
                style={{ color: "var(--bauhaus-card-inscription-sub)" }}
              >
                <BookOpen size={12} />
                {teacherCourses.length} courses
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Specialties */}
      <div className="mb-6">
        <h2
          className="font-semibold mb-3"
          style={{ color: "var(--bauhaus-card-inscription-main)" }}
        >
          Specialties
        </h2>
        <div className="flex flex-wrap gap-2">
          {teacherData.specialties.map((s) => (
            <span
              key={s}
              className="px-3 py-1.5 rounded-lg text-sm"
              style={{
                backgroundColor: `${accent}15`,
                color: accent,
                border: `1px solid ${accent}30`,
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Courses by this instructor */}
      {teacherCourses.length > 0 && (
        <div>
          <h2
            className="font-semibold mb-3"
            style={{ color: "var(--bauhaus-card-inscription-main)" }}
          >
            Courses by {teacherName.split(" ")[0]}
          </h2>
          <div className="space-y-3">
            {teacherCourses.map((course) => (
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
                  <div
                    className="flex items-center gap-3 mt-1 text-xs"
                    style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                  >
                    <span className="flex items-center gap-1">
                      <Star
                        size={10}
                        fill="#F59E0B"
                        style={{ color: "#F59E0B" }}
                      />
                      {course.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {course.duration}
                    </span>
                    <span>{course.level}</span>
                  </div>
                </div>
                <Award
                  size={15}
                  style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
