# TimedQ – Controlled Timed Questionnaires

A Next.js + MongoDB application for running live moderated questionnaires where **only the admin can unlock the next question**.

## Features

- Admin-controlled question progression
- Support for text, multiple choice, and rating questions
- Image & video support in questions
- Social login (Google, GitHub, LinkedIn)
- Live participant tracking
- Results page with completion times
- Clean modern UI with Tailwind CSS

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

Required:

- `MONGODB_URI` – your MongoDB connection string
- `AUTH_SECRET` – generate with `openssl rand -base64 32`
- Google / GitHub / LinkedIn OAuth credentials

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Front page
│   ├── login/                   # Social login
│   ├── admin/                   # Admin dashboard & control
│   ├── join/[code]/            # Participant join
│   ├── live/[sessionId]/       # Participant live answering
│   ├── results/[sessionId]/    # Results with times
│   └── api/                     # API routes
├── models/                      # Mongoose models
├── lib/                         # DB helpers
├── auth.ts                      # Auth.js configuration
└── middleware.ts                # Protect /admin routes
```

## How it works

1. Admin creates a questionnaire (with optional images/videos)
2. A session is started and a short join code is generated
3. Participants join with the code and enter their name
4. Admin unlocks questions one by one
5. Participants answer and wait for the next unlock
6. At the end, a ranked results page shows everyone + their times

## Tech Stack

- Next.js 15 (App Router)
- Auth.js (NextAuth v5)
- MongoDB + Mongoose
- Tailwind CSS
- TypeScript
# questionaire
# questionaire
