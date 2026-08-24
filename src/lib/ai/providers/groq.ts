import { createGroq } from "@ai-sdk/groq";
import { streamText, generateText, createUIMessageStreamResponse } from "ai";
import type { AIProvider, StreamTextOptions } from "../provider";

const FLOWRA_SYSTEM_PROMPT =
  "You are Flowra AI, an expert automation workflow assistant. Help the user build, debug, and configure automations. Be concise and professional.";

/**
 * Groq implementation of the AIProvider abstraction.
 * This is the ONLY file in the application that imports from @ai-sdk/groq.
 * If GROQ_API_KEY is not set, `isAvailable` is false and the rest of the
 * application must handle this gracefully.
 */
export class GroqProvider implements AIProvider {
  readonly name = "groq";
  readonly isAvailable: boolean;

  private client: ReturnType<typeof createGroq> | null = null;

  constructor() {
    const apiKey = process.env.GROQ_API_KEY;
    if (apiKey && apiKey.trim() !== "") {
      this.client = createGroq({ apiKey });
      this.isAvailable = true;
    } else {
      this.isAvailable = false;
    }
  }

  async streamText({ messages, systemPrompt }: StreamTextOptions): Promise<Response> {
    if (!this.client) {
      throw new Error("AI_PROVIDER_UNAVAILABLE");
    }

    const result = streamText({
      model: this.client("llama3-8b-8192"),
      messages: [
        { role: "system", content: systemPrompt ?? FLOWRA_SYSTEM_PROMPT },
        ...messages,
      ],
    });

    // createUIMessageStreamResponse is compatible with DefaultChatTransport on the client
    return createUIMessageStreamResponse({
      stream: result.toUIMessageStream(),
    });
  }

  async generateText({ messages, systemPrompt }: StreamTextOptions): Promise<string> {
    if (!this.client) {
      throw new Error("AI_PROVIDER_UNAVAILABLE");
    }

    const result = await generateText({
      model: this.client("llama3-8b-8192"),
      messages: [
        { role: "system", content: systemPrompt ?? FLOWRA_SYSTEM_PROMPT },
        ...messages,
      ],
    });

    return result.text;
  }
}

// Singleton instance — server-side only
export const groqProvider = new GroqProvider();
