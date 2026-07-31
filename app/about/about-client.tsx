"use client"

import { useState } from "react"
import { Code, Cpu, BookOpen, Check, Pencil, Plus, Trash2, X } from "lucide-react"
import { useContent } from "@/lib/use-content"
import { useAdmin } from "@/lib/admin-context"

interface AboutData {
  bio: string[]
  passions: { title: string; description: string }[]
  hobbies: string[]
}

const emptyAbout: AboutData = { bio: [], passions: [], hobbies: [] }

const passionIcons = [Code, Cpu, BookOpen]

const clone = (value: AboutData): AboutData => JSON.parse(JSON.stringify(value))

export function AboutClient() {
  const { isAdmin } = useAdmin()
  const { data, saveContent } = useContent()
  const rawAbout = (data?.about ?? {}) as Partial<AboutData>
  const about: AboutData = {
    bio: rawAbout.bio ?? [],
    passions: rawAbout.passions ?? [],
    hobbies: rawAbout.hobbies ?? [],
  }

  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<AboutData>(emptyAbout)

  const enterEdit = () => {
    setDraft(clone(about))
    setEditing(true)
  }

  const saveEdit = () => {
    saveContent("about", draft)
    setEditing(false)
  }

  const cancelEdit = () => {
    setDraft(clone(about))
    setEditing(false)
  }

  const commit = (d: AboutData) => {
    if (editing) {
      setDraft(d)
    } else {
      saveContent("about", d)
    }
  }

  const addBio = () => {
    const d = clone(editing ? draft : about)
    d.bio.push("New paragraph")
    commit(d)
  }

  const removeBio = (i: number) => {
    const d = clone(editing ? draft : about)
    d.bio.splice(i, 1)
    commit(d)
  }

  const updateBio = (i: number, v: string) => {
    const d = clone(draft)
    d.bio[i] = v
    setDraft(d)
  }

  const addPassion = () => {
    const d = clone(editing ? draft : about)
    d.passions.push({ title: "New passion", description: "Describe what drives you." })
    commit(d)
  }

  const removePassion = (i: number) => {
    const d = clone(editing ? draft : about)
    d.passions.splice(i, 1)
    commit(d)
  }

  const updatePassion = (i: number, field: "title" | "description", v: string) => {
    const d = clone(draft)
    d.passions[i][field] = v
    setDraft(d)
  }

  const addHobby = () => {
    const d = clone(editing ? draft : about)
    d.hobbies.push("New hobby")
    commit(d)
  }

  const removeHobby = (i: number) => {
    const d = clone(editing ? draft : about)
    d.hobbies.splice(i, 1)
    commit(d)
  }

  const updateHobby = (i: number, v: string) => {
    const d = clone(draft)
    d.hobbies[i] = v
    setDraft(d)
  }

  const content = editing ? draft : about

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
      <section>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">About Me</h1>
          <div className="flex items-center gap-3">
            {isAdmin && !editing && (
              <button onClick={enterEdit} className="inline-flex h-8 items-center gap-1.5 rounded-md border border-primary/40 bg-card px-3 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground">
                <Pencil className="size-3.5" />Edit All
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
        </div>
        <div className="mt-8 space-y-5 text-base leading-7 text-muted-foreground">
          {content.bio.map((paragraph, i) => (
            <div key={i} className="group relative">
              {editing ? (
                <div className="flex items-start gap-1">
                  <textarea
                    value={paragraph}
                    onChange={(e) => updateBio(i, e.target.value)}
                    rows={3}
                    className="w-full rounded border border-primary/40 bg-background px-2 py-1 text-sm text-foreground outline-none"
                  />
                  <button onClick={() => removeBio(i)} className="text-muted-foreground hover:text-destructive"><Trash2 className="size-3.5" /></button>
                </div>
              ) : (
                <p className="inline-flex items-start gap-1">
                  {paragraph}
                  {isAdmin && (
                    <button onClick={() => removeBio(i)} className="opacity-0 transition-opacity group-hover:opacity-100"><Trash2 className="size-3 text-muted-foreground hover:text-destructive" /></button>
                  )}
                </p>
              )}
            </div>
          ))}
          {isAdmin && (
            <button onClick={addBio} className="inline-flex items-center gap-1.5 text-xs font-medium text-primary">
              <Plus className="size-3.5" />Add paragraph
            </button>
          )}
        </div>
      </section>

      <section className="mt-16">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">What Drives Me</h2>
          {isAdmin && !editing && (
            <button onClick={addPassion} className="inline-flex items-center gap-1.5 text-xs font-medium text-primary">
              <Plus className="size-3.5" />Add
            </button>
          )}
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
        </div>
      </section>

      <section className="mt-16">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">When I&apos;m Not Coding</h2>
          {isAdmin && !editing && (
            <button onClick={addHobby} className="inline-flex items-center gap-1.5 text-xs font-medium text-primary">
              <Plus className="size-3.5" />Add
            </button>
          )}
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
        </div>
      </section>
    </div>
  )
}
