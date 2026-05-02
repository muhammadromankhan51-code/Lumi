# Supabase Database Setup Instructions

## Step 1: Log in to Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Sign in with your account
3. Select your project: `ujnzngwagoigjlayjyoq`

## Step 2: Create Database Tables

1. Click on the **SQL Editor** in the left sidebar
2. Click **New Query** to create a new SQL query
3. Copy and paste the entire SQL schema below
4. Click **Run** to execute the query

### Complete SQL Schema

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
  language TEXT DEFAULT 'English',
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
-- Users RLS Policy
CREATE POLICY "Users can view their own data"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Medications RLS Policy
CREATE POLICY "Users can view their own medications"
  ON public.medications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own medications"
  ON public.medications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own medications"
  ON public.medications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own medications"
  ON public.medications FOR DELETE
  USING (auth.uid() = user_id);

-- Prescriptions RLS Policy
CREATE POLICY "Users can view their own prescriptions"
  ON public.prescriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own prescriptions"
  ON public.prescriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Reminders RLS Policy
CREATE POLICY "Users can view their own reminders"
  ON public.reminders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reminders"
  ON public.reminders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reminders"
  ON public.reminders FOR UPDATE
  USING (auth.uid() = user_id);

-- Medication Adherence RLS Policy
CREATE POLICY "Users can view their own adherence"
  ON public.medication_adherence FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own adherence"
  ON public.medication_adherence FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

## Step 3: Verify Tables Created

1. Go to the **Table Editor** in the left sidebar
2. You should see all 7 new tables:
   - `users`
   - `medications`
   - `prescriptions`
   - `drug_interactions`
   - `reminders`
   - `medication_adherence`
   - `pharmacies`

## Step 4: Insert Sample Data (Optional)

Run this query in SQL Editor to add sample pharmacies:

```sql
INSERT INTO public.pharmacies (name, latitude, longitude, distance_km, phone, operating_hours, status) VALUES
('HealthPlus Pharmacy', 40.7128, -74.0060, 0.5, '(555) 123-4567', '24/7', 'Open'),
('LifeCare Pharmacy', 40.7138, -74.0070, 0.8, '(555) 234-5678', '9 AM - 10 PM', 'Closing soon'),
('CarePoint Pharmacy', 40.7118, -74.0050, 1.2, '(555) 345-6789', '24/7', 'Open');
```

## Step 5: Environment Variables Ready

Your `.env.local` file already has:
- `NEXT_PUBLIC_SUPABASE_URL`: https://ujnzngwagoigjlayjyoq.supabase.co
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: sb_publishable_X57PjD9T4aAuxEWPvPHN4Q_d8DagcSE
- `NEXT_PUBLIC_GEMINI_API_KEY`: AIzaSyC7jhP0_c9-JxdIH0WVKXywPhi09MfQTZY

## Troubleshooting

- If you get permission errors, check Row Level Security (RLS) is enabled
- Make sure your Supabase project is in the same region as your database
- Verify the anon key has proper permissions in Supabase Auth settings
