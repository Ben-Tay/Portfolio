"use client"

import { useState, useEffect, useCallback } from "react"
import { useAdmin } from "@/lib/admin-context"
import { getSupabase } from "@/lib/supabase-client"

export interface ContentData {
  about?: {
    bio: string[]
    roles: string[]
    passions: { title: string; description: string }[]
    hobbies: string[]
  }
  strengths?: {
    title: string
    description: string
  }[]
  experience?: {
    entries: {
      role: string
      company: string
      type: string
      period: string
      description: string
      highlights: string[]
    }[]
    education: { degree: string; school: string; period: string }[]
  }
  projects?: {
    entries: {
      title: string
      description: string
      highlights: string[]
      tags: string[]
      links: { label: string; href: string }[]
      category: string
    }[]
  }
}

function normalizeProjects(value: ContentData["projects"]): ContentData["projects"] {
  if (!value) return value
  return {
    entries: value.entries.map((p) => ({ ...p, highlights: p.highlights ?? [] })),
  }
}

export function useContent() {
  const { isAdmin } = useAdmin()
  const [data, setData] = useState<ContentData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    getSupabase()
      .from("content")
      .select("key, value")
      .then(({ data: rows, error }) => {
        if (cancelled) return
        if (error) {
          setData(null)
          setLoading(false)
          return
        }
        const result: Record<string, unknown> = {}
        for (const row of rows ?? []) {
          result[row.key] = row.value
        }
        const normalized = { ...result }
        normalized.projects = normalizeProjects(normalized.projects as ContentData["projects"])
        setData(normalized as ContentData)
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const saveContent = useCallback(
    async (key: string, value: unknown) => {
      if (!isAdmin) return
      const { error } = await getSupabase()
        .from("content")
        .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" })
      if (!error) {
        setData((prev) => {
          if (!prev) return { [key]: value } as ContentData
          const next = { ...prev, [key]: value } as ContentData
          if (key === "projects") next.projects = normalizeProjects(next.projects)
          return next
        })
      }
    },
    [isAdmin],
  )

  return { data, loading, saveContent }
}
