import type { Metadata } from "next";
import SessionProvider from "./components/SessionProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "AGTIMES",
  description: "Watch and discover movies and series.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}