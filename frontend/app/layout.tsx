import { AuthProvider } from '@/contexts/AuthContext';
import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/language-provider";
import SocketClient from "../components/SocketClient"; 
import "leaflet/dist/leaflet.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Harmonia - Find Your Perfect Match",
  description: "A modern matchmaking platform for meaningful connections",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Harmonia - Find Your Perfect Match</title>
        <meta
          name="description"
          content="A modern matchmaking platform for meaningful connections"
        />
        <script
          src="https://accounts.google.com/gsi/client"
          async
          defer
        ></script>
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
          <LanguageProvider>{children}</LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
      <SocketClient />
    </html>
  );
}

import "./globals.css";
