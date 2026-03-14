// ─── src/pages/GetStarted.tsx ────────────────
// PURPOSE: Role selection page — student or teacher
// ROUTES TO: /register (student) or /admin-signup (teacher)
// PUBLIC: No auth required

import { useNavigate } from "react-router-dom";
import { Zap, GraduationCap, BookOpenCheck } from "lucide-react";

export default function GetStarted() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-background flex flex-col
                    items-center justify-center px-6 py-16"
    >
      {/* Logo */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-3 mb-14"
      >
        <div
          className="w-9 h-9 rounded-xl bg-gradient-to-br
                        from-primary to-accent-foreground
                        flex items-center justify-center shadow-sm"
        >
          <Zap size={18} className="text-white" fill="white" />
        </div>
        <span className="font-bold text-foreground text-lg">
          Future Technologies
        </span>
      </button>

      <h1
        className="text-4xl font-bold text-foreground mb-3
                     text-center"
      >
        How do you want to join?
      </h1>
      <p
        className="text-muted-foreground text-lg mb-12
                    text-center max-w-md"
      >
        Choose your role to get started — you can always switch later.
      </p>

      <div className="grid sm:grid-cols-2 gap-6 w-full max-w-2xl">
        {/* Student card */}
        <button
          onClick={() => navigate("/pricing")}
          className="group bg-card border border-border
                     hover:border-primary/50 rounded-2xl p-8
                     text-left transition-all hover:shadow-md"
        >
          <div
            className="w-14 h-14 rounded-2xl bg-primary/10
                          border border-primary/20
                          flex items-center justify-center mb-5
                          group-hover:bg-primary/20
                          transition-colors"
          >
            <GraduationCap size={28} className="text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            I'm a Student
          </h2>
          <p
            className="text-muted-foreground text-sm
                        leading-relaxed mb-5"
          >
            Enroll in courses, track your progress, submit assignments and ace
            your exams.
          </p>
          <span
            className="inline-flex items-center gap-1.5
                           text-sm font-semibold text-primary
                           group-hover:gap-3 transition-all"
          >
            Sign up as Student →
          </span>
        </button>

        {/* Teacher / Admin card */}
        <button
          onClick={() => navigate("/admin-signup")}
          className="group bg-card border border-border
                     hover:border-accent-foreground/50
                     rounded-2xl p-8 text-left
                     transition-all hover:shadow-md"
        >
          <div
            className="w-14 h-14 rounded-2xl
                          bg-accent-foreground/10
                          border border-accent-foreground/20
                          flex items-center justify-center mb-5
                          group-hover:bg-accent-foreground/20
                          transition-colors"
          >
            <BookOpenCheck size={28} className="text-accent-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            I'm a Teacher
          </h2>
          <p
            className="text-muted-foreground text-sm
                        leading-relaxed mb-5"
          >
            Create and manage courses, grade assignments, track attendance, and
            reach students.
          </p>
          <span
            className="inline-flex items-center gap-1.5
                           text-sm font-semibold
                           text-accent-foreground
                           group-hover:gap-3 transition-all"
          >
            Sign up as Teacher →
          </span>
        </button>
      </div>

      <p className="text-muted-foreground text-sm mt-10">
        Already have an account?{" "}
        <button
          onClick={() => navigate("/login")}
          className="text-primary hover:underline font-medium"
        >
          Log in
        </button>
      </p>
    </div>
  );
}
