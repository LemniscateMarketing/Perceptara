// Simple Node.js script to set up module settings table
// Run this with: node scripts/setup-module-settings.js

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupModuleSettings() {
  console.log("Setting up module_settings table...")

  // Create the table if it doesn't exist
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS module_settings (
      id SERIAL PRIMARY KEY,
      module_id TEXT UNIQUE NOT NULL,
      enabled BOOLEAN DEFAULT true,
      display_order INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_by TEXT
    );
  `

  try {
    const { error: createError } = await supabase.rpc("exec_sql", { sql: createTableSQL })
    if (createError) {
      console.log("Table might already exist, continuing...")
    } else {
      console.log("✅ Table created successfully")
    }
  } catch (error) {
    console.log("Table creation skipped (might already exist)")
  }

  // Create indexes
  const indexSQL = `
    CREATE INDEX IF NOT EXISTS idx_module_settings_module_id ON module_settings(module_id);
    CREATE INDEX IF NOT EXISTS idx_module_settings_enabled ON module_settings(enabled);
    CREATE INDEX IF NOT EXISTS idx_module_settings_display_order ON module_settings(display_order);
  `

  try {
    const { error: indexError } = await supabase.rpc("exec_sql", { sql: indexSQL })
    if (indexError) {
      console.log("Indexes might already exist, continuing...")
    } else {
      console.log("✅ Indexes created successfully")
    }
  } catch (error) {
    console.log("Index creation skipped (might already exist)")
  }

  // Insert default settings
  const defaultModules = [
    { module_id: "basic_information", enabled: true, display_order: 1 },
    { module_id: "behavioral_patterns", enabled: true, display_order: 2 },
    { module_id: "cognitive_emotional_patterns", enabled: true, display_order: 3 },
    { module_id: "work_career", enabled: true, display_order: 4 },
    { module_id: "mental_health_history", enabled: true, display_order: 5 },
    { module_id: "family_dynamics", enabled: true, display_order: 6 },
    { module_id: "trauma_history", enabled: true, display_order: 7 },
  ]

  for (const module of defaultModules) {
    try {
      const { error } = await supabase.from("module_settings").upsert(module, { onConflict: "module_id" })

      if (error) {
        console.error(`Error inserting ${module.module_id}:`, error)
      } else {
        console.log(`✅ Module ${module.module_id} configured`)
      }
    } catch (error) {
      console.error(`Error with ${module.module_id}:`, error)
    }
  }

  console.log("✅ Module settings setup complete!")
}

setupModuleSettings().catch(console.error)
