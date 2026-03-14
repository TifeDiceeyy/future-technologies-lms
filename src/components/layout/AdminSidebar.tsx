import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  ClipboardList,
  CalendarCheck,
  Megaphone,
  Settings,
  Zap,
  ChevronLeft,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/store/AuthContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/students", icon: Users, label: "Students" },
  { to: "/admin/courses", icon: BookOpen, label: "Courses" },
  { to: "/admin/assignments", icon: FileText, label: "Assignments" },
  { to: "/admin/exams", icon: ClipboardList, label: "Exams" },
  { to: "/admin/attendance", icon: CalendarCheck, label: "Attendance" },
  { to: "/admin/announcements", icon: Megaphone, label: "Announcements" },
  { to: "/admin/settings", icon: Settings, label: "Settings" },
];

export default function AdminSidebar() {
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();
  const displayName = currentUser?.name ?? "Admin";
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  async function handleLogout() {
    await signOut();
    navigate("/admin-signup", { replace: true });
  }

  return (
    // Bug 10 fix: was "... flex flex-col z-40" — now hidden on mobile, flex on md+
    <aside className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border hidden md:flex flex-col z-40">
      {/* Logo + Admin badge */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-border">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent-foreground flex items-center justify-center shadow-sm">
          <Zap size={18} className="text-white" fill="white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-foreground font-bold text-sm leading-tight">
            Future
          </p>
          <p className="text-muted-foreground text-xs leading-tight">
            Technologies
          </p>
        </div>
        <span className="flex items-center gap-1 bg-primary/20 border border-primary/40 text-primary/80 text-[10px] font-semibold px-2 py-0.5 rounded-full">
          <ShieldCheck size={10} />
          Admin
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="text-muted-foreground text-xs font-semibold uppercase tracking-widest px-3 mb-3">
          Management
        </p>
        <ul className="space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === "/admin"}
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

      {/* Back to student view */}
      <div className="px-4 py-4 border-t border-border space-y-2">
        <div className="flex items-center justify-between px-2 pb-1">
          <span className="text-xs text-muted-foreground">Theme</span>
          <ThemeToggle />
        </div>
        <Link
          to="/home"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary text-sm transition-colors"
        >
          <ChevronLeft size={16} />
          Student View
        </Link>
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent-foreground flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-foreground text-sm font-medium truncate">
              {displayName}
            </p>
            <p className="text-muted-foreground text-xs truncate">
              Administrator
            </p>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
