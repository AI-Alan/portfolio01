'use client'
import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { FaGraduationCap, FaBriefcase, FaTrophy, FaCode, FaLaptopCode } from 'react-icons/fa'

interface Experience {
  _id: string
  type: string
  title: string
  organization: string
  startDate: string
  endDate?: string
  current: boolean
  description: string
  tags?: string[]
}

const TYPE_COLORS: Record<string, string> = {
  Education: '#00fff0',
  Project: '#ff00ff',
  Achievement: '#ffff00',
  Internship: '#00ff88',
  Work: '#ff6600',
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  Education: <FaGraduationCap size={16} />,
  Project: <FaCode size={16} />,
  Achievement: <FaTrophy size={16} />,
  Internship: <FaBriefcase size={16} />,
  Work: <FaLaptopCode size={16} />,
}

function formatPeriod(exp: Experience): string {
  return exp.current
    ? `${exp.startDate} — Present`
    : exp.endDate
      ? `${exp.startDate} — ${exp.endDate}`
      : exp.startDate
}

export default function ExperienceSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [experiences, setExperiences] = useState<Experience[]>([])

  useEffect(() => {
    fetch('/api/experience')
      .then(r => r.json())
      .then(data => { if (data?.data) setExperiences(data.data) })
      .catch(() => {})
  }, [])

  return (
    <section id="experience" className="relative py-24 overflow-hidden" ref={ref}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(255,0,255,0.04) 0%, transparent 60%)' }} />

      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-mono-tech text-sm mb-3" style={{ color: 'var(--magenta)' }}>&gt; git log --oneline</p>
          <h2 className="section-title">Experience &amp; Timeline</h2>
          <p className="font-body text-sm mt-4" style={{ color: 'var(--dim)' }}>
            My journey through education, projects, and achievements
          </p>
        </motion.div>

        {experiences.length === 0 ? (
          <p className="text-center font-mono-tech text-sm" style={{ color: 'var(--dim)' }}>
            // No experience entries yet — add them via the admin panel
          </p>
        ) : (
          <div className="relative">
            {/* Center line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
              style={{ background: 'linear-gradient(180deg, transparent, var(--cyan) 10%, var(--magenta) 90%, transparent)' }} />

            <div className="space-y-8">
              {experiences.map((exp, i) => {
                const isLeft = i % 2 === 0
                const color = TYPE_COLORS[exp.type] || '#00fff0'
                const icon = TYPE_ICONS[exp.type] || <FaCode size={16} />

                return (
                  <motion.div
                    key={exp._id}
                    initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: i * 0.12 }}
                    className={`relative flex items-start gap-4 md:gap-0 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  >
                    {/* Card */}
                    <div className={`ml-12 md:ml-0 md:w-[calc(50%-2rem)] ${isLeft ? 'md:pr-8' : 'md:pl-8'}`}>
                      <div
                        className="cyber-card rounded-xl p-5 hud-corner group transition-all duration-300 cursor-default"
                        style={{ borderColor: `${color}25` }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLElement).style.borderColor = color
                          ;(e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${color}22`
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLElement).style.borderColor = `${color}25`
                          ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
                        }}
                      >
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div>
                            <span className="font-mono-tech text-xs px-2 py-0.5 rounded-full mb-2 inline-block"
                              style={{ background: `${color}18`, color, border: `1px solid ${color}33` }}>
                              {exp.type}
                            </span>
                            <h3 className="font-orbitron font-bold text-sm md:text-base" style={{ color: '#fff' }}>{exp.title}</h3>
                            <p className="font-mono-tech text-xs mt-1" style={{ color: 'var(--dim)' }}>{exp.organization}</p>
                          </div>
                          {exp.current && (
                            <span className="font-mono-tech text-xs px-2 py-0.5 rounded-full whitespace-nowrap flex items-center gap-1"
                              style={{ background: 'rgba(0,255,136,0.1)', color: 'var(--green)', border: '1px solid rgba(0,255,136,0.3)' }}>
                              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />CURRENT
                            </span>
                          )}
                        </div>

                        <p className="font-body text-sm leading-relaxed mb-3" style={{ color: 'rgba(200,200,232,0.7)' }}>
                          {exp.description}
                        </p>

                        {exp.tags && exp.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {exp.tags.map(tag => (
                              <span key={tag} className="font-mono-tech text-xs px-2 py-0.5 rounded"
                                style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--dim)', border: '1px solid rgba(255,255,255,0.07)' }}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="mt-3 font-mono-tech text-xs" style={{ color }}>
                          📅 {formatPeriod(exp)}
                        </div>
                      </div>
                    </div>

                    {/* Timeline dot */}
                    <div className="absolute left-6 md:left-1/2 -translate-x-1/2 top-6 z-10">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ background: `${color}18`, border: `2px solid ${color}`, boxShadow: `0 0 12px ${color}66, 0 0 24px ${color}33`, color }}>
                        {icon}
                      </div>
                    </div>

                    {/* Spacer */}
                    <div className="hidden md:block md:w-[calc(50%-2rem)]" />
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
