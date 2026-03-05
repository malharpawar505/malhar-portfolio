# Malhar Pawar — Portfolio Platform

A full-stack portfolio platform built with **Next.js 14**, **Tailwind CSS**, and **API routes** — designed as a data engineer's command center, project showcase, and publishing platform.

## Features

### Public Pages
- **Home** — Hero, animated stats, about, skills, featured projects, AI experiments, activity feed, blog preview
- **Projects** — Filterable/searchable project showcase with detailed drill-down pages
- **AI Lab** — Dedicated AI & innovation experiments showcase
- **Blog** — Technical articles with category filtering
- **Contact** — Contact form with backend message storage

### Admin Dashboard (`/admin`)
- **Login** — Demo credentials: `malhar@admin.com` / `admin123`
- **Overview** — Stats, quick actions, recent messages
- **Project Management** — Add, publish/unpublish, delete projects
- **Blog Management** — Add, publish/unpublish, delete blog posts
- **Activity Feed** — Log daily learning and experiments
- **Messages** — View all contact form submissions

### Design
- Dark emerald + charcoal + muted gold palette
- Scroll-triggered reveal animations
- Responsive design (mobile-first)
- Glassmorphism effects, grid backgrounds, floating orbs
- JetBrains Mono for code, Plus Jakarta Sans for body text

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Animations | CSS + Intersection Observer |
| Icons | Lucide React |
| Backend | Next.js API Routes |
| Data Storage | JSON file-based (upgradeable to PostgreSQL/MongoDB) |

---

## Getting Started (Local Development)

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Setup

```bash
# 1. Navigate to the project
cd malhar-portfolio

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deploy to Vercel

### Option 1: Vercel CLI (Recommended)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy
vercel

# 4. For production deployment
vercel --prod
```

### Option 2: GitHub Integration

1. Push this project to a GitHub repository:
```bash
git init
git add .
git commit -m "Initial commit - portfolio platform"
git remote add origin https://github.com/malharpawar505/portfolio.git
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com) and sign in
3. Click **"New Project"**
4. Import your GitHub repository
5. Vercel auto-detects Next.js — click **Deploy**
6. Your site will be live at `your-project.vercel.app`

### Custom Domain
1. In Vercel dashboard → Settings → Domains
2. Add your custom domain (e.g., `malharpawar.com`)
3. Update DNS records as instructed

---

## Upgrading to a Database (Production)

The current implementation uses JSON files for data storage. This works for local development but **resets on each Vercel deployment**. For persistent data in production:

### Option A: Vercel Postgres (Recommended)
```bash
# 1. Add Vercel Postgres to your project
# Go to Vercel Dashboard → Storage → Create Database → Postgres

# 2. Install the Vercel Postgres package
npm install @vercel/postgres

# 3. Update lib/db.js to use SQL queries instead of file operations
```

### Option B: MongoDB Atlas (Free Tier)
```bash
# 1. Create free cluster at mongodb.com/atlas
# 2. Install MongoDB driver
npm install mongodb

# 3. Add connection string to .env.local
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/portfolio

# 4. Update lib/db.js to use MongoDB operations
```

### Option C: Supabase (Free Tier)
```bash
# 1. Create project at supabase.com
# 2. Install Supabase client
npm install @supabase/supabase-js

# 3. Add credentials to .env.local
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
```

---

## Project Structure

```
malhar-portfolio/
├── app/
│   ├── layout.js              # Root layout (Navbar + Footer)
│   ├── globals.css             # Global styles + Tailwind
│   ├── page.js                 # Home page
│   ├── projects/
│   │   ├── page.js             # Projects listing
│   │   └── [id]/page.js        # Project detail
│   ├── ai-lab/page.js          # AI experiments
│   ├── blog/page.js            # Blog listing
│   ├── contact/page.js         # Contact form
│   ├── admin/
│   │   ├── layout.js           # Admin layout
│   │   └── page.js             # Admin dashboard
│   └── api/
│       ├── projects/
│       │   ├── route.js        # GET all, POST new
│       │   └── [id]/route.js   # GET one, PUT, DELETE
│       ├── blogs/
│       │   ├── route.js
│       │   └── [id]/route.js
│       ├── activities/route.js
│       └── contact/route.js
├── components/
│   ├── Navbar.js               # Navigation bar
│   ├── Footer.js               # Footer
│   └── Reveal.js               # Scroll animations
├── lib/
│   └── db.js                   # Data layer (JSON file-based)
├── data/                        # Auto-generated data files
├── tailwind.config.js
├── postcss.config.js
├── next.config.js
├── jsconfig.json
├── vercel.json
└── package.json
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | List all projects |
| POST | `/api/projects` | Create new project |
| GET | `/api/projects/:id` | Get single project |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |
| GET | `/api/blogs` | List all blog posts |
| POST | `/api/blogs` | Create new blog post |
| PUT | `/api/blogs/:id` | Update blog post |
| DELETE | `/api/blogs/:id` | Delete blog post |
| GET | `/api/activities` | List all activities |
| POST | `/api/activities` | Log new activity |
| GET | `/api/contact` | List all messages |
| POST | `/api/contact` | Submit contact form |

---

## Environment Variables (Optional)

Create `.env.local` for production settings:

```env
# Admin credentials (override defaults)
ADMIN_EMAIL=your-email@example.com
ADMIN_PASSWORD=your-secure-password

# Database (when upgrading from file-based)
DATABASE_URL=your-database-connection-string

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## License

MIT — Built by Malhar Pawar
