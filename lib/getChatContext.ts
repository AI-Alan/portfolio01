import { getExperienceData } from '@/lib/getExperienceData'
import { getPrivateNotesData } from '@/lib/getPrivateNotesData'
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
  const [profile, projects, skills, experience, privateNotes] = await Promise.all([
    getProfileData(),
    getProjectsData(),
    getSkillsData(),
    getExperienceData(),
    getPrivateNotesData(),
  ])

  const projectBullets = projects
    .slice(0, 8)
    .map((project) => {
      const tags = project.tags.length > 0 ? ` | Tags: ${project.tags.slice(0, 4).join(', ')}` : ''
      return `${project.title} (${project.category})${tags}`
    })

  const skillBullets = skills
    .slice(0, 14)
    .map((skill) => `${skill.name} [${skill.category}] - ${skill.level}%`)

  const experienceBullets = experience
    .slice(0, 8)
    .map((item) => {
      const period = `${item.startDate} to ${item.current ? 'Present' : item.endDate || 'N/A'}`
      const tags = item.tags && item.tags.length > 0 ? ` | Tags: ${item.tags.slice(0, 4).join(', ')}` : ''
      return `${item.type}: ${item.title} at ${item.organization} (${period})${tags}`
    })

  const privateNoteBullets = privateNotes
    .slice(0, 10)
    .map((note) => {
      const keys = note.keywords.length > 0 ? ` | Keywords: ${note.keywords.join(', ')}` : ''
      return `${note.topic} (${note.title})${keys} | Details: ${note.content}`
    })

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

### Skills
${skillBullets.length > 0 ? toBulletList(skillBullets) : '- No skills found.'}

### Experience & Education
${experienceBullets.length > 0 ? toBulletList(experienceBullets) : '- No experience entries found.'}

### Projects
${projectBullets.length > 0 ? toBulletList(projectBullets) : '- No projects found.'}

### Private Notes (chat-only)
${privateNoteBullets.length > 0 ? toBulletList(privateNoteBullets) : '- No private notes found.'}

### Contact & Links
- Email: ${profile.email || 'Use contact page'}
- GitHub: ${profile.github || 'N/A'}
- LinkedIn: ${profile.linkedin || 'N/A'}
- Twitter: ${profile.twitter || 'N/A'}
- Resume: ${profile.resumeUrl || 'N/A'}
`
}
