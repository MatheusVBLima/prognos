import "./globals.css"
import type { Metadata } from "next"
import { Nunito } from "next/font/google"
import { PT_Sans } from "next/font/google"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/providers/ThemeProvider"

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
  title: "Prognos - Tendências em Tempo Real",
  description: "Descubra as tendências mais populares e monitore termos de pesquisa em tempo real",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" >
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
          {children}
          <Toaster position="top-right" />
          </ThemeProvider>
      </body>
    </html>
  );
}