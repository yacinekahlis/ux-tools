"use client"

import type React from "react"

import { useState, useMemo, useCallback, useEffect } from "react"
import Link from "next/link"
import type { ToolWithSEO } from "@/lib/tools-registry"
import { getRelatedTools } from "@/lib/tools-registry"
import type { ToolResult } from "@/lib/types"
import { PicopiTeaser } from "@/components/picopi-teaser"

// Button component
function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: {
  variant?: "primary" | "secondary" | "ghost" | "danger"
  size?: "sm" | "md" | "lg"
  className?: string
  children: React.ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const baseStyle =
    "inline-flex items-center justify-center font-medium rounded-[6px] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-accent disabled:opacity-50 disabled:cursor-not-allowed"

  const variants = {
    primary: "btn-cta bg-[#f7f8f8] text-[#08090a] hover:bg-[#e0e0e0] shadow-sm",
    secondary: "btn-secondary bg-card border border-border text-textMain hover:border-borderHover",
    ghost: "btn-secondary bg-transparent text-textMuted hover:text-textMain",
    danger: "btn-secondary bg-danger/10 text-danger border border-danger/20 hover:bg-danger/20",
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

// Card component
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-card border border-border rounded-[12px] overflow-hidden ${className}`}>{children}</div>
}

function Select({
  label,
  className = "",
  children,
  ...props
}: { label?: string; className?: string; children: React.ReactNode } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-xs font-semibold uppercase tracking-wider text-textMuted">{label}</label>}
      <div className="select-wrapper">
        <select className={`select-custom ${className}`} {...props}>
          {children}
        </select>
      </div>
    </div>
  )
}

function NumberInput({
  label,
  value,
  onChange,
  placeholder,
  min,
  max,
  step = 1,
}: {
  label?: string
  value: number | string
  onChange: (value: number) => void
  placeholder?: string
  min?: number
  max?: number
  step?: number
}) {
  const handleIncrement = () => {
    const newVal = Number(value) + step
    if (max === undefined || newVal <= max) {
      onChange(newVal)
    }
  }

  const handleDecrement = () => {
    const newVal = Number(value) - step
    if (min === undefined || newVal >= min) {
      onChange(newVal)
    }
  }

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-xs font-semibold uppercase tracking-wider text-textMuted">{label}</label>}
      <div className="number-input-wrapper">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="input-number"
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
        />
        <div className="number-input-controls">
          <button type="button" onClick={handleIncrement} tabIndex={-1}>
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
              <path
                d="M1 5L5 1L9 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button type="button" onClick={handleDecrement} tabIndex={-1}>
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
              <path
                d="M1 1L5 5L9 1"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

function TextInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: "text" | "url" | "email"
}) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-xs font-semibold uppercase tracking-wider text-textMuted">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-text"
        placeholder={placeholder}
      />
    </div>
  )
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
}) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-xs font-semibold uppercase tracking-wider text-textMuted">{label}</label>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-text resize-none"
        placeholder={placeholder}
        rows={rows}
      />
    </div>
  )
}

interface ToolPageProps {
  tool: ToolWithSEO
}

export function ToolPage({ tool }: ToolPageProps) {
  const getInitialInputs = useCallback(() => {
    const init: Record<string, any> = {}
    tool.inputs?.forEach((inp) => {
      if (inp.type === "radio" || inp.type === "select") {
        init[inp.id] = inp.defaultValue ?? inp.options?.[0]?.value ?? ""
      } else if (inp.type === "number") {
        init[inp.id] = inp.defaultValue ?? 0
      } else {
        init[inp.id] = inp.defaultValue ?? ""
      }
    })
    return init
  }, [tool.inputs])

  const [inputs, setInputs] = useState<Record<string, any>>(() => getInitialInputs())

  const [uncheckedIds, setUncheckedIds] = useState<string[]>(() => {
    return tool.checklist ? tool.checklist.map((item) => item.id) : []
  })

  const [resetKey, setResetKey] = useState(0)

  const [scoreAnimKey, setScoreAnimKey] = useState(0)
  const [prevScore, setPrevScore] = useState<number | null>(null)

  const handleInputChange = (id: string, value: any) => {
    setInputs((prev) => ({ ...prev, [id]: value }))
  }

  const toggleCheck = (id: string) => {
    setUncheckedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const handleReset = () => {
    setInputs(getInitialInputs())
    setUncheckedIds(tool.checklist ? tool.checklist.map((item) => item.id) : [])
    setResetKey((prev) => prev + 1)
  }

  const result: ToolResult = useMemo(() => {
    if (tool.calculate) {
      return tool.calculate(inputs, uncheckedIds, tool)
    }
    return { score: 0, label: "Error", color: "text-danger", fixes: [] }
  }, [inputs, uncheckedIds, tool])

  useEffect(() => {
    if (prevScore !== null && prevScore !== result.score) {
      setScoreAnimKey((k) => k + 1)
    }
    setPrevScore(result.score)
  }, [result.score, prevScore])

  const copyResult = () => {
    const text = `${tool.name}: ${result.score}/100 (${result.label})\nFixes:\n${result.fixes.map((f) => `- ${f}`).join("\n")}\n\nChecked via UxTools.dev`
    navigator.clipboard.writeText(text)
    alert("Summary copied!")
  }

  const relatedTools = useMemo(() => getRelatedTools(tool.slug, 6), [tool.slug])

  const primaryKeyword = tool.seo.targetKeywords[0] || ""

  return (
    <div className="max-w-3xl mx-auto space-y-16 animate-page-enter">
      <header className="space-y-6">
        <div className="animate-fade-in-up flex items-center gap-2 text-xs text-textMuted mb-2">
          <Link href="/tools" className="cursor-pointer hover:text-textMain transition-colors">
            &larr; Back to tools
          </Link>
        </div>
        <div className="space-y-3">
          <h1 className="animate-fade-in-up text-3xl md:text-5xl font-bold text-textMain tracking-tight">
            {tool.seo.seoTitle}
          </h1>
          <p className="animate-fade-in-up-delay text-textSecondary text-lg md:text-xl leading-relaxed font-light">
            {tool.seo.shortDescription}{" "}
            {primaryKeyword && (
              <span className="text-textMuted">
                Use this free {primaryKeyword.toLowerCase()} to improve your design.
              </span>
            )}
          </p>
          <p className="animate-fade-in-up-delay-2 text-textMuted text-sm border-l-2 border-border pl-3 italic">
            {tool.howItWorks}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* INPUTS SECTION */}
          {tool.inputs && tool.inputs.length > 0 && (
            <div className="space-y-6 p-6 bg-card border border-border rounded-[12px]" key={`inputs-${resetKey}`}>
              <h3 className="text-xs font-bold text-textMuted uppercase tracking-widest">Configuration</h3>
              <div className="space-y-5">
                {tool.inputs.map((inp) => (
                  <div key={inp.id}>
                    {inp.type === "radio" ? (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-textMain">{inp.label}</label>
                        <div className="flex flex-col gap-2">
                          {inp.options?.map((opt) => (
                            <label key={opt.label} className="flex items-center gap-3 cursor-pointer group">
                              <input
                                type="radio"
                                name={`${inp.id}-${resetKey}`}
                                checked={Number(inputs[inp.id]) === opt.value}
                                onChange={() => handleInputChange(inp.id, opt.value)}
                                className="accent-accent w-4 h-4"
                              />
                              <span className="text-sm text-textSecondary group-hover:text-textMain transition-colors">
                                {opt.label}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ) : inp.type === "select" ? (
                      <Select
                        label={inp.label}
                        value={inputs[inp.id]}
                        onChange={(e) => handleInputChange(inp.id, e.target.value)}
                      >
                        {inp.options?.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </Select>
                    ) : inp.type === "number" ? (
                      <NumberInput
                        label={inp.label}
                        value={inputs[inp.id]}
                        onChange={(val) => handleInputChange(inp.id, val)}
                        placeholder={inp.placeholder}
                      />
                    ) : inp.type === "textarea" ? (
                      <TextArea
                        label={inp.label}
                        value={inputs[inp.id]}
                        onChange={(val) => handleInputChange(inp.id, val)}
                        placeholder={inp.placeholder}
                      />
                    ) : (
                      <TextInput
                        label={inp.label}
                        value={inputs[inp.id]}
                        onChange={(val) => handleInputChange(inp.id, val)}
                        placeholder={inp.placeholder}
                        type={inp.type as "text" | "url" | "email"}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CHECKLIST SECTION */}
          {tool.checklist && tool.checklist.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-textMuted uppercase tracking-widest pl-1">Audit Items</h3>
              <div className="space-y-3">
                {tool.checklist.map((item) => {
                  const isChecked = !uncheckedIds.includes(item.id)
                  return (
                    <label
                      key={item.id}
                      className={`flex items-start gap-4 p-4 rounded-[8px] border transition-all cursor-pointer group select-none ${isChecked ? "bg-card border-borderHover" : "bg-card border-border hover:border-borderHover"}`}
                    >
                      <div
                        className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded-[3px] border flex items-center justify-center transition-all ${isChecked ? "bg-textMain border-textMain animate-check" : "border-border group-hover:border-borderHover bg-transparent"}`}
                      >
                        {isChecked && (
                          <svg
                            className="w-3 h-3 text-background"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={isChecked}
                        onChange={() => toggleCheck(item.id)}
                      />
                      <div>
                        <div
                          className={`text-sm font-medium transition-colors ${isChecked ? "text-textMain" : "text-textSecondary"}`}
                        >
                          {item.text}
                        </div>
                        {item.priority && (
                          <div className="text-[10px] text-textMuted mt-1 uppercase tracking-wider">
                            Priority: {item.priority}
                          </div>
                        )}
                      </div>
                    </label>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* SCORE PANEL */}
        <div className="space-y-6">
          <Card className="p-6 sticky top-24 shadow-xl shadow-black/40">
            <div className="text-center mb-6 pt-2">
              <div className="text-[10px] text-textMuted uppercase tracking-widest font-bold mb-2">Verdict</div>
              <div
                key={scoreAnimKey}
                className={`text-5xl font-bold mb-2 tracking-tight ${result.color} ${scoreAnimKey > 0 ? "animate-score" : ""}`}
              >
                {result.score}
              </div>
              <div className="text-sm font-medium text-textMain">{result.label}</div>
            </div>

            {result.fixes.length > 0 && (
              <div className="border-t border-border pt-4 mb-6">
                <h4 className="text-[10px] font-bold text-textMuted uppercase tracking-widest mb-3">Priority Fixes</h4>
                <ul className="space-y-2">
                  {result.fixes.slice(0, 5).map((fix, i) => (
                    <li key={i} className="text-xs text-textSecondary leading-relaxed flex items-start gap-2">
                      <span className="text-danger mt-1 text-[8px] flex-shrink-0">●</span>
                      <span>{fix}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-2">
              <Button variant="primary" className="w-full" onClick={copyResult}>
                Copy Summary
              </Button>
              <Button variant="ghost" className="w-full text-xs" onClick={handleReset}>
                Reset
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {relatedTools.length > 0 && (
        <section className="border-t border-border pt-12">
          <h2 className="text-lg font-semibold text-textMain mb-6">Related Tools in {tool.category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedTools.map((related, index) => (
              <Link
                key={related.slug}
                href={`/tools/${related.slug}`}
                className={`card-hover animate-card animate-card-${Math.min(index + 1, 6)} block p-4 bg-card border border-border rounded-[8px] group`}
              >
                <h3 className="text-sm font-medium text-textMain group-hover:text-accent transition-colors">
                  {related.name}
                </h3>
                <p className="text-xs text-textMuted mt-1 line-clamp-2">{related.seo.shortDescription}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <PicopiTeaser variant="tool" />
    </div>
  )
}
