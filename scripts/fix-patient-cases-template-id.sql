-- Fix the patient_cases table to handle template_id properly

-- Make template_id nullable (should already be, but ensure it)
ALTER TABLE patient_cases 
ALTER COLUMN template_id DROP NOT NULL;

-- Drop the existing foreign key constraint if it exists
ALTER TABLE patient_cases 
DROP CONSTRAINT IF EXISTS patient_cases_template_id_fkey;

-- Clean up any invalid template_id references by setting them to NULL
UPDATE patient_cases 
SET template_id = NULL 
WHERE template_id IS NOT NULL;

-- Verify the changes
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'patient_cases' 
AND column_name = 'template_id';

-- Show current patient_cases structure
\d patient_cases;
