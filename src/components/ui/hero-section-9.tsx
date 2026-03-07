import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ButtonCta } from "@/components/ui/button-shiny";
import { GradientButton } from "@/components/ui/gradient-button";

/* ─── Types ─────────────────────────────────────────────── */

interface Stat {
  icon: ReactNode;
  value: string;
  label: string;
}

interface HeroAction {
  label: string;
  onClick?: () => void;
}

interface HeroSection9Props {
  badge?: string;
  title: string;
  subtitle: string;
  actions: [HeroAction, HeroAction];
  stats: [Stat, Stat, Stat];
  images: [string, string, string];
  className?: string;
}

/* ─── Animation helpers ─────────────────────────────────── */

function fadeUpVariant(delay: number) {
  return {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay, ease: "easeOut" as const },
    },
  };
}

function fadeInVariant(delay: number) {
  return {
    hidden: { opacity: 0, scale: 0.94 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.7, delay, ease: "easeOut" as const },
    },
  };
}

/* ─── Component ─────────────────────────────────────────── */

export function HeroSection9({
  badge,
  title,
  subtitle,
  actions,
  stats,
  images,
  className,
}: HeroSection9Props) {
  const [primary, secondary] = actions;

  return (
    <section
      className={cn(
        "relative overflow-hidden bg-background min-h-screen flex items-center",
        className,
      )}
    >
      {/* ── Background shape blobs ────────────────────────── */}
      <div className="pointer-events-none absolute inset-0">
        {/* Blue blob — top-left */}
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[120px]"
          style={{ background: "hsl(var(--shape-blue) / 0.5)" }}
        />
        {/* Green blob — bottom-right */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute -bottom-20 -right-20 w-[500px] h-[500px] rounded-full blur-[100px]"
          style={{ background: "hsl(var(--shape-green) / 0.5)" }}
        />
        {/* Purple blob — center */}
        <motion.div
          animate={{ x: [0, 30, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full blur-[140px]"
          style={{ background: "hsl(var(--shape-purple) / 0.3)" }}
        />
      </div>

      {/* ── Subtle grid texture ────────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── Main content ──────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* ── LEFT: Text column ───────────────────────────── */}
          <div className="flex flex-col gap-8">
            {/* Badge */}
            {badge && (
              <motion.div
                variants={fadeUpVariant(0)}
                initial="hidden"
                animate="visible"
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  {badge}
                </span>
              </motion.div>
            )}

            {/* Title */}
            <motion.h1
              variants={fadeUpVariant(0.1)}
              initial="hidden"
              animate="visible"
              className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.1] tracking-tight text-foreground"
            >
              {title}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeUpVariant(0.2)}
              initial="hidden"
              animate="visible"
              className="text-muted-foreground text-lg leading-relaxed max-w-lg"
            >
              {subtitle}
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              variants={fadeUpVariant(0.3)}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-3"
            >
              {/* Primary — shiny CTA */}
              <ButtonCta label={primary.label} onClick={primary.onClick} />
              {/* Outline — variant gradient */}
              <GradientButton variant="variant" onClick={secondary.onClick}>
                {secondary.label}
              </GradientButton>
            </motion.div>

            {/* Stats row */}
            <motion.div
              variants={fadeUpVariant(0.4)}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-6 pt-2 border-t border-border"
            >
              {stats.map((stat, i) => (
                <div key={i} className="flex items-center gap-2.5 pt-5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-card border border-border text-foreground">
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground leading-none">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT: Floating images column ──────────────── */}
          <div className="relative hidden lg:flex items-center justify-center h-[540px]">
            {/* Decorative rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[420px] h-[420px] rounded-full border border-border/40" />
              <div className="absolute w-[300px] h-[300px] rounded-full border border-border/30" />
            </div>

            {/* Shape-purple glow behind images */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-60"
              style={{ background: "hsl(var(--shape-purple) / 0.5)" }}
            />

            {/* Image 1 — top-left */}
            <motion.div
              variants={fadeInVariant(0.2)}
              initial="hidden"
              animate="visible"
              className="absolute top-4 left-0 w-52 h-36 rounded-2xl overflow-hidden border border-border shadow-xl"
              style={{ rotate: "-4deg" }}
            >
              <FloatingImage
                src={images[0]}
                alt="Learning community"
                yAmt={-10}
                duration={5.5}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            </motion.div>

            {/* Image 2 — top-right (focal) */}
            <motion.div
              variants={fadeInVariant(0.35)}
              initial="hidden"
              animate="visible"
              className="absolute top-0 right-4 w-60 h-44 rounded-2xl overflow-hidden border border-border shadow-xl"
              style={{ rotate: "3deg" }}
            >
              <FloatingImage
                src={images[1]}
                alt="Students collaborating"
                yAmt={-12}
                duration={6}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/50" />
            </motion.div>

            {/* Image 3 — bottom-center */}
            <motion.div
              variants={fadeInVariant(0.5)}
              initial="hidden"
              animate="visible"
              className="absolute bottom-4 left-1/2 -translate-x-1/2 w-56 h-40 rounded-2xl overflow-hidden border border-border shadow-xl"
              style={{ rotate: "-2deg" }}
            >
              <FloatingImage
                src={images[2]}
                alt="Focused student"
                yAmt={10}
                duration={7}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
            </motion.div>

            {/* Floating badge — Rating */}
            <motion.div
              variants={fadeInVariant(0.6)}
              initial="hidden"
              animate="visible"
              className="absolute top-24 right-0 flex items-center gap-2 rounded-xl bg-card/90 backdrop-blur-sm border border-border px-3 py-2 shadow-sm"
            >
              <span className="text-yellow-500">★</span>
              <div>
                <p className="text-xs font-bold text-foreground leading-none">
                  4.9 Rating
                </p>
                <p className="text-[10px] text-muted-foreground">
                  From 2K+ reviews
                </p>
              </div>
            </motion.div>

            {/* Floating badge — Live indicator */}
            <motion.div
              variants={fadeInVariant(0.7)}
              initial="hidden"
              animate="visible"
              className="absolute bottom-24 left-2 flex items-center gap-2 rounded-xl bg-card/90 backdrop-blur-sm border border-border px-3 py-2 shadow-sm"
            >
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <p className="text-xs font-semibold text-foreground">
                New courses weekly
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── FloatingImage helper ───────────────────────────────── */

function FloatingImage({
  src,
  alt,
  yAmt,
  duration,
}: {
  src: string;
  alt: string;
  yAmt: number;
  duration: number;
}) {
  return (
    <motion.img
      src={src}
      alt={alt}
      animate={{ y: [0, yAmt, 0] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
      className="w-full h-full object-cover"
    />
  );
}
