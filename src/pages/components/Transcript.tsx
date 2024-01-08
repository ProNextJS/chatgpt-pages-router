import { Message } from "@/db/schema";

export default function Transcript({ messages }: { messages: Message[] }) {
  return (
    <>
      {messages.map((message, index) => (
        <div
          key={message.id}
          className={`flex flex-col ${
            message.role === "user" ? "items-end" : "items-start"
          }`}
        >
          <div
            className={`${
              message.role === "user" ? "bg-blue-500" : "bg-gray-500 text-black"
            } rounded-md py-2 px-8 ${index > 0 ? "mt-2" : ""}`}
          >
            {message.content}
          </div>
        </div>
      ))}
    </>
  );
}
