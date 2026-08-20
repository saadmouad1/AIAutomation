import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "sonner";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Flowra — Make work flow.",
    template: "%s — Flowra",
  },
  description:
    "Flowra connects your business tools, understands your workflows, and turns repetitive work into automation — without the complexity.",
  metadataBase: new URL("https://flowra.app"),
  openGraph: {
    title: "Flowra — Make work flow.",
    description: "Business automation for modern teams.",
    siteName: "Flowra",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} font-sans antialiased`}>
        <ThemeProvider>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "var(--surface-elevated)",
                border: "1px solid var(--border-strong)",
                color: "var(--foreground)",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
