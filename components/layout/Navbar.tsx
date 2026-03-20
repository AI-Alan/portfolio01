'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const links = [
  { href: '/', label: 'HOME' },
  { href: '/projects', label: 'PROJECTS' },
  { href: '/blog', label: 'BLOG' },
  { href: '/contact', label: 'CONTACT' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handle)
    return () => window.removeEventListener('scroll', handle)
  }, [])

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled
        ? 'bg-[#07070f]/95 backdrop-blur-md border-b border-[#00fff0]/20 shadow-[0_4px_20px_rgba(0,255,240,0.1)]'
        : 'bg-transparent'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 border border-[#00fff0] flex items-center justify-center relative group-hover:glow-box-cyan transition-all">
            <span className="font-orbitron font-black text-[#00fff0] text-sm">A</span>
            <div className="absolute inset-0 bg-[#00fff0]/10 group-hover:bg-[#00fff0]/20 transition-all" />
          </div>
          <div className="hidden sm:block">
            <p className="font-orbitron font-bold text-white text-sm leading-none tracking-widest">AMAN</p>
            <p className="font-mono-tech text-[#00fff0] text-[10px] tracking-[0.3em]">AI // ML // CV</p>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative px-4 py-2 font-orbitron text-xs tracking-widest transition-all duration-200 group',
                  active ? 'text-[#00fff0]' : 'text-[#c8c8e8] hover:text-[#00fff0]'
                )}
              >
                {active && (
                  <span className="absolute inset-0 bg-[#00fff0]/10 border border-[#00fff0]/30" />
                )}
                <span className="relative z-10">{link.label}</span>
                {!active && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-[#00fff0] group-hover:w-full transition-all duration-300" />
                )}
              </Link>
            )
          })}

        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className={cn('w-6 h-0.5 bg-[#00fff0] transition-all', menuOpen && 'rotate-45 translate-y-2')} />
          <span className={cn('w-6 h-0.5 bg-[#00fff0] transition-all', menuOpen && 'opacity-0')} />
          <span className={cn('w-6 h-0.5 bg-[#00fff0] transition-all', menuOpen && '-rotate-45 -translate-y-2')} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0d0d1a]/98 backdrop-blur-md border-b border-[#00fff0]/20">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block px-6 py-4 font-orbitron text-xs tracking-widest border-b border-[#1a1a2e] text-[#c8c8e8] hover:text-[#00fff0] hover:bg-[#00fff0]/5 transition-all"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
