import "@/styles/globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Retro TV India",
  description: "Watch Indian shows from the 2000s",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen flex flex-col items-center p-8 bg-black font-digital7">
          <h1 className="text-4xl font-bold mb-6 text-white">Retro TV India</h1>
          {children}
        </main>
      </body>
    </html>
  );
}
