import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const MODEL = "google/gemini-3-flash-preview";

function getGateway() {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  return createLovableAiGatewayProvider(key);
}

const EmailInput = z.object({
  purpose: z.string().min(1),
  recipient: z.string().min(1),
  keyPoints: z.string().min(1),
  tone: z.enum(["Formal", "Friendly", "Persuasive"]),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => EmailInput.parse(d))
  .handler(async ({ data }) => {
    const gateway = getGateway();
    const { text } = await generateText({
      model: gateway(MODEL),
      system:
        "You are a professional email writing assistant. Always return a complete email with clearly labeled sections: Subject, Greeting, Body, Closing. Use markdown headings (## Subject, ## Greeting, ## Body, ## Closing) so each section is easy to read.",
      prompt: `Write a professional email.\n\nRecipient: ${data.recipient}\nPurpose: ${data.purpose}\nKey points: ${data.keyPoints}\nTone: ${data.tone}\n\nReturn the email with the four labeled sections.`,
    });
    return { text };
  });

const ResearchInput = z.object({ topic: z.string().min(1) });

export const runResearch = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => ResearchInput.parse(d))
  .handler(async ({ data }) => {
    const gateway = getGateway();
    const { text } = await generateText({
      model: gateway(MODEL),
      system:
        "You are an expert workplace research assistant. Analyze the input and respond in markdown with these exact headings in order: ## Executive Summary, ## Key Insights, ## Recommendations, ## Suggested Next Steps. Use concise bullet points where appropriate.",
      prompt: `Analyze the following topic or article text and produce the structured analysis:\n\n${data.topic}`,
    });
    return { text };
  });

const ChatInput = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      }),
    )
    .min(1),
});

export const chatReply = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => ChatInput.parse(d))
  .handler(async ({ data }) => {
    const gateway = getGateway();
    const { text } = await generateText({
      model: gateway(MODEL),
      system:
        "You are a professional workplace productivity assistant. Provide clear answers, practical advice, and a professional tone. Give step-by-step guidance when appropriate. Keep responses focused and useful. Format with markdown when helpful.",
      messages: data.messages,
    });
    return { text };
  });