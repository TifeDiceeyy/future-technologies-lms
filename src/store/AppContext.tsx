/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { Course } from "../data/courses";
import { initialCourses } from "../data/courses";
import type { Student } from "../data/students";
import { initialStudents } from "../data/students";
import type { Assignment } from "../data/assignments";
import { initialAssignments } from "../data/assignments";
import type { Exam } from "../data/exams";
import { initialExams } from "../data/exams";
import type { AttendanceRecord } from "../data/attendance";
import { initialAttendance } from "../data/attendance";
import type { Announcement } from "../data/announcements";
import { initialAnnouncements } from "../data/announcements";

interface AppContextType {
  courses: Course[];
  students: Student[];
  assignments: Assignment[];
  exams: Exam[];
  attendance: AttendanceRecord[];
  announcements: Announcement[];

  // Courses
  addCourse: (c: Omit<Course, "id">) => void;
  updateCourse: (id: number, updates: Partial<Course>) => void;
  deleteCourse: (id: number) => void;

  // Assignments
  addAssignment: (a: Omit<Assignment, "id">) => void;
  deleteAssignment: (id: number) => void;

  // Exams
  addExam: (e: Omit<Exam, "id">) => void;
  deleteExam: (id: number) => void;

  // Announcements
  addAnnouncement: (a: Omit<Announcement, "id" | "createdAt">) => void;
  deleteAnnouncement: (id: number) => void;

  // Students
  updateStudent: (id: number, updates: Partial<Student>) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [assignments, setAssignments] =
    useState<Assignment[]>(initialAssignments);
  const [exams, setExams] = useState<Exam[]>(initialExams);
  const [attendance] = useState<AttendanceRecord[]>(initialAttendance);
  const [announcements, setAnnouncements] =
    useState<Announcement[]>(initialAnnouncements);

  function nextId(items: { id: number }[]) {
    return items.length === 0 ? 1 : Math.max(...items.map((i) => i.id)) + 1;
  }

  const addCourse = (c: Omit<Course, "id">) =>
    setCourses((prev) => [...prev, { ...c, id: nextId(prev) }]);

  const updateCourse = (id: number, updates: Partial<Course>) =>
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    );

  const deleteCourse = (id: number) =>
    setCourses((prev) => prev.filter((c) => c.id !== id));

  const addAssignment = (a: Omit<Assignment, "id">) =>
    setAssignments((prev) => [...prev, { ...a, id: nextId(prev) }]);

  const deleteAssignment = (id: number) =>
    setAssignments((prev) => prev.filter((a) => a.id !== id));

  const addExam = (e: Omit<Exam, "id">) =>
    setExams((prev) => [...prev, { ...e, id: nextId(prev) }]);

  const deleteExam = (id: number) =>
    setExams((prev) => prev.filter((e) => e.id !== id));

  const addAnnouncement = (a: Omit<Announcement, "id" | "createdAt">) => {
    const now = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    setAnnouncements((prev) => [
      { ...a, id: nextId(prev), createdAt: now },
      ...prev,
    ]);
  };

  const deleteAnnouncement = (id: number) =>
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));

  const updateStudent = (id: number, updates: Partial<Student>) =>
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    );

  return (
    <AppContext.Provider
      value={{
        courses,
        students,
        assignments,
        exams,
        attendance,
        announcements,
        addCourse,
        updateCourse,
        deleteCourse,
        addAssignment,
        deleteAssignment,
        addExam,
        deleteExam,
        addAnnouncement,
        deleteAnnouncement,
        updateStudent,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
