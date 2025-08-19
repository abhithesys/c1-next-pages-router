import OpenAI from "openai";
import { transformStream } from "@crayonai/stream";
import { getMessageStore, DBMessage } from "./messageStore";
import { NextApiRequest, NextApiResponse } from "next";

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { prompt, threadId, responseId } = req.body as {
    prompt: DBMessage;
    threadId: string;
    responseId: string;
  };
  const client = new OpenAI({
    baseURL: "https://api.thesys.dev/v1/embed/",
    apiKey: process.env.THESYS_API_KEY,
  });
  const messageStore = getMessageStore(threadId);

  messageStore.addMessage(prompt);

  const llmStream = await client.chat.completions.create({
    model: "c1-nightly",
    messages: messageStore.getOpenAICompatibleMessageList(),
    stream: true,
  });

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");

  transformStream(
    llmStream,
    (chunk) => {
      const content = chunk.choices?.[0]?.delta?.content ?? "";
      if (content) {
        res.write(content);
      }
    },
    {
      onEnd: ({ accumulated }) => {
        res.end();
        const message = accumulated.filter((message) => message).join("");
        messageStore.addMessage({
          role: "assistant",
          content: message,
          id: responseId,
        });
      },
    }
  );
}
