import type { ModuleDefinition } from "../basic-information/types"

export const TRAUMA_HISTORY_MODULE: ModuleDefinition = {
  id: "trauma-history",
  name: "Trauma History",
  description: "Past traumatic experiences, their impact, and current trauma-related symptoms",
  category: "clinical",
  version: "1.0.0",
  fields: [
    {
      id: "trauma_screening_positive",
      name: "Trauma Screening Result",
      type: "select",
      description: "Initial screening indicates potential trauma history",
      required: true,
      evolvable: false, // Screening result doesn't change during therapy
      placeholder: "Select screening result...",
      options: ["yes", "no", "unclear", "declined_to_answer"],
      sampleData: "yes",
      variable: "{{patient_trauma_screening}}",
      clinicalPurpose:
        "Determines if detailed trauma assessment is needed and guides the depth of trauma exploration in therapy sessions.",
    },
    {
      id: "trauma_events",
      name: "Trauma Events",
      type: "list",
      description: "Specific traumatic experiences and their details",
      required: false,
      evolvable: true, // Details can emerge or be refined during therapy
      placeholder: "Add trauma events...",
      sampleData: [
        {
          type: "childhood_physical_abuse",
          age_when_occurred: 8,
          description: "Physical abuse by stepfather",
          duration: "3 years",
          perpetrator_relationship: "stepfather",
          disclosure_history: "disclosed_to_teacher_at_age_11",
          current_impact: "trust_issues_with_authority_figures",
        },
      ],
      variable: "{{patient_trauma_events}}",
      clinicalPurpose:
        "Understanding specific trauma history for treatment planning, identifying triggers, and developing appropriate therapeutic interventions.",
    },
    {
      id: "trauma_responses",
      name: "Current Trauma Responses",
      type: "list",
      description: "How trauma manifests in current symptoms and behaviors",
      required: false,
      evolvable: true, // Symptoms can change significantly during therapy
      placeholder: "Add trauma responses...",
      sampleData: [
        {
          symptom: "nightmares",
          frequency: "3-4_times_per_week",
          severity: "severe",
          triggers: "loud_noises_raised_voices",
          coping_strategies: "sleep_medication_white_noise",
        },
      ],
      variable: "{{patient_trauma_responses}}",
      clinicalPurpose:
        "Identifying current trauma symptoms for treatment focus and measuring progress in symptom reduction over time.",
    },
    {
      id: "dissociation_experiences",
      name: "Dissociation Experiences",
      type: "list",
      description: "Types and frequency of dissociative experiences",
      required: false,
      evolvable: true, // Dissociation can decrease with trauma therapy
      sampleData: [
        { type: "depersonalization", frequency: "weekly", triggers: "stress_conflict" },
        { type: "memory_gaps", frequency: "monthly", triggers: "overwhelming_emotions" },
      ],
      variable: "{{patient_dissociation}}",
      clinicalPurpose:
        "Assessing dissociative symptoms related to trauma for specialized treatment approaches and safety planning.",
    },
    {
      id: "hypervigilance_behaviors",
      name: "Hypervigilance Behaviors",
      type: "list",
      description: "Observable signs of heightened alertness and scanning for danger",
      required: false,
      evolvable: true, // Hypervigilance can reduce with successful trauma treatment
      sampleData: [
        { behavior: "scanning_exits", frequency: "always", context: "public_spaces" },
        { behavior: "startled_by_sounds", frequency: "daily", context: "unexpected_noises" },
      ],
      variable: "{{patient_hypervigilance}}",
      clinicalPurpose:
        "Understanding trauma-related hyperarousal symptoms to guide relaxation techniques and exposure therapy planning.",
    },
    {
      id: "avoidance_patterns",
      name: "Avoidance Patterns",
      type: "list",
      description: "What the patient avoids due to trauma triggers",
      required: false,
      evolvable: true, // Avoidance can decrease through exposure therapy
      sampleData: [
        { avoided_item: "certain_locations", description: "Avoids downtown area where assault occurred" },
        { avoided_item: "physical_touch", description: "Uncomfortable with unexpected physical contact" },
      ],
      variable: "{{patient_avoidance}}",
      clinicalPurpose:
        "Identifying trauma-related avoidance for gradual exposure planning and functional impairment assessment.",
    },
    {
      id: "re_experiencing_symptoms",
      name: "Re-experiencing Symptoms",
      type: "list",
      description: "How trauma memories intrude into current experience",
      required: false,
      evolvable: true, // Intrusive symptoms often improve with trauma-focused therapy
      sampleData: [
        { symptom: "nightmares", frequency: "3x_per_week", content: "reliving_the_event" },
        { symptom: "intrusive_thoughts", frequency: "daily", content: "what_if_scenarios" },
      ],
      variable: "{{patient_reexperiencing}}",
      clinicalPurpose: "Assessing intrusive trauma symptoms for EMDR, CPT, or other trauma-focused treatment planning.",
    },
    {
      id: "emotional_numbing",
      name: "Emotional Numbing",
      type: "textarea",
      description: "Degree and areas of emotional disconnection",
      required: false,
      evolvable: true, // Emotional connection can improve with therapy
      placeholder: "Describe emotional numbing experiences...",
      sampleData:
        "Difficulty feeling positive emotions, especially joy and excitement. Can feel anger and fear but struggles to connect with love or happiness.",
      variable: "{{patient_emotional_numbing}}",
      clinicalPurpose:
        "Understanding trauma-related emotional avoidance to guide affect regulation work and reconnection with positive emotions.",
    },
    {
      id: "trust_issues",
      name: "Trust Issues",
      type: "textarea",
      description: "How trauma has affected ability to trust others",
      required: false,
      evolvable: true, // Trust can gradually improve through therapeutic relationship
      placeholder: "Describe trust-related challenges...",
      sampleData:
        "Extreme difficulty trusting authority figures, especially men. Takes months to feel safe with new people. Constantly expects betrayal.",
      variable: "{{patient_trust_issues}}",
      clinicalPurpose:
        "Understanding relational impact of trauma for therapy relationship building and interpersonal effectiveness work.",
    },
    {
      id: "self_blame_patterns",
      name: "Self-Blame Patterns",
      type: "textarea",
      description: "Ways the patient blames themselves for trauma or its effects",
      required: false,
      evolvable: true, // Self-blame can decrease with cognitive restructuring
      placeholder: "Describe self-blame thoughts...",
      sampleData:
        "Believes they 'should have known better' and 'asked for it' by not fighting back. Feels responsible for family dysfunction.",
      variable: "{{patient_self_blame}}",
      clinicalPurpose:
        "Identifying cognitive distortions related to trauma for CBT work and self-compassion development.",
    },
    {
      id: "trauma_therapy_history",
      name: "Previous Trauma Therapy",
      type: "textarea",
      description: "Past attempts at trauma-focused treatment",
      required: false,
      evolvable: false, // Historical information doesn't change
      placeholder: "Describe previous trauma therapy experiences...",
      sampleData:
        "Attempted EMDR 2 years ago but stopped after 3 sessions due to feeling overwhelmed. Brief CBT focused on anxiety but trauma was never directly addressed.",
      variable: "{{patient_trauma_therapy_history}}",
      clinicalPurpose:
        "Understanding what has/hasn't worked in previous trauma treatment to inform current therapeutic approach.",
    },
    {
      id: "trauma_informed_care_needs",
      name: "Trauma-Informed Care Needs",
      type: "list",
      description: "Specific accommodations needed for safe therapy",
      required: false,
      evolvable: true, // Care needs can change as patient feels safer
      sampleData: [
        { need: "door_left_open", reason: "feels_trapped_in_closed_spaces" },
        { need: "warning_before_difficult_topics", reason: "needs_time_to_prepare_emotionally" },
      ],
      variable: "{{patient_care_needs}}",
      clinicalPurpose:
        "Ensuring therapy environment feels safe and non-retraumatizing for optimal therapeutic engagement.",
    },
    {
      id: "safety_concerns",
      name: "Current Safety Concerns",
      type: "textarea",
      description: "Any ongoing safety issues related to trauma",
      required: false,
      evolvable: true, // Safety concerns can change over time
      placeholder: "Describe any current safety concerns...",
      sampleData:
        "No current physical safety concerns. Emotional safety compromised by intrusive thoughts and hypervigilance in public spaces.",
      variable: "{{patient_safety_concerns}}",
      clinicalPurpose: "Assessing immediate safety needs and risk factors to prioritize safety planning in treatment.",
    },
    {
      id: "resilience_factors",
      name: "Resilience Factors",
      type: "list",
      description: "Strengths and resources that help cope with trauma effects",
      required: false,
      evolvable: true, // Resilience can grow and new strengths can emerge
      sampleData: [
        { factor: "creative_outlets", description: "Uses art and music to process emotions" },
        { factor: "helping_others", description: "Volunteers at local shelter, finds meaning in service" },
      ],
      variable: "{{patient_resilience}}",
      clinicalPurpose: "Identifying strengths to build upon in trauma recovery and post-traumatic growth facilitation.",
    },
    {
      id: "post_traumatic_growth",
      name: "Post-Traumatic Growth",
      type: "textarea",
      description: "Positive changes or growth experienced as a result of trauma",
      required: false,
      evolvable: true, // Growth can continue and expand throughout therapy
      placeholder: "Describe any positive changes or growth...",
      sampleData:
        "Developed deep empathy for others who have suffered. Became passionate about helping vulnerable children through volunteer work.",
      variable: "{{patient_growth}}",
      clinicalPurpose:
        "Recognizing and building on existing growth and meaning-making to foster continued healing and resilience.",
    },
  ],
}

// Export for backward compatibility and different use cases
export const traumaHistoryConfig = TRAUMA_HISTORY_MODULE
export default TRAUMA_HISTORY_MODULE
