import { apiFetch } from "./client";
import type { Announcement } from "../data/announcements";

interface ApiAnnouncement {
  announcementId?: string | number;
  id?: string | number;
  type?: string;
  title?: string;
  body?: string;
  message?: string;
  author?: string;
  targetCourseId?: string | number | null;
  courseId?: string | number | null;
  createdAt?: string;
  date?: string;
}

function toAnnouncement(item: ApiAnnouncement, index: number): Announcement {
  const rawId = item.announcementId ?? item.id ?? index + 1;
  const id =
    typeof rawId === "number"
      ? rawId
      : parseInt(String(rawId), 10) || index + 1;

  const targetCourseId = item.targetCourseId ?? item.courseId ?? null;
  const normTarget =
    targetCourseId === null
      ? null
      : typeof targetCourseId === "number"
        ? targetCourseId
        : parseInt(String(targetCourseId), 10) || null;

  return {
    id,
    type: (item.type as Announcement["type"]) ?? "info",
    title: item.title ?? "",
    body: item.body ?? item.message ?? "",
    author: item.author ?? "Admin",
    targetCourseId: normTarget,
    createdAt: item.createdAt ?? item.date ?? "",
  };
}

export async function getAnnouncements(): Promise<Announcement[]> {
  const data = await apiFetch<
    ApiAnnouncement[] | { items?: ApiAnnouncement[] }
  >("/announcements");
  const items = Array.isArray(data) ? data : (data.items ?? []);
  return items.map(toAnnouncement);
}

export async function createAnnouncement(
  announcement: Omit<Announcement, "id" | "createdAt">,
): Promise<Announcement> {
  const item = await apiFetch<ApiAnnouncement>(
    "/announcements",
    { method: "POST", body: JSON.stringify(announcement) },
    true,
  );
  return toAnnouncement(item, 0);
}

export async function deleteAnnouncement(id: string | number): Promise<void> {
  await apiFetch<void>(`/announcements/${id}`, { method: "DELETE" }, true);
}
