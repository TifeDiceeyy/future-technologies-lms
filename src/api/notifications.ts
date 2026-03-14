import { apiFetch } from "./client";

export interface ApiNotification {
  notificationId?: string | number;
  id?: string | number;
  studentId?: string | number;
  type?: string;
  title?: string;
  message?: string;
  date?: string;
  read?: boolean;
}

export function toNotificationId(item: ApiNotification, index: number): string {
  const raw = item.notificationId ?? item.id ?? index;
  return String(raw);
}

export async function getNotifications(
  studentId: string | number,
): Promise<ApiNotification[]> {
  const data = await apiFetch<
    ApiNotification[] | { items?: ApiNotification[] }
  >(`/notifications?studentId=${studentId}`, {}, true);
  return Array.isArray(data) ? data : (data.items ?? []);
}

export async function markAllRead(studentId: string | number): Promise<void> {
  await apiFetch<void>(
    "/notifications/read",
    { method: "PUT", body: JSON.stringify({ studentId }) },
    true,
  );
}
