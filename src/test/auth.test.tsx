import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import React from "react";

// ── Mock aws-amplify/auth so no real Cognito calls are made ───────────────────
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

// ── Mock aws-amplify config ───────────────────────────────────────────────────
vi.mock("aws-amplify", () => ({
  Amplify: { configure: vi.fn() },
}));

// ── Mock AppContext so API calls don't fire ───────────────────────────────────
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

// ── Provide a minimal AuthContext ─────────────────────────────────────────────
vi.mock("@/store/AuthContext", () => ({
  useAuth: () => ({
    currentUser: null,
    isAuthenticated: false,
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

import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";

function wrap(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe("Auth page smoke tests", () => {
  it("Login page renders email and password fields", () => {
    wrap(<Login />);
    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });

  it("Register page renders name, email and password fields", () => {
    wrap(<Register />);
    expect(screen.getByPlaceholderText(/tife abayomi/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create account/i }),
    ).toBeInTheDocument();
  });

  it("ForgotPassword page renders email field", () => {
    wrap(<ForgotPassword />);
    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send reset code/i }),
    ).toBeInTheDocument();
  });

  it("Login page renders Forgot password link", () => {
    wrap(<Login />);
    expect(
      screen.getByRole("link", { name: /forgot password/i }),
    ).toBeInTheDocument();
  });

  it("Login page renders magic link option", () => {
    wrap(<Login />);
    expect(
      screen.getByRole("button", { name: /continue with magic link/i }),
    ).toBeInTheDocument();
  });

  it("Login page renders link to create account", () => {
    wrap(<Login />);
    expect(
      screen.getByRole("link", { name: /create one/i }),
    ).toBeInTheDocument();
  });

  it("Register page renders link to sign in", () => {
    wrap(<Register />);
    expect(screen.getByRole("link", { name: /sign in/i })).toBeInTheDocument();
  });

  it("ForgotPassword page renders correct heading", () => {
    wrap(<ForgotPassword />);
    expect(
      screen.getByRole("heading", { name: /forgot password/i }),
    ).toBeInTheDocument();
  });
});
