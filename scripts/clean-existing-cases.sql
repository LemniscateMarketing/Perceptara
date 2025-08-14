-- Clean up existing patient cases to start fresh
-- This script removes all existing cases from the database

-- Delete all existing patient cases
DELETE FROM patient_cases;

-- Reset any sequences if needed (PostgreSQL specific)
-- This ensures new cases start with fresh IDs
ALTER SEQUENCE IF EXISTS patient_cases_id_seq RESTART WITH 1;

-- Verify cleanup
SELECT COUNT(*) as remaining_cases FROM patient_cases;

-- Expected result: 0 remaining cases
