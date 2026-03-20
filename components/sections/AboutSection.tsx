'use client'
import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import FloatingParticles from '@/components/animations/FloatingParticles'
import { FaBrain, FaRobot, FaCode, FaEye } from 'react-icons/fa'
import { useProfileData } from '@/hooks/useProfileData'
import { getDirectImageUrl } from '@/lib/utils'

interface FocusArea {
  _id?: string
  title: string
  description: string
  icon: string
  color: string
}

const ICON_MAP: Record<string, any> = {
  brain: <FaBrain size={22} />,
  eye: <FaEye size={22} />,
  code: <FaCode size={22} />,
  robot: <FaRobot size={22} />,
}

// Fallback / Initial templates
const FALLBACK_FOCUS: FocusArea[] = [
  { icon: 'brain', title: 'Artificial Intelligence', description: 'Deep learning, transformers, LLMs', color: 'var(--cyan)' },
  { icon: 'eye', title: 'Computer Vision', description: 'YOLO, OpenCV, image segmentation', color: 'var(--magenta)' },
  { icon: 'code', title: 'Web Development', description: 'React, Next.js, Node.js, APIs', color: 'var(--green)' },
  { icon: 'robot', title: 'Robotics', description: 'ROS, Arduino, sensor fusion', color: 'var(--yellow)' },
]

