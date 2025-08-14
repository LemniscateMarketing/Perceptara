-- Psychology Simulation Platform - Modular Database Schema
-- This creates the new modular architecture

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing modular tables if they exist
DROP TABLE IF EXISTS public.patient_cases CASCADE;
DROP TABLE IF EXISTS public.patient_templates CASCADE;
DROP TABLE IF EXISTS public.module_definitions CASCADE;

-- Create enum types for the new schema
DROP TYPE IF EXISTS template_category CASCADE;
DROP TYPE IF EXISTS complexity_level CASCADE;
DROP TYPE IF EXISTS case_status CASCADE;
DROP TYPE IF EXISTS module_category CASCADE;

CREATE TYPE template_category AS ENUM ('anxiety', 'depression', 'trauma', 'relationships', 'addiction', 'custom');
CREATE TYPE complexity_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE case_status AS ENUM ('draft', 'active', 'archived');
CREATE TYPE module_category AS ENUM ('demographics', 'clinical', 'behavioral', 'assessment', 'custom');

-- Module Definitions Table
-- This stores the structure/blueprint of each module
CREATE TABLE public.module_definitions (
    id TEXT PRIMARY KEY, -- "basic_information", "attachment_styles"
    name TEXT NOT NULL,
    description TEXT,
    version TEXT DEFAULT '1.0.0',
    category module_category DEFAULT 'custom',
    field_definitions JSONB NOT NULL, -- Array of field configurations
    is_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Patient Templates Table
-- This combines multiple modules into a patient template
CREATE TABLE public.patient_templates (
    id TEXT PRIMARY KEY, -- "anxiety_relationship_template"
    name TEXT NOT NULL,
    description TEXT,
    category template_category DEFAULT 'custom',
    complexity_level complexity_level DEFAULT 'beginner',
    enabled_modules TEXT[] NOT NULL, -- ["basic_information", "attachment_styles"]
    module_order TEXT[], -- Order to display modules in UI
    template_settings JSONB DEFAULT '{}', -- Additional template configuration
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Patient Cases Table
-- This stores actual patient instances created from templates
CREATE TABLE public.patient_cases (
    id TEXT PRIMARY KEY, -- "CASE-2024-001"
    template_id TEXT REFERENCES public.patient_templates(id),
    case_name TEXT NOT NULL,
    case_summary TEXT,
    status case_status DEFAULT 'draft',
    field_data JSONB NOT NULL DEFAULT '{}', -- All actual patient data from all modules
    created_by UUID REFERENCES public.users(id),
    last_modified_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_count INTEGER DEFAULT 0,
    last_session_date TIMESTAMP WITH TIME ZONE
);

-- Insert the Basic Information module definition
INSERT INTO public.module_definitions (id, name, description, category, field_definitions) VALUES (
    'basic_information',
    'Basic Information',
    'Essential demographic and contact information for patient profiles',
    'demographics',
    '{
        "fields": [
            {
                "id": "case_id",
                "name": "Case ID",
                "description": "Unique identifier for this patient case",
                "type": "text",
                "required": true,
                "evolvable": false,
                "variable": "{{case.id}}",
                "sampleData": "CASE-2024-001",
                "placeholder": "Auto-generated unique ID",
                "clinicalPurpose": "System identification and case management"
            },
            {
                "id": "case_name",
                "name": "Case Name",
                "description": "A short, descriptive name for the patient case",
                "type": "text",
                "required": true,
                "evolvable": false,
                "variable": "{{case.name}}",
                "sampleData": "Young Adult with Anxiety and Relationship Issues",
                "placeholder": "A short, descriptive name for the patient case",
                "clinicalPurpose": "Quick identification and categorization of the case"
            },
            {
                "id": "case_summary",
                "name": "Case Summary",
                "description": "A summary of the patient background, presenting issues, and history",
                "type": "textarea",
                "required": true,
                "evolvable": false,
                "variable": "{{case.summary}}",
                "sampleData": "25-year-old female presenting with generalized anxiety, relationship difficulties, and work-related stress. History of mild depression in college. Seeking therapy to develop coping strategies and improve interpersonal relationships.",
                "placeholder": "A summary of the patient background, presenting issues, and history",
                "clinicalPurpose": "Provides context and overview for therapeutic planning"
            },
            {
                "id": "preferred_name",
                "name": "Preferred Name",
                "description": "Name the patient prefers to be called",
                "type": "text",
                "required": true,
                "evolvable": true,
                "variable": "{{patient.preferred_name}}",
                "sampleData": "Sarah",
                "placeholder": "Enter preferred name...",
                "clinicalPurpose": "Builds rapport and respects patient identity preferences"
            },
            {
                "id": "biological_sex",
                "name": "Biological Sex",
                "description": "Biological sex assigned at birth",
                "type": "select",
                "required": true,
                "evolvable": false,
                "variable": "{{patient.biological_sex}}",
                "sampleData": "female",
                "options": ["male", "female", "intersex", "prefer_not_to_say"],
                "clinicalPurpose": "Important for medical considerations and psychological assessments"
            },
            {
                "id": "gender_identity",
                "name": "Gender Identity",
                "description": "How the patient identifies their gender",
                "type": "select",
                "required": false,
                "evolvable": true,
                "variable": "{{patient.gender_identity}}",
                "sampleData": "woman",
                "options": ["man", "woman", "non_binary", "genderfluid", "questioning", "other", "prefer_not_to_say"],
                "clinicalPurpose": "Understanding gender identity helps with appropriate therapeutic approaches"
            },
            {
                "id": "date_of_birth",
                "name": "Date of Birth",
                "description": "Patient birth date",
                "type": "date",
                "required": true,
                "evolvable": false,
                "variable": "{{patient.age}}",
                "sampleData": "1995-03-15",
                "clinicalPurpose": "Determines age-appropriate interventions and developmental considerations"
            },
            {
                "id": "cultural_background",
                "name": "Cultural Background",
                "description": "Patient cultural, ethnic, and religious background",
                "type": "textarea",
                "required": false,
                "evolvable": true,
                "variable": "{{patient.cultural_background}}",
                "sampleData": "Hispanic/Latino heritage, Catholic upbringing, bilingual (English/Spanish), strong family values",
                "placeholder": "Describe cultural background, ethnicity, religion, languages...",
                "clinicalPurpose": "Cultural context helps tailor therapeutic approaches"
            },
            {
                "id": "children",
                "name": "Children",
                "description": "Information about patient children",
                "type": "list",
                "required": false,
                "evolvable": true,
                "variable": "{{patient.children}}",
                "sampleData": [
                    {
                        "name": "Leo",
                        "age": 5,
                        "description": "Lives with co-parent"
                    },
                    {
                        "name": "Emma",
                        "age": 8,
                        "description": "Lives primarily with patient"
                    }
                ],
                "clinicalPurpose": "Parental responsibilities affect stress levels, time management, and therapeutic goals"
            },
            {
                "id": "emergency_contacts",
                "name": "Emergency Contacts",
                "description": "People to contact in case of emergency",
                "type": "list",
                "required": true,
                "evolvable": true,
                "variable": "{{patient.emergency_contacts}}",
                "sampleData": [
                    {
                        "name": "Maria Rodriguez",
                        "relationship": "mother",
                        "phone": "+1-555-0123"
                    },
                    {
                        "name": "Jake Thompson",
                        "relationship": "best friend",
                        "phone": "+1-555-0456"
                    }
                ],
                "clinicalPurpose": "Crisis intervention planning and support network assessment"
            }
        ]
    }'::jsonb
);

-- Create a sample patient template that uses the basic information module
INSERT INTO public.patient_templates (id, name, description, category, complexity_level, enabled_modules, module_order, template_settings) VALUES (
    'anxiety_basic_template',
    'Basic Anxiety Patient',
    'A simple patient template for anxiety cases using only basic information',
    'anxiety',
    'beginner',
    ARRAY['basic_information'],
    ARRAY['basic_information'],
    '{
        "default_avatar": "/young-professional-woman.png",
        "suggested_modalities": ["CBT", "Person-Centered"],
        "estimated_session_count": 8,
        "therapeutic_goals": ["reduce anxiety", "build coping skills", "improve self-confidence"]
    }'::jsonb
);

