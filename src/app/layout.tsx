import "./globals.css"
import type { Metadata } from "next"
import { Nunito } from "next/font/google"
import { PT_Sans } from "next/font/google"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/providers/ThemeProvider"
import { QueryProvider } from "@/providers/QueryProvider"
import { NuqsAdapter } from 'nuqs/adapters/next/app'

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const ptSans = PT_Sans({
  variable: "--font-pt-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Prognos: trend-driven content for creators",
  description: "Find what's trending in your niche and turn it into scripts, posts and carousels with AI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "bg-background min-h-screen font-sans antialiased", 
        `${nunito.variable} ${ptSans.variable}`
      )}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          <QueryProvider>
            <NuqsAdapter>
              {children}
            </NuqsAdapter>
            <Toaster />
          </QueryProvider>
          </ThemeProvider>
      </body>
    </html>
  );
}