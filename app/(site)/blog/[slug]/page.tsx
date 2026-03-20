'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import FloatingParticles from '@/components/animations/FloatingParticles'
import type { BlogPost } from '@/types'

// Static fallback content
const STATIC_POST: BlogPost = {
  _id: '1',
  title: 'Getting Started with YOLOv8 for Custom Object Detection',
  slug: 'yolov8-custom-object-detection',
  excerpt: 'A complete guide to training your first custom YOLOv8 model.',
  content: `## Introduction

YOLOv8 is the latest iteration of the YOLO (You Only Look Once) family of real-time object detectors, 
bringing significant improvements in accuracy and speed.

## Installation

\`\`\`bash
pip install ultralytics
\`\`\`

## Data Preparation

Before training, organize your dataset in the YOLO format:

\`\`\`
dataset/
  images/
    train/
    val/
  labels/
    train/
    val/
  data.yaml
\`\`\`

## Training

\`\`\`python
from ultralytics import YOLO

model = YOLO('yolov8n.pt')
results = model.train(data='data.yaml', epochs=100, imgsz=640)
\`\`\`

## Results

After training, you should see mAP50 scores improving with each epoch. 
My custom model achieved **87% mAP** on the validation set after 100 epochs.

## Conclusion

YOLOv8 makes custom object detection accessible and fast. 
With proper data preparation and training, you can achieve excellent results for your specific use case.`,
  tags: ['Computer Vision', 'YOLO', 'Python'],
  published: true,
  readTime: 8,
  createdAt: '2024-06-01',
  updatedAt: '2024-06-01',
}

export default function BlogSlugPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/blogs/${slug}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) setPost(d.data)
        else setPost(STATIC_POST)
      })
      .catch(() => setPost(STATIC_POST))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="font-mono-tech text-sm animate-pulse" style={{ color: 'var(--cyan)' }}>
          &gt; Loading post...
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="font-mono-tech text-sm" style={{ color: 'var(--dim)' }}>Post not found</p>
        <Link href="/blog" className="font-orbitron text-xs" style={{ color: 'var(--cyan)' }}>← Back to Blog</Link>
      </div>
    )
  }

  return (
    <main className="min-h-screen pt-20 pb-20 relative overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <FloatingParticles />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="pt-8">
          {/* Back */}
          <Link href="/blog" className="inline-flex items-center gap-2 font-mono-tech text-xs mb-8 transition-colors hover:text-cyan-300"
            style={{ color: 'var(--dim)' }}>
            ← Back to Blog
          </Link>

          {/* Header */}
          <div className="cyber-card rounded-xl p-8 mb-8 hud-corner" style={{ borderColor: 'rgba(0,255,240,0.2)' }}>
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map(tag => (
                <span key={tag} className="font-mono-tech text-xs px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(0,255,240,0.1)', color: 'var(--cyan)', border: '1px solid rgba(0,255,240,0.25)' }}>
                  {tag}
                </span>
              ))}
              <span className="font-mono-tech text-xs ml-auto" style={{ color: 'var(--dim)' }}>
                {post.readTime} min read
              </span>
            </div>
            <h1 className="font-orbitron font-black text-xl md:text-2xl mb-4" style={{ color: '#fff', lineHeight: 1.3 }}>
              {post.title}
            </h1>
            <p className="font-mono-tech text-xs" style={{ color: 'var(--dim)' }}>
              {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Content */}
          <div className="prose-cyber">
            <ReactMarkdown
              components={{
                h2: ({ children }) => (
                  <h2 className="font-orbitron font-bold text-lg mt-8 mb-4" style={{ color: 'var(--cyan)' }}>{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="font-orbitron font-semibold text-base mt-6 mb-3" style={{ color: 'var(--magenta)' }}>{children}</h3>
                ),
                p: ({ children }) => (
                  <p className="font-body text-sm leading-relaxed mb-4" style={{ color: 'rgba(200,200,232,0.8)' }}>{children}</p>
                ),
                code: ({ children, className }) => {
                  const isBlock = className?.includes('language-')
                  return isBlock ? (
                    <code className="block p-4 rounded-lg font-mono-tech text-xs overflow-x-auto mb-4"
                      style={{ background: 'rgba(0,255,240,0.05)', border: '1px solid rgba(0,255,240,0.15)', color: 'var(--green)' }}>
                      {children}
                    </code>
                  ) : (
                    <code className="px-1.5 py-0.5 rounded font-mono-tech text-xs"
                      style={{ background: 'rgba(0,255,240,0.08)', color: 'var(--cyan)' }}>
                      {children}
                    </code>
                  )
                },
                pre: ({ children }) => (
                  <pre className="mb-4 overflow-x-auto rounded-lg"
                    style={{ background: 'rgba(0,255,240,0.04)', border: '1px solid rgba(0,255,240,0.12)', padding: '16px' }}>
                    {children}
                  </pre>
                ),
                strong: ({ children }) => (
                  <strong style={{ color: 'var(--cyan)', fontWeight: 700 }}>{children}</strong>
                ),
                ul: ({ children }) => (
                  <ul className="space-y-2 mb-4 pl-4" style={{ borderLeft: '2px solid rgba(0,255,240,0.2)' }}>{children}</ul>
                ),
                li: ({ children }) => (
                  <li className="font-body text-sm" style={{ color: 'rgba(200,200,232,0.75)' }}>
                    <span style={{ color: 'var(--cyan)', marginRight: 8 }}>›</span>{children}
                  </li>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
