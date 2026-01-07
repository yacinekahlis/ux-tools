"use client"

import type React from "react"

// =============================================================================
// PicopiTeaser - Single source of truth for all Picopi references
// =============================================================================
// TODO: When Picopi launches, update this file ONLY to enable live CTA.
//       1. Set IS_LIVE = true
//       2. Update PICOPI_URL to the correct production URL
//       3. Update copy as needed
// =============================================================================

const IS_LIVE = false
const PICOPI_URL = "https://picopi.io"

interface PicopiTeaserProps {
  variant: "tool" | "nav" | "footer"
  className?: string
}

// Button component (inline for self-containment)
function Button({
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  children,
  ...props
}: {
  variant?: "primary" | "secondary"
  size?: "sm" | "md" | "lg"
  className?: string
  disabled?: boolean
  children: React.ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const baseStyle =
    "btn-cta inline-flex items-center justify-center font-medium rounded-[6px] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-accent"

  const variants = {
    primary: disabled
      ? "bg-[#f7f8f8]/60 text-[#08090a]/60 cursor-not-allowed"
      : "bg-[#f7f8f8] text-[#08090a] hover:bg-[#e0e0e0] shadow-sm",
    secondary: disabled
      ? "bg-card border border-border text-textMuted cursor-not-allowed opacity-60"
      : "bg-card border border-border text-textMain hover:bg-cardHover hover:border-borderHover",
  }

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-sm",
  }

  return (
    <button className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`} disabled={disabled} {...props}>
      {children}
    </button>
  )
}

// -----------------------------------------------------------------------------
// TOOL VARIANT - Shown at the bottom of every tool page
// -----------------------------------------------------------------------------
function ToolVariant({ className = "" }: { className?: string }) {
  // TODO: When IS_LIVE = true, update this to show the live CTA with active link
  if (IS_LIVE) {
    return (
      <section
        className={`mt-20 md:mt-24 mb-12 rounded-[12px] bg-section border border-border p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-10 ${className}`}
      >
        <div className="max-w-xl text-center md:text-left space-y-4">
          <h3 className="text-xl md:text-2xl font-semibold text-textMain tracking-tight">Want the full picture?</h3>
          <p className="text-textSecondary text-base md:text-lg leading-relaxed">
            This free tool checks one slice of UX. <br className="hidden md:block" />
            Picopi audits your entire page — issues, screenshots, and fixes — web or mobile.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 w-full md:w-auto min-w-[200px]">
          <a href={PICOPI_URL} target="_blank" rel="noopener noreferrer" className="w-full md:w-auto">
            <Button variant="primary" size="lg" className="w-full">
              Run free Picopi audit &rarr;
            </Button>
          </a>
          <a
            href={PICOPI_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-textMuted hover:text-textMain transition-colors text-xs font-medium border-b border-transparent hover:border-textMuted"
          >
            Learn how Picopi works
          </a>
        </div>
      </section>
    )
  }

  // COMING SOON state
  return (
    <section
      className={`mt-20 md:mt-24 mb-12 rounded-[12px] bg-section border border-border p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-10 ${className}`}
    >
      <div className="max-w-xl text-center md:text-left space-y-4">
        <h3 className="text-xl md:text-2xl font-semibold text-textMain tracking-tight">Full UX audit — coming soon</h3>
        <p className="text-textSecondary text-base md:text-lg leading-relaxed">
          Picopi will provide full-page UX audits with screenshots, prioritized issues, and fixes — for web and mobile.
        </p>
      </div>

      <div className="flex flex-col items-center gap-4 w-full md:w-auto min-w-[200px]">
        <Button variant="secondary" size="lg" className="w-full" disabled>
          Picopi (coming soon)
        </Button>
        <span className="text-textMuted text-xs">Launching soon.</span>
      </div>
    </section>
  )
}

// -----------------------------------------------------------------------------
// NAV VARIANT - Shown in the top-right navigation
// -----------------------------------------------------------------------------
function NavVariant({ className = "" }: { className?: string }) {
  // TODO: When IS_LIVE = true, this becomes an active link to Picopi
  if (IS_LIVE) {
    return (
      <a
        href={PICOPI_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`text-xs font-medium text-textMuted hover:text-textMain transition-colors group ${className}`}
      >
        Picopi <span className="text-accent group-hover:text-accent/80">&rarr;</span>
      </a>
    )
  }

  // COMING SOON state - non-interactive with sublabel
  return (
    <div className={`flex flex-col items-end ${className}`}>
      <span className="text-xs font-medium text-textMuted cursor-default">Picopi</span>
      <span className="text-[10px] text-textVeryMuted">Coming soon</span>
    </div>
  )
}

// -----------------------------------------------------------------------------
// FOOTER VARIANT - Shown in the footer attribution
// -----------------------------------------------------------------------------
function FooterVariant({ className = "" }: { className?: string }) {
  // TODO: When IS_LIVE = true, this becomes an active link
  if (IS_LIVE) {
    return (
      <a
        href={PICOPI_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`text-textSecondary hover:text-textMain transition-colors font-medium ${className}`}
      >
        Picopi
      </a>
    )
  }

  // COMING SOON state - just text, no link
  return <span className={`text-textSecondary font-medium ${className}`}>Picopi</span>
}

// -----------------------------------------------------------------------------
// HERO CTA VARIANT - Shown in the tools hub hero section
// -----------------------------------------------------------------------------
function HeroVariant({ className = "" }: { className?: string }) {
  // TODO: When IS_LIVE = true, this becomes an active link
  if (IS_LIVE) {
    return (
      <a href={PICOPI_URL} target="_blank" rel="noopener noreferrer" className={className}>
        <Button variant="primary" size="md" className="px-8 py-3">
          Run full UX audit &rarr;
        </Button>
      </a>
    )
  }

  // COMING SOON state - disabled button
  return (
    <Button variant="secondary" size="md" className={`px-8 py-3 ${className}`} disabled>
      Full UX audit (coming soon)
    </Button>
  )
}

// -----------------------------------------------------------------------------
// MAIN EXPORT
// -----------------------------------------------------------------------------
export function PicopiTeaser({ variant, className = "" }: PicopiTeaserProps) {
  switch (variant) {
    case "tool":
      return <ToolVariant className={className} />
    case "nav":
      return <NavVariant className={className} />
    case "footer":
      return <FooterVariant className={className} />
    default:
      return null
  }
}

// Export hero variant separately as it's used inline
export function PicopiHeroCTA({ className = "" }: { className?: string }) {
  return <HeroVariant className={className} />
}
