# 🤖 Aman Kumar Yadav — Cyberpunk AI Portfolio

A full-stack, cyberpunk-themed developer portfolio built with **Next.js 14**, **MongoDB**, **JWT auth**, and a **Gemini AI chatbot**. Features neural network animations, matrix rain, floating particles, and a full admin CRUD dashboard.

---

## ✨ Features

- **Cyberpunk Design** — Neon cyan/magenta theme, glitch effects, HUD overlays, scanlines
- **3 Unique Animations** — Neural network (Hero), Matrix rain (Skills/Projects), Floating particles (About/Blog)
- **Gemini AI Chatbot** — "ARIA" — bottom-left floating assistant answering questions about you
- **Full CRUD Backend** — Next.js API routes + MongoDB for Projects, Blogs, Skills, Experience, Contact
- **JWT Admin Dashboard** — Protected `/admin` panel to manage all content
- **4 Pages** — Home, Projects (filterable), Blog, Contact
- **Framer Motion** — Smooth animations on scroll and interaction
- **Fully Responsive** — Mobile-first design

---

## 🏗️ Project Structure

\`\`\`
portfolio/
├── app/
│   ├── (site)/               # Public-facing pages (wrapped in Navbar+Footer)
│   │   ├── page.tsx          # Home — Hero, About, Skills, Experience, Featured Projects
│   │   ├── projects/         # All projects with category filter + search
│   │   ├── blog/             # Blog listing
│   │   ├── blog/[slug]/      # Individual blog post (Markdown rendered)
│   │   └── contact/          # Contact form
│   ├── admin/
│   │   └── page.tsx          # 🔐 Protected CRUD dashboard
│   └── api/
│       ├── projects/         # GET list, POST create; [id] PUT/DELETE
│       ├── blogs/            # GET list, POST create; [slug] GET/PUT/DELETE
│       ├── skills/           # GET list, POST create
│       ├── experience/       # GET list, POST create, DELETE
│       ├── contact/          # GET messages (admin), POST new message
│       ├── chat/             # POST → Gemini AI response
│       └── auth/             # POST login, GET /me verify
├── components/
│   ├── animations/
│   │   ├── NeuralNetCanvas.tsx   # Animated neural network — used on Hero + Contact
│   │   ├── MatrixRain.tsx        # Matrix rain — used on Skills + Projects
│   │   └── FloatingParticles.tsx # Floating particles — used on About + Blog
│   ├── layout/
│   │   ├── Navbar.tsx        # Responsive sticky navbar
│   │   └── Footer.tsx        # Footer with social links
│   ├── sections/             # All home page sections (modular)
│   │   ├── HeroSection.tsx
│   │   ├── AboutSection.tsx
│   │   ├── SkillsSection.tsx
│   │   ├── ExperienceSection.tsx
│   │   └── FeaturedProjects.tsx
│   └── chat/
│       └── ChatBot.tsx       # ARIA — Gemini-powered floating chatbot
├── lib/
│   ├── db.ts                 # MongoDB connection with caching
│   ├── auth.ts               # JWT sign/verify utilities
│   ├── gemini.ts             # Gemini AI config + Aman's system prompt
│   ├── utils.ts              # cn(), formatDate(), slugify(), etc.
│   └── seed.ts               # Database seeder with sample data
├── models/                   # Mongoose schemas
│   ├── Project.ts, Blog.ts, Skill.ts, Experience.ts, Contact.ts
└── types/index.ts            # TypeScript interfaces
\`\`\`

---

## 🚀 Setup & Installation

### 1. Clone & Install

\`\`\`bash
git clone <your-repo>
cd portfolio
npm install
\`\`\`

### 2. Environment Variables

Copy \`.env.example\` to \`.env.local\` and fill in:

\`\`\`bash
cp .env.example .env.local
\`\`\`

\`\`\`env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/portfolio
JWT_SECRET=some-very-long-random-secret-string-here
ADMIN_EMAIL=aman@yourdomain.com
ADMIN_PASSWORD=your-admin-password
GEMINI_API_KEY=your-gemini-api-key-from-google-ai-studio
NEXT_PUBLIC_SITE_URL=http://localhost:3000
\`\`\`

### 3. Seed the Database (optional)

\`\`\`bash
npm run seed
\`\`\`

This will populate MongoDB with sample projects, skills, and experience data.

### 4. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000)

---

## 🔐 Admin Dashboard

Navigate to `/admin` to access the dashboard.

**Login with** the email/password from your \`.env.local\`.

From the dashboard you can:
- **Projects** — Create, edit, delete projects with category, tags, GitHub/demo links
- **Blog Posts** — Write/edit Markdown blog posts, toggle publish status
- **Skills** — Manage skill categories and proficiency levels
- **Experience** — Add/edit timeline entries
- **Messages** — View contact form submissions

---

## 💬 Gemini AI Chatbot (ARIA)

The floating bot in the **bottom-left corner** is powered by Gemini and now uses **dynamic, selective retrieval**.

### How chat context works now

- A small base behavior prompt is always sent.
- For each user query, the backend selectively fetches relevant data:
  - Skills
  - Experience
  - Projects
  - Private Notes (chat-only admin data)
- Retrieval and prompt composition happen in:
  - `lib/getChatContext.ts`
  - `lib/gemini.ts`

This keeps responses fresh and avoids sending all data on every request.

### Private Notes (important)

Private Notes are managed from **Admin -> Private Notes** and are used for personal details that may not appear publicly on the site (for example: internship story, birthday details, personal background).

To make retrieval reliable, write notes in a structured way:

- `Title`: short, clear label (example: `My Birthday`)
- `Topic`: lowercase slug with underscores (example: `birthday_details`, `agent_mira_internship_story`)
- `Keywords`: comma-separated search terms and variants
- `Content`: concise factual paragraph (who/what/when/how)
- `Enabled for Chatbot`: must be checked

#### Recommended writing style

- Put primary fact in the first sentence.
- Include alternate phrasing in `keywords` (`dob`, `date of birth`, `born`, etc.).
- Keep one note focused on one subject.
- Avoid mixing unrelated stories in one note.

#### Good example (internship)

- Title: `Agent Mira Internship - How I Got It`
- Topic: `agent_mira_internship_story`
- Keywords: `agent mira, internship, how got internship, selection process, december 2025, february 2026, full stack intern`
- Content: `I secured the Full Stack Engineering Internship at Agent Mira after applying through their hiring process and completing technical evaluation rounds. The internship duration was from 17 Dec 2025 to 17 Feb 2026.`

#### Good example (birthday)

- Title: `My Birthday`
- Topic: `birthday_details`
- Keywords: `birthday, date of birth, dob, born, 1 march 2005, 01-03-2005`
- Content: `My date of birth is 1 March 2005 (01-03-2005). I was born in Gonda district, Uttar Pradesh, India.`

#### Common mistakes (causes missed retrieval)

- Topic written as a sentence instead of a slug
- Missing keyword variants users actually type
- Very long note with mixed unrelated topics
- Note is not enabled for chatbot

### Debug checklist if bot misses a private note

1. Open Admin -> Private Notes and verify note is enabled.
2. Ensure `topic` is slug-like and `keywords` include likely user phrasing.
3. Ask a query that includes one of your keywords.
4. If still not working, restart dev server (`npm run dev`) to clear local dev module cache artifacts.

---

## 🎨 Customization

### Personal Info
Update these files with your real info:
- `components/sections/HeroSection.tsx` — Social links, bio taglines
- `components/sections/AboutSection.tsx` — Stats, focus areas, bio text
- `components/sections/ExperienceSection.tsx` — EXPERIENCES array
- `components/sections/FeaturedProjects.tsx` — FEATURED array
- `components/layout/Footer.tsx` — Social links, email
- `components/layout/Navbar.tsx` — Links
- `lib/gemini.ts` — AMAN_SYSTEM_PROMPT for chatbot
- `app/(site)/contact/page.tsx` — CONTACT_INFO array

### Theme Colors
Edit \`globals.css\` CSS variables:
\`\`\`css
:root {
  --cyan: #00fff0;     /* Primary neon */
  --magenta: #ff00ff;  /* Secondary neon */
  --yellow: #ffff00;   /* Accent */
  --green: #00ff88;    /* Success/current */
}
\`\`\`

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + Custom CSS |
| Animations | Framer Motion + Canvas API |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| AI | Google Gemini 1.5 Flash |
| Icons | React Icons |
| Notifications | React Hot Toast |

---

## 🌐 Deployment

### Vercel (Recommended)
\`\`\`bash
npm run build
# Deploy to Vercel with env vars set in dashboard
\`\`\`

Make sure to add all env variables in your Vercel project settings.

---

Built with 💙 by Aman Kumar Yadav
