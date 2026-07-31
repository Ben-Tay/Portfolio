"use client"

import { useState } from "react"
import { Briefcase, Check, Download, Pencil, X, Plus, Trash2 } from "lucide-react"
import { ScrollAnimation, StaggerContainer, StaggerItem } from "@/components/ui/scroll-animation"
import { useAdmin } from "@/lib/admin-context"

interface ExperienceEntry {
  role: string
  company: string
  type: string
  period: string
  description: string
  highlights: string[]
}

interface ExperienceData {
  entries: ExperienceEntry[]
  education: { degree: string; school: string; period: string }[]
}

interface ResumeSectionInnerProps {
  experience: ExperienceData
  onSave: (value: ExperienceData) => void
}

const clone = (value: ExperienceData): ExperienceData => JSON.parse(JSON.stringify(value))

export function ResumeSectionInner({ experience, onSave }: ResumeSectionInnerProps) {
  const { isAdmin } = useAdmin()
  const [editing, setEditing] = useState<{
    type: "entry" | null
    index: number
    field?: string
  } | null>(null)
  const [draft, setDraft] = useState("")
  const [bulkEdit, setBulkEdit] = useState(false)
  const [bulkDraft, setBulkDraft] = useState<ExperienceData>(experience)

  const startEdit = (type: "entry", index: number, field: string, current: string) => {
    setEditing({ type, index, field })
    setDraft(current)
  }

  const cancelEdit = () => {
    setEditing(null)
    setDraft("")
  }

  const confirmEdit = () => {
    if (!editing) return
    const updated = clone(experience)
    if (editing.type === "entry") {
      const entry = updated.entries[editing.index]
      if (entry && editing.field) {
        if (editing.field.startsWith("highlight-")) {
          const hi = Number(editing.field.split("-")[1])
          if (Number.isInteger(hi) && entry.highlights[hi] !== undefined) {
            entry.highlights[hi] = draft
          }
        } else if (editing.field in entry) {
          ;(entry as unknown as Record<string, string>)[editing.field] = draft
        }
      }
    }
    onSave(updated)
    setEditing(null)
  }

  const addEntry = () => {
    const updated = clone(experience)
    updated.entries.push({ role: "New Role", company: "New Company", type: "", period: "", description: "", highlights: [] })
    onSave(updated)
  }

  const removeEntry = (index: number) => {
    const updated = clone(experience)
    updated.entries.splice(index, 1)
    onSave(updated)
  }

  const addHighlight = (entryIndex: number) => {
    const updated = clone(experience)
    updated.entries[entryIndex].highlights.push("New highlight")
    onSave(updated)
  }

  const removeHighlight = (entryIndex: number, highlightIndex: number) => {
    const updated = clone(experience)
    updated.entries[entryIndex].highlights.splice(highlightIndex, 1)
    onSave(updated)
  }

  const enterBulkEdit = () => {
    setBulkDraft(clone(experience))
    setBulkEdit(true)
  }

  const saveBulkEdit = () => {
    onSave(bulkDraft)
    setBulkEdit(false)
  }

  const cancelBulkEdit = () => {
    setBulkDraft(experience)
    setBulkEdit(false)
  }

  const inlineInput = () => (
    <span className="inline-flex items-center gap-1">
      <input
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        className="w-40 rounded border border-primary/40 bg-background px-2 py-0.5 text-sm outline-none"
        autoFocus
        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); confirmEdit() }; if (e.key === "Escape") cancelEdit() }}
      />
      <button onClick={confirmEdit} className="text-primary hover:text-primary/80"><Check className="size-3.5" /></button>
      <button onClick={cancelEdit} className="text-muted-foreground hover:text-foreground"><X className="size-3.5" /></button>
    </span>
  )

  return (
    <section id="resume" className="border-b border-border py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <ScrollAnimation>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="size-5 text-primary" />
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Experience</h2>
            </div>
            <div className="flex items-center gap-3">
              {isAdmin && !bulkEdit && (
                <button onClick={enterBulkEdit} className="inline-flex h-8 items-center gap-1.5 rounded-md border border-primary/40 bg-card px-3 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground">
                  <Pencil className="size-3.5" />Edit All
                </button>
              )}
              {isAdmin && bulkEdit && (
                <>
                  <button onClick={saveBulkEdit} className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                    <Check className="size-3.5" />Save All
                  </button>
                  <button onClick={cancelBulkEdit} className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-xs font-medium text-card-foreground transition-colors hover:bg-muted">
                    <X className="size-3.5" />Cancel
                  </button>
                </>
              )}
              <a href="#" className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-xs font-medium text-card-foreground transition-colors hover:bg-accent">
                <Download className="size-3.5" />PDF
              </a>
            </div>
          </div>
        </ScrollAnimation>

        <div className="relative mt-10 pl-8 before:absolute before:bottom-0 before:left-[11px] before:top-0 before:w-px before:bg-gradient-to-b before:from-primary/30 before:to-primary/10">
          <StaggerContainer delay={0.1}>
            {(bulkEdit ? bulkDraft.entries : experience.entries).map((exp, i) => (
              <StaggerItem key={i}>
                <div className="relative pb-10 last:pb-0">
                  <div className="absolute -left-8 mt-1.5 flex size-6 items-center justify-center rounded-full border-2 border-primary/20 bg-background">
                    <div className="size-2 rounded-full bg-primary" />
                  </div>
                  <div className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/20 hover:shadow-sm">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="font-semibold text-card-foreground">
                          {bulkEdit ? (
                            <input type="text" value={bulkDraft.entries[i].role} onChange={(e) => { const d = clone(bulkDraft); d.entries[i].role = e.target.value; setBulkDraft(d) }} className="w-full rounded border border-primary/40 bg-background px-2 py-0.5 text-sm text-foreground outline-none" />
                          ) : editing?.type === "entry" && editing?.index === i && editing?.field === "role" ? inlineInput() : (
                            <span className="inline-flex items-center gap-1">
                              {exp.role}
                              {isAdmin && <button onClick={() => startEdit("entry", i, "role", exp.role)} className="opacity-0 transition-opacity group-hover:opacity-100"><Pencil className="size-3 text-muted-foreground" /></button>}
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {bulkEdit ? (
                            <input type="text" value={bulkDraft.entries[i].company} onChange={(e) => { const d = clone(bulkDraft); d.entries[i].company = e.target.value; setBulkDraft(d) }} className="w-full rounded border border-primary/40 bg-background px-2 py-0.5 text-sm text-foreground outline-none" />
                          ) : editing?.type === "entry" && editing?.index === i && editing?.field === "company" ? inlineInput() : (
                            <span className="inline-flex items-center gap-1">
                              {exp.company}
                              {isAdmin && <button onClick={() => startEdit("entry", i, "company", exp.company)} className="opacity-0 transition-opacity group-hover:opacity-100"><Pencil className="size-3 text-muted-foreground" /></button>}
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1.5">
                        {isAdmin ? (
                          <select
                            value={bulkEdit ? (bulkDraft.entries[i].type || "") : (exp.type || "")}
                            onChange={(e) => {
                              const v = e.target.value
                              if (bulkEdit) {
                                const d = clone(bulkDraft)
                                d.entries[i].type = v
                                setBulkDraft(d)
                              } else {
                                const updated = clone(experience)
                                updated.entries[i].type = v
                                onSave(updated)
                              }
                            }}
                            className="rounded-md border border-primary/40 bg-background px-2 py-0.5 text-xs font-medium text-primary outline-none"
                          >
                            <option value="">Role type</option>
                            <option value="Internship">Internship</option>
                            <option value="Full-time">Full-time</option>
                          </select>
                        ) : (
                          exp.type && (
                            <span className="rounded-md bg-primary/5 px-2 py-0.5 text-xs font-medium text-primary">
                              {exp.type}
                            </span>
                          )
                        )}
                        <span className="rounded-md bg-primary/5 px-2 py-0.5 text-xs font-medium text-primary">
                          {bulkEdit ? (
                            <input type="text" value={bulkDraft.entries[i].period} onChange={(e) => { const d = clone(bulkDraft); d.entries[i].period = e.target.value; setBulkDraft(d) }} className="w-32 rounded border border-primary/40 bg-background px-2 py-0.5 text-xs text-foreground outline-none" />
                          ) : editing?.type === "entry" && editing?.index === i && editing?.field === "period" ? inlineInput() : (
                            <span className="inline-flex items-center gap-1">
                              {exp.period}
                              {isAdmin && <button onClick={() => startEdit("entry", i, "period", exp.period)} className="opacity-0 transition-opacity group-hover:opacity-100"><Pencil className="size-3 text-muted-foreground" /></button>}
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                    <ul className="mt-3 space-y-1.5">
                      {(bulkEdit ? bulkDraft.entries[i].highlights : exp.highlights).map((h, hi) => (
                        <li key={hi} className="flex gap-2 text-sm text-muted-foreground">
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/40" />
                          {bulkEdit ? (
                            <span className="inline-flex items-center gap-1 flex-1">
                              <input type="text" value={bulkDraft.entries[i].highlights[hi]} onChange={(e) => { const d = clone(bulkDraft); d.entries[i].highlights[hi] = e.target.value; setBulkDraft(d) }} className="flex-1 rounded border border-primary/40 bg-background px-2 py-0.5 text-sm text-foreground outline-none" />
                              <button onClick={() => { const d = clone(bulkDraft); d.entries[i].highlights.splice(hi, 1); setBulkDraft(d) }} className="text-muted-foreground hover:text-destructive"><X className="size-3" /></button>
                            </span>
                          ) : editing?.type === "entry" && editing?.index === i && editing?.field === `highlight-${hi}` ? (
                            <span className="inline-flex items-center gap-1 flex-1">
                              <input type="text" value={draft} onChange={(e) => setDraft(e.target.value)} className="flex-1 rounded border border-primary/40 bg-background px-2 py-0.5 text-sm outline-none" autoFocus />
                              <button onClick={confirmEdit} className="text-primary"><Check className="size-3.5" /></button>
                              <button onClick={cancelEdit} className="text-muted-foreground"><X className="size-3.5" /></button>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 flex-1">
                              {h}
                              {isAdmin && (
                                <span className="hidden group-hover:inline-flex gap-0.5">
                                  <button onClick={() => startEdit("entry", i, `highlight-${hi}`, h)} className="text-muted-foreground hover:text-foreground"><Pencil className="size-3" /></button>
                                  <button onClick={() => removeHighlight(i, hi)} className="text-muted-foreground hover:text-destructive"><X className="size-3" /></button>
                                </span>
                              )}
                            </span>
                          )}
                        </li>
                      ))}
                      {isAdmin && (
                        <li>
                          {bulkEdit ? (
                            <button onClick={() => { const d = clone(bulkDraft); d.entries[i].highlights.push(""); setBulkDraft(d) }} className="text-xs text-muted-foreground hover:text-primary"><Plus className="mr-0.5 inline size-3" />Add highlight</button>
                          ) : (
                            <button onClick={() => addHighlight(i)} className="text-xs text-muted-foreground hover:text-primary"><Plus className="mr-0.5 inline size-3" />Add highlight</button>
                          )}
                        </li>
                      )}
                    </ul>
                    {isAdmin && (
                      <div className="mt-3 flex justify-end border-t border-border pt-3">
                        <button onClick={() => removeEntry(i)} className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-destructive">
                          <Trash2 className="size-3" />Delete entry
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
          {isAdmin && (
            <button onClick={addEntry} className="ml-8 inline-flex items-center gap-1.5 rounded-md border border-dashed border-primary/40 bg-card px-3 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground">
              <Plus className="size-3.5" />Add experience
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
