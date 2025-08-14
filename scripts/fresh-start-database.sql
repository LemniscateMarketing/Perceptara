-- Drop all existing tables to start fresh
DROP TABLE IF EXISTS patient_cases CASCADE;
DROP TABLE IF EXISTS patient_templates CASCADE;
DROP TABLE IF EXISTS module_definitions CASCADE;
DROP TABLE IF EXISTS module_settings CASCADE;

-- Create a simple patient_cases table that matches what we need
CREATE TABLE patient_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_name TEXT NOT NULL,
    case_summary TEXT,
    field_data JSONB NOT NULL DEFAULT '{}',
    status TEXT DEFAULT 'active',
    session_count INTEGER DEFAULT 0,
    last_session_date TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create module_settings table for enabled modules
CREATE TABLE module_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id TEXT NOT NULL UNIQUE,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default enabled modules
INSERT INTO module_settings (module_id, enabled) VALUES
('basic_information', true),
('behavioral_patterns', true),
('cognitive_emotional_patterns', true),
('work_career', true),
('mental_health_history', true),
('family_dynamics', true),
('trauma_history', true);

-- Create a simple test case to verify everything works
INSERT INTO patient_cases (case_name, case_summary, field_data) VALUES
('Test Patient - John Doe (30)', 'Test case for system verification', '{"full_name": "John Doe", "age": 30, "gender": "male"}');

-- Verify the data was inserted
SELECT id, case_name, case_summary, field_data FROM patient_cases;
