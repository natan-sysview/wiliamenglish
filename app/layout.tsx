import "./globals.css";
import { Providers } from "@/components/providers";
import { Outfit } from "next/font/google";

const outfit = Outfit({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: "William english institute",
  description: "Plataforma educativa para el William english institute",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={outfit.variable} suppressHydrationWarning>
      <body className="font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased min-h-screen transition-colors duration-300">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
