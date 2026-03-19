# NexusHR - Advanced Human Resource Management System

NexusHR is a next-generation, glassmorphic HRMS built for modern organizations. It features a stunning UI, recursive organizational visualizers, and comprehensive modules for full employee lifecycle management.

## 🚀 Features

### Core Modules
-   **📊 Dashboard**: Real-time analytics with animated charts and key metrics.
-   **👥 Employee Management**: Add, edit, and view employee profiles with 3D card visualizations.
-   **🧘 Recruitment**: Kanban-style applicant tracking system (ATS) with drag-and-drop status updates.
-   **💰 Payroll**: Salary management and simulated payroll runs with net pay estimation.
-   **⏱️ Time & Attendance**: Clock-in/out functionality and daily presence tracking.
-   **📈 Performance**: Yearly reviews, skill ratings (Communication, Technical, Leadership), and feedback logs.
-   **🕸️ Organization Chart**: Interactive, recursive tree visualization of the company hierarchy.
-   **📋 Onboarding**: Checklist system for tracking new hire tasks (e.g., IT setup, Legal).

### Security & Architecture
-   **🔐 Role-Based Access Control (RBAC)**:
    -   **Admin**: Full access to all modules (Payroll, Recruitment, etc.).
    -   **Manager**: Access to team management but restricted from Payroll.
    -   **Employee**: View-only access to personal profile, attendance, and onboarding.
-   **🛡️ Secure Auth**: Custom Authentication Provider with protected routes.
-   **🎨 Glassmorphism UI**: Built with Tailwind CSS, Framer Motion, and Lucide Icons.

## 🛠️ Technology Stack

-   **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Recharts, React Router DOM.
-   **Backend**: Java 17, Spring Boot 3, Spring Data JPA.
-   **Database**: PostgreSQL / H2 (In-memory for demo).
-   **Tools**: Maven, npm.

## 📦 Installation & Setup

### Prerequisites
-   Node.js & npm
-   Java 17+ & Maven

### 1. Backend Setup
The backend runs on port `8080`. It handles business logic and data persistence.

```bash
cd backend
mvn spring-boot:run
```
*Note: The application automatically seeds the database with demo data (Employees, Reviews, Candidates) on the first run.*

### 2. Frontend Setup
The frontend runs on port `5173`.

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 3. Demo Credentials
Use these credentials to test different user roles:

| Role | Email | Password | Access |
|------|-------|----------|--------|
| **Admin** | `jessica@nexus.hr` | `password123` | Full Suite |
| **Manager** | `harvey@nexus.hr` | `password123` | No Payroll |
| **Employee** | `alex@nexus.hr` | `password123` | Limited |

## 📸 Screenshots
(Screenshots would go here)

---
*Built by Antigravity*
