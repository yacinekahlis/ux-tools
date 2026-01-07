import type { ToolDef, ToolCategory, ToolResult } from "./types"

export const SITE_URL = "https://uxtools.dev"

// SEO metadata for each tool
export interface ToolSEO {
  seoTitle: string
  seoDescription: string
  targetKeywords: string[]
  shortDescription: string
}

export interface ToolWithSEO extends ToolDef {
  seo: ToolSEO
}

// Helper to determine score color/label
const getScoreMeta = (score: number) => {
  if (score >= 85) return { label: "Excellent", color: "text-success" }
  if (score >= 65) return { label: "Good", color: "text-accent" }
  if (score >= 40) return { label: "Needs Work", color: "text-warning" }
  return { label: "Critical Issues", color: "text-danger" }
}

// Standard checklist calculation helper
const standardChecklistCalc = (totalItems: number, uncheckedIds: string[], items: any[]): ToolResult => {
  const checkedCount = totalItems - uncheckedIds.length
  const score = Math.round((checkedCount / totalItems) * 100)
  const { label, color } = getScoreMeta(score)

  const fixes = items
    .filter((i) => uncheckedIds.includes(i.id))
    .sort((a, b) => {
      const pMap = { High: 3, Medium: 2, Low: 1 }
      return pMap[b.priority as keyof typeof pMap] - pMap[a.priority as keyof typeof pMap]
    })
    .slice(0, 5)
    .map((i) => i.text)

  return { score, label, color, fixes }
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleaned = hex.replace(/^#/, "")
  if (!/^[0-9A-Fa-f]{6}$/.test(cleaned) && !/^[0-9A-Fa-f]{3}$/.test(cleaned)) {
    return null
  }

  let r: number, g: number, b: number
  if (cleaned.length === 3) {
    r = Number.parseInt(cleaned[0] + cleaned[0], 16)
    g = Number.parseInt(cleaned[1] + cleaned[1], 16)
    b = Number.parseInt(cleaned[2] + cleaned[2], 16)
  } else {
    r = Number.parseInt(cleaned.slice(0, 2), 16)
    g = Number.parseInt(cleaned.slice(2, 4), 16)
    b = Number.parseInt(cleaned.slice(4, 6), 16)
  }
  return { r, g, b }
}

function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

function getContrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

export const TOOLS_REGISTRY: ToolWithSEO[] = [
  // --- GENERAL ---
  {
    id: "ux-audit-web",
    slug: "ux-audit-web",
    name: "UX Audit Checklist — Web",
    category: "General",
    description: "A comprehensive heuristic checklist for desktop web interfaces.",
    howItWorks: "Check off best practices to generate a UX health score.",
    type: "checklist",
    seo: {
      seoTitle: "UX Audit Checklist for Websites",
      seoDescription:
        "Free UX audit checklist for desktop web interfaces. Evaluate your website against 12 key usability heuristics and get an instant UX health score.",
      targetKeywords: ["ux audit checklist", "website ux audit", "ux audit tool", "web usability checklist"],
      shortDescription: "Comprehensive heuristic checklist for desktop web interfaces.",
    },
    checklist: [
      { id: "1", text: "Value proposition is clear above the fold", priority: "High" },
      { id: "2", text: "Single primary action per view", priority: "High" },
      { id: "3", text: "Consistent spacing system used", priority: "Medium" },
      { id: "4", text: "Typography is readable (size/contrast)", priority: "High" },
      { id: "5", text: "Navigation labels are descriptive", priority: "Medium" },
      { id: "6", text: "Visual hierarchy guides the eye", priority: "High" },
      { id: "7", text: "Interactive elements show feedback", priority: "Medium" },
      { id: "8", text: "Error messages explain how to fix", priority: "High" },
      { id: "9", text: "Forms have visible labels", priority: "High" },
      { id: "10", text: "Perceived performance is fast", priority: "Medium" },
      { id: "11", text: "Contrast meets accessibility standards", priority: "High" },
      { id: "12", text: "Layout adapts to screen resizing", priority: "High" },
    ],
    calculate: (_, unchecked, tool) => standardChecklistCalc(12, unchecked, tool.checklist!),
  },
  {
    id: "ux-audit-mobile",
    slug: "ux-audit-mobile",
    name: "UX Audit Checklist — Mobile",
    category: "General",
    description: "Ensure your mobile experience is touch-friendly and responsive.",
    howItWorks: "Evaluate specific mobile usability heuristics.",
    type: "checklist",
    seo: {
      seoTitle: "Mobile UX Audit Checklist",
      seoDescription:
        "Free mobile UX audit checklist to ensure your app is touch-friendly and responsive. Check 12 mobile usability best practices instantly.",
      targetKeywords: ["mobile ux audit", "mobile usability checklist", "app ux checklist", "mobile ux best practices"],
      shortDescription: "Ensure your mobile experience is touch-friendly and responsive.",
    },
    checklist: [
      { id: "1", text: "Tap targets are at least 44x44px", priority: "High" },
      { id: "2", text: "Text is readable without zooming", priority: "High" },
      { id: "3", text: "No horizontal scrolling required", priority: "High" },
      { id: "4", text: "Primary actions in thumb zone", priority: "Medium" },
      { id: "5", text: "Safe areas (notch/bar) respected", priority: "Medium" },
      { id: "6", text: "Inputs trigger correct keyboard", priority: "Medium" },
      { id: "7", text: "Typing requirements are minimized", priority: "Medium" },
      { id: "8", text: "Back/Close actions are obvious", priority: "High" },
      { id: "9", text: "Loading states provided", priority: "Medium" },
      { id: "10", text: "Errors are recoverable", priority: "High" },
      { id: "11", text: "Contrast readable outdoors", priority: "High" },
      { id: "12", text: "No hover-dependent navigation", priority: "High" },
    ],
    calculate: (_, unchecked, tool) => standardChecklistCalc(12, unchecked, tool.checklist!),
  },
  {
    id: "usability-checklist",
    slug: "usability-checklist",
    name: "Usability Checklist",
    category: "General",
    description: "Broad usability principles based on cognitive psychology.",
    howItWorks: "Verify your interface against core usability laws.",
    type: "checklist",
    seo: {
      seoTitle: "Usability Checklist Based on Cognitive Psychology",
      seoDescription:
        "Free usability checklist based on cognitive psychology principles. Verify your interface against 10 core usability laws and best practices.",
      targetKeywords: [
        "usability checklist",
        "usability principles",
        "cognitive psychology ux",
        "usability heuristics",
      ],
      shortDescription: "Broad usability principles based on cognitive psychology.",
    },
    checklist: [
      { id: "1", text: "Interface uses familiar language", priority: "High" },
      { id: "2", text: "Users can undo/redo actions", priority: "High" },
      { id: "3", text: "Consistent patterns across screens", priority: "Medium" },
      { id: "4", text: "System prevents common errors", priority: "High" },
      { id: "5", text: "Smart defaults are provided", priority: "Medium" },
      { id: "6", text: "System status is always visible", priority: "High" },
      { id: "7", text: "Recognition over recall", priority: "Medium" },
      { id: "8", text: "Accelerators for power users", priority: "Low" },
      { id: "9", text: "Aesthetic and minimalist design", priority: "Medium" },
      { id: "10", text: "Help/Docs available contextually", priority: "Low" },
    ],
    calculate: (_, unchecked, tool) => standardChecklistCalc(10, unchecked, tool.checklist!),
  },
  {
    id: "ux-maturity-score",
    slug: "ux-maturity-score",
    name: "UX Maturity Score",
    category: "General",
    description: "Assess how well your organization integrates design.",
    howItWorks: "Rate 10 organizational habits to see your maturity level.",
    type: "questionnaire",
    seo: {
      seoTitle: "UX Maturity Score Calculator",
      seoDescription:
        "Free UX maturity assessment tool. Rate 10 organizational habits to measure how well your company integrates user experience design.",
      targetKeywords: [
        "ux maturity score",
        "ux maturity assessment",
        "design maturity model",
        "ux organization assessment",
      ],
      shortDescription: "Assess how well your organization integrates design.",
    },
    inputs: [
      {
        id: "q1",
        label: "User Research Cadence",
        type: "radio",
        options: [
          { label: "None", value: 1 },
          { label: "Ad-hoc", value: 2 },
          { label: "Regular", value: 3 },
          { label: "Continuous", value: 4 },
          { label: "Strategic", value: 5 },
        ],
      },
      {
        id: "q2",
        label: "Analytics Usage",
        type: "radio",
        options: [
          { label: "None", value: 1 },
          { label: "Basic", value: 2 },
          { label: "Regular", value: 3 },
          { label: "Actionable", value: 4 },
          { label: "Predictive", value: 5 },
        ],
      },
      {
        id: "q3",
        label: "Design System",
        type: "radio",
        options: [
          { label: "None", value: 1 },
          { label: "Inconsistent", value: 2 },
          { label: "Basic", value: 3 },
          { label: "Consistent", value: 4 },
          { label: "Governance", value: 5 },
        ],
      },
      {
        id: "q4",
        label: "Accessibility",
        type: "radio",
        options: [
          { label: "Ignored", value: 1 },
          { label: "Afterthought", value: 2 },
          { label: "Checked", value: 3 },
          { label: "Integrated", value: 4 },
          { label: "Culture", value: 5 },
        ],
      },
      {
        id: "q5",
        label: "Usability Testing",
        type: "radio",
        options: [
          { label: "Never", value: 1 },
          { label: "Rarely", value: 2 },
          { label: "Before Launch", value: 3 },
          { label: "During Dev", value: 4 },
          { label: "Always", value: 5 },
        ],
      },
      {
        id: "q6",
        label: "UX Ownership",
        type: "radio",
        options: [
          { label: "No one", value: 1 },
          { label: "Shared", value: 2 },
          { label: "Dedicated", value: 3 },
          { label: "Team", value: 4 },
          { label: "Exec Level", value: 5 },
        ],
      },
      {
        id: "q7",
        label: "Feedback Loop",
        type: "radio",
        options: [
          { label: "None", value: 1 },
          { label: "Slow", value: 2 },
          { label: "Occasional", value: 3 },
          { label: "Fast", value: 4 },
          { label: "Real-time", value: 5 },
        ],
      },
      {
        id: "q8",
        label: "Documentation",
        type: "radio",
        options: [
          { label: "None", value: 1 },
          { label: "Sparse", value: 2 },
          { label: "Outdated", value: 3 },
          { label: "Maintained", value: 4 },
          { label: "Automated", value: 5 },
        ],
      },
      {
        id: "q9",
        label: "Onboarding",
        type: "radio",
        options: [
          { label: "None", value: 1 },
          { label: "Confusing", value: 2 },
          { label: "Exists", value: 3 },
          { label: "Helpful", value: 4 },
          { label: "Personalized", value: 5 },
        ],
      },
      {
        id: "q10",
        label: "Performance",
        type: "radio",
        options: [
          { label: "Ignored", value: 1 },
          { label: "Reactive", value: 2 },
          { label: "Aware", value: 3 },
          { label: "Optimized", value: 4 },
          { label: "Budgeted", value: 5 },
        ],
      },
    ],
    calculate: (inputs) => {
      let sum = 0
      Object.values(inputs).forEach((v) => (sum += Number(v)))
      const score = Math.round((sum / 50) * 100)
      let label = "Starter"
      if (score > 80) label = "Advanced"
      else if (score > 60) label = "Mature"
      else if (score > 40) label = "Growing"

      return { score, label, color: getScoreMeta(score).color, fixes: ["Focus on lowest rated areas first."] }
    },
  },
  {
    id: "ux-issues-prioritizer",
    slug: "ux-issues-prioritizer",
    name: "UX Issues Prioritizer",
    category: "General",
    description: "Prioritize fixes based on Impact vs Effort matrix.",
    howItWorks: "Select issues you have and their fix effort to get a prioritized list.",
    type: "checklist",
    seo: {
      seoTitle: "UX Issues Prioritizer Tool",
      seoDescription:
        "Free UX issues prioritizer using impact vs effort matrix. Identify and rank your most critical UX problems to fix first.",
      targetKeywords: [
        "ux issues prioritizer",
        "ux prioritization matrix",
        "impact effort matrix ux",
        "ux fix prioritization",
      ],
      shortDescription: "Prioritize fixes based on Impact vs Effort matrix.",
    },
    checklist: [
      { id: "1", text: "Too many CTAs (High Impact)", priority: "High" },
      { id: "2", text: "Confusing nav labels (High Impact)", priority: "High" },
      { id: "3", text: "Weak hierarchy (Med Impact)", priority: "Medium" },
      { id: "4", text: "Form too long (High Impact)", priority: "High" },
      { id: "5", text: "Poor error messages (Med Impact)", priority: "Medium" },
      { id: "6", text: "Low contrast (Med Impact)", priority: "Medium" },
      { id: "7", text: "Slow perceived load (High Impact)", priority: "High" },
      { id: "8", text: "No empty states (Low Impact)", priority: "Low" },
      { id: "9", text: "Unclear pricing (High Impact)", priority: "High" },
      { id: "10", text: "No social proof (Med Impact)", priority: "Medium" },
      { id: "11", text: "Hard to scan text (Med Impact)", priority: "Medium" },
      { id: "12", text: "Mobile tap targets too small (High Impact)", priority: "High" },
    ],
    calculate: (_, unchecked, tool) => {
      const checkedIds = tool.checklist!.filter((i) => !unchecked.includes(i.id))
      const fixes = checkedIds.map((i) => i.text)
      return { score: 100 - checkedIds.length * 8, label: "Priority List", color: "text-textMain", fixes }
    },
  },

  // --- CONVERSION ---
  {
    id: "above-the-fold-checklist",
    slug: "above-the-fold-checklist",
    name: "Above-the-Fold Checklist",
    category: "Conversion",
    description: "Optimize the first screen users see to reduce bounce rate.",
    howItWorks: "Check key elements that must be visible without scrolling.",
    type: "checklist",
    seo: {
      seoTitle: "Above the Fold Optimization Checklist",
      seoDescription:
        "Free above-the-fold checklist to reduce bounce rate. Ensure the first screen users see contains all critical elements for conversion.",
      targetKeywords: [
        "above the fold checklist",
        "reduce bounce rate",
        "first screen optimization",
        "hero section checklist",
      ],
      shortDescription: "Optimize the first screen users see to reduce bounce rate.",
    },
    checklist: [
      { id: "1", text: "Headline states value clearly", priority: "High" },
      { id: "2", text: "Subheadline supports headline", priority: "Medium" },
      { id: "3", text: "Primary CTA visible immediately", priority: "High" },
      { id: "4", text: "Visual shows product/context", priority: "High" },
      { id: "5", text: "Social proof snippet visible", priority: "Medium" },
      { id: "6", text: "No distracting secondary CTAs", priority: "Medium" },
      { id: "7", text: "Key benefits scannable", priority: "Medium" },
      { id: "8", text: "Trust cues present", priority: "Low" },
      { id: "9", text: "Navigation not overwhelming", priority: "Medium" },
      { id: "10", text: "Mobile fold content is prioritized", priority: "High" },
    ],
    calculate: (_, unchecked, tool) => standardChecklistCalc(10, unchecked, tool.checklist!),
  },
  {
    id: "cta-clarity-checker",
    slug: "cta-clarity-checker",
    name: "CTA Clarity Checker",
    category: "Conversion",
    description: "Validate your Call-to-Action text for impact.",
    howItWorks: "Enter your CTA label to check for best practices.",
    type: "validator",
    seo: {
      seoTitle: "CTA Clarity Checker Tool",
      seoDescription:
        "Free CTA clarity checker to validate your call-to-action text. Ensure your button labels are clear, action-oriented, and optimized for clicks.",
      targetKeywords: [
        "cta clarity checker",
        "call to action validator",
        "button text optimizer",
        "cta best practices",
      ],
      shortDescription: "Validate your Call-to-Action text for impact.",
    },
    inputs: [{ id: "cta", label: "Button Label", type: "text", placeholder: "e.g. Get Started" }],
    calculate: (inputs) => {
      const text = (inputs["cta"] || "").trim()
      if (!text)
        return {
          score: 0,
          label: "Enter CTA Text",
          color: "text-textMuted",
          fixes: ["Enter your CTA button text above to analyze it."],
        }

      const strongVerbs = [
        "get",
        "start",
        "try",
        "book",
        "download",
        "join",
        "create",
        "run",
        "generate",
        "explore",
        "buy",
        "shop",
        "claim",
        "unlock",
        "discover",
        "launch",
        "build",
        "sign",
        "subscribe",
        "request",
        "access",
        "grab",
      ]
      const weakWords = ["click", "submit", "continue", "here", "more", "learn"]
      const lower = text.toLowerCase()
      const words = lower.split(/\s+/)
      const firstWord = words[0] || ""

      const fixes: string[] = []
      let score = 100

      // Check length
      if (text.length > 25) {
        score -= 25
        fixes.push("Too long — aim for under 25 characters")
      } else if (text.length > 20) {
        score -= 10
        fixes.push("Consider shortening — ideal length is under 20 characters")
      }

      // Check for weak words
      if (weakWords.some((w) => lower.includes(w))) {
        score -= 30
        fixes.push('Avoid weak words like "Click", "Submit", or "Learn more"')
      }

      // Check for strong action verb at the start
      if (!strongVerbs.some((v) => firstWord.startsWith(v))) {
        score -= 25
        fixes.push("Start with a strong action verb (Get, Start, Try, Join, etc.)")
      }

      // Check if it's just one generic word
      if (words.length === 1 && ["ok", "yes", "next", "go"].includes(lower)) {
        score -= 20
        fixes.push("Too generic — add specificity about what happens next")
      }

      // Bonus: If it has a benefit/outcome
      if (text.length > 3 && strongVerbs.some((v) => firstWord.startsWith(v)) && words.length >= 2) {
        score = Math.min(100, score + 10)
      }

      // Clamp score
      score = Math.max(0, Math.min(100, score))

      // If score is still high but no issues found, add positive feedback
      if (fixes.length === 0 && score >= 80) {
        fixes.push("Great CTA! Clear action verb and appropriate length.")
      }

      const { label, color } = getScoreMeta(score)
      return { score, label, color, fixes }
    },
  },
  {
    id: "cta-count-validator",
    slug: "cta-count-validator",
    name: "CTA Count Validator",
    category: "Conversion",
    description: "Calculate friction caused by competing calls to action.",
    howItWorks: "Enter number of CTAs to see if you are overwhelming users.",
    type: "calculator",
    seo: {
      seoTitle: "CTA Count Validator for Conversion",
      seoDescription:
        "Free CTA count validator to check if you have too many calls to action. Reduce cognitive load and improve conversion rates.",
      targetKeywords: ["cta count validator", "too many ctas", "conversion friction checker", "cognitive load ux"],
      shortDescription: "Calculate friction caused by competing calls to action.",
    },
    inputs: [
      { id: "primary", label: "Primary CTAs", type: "number", defaultValue: 1 },
      { id: "secondary", label: "Secondary CTAs", type: "number", defaultValue: 0 },
    ],
    calculate: (inputs) => {
      const p = Number(inputs.primary || 0)
      const s = Number(inputs.secondary || 0)
      let score = 100
      const fixes = []

      if (p > 1) {
        score -= (p - 1) * 20
        fixes.push("Only 1 primary CTA recommended per view")
      }
      if (s > 3) {
        score -= (s - 3) * 10
        fixes.push("Too many secondary links distract users")
      }
      if (score < 0) score = 0
      const { label, color } = getScoreMeta(score)
      return { score, label, color, fixes }
    },
  },
  {
    id: "funnel-friction-score",
    slug: "funnel-friction-score",
    name: "Funnel Friction Score",
    category: "Conversion",
    description: "Estimate drop-off risk based on funnel complexity.",
    howItWorks: "Answer questions about your flow to estimate friction.",
    type: "questionnaire",
    seo: {
      seoTitle: "Funnel Friction Score Calculator",
      seoDescription:
        "Free funnel friction calculator to estimate drop-off risk. Analyze your conversion funnel complexity and identify friction points.",
      targetKeywords: [
        "funnel friction score",
        "conversion funnel analysis",
        "drop off risk calculator",
        "funnel optimization",
      ],
      shortDescription: "Estimate drop-off risk based on funnel complexity.",
    },
    inputs: [
      { id: "steps", label: "Steps to complete goal", type: "number", defaultValue: 3 },
      {
        id: "signup",
        label: "Required signup before value?",
        type: "select",
        options: [
          { label: "Yes", value: 1 },
          { label: "No", value: 0 },
        ],
      },
      { id: "fields", label: "Total form fields", type: "number", defaultValue: 4 },
    ],
    calculate: (inputs) => {
      const steps = Number(inputs.steps)
      const signup = Number(inputs.signup)
      const fields = Number(inputs.fields)
      let score = 100
      const fixes = []

      if (steps > 3) {
        score -= (steps - 3) * 8
        fixes.push("Reduce steps (combine or remove)")
      }
      if (signup === 1) {
        score -= 15
        fixes.push("Delay signup until after value is shown")
      }
      if (fields > 5) {
        score -= (fields - 5) * 5
        fixes.push("Reduce form fields")
      }

      score = Math.max(0, score)
      const { label, color } = getScoreMeta(score)
      return { score, label, color, fixes }
    },
  },
  {
    id: "value-prop-clarity-check",
    slug: "value-prop-clarity-check",
    name: "Value Prop Clarity Check",
    category: "Conversion",
    description: "Ensure your messaging resonates instantly.",
    howItWorks: "Verify your value proposition against clarity rules.",
    type: "checklist",
    seo: {
      seoTitle: "Value Proposition Clarity Checker",
      seoDescription:
        "Free value proposition clarity checker. Ensure your messaging resonates instantly with visitors and clearly communicates your unique value.",
      targetKeywords: ["value proposition checker", "messaging clarity", "value prop audit", "homepage messaging"],
      shortDescription: "Ensure your messaging resonates instantly.",
    },
    checklist: [
      { id: "1", text: "States who it is for", priority: "High" },
      { id: "2", text: "States what it does", priority: "High" },
      { id: "3", text: "States benefit/outcome", priority: "High" },
      { id: "4", text: "Differentiation is clear", priority: "Medium" },
      { id: "5", text: "No industry jargon", priority: "Medium" },
      { id: "6", text: "Reads in 5 seconds", priority: "High" },
      { id: "7", text: "Matches visual context", priority: "Medium" },
      { id: "8", text: "CTA matches promise", priority: "High" },
      { id: "9", text: "Proof supports claim", priority: "Medium" },
      { id: "10", text: "Consistent across page", priority: "Low" },
    ],
    calculate: (_, unchecked, tool) => standardChecklistCalc(10, unchecked, tool.checklist!),
  },

  // --- FORMS ---
  {
    id: "form-ux-checklist",
    slug: "form-ux-checklist",
    name: "Form UX Checklist",
    category: "Forms",
    description: "Audit your forms for usability and conversion.",
    howItWorks: "Check best practices and input field counts to score your form.",
    type: "checklist",
    seo: {
      seoTitle: "Form UX Checklist to Reduce Friction",
      seoDescription:
        "Free form UX checklist to audit your forms for usability. Reduce friction and improve conversion with 9 proven best practices.",
      targetKeywords: [
        "form ux checklist",
        "form usability audit",
        "form design best practices",
        "reduce form friction",
      ],
      shortDescription: "Audit your forms for usability and conversion.",
    },
    inputs: [
      { id: "fields", label: "Total Fields", type: "number", defaultValue: 4 },
      { id: "optional", label: "Optional Fields", type: "number", defaultValue: 0 },
    ],
    checklist: [
      { id: "1", text: "Labels visible (not just placeholder)", priority: "High" },
      { id: "2", text: "Inline validation present", priority: "High" },
      { id: "3", text: "Error messages actionable", priority: "High" },
      { id: "4", text: "Logical grouping of fields", priority: "Medium" },
      { id: "5", text: "Appropriate input types used", priority: "Medium" },
      { id: "6", text: "Autofill/Autocomplete supported", priority: "High" },
      { id: "7", text: "Clear submit CTA", priority: "High" },
      { id: "8", text: "Privacy reassurance included", priority: "Medium" },
      { id: "9", text: "Success confirmation clear", priority: "Medium" },
    ],
    calculate: (inputs, unchecked, tool) => {
      const fields = Number(inputs.fields || 0)
      const optional = Number(inputs.optional || 0)
      const base = standardChecklistCalc(9, unchecked, tool.checklist!)

      let penalty = 0
      if (fields > 6) {
        penalty += Math.min((fields - 6) * 3, 20)
        base.fixes.push("Reduce total field count")
      }
      if (optional > 2) {
        penalty += Math.min((optional - 2) * 3, 15)
        base.fixes.push("Remove optional fields")
      }

      base.score = Math.max(0, base.score - penalty)
      const meta = getScoreMeta(base.score)
      base.label = meta.label
      base.color = meta.color
      return base
    },
  },
  {
    id: "form-field-count-impact",
    slug: "form-field-count-impact",
    name: "Form Field Count Impact",
    category: "Forms",
    description: "See how form length impacts conversion friction.",
    howItWorks: "Enter field count to estimate friction level.",
    type: "calculator",
    seo: {
      seoTitle: "Form Field Count Impact Calculator",
      seoDescription:
        "Free form field count calculator to see how form length impacts conversion. Understand friction levels based on your number of form fields.",
      targetKeywords: ["form field count", "form length impact", "form conversion friction", "optimal form fields"],
      shortDescription: "See how form length impacts conversion friction.",
    },
    inputs: [{ id: "fields", label: "Number of Fields", type: "number", defaultValue: 5 }],
    calculate: (inputs) => {
      const n = Number(inputs.fields)
      let score = 100
      const fixes = []
      if (n <= 3) {
        score = 100
        fixes.push("Great length for high conversion.")
      } else if (n <= 6) {
        score = 80
        fixes.push("Acceptable, but ensure all are necessary.")
      } else if (n <= 10) {
        score = 50
        fixes.push("High friction. Remove optional fields.")
      } else {
        score = 20
        fixes.push("Very high friction. Split into steps or cut fields.")
      }

      const { label, color } = getScoreMeta(score)
      return { score, label: n > 10 ? "Very High Friction" : label, color, fixes }
    },
  },
  {
    id: "password-ux-checklist",
    slug: "password-ux-checklist",
    name: "Password UX Checklist",
    category: "Forms",
    description: "Ensure password fields don't frustrate users.",
    howItWorks: "Check your password creation/entry flow.",
    type: "checklist",
    seo: {
      seoTitle: "Password UX Checklist for Better Sign-ups",
      seoDescription:
        "Free password UX checklist to prevent user frustration. Ensure your password fields follow best practices for sign-up conversion.",
      targetKeywords: [
        "password ux checklist",
        "password field best practices",
        "signup form optimization",
        "password requirements ux",
      ],
      shortDescription: "Ensure password fields don't frustrate users.",
    },
    checklist: [
      { id: "1", text: "Show/hide toggle available", priority: "High" },
      { id: "2", text: "Requirements visible before error", priority: "High" },
      { id: "3", text: "Strength indicator present", priority: "Medium" },
      { id: "4", text: "Avoid overly strict rules", priority: "High" },
      { id: "5", text: "Clear error messages", priority: "High" },
      { id: "6", text: "Paste allowed", priority: "High" },
      { id: "7", text: "Forgot password link visible", priority: "High" },
      { id: "8", text: "Confirm password only if needed", priority: "Medium" },
    ],
    calculate: (_, unchecked, tool) => standardChecklistCalc(8, unchecked, tool.checklist!),
  },
  {
    id: "error-message-ux-checklist",
    slug: "error-message-ux-checklist",
    name: "Error Message UX Checklist",
    category: "Forms",
    description: "Improve error recovery with better messaging.",
    howItWorks: "Verify your error handling patterns.",
    type: "checklist",
    seo: {
      seoTitle: "Error Message UX Checklist",
      seoDescription:
        "Free error message UX checklist to improve form error recovery. Write better error messages that help users fix problems quickly.",
      targetKeywords: [
        "error message ux",
        "form error messages",
        "error handling best practices",
        "user friendly errors",
      ],
      shortDescription: "Improve error recovery with better messaging.",
    },
    checklist: [
      { id: "1", text: "States exactly what happened", priority: "High" },
      { id: "2", text: "States how to fix it", priority: "High" },
      { id: "3", text: "Uses plain language", priority: "Medium" },
      { id: "4", text: "No blaming tone", priority: "Medium" },
      { id: "5", text: "Highlights field with error", priority: "High" },
      { id: "6", text: "Preserves user input", priority: "High" },
      { id: "7", text: "Does not block unnecessarily", priority: "Medium" },
      { id: "8", text: "Works on mobile", priority: "High" },
    ],
    calculate: (_, unchecked, tool) => standardChecklistCalc(8, unchecked, tool.checklist!),
  },

  // --- ACCESSIBILITY ---
  {
    id: "accessibility-quick-check",
    slug: "accessibility-quick-check",
    name: "Accessibility Quick Check",
    category: "Accessibility",
    description: "A rapid audit for basic accessibility compliance.",
    howItWorks: "Check key a11y specs and heuristics.",
    type: "checklist",
    seo: {
      seoTitle: "Accessibility Quick Check (WCAG)",
      seoDescription:
        "Free accessibility quick check for WCAG compliance. Rapidly audit your website for basic accessibility issues and get instant feedback.",
      targetKeywords: ["accessibility checklist", "wcag checklist", "accessibility audit", "a11y quick check"],
      shortDescription: "A rapid audit for basic accessibility compliance.",
    },
    inputs: [
      { id: "text", label: "Body Text Size (px)", type: "number", defaultValue: 16 },
      { id: "btn", label: "Button Height (px)", type: "number", defaultValue: 44 },
    ],
    checklist: [
      { id: "1", text: "Focus states visible", priority: "High" },
      { id: "2", text: "Keyboard navigable", priority: "High" },
      { id: "3", text: "Labels associated with inputs", priority: "High" },
      { id: "4", text: "Alt text for images", priority: "High" },
      { id: "5", text: "Color not sole indicator", priority: "High" },
      { id: "6", text: "Adequate contrast generally", priority: "High" },
    ],
    calculate: (inputs, unchecked, tool) => {
      const text = Number(inputs.text)
      const btn = Number(inputs.btn)
      const base = standardChecklistCalc(6, unchecked, tool.checklist!)

      if (text < 16) {
        base.score -= 10
        base.fixes.push("Increase body text to 16px")
      }
      if (btn < 44) {
        base.score -= 15
        base.fixes.push("Min button height 44px")
      }

      base.score = Math.max(0, base.score)
      const meta = getScoreMeta(base.score)
      base.label = meta.label
      base.color = meta.color
      return base
    },
  },
  {
    id: "button-size-checker",
    slug: "button-size-checker",
    name: "Button Size Checker",
    category: "Accessibility",
    description: "Check if your buttons meet touch target standards.",
    howItWorks: "Enter button height to check compliance.",
    type: "validator",
    seo: {
      seoTitle: "Button Size Checker for Touch Targets",
      seoDescription:
        "Free button size checker for touch target compliance. Verify your buttons meet WCAG and mobile accessibility standards.",
      targetKeywords: ["button size checker", "touch target size", "wcag button size", "mobile tap target"],
      shortDescription: "Check if your buttons meet touch target standards.",
    },
    inputs: [{ id: "height", label: "Button Height (px)", type: "number", defaultValue: 40 }],
    calculate: (inputs) => {
      const h = Number(inputs.height)
      let score = 100
      const fixes = []
      if (h >= 44) {
        fixes.push("Passes WCAG AAA / Mobile standards")
      } else if (h >= 40) {
        score = 80
        fixes.push("Acceptable desktop, risky mobile")
      } else {
        score = 40
        fixes.push("Too small for touch targets. Increase to 44px.")
      }

      const { label, color } = getScoreMeta(score)
      return { score, label, color, fixes }
    },
  },
  {
    id: "font-size-checker",
    slug: "font-size-checker",
    name: "Font Size Readability Checker",
    category: "Accessibility",
    description: "Verify body text size for readability.",
    howItWorks: "Enter font size to check legibility.",
    type: "validator",
    seo: {
      seoTitle: "Font Size Readability Checker",
      seoDescription:
        "Free font size readability checker to verify your body text is legible. Ensure your typography meets accessibility standards.",
      targetKeywords: ["font size checker", "readability checker", "text size accessibility", "typography legibility"],
      shortDescription: "Verify body text size for readability.",
    },
    inputs: [{ id: "size", label: "Font Size (px)", type: "number", defaultValue: 14 }],
    calculate: (inputs) => {
      const s = Number(inputs.size)
      let score = 100
      const fixes = []
      if (s >= 16) fixes.push("Good readability.")
      else if (s >= 14) {
        score = 70
        fixes.push("Acceptable minimum, prefer 16px.")
      } else {
        score = 30
        fixes.push("Too small. Increase to at least 16px.")
      }

      const { label, color } = getScoreMeta(score)
      return { score, label, color, fixes }
    },
  },
  {
    id: "contrast-calculator",
    slug: "contrast-calculator",
    name: "Color Contrast Calculator",
    category: "Accessibility",
    description: "Check WCAG contrast compliance for your color pairs.",
    howItWorks: "Enter foreground and background hex colors to calculate contrast ratio.",
    type: "validator",
    seo: {
      seoTitle: "Color Contrast Calculator for WCAG",
      seoDescription:
        "Free color contrast calculator for WCAG compliance. Check if your foreground and background colors meet AA and AAA accessibility standards.",
      targetKeywords: [
        "color contrast calculator",
        "wcag contrast checker",
        "accessibility contrast ratio",
        "color accessibility",
      ],
      shortDescription: "Check WCAG contrast compliance for your color pairs.",
    },
    inputs: [
      { id: "fg", label: "Foreground Hex", type: "text", placeholder: "#000000" },
      { id: "bg", label: "Background Hex", type: "text", placeholder: "#ffffff" },
    ],
    calculate: (inputs) => {
      const fgHex = (inputs["fg"] || "").trim()
      const bgHex = (inputs["bg"] || "").trim()

      if (!fgHex || !bgHex) {
        return {
          score: 0,
          label: "Enter Colors",
          color: "text-textMuted",
          fixes: ["Enter both foreground and background hex colors (e.g., #000000, #ffffff)"],
        }
      }

      const fgRgb = hexToRgb(fgHex)
      const bgRgb = hexToRgb(bgHex)

      if (!fgRgb || !bgRgb) {
        return {
          score: 0,
          label: "Invalid Hex",
          color: "text-danger",
          fixes: ["Enter valid hex colors (e.g., #000000, #fff, #1a2b3c)"],
        }
      }

      const fgLum = getLuminance(fgRgb.r, fgRgb.g, fgRgb.b)
      const bgLum = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b)
      const ratio = getContrastRatio(fgLum, bgLum)
      const ratioStr = ratio.toFixed(2) + ":1"

      const fixes: string[] = []
      let score = 0

      // WCAG AA normal text: 4.5:1
      // WCAG AA large text: 3:1
      // WCAG AAA normal text: 7:1
      // WCAG AAA large text: 4.5:1

      if (ratio >= 7) {
        score = 100
        fixes.push(`Contrast ratio: ${ratioStr}`)
        fixes.push("✓ Passes WCAG AAA (normal text)")
        fixes.push("✓ Passes WCAG AAA (large text)")
        fixes.push("✓ Passes WCAG AA (all text)")
      } else if (ratio >= 4.5) {
        score = 85
        fixes.push(`Contrast ratio: ${ratioStr}`)
        fixes.push("✓ Passes WCAG AA (normal text)")
        fixes.push("✓ Passes WCAG AAA (large text)")
        fixes.push("✗ Fails WCAG AAA (normal text) — need 7:1")
      } else if (ratio >= 3) {
        score = 50
        fixes.push(`Contrast ratio: ${ratioStr}`)
        fixes.push("✓ Passes WCAG AA (large text only)")
        fixes.push("✗ Fails WCAG AA (normal text) — need 4.5:1")
        fixes.push("✗ Fails WCAG AAA — need 7:1")
      } else {
        score = 20
        fixes.push(`Contrast ratio: ${ratioStr}`)
        fixes.push("✗ Fails all WCAG levels")
        fixes.push("Minimum for large text: 3:1")
        fixes.push("Minimum for normal text: 4.5:1")
      }

      const { label, color } = getScoreMeta(score)
      return { score, label, color, fixes }
    },
  },
  {
    id: "keyboard-accessibility-checklist",
    slug: "keyboard-accessibility-checklist",
    name: "Keyboard Accessibility Checklist",
    category: "Accessibility",
    description: "Ensure users can navigate without a mouse.",
    howItWorks: "Verify tab order, focus states, and traps.",
    type: "checklist",
    seo: {
      seoTitle: "Keyboard Accessibility Checklist",
      seoDescription:
        "Free keyboard accessibility checklist to ensure users can navigate without a mouse. Verify tab order, focus states, and keyboard traps.",
      targetKeywords: [
        "keyboard accessibility",
        "keyboard navigation checklist",
        "focus states audit",
        "tab order accessibility",
      ],
      shortDescription: "Ensure users can navigate without a mouse.",
    },
    checklist: [
      { id: "1", text: "Tab order is logical", priority: "High" },
      { id: "2", text: "Focus rings clearly visible", priority: "High" },
      { id: "3", text: "No keyboard traps", priority: "High" },
      { id: "4", text: "Modals trap focus correctly", priority: "Medium" },
      { id: "5", text: "Escape key closes dialogs", priority: "Medium" },
      { id: "6", text: "Skip to content link exists", priority: "Medium" },
      { id: "7", text: "Dropdowns accessible via keys", priority: "High" },
      { id: "8", text: "Buttons are <button> not <div>", priority: "High" },
    ],
    calculate: (_, unchecked, tool) => standardChecklistCalc(8, unchecked, tool.checklist!),
  },

  // --- NAVIGATION ---
  {
    id: "navigation-complexity-checker",
    slug: "navigation-complexity-checker",
    name: "Navigation Complexity Checker",
    category: "Navigation",
    description: "Assess if your menu structure is too deep.",
    howItWorks: "Input link counts and depth to score complexity.",
    type: "calculator",
    seo: {
      seoTitle: "Navigation Complexity Checker",
      seoDescription:
        "Free navigation complexity checker to assess your menu structure. Score your navigation depth and link count for optimal UX.",
      targetKeywords: [
        "navigation complexity",
        "menu structure audit",
        "navigation ux checker",
        "information architecture",
      ],
      shortDescription: "Assess if your menu structure is too deep.",
    },
    inputs: [
      { id: "links", label: "Top Nav Links", type: "number", defaultValue: 5 },
      { id: "levels", label: "Menu Depth Levels", type: "number", defaultValue: 1 },
    ],
    calculate: (inputs) => {
      const links = Number(inputs.links)
      const levels = Number(inputs.levels)
      let score = 100
      const fixes = []

      if (links > 7) {
        score -= (links - 7) * 5
        fixes.push("Reduce top-level items to 5-7 max")
      }
      if (levels > 2) {
        score -= (levels - 2) * 15
        fixes.push("Flatten hierarchy (max 2 levels)")
      }

      score = Math.max(0, score)
      const { label, color } = getScoreMeta(score)
      return { score, label, color, fixes }
    },
  },
  {
    id: "menu-ux-checklist",
    slug: "menu-ux-checklist",
    name: "Menu UX Checklist",
    category: "Navigation",
    description: "Ensure menus are intuitive and usable.",
    howItWorks: "Audit your menu behavior and layout.",
    type: "checklist",
    seo: {
      seoTitle: "Menu UX Checklist for Better Navigation",
      seoDescription:
        "Free menu UX checklist to audit your navigation behavior and layout. Ensure menus are intuitive, clear, and mobile-friendly.",
      targetKeywords: ["menu ux checklist", "navigation design audit", "menu usability", "dropdown menu ux"],
      shortDescription: "Ensure menus are intuitive and usable.",
    },
    checklist: [
      { id: "1", text: "Labels are clear/descriptive", priority: "High" },
      { id: "2", text: "Grouping makes sense", priority: "Medium" },
      { id: "3", text: "Current active state visible", priority: "High" },
      { id: "4", text: "Mobile menu works well", priority: "High" },
      { id: "5", text: "Does not overflow horizontally", priority: "Medium" },
      { id: "6", text: "CTA separated from links", priority: "Medium" },
      { id: "7", text: "No duplicate items", priority: "Low" },
    ],
    calculate: (_, unchecked, tool) => standardChecklistCalc(7, unchecked, tool.checklist!),
  },
  {
    id: "ia-checklist",
    slug: "ia-checklist",
    name: "IA Checklist",
    category: "Navigation",
    description: "Validate your Information Architecture.",
    howItWorks: "Check structure, naming, and hierarchy.",
    type: "checklist",
    seo: {
      seoTitle: "Information Architecture Checklist",
      seoDescription:
        "Free information architecture checklist to validate your site structure. Check naming conventions, hierarchy, and content organization.",
      targetKeywords: [
        "information architecture checklist",
        "ia audit",
        "site structure validation",
        "content hierarchy",
      ],
      shortDescription: "Validate your Information Architecture.",
    },
    checklist: [
      { id: "1", text: "Categories match user mental model", priority: "High" },
      { id: "2", text: "Consistent naming conventions", priority: "Medium" },
      { id: "3", text: "Shallow depth for common tasks", priority: "High" },
      { id: "4", text: "Related items grouped", priority: "Medium" },
      { id: "5", text: "Search supports discovery", priority: "Medium" },
      { id: "6", text: "No orphan pages", priority: "Low" },
    ],
    calculate: (_, unchecked, tool) => standardChecklistCalc(6, unchecked, tool.checklist!),
  },
  {
    id: "breadcrumb-checklist",
    slug: "breadcrumb-checklist",
    name: "Breadcrumb Checklist",
    category: "Navigation",
    description: "Ensure users know where they are.",
    howItWorks: "Verify breadcrumb implementation.",
    type: "checklist",
    seo: {
      seoTitle: "Breadcrumb Navigation Checklist",
      seoDescription:
        "Free breadcrumb checklist to ensure users know where they are. Verify your breadcrumb implementation follows UX best practices.",
      targetKeywords: ["breadcrumb checklist", "breadcrumb navigation ux", "wayfinding design", "navigation audit"],
      shortDescription: "Ensure users know where they are.",
    },
    checklist: [
      { id: "1", text: "Present on deep pages", priority: "High" },
      { id: "2", text: "Reflects hierarchy", priority: "Medium" },
      { id: "3", text: "Parent items clickable", priority: "High" },
      { id: "4", text: "Current page not a link", priority: "Medium" },
      { id: "5", text: "Short/Truncated labels", priority: "Low" },
      { id: "6", text: "Consistent location", priority: "Medium" },
    ],
    calculate: (_, unchecked, tool) => standardChecklistCalc(6, unchecked, tool.checklist!),
  },

  // --- MOBILE ---
  {
    id: "mobile-readiness-checklist",
    slug: "mobile-readiness-checklist",
    name: "Mobile Readiness Checklist",
    category: "Mobile",
    description: "Essentials for a functional mobile web experience.",
    howItWorks: "Audit basic mobile responsiveness.",
    type: "checklist",
    seo: {
      seoTitle: "Mobile Readiness Checklist for Websites",
      seoDescription:
        "Free mobile readiness checklist for essential responsive web design. Audit your site for touch-friendly, mobile-optimized experiences.",
      targetKeywords: ["mobile readiness checklist", "responsive design audit", "mobile optimization", "mobile web ux"],
      shortDescription: "Essentials for a functional mobile web experience.",
    },
    checklist: [
      { id: "1", text: "Tap targets ≥ 44px", priority: "High" },
      { id: "2", text: "Text ≥ 16px", priority: "High" },
      { id: "3", text: "No hover-only interactions", priority: "High" },
      { id: "4", text: "Sticky elements don't block view", priority: "Medium" },
      { id: "5", text: "Inputs use correct keyboard", priority: "Medium" },
      { id: "6", text: "Safe areas respected", priority: "Medium" },
      { id: "7", text: "Images responsive", priority: "Medium" },
      { id: "8", text: "Modals fit screen", priority: "Medium" },
    ],
    calculate: (_, unchecked, tool) => standardChecklistCalc(8, unchecked, tool.checklist!),
  },
  {
    id: "thumb-reach-checker",
    slug: "thumb-reach-checker",
    name: "Thumb Reach Checker",
    category: "Mobile",
    description: "Check if UI elements are reachable single-handed.",
    howItWorks: "Select position of key elements to score reachability.",
    type: "questionnaire",
    seo: {
      seoTitle: "Thumb Reach Checker for Mobile UX",
      seoDescription:
        "Free thumb reach checker for mobile interfaces. Verify if your UI elements are reachable for single-handed phone use.",
      targetKeywords: ["thumb reach checker", "thumb zone mobile", "mobile ergonomics", "one-handed mobile ux"],
      shortDescription: "Check if UI elements are reachable single-handed.",
    },
    inputs: [
      {
        id: "primary",
        label: "Primary Action Position",
        type: "select",
        options: [
          { label: "Bottom Bar", value: 100 },
          { label: "Floating Action Btn (Bottom)", value: 90 },
          { label: "Middle Page", value: 70 },
          { label: "Top Right", value: 40 },
          { label: "Top Left", value: 20 },
        ],
      },
      {
        id: "nav",
        label: "Navigation Style",
        type: "select",
        options: [
          { label: "Bottom Tab", value: 100 },
          { label: "Burger (Top)", value: 50 },
        ],
      },
    ],
    calculate: (inputs) => {
      const p = Number(inputs.primary)
      const n = Number(inputs.nav)
      const score = Math.round((p + n) / 2)
      const { label, color } = getScoreMeta(score)
      const fixes = score < 70 ? ["Move primary actions to the bottom 1/3 of screen"] : []
      return { score, label, color, fixes }
    },
  },
  {
    id: "mobile-form-checklist",
    slug: "mobile-form-checklist",
    name: "Mobile Form Checklist",
    category: "Mobile",
    description: "Optimize forms for touch and small screens.",
    howItWorks: "Specific checks for mobile input experiences.",
    type: "checklist",
    seo: {
      seoTitle: "Mobile Form UX Checklist",
      seoDescription:
        "Free mobile form checklist to optimize forms for touch screens. Ensure your mobile inputs are user-friendly and conversion-ready.",
      targetKeywords: ["mobile form checklist", "mobile input ux", "touch form design", "mobile form optimization"],
      shortDescription: "Optimize forms for touch and small screens.",
    },
    checklist: [
      { id: "1", text: "Correct keyboard types", priority: "High" },
      { id: "2", text: "Autofill supported", priority: "High" },
      { id: "3", text: "Large tappable inputs", priority: "High" },
      { id: "4", text: "Inline errors", priority: "Medium" },
      { id: "5", text: "Sticky submit doesn't cover fields", priority: "Medium" },
      { id: "6", text: "Avoid tiny dropdowns", priority: "Medium" },
    ],
    calculate: (_, unchecked, tool) => standardChecklistCalc(6, unchecked, tool.checklist!),
  },

  // --- ONBOARDING ---
  {
    id: "onboarding-checklist",
    slug: "onboarding-checklist",
    name: "Onboarding Checklist",
    category: "Onboarding",
    description: "Improve user activation and first-run experience.",
    howItWorks: "Check if your onboarding flows are helpful.",
    type: "checklist",
    seo: {
      seoTitle: "User Onboarding Checklist",
      seoDescription:
        "Free user onboarding checklist to improve activation rates. Ensure your first-run experience helps users reach their aha moment quickly.",
      targetKeywords: ["onboarding checklist", "user activation", "first run experience", "onboarding ux"],
      shortDescription: "Improve user activation and first-run experience.",
    },
    checklist: [
      { id: "1", text: "First step is obvious", priority: "High" },
      { id: "2", text: "Shows value quickly (Aha moment)", priority: "High" },
      { id: "3", text: "Avoids account wall if possible", priority: "Medium" },
      { id: "4", text: "Progressive disclosure used", priority: "Medium" },
      { id: "5", text: "Avoids tooltip overload", priority: "Medium" },
      { id: "6", text: "Skip option available", priority: "Medium" },
      { id: "7", text: "Explains key terms", priority: "Low" },
      { id: "8", text: "Celebrates first success", priority: "Low" },
    ],
    calculate: (_, unchecked, tool) => standardChecklistCalc(8, unchecked, tool.checklist!),
  },

  // --- STATES ---
  {
    id: "empty-state-checklist",
    slug: "empty-state-checklist",
    name: "Empty State Checklist",
    category: "States",
    description: "Make empty screens helpful and actionable.",
    howItWorks: "Audit your zero-data states.",
    type: "checklist",
    seo: {
      seoTitle: "Empty State Design Checklist",
      seoDescription:
        "Free empty state checklist to make zero-data screens helpful. Design actionable empty states that guide users to their next step.",
      targetKeywords: ["empty state checklist", "empty state design", "zero data state ux", "blank state patterns"],
      shortDescription: "Make empty screens helpful and actionable.",
    },
    checklist: [
      { id: "1", text: "Explains why it is empty", priority: "High" },
      { id: "2", text: "Shows what to do next", priority: "High" },
      { id: "3", text: "Provides primary CTA", priority: "High" },
      { id: "4", text: "Uses friendly/helpful tone", priority: "Medium" },
      { id: "5", text: "Doesn't blame user", priority: "Medium" },
      { id: "6", text: "Not visually overwhelmed", priority: "Low" },
    ],
    calculate: (_, unchecked, tool) => standardChecklistCalc(6, unchecked, tool.checklist!),
  },
  {
    id: "loading-feedback-checklist",
    slug: "loading-feedback-checklist",
    name: "Loading & Feedback Checklist",
    category: "States",
    description: "Manage user expectations during waits.",
    howItWorks: "Check if your system communicates status well.",
    type: "checklist",
    seo: {
      seoTitle: "Loading State and Feedback Checklist",
      seoDescription:
        "Free loading state checklist to manage user expectations. Ensure your system communicates status clearly during waits and processes.",
      targetKeywords: ["loading state checklist", "loading ux patterns", "feedback states", "skeleton loading"],
      shortDescription: "Manage user expectations during waits.",
    },
    checklist: [
      { id: "1", text: "Shows skeleton for content", priority: "Medium" },
      { id: "2", text: "Shows spinner for short waits", priority: "High" },
      { id: "3", text: "Uses progress for long tasks", priority: "High" },
      { id: "4", text: "Prevents duplicate submits", priority: "High" },
      { id: "5", text: "Disables buttons appropriately", priority: "High" },
      { id: "6", text: "Handles slow network gracefully", priority: "Medium" },
    ],
    calculate: (_, unchecked, tool) => standardChecklistCalc(6, unchecked, tool.checklist!),
  },
  {
    id: "success-state-checklist",
    slug: "success-state-checklist",
    name: "Success State Checklist",
    category: "States",
    description: "Confirm actions clearly to reassure users.",
    howItWorks: "Verify confirmation messages and flows.",
    type: "checklist",
    seo: {
      seoTitle: "Success State UX Checklist",
      seoDescription:
        "Free success state checklist to confirm actions clearly. Design reassuring confirmation messages that guide users to their next step.",
      targetKeywords: [
        "success state checklist",
        "confirmation message ux",
        "success feedback design",
        "action confirmation",
      ],
      shortDescription: "Confirm actions clearly to reassure users.",
    },
    checklist: [
      { id: "1", text: "Confirms action succeeded", priority: "High" },
      { id: "2", text: "Shows next step", priority: "Medium" },
      { id: "3", text: "Allows undo when possible", priority: "Medium" },
      { id: "4", text: "Updates UI immediately", priority: "High" },
      { id: "5", text: "Accessible announcement", priority: "High" },
      { id: "6", text: "Matches user intent", priority: "Medium" },
    ],
    calculate: (_, unchecked, tool) => standardChecklistCalc(6, unchecked, tool.checklist!),
  },
]

