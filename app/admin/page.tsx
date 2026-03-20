'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  FaLock, FaSignOutAlt, FaPlus, FaEdit, FaTrash,
  FaFolder, FaNewspaper, FaTools, FaBriefcase, FaEnvelope,
  FaTimes, FaSave, FaEye, FaEyeSlash, FaUser, FaBrain
} from 'react-icons/fa'

/* ── Types ─────────────────────────────────────────────── */
type Tab = 'profile' | 'focus' | 'projects' | 'blogs' | 'skills' | 'experience' | 'messages'

interface FormField { label: string; key: string; type: string; options?: string[] }

/* ── Reusable mini-components ──────────────────────────── */
const NeonInput = ({
  label, value, onChange, type = 'text', options, required
}: {
  label: string; value: string | number | boolean; onChange: (v: string) => void
  type?: string; options?: string[]; required?: boolean
}) => {
  const base = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(0,255,240,0.2)',
    color: 'var(--text)',
    outline: 'none',
    fontFamily: '"Share Tech Mono", monospace',
    fontSize: '13px',
    padding: '10px 14px',
    borderRadius: '8px',
    width: '100%',
    transition: 'border-color 0.2s',
  }
  const focus = (e: React.FocusEvent<HTMLElement>) =>
    ((e.target as HTMLElement).style.borderColor = 'var(--cyan)')
  const blur = (e: React.FocusEvent<HTMLElement>) =>
    ((e.target as HTMLElement).style.borderColor = 'rgba(0,255,240,0.2)')

  return (
    <div>
      <label className="font-mono-tech text-xs block mb-1.5" style={{ color: 'var(--cyan)' }}>
        {label}{required && <span style={{ color: 'var(--magenta)' }}> *</span>}
      </label>
      {type === 'select' && options ? (
        <select value={String(value)} onChange={e => onChange(e.target.value)}
          style={{ ...base, cursor: 'pointer' }} onFocus={focus} onBlur={blur}>
          {options.map(o => <option key={o} value={o} style={{ background: '#0d0d1a' }}>{o}</option>)}
        </select>
      ) : type === 'textarea' ? (
        <textarea value={String(value)} onChange={e => onChange(e.target.value)}
          rows={4} style={{ ...base, resize: 'vertical' }} onFocus={focus} onBlur={blur} />
      ) : type === 'checkbox' ? (
        <div className="flex items-center gap-2 mt-1">
          <input type="checkbox" checked={value === 'true'}
            onChange={e => onChange(String(e.target.checked))}
            className="w-4 h-4 accent-cyan-400" />
          <span className="font-mono-tech text-xs" style={{ color: 'var(--text)' }}>Yes</span>
        </div>
      ) : (
        <input type={type} value={String(value)} onChange={e => onChange(e.target.value)}
          required={required} style={base} onFocus={focus} onBlur={blur} />
      )}
    </div>
  )
}

