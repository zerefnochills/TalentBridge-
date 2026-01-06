# TalentBridge - Skill-First Career & Hiring Platform

> **A hackathon-ready MVP demonstrating transparent, rule-based skill assessment for fair hiring**

TalentBridge eliminates resume dependency and focuses on measurable, time-dependent skill confidence through the Skill Confidence Index (SCI) - a transparent, explainable scoring system.

---

## 🎯 Core Innovation

### Skill Confidence Index (SCI)

```
SCI = (Assessment Score × 0.4) + (Freshness Score × 0.35) + (Scenario Score × 0.25)
```

**Key Features:**
- ✅ **Rule-based, not AI** - Completely transparent and explainable
- ✅ **Time-dependent** - Skills decay based on last-used date
- ✅ **Multi-dimensional** - Combines testing, freshness, and practical scenarios
- ✅ **Configurable weights** - Hackathon judges can inspect the formula

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)

### Installation

**1. Clone and setup:**
```bash
cd "c:\TCU hackathon\talentbridge"
```

**2. Backend setup:**
```bash
cd backend
npm install

# Edit .env file with your MongoDB connection
# For local MongoDB: mongodb://localhost:27017/talentbridge
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/talentbridge

# Seed the database with demo skills and roles
node seed/seedDatabase.js

# Start backend server
npm run dev
```

Backend will run on `http://localhost:5000`

**3. Frontend setup (new terminal):**
```bash
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:5173`

---

## 📊 Demo Accounts

After seeding, you can create test accounts:

**Student Account:**
- Register at `/register`
- Role: Student
- Add skills from the catalog
- Take assessments to build SCI

**Company Account:**
- Register at `/register`
- Role: Company
- Post jobs with skill requirements
- View ranked candidates

---

## ✨ Implemented Features

### ✅ Core System
- [x] **SCI Calculation Engine** - Transparent formula with breakdown
- [x] **Skill Freshness Decay** - Time-based confidence reduction
- [x] **Assessment System** - Timed, randomized questions
- [x] **24-hour Cooldown** - Anti-cheating measure
- [x] **Explainable Ranking** - Every decision is transparent

### ✅ Student Features
- [x] **Dashboard** - Skills overview with SCI scores
- [x] **Authentication** - JWT-based secure login
- [x] **Skills Management** - Add/update skills (backend ready, UI placeholder)
- [x] **Assessments** - (Backend ready, UI placeholder)
- [x] **Gap Analysis** - (Backend ready, UI placeholder)
- [x] **Career Path Visualizer** - (Backend ready, UI placeholder)
- [x] **Job Search** - (Backend ready, UI placeholder)

### ✅ Company Features
- [x] **Dashboard** - Jobs and applications overview
- [x] **Job Posting** - (Backend ready, UI placeholder)
- [x] **Candidate Ranking** - Transparent skill-based ranking (Backend ready)
- [x] **Team Risk Meter** - Skill gap analysis (Backend ready, UI placeholder)
- [x] **HR Analytics** - Hiring metrics (Backend ready, UI placeholder)

---

## 🛠️ Technology Stack

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs for password hashing

**Frontend:**
- React 18 + Vite
- React Router for navigation
- Tailwind CSS for styling
- Axios for API calls

**Architecture:**
- RESTful API design
- Role-based access control
- Modular, scalable structure

---

## 📁 Project Structure

```
talentbridge/
├── backend/
│   ├── server.js              # Express server
│   ├── config/
│   │   └── db.js             # MongoDB connection
│   ├── models/               # Mongoose schemas
│   │   ├── User.js
│   │   ├── Skill.js
│   │   ├── Assessment.js
│   │   ├── Job.js
│   │   └── Role.js
│   ├── routes/               # API endpoints
│   │   ├── auth.js
│   │   ├── skills.js
│   │   ├── assessments.js
│   │   ├── analysis.js
│   │   ├── jobs.js
│   │   └── company.js
│   ├── utils/                # Business logic
│   │   ├── sciCalculator.js  # SCI formula
│   │   ├── gapAnalyzer.js
│   │   ├── roleRecommender.js
│   │   └── candidateRanker.js
│   ├── middleware/
│   │   └── auth.js           # JWT protection
│   └── seed/
│       └── seedDatabase.js   # Demo data
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Main app with routing
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── student/
│   │   │   │   └── Dashboard.jsx
│   │   │   ├── company/
│   │   │   │   └── Dashboard.jsx
│   │   │   └── PlaceholderPages.jsx
│   │   ├── components/
│   │   │   └── SCIBreakdown.jsx
│   │   └── utils/
│   │       └── api.js        # Axios instance
│   └── tailwind.config.js
└── README.md
```

---

## 🎓 For Hackathon Judges

### Why This Matters

1. **No Resume Bias** - Skills are measured, not claimed
2. **Transparent Scoring** - Every SCI calculation is explainable
3. **Fair to Freshers** - New grads can prove skills objectively
4. **Time-Aware** - Accounts for skill decay over time
5. **Anti-Cheating** - Timed tests, randomized questions, cooldown periods

