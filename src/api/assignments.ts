import { apiFetch } from "./client";
import type { Assignment } from "../data/assignments";

interface ApiAssignment {
  assignmentId?: string | number;
  id?: string | number;
  title?: string;
  course?: string;
  courseId?: string | number;
  due?: string;
  dueDate?: string;
  status?: string;
  priority?: string;
  points?: number;
  maxScore?: number;
  score?: number;
  desc?: string;
  description?: string;
  submissions?: number;
  avgScore?: number | null;
}

function toAssignment(item: ApiAssignment): Assignment {
  const rawId = item.assignmentId ?? item.id ?? 0;
  const id =
    typeof rawId === "number" ? rawId : parseInt(String(rawId), 10) || 0;
  const courseId =
    typeof item.courseId === "number"
      ? item.courseId
      : parseInt(String(item.courseId ?? "0"), 10) || 0;
  return {
    id,
    title: item.title ?? "",
    course: item.course ?? "",
    courseId,
    due: item.due ?? item.dueDate ?? "",
    status: (item.status as Assignment["status"]) ?? "pending",
    priority: (item.priority as Assignment["priority"]) ?? "medium",
    points: item.points ?? item.maxScore ?? 100,
    score: item.score,
    desc: item.desc ?? item.description ?? "",
    submissions: item.submissions ?? 0,
    avgScore: item.avgScore ?? null,
  };
}

export async function getAssignments(
  studentId?: string | number,
): Promise<Assignment[]> {
  const qs = studentId ? `?studentId=${studentId}` : "";
  const data = await apiFetch<ApiAssignment[] | { items?: ApiAssignment[] }>(
    `/assignments${qs}`,
  );
  const items = Array.isArray(data) ? data : (data.items ?? []);
  return items.map(toAssignment);
}

export async function createAssignment(
  assignment: Omit<Assignment, "id">,
): Promise<Assignment> {
  const item = await apiFetch<ApiAssignment>(
    "/assignments",
    { method: "POST", body: JSON.stringify(assignment) },
    true,
  );
  return toAssignment(item);
}

export async function updateAssignment(
  id: string | number,
  updates: Partial<Assignment>,
): Promise<Assignment> {
  const item = await apiFetch<ApiAssignment>(
    `/assignments/${id}`,
    { method: "PUT", body: JSON.stringify(updates) },
    true,
  );
  return toAssignment(item);
}

export async function deleteAssignment(id: string | number): Promise<void> {
  await apiFetch<void>(`/assignments/${id}`, { method: "DELETE" }, true);
}