/* ── CRUD Modal ──────────────────────────────────────────── */
function CrudModal({
  title, fields, data, onSave, onClose, loading
}: {
  title: string
  fields: FormField[]
  data: Record<string, unknown>
  onSave: (d: Record<string, unknown>) => void
  onClose: () => void
  loading: boolean
}) {
  const [form, setForm] = useState<Record<string, unknown>>({ ...data })

  const set = (k: string, v: string) => {
    setForm(prev => ({
      ...prev,
      [k]: v === 'true' ? true : v === 'false' ? false : v
    }))
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl p-6"
        style={{ background: '#0d0d1a', border: '1px solid rgba(0,255,240,0.3)', boxShadow: '0 0 40px rgba(0,255,240,0.12)' }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-orbitron font-bold text-sm" style={{ color: 'var(--cyan)' }}>{title}</h3>
          <button onClick={onClose} style={{ color: 'var(--dim)' }} className="hover:text-red-400 transition-colors">
            <FaTimes size={14} />
          </button>
        </div>

        <div className="space-y-4">
          {fields.map(f => (
            <NeonInput
              key={f.key}
              label={f.label}
              value={String(form[f.key] ?? '')}
              onChange={v => set(f.key, v)}
              type={f.type}
              options={f.options}
            />
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={() => onSave(form)} disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 font-orbitron text-xs font-bold tracking-widest uppercase rounded-lg transition-all disabled:opacity-50"
            style={{ background: 'rgba(0,255,240,0.1)', border: '1px solid var(--cyan)', color: 'var(--cyan)' }}>
            <FaSave size={12} /> {loading ? 'Saving...' : 'Save'}
          </button>
          <button onClick={onClose}
            className="px-6 py-2.5 font-orbitron text-xs font-bold uppercase rounded-lg transition-all"
            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--dim)' }}>
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  )
}

/* ── Delete Confirm ─────────────────────────────────────── */
function DeleteConfirm({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="rounded-xl p-6 w-80 text-center"
        style={{ background: '#0d0d1a', border: '1px solid rgba(255,0,0,0.4)' }}
      >
        <div className="text-3xl mb-3">⚠️</div>
        <p className="font-orbitron text-sm text-white mb-2">Confirm Delete</p>
        <p className="font-mono-tech text-xs mb-6" style={{ color: 'var(--dim)' }}>
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onConfirm}
            className="flex-1 py-2 font-orbitron text-xs font-bold uppercase rounded-lg"
            style={{ background: 'rgba(255,0,0,0.15)', border: '1px solid rgba(255,0,0,0.4)', color: '#ff4444' }}>
            Delete
          </button>
          <button onClick={onCancel}
            className="flex-1 py-2 font-orbitron text-xs font-bold uppercase rounded-lg"
            style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'var(--dim)' }}>
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  )
}

/* ── Profile Panel (single-record, no list) ─────────────── */
interface ProfileData {
  name: string; tagline: string; bio: string; email: string
  github: string; linkedin: string; twitter: string; profileImage: string
  resumeUrl: string; location: string; availableForWork: boolean
  heroTypingTexts: string
  projectsCount: string
  technologiesCount: string
  yearOfStudy: string
  coffeeCups: string
}

const PROFILE_FIELDS: FormField[] = [
  { label: 'Full Name', key: 'name', type: 'text' },
  { label: 'Tagline / Title', key: 'tagline', type: 'text' },
  { label: 'Bio (2–3 sentences)', key: 'bio', type: 'textarea' },
  { label: 'Contact Email', key: 'email', type: 'email' },
  { label: 'Location', key: 'location', type: 'text' },
  { label: 'GitHub URL', key: 'github', type: 'text' },
  { label: 'LinkedIn URL', key: 'linkedin', type: 'text' },
  { label: 'Twitter / X URL', key: 'twitter', type: 'text' },
  { label: 'Profile Image URL', key: 'profileImage', type: 'text' },
  { label: 'Resume / CV URL', key: 'resumeUrl', type: 'text' },
  { label: 'Available for Work', key: 'availableForWork', type: 'checkbox' },
  { label: 'Hero Typing Texts (comma separated)', key: 'heroTypingTexts', type: 'text' },
  { label: 'Projects Built (e.g. 12+)', key: 'projectsCount', type: 'text' },
  { label: 'Technologies (e.g. 20+)', key: 'technologiesCount', type: 'text' },
  { label: 'Year of Study (e.g. 3rd)', key: 'yearOfStudy', type: 'text' },
  { label: 'Cups of Coffee (e.g. ∞)', key: 'coffeeCups', type: 'text' },
]

