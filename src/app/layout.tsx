import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TerminalEmulatorWrapper from "@/components/wrapper/TerminalEmulatorWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Solvrays Greenscreen Legacy Simulation",
  description: "AS/400 style terminal application for policy administration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="https://res.cloudinary.com/dqql2wlbt/image/upload/v1741110204/solvrays-grayscale_kqvimw.svg" type="image/svg+xml" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TerminalEmulatorWrapper>
          {children}
        </TerminalEmulatorWrapper>
      </body>
    </html>
  );
}
