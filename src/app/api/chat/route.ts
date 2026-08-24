import { groqProvider } from "@/lib/ai/providers/groq";
import { ApiResponse } from "@/lib/api-response";

export const maxDuration = 30;

export async function POST(req: Request) {
  // Guard: if no AI provider is configured, return a clean error
  if (!groqProvider.isAvailable) {
    return ApiResponse.error(
      "AI_PROVIDER_UNAVAILABLE",
      "AI features are not configured. Please add GROQ_API_KEY to your environment variables.",
      503
    );
  }

  const body = await req.json();
  // In AI SDK v7, the client sends { messages: UIMessage[] }
  const messages = body.messages ?? [];

  // Map UIMessage parts to the simple { role, content } format our provider uses
  const mapped = messages
    .filter((m: { role: string }) => m.role === "user" || m.role === "assistant")
    .map((m: { role: string; parts?: Array<{ type: string; text?: string }> }) => ({
      role: m.role as "user" | "assistant",
      content: (m.parts ?? [])
        .filter((p) => p.type === "text")
        .map((p) => p.text ?? "")
        .join(""),
    }));

  return groqProvider.streamText({ messages: mapped });
}
