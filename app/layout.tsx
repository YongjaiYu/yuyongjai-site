import type { Metadata } from "next";
import { JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Yongjai Yu — Political Scientist",
  description:
    "Academic portfolio of Yongjai Yu, Ph.D. Student in Political Science at the University of California, Riverside. Research on the presidency, executive power, and computational political science.",
  keywords: [
    "Yongjai Yu",
    "Political Science",
    "UC Riverside",
    "Presidential Power",
    "Unilateral Actions",
    "Computational Political Science",
    "LLMs",
    "Bayesian Statistics",
  ],
  authors: [{ name: "Yongjai Yu" }],
  openGraph: {
    title: "Yongjai Yu — Political Scientist",
    description:
      "Ph.D. Student in Political Science researching presidential unilateral actions and computational methods.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jetbrains.variable} ${inter.variable}`}>
      <body className="min-h-screen font-mono antialiased">{children}</body>
    </html>
  );
}
