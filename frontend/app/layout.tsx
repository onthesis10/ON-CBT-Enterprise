import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"; // <-- Import Provider

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ON-CBT | Ujian Online Sekolah",
  description: "Platform Ujian Sekolah Modern dengan AI & Anti-Cheat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className}>
        {/* Bungkus Aplikasi dengan ThemeProvider */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}