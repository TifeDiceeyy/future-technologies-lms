export interface Assignment {
  id: number;
  title: string;
  course: string;
  courseId: number;
  due: string;
  status: "pending" | "in-progress" | "submitted" | "graded";
  priority: "high" | "medium" | "low";
  points: number;
  score?: number;
  desc: string;
  submissions: number;
  avgScore: number | null;
}

export const initialAssignments: Assignment[] = [
  {
    id: 1,
    title: "AWS S3 Bucket Setup Lab",
    course: "AWS Cloud Fundamentals",
    courseId: 1,
    due: "Mar 7, 2026",
    status: "pending",
    priority: "high",
    points: 100,
    desc: "Create an S3 bucket with static website hosting, configure bucket policy, and connect to CloudFront.",
    submissions: 89,
    avgScore: null,
  },
  {
    id: 2,
    title: "React Custom Hooks Exercise",
    course: "React + TypeScript Mastery",
    courseId: 2,
    due: "Mar 9, 2026",
    status: "pending",
    priority: "medium",
    points: 80,
    desc: "Build 3 custom hooks: useLocalStorage, useDebounce, and useFetch with TypeScript generics.",
    submissions: 42,
    avgScore: null,
  },
  {
    id: 3,
    title: "Data Cleaning with Pandas",
    course: "Python for Data Science",
    courseId: 3,
    due: "Mar 12, 2026",
    status: "in-progress",
    priority: "medium",
    points: 90,
    desc: "Clean a real-world dataset, handle missing values, and produce summary statistics.",
    submissions: 31,
    avgScore: null,
  },
  {
    id: 4,
    title: "EC2 Instance Launch & SSH",
    course: "AWS Cloud Fundamentals",
    courseId: 1,
    due: "Feb 28, 2026",
    status: "submitted",
    priority: "low",
    points: 100,
    score: 95,
    desc: "Launch an EC2 instance, configure security groups, and connect via SSH key pair.",
    submissions: 138,
    avgScore: 87,
  },
  {
    id: 5,
    title: "TypeScript Interfaces Lab",
    course: "React + TypeScript Mastery",
    courseId: 2,
    due: "Feb 22, 2026",
    status: "graded",
    priority: "low",
    points: 75,
    score: 72,
    desc: "Define TypeScript interfaces for a REST API response and implement type guards.",
    submissions: 95,
    avgScore: 81,
  },
];
