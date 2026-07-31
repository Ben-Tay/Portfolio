import { Briefcase, GraduationCap, Download } from "lucide-react"

interface Experience {
  role: string
  company: string
  period: string
  description: string
  highlights: string[]
}

const experiences: Experience[] = [
  {
    role: "Senior Software Engineer",
    company: "Tech Corp",
    period: "Jan 2024 — Present",
    description: "Leading development of customer-facing web applications.",
    highlights: [
      "Architected and built a real-time analytics dashboard serving 10k+ users",
      "Led migration from legacy codebase to Next.js, reducing load times by 60%",
      "Mentored 3 junior engineers through structured code reviews and pairing",
    ],
  },
  {
    role: "Full-Stack Developer",
    company: "StartupXYZ",
    period: "Jun 2022 — Dec 2023",
    description: "Built core product features across the full stack.",
    highlights: [
      "Developed AI-powered chat assistant using LangChain and RAG pipelines",
      "Designed and implemented RESTful APIs handling 1M+ requests/day",
      "Reduced infrastructure costs by 40% through optimized database queries",
    ],
  },
  {
    role: "Software Engineer",
    company: "Digital Agency Co",
    period: "Mar 2021 — May 2022",
    description: "Delivered client projects with modern web technologies.",
    highlights: [
      "Built 5+ production React applications for enterprise clients",
      "Introduced TypeScript across the team, reducing runtime errors by 50%",
      "Implemented CI/CD pipelines improving deployment frequency by 3x",
    ],
  },
  {
    role: "Junior Developer",
    company: "WebWorks",
    period: "Aug 2020 — Feb 2021",
    description: "Started career building and maintaining client websites.",
    highlights: [
      "Developed responsive landing pages and email templates",
      "Collaborated with designers to implement pixel-perfect UIs",
      "Wrote unit tests achieving 85% code coverage",
    ],
  },
]

const education = [
  {
    degree: "B.S. Computer Science",
    school: "National University of Singapore",
    period: "2016 — 2020",
  },
]

export default function ResumePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Resume</h1>
        <a
          href="#"
          className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-background px-2.5 text-sm font-medium text-foreground shadow-xs transition-all hover:bg-muted hover:text-foreground"
        >
          <Download className="size-4" /> Download PDF
        </a>
      </div>

      <section className="mt-12">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Briefcase className="size-5 text-primary" />
          Experience
        </h2>

        <div className="relative mt-6 pl-8 before:absolute before:bottom-0 before:left-[11px] before:top-0 before:w-px before:bg-border">
          {experiences.map((exp) => (
            <div key={`${exp.company}-${exp.role}`} className="relative pb-10 last:pb-0">
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
                  {exp.highlights.map((h) => (
                    <li key={h} className="flex gap-2 text-sm text-muted-foreground">
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
          {education.map((edu) => (
            <div
              key={edu.degree}
              className="rounded-xl border border-border bg-card p-5"
            >
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
