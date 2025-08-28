// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import HomeLayout from "./components/homeLayout";

export const metadata: Metadata = {
  title: "Operateev.ai",
  description: "",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <HomeLayout>{children}</HomeLayout>
      </body>
    </html>
  );
}
