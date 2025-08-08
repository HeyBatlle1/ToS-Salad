import { 
  createLegacyProject,
  getLegacyProject,
  getLegacyProjectsByOwner,
  updateLegacyProject,
  deleteLegacyProject,
  createRecordingSession,
  getRecordingSession,
  getRecordingSessionsByProject,
  updateRecordingSession,
  endRecordingSession,
  createAnswer,
  getAnswer,
  getAnswersBySession,
  getAnswersByProject,
  updateAnswer,
  deleteAnswer,
  skipQuestion,
  getSkippedQuestionsBySession,
  getSkippedQuestionsByProject,
  calculateProjectCompletion,
  recordEmotionalJourney,
  getEmotionalJourney
} from '../lib/api/recording';

import {
  createLegacyAccess,
  getLegacyAccess,
  getLegacyAccessByProject,
  getLegacyAccessByRecipient,
  updateLegacyAccess,
  deleteLegacyAccess,
  createReaction,
  getReaction,
  getReactionsByAnswer,
  getReactionsByRecipient,
  updateReaction,
  deleteReaction,
  createProcessingNote,
  getProcessingNote,
  getProcessingNotesByProject,
  getProcessingNotesByAnswer,
  getProcessingNotesByAuthor,
  updateProcessingNote,
  deleteProcessingNote,
  createListeningProgress,
  getListeningProgress,
  getListeningProgressByUser,
  getListeningProgressByAnswer,
  updateListeningProgress,
  markAnswerAsCompleted,
  checkRecipientAccess,
  verifyDeathCertificate
} from '../lib/api/recipient';

import {
  createQuestion,
  getQuestion,
  getQuestionsByCategory,
  getAllActiveQuestions,
  getRandomQuestions,
  updateQuestion,
  deleteQuestion,
  deactivateQuestion,
  activateQuestion,
  seedQuestions,
  getQuestionCategories,
  getQuestionsForSession,
  getQuestionProgress
} from '../lib/api/questions';

import {
  createTherapist,
  getTherapist,
  getAllTherapists,
  updateTherapist,
  verifyTherapist,
  deleteTherapist,
  createTherapyRelationship,
  getTherapyRelationship,
  getTherapyRelationshipsByClient,
  getTherapyRelationshipsByTherapist,
  getActiveTherapyRelationship,
  updateTherapyRelationship,
  endTherapyRelationship,
  deleteTherapyRelationship,
  createTherapyAssignment,
  getTherapyAssignment,
  getTherapyAssignmentsByRelationship,
  getTherapyAssignmentsByProject,
  getTherapyAssignmentsByAnswer,
  updateTherapyAssignment,
  completeTherapyAssignment,
  deleteTherapyAssignment,
  assignTherapistToProject,
  getTherapistForProject,
  createTherapyAssignmentForAnswer,
  getTherapyProgress,
  isUserTherapist,
  getTherapistClients
} from '../lib/api/therapist';

import {
  getCurrentUser,
  signUpRecorder,
  signUpRecipient,
  signUpTherapist,
  signIn,
  signOut,
  getUserProfile,
  updateUserProfile,
  handleDeathCertificate,
  checkReleaseConditions,
  isAuthenticated,
  requireAuth,
  getAuthSession,
  refreshSession
} from '../lib/auth/auth';

import {
  uploadAudioFile,
  uploadAudioChunk,
  mergeAudioChunks,
  downloadAudioFile,
  getAudioFileUrl,
  getSignedAudioUrl,
  listAudioFiles,
  deleteAudioFile,
  deleteProjectAudio,
  getAudioDuration,
  validateAudioFile,
  formatFileSize,
  formatDuration,
  ensureAudioBucket,
  getStorageStats
} from '../lib/storage/audio';

