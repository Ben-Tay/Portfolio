"use client"

import { useState } from "react"
import { ExternalLink, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

interface Project {
  title: string
  description: string
  longDescription: string
  tags: string[]
  links: { label: string; href: string }[]
  category: string
}

const projects: Project[] = [
  {
    title: "E-Commerce Chat Helper",
    description: "AI-powered shopping assistant with real-time product recommendations.",
    longDescription:
      "A full-featured conversational AI assistant for e-commerce platforms. Integrates product catalogs, user preferences, and real-time inventory data to provide natural language shopping experiences. Uses RAG architecture with vector embeddings for accurate product retrieval.",
    tags: ["Next.js", "LangChain", "RAG", "Pinecone", "TypeScript"],
    links: [
      { label: "GitHub", href: "#" },
      { label: "Live Demo", href: "#" },
    ],
    category: "AI",
  },
  {
    title: "Financial Dashboard",
    description: "Real-time analytics dashboard with interactive data visualization.",
    longDescription:
      "A comprehensive financial monitoring platform featuring live market data, customizable widgets, and interactive charts. Supports multiple data sources, real-time WebSocket updates, and exportable reports. Built with a focus on performance and accessibility.",
    tags: ["React", "D3.js", "WebSocket", "Node.js", "PostgreSQL"],
    links: [
      { label: "GitHub", href: "#" },
      { label: "Live Demo", href: "#" },
    ],
    category: "Full-Stack",
  },
  {
    title: "F1 RAG System",
    description: "Retrieval-augmented generation system for Formula 1 race data.",
    longDescription:
      "A specialized RAG pipeline that ingests and indexes Formula 1 race data, team strategies, and historical results. Provides natural language querying over structured and unstructured F1 data. Features a Streamlit UI for interactive exploration.",
    tags: ["Python", "LangChain", "ChromaDB", "Streamlit", "FastAPI"],
    links: [
      { label: "GitHub", href: "#" },
      { label: "Case Study", href: "#" },
    ],
    category: "AI",
  },
  {
    title: "ThinkBoard",
    description: "Collaborative Kanban board with real-time team sync.",
    longDescription:
      "A MERN-stack project management tool with drag-and-drop Kanban boards, real-time collaboration via WebSockets, and integrated team chat. Features user authentication, role-based permissions, and activity logging.",
    tags: ["MongoDB", "Express", "React", "Node.js", "Socket.io"],
    links: [
      { label: "GitHub", href: "#" },
      { label: "Live Demo", href: "#" },
    ],
    category: "Full-Stack",
  },
  {
    title: "CI/CD Pipeline Tool",
    description: "Automated deployment pipeline with monitoring and alerts.",
    longDescription:
      "A DevOps tool that automates build, test, and deployment workflows. Integrates with GitHub Actions, Docker, and cloud providers. Includes real-time build logs, deployment history, and Slack notifications for pipeline events.",
    tags: ["Docker", "GitHub Actions", "AWS", "Terraform", "Node.js"],
    links: [
      { label: "GitHub", href: "#" },
      { label: "Docs", href: "#" },
    ],
    category: "DevOps",
  },
  {
    title: "IBF Scraper",
    description: "Automated data extraction and analysis platform.",
    longDescription:
      "A web scraping infrastructure that collects, processes, and analyzes structured data from multiple sources. Features scheduling, data deduplication, and export pipelines. Built with modular adapter patterns for easy source integration.",
    tags: ["Python", "Scrapy", "PostgreSQL", "Docker", "Airflow"],
    links: [
      { label: "GitHub", href: "#" },
    ],
    category: "Data",
  },
]

const categories = Array.from(new Set(projects.map((p) => p.category)))

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)

  const filtered = activeCategory
    ? projects.filter((p) => p.category === activeCategory)
    : projects

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Projects</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        A selection of things I&apos;ve built. Hover for details, click to expand.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory(null)}
          className={cn(
            "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
            !activeCategory
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground",
          )}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
              activeCategory === cat
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project) => {
          const isExpanded = expanded === project.title

          return (
            <div
              key={project.title}
              className={cn(
                "group relative rounded-xl border border-border bg-card transition-all",
                "hover:border-primary/50 hover:shadow-sm",
                isExpanded && "sm:col-span-2 lg:col-span-3",
              )}
              onClick={() =>
                setExpanded(isExpanded ? null : project.title)
              }
            >
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    {project.category}
                  </span>
                  <div className="flex gap-2">
                    {project.links.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                        aria-label={`${project.title} ${link.label}`}
                      >
                        {link.label === "GitHub" ? (
                          <GitHubIcon />
                        ) : (
                          <ExternalLink className="size-4" />
                        )}
                      </a>
                    ))}
                  </div>
                </div>

                <h3 className="mt-3 font-semibold text-card-foreground">
                  {project.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {project.description}
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.tags.slice(0, isExpanded ? undefined : 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                  {!isExpanded && project.tags.length > 3 && (
                    <span className="rounded-md bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground">
                      +{project.tags.length - 3}
                    </span>
                  )}
                </div>

                <div
                  className={cn(
                    "mt-4 grid transition-all",
                    isExpanded
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="border-t border-border pt-4 text-sm leading-relaxed text-muted-foreground">
                      {project.longDescription}
                    </p>
                    {project.tags.length > 3 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {project.tags.slice(3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setExpanded(isExpanded ? null : project.title)
                  }}
                  className="mt-3 flex w-full items-center justify-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ChevronDown
                    className={cn(
                      "size-4 transition-transform",
                      isExpanded && "rotate-180",
                    )}
                  />
                  {isExpanded ? "Less" : "More"}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
