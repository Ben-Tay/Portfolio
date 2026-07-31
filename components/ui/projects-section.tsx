"use client"

import { useState, type ReactNode } from "react"
import { ExternalLink, Code2, Pencil, X, Check, Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollAnimation, StaggerContainer, StaggerItem } from "@/components/ui/scroll-animation"
import { useAdmin } from "@/lib/admin-context"

interface ProjectEntry {
  title: string
  description: string
  highlights: string[]
  tags: string[]
  links: { label: string; href: string }[]
  category: string
}

interface ProjectsData {
  entries: ProjectEntry[]
}

interface ProjectsSectionInnerProps {
  projects: ProjectsData
  onSave: (value: ProjectsData) => void
}

const clone = (value: ProjectsData): ProjectsData => JSON.parse(JSON.stringify(value))

const URL_PATTERN = /(https?:\/\/[^\s)]+)/g
const MARKDOWN_LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = []
  let rest = text
  while (rest.length > 0) {
    const md = rest.match(MARKDOWN_LINK_PATTERN)
    if (md) {
      const before = rest.slice(0, md.index)
      const url = md[2].startsWith("http") ? md[2] : `https://${md[2]}`
      nodes.push(
        <a key={nodes.length} href={url} target="_blank" rel="noopener noreferrer"
          className="font-medium text-primary underline decoration-primary/30 underline-offset-2 transition-colors hover:decoration-primary">
          {md[1]}
        </a>
      )
      rest = rest.slice((md.index ?? 0) + md[0].length)
      if (before) nodes.push(<span key={nodes.length}>{before}</span>)
      continue
    }
    const urlMatch = rest.match(URL_PATTERN)
    if (urlMatch) {
      const before = rest.slice(0, urlMatch.index)
      const url = urlMatch[0].replace(/[.,;:!?]+$/, "")
      nodes.push(
        <a key={nodes.length} href={url} target="_blank" rel="noopener noreferrer"
          className="font-medium text-primary underline decoration-primary/30 underline-offset-2 transition-colors hover:decoration-primary">
          {url}
        </a>
      )
      rest = rest.slice((urlMatch.index ?? 0) + urlMatch[0].length)
      if (before) nodes.push(<span key={nodes.length}>{before}</span>)
      continue
    }
    nodes.push(<span key={nodes.length}>{rest}</span>)
    break
  }
  return nodes
}

