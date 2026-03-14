import { apiFetch } from "./client";
import type { Exam } from "../data/exams";

interface ApiExam {
  examId?: string | number;
  id?: string | number;
  title?: string;
  courseId?: string | number;
  courseName?: string;
  date?: string;
  time?: string;
  duration?: number;
  questions?: number;
  status?: string;
  score?: number | null;
  submissions?: number;
  avgScore?: number | null;
}

function toExam(item: ApiExam): Exam {
  const rawId = item.examId ?? item.id ?? 0;
  const id =
    typeof rawId === "number" ? rawId : parseInt(String(rawId), 10) || 0;
  const courseId =
    typeof item.courseId === "number"
      ? item.courseId
      : parseInt(String(item.courseId ?? "0"), 10) || 0;
  return {
    id,
    title: item.title ?? "",
    courseId,
    course: item.courseName ?? "",
    date: item.date ?? "",
    time: item.time ?? "",
    duration: item.duration != null ? `${item.duration} mins` : "60 mins",
    questions: item.questions ?? 0,
    status: (item.status as Exam["status"]) ?? "upcoming",
    score: item.score ?? null,
    submissions: item.submissions ?? 0,
    avgScore: item.avgScore ?? null,
  };
}

export async function getExams(): Promise<Exam[]> {
  const data = await apiFetch<ApiExam[] | { items?: ApiExam[] }>("/exams");
  const items = Array.isArray(data) ? data : (data.items ?? []);
  return items.map(toExam);
}

export async function createExam(exam: Omit<Exam, "id">): Promise<Exam> {
  const item = await apiFetch<ApiExam>(
    "/exams",
    { method: "POST", body: JSON.stringify(exam) },
    true,
  );
  return toExam(item);
}

export async function deleteExam(id: string | number): Promise<void> {
  await apiFetch<void>(`/exams/${id}`, { method: "DELETE" }, true);
}
