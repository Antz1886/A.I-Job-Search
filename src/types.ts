export type ViewType = 'dashboard' | 'tracker' | 'saved' | 'profile' | 'analysis' | 'market';

export type ApplicationStatus = 'saved' | 'applied' | 'interviewing' | 'offer' | 'rejected';

export interface ApplicationTrackerEntry {
  jobId: string;
  jobTitle: string;
  company: string;
  location: string;
  salary?: string;
  matchScore?: number;
  applicationLink?: string;
  status: ApplicationStatus;
  appliedDate?: string;
  interviewDate?: string;
  offerDate?: string;
  notes?: string;
  lastUpdated: string;
  customAdded?: boolean;
}

export interface JobMatch {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  salary?: string;
  matchScore: number;
  probabilityOfSuccess: 'HIGH' | 'MEDIUM' | 'LOW';
  whyMatches: string[];
  keyGaps: string[];
  applicationLink: string;
  postedDate?: string;
}

export type JobOpportunity = JobMatch;

export interface DailyReport {
  summary: {
    totalJobsFound: number;
    highMatches: number;
    mediumMatches: number;
  };
  topMatches: JobMatch[];
  secondaryMatches: JobMatch[];
  recommendedActions: {
    immediateApplications: string[];
    cvTweaks: string[];
  };
}

export interface CandidateProfile {
  name: string;
  location: string;
  targetSalary: string;
  targetRoles: string[];
  experienceSummary: string;
  companiesWorkedAt: string[];
  keySkills: string[];
}

export interface OptimizedSummary {
  style: string;
  summaryText: string;
}

export interface RecommendedBulletPoint {
  originalConcept: string;
  enhancedBullet: string;
  targetRole: string;
  addedKeywords: string[];
}

export interface ATSAnalysis {
  overallAtsScore: number;
  keywordMatchRate: number;
  formattingScore: number;
  impactScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  formattingSuggestions: string[];
  executivePitch: string;
  optimizedSummaries?: OptimizedSummary[];
  recommendedBulletPoints?: RecommendedBulletPoint[];
  suggestedSkillsToAdd?: string[];
}

export interface CoverLetter {
  jobTitle: string;
  company: string;
  letterText: string;
  keyHighlightsUsed: string[];
}

export interface InterviewQuestion {
  question: string;
  category: 'Technical' | 'Behavioral' | 'Leadership' | 'Scenario';
  modelAnswerStar: string;
  keyTip: string;
}

export interface InterviewPrep {
  targetRole: string;
  questions: InterviewQuestion[];
}

export interface FullCVDraft {
  fullName: string;
  headline: string;
  executiveSummary: string;
  coreCompetencies: string[];
  impactBullets: string[];
  suggestedCertifications: string[];
  fullMarkdownCV: string;
}

export interface SalaryBenchmark {
  role: string;
  minSalary: string;
  medianSalary: string;
  maxSalary: string;
  demandTrend: 'HIGH' | 'STABLE' | 'EMERGING';
  topSkills: string[];
}

export interface ProfilePreset {
  id: string;
  name?: string;
  title?: string;
  category?: string;
  description: string;
  profile: CandidateProfile;
}

export interface SavedProfileRecord {
  id: string;
  name: string;
  targetRole: string;
  profile: CandidateProfile;
  updatedAt: string;
}

export interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filter: 'ALL' | 'HIGH' | 'MEDIUM';
  createdAt: string;
  newMatchesCount: number;
  lastCheckedJobIds: string[];
  hasNewAlert?: boolean;
}


