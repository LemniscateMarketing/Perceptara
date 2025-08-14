-- Fix the patient_cases table to make template_id nullable and add predefined templates

-- First, make template_id nullable in patient_cases table
ALTER TABLE patient_cases 
ALTER COLUMN template_id DROP NOT NULL;

-- Insert predefined patient templates that match our form templates
INSERT INTO patient_templates (id, name, description, modules, created_at, updated_at) VALUES
(
  'anxiety_student_template',
  'Anxious Graduate Student Template',
  'Template for young adults struggling with academic pressure and social anxiety',
  ARRAY['basic_information', 'behavioral_patterns', 'cognitive_emotional_patterns', 'mental_health_history'],
  NOW(),
  NOW()
),
(
  'depression_professional_template', 
  'Depressed Professional Template',
  'Template for mid-career professionals experiencing burnout and depression',
  ARRAY['basic_information', 'behavioral_patterns', 'cognitive_emotional_patterns', 'work_career', 'mental_health_history'],
  NOW(),
  NOW()
),
(
  'trauma_survivor_template',
  'Trauma Survivor Template', 
  'Template for adult survivors of childhood trauma seeking healing',
  ARRAY['basic_information', 'behavioral_patterns', 'cognitive_emotional_patterns', 'mental_health_history', 'family_dynamics', 'trauma_history'],
  NOW(),
  NOW()
),
(
  'relationship_issues_template',
  'Relationship Difficulties Template',
  'Template for individuals struggling with romantic and family relationships', 
  ARRAY['basic_information', 'behavioral_patterns', 'cognitive_emotional_patterns', 'family_dynamics'],
  NOW(),
  NOW()
),
(
  'addiction_recovery_template',
  'Addiction Recovery Template',
  'Template for persons in early recovery from substance use disorder',
  ARRAY['basic_information', 'behavioral_patterns', 'cognitive_emotional_patterns', 'mental_health_history', 'trauma_history'],
  NOW(),
  NOW()
),
(
  'grief_loss_template',
  'Grief and Loss Template',
  'Template for individuals processing significant loss or bereavement',
  ARRAY['basic_information', 'behavioral_patterns', 'cognitive_emotional_patterns', 'mental_health_history', 'family_dynamics'],
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Update any existing patient_cases that have invalid template_id references
UPDATE patient_cases 
SET template_id = NULL 
WHERE template_id IS NOT NULL 
AND template_id NOT IN (SELECT id FROM patient_templates);

-- Add an index for better performance
CREATE INDEX IF NOT EXISTS idx_patient_cases_template_id ON patient_cases(template_id);
CREATE INDEX IF NOT EXISTS idx_patient_cases_status ON patient_cases(status);
CREATE INDEX IF NOT EXISTS idx_patient_cases_created_at ON patient_cases(created_at);
