'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa'
import { useProfileData } from '@/hooks/useProfileData'

export default function Footer() {
  const { profile } = useProfileData()
  const [year, setYear] = useState(2026)

  useEffect(() => {
    setYear(new Date().getFullYear())
  }, [])

  const ensureAbsoluteUrl = (url: string | undefined) => {
    if (!url) return undefined
    if (url.startsWith('http') || url.startsWith('mailto:')) return url
    return `https://${url}`
  }

  const socials = [
    { href: ensureAbsoluteUrl(profile.github), icon: FaGithub, label: 'GitHub' },
    { href: ensureAbsoluteUrl(profile.linkedin), icon: FaLinkedin, label: 'LinkedIn' },
    { href: ensureAbsoluteUrl(profile.twitter), icon: FaTwitter, label: 'Twitter' },
    { href: profile.email ? `mailto:${profile.email}` : undefined, icon: FaEnvelope, label: 'Email' },
  ].filter(s => s.href)

  return (
    <footer className="relative z-10 border-t border-[#1a1a2e] bg-[#07070f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <p className="font-orbitron font-black text-[#00fff0] text-lg tracking-widest mb-2 text-neon-cyan">
              {profile.name?.toUpperCase() || 'AMAN KUMAR YADAV'}
            </p>
            <p className="font-mono-tech text-[#4a4a6a] text-sm mb-4">
              {profile.tagline || 'AI · ML · Computer Vision'}
            </p>
            <p className="text-[#4a4a6a] text-sm leading-relaxed">
              Building intelligent systems that bridge the gap between human intelligence and machine capability.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <p className="font-orbitron text-xs text-[#00fff0] tracking-widest mb-4">NAVIGATION</p>
            <div className="flex flex-col gap-2">
              {[['/', 'Home'], ['/projects', 'Projects'], ['/blog', 'Blog'], ['/contact', 'Contact']].map(([href, label]) => (
                <Link key={href} href={href} className="font-mono-tech text-[#4a4a6a] hover:text-[#00fff0] text-sm transition-colors w-fit">
                  <span className="text-[#00fff0]/40 mr-2">//</span>{label}
                </Link>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div>
            <p className="font-orbitron text-xs text-[#00fff0] tracking-widest mb-4">CONNECT</p>
            <div className="flex gap-4 mb-6">
              {socials.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-[#1a1a2e] flex items-center justify-center text-[#4a4a6a] hover:text-[#00fff0] hover:border-[#00fff0] hover:shadow-[0_0_10px_rgba(0,255,240,0.3)] transition-all"
                  aria-label={label}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
            {profile.email && (
              <p className="font-mono-tech text-[#4a4a6a] text-xs">{profile.email}</p>
            )}
            {profile.location && (
              <p className="font-mono-tech text-[#4a4a6a] text-xs mt-1">
                📍 {profile.location}
              </p>
            )}
          </div>
        </div>

        <div className="border-t border-[#1a1a2e] mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-mono-tech text-[#4a4a6a] text-xs">
            © {year} {profile.name || 'Aman Kumar Yadav'}.
          </p>
          <p className="font-mono-tech text-[#4a4a6a] text-xs">
            <span className="text-[#00fff0]">STATUS:</span>{' '}
            <span className="text-[#00ff88]">ONLINE</span>
            {profile.availableForWork && ' · OPEN TO OPPORTUNITIES'}
          </p>
        </div>
      </div>
    </footer>
  )
}
