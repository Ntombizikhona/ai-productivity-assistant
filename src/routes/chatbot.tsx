import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { MessageSquare, Send, Loader2, Trash2, User, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { chatReply } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AiNotice } from "@/components/ai-notice";

export const Route = createFileRoute("/chatbot")({
  head: () => ({ meta: [{ title: "AI Chatbot — Workplace AI" }] }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };

function ChatPage() {
  const send = useServerFn(chatReply);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const submit = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await send({ data: { messages: next } });
      setMessages([...next, { role: "assistant", content: res.text }]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to reply");
      setMessages(next);
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-3.5rem)] max-w-4xl flex-col px-6 py-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">AI Chatbot</h1>
            <p className="text-sm text-muted-foreground">Session-only workplace assistant.</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => setMessages([])} disabled={!messages.length}>
          <Trash2 className="mr-1.5 h-3.5 w-3.5" />
          Clear chat
        </Button>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto rounded-lg border border-border bg-card p-5">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center text-sm text-muted-foreground">
            <Bot className="mb-2 h-8 w-8 text-primary/60" />
            Ask about writing, meetings, project planning, or productivity tips.
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "assistant" && (
              <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Bot className="h-4 w-4" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-lg px-4 py-2.5 text-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
              {m.role === "assistant" ? (
                <div className="prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              ) : (
                <div className="whitespace-pre-wrap">{m.content}</div>
              )}
            </div>
            {m.role === "user" && (
              <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Bot className="h-4 w-4" />
            </div>
            <div className="rounded-lg bg-muted px-4 py-2.5 text-sm text-muted-foreground">
              <Loader2 className="inline h-3.5 w-3.5 animate-spin" /> Thinking…
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 flex gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          rows={2}
          placeholder="Ask anything about your work…"
          className="resize-none"
        />
        <Button onClick={submit} disabled={loading || !input.trim()} size="lg">
          <Send className="h-4 w-4" />
        </Button>
      </div>

      <AiNotice />
    </div>
  );
}