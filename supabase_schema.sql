-- ================================================================
-- CleanCity: AI-Powered Citizen Sanitation Reporting Platform
-- Database Schema for Supabase (PostgreSQL)
-- Final Year CSE Project
-- ================================================================

-- 1. PROFILES / USERS TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'CITIZEN' CHECK (role IN ('CITIZEN', 'ADMIN')),
  city TEXT NOT NULL,
  phone_optional TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. COMPLAINTS TABLE
CREATE TABLE IF NOT EXISTS public.complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  image_url TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  latitude_optional NUMERIC,
  longitude_optional NUMERIC,
  category TEXT NOT NULL CHECK (category IN (
    'Garbage Overflow',
    'Illegal Dumping',
    'Blocked Drain',
    'Plastic Waste',
    'Unclean Public Space',
    'Other'
  )),
  priority TEXT NOT NULL CHECK (priority IN ('High', 'Medium', 'Low')),
  confidence NUMERIC NOT NULL DEFAULT 0.85,
  ai_reason TEXT NOT NULL,
  recommended_action TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'REPORTED' CHECK (status IN (
    'REPORTED',
    'UNDER REVIEW',
    'IN PROGRESS',
    'RESOLVED'
  )),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. COMPLAINT STATUS HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.complaint_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
  old_status TEXT NOT NULL,
  new_status TEXT NOT NULL,
  changed_by TEXT NOT NULL,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  note TEXT
);

-- 4. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  complaint_id TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaint_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view their own profile; Admins can view all
CREATE POLICY "Users can view profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN'
  ));

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Complaints: Citizens can view their own; Admins can view all
CREATE POLICY "Citizens read own, admins read all" ON public.complaints
  FOR SELECT USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN'
  ));

CREATE POLICY "Citizens can insert complaints" ON public.complaints
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update complaints" ON public.complaints
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN'
  ));

-- Notifications: Citizens can read their own
CREATE POLICY "Citizens view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Citizens update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);