function BulletText({ text, className }: { text: string; className?: string }) {
  const lines = text.split("\n").map((l) => l.trim()).filter((l) => l.length > 0)
  if (lines.length <= 1) {
    return <span className={className}>{renderInline(text)}</span>
  }
  return (
    <span className={cn("block", className)}>
      {lines.map((line, i) => {
        const isBullet = /^[-•·*]\s+/.test(line)
        const clean = line.replace(/^[-•·*]\s+/, "")
        return isBullet ? (
          <span key={i} className="flex gap-2">
            <span className="mt-[0.55em] size-1.5 shrink-0 rounded-full bg-primary/50" />
            {renderInline(clean)}
          </span>
        ) : (
          <span key={i} className="block">{renderInline(line)}</span>
        )
      })}
    </span>
  )
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

export function ProjectsSectionInner({ projects, onSave }: ProjectsSectionInnerProps) {
  const { isAdmin } = useAdmin()
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [editing, setEditing] = useState<{ index: number; field: string } | null>(null)
  const [draft, setDraft] = useState("")
  const [bulkEdit, setBulkEdit] = useState(false)
  const [bulkDraft, setBulkDraft] = useState<ProjectsData>(projects)

  const categories = Array.from(new Set((bulkEdit ? bulkDraft : projects).entries.map((p) => p.category)))
  const source = bulkEdit ? bulkDraft : projects
  const filtered = activeCategory
    ? source.entries.filter((p) => p.category === activeCategory)
    : source.entries

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
    const updated = clone(projects)
    const entry = updated.entries[editing.index]
    if (entry) {
      if (editing.field.startsWith("highlight-")) {
        const hi = Number(editing.field.split("-")[1])
        if (Number.isInteger(hi) && entry.highlights[hi] !== undefined) {
          entry.highlights[hi] = draft
        }
      } else if (editing.field in entry) {
        ;(entry as unknown as Record<string, string>)[editing.field] = draft
      }
    }
    onSave(updated)
    setEditing(null)
  }

  const addHighlight = (index: number) => {
    const updated = clone(projects)
    updated.entries[index].highlights.push("New highlight")
    onSave(updated)
  }

  const removeHighlight = (index: number, hi: number) => {
    const updated = clone(projects)
    updated.entries[index].highlights.splice(hi, 1)
    onSave(updated)
  }

  const enterBulkEdit = () => {
    setBulkDraft(clone(projects))
    setBulkEdit(true)
  }

  const saveBulkEdit = () => {
    onSave(bulkDraft)
    setBulkEdit(false)
  }

  const cancelBulkEdit = () => {
    setBulkDraft(projects)
    setBulkEdit(false)
  }

  const addProject = () => {
    if (bulkEdit) {
      const d = clone(bulkDraft)
      d.entries.push({
        title: "New Project",
        description: "Short description",
        highlights: [],
        tags: [],
        links: [],
        category: "Uncategorized",
      })
      setBulkDraft(d)
      return
    }
    const updated = clone(projects)
    updated.entries.push({
      title: "New Project",
      description: "Short description",
      highlights: [],
      tags: [],
      links: [],
      category: "Uncategorized",
    })
    onSave(updated)
  }

  const removeProject = (index: number) => {
    if (bulkEdit) {
      const d = clone(bulkDraft)
      d.entries.splice(index, 1)
      setBulkDraft(d)
      return
    }
    const updated = clone(projects)
    updated.entries.splice(index, 1)
    onSave(updated)
  }

  const inlineInput = () => (
    <span className="inline-flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
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
    <section id="projects" className="border-b border-border py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollAnimation>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="size-5 text-primary" />
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Projects</h2>
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
          <p className="mt-2 max-w-2xl text-muted-foreground">Hover for details, click to expand. Filter by category below.</p>
        </ScrollAnimation>

        <ScrollAnimation delay={0.1} className="mt-6">
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setActiveCategory(null)}
              className={cn("rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all", !activeCategory ? "border-primary bg-primary text-primary-foreground shadow-sm" : "border-border bg-card text-muted-foreground hover:border-primary/30")}>
              All
            </button>
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={cn("rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all", activeCategory === cat ? "border-primary bg-primary text-primary-foreground shadow-sm" : "border-border bg-card text-muted-foreground hover:border-primary/30")}>
                {cat}
              </button>
            ))}
          </div>
        </ScrollAnimation>

        <StaggerContainer className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" delay={0.1}>
          {filtered.map((project) => {
            const globalIndex = source.entries.indexOf(project)

            return (
              <StaggerItem key={globalIndex}>
                <div className={cn("group relative rounded-xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-sm")}>
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <span className="rounded-md bg-primary/5 px-2 py-0.5 text-xs font-medium text-primary">
                        {bulkEdit ? (
                          <input type="text" value={bulkDraft.entries[globalIndex].category} onChange={(e) => { const d = clone(bulkDraft); d.entries[globalIndex].category = e.target.value; setBulkDraft(d) }} className="rounded border border-primary/40 bg-background px-2 py-0.5 text-xs text-foreground outline-none" />
                        ) : editing?.index === globalIndex && editing?.field === "category" ? inlineInput() : (
                          <span className="inline-flex items-center gap-1">
                            {project.category}
                            {isAdmin && <button onClick={(e) => { e.stopPropagation(); startEdit(globalIndex, "category", project.category) }} className="opacity-0 transition-opacity group-hover:opacity-100"><Pencil className="size-3 text-muted-foreground" /></button>}
                          </span>
                        )}
                      </span>
                      <div className="flex gap-2">
                        {project.links.map((link) => (
                          <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-card-foreground">
                            {link.label === "GitHub" ? <GitHubIcon /> : <ExternalLink className="size-4" />}
                          </a>
                        ))}
                      </div>
                    </div>

                    <h3 className="mt-3 font-semibold text-card-foreground group-hover:text-primary">
                      {bulkEdit ? (
                        <input type="text" value={bulkDraft.entries[globalIndex].title} onChange={(e) => { const d = clone(bulkDraft); d.entries[globalIndex].title = e.target.value; setBulkDraft(d) }} className="w-full rounded border border-primary/40 bg-background px-2 py-0.5 text-sm text-foreground outline-none" />
                      ) : editing?.index === globalIndex && editing?.field === "title" ? inlineInput() : (
                        <span className="inline-flex items-center gap-1">
                          {project.title}
                          {isAdmin && <button onClick={(e) => { e.stopPropagation(); startEdit(globalIndex, "title", project.title) }} className="opacity-0 transition-opacity group-hover:opacity-100"><Pencil className="size-3 text-muted-foreground" /></button>}
                        </span>
                      )}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {bulkEdit ? (
                        <textarea value={bulkDraft.entries[globalIndex].description} onChange={(e) => { const d = clone(bulkDraft); d.entries[globalIndex].description = e.target.value; setBulkDraft(d) }} className="w-full rounded border border-primary/40 bg-background px-2 py-0.5 text-sm text-foreground outline-none" rows={2} />
                      ) : editing?.index === globalIndex && editing?.field === "description" ? (
                        <span className="inline-flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <textarea value={draft} onChange={(e) => setDraft(e.target.value)} className="w-full rounded border border-primary/40 bg-background px-2 py-1 text-sm outline-none" rows={2} autoFocus />
                          <button onClick={confirmEdit} className="text-primary"><Check className="size-3.5" /></button>
                          <button onClick={cancelEdit} className="text-muted-foreground"><X className="size-3.5" /></button>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1">
                          <BulletText text={project.description} />
                          {isAdmin && <button onClick={(e) => { e.stopPropagation(); startEdit(globalIndex, "description", project.description) }} className="opacity-0 transition-opacity group-hover:opacity-100"><Pencil className="size-3 text-muted-foreground" /></button>}
                        </span>
                      )}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {bulkEdit ? (
                        <>
                          {bulkDraft.entries[globalIndex].tags.map((tag, ti) => (
                            <span key={ti} className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5">
                              <input type="text" value={tag} onChange={(e) => { const d = clone(bulkDraft); d.entries[globalIndex].tags[ti] = e.target.value; setBulkDraft(d) }} className="w-20 rounded border border-primary/40 bg-background px-1 py-0.5 text-xs text-foreground outline-none" />
                              <button onClick={() => { const d = clone(bulkDraft); d.entries[globalIndex].tags.splice(ti, 1); setBulkDraft(d) }} className="text-muted-foreground hover:text-destructive"><X className="size-3" /></button>
                            </span>
                          ))}
                          <button onClick={() => { const d = clone(bulkDraft); d.entries[globalIndex].tags.push(""); setBulkDraft(d) }} className="text-xs text-muted-foreground hover:text-primary"><Plus className="mr-0.5 inline size-3" />Add tag</button>
                        </>
                      ) : (
                        project.tags.map((tag) => (
                          <span key={tag} className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">{tag}</span>
                        ))
                      )}
                    </div>

                    <ul className="mt-3 space-y-1.5">
                      {(bulkEdit ? bulkDraft.entries[globalIndex].highlights : project.highlights).map((h, hi) => (
                        <li key={hi} className="flex gap-2 text-sm text-muted-foreground">
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/40" />
                          {bulkEdit ? (
                            <span className="inline-flex items-center gap-1 flex-1">
                              <input type="text" value={h} onChange={(e) => { const d = clone(bulkDraft); d.entries[globalIndex].highlights[hi] = e.target.value; setBulkDraft(d) }} className="flex-1 rounded border border-primary/40 bg-background px-2 py-0.5 text-sm text-foreground outline-none" />
                              <button onClick={() => { const d = clone(bulkDraft); d.entries[globalIndex].highlights.splice(hi, 1); setBulkDraft(d) }} className="text-muted-foreground hover:text-destructive"><X className="size-3" /></button>
                            </span>
                          ) : editing?.index === globalIndex && editing?.field === `highlight-${hi}` ? (
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
                                  <button onClick={(e) => { e.stopPropagation(); startEdit(globalIndex, `highlight-${hi}`, h) }} className="text-muted-foreground hover:text-foreground"><Pencil className="size-3" /></button>
                                  <button onClick={(e) => { e.stopPropagation(); removeHighlight(globalIndex, hi) }} className="text-muted-foreground hover:text-destructive"><X className="size-3" /></button>
                                </span>
                              )}
                            </span>
                          )}
                        </li>
                      ))}
                      {isAdmin && (
                        <li>
                          {bulkEdit ? (
                            <button onClick={() => { const d = clone(bulkDraft); d.entries[globalIndex].highlights.push(""); setBulkDraft(d) }} className="text-xs text-muted-foreground hover:text-primary"><Plus className="mr-0.5 inline size-3" />Add highlight</button>
                          ) : (
                            <button onClick={(e) => { e.stopPropagation(); addHighlight(globalIndex) }} className="text-xs text-muted-foreground hover:text-primary"><Plus className="mr-0.5 inline size-3" />Add highlight</button>
                          )}
                        </li>
                      )}
                    </ul>

                    {bulkEdit && (
                      <div className="mt-3 border-t border-border pt-3">
                        <p className="text-xs font-medium text-muted-foreground">Links</p>
                        <div className="mt-1.5 space-y-1.5">
                          {bulkDraft.entries[globalIndex].links.map((link, li) => (
                            <div key={li} className="flex items-center gap-1.5">
                              <input type="text" value={link.label} onChange={(e) => { const d = clone(bulkDraft); d.entries[globalIndex].links[li] = { ...link, label: e.target.value }; setBulkDraft(d) }} placeholder="Label" className="w-24 rounded border border-primary/40 bg-background px-2 py-0.5 text-xs text-foreground outline-none" />
                              <input type="text" value={link.href} onChange={(e) => { const d = clone(bulkDraft); d.entries[globalIndex].links[li] = { ...link, href: e.target.value }; setBulkDraft(d) }} placeholder="https://..." className="flex-1 rounded border border-primary/40 bg-background px-2 py-0.5 text-xs text-foreground outline-none" />
                              <button onClick={() => { const d = clone(bulkDraft); d.entries[globalIndex].links.splice(li, 1); setBulkDraft(d) }} className="text-muted-foreground hover:text-destructive"><X className="size-3" /></button>
                            </div>
                          ))}
                          <button onClick={() => { const d = clone(bulkDraft); d.entries[globalIndex].links.push({ label: "Link", href: "" }); setBulkDraft(d) }} className="text-xs text-muted-foreground hover:text-primary"><Plus className="mr-0.5 inline size-3" />Add link</button>
                        </div>
                      </div>
                    )}

                    {isAdmin && (
                      <div className="mt-3 flex justify-end border-t border-border pt-3">
                        <button onClick={() => removeProject(globalIndex)} className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-destructive">
                          <Trash2 className="size-3" />Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </StaggerItem>
            )
          })}
        </StaggerContainer>

        {isAdmin && (
          <button onClick={addProject} className="mt-6 inline-flex items-center gap-1.5 rounded-md border border-dashed border-primary/40 bg-card px-3 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground">
            <Plus className="size-3.5" />Add project
          </button>
        )}
      </div>
    </section>
  )
}
