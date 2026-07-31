export interface ParsedResume {
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

const sectionHeaders = [
  "experience", "work experience", "employment", "professional experience",
  "education", "academic", "skills", "technical skills", "projects",
  "certifications", "publications", "summary", "profile",
]

function findSection(text: string, name: string): string {
  const lines = text.split("\n")
  const start = lines.findIndex((l) => {
    const trimmed = l.trim().toLowerCase().replace(/[^a-z\s]/g, "")
    return trimmed === name || trimmed.startsWith(name) || trimmed.endsWith(name)
  })
  if (start === -1) return ""
  const nextSection = lines.slice(start + 1).findIndex((l) => {
    const trimmed = l.trim().toLowerCase().replace(/[^a-z\s]/g, "")
    return sectionHeaders.some((h) => trimmed === h || trimmed.startsWith(h))
  })
  const end = nextSection === -1 ? lines.length : start + 1 + nextSection
  return lines.slice(start + 1, end).join("\n").trim()
}

function parseExperienceBlock(text: string): ParsedResume["entries"] {
  const block = findSection(text, "experience") || findSection(text, "work experience") || findSection(text, "employment")
  if (!block) return []

  const entries: ParsedResume["entries"] = []
  const lines = block.split("\n").filter((l) => l.trim())

  let current: {
    role: string
    company: string
    type: string
    period: string
    description: string
    highlights: string[]
  } | null = null

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    const dateMatch = trimmed.match(
      /(\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{4}\b)\s*[–\-—to]+\s*(\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{4}\b|\bPresent\b|Current)/i,
    )
    const yearMatch = trimmed.match(/\b(19|20)\d{2}\s*[–\-—]\s*(19|20)\d{2}\b|\b(19|20)\d{2}\s*[–\-—]\s*(Present|Current)\b/i)
    const bulletMatch = trimmed.match(/^[•\-‣▪▸→*]\s*/)

    if (dateMatch || yearMatch) {
      if (current) entries.push(current)
      current = {
        role: trimmed.replace(dateMatch?.[0] || yearMatch?.[0] || "", "").trim(),
        company: "",
        type: "",
        period: dateMatch?.[0] || yearMatch?.[0] || trimmed,
        description: "",
        highlights: [],
      }
    } else if (current) {
      if (bulletMatch) {
        current.highlights.push(trimmed.replace(/^[•\-‣▪▸→*]\s*/, ""))
      } else if (!current.company && trimmed.length < 60) {
        current.company = trimmed
      } else if (!current.description) {
        current.description = trimmed
      } else {
        current.highlights.push(trimmed)
      }
    }
  }

  if (current) entries.push(current)
  return entries
}

function parseEducationBlock(text: string): ParsedResume["education"] {
  const block = findSection(text, "education") || findSection(text, "academic")
  if (!block) return []

  const entries: ParsedResume["education"] = []
  const lines = block.split("\n").filter((l) => l.trim())

  let current: { degree: string; school: string; period: string } | null = null

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    const dateMatch = trimmed.match(
      /(\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{4}\b)\s*[–\-—]\s*(\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{4}\b|\bPresent\b)/i,
    )
    const yearMatch = trimmed.match(/\b(19|20)\d{2}\s*[–\-—]\s*(19|20)\d{2}\b|\b(19|20)\d{2}\s*[–\-—]\s*(Present|Current)\b/i)

    if (dateMatch || yearMatch) {
      if (current) entries.push(current)
      current = {
        degree: "",
        school: trimmed.replace(dateMatch?.[0] || yearMatch?.[0] || "", "").trim(),
        period: dateMatch?.[0] || yearMatch?.[0] || trimmed,
      }
    } else if (current) {
      const lower = trimmed.toLowerCase()
      if (/b\.?s\.?|bachelor|master|ph\.?d|doctor|degree|b\.?a\.?|m\.?s\.?|m\.?a\.?|diploma|certificate/.test(lower)) {
        current.degree = trimmed
      } else if (!current.school || trimmed.length < 60) {
        if (!current.school) {
          current.school = trimmed
        } else {
          current.degree = current.degree || trimmed
        }
      }
    }
  }

  if (current) entries.push(current)
  return entries
}

export async function parseResumeFromPdf(file: File): Promise<ParsedResume> {
  const arrayBuffer = await file.arrayBuffer()
  const pdfjsLib = await import("pdfjs-dist")

  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString()

  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  let fullText = ""

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    fullText += content.items.map((item) => ("str" in item ? item.str : "")).join(" ") + "\n"
  }

  const entries = parseExperienceBlock(fullText)
  const education = parseEducationBlock(fullText)

  return {
    entries: entries.length > 0 ? entries : [],
    education: education.length > 0 ? education : [],
  }
}
