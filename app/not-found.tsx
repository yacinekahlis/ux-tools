import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
      <h1 className="text-4xl font-bold text-textMain">Tool Not Found</h1>
      <p className="text-textSecondary max-w-md">
        The tool you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <Link
        href="/tools"
        className="inline-flex items-center justify-center px-6 py-3 bg-[#f7f8f8] text-[#08090a] font-medium rounded-[6px] hover:bg-[#e0e0e0] transition-all"
      >
        Browse all tools &rarr;
      </Link>
    </div>
  )
}
