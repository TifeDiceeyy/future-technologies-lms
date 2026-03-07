import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { MinimalDock } from "@/components/ui/minimal-dock";
import { DottedSurface } from "@/components/ui/dotted-surface";

export default function Layout() {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden flex">
      <DottedSurface />
      <Sidebar />
      <main className="relative z-10 flex-1 ml-64 min-h-screen overflow-x-hidden pb-24 md:pb-0">
        <Outlet />
      </main>
      {/* Mobile bottom nav */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 block md:hidden">
        <MinimalDock />
      </div>
    </div>
  );
}
