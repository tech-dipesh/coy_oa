import type { ReactNode } from "react"
import "./globals.css"
import { Metadata } from "next"
export const metadata: Metadata = { title: "Coy Discover" }
export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><head><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;800&display=swap" /></head><body className="font-sans">{children}</body></html>
}
