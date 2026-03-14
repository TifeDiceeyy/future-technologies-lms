// ─── User / Auth ──────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  role: "student" | "admin";
  bio?: string;
  photoUrl?: string;
}

// ─── Courses ──────────────────────────────────────────────────────────────────

export interface Course {
  courseId: string;
  title: string;
  description: string;
  instructor: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  modules: number;
  students: number;
  status: "published" | "draft";
  rating?: number;
  // Student-specific (populated when fetched for a student)
  progress?: number;
  enrolled?: boolean;
  modulesCompleted?: number;
  currentScore?: number | null;
}

// ─── Assignments ──────────────────────────────────────────────────────────────

export interface Assignment {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "in-progress" | "submitted" | "graded";
  score?: number;
  maxScore?: number;
  description?: string;
  submissions?: number;
  avgScore?: number | null;
}

// ─── Exams ────────────────────────────────────────────────────────────────────

export interface Exam {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  date: string;
  time?: string;
  duration: number; // minutes
  questions: number;
  status: "upcoming" | "completed" | "locked";
  score?: number;
  submissions?: number;
  avgScore?: number | null;
}

// ─── Attendance ───────────────────────────────────────────────────────────────

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName?: string;
  courseId: string;
  courseName: string;
  sessionName?: string;
  date?: string;
  present: number;
  total: number;
  lastSession?: string;
  status?: "good" | "warning" | "critical";
}

// ─── Notifications ────────────────────────────────────────────────────────────

export interface Notification {
  id: string;
  type:
    | "assignment"
    | "grade"
    | "exam"
    | "announcement"
    | "attendance"
    | "system";
  title: string;
  message: string;
  date: string;
  read: boolean;
}

// ─── Announcements ────────────────────────────────────────────────────────────

export interface Announcement {
  id: string;
  type: "info" | "warning" | "success" | "event";
  title: string;
  message: string;
  date: string;
  author: string;
  courseId?: string | null;
  // Legacy field used in existing data files — maps to message
  body?: string;
  createdAt?: string;
}

// ─── Students (Admin view) ────────────────────────────────────────────────────

export interface Student {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive";
  enrolledCourseIds: string[];
  avgScore: number;
  hoursLearned: number;
  joinedAt?: string;
}
