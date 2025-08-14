-- Complete Migration to Modular Patient Architecture
-- This script will set up the full modular system and clean up conflicts

-- Step 1: Ensure we have all the modular tables
CREATE TABLE IF NOT EXISTS module_definitions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'clinical',
    version TEXT DEFAULT '1.0.0',
    field_definitions JSONB DEFAULT '[]'::jsonb,
    is_enabled BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS patient_templates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'general',
    complexity_level TEXT DEFAULT 'intermediate',
    enabled_modules TEXT[] DEFAULT '{}',
    module_order TEXT[] DEFAULT '{}',
    template_settings JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS patient_cases (
    id TEXT PRIMARY KEY,
    template_id TEXT, -- Make this nullable to avoid foreign key issues
    case_name TEXT NOT NULL,
    case_summary TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
    field_data JSONB DEFAULT '{}'::jsonb,
    session_count INTEGER DEFAULT 0,
    last_session_date TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Create module settings table for enabled/disabled modules
CREATE TABLE IF NOT EXISTS module_settings (
    id SERIAL PRIMARY KEY,
    module_id TEXT NOT NULL,
    is_enabled BOOLEAN DEFAULT true,
    settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(module_id)
);

-- Step 3: Insert default module definitions
INSERT INTO module_definitions (id, name, description, category, is_enabled, display_order) VALUES
('basic_information', 'Basic Information', 'Core demographic and contact information', 'demographics', true, 1),
('behavioral_patterns', 'Behavioral Patterns', 'Daily routines, habits, and behavioral observations', 'behavioral', true, 2),
('cognitive_emotional_patterns', 'Cognitive & Emotional Patterns', 'Thought patterns, emotional regulation, and cognitive processes', 'clinical', true, 3),
('work_career', 'Work & Career', 'Employment history, work-related stress, and career goals', 'demographics', true, 4),
('mental_health_history', 'Mental Health History', 'Previous therapy, medications, and psychiatric history', 'clinical', true, 5),
('family_dynamics', 'Family Dynamics', 'Family relationships, childhood experiences, and family patterns', 'clinical', true, 6),
('trauma_history', 'Trauma History', 'Traumatic experiences and their ongoing impact', 'clinical', true, 7)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    is_enabled = EXCLUDED.is_enabled,
    display_order = EXCLUDED.display_order,
    updated_at = NOW();

-- Step 4: Insert default module settings
INSERT INTO module_settings (module_id, is_enabled) VALUES
('basic_information', true),
('behavioral_patterns', true),
('cognitive_emotional_patterns', true),
('work_career', true),
('mental_health_history', true),
('family_dynamics', true),
('trauma_history', true)
ON CONFLICT (module_id) DO UPDATE SET
    is_enabled = EXCLUDED.is_enabled,
    updated_at = NOW();

-- Step 5: Create some sample patient templates
INSERT INTO patient_templates (id, name, description, complexity_level, enabled_modules, is_active) VALUES
('anxiety_template', 'General Anxiety Patient', 'Patient presenting with anxiety-related concerns', 'beginner', 
 ARRAY['basic_information', 'behavioral_patterns', 'cognitive_emotional_patterns'], true),
('depression_template', 'Depression Patient', 'Patient presenting with depressive symptoms', 'intermediate',
 ARRAY['basic_information', 'behavioral_patterns', 'cognitive_emotional_patterns', 'mental_health_history'], true),
('trauma_template', 'Trauma Recovery Patient', 'Patient working through trauma-related issues', 'advanced',
 ARRAY['basic_information', 'cognitive_emotional_patterns', 'mental_health_history', 'family_dynamics', 'trauma_history'], true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    complexity_level = EXCLUDED.complexity_level,
    enabled_modules = EXCLUDED.enabled_modules,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- Step 6: Clean up any existing patient_cases that might have invalid template_id references
UPDATE patient_cases SET template_id = NULL WHERE template_id IS NOT NULL AND template_id NOT IN (SELECT id FROM patient_templates);

-- Step 7: Add some indexes for performance
CREATE INDEX IF NOT EXISTS idx_patient_cases_status ON patient_cases(status);
CREATE INDEX IF NOT EXISTS idx_patient_cases_created_at ON patient_cases(created_at);
CREATE INDEX IF NOT EXISTS idx_patient_templates_active ON patient_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_module_definitions_enabled ON module_definitions(is_enabled);

-- Step 8: Create a view for easy patient case queries with template info
CREATE OR REPLACE VIEW patient_cases_with_templates AS
SELECT 
    pc.*,
    pt.name as template_name,
    pt.description as template_description,
    pt.complexity_level as template_complexity
FROM patient_cases pc
LEFT JOIN patient_templates pt ON pc.template_id = pt.id;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Modular patient architecture migration completed successfully!';
    RAISE NOTICE 'Tables created: module_definitions, patient_templates, patient_cases, module_settings';
    RAISE NOTICE 'Default modules and templates inserted';
    RAISE NOTICE 'Ready for full modular operation';
END $$;
