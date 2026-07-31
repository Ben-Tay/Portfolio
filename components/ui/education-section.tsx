"use client"

import { useState } from "react"
import { GraduationCap, Check, Pencil, X, Plus, Trash2 } from "lucide-react"
import { ScrollAnimation } from "@/components/ui/scroll-animation"
import { useAdmin } from "@/lib/admin-context"

interface EducationEntry {
  degree: string
  school: string
  period: string
}

interface EducationData {
  entries: EducationEntry[]
}

interface EducationSectionInnerProps {
  education: EducationData
  onSave: (value: EducationData) => void
}

const clone = (value: EducationData): EducationData => JSON.parse(JSON.stringify(value))

export function EducationSectionInner({ education, onSave }: EducationSectionInnerProps) {
  const { isAdmin } = useAdmin()
  const [editing, setEditing] = useState<{ index: number; field?: string } | null>(null)
  const [draft, setDraft] = useState("")
  const [bulkEdit, setBulkEdit] = useState(false)
  const [bulkDraft, setBulkDraft] = useState<EducationData>(education)

  const startEdit = (index: number, field: string, current: string) => {
    setEditing({ index, field })
    setDraft(current)
  }

  const cancelEdit = () => {
    setEditing(null)
    setDraft("")
  }

  const confirmEdit = () => {
    if (!editing) return
    const updated = clone(education)
    const edu = updated.entries[editing.index]
    if (edu && editing.field && editing.field in edu) {
      ;(edu as unknown as Record<string, string>)[editing.field] = draft
    }
    onSave(updated)
    setEditing(null)
  }

  const addEntry = () => {
    const updated = clone(education)
    updated.entries.push({ degree: "New Degree", school: "New School", period: "" })
    onSave(updated)
  }

  const removeEntry = (index: number) => {
    const updated = clone(education)
    updated.entries.splice(index, 1)
    onSave(updated)
  }

  const enterBulkEdit = () => {
    setBulkDraft(clone(education))
    setBulkEdit(true)
  }

  const saveBulkEdit = () => {
    onSave(bulkDraft)
    setBulkEdit(false)
  }

  const cancelBulkEdit = () => {
    setBulkDraft(education)
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
    <section className="border-b border-border py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <ScrollAnimation>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="size-5 text-primary" />
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Education</h2>
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
            </div>
          </div>
          <div className="mt-6 space-y-4">
            {(bulkEdit ? bulkDraft.entries : education.entries).map((edu, i) => (
              <div key={i} className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/20 hover:shadow-sm">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-card-foreground">
                      {bulkEdit ? (
                        <input type="text" value={bulkDraft.entries[i].degree} onChange={(e) => { const d = clone(bulkDraft); d.entries[i].degree = e.target.value; setBulkDraft(d) }} className="w-full rounded border border-primary/40 bg-background px-2 py-0.5 text-sm text-foreground outline-none" />
                      ) : editing?.index === i && editing?.field === "degree" ? inlineInput() : (
                        <span className="inline-flex items-center gap-1">
                          {edu.degree}
                          {isAdmin && <button onClick={() => startEdit(i, "degree", edu.degree)} className="opacity-0 transition-opacity group-hover:opacity-100"><Pencil className="size-3 text-muted-foreground" /></button>}
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {bulkEdit ? (
                        <input type="text" value={bulkDraft.entries[i].school} onChange={(e) => { const d = clone(bulkDraft); d.entries[i].school = e.target.value; setBulkDraft(d) }} className="w-full rounded border border-primary/40 bg-background px-2 py-0.5 text-sm text-foreground outline-none" />
                      ) : editing?.index === i && editing?.field === "school" ? inlineInput() : (
                        <span className="inline-flex items-center gap-1">
                          {edu.school}
                          {isAdmin && <button onClick={() => startEdit(i, "school", edu.school)} className="opacity-0 transition-opacity group-hover:opacity-100"><Pencil className="size-3 text-muted-foreground" /></button>}
                        </span>
                      )}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-md bg-primary/5 px-2 py-0.5 text-xs font-medium text-primary">
                    {bulkEdit ? (
                      <input type="text" value={bulkDraft.entries[i].period} onChange={(e) => { const d = clone(bulkDraft); d.entries[i].period = e.target.value; setBulkDraft(d) }} className="w-32 rounded border border-primary/40 bg-background px-2 py-0.5 text-xs text-foreground outline-none" />
                    ) : editing?.index === i && editing?.field === "period" ? inlineInput() : (
                      <span className="inline-flex items-center gap-1">
                        {edu.period}
                        {isAdmin && <button onClick={() => startEdit(i, "period", edu.period)} className="opacity-0 transition-opacity group-hover:opacity-100"><Pencil className="size-3 text-muted-foreground" /></button>}
                      </span>
                    )}
                  </span>
                </div>
                {isAdmin && (
                  <div className="mt-3 flex justify-end border-t border-border pt-3">
                    <button onClick={() => removeEntry(i)} className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-destructive">
                      <Trash2 className="size-3" />Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          {isAdmin && (
            <button onClick={addEntry} className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-dashed border-primary/40 bg-card px-3 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground">
              <Plus className="size-3.5" />Add education
            </button>
          )}
        </ScrollAnimation>
      </div>
    </section>
  )
}
