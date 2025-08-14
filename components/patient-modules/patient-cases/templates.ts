export interface PatientTemplate {
  id: string
  name: string
  description: string
  complexity: string
  data: Record<string, Record<string, any>>
}

// Predefined patient templates - now organized by modules with EXACT field matching
export const PATIENT_TEMPLATES: PatientTemplate[] = [
  {
    id: "anxiety_relationship",
    name: "Sarah - Anxiety & Relationship Issues",
    description: "28-year-old marketing professional struggling with anxiety and relationship difficulties",
    complexity: "Intermediate",
    data: {
      basic_information: {
        // Match exact field IDs from basic-information config
        full_name: "Sarah Michelle Johnson",
        age_and_birth: { age: 28, date_of_birth: "1995-03-15" },
        gender: "female",
        occupation: "Marketing Coordinator",
        relationship_status: "single",
        languages: ["English", "Spanish"],
        ethnicity: [{ value: "Hispanic/Latino" }, { value: "Irish-American" }],
        emergency_contacts: [
          { name: "Jennifer Johnson", relationship: "Sister", phone: "(555) 987-6543" },
          { name: "Michael Thompson", relationship: "Best Friend", phone: "(555) 456-7890" },
        ],
        children: [],
        personal_values: [
          { value: "Family connection" },
          { value: "Professional success" },
          { value: "Authenticity" },
          { value: "Personal growth" },
        ],
        presenting_concern: "Anxiety and relationship difficulties affecting work and personal life",
      },
      behavioral_patterns: {
        // Match exact field IDs from behavioral-patterns config
        communication_style: "passive_aggressive",
        conflict_resolution: "avoidance",
        decision_making_pattern: "overthinking",
        social_interaction_style: "socially_anxious",
        avoidance_behaviors: [
          {
            behavior: "Social gatherings with strangers",
            trigger: "Fear of judgment",
            frequency: "Always",
          },
          {
            behavior: "Difficult conversations",
            trigger: "Fear of conflict",
            frequency: "Usually",
          },
          {
            behavior: "New challenges at work",
            trigger: "Fear of failure",
            frequency: "Often",
          },
        ],
        self_care_routines: [
          {
            activity: "Evening meditation",
            frequency: "Daily",
            consistency: "Inconsistent",
          },
          {
            activity: "Weekend hiking",
            frequency: "Weekly",
            consistency: "Consistent",
          },
          {
            activity: "Journaling",
            frequency: "Few times per week",
            consistency: "Sporadic",
          },
        ],
        coping_mechanisms: [
          {
            mechanism: "Scrolling social media",
            effectiveness: "Temporarily distracting",
            healthy: false,
          },
          {
            mechanism: "Talking to friends",
            effectiveness: "Very helpful",
            healthy: true,
          },
          {
            mechanism: "Avoiding the situation",
            effectiveness: "Short-term relief",
            healthy: false,
          },
        ],
        stress_response_pattern: "freeze_response",
        primary_triggers: ["criticism", "rejection", "conflict"],
        hobbies_interests: [
          {
            activity: "Reading fiction novels",
            engagement_level: "High",
            social_aspect: "Solitary",
          },
          {
            activity: "Playing guitar",
            engagement_level: "Medium",
            social_aspect: "Sometimes with others",
          },
          {
            activity: "Cooking",
            engagement_level: "Low",
            social_aspect: "Family activity",
          },
        ],
      },
      cognitive_emotional_patterns: {
        // Match exact field IDs from cognitive-emotional-patterns config
        core_beliefs: [
          {
            belief: "I must be perfect to be worthy of love",
            category: "self",
            strength: "strong",
            origin: "Childhood criticism from parents",
          },
          {
            belief: "People will eventually abandon me",
            category: "others",
            strength: "very_strong",
            origin: "Father left when I was 8",
          },
          {
            belief: "The world is a dangerous place",
            category: "world",
            strength: "moderate",
            origin: "Traumatic car accident at 16",
          },
        ],
        core_fears: ["abandonment", "judgment", "not_being_good_enough", "failure"],
        thought_patterns: ["catastrophizing", "mind_reading", "all_or_nothing_thinking", "should_statements"],
        self_concept: {
          identity_description:
            "I see myself as a caring but anxious person who tries too hard to please everyone. I'm intelligent but often doubt myself.",
          strengths_perceived: ["Empathetic", "Hardworking", "Creative", "Loyal"],
          weaknesses_perceived: ["Too sensitive", "Indecisive", "Perfectionist", "Anxious"],
          roles_important: ["Daughter", "Friend", "Professional", "Caregiver"],
        },
        emotional_regulation_style: "emotional_suppression",
        primary_emotions: ["anxiety", "sadness", "shame", "overwhelm"],
        emotional_triggers: [
          {
            trigger: "Being criticized or corrected",
            emotion: "Shame",
            intensity: "overwhelming",
            context: "Especially at work or in relationships",
          },
          {
            trigger: "Feeling excluded from social situations",
            emotion: "Sadness",
            intensity: "strong",
            context: "Reminds me of childhood bullying",
          },
          {
            trigger: "Making mistakes",
            emotion: "Anxiety",
            intensity: "moderate",
            context: "Fear of disappointing others",
          },
        ],
        self_esteem_pattern: {
          baseline_level: "low",
          stability: "unstable",
          conditional_factors: ["Academic performance", "Others' approval", "Physical appearance"],
          sources_of_validation: ["External praise", "Achievement", "Helping others"],
        },
        internal_dialogue:
          "My inner voice is very critical and harsh. It constantly tells me I'm not doing enough, that I'll mess things up, and that people are judging me. It's like having a mean critic in my head that never takes a break. Sometimes it sounds like my mother's voice when she was disappointed in me.",
        cognitive_distortions: ["all_or_nothing_thinking", "should_statements", "mind_reading", "catastrophizing"],
      },
      work_career: {
        // Match exact field IDs from work-career config
        employment_status: "full_time_employed",
        job_title: "Marketing Coordinator",
        job_satisfaction: "somewhat_dissatisfied",
        work_stress_sources: ["heavy_workload", "difficult_colleagues", "job_insecurity"],
        career_goals:
          "I want to advance to a senior marketing role within the next 3 years, ideally with more creative freedom and better work-life balance. Long-term, I'd like to start my own consulting business.",
        work_life_balance: "poor",
        workplace_relationships:
          "I get along well with most of my coworkers, but I have ongoing conflicts with my direct supervisor. She micromanages and rarely gives positive feedback. I feel isolated from the team sometimes.",
        professional_challenges: ["skill_gaps", "imposter_syndrome", "networking_difficulties"],
        career_history: [
          {
            company: "ABC Marketing Agency",
            position: "Junior Marketing Assistant",
            duration: "2 years",
            reason_for_leaving: "Sought better growth opportunities",
          },
          {
            company: "XYZ Corporation",
            position: "Marketing Specialist",
            duration: "1.5 years",
            reason_for_leaving: "Company downsizing",
          },
        ],
        financial_stress: "moderate",
        work_environment_preferences: ["remote_work", "flexible_schedule", "collaborative_team"],
        professional_identity:
          "I see myself as a creative problem-solver who thrives in collaborative environments. I value making a meaningful impact through my work, but I sometimes struggle with confidence in my abilities. Work is important to me, but I don't want it to define my entire identity.",
      },
      mental_health_history: {
        // Match exact field IDs from mental-health-history config
        previous_therapy_experience:
          "Had individual therapy for 6 months in 2019 with Dr. Smith for anxiety management. Found CBT techniques helpful but struggled with homework assignments. Stopped due to insurance changes. Also tried group therapy for social anxiety in college - mixed experience.",
        current_medications: [
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
        past_medications: [
          {
            name: "Fluoxetine (Prozac)",
            dosage: "20mg daily",
            duration: "4 months",
            reason_discontinued: "Sexual side effects",
            side_effects: "Decreased libido, weight gain",
          },
        ],
        psychiatric_diagnoses: [
          {
            diagnosis: "Generalized Anxiety Disorder (300.02)",
            diagnosed_by: "Dr. Martinez, Psychiatrist",
            date_diagnosed: "2022-03-15",
            current_status: "Active, in treatment",
          },
        ],
        family_mental_health_history:
          "Mother has history of depression, treated with medication. Maternal grandmother had 'nervous breakdowns' (likely anxiety/depression, never formally diagnosed). Father's side - uncle with bipolar disorder. No known substance abuse in family. Family generally supportive but doesn't talk openly about mental health.",
        treatment_preferences: [
          "individual_therapy",
          "medication_management",
          "mindfulness_meditation",
          "exercise_therapy",
        ],
        medication_compliance: "mostly_compliant",
        therapy_goals:
          "Want to manage anxiety better so it doesn't interfere with work and relationships. Learn coping strategies for panic attacks. Improve self-confidence and reduce negative self-talk. Eventually reduce reliance on medication if possible. Better work-life balance and stress management.",
        current_mental_health_providers: [
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
      },
      family_dynamics: {
        // Match exact field IDs from family-dynamics config
        family_structure: "nuclear_family",
        family_members: [
          {
            name: "Margaret Johnson",
            relationship: "Mother",
            age: 58,
            living_status: "alive",
            relationship_quality: "close",
            contact_frequency: "weekly",
            description:
              "Supportive but sometimes overprotective. Retired teacher who worries about my career choices.",
          },
          {
            name: "Robert Johnson",
            relationship: "Father",
            age: 62,
            living_status: "alive",
            relationship_quality: "distant",
            contact_frequency: "monthly",
            description: "Emotionally unavailable. Works long hours, struggles to express emotions or connect.",
          },
        ],
        primary_caregiver_childhood:
          "Mother (Margaret) was primary caregiver. Father worked long hours and was emotionally distant.",
        childhood_family_environment:
          "Generally stable but emotionally reserved household. High expectations for academic achievement. Limited emotional expression or discussion of feelings. Mother was nurturing but anxious. Father was provider but emotionally unavailable.",
        family_communication_style: "indirect_avoidant",
        family_roles_patient: ["peacemaker", "high_achiever", "responsible_one"],
        family_mental_health_history: ["anxiety_disorders", "depression"],
        family_cultural_background:
          "Irish-Catholic background with strong emphasis on education and 'keeping family business private.' Traditional gender roles were expected. Mental health was stigmatized and not discussed openly.",
        family_traditions_values: ["education_achievement", "hard_work", "family_loyalty", "emotional_restraint"],
        current_living_situation:
          "Lives alone in apartment, 2 hours from parents. Sees parents monthly, talks to mother weekly.",
        family_support_level: "somewhat_supportive",
        family_conflicts: [
          {
            participants: "Sarah and Father",
            issue: "Career choices and life direction",
            duration: "Ongoing for 2 years",
            resolution_status: "unresolved",
            impact_on_patient: "Increases anxiety and self-doubt",
          },
        ],
        childhood_memories: [
          {
            age_range: "8-10 years old",
            memory_type: "traumatic",
            description: "Parents fighting about father's work hours and emotional absence",
            emotional_impact: "Fear of conflict and abandonment",
          },
          {
            age_range: "12-14 years old",
            memory_type: "negative",
            description: "Being criticized for not being 'perfect' in school",
            emotional_impact: "Perfectionism and fear of failure",
          },
        ],
        family_secrets_issues:
          "Father's emotional struggles were never discussed openly. Family maintained appearance of being 'fine' to outsiders.",
        family_financial_situation: "middle_class_stable",
        family_education_values: "highly_valued",
        family_religious_spiritual: "Catholic background, moderate observance, emphasis on guilt and perfectionism",
        family_substance_use: ["social_drinking_father", "no_other_substances"],
        family_violence_history: "No physical violence, but emotional neglect and criticism",
        family_therapy_history: "Never participated in family therapy, stigma around mental health treatment",
      },
      trauma_history: {
        // Match exact field IDs from trauma-history config
        trauma_screening_positive: "yes",
        trauma_events: [
          {
            type: "childhood_emotional_abuse",
            age_when_occurred: 13,
            description: "Bullying in middle school for being 'different'",
            duration: "2 years",
            perpetrator_relationship: "peers",
            disclosure_history: "told_parents_minimized_response",
            current_impact: "social_anxiety_trust_issues",
          },
          {
            type: "relationship_trauma",
            age_when_occurred: 20,
            description: "Emotionally manipulative relationship in college",
            duration: "1 year",
            perpetrator_relationship: "romantic_partner",
            disclosure_history: "disclosed_to_friends_after_breakup",
            current_impact: "difficulty_trusting_romantic_partners",
          },
        ],
        trauma_responses: [
          {
            symptom: "hypervigilance",
            frequency: "daily",
            severity: "moderate",
            triggers: "social_situations_new_people",
            coping_strategies: "breathing_exercises_grounding",
          },
        ],
        trust_issues:
          "Extreme difficulty trusting new people, especially in romantic relationships. Takes months to feel safe with new people. Constantly expects rejection or abandonment.",
        self_blame_patterns:
          "Believes they 'should have been stronger' during bullying. Feels responsible for choosing 'bad' romantic partners. Often thinks 'if I was different, these things wouldn't happen to me.'",
        resilience_factors: [
          { factor: "creative_outlets", description: "Uses art and music to process emotions" },
          { factor: "helping_others", description: "Volunteers at local shelter, finds meaning in service" },
        ],
        safety_concerns: "Hypervigilant in social situations, especially with new people or in crowded spaces",
        emotional_numbing: "Sometimes feels disconnected from emotions as a protective mechanism",
        dissociation_experiences: [
          {
            type: "mild_depersonalization",
            frequency: "weekly",
            triggers: "high_stress_social_situations",
          },
        ],
        hypervigilance_behaviors: [
          {
            behavior: "Scanning room for exits",
            frequency: "always",
            context: "New or crowded environments",
          },
        ],
        avoidance_patterns: [
          {
            avoided_item: "Large social gatherings",
            description: "Avoids parties, conferences, or events with many strangers",
          },
        ],
        reexperiencing_symptoms: [
          {
            symptom: "Intrusive memories of bullying",
            frequency: "weekly",
            content: "Vivid memories of being excluded and mocked",
          },
        ],
        trauma_informed_care_needs: [
          {
            need: "Gentle approach to trust-building",
            reason: "History of betrayal and emotional manipulation",
          },
        ],
        post_traumatic_growth: "Developed strong empathy for others who feel different or excluded",
      },
    },
  },
  {
    id: "depression_work_stress",
    name: "Marcus - Depression & Work Burnout",
    description: "35-year-old software engineer experiencing depression and severe work burnout",
    complexity: "Advanced",
    data: {
      basic_information: {
        full_name: "Marcus David Chen",
        age_and_birth: { age: 35, date_of_birth: "1988-11-22" },
        gender: "male",
        occupation: "Senior Software Engineer",
        relationship_status: "married",
        languages: ["English", "Mandarin"],
        ethnicity: [{ value: "Asian American" }, { value: "Chinese" }],
        emergency_contacts: [
          { name: "Lisa Chen", relationship: "Partner", phone: "(555) 345-6789" },
          { name: "David Chen", relationship: "Brother", phone: "(555) 567-8901" },
        ],
        children: [],
        personal_values: [
          { value: "Work-life balance" },
          { value: "Family harmony" },
          { value: "Personal growth" },
          { value: "Financial security" },
        ],
        presenting_concern: "Depression and severe work burnout affecting all areas of life",
      },
      behavioral_patterns: {
        communication_style: "withdrawn",
        conflict_resolution: "avoidance",
        decision_making_pattern: "procrastinating",
        social_interaction_style: "withdrawn",
        avoidance_behaviors: [
          {
            behavior: "Social events with coworkers",
            trigger: "Feeling emotionally drained",
            frequency: "Always",
          },
          {
            behavior: "Video calls when possible",
            trigger: "Don't want others to see how tired I look",
            frequency: "Usually",
          },
          {
            behavior: "Discussing feelings with partner",
            trigger: "Don't want to burden her",
            frequency: "Often",
          },
        ],
        self_care_routines: [
          {
            activity: "Exercise",
            frequency: "Rarely",
            consistency: "Very inconsistent",
          },
          {
            activity: "Healthy eating",
            frequency: "Rarely",
            consistency: "Poor - mostly takeout",
          },
        ],
        coping_mechanisms: [
          {
            mechanism: "Video gaming",
            effectiveness: "Temporarily distracting",
            healthy: false,
          },
          {
            mechanism: "Binge-watching shows",
            effectiveness: "Numbing but not helpful",
            healthy: false,
          },
          {
            mechanism: "Working longer hours",
            effectiveness: "Makes things worse",
            healthy: false,
          },
        ],
        stress_response_pattern: "shutdown",
        primary_triggers: ["work_deadlines", "performance_reviews", "social_expectations"],
        hobbies_interests: [
          {
            activity: "Gaming",
            engagement_level: "High",
            social_aspect: "Online only",
          },
          {
            activity: "Reading tech blogs",
            engagement_level: "Medium",
            social_aspect: "Solitary",
          },
        ],
      },
      cognitive_emotional_patterns: {
        core_beliefs: [
          {
            belief: "I must achieve to be worthy of love",
            category: "self",
            strength: "very_strong",
            origin: "Cultural and family expectations",
          },
          {
            belief: "Showing weakness is shameful",
            category: "self",
            strength: "strong",
            origin: "Cultural messaging about masculinity",
          },
          {
            belief: "I'm letting everyone down",
            category: "others",
            strength: "strong",
            origin: "Current depression and work struggles",
          },
        ],
        core_fears: ["failure", "disappointing_others", "being_seen_as_weak", "loss_of_control"],
        thought_patterns: ["self_criticism", "rumination", "all_or_nothing_thinking", "should_statements"],
        self_concept: {
          identity_description:
            "I used to see myself as competent and reliable, but now I feel like I'm failing at everything. I'm supposed to be the provider and the successful one, but I feel like a fraud.",
          strengths_perceived: ["Technical skills", "Problem-solving", "Reliability (historically)"],
          weaknesses_perceived: ["Emotionally weak", "Lazy", "Burden to others", "Failing partner"],
          roles_important: ["Partner", "Son", "Brother", "Provider", "Professional"],
        },
        emotional_regulation_style: "emotional_suppression",
        primary_emotions: ["numbness", "sadness", "guilt", "irritability"],
        emotional_triggers: [
          {
            trigger: "Work performance discussions",
            emotion: "Anxiety",
            intensity: "severe",
            context: "Fear of being found out as incompetent",
          },
          {
            trigger: "Partner asking how I'm doing",
            emotion: "Guilt",
            intensity: "strong",
            context: "Feel like I'm burdening her",
          },
        ],
        self_esteem_pattern: {
          baseline_level: "very_low",
          stability: "consistently_low",
          conditional_factors: ["Work performance", "Others' approval", "Being useful to others"],
          sources_of_validation: ["Work achievements", "Problem-solving", "Being needed"],
        },
        internal_dialogue:
          "My inner voice is constantly telling me I'm not good enough, that I'm lazy, that everyone would be better off without me. It compares me to other engineers who seem to have it all together. It tells me I'm weak for feeling this way.",
        cognitive_distortions: ["all_or_nothing_thinking", "should_statements", "personalization", "mental_filtering"],
      },
      work_career: {
        employment_status: "full_time_employed",
        job_title: "Senior Software Engineer",
        job_satisfaction: "very_dissatisfied",
        work_stress_sources: ["heavy_workload", "tight_deadlines", "on_call_rotations", "unclear_expectations"],
        career_goals:
          "Considering career change but feels trapped by salary and benefits, interested in teaching or non-profit work. Want to find work that feels meaningful rather than just profitable.",
        work_life_balance: "very_poor",
        workplace_relationships:
          "Well-respected by colleagues but keeps interactions professional, avoids team social events. Feel like I'm pretending to be okay all the time.",
        professional_challenges: ["burnout", "imposter_syndrome", "work_life_balance", "leadership_challenges"],
        career_history: [
          {
            company: "Tech Startup",
            position: "Junior Developer",
            duration: "2 years",
            reason_for_leaving: "Company acquired, wanted more stability",
          },
          {
            company: "Current Fortune 500",
            position: "Software Engineer → Senior Software Engineer",
            duration: "8 years",
            reason_for_leaving: "Still employed but considering leaving",
          },
        ],
        financial_stress: "minimal",
        work_environment_preferences: ["remote_work", "flexible_schedule", "meaningful_work", "calm_environment"],
        professional_identity:
          "I used to love coding and solving complex problems. Now it feels mechanical and meaningless. I'm good at what I do technically, but I've lost the passion. I feel trapped by the golden handcuffs of a good salary.",
      },
      mental_health_history: {
        previous_therapy_experience:
          "None, has always been skeptical of therapy effectiveness. Cultural stigma around mental health made it seem like weakness.",
        current_medications: [],
        past_medications: [],
        psychiatric_diagnoses: [],
        family_mental_health_history:
          "Father had untreated depression, cultural stigma around mental health in family. Mental health was never discussed openly. Father's anger and withdrawal were normalized.",
        treatment_preferences: ["individual_therapy", "medication_management"],
        medication_compliance: "not_applicable",
        therapy_goals:
          "Want to feel like myself again. Stop feeling numb all the time. Figure out if I should change careers. Learn to communicate better with my partner. Address the shame around needing help.",
        current_mental_health_providers: [],
      },
      family_dynamics: {
        family_structure: "divorced_parents",
        family_members: [
          {
            name: "Helen Chen",
            relationship: "Mother",
            age: 68,
            living_status: "alive",
            relationship_quality: "close",
            contact_frequency: "weekly",
            description:
              "Caring but worries constantly. Immigrated from China, worked multiple jobs to support family. High expectations for success.",
          },
          {
            name: "Robert Chen",
            relationship: "Father",
            age: 72,
            living_status: "alive",
            relationship_quality: "strained",
            contact_frequency: "monthly",
            description:
              "Emotionally distant, struggled with untreated depression. Divorced mother when Marcus was 16. Traditional views about masculinity and success.",
          },
          {
            name: "David Chen",
            relationship: "Brother",
            age: 32,
            living_status: "alive",
            relationship_quality: "good",
            contact_frequency: "weekly",
            description: "Younger brother, also in tech. More emotionally open than Marcus. Married with kids.",
          },
        ],
        primary_caregiver_childhood:
          "Mother was primary caregiver after age 16. Before divorce, both parents worked long hours. Grandmother helped with childcare.",
        childhood_family_environment:
          "High-achieving household with emphasis on education and success. Limited emotional expression. Parents' marriage was strained with frequent arguments about money and work stress. Divorce was contentious.",
        family_communication_style: "indirect_avoidant",
        family_roles_patient: ["high_achiever", "responsible_one", "peacemaker"],
        family_mental_health_history: ["depression", "anxiety_disorders"],
        family_cultural_background:
          "Chinese-American immigrant family. Strong emphasis on education, hard work, and not bringing shame to family. Mental health stigmatized. Traditional gender roles expected.",
        family_traditions_values: ["education_achievement", "hard_work", "family_loyalty", "financial_security"],
        current_living_situation:
          "Lives with partner Lisa in suburban home. Parents live 1 hour away. Brother lives nearby.",
        family_support_level: "somewhat_supportive",
        family_conflicts: [
          {
            participants: "Marcus and Father",
            issue: "Emotional distance and unmet expectations",
            duration: "Lifelong pattern",
            resolution_status: "unresolved",
            impact_on_patient: "Reinforces feelings of inadequacy and emotional suppression",
          },
        ],
        childhood_memories: [
          {
            age_range: "16-18 years old",
            memory_type: "traumatic",
            description: "Parents' divorce and father moving out",
            emotional_impact: "Fear of abandonment and responsibility for family stability",
          },
        ],
        family_secrets_issues:
          "Father's depression was never acknowledged or treated. Family maintained facade of success.",
        family_financial_situation: "working_class",
        family_education_values: "highly_valued",
        family_religious_spiritual: "Non-religious, focus on practical achievement",
        family_substance_use: ["father_alcohol_use"],
        family_violence_history: "No physical violence, but emotional neglect and high pressure",
        family_therapy_history: "Never participated, strong stigma against mental health treatment",
      },
      trauma_history: {
        trauma_screening_positive: "yes",
        trauma_events: [
          {
            type: "family_trauma",
            age_when_occurred: 16,
            description: "Parents' contentious divorce with financial stress and emotional volatility",
            duration: "2 years",
            perpetrator_relationship: "family_system",
            disclosure_history: "never_discussed_openly",
            current_impact: "fear_of_conflict_people_pleasing",
          },
          {
            type: "workplace_harassment",
            age_when_occurred: 28,
            description: "Harassment and discrimination from previous manager",
            duration: "1 year",
            perpetrator_relationship: "supervisor",
            disclosure_history: "reported_to_hr_minimally_addressed",
            current_impact: "distrust_of_authority_work_anxiety",
          },
        ],
        trauma_responses: [
          {
            symptom: "emotional_numbing",
            frequency: "daily",
            severity: "severe",
            triggers: "stress_conflict_emotional_demands",
            coping_strategies: "work_distraction_gaming",
          },
        ],
        trust_issues:
          "Difficulty trusting authority figures, especially managers. Tendency to people-please at own expense. Fear of conflict leads to avoiding necessary conversations.",
        self_blame_patterns:
          "Believes he should have 'handled things better' during parents' divorce. Feels responsible for family's emotional well-being. Thinks he's weak for being affected by workplace harassment.",
        resilience_factors: [
          { factor: "technical_skills", description: "Strong problem-solving abilities and technical competence" },
          { factor: "partner_support", description: "Lisa is very supportive and encouraging" },
        ],
        safety_concerns: "Feels unsafe expressing vulnerability or asking for help",
        emotional_numbing: "Uses work and gaming to avoid processing difficult emotions",
        dissociation_experiences: [
          {
            type: "emotional_detachment",
            frequency: "daily",
            triggers: "work_stress_relationship_demands",
          },
        ],
        hypervigilance_behaviors: [
          {
            behavior: "Monitoring work performance constantly",
            frequency: "daily",
            context: "Fear of being seen as incompetent",
          },
        ],
        avoidance_patterns: [
          {
            avoided_item: "Emotional conversations",
            description: "Avoids discussing feelings with partner or family",
          },
        ],
        reexperiencing_symptoms: [
          {
            symptom: "Intrusive thoughts about work failure",
            frequency: "daily",
            content: "Vivid scenarios of being fired or humiliated at work",
          },
        ],
        trauma_informed_care_needs: [
          {
            need: "Cultural sensitivity around masculinity and achievement",
            reason: "Strong cultural messages about success and emotional suppression",
          },
        ],
        post_traumatic_growth: "Developing awareness of the need for work-life balance and emotional health",
      },
    },
  },
  {
    id: "young_adult_transition",
    name: "Alex - College Transition & Identity",
    description: "20-year-old college student struggling with identity, social anxiety, and academic pressure",
    complexity: "Beginner",
    data: {
      basic_information: {
        full_name: "Alex Jordan Rivera",
        age_and_birth: { age: 20, date_of_birth: "2003-07-08" },
        gender: "non_binary",
        occupation: "Student / Part-time Bookstore Employee",
        relationship_status: "single",
        languages: ["English", "Spanish"],
        ethnicity: [{ value: "Hispanic/Latino" }, { value: "Mexican-American" }],
        emergency_contacts: [
          { name: "Maria Rivera", relationship: "Mother", phone: "(555) 789-0123" },
          { name: "Carlos Rivera", relationship: "Father", phone: "(555) 890-1234" },
        ],
        children: [],
        personal_values: [
          { value: "Authenticity" },
          { value: "Social justice" },
          { value: "Creative expression" },
          { value: "Family connection" },
        ],
        presenting_concern: "Identity exploration, social anxiety, and academic pressure during college transition",
      },
      behavioral_patterns: {
        communication_style: "withdrawn",
        conflict_resolution: "avoidance",
        decision_making_pattern: "overthinking",
        social_interaction_style: "socially_anxious",
        avoidance_behaviors: [
          {
            behavior: "Large social gatherings and parties",
            trigger: "Fear of judgment and not fitting in",
            frequency: "Always",
          },
          {
            behavior: "Speaking up in class",
            trigger: "Fear of saying something wrong",
            frequency: "Usually",
          },
          {
            behavior: "Dating or romantic situations",
            trigger: "Confusion about identity and fear of rejection",
            frequency: "Always",
          },
        ],
        self_care_routines: [
          {
            activity: "Art and creative writing",
            frequency: "Daily",
            consistency: "Consistent",
          },
          {
            activity: "Exercise",
            frequency: "Rarely",
            consistency: "Very inconsistent",
          },
        ],
        coping_mechanisms: [
          {
            mechanism: "Art and creative writing",
            effectiveness: "Very helpful",
            healthy: true,
          },
          {
            mechanism: "Online gaming",
            effectiveness: "Temporarily distracting",
            healthy: false,
          },
          {
            mechanism: "Texting with high school friends",
            effectiveness: "Somewhat helpful",
            healthy: true,
          },
        ],
        stress_response_pattern: "freeze_response",
        primary_triggers: ["social_situations", "academic_pressure", "identity_questions"],
        hobbies_interests: [
          {
            activity: "Digital art and illustration",
            engagement_level: "Very High",
            social_aspect: "Online communities",
          },
          {
            activity: "Creative writing",
            engagement_level: "High",
            social_aspect: "Solitary",
          },
          {
            activity: "Music (listening and creating playlists)",
            engagement_level: "High",
            social_aspect: "Sharing with close friends",
          },
        ],
      },
      cognitive_emotional_patterns: {
        core_beliefs: [
          {
            belief: "I don't fit in anywhere",
            category: "self",
            strength: "strong",
            origin: "Always feeling different from peers",
          },
          {
            belief: "I have to figure everything out on my own",
            category: "self",
            strength: "moderate",
            origin: "Family doesn't understand identity struggles",
          },
          {
            belief: "People won't accept the real me",
            category: "others",
            strength: "strong",
            origin: "Fear of rejection around gender identity",
          },
        ],
        core_fears: ["rejection", "not_being_good_enough", "being_alone", "disappointing_others"],
        thought_patterns: ["overthinking", "comparison_to_others", "catastrophizing", "rumination"],
        self_concept: {
          identity_description:
            "I'm still figuring out who I am. I know I'm creative and care about social justice, but I feel different from everyone else. I'm questioning my gender identity and don't know how to talk about it.",
          strengths_perceived: ["Creative", "Empathetic", "Thoughtful", "Artistic"],
          weaknesses_perceived: ["Too sensitive", "Socially awkward", "Indecisive", "Anxious"],
          roles_important: ["Student", "Artist", "Child", "Friend"],
        },
        emotional_regulation_style: "emotional_overwhelm",
        primary_emotions: ["anxiety", "confusion", "loneliness", "hope"],
        emotional_triggers: [
          {
            trigger: "Being misgendered or having to use wrong pronouns",
            emotion: "Sadness",
            intensity: "severe",
            context: "Reminds me that I can't be authentic",
          },
          {
            trigger: "Academic pressure and deadlines",
            emotion: "Anxiety",
            intensity: "strong",
            context: "Fear of disappointing parents",
          },
        ],
        self_esteem_pattern: {
          baseline_level: "low_to_moderate",
          stability: "very_unstable",
          conditional_factors: ["Creative recognition", "Academic performance", "Social acceptance"],
          sources_of_validation: ["Artistic achievements", "Family approval", "Online community support"],
        },
        internal_dialogue:
          "My inner voice is constantly questioning everything. 'Am I normal?' 'Do I belong here?' 'What if my parents don't accept me?' It's like having a worried friend in my head who never stops asking 'what if' questions.",
        cognitive_distortions: ["all_or_nothing_thinking", "mind_reading", "fortune_telling", "personalization"],
      },
      work_career: {
        employment_status: "part_time_employed",
        job_title: "Bookstore Assistant",
        job_satisfaction: "satisfied",
        work_stress_sources: ["balancing_work_and_studies", "customer_service_anxiety"],
        career_goals:
          "Interested in psychology or social work but worried about job prospects, considering art therapy. Want to help other LGBTQ+ youth who are struggling with identity issues.",
        work_life_balance: "good",
        workplace_relationships:
          "Gets along well with coworkers, prefers working independently. Supervisor is understanding about school schedule.",
        professional_challenges: ["networking_difficulties", "public_speaking_anxiety", "lack_of_experience"],
        career_history: [
          {
            company: "Campus Bookstore",
            position: "Part-time Assistant",
            duration: "1 year",
            reason_for_leaving: "Still employed",
          },
        ],
        financial_stress: "moderate",
        work_environment_preferences: ["calm_environment", "flexible_schedule", "meaningful_work"],
        professional_identity:
          "I'm still figuring out what I want to do professionally. I know I want to help people, especially young people who feel different or misunderstood. I'm drawn to creative fields but worry about financial stability.",
      },
      mental_health_history: {
        previous_therapy_experience:
          "School counselor in high school for academic stress, positive experience but didn't address deeper identity issues.",
        current_medications: [],
        past_medications: [],
        psychiatric_diagnoses: [],
        family_mental_health_history:
          "Aunt has anxiety disorder, grandmother had depression. Family doesn't talk openly about mental health but is generally supportive.",
        treatment_preferences: ["individual_therapy", "group_therapy", "peer_support_groups"],
        medication_compliance: "not_applicable",
        therapy_goals:
          "Want to figure out my identity, especially around gender. Learn to manage social anxiety. Improve communication with family about who I am. Build confidence and self-acceptance.",
        current_mental_health_providers: [],
      },
      family_dynamics: {
        family_structure: "nuclear_family",
        family_members: [
          {
            name: "Maria Rivera",
            relationship: "Mother",
            age: 48,
            living_status: "alive",
            relationship_quality: "very_close",
            contact_frequency: "daily",
            description:
              "Loving and supportive but doesn't understand gender identity issues. Worries about Alex's future and happiness.",
          },
          {
            name: "Carlos Rivera",
            relationship: "Father",
            age: 52,
            living_status: "alive",
            relationship_quality: "close",
            contact_frequency: "weekly",
            description:
              "Traditional but caring. Works construction, values hard work. Struggles to understand Alex's artistic interests and identity questions.",
          },
          {
            name: "Sofia Rivera",
            relationship: "Sister",
            age: 17,
            living_status: "alive",
            relationship_quality: "very_close",
            contact_frequency: "daily",
            description: "High school senior, very supportive and understanding. More progressive than parents.",
          },
          {
            name: "Miguel Rivera",
            relationship: "Brother",
            age: 14,
            living_status: "alive",
            relationship_quality: "good",
            contact_frequency: "weekly",
            description:
              "Middle schooler, looks up to Alex. Doesn't fully understand identity issues but is accepting.",
          },
        ],
        primary_caregiver_childhood:
          "Both parents were involved, but mother was primary caregiver. Extended family (grandparents, aunts) also played important roles.",
        childhood_family_environment:
          "Loving and supportive household with strong family bonds. Traditional gender role expectations. Emphasis on education and hard work. Close-knit extended family.",
        family_communication_style: "open_direct",
        family_roles_patient: ["high_achiever", "creative_one", "sensitive_one"],
        family_mental_health_history: ["anxiety_disorders", "depression"],
        family_cultural_background:
          "Mexican-American family with strong cultural traditions. Catholic background but not strictly religious. Emphasis on family loyalty and respect for elders.",
        family_traditions_values: ["family_loyalty", "hard_work", "education_achievement", "helping_others"],
        current_living_situation:
          "Lives in dorm during school year, returns home for breaks. Family lives 3 hours away from college.",
        family_support_level: "very_supportive",
        family_conflicts: [
          {
            participants: "Alex and Parents",
            issue: "Understanding of gender identity and career choices",
            duration: "Ongoing for 2 years",
            resolution_status: "ongoing",
            impact_on_patient: "Creates internal conflict between authenticity and family acceptance",
          },
        ],
        childhood_memories: [
          {
            age_range: "6-8 years old",
            memory_type: "positive",
            description: "Family art projects and creative time with mother",
            emotional_impact: "Foundation for creative identity and close maternal bond",
          },
          {
            age_range: "13-15 years old",
            memory_type: "negative",
            description: "Feeling different from peers and struggling with gender expectations",
            emotional_impact: "Beginning of identity confusion and social anxiety",
          },
        ],
        family_secrets_issues:
          "Alex's gender identity questions are not openly discussed, creating some family tension",
        family_financial_situation: "working_class",
        family_education_values: "highly_valued",
        family_religious_spiritual: "Catholic background, moderate observance, emphasis on family and community",
        family_substance_use: ["social_drinking_parents"],
        family_violence_history: "No violence, very supportive and loving family environment",
        family_therapy_history: "Never participated, but open to the idea if needed",
      },
      trauma_history: {
        trauma_screening_positive: "yes",
        trauma_events: [
          {
            type: "bullying",
            age_when_occurred: 13,
            description: "Bullying in middle school for being 'different' and not conforming to gender norms",
            duration: "2 years",
            perpetrator_relationship: "peers",
            disclosure_history: "told_parents_school_intervention_minimal",
            current_impact: "social_anxiety_identity_confusion",
          },
          {
            type: "sexual_assault",
            age_when_occurred: 19,
            description: "Sexual assault at a college party",
            duration: "single_incident",
            perpetrator_relationship: "acquaintance",
            disclosure_history: "has_not_told_anyone",
            current_impact: "increased_social_anxiety_trust_issues",
          },
        ],
        trauma_responses: [
          {
            symptom: "hypervigilance",
            frequency: "daily",
            severity: "moderate",
            triggers: "crowded_spaces_parties_unfamiliar_people",
            coping_strategies: "art_music_texting_friends",
          },
        ],
        trust_issues:
          "Difficulty trusting new people, especially in social situations. Hypervigilant about safety, particularly around dating or romantic situations.",
        self_blame_patterns:
          "Blames self for being 'too different' and attracting negative attention. Feels responsible for the assault ('I shouldn't have gone to that party').",
        resilience_factors: [
          { factor: "creative_expression", description: "Uses art and writing to process emotions and experiences" },
          { factor: "family_support", description: "Strong family bonds provide foundation of love and support" },
          { factor: "online_communities", description: "Finds support and understanding in LGBTQ+ online spaces" },
        ],
        safety_concerns: "Hypervigilant in social situations, especially parties or dating contexts",
        emotional_numbing: "Sometimes disconnects from emotions when overwhelmed",
        dissociation_experiences: [
          {
            type: "mild_dissociation",
            frequency: "weekly",
            triggers: "overwhelming_social_situations",
          },
        ],
        hypervigilance_behaviors: [
          {
            behavior: "Constantly scanning social situations for threats",
            frequency: "daily",
            context: "Especially in new or crowded environments",
          },
        ],
        avoidance_patterns: [
          {
            avoided_item: "College parties and large social gatherings",
            description: "Avoids situations similar to where assault occurred",
          },
        ],
        reexperiencing_symptoms: [
          {
            symptom: "Flashbacks to bullying incidents",
            frequency: "weekly",
            content: "Vivid memories of being excluded and mocked for being different",
          },
        ],
        trauma_informed_care_needs: [
          {
            need: "LGBTQ+ affirming therapy approach",
            reason: "Identity exploration needs to happen in safe, affirming environment",
          },
        ],
        post_traumatic_growth: "Developing strong advocacy for other LGBTQ+ youth and marginalized individuals",
      },
    },
  },
]
