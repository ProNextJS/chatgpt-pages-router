import type { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth";

import Chat from "@/pages/components/Chat";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

import PreviousChats from "@/pages/components/PreviousChats";

import { getChatsWithMessages } from "@/db";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  const previousChats = session?.user?.email
    ? (await getChatsWithMessages(session?.user?.email)).map((chat) => ({
        ...chat,
        timestamp: chat.timestamp.toISOString(),
      }))
    : null;
  return {
    props: {
      previousChats,
    },
  };
};

export default function Home({
  previousChats,
}: {
  previousChats?: Awaited<ReturnType<typeof getChatsWithMessages>>;
}) {
  const { data: session } = useSession();

  return (
    <div className="pt-5 text-white">
      {!session?.user?.email && <div>You need to log in to use this chat.</div>}
      {session?.user?.email && (
        <>
          {previousChats && <PreviousChats chats={previousChats} />}
          <h4 className="mt-5 text-2xl font-bold">New Chat Session</h4>
          <Chat />
        </>
      )}
    </div>
  );
}