export default function AboutSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const { profile } = useProfileData()
  const [focusAreas, setFocusAreas] = useState<FocusArea[]>([])

  useEffect(() => {
    fetch('/api/focus-areas')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setFocusAreas(data)
        } else {
          setFocusAreas(FALLBACK_FOCUS)
        }
      })
      .catch(() => setFocusAreas(FALLBACK_FOCUS))
  }, [])

  const stats = [
    { label: 'Projects Built', value: profile.projectsCount || '0', color: 'var(--cyan)' },
    { label: 'Technologies', value: profile.technologiesCount || '0', color: 'var(--magenta)' },
    { label: 'Year of Study', value: profile.yearOfStudy || '—', color: 'var(--yellow)' },
    { label: 'Cups of Coffee', value: profile.coffeeCups || '∞', color: 'var(--green)' },
  ]

  const bioParagraphs: string[] = profile.bio
    ? profile.bio.split('\n').filter(Boolean)
    : [
        'Passionate about the intersection of Artificial Intelligence, Machine Learning, and Computer Vision.',
        'Building systems that can see, learn, and decide — from training custom YOLO models to full-stack AI web apps.',
        profile.availableForWork ? 'Currently open to internships and research collaborations in AI/ML and intelligent systems.' : '',
      ].filter(Boolean)

  return (
    <section id="about" className="relative py-24 overflow-hidden" ref={ref}>
      {/* Floating particles bg */}
      <div className="absolute inset-0 z-0 opacity-40">
        <FloatingParticles />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-mono-tech text-sm mb-3" style={{ color: 'var(--magenta)' }}>
            &gt; cat about_me.txt
          </p>
          <h2 className="section-title">About Me</h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left — Avatar */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex flex-col items-center gap-8"
          >
            {/* Avatar HUD frame */}
            <div className="relative">
              <div className="w-56 h-56 rounded-lg overflow-hidden relative hud-corner hologram"
                style={{ border: '1px solid rgba(0,255,240,0.3)' }}>
                {profile.profileImage ? (
                  <img src={getDirectImageUrl(profile.profileImage)} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #0d0d1a, #1a1a2e)' }}>
                    <div className="text-center">
                      <div className="font-orbitron font-black text-5xl"
                        style={{ color: 'var(--cyan)', textShadow: '0 0 30px var(--cyan)' }}>
                        {profile.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'AK'}
                      </div>
                      <div className="font-mono-tech text-xs mt-2" style={{ color: 'var(--dim)' }}>
                        {profile.name?.split(' ').slice(0, 2).join(' ').toUpperCase() || 'AMAN KUMAR'}
                      </div>
                    </div>
                  </div>
                )}
                {/* Scanline overlay */}
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,255,240,0.03) 3px, rgba(0,255,240,0.03) 4px)' }} />
              </div>
              {/* Orbital rings */}
              <div className="absolute inset-0 -m-4 border rounded-full pointer-events-none animate-spin"
                style={{ borderColor: 'rgba(0,255,240,0.1)', animationDuration: '8s' }} />
              <div className="absolute inset-0 -m-8 border rounded-full pointer-events-none animate-spin"
                style={{ borderColor: 'rgba(255,0,255,0.08)', animationDuration: '12s', animationDirection: 'reverse' }} />
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3 w-full">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                  className="cyber-card hud-corner p-4 text-center rounded"
                >
                  <div className="font-orbitron font-black text-2xl mb-1" style={{ color: stat.color, textShadow: `0 0 10px ${stat.color}` }}>
                    {stat.value}
                  </div>
                  <div className="font-mono-tech text-xs" style={{ color: 'var(--dim)' }}>
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Location + status */}
            <div className="flex flex-col items-center gap-2">
              {profile.location && (
                <span className="font-mono-tech text-sm" style={{ color: 'var(--dim)' }}>
                  📍 {profile.location}
                </span>
              )}
              {profile.availableForWork && (
                <span className="font-mono-tech text-xs px-3 py-1 rounded-full flex items-center gap-2"
                  style={{ background: 'rgba(0,255,136,0.1)', color: 'var(--green)', border: '1px solid rgba(0,255,136,0.3)' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  OPEN TO WORK
                </span>
              )}
            </div>
          </motion.div>

          {/* Right — Bio + Focus Areas */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            {/* Terminal-style bio */}
            <div className="cyber-card rounded-lg p-6" style={{ borderColor: 'rgba(0,255,240,0.2)' }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="font-mono-tech text-xs ml-2" style={{ color: 'var(--dim)' }}>bio.sh</span>
              </div>
              <div className="font-mono-tech text-sm space-y-3" style={{ color: 'var(--text)' }}>
                <p><span style={{ color: 'var(--cyan)' }}>$ whoami</span></p>
                {bioParagraphs.map((para, i) => (
                  <p key={i} style={{ color: 'rgba(200,200,232,0.8)', lineHeight: 1.7, fontFamily: "'Exo 2', sans-serif", fontSize: '0.95rem' }}>
                    {i === 0 && (
                      <>Hey! I&apos;m <span style={{ color: 'var(--cyan)' }}>{profile.name}</span>, </>
                    )}
                    {i === 0 ? para : para}
                  </p>
                ))}
                <p><span style={{ color: 'var(--cyan)' }}>$ _</span><span className="typing-cursor" /></p>
              </div>
            </div>

            {/* Focus areas */}
            <div className="grid grid-cols-2 gap-3">
              {focusAreas.map((area, i) => (
                <motion.div
                  key={area.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                  className="cyber-card rounded-lg p-4 group cursor-default"
                  style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                  onMouseEnter={e => {
                    const color = area.color || 'var(--cyan)'
                    ;(e.currentTarget as HTMLElement).style.borderColor = color
                    ;(e.currentTarget as HTMLElement).style.boxShadow = `0 0 15px ${color.startsWith('var') ? 'rgba(0,255,240,0.1)' : color + '22'}`
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'
                    ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
                  }}
                >
                  <div className="mb-2 transition-transform duration-300 group-hover:scale-110" style={{ color: area.color || 'var(--cyan)' }}>
                    {ICON_MAP[area.icon] || <FaBrain size={22} />}
                  </div>
                  <div className="font-orbitron font-semibold text-xs mb-1" style={{ color: area.color || 'var(--cyan)' }}>
                    {area.title}
                  </div>
                  <div className="font-mono-tech text-xs" style={{ color: 'var(--dim)' }}>
                    {area.description}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
