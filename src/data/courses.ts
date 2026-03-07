export interface Course {
  id: number;
  title: string;
  instructor: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  rating: number;
  modules: number;
  description: string;
  studentsEnrolled: number;
  published: boolean;
  createdAt: string;
  // Student-specific fields
  enrolled: boolean;
  progress: number;
  modulesCompleted: number;
  currentScore: number | null;
}

const gradientPool = [
  "from-brand-purple to-brand-teal",
  "from-cyan-500 to-brand-teal",
  "from-emerald-500 to-teal-400",
  "from-violet-500 to-brand-purple",
  "from-brand-teal to-cyan-400",
  "from-pink-500 to-rose-400",
];

export function getCourseGradient(id: number): string {
  return gradientPool[(id - 1) % gradientPool.length];
}

export const initialCourses: Course[] = [
  {
    id: 1,
    title: "AWS Cloud Fundamentals",
    instructor: "Sarah Chen",
    category: "Cloud",
    level: "Beginner",
    duration: "24h",
    rating: 4.9,
    modules: 12,
    description: "Master AWS core services: S3, EC2, VPC, IAM, and CloudFront from the ground up.",
    studentsEnrolled: 142,
    published: true,
    createdAt: "Jan 10, 2026",
    enrolled: true,
    progress: 68,
    modulesCompleted: 8,
    currentScore: 91,
  },
  {
    id: 2,
    title: "React + TypeScript Mastery",
    instructor: "James Okafor",
    category: "Frontend",
    level: "Intermediate",
    duration: "18h",
    rating: 4.8,
    modules: 10,
    description: "Build production-grade React applications with TypeScript, hooks, and modern patterns.",
    studentsEnrolled: 98,
    published: true,
    createdAt: "Jan 15, 2026",
    enrolled: true,
    progress: 42,
    modulesCompleted: 4,
    currentScore: 85,
  },
  {
    id: 3,
    title: "Python for Data Science",
    instructor: "Aisha Patel",
    category: "Data",
    level: "Beginner",
    duration: "30h",
    rating: 4.7,
    modules: 14,
    description: "Learn Python, NumPy, Pandas, and data visualisation for real-world data science tasks.",
    studentsEnrolled: 76,
    published: true,
    createdAt: "Jan 20, 2026",
    enrolled: true,
    progress: 15,
    modulesCompleted: 2,
    currentScore: 78,
  },
  {
    id: 4,
    title: "Terraform Infrastructure as Code",
    instructor: "Marcus Webb",
    category: "DevOps",
    level: "Advanced",
    duration: "16h",
    rating: 4.9,
    modules: 8,
    description: "Automate AWS infrastructure with Terraform: modules, state, workspaces, and CI/CD.",
    studentsEnrolled: 54,
    published: true,
    createdAt: "Feb 1, 2026",
    enrolled: true,
    progress: 5,
    modulesCompleted: 0,
    currentScore: null,
  },
  {
    id: 5,
    title: "Docker & Kubernetes Essentials",
    instructor: "Lin Zhao",
    category: "DevOps",
    level: "Intermediate",
    duration: "20h",
    rating: 4.8,
    modules: 11,
    description: "Containerise applications with Docker and orchestrate at scale with Kubernetes.",
    studentsEnrolled: 63,
    published: true,
    createdAt: "Feb 5, 2026",
    enrolled: false,
    progress: 0,
    modulesCompleted: 0,
    currentScore: null,
  },
  {
    id: 6,
    title: "Machine Learning Foundations",
    instructor: "Dr. Priya Singh",
    category: "AI/ML",
    level: "Intermediate",
    duration: "35h",
    rating: 4.9,
    modules: 16,
    description: "From regression to neural networks — a practical ML introduction with Python.",
    studentsEnrolled: 87,
    published: true,
    createdAt: "Feb 10, 2026",
    enrolled: false,
    progress: 0,
    modulesCompleted: 0,
    currentScore: null,
  },
];
