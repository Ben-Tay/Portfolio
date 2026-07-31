"use client"

import { Briefcase, GraduationCap } from "lucide-react"
import { DownloadResumeButton } from "@/components/ui/download-resume-button"
import { useContent } from "@/lib/use-content"

export default function ResumePage() {
  const { data } = useContent()
  const experiences = data?.experience?.entries ?? []
  const education = data?.experience?.education ?? []

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Resume</h1>
        <DownloadResumeButton label="Download PDF" className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-background px-2.5 text-sm font-medium text-foreground shadow-xs transition-all hover:bg-muted hover:text-foreground" />
      </div>

      <section className="mt-12">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Briefcase className="size-5 text-primary" />
          Experience
        </h2>

        <div className="relative mt-6 pl-8 before:absolute before:bottom-0 before:left-[11px] before:top-0 before:w-px before:bg-border">
          {experiences.map((exp, i) => (
            <div key={`${exp.company}-${exp.role}-${i}`} className="relative pb-10 last:pb-0">
              <div className="absolute -left-8 mt-1.5 flex size-6 items-center justify-center rounded-full border-2 border-border bg-background">
                <div className="size-2 rounded-full bg-primary" />
              </div>

              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-card-foreground">{exp.role}</h3>
                    <p className="text-sm text-muted-foreground">{exp.company}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{exp.period}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{exp.description}</p>
                <ul className="mt-3 space-y-1.5">
                  {(exp.highlights ?? []).map((h, hi) => (
                    <li key={hi} className="flex gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-muted-foreground/40" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <GraduationCap className="size-5 text-primary" />
          Education
        </h2>

        <div className="mt-6 space-y-4">
          {education.map((edu, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-5">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-semibold text-card-foreground">{edu.degree}</h3>
                  <p className="text-sm text-muted-foreground">{edu.school}</p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">{edu.period}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
