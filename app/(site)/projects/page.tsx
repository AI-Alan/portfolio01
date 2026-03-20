'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MatrixRain from '@/components/animations/MatrixRain'
import { FaGithub, FaExternalLinkAlt, FaSearch } from 'react-icons/fa'
import type { Project } from '@/types'

const CATEGORIES = ['All', 'AI', 'ML', 'CV', 'Web', 'Robotics', 'Other']
const CAT_COLORS: Record<string, string> = {
  AI: '#00fff0', ML: '#ff00ff', CV: '#ff00ff', Web: '#00ff88', Robotics: '#ffff00', Other: '#8888ff', All: '#ffffff',
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/projects')
      .then(r => r.json())
      .then(d => { if (d.success) setProjects(d.data ?? []) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = projects.filter(p => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory
    const matchSearch = !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    return matchCat && matchSearch
  })

  return (
    <main className="min-h-screen pt-20 pb-20">
      {/* Matrix rain bg */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <MatrixRain opacity={0.07} />
        <div className="absolute inset-0" style={{ background: 'rgba(7,7,15,0.88)' }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 pt-8"
        >
          <p className="font-mono-tech text-sm mb-3" style={{ color: 'var(--magenta)' }}>
            &gt; ls ~/projects -la
          </p>
          <h1 className="section-title text-4xl md:text-5xl">Projects</h1>
          <p className="font-body mt-4 text-sm" style={{ color: 'var(--dim)' }}>
            {loading ? 'Loading...' : `${projects.length} project${projects.length !== 1 ? 's' : ''} across AI, ML, Computer Vision & Web Development`}
          </p>
        </motion.div>

        {/* Search + Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 mb-10"
        >
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-dim" size={13} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-9 pr-4 py-2.5 font-mono-tech text-sm rounded-lg outline-none"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(0,255,240,0.2)',
                color: 'var(--text)',
              }}
              onFocus={e => (e.target.style.borderColor = 'var(--cyan)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(0,255,240,0.2)')}
            />
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => {
              const active = activeCategory === cat
              const color = CAT_COLORS[cat]
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="px-4 py-2 font-orbitron text-xs font-semibold tracking-wider uppercase rounded transition-all duration-300"
                  style={{
                    background: active ? `${color}18` : 'transparent',
                    border: `1px solid ${active ? color : 'rgba(255,255,255,0.1)'}`,
                    color: active ? color : 'var(--dim)',
                    boxShadow: active ? `0 0 12px ${color}33` : 'none',
                  }}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Grid */}
        <AnimatePresence mode="popLayout">
          <motion.div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((project, i) => {
              const color = CAT_COLORS[project.category] || '#8888ff'
              return (
                <motion.div
                  key={project._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  className="cyber-card rounded-xl overflow-hidden flex flex-col"
                  style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = color
                    ;(e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${color}22`
                    ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'
                    ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
                    ;(e.currentTarget as HTMLElement).style.transform = 'none'
                  }}
                >
                  <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono-tech text-xs px-2 py-0.5 rounded-full"
                        style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
                        {project.category}
                      </span>
                      {project.featured && (
                        <span className="font-mono-tech text-xs" style={{ color: 'var(--yellow)' }}>★ Featured</span>
                      )}
                    </div>
                    <h3 className="font-orbitron font-bold text-sm mb-2" style={{ color: '#fff' }}>
                      {project.title}
                    </h3>
                    <p className="font-body text-xs leading-relaxed flex-1 mb-3" style={{ color: 'rgba(200,200,232,0.65)' }}>
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.tags.slice(0, 4).map(tag => (
                        <span key={tag} className="font-mono-tech text-xs px-1.5 py-0.5 rounded"
                          style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--dim)', border: '1px solid rgba(255,255,255,0.07)' }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      {project.github && (
                        <a href={project.github} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 font-mono-tech text-xs transition-all hover:scale-105"
                          style={{ color: 'var(--dim)' }}
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#fff'}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--dim)'}
                        >
                          <FaGithub size={12} /> GitHub
                        </a>
                      )}
                      {project.demo && (
                        <a href={project.demo} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 font-mono-tech text-xs transition-all hover:scale-105"
                          style={{ color }}>
                          <FaExternalLinkAlt size={10} /> Demo
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </AnimatePresence>

        {loading && (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4" />
            <p className="font-mono-tech text-sm" style={{ color: 'var(--dim)' }}>// Loading projects...</p>
          </div>
        )}

        {!loading && projects.length === 0 && (
          <div className="text-center py-20 cyber-card rounded-xl p-12" style={{ borderColor: 'rgba(0,255,240,0.1)' }}>
            <p className="font-orbitron font-bold text-2xl mb-4" style={{ color: 'var(--cyan)' }}>[ EMPTY ]</p>
            <p className="font-mono-tech text-sm mb-2" style={{ color: 'var(--dim)' }}>// No projects added yet</p>
            <p className="font-mono-tech text-xs" style={{ color: 'rgba(74,74,106,0.5)' }}>Add projects via the admin panel to see them here</p>
          </div>
        )}

        {!loading && projects.length > 0 && filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="font-mono-tech text-sm" style={{ color: 'var(--dim)' }}>
              &gt; No projects matching &quot;{search}&quot; in [{activeCategory}]
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
