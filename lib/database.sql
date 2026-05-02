-- Supabase Database Schema for Lumi

-- Create users table (extends Supabase auth)
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  profile_image text,
  language text default 'en',
  created_at timestamp default now()
);

-- Prescriptions table
create table if not exists public.prescriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  image_url text,
  extracted_text text,
  analyzed_data jsonb,
  created_at timestamp default now()
);

-- Medicines table
create table if not exists public.medicines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  dosage text,
  frequency text,
  purpose text,
  when_to_take text,
  safety text default 'safe',
  start_date timestamp,
  end_date timestamp,
  prescribed_by text,
  created_at timestamp default now()
);

-- Drug interactions table
create table if not exists public.drug_interactions (
  id uuid primary key default gen_random_uuid(),
  medicine_id_1 uuid not null references public.medicines(id) on delete cascade,
  medicine_id_2 uuid not null references public.medicines(id) on delete cascade,
  severity text,
  description text,
  created_at timestamp default now()
);

-- Reminders table
create table if not exists public.reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  medicine_id uuid not null references public.medicines(id) on delete cascade,
  reminder_time time,
  frequency text default 'daily',
  taken boolean default false,
  due_date timestamp,
  created_at timestamp default now()
);

-- Adherence tracking
create table if not exists public.adherence (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  medicine_id uuid not null references public.medicines(id) on delete cascade,
  date date,
  taken boolean default false,
  created_at timestamp default now()
);

-- Pharmacies (mock data)
create table if not exists public.pharmacies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  distance numeric,
  address text,
  open_status text,
  hours text,
  phone text,
  latitude numeric,
  longitude numeric
);

-- Enable RLS
alter table public.users enable row level security;
alter table public.prescriptions enable row level security;
alter table public.medicines enable row level security;
alter table public.reminders enable row level security;
alter table public.adherence enable row level security;

-- RLS Policies
create policy "Users can view their own data" on public.users
  for select using (auth.uid() = id);

create policy "Users can update their own data" on public.users
  for update using (auth.uid() = id);

create policy "Users can view their own prescriptions" on public.prescriptions
  for select using (auth.uid() = user_id);

create policy "Users can insert their own prescriptions" on public.prescriptions
  for insert with check (auth.uid() = user_id);

create policy "Users can view their own medicines" on public.medicines
  for select using (auth.uid() = user_id);

create policy "Users can manage their own medicines" on public.medicines
  for insert with check (auth.uid() = user_id);

create policy "Users can manage their own reminders" on public.reminders
  for all using (auth.uid() = user_id);

create policy "Users can track their own adherence" on public.adherence
  for all using (auth.uid() = user_id);
