import { NavLink } from "react-router-dom";
import {
  Home,
  BookOpen,
  LayoutDashboard,
  FileText,
  ClipboardList,
  CalendarCheck,
  Bell,
  Settings,
  Zap,
} from "lucide-react";

const navItems = [
  { to: "/home", icon: Home, label: "Home" },
  { to: "/courses", icon: BookOpen, label: "My Courses" },
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/homework", icon: FileText, label: "Homework" },
  { to: "/exams", icon: ClipboardList, label: "Exams" },
  { to: "/attendance", icon: CalendarCheck, label: "Attendance" },
  { to: "/notifications", icon: Bell, label: "Notifications" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border flex flex-col z-40">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-border">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent-foreground flex items-center justify-center shadow-sm">
          <Zap size={18} className="text-white" fill="white" />
        </div>
        <div>
          <p className="text-foreground font-bold text-sm leading-tight">
            Future
          </p>
          <p className="text-muted-foreground text-xs leading-tight">Technologies</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="text-muted-foreground text-xs font-semibold uppercase tracking-widest px-3 mb-3">
          Navigation
        </p>
        <ul className="space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                    isActive
                      ? "bg-primary/20 text-primary/80 border border-primary/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={18}
                      className={
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-foreground"
                      }
                    />
                    {label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User footer */}
      <div className="px-4 py-4 border-t border-border">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-secondary cursor-pointer transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent-foreground flex items-center justify-center text-white text-xs font-bold">
            TA
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-foreground text-sm font-medium truncate">
              Tife Abayomi
            </p>
            <p className="text-muted-foreground text-xs truncate">Student</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
