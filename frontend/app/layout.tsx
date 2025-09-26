// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import HomeLayout from "./homeLayout";
import { Inter } from "next/font/google";
import { ToastProvider, ToastStyles } from "./components/toaster";

export const metadata: Metadata = {
  title: "Operateev.ai",
  description: "",
};

const interFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={interFont.className}>
        <ToastProvider>
          <HomeLayout>{children}</HomeLayout>
          <ToastStyles />
        </ToastProvider>
      </body>
    </html>
  );
}
