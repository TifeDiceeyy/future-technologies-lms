import { apiFetch } from "./client";
import type { Student } from "../data/students";

interface ApiStudent {
  studentId?: string | number;
  id?: string | number;
  sub?: string; // Cognito sub
  name?: string;
  email?: string;
  status?: string;
  enrolledCourseIds?: (string | number)[];
  avgScore?: number;
  hoursLearned?: number;
}

function toStudent(item: ApiStudent, index: number): Student {
  const rawId = item.studentId ?? item.sub ?? item.id ?? index + 1;
  const id =
    typeof rawId === "number"
      ? rawId
      : parseInt(String(rawId), 10) || index + 1;
  const name = item.name ?? "";
  const initials =
    name
      .split(" ")
      .map((w) => w[0] ?? "")
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";
  return {
    id,
    name,
    email: item.email ?? "",
    initials,
    joinDate: "",
    status: (item.status as Student["status"]) ?? "active",
    enrolledCourseIds: (item.enrolledCourseIds ?? []).map((cid) =>
      typeof cid === "number" ? cid : parseInt(String(cid), 10) || 0,
    ),
    avgScore: item.avgScore ?? 0,
    hoursLearned: item.hoursLearned ?? 0,
  };
}

export async function getStudents(): Promise<Student[]> {
  const data = await apiFetch<ApiStudent[] | { items?: ApiStudent[] }>(
    "/students",
    {},
    true,
  );
  const items = Array.isArray(data) ? data : (data.items ?? []);
  return items.map(toStudent);
}

export async function updateStudentStatus(
  id: string | number,
  status: "active" | "inactive",
): Promise<Student> {
  const item = await apiFetch<ApiStudent>(
    `/students/${id}`,
    { method: "PUT", body: JSON.stringify({ status }) },
    true,
  );
  return toStudent(item, 0);
}
