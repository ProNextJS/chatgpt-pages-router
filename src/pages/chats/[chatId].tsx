import type { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";

import Chat from "@/pages/components/Chat";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

import ChatMenu from "@/pages/components/ChatMenu";

import { getChat, getChats } from "@/db";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  const chatId = +((context.params?.chatId as string) ?? "");
  let chat: Awaited<ReturnType<typeof getChat>> | null = null;
  if (session?.user?.email && chatId) {
    chat = await getChat(chatId)!;
    chat!.timestamp = chat?.timestamp.toISOString() as unknown as Date;
  }

  const previousChats = session?.user?.email
    ? (await getChats(session?.user?.email)).map((chat) => ({
        ...chat,
        timestamp: chat.timestamp.toISOString(),
      }))
    : null;

  return {
    props: {
      chatId,
      chat,
      previousChats,
    },
  };
};

export default function Home({
  chatId,
  chat,
  previousChats,
}: {
  chatId: number;
  chat?: Awaited<ReturnType<typeof getChat>>;
  previousChats?: Awaited<ReturnType<typeof getChats>>;
}) {
  return (
    <div className="flex">
      <div className="pr-3">
        <ChatMenu chats={previousChats || []} />
      </div>
      <div className="pt-5 text-white flex-grow">
        <Chat id={+chatId} messages={chat?.messages || []} key={chatId} />
      </div>
    </div>
  );
}
