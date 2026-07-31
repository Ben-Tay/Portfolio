"use client"

import { useContent, ContentData } from "@/lib/use-content"
import { HeroSection } from "@/components/ui/hero-section"
import { HighlightsSectionInner } from "@/components/ui/highlights-section"
import { EducationSectionInner } from "@/components/ui/education-section"
import { ResumeSectionInner } from "@/components/ui/resume-section"
import { ProjectsSectionInner } from "@/components/ui/projects-section"

const emptyContent: ContentData = {
  about: { bio: [], roles: [], passions: [], hobbies: [] },
  strengths: [],
  experience: { entries: [], education: [] },
  projects: { entries: [] },
}

export function HomeClient() {
  const { data, saveContent } = useContent()
  const content = data || emptyContent

  return (
    <>
      <HeroSection about={content.about} />
      <HighlightsSectionInner
        strengths={content.strengths || emptyContent.strengths!}
        projects={content.projects}
        onSave={(v) => saveContent("strengths", v)}
      />
      <EducationSectionInner
        education={{ entries: content.experience?.education || [] }}
        onSave={(v) => saveContent("experience", { ...content.experience, education: v.entries })}
      />
      <ResumeSectionInner
        experience={content.experience || emptyContent.experience!}
        onSave={(v) => saveContent("experience", v)}
      />
      <ProjectsSectionInner
        projects={content.projects || emptyContent.projects!}
        onSave={(v) => saveContent("projects", v)}
      />
    </>
  )
}
