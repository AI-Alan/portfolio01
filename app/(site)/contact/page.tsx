'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import NeuralNetCanvas from '@/components/animations/NeuralNetCanvas'
import toast from 'react-hot-toast'
import { FaGithub, FaLinkedin, FaEnvelope, FaMapMarkerAlt, FaTwitter, FaInstagram, FaWhatsapp, FaPhone } from 'react-icons/fa'
import { useProfileData } from '@/hooks/useProfileData'

export default function ContactPage() {
  const { profile } = useProfileData()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)

  const ensureAbsoluteUrl = (url: string | undefined) => {
    if (!url) return undefined
    if (url.startsWith('http') || url.startsWith('mailto:')) return url
    return `https://${url}`
  }

  const toPhoneHref = (value: string | undefined) => {
    if (!value) return undefined
    const cleaned = value.replace(/[^\d+]/g, '')
    return cleaned ? `tel:${cleaned}` : undefined
  }

  const toWhatsappHref = (value: string | undefined) => {
    if (!value) return undefined
    if (value.startsWith('http')) return value
    const digitsOnly = value.replace(/\D/g, '')
    return digitsOnly ? `https://wa.me/${digitsOnly}` : undefined
  }

  const toInstagramHref = (value: string | undefined) => {
    if (!value) return undefined
    if (value.startsWith('http')) return value
    const handle = value.startsWith('@') ? value.slice(1) : value
    return handle ? `https://instagram.com/${handle}` : undefined
  }

  const contactInfo = [
    { 
      icon: <FaEnvelope />, 
      label: 'Email', 
      value: profile.email || 'Not provided', 
      href: profile.email ? `mailto:${profile.email}` : null, 
      color: '#00fff0' 
    },
    {
      icon: <FaPhone />,
      label: 'Phone',
      value: profile.contactNumber || 'Not provided',
      href: toPhoneHref(profile.contactNumber) || null,
      color: '#22c55e'
    },
    {
      icon: <FaWhatsapp />,
      label: 'WhatsApp',
      value: profile.whatsapp || 'Not provided',
      href: toWhatsappHref(profile.whatsapp) || null,
      color: '#25D366'
    },
    {
      icon: <FaInstagram />,
      label: 'Instagram',
      value: profile.instagram || 'Not provided',
      href: toInstagramHref(profile.instagram) || null,
      color: '#E1306C'
    },
    { 
      icon: <FaGithub />, 
      label: 'GitHub', 
      value: profile.github || 'Not provided', 
      href: ensureAbsoluteUrl(profile.github), 
      color: '#ff00ff' 
    },
    { 
      icon: <FaLinkedin />, 
      label: 'LinkedIn', 
      value: profile.linkedin || 'Not provided', 
      href: ensureAbsoluteUrl(profile.linkedin), 
      color: '#00ff88' 
    },
    { 
      icon: <FaMapMarkerAlt />, 
      label: 'Location', 
      value: profile.location || 'Remote / Earth', 
      href: null, 
      color: '#ffff00' 
    },
  ].filter(info => info.value !== 'Not provided' || info.label === 'Email')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Message sent! I\'ll get back to you soon.')
        setForm({ name: '', email: '', subject: '', message: '' })
      } else {
        toast.error(data.error || 'Failed to send message')
      }
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full px-4 py-3 rounded-lg font-mono-tech text-sm outline-none transition-all duration-300"
  const inputStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(0,255,240,0.2)',
    color: 'var(--text)',
  }

  return (
    <main className="min-h-screen pt-20 pb-20 relative overflow-hidden">
      <div className="fixed inset-0 z-0 opacity-30">
        <NeuralNetCanvas />
        <div className="absolute inset-0" style={{ background: 'rgba(7,7,15,0.75)' }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14 pt-8"
        >
          <p className="font-mono-tech text-sm mb-3" style={{ color: 'var(--magenta)' }}>
            &gt; ssh contact@{profile.name?.toLowerCase().replace(/\s/g, '') || 'aman'}.dev
          </p>
          <h1 className="section-title text-4xl md:text-5xl">Get In Touch</h1>
          <p className="font-body mt-4 text-sm" style={{ color: 'var(--dim)' }}>
            {profile.tagline || 'AI / ML Engineer'} | Available for new opportunities
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 flex flex-col gap-4"
          >
            <div className="cyber-card rounded-xl p-6 hud-corner" style={{ borderColor: 'rgba(0,255,240,0.2)' }}>
              <div className="font-orbitron font-bold text-sm mb-2" style={{ color: 'var(--cyan)' }}>
                AVAILABILITY
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className={`w-2 h-2 rounded-full ${profile.availableForWork ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                <span className="font-mono-tech text-sm" style={{ color: profile.availableForWork ? 'var(--green)' : 'var(--magenta)' }}>
                  {profile.availableForWork ? 'Open to opportunities' : 'Not currently available'}
                </span>
              </div>
              <p className="font-body text-sm" style={{ color: 'rgba(200,200,232,0.65)', lineHeight: 1.7 }}>
                {profile.availableForWork 
                  ? `Currently seeking internships, research positions, and freelance projects. Let's build something intelligent together.`
                  : `Currently focused on internal projects, but feel free to reach out for future collaborations or research discussions.`}
              </p>
            </div>

            {contactInfo.map((info, i) => (
              <motion.div
                key={info.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                {info.href ? (
                  <a href={info.href} target="_blank" rel="noopener noreferrer"
                    className="cyber-card rounded-xl p-4 flex items-center gap-4 group transition-all duration-300"
                    style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = info.color
                      ;(e.currentTarget as HTMLElement).style.boxShadow = `0 0 15px ${info.color}22`
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'
                      ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
                    }}
                  >
                    <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: `${info.color}15`, color: info.color, border: `1px solid ${info.color}30` }}>
                      {info.icon}
                    </div>
                    <div>
                      <div className="font-mono-tech text-xs mb-0.5" style={{ color: 'var(--dim)' }}>{info.label}</div>
                      <div className="font-orbitron text-xs font-semibold group-hover:underline truncate max-w-[180px]" style={{ color: info.color }}>{info.value}</div>
                    </div>
                  </a>
                ) : (
                  <div className="cyber-card rounded-xl p-4 flex items-center gap-4"
                    style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: `${info.color}15`, color: info.color, border: `1px solid ${info.color}30` }}>
                      {info.icon}
                    </div>
                    <div>
                      <div className="font-mono-tech text-xs mb-0.5" style={{ color: 'var(--dim)' }}>{info.label}</div>
                      <div className="font-orbitron text-xs font-semibold" style={{ color: info.color }}>{info.value}</div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3"
          >
            <div className="cyber-card rounded-xl p-8 hud-corner" style={{ borderColor: 'rgba(0,255,240,0.2)' }}>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="font-mono-tech text-xs ml-2" style={{ color: 'var(--dim)' }}>compose_message.sh</span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono-tech text-xs mb-2 block" style={{ color: 'var(--cyan)' }}>
                      $ name
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Your name"
                      className={inputClass}
                      style={inputStyle}
                      onFocus={e => (e.target.style.borderColor = 'var(--cyan)')}
                      onBlur={e => (e.target.style.borderColor = 'rgba(0,255,240,0.2)')}
                    />
                  </div>
                  <div>
                    <label className="font-mono-tech text-xs mb-2 block" style={{ color: 'var(--cyan)' }}>
                      $ email
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="your@email.com"
                      className={inputClass}
                      style={inputStyle}
                      onFocus={e => (e.target.style.borderColor = 'var(--cyan)')}
                      onBlur={e => (e.target.style.borderColor = 'rgba(0,255,240,0.2)')}
                    />
                  </div>
                </div>
                <div>
                  <label className="font-mono-tech text-xs mb-2 block" style={{ color: 'var(--cyan)' }}>
                    $ subject
                  </label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    placeholder="What's this about?"
                    className={inputClass}
                    style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = 'var(--cyan)')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(0,255,240,0.2)')}
                  />
                </div>
                <div>
                  <label className="font-mono-tech text-xs mb-2 block" style={{ color: 'var(--cyan)' }}>
                    $ message
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Tell me about your project or opportunity..."
                    className={`${inputClass} resize-none`}
                    style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = 'var(--cyan)')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(0,255,240,0.2)')}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 font-orbitron font-bold text-sm tracking-widest uppercase rounded-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 mt-2"
                  style={{
                    background: loading ? 'rgba(0,255,240,0.05)' : 'rgba(0,255,240,0.1)',
                    border: '1px solid var(--cyan)',
                    color: 'var(--cyan)',
                    boxShadow: loading ? 'none' : '0 0 20px rgba(0,255,240,0.2)',
                  }}
                >
                  {loading ? '// Transmitting...' : '> Send Message_'}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
