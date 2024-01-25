/* eslint-disable camelcase */
import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter, Archivo } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import "../styles/prism.css";

import { ThemeProvider } from "@/context/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

const spaceGrotesk = Archivo({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-archivo",
});

export const metadata: Metadata = {
  title: " DSS Community",
  description:
    "A community-driven platform for asking and answering programming questions. Get help, share knowledge, and collaborate with developers from around the world. Explore topics in web development, mobile app development, algorithms, data structures, and more.",
  icons: {
    icon: "/assets/images/site-logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ClerkProvider
        appearance={{
          elements: {
            formButtonPrimary: "primary-gradient",
            footerActionLink: "primary-text-gradient hover:text-primary-500",
          },
        }}
      >
        <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
          <ThemeProvider>{children}</ThemeProvider>
        </body>
      </ClerkProvider>
    </html>
  );
}
