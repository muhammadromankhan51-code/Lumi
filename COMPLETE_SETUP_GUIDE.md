## LUMI - COMPLETE SUPABASE & APP SETUP GUIDE

This guide walks through every step needed to get Lumi fully functional.

---

## PART 1: SUPABASE DATABASE SETUP

### Step 1: Execute SQL Schema

1. Go to: https://supabase.com/dashboard
2. Select project: `ujnzngwagoigjlayjyoq`
3. Click **SQL Editor** → **New Query**
4. Copy and paste the SQL below
5. Click **Run**

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase Auth)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  date_of_birth DATE,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  allergies TEXT,
  medical_conditions TEXT,
  emergency_contact TEXT,
  emergency_phone TEXT,
  avatar_url TEXT,
  language TEXT DEFAULT 'en',
  email_verified BOOLEAN DEFAULT FALSE,
  profile_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Medications table
CREATE TABLE IF NOT EXISTS public.medications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  purpose TEXT,
  start_date DATE,
  end_date DATE,
  prescribed_by TEXT,
  prescription_id UUID,
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Prescriptions table
CREATE TABLE IF NOT EXISTS public.prescriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  image_url TEXT,
  extracted_text TEXT,
  ai_analysis TEXT,
  risk_score DECIMAL(3,1),
  risk_level TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  ocr_confidence DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Drug Interactions table
CREATE TABLE IF NOT EXISTS public.drug_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  medication_id_1 UUID NOT NULL REFERENCES public.medications(id) ON DELETE CASCADE,
  medication_id_2 UUID NOT NULL REFERENCES public.medications(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL,
  severity TEXT NOT NULL,
  description TEXT,
  recommendation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Reminders table
CREATE TABLE IF NOT EXISTS public.reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  medication_id UUID REFERENCES public.medications(id) ON DELETE CASCADE,
  reminder_time TIME NOT NULL,
  frequency TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Medication Adherence table
CREATE TABLE IF NOT EXISTS public.medication_adherence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  medication_id UUID NOT NULL REFERENCES public.medications(id) ON DELETE CASCADE,
  scheduled_date DATE NOT NULL,
  taken BOOLEAN DEFAULT false,
  taken_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Pharmacies table
CREATE TABLE IF NOT EXISTS public.pharmacies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  distance_km DECIMAL(5,2),
  phone TEXT,
  operating_hours TEXT,
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_medications_user_id ON public.medications(user_id);
CREATE INDEX idx_prescriptions_user_id ON public.prescriptions(user_id);
CREATE INDEX idx_reminders_user_id ON public.reminders(user_id);
CREATE INDEX idx_adherence_user_id ON public.medication_adherence(user_id);
CREATE INDEX idx_interactions_med1 ON public.drug_interactions(medication_id_1);
CREATE INDEX idx_interactions_med2 ON public.drug_interactions(medication_id_2);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drug_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medication_adherence ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can view their own data" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own data" ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view their own medications" ON public.medications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own medications" ON public.medications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own medications" ON public.medications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own medications" ON public.medications FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own prescriptions" ON public.prescriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own prescriptions" ON public.prescriptions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own reminders" ON public.reminders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own reminders" ON public.reminders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reminders" ON public.reminders FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own adherence" ON public.medication_adherence FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own adherence" ON public.medication_adherence FOR INSERT WITH CHECK (auth.uid() = user_id);
```

---

## PART 2: ENABLE SOCIAL AUTHENTICATION

### Step 1: Enable Google OAuth

1. Go to: Supabase Dashboard → Authentication → Providers
2. Find **Google** → Click to expand
3. Toggle **Enabled** ON
4. Get Google OAuth credentials:
   - Go to: https://console.cloud.google.com/
   - Create new OAuth app
   - Authorized redirect URIs: `https://ujnzngwagoigjlayjyoq.supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret
5. Paste into Supabase Google provider
6. Click **Save**

### Step 2: Enable Apple OAuth

1. In same Providers section, find **Apple**
2. Toggle **Enabled** ON
3. Get Apple OAuth credentials (requires Apple Developer account)
4. Enter credentials and save

### Step 3: Enable Email Authentication

1. Still in Providers, find **Email**
2. Toggle **Enabled** ON (should be by default)
3. Go to: **Email Templates** tab
4. Customize email verification template if needed

---

## PART 3: CONFIGURE EMAIL VERIFICATION

1. Go to: Authentication → Providers → Email
2. Set **Email confirmations**:
   - Toggle **Confirm email** ON
   - Set auto-confirm time (recommend 86400 for 24 hours)
3. Set **Security**:
   - Token expiration: 86400 (24 hours)
   - Double confirm enabled: ON

---

## PART 4: ENVIRONMENT VARIABLES

Your `.env.local` should have:

```
NEXT_PUBLIC_SUPABASE_URL=https://ujnzngwagoigjlayjyoq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_X57PjD9T4aAuxEWPvPHN4Q_d8DagcSE
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSyC7jhP0_c9-JxdIH0WVKXywPhi09MfQTZY
```

These are already configured. No additional setup needed.

---

## PART 5: TEST THE SETUP

1. Start dev server: `pnpm dev`
2. Visit: `http://localhost:3000`
3. Click **Sign Up**
4. Test social logins (Google, Apple)
5. Test email signup
6. Verify email works
7. Create profile
8. Access dashboard

---

## CHECKLIST BEFORE DEPLOYMENT

- [ ] Database tables created (7 tables visible in Table Editor)
- [ ] Row Level Security (RLS) enabled on all tables
- [ ] Google OAuth configured and working
- [ ] Apple OAuth configured (optional)
- [ ] Email verification working
- [ ] Social logins tested
- [ ] Profile creation tested
- [ ] Language selection working
- [ ] Voice input working
- [ ] Prescription scanning working

---

## TROUBLESHOOTING

**"Auth failed" error:**
- Check Supabase URL and Anon Key in `.env.local`
- Verify CORS settings in Supabase

**"Email not sending":**
- Check Email Provider settings
- Verify email templates exist

**"Social login not working":**
- Verify OAuth credentials entered correctly
- Check redirect URI matches Supabase project

**"RLS policy error":**
- Ensure RLS is enabled on tables
- Check policies are created correctly

---

## NEXT: APP SETUP

After Supabase is ready, the app includes:
- Complete auth flow with email verification
- Google/Apple OAuth logins
- Profile creation after signup
- Language support (English, Urdu, Sindhi, Pashto, Alochi, Sirkari)
- Professional blue theme
- Prescription scanning with OCR
- AI analysis with Gemini
- Medication tracking
- Reminders with voice alerts
- Voice input for commands

All fully integrated and ready to use!
