import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages, userId } = await req.json();
  const result = streamText({
    model: openai("gpt-4o"),
    messages,
    system: `You are a helpful AI assistant for a workout tracking app. Your job is to interpret voice input about exercises and respond with confirmation of the logged exercise for user ${userId}. If the input is unclear, ask for clarification.`,
  });
  return result.toDataStreamResponse();
}
