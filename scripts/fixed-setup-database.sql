-- Psychology Simulation Platform Database Setup
-- Fixed version without superuser requirements

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS public.conversation_messages CASCADE;
DROP TABLE IF EXISTS public.session_notes CASCADE;
DROP TABLE IF EXISTS public.sessions CASCADE;
DROP TABLE IF EXISTS public.patients CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Drop existing types if they exist
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS session_status CASCADE;
DROP TYPE IF EXISTS patient_complexity CASCADE;

-- Create enum types
CREATE TYPE user_role AS ENUM ('student', 'licensed_therapist', 'supervisor', 'admin');
CREATE TYPE session_status AS ENUM ('active', 'completed', 'cancelled');
CREATE TYPE patient_complexity AS ENUM ('beginner', 'intermediate', 'advanced');

-- Users/Psychologists table
CREATE TABLE public.users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    role user_role DEFAULT 'student',
    license_number VARCHAR(100),
    specializations TEXT[],
    institution VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Patients table (AI personas)
CREATE TABLE public.patients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INTEGER NOT NULL,
    gender VARCHAR(50),
    primary_concern TEXT NOT NULL,
    background TEXT NOT NULL,
    complexity_level patient_complexity DEFAULT 'beginner',
    avatar_url TEXT,
    personality_traits JSONB,
    therapeutic_goals JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions table
CREATE TABLE public.sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    modality VARCHAR(100),
    status session_status DEFAULT 'active',
    duration_seconds INTEGER DEFAULT 0,
    message_count INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Session notes table (SOAP format)
CREATE TABLE public.session_notes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE,
    subjective TEXT,
    objective TEXT,
    assessment TEXT,
    plan TEXT,
    session_rating INTEGER CHECK (session_rating >= 1 AND session_rating <= 5),
    reflection_notes JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversation messages table
CREATE TABLE public.conversation_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE,
    sender VARCHAR(50) NOT NULL, -- 'patient', 'therapist', 'supervisor'
    message TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB
);

-- Insert sample patients (with ON CONFLICT to avoid duplicates)
INSERT INTO public.patients (name, age, gender, primary_concern, background, complexity_level, avatar_url, personality_traits, therapeutic_goals) VALUES 
(
    'Jennifer Walsh',
    28,
    'Female',
    'Anxiety and Self-Doubt',
    'Jennifer is a marketing professional who recently received a promotion but struggles with imposter syndrome. She experiences anxiety about her capabilities and fears being "found out" as inadequate.',
    'beginner',
    '/young-professional-woman.png',
    '{"traits": ["perfectionist", "anxious", "hardworking"], "communication_style": "articulate but hesitant"}',
    '{"primary": "reduce anxiety", "secondary": ["build self-confidence", "develop healthy work boundaries"]}'
),
(
    'Marcus Thompson',
    35,
    'Male',
    'Depression and Life Transitions',
    'Marcus recently went through a divorce and is struggling with depression and feelings of failure. He has two young children and is navigating co-parenting.',
    'intermediate',
    '/thoughtful-man.png',
    '{"traits": ["withdrawn", "analytical", "caring father"], "communication_style": "measured and careful"}',
    '{"primary": "process grief and loss", "secondary": ["improve emotional expression", "develop co-parenting skills"]}'
),
(
    'Sarah Martinez',
    22,
    'Female',
    'Identity and Relationship Issues',
    'Sarah is a college senior struggling with questions about her identity, career direction, and romantic relationships. She comes from a traditional family with high expectations.',
    'beginner',
    '/young-woman-student.png',
    '{"traits": ["curious", "conflicted", "people-pleasing"], "communication_style": "expressive but scattered"}',
    '{"primary": "explore identity and values", "secondary": ["improve decision-making", "set healthy boundaries"]}'
),
(
    'Robert Chen',
    42,
    'Male',
    'Work Stress and Burnout',
    'Robert is a software engineer and team lead who is experiencing severe burnout. He works long hours and has difficulty delegating.',
    'advanced',
    '/professional-man.png',
    '{"traits": ["responsible", "perfectionist", "analytical"], "communication_style": "logical but stressed"}',
    '{"primary": "address burnout and stress", "secondary": ["develop work-life balance", "learn delegation skills"]}'
)
ON CONFLICT DO NOTHING;

-- Insert sample user (with conflict handling)
INSERT INTO public.users (email, full_name, role, license_number, specializations, institution) VALUES 
('demo@example.com', 'Demo Therapist', 'student', 'LPC-12345', ARRAY['CBT', 'Person-Centered', 'Mindfulness-Based'], 'MindSpace Training Institute')
ON CONFLICT (email) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    license_number = EXCLUDED.license_number,
    specializations = EXCLUDED.specializations,
    institution = EXCLUDED.institution,
    updated_at = NOW();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_patient_id ON public.sessions(patient_id);
CREATE INDEX IF NOT EXISTS idx_session_notes_session_id ON public.session_notes(session_id);
CREATE INDEX IF NOT EXISTS idx_conversation_messages_session_id ON public.conversation_messages(session_id);

-- Enable Row Level Security (RLS) - but with permissive policies for demo
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_messages ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for demo purposes
CREATE POLICY "Allow all operations on users" ON public.users FOR ALL USING (true);
CREATE POLICY "Allow all operations on patients" ON public.patients FOR ALL USING (true);
CREATE POLICY "Allow all operations on sessions" ON public.sessions FOR ALL USING (true);
CREATE POLICY "Allow all operations on session_notes" ON public.session_notes FOR ALL USING (true);
CREATE POLICY "Allow all operations on conversation_messages" ON public.conversation_messages FOR ALL USING (true);

-- Success message
SELECT 'Database setup completed successfully! You now have 4 sample patients and 1 sample user.' as message;
