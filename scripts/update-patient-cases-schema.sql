-- Update patient_cases table schema to handle template references properly

-- Make template_id nullable (it should be optional)
ALTER TABLE patient_cases 
ALTER COLUMN template_id DROP NOT NULL;

-- Add a check constraint to ensure template_id references valid templates when set
ALTER TABLE patient_cases 
DROP CONSTRAINT IF EXISTS patient_cases_template_id_fkey;

-- Re-add the foreign key constraint but make it deferrable
ALTER TABLE patient_cases 
ADD CONSTRAINT patient_cases_template_id_fkey 
FOREIGN KEY (template_id) 
REFERENCES patient_templates(id) 
ON DELETE SET NULL
DEFERRABLE INITIALLY DEFERRED;

-- Clean up any invalid template_id references
UPDATE patient_cases 
SET template_id = NULL 
WHERE template_id IS NOT NULL 
AND template_id NOT IN (SELECT id FROM patient_templates);

-- Add helpful indexes
CREATE INDEX IF NOT EXISTS idx_patient_cases_template_id ON patient_cases(template_id) WHERE template_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_patient_cases_status ON patient_cases(status);
CREATE INDEX IF NOT EXISTS idx_patient_cases_created_at ON patient_cases(created_at DESC);

-- Verify the schema
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'patient_cases' 
AND column_name IN ('id', 'template_id', 'case_name', 'status')
ORDER BY ordinal_position;
