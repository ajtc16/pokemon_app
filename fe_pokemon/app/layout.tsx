import type { Metadata } from "next";
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryProvider } from "@/contexts/QueryProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Pokédex | Pokemon App",
    template: "%s | Pokemon App",
  },
  description: "Explore the world of Pokemon with our interactive Pokedex",
  keywords: ["Pokemon", "Pokedex", "Pocket Monsters"],
  authors: [{ name: "Pokemon App" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  themeColor: "#DC0A2D",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-poppins antialiased">
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
