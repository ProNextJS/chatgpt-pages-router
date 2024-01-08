import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import Link from "next/link";

import UserButton from "@/pages/components/UserButton";

import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <div className="text-white font-bold bg-green-900 text-2xl p-2 mb-3 rounded-b-lg shadow-gray-700 shadow-lg flex">
        <div className="flex flex-grow">
          <Link href="/">GPT Chat</Link>
          <Link href="/about" className="ml-5 font-light">
            About
          </Link>
        </div>
        <div>
          <UserButton />
        </div>
      </div>
      <div className="flex flex-col md:flex-row">
        <main className="flex-grow">
          <Component {...pageProps} />
        </main>
      </div>
    </SessionProvider>
  );
}
