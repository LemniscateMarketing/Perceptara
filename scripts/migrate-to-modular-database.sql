-- Migration Script: Convert to Modular Patient Architecture
-- This script will:
-- 1. Create new modular tables
-- 2. Migrate existing data if any
-- 3. Drop old patient table
-- 4. Set up sample modules

BEGIN;

-- Drop existing tables if they exist (clean slate)
DROP TABLE IF EXISTS patient_cases CASCADE;
DROP TABLE IF EXISTS patient_templates CASCADE;
DROP TABLE IF EXISTS module_definitions CASCADE;
DROP TABLE IF EXISTS patients CASCADE; -- Remove old table

-- Create Module Definitions Table (Building Blocks)
CREATE TABLE module_definitions (
  id TEXT PRIMARY KEY, -- "basic_information", "attachment_styles"
  name TEXT NOT NULL,
  description TEXT,
  version TEXT DEFAULT '1.0.0',
  category TEXT CHECK (category IN ('demographics', 'clinical', 'behavioral', 'assessment', 'custom')),
  field_definitions JSONB NOT NULL, -- Array of field objects
  is_enabled BOOLEAN DEFAULT true, -- Can turn modules ON/OFF
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Patient Templates Table (Module Combinations)
CREATE TABLE patient_templates (
  id TEXT PRIMARY KEY, -- "anxiety_relationship_template"
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  complexity_level TEXT CHECK (complexity_level IN ('beginner', 'intermediate', 'advanced')),
  enabled_modules TEXT[] NOT NULL, -- Array of module_ids that are enabled
  module_order TEXT[], -- Order to display modules in template
  template_settings JSONB DEFAULT '{}', -- Additional settings
  is_active BOOLEAN DEFAULT true,
  created_by TEXT DEFAULT 'system', -- Will be UUID later
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Patient Cases Table (Actual Instances)
CREATE TABLE patient_cases (
  id TEXT PRIMARY KEY, -- "CASE-2024-001"
  template_id TEXT REFERENCES patient_templates(id),
  case_name TEXT NOT NULL,
  case_summary TEXT,
  status TEXT CHECK (status IN ('draft', 'active', 'archived')) DEFAULT 'draft',
  field_data JSONB NOT NULL DEFAULT '{}', -- All actual patient data from all modules
  created_by TEXT DEFAULT 'system', -- Will be UUID later
  last_modified_by TEXT DEFAULT 'system',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_count INTEGER DEFAULT 0,
  last_session_date TIMESTAMP WITH TIME ZONE
);

-- Create indexes for performance
CREATE INDEX idx_module_definitions_enabled ON module_definitions(is_enabled);
CREATE INDEX idx_module_definitions_category ON module_definitions(category);
CREATE INDEX idx_patient_templates_active ON patient_templates(is_active);
CREATE INDEX idx_patient_templates_complexity ON patient_templates(complexity_level);
CREATE INDEX idx_patient_cases_template ON patient_cases(template_id);
CREATE INDEX idx_patient_cases_status ON patient_cases(status);
CREATE INDEX idx_patient_cases_created_by ON patient_cases(created_by);

-- Insert Basic Information Module (our existing one)
INSERT INTO module_definitions (id, name, description, category, field_definitions, is_enabled, display_order) VALUES (
  'basic_information',
  'Basic Information',
  'Essential demographic and contact information for every patient',
  'demographics',
  '[
    {
      "id": "case_id",
      "name": "Case ID",
      "description": "Unique identifier for this patient case",
      "type": "text",
      "required": true,
      "evolvable": false,
      "variable": "{{case.id}}",
      "sampleData": "CASE-2024-001",
      "clinicalPurpose": "System identification and case management",
      "placeholder": "Auto-generated"
    },
    {
      "id": "full_name",
      "name": "Full Name",
      "description": "Patient complete name",
      "type": "text",
      "required": true,
      "evolvable": false,
      "variable": "{{patient.name}}",
      "sampleData": "Sarah Chen",
      "clinicalPurpose": "Patient identification and rapport building",
      "placeholder": "Enter patient full name"
    },
    {
      "id": "age",
      "name": "Age",
      "description": "Patient current age in years",
      "type": "number",
      "required": true,
      "evolvable": true,
      "variable": "{{patient.age}}",
      "sampleData": 25,
      "clinicalPurpose": "Developmental context and age-appropriate interventions",
      "validation": {"min": 1, "max": 120}
    },
    {
      "id": "gender",
      "name": "Gender Identity",
      "description": "How the patient identifies their gender",
      "type": "select",
      "required": false,
      "evolvable": true,
      "variable": "{{patient.gender}}",
      "options": ["Female", "Male", "Non-binary", "Prefer not to say", "Other"],
      "sampleData": "Female",
      "clinicalPurpose": "Cultural sensitivity and identity-affirming care"
    },
    {
      "id": "occupation",
      "name": "Occupation",
      "description": "Patient current job or profession",
      "type": "text",
      "required": false,
      "evolvable": true,
      "variable": "{{patient.occupation}}",
      "sampleData": "Graduate Student",
      "clinicalPurpose": "Understanding daily stressors and life context",
      "placeholder": "e.g., Teacher, Engineer, Student"
    },
    {
      "id": "relationship_status",
      "name": "Relationship Status",
      "description": "Patient current relationship status",
      "type": "select",
      "required": false,
      "evolvable": true,
      "variable": "{{patient.relationship_status}}",
      "options": ["Single", "In a relationship", "Married", "Divorced", "Widowed", "Separated", "It is complicated"],
      "sampleData": "In a relationship",
      "clinicalPurpose": "Social support system and relationship dynamics"
    },
    {
      "id": "children",
      "name": "Children",
      "description": "Information about patient children",
      "type": "list",
      "required": false,
      "evolvable": true,
      "variable": "{{patient.children}}",
      "sampleData": [],
      "clinicalPurpose": "Family dynamics and parenting stress factors",
      "placeholder": "Add child information"
    },
    {
      "id": "presenting_concern",
      "name": "Presenting Concern",
      "description": "Main reason patient is seeking therapy",
      "type": "textarea",
      "required": true,
      "evolvable": true,
      "variable": "{{patient.presenting_concern}}",
      "sampleData": "Experiencing anxiety in social situations and relationship difficulties",
      "clinicalPurpose": "Primary treatment focus and therapeutic goals",
      "placeholder": "Describe the main concerns bringing the patient to therapy"
    }
  ]'::jsonb,
  true,
  1
);

-- Insert Attachment Styles Module (placeholder for now)
INSERT INTO module_definitions (id, name, description, category, field_definitions, is_enabled, display_order) VALUES (
  'attachment_styles',
  'Attachment Styles',
  'Secure, anxious, avoidant, and disorganized attachment patterns',
  'psychological',
  '[
    {
      "id": "primary_attachment",
      "name": "Primary Attachment Style",
      "description": "Dominant attachment pattern in relationships",
      "type": "select",
      "required": true,
      "evolvable": true,
      "variable": "{{patient.attachment.primary}}",
      "options": ["Secure", "Anxious-Preoccupied", "Dismissive-Avoidant", "Fearful-Avoidant"],
      "sampleData": "Anxious-Preoccupied",
      "clinicalPurpose": "Understanding relationship patterns and therapeutic approach"
    },
    {
      "id": "attachment_behaviors",
      "name": "Attachment Behaviors",
      "description": "Observable behaviors related to attachment",
      "type": "multiselect",
      "required": false,
      "evolvable": true,
      "variable": "{{patient.attachment.behaviors}}",
      "options": ["Seeks reassurance", "Avoids intimacy", "Fear of abandonment", "Difficulty trusting", "Clingy behavior", "Emotional distance"],
      "sampleData": ["Seeks reassurance", "Fear of abandonment"],
      "clinicalPurpose": "Behavioral targets for therapeutic intervention"
    }
  ]'::jsonb,
  true,
  2
);

