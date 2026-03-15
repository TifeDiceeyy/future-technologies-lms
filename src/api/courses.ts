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

// Derive a stable numeric React id from the DynamoDB courseId.
// If courseId is already numeric (e.g. a timestamp), use it directly.
// If it's a UUID, convert the first 7 hex chars to an integer — unique
// enough for React keys and internal state.
function deriveNumericId(courseId: string | number): number {
  if (typeof courseId === "number") return courseId;
  const n = parseInt(String(courseId), 10);
  if (!isNaN(n) && n > 0) return n;
  // UUID: strip dashes, take first 7 hex chars → max ~268 million, low collision risk
  const hex = String(courseId).replace(/-/g, "").slice(0, 7);
  return parseInt(hex, 16) || 1;
}

// Adapter: DynamoDB item → existing Course UI type
function toCourse(item: ApiCourse): Course {
  const rawId = item.courseId ?? 0;
  const id = deriveNumericId(rawId);
  return {
    id,
    courseId: String(rawId), // preserve real DynamoDB key for CRUD operations
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
  _tempId: number,
  uuid: string,
): Promise<Course> {
  // Send the UUID as courseId — string type matches DynamoDB partition key (S)
  const item = await apiFetch<ApiCourse>(
    "/courses",
    {
      method: "POST",
      body: JSON.stringify({ ...course, courseId: uuid }),
    },
    true,
  );
  return toCourse(item);
}

// courseId here is the real DynamoDB key (UUID string or numeric string),
// NOT the derived React numeric id.
export async function deleteCourse(courseId: string): Promise<void> {
  await apiFetch<void>(`/courses/${courseId}`, { method: "DELETE" }, true);
}

export async function updateCourse(
  courseId: string,
  updates: Partial<Course>,
): Promise<Course> {
  const item = await apiFetch<ApiCourse>(
    `/courses/${courseId}`,
    {
      method: "PUT",
      body: JSON.stringify(updates),
    },
    true,
  );
  return toCourse(item);
}
