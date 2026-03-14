import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/layout/Layout";
import AdminLayout from "./components/layout/AdminLayout";

// Public pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SignUp from "./pages/SignUp";
import Pricing from "./pages/Pricing";
import AdminSignUp from "./pages/AdminSignUp";
import GetStarted from "./pages/GetStarted";
import PublicCourses from "./pages/PublicCourses";

// Auth flow pages
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";

// Onboarding flow (public — after signup)
import OnboardingStart from "./pages/onboarding/OnboardingStart";
import OnboardingInterests from "./pages/onboarding/OnboardingInterests";
import OnboardingGoals from "./pages/onboarding/OnboardingGoals";
import OnboardingComplete from "./pages/onboarding/OnboardingComplete";

// Student pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import LessonDetail from "./pages/LessonDetail";
import Homework from "./pages/Homework";
import Exams from "./pages/Exams";
import Attendance from "./pages/Attendance";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import SearchPage from "./pages/SearchPage";
import Library from "./pages/Library";
import Profile from "./pages/Profile";
import TeacherProfile from "./pages/TeacherProfile";
import About from "./pages/About";
import UpgradePricing from "./pages/UpgradePricing";

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
      {/* ── Public pages (no auth required) ─────────────────────────────── */}
      <Route path="/" element={<Landing />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/verify" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/about" element={<About />} />
      <Route path="/courses" element={<PublicCourses />} />
      <Route path="/get-started" element={<GetStarted />} />
      <Route path="/admin-signup" element={<AdminSignUp />} />
      <Route path="/public-courses" element={<PublicCourses />} />

      {/* ── Onboarding (public — post-signup flow) ───────────────────────── */}
      <Route path="/onboarding/start" element={<OnboardingStart />} />
      <Route path="/onboarding/interests" element={<OnboardingInterests />} />
      <Route path="/onboarding/goals" element={<OnboardingGoals />} />
      <Route path="/onboarding/complete" element={<OnboardingComplete />} />

      {/* ── Student routes (authenticated students only) ──────────────────── */}
      <Route element={<ProtectedRoute role="student" />}>
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route
            path="/courses/:id/lessons/:lessonId"
            element={<LessonDetail />}
          />
          <Route path="/homework" element={<Homework />} />
          <Route path="/exams" element={<Exams />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/library" element={<Library />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/teachers/:id" element={<TeacherProfile />} />
          <Route path="/upgrade" element={<UpgradePricing />} />
        </Route>
      </Route>

      {/* ── Admin routes (authenticated admins only) ──────────────────────── */}
      <Route element={<ProtectedRoute role="admin" />}>
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
      </Route>

      {/* Convenience redirect */}
      <Route path="/learning" element={<Navigate to="/courses" replace />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
