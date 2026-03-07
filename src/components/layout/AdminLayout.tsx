import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { DottedSurface } from "@/components/ui/dotted-surface";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden flex">
      <DottedSurface />
      <AdminSidebar />
      <main className="relative z-10 flex-1 ml-64 min-h-screen overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
