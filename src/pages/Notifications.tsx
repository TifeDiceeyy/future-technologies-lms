import { useState, useMemo } from "react";
import { Bell, CheckCheck, Megaphone } from "lucide-react";
import { useApp } from "../store/AppContext";

const CARD_STYLE = {
  backgroundColor: "var(--bauhaus-card-bg)",
  border: "1px solid var(--bauhaus-card-separator)",
};

const GROUP_ORDER = ["Today", "Yesterday", "Earlier"] as const;

export default function Notifications() {
  const { announcements } = useApp();

  const merged = useMemo(() => {
    return announcements.map((a) => ({
      id: 1000 + a.id,
      type: "announcement",
      icon: Megaphone,
      title: a.title,
      body: a.body,
      time: a.createdAt,
      group: "Today" as const,
      read: false,
      accentColor: "#156ef6",
    }));
  }, [announcements]);

  const [readIds, setReadIds] = useState<Set<number>>(new Set());

  const notifications = merged.map((n) => ({
    ...n,
    read: readIds.has(n.id) || n.read,
  }));
  const unread = notifications.filter((n) => !n.read).length;

  // Group notifications
  const grouped = GROUP_ORDER.reduce<Record<string, typeof notifications>>(
    (acc, g) => {
      const items = notifications.filter((n) => n.group === g);
      if (items.length > 0) acc[g] = items;
      return acc;
    },
    {},
  );

  const markAllRead = () => {
    setReadIds(new Set(notifications.map((n) => n.id)));
  };

  const markRead = (id: number) => {
    setReadIds((prev) => new Set([...prev, id]));
  };

  return (
    <div className="p-4 md:p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-6 md:mb-8 gap-3">
        <div>
          <h1
            className="text-2xl md:text-3xl font-bold"
            style={{ color: "var(--bauhaus-card-inscription-main)" }}
          >
            Notifications
          </h1>
          <p
            className="mt-1 text-sm"
            style={{ color: "var(--bauhaus-card-inscription-sub)" }}
          >
            {unread > 0 ? `${unread} unread notifications` : "All caught up"}
          </p>
        </div>
        {unread > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70 flex-shrink-0"
            style={{ color: "#156ef6" }}
          >
            <CheckCheck size={16} /> Mark all read
          </button>
        )}
      </div>

      {/* Grouped notification list */}
      {Object.entries(grouped).length > 0 ? (
        <div className="space-y-6">
          {GROUP_ORDER.filter((g) => grouped[g]).map((group) => (
            <div key={group}>
              {/* Group header */}
              <div className="flex items-center gap-3 mb-3">
                <p
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "var(--bauhaus-card-inscription-sub)" }}
                >
                  {group}
                </p>
                <div
                  className="flex-1 h-px"
                  style={{ backgroundColor: "var(--bauhaus-card-separator)" }}
                />
              </div>

              {/* Items */}
              <div className="space-y-2">
                {grouped[group].map((n) => {
                  const Icon = n.icon;
                  return (
                    <div
                      key={n.id}
                      className="relative flex gap-3 p-4 rounded-xl cursor-pointer transition-all hover:scale-[1.01] hover:shadow-sm"
                      style={{
                        ...CARD_STYLE,
                        opacity: n.read ? 0.7 : 1,
                        borderLeft: !n.read
                          ? `3px solid ${n.accentColor}`
                          : undefined,
                      }}
                      onClick={() => markRead(n.id)}
                    >
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{
                          backgroundColor: `${n.accentColor}18`,
                          border: `1px solid ${n.accentColor}33`,
                        }}
                      >
                        <Icon size={16} style={{ color: n.accentColor }} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className="text-sm font-medium leading-snug break-words"
                            style={{
                              color: "var(--bauhaus-card-inscription-main)",
                            }}
                          >
                            {n.title}
                          </p>
                          {!n.read && (
                            <div
                              className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                              style={{ backgroundColor: n.accentColor }}
                            />
                          )}
                        </div>
                        <p
                          className="text-xs mt-1 leading-relaxed break-words"
                          style={{
                            color: "var(--bauhaus-card-inscription-sub)",
                          }}
                        >
                          {n.body}
                        </p>
                        <p
                          className="text-xs mt-1.5"
                          style={{
                            color: "var(--bauhaus-card-inscription-sub)",
                            opacity: 0.7,
                          }}
                        >
                          {n.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Bell
            size={40}
            className="mx-auto mb-4"
            style={{ color: "var(--bauhaus-card-separator)" }}
          />
          <p style={{ color: "var(--bauhaus-card-inscription-sub)" }}>
            No notifications in this category.
          </p>
        </div>
      )}
    </div>
  );
}
