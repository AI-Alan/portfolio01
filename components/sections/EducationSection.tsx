'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FaGraduationCap, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa'
import type { ExperienceItem } from '@/lib/getExperienceData'

interface EducationSectionProps {
  education: ExperienceItem[]
}

export default function EducationSection({ education }: EducationSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="education" className="relative py-24 overflow-hidden" ref={ref}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--cyan) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <p className="font-mono-tech text-sm mb-3" style={{ color: 'var(--cyan)' }}>
            &gt; ls /academic_records
          </p>
          <h2 className="section-title">Education</h2>
        </motion.div>

        {education.length === 0 ? (
          <p className="font-mono-tech text-sm" style={{ color: 'var(--dim)' }}>
            // No education entries available right now.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {education.map((edu, i) => (
            <motion.div
              key={edu._id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="cyber-card rounded-2xl p-8 hud-corner relative group overflow-hidden"
              style={{ borderColor: 'rgba(0,255,240,0.15)', background: 'rgba(10,10,20,0.4)' }}
            >
              {/* Decorative side accent */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-transparent transition-all duration-500 group-hover:h-full h-12" />
              
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(0,255,240,0.08)', border: '1px solid rgba(0,255,240,0.2)', color: 'var(--cyan)' }}>
                  <FaGraduationCap size={24} />
                </div>
                {edu.current && (
                  <span className="font-mono-tech text-[10px] px-2 py-1 rounded-full border border-green-500/30 text-green-400 bg-green-500/10 animate-pulse">
                    ENROLLED
                  </span>
                )}
              </div>

              <h3 className="font-orbitron font-bold text-xl mb-2 text-white group-hover:text-cyan-400 transition-colors">
                {edu.title}
              </h3>
              <p className="font-mono-tech text-sm mb-6" style={{ color: 'var(--dim)' }}>
                {edu.organization}
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 font-mono-tech text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  <FaCalendarAlt className="text-cyan-400" />
                  <span>{edu.startDate} — {edu.current ? 'Present' : edu.endDate}</span>
                </div>
                {edu.location && (
                  <div className="flex items-center gap-3 font-mono-tech text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    <FaMapMarkerAlt className="text-magenta-400" />
                    <span>{edu.location}</span>
                  </div>
                )}
              </div>

              <div className="font-body text-sm leading-relaxed mb-6" style={{ color: 'rgba(200,200,232,0.7)' }}>
                {edu.description}
              </div>

              {edu.tags && edu.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {edu.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-white/5 border border-white/10" style={{ color: 'var(--dim)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Holographic scanner effect on hover */}
              <div className="absolute inset-x-0 top-0 h-1 bg-cyan-400/20 opacity-0 group-hover:opacity-100 group-hover:animate-scan-down pointer-events-none" />
            </motion.div>
            ))}
          </div>
        )}
      </div>

    </section>
  )
}
