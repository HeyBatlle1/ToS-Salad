/**
 * Single source of truth TypeScript types for the Legacy Recording Application database
 * Schema: public (Supabase/PostgreSQL)
 *
 * - Includes Supabase Database interface format
 * - Exports TypeScript enums matching PostgreSQL enums
 * - Exports Row/Insert/Update interfaces for every table
 * - Adds relationships metadata to each table in Supabase format
 * - All timestamp types are Date | string for flexibility
 * - All UUIDs are typed as string
 */

/**
 * JSON helper type for potential function payloads (parity with Supabase types)
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

/**
 * Custom UUID type for clarity
 */
export type UUID = string;

/**
 * Relationship type between participants of a legacy project
 */
export enum RelationshipType {
  ParentToChild = 'parent_to_child',
  ChildToParent = 'child_to_parent',
  SpouseToSpouse = 'spouse_to_spouse',
  SiblingToSibling = 'sibling_to_sibling',
  GrandparentToGrandchild = 'grandparent_to_grandchild',
  FriendToFriend = 'friend_to_friend',
}

/**
 * Recording status lifecycle for projects, sessions, and answers
 */
export enum RecordingStatus {
  InProgress = 'in_progress',
  Completed = 'completed',
  Abandoned = 'abandoned',
  ScheduledRelease = 'scheduled_release',
  Released = 'released',
  PendingVerification = 'pending_verification',
}

/**
 * Category classification for question bank entries
 */
export enum QuestionCategory {
  WarmMemories = 'warm_memories',
  IdentityFormation = 'identity_formation',
  HiddenTruths = 'hidden_truths',
  UnspokenTruths = 'unspoken_truths',
  PracticalMatters = 'practical_matters',
  FinalMessages = 'final_messages',
  CulturalSpecific = 'cultural_specific',
}

/**
 * Emotional state annotations for sessions, answers, and journey entries
 */
export enum EmotionalState {
  Calm = 'calm',
  Emotional = 'emotional',
  Crying = 'crying',
  Angry = 'angry',
  Laughing = 'laughing',
  Anxious = 'anxious',
}

/**
 * Access control level for legacy recipients
 */
export enum AccessLevel {
  Immediate = 'immediate',
  TimeLocked = 'time_locked',
  MilestoneLocked = 'milestone_locked',
  DualKey = 'dual_key',
  TherapistOnly = 'therapist_only',
}

/**
 * Temporal stage at which a reaction is captured
 */
export enum ReactionStage {
  Immediate = 'immediate',
  HoursLater = 'hours_later',
  DaysLater = 'days_later',
  WeeksLater = 'weeks_later',
  MonthsLater = 'months_later',
  YearsLater = 'years_later',
}

/**
 * Processing note classification type
 */
export enum NoteType {
  Question = 'question',
  Realization = 'realization',
  Anger = 'anger',
  Memory = 'memory',
  Task = 'task',
  Verification = 'verification',
}

