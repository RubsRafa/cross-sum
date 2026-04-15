import type { Metadata } from "next";
import { Comfortaa } from "next/font/google";
import "./reset.css";
import "./globals.css";

const _comfortaa = Comfortaa({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cross-Sum - Puzzle Matemático",
  description:
    "Resolva puzzles matemáticos preenchendo uma grade 3x3 com números de 1 a 9",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
