"use client"

import { useState, useRef, useEffect, ReactNode, useCallback } from "react"
import { Pencil, Check, X } from "lucide-react"
import { useAdmin } from "@/lib/admin-context"

interface EditableTextProps {
  value: string
  onSave: (value: string) => void
  className?: string
  multiline?: boolean
}

export function EditableText({ value, onSave, className, multiline }: EditableTextProps) {
  const { isAdmin } = useAdmin()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus()
  }, [editing])

  if (!isAdmin) {
    return multiline ? (
      <p className={className}>{value}</p>
    ) : (
      <span className={className}>{value}</span>
    )
  }

  if (!editing) {
    return (
      <span className="group relative inline">
        {multiline ? (
          <p className={className}>{value}</p>
        ) : (
          <span className={className}>{value}</span>
        )}
        <button
          onClick={() => { setDraft(value); setEditing(true) }}
          className="ml-1 inline-flex opacity-0 transition-opacity group-hover:opacity-100"
        >
          <Pencil className="size-3 text-muted-foreground" />
        </button>
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1">
      {multiline ? (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="w-full rounded border border-primary/40 bg-background px-2 py-1 text-sm text-foreground outline-none"
          rows={3}
        />
      ) : (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="rounded border border-primary/40 bg-background px-2 py-0.5 text-sm text-foreground outline-none"
        />
      )}
      <button onClick={() => { onSave(draft); setEditing(false) }} className="text-primary hover:text-primary/80"><Check className="size-3.5" /></button>
      <button onClick={() => { setEditing(false) }} className="text-muted-foreground hover:text-foreground"><X className="size-3.5" /></button>
    </span>
  )
}

interface EditableArrayProps {
  value: string[]
  onSave: (value: string[]) => void
  renderItem: (item: string, index: number) => ReactNode
  className?: string
}

export function EditableArray({ value, onSave, renderItem, className }: EditableArrayProps) {
  const { isAdmin } = useAdmin()
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [draft, setDraft] = useState("")

  const saveItem = useCallback((index: number) => {
    const items = [...value]
    items[index] = draft
    onSave(items)
    setEditingIndex(null)
  }, [value, draft, onSave])

  const addItem = useCallback(() => {
    const items = [...value]
    items.push("New item")
    onSave(items)
  }, [value, onSave])

  const removeItem = useCallback((index: number) => {
    const next = [...value]
    next.splice(index, 1)
    onSave(next)
  }, [value, onSave])

  if (!isAdmin) {
    return <div className={className}>{value.map((item, i) => renderItem(item, i))}</div>
  }

  return (
    <div className={className}>
      {value.map((item, i) => (
        <div key={i} className="group relative">
          {editingIndex === i ? (
            <span className="inline-flex items-center gap-1">
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="rounded border border-primary/40 bg-background px-2 py-0.5 text-sm text-foreground outline-none"
                autoFocus
              />
              <button onClick={() => saveItem(i)} className="text-primary hover:text-primary/80"><Check className="size-3.5" /></button>
              <button onClick={() => setEditingIndex(null)} className="text-muted-foreground hover:text-foreground"><X className="size-3.5" /></button>
            </span>
          ) : (
            <span className="group/item inline-flex items-center gap-1">
              {renderItem(item, i)}
              <span className="hidden group-hover/item:inline-flex gap-0.5">
                <button onClick={() => { setDraft(item); setEditingIndex(i) }} className="text-muted-foreground hover:text-foreground"><Pencil className="size-3" /></button>
                <button onClick={() => removeItem(i)} className="text-muted-foreground hover:text-destructive"><X className="size-3" /></button>
              </span>
            </span>
          )}
        </div>
      ))}
      <button onClick={addItem} className="mt-1 text-xs text-muted-foreground hover:text-primary">+ Add</button>
    </div>
  )
}
