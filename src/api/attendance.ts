import { apiFetch } from "./client";
import type { AttendanceRecord } from "../data/attendance";

interface ApiAttendance {
  id?: string | number;
  studentId?: string | number;
  studentName?: string;
  courseId?: string | number;
  courseName?: string;
  present?: number;
  total?: number;
  lastSession?: string;
  status?: string;
}

function toAttendance(item: ApiAttendance, index: number): AttendanceRecord {
  const rawId = item.id ?? index + 1;
  const id =
    typeof rawId === "number"
      ? rawId
      : parseInt(String(rawId), 10) || index + 1;
  const studentId =
    typeof item.studentId === "number"
      ? item.studentId
      : parseInt(String(item.studentId ?? "0"), 10) || 0;
  const courseId =
    typeof item.courseId === "number"
      ? item.courseId
      : parseInt(String(item.courseId ?? "0"), 10) || 0;

  const present = item.present ?? 0;
  const total = item.total ?? 1;
  const pct = total === 0 ? 100 : Math.round((present / total) * 100);
  const status: AttendanceRecord["status"] =
    pct >= 80 ? "good" : pct >= 60 ? "warning" : "critical";

  return {
    id,
    studentId,
    studentName: item.studentName ?? "",
    courseId,
    courseName: item.courseName ?? "",
    present,
    total,
    lastSession: item.lastSession ?? "",
    status: (item.status as AttendanceRecord["status"]) ?? status,
  };
}

// Student's own attendance
export async function getAttendance(
  studentId?: string | number,
): Promise<AttendanceRecord[]> {
  const qs = studentId ? `?studentId=${studentId}` : "";
  const data = await apiFetch<ApiAttendance[] | { items?: ApiAttendance[] }>(
    `/attendance${qs}`,
  );
  const items = Array.isArray(data) ? data : (data.items ?? []);
  return items.map(toAttendance);
}

// Admin — all records
export async function getAllAttendance(): Promise<AttendanceRecord[]> {
  const data = await apiFetch<ApiAttendance[] | { items?: ApiAttendance[] }>(
    "/attendance",
    {},
    true,
  );
  const items = Array.isArray(data) ? data : (data.items ?? []);
  return items.map(toAttendance);
}

export async function markAttendance(
  record: Omit<AttendanceRecord, "id" | "status">,
): Promise<AttendanceRecord> {
  const item = await apiFetch<ApiAttendance>(
    "/attendance",
    { method: "POST", body: JSON.stringify(record) },
    true,
  );
  return toAttendance(item, 0);
}
