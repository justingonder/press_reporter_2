export enum Stage {
  UNSUBMITTED = 'STAGE_UNSUBMITTED',
  UNASSIGNED = 'STAGE_UNASSIGNED',
  ASSIGNED = 'STAGE_ASSIGNED',
  UNDER_REVIEW = 'STAGE_UNDER_REVIEW',
  UNDER_REVISION = 'STAGE_UNDER_REVISION',
  ACCEPTED = 'STAGE_ACCEPTED',
  REJECTED = 'STAGE_REJECTED',
  PUBLISHED = 'STAGE_PUBLISHED',
}

export interface Journal {
  id: number;
  code: string;
  name: string;
  articles: Article[];
}

export interface Article {
  id: number;
  title: string;
  date_submitted: string; // ISO Date
  stage: Stage;
  editor_assignments: EditorAssignment[];
  reviews: ReviewAssignment[];
}

export interface EditorAssignment {
  id: number;
  editor_name: string;
  editor_type: 'editor' | 'section-editor' | 'guest-editor';
  date_assigned: string;
}

export interface ReviewAssignment {
  id: number;
  reviewer_name: string;
  date_assigned: string;
  date_accepted?: string;
  date_declined?: string;
  date_complete?: string; // When the reviewer finished
  is_complete: boolean;
  decision?: string;
}

export interface AlertConfig {
  unassignedThresholdDays: number;
  reviewStalledThresholdDays: number;
  criticalColor: string; // Hex
  warningColor: string; // Hex
  healthyColor: string; // Hex
}

export interface ProcessedJournalStats {
  journalId: number;
  journalName: string;
  unassignedCount: number;
  stalledReviewCount: number;
  oldestUnassignedDays: number;
  oldestStalledReviewDays: number;
  status: 'critical' | 'warning' | 'healthy';
}
