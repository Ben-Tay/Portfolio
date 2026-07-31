"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#resume", label: "Resume" },
  { href: "/#projects", label: "Projects" },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrollSection, setScrollSection] = useState("/")
  const hashLockRef = useRef<string | null>(null)
  const pathname = usePathname()
  const isHome = pathname === "/"
  const activeSection = isHome ? scrollSection : pathname

  useEffect(() => {
    if (!isHome) return

    const update = () => {
      if (hashLockRef.current) return
      const resume = document.getElementById("resume")
      const projects = document.getElementById("projects")
      const resumeTop = resume?.offsetTop ?? Infinity
      const projectsTop = projects?.offsetTop ?? Infinity
      const scrollPos = window.scrollY + window.innerHeight * 0.35

      if (scrollPos >= projectsTop) setScrollSection("/#projects")
      else if (scrollPos >= resumeTop) setScrollSection("/#resume")
      else setScrollSection("/")
    }

    const scrollToHash = (hash: string) => {
      hashLockRef.current = hash
      setScrollSection(hash)
      const id = hash.replace("#", "")
      let attempts = 0
      const timer = window.setInterval(() => {
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" })
        }
        if (++attempts > 20) {
          window.clearInterval(timer)
          hashLockRef.current = null
          update()
        }
      }, 250)
    }

    update()
    const hash = window.location.hash
    if (hash === "#resume" || hash === "#projects") {
      scrollToHash(hash)
    }

    const handleHashChange = () => {
      const next = window.location.hash
      if (next === "#resume" || next === "#projects") {
        scrollToHash(next)
      }
    }

    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    window.addEventListener("hashchange", handleHashChange)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
      window.removeEventListener("hashchange", handleHashChange)
    }
  }, [isHome, pathname])

  const isActive = (link: { href: string }) => activeSection === link.href

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-lg font-bold tracking-tight text-foreground">
          BT<span className="text-primary">.</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive(link)
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          className="flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border md:hidden">
          <div className="space-y-1 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive(link)
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
