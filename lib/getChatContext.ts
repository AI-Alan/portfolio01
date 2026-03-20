import { getExperienceData } from '@/lib/getExperienceData'
import { getProfileData } from '@/lib/getProfileData'
import { getProjectsData } from '@/lib/getProjectsData'
import { getSkillsData } from '@/lib/getSkillsData'

function toBulletList(items: string[]) {
  return items.map((item) => `- ${item}`).join('\n')
}

function truncateText(value: string, max = 180) {
  if (value.length <= max) return value
  return `${value.slice(0, max - 1)}…`
}

export async function getChatContextPrompt(): Promise<string> {
  const [profile, projects, skills, experience] = await Promise.all([
    getProfileData(),
    getProjectsData(),
    getSkillsData(),
    getExperienceData(),
  ])

  const featuredProjects = projects
    .filter((project) => project.featured)
    .slice(0, 6)
    .map((project) => `${project.title} (${project.category}) - ${truncateText(project.description, 120)}`)

  const topSkills = skills
    .slice(0, 18)
    .map((skill) => `${skill.name} [${skill.category}] - ${skill.level}%`)

  const latestExperience = experience
    .slice(0, 10)
    .map((item) => `${item.type}: ${item.title} at ${item.organization} (${item.startDate} to ${item.current ? 'Present' : item.endDate || 'N/A'})`)

  const availability = profile.availableForWork
    ? 'Open to opportunities (internships / collaborations / freelance).'
    : 'Not actively available for new work right now.'

  return `## Dynamic Portfolio Data (latest cached snapshot)
### Personal Info
- Name: ${profile.name}
- Tagline: ${profile.tagline || 'N/A'}
- Location: ${profile.location || 'N/A'}
- Year of Study: ${profile.yearOfStudy || 'N/A'}
- Availability: ${availability}
- Projects Count: ${profile.projectsCount || '0'}
- Technologies Count: ${profile.technologiesCount || '0'}

### Bio
- ${truncateText(profile.bio || 'No bio provided yet.', 360)}

### Top Skills
${topSkills.length > 0 ? toBulletList(topSkills) : '- No skills available.'}

### Latest Experience & Education
${latestExperience.length > 0 ? toBulletList(latestExperience) : '- No experience entries available.'}

### Featured Projects
${featuredProjects.length > 0 ? toBulletList(featuredProjects) : '- No featured projects available.'}

### Contact & Links
- Email: ${profile.email || 'Use contact page'}
- GitHub: ${profile.github || 'N/A'}
- LinkedIn: ${profile.linkedin || 'N/A'}
- Twitter: ${profile.twitter || 'N/A'}
- Resume: ${profile.resumeUrl || 'N/A'}
`
}
