import { Link, useNavigate } from "react-router-dom";
import { Zap, Users, BookOpen, Star, Cpu, Shield, Globe } from "lucide-react";
import { ButtonCta } from "@/components/ui/button-shiny";
import { DottedSurface } from "@/components/ui/dotted-surface";
import { HeroSection9 } from "@/components/ui/hero-section-9";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import IntegrationHero from "@/components/ui/integration-hero";
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

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
      <DottedSurface />
      {/* ── Nav ───────────────────────────────────────────── */}
      <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent-foreground flex items-center justify-center shadow-sm">
            <Zap size={18} className="text-white" fill="white" />
          </div>
          <span className="font-bold text-foreground text-lg">
            Future Technologies
          </span>
        </div>
        <div className="flex items-center gap-6">
          <Link
            to="/home"
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            Home
          </Link>
          <Link
            to="/courses"
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            Courses
          </Link>
          <Link
            to="/pricing"
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            Pricing
          </Link>
          <Link
            to="/login"
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            Log In
          </Link>
          <ThemeToggle />
          <Link
            to="/signup"
            className="bg-primary hover:bg-primary/80 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────── */}
      <HeroSection9
        badge="Now live — Phase 1 on AWS S3 + CloudFront"
        title="A new way to learn & get knowledge at Future Technologies"
        subtitle="EduFlex is here for you with various courses & materials from skilled tutors all around the world."
        actions={[
          { label: "Start Learning Free", onClick: () => navigate("/signup") },
          { label: "Browse Courses", onClick: () => navigate("/courses") },
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

      {/* ── Stats bar ─────────────────────────────────────── */}
      <section className="relative z-10 border-y border-border bg-card/50">
        <div className="max-w-5xl mx-auto px-8 py-10 grid grid-cols-2 sm:grid-cols-4 gap-8">
          {[
            { value: "500+", label: "Courses" },
            { value: "15.2K+", label: "Students" },
            { value: "95%", label: "Completion Rate" },
            { value: "4.9★", label: "Rating" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-bold text-foreground mb-1">{value}</p>
              <p className="text-muted-foreground text-sm">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Integrations ──────────────────────────────────── */}
      <div className="relative z-10">
        <IntegrationHero />
      </div>

      {/* ── 3D Carousel ───────────────────────────────────── */}
      <section className="relative z-10 px-8 py-16 max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-foreground mb-4">
          Explore Our Learning Environment
        </h2>
        <p className="text-muted-foreground text-lg mb-10">
          Drag to explore — interactive previews of our platform
        </p>
        <ThreeDPhotoCarousel />
      </section>

      {/* ── Features ──────────────────────────────────────── */}
      <section className="relative z-10 px-8 py-24 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Built for the{" "}
            <span className="bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
              Future
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Everything you need to master modern technology, delivered through a
            world-class learning experience.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* ── CTA Banner ────────────────────────────────────── */}
      <section className="relative z-10 px-8 py-16">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-primary/20 to-accent-foreground/10 border border-primary/30 rounded-2xl px-12 py-12 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Ready to start your journey?
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Join thousands of students already learning on Future Technologies.
          </p>
          <ButtonCta
            label="Join Free Today"
            onClick={() => navigate("/signup")}
          />
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-border px-8 py-8 text-center text-muted-foreground text-sm">
        <p>
          © 2026 Future Technologies · Built by Tife Abayomi · Deployed on AWS
        </p>
      </footer>
    </div>
  );
}
