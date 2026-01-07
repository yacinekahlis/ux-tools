import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getToolBySlug, getAllToolSlugs, SITE_URL } from "@/lib/tools-registry"
import { ToolPage } from "@/components/tool-page"

interface ToolPageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getAllToolSlugs().map((slug) => ({
    slug,
  }))
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params
  const tool = getToolBySlug(slug)

  if (!tool) {
    return {
      title: "Tool Not Found",
    }
  }

  const canonicalUrl = `${SITE_URL}/tools/${tool.slug}`

  return {
    title: tool.seo.seoTitle,
    description: tool.seo.seoDescription,
    keywords: tool.seo.targetKeywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: tool.seo.seoTitle,
      description: tool.seo.seoDescription,
      type: "website",
      url: canonicalUrl,
    },
  }
}

export default async function ToolPageRoute({ params }: ToolPageProps) {
  const { slug } = await params
  const tool = getToolBySlug(slug)

  if (!tool) {
    notFound()
  }

  return <ToolPage tool={tool} />
}
