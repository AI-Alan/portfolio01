'use client'
import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa'

interface Project {
  _id: string
  title: string
  description: string
  tags: string[]
  category: string
  github?: string
  demo?: string
  featured: boolean
}

const CAT_COLORS: Record<string, string> = {
  AI: '#00fff0', ML: '#ff00ff', Robotics: '#ffff00', Web: '#00ff88', CV: '#ff00ff', Other: '#8888ff',
}

const CAT_ACCENT: Record<string, string> = {
  AI: '#00fff0', ML: '#ff00ff', Robotics: '#ffff00', Web: '#00ff88', CV: '#ff00ff', Other: '#8888ff',
}

export default function FeaturedProjects() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    fetch('/api/projects?featured=true')
      .then(r => r.json())
      .then(data => { if (data?.data) setProjects(data.data) })
      .catch(() => {})
  }, [])

  return (
    <section id="projects-preview" className="relative py-24 overflow-hidden" ref={ref}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(0,255,240,0.04) 0%, transparent 60%)' }} />

      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-mono-tech text-sm mb-3" style={{ color: 'var(--magenta)' }}>
            &gt; ls projects/ --featured
          </p>
          <h2 className="section-title">Featured Projects</h2>
        </motion.div>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-mono-tech text-sm mb-2" style={{ color: 'var(--dim)' }}>
              // No featured projects yet
            </p>
            <p className="font-mono-tech text-xs" style={{ color: 'rgba(74,74,106,0.5)' }}>
              Add projects and mark them as featured in the admin panel
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {projects.map((project, i) => {
              const color = CAT_COLORS[project.category] ?? '#00fff0'
              return (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="cyber-card rounded-xl overflow-hidden group flex flex-col"
                  style={{ borderColor: 'rgba(255,255,255,0.06)', transition: 'all 0.3s' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = color
                    ;(e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${color}22`
                    ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'
                    ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
                    ;(e.currentTarget as HTMLElement).style.transform = 'none'
                  }}
                >
                  {/* Top bar */}
                  <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />

                  <div className="p-6 flex flex-col flex-1">
                    {/* Category badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono-tech text-xs px-2 py-0.5 rounded-full"
                        style={{ background: `${CAT_ACCENT[project.category] ?? color}18`, color: CAT_ACCENT[project.category] ?? color, border: `1px solid ${CAT_ACCENT[project.category] ?? color}33` }}>
                        {project.category}
                      </span>
                    </div>

                    <h3 className="font-orbitron font-bold text-sm md:text-base mb-3" style={{ color: '#fff' }}>
                      {project.title}
                    </h3>

                    <p className="font-body text-sm leading-relaxed flex-1 mb-4" style={{ color: 'rgba(200,200,232,0.65)' }}>
                      {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {project.tags.map(tag => (
                        <span key={tag} className="font-mono-tech text-xs px-2 py-0.5 rounded"
                          style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--dim)', border: '1px solid rgba(255,255,255,0.07)' }}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Links */}
                    <div className="flex gap-3">
                      {project.github && (
                        <a href={project.github} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 font-mono-tech text-xs transition-all duration-200 hover:scale-105"
                          style={{ color: 'var(--dim)' }}
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#fff'}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--dim)'}
                        >
                          <FaGithub size={13} /> Code
                        </a>
                      )}
                      {project.demo && (
                        <a href={project.demo} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 font-mono-tech text-xs transition-all duration-200 hover:scale-105"
                          style={{ color }}
                        >
                          <FaExternalLinkAlt size={11} /> Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 }}
          className="text-center mt-12"
        >
          <Link
            href="/projects"
            className="neon-border-animated inline-flex items-center gap-2 px-8 py-3 font-orbitron font-semibold text-sm tracking-wider uppercase transition-all duration-300 hover:scale-105 rounded"
            style={{ color: 'var(--cyan)', background: 'rgba(0,255,240,0.05)' }}
          >
            View All Projects →
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
