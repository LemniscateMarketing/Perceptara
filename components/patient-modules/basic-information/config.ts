// components/patient-modules/basic-information/config.ts

import type { ModuleDefinition } from "./types"

export const BASIC_INFORMATION_MODULE: ModuleDefinition = {
  id: "basic-information",
  name: "Basic Information",
  description: "Essential demographic and contact information for every patient",
  category: "foundation",
  version: "1.0.0",
  fields: [
    {
      id: "full_name", // Changed from "name" to "full_name"
      name: "Full Name",
      type: "text",
      description: "Patient's complete legal name",
      required: true,
      evolvable: false,
      placeholder: "Enter patient's full name...",
      sampleData: "Sarah Michelle Johnson",
      variable: "{{patient_name}}",
      clinicalPurpose:
        "Essential for establishing therapeutic rapport and maintaining professional boundaries. Name usage reflects cultural sensitivity and patient preferences.",
    },
    {
      id: "age_and_birth",
      name: "Age & Date of Birth",
      type: "age_date",
      description: "Patient's current age and birth date with validation",
      required: true,
      evolvable: false,
      placeholder: "Enter age and select birth date...",
      sampleData: { age: 28, date_of_birth: "1995-03-15" },
      variable: "{{patient_age}} and {{patient_birth_date}}",
      clinicalPurpose:
        "Critical for developmental considerations, age-appropriate interventions, and understanding life stage challenges and transitions.",
    },
    {
      id: "gender",
      name: "Gender Identity",
      type: "select",
      description: "Patient's self-identified gender",
      required: false,
      evolvable: true,
      options: [
        "female",
        "male",
        "non_binary",
        "transgender_female",
        "transgender_male",
        "genderfluid",
        "prefer_not_to_say",
        "other",
      ],
      sampleData: "female",
      variable: "{{patient_gender}}",
      clinicalPurpose:
        "Important for understanding identity development, social pressures, and providing culturally competent care that respects patient's self-identification.",
    },
    {
      id: "occupation",
      name: "Occupation",
      type: "text",
      description: "Patient's current job or profession",
      required: false,
      evolvable: true,
      placeholder: "Enter current occupation...",
      sampleData: "Marketing Coordinator",
      variable: "{{patient_occupation}}",
      clinicalPurpose:
        "Reveals stress sources, identity factors, financial pressures, and social context. Work-related issues often contribute to mental health concerns.",
    },
    {
      id: "relationship_status",
      name: "Relationship Status",
      type: "select",
      description: "Patient's current relationship status",
      required: false,
      evolvable: true,
      options: ["single", "dating", "engaged", "married", "divorced", "separated", "widowed", "complicated"],
      sampleData: "married",
      variable: "{{patient_relationship_status}}",
      clinicalPurpose:
        "Affects support systems, stress levels, and therapeutic goals. Relationship dynamics often central to mental health and treatment planning.",
    },
    {
      id: "languages",
      name: "Languages Spoken",
      type: "list",
      description: "Languages the patient speaks fluently",
      required: false,
      evolvable: false,
      sampleData: ["English", "Spanish"],
      variable: "{{patient_languages}}",
      clinicalPurpose:
        "Essential for communication effectiveness, cultural understanding, and identifying potential barriers to treatment or expression.",
    },
    {
      id: "ethnicity",
      name: "Ethnicity/Cultural Background",
      type: "list",
      description: "Patient's ethnic and cultural identities",
      required: false,
      evolvable: false,
      sampleData: [{ value: "Hispanic/Latino" }, { value: "Irish-American" }],
      variable: "{{patient_ethnicity}}",
      clinicalPurpose:
        "Crucial for culturally responsive therapy, understanding family dynamics, values, and potential discrimination experiences affecting mental health.",
    },
    {
      id: "emergency_contacts",
      name: "Emergency Contacts",
      type: "list",
      description: "People to contact in case of emergency",
      required: false,
      evolvable: true,
      sampleData: [
        { name: "Michael Johnson", relationship: "Spouse", phone: "(555) 123-4567" },
        { name: "Patricia Martinez", relationship: "Mother", phone: "(555) 987-6543" },
      ],
      variable: "{{patient_emergency_contacts}}",
      clinicalPurpose:
        "Identifies support network and safety resources. Critical for crisis intervention planning and understanding patient's social connections.",
    },
    {
      id: "children",
      name: "Children",
      type: "list",
      description: "Information about patient's children",
      required: false,
      evolvable: true,
      sampleData: [
        { name: "Emma Johnson", age: "5", description: "Kindergarten student, very energetic" },
        { name: "Lucas Johnson", age: "3", description: "Toddler, loves books and puzzles" },
      ],
      variable: "{{patient_children}}",
      clinicalPurpose:
        "Parenting stress, family dynamics, and child-related concerns often central to treatment. Affects scheduling, goals, and intervention strategies.",
    },
    {
      id: "personal_values",
      name: "Personal Values",
      type: "list",
      description: "Core values and beliefs important to the patient",
      required: false,
      evolvable: true,
      sampleData: [
        { value: "Family comes first" },
        { value: "Hard work and dedication" },
        { value: "Helping others in need" },
      ],
      variable: "{{patient_values}}",
      clinicalPurpose:
        "Understanding values guides treatment alignment, motivation, and helps identify conflicts between values and current life circumstances.",
    },
  ],
}

// Export for backward compatibility and different use cases
export const basicInformationConfig = BASIC_INFORMATION_MODULE
export default BASIC_INFORMATION_MODULE

// Example of how to use the updated field ID in validation logic
function validateForm(basicInfo) {
  const errors = {}
  if (!basicInfo.full_name || !basicInfo.full_name.trim()) {
    errors["basic_information.full_name"] = "Patient name is required"
  }
  // Additional validation logic here
  return errors
}
