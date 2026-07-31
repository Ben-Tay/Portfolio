"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Briefcase, Code, Cpu, ExternalLink, Check, Pencil, Plus, Trash2, X } from "lucide-react"
import { ScrollAnimation, StaggerContainer, StaggerItem } from "@/components/ui/scroll-animation"
import { useAdmin } from "@/lib/admin-context"

interface Strength {
  title: string
  description: string
}

interface FeaturedProject {
  title: string
  description: string
  tags: string[]
}

const strengthIcons = [Code, Cpu, Briefcase]

const emptyStrength: Strength = { title: "", description: "" }

const clone = (value: Strength[]): Strength[] => JSON.parse(JSON.stringify(value))

interface HighlightsSectionInnerProps {
  strengths: Strength[]
  projects?: { entries: FeaturedProject[] }
  onSave: (value: Strength[]) => void
}

export function HighlightsSectionInner({ strengths, projects, onSave }: HighlightsSectionInnerProps) {
  const { isAdmin } = useAdmin()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<Strength[]>([])
  const [draftIdx, setDraftIdx] = useState<number | null>(null)

  const featuredProjects = (projects?.entries ?? []).slice(0, 3)

  const enterEdit = () => {
    setDraft(clone(strengths))
    setEditing(true)
  }

  const saveEdit = () => {
    onSave(draft)
    setEditing(false)
  }

  const cancelEdit = () => {
    setDraft(clone(strengths))
    setEditing(false)
    setDraftIdx(null)
  }

  const addStrength = () => {
    const d = clone(draft)
    d.push(emptyStrength)
    setDraft(d)
    setDraftIdx(d.length - 1)
  }

  const removeStrength = (i: number) => {
    const d = clone(draft)
    d.splice(i, 1)
    setDraft(d)
    setDraftIdx(null)
  }

  const updateStrength = (i: number, field: "title" | "description", value: string) => {
    const d = clone(draft)
    d[i][field] = value
    setDraft(d)
  }

  const list = editing ? draft : strengths

  return (
    <section className="border-b border-border py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          <ScrollAnimation direction="left">
            <div className="flex items-center justify-between">
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Key Strengths
              </h2>
              <div className="flex items-center gap-3">
                {isAdmin && !editing && (
                  <button onClick={enterEdit} className="inline-flex h-7 items-center gap-1.5 rounded-md border border-primary/40 bg-card px-2.5 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground">
                    <Pencil className="size-3" />Edit All
                  </button>
                )}
                {isAdmin && editing && (
                  <>
                    <button onClick={saveEdit} className="inline-flex h-7 items-center gap-1.5 rounded-md bg-primary px-2.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                      <Check className="size-3" />Save
                    </button>
                    <button onClick={cancelEdit} className="inline-flex h-7 items-center gap-1.5 rounded-md border border-border bg-card px-2.5 text-xs font-medium text-card-foreground transition-colors hover:bg-muted">
                      <X className="size-3" />Cancel
                    </button>
                  </>
                )}
              </div>
            </div>

            <StaggerContainer className="mt-6 space-y-6" delay={0.1}>
              {list.map((item, i) => {
                const Icon = strengthIcons[i % strengthIcons.length]
                return (
                  <StaggerItem key={i}>
                    <div className="group flex gap-4">
                      <div className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-gradient-to-br from-primary/10 to-accent/10">
                        <Icon className="size-5 text-primary" />
                      </div>
                      {editing && draftIdx === i ? (
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            value={draft[i].title}
                            onChange={(e) => updateStrength(i, "title", e.target.value)}
                            className="w-full rounded border border-primary/40 bg-background px-2 py-0.5 text-sm font-semibold text-foreground outline-none"
                            autoFocus
                          />
                          <textarea
                            value={draft[i].description}
                            onChange={(e) => updateStrength(i, "description", e.target.value)}
                            rows={2}
                            className="w-full rounded border border-primary/40 bg-background px-2 py-1 text-sm text-foreground outline-none"
                          />
                          <div className="flex gap-2">
                            <button onClick={() => setDraftIdx(null)} className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                              <Check className="size-3.5" />Done
                            </button>
                            <button onClick={() => removeStrength(i)} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive">
                              <Trash2 className="size-3.5" />Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{item.title}</h3>
                          <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                          {isAdmin && editing && (
                            <button onClick={() => setDraftIdx(i)} className="mt-1 text-xs text-primary">
                              Edit
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </StaggerItem>
                )
              })}
              {isAdmin && editing && (
                <StaggerItem>
                  <button onClick={addStrength} className="inline-flex items-center gap-1.5 text-xs font-medium text-primary">
                    <Plus className="size-3.5" />Add strength
                  </button>
                </StaggerItem>
              )}
            </StaggerContainer>

            <div className="mt-8">
              <Link
                href="#resume"
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-sm font-medium text-card-foreground shadow-xs transition-all hover:bg-accent hover:text-accent-foreground"
              >
                Full Resume <ArrowRight className="size-4" />
              </Link>
            </div>
          </ScrollAnimation>

          <ScrollAnimation direction="right" delay={0.1}>
            <div>
              <div className="flex items-center justify-between">
                <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Featured Projects
                </h2>
                <span className="text-xs text-muted-foreground">From your projects</span>
              </div>
              {featuredProjects.length > 0 ? (
                <StaggerContainer className="mt-6 space-y-4" delay={0.2}>
                  {featuredProjects.map((project, i) => (
                    <StaggerItem key={i}>
                      <Link
                        href="#projects"
                        className="group block rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-md hover:shadow-primary/5"
                      >
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold text-card-foreground group-hover:text-primary">
                            {project.title}
                          </h3>
                          <ExternalLink className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{project.description}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {project.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-md bg-primary/5 px-2 py-0.5 text-xs font-medium text-primary"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </Link>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              ) : (
                <p className="mt-6 text-sm text-muted-foreground">
                  Add projects in the Projects section below and they&apos;ll appear here.
                </p>
              )}

              <div className="mt-6">
                <Link
                  href="#projects"
                  className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-sm font-medium text-card-foreground shadow-xs transition-all hover:bg-accent hover:text-accent-foreground"
                >
                  All Projects <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  )
}
