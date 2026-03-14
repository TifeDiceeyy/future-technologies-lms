import { apiFetch } from "./client";
import type { Course } from "../data/courses";

// ─── Shape returned by GET /courses ──────────────────────────────────────────
interface ApiCourse {
  courseId: string | number;
  title?: string;
  description?: string;
  instructor?: string;
  category?: string;
  level?: string;
  duration?: string;
  rating?: number;
  modules?: number;
  studentsEnrolled?: number;
  published?: boolean;
  isPaid?: boolean;
  createdAt?: string;
  // Student-specific (may or may not be in DynamoDB response)
  enrolled?: boolean;
  progress?: number;
  modulesCompleted?: number;
  currentScore?: number | null;
}

// Adapter: DynamoDB item → existing Course UI type
function toCourse(item: ApiCourse): Course {
  const id =
    typeof item.courseId === "number"
      ? item.courseId
      : parseInt(String(item.courseId), 10) || 0;
  return {
    id,
    title: item.title ?? "",
    instructor: item.instructor ?? "",
    category: item.category ?? "General",
    level: (item.level as Course["level"]) ?? "Beginner",
    duration: item.duration ?? "",
    rating: item.rating ?? 0,
    modules: item.modules ?? 0,
    description: item.description ?? "",
    studentsEnrolled: item.studentsEnrolled ?? 0,
    published: item.published ?? true,
    isPaid: item.isPaid ?? false,
    createdAt: item.createdAt ?? "",
    enrolled: item.enrolled ?? false,
    progress: item.progress ?? 0,
    modulesCompleted: item.modulesCompleted ?? 0,
    currentScore: item.currentScore ?? null,
  };
}

// ─── API functions ────────────────────────────────────────────────────────────

export async function getCourses(): Promise<Course[]> {
  const data = await apiFetch<ApiCourse[] | { items?: ApiCourse[] }>(
    "/courses",
  );
  const items = Array.isArray(data) ? data : (data.items ?? []);
  return items.map(toCourse);
}

export async function getCourse(id: string | number): Promise<Course> {
  const item = await apiFetch<ApiCourse>(`/courses/${id}`);
  return toCourse(item);
}

export async function createCourse(
  course: Omit<Course, "id">,
): Promise<Course> {
  const item = await apiFetch<ApiCourse>(
    "/courses",
    {
      method: "POST",
      body: JSON.stringify(course),
    },
    true,
  );
  return toCourse(item);
}

export async function deleteCourse(id: string | number): Promise<void> {
  await apiFetch<void>(`/courses/${id}`, { method: "DELETE" }, true);
}

export async function updateCourse(
  id: string | number,
  updates: Partial<Course>,
): Promise<Course> {
  const item = await apiFetch<ApiCourse>(
    `/courses/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(updates),
    },
    true,
  );
  return toCourse(item);
}
