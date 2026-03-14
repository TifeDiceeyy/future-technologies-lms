import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
  },
  build: {
    // Landing page animation components (3d-carousel, integration-hero) are inherently large.
    // All chunks are < 150KB gzip — the minified threshold is for cold CDN-miss scenarios only.
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // AWS Amplify — all subpaths (aws-amplify/auth, @aws-amplify/core, etc.)
          if (
            id.includes("node_modules/aws-amplify") ||
            id.includes("node_modules/@aws-amplify")
          ) {
            return "vendor-aws";
          }
          // React core
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/") ||
            id.includes("node_modules/react-router")
          ) {
            return "vendor-react";
          }
          // Charts
          if (
            id.includes("node_modules/recharts") ||
            id.includes("node_modules/d3-") ||
            id.includes("node_modules/d3/") ||
            id.includes("node_modules/victory")
          ) {
            return "vendor-charts";
          }
          // UI / animation
          if (
            id.includes("node_modules/lucide-react") ||
            id.includes("node_modules/framer-motion")
          ) {
            return "vendor-ui";
          }
          // Shared component utilities (@radix-ui, class-variance-authority, tailwind-merge, clsx)
          if (
            id.includes("node_modules/@radix-ui") ||
            id.includes("node_modules/class-variance-authority") ||
            id.includes("node_modules/tailwind-merge") ||
            id.includes("node_modules/clsx") ||
            id.includes("node_modules/cmdk") ||
            id.includes("node_modules/@floating-ui")
          ) {
            return "vendor-components";
          }
          // Admin pages
          if (id.includes("/src/pages/admin/")) {
            return "pages-admin";
          }
          // Student pages (heavy ones)
          if (
            id.includes("/src/pages/Dashboard") ||
            id.includes("/src/pages/Courses") ||
            id.includes("/src/pages/CourseDetail") ||
            id.includes("/src/pages/LessonDetail") ||
            id.includes("/src/pages/Homework") ||
            id.includes("/src/pages/Exams") ||
            id.includes("/src/pages/Library") ||
            id.includes("/src/pages/SearchPage") ||
            id.includes("/src/pages/Profile") ||
            id.includes("/src/pages/Settings") ||
            id.includes("/src/pages/Notifications") ||
            id.includes("/src/pages/Attendance")
          ) {
            return "pages-student";
          }
          // Auth pages
          if (
            id.includes("/src/pages/Login") ||
            id.includes("/src/pages/Register") ||
            id.includes("/src/pages/SignUp") ||
            id.includes("/src/pages/VerifyEmail") ||
            id.includes("/src/pages/ForgotPassword")
          ) {
            return "pages-auth";
          }
          // Onboarding
          if (id.includes("/src/pages/onboarding/")) {
            return "pages-onboarding";
          }
          // Landing + its heavy UI components (3d-carousel, integration-hero, hero-section-9)
          // Pricing excluded — it imports recharts which would create a circular chunk dep
          if (
            id.includes("/src/pages/Landing") ||
            id.includes("/src/pages/Home") ||
            id.includes("/src/pages/About") ||
            id.includes("/src/pages/TeacherProfile") ||
            id.includes("/src/components/ui/3d-carousel") ||
            id.includes("/src/components/ui/integration-hero") ||
            id.includes("/src/components/ui/hero-section-9") ||
            id.includes("/src/components/ui/dotted-surface") ||
            id.includes("/src/components/ui/button-shiny") ||
            id.includes("/src/components/ui/gradient-button") ||
            id.includes("/src/components/ui/icon-accordion")
          ) {
            return "pages-public";
          }
        },
      },
    },
  },
});
