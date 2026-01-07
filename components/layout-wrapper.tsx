"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { PicopiTeaser } from "@/components/picopi-teaser"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen flex flex-col bg-background text-textMain font-sans selection:bg-accent/30 selection:text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              href="/tools"
              className="text-sm font-semibold tracking-tight flex items-center gap-2 text-textMain hover:text-white transition-opacity"
            >
              <span className="w-5 h-5 rounded-[4px] bg-[#f7f8f8] text-black flex items-center justify-center text-[10px] font-bold">
                UX
              </span>
              <span>UX Tools</span>
            </Link>
            <div className="hidden md:flex gap-6 text-xs font-medium">
              <Link
                href="/tools"
                className={`transition-colors ${pathname === "/tools" ? "text-textMain" : "text-textSecondary hover:text-textMain"}`}
              >
                Tools
              </Link>
              <span className="text-textVeryMuted cursor-not-allowed">About</span>
            </div>
          </div>
          <PicopiTeaser variant="nav" />
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-5xl mx-auto px-6 py-12 md:py-20">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-10 mt-auto">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-textMuted">&copy; {new Date().getFullYear()} UX Tools Hub. Free for everyone.</p>
          <p className="text-xs text-textMuted">
            Built by <PicopiTeaser variant="footer" />
          </p>
        </div>
      </footer>
    </div>
  )
}
