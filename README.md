# Cortex Omni — AI Tutor Platform

**⚠️ IMPORTANT**: This project is in **early stage development**. See [REPO_STATUS.md](./REPO_STATUS.md) for current implementation details and roadmap.

AI-powered personalized tutor platform with plans for 12-language support. Currently supports **English** and **Hindi**.

## Project structure

- `artifacts/api-server/` — Express + TypeScript backend API
- `artifacts/cortex/` — React + Vite frontend app
- `lib/db/` — PostgreSQL schema and Drizzle ORM config
- `lib/api-spec/` — OpenAPI contract source
- `lib/api-client-react/` — Generated React Query hooks and API client
- `lib/api-zod/` — Generated Zod schemas and validators
- `lib/integrations-gemini-ai/` — Google Gemini AI integration
- `lib/languages/` — Language configuration and translation services

## Current implementation status

### ✅ Implemented

- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS
- **Backend**: Express 5 + Drizzle ORM + PostgreSQL
- **AI Integration**: Google Gemini 2.5 Flash API (configured)
- **Languages**: English (EN) and Hindi (HI) with TTS support
- **Features**: Auth UI, Study plans, Topic explanations, Tutor interface, Payment flow (mock)

### ❌ Not Yet Implemented

- Teacher dashboard **backend** (UI exists)
- Analytics and progress tracking
- 10 additional languages (Tamil, Telugu, Marathi, Bengali, Kannada, Malayalam, Gujarati, Odia, Punjabi, Assamese)
- Language detection service
- Machine translation (planned with Bhashini API)
- Speech recognition (ASR) for voice input
- Video content delivery
- Real-time collaboration features

**Note**: Marketing claims such as "12+ languages", "6 pilot schools", and "94% improvement" are aspirational roadmap goals, not current product capabilities.

## Setup

### Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL 14+

### Installation

1. Install dependencies:

```bash
pnpm install
```

2. Create a `.env` file at the repository root:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/cortex

# Session security
SESSION_SECRET=generate-a-random-secret-string-here

# OpenRouter (optional - for alternative AI models)
OPENROUTER_API_KEY=your-openrouter-api-key-here
OPENROUTER_BASE_URL=https://openrouter.ai
OPENROUTER_MODEL=gpt-4o-mini

# Google Gemini AI (Primary AI service)
AI_INTEGRATIONS_GEMINI_BASE_URL=https://generativelanguage.googleapis.com
AI_INTEGRATIONS_GEMINI_API_KEY=AIzaSyCGKHp0hNY2lrQVSdczSciU9esFFXISLc0

# Language configuration
SUPPORTED_LANGUAGES=en,hi
DEFAULT_LANGUAGE=en
```

3. Set up the database:

```bash
# Push the database schema
pnpm --filter @workspace/db run push

# Seed the database with sample data
pnpm exec tsx lib/db/scripts/seed.ts
```

4. Run the development servers:

```bash
# Terminal 1: API server (http://localhost:8080)
pnpm --filter @workspace/api-server run dev

# Terminal 2: Frontend (http://localhost:5173)
pnpm --filter @workspace/cortex run dev
```

### Getting a Gemini API Key

1. Visit https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key and add it to your `.env` file as `AI_INTEGRATIONS_GEMINI_API_KEY`

Free tier includes:
- 60 requests per minute
- 1500 requests per day
- No credit card required

### Developer Access

On the login screen, click **"dev access"** and enter:
```
cortex-dev-2025
```

This unlocks all premium features for testing.

## Notes

- The `.env` file is ignored by `.gitignore` and should not be committed
- See [REPO_STATUS.md](./REPO_STATUS.md) for detailed project roadmap
- See [GEMINI_SETUP.md](./GEMINI_SETUP.md) for Gemini API integration details
- The README is intentionally explicit about what is built and what remains unfinished.