import type { 
  Database,
  LegacyProjectsRow,
  RecordingSessionsRow,
  AnswersRow,
  QuestionsRow,
  TherapistsRow,
  TherapyRelationshipsRow,
  TherapyAssignmentsRow,
  EmotionalState,
  RecordingStatus,
  QuestionCategory,
  AccessLevel
} from '../lib/types/database.types';

type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];

// ============================================================================
// LEGACY RECORDING SERVICE
// ============================================================================

export class LegacyRecordingService {
  // ============================================================================
  // PROJECT MANAGEMENT
  // ============================================================================

  static async createProject(projectData: {
    title: string;
    description?: string;
    relationship: string;
    recipientName: string;
    recipientEmail?: string;
    recipientPhotoUrl?: string;
  }): Promise<Tables<'legacy_projects'>> {
    const user = await requireAuth();
    
    return createLegacyProject({
      owner_id: user.id,
      ...projectData,
      status: 'in_progress',
      total_questions: 0,
      total_answers: 0,
      completion_percent: 0
    });
  }

  static async getProject(projectId: string): Promise<Tables<'legacy_projects'> | null> {
    await requireAuth();
    return getLegacyProject(projectId);
  }

  static async getUserProjects(): Promise<Tables<'legacy_projects'>[]> {
    const user = await requireAuth();
    return getLegacyProjectsByOwner(user.id);
  }

  static async updateProject(projectId: string, updates: Partial<Tables<'legacy_projects'>>): Promise<Tables<'legacy_projects'>> {
    await requireAuth();
    return updateLegacyProject(projectId, updates);
  }

  static async deleteProject(projectId: string): Promise<void> {
    await requireAuth();
    await deleteProjectAudio(projectId);
    await deleteLegacyProject(projectId);
  }

  // ============================================================================
  // RECORDING SESSION MANAGEMENT
  // ============================================================================

  static async startRecordingSession(projectId: string): Promise<Tables<'recording_sessions'>> {
    const user = await requireAuth();
    
    // Get next session number
    const sessions = await getRecordingSessionsByProject(projectId);
    const nextSessionNumber = sessions.length + 1;

    return createRecordingSession({
      project_id: projectId,
      session_number: nextSessionNumber,
      started_at: new Date().toISOString(),
      status: 'in_progress',
      total_duration_seconds: 0,
      total_answers: 0,
      created_by: user.id
    });
  }

  static async getSession(sessionId: string): Promise<Tables<'recording_sessions'> | null> {
    await requireAuth();
    return getRecordingSession(sessionId);
  }

  static async getProjectSessions(projectId: string): Promise<Tables<'recording_sessions'>[]> {
    await requireAuth();
    return getRecordingSessionsByProject(projectId);
  }

  static async endSession(sessionId: string, emotionalState?: EmotionalState): Promise<Tables<'recording_sessions'>> {
    await requireAuth();
    return endRecordingSession(sessionId, emotionalState);
  }

  // ============================================================================
  // QUESTION MANAGEMENT
  // ============================================================================

  static async getSessionQuestions(projectId: string, sessionNumber: number): Promise<Tables<'questions'>[]> {
    await requireAuth();
    return getQuestionsForSession(projectId, sessionNumber);
  }

  static async getQuestionCategories(): Promise<{ value: QuestionCategory; label: string; description: string }[]> {
    return getQuestionCategories();
  }

  static async getQuestionsByCategory(category: QuestionCategory): Promise<Tables<'questions'>[]> {
    return getQuestionsByCategory(category);
  }

  static async getProjectProgress(projectId: string): Promise<{
    totalQuestions: number;
    answeredQuestions: number;
    skippedQuestions: number;
    remainingQuestions: number;
    progressPercent: number;
  }> {
    return getQuestionProgress(projectId);
  }

  // ============================================================================
  // ANSWER RECORDING
  // ============================================================================

