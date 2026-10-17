import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TimedQ - Controlled Questionnaires",
  description: "Run timed questionnaires with admin-controlled progression",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