// Helper functions
export function getToolBySlug(slug: string): ToolWithSEO | undefined {
  return TOOLS_REGISTRY.find((t) => t.slug === slug)
}

export function getAllToolSlugs(): string[] {
  return TOOLS_REGISTRY.map((t) => t.slug)
}

export function getToolsByCategory(category: ToolCategory): ToolWithSEO[] {
  return TOOLS_REGISTRY.filter((t) => t.category === category)
}

export function getRelatedTools(slug: string, limit = 6): ToolWithSEO[] {
  const tool = getToolBySlug(slug)
  if (!tool) return []
  return TOOLS_REGISTRY.filter((t) => t.category === tool.category && t.slug !== slug).slice(0, limit)
}

// HEURISTICS data for standalone page
export const HEURISTICS = [
  {
    id: 1,
    title: "Visibility of system status",
    description:
      "The system should always keep users informed about what is going on, through appropriate feedback within reasonable time.",
    checklist: [
      "Status is clearly visible",
      "Feedback appears immediately",
      "Progress indicators used for delays",
      'Users know "where" they are',
    ],
  },
  {
    id: 2,
    title: "Match between system and real world",
    description:
      "The system should speak the users language, with words, phrases and concepts familiar to the user, rather than system-oriented terms.",
    checklist: [
      "Language is user-centric",
      "Real-world conventions followed",
      "Icons imply correct meaning",
      "Information appears in logical order",
    ],
  },
  {
    id: 3,
    title: "User control and freedom",
    description:
      'Users often choose system functions by mistake and will need a clearly marked "emergency exit" to leave the unwanted state.',
    checklist: ["Undo/Redo available", "Easy to go back/cancel", "No forced flows", "Exit options clearly marked"],
  },
  {
    id: 4,
    title: "Consistency and standards",
    description:
      "Users should not have to wonder whether different words, situations, or actions mean the same thing. Follow platform conventions.",
    checklist: [
      "Consistent terminology",
      "Standard interface elements",
      "Follows platform guidelines",
      "Actions work predictably",
    ],
  },
  {
    id: 5,
    title: "Error prevention",
    description:
      "Even better than good error messages is a careful design which prevents a problem from occurring in the first place.",
    checklist: [
      "Risky actions require confirmation",
      "Smart defaults provided",
      "Constraints prevent bad input",
      "Forgiving formatting allowed",
    ],
  },
  {
    id: 6,
    title: "Recognition rather than recall",
    description:
      "Minimize the user's memory load by making objects, actions, and options visible. The user should not have to remember information.",
    checklist: [
      "Instructions are visible",
      "Context is preserved",
      "Menus show options clearly",
      "Recent items easily accessible",
    ],
  },
  {
    id: 7,
    title: "Flexibility and efficiency of use",
    description:
      "Accelerators — unseen by the novice user — may often speed up the interaction for the expert user such that the system caters to both.",
    checklist: [
      "Keyboard shortcuts available",
      "Macros/automation possible",
      "Personalization options",
      "System adapts to user pace",
    ],
  },
  {
    id: 8,
    title: "Aesthetic and minimalist design",
    description:
      "Dialogues should not contain information which is irrelevant or rarely needed. Every extra unit of information competes with the relevant units.",
    checklist: [
      "No irrelevant information",
      "Visual hierarchy is strong",
      "High signal-to-noise ratio",
      "Elements aligned effectively",
    ],
  },
  {
    id: 9,
    title: "Help users recognize, diagnose, and recover from errors",
    description:
      "Error messages should be expressed in plain language (no codes), precisely indicate the problem, and constructively suggest a solution.",
    checklist: ["Plain language used", "Problem clearly stated", "Solution suggested", "Polite tone"],
  },
  {
    id: 10,
    title: "Help and documentation",
    description:
      "Even though it is better if the system can be used without documentation, it may be necessary to provide help and documentation.",
    checklist: ["Help is easy to search", "Focused on user tasks", "Steps are concrete", "Not too large/overwhelming"],
  },
]