  static async recordAnswer(answerData: {
    projectId: string;
    sessionId: string;
    questionId: number;
    audioFile?: File;
    transcript?: string;
    emotionalState?: EmotionalState;
    onUploadProgress?: (progress: number) => void;
  }): Promise<Tables<'answers'>> {
    const user = await requireAuth();
    
    let audioUrl: string | null = null;
    let durationSeconds: number | null = null;

    // Upload audio if provided
    if (answerData.audioFile) {
      const uploadResult = await uploadAudioFile(
        answerData.audioFile,
        answerData.projectId,
        answerData.sessionId,
        `temp_${Date.now()}`,
        answerData.onUploadProgress
      );
      
      audioUrl = uploadResult.url;
      durationSeconds = await getAudioDuration(answerData.audioFile);
    }

    // Create answer record
    const answer = await createAnswer({
      project_id: answerData.projectId,
      session_id: answerData.sessionId,
      question_id: answerData.questionId,
      responder_id: user.id,
      transcript: answerData.transcript,
      audio_url: audioUrl,
      duration_seconds: durationSeconds,
      emotional_state: answerData.emotionalState,
      status: 'completed',
      is_final: true,
      attempt_number: 1
    });

    // Record emotional journey if state provided
    if (answerData.emotionalState) {
      await recordEmotionalJourney({
        projectId: answerData.projectId,
        userId: user.id,
        sessionId: answerData.sessionId,
        answerId: answer.id,
        emotionalState: answerData.emotionalState,
        intensity: 5, // Default intensity
        note: `Recorded answer for question ${answerData.questionId}`
      });
    }

    // Update project completion
    await calculateProjectCompletion(answerData.projectId);

    return answer;
  }

  static async skipQuestion(skipData: {
    projectId: string;
    sessionId: string;
    questionId: number;
    reason?: string;
  }): Promise<void> {
    const user = await requireAuth();
    
    await skipQuestion({
      project_id: skipData.projectId,
      session_id: skipData.sessionId,
      question_id: skipData.questionId,
      reason: skipData.reason,
      skipped_by: user.id,
      skipped_at: new Date().toISOString()
    });
  }

  static async getSessionAnswers(sessionId: string): Promise<Tables<'answers'>[]> {
    await requireAuth();
    return getAnswersBySession(sessionId);
  }

  static async getProjectAnswers(projectId: string): Promise<Tables<'answers'>[]> {
    await requireAuth();
    return getAnswersByProject(projectId);
  }

  // ============================================================================
  // RECIPIENT ACCESS MANAGEMENT
  // ============================================================================

  static async grantAccess(accessData: {
    projectId: string;
    recipientId: string;
    accessLevel: AccessLevel;
    unlockAt?: string;
    milestone?: string;
  }): Promise<void> {
    const user = await requireAuth();
    
    await createLegacyAccess({
      project_id: accessData.projectId,
      recipient_id: accessData.recipientId,
      access_level: accessData.accessLevel,
      unlock_at: accessData.unlockAt,
      milestone: accessData.milestone,
      dual_key_required: accessData.accessLevel === 'dual_key',
      therapist_only: accessData.accessLevel === 'therapist_only',
      created_by: user.id
    });
  }

  static async checkAccess(projectId: string, recipientId: string): Promise<{
    hasAccess: boolean;
    accessLevel: AccessLevel | null;
    unlockAt: Date | null;
    milestone: string | null;
  }> {
    return checkRecipientAccess(projectId, recipientId);
  }

  // ============================================================================
  // DEATH CERTIFICATE HANDLING
  // ============================================================================

  static async submitDeathCertificate(certificateData: {
    projectId: string;
    certificateNumber: string;
    dateOfDeath: string;
    issuingAuthority: string;
    verificationUrl?: string;
    certificateFile?: File;
  }): Promise<boolean> {
    return handleDeathCertificate(certificateData.projectId, certificateData);
  }

