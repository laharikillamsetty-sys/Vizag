# CleanCity — "Report. Track. Clean."
### AI-Powered Citizen Sanitation Reporting and Accountability Platform
**Final-Year Computer Science Engineering Project | Vibe Coding MVP**  
*Academic Partner & Demonstration: SITAM Engineering College*

---

## 🌟 Executive Summary

**CleanCity** is a full-stack, civic technology web application that bridges the gap between citizens, students, and municipal sanitation authorities. By combining mobile-friendly problem reporting, automated **Gemini 3.8 Flash** multimodal sanitation classification, transparent lifecycle tracking, and an administrative dispatch dashboard, CleanCity empowers communities to keep public spaces, campuses, and neighborhoods clean.

---

## 🚀 The 5 Core Functional Modules

### 1. Citizen Registration, Login & Reporting
- Full citizen registration: Name, Email, Password, City/Area, Phone, Role.
- Instant 1-click **Demo Switcher** (Priya Sharma - Citizen / Inspector Rajesh Verma - Admin) for swift presentation and viva evaluation.
- Multi-field issue submission with image preview, live character validation, and browser geolocation.

### 2. Location & AI Sanitation Analysis
- Automated multimodal vision & textual analysis using `@google/genai` (`gemini-3.8-flash`).
- Classifies complaints into:
  - *Garbage Overflow*
  - *Illegal Dumping*
  - *Blocked Drain*
  - *Plastic Waste*
  - *Unclean Public Space*
  - *Other*
- Recommends actionable priority levels (`High`, `Medium`, `Low`), confidence scores, technical reasoning, and suggested municipal actions.
- **Intelligent Offline Heuristic Fallback**: Ensures 100% operational reliability even if offline or without an API key.

### 3. Public Complaint Tracking & Accountability
- Public search by unique alphanumeric Complaint ID (e.g. `CC-2026-001`).
- Visual 4-stage lifecycle timeline:
  $$\text{REPORTED} \longrightarrow \text{UNDER REVIEW} \longrightarrow \text{IN PROGRESS} \longrightarrow \text{RESOLVED}$$
- Verifiable audit trail with timestamps, officer notes, and field action updates.

### 4. Municipal Authority Admin Dashboard
- Complete operational console with KPI metrics: Total Reports, Under Review, In Progress, Resolved, and High-Priority Incidents.
- Real-time search, categorization, and priority filters.
- Direct status management dialog to dispatch field crews, write official inspection notes, and trigger citizen notifications.

### 5. In-App Notifications & Civic Sanitation Analytics
- Instant in-app alerts whenever a complaint changes status or is resolved.
- Real-time analytical KPI cards: Resolution %, Pending vs. Resolved ratios, most common issue classification, and category distribution charts.

---

## 🏛️ Institutional Branding & Demo Disclaimer

In accordance with academic presentation requirements, CleanCity features institutional placeholder touchpoints:
1. **[SITAM / College Logo]** — Academic and vibe coding development partner.
2. **[MUNICIPAL CORPORATION LOGO]** — Greater Municipal Solid Waste Management Authority.
3. **[POLICE STATION LOGO]** — Civic space liaison.
4. **[NGO / COMMUNITY PARTNER LOGO]** — Clean Green Foundation.

*Disclaimer: Demo project for educational purposes. Institutional logos are used for academic demonstration.*

---

## 🔑 Demo Credentials (For Presentation & Evaluation)

| Role | Email | Password | Persona |
| :--- | :--- | :--- | :--- |
| **Citizen (Student)** | `citizen@cleancity.demo` | `password123` | Priya Sharma (SITAM Hostels) |
| **Admin (Authority)** | `admin@cleancity.gov` | `admin123` | Chief Inspector Rajesh Verma |

---

## 🛠️ Technology Stack (100% Free & Open Source)

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons
- **Backend API**: Node.js, Express, TSX, Vite Middleware
- **AI Vision Engine**: Google GenAI SDK (`@google/genai`, model `gemini-3.8-flash`) + Heuristic Fallback
- **Database Architecture**:
  - *Local MVP Mode*: Zero-configuration persistent JSON database (`/data/cleancity_db.json`)
  - *Production Ready*: Full PostgreSQL / Supabase DDL schema included in `supabase_schema.sql`
- **Build System**: Single-bundle CommonJS output via `esbuild` (`dist/server.cjs`)

---

## 💻 Local Setup & Execution

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/cleancity.git
   cd cleancity
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables** (Optional):
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your Google Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *(Note: If no key is provided, CleanCity automatically activates its built-in rule-based intelligence engine!)*

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser at [http://localhost:3000](http://localhost:3000).

5. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

---

## 🌐 Deploy to Vercel / GitHub

CleanCity is configured for instant single-click deployment to Vercel:
1. Push your repository to GitHub.
2. Import your repository on [Vercel](https://vercel.com).
3. Set the build command to `npm run build` and output directory to `dist`.
4. (Optional) Set `GEMINI_API_KEY` in Vercel Environment Variables.
5. Deploy!
