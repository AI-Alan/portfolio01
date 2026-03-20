import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
import EducationSection from '@/components/sections/EducationSection'
import SkillsSection from '@/components/sections/SkillsSection'
import ExperienceSection from '@/components/sections/ExperienceSection'
import FeaturedProjects from '@/components/sections/FeaturedProjects'
import { getExperienceData } from '@/lib/getExperienceData'
import { getProjectsData } from '@/lib/getProjectsData'
import { getSkillsData } from '@/lib/getSkillsData'

function isEducationType(type: string) {
  return type.trim().toLowerCase() === 'education'
}

export default async function HomePage() {
  const [allExperience, allProjects, allSkills] = await Promise.all([
    getExperienceData(),
    getProjectsData(),
    getSkillsData(),
  ])

  const education = allExperience.filter(item => isEducationType(item.type))
  const experiences = allExperience.filter(item => !isEducationType(item.type))
  const featuredProjects = allProjects.filter(item => item.featured)

  return (
    <main>
      <HeroSection />
      <AboutSection />
      <EducationSection education={education} />
      <SkillsSection skills={allSkills} />
      <ExperienceSection experiences={experiences} />
      <FeaturedProjects projects={featuredProjects} />
    </main>
  )
}
