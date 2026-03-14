import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/store/AuthContext";
import {
  Zap,
  Users,
  BookOpen,
  Star,
  Cpu,
  Shield,
  Globe,
  Menu,
  X,
} from "lucide-react";
import { ButtonCta } from "@/components/ui/button-shiny";
import { DottedSurface } from "@/components/ui/dotted-surface";
import { HeroSection9 } from "@/components/ui/hero-section-9";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import ThreeDPhotoCarousel from "@/components/ui/3d-carousel";

const features = [
  {
    icon: Cpu,
    title: "AI-Powered Learning",
    desc: "Adaptive courses that adjust to your pace and learning style in real time.",
  },
  {
    icon: Shield,
    title: "AWS-Certified Curriculum",
    desc: "Content aligned with industry certifications and real cloud deployments.",
  },
  {
    icon: Globe,
    title: "Learn Anywhere",
    desc: "Access courses, track progress, and submit assignments from any device.",
  },
];

const HERO_IMAGES: [string, string, string] = [
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1529390079861-591de354faf5?q=80&w=2070&auto=format&fit=crop",
];

const navLinks = [
  { to: "/home", label: "Home" },
  { to: "/public-courses", label: "Courses" },
  { to: "/pricing", label: "Pricing" },
  { to: "/login", label: "Log In" },
];

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, isLoading } = useAuth();
  // Bug 8 fix: hamburger menu state for mobile
  const [menuOpen, setMenuOpen] = useState(false);

  // Redirect authenticated users — wait for auth to fully resolve first
  useEffect(() => {
    if (!isLoading && isAuthenticated && currentUser) {
      if (currentUser.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }
    }
  }, [isLoading, isAuthenticated, currentUser, navigate]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
      <DottedSurface />

      {/* Nav */}
      <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-5 md:px-8 py-5">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent-foreground flex items-center justify-center shadow-sm">
            <Zap size={18} className="text-white" fill="white" />
          </div>
          <span className="font-bold text-foreground text-base md:text-lg leading-tight">
            Future Technologies
          </span>
        </div>

        {/* Desktop links — Bug 8 fix: was always visible, now hidden md:flex */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              {label}
            </Link>
          ))}
          <ThemeToggle />
          <Link
            to="/get-started"
            className="bg-primary hover:bg-primary/80 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile right: theme toggle + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg text-foreground hover:bg-secondary transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="absolute top-[72px] left-0 right-0 z-40 md:hidden bg-card border-b border-border px-5 py-4 flex flex-col gap-3">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className="text-foreground text-sm py-2 border-b border-border/50 hover:text-primary transition-colors"
            >
              {label}
            </Link>
          ))}
          <Link
            to="/get-started"
            onClick={() => setMenuOpen(false)}
            className="mt-1 bg-primary text-white text-sm font-medium px-4 py-2.5 rounded-lg text-center transition-colors"
          >
            Get Started
          </Link>
        </div>
      )}

      {/* Hero */}
      <HeroSection9
        badge={
          import.meta.env.DEV
            ? "Now live — Phase 1 on AWS S3 + CloudFront"
            : undefined
        }
        title="A new way to learn & get knowledge at Future Technologies"
        subtitle="MindCampus is here for you with various courses & materials from skilled tutors all around the world."
        actions={[
          {
            label: "Start Learning Free",
            onClick: () => navigate("/get-started"),
          },
          {
            label: "Browse Courses",
            onClick: () => navigate("/public-courses"),
          },
        ]}
        stats={[
          {
            icon: <Users size={16} />,
            value: "15.2K",
            label: "Active students",
          },
          { icon: <BookOpen size={16} />, value: "500+", label: "Courses" },
          { icon: <Star size={16} />, value: "4.5K", label: "Tutors" },
        ]}
        images={HERO_IMAGES}
      />

      {/* Stats bar */}
      <section className="relative z-10 border-y border-border bg-card/50">
        <div className="max-w-5xl mx-auto px-5 md:px-8 py-8 md:py-10 grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-8">
          {[
            { value: "500+", label: "Courses" },
            { value: "15.2K+", label: "Students" },
            { value: "95%", label: "Completion Rate" },
            { value: "4.9★", label: "Rating" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                {value}
              </p>
              <p className="text-muted-foreground text-sm">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Integrations */}
      {/* TODO: Add real integration logos — hiding until ready */}
      {/* <IntegrationHero /> */}

      {/* 3D Carousel */}
      <section className="relative z-10 px-5 md:px-8 py-12 md:py-16 max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Explore Our Learning Environment
        </h2>
        <p className="text-muted-foreground text-base md:text-lg mb-8 md:mb-10">
          Drag to explore — interactive previews of our platform
        </p>
        <ThreeDPhotoCarousel />
      </section>

      {/* Features */}
      <section className="relative z-10 px-5 md:px-8 py-16 md:py-24 max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Built for the{" "}
            <span className="bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
              Future
            </span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
            Everything you need to master modern technology, delivered through a
            world-class learning experience.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-card border border-border rounded-2xl p-6 hover:border-primary/40 transition-all hover:shadow-sm group"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary border border-border flex items-center justify-center mb-4 group-hover:border-primary/40 transition-colors">
                <Icon size={22} className="text-primary" />
              </div>
              <h3 className="text-foreground font-semibold text-lg mb-2">
                {title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative z-10 px-5 md:px-8 py-12 md:py-16">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-primary/20 to-accent-foreground/10 border border-primary/30 rounded-2xl px-8 md:px-12 py-10 md:py-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to start your journey?
          </h2>
          <p className="text-muted-foreground mb-8 text-base md:text-lg">
            Join thousands of students already learning on Future Technologies.
          </p>
          <ButtonCta
            label="Join Free Today"
            onClick={() => navigate("/get-started")}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border px-5 md:px-8 py-8 text-center text-muted-foreground text-sm">
        <p>
          © 2026 Future Technologies · Built by Tife Abayomi · Deployed on AWS
        </p>
      </footer>
    </div>
  );
}
