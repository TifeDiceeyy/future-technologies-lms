import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import AdminLayout from "./components/layout/AdminLayout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Homework from "./pages/Homework";
import Exams from "./pages/Exams";
import Attendance from "./pages/Attendance";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Pricing from "./pages/Pricing";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import Students from "./pages/admin/Students";
import AdminCourses from "./pages/admin/AdminCourses";
import Assignments from "./pages/admin/Assignments";
import AdminExams from "./pages/admin/AdminExams";
import AttendanceOverview from "./pages/admin/AttendanceOverview";
import Announcements from "./pages/admin/Announcements";
import AdminSettings from "./pages/admin/AdminSettings";

export default function App() {
  return (
    <Routes>
      {/* Public pages — no sidebar */}
      <Route path="/" element={<Landing />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Inner app pages — student sidebar layout */}
      <Route element={<Layout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/homework" element={<Homework />} />
        <Route path="/exams" element={<Exams />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Admin portal — admin sidebar layout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="courses" element={<AdminCourses />} />
        <Route path="assignments" element={<Assignments />} />
        <Route path="exams" element={<AdminExams />} />
        <Route path="attendance" element={<AttendanceOverview />} />
        <Route path="announcements" element={<Announcements />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
