import { PricingWithChart } from "@/components/ui/pricing-with-chart";

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Dot pattern background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.06)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-6 py-24">
        {/* Heading */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-muted-foreground">
            Start free. Scale as you grow.
          </p>
        </div>

        <PricingWithChart />
      </div>
    </div>
  );
}
