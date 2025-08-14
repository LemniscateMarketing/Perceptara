-- Populate Modular Database with Sample Data (Fixed UUID Issues)
-- Run this AFTER the structure fix script

BEGIN;

-- Insert Module Definitions
INSERT INTO module_definitions (
    id, 
    name, 
    description, 
    version, 
    category, 
    field_definitions, 
    is_enabled, 
    display_order,
    created_at,
    updated_at
) VALUES 
(
    'basic_information',
    'Basic Information',
    'Essential demographic and contact information for every patient',
    '1.0.0',
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
    1,
    NOW(),
    NOW()
),
(
    'attachment_styles',
    'Attachment Styles',
    'Secure, anxious, avoidant, and disorganized attachment patterns',
    '1.0.0',
    'clinical',
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
    2,
    NOW(),
    NOW()
),
(
    'memory_trauma',
    'Memory & Trauma',
    'Trauma history, memory processing, and PTSD-related symptoms',
    '1.0.0',
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
    false,
    3,
    NOW(),
    NOW()
);

-- Insert Patient Templates
INSERT INTO patient_templates (
    id,
    name,
    description,
    category,
    complexity_level,
    enabled_modules,
    module_order,
    template_settings,
    is_active,
    created_by,
    created_at,
    updated_at
) VALUES 
(
    'general_anxiety_template',
    'General Anxiety Patient',
    'Standard anxiety presentation with relationship concerns',
    'anxiety',
    'intermediate',
    ARRAY['basic_information', 'attachment_styles'],
    ARRAY['basic_information', 'attachment_styles'],
    '{"default_avatar": "young-professional-woman.png", "suggested_modalities": ["CBT", "DBT"], "estimated_session_count": 12, "therapeutic_goals": ["Reduce social anxiety", "Improve relationship communication"]}'::jsonb,
    true,
    NULL,
    NOW(),
    NOW()
),
(
    'trauma_recovery_template',
    'Trauma Recovery Patient',
    'Complex trauma with memory processing difficulties',
    'trauma',
    'advanced',
    ARRAY['basic_information', 'attachment_styles', 'memory_trauma'],
    ARRAY['basic_information', 'attachment_styles', 'memory_trauma'],
    '{"default_avatar": "professional-man.png", "suggested_modalities": ["EMDR", "CPT", "PE"], "estimated_session_count": 20, "therapeutic_goals": ["Process traumatic memories", "Reduce PTSD symptoms", "Improve emotional regulation"]}'::jsonb,
    true,
    NULL,
    NOW(),
    NOW()
);

-- Insert Sample Patient Cases
INSERT INTO patient_cases (
    id,
    template_id,
    case_name,
    case_summary,
    status,
    field_data,
    created_by,
    last_modified_by,
    created_at,
    updated_at,
    session_count,
    last_session_date
) VALUES 
(
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
    }'::jsonb,
    NULL,
    NULL,
    NOW(),
    NOW(),
    0,
    NULL
),
(
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
    }'::jsonb,
    NULL,
    NULL,
    NOW(),
    NOW(),
    0,
    NULL
);

COMMIT;

-- Verification queries
SELECT 'Module Definitions' as table_name, count(*) as count FROM module_definitions
UNION ALL
SELECT 'Patient Templates' as table_name, count(*) as count FROM patient_templates
UNION ALL
SELECT 'Patient Cases' as table_name, count(*) as count FROM patient_cases;

-- Show what was created
SELECT 'SUCCESS: Database populated with modular architecture!' as status;
