# 🏃‍♀️ RUNBY MVP - Find Your Running Partner

**The complete running partner matching app with premium features and community elements.**

## 🎯 Project Overview

RUNBY is a location-based running partner matching app that connects runners based on pace, distance preferences, availability, and location. Think "Tinder for Runners" with premium features and community elements.

### Key Features
- 🔍 **Smart Discovery**: Find runners by pace, distance, and location
- 💬 **Real-time Chat**: Secure messaging between matched runners
- 🏃‍♂️ **Verification System**: Strava and HealthKit integration
- 💎 **Premium Tiers**: 4-tier subscription system
- 👥 **Community Groups**: Join and create running groups
- 🛡️ **Safety First**: User blocking, reporting, and privacy controls

### Tech Stack
- **Frontend**: Next.js 14, React 18, Framer Motion, TailwindCSS
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Authentication**: Clerk with custom JWT integration
- **Payments**: Stripe with 4-tier subscription system
- **Real-time**: Supabase Realtime for chat and live updates
- **Storage**: Supabase Storage for photos and file uploads
- **Maps**: Mapbox for location features
- **Testing**: Jest + Cypress for comprehensive testing

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/aaronlhr/RUNBY-APP-clone-.git
cd RUNBY-APP-clone-

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev

# Open http://localhost:4000
cp .env.example .env.local
cd ~/runby
runby-app/
├── app/                    # Next.js 14 App Router
│   ├── (auth)/            # Authentication screens
│   ├── (main)/            # Main app screens
│   ├── api/               # API routes
│   └── components/        # Reusable components
├── docs/                  # Documentation
├── supabase/             # Database schemas and migrations
├── lib/                  # Utilities and configurations
└── public/               # Static assets

# Run unit tests
npm test

# Run E2E tests
npm run test:e2e

# Run all tests
npm run test:all
# Build for production
npm run build

# Deploy to Vercel
npm run deploy
**Now let's add the environment template:**

```bash
cat > .env.example << 'EOF'
# RUNBY MVP - Environment Variables
# Copy this file to .env.local and fill in your actual values

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:4000
NODE_ENV=development

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key_here
CLERK_SECRET_KEY=sk_test_your_clerk_secret_here
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret

# Database (Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Payments (Stripe)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook

# Third-party Integrations
STRAVA_CLIENT_ID=your_strava_client_id
STRAVA_CLIENT_SECRET=your_strava_client_secret
STRAVA_REDIRECT_URI=http://localhost:4000/api/auth/strava/callback

# Email Service
RESEND_API_KEY=re_your_resend_key
SMTP_FROM=noreply@runbyapp.com

# Analytics & Monitoring
NEXT_PUBLIC_POSTHOG_KEY=phc_your_posthog_key
SENTRY_DSN=your_sentry_dsn

# Maps & Location
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.your_mapbox_token

# Apple HealthKit (iOS)
HEALTHKIT_BUNDLE_ID=com.runbyapp.ios
