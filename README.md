# ★ NorthStar — Goal Setting & Tracking Portal
### AtomQuest Hackathon 1.0

> AI-powered goal management for modern organisations

---

## 🚀 Quick Start (Local)

```bash
# 1. Clone / unzip the project
cd northstar

# 2. Install dependencies
npm install

# 3. Add your Groq API key
cp .env.example .env
# Edit .env and set GROQ_API_KEY=gsk_...

# 4. Run dev server
npm run dev
# → Opens at http://localhost:5173
```

---

## ☁️ Deploy to Vercel (1 minute)

```bash
npm install -g vercel
vercel deploy
```

Then in Vercel dashboard → Project → Settings → Environment Variables, add:
```
GROQ_API_KEY = gsk_your-key-here
```

**Or push to GitHub and import into Vercel — zero config needed.**

---

## 🏗 Project Structure

```
northstar/
├── api/ai.js                    ← Vercel serverless AI proxy
├── src/
│   ├── main.jsx                 ← React entry point
│   ├── App.jsx                  ← Root with all state & routing
│   ├── styles.css               ← Full design system
│   ├── lib/
│   │   ├── constants.js         ← THRUST, UOM, USERS, NAV config
│   │   ├── data.js              ← Seed goals, check-ins, audit log
│   │   └── utils.js             ← calcPct, wtdScore, fmtV, exportCSV
│   ├── components/
│   │   ├── ui.jsx               ← Avatar, Badge, Modal, ProgressRing…
│   │   ├── ai.jsx               ← useAI, AICoach, AICheckinGen, AIInsights
│   │   └── layout.jsx           ← Sidebar, Topbar, Login
│   └── views/
│       ├── employee/            ← Dashboard, Goals, GoalWizard, Checkin
│       ├── manager/             ← Dashboard, Approvals, Checkin
│       └── admin/               ← Dashboard, Analytics, AuditCycle
├── public/favicon.svg
├── index.html
├── vite.config.js               ← Dev AI proxy plugin
└── vercel.json                  ← Vercel deployment config
```

---

## 👥 Demo Users

| User | Role | Login |
|------|------|-------|
| Alice Johnson | Employee (Sales) | See approved goals, Q1+Q2 done |
| Bob Kumar | Employee (Sales) | Goals submitted, pending approval |
| Carol Singh | Employee (Engineering) | Goals in draft |
| David Patel | Employee (Engineering) | Approved, Q1+Q2 done |
| Sarah Manager | Manager (Sales) | Reviews Alice & Bob |
| James Lead | Manager (Engineering) | Reviews Carol & David |
| HR Admin | Admin | Full org access |

---

## ✦ Features

### Core BRD Requirements
- ✅ 4 UoM types: Min, Max, Timeline, Zero-based
- ✅ Weightage validation: 100% total, min 10%, max 8 goals
- ✅ Goal locking after manager approval
- ✅ Manager inline edit before approval
- ✅ Return with structured comment
- ✅ Shared goals (admin push to all / by dept)
- ✅ Q1–Q4 quarterly check-in logging
- ✅ Weighted progress score calculation
- ✅ Audit trail with full change log
- ✅ Cycle management (5 phases)

### AI Features (Groq API)
- 🧠 **AI Goal Coach** — 4-dimension quality scoring in wizard
- 🤖 **AI Check-in Generator** — data-driven manager comments
- 🔮 **AI Insights Engine** — org-level pattern observations
- ⚡ **Escalation Detection** — auto-flags at-risk employees

### Bonus
- 📊 QoQ trend charts, dept comparison, thrust radar
- 🔔 Notification bell with unread count
- ⬇ One-click CSV export
- 🔗 Admin push shared goals to all/by dept

---

## 🎨 Design System

| Token | Value |
|---|---|
| Primary BG | `#06101e` Deep Navy |
| Card BG | `#0d1e35` |
| Accent | `#f59e0b` Amber Gold |
| Success | `#10b981` Emerald |
| Heading Font | Syne 800 |
| Body Font | Outfit |

---

## ⚙️ Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GROQ_API_KEY` | Yes | Your Groq API key — get one at console.groq.com |

---

*Built with ♥ for AtomQuest Hackathon 1.0 · Powered by Groq AI*
