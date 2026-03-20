'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaRobot, FaTimes, FaPaperPlane, FaMinus } from 'react-icons/fa'
import ReactMarkdown from 'react-markdown'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const SUGGESTIONS = [
  "What's Aman's tech stack?",
  'Is Aman open to internships?',
  'Tell me about his projects',
  'What are his AI skills?',
]

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: "Hi! I'm **ARIA** — Aman's AI assistant. Ask me anything about him: his skills, projects, experience, or availability. 🤖",
      timestamp: new Date(),
    },
  ])
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (open && !minimized) inputRef.current?.focus()
  }, [open, minimized])

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim()
    if (!content || loading) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }))
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content, history }),
      })

      const data = await res.json()

      // Surface the specific error from the server if available
      const reply = res.ok
        ? (data.response ?? 'Sorry, I had trouble responding. Please try again.')
        : (data.error ?? 'An error occurred. Please try again.')

      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: reply,
          timestamp: new Date(),
        },
      ])
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Connection error. Please check your internet and try again.',
          timestamp: new Date(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const linkifyMarkdown = (text: string) =>
    text.replace(/(https?:\/\/[^\s)]+)/g, (url) => `[${url}](${url})`)

  return (
    <>
      {/* Floating trigger button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(0,255,240,0.15), rgba(255,0,255,0.15))',
              border: '1px solid var(--cyan)',
              boxShadow: '0 0 20px rgba(0,255,240,0.4), 0 0 40px rgba(0,255,240,0.15)',
              color: 'var(--cyan)',
            }}
          >
            <FaRobot size={22} />
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full animate-ping opacity-20"
              style={{ background: 'var(--cyan)' }} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-80 md:w-96 rounded-xl overflow-hidden flex flex-col"
            style={{
              height: minimized ? 'auto' : '480px',
              background: '#0a0a14',
              border: '1px solid rgba(0,255,240,0.3)',
              boxShadow: '0 0 30px rgba(0,255,240,0.15), 0 0 60px rgba(0,255,240,0.08)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 flex-shrink-0"
              style={{ borderBottom: '1px solid rgba(0,255,240,0.15)', background: 'rgba(0,255,240,0.04)' }}
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(0,255,240,0.15)', border: '1px solid var(--cyan)', color: 'var(--cyan)' }}>
                  <FaRobot size={13} />
                </div>
                <div>
                  <div className="font-orbitron font-bold text-xs" style={{ color: 'var(--cyan)' }}>ARIA</div>
                  <div className="font-mono-tech text-xs flex items-center gap-1" style={{ color: 'var(--dim)' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    Aman&apos;s AI Assistant
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMinimized(m => !m)}
                  className="w-6 h-6 flex items-center justify-center rounded transition-colors hover:text-white"
                  style={{ color: 'var(--dim)' }}
                >
                  <FaMinus size={10} />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="w-6 h-6 flex items-center justify-center rounded transition-colors hover:text-red-400"
                  style={{ color: 'var(--dim)' }}
                >
                  <FaTimes size={12} />
                </button>
              </div>
            </div>

            {!minimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scroll">
                  {messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      {/* Avatar */}
                      <div
                        className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-orbitron font-bold mt-0.5"
                        style={
                          msg.role === 'assistant'
                            ? { background: 'rgba(0,255,240,0.15)', border: '1px solid var(--cyan)', color: 'var(--cyan)' }
                            : { background: 'rgba(255,0,255,0.15)', border: '1px solid var(--magenta)', color: 'var(--magenta)' }
                        }
                      >
                        {msg.role === 'assistant' ? 'A' : 'U'}
                      </div>

                      {/* Bubble */}
                      <div
                        className="max-w-[78%] rounded-lg px-3 py-2 text-xs font-body leading-relaxed"
                        style={
                          msg.role === 'assistant'
                            ? {
                                background: 'rgba(0,255,240,0.05)',
                                border: '1px solid rgba(0,255,240,0.15)',
                                color: 'var(--text)',
                              }
                            : {
                                background: 'rgba(255,0,255,0.08)',
                                border: '1px solid rgba(255,0,255,0.2)',
                                color: 'var(--text)',
                              }
                        }
                      >
                        <ReactMarkdown
                          components={{
                            strong: ({ children }) => (
                              <strong style={{ color: 'var(--cyan)', fontWeight: 700 }}>{children}</strong>
                            ),
                            p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                            a: ({ href, children }) => (
                              <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: 'var(--cyan)', textDecoration: 'underline' }}
                              >
                                {children}
                              </a>
                            ),
                          }}
                        >
                          {linkifyMarkdown(msg.content)}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ))}

                  {/* Loading indicator */}
                  {loading && (
                    <div className="flex gap-2 items-center">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                        style={{ background: 'rgba(0,255,240,0.15)', border: '1px solid var(--cyan)', color: 'var(--cyan)' }}>
                        A
                      </div>
                      <div className="flex gap-1 px-3 py-2 rounded-lg"
                        style={{ background: 'rgba(0,255,240,0.05)', border: '1px solid rgba(0,255,240,0.15)' }}>
                        {[0, 1, 2].map(i => (
                          <span
                            key={i}
                            className="w-1.5 h-1.5 rounded-full animate-bounce"
                            style={{ background: 'var(--cyan)', animationDelay: `${i * 0.15}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* Suggestions */}
                {messages.length === 1 && (
                  <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                    {SUGGESTIONS.map(s => (
                      <button
                        key={s}
                        onClick={() => sendMessage(s)}
                        className="font-mono-tech text-xs px-2 py-1 rounded-full transition-all duration-200 hover:scale-105"
                        style={{
                          background: 'rgba(0,255,240,0.05)',
                          border: '1px solid rgba(0,255,240,0.2)',
                          color: 'rgba(0,255,240,0.7)',
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input */}
                <div
                  className="px-3 py-3 flex-shrink-0"
                  style={{ borderTop: '1px solid rgba(0,255,240,0.12)' }}
                >
                  <div className="flex items-center gap-2 rounded-lg px-3 py-2"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,255,240,0.2)' }}>
                    <span className="font-mono-tech text-xs" style={{ color: 'var(--cyan)' }}>&gt;</span>
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={handleKey}
                      placeholder="Ask about Aman..."
                      disabled={loading}
                      className="flex-1 bg-transparent outline-none font-mono-tech text-xs placeholder:text-cyber-dim"
                      style={{ color: 'var(--text)' }}
                    />
                    <button
                      onClick={() => sendMessage()}
                      disabled={!input.trim() || loading}
                      className="transition-all duration-200 disabled:opacity-30 hover:scale-110"
                      style={{ color: 'var(--cyan)' }}
                    >
                      <FaPaperPlane size={12} />
                    </button>
                  </div>
                  <p className="font-mono-tech text-xs text-center mt-2" style={{ color: 'rgba(74,74,106,0.6)' }}>
                    Powered by Gemini AI
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