function ProfilePanel({ token }: { token: string | null }) {
  const [profile, setProfile] = useState<ProfileData>({
    name: '', tagline: '', bio: '', email: '', github: '', linkedin: '',
    twitter: '', resumeUrl: '', profileImage: '', location: '', availableForWork: true, heroTypingTexts: '',
    projectsCount: '0', technologiesCount: '0', yearOfStudy: '', coffeeCups: '∞',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/profile', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => {
        if (d.profile) {
          const p = d.profile
          setProfile({
            name: p.name ?? '',
            tagline: p.tagline ?? '',
            bio: p.bio ?? '',
            email: p.email ?? '',
            github: p.github ?? '',
            linkedin: p.linkedin ?? '',
            twitter: p.twitter ?? '',
            profileImage: p.profileImage ?? '',
            resumeUrl: p.resumeUrl ?? '',
            location: p.location ?? '',
            availableForWork: p.availableForWork ?? true,
            heroTypingTexts: Array.isArray(p.heroTypingTexts) ? p.heroTypingTexts.join(', ') : (p.heroTypingTexts ?? ''),
            projectsCount: p.projectsCount ?? '0',
            technologiesCount: p.technologiesCount ?? '0',
            yearOfStudy: p.yearOfStudy ?? '',
            coffeeCups: p.coffeeCups ?? '∞',
          })
        }
      })
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false))
  }, [token])

  const handleSave = async () => {
    setSaving(true)
    const body = {
      ...profile,
      heroTypingTexts: typeof profile.heroTypingTexts === 'string'
        ? profile.heroTypingTexts.split(',').map((s: string) => s.trim()).filter(Boolean)
        : profile.heroTypingTexts,
      availableForWork: Boolean(profile.availableForWork),
    }
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      })
      const d = await res.json()
      if (d.success) toast.success('Profile saved!')
      else toast.error(d.error || 'Failed to save profile')
    } catch { toast.error('Network error') }
    finally { setSaving(false) }
  }

  const set = (k: string, v: string) => {
    setProfile(prev => ({
      ...prev,
      [k]: v === 'true' ? true : v === 'false' ? false : v,
    }))
  }

  if (loading) return (
    <div className="text-center py-20">
      <div className="font-mono-tech text-sm animate-pulse" style={{ color: '#00fff0' }}>
        &gt; Loading profile...
      </div>
    </div>
  )

  return (
    <div className="rounded-xl p-6" style={{ background: '#0d0d1a', border: '1px solid rgba(0,255,240,0.2)' }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PROFILE_FIELDS.map(f => (
          <div key={f.key} className={f.type === 'textarea' || f.key === 'heroTypingTexts' ? 'md:col-span-2' : ''}>
            <NeonInput
              label={f.label}
              value={String(profile[f.key as keyof ProfileData] ?? '')}
              onChange={v => set(f.key, v)}
              type={f.type}
              options={f.options}
            />
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-end">
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-8 py-3 font-orbitron text-xs font-bold tracking-widest uppercase rounded-lg transition-all hover:scale-105 disabled:opacity-50"
          style={{ background: 'rgba(0,255,240,0.1)', border: '1px solid var(--cyan)', color: 'var(--cyan)', boxShadow: '0 0 15px rgba(0,255,240,0.2)' }}>
          <FaSave size={12} /> {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </div>
  )
}

/* ── Tab config ─────────────────────────────────────────── */
const TAB_CONFIG: Record<Exclude<Tab, 'profile'>, {
  label: string; icon: React.ReactNode; color: string
  endpoint: string; deleteEndpoint?: (id: string) => string
  fields: FormField[]
  renderRow: (item: Record<string, unknown>) => React.ReactNode
  emptyForm: Record<string, unknown>
}> = {
  projects: {
    label: 'Projects', icon: <FaFolder />, color: '#00fff0',
    endpoint: '/api/projects',
    deleteEndpoint: (id) => `/api/projects/${id}`,
    emptyForm: { title: '', description: '', category: 'AI', tags: '', techStack: '', github: '', demo: '', featured: false },
    fields: [
      { label: 'Title', key: 'title', type: 'text' },
      { label: 'Description', key: 'description', type: 'textarea' },
      { label: 'Category', key: 'category', type: 'select', options: ['AI', 'ML', 'CV', 'Web', 'Robotics', 'Other'] },
      { label: 'Tags (comma separated)', key: 'tags', type: 'text' },
      { label: 'Tech Stack (comma separated)', key: 'techStack', type: 'text' },
      { label: 'GitHub URL', key: 'github', type: 'text' },
      { label: 'Demo URL', key: 'demo', type: 'text' },
      { label: 'Featured', key: 'featured', type: 'checkbox' },
    ],
    renderRow: (item) => (
      <div>
        <div className="font-orbitron font-bold text-sm text-white">{String(item.title)}</div>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-mono-tech text-xs px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(0,255,240,0.1)', color: 'var(--cyan)', border: '1px solid rgba(0,255,240,0.2)' }}>
            {String(item.category)}
          </span>
          {Boolean(item.featured) && (
            <span className="font-mono-tech text-xs" style={{ color: 'var(--yellow)' }}>★ Featured</span>
          )}
        </div>
      </div>
    ),
  },
  blogs: {
    label: 'Blog Posts', icon: <FaNewspaper />, color: '#ff00ff',
    endpoint: '/api/blogs',
    deleteEndpoint: (id) => `/api/blogs/${id}`,
    emptyForm: { title: '', slug: '', excerpt: '', content: '', tags: '', published: false },
    fields: [
      { label: 'Title', key: 'title', type: 'text' },
      { label: 'Slug (auto-generated if empty)', key: 'slug', type: 'text' },
      { label: 'Excerpt', key: 'excerpt', type: 'textarea' },
      { label: 'Content (Markdown)', key: 'content', type: 'textarea' },
      { label: 'Tags (comma separated)', key: 'tags', type: 'text' },
      { label: 'Published', key: 'published', type: 'checkbox' },
    ],
    renderRow: (item) => (
      <div>
        <div className="font-orbitron font-bold text-sm text-white">{String(item.title)}</div>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-mono-tech text-xs" style={{ color: 'var(--dim)' }}>{String(item.slug)}</span>
          <span className={`font-mono-tech text-xs px-2 py-0.5 rounded-full ${Boolean(item.published) ? 'text-green-400' : 'text-yellow-400'}`}
            style={{ background: Boolean(item.published) ? 'rgba(0,255,136,0.1)' : 'rgba(255,255,0,0.1)' }}>
            {Boolean(item.published) ? '● LIVE' : '○ DRAFT'}
          </span>
        </div>
      </div>
    ),
  },
  skills: {
    label: 'Skills', icon: <FaTools />, color: '#00ff88',
    endpoint: '/api/skills',
    emptyForm: { name: '', category: 'AI/ML', level: 75 },
    fields: [
      { label: 'Skill Name', key: 'name', type: 'text' },
      { label: 'Category', key: 'category', type: 'select', options: ['AI/ML', 'Web Dev', 'Robotics', 'Computer Vision', 'Languages', 'Tools'] },
      { label: 'Level (0-100)', key: 'level', type: 'number' },
    ],
    renderRow: (item) => (
      <div className="flex items-center gap-4 flex-1">
        <span className="font-orbitron font-bold text-sm text-white">{String(item.name)}</span>
        <span className="font-mono-tech text-xs" style={{ color: 'var(--dim)' }}>{String(item.category)}</span>
        <div className="flex-1 h-1 rounded-full ml-auto max-w-24" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div className="h-full rounded-full" style={{ width: `${item.level}%`, background: 'var(--green)' }} />
        </div>
        <span className="font-orbitron text-xs font-bold" style={{ color: 'var(--green)' }}>{String(item.level)}%</span>
      </div>
    ),
  },
  experience: {
    label: 'Experience', icon: <FaBriefcase />, color: '#ffff00',
    endpoint: '/api/experience',
    emptyForm: { title: '', organization: '', type: 'Education', startDate: '', endDate: '', current: false, description: '', location: '' },
    fields: [
      { label: 'Title / Role', key: 'title', type: 'text' },
      { label: 'Organization', key: 'organization', type: 'text' },
      { label: 'Type', key: 'type', type: 'select', options: ['Education', 'Work', 'Internship', 'Project', 'Achievement'] },
      { label: 'Start Date (e.g. 2022-08)', key: 'startDate', type: 'text' },
      { label: 'End Date (leave empty if current)', key: 'endDate', type: 'text' },
      { label: 'Currently ongoing', key: 'current', type: 'checkbox' },
      { label: 'Description', key: 'description', type: 'textarea' },
      { label: 'Location', key: 'location', type: 'text' },
    ],
    renderRow: (item) => (
      <div>
        <div className="font-orbitron font-bold text-sm text-white">{String(item.title)}</div>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-mono-tech text-xs" style={{ color: 'var(--dim)' }}>{String(item.organization)}</span>
          <span className="font-mono-tech text-xs px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(255,255,0,0.1)', color: 'var(--yellow)', border: '1px solid rgba(255,255,0,0.2)' }}>
            {String(item.type)}
          </span>
          {Boolean(item.current) && (
            <span className="font-mono-tech text-xs flex items-center gap-1" style={{ color: 'var(--green)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Current
            </span>
          )}
        </div>
      </div>
    ),
  },
  focus: {
    label: 'Focus Areas', icon: <FaBrain />, color: '#00fff0',
    endpoint: '/api/focus-areas',
    deleteEndpoint: (id) => `/api/focus-areas/${id}`,
    emptyForm: { title: '', description: '', icon: 'brain', color: 'var(--cyan)', order: 0 },
    fields: [
      { label: 'Title', key: 'title', type: 'text' },
      { label: 'Description', key: 'description', type: 'text' },
      { label: 'Icon (brain | eye | code | robot)', key: 'icon', type: 'text' },
      { label: 'Color (hex or var)', key: 'color', type: 'text' },
      { label: 'Order Index', key: 'order', type: 'number' },
    ],
    renderRow: (item) => (
      <div className="flex items-center gap-4 flex-1">
        <span className="font-orbitron font-bold text-sm text-white">{String(item.title)}</span>
        <span className="font-mono-tech text-xs" style={{ color: 'var(--dim)' }}>{String(item.icon)}</span>
        <span className="font-mono-tech text-xs ml-auto" style={{ color: String(item.color || 'var(--cyan)') }}>{String(item.color || 'var(--cyan)')}</span>
      </div>
    ),
  },
  messages: {
    label: 'Messages', icon: <FaEnvelope />, color: '#ff6600',
    endpoint: '/api/contact',
    emptyForm: {},
    fields: [],
    renderRow: (item) => (
      <div>
        <div className="flex items-center gap-2">
          <span className="font-orbitron font-bold text-sm text-white">{String(item.name)}</span>
          <span className="font-mono-tech text-xs" style={{ color: 'var(--dim)' }}>&lt;{String(item.email)}&gt;</span>
        </div>
        <div className="font-mono-tech text-xs mt-1" style={{ color: 'var(--text)' }}>{String(item.subject)}</div>
      </div>
    ),
  },
}

/* ── Sidebar ────────────────────────────────────────────── */
const SIDEBAR_TABS: { key: Tab; label: string; icon: React.ReactNode; color: string }[] = [
  { key: 'profile',    label: 'Profile',     icon: <FaUser />,      color: '#a78bfa' },
  { key: 'focus',      label: 'Focus Areas', icon: <FaBrain />,     color: '#00fff0' },
  { key: 'projects',   label: 'Projects',    icon: <FaFolder />,    color: '#00fff0' },
  { key: 'blogs',      label: 'Blog Posts',  icon: <FaNewspaper />, color: '#ff00ff' },
  { key: 'skills',     label: 'Skills',      icon: <FaTools />,     color: '#00ff88' },
  { key: 'experience', label: 'Experience',  icon: <FaBriefcase />, color: '#ffff00' },
  { key: 'messages',   label: 'Messages',    icon: <FaEnvelope />,  color: '#ff6600' },
]

function Sidebar({ active, setActive }: { active: Tab; setActive: (t: Tab) => void }) {
  return (
    <aside className="w-56 flex-shrink-0 flex flex-col gap-1 py-4 pr-4">
      <div className="mb-6 px-2">
        <div className="font-orbitron font-black text-sm" style={{ color: 'var(--cyan)', textShadow: '0 0 10px var(--cyan)' }}>
          ADMIN PANEL
        </div>
        <div className="font-mono-tech text-xs mt-1" style={{ color: 'var(--dim)' }}>aman@portfolio.dev</div>
      </div>
      {SIDEBAR_TABS.map(({ key, label, icon, color }) => {
        const isActive = active === key
        return (
          <button key={key} onClick={() => setActive(key)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 w-full"
            style={{
              background: isActive ? `${color}12` : 'transparent',
              border: `1px solid ${isActive ? color : 'transparent'}`,
              color: isActive ? color : 'var(--dim)',
              boxShadow: isActive ? `0 0 12px ${color}22` : 'none',
            }}>
            <span style={{ fontSize: 13 }}>{icon}</span>
            <span className="font-orbitron text-xs font-semibold tracking-wide">{label}</span>
          </button>
        )
      })}
    </aside>
  )
}

/* ── Main Admin Page ────────────────────────────────────── */
export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)
  const [token, setToken] = useState<string | null>(null)

  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const [items, setItems] = useState<Record<string, unknown>[]>([])
  const [dataLoading, setDataLoading] = useState(false)

  const [modal, setModal] = useState<{
    open: boolean; mode: 'create' | 'edit'; item?: Record<string, unknown>
  }>({ open: false, mode: 'create' })
  const [saveLoading, setSaveLoading] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [expandedMsg, setExpandedMsg] = useState<string | null>(null)

  // Check existing auth
  useEffect(() => {
    const t = localStorage.getItem('admin_token')
    if (t) {
      fetch('/api/auth/me', { headers: { Authorization: `Bearer ${t}` } })
        .then(r => r.json())
        .then(d => {
          if (d.success) { setToken(t); setAuthed(true) }
          else localStorage.removeItem('admin_token')
        })
        .catch(() => {})
        .finally(() => setChecking(false))
    } else { setChecking(false) }
  }, [])



  const fetchData = useCallback(async () => {
    if (!token || activeTab === 'profile') return
    setDataLoading(true)
    const cfg = TAB_CONFIG[activeTab as Exclude<Tab, 'profile'>]
    const url = activeTab === 'blogs' ? `${cfg.endpoint}?admin=true` : cfg.endpoint
    try {
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      const d = await res.json()
      setItems(d.data ?? (d.success ? d.data : []) ?? [])
    } catch { setItems([]) }
    finally { setDataLoading(false) }
  }, [token, activeTab])

  useEffect(() => { if (authed && activeTab !== 'profile') fetchData() }, [authed, fetchData, activeTab])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const d = await res.json()
      if (d.success) {
        localStorage.setItem('admin_token', d.token)
        setToken(d.token)
        setAuthed(true)
        toast.success('Access granted.')
      } else {
        toast.error(d.error || 'Invalid credentials')
      }
    } catch { toast.error('Network error') }
    finally { setLoginLoading(false) }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    setToken(null); setAuthed(false)
    toast.success('Logged out.')
  }

  const handleSave = async (formData: Record<string, unknown>) => {
    setSaveLoading(true)
    const cfg = TAB_CONFIG[activeTab as Exclude<Tab, 'profile'>]
    const body = { ...formData }
    if (typeof body.tags === 'string') body.tags = (body.tags as string).split(',').map(s => s.trim()).filter(Boolean)
    if (typeof body.techStack === 'string') body.techStack = (body.techStack as string).split(',').map(s => s.trim()).filter(Boolean)

    const isEdit = modal.mode === 'edit' && modal.item?._id
    const url = isEdit && cfg.deleteEndpoint
      ? cfg.deleteEndpoint(String(modal.item!._id))
      : cfg.endpoint
    const method = isEdit ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      })
      const d = await res.json()
      if (d.success) {
        toast.success(isEdit ? 'Updated!' : 'Created!')
        setModal({ open: false, mode: 'create' })
        fetchData()
      } else {
        toast.error(d.error || 'Failed to save')
      }
    } catch { toast.error('Network error') }
    finally { setSaveLoading(false) }
  }

  const handleDelete = async (id: string) => {
    const cfg = TAB_CONFIG[activeTab as Exclude<Tab, 'profile'>]
    if (!cfg.deleteEndpoint) return
    try {
      const res = await fetch(cfg.deleteEndpoint(id), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const d = await res.json()
      if (d.success) { toast.success('Deleted!'); fetchData() }
      else toast.error('Failed to delete')
    } catch { toast.error('Network error') }
    finally { setDeleteTarget(null) }
  }

  // ── Loading screen ──
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="font-mono-tech text-sm animate-pulse" style={{ color: 'var(--cyan)' }}>
          &gt; Verifying access...
        </div>
      </div>
    )
  }

  // ── Login screen ──
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full"
              style={{ background: 'rgba(255,0,255,0.1)', border: '1px solid var(--magenta)', color: 'var(--magenta)', boxShadow: '0 0 20px rgba(255,0,255,0.2)' }}>
              <FaLock size={20} />
            </div>
            <h1 className="font-orbitron font-black text-xl" style={{ color: 'var(--cyan)' }}>ADMIN ACCESS</h1>
            <p className="font-mono-tech text-xs mt-2" style={{ color: 'var(--dim)' }}>Restricted zone — authenticate to proceed</p>
          </div>

          <form onSubmit={handleLogin} className="cyber-card rounded-xl p-6 space-y-4"
            style={{ borderColor: 'rgba(0,255,240,0.25)', background: '#0d0d1a' }}>
            <NeonInput label="Email" value={email} onChange={setEmail} type="email" required />
            <div>
              <label className="font-mono-tech text-xs block mb-1.5" style={{ color: 'var(--cyan)' }}>
                Password <span style={{ color: 'var(--magenta)' }}>*</span>
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full pr-10"
                  style={{
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,255,240,0.2)',
                    color: 'var(--text)', outline: 'none', fontFamily: '"Share Tech Mono", monospace',
                    fontSize: 13, padding: '10px 14px', borderRadius: 8, width: '100%',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'var(--cyan)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(0,255,240,0.2)')}
                />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--dim)' }}>
                  {showPass ? <FaEyeSlash size={13} /> : <FaEye size={13} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loginLoading}
              className="w-full py-3 font-orbitron font-bold text-xs tracking-widest uppercase rounded-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 mt-2"
              style={{ background: 'rgba(0,255,240,0.1)', border: '1px solid var(--cyan)', color: 'var(--cyan)', boxShadow: '0 0 15px rgba(0,255,240,0.15)' }}>
              {loginLoading ? '// Authenticating...' : '> Login_'}
            </button>
          </form>
        </motion.div>
      </div>
    )
  }

  // ── Dashboard ──
  const isProfileTab = activeTab === 'profile'
  const cfg = !isProfileTab ? TAB_CONFIG[activeTab as Exclude<Tab, 'profile'>] : null
  const tabMeta = SIDEBAR_TABS.find(t => t.key === activeTab)!

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-60 z-30 pt-16 px-4 flex flex-col"
        style={{ background: 'rgba(13,13,26,0.95)', borderRight: '1px solid rgba(0,255,240,0.1)', backdropFilter: 'blur(8px)' }}>
        <Sidebar active={activeTab} setActive={(t) => { setActiveTab(t); setItems([]) }} />
        <button onClick={handleLogout}
          className="mt-auto mb-6 flex items-center gap-2 px-3 py-2.5 rounded-lg font-orbitron text-xs font-semibold uppercase tracking-wider transition-all"
          style={{ color: 'rgba(255,0,0,0.6)', border: '1px solid rgba(255,0,0,0.2)' }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.color = '#ff4444'
            ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,0,0,0.5)'
            ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,0,0,0.08)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.color = 'rgba(255,0,0,0.6)'
            ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,0,0,0.2)'
            ;(e.currentTarget as HTMLElement).style.background = 'transparent'
          }}>
          <FaSignOutAlt size={12} /> Logout
        </button>
      </div>

      {/* Main content */}
      <div className="ml-60 flex-1 pt-16 p-6 min-h-screen">
        <div className="max-w-4xl mx-auto">
          {/* Tab header */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <div className="flex items-center gap-3">
                <span style={{ color: tabMeta.color, fontSize: 18 }}>{tabMeta.icon}</span>
                <h1 className="font-orbitron font-black text-lg" style={{ color: tabMeta.color, textShadow: `0 0 10px ${tabMeta.color}` }}>
                  {tabMeta.label}
                </h1>
                {!isProfileTab && (
                  <span className="font-mono-tech text-xs px-2 py-0.5 rounded-full"
                    style={{ background: `${tabMeta.color}12`, color: tabMeta.color, border: `1px solid ${tabMeta.color}25` }}>
                    {items.length}
                  </span>
                )}
              </div>
              <p className="font-mono-tech text-xs mt-1" style={{ color: 'var(--dim)' }}>
                &gt; {isProfileTab ? 'edit your public profile' : `manage /${activeTab}`}
              </p>
            </div>
            {!isProfileTab && cfg && activeTab !== 'messages' && (
              <button
                onClick={() => setModal({ open: true, mode: 'create' })}
                className="flex items-center gap-2 px-5 py-2.5 font-orbitron font-bold text-xs tracking-widest uppercase rounded-lg transition-all hover:scale-105"
                style={{ background: `${tabMeta.color}12`, border: `1px solid ${tabMeta.color}`, color: tabMeta.color, boxShadow: `0 0 15px ${tabMeta.color}22` }}>
                <FaPlus size={11} /> New
              </button>
            )}
          </motion.div>

          {/* Profile panel */}
          {isProfileTab && <ProfilePanel token={token} />}

          {/* List panel */}
          {!isProfileTab && cfg && (
            dataLoading ? (
              <div className="text-center py-20">
                <div className="font-mono-tech text-sm animate-pulse" style={{ color: tabMeta.color }}>
                  &gt; Loading {activeTab}...
                </div>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-20 rounded-xl"
                style={{ background: '#0d0d1a', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="text-4xl mb-3">📭</div>
                <p className="font-mono-tech text-sm" style={{ color: 'var(--dim)' }}>
                  No {activeTab} found. {activeTab !== 'messages' && 'Create your first one!'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item, idx) => (
                  <motion.div
                    key={String(item._id ?? idx)}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="rounded-xl p-4 flex items-center gap-4"
                    style={{ background: '#0d0d1a', border: '1px solid rgba(255,255,255,0.06)', transition: 'border-color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = `${tabMeta.color}30`}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'}
                  >
                    <div className="flex-1 min-w-0">
                      {cfg.renderRow(item)}
                      {activeTab === 'messages' && expandedMsg === String(item._id) && (
                        <p className="font-body text-sm mt-3 leading-relaxed"
                          style={{ color: 'rgba(200,200,232,0.7)', background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: 8, borderLeft: '2px solid var(--cyan)' }}>
                          {String(item.message)}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {activeTab === 'messages' ? (
                        <button
                          onClick={() => setExpandedMsg(expandedMsg === String(item._id) ? null : String(item._id))}
                          className="w-8 h-8 flex items-center justify-center rounded transition-all hover:scale-110"
                          style={{ color: 'var(--cyan)', border: '1px solid rgba(0,255,240,0.2)' }}>
                          <FaEye size={12} />
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            const formItem: Record<string, unknown> = { ...item }
                            if (Array.isArray(formItem.tags)) formItem.tags = (formItem.tags as string[]).join(', ')
                            if (Array.isArray(formItem.techStack)) formItem.techStack = (formItem.techStack as string[]).join(', ')
                            setModal({ open: true, mode: 'edit', item: formItem })
                          }}
                          className="w-8 h-8 flex items-center justify-center rounded transition-all hover:scale-110"
                          style={{ color: 'var(--cyan)', border: '1px solid rgba(0,255,240,0.2)' }}>
                          <FaEdit size={12} />
                        </button>
                      )}
                      {cfg.deleteEndpoint && (
                        <button
                          onClick={() => setDeleteTarget(String(item._id))}
                          className="w-8 h-8 flex items-center justify-center rounded transition-all hover:scale-110"
                          style={{ color: 'rgba(255,80,80,0.7)', border: '1px solid rgba(255,80,80,0.2)' }}>
                          <FaTrash size={11} />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )
          )}
        </div>
      </div>

      {/* CRUD Modal */}
      <AnimatePresence>
        {modal.open && cfg && (
          <CrudModal
            title={`${modal.mode === 'edit' ? 'Edit' : 'New'} ${tabMeta.label.replace(/s$/, '')}`}
            fields={cfg.fields}
            data={modal.mode === 'edit' && modal.item ? modal.item : cfg.emptyForm}
            onSave={handleSave}
            onClose={() => setModal({ open: false, mode: 'create' })}
            loading={saveLoading}
          />
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteTarget && (
          <DeleteConfirm
            onConfirm={() => handleDelete(deleteTarget)}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
