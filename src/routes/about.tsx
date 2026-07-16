import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, ShieldCheck, Zap, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Workplace AI Productivity Assistant" },
      { name: "description", content: "About the AI Workplace Productivity Assistant — a session-only AI toolkit for professionals." },
    ],
  }),
  component: AboutPage,
});

const features = [
  { icon: Sparkles, title: "AI-powered tools", desc: "Email drafting, research summaries, and a workplace chatbot in one place." },
  { icon: EyeOff, title: "No accounts, no tracking", desc: "There's no sign-up, no database, and no stored history." },
  { icon: ShieldCheck, title: "Session-only data", desc: "Everything you enter and generate is cleared on refresh." },
  { icon: Zap, title: "Fast and responsive", desc: "Works smoothly on desktop, tablet, and mobile." },
];

function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">About Workplace AI</h1>
      <p className="mt-3 text-muted-foreground">
        Workplace AI is a lightweight productivity assistant designed to help professionals automate everyday writing, research, and thinking tasks — without the friction of accounts or the risk of stored data.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {features.map((f) => (
          <Card key={f.title}>
            <CardHeader>
              <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <f.icon className="h-4 w-4" />
              </div>
              <CardTitle className="text-base">{f.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{f.desc}</CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10 rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Responsible AI Notice</p>
        <p className="mt-1">
          AI-generated content may contain inaccuracies. Always review and verify information before using it for professional, academic, or legal purposes.
        </p>
      </div>
    </div>
  );
}