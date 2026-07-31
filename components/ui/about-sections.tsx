"use client"

import { useState } from "react"
import { Code, Cpu, BookOpen, Check, Pencil, Plus, Trash2, X } from "lucide-react"
import { ScrollAnimation } from "@/components/ui/scroll-animation"
import { useAdmin } from "@/lib/admin-context"

interface AboutSectionProps {
  about?: {
    bio?: string[]
    roles?: string[]
    passions?: { title: string; description: string }[]
    hobbies?: string[]
  }
  onSave: (value: { bio: string[]; roles: string[]; passions: { title: string; description: string }[]; hobbies: string[] }) => void
}

const passionIcons = [Code, Cpu, BookOpen]

interface AboutData {
  bio: string[]
  roles: string[]
  passions: { title: string; description: string }[]
  hobbies: string[]
}

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value))

const emptyAbout: AboutData = { bio: [], roles: [], passions: [], hobbies: [] }

export function AboutSections({ about, onSave }: AboutSectionProps) {
  const { isAdmin } = useAdmin()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<AboutData>(emptyAbout)

  const data: AboutData = {
    bio: about?.bio ?? [],
    roles: about?.roles ?? [],
    passions: about?.passions ?? [],
    hobbies: about?.hobbies ?? [],
  }

  const enterEdit = () => {
    setDraft(clone(data))
    setEditing(true)
  }

  const saveEdit = () => {
    onSave(draft)
    setEditing(false)
  }

  const cancelEdit = () => {
    setDraft(clone(data))
    setEditing(false)
  }

  const updatePassion = (i: number, field: "title" | "description", v: string) => {
    const d = clone(draft)
    d.passions[i][field] = v
    setDraft(d)
  }

  const addPassion = () => {
    const d = clone(draft)
    d.passions.push({ title: "New passion", description: "Describe what drives you." })
    setDraft(d)
  }

  const removePassion = (i: number) => {
    const d = clone(draft)
    d.passions.splice(i, 1)
    setDraft(d)
  }

  const addHobby = () => {
    const d = clone(draft)
    d.hobbies.push("New hobby")
    setDraft(d)
  }

  const removeHobby = (i: number) => {
    const d = clone(draft)
    d.hobbies.splice(i, 1)
    setDraft(d)
  }

  const updateHobby = (i: number, v: string) => {
    const d = clone(draft)
    d.hobbies[i] = v
    setDraft(d)
  }

  const content = editing ? draft : data

  const editButtons = (
    <div className="flex items-center gap-3">
      {isAdmin && !editing && (
        <button onClick={enterEdit} className="inline-flex h-8 items-center gap-1.5 rounded-md border border-primary/40 bg-card px-3 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground">
          <Pencil className="size-3.5" />Edit About
        </button>
      )}
      {isAdmin && editing && (
        <>
          <button onClick={saveEdit} className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            <Check className="size-3.5" />Save All
          </button>
          <button onClick={cancelEdit} className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-xs font-medium text-card-foreground transition-colors hover:bg-muted">
            <X className="size-3.5" />Cancel
          </button>
        </>
      )}
    </div>
  )

  return (
    <>
      <section className="border-b border-border py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ScrollAnimation>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold tracking-tight">What Drives Me</h2>
              {editButtons}
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {content.passions.map((item, i) => {
                const Icon = passionIcons[i % passionIcons.length]
                return (
                  <div key={i} className="group relative rounded-xl border border-border bg-card p-5">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                      <Icon className="size-5 text-foreground" />
                    </div>
                    {editing ? (
                      <>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => updatePassion(i, "title", e.target.value)}
                          className="mt-4 w-full rounded border border-primary/40 bg-background px-2 py-0.5 text-sm font-semibold text-foreground outline-none"
                        />
                        <textarea
                          value={item.description}
                          onChange={(e) => updatePassion(i, "description", e.target.value)}
                          rows={3}
                          className="mt-2 w-full rounded border border-primary/40 bg-background px-2 py-0.5 text-sm text-foreground outline-none"
                        />
                      </>
                    ) : (
                      <>
                        <h3 className="mt-4 font-semibold text-card-foreground">{item.title}</h3>
                        <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                      </>
                    )}
                    {isAdmin && (
                      <button onClick={() => removePassion(i)} className="absolute right-3 top-3 text-muted-foreground hover:text-destructive">
                        <Trash2 className="size-3.5" />
                      </button>
                    )}
                  </div>
                )
              })}
              {isAdmin && editing && (
                <button onClick={addPassion} className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-primary/40 text-xs font-medium text-primary transition-colors hover:bg-primary/5">
                  <Plus className="size-4" />Add passion
                </button>
              )}
            </div>
          </ScrollAnimation>
        </div>
      </section>

      <section className="border-b border-border py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ScrollAnimation>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold tracking-tight">When I&apos;m Not Coding</h2>
              {editButtons}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {content.hobbies.map((item, i) => (
                <div
                  key={i}
                  className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground"
                >
                  {editing ? (
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateHobby(i, e.target.value)}
                      className="w-32 rounded border border-primary/40 bg-background px-1 py-0.5 text-sm text-foreground outline-none"
                    />
                  ) : (
                    item
                  )}
                  {isAdmin && (
                    <button onClick={() => removeHobby(i)} className="text-muted-foreground hover:text-destructive">
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>
              ))}
              {isAdmin && editing && (
                <button onClick={addHobby} className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-primary/40 px-4 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/5">
                  <Plus className="size-3.5" />Add hobby
                </button>
              )}
            </div>
          </ScrollAnimation>
        </div>
      </section>
    </>
  )
}
