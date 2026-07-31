"use client"

import { useState } from "react"
import { Lock, Unlock, LogOut, X } from "lucide-react"
import { useAdmin } from "@/lib/admin-context"

export function AdminToggle() {
  const { isAdmin, login, logout } = useAdmin()
  const [showModal, setShowModal] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(false)
    const ok = await login(email, password)
    if (ok) {
      setShowModal(false)
      setEmail("")
      setPassword("")
    } else {
      setError(true)
    }
  }

  return (
    <>
      {isAdmin && (
        <button
          onClick={logout}
          className="fixed bottom-4 right-14 z-40 flex size-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:text-foreground"
          title="Logout admin"
        >
          <LogOut className="size-3.5" />
        </button>
      )}
      <button
        onClick={() => (isAdmin ? logout() : setShowModal(true))}
        className="fixed bottom-4 right-4 z-40 flex size-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:text-foreground"
        title={isAdmin ? "Logout" : "Admin login"}
      >
        {isAdmin ? <Unlock className="size-3.5 text-primary" /> : <Lock className="size-3.5" />}
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-80 rounded-xl border border-border bg-card p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-card-foreground">Admin Access</h3>
              <button
                onClick={() => { setShowModal(false); setEmail(""); setPassword(""); setError(false) }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                autoFocus
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
              />
              {error && (
                <p className="text-xs text-destructive">Invalid email or password</p>
              )}
              <button
                type="submit"
                className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Unlock
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
