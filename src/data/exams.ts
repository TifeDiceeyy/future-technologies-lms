export interface Exam {
  id: number;
  title: string;
  course: string;
  courseId: number;
  date: string;
  time: string;
  duration: string;
  questions: number;
  status: "upcoming" | "completed" | "locked";
  score: number | null;
  submissions: number;
  avgScore: number | null;
}

export const initialExams: Exam[] = [
  {
    id: 1,
    title: "AWS Cloud Practitioner Mock Exam",
    course: "AWS Cloud Fundamentals",
    courseId: 1,
    date: "Mar 10, 2026",
    time: "10:00 AM",
    duration: "90 min",
    questions: 65,
    status: "upcoming",
    score: null,
    submissions: 0,
    avgScore: null,
  },
  {
    id: 2,
    title: "React Fundamentals Assessment",
    course: "React + TypeScript Mastery",
    courseId: 2,
    date: "Mar 15, 2026",
    time: "2:00 PM",
    duration: "60 min",
    questions: 40,
    status: "upcoming",
    score: null,
    submissions: 0,
    avgScore: null,
  },
  {
    id: 3,
    title: "Python Basics Quiz",
    course: "Python for Data Science",
    courseId: 3,
    date: "Feb 20, 2026",
    time: "11:00 AM",
    duration: "45 min",
    questions: 30,
    status: "completed",
    score: 87,
    submissions: 72,
    avgScore: 79,
  },
  {
    id: 4,
    title: "Cloud Architecture Midterm",
    course: "AWS Cloud Fundamentals",
    courseId: 1,
    date: "Feb 10, 2026",
    time: "9:00 AM",
    duration: "120 min",
    questions: 80,
    status: "completed",
    score: 92,
    submissions: 130,
    avgScore: 84,
  },
  {
    id: 5,
    title: "TypeScript Advanced Quiz",
    course: "React + TypeScript Mastery",
    courseId: 2,
    date: "Mar 20, 2026",
    time: "3:00 PM",
    duration: "45 min",
    questions: 25,
    status: "locked",
    score: null,
    submissions: 0,
    avgScore: null,
  },
];
