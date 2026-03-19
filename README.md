# 🤖 Agentic HR — AI-Powered Human Resource Management System

> A next-generation HRMS with a fully autonomous AI Copilot that can search candidates, read resumes, update statuses, and draft emails — all from a single chat message.

---

## ✨ What Makes This Agentic?

Most HR tools just show data. **Agentic HR acts on it.**

The AI Copilot is powered by **Google Gemini** with native **function calling (tool use)**. This means the AI doesn't just respond with text — it autonomously decides which tools to invoke, calls them against your live database, and loops until the task is complete. No manual button clicks, no copy-pasting.

---

## 🧠 AI Copilot — How It Works

The Copilot runs a **multi-turn agentic loop** on the backend:

```
You: "Move Priya Nair to Interview stage and send her an invite"
  │
  ├─ Gemini decides → call findCandidates(name: "Priya Nair")
  │     └─ Returns: candidate ID, role, status, resume text, AI score
  │
  ├─ Gemini decides → call updateCandidateStatus(id, status: "Interview")
  │     └─ Returns: "Successfully updated"
  │
  ├─ Gemini decides → call sendEmail(id, subject: "Interview Invite", body: "...")
  │     └─ Returns: "Email mock-sent to Priya Nair"
  │
  └─ Gemini responds: "Done! Priya Nair has been moved to Interview and sent an invite."
```

The backend loops up to **5 turns** per request, giving the AI enough room to chain multiple tool calls together autonomously.

### 🛠️ Available Tools

| Tool | Description |
|------|-------------|
| `findCandidates` | Search candidates by name, role, or status. Returns full profile + resume text |
| `updateCandidateStatus` | Move a candidate to: `Applied → Screening → Interview → Offer → Hired / Rejected` |
| `sendEmail` | Draft and send emails to candidates (rejection letters, interview invites, etc.) |

---

## 📄 AI Resume Analysis

Every candidate can have their resume uploaded as a PDF. The system:

1. **Extracts** raw text from the uploaded resume
2. **Sends it to Gemini** along with the Job Description
3. **Returns** a structured JSON response with:
   - `score` — an integer from 0–100 rating the candidate's fit
   - `feedback` — a 3–4 sentence analysis citing specific JD requirements and how the resume matches or misses them

```java
// The prompt sent to Gemini for resume screening:
"You are an expert HR recruiter. Analyze this candidate's resume content 
for the job posting...
Respond with ONLY: {"score": <0-100>, "feedback": "<analysis>"}"
```

The AI considers:
- Skill alignment with the job description
- Experience relevance
- Role-specific requirements mentioned in the JD

Results are saved directly to the candidate's profile and visible in the Recruitment dashboard.

---

## 🚀 Features

### 🤖 AI / Agentic
- **AI Copilot Chat** — Natural language commands that trigger multi-step autonomous actions
- **Resume Analysis** — PDF resume upload + Gemini-powered AI scoring (0–100)
- **AI Feedback** — Detailed per-candidate analysis stored on their profile
- **Interview Question Generator** — AI generates 3 hard, role-specific interview questions per candidate
- **Candidate Comparison** — AI compares shortlisted candidates and recommends the best fit

### 📋 Core HR Modules
- **Dashboard** — Real-time analytics with animated charts and key metrics
- **Employee Management** — Full employee profiles with 3D card visualizations
- **Recruitment (ATS)** — Kanban-style applicant tracking with drag-and-drop status updates
- **Payroll** — Salary management and simulated payroll runs
- **Time & Attendance** — Clock-in/out and daily presence tracking
- **Performance Reviews** — Yearly reviews with skill ratings (Communication, Technical, Leadership)
- **Org Chart** — Interactive, recursive tree visualization of company hierarchy
- **Onboarding** — Checklist system for new hire tasks

### 🔐 Security
- **Role-Based Access Control (RBAC)** — Admin / Manager / Employee roles with protected routes
- **Secure Auth** — Custom authentication provider

---

## 🛠️ Technology Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Recharts |
| **Backend** | Java 17, Spring Boot 3, Spring Data JPA, RestClient |
| **AI** | Google Gemini API (`gemini-2.5-flash`), Function Calling / Tool Use |
| **Database** | PostgreSQL |
| **Build** | Maven, npm |

---

## 📦 Setup & Installation

### Prerequisites
- Node.js & npm
- Java 17+ & Maven
- PostgreSQL
- A [Google Gemini API key](https://aistudio.google.com)

### 1. Configure Backend Secrets

Copy the example config and fill in your values:

```bash
cp backend/src/main/resources/application.properties.example \
   backend/src/main/resources/application.properties
```

Edit `application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/hr_db
spring.datasource.username=YOUR_DB_USERNAME
spring.datasource.password=YOUR_DB_PASSWORD

gemini.api-key=YOUR_GEMINI_API_KEY
gemini.model=gemini-2.5-flash
```

### 2. Start Backend
```bash
cd backend
mvn spring-boot:run
```
> The backend auto-seeds the database with demo employees, candidates, and reviews on first run.

### 3. Start Frontend
```bash
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`, backend on `http://localhost:8080`.

---

## 👤 Demo Credentials

| Role | Email | Password | Access |
|------|-------|----------|--------|
| **Admin** | `jessica@nexus.hr` | `password123` | Full Suite + AI Copilot |
| **Manager** | `harvey@nexus.hr` | `password123` | No Payroll |
| **Employee** | `alex@nexus.hr` | `password123` | Limited (personal only) |

---

## 💬 Example Copilot Commands

```
"Show me all candidates in the Interview stage"
"What is Priya Nair's experience in React?"
"Move all Screening candidates to Interview"
"Reject John Doe and send him a polite rejection email"
"Compare the top 3 candidates for the Backend Engineer role"
"Generate interview questions for Rahul applying for DevOps Engineer"
```

---

*Built with ❤️ using Google Gemini Agentic AI*
