"use client"

import { Download } from "lucide-react"

export function DownloadResumeButton({ className, label = "PDF" }: { className?: string; label?: string }) {
  return (
    <button onClick={() => window.print()} className={className}>
      <Download className="size-4" />{label}
    </button>
  )
}
