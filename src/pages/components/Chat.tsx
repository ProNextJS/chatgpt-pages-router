"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Transcript from "./Transcript";

import { Message as DBMessage } from "@/db/schema";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Chat({
  id = null,
  messages: initialMessages = [],
}: {
  id?: number | null;
  messages?: Message[];
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [message, setMessage] = useState("");
  const chatId = useRef<number | null>(id);

  const router = useRouter();

  const onClick = async () => {
    setMessage("");
    const resp = await fetch("/api/completion", {
      method: "POST",
      body: JSON.stringify({
        id: chatId.current,
        messages: [
          ...messages,
          {
            role: "user",
            content: message,
          },
        ],
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const completions = await resp.json();
    // if (chatId.current === null) {
    //   router.push(`/chats/${completions.id}`);
    //   router.refresh();
    // }

    chatId.current = completions.id;
    setMessages(completions.messages);
  };

  return (
    <div className="flex flex-col">
      <Transcript messages={messages as DBMessage[]} />
      <div className="flex border-t-2 border-t-gray-500 pt-3 mt-3">
        <Input
          className="flex-grow text-xl"
          placeholder="Question"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              onClick();
            }
          }}
        />
        <Button onClick={onClick} className="ml-3 text-xl">
          Send
        </Button>
      </div>
    </div>
  );
}
