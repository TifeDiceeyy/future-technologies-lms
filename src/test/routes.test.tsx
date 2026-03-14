import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import React from "react";

// ── Shared mocks ──────────────────────────────────────────────────────────────
vi.mock("aws-amplify/auth", () => ({
  signIn: vi.fn(),
  signUp: vi.fn(),
  signOut: vi.fn(),
  confirmSignIn: vi.fn(),
  confirmSignUp: vi.fn(),
  getCurrentUser: vi.fn().mockRejectedValue(new Error("No session")),
  fetchUserAttributes: vi.fn().mockRejectedValue(new Error("No session")),
  resendSignUpCode: vi.fn(),
  updateUserAttributes: vi.fn(),
  resetPassword: vi.fn(),
  confirmResetPassword: vi.fn(),
  signInWithRedirect: vi.fn(),
}));

vi.mock("aws-amplify", () => ({
  Amplify: { configure: vi.fn() },
}));

vi.mock("@/store/AppContext", () => ({
  useApp: () => ({
    courses: [],
    students: [],
    assignments: [],
    exams: [],
    attendance: [],
    announcements: [],
    coursesLoading: false,
    dataLoading: false,
    coursesError: null,
    addCourse: vi.fn(),
    updateCourse: vi.fn(),
    deleteCourse: vi.fn(),
    addAssignment: vi.fn(),
    deleteAssignment: vi.fn(),
    addExam: vi.fn(),
    deleteExam: vi.fn(),
    addAnnouncement: vi.fn(),
    deleteAnnouncement: vi.fn(),
    updateStudent: vi.fn(),
    refreshAll: vi.fn(),
  }),
  AppProvider: ({ children }: { children: React.ReactNode }) =>
    React.createElement(React.Fragment, null, children),
}));

vi.mock("@/store/AuthContext", () => ({
  useAuth: () => ({
    currentUser: { name: "Tife", email: "tife@test.com", role: "student" },
    isAuthenticated: true,
    isAdmin: false,
    isLoading: false,
    signIn: vi.fn(),
    signUp: vi.fn(),
    confirmSignUp: vi.fn(),
    resendCode: vi.fn(),
    signOut: vi.fn(),
    refreshUser: vi.fn(),
    signInWithGoogle: vi.fn(),
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) =>
    React.createElement(React.Fragment, null, children),
}));

// ─────────────────────────────────────────────────────────────────────────────

import Home from "@/pages/Home";
import Homework from "@/pages/Homework";
import Notifications from "@/pages/Notifications";
import Login from "@/pages/Login";
import Register from "@/pages/Register";

function wrap(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe("Page route smoke tests", () => {
  it("/home — renders 'One Place' heading", () => {
    wrap(<Home />);
    expect(screen.getByText(/one place/i)).toBeInTheDocument();
  });

  it("/homework — renders Homework heading", () => {
    wrap(<Homework />);
    expect(
      screen.getByRole("heading", { name: /homework/i }),
    ).toBeInTheDocument();
  });

  it("/notifications — renders Notifications heading", () => {
    wrap(<Notifications />);
    expect(
      screen.getByRole("heading", { name: /notifications/i }),
    ).toBeInTheDocument();
  });

  it("/login — renders Log in heading", () => {
    wrap(<Login />);
    expect(
      screen.getByRole("heading", { name: /log in/i }),
    ).toBeInTheDocument();
  });

  it("/register — renders Create account heading", () => {
    wrap(<Register />);
    expect(
      screen.getByRole("heading", { name: /create account/i }),
    ).toBeInTheDocument();
  });
});
