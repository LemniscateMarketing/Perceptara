-- Create module_settings table for dynamic enable/disable functionality
CREATE TABLE IF NOT EXISTS module_settings (
  id SERIAL PRIMARY KEY,
  module_id TEXT UNIQUE NOT NULL,
  enabled BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by TEXT
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_module_settings_module_id ON module_settings(module_id);
CREATE INDEX IF NOT EXISTS idx_module_settings_enabled ON module_settings(enabled);
CREATE INDEX IF NOT EXISTS idx_module_settings_display_order ON module_settings(display_order);

-- Insert default settings for all core modules
INSERT INTO module_settings (module_id, enabled, display_order) VALUES
  ('basic_information', true, 1),
  ('behavioral_patterns', true, 2),
  ('cognitive_emotional_patterns', true, 3),
  ('work_career', true, 4),
  ('mental_health_history', true, 5),
  ('family_dynamics', true, 6),
  ('trauma_history', true, 7)
ON CONFLICT (module_id) DO NOTHING;
