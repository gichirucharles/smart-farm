import { notFound } from "next/navigation"
import {
  HeadTeacherSectionContent,
  headTeacherSections,
  type HeadTeacherSection,
} from "@/components/dashboard/head-teacher/section-content"

type HeadTeacherSectionPageProps = {
  params: Promise<{ section: string }>
}

function isHeadTeacherSection(section: string): section is HeadTeacherSection {
  return headTeacherSections.includes(section as HeadTeacherSection)
}

export default async function HeadTeacherSectionPage({ params }: HeadTeacherSectionPageProps) {
  const { section } = await params

  if (!isHeadTeacherSection(section)) {
    notFound()
  }

  return <HeadTeacherSectionContent section={section} />
}
