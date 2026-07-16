import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { BookOpen, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { runResearch } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { OutputPanel } from "@/components/output-panel";
import { AiNotice } from "@/components/ai-notice";

export const Route = createFileRoute("/research")({
  head: () => ({ meta: [{ title: "AI Research Assistant — Workplace AI" }] }),
  component: ResearchPage,
});

function ResearchPage() {
  const run = useServerFn(runResearch);
  const [topic, setTopic] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!topic.trim()) {
      toast.error("Enter a topic or paste text to analyze");
      return;
    }
    setLoading(true);
    try {
      const res = await run({ data: { topic } });
      setOutput(res.text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to analyze");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <BookOpen className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">AI Research Assistant</h1>
          <p className="text-sm text-muted-foreground">Summaries, insights, and action points from any topic or text.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Topic or article</CardTitle>
          <CardDescription>Paste an article, or describe the topic you want analyzed.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="topic">Input</Label>
            <Textarea id="topic" rows={10} placeholder="Paste content or type a topic..." value={topic} onChange={(e) => setTopic(e.target.value)} />
          </div>
          <Button onClick={submit} disabled={loading}>
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing…</> : "Analyze"}
          </Button>
        </CardContent>
      </Card>

      {output && (
        <div className="mt-8">
          <h2 className="mb-3 text-lg font-semibold">Analysis</h2>
          <OutputPanel value={output} onChange={setOutput} onRegenerate={submit} onClear={() => setOutput("")} isLoading={loading} />
        </div>
      )}

      <AiNotice />
    </div>
  );
}