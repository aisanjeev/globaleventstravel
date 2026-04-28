import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { FirebaseAuthProvider } from "@/components/providers/FirebaseAuthProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const isIndexable = process.env.NEXT_PUBLIC_ROBOTS === 'index,follow';

export const metadata: Metadata = {
  title: "Global Events Travels - Admin",
  description: "Admin dashboard for Global Events Travels",
  robots: {
    index: isIndexable,
    follow: isIndexable,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FirebaseAuthProvider>{children}</FirebaseAuthProvider>
      </body>
    </html>
  );
}