### Technical Highlights

- **Rule-Based Intelligence** - No fake AI/ML claims
- **Explainable System** - Judges can inspect formula weights
- **Scalable Architecture** - Production-ready structure
- **Security** - JWT auth, bcrypt hashing, protected routes
- **Real MongoDB Integration** - Not mock data

### Demo Flow

1. **Register as Student** → Add JavaScript skill
2. **Take Assessment** → See SCI calculated with breakdown
3. **View Gap Analysis** → Compare against "Frontend Developer" role
4. **Register as Company** → Post job with skill requirements
5. **View Candidates** → See transparent ranking explanations

---

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get profile (protected)

### Skills
- `GET /api/skills` - List all skills
- `GET /api/skills/user` - Get user skills with SCI
- `POST /api/skills/user` - Add skill
- `PUT /api/skills/user/:skillId` - Update skill

### Assessments
- `POST /api/assessments/start` - Start assessment
- `POST /api/assessments/submit` - Submit answers & calculate SCI
- `GET /api/assessments/history` - Assessment history
- `GET /api/assessments/cooldown/:skillId` - Check retake eligibility

### Analysis
- `POST /api/analysis/gap` - Analyze skill gap for role
- `GET /api/analysis/recommendations` - Get role recommendations
- `GET /api/analysis/career-path/:roleId` - Get career progression
- `GET /api/analysis/upskilling` - Get upskilling guidance

### Jobs
- `POST /api/jobs` - Create job (company only)
- `GET /api/jobs` - List jobs (with match % for students)
- `GET /api/jobs/:id` - Job details
- `POST /api/jobs/:id/apply` - Apply for job
- `GET /api/jobs/:id/candidates` - Ranked candidates (company only)

### Company
- `GET /api/company/team-risk` - Team skill risk analysis
- `GET /api/company/analytics` - HR dashboard metrics

---

## 🎨 Completing the MVP

The backend is **100% functional**. Here's how to complete the UI:

### Priority Pages to Build

**1. Skill Management (`/student/skills`):**
- Fetch skills from `/api/skills`
- Display catalog with "Add" buttons
- Form to set last-used date
- Call `POST /api/skills/user`

**2. Assessment (`/student/assessment/:skillId`):**
- Call `POST /api/assessments/start`
- Display questions with timer
- On submit, call `POST /api/assessments/submit`
- Redirect to results page

**3. Assessment Results:**
- Display score
- Show `SCIBreakdown` component
- Show updated SCI value

**4. Job Posting (`/company/create-job`):**
- Form for title, description
- Skill selector with importance sliders
- Min SCI input per skill
- Call `POST /api/jobs`

**5. Candidate Ranking (`/company/candidates/:jobId`):**
- Fetch from `/api/jobs/:jobId/candidates`
- Display ranked list
- Show skill match breakdown
- Display ranking explanation

### UI Patterns to Follow

- Use `card` class for containers
- Use `btn-primary` and `btn-secondary` for buttons
- Use `input-field` for inputs
- Import `api` from `utils/api.js`
- Use `useAuth()` hook for user data
- Show loading states

---

## 🐛 Troubleshooting

**Backend won't start:**
- Check MongoDB is running
- Verify `.env` file exists and has correct `MONGODB_URI`
- Run `npm install` in backend folder

**Frontend shows 404:**
- Check backend is running on port 5000
- Verify `API_URL` in `frontend/src/utils/api.js`

**Can't login:**
- Ensure you registered first
- Check browser console for errors
- Verify JWT_SECRET is set in `.env`

**No skills in catalog:**
- Run seed script: `node backend/seed/seedDatabase.js`

---

## 📝 MVP Limitations (Acknowledged)

✅ **Honest about scope:**
- Cheating cannot be eliminated, only reduced
- SCI is indicative, not absolute truth
- MVP insights labeled as such
- No real-time proctoring

✅ **Future Scope (not claimed in MVP):**
- AI-powered skill prediction
- GitHub project analysis
- Video interviews
- Peer validation

---

## 🏆 Value Proposition

**For Students:**
- Prove skills objectively, not just claim them
- Understand where they stand vs job requirements
- Get clear upskilling roadmap
- Fair chance for freshers

**For Companies:**
- Reduce resume screening time
- Rank candidates transparently
- Identify team skill gaps
- Hire based on verified skills

---

## 📜 License

MIT License - Built for TCU Hackathon 2026

---

## 👥 Team

Built with ❤️ for skill-first hiring

---

## 🎉 Next Steps After Hackathon

1. Complete remaining UI pages
2. Add real-time assessment proctoring
3. Integrate with LinkedIn/GitHub
4. Add video scenario assessments
5. Build mobile app
6. Deploy to production (Vercel + MongoDB Atlas)

---

**Ready to demo? Start both servers and visit `http://localhost:5173`**

Good luck with your hackathon! 🚀
