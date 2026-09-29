import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MotionProvider } from "@/components/MotionProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "MelodyTix — Rasakan musiknya, simpan momennya", template: "%s | MelodyTix" },
  description: "Jelajahi konser pilihan, pesan tiket, dan pantau pesananmu di MelodyTix.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body><MotionProvider><SiteHeader /><main id="main-content">{children}</main><SiteFooter /></MotionProvider></body></html>;
}
