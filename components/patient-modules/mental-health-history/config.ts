import type { MentalHealthHistoryModule } from "./types"

export const MENTAL_HEALTH_HISTORY_MODULE: MentalHealthHistoryModule = {
  id: "mental_health_history",
  name: "Mental Health History",
  description: "Previous therapy, medications, diagnoses, and treatment experiences",
  category: "clinical",
  version: "1.0.0",
  fields: [
    {
      id: "previous_therapy_experience",
      name: "Previous Therapy Experience",
      type: "textarea",
      description: "Detailed history of previous therapeutic interventions and experiences",
      required: false,
      evolvable: true,
      sampleData:
        "Had individual therapy for 6 months in 2019 with Dr. Smith for anxiety management. Found CBT techniques helpful but struggled with homework assignments. Stopped due to insurance changes. Also tried group therapy for social anxiety in college - mixed experience.",
      clinicalPurpose:
        "Understanding previous therapeutic experiences helps inform current treatment approach, identify what worked/didn't work, and build on existing therapeutic knowledge.",
      placeholder:
        "Describe any previous therapy experiences, what was helpful, what wasn't, and why treatment ended...",
    },
    {
      id: "current_medications",
      name: "Current Medications",
      type: "list",
      description: "All current psychiatric medications with details about effectiveness",
      required: false,
      evolvable: true,
      sampleData: [
        {
          name: "Sertraline (Zoloft)",
          dosage: "50mg daily",
          prescribing_doctor: "Dr. Johnson, Psychiatrist",
          duration: "8 months",
          effectiveness: "Moderately helpful for anxiety, some side effects",
        },
        {
          name: "Lorazepam (Ativan)",
          dosage: "0.5mg as needed",
          prescribing_doctor: "Dr. Johnson, Psychiatrist",
          duration: "3 months",
          effectiveness: "Very effective for panic attacks, using sparingly",
        },
      ],
      clinicalPurpose:
        "Current medication information is crucial for understanding what treatments are already in place, potential interactions, and medication compliance issues.",
    },
    {
      id: "past_medications",
      name: "Past Medications",
      type: "list",
      description: "Previous psychiatric medications and reasons for discontinuation",
      required: false,
      evolvable: false,
      sampleData: [
        {
          name: "Fluoxetine (Prozac)",
          dosage: "20mg daily",
          duration: "4 months",
          reason_discontinued: "Sexual side effects",
          side_effects: "Decreased libido, weight gain",
        },
        {
          name: "Alprazolam (Xanax)",
          dosage: "0.25mg twice daily",
          duration: "2 months",
          reason_discontinued: "Dependency concerns",
          side_effects: "Drowsiness, memory issues",
        },
      ],
      clinicalPurpose:
        "Past medication history helps avoid repeating unsuccessful treatments and identifies patterns of side effects or non-compliance.",
    },
    {
      id: "psychiatric_diagnoses",
      name: "Psychiatric Diagnoses",
      type: "list",
      description: "Formal psychiatric diagnoses received from mental health professionals",
      required: false,
      evolvable: true,
      sampleData: [
        {
          diagnosis: "Generalized Anxiety Disorder (300.02)",
          diagnosed_by: "Dr. Martinez, Psychiatrist",
          date_diagnosed: "2022-03-15",
          current_status: "Active, in treatment",
        },
        {
          diagnosis: "Major Depressive Disorder, Recurrent (296.32)",
          diagnosed_by: "Dr. Chen, Psychologist",
          date_diagnosed: "2021-11-08",
          current_status: "In remission",
        },
      ],
      clinicalPurpose:
        "Formal diagnoses provide framework for understanding symptoms and guide evidence-based treatment selection.",
    },
    {
      id: "hospitalization_history",
      name: "Hospitalization History",
      type: "list",
      description: "Any psychiatric hospitalizations or intensive treatment programs",
      required: false,
      evolvable: false,
      sampleData: [
        {
          facility: "Regional Medical Center - Psychiatric Unit",
          dates: "June 15-22, 2020",
          reason: "Severe depression with suicidal ideation",
          outcome: "Stabilized on medication, discharged to outpatient care",
        },
      ],
      clinicalPurpose:
        "Hospitalization history indicates severity of past episodes and helps assess current risk factors and treatment needs.",
    },
    {
      id: "family_mental_health_history",
      name: "Family Mental Health History",
      type: "textarea",
      description: "Mental health conditions in family members and their impact",
      required: false,
      evolvable: false,
      sampleData:
        "Mother has history of depression, treated with medication. Maternal grandmother had \"nervous breakdowns\" (likely anxiety/depression, never formally diagnosed). Father's side - uncle with bipolar disorder. No known substance abuse in family. Family generally supportive but doesn't talk openly about mental health.",
      clinicalPurpose:
        "Family history helps identify genetic predispositions, family dynamics around mental health, and potential support systems or stressors.",
      placeholder:
        "Describe any mental health conditions in family members, family attitudes toward mental health, and family support...",
    },
    {
      id: "treatment_preferences",
      name: "Treatment Preferences",
      type: "multiselect",
      description: "Preferred approaches to mental health treatment",
      required: false,
      evolvable: true,
      sampleData: ["individual_therapy", "medication_management", "mindfulness_meditation", "exercise_therapy"],
      clinicalPurpose:
        "Understanding treatment preferences helps tailor interventions to client values and increases treatment engagement and success.",
      options: [
        "individual_therapy",
        "group_therapy",
        "family_therapy",
        "couples_therapy",
        "medication_management",
        "cognitive_behavioral_therapy",
        "dialectical_behavior_therapy",
        "mindfulness_meditation",
        "exercise_therapy",
        "art_therapy",
        "music_therapy",
        "emdr",
        "holistic_approaches",
        "peer_support_groups",
        "online_therapy",
        "intensive_outpatient_programs",
      ],
    },
    {
      id: "medication_compliance",
      name: "Medication Compliance",
      type: "select",
      description: "Level of adherence to prescribed psychiatric medications",
      required: false,
      evolvable: true,
      sampleData: "mostly_compliant",
      clinicalPurpose:
        "Medication compliance affects treatment outcomes and helps identify barriers to adherence that need to be addressed.",
      options: [
        "fully_compliant",
        "mostly_compliant",
        "somewhat_compliant",
        "rarely_compliant",
        "non_compliant",
        "not_applicable",
      ],
    },
    {
      id: "therapy_goals",
      name: "Therapy Goals",
      type: "textarea",
      description: "What the client hopes to achieve through mental health treatment",
      required: false,
      evolvable: true,
      sampleData:
        "Want to manage anxiety better so it doesn't interfere with work and relationships. Learn coping strategies for panic attacks. Improve self-confidence and reduce negative self-talk. Eventually reduce reliance on medication if possible. Better work-life balance and stress management.",
      clinicalPurpose:
        "Clear therapy goals help focus treatment, measure progress, and ensure client and therapist are working toward shared objectives.",
      placeholder: "What do you hope to achieve through therapy? What would success look like to you?",
    },
    {
      id: "previous_therapy_outcomes",
      name: "Previous Therapy Outcomes",
      type: "textarea",
      description: "Results and effectiveness of past therapeutic interventions",
      required: false,
      evolvable: false,
      sampleData:
        "CBT was moderately helpful - learned breathing techniques and thought challenging that I still use. Group therapy was less helpful due to social anxiety. Medication helped significantly with panic attacks but had side effects. Overall, combination of therapy and medication was most effective.",
      clinicalPurpose:
        "Understanding what worked in previous therapy helps replicate successful interventions and avoid ineffective approaches.",
      placeholder: "What were the results of previous therapy? What was most/least helpful?",
    },
    {
      id: "current_mental_health_providers",
      name: "Current Mental Health Providers",
      type: "list",
      description: "Current mental health professionals involved in care",
      required: false,
      evolvable: true,
      sampleData: [
        {
          name: "Dr. Sarah Johnson",
          type: "Psychiatrist",
          frequency: "Monthly medication management",
          relationship_quality: "Good rapport, feels heard",
        },
        {
          name: "Lisa Chen, LCSW",
          type: "Therapist",
          frequency: "Weekly individual therapy",
          relationship_quality: "Excellent therapeutic alliance",
        },
      ],
      clinicalPurpose:
        "Current provider information ensures coordinated care and helps understand the full treatment team and therapeutic relationships.",
    },
  ],
}