  static async checkReleaseConditions(projectId: string): Promise<{
    canRelease: boolean;
    reason: string;
    conditions: {
      deathVerified: boolean;
      timeLockExpired: boolean;
      milestoneReached: boolean;
      dualKeyVerified: boolean;
      therapistApproved: boolean;
    };
  }> {
    return checkReleaseConditions(projectId);
  }

  // ============================================================================
  // REACTION RECORDING
  // ============================================================================

  static async recordReaction(reactionData: {
    answerId: string;
    reactionType: string;
    intensity?: number;
    comment?: string;
    stage?: string;
  }): Promise<Tables<'reactions'>> {
    const user = await requireAuth();
    
    return createReaction({
      answer_id: reactionData.answerId,
      recipient_id: user.id,
      stage: reactionData.stage || 'immediate',
      reaction_type: reactionData.reactionType,
      intensity: reactionData.intensity,
      comment: reactionData.comment
    });
  }

  static async getAnswerReactions(answerId: string): Promise<Tables<'reactions'>[]> {
    return getReactionsByAnswer(answerId);
  }

  // ============================================================================
  // PROCESSING NOTES
  // ============================================================================

  static async addProcessingNote(noteData: {
    projectId: string;
    answerId?: string;
    noteType: string;
    content: string;
    isPrivate?: boolean;
  }): Promise<Tables<'processing_notes'>> {
    const user = await requireAuth();
    
    return createProcessingNote({
      project_id: noteData.projectId,
      answer_id: noteData.answerId,
      author_id: user.id,
      note_type: noteData.noteType,
      content: noteData.content,
      is_private: noteData.isPrivate || false
    });
  }

  static async getProjectNotes(projectId: string, includePrivate: boolean = false): Promise<Tables<'processing_notes'>[]> {
    return getProcessingNotesByProject(projectId, includePrivate);
  }

  static async getAnswerNotes(answerId: string, includePrivate: boolean = false): Promise<Tables<'processing_notes'>[]> {
    return getAnswerNotes(answerId, includePrivate);
  }

  // ============================================================================
  // LISTENING PROGRESS
  // ============================================================================

  static async updateListeningProgress(progressData: {
    answerId: string;
    positionSeconds: number;
    completed?: boolean;
  }): Promise<void> {
    const user = await requireAuth();
    
    // Check if progress record exists
    const existingProgress = await getListeningProgressByUser(user.id);
    const progressRecord = existingProgress.find(p => p.answer_id === progressData.answerId);

    if (progressRecord) {
      await updateListeningProgress(progressRecord.id, {
        last_position_seconds: progressData.positionSeconds,
        completed: progressData.completed || false
      });
    } else {
      await createListeningProgress({
        answer_id: progressData.answerId,
        user_id: user.id,
        last_position_seconds: progressData.positionSeconds,
        completed: progressData.completed || false
      });
    }
  }

  static async markAnswerCompleted(answerId: string): Promise<void> {
    const user = await requireAuth();
    await markAnswerAsCompleted(answerId, user.id);
  }

  // ============================================================================
  // THERAPIST INTEGRATION
  // ============================================================================

  static async assignTherapist(assignmentData: {
    projectId: string;
    therapistId: string;
    assignmentTitle: string;
    assignmentDescription?: string;
  }): Promise<{
    relationship: Tables<'therapy_relationships'>;
    assignment: Tables<'therapy_assignments'>;
  }> {
    const user = await requireAuth();
    return assignTherapistToProject(
      assignmentData.projectId,
      user.id,
      assignmentData.therapistId,
      assignmentData.assignmentTitle,
      assignmentData.assignmentDescription
    );
  }

  static async getProjectTherapist(projectId: string): Promise<{
    therapist: Tables<'therapists'> | null;
    relationship: Tables<'therapy_relationships'> | null;
    assignments: Tables<'therapy_assignments'>[];
  }> {
    return getTherapistForProject(projectId);
  }

