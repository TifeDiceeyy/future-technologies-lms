export interface Announcement {
  id: number;
  title: string;
  body: string;
  type: "info" | "warning" | "success" | "event";
  createdAt: string;
  author: string;
  targetCourseId: number | null; // null = all students
}

export const initialAnnouncements: Announcement[] = [
  {
    id: 1,
    title: "New course available: Terraform IaC",
    body: "We've just launched a new advanced course on Terraform Infrastructure as Code. Enroll now and automate your AWS infrastructure from day one.",
    type: "info",
    createdAt: "Mar 5, 2026",
    author: "Admin",
    targetCourseId: null,
  },
  {
    id: 2,
    title: "Assignment 3 graded — 92/100",
    body: "Grades for EC2 Instance Launch & SSH have been released. Check your Homework page for detailed feedback.",
    type: "success",
    createdAt: "Mar 4, 2026",
    author: "Sarah Chen",
    targetCourseId: 1,
  },
  {
    id: 3,
    title: "Live session: AWS ECS Fargate — Mar 8",
    body: "Join us for a live deep-dive into AWS ECS Fargate. The session starts at 3:00 PM WAT. Link will be shared 30 minutes before.",
    type: "event",
    createdAt: "Mar 3, 2026",
    author: "Admin",
    targetCourseId: null,
  },
  {
    id: 4,
    title: "Platform maintenance — Mar 9, 2:00–4:00 AM",
    body: "The platform will be briefly unavailable for scheduled maintenance. Please save your progress before 2:00 AM on March 9.",
    type: "warning",
    createdAt: "Mar 2, 2026",
    author: "Admin",
    targetCourseId: null,
  },
  {
    id: 5,
    title: "AWS Cloud Practitioner exam prep resources added",
    body: "Practice questions, cheat sheets, and a study guide for the AWS Cloud Practitioner exam are now in the AWS Cloud Fundamentals course.",
    type: "info",
    createdAt: "Feb 28, 2026",
    author: "Sarah Chen",
    targetCourseId: 1,
  },
];
