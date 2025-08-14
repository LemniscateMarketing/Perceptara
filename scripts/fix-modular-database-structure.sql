-- Fix Modular Database Structure
-- This script will ensure all required columns exist and add missing ones

BEGIN;

-- First, let's check and fix the module_definitions table structure
DO $$ 
BEGIN
    -- Add display_order column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'module_definitions' AND column_name = 'display_order'
    ) THEN
        ALTER TABLE module_definitions ADD COLUMN display_order INTEGER DEFAULT 0;
    END IF;

    -- Ensure all other columns exist with correct types
    -- Add any missing columns for module_definitions
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'module_definitions' AND column_name = 'version'
    ) THEN
        ALTER TABLE module_definitions ADD COLUMN version TEXT DEFAULT '1.0.0';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'module_definitions' AND column_name = 'is_enabled'
    ) THEN
        ALTER TABLE module_definitions ADD COLUMN is_enabled BOOLEAN DEFAULT true;
    END IF;
END $$;

-- Fix patient_templates table structure
DO $$ 
BEGIN
    -- Add template_settings column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'patient_templates' AND column_name = 'template_settings'
    ) THEN
        ALTER TABLE patient_templates ADD COLUMN template_settings JSONB DEFAULT '{}';
    END IF;

    -- Add module_order column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'patient_templates' AND column_name = 'module_order'
    ) THEN
        ALTER TABLE patient_templates ADD COLUMN module_order TEXT[];
    END IF;

    -- Add is_active column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'patient_templates' AND column_name = 'is_active'
    ) THEN
        ALTER TABLE patient_templates ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
END $$;

-- Fix patient_cases table structure
DO $$ 
BEGIN
    -- Add session_count column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'patient_cases' AND column_name = 'session_count'
    ) THEN
        ALTER TABLE patient_cases ADD COLUMN session_count INTEGER DEFAULT 0;
    END IF;

    -- Add last_session_date column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'patient_cases' AND column_name = 'last_session_date'
    ) THEN
        ALTER TABLE patient_cases ADD COLUMN last_session_date TIMESTAMP WITH TIME ZONE;
    END IF;

    -- Add last_modified_by column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'patient_cases' AND column_name = 'last_modified_by'
    ) THEN
        ALTER TABLE patient_cases ADD COLUMN last_modified_by TEXT DEFAULT 'system';
    END IF;
END $$;

-- Create indexes if they don't exist
DO $$ 
BEGIN
    -- Index for module_definitions
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_module_definitions_enabled') THEN
        CREATE INDEX idx_module_definitions_enabled ON module_definitions(is_enabled);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_module_definitions_category') THEN
        CREATE INDEX idx_module_definitions_category ON module_definitions(category);
    END IF;

    -- Index for patient_templates
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_patient_templates_active') THEN
        CREATE INDEX idx_patient_templates_active ON patient_templates(is_active);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_patient_templates_complexity') THEN
        CREATE INDEX idx_patient_templates_complexity ON patient_templates(complexity_level);
    END IF;

    -- Index for patient_cases
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_patient_cases_template') THEN
        CREATE INDEX idx_patient_cases_template ON patient_cases(template_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_patient_cases_status') THEN
        CREATE INDEX idx_patient_cases_status ON patient_cases(status);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_patient_cases_created_by') THEN
        CREATE INDEX idx_patient_cases_created_by ON patient_cases(created_by);
    END IF;
END $$;

-- Clean up any existing data to start fresh
DELETE FROM patient_cases;
DELETE FROM patient_templates;
DELETE FROM module_definitions;

-- Show final table structures
SELECT 
    'module_definitions' as table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'module_definitions'
ORDER BY ordinal_position;

COMMIT;

-- Verification query
SELECT 'Database structure updated successfully!' as status;
