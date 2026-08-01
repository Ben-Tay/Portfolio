"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, Download, Pencil, Check, X, Plus, Trash2 } from "lucide-react"
import { motion } from "framer-motion"
import { useAdmin } from "@/lib/admin-context"

interface HeroAbout {
  bio?: string[]
  roles?: string[]
  hobbies?: string[]
}

const fadeUp = { opacity: 0, y: 20 }
const visible = { opacity: 1, y: 0 }

const DEFAULT_ROLES = ["Information Systems", "Product & Design", "Business Analysis", "AI Applications"]

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

export function HeroSection({ about, onSaveBio }: { about?: HeroAbout; onSaveBio?: (bio: string[]) => void }) {
  const { isAdmin } = useAdmin()
  const bio = about?.bio ?? []
  const roles = about?.roles?.filter((r) => r.trim()) ?? []
  const hobbies = about?.hobbies ?? []
  const ROLES = roles.length > 0 ? roles : DEFAULT_ROLES
  const [role, setRole] = useState("")
  const [roleIndex, setRoleIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<string[]>([])

  const enterEdit = () => {
    setDraft([...bio])
    setEditing(true)
  }

  const saveEdit = () => {
    onSaveBio?.(draft)
    setEditing(false)
  }

  const cancelEdit = () => {
    setDraft([...bio])
    setEditing(false)
  }

  const updateDraft = (i: number, value: string) => {
    const d = [...draft]
    d[i] = value
    setDraft(d)
  }

  const addParagraph = () => {
    setDraft((d) => [...d, ""])
  }

  const removeParagraph = (i: number) => {
    setDraft((d) => d.filter((_, idx) => idx !== i))
  }

  useEffect(() => {
    const full = ROLES[roleIndex]
    const timeout = setTimeout(
      () => {
        if (!deleting) {
          const next = full.slice(0, role.length + 1)
          setRole(next)
          if (next === full) setTimeout(() => setDeleting(true), 1500)
        } else {
          const next = full.slice(0, role.length - 1)
          setRole(next)
          if (next === "") {
            setDeleting(false)
            setRoleIndex((roleIndex + 1) % ROLES.length)
          }
        }
      },
      deleting ? 40 : 90,
    )
    return () => clearTimeout(timeout)
  }, [role, deleting, roleIndex, ROLES])

  return (
    <section className="relative overflow-hidden border-b border-border print:hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div
        className="absolute inset-0 opacity-60 [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_35%,black_10%,transparent_75%)]"
      />
      <div className="absolute top-0 right-0 -mt-24 -mr-24 size-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 -mb-24 -ml-24 size-72 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl gap-14 px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:pb-24 lg:pt-16">
        <div className="flex flex-col items-start text-left">
          <motion.div
            initial={fadeUp}
            animate={visible}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            Open to opportunities
          </motion.div>

          <motion.h1
            initial={fadeUp}
            animate={visible}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-3xl"
          >
            <span className="text-2xl font-semibold tracking-tight text-muted-foreground sm:text-3xl">Hi, I&apos;m </span>
            <span className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Benedict </span>
            <span className="bg-gradient-to-r from-primary via-sky-400 to-accent-foreground bg-clip-text text-transparent text-2xl font-bold tracking-tight sm:text-3xl">
              Tay
            </span>
          </motion.h1>

          <motion.p
            initial={fadeUp}
            animate={visible}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 font-mono text-base text-primary sm:text-lg"
          >
            <span className="text-muted-foreground">&gt;_</span> {role}
            <span className="ml-0.5 inline-block w-[2px] animate-pulse bg-primary align-middle" style={{ height: "1em" }} />
          </motion.p>

          {onSaveBio && isAdmin && (
            <div className="mt-5 flex w-full items-center justify-end">
              {!editing ? (
                <button
                  onClick={enterEdit}
                  className="inline-flex h-7 items-center gap-1.5 rounded-md border border-primary/40 bg-card px-2.5 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <Pencil className="size-3" />Edit All
                </button>
              ) : (
                <>
                  <button
                    onClick={saveEdit}
                    className="inline-flex h-7 items-center gap-1.5 rounded-md bg-primary px-2.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    <Check className="size-3" />Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="ml-2 inline-flex h-7 items-center gap-1.5 rounded-md border border-border bg-card px-2.5 text-xs font-medium text-card-foreground transition-colors hover:bg-muted"
                  >
                    <X className="size-3" />Cancel
                  </button>
                </>
              )}
            </div>
          )}

          {editing && onSaveBio ? (
            <div className="mt-5 w-full space-y-3">
              {draft.map((paragraph, i) => (
                <div key={i} className="flex items-start gap-2">
                  <textarea
                    value={draft[i]}
                    onChange={(e) => updateDraft(i, e.target.value)}
                    rows={2}
                    className="w-full rounded border border-primary/40 bg-background px-2 py-1 text-sm text-foreground outline-none"
                  />
                  <button
                    onClick={() => removeParagraph(i)}
                    className="mt-1 text-muted-foreground transition-colors hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={addParagraph}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-primary"
              >
                <Plus className="size-3.5" />Add paragraph
              </button>
            </div>
          ) : (
            bio.map((paragraph, i) => (
              <motion.p
                key={i}
                initial={fadeUp}
                animate={visible}
                transition={{ duration: 0.6, delay: 0.25 + i * 0.1 }}
                className="mt-5 max-w-2xl text-base leading-relaxed text-foreground/80 sm:text-lg"
              >
                {paragraph}
              </motion.p>
            ))
          )}

          <motion.div
            initial={fadeUp}
            animate={visible}
            transition={{ duration: 0.6, delay: 0.45 + bio.length * 0.1 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link
              href="#projects"
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md active:translate-y-px"
            >
              View Projects <ArrowRight className="size-4" />
            </Link>
            <Link
              href="#resume"
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-card px-6 text-sm font-medium text-card-foreground shadow-sm transition-all hover:bg-accent hover:text-accent-foreground active:translate-y-px"
            >
              <Download className="size-4" /> My Resume
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={visible}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="hidden lg:block"
        >
          <div className="overflow-hidden rounded-xl border border-border bg-card/80 shadow-2xl shadow-primary/5 backdrop-blur-sm">
            <div className="flex items-center gap-1.5 border-b border-border bg-muted/50 px-4 py-2.5">
              <span className="size-2.5 rounded-full bg-red-400/70" />
              <span className="size-2.5 rounded-full bg-yellow-400/70" />
              <span className="size-2.5 rounded-full bg-green-400/70" />
              <span className="ml-2 font-mono text-xs text-muted-foreground">benedict — profile.tsx</span>
            </div>
            <pre className="overflow-x-auto p-5 font-mono text-sm leading-relaxed text-foreground/80">
              <code>
                <span className="text-primary">const</span> <span className="text-foreground">profile</span>{" "}
                <span className="text-muted-foreground">=</span> <span className="text-foreground">{"{"}</span>
                {"\n"}
                <span className="pl-4 text-muted-foreground">name</span>
                <span className="text-muted-foreground">:</span> <span className="text-accent-foreground">&quot;Benedict Tay&quot;</span>
                <span className="text-muted-foreground">,</span>
                {"\n"}
                <span className="pl-4 text-muted-foreground">role</span>
                <span className="text-muted-foreground">:</span> <span className="text-accent-foreground">&quot;{ROLES[roleIndex]}&quot;</span>
                <span className="text-muted-foreground">,</span>
                {"\n"}
                <span className="pl-4 text-muted-foreground">hobbies</span>
                <span className="text-muted-foreground">:</span> <span className="text-foreground">[</span>
                {hobbies.map((h, i) => (
                  <span key={h}>
                    <span className="text-primary">&quot;{h}&quot;</span>
                    {i < hobbies.length - 1 && <span className="text-muted-foreground">, </span>}
                  </span>
                ))}
                <span className="text-foreground">]</span>
                <span className="text-muted-foreground">,</span>
                {"\n"}
                <span className="pl-4 text-muted-foreground">status</span>
                <span className="text-muted-foreground">:</span> <span className="text-green-400">&quot;Open to opportunities&quot;</span>
                <span className="text-muted-foreground">,</span>
                {"\n"}
                <span className="text-foreground">{"};"}</span>
                {"\n"}
                <span className="text-muted-foreground">{"// ✦ keep building"}</span>
              </code>
            </pre>
            <div className="flex items-center gap-3 border-t border-border bg-muted/50 px-5 py-3">
              <a href="https://github.com/Ben-Tay" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                <GitHubIcon /> GitHub
              </a>
              <a href="https://www.linkedin.com/in/benedict-tay-haoze/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                <LinkedInIcon /> LinkedIn
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
