import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { generateEmail } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OutputPanel } from "@/components/output-panel";
import { AiNotice } from "@/components/ai-notice";

export const Route = createFileRoute("/email")({
  head: () => ({ meta: [{ title: "Smart Email Generator — Workplace AI" }] }),
  component: EmailPage,
});

type Tone = "Formal" | "Friendly" | "Persuasive";

function EmailPage() {
  const gen = useServerFn(generateEmail);
  const [purpose, setPurpose] = useState("");
  const [recipient, setRecipient] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [tone, setTone] = useState<Tone>("Formal");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!purpose.trim() || !recipient.trim() || !keyPoints.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await gen({ data: { purpose, recipient, keyPoints, tone } });
      setOutput(res.text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to generate email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Mail className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Smart Email Generator</h1>
          <p className="text-sm text-muted-foreground">Craft polished, on-tone emails in seconds.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Email details</CardTitle>
          <CardDescription>Tell the AI what you want to say and how you want it to sound.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="recipient">Recipient</Label>
              <Input id="recipient" placeholder="e.g. Hiring Manager at Acme" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Formal">Formal</SelectItem>
                  <SelectItem value="Friendly">Friendly</SelectItem>
                  <SelectItem value="Persuasive">Persuasive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="purpose">Email purpose</Label>
            <Input id="purpose" placeholder="e.g. Follow up on our meeting last Tuesday" value={purpose} onChange={(e) => setPurpose(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="points">Key points</Label>
            <Textarea id="points" rows={5} placeholder="Bullet the main points you want to include..." value={keyPoints} onChange={(e) => setKeyPoints(e.target.value)} />
          </div>
          <Button onClick={submit} disabled={loading}>
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating…</> : "Generate email"}
          </Button>
        </CardContent>
      </Card>

      {output && (
        <div className="mt-8">
          <h2 className="mb-3 text-lg font-semibold">Generated email</h2>
          <OutputPanel value={output} onChange={setOutput} onRegenerate={submit} onClear={() => setOutput("")} isLoading={loading} />
        </div>
      )}

      <AiNotice />
    </div>
  );
}