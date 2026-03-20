'use client'
import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import MatrixRain from '@/components/animations/MatrixRain'
import type { Skill } from '@/types'

const CATEGORY_COLORS: Record<string, string> = {
  'AI/ML': '#00fff0',
  'Computer Vision': '#ff00ff',
  'Web Dev': '#00ff88',
  'Tools & Languages': '#ffff00',
  Robotics: '#ff6600',
  Languages: '#8888ff',
  Tools: '#ffff00',
}

function SkillBar({ name, level, color, delay }: { name: string; level: number; color: string; delay: number }) {
  const [animated, setAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (inView) {
      const t = setTimeout(() => setAnimated(true), delay)
      return () => clearTimeout(t)
    }
  }, [inView, delay])

  return (
    <div ref={ref} className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="font-mono-tech text-sm" style={{ color: 'var(--text)' }}>{name}</span>
        <span className="font-orbitron text-xs font-bold" style={{ color }}>{level}%</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div
          className="h-full rounded-full transition-all ease-out"
          style={{
            width: animated ? `${level}%` : '0%',
            transitionDuration: '1200ms',
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            boxShadow: `0 0 8px ${color}66`,
          }}
        />
      </div>
    </div>
  )
}

interface SkillsSectionProps {
  skills: Skill[]
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [activeTab, setActiveTab] = useState('')

  useEffect(() => {
    const first = skills[0]?.category
    if (first && !activeTab) setActiveTab(first)
  }, [skills, activeTab])

  // Group skills by category
  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {})

  const categories = Object.keys(grouped)
  const activeColor = CATEGORY_COLORS[activeTab] || '#00fff0'
  const activeSkills = grouped[activeTab] || []

  return (
    <section id="skills" className="relative py-24 overflow-hidden" ref={ref}>
      {/* Matrix rain background */}
      <div className="absolute inset-0 z-0"><MatrixRain opacity={0.06} /></div>
      <div className="absolute inset-0 z-1" style={{ background: 'rgba(7,7,15,0.85)' }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-mono-tech text-sm mb-3" style={{ color: 'var(--magenta)' }}>&gt; ls skills/</p>
          <h2 className="section-title">Tech Stack</h2>
          <p className="font-body text-sm mt-4" style={{ color: 'var(--dim)' }}>
            Technologies I work with — from neural networks to web servers
          </p>
        </motion.div>

        {categories.length === 0 ? (
          <p className="text-center font-mono-tech text-sm" style={{ color: 'var(--dim)' }}>
            // No skills in DB yet — add them via the admin panel
          </p>
        ) : (
          <>
            {/* Tab selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-2 mb-12"
            >
              {categories.map((cat) => {
                const active = activeTab === cat
                const color = CATEGORY_COLORS[cat] || '#00fff0'
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveTab(cat)}
                    className="px-5 py-2 font-orbitron text-xs font-semibold tracking-wider uppercase rounded transition-all duration-300"
                    style={{
                      background: active ? `${color}18` : 'transparent',
                      border: `1px solid ${active ? color : 'rgba(255,255,255,0.1)'}`,
                      color: active ? color : 'var(--dim)',
                      boxShadow: active ? `0 0 15px ${color}33` : 'none',
                      textShadow: active ? `0 0 8px ${color}` : 'none',
                    }}
                  >
                    {cat}
                  </button>
                )
              })}
            </motion.div>

            {/* Skills panel */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-3xl mx-auto"
            >
              <div className="cyber-card rounded-xl p-8 hud-corner" style={{ borderColor: `${activeColor}30` }}>
                {/* Category header */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${activeColor}, transparent)` }} />
                  <span className="font-orbitron font-bold text-sm tracking-widest" style={{ color: activeColor }}>{activeTab}</span>
                  <div className="h-px flex-1" style={{ background: `linear-gradient(270deg, ${activeColor}, transparent)` }} />
                </div>
                <div className="grid md:grid-cols-2 gap-x-10">
                  {activeSkills.map((skill, i) => (
                    <SkillBar
                      key={skill._id}
                      name={skill.name}
                      level={skill.level}
                      color={skill.color || activeColor}
                      delay={i * 100}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </section>
  )
}