-- Insert Memory & Trauma Module (placeholder for now)
INSERT INTO module_definitions (id, name, description, category, field_definitions, is_enabled, display_order) VALUES (
  'memory_trauma',
  'Memory & Trauma',
  'Trauma history, memory processing, and PTSD-related symptoms',
  'clinical',
  '[
    {
      "id": "trauma_history",
      "name": "Trauma History",
      "description": "Significant traumatic experiences",
      "type": "textarea",
      "required": false,
      "evolvable": true,
      "variable": "{{patient.trauma.history}}",
      "sampleData": "Combat exposure during military service",
      "clinicalPurpose": "Understanding trauma impact and treatment planning",
      "placeholder": "Describe significant traumatic experiences"
    },
    {
      "id": "ptsd_symptoms",
      "name": "PTSD Symptoms",
      "description": "Current trauma-related symptoms",
      "type": "multiselect",
      "required": false,
      "evolvable": true,
      "variable": "{{patient.trauma.symptoms}}",
      "options": ["Flashbacks", "Nightmares", "Hypervigilance", "Avoidance", "Emotional numbing", "Intrusive thoughts"],
      "sampleData": ["Flashbacks", "Hypervigilance", "Intrusive thoughts"],
      "clinicalPurpose": "Symptom tracking and treatment monitoring"
    }
  ]'::jsonb,
  false, -- Disabled by default
  3
);

