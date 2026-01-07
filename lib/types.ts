export type ToolCategory =
  | "General"
  | "Conversion"
  | "Forms"
  | "Accessibility"
  | "Navigation"
  | "Mobile"
  | "Onboarding"
  | "States"

export type ToolType = "checklist" | "calculator" | "validator" | "questionnaire"

export interface ToolInput {
  id: string
  label: string
  type: "number" | "text" | "select" | "radio"
  options?: { label: string; value: any }[]
  defaultValue?: any
  placeholder?: string
  helperText?: string
}

export interface ChecklistItem {
  id: string
  text: string
  tooltip?: string
  priority: "High" | "Medium" | "Low"
}

export interface ToolResult {
  score: number
  label: string
  color: string
  fixes: string[]
  details?: string[]
}

export interface ToolDef {
  id: string
  slug: string
  name: string
  category: ToolCategory
  description: string
  howItWorks: string
  type: ToolType
  inputs?: ToolInput[]
  checklist?: ChecklistItem[]
  calculate?: (inputs: Record<string, any>, uncheckedIds: string[], tool: ToolDef) => ToolResult
}

export interface HeuristicScoreState {
  severity: number
  uncheckedItems: number[]
}

export type LandingPageScoreState = Record<string, any>
