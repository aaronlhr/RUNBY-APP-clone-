# 🗄️ Supabase & Clerk Setup Guide for RUNBY

## 📋 Prerequisites
- Supabase account (free tier available)
- Clerk account (free tier available)
- Your RUNBY project ready

## 🗄️ Step 1: Supabase Setup

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" or "New Project"
3. Sign in with GitHub
4. Create a new organization (if needed)
5. Create a new project:
   - **Name**: `runby-app`
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users (e.g., US East for US users)
   - **Pricing Plan**: Free tier (up to 500MB database, 50MB file storage)

### 1.2 Get Your Supabase Credentials
Once your project is created, go to Settings > API:
- **Project URL**: `https://your-project-id.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (keep this secret!)

### 1.3 Set Up Database Schema
Run these SQL commands in the Supabase SQL Editor:

```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Users table (extends Clerk user data)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  age INTEGER CHECK (age >= 18 AND age <= 100),
  location TEXT,
  bio TEXT,
  photos TEXT[] DEFAULT '{}',
  preferred_pace_min INTEGER, -- in seconds per mile
  preferred_pace_max INTEGER, -- in seconds per mile
  preferred_distance TEXT, -- '5k', '10k', 'half-marathon', 'marathon', 'ultra'
  running_times TEXT[] DEFAULT '{}', -- ['morning', 'afternoon', 'evening', 'night']
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'runner', 'athlete', 'champion')),
  is_verified BOOLEAN DEFAULT FALSE,
  is_online BOOLEAN DEFAULT FALSE,
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Matches table
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user1_id UUID REFERENCES users(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'blocked', 'unmatched')),
  matched_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user1_id, user2_id)
);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'location')),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Group runs table
CREATE TABLE group_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  coordinates POINT, -- latitude, longitude
  distance DECIMAL(5,2), -- in miles
  pace_min INTEGER, -- in seconds per mile
  pace_max INTEGER, -- in seconds per mile
  max_participants INTEGER DEFAULT 10,
  current_participants INTEGER DEFAULT 1,
  run_date TIMESTAMPTZ NOT NULL,
  run_time TIME NOT NULL,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'active', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Group run participants
CREATE TABLE group_run_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_run_id UUID REFERENCES group_runs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'joined' CHECK (status IN ('joined', 'maybe', 'declined')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(group_run_id, user_id)
);

-- User preferences for matching
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  max_distance_miles INTEGER DEFAULT 25, -- maximum distance to show matches
  age_min INTEGER DEFAULT 18,
  age_max INTEGER DEFAULT 100,
  gender_preference TEXT, -- 'male', 'female', 'any'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create indexes for better performance
CREATE INDEX idx_users_location ON users USING GIN(to_tsvector('english', location));
CREATE INDEX idx_users_running_times ON users USING GIN(running_times);
CREATE INDEX idx_matches_user1 ON matches(user1_id);
CREATE INDEX idx_matches_user2 ON matches(user2_id);
CREATE INDEX idx_messages_match_id ON messages(match_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_group_runs_location ON group_runs USING GIN(to_tsvector('english', location));
CREATE INDEX idx_group_runs_date ON group_runs(run_date);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_group_runs_updated_at BEFORE UPDATE ON group_runs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_run_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can read their own data and other users' public data
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid()::text = clerk_user_id);
CREATE POLICY "Users can view other users' public data" ON users FOR SELECT USING (true);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid()::text = clerk_user_id);

-- Users can insert their own data
CREATE POLICY "Users can insert own data" ON users FOR INSERT WITH CHECK (auth.uid()::text = clerk_user_id);

-- Matches policies
CREATE POLICY "Users can view their matches" ON matches FOR SELECT USING (
  user1_id IN (SELECT id FROM users WHERE clerk_user_id = auth.uid()::text) OR
  user2_id IN (SELECT id FROM users WHERE clerk_user_id = auth.uid()::text)
);