-- Create a sample patient case from the template
INSERT INTO public.patient_cases (id, template_id, case_name, case_summary, field_data, created_by) VALUES (
    'CASE-2024-001',
    'anxiety_basic_template',
    'Sarah - Anxiety and Self-Doubt',
    'Young professional struggling with imposter syndrome and workplace anxiety',
    '{
        "case_id": "CASE-2024-001",
        "case_name": "Sarah - Anxiety and Self-Doubt",
        "case_summary": "25-year-old marketing professional with recent promotion experiencing imposter syndrome and generalized anxiety about work performance.",
        "preferred_name": "Sarah",
        "biological_sex": "female",
        "gender_identity": "woman",
        "date_of_birth": "1999-03-15",
        "cultural_background": "Hispanic/Latino heritage, Catholic upbringing, bilingual (English/Spanish)",
        "children": [],
        "emergency_contacts": [
            {
                "name": "Maria Rodriguez",
                "relationship": "mother",
                "phone": "+1-555-0123"
            }
        ]
    }'::jsonb,
    (SELECT id FROM public.users LIMIT 1)
);

-- Create indexes for performance
CREATE INDEX idx_module_definitions_category ON public.module_definitions(category);
CREATE INDEX idx_module_definitions_enabled ON public.module_definitions(is_enabled);
CREATE INDEX idx_patient_templates_category ON public.patient_templates(category);
CREATE INDEX idx_patient_templates_complexity ON public.patient_templates(complexity_level);
CREATE INDEX idx_patient_templates_active ON public.patient_templates(is_active);
CREATE INDEX idx_patient_cases_template ON public.patient_cases(template_id);
CREATE INDEX idx_patient_cases_status ON public.patient_cases(status);
CREATE INDEX idx_patient_cases_created_by ON public.patient_cases(created_by);

-- Enable Row Level Security
ALTER TABLE public.module_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_cases ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for demo
CREATE POLICY "Allow all operations on module_definitions" ON public.module_definitions FOR ALL USING (true);
CREATE POLICY "Allow all operations on patient_templates" ON public.patient_templates FOR ALL USING (true);
CREATE POLICY "Allow all operations on patient_cases" ON public.patient_cases FOR ALL USING (true);

-- Success message
SELECT 'Modular database schema created successfully! 
- 1 module definition (basic_information)
- 1 patient template (anxiety_basic_template) 
- 1 sample patient case (CASE-2024-001)' as message;
