import { NavLink, Link, useNavigate } from "react-router-dom";
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
  LogOut,
  Search,
  BookMarked,
  User,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/store/AuthContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const navItems = [
  { to: "/home", icon: Home, label: "Home" },
  { to: "/search", icon: Search, label: "Search" },
  { to: "/courses", icon: BookOpen, label: "My Courses" },
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/library", icon: BookMarked, label: "Library" },
  { to: "/homework", icon: FileText, label: "Homework" },
  { to: "/exams", icon: ClipboardList, label: "Exams" },
  { to: "/attendance", icon: CalendarCheck, label: "Attendance" },
  { to: "/notifications", icon: Bell, label: "Notifications" },
];

const bottomNavItems = [
  { to: "/profile", icon: User, label: "Profile" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();
  const displayName = currentUser?.name ?? "Student";
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  async function handleLogout() {
    const isAdmin = currentUser?.role === "admin";
    await signOut();
    navigate(isAdmin ? "/admin-signup" : "/login", { replace: true });
  }

  return (
    // Bug 1 fix: was "... flex flex-col z-40" — now hidden on mobile, flex on md+
    <aside className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border hidden md:flex flex-col z-40">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-border">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent-foreground flex items-center justify-center shadow-sm">
          <Zap size={18} className="text-white" fill="white" />
        </div>
        <div>
          <p className="text-foreground font-bold text-sm leading-tight">
            Future
          </p>
          <p className="text-muted-foreground text-xs leading-tight">
            Technologies
          </p>
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

        <div className="h-px bg-border my-3" />

        <ul className="space-y-1">
          {bottomNavItems.map(({ to, icon: Icon, label }) => (
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

      {/* Back to Admin — only visible when admin is in student view */}
      {currentUser?.role === "admin" && (
        <div className="px-4 pb-2">
          <Link
            to="/admin"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              backgroundColor: "rgba(99,102,241,0.12)",
              border: "1px solid rgba(99,102,241,0.3)",
              color: "#6366F1",
            }}
          >
            <ShieldCheck size={15} />
            Back to Admin
          </Link>
        </div>
      )}

      {/* User footer */}
      <div className="px-4 py-4 border-t border-border">
        <div className="flex items-center justify-between px-2 pb-2">
          <span className="text-xs text-muted-foreground">Theme</span>
          <ThemeToggle />
        </div>
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent-foreground flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-foreground text-sm font-medium truncate">
              {displayName}
            </p>
            <p className="text-muted-foreground text-xs truncate">
              {currentUser?.role === "admin" ? "Administrator" : "Student"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            aria-label="Sign out"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
