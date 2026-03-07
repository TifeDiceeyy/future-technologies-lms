import { CheckCircle } from "lucide-react";
import { ButtonCta } from "@/components/ui/button-shiny";
import { GradientButton } from "@/components/ui/gradient-button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";

/* ─── Data ─────────────────────────────────────────────────── */

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started with the basics",
    featured: false,
    features: [
      "5 courses",
      "Basic progress tracking",
      "Community access",
      "Mobile app",
    ],
  },
  {
    name: "Pro",
    price: "$29",
    period: "per month",
    description: "For serious learners",
    featured: true,
    features: [
      "Unlimited courses",
      "Advanced analytics",
      "Priority support",
      "Certificates",
      "Live sessions",
      "Offline downloads",
    ],
  },
  {
    name: "Teams",
    price: "$79",
    period: "per month",
    description: "For organisations & cohorts",
    featured: false,
    features: [
      "Everything in Pro",
      "Up to 25 seats",
      "Admin dashboard",
      "Custom branding",
      "SSO / SAML",
      "Dedicated CSM",
    ],
  },
];

const chartData = [
  { month: "Jan", free: 3, pro: 18, teams: 42 },
  { month: "Feb", free: 4, pro: 22, teams: 50 },
  { month: "Mar", free: 3, pro: 27, teams: 61 },
  { month: "Apr", free: 5, pro: 31, teams: 68 },
  { month: "May", free: 4, pro: 38, teams: 75 },
  { month: "Jun", free: 5, pro: 44, teams: 88 },
];

const chartConfig: ChartConfig = {
  free: { label: "Free", color: "hsl(var(--muted-foreground))" },
  pro: { label: "Pro", color: "var(--chart-4)" },
  teams: { label: "Teams", color: "hsl(var(--accent-foreground))" },
};

/* ─── Component ────────────────────────────────────────────── */

export function PricingWithChart() {
  return (
    <div className="w-full space-y-16">
      {/* Pricing cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {PLANS.map((plan) => (
          <Card
            key={plan.name}
            className={
              plan.featured
                ? "relative border-primary/60 shadow-lg ring-1 ring-primary/20"
                : ""
            }
          >
            {plan.featured && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
            )}

            <CardHeader className="pb-4">
              <CardTitle className="text-lg">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-3 flex items-end gap-1">
                <span className="text-4xl font-bold text-foreground">
                  {plan.price}
                </span>
                <span className="text-muted-foreground text-sm mb-1">
                  /{plan.period}
                </span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {plan.featured ? (
                <ButtonCta label="Get Started — Pro" className="w-full" />
              ) : plan.name === "Free" ? (
                <GradientButton className="w-full">
                  Get Started Free
                </GradientButton>
              ) : (
                <button className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all border border-border hover:border-primary/40 hover:bg-secondary text-foreground">
                  {`Choose ${plan.name}`}
                </button>
              )}

              <ul className="space-y-2.5 pt-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <CheckCircle
                      size={15}
                      className={
                        plan.featured ? "text-primary" : "text-muted-foreground"
                      }
                    />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Courses completed per month</CardTitle>
          <CardDescription>
            Average courses completed by users on each plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-72 w-full">
            <BarChart data={chartData} barCategoryGap="30%">
              <CartesianGrid
                vertical={false}
                stroke="hsl(var(--border))"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend content={<ChartLegendContent />} />
              <Bar
                dataKey="free"
                fill={chartConfig.free.color}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="pro"
                fill={chartConfig.pro.color}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="teams"
                fill={chartConfig.teams.color}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
