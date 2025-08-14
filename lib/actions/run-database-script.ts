"use server"

import { createServerSupabaseClient } from "@/lib/supabase"

export async function runDatabaseScript(scriptContent: string): Promise<{
  success: boolean
  message: string
  results?: any[]
}> {
  const supabase = createServerSupabaseClient()

  try {
    console.log("🚀 Running database script...")

    // Split the script into individual statements
    const statements = scriptContent
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0 && !stmt.startsWith("--"))

    const results: any[] = []

    for (const statement of statements) {
      if (statement.toLowerCase().includes("select")) {
        // For SELECT statements, capture the results
        const { data, error } = await supabase.rpc("exec_sql", { sql_query: statement })
        if (error) {
          console.error("❌ Error executing SELECT:", error)
          return {
            success: false,
            message: `Error executing SELECT: ${error.message}`,
          }
        }
        results.push({ statement, data })
      } else {
        // For other statements (CREATE, INSERT, etc.), just execute
        const { error } = await supabase.rpc("exec_sql", { sql_query: statement })
        if (error) {
          console.error("❌ Error executing statement:", error)
          return {
            success: false,
            message: `Error executing statement: ${error.message}`,
          }
        }
        results.push({ statement, success: true })
      }
    }

    console.log("✅ Database script executed successfully")
    return {
      success: true,
      message: "Database script executed successfully",
      results,
    }
  } catch (error) {
    console.error("❌ Error running database script:", error)
    return {
      success: false,
      message: `Error: ${error.message}`,
    }
  }
}

// Alternative approach using direct SQL execution
export async function runSimpleDatabaseSetup(): Promise<{
  success: boolean
  message: string
  results?: any[]
}> {
  const supabase = createServerSupabaseClient()

  try {
    console.log("🚀 Running simple database setup...")

    // Step 1: Drop existing tables
    console.log("1. Dropping existing tables...")
    await supabase.rpc("exec_sql", {
      sql_query: "DROP TABLE IF EXISTS patient_cases CASCADE",
    })
    await supabase.rpc("exec_sql", {
      sql_query: "DROP TABLE IF EXISTS module_settings CASCADE",
    })

    // Step 2: Create patient_cases table
    console.log("2. Creating patient_cases table...")
    const { error: createError } = await supabase.rpc("exec_sql", {
      sql_query: `
        CREATE TABLE patient_cases (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          case_name TEXT NOT NULL,
          case_summary TEXT,
          field_data JSONB NOT NULL DEFAULT '{}',
          status TEXT DEFAULT 'active',
          session_count INTEGER DEFAULT 0,
          last_session_date TIMESTAMP,
          notes TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `,
    })

    if (createError) {
      throw new Error(`Failed to create patient_cases table: ${createError.message}`)
    }

    // Step 3: Create module_settings table
    console.log("3. Creating module_settings table...")
    const { error: moduleError } = await supabase.rpc("exec_sql", {
      sql_query: `
        CREATE TABLE module_settings (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          module_id TEXT NOT NULL UNIQUE,
          enabled BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `,
    })

    if (moduleError) {
      throw new Error(`Failed to create module_settings table: ${moduleError.message}`)
    }

    // Step 4: Insert default modules
    console.log("4. Inserting default modules...")
    const modules = [
      "basic_information",
      "behavioral_patterns",
      "cognitive_emotional_patterns",
      "work_career",
      "mental_health_history",
      "family_dynamics",
      "trauma_history",
    ]

    for (const moduleId of modules) {
      await supabase.from("module_settings").insert({
        module_id: moduleId,
        enabled: true,
      })
    }

    // Step 5: Create test case
    console.log("5. Creating test case...")
    const { data: testCase, error: testError } = await supabase
      .from("patient_cases")
      .insert({
        case_name: "Test Patient - John Doe (30)",
        case_summary: "Test case for system verification",
        field_data: {
          full_name: "John Doe",
          age: 30,
          gender: "male",
          created_via: "database_setup",
        },
      })
      .select()
      .single()

    if (testError) {
      throw new Error(`Failed to create test case: ${testError.message}`)
    }

    // Step 6: Verify everything worked
    console.log("6. Verifying setup...")
    const { data: cases, error: verifyError } = await supabase.from("patient_cases").select("*")

    if (verifyError) {
      throw new Error(`Failed to verify setup: ${verifyError.message}`)
    }

    console.log("✅ Database setup completed successfully")
    return {
      success: true,
      message: `Database setup completed successfully. Created ${cases?.length || 0} test cases.`,
      results: cases,
    }
  } catch (error) {
    console.error("❌ Error in database setup:", error)
    return {
      success: false,
      message: `Setup failed: ${error.message}`,
    }
  }
}
