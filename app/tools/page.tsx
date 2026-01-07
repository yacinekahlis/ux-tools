import type { Metadata } from "next"
import { ToolsHub } from "@/components/tools-hub"

export const metadata: Metadata = {
  title: "Free UX Tools for Designers, Builders & Founders",
  description:
    "A free hub of UX and UI design tools to audit usability, improve conversion, accessibility, mobile experience, and onboarding.",
  openGraph: {
    title: "Free UX Tools for Designers, Builders & Founders",
    description:
      "A free hub of UX and UI design tools to audit usability, improve conversion, accessibility, mobile experience, and onboarding.",
    type: "website",
    url: "https://uxtools.dev/tools",
  },
  alternates: {
    canonical: "https://uxtools.dev/tools",
  },
}

export default function ToolsPage() {
  return <ToolsHub />
}
