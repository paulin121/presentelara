
import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond, Dancing_Script } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import GlobalClientEffects from "@/components/GlobalClientEffects";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
});

const dancing = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Happy Birthday — A Cinematic Experience",
  description: "An immersive birthday celebration in the style of Makoto Shinkai",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${cormorant.variable} ${dancing.variable} antialiased overflow-hidden`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
         
          enableSystem
          disableTransitionOnChange
        >
          <GlobalClientEffects />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
