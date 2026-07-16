import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, BookOpen, MessageSquare, ArrowRight, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

const tools = [
  {
    title: "Smart Email Generator",
    desc: "Draft polished, on-tone emails in seconds — subject, greeting, body, and close.",
    to: "/email",
    icon: Mail,
  },
  {
    title: "AI Research Assistant",
    desc: "Summarize topics or articles into insights, recommendations, and next steps.",
    to: "/research",
    icon: BookOpen,
  },
  {
    title: "AI Chatbot",
    desc: "Ask anything about writing, meetings, planning, or productivity workflows.",
    to: "/chatbot",
    icon: MessageSquare,
  },
] as const;

function Dashboard() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center gap-2 text-sm text-primary">
        <Sparkles className="h-4 w-4" />
        <span className="font-medium">Session-only • No sign-in required</span>
      </div>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">Your AI workplace toolkit</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Automate routine writing, research, and thinking work. Everything stays in your browser session and disappears on refresh.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => (
          <Link key={t.to} to={t.to} className="group">
            <Card className="h-full transition hover:border-primary/40 hover:shadow-lg">
              <CardHeader>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <t.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">{t.title}</CardTitle>
                <CardDescription>{t.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm font-medium text-primary">
                  Open tool
                  <ArrowRight className="ml-1.5 h-4 w-4 transition group-hover:translate-x-0.5" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">How it works</h2>
        <ol className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li><span className="font-medium text-foreground">1.</span> Pick a tool from the sidebar.</li>
          <li><span className="font-medium text-foreground">2.</span> Enter your input and generate results with AI.</li>
          <li><span className="font-medium text-foreground">3.</span> Edit, copy, regenerate, or clear anytime.</li>
          <li><span className="font-medium text-foreground">4.</span> Refresh to wipe the session — nothing is stored.</li>
        </ol>
      </div>
    </div>
  );
}
