# 🏃‍♀️ RUNBY - Running Partner Matching App

A location-based running partner matching app (think "Tinder for Runners") built with Next.js 14, TypeScript, and modern web technologies.

## 🚀 Current Status

✅ **Complete MVP Foundation**
- Next.js 14 with TypeScript and App Router
- TailwindCSS with custom design system
- Framer Motion animations
- Responsive mobile-first design
- Component-based architecture

✅ **Core Features Implemented**
- Authentication system (Login/Signup forms)
- Swipe-based discovery interface
- Real-time chat interface
- User profile management
- Navigation system
- Mock data for development

✅ **UI/UX Components**
- Modern, polished design
- Smooth animations and transitions
- Mobile-optimized interface
- Accessibility considerations
- Loading states and feedback

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: TailwindCSS with custom components
- **Animations**: Framer Motion
- **Backend**: Supabase (PostgreSQL + Edge Functions + Realtime)
- **Authentication**: Clerk (planned)
- **Payments**: Stripe (planned)
- **Storage**: Supabase Storage (planned)
- **Maps**: Mapbox (planned)

## 📱 Features

### 🔐 Authentication
- Multi-step signup process with running preferences
- Login with email/password
- Social login options (Google, Apple)
- Form validation and error handling

### 🎯 Discovery & Matching
- Swipe-based interface (Tinder-style)
- User cards with photos, bio, and running stats
- Pace and distance matching
- Location-based discovery
- Like/Pass functionality

### 💬 Real-time Chat
- Instant messaging between matched users
- Typing indicators
- Message status (sent, delivered, read)
- Chat history
- Online/offline status

### 👤 User Profiles
- Running preferences (pace, distance, times)
- Bio and personal information
- Subscription tier management
- Profile editing

### 🎨 Premium Features (Planned)
- 4-tier subscription system: Free/Runner/Athlete/Champion
- Advanced matching algorithms
- Unlimited swipes
- Priority matching
- Premium chat features

## 🏗️ Project Structure

```
runby-app/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles with TailwindCSS
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main app entry point
├── components/            # React components
│   ├── auth/             # Authentication components
│   │   ├── LoginForm.tsx
│   │   └── SignupForm.tsx
│   ├── matching/         # Discovery and matching
│   │   ├── SwipeCard.tsx
│   │   └── DiscoveryPage.tsx
│   ├── chat/             # Real-time messaging
│   │   └── ChatInterface.tsx
│   ├── ui/               # Reusable UI components
│   │   └── Navigation.tsx
│   └── App.tsx           # Main app component
├── docs/                 # Documentation
│   ├── API.md           # API endpoints and specs
│   └── DATABASE.md      # Database schema
├── lib/                  # Utilities and configurations
├── hooks/                # Custom React hooks
└── utils/                # Helper functions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aaronlhr/RUNBY-APP-clone-.git
   cd RUNBY
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:4000](http://localhost:4000)

## 🎯 Development Priorities

### Phase 1: Backend Integration (Next)
1. **Set up Supabase database**
   - Implement user authentication with Clerk
   - Create database tables from schema
   - Set up real-time subscriptions

2. **Add real API keys**
   - Configure environment variables
   - Replace mock data with real API calls
   - Implement error handling

3. **Authentication flow**
   - Integrate Clerk authentication
   - User session management
   - Protected routes

### Phase 2: Core Features
1. **Real-time chat**
   - Supabase real-time messaging
   - Message persistence
   - Push notifications

2. **Location services**
   - Mapbox integration
   - GPS location tracking
   - Distance-based matching

3. **Matching algorithm**
   - Smart user matching
   - Preference-based filtering
   - Match notifications

### Phase 3: Premium Features
1. **Subscription system**
   - Stripe integration
   - Payment processing
   - Feature gating

2. **Advanced features**
   - Strava integration
   - Running verification
   - Safety features

## 🎨 Design System

### Colors
- **Primary**: Blue gradient (#0ea5e9 to #0369a1)
- **Secondary**: Purple gradient (#d946ef to #a21caf)
- **Neutral**: Gray scale for text and backgrounds

### Components
- **Buttons**: Primary, secondary, and outline variants
- **Cards**: Consistent styling with shadows and rounded corners
- **Forms**: Input fields with focus states and validation
- **Navigation**: Bottom tab navigation for mobile

### Animations
- **Page transitions**: Fade in/out with slide effects
- **Micro-interactions**: Button hover states, loading spinners
- **Swipe animations**: Smooth card transitions

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  age INTEGER,
  location GEOGRAPHY(POINT),
  bio TEXT,
  photos TEXT[],
  preferred_pace_min INTEGER,
  preferred_pace_max INTEGER,
  strava_connected BOOLEAN DEFAULT FALSE,
  subscription_tier TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Matches Table
```sql
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user1_id UUID REFERENCES users(id),
  user2_id UUID REFERENCES users(id),
  status TEXT DEFAULT 'active',
  matched_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Messages Table
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID REFERENCES matches(id),
  sender_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 🔧 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@runby.app or join our Slack channel.

---

**Built with ❤️ for the running community**