-- Insert Sample Templates
INSERT INTO patient_templates (id, name, description, category, complexity_level, enabled_modules, module_order) VALUES (
  'general_anxiety_template',
  'General Anxiety Patient',
  'Standard anxiety presentation with relationship concerns',
  'anxiety',
  'intermediate',
  ARRAY['basic_information', 'attachment_styles'],
  ARRAY['basic_information', 'attachment_styles']
);

INSERT INTO patient_templates (id, name, description, category, complexity_level, enabled_modules, module_order) VALUES (
  'trauma_recovery_template',
  'Trauma Recovery Patient',
  'Complex trauma with memory processing difficulties',
  'trauma',
  'advanced',
  ARRAY['basic_information', 'attachment_styles', 'memory_trauma'],
  ARRAY['basic_information', 'attachment_styles', 'memory_trauma']
);

-- Insert Sample Cases
INSERT INTO patient_cases (id, template_id, case_name, case_summary, status, field_data) VALUES (
  'CASE-2024-001',
  'general_anxiety_template',
  'Sarah Chen - Anxiety & Relationships',
  '25-year-old graduate student experiencing relationship anxiety and social concerns',
  'active',
  '{
    "case_id": "CASE-2024-001",
    "full_name": "Sarah Chen",
    "age": 25,
    "gender": "Female",
    "occupation": "Graduate Student",
    "relationship_status": "In a relationship",
    "children": [],
    "presenting_concern": "Experiencing anxiety in social situations and relationship difficulties with partner",
    "primary_attachment": "Anxious-Preoccupied",
    "attachment_behaviors": ["Seeks reassurance", "Fear of abandonment"]
  }'::jsonb
);

INSERT INTO patient_cases (id, template_id, case_name, case_summary, status, field_data) VALUES (
  'CASE-2024-002',
  'trauma_recovery_template',
  'Michael Rodriguez - Trauma Recovery',
  '32-year-old veteran dealing with PTSD and memory processing difficulties',
  'draft',
  '{
    "case_id": "CASE-2024-002",
    "full_name": "Michael Rodriguez",
    "age": 32,
    "gender": "Male",
    "occupation": "Veteran",
    "relationship_status": "Married",
    "children": [{"name": "Sofia", "age": 8}, {"name": "Diego", "age": 5}],
    "presenting_concern": "PTSD symptoms following combat exposure, difficulty with memory processing",
    "primary_attachment": "Dismissive-Avoidant",
    "attachment_behaviors": ["Avoids intimacy", "Emotional distance"],
    "trauma_history": "Combat exposure during military service in Afghanistan",
    "ptsd_symptoms": ["Flashbacks", "Hypervigilance", "Intrusive thoughts"]
  }'::jsonb
);

COMMIT;

-- Verify the migration
SELECT 'Module Definitions' as table_name, count(*) as count FROM module_definitions
UNION ALL
SELECT 'Patient Templates' as table_name, count(*) as count FROM patient_templates
UNION ALL
SELECT 'Patient Cases' as table_name, count(*) as count FROM patient_cases;
