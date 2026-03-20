'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import FloatingParticles from '@/components/animations/FloatingParticles'
import type { BlogPost } from '@/types'

const TAG_COLORS = ['#00fff0', '#ff00ff', '#ffff00', '#00ff88', '#ff6600']

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/blogs')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setPosts(d.data ?? [])
      })
      .catch((err) => console.error('Fetch error:', err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="min-h-screen pt-20 pb-20">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-30">
        <FloatingParticles />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14 pt-8"
        >
          <p className="font-mono-tech text-sm mb-3" style={{ color: 'var(--magenta)' }}>
            &gt; cat blog/*.md
          </p>
          <h1 className="section-title text-4xl md:text-5xl">Blog</h1>
          <p className="font-body mt-4 text-sm" style={{ color: 'var(--dim)' }}>
            Thoughts on AI, ML, Computer Vision, and building things
          </p>
        </motion.div>

        {loading && (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4" />
            <p className="font-mono-tech text-sm" style={{ color: 'var(--dim)' }}>
              // Loading posts...
            </p>
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div
            className="text-center py-20 cyber-card rounded-xl p-12"
            style={{ borderColor: 'rgba(0,255,240,0.1)' }}
          >
            <p className="font-orbitron font-bold text-2xl mb-4" style={{ color: 'var(--cyan)' }}>
              [ EMPTY ]
            </p>
            <p className="font-mono-tech text-sm mb-2" style={{ color: 'var(--dim)' }}>
              // No blog posts published yet
            </p>
            <p className="font-mono-tech text-xs" style={{ color: 'rgba(74,74,106,0.5)' }}>
              Add posts via the admin panel to see them here
            </p>
          </div>
        )}

        {!loading && posts.length > 0 && (
          <div className="space-y-6">
            {posts.map((post, i) => (
              <motion.article
                key={post._id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={`/blog/${post.slug}`}>
                  <div
                    className="cyber-card rounded-xl p-6 group cursor-pointer hud-corner"
                    style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                    onMouseEnter={(e) => {
                      ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--cyan)'
                      ;(e.currentTarget as HTMLElement).style.boxShadow =
                        '0 0 20px rgba(0,255,240,0.12)'
                    }}
                    onMouseLeave={(e) => {
                      ;(e.currentTarget as HTMLElement).style.borderColor =
                        'rgba(255,255,255,0.06)'
                      ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
                    }}
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h2
                        className="font-orbitron font-bold text-sm md:text-base group-hover:text-cyan-300 transition-colors"
                        style={{ color: '#fff' }}
                      >
                        {post.title}
                      </h2>
                      <span
                        className="font-mono-tech text-xs whitespace-nowrap"
                        style={{ color: 'var(--dim)' }}
                      >
                        {post.readTime} min read
                      </span>
                    </div>
                    <p
                      className="font-body text-sm leading-relaxed mb-4"
                      style={{ color: 'rgba(200,200,232,0.65)' }}
                    >
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        {post.tags.map((tag, ti) => (
                          <span
                            key={tag}
                            className="font-mono-tech text-xs px-2 py-0.5 rounded-full"
                            style={{
                              background: `${TAG_COLORS[ti % TAG_COLORS.length]}12`,
                              color: TAG_COLORS[ti % TAG_COLORS.length],
                              border: `1px solid ${TAG_COLORS[ti % TAG_COLORS.length]}30`,
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span
                        className="font-mono-tech text-xs group-hover:translate-x-1 transition-transform"
                        style={{ color: 'var(--cyan)' }}
                      >
                        Read →
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