/**
 * Public schema Database interface in Supabase format
 */
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfilesRow;
        Insert: ProfilesInsert;
        Update: ProfilesUpdate;
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      legacy_projects: {
        Row: LegacyProjectsRow;
        Insert: LegacyProjectsInsert;
        Update: LegacyProjectsUpdate;
        Relationships: [
          {
            foreignKeyName: 'legacy_projects_owner_id_fkey';
            columns: ['owner_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      recording_sessions: {
        Row: RecordingSessionsRow;
        Insert: RecordingSessionsInsert;
        Update: RecordingSessionsUpdate;
        Relationships: [
          {
            foreignKeyName: 'recording_sessions_project_id_fkey';
            columns: ['project_id'];
            isOneToOne: false;
            referencedRelation: 'legacy_projects';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'recording_sessions_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      questions: {
        Row: QuestionsRow;
        Insert: QuestionsInsert;
        Update: QuestionsUpdate;
        Relationships: [
          {
            foreignKeyName: 'questions_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      answers: {
        Row: AnswersRow;
        Insert: AnswersInsert;
        Update: AnswersUpdate;
        Relationships: [
          {
            foreignKeyName: 'answers_project_id_fkey';
            columns: ['project_id'];
            isOneToOne: false;
            referencedRelation: 'legacy_projects';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'answers_session_id_fkey';
            columns: ['session_id'];
            isOneToOne: false;
            referencedRelation: 'recording_sessions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'answers_question_id_fkey';
            columns: ['question_id'];
            isOneToOne: false;
            referencedRelation: 'questions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'answers_responder_id_fkey';
            columns: ['responder_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      skipped_questions: {
        Row: SkippedQuestionsRow;
        Insert: SkippedQuestionsInsert;
        Update: SkippedQuestionsUpdate;
        Relationships: [
          {
            foreignKeyName: 'skipped_questions_project_id_fkey';
            columns: ['project_id'];
            isOneToOne: false;
            referencedRelation: 'legacy_projects';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'skipped_questions_session_id_fkey';
            columns: ['session_id'];
            isOneToOne: false;
            referencedRelation: 'recording_sessions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'skipped_questions_question_id_fkey';
            columns: ['question_id'];
            isOneToOne: false;
            referencedRelation: 'questions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'skipped_questions_skipped_by_fkey';
            columns: ['skipped_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      legacy_access: {
        Row: LegacyAccessRow;
        Insert: LegacyAccessInsert;
        Update: LegacyAccessUpdate;
        Relationships: [
          {
            foreignKeyName: 'legacy_access_project_id_fkey';
            columns: ['project_id'];
            isOneToOne: false;
            referencedRelation: 'legacy_projects';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'legacy_access_recipient_id_fkey';
            columns: ['recipient_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'legacy_access_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      reactions: {
        Row: ReactionsRow;
        Insert: ReactionsInsert;
        Update: ReactionsUpdate;
        Relationships: [
          {
            foreignKeyName: 'reactions_answer_id_fkey';
            columns: ['answer_id'];
            isOneToOne: false;
            referencedRelation: 'answers';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'reactions_recipient_id_fkey';
            columns: ['recipient_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      processing_notes: {
        Row: ProcessingNotesRow;
        Insert: ProcessingNotesInsert;
        Update: ProcessingNotesUpdate;
        Relationships: [
          {
            foreignKeyName: 'processing_notes_project_id_fkey';
            columns: ['project_id'];
            isOneToOne: false;
            referencedRelation: 'legacy_projects';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'processing_notes_answer_id_fkey';
            columns: ['answer_id'];
            isOneToOne: false;
            referencedRelation: 'answers';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'processing_notes_author_id_fkey';
            columns: ['author_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      therapists: {
        Row: TherapistsRow;
        Insert: TherapistsInsert;
        Update: TherapistsUpdate;
        Relationships: [
          {
            foreignKeyName: 'therapists_therapist_user_id_fkey';
            columns: ['therapist_user_id'];
            isOneToOne: true;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      therapy_relationships: {
        Row: TherapyRelationshipsRow;
        Insert: TherapyRelationshipsInsert;
        Update: TherapyRelationshipsUpdate;
        Relationships: [
          {
            foreignKeyName: 'therapy_relationships_client_id_fkey';
            columns: ['client_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'therapy_relationships_therapist_id_fkey';
            columns: ['therapist_id'];
            isOneToOne: false;
            referencedRelation: 'therapists';
            referencedColumns: ['therapist_user_id'];
          }
        ];
      };
      therapy_assignments: {
        Row: TherapyAssignmentsRow;
        Insert: TherapyAssignmentsInsert;
        Update: TherapyAssignmentsUpdate;
        Relationships: [
          {
            foreignKeyName: 'therapy_assignments_relationship_id_fkey';
            columns: ['relationship_id'];
            isOneToOne: false;
            referencedRelation: 'therapy_relationships';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'therapy_assignments_project_id_fkey';
            columns: ['project_id'];
            isOneToOne: false;
            referencedRelation: 'legacy_projects';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'therapy_assignments_answer_id_fkey';
            columns: ['answer_id'];
            isOneToOne: false;
            referencedRelation: 'answers';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'therapy_assignments_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      listening_progress: {
        Row: ListeningProgressRow;
        Insert: ListeningProgressInsert;
        Update: ListeningProgressUpdate;
        Relationships: [
          {
            foreignKeyName: 'listening_progress_answer_id_fkey';
            columns: ['answer_id'];
            isOneToOne: false;
            referencedRelation: 'answers';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'listening_progress_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      emotional_journey: {
        Row: EmotionalJourneyRow;
        Insert: EmotionalJourneyInsert;
        Update: EmotionalJourneyUpdate;
        Relationships: [
          {
            foreignKeyName: 'emotional_journey_project_id_fkey';
            columns: ['project_id'];
            isOneToOne: false;
            referencedRelation: 'legacy_projects';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'emotional_journey_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'emotional_journey_session_id_fkey';
            columns: ['session_id'];
            isOneToOne: false;
            referencedRelation: 'recording_sessions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'emotional_journey_answer_id_fkey';
            columns: ['answer_id'];
            isOneToOne: false;
            referencedRelation: 'answers';
            referencedColumns: ['id'];
          }
        ];
      };
      verification_requests: {
        Row: VerificationRequestsRow;
        Insert: VerificationRequestsInsert;
        Update: VerificationRequestsUpdate;
        Relationships: [
          {
            foreignKeyName: 'verification_requests_project_id_fkey';
            columns: ['project_id'];
            isOneToOne: false;
            referencedRelation: 'legacy_projects';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'verification_requests_requestor_id_fkey';
            columns: ['requestor_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'verification_requests_admin_reviewer_id_fkey';
            columns: ['admin_reviewer_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: {};
    Functions: {};
    Enums: {
      relationship_type: RelationshipType;
      recording_status: RecordingStatus;
      question_category: QuestionCategory;
      emotional_state: EmotionalState;
      access_level: AccessLevel;
      reaction_stage: ReactionStage;
      note_type: NoteType;
    };
    CompositeTypes: {};
  };
}

/** Convenience alias for the public schema */
export type PublicSchema = Database['public'];

/** Utility helper types (parity with Supabase generated helpers) */
export type Tables<T extends keyof PublicSchema['Tables']> = PublicSchema['Tables'][T]['Row'];
export type TablesInsert<T extends keyof PublicSchema['Tables']> = PublicSchema['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof PublicSchema['Tables']> = PublicSchema['Tables'][T]['Update'];

// ---------------------------------------------------------------------------
// Table: profiles
// ---------------------------------------------------------------------------

/** User profile extending `auth.users` */
export interface ProfilesRow {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  onboarding_completed: boolean;
  date_of_birth: string | null;
  cultural_background: string[] | null;
  religious_framework: string | null;
  created_at: Date | string;
  updated_at: Date | string;
}

/** Insert shape for `profiles` */
export interface ProfilesInsert {
  id: string;
  email: string;
  full_name?: string | null;
  avatar_url?: string | null;
  onboarding_completed?: boolean;
  date_of_birth?: string | null;
  cultural_background?: string[] | null;
  religious_framework?: string | null;
  created_at?: Date | string;
  updated_at?: Date | string;
}

/** Update shape for `profiles` */
export interface ProfilesUpdate {
  id?: string;
  email?: string;
  full_name?: string | null;
  avatar_url?: string | null;
  onboarding_completed?: boolean;
  date_of_birth?: string | null;
  cultural_background?: string[] | null;
  religious_framework?: string | null;
  created_at?: Date | string;
  updated_at?: Date | string;
}

// ---------------------------------------------------------------------------
// Table: legacy_projects
// ---------------------------------------------------------------------------

/** Main recording project representing a legacy capture effort */
export interface LegacyProjectsRow {
  id: string;
  owner_id: string;
  title: string;
  description: string | null;
  relationship: RelationshipType;
  status: RecordingStatus;
  scheduled_release_at: Date | string | null;
  released_at: Date | string | null;
  recipient_name: string;
  recipient_email: string | null;
  recipient_photo_url: string | null;
  total_questions: number;
  total_answers: number;
  completion_percent: number;
  created_at: Date | string;
  updated_at: Date | string;
}

/** Insert shape for `legacy_projects` */
export interface LegacyProjectsInsert {
  id?: string;
  owner_id: string;
  title: string;
  description?: string | null;
  relationship: RelationshipType;
  status?: RecordingStatus;
  scheduled_release_at?: Date | string | null;
  released_at?: Date | string | null;
  recipient_name: string;
  recipient_email?: string | null;
  recipient_photo_url?: string | null;
  total_questions?: number;
  total_answers?: number;
  completion_percent?: number;
  created_at?: Date | string;
  updated_at?: Date | string;
}

/** Update shape for `legacy_projects` */
export interface LegacyProjectsUpdate {
  id?: string;
  owner_id?: string;
  title?: string;
  description?: string | null;
  relationship?: RelationshipType;
  status?: RecordingStatus;
  scheduled_release_at?: Date | string | null;
  released_at?: Date | string | null;
  recipient_name?: string;
  recipient_email?: string | null;
  recipient_photo_url?: string | null;
  total_questions?: number;
  total_answers?: number;
  completion_percent?: number;
  created_at?: Date | string;
  updated_at?: Date | string;
}

// ---------------------------------------------------------------------------
// Table: recording_sessions
// ---------------------------------------------------------------------------

/** Individual recording sessions within a project */
export interface RecordingSessionsRow {
  id: string;
  project_id: string;
  session_number: number;
  started_at: Date | string;
  ended_at: Date | string | null;
  status: RecordingStatus;
  predominant_emotional_state: EmotionalState | null;
  emotional_peak: EmotionalState | null;
  total_duration_seconds: number;
  total_answers: number;
  notes: string | null;
  created_by: string;
  created_at: Date | string;
  updated_at: Date | string;
}

/** Insert shape for `recording_sessions` */
export interface RecordingSessionsInsert {
  id?: string;
  project_id: string;
  session_number: number;
  started_at?: Date | string;
  ended_at?: Date | string | null;
  status?: RecordingStatus;
  predominant_emotional_state?: EmotionalState | null;
  emotional_peak?: EmotionalState | null;
  total_duration_seconds?: number;
  total_answers?: number;
  notes?: string | null;
  created_by: string;
  created_at?: Date | string;
  updated_at?: Date | string;
}

/** Update shape for `recording_sessions` */
export interface RecordingSessionsUpdate {
  id?: string;
  project_id?: string;
  session_number?: number;
  started_at?: Date | string;
  ended_at?: Date | string | null;
  status?: RecordingStatus;
  predominant_emotional_state?: EmotionalState | null;
  emotional_peak?: EmotionalState | null;
  total_duration_seconds?: number;
  total_answers?: number;
  notes?: string | null;
  created_by?: string;
  created_at?: Date | string;
  updated_at?: Date | string;
}

// ---------------------------------------------------------------------------
// Table: questions
// ---------------------------------------------------------------------------

/** Question bank entries used to guide recordings */
export interface QuestionsRow {
  id: number;
  question_uuid: string;
  category: QuestionCategory;
  prompt: string;
  is_active: boolean;
  locale: string;
  created_by: string | null;
  created_at: Date | string;
  updated_at: Date | string;
}

/** Insert shape for `questions` */
export interface QuestionsInsert {
  id?: number;
  question_uuid?: string;
  category: QuestionCategory;
  prompt: string;
  is_active?: boolean;
  locale?: string;
  created_by?: string | null;
  created_at?: Date | string;
  updated_at?: Date | string;
}

/** Update shape for `questions` */
export interface QuestionsUpdate {
  id?: number;
  question_uuid?: string;
  category?: QuestionCategory;
  prompt?: string;
  is_active?: boolean;
  locale?: string;
  created_by?: string | null;
  created_at?: Date | string;
  updated_at?: Date | string;
}

// ---------------------------------------------------------------------------
// Table: answers
// ---------------------------------------------------------------------------

/** Recorded answers to questions during sessions */
export interface AnswersRow {
  id: string;
  project_id: string;
  session_id: string;
  question_id: number;
  responder_id: string;
  transcript: string | null;
  audio_url: string | null;
  duration_seconds: number | null;
  emotional_state: EmotionalState | null;
  status: RecordingStatus;
  is_final: boolean;
  attempt_number: number;
  created_at: Date | string;
  updated_at: Date | string;
}

/** Insert shape for `answers` */
export interface AnswersInsert {
  id?: string;
  project_id: string;
  session_id: string;
  question_id: number;
  responder_id: string;
  transcript?: string | null;
  audio_url?: string | null;
  duration_seconds?: number | null;
  emotional_state?: EmotionalState | null;
  status?: RecordingStatus;
  is_final?: boolean;
  attempt_number?: number;
  created_at?: Date | string;
  updated_at?: Date | string;
}

/** Update shape for `answers` */
export interface AnswersUpdate {
  id?: string;
  project_id?: string;
  session_id?: string;
  question_id?: number;
  responder_id?: string;
  transcript?: string | null;
  audio_url?: string | null;
  duration_seconds?: number | null;
  emotional_state?: EmotionalState | null;
  status?: RecordingStatus;
  is_final?: boolean;
  attempt_number?: number;
  created_at?: Date | string;
  updated_at?: Date | string;
}

// ---------------------------------------------------------------------------
// Table: skipped_questions
// ---------------------------------------------------------------------------

/** Tracks questions that were intentionally skipped */
export interface SkippedQuestionsRow {
  id: string;
  project_id: string;
  session_id: string;
  question_id: number;
  reason: string | null;
  skipped_by: string;
  skipped_at: Date | string;
  created_at: Date | string;
  updated_at: Date | string;
}

/** Insert shape for `skipped_questions` */
export interface SkippedQuestionsInsert {
  id?: string;
  project_id: string;
  session_id: string;
  question_id: number;
  reason?: string | null;
  skipped_by: string;
  skipped_at?: Date | string;
  created_at?: Date | string;
  updated_at?: Date | string;
}

/** Update shape for `skipped_questions` */
export interface SkippedQuestionsUpdate {
  id?: string;
  project_id?: string;
  session_id?: string;
  question_id?: number;
  reason?: string | null;
  skipped_by?: string;
  skipped_at?: Date | string;
  created_at?: Date | string;
  updated_at?: Date | string;
}

// ---------------------------------------------------------------------------
// Table: legacy_access
// ---------------------------------------------------------------------------

/** Recipient access control and release logic for a project */
export interface LegacyAccessRow {
  id: string;
  project_id: string;
  recipient_id: string | null;
  access_level: AccessLevel;
  unlock_at: Date | string | null;
  milestone: string | null;
  dual_key_required: boolean;
  therapist_only: boolean;
  created_by: string;
  created_at: Date | string;
  updated_at: Date | string;
}

/** Insert shape for `legacy_access` */
export interface LegacyAccessInsert {
  id?: string;
  project_id: string;
  recipient_id?: string | null;
  access_level: AccessLevel;
  unlock_at?: Date | string | null;
  milestone?: string | null;
  dual_key_required?: boolean;
  therapist_only?: boolean;
  created_by: string;
  created_at?: Date | string;
  updated_at?: Date | string;
}

/** Update shape for `legacy_access` */
export interface LegacyAccessUpdate {
  id?: string;
  project_id?: string;
  recipient_id?: string | null;
  access_level?: AccessLevel;
  unlock_at?: Date | string | null;
  milestone?: string | null;
  dual_key_required?: boolean;
  therapist_only?: boolean;
  created_by?: string;
  created_at?: Date | string;
  updated_at?: Date | string;
}

// ---------------------------------------------------------------------------
// Table: reactions
// ---------------------------------------------------------------------------

/** Recipient reactions to individual answers */
export interface ReactionsRow {
  id: string;
  answer_id: string;
  recipient_id: string;
  stage: ReactionStage;
  reaction_type: string;
  intensity: number | null;
  comment: string | null;
  created_at: Date | string;
  updated_at: Date | string;
}

/** Insert shape for `reactions` */
export interface ReactionsInsert {
  id?: string;
  answer_id: string;
  recipient_id: string;
  stage?: ReactionStage;
  reaction_type: string;
  intensity?: number | null;
  comment?: string | null;
  created_at?: Date | string;
  updated_at?: Date | string;
}

/** Update shape for `reactions` */
export interface ReactionsUpdate {
  id?: string;
  answer_id?: string;
  recipient_id?: string;
  stage?: ReactionStage;
  reaction_type?: string;
  intensity?: number | null;
  comment?: string | null;
  created_at?: Date | string;
  updated_at?: Date | string;
}

// ---------------------------------------------------------------------------
// Table: processing_notes
// ---------------------------------------------------------------------------

/** Notes authored during processing and integration of legacy material */
export interface ProcessingNotesRow {
  id: string;
  project_id: string;
  answer_id: string | null;
  author_id: string;
  note_type: NoteType;
  content: string;
  is_private: boolean;
  created_at: Date | string;
  updated_at: Date | string;
}

/** Insert shape for `processing_notes` */
export interface ProcessingNotesInsert {
  id?: string;
  project_id: string;
  answer_id?: string | null;
  author_id: string;
  note_type: NoteType;
  content: string;
  is_private?: boolean;
  created_at?: Date | string;
  updated_at?: Date | string;
}

/** Update shape for `processing_notes` */
export interface ProcessingNotesUpdate {
  id?: string;
  project_id?: string;
  answer_id?: string | null;
  author_id?: string;
  note_type?: NoteType;
  content?: string;
  is_private?: boolean;
  created_at?: Date | string;
  updated_at?: Date | string;
}

// ---------------------------------------------------------------------------
// Table: therapists
// ---------------------------------------------------------------------------

/** Therapist profile associated with a user profile */
export interface TherapistsRow {
  therapist_user_id: string;
  credentials: string | null;
  bio: string | null;
  verified: boolean;
  created_at: Date | string;
  updated_at: Date | string;
}

/** Insert shape for `therapists` */
export interface TherapistsInsert {
  therapist_user_id: string;
  credentials?: string | null;
  bio?: string | null;
  verified?: boolean;
  created_at?: Date | string;
  updated_at?: Date | string;
}

/** Update shape for `therapists` */
export interface TherapistsUpdate {
  therapist_user_id?: string;
  credentials?: string | null;
  bio?: string | null;
  verified?: boolean;
  created_at?: Date | string;
  updated_at?: Date | string;
}

// ---------------------------------------------------------------------------
// Table: therapy_relationships
// ---------------------------------------------------------------------------

/** Client-therapist relationship records */
export interface TherapyRelationshipsRow {
  id: string;
  client_id: string;
  therapist_id: string;
  status: string;
  started_at: Date | string;
  ended_at: Date | string | null;
  created_at: Date | string;
  updated_at: Date | string;
}

/** Insert shape for `therapy_relationships` */
export interface TherapyRelationshipsInsert {
  id?: string;
  client_id: string;
  therapist_id: string;
  status?: string;
  started_at?: Date | string;
  ended_at?: Date | string | null;
  created_at?: Date | string;
  updated_at?: Date | string;
}

/** Update shape for `therapy_relationships` */
export interface TherapyRelationshipsUpdate {
  id?: string;
  client_id?: string;
  therapist_id?: string;
  status?: string;
  started_at?: Date | string;
  ended_at?: Date | string | null;
  created_at?: Date | string;
  updated_at?: Date | string;
}

// ---------------------------------------------------------------------------
// Table: therapy_assignments
// ---------------------------------------------------------------------------

/** Assignments/homework associated with therapy relationships */
export interface TherapyAssignmentsRow {
  id: string;
  relationship_id: string;
  project_id: string | null;
  answer_id: string | null;
  title: string;
  description: string | null;
  due_at: Date | string | null;
  completed_at: Date | string | null;
  created_by: string;
  created_at: Date | string;
  updated_at: Date | string;
}

/** Insert shape for `therapy_assignments` */
export interface TherapyAssignmentsInsert {
  id?: string;
  relationship_id: string;
  project_id?: string | null;
  answer_id?: string | null;
  title: string;
  description?: string | null;
  due_at?: Date | string | null;
  completed_at?: Date | string | null;
  created_by: string;
  created_at?: Date | string;
  updated_at?: Date | string;
}

/** Update shape for `therapy_assignments` */
export interface TherapyAssignmentsUpdate {
  id?: string;
  relationship_id?: string;
  project_id?: string | null;
  answer_id?: string | null;
  title?: string;
  description?: string | null;
  due_at?: Date | string | null;
  completed_at?: Date | string | null;
  created_by?: string;
  created_at?: Date | string;
  updated_at?: Date | string;
}

// ---------------------------------------------------------------------------
// Table: listening_progress
// ---------------------------------------------------------------------------

/** Playback tracking for answer listening progress */
export interface ListeningProgressRow {
  id: string;
  answer_id: string;
  user_id: string;
  last_position_seconds: number;
  completed: boolean;
  created_at: Date | string;
  updated_at: Date | string;
}

/** Insert shape for `listening_progress` */
export interface ListeningProgressInsert {
  id?: string;
  answer_id: string;
  user_id: string;
  last_position_seconds?: number;
  completed?: boolean;
  created_at?: Date | string;
  updated_at?: Date | string;
}

/** Update shape for `listening_progress` */
export interface ListeningProgressUpdate {
  id?: string;
  answer_id?: string;
  user_id?: string;
  last_position_seconds?: number;
  completed?: boolean;
  created_at?: Date | string;
  updated_at?: Date | string;
}

// ---------------------------------------------------------------------------
// Table: emotional_journey
// ---------------------------------------------------------------------------

/** Emotional arc tracking events across sessions and answers */
export interface EmotionalJourneyRow {
  id: string;
  project_id: string;
  user_id: string;
  session_id: string | null;
  answer_id: string | null;
  event_at: Date | string;
  emotional_state: EmotionalState;
  intensity: number;
  note: string | null;
  created_at: Date | string;
  updated_at: Date | string;
}

/** Insert shape for `emotional_journey` */
export interface EmotionalJourneyInsert {
  id?: string;
  project_id: string;
  user_id: string;
  session_id?: string | null;
  answer_id?: string | null;
  event_at?: Date | string;
  emotional_state: EmotionalState;
  intensity: number;
  note?: string | null;
  created_at?: Date | string;
  updated_at?: Date | string;
}

/** Update shape for `emotional_journey` */
export interface EmotionalJourneyUpdate {
  id?: string;
  project_id?: string;
  user_id?: string;
  session_id?: string | null;
  answer_id?: string | null;
  event_at?: Date | string;
  emotional_state?: EmotionalState;
  intensity?: number;
  note?: string | null;
  created_at?: Date | string;
  updated_at?: Date | string;
}

// ---------------------------------------------------------------------------
// Table: verification_requests
// ---------------------------------------------------------------------------

/**
 * Tracks the multi-stage verification process for releasing a project upon death.
 */
export interface VerificationRequestsRow {
  id: string;
  project_id: string;
  requestor_id: string | null;
  status: string;
  death_certificate_url: string | null;
  obituary_url: string | null;
  notarized_affidavit_url: string | null;
  admin_reviewer_id: string | null;
  notes: string | null;
  confidence_score: number | null;
  created_at: Date | string;
  updated_at: Date | string;
}

/** Insert shape for `verification_requests` */
export interface VerificationRequestsInsert {
  id?: string;
  project_id: string;
  requestor_id?: string | null;
  status?: string;
  death_certificate_url?: string | null;
  obituary_url?: string | null;
  notarized_affidavit_url?: string | null;
  admin_reviewer_id?: string | null;
  notes?: string | null;
  confidence_score?: number | null;
  created_at?: Date | string;
  updated_at?: Date | string;
}

/** Update shape for `verification_requests` */
export interface VerificationRequestsUpdate {
  id?: string;
  project_id?: string;
  requestor_id?: string | null;
  status?: string;
  death_certificate_url?: string | null;
  obituary_url?: string | null;
  notarized_affidavit_url?: string | null;
  admin_reviewer_id?: string | null;
  notes?: string | null;
  confidence_score?: number | null;
  created_at?: Date | string;
  updated_at?: Date | string;
}
