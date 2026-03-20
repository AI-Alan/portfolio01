'use client'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import NeuralNetCanvas from '@/components/animations/NeuralNetCanvas'
import { FaGithub, FaLinkedin, FaWhatsapp, FaEnvelope, FaDownload } from 'react-icons/fa'
import { HiArrowDown } from 'react-icons/hi'
import { useProfileData } from '@/hooks/useProfileData'

export default function HeroSection() {
  const { profile } = useProfileData()

  const taglines = profile.heroTypingTexts?.length
    ? profile.heroTypingTexts
    : ['AI & ML Engineer', 'Computer Vision Developer']

  const [taglineIndex, setTaglineIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [glitchActive, setGlitchActive] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()

  // Typing animation
  useEffect(() => {
    const current = taglines[taglineIndex % taglines.length]
    const speed = isDeleting ? 40 : 80

    timeoutRef.current = setTimeout(() => {
      if (!isDeleting && displayed.length < current.length) {
        setDisplayed(current.slice(0, displayed.length + 1))
      } else if (!isDeleting && displayed.length === current.length) {
        setTimeout(() => setIsDeleting(true), 2000)
      } else if (isDeleting && displayed.length > 0) {
        setDisplayed(current.slice(0, displayed.length - 1))
      } else {
        setIsDeleting(false)
        setTaglineIndex((i) => (i + 1) % taglines.length)
      }
    }, speed)

    return () => clearTimeout(timeoutRef.current)
  }, [displayed, isDeleting, taglineIndex, taglines])

  // Random glitch trigger
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setGlitchActive(true)
        setTimeout(() => setGlitchActive(false), 300)
      }
    }, 3000)
    return () => clearInterval(glitchInterval)
  }, [])

  const ensureAbsoluteUrl = (url: string | undefined) => {
    if (!url) return undefined
    if (url.startsWith('http')) return url
    return `https://${url}`
  }

  const toWhatsappHref = (value: string | undefined) => {
    if (!value) return undefined
    if (value.startsWith('http')) return value
    const digitsOnly = value.replace(/\D/g, '')
    return digitsOnly ? `https://wa.me/${digitsOnly}` : undefined
  }

  const socials = [
    { icon: <FaGithub size={20} />, href: ensureAbsoluteUrl(profile.github), label: 'GitHub' },
    { icon: <FaLinkedin size={20} />, href: ensureAbsoluteUrl(profile.linkedin), label: 'LinkedIn' },
    { icon: <FaWhatsapp size={20} />, href: toWhatsappHref(profile.whatsapp), label: 'WhatsApp' },
    { icon: <FaEnvelope size={20} />, href: profile.email ? `mailto:${profile.email}` : undefined, label: 'Email' },
  ].filter((s) => s.href)

  const displayName = profile.name || 'Aman Kumar Yadav'
  const nameParts = displayName.split(' ')
  // Middle word(s) highlighted in cyan; fallback to full name
  const firstName = nameParts[0] ?? ''
  const middleName = nameParts.length > 2 ? nameParts.slice(1, -1).join(' ') : nameParts[1] ?? ''
  const lastName = nameParts.length > 2 ? nameParts[nameParts.length - 1] : ''

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" id="hero">
      {/* Neural network background */}
      <div className="absolute inset-0 z-0">
        <NeuralNetCanvas />
      </div>

      {/* Radial glow */}
      <div className="absolute inset-0 z-1 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(0,255,240,0.08) 0%, transparent 70%)' }} />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(255,0,255,0.06) 0%, transparent 70%)' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Status badge */}
        {/* <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full text-xs font-mono-tech"
          style={{ border: '1px solid rgba(0,255,240,0.3)', background: 'rgba(0,255,240,0.05)' }}
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-cyber-green">SYSTEM ONLINE</span>
          <span className="text-cyber-dim mx-2">|</span>
          <span className="text-cyber-text">
            {profile.tagline || 'AI / ML Engineer'}
            {profile.location ? ` · ${profile.location}` : ''}
          </span>
        </motion.div> */}

        {/* Glitch name */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-4"
        >
          <h1
            className={`font-orbitron font-black leading-none select-none ${glitchActive ? 'glitch-text' : ''}`}
            data-text={displayName.toUpperCase()}
            style={{
              fontSize: 'clamp(2.2rem, 7vw, 5.5rem)',
              color: '#fff',
              textShadow: '0 0 30px rgba(0,255,240,0.4), 0 0 60px rgba(0,255,240,0.2)',
              letterSpacing: '0.05em',
            }}
          >
            {firstName.toUpperCase()}{' '}
            <span style={{ color: 'var(--cyan)' }}>{middleName.toUpperCase()}</span>
            {lastName ? ` ${lastName.toUpperCase()}` : ''}
          </h1>
        </motion.div>

        {/* Typing tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-8 h-10 flex items-center justify-center"
        >
          <span className="font-mono-tech text-lg md:text-2xl" style={{ color: 'var(--magenta)' }}>
            &gt; {displayed}
            <span className="typing-cursor" />
          </span>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-cyber-text font-body text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ color: 'rgba(200,200,232,0.75)' }}
        >
          {profile.bio
            ? profile.bio
            : 'Passionate about AI, Machine Learning, and Computer Vision. Turning data into intelligence and pixels into understanding.'}
          {profile.availableForWork && (
            <span style={{ color: 'var(--cyan)' }}> Open to internships &amp; research collaborations.</span>
          )}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-12"
        >
          <a href="/projects"
            className="neon-border-animated px-8 py-3 font-orbitron font-semibold text-sm tracking-widest uppercase transition-all duration-300 hover:scale-105"
            style={{ background: 'rgba(0,255,240,0.08)', color: 'var(--cyan)' }}
          >
            View Projects
          </a>
          <a href="/contact"
            className="px-8 py-3 font-orbitron font-semibold text-sm tracking-widest uppercase transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, rgba(255,0,255,0.2), rgba(0,255,240,0.2))',
              border: '1px solid rgba(255,0,255,0.4)',
              color: 'var(--magenta)',
            }}
          >
            Hire Me
          </a>
          {profile.resumeUrl && (
            <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 font-mono-tech text-sm transition-all duration-300 hover:scale-105"
              style={{ border: '1px solid rgba(200,200,232,0.2)', color: 'rgba(200,200,232,0.6)' }}
            >
              <FaDownload size={14} /> Resume
            </a>
          )}
        </motion.div>

        {/* Social links */}
        {socials.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="flex items-center justify-center gap-6 mb-16"
          >
            {socials.map(({ icon, href, label }) => (
              <a key={label} href={href!} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-125"
                style={{ border: '1px solid rgba(0,255,240,0.25)', color: 'rgba(0,255,240,0.6)' }}
                onMouseEnter={e => {
                  const el = e.currentTarget
                  el.style.borderColor = 'var(--cyan)'
                  el.style.color = 'var(--cyan)'
                  el.style.boxShadow = '0 0 15px rgba(0,255,240,0.4)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget
                  el.style.borderColor = 'rgba(0,255,240,0.25)'
                  el.style.color = 'rgba(0,255,240,0.6)'
                  el.style.boxShadow = 'none'
                }}
              >
                {icon}
              </a>
            ))}
          </motion.div>
        )}

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="flex flex-col items-center gap-2"
        >
          <span className="font-mono-tech text-xs" style={{ color: 'rgba(0,255,240,0.4)' }}>SCROLL</span>
          <HiArrowDown style={{ color: 'var(--cyan)', opacity: 0.5 }} />
        </motion.div>
      </div>

      {/* HUD corner decorations */}
      <div className="absolute top-8 left-8 pointer-events-none">
        <div className="w-6 h-6" style={{ borderTop: '2px solid var(--cyan)', borderLeft: '2px solid var(--cyan)' }} />
      </div>
      <div className="absolute top-8 right-8 pointer-events-none">
        <div className="w-6 h-6" style={{ borderTop: '2px solid var(--cyan)', borderRight: '2px solid var(--cyan)' }} />
      </div>
      <div className="absolute bottom-8 left-8 pointer-events-none">
        <div className="w-6 h-6" style={{ borderBottom: '2px solid var(--magenta)', borderLeft: '2px solid var(--magenta)' }} />
      </div>
      <div className="absolute bottom-8 right-8 pointer-events-none">
        <div className="w-6 h-6" style={{ borderBottom: '2px solid var(--magenta)', borderRight: '2px solid var(--magenta)' }} />
      </div>

      {/* Decorative scan line */}
      <div className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, var(--cyan), transparent)' }} />
    </section>
  )
}
