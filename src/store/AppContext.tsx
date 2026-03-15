/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useAuth } from "./AuthContext";

// ── Data types (keep existing types from data files) ───────────────────────
import type { Course } from "../data/courses";
import type { Student } from "../data/students";
import type { Assignment } from "../data/assignments";
import type { Exam } from "../data/exams";
import type { AttendanceRecord } from "../data/attendance";
import type { Announcement } from "../data/announcements";

// ── API functions (gracefully fall back to static data on error) ───────────
import {
  getCourses,
  createCourse as apiCreateCourse,
  deleteCourse as apiDeleteCourse,
  updateCourse as apiUpdateCourse,
} from "../api/courses";
import {
  getAssignments,
  createAssignment as apiCreateAssignment,
  deleteAssignment as apiDeleteAssignment,
} from "../api/assignments";
import {
  getExams,
  createExam as apiCreateExam,
  deleteExam as apiDeleteExam,
} from "../api/exams";
import { getAllAttendance } from "../api/attendance";
import {
  getAnnouncements,
  createAnnouncement as apiCreateAnnouncement,
  deleteAnnouncement as apiDeleteAnnouncement,
} from "../api/announcements";
import { getStudents } from "../api/students";

// ── Context type ───────────────────────────────────────────────────────────

interface AppContextType {
  courses: Course[];
  students: Student[];
  assignments: Assignment[];
  exams: Exam[];
  attendance: AttendanceRecord[];
  announcements: Announcement[];

  // Loading flags
  coursesLoading: boolean;
  dataLoading: boolean;

  // Error flags
  coursesError: string | null;

  // Courses
  addCourse: (c: Omit<Course, "id">) => Promise<void>;
  updateCourse: (id: number, updates: Partial<Course>) => Promise<void>;
  deleteCourse: (id: number) => Promise<void>;

  // Assignments
  addAssignment: (a: Omit<Assignment, "id">) => Promise<void>;
  deleteAssignment: (id: number) => Promise<void>;

  // Exams
  addExam: (e: Omit<Exam, "id">) => Promise<void>;
  deleteExam: (id: number) => Promise<void>;

  // Announcements
  addAnnouncement: (a: Omit<Announcement, "id" | "createdAt">) => Promise<void>;
  deleteAnnouncement: (id: number) => Promise<void>;

  // Students
  updateStudent: (id: number, updates: Partial<Student>) => void;

  // Manual refresh
  refreshAll: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

// ── Helpers ────────────────────────────────────────────────────────────────

function nextId(items: { id: number }[]) {
  return items.length === 0 ? 1 : Math.max(...items.map((i) => i.id)) + 1;
}

// ── Provider ───────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const [coursesLoading, setCoursesLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [coursesError, setCoursesError] = useState<string | null>(null);

  // ── Load all data from API, fallback to static on error ─────────────────
  async function loadAllData() {
    setDataLoading(true);
    setCoursesLoading(true);
    setCoursesError(null);

    const results = await Promise.allSettled([
      getCourses(),
      getAssignments(),
      getExams(),
      getAllAttendance(),
      getAnnouncements(),
      getStudents(),
    ]);

    const [
      coursesRes,
      assignmentsRes,
      examsRes,
      attendanceRes,
      announcementsRes,
      studentsRes,
    ] = results;

    if (coursesRes.status === "fulfilled") {
      setCourses(coursesRes.value);
    } else {
      setCoursesError("Could not load courses from server.");
    }

    if (assignmentsRes.status === "fulfilled") {
      setAssignments(assignmentsRes.value);
    }

    if (examsRes.status === "fulfilled") {
      setExams(examsRes.value);
    }

    if (attendanceRes.status === "fulfilled") {
      setAttendance(attendanceRes.value);
    }

    if (announcementsRes.status === "fulfilled") {
      setAnnouncements(announcementsRes.value);
    }

    if (studentsRes.status === "fulfilled") {
      setStudents(studentsRes.value);
    }

    setCoursesLoading(false);
    setDataLoading(false);
  }

  useEffect(() => {
    if (!currentUser) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAllData();
  }, [currentUser?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Courses ──────────────────────────────────────────────────────────────

  const addCourse = async (c: Omit<Course, "id">) => {
    // Optimistic local add
    const tempId = nextId(courses);
    setCourses((prev) => [
      ...prev,
      { ...c, id: tempId, courseId: String(tempId) },
    ]);
    try {
      const created = await apiCreateCourse(c, tempId);
      // Replace temp entry with server response (preserves courseId from DynamoDB)
      setCourses((prev) => prev.map((x) => (x.id === tempId ? created : x)));
    } catch (err) {
      console.error("[addCourse] API error — kept local copy:", err);
    }
  };

  const updateCourse = async (id: number, updates: Partial<Course>) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    );
    try {
      // Use the real DynamoDB key (courseId) if available, otherwise fall back to id
      const course = courses.find((c) => c.id === id);
      const key = course?.courseId ?? String(id);
      await apiUpdateCourse(key, updates);
    } catch (err) {
      console.error("[updateCourse] API error:", err);
    }
  };

  const deleteCourse = async (id: number) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
    try {
      // Use the real DynamoDB key (courseId) if available, otherwise fall back to id
      const course = courses.find((c) => c.id === id);
      const key = course?.courseId ?? String(id);
      await apiDeleteCourse(key);
    } catch (err) {
      console.error("[deleteCourse] API error:", err);
    }
  };

  // ── Assignments ──────────────────────────────────────────────────────────

  const addAssignment = async (a: Omit<Assignment, "id">) => {
    const tempId = nextId(assignments);
    setAssignments((prev) => [...prev, { ...a, id: tempId }]);
    try {
      const created = await apiCreateAssignment(a);
      setAssignments((prev) =>
        prev.map((x) => (x.id === tempId ? created : x)),
      );
    } catch {
      // Keep optimistic add
    }
  };

  const deleteAssignment = async (id: number) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
    try {
      await apiDeleteAssignment(id);
    } catch {
      // Silent
    }
  };

  // ── Exams ─────────────────────────────────────────────────────────────────

  const addExam = async (e: Omit<Exam, "id">) => {
    const tempId = nextId(exams);
    setExams((prev) => [...prev, { ...e, id: tempId }]);
    try {
      const created = await apiCreateExam(e);
      setExams((prev) => prev.map((x) => (x.id === tempId ? created : x)));
    } catch {
      // Keep optimistic add
    }
  };

  const deleteExam = async (id: number) => {
    setExams((prev) => prev.filter((e) => e.id !== id));
    try {
      await apiDeleteExam(id);
    } catch {
      // Silent
    }
  };

  // ── Announcements ─────────────────────────────────────────────────────────

  const addAnnouncement = async (a: Omit<Announcement, "id" | "createdAt">) => {
    const now = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const tempId = nextId(announcements);
    setAnnouncements((prev) => [{ ...a, id: tempId, createdAt: now }, ...prev]);
    try {
      const created = await apiCreateAnnouncement(a);
      setAnnouncements((prev) =>
        prev.map((x) => (x.id === tempId ? { ...created, createdAt: now } : x)),
      );
    } catch {
      // Keep optimistic add
    }
  };

  const deleteAnnouncement = async (id: number) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    try {
      await apiDeleteAnnouncement(id);
    } catch {
      // Silent
    }
  };

  // ── Students (local only — API wired but read-only for now) ───────────────

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
        coursesLoading,
        dataLoading,
        coursesError,
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
        refreshAll: loadAllData,
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
