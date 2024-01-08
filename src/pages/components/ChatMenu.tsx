import Link from "next/link";

import { Separator } from "@/components/ui/separator";

import { getChats } from "@/db";

export default function Chats({
  chats,
}: {
  chats: Awaited<ReturnType<typeof getChats>>;
}) {
  return (
    <div>
      <div className="text-2xl font-bold">Chat Sessions</div>
      <Separator className="my-3" />
      <div className="flex flex-col gap-2">
        {chats.map((chat) => (
          <div key={chat.id}>
            <Link href={`/chats/${chat.id}`} className="text-lg line-clamp-1">
              {chat.name.toString()}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
