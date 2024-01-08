import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import OpenAI from "openai";

import { createChat, updateChat } from "@/db";
import { authOptions } from "./auth/[...nextauth]";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

type ResponseData = {
  id: number | null;
  messages: {
    role: "user" | "assistant";
    content: string;
  }[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const session = await getServerSession(req, res, authOptions);

  const { id, messages: messageHistory } = req.body;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: messageHistory,
  });
  const messages = [
    ...messageHistory,
    response.choices[0].message as unknown as {
      role: "user" | "assistant";
      content: string;
    },
  ];

  let chatId = id;
  if (!chatId) {
    chatId = await createChat(
      session?.user?.email!,
      messageHistory[0].content,
      messages
    );
  } else {
    await updateChat(chatId, messages);
  }

  res.status(200).json({
    id: chatId,
    messages,
  });
}