// LANDING_CHECKLIST data
export const LANDING_CHECKLIST = [
  {
    id: "header",
    title: "Header & Hero Section",
    items: [
      {
        id: "h1",
        text: "Value proposition is clear in 5s",
        tooltip: "Can users tell what you do immediately?",
        priority: 3,
      },
      { id: "h2", text: "Primary CTA is visible", tooltip: "Action button above the fold", priority: 3 },
      { id: "h3", text: "Navigation is minimal", tooltip: "Don't distract from the main goal", priority: 2 },
      { id: "h4", text: "Visual supports the message", tooltip: "Image/Video shows the product", priority: 2 },
    ],
  },
  {
    id: "trust",
    title: "Trust & Social Proof",
    items: [
      { id: "t1", text: "Customer logos/testimonials", tooltip: "Show who trusts you", priority: 2 },
      { id: "t2", text: "Security badges/guarantees", tooltip: "Reduce risk for the user", priority: 1 },
      { id: "t3", text: "Real numbers/data used", tooltip: "Specifics are more believable", priority: 2 },
    ],
  },
  {
    id: "benefits",
    title: "Features & Benefits",
    items: [
      {
        id: "b1",
        text: "Focus on benefits, not just features",
        tooltip: "What does the user get out of it?",
        priority: 3,
      },
      { id: "b2", text: "Easy to scan (bullet points)", tooltip: "Users don't read, they scan", priority: 2 },
      { id: "b3", text: "Addressed objections", tooltip: 'Answer "Why not?"', priority: 2 },
    ],
  },
  {
    id: "conversion",
    title: "Conversion Mechanics",
    items: [
      { id: "c1", text: "Form is short", tooltip: "Only ask for what you need", priority: 3 },
      { id: "c2", text: "CTA stands out visually", tooltip: "Contrast color", priority: 3 },
      { id: "c3", text: "Action verbs in buttons", tooltip: '"Get Started" > "Submit"', priority: 2 },
      { id: "c4", text: "Privacy statement present", tooltip: "Reassure data safety", priority: 1 },
    ],
  },
]