CREATE POLICY "Users can create matches" ON matches FOR INSERT WITH CHECK (
  user1_id IN (SELECT id FROM users WHERE clerk_user_id = auth.uid()::text) OR
  user2_id IN (SELECT id FROM users WHERE clerk_user_id = auth.uid()::text)
);

-- Messages policies
CREATE POLICY "Users can view messages in their matches" ON messages FOR SELECT USING (
  match_id IN (
    SELECT id FROM matches WHERE 
    user1_id IN (SELECT id FROM users WHERE clerk_user_id = auth.uid()::text) OR
    user2_id IN (SELECT id FROM users WHERE clerk_user_id = auth.uid()::text)
  )
);

CREATE POLICY "Users can send messages in their matches" ON messages FOR INSERT WITH CHECK (
  sender_id IN (SELECT id FROM users WHERE clerk_user_id = auth.uid()::text)
);

-- Group runs policies
CREATE POLICY "Anyone can view group runs" ON group_runs FOR SELECT USING (true);
CREATE POLICY "Users can create group runs" ON group_runs FOR INSERT WITH CHECK (
  creator_id IN (SELECT id FROM users WHERE clerk_user_id = auth.uid()::text)
);
CREATE POLICY "Creators can update their group runs" ON group_runs FOR UPDATE USING (
  creator_id IN (SELECT id FROM users WHERE clerk_user_id = auth.uid()::text)
);

-- Group run participants policies
CREATE POLICY "Anyone can view group run participants" ON group_run_participants FOR SELECT USING (true);
CREATE POLICY "Users can join group runs" ON group_run_participants FOR INSERT WITH CHECK (
  user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.uid()::text)
);
CREATE POLICY "Users can update their participation" ON group_run_participants FOR UPDATE USING (
  user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.uid()::text)
);

-- User preferences policies
CREATE POLICY "Users can view own preferences" ON user_preferences FOR SELECT USING (
  user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.uid()::text)
);
CREATE POLICY "Users can update own preferences" ON user_preferences FOR UPDATE USING (
  user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.uid()::text)
);
CREATE POLICY "Users can insert own preferences" ON user_preferences FOR INSERT WITH CHECK (
  user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.uid()::text)
);
```

## 🔐 Step 2: Clerk Authentication Setup

### 2.1 Create Clerk Application
1. Go to [clerk.com](https://clerk.com)
2. Sign up with GitHub
3. Create a new application:
   - **Name**: `RUNBY`
   - **Template**: Choose "Next.js" or "Custom"
   - **Environment**: Development

### 2.2 Configure Clerk Settings
1. **Authentication Methods**:
   - Enable Email/Password
   - Enable Google OAuth
   - Enable Apple OAuth (optional)

2. **User Profile**:
   - Add custom fields: `age`, `bio`, `preferred_pace`, `preferred_distance`, `location`, `running_times`

3. **Webhooks** (for Supabase sync):
   - Go to Webhooks section
   - Create webhook endpoint (we'll set this up later)

### 2.3 Get Your Clerk Credentials
Go to API Keys in your Clerk dashboard:
- **Publishable Key**: `pk_test_...`
- **Secret Key**: `sk_test_...` (keep this secret!)

## 🔧 Step 3: Environment Variables

Create a `.env.local` file in your RUNBY project:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key
CLERK_SECRET_KEY=sk_test_your_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/discovery
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/discovery

# App
NEXT_PUBLIC_APP_URL=http://localhost:4000
```

## 📦 Step 4: Install Dependencies

```bash
npm install @supabase/supabase-js @clerk/nextjs
```

## 🚀 Step 5: Next Steps

After completing this setup, we'll:
1. Create Supabase client configuration
2. Set up Clerk provider and middleware
3. Update authentication components
4. Create database service functions
5. Test the integration

---

**Ready to proceed? Let me know when you've completed these steps and I'll help you with the code integration!**

