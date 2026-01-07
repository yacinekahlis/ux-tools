"use client"

import type React from "react"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { TOOLS_REGISTRY } from "@/lib/tools-registry"
import type { ToolCategory } from "@/lib/types"
import { PicopiHeroCTA } from "@/components/picopi-teaser"

const CATEGORIES: ToolCategory[] = [
  "General",
  "Conversion",
  "Forms",
  "Accessibility",
  "Navigation",
  "Mobile",
  "Onboarding",
  "States",
]

// Badge component
function Badge({ children }: { children: React.ReactNode }) {
  const label = String(children)

  let colorClass = "border-border text-textMuted bg-transparent"

  if (label === "Conversion") colorClass = "border-emerald-500/30 text-emerald-400 bg-emerald-500/5"
  else if (label === "Forms") colorClass = "border-blue-500/30 text-blue-400 bg-blue-500/5"
  else if (label === "Accessibility") colorClass = "border-purple-500/30 text-purple-400 bg-purple-500/5"
  else if (label === "Navigation") colorClass = "border-orange-500/30 text-orange-400 bg-orange-500/5"
  else if (label === "Mobile") colorClass = "border-pink-500/30 text-pink-400 bg-pink-500/5"
  else if (label === "Onboarding") colorClass = "border-cyan-500/30 text-cyan-400 bg-cyan-500/5"
  else if (label === "States") colorClass = "border-yellow-500/30 text-yellow-400 bg-yellow-500/5"
  else if (label === "General") colorClass = "border-gray-500/30 text-gray-400 bg-gray-500/5"

  return (
    <span
      className={`badge-hover inline-flex items-center px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold border whitespace-nowrap ${colorClass}`}
    >
      {children}
    </span>
  )
}

// Button component
function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: {
  variant?: "primary" | "secondary" | "ghost"
  size?: "sm" | "md" | "lg"
  className?: string
  children: React.ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const baseStyle =
    "btn-cta inline-flex items-center justify-center font-medium rounded-[6px] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-accent disabled:opacity-50 disabled:cursor-not-allowed"

  const variants = {
    primary: "bg-[#f7f8f8] text-[#08090a] hover:bg-[#e0e0e0] shadow-sm",
    secondary: "bg-card border border-border text-textMain hover:bg-cardHover hover:border-borderHover",
    ghost: "bg-transparent text-textMuted hover:text-textMain hover:bg-white/[0.04]",
  }

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-sm",
  }

  return (
    <button className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  )
}

