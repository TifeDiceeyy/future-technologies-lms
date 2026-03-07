import { useNavigate } from "react-router-dom";
import { BarChart2, Bell, Monitor, Eye } from "lucide-react";
import { AccordionComponent } from "@/components/ui/icon-accordion";
import { BauhausCard } from "@/components/ui/bauhaus-card";

const WHAT_YOULL_LEARN = [
  {
    title: "Course Tracking",
    description: "Monitor your progress across all enrolled courses",
    icon: BarChart2,
    iconBg: "bg-blue-100 dark:bg-blue-900",
  },
  {
    title: "Assignment Alerts",
    description: "Never miss a deadline with smart notifications",
    icon: Bell,
    iconBg: "bg-yellow-100 dark:bg-yellow-900",
  },
  {
    title: "Live Sessions",
    description: "Join interactive live classes with your tutors",
    icon: Monitor,
    iconBg: "bg-green-100 dark:bg-green-900",
  },
  {
    title: "Progress Reports",
    description: "Detailed analytics on your learning performance",
    icon: Eye,
    iconBg: "bg-purple-100 dark:bg-purple-900",
  },
];

const COURSE_CARDS = [
  {
    id: "1",
    accentColor: "#156ef6",
    topInscription: "12 Modules",
    mainText: "AWS Cloud Fundamentals",
    subMainText: "Master cloud infrastructure from scratch",
    progressBarInscription: "Progress:",
    progress: 68,
    progressValue: "68%",
  },
  {
    id: "2",
    accentColor: "#24d200",
    topInscription: "8 Modules",
    mainText: "React + TypeScript",
    subMainText: "Build modern web applications",
    progressBarInscription: "Progress:",
    progress: 42,
    progressValue: "42%",
  },
  {
    id: "3",
    accentColor: "#fc6800",
    topInscription: "10 Modules",
    mainText: "Python for Data Science",
    subMainText: "Analyse and visualise complex datasets",
    progressBarInscription: "Progress:",
    progress: 15,
    progressValue: "15%",
  },
  {
    id: "4",
    accentColor: "#8f10f6",
    topInscription: "6 Modules",
    mainText: "UI/UX Design Principles",
    subMainText: "Design beautiful, usable interfaces",
    progressBarInscription: "Progress:",
    progress: 90,
    progressValue: "90%",
  },
];

export default function Courses() {
  const navigate = useNavigate();

  return (
    <div className="p-8 max-w-6xl">
      {/* Heading */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-foreground">My Courses</h1>
        <p className="text-muted-foreground mt-1">
          Browse and continue your learning journey.
        </p>
      </div>

      {/* Bauhaus Course Cards */}
      <div className="flex flex-wrap gap-8 justify-center">
        {COURSE_CARDS.map((course) => (
          <BauhausCard
            key={course.id}
            id={course.id}
            accentColor={course.accentColor}
            topInscription={course.topInscription}
            mainText={course.mainText}
            subMainText={course.subMainText}
            progressBarInscription={course.progressBarInscription}
            progress={course.progress}
            progressValue={course.progressValue}
            filledButtonInscription="Continue"
            outlinedButtonInscription="Details"
            onFilledButtonClick={() => navigate(`/courses/${course.id}`)}
            onOutlinedButtonClick={() =>
              console.log(`Details for course ${course.id}`)
            }
          />
        ))}
      </div>

      {/* What You'll Learn */}
      <div className="mt-16 max-w-2xl">
        <h2 className="text-xl font-bold text-foreground mb-1">
          What You'll Learn
        </h2>
        <p className="text-muted-foreground text-sm mb-6">
          Everything included with your courses
        </p>
        <AccordionComponent items={WHAT_YOULL_LEARN} />
      </div>
    </div>
  );
}