  static async createTherapyAssignment(assignmentData: {
    answerId: string;
    therapistId: string;
    title: string;
    description?: string;
  }): Promise<Tables<'therapy_assignments'>> {
    return createTherapyAssignmentForAnswer(
      assignmentData.answerId,
      assignmentData.therapistId,
      assignmentData.title,
      assignmentData.description
    );
  }

  // ============================================================================
  // EMOTIONAL JOURNEY TRACKING
  // ============================================================================

  static async trackEmotionalJourney(journeyData: {
    projectId: string;
    sessionId?: string;
    answerId?: string;
    emotionalState: EmotionalState;
    intensity: number;
    note?: string;
  }): Promise<void> {
    const user = await requireAuth();
    
    await recordEmotionalJourney({
      projectId: journeyData.projectId,
      userId: user.id,
      sessionId: journeyData.sessionId,
      answerId: journeyData.answerId,
      emotionalState: journeyData.emotionalState,
      intensity: journeyData.intensity,
      note: journeyData.note
    });
  }

  static async getEmotionalJourney(projectId: string): Promise<any[]> {
    const user = await requireAuth();
    return getEmotionalJourney(projectId, user.id);
  }

  // ============================================================================
  // AUDIO MANAGEMENT
  // ============================================================================

  static async uploadAudio(audioData: {
    file: File;
    projectId: string;
    sessionId: string;
    answerId: string;
    onProgress?: (progress: number) => void;
  }): Promise<{ url: string; path: string; size: number }> {
    return uploadAudioFile(
      audioData.file,
      audioData.projectId,
      audioData.sessionId,
      audioData.answerId,
      audioData.onProgress
    );
  }

  static async getAudioUrl(filePath: string): Promise<string> {
    return getAudioFileUrl(filePath);
  }

  static async downloadAudio(filePath: string, onProgress?: (progress: number) => void): Promise<Blob> {
    return downloadAudioFile(filePath, onProgress);
  }

  static async validateAudioFile(file: File): Promise<{ valid: boolean; error?: string }> {
    return validateAudioFile(file);
  }

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  static async getCurrentUser() {
    return getCurrentUser();
  }

  static async getUserProfile() {
    return getUserProfile();
  }

  static async updateProfile(updates: Partial<Tables<'profiles'>>) {
    return updateUserProfile(updates);
  }

  static async signOut() {
    return signOut();
  }

  static async isAuthenticated() {
    return isAuthenticated();
  }

  static formatFileSize(bytes: number): string {
    return formatFileSize(bytes);
  }

  static formatDuration(seconds: number): string {
    return formatDuration(seconds);
  }
}

// Export individual functions for direct use
export {
  // Recording operations
  createLegacyProject,
  getLegacyProject,
  getLegacyProjectsByOwner,
  updateLegacyProject,
  deleteLegacyProject,
  createRecordingSession,
  getRecordingSession,
  getRecordingSessionsByProject,
  endRecordingSession,
  createAnswer,
  getAnswer,
  getAnswersBySession,
  getAnswersByProject,
  skipQuestion,
  calculateProjectCompletion,

  // Recipient operations
  createLegacyAccess,
  checkRecipientAccess,
  createReaction,
  getReactionsByAnswer,
  createProcessingNote,
  getProcessingNotesByProject,
  updateListeningProgress,
  markAnswerAsCompleted,

  // Question operations
  getQuestionsForSession,
  getQuestionCategories,
  getQuestionProgress,
  seedQuestions,

  // Therapist operations
  assignTherapistToProject,
  getTherapistForProject,
  createTherapyAssignmentForAnswer,

  // Auth operations
  getCurrentUser,
  signUpRecorder,
  signUpRecipient,
  signUpTherapist,
  signIn,
  signOut,
  getUserProfile,
  updateUserProfile,
  handleDeathCertificate,
  checkReleaseConditions,

  // Storage operations
  uploadAudioFile,
  getAudioFileUrl,
  downloadAudioFile,
  validateAudioFile,
  formatFileSize,
  formatDuration
};