// Pagination component
function Pagination({
  total,
  page,
  perPage,
  onPageChange,
  onPerPageChange,
}: {
  total: number
  page: number
  perPage: number
  onPageChange: (p: number) => void
  onPerPageChange: (p: number) => void
}) {
  const totalPages = Math.ceil(total / perPage)
  const start = (page - 1) * perPage + 1
  const end = Math.min(page * perPage, total)

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 border-t border-border mt-8">
      <div className="text-sm text-textMuted">
        Showing <span className="text-textMain font-medium">{Math.min(start, total)}</span>–
        <span className="text-textMain font-medium">{end}</span> of{" "}
        <span className="text-textMain font-medium">{total}</span>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-textMuted">Rows per page:</span>
          <select
            value={perPage}
            onChange={(e) => onPerPageChange(Number(e.target.value))}
            className="input-focus bg-card border border-border text-textMain text-sm rounded px-1 py-1 focus:outline-none"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-textMuted">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-1">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="px-2"
            >
              &lt;
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="px-2"
            >
              &gt;
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ToolsHub() {
  const [search, setSearch] = useState("")
  const [selectedCat, setSelectedCat] = useState<ToolCategory | "All">("All")
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  // Filter
  const filteredTools = useMemo(() => {
    return TOOLS_REGISTRY.filter((t) => {
      const matchesSearch =
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase())
      const matchesCat = selectedCat === "All" || t.category === selectedCat
      return matchesSearch && matchesCat
    })
  }, [search, selectedCat])

  // Paginate
  const displayedTools = useMemo(() => {
    const start = (page - 1) * perPage
    return filteredTools.slice(start, start + perPage)
  }, [filteredTools, page, perPage])

  // Reset page on filter change
  useEffect(() => {
    setPage(1)
  }, [search, selectedCat, perPage])

  const scrollToTools = () => {
    document.getElementById("tools-grid")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="space-y-16 animate-page-enter">
      {/* Hero */}
      <div className="py-8 md:py-12 text-center max-w-3xl mx-auto space-y-8">
        <h1 className="animate-fade-in-up text-4xl md:text-5xl font-semibold tracking-tight text-textMain leading-[1.1] text-balance">
          Free UX Design Tools to Improve Usability & Conversion
        </h1>
        <p className="animate-fade-in-up-delay text-lg text-textSecondary max-w-2xl mx-auto leading-relaxed font-normal">
          This hub provides free UX design tools to help UX and UI designers evaluate usability, accessibility, mobile
          experience, conversion flows, and user onboarding. Each tool is designed to be fast, practical, and
          actionable.
        </p>

        <div className="animate-fade-in-up-delay-2 flex justify-center gap-4 pt-2">
          <PicopiHeroCTA />
          <Button variant="secondary" size="md" onClick={scrollToTools}>
            Browse free tools
          </Button>
        </div>
      </div>

      <div id="tools-grid" className="space-y-8">
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-end md:items-center">
          {/* Categories via Select */}
          <div className="w-full md:w-64">
            <div className="flex flex-col gap-1.5 w-full">
              <div className="relative w-full">
                <select
                  value={selectedCat}
                  onChange={(e) => setSelectedCat(e.target.value as ToolCategory | "All")}
                  className="input-focus appearance-none w-full bg-card border border-border rounded-[12px] px-4 py-3 text-sm text-textMain focus:outline-none cursor-pointer hover:bg-cardHover transition-colors"
                >
                  <option value="All">All Categories</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                  <svg className="w-4 h-4 text-textMuted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative group w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-4 w-4 text-textMuted transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Filter tools..."
              className="input-focus block w-full pl-9 pr-3 py-2 border border-border rounded-[6px] bg-card text-textMain placeholder-textMuted focus:outline-none text-sm transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Tool Grid */}
        {displayedTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {displayedTools.map((tool, index) => (
              <Link
                key={tool.id}
                href={`/tools/${tool.slug}`}
                className={`card-hover animate-card animate-card-${Math.min(index + 1, 10)} group flex flex-col h-full rounded-[12px] overflow-hidden bg-card border border-border`}
              >
                <div className="p-6 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <Badge>{tool.category}</Badge>
                    <span className="text-[10px] text-textMuted uppercase tracking-wider">{tool.type}</span>
                  </div>

                  <h3 className="text-lg font-semibold text-textMain mb-2 group-hover:text-white transition-colors">
                    {tool.name}
                  </h3>

                  <p className="text-textSecondary mb-6 flex-grow leading-relaxed font-normal text-sm">
                    {tool.seo.shortDescription}
                  </p>

                  <div className="mt-auto pt-4 border-t border-border group-hover:border-borderHover transition-colors flex justify-between items-center">
                    <span className="text-xs text-textMuted italic">{tool.howItWorks.substring(0, 40)}...</span>
                    <span className="text-xs font-medium text-textMain group-hover:underline">Open tool &rarr;</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border border-dashed border-border rounded-[12px]">
            <p className="text-textMuted">No tools found matching your filters.</p>
            <button
              onClick={() => {
                setSearch("")
                setSelectedCat("All")
              }}
              className="mt-4 text-sm text-accent hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Pagination */}
        <Pagination
          total={filteredTools.length}
          page={page}
          perPage={perPage}
          onPageChange={setPage}
          onPerPageChange={setPerPage}
        />
      </div>
    </div>
  )
}
