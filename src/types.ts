export type ViewType = 'dashboard' | 'profile' | 'analysis' | 'market' | 'saved';

export type ApplicationStatus = 'saved' | 'applied' | 'interviewing' | 'offered' | 'rejected';

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
  status?: ApplicationStatus; // application tracking pipeline status
  notes?: string;              // user custom notes
}

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

export interface ATSAnalysis {
  overallAtsScore: number;
  keywordMatchRate: number;
  formattingScore: number;
  impactScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  formattingSuggestions: string[];
  executivePitch: string;
}

export interface JobSpecificATS {
  jobTitle: string;
  company: string;
  matchScore: number;
  probabilityOfSuccess: 'HIGH' | 'MEDIUM' | 'LOW';
  matchedKeywords: string[];
  missingKeywords: string[];
  gapAnalysis: string[];
  coverLetter: string;
}

export interface SalaryBenchmark {
  role: string;
  minSalary: string;
  medianSalary: string;
  maxSalary: string;
  demandTrend: 'HIGH' | 'STABLE' | 'EMERGING';
  topSkills: string[];
}
