export interface ATSCriteria {
  name: string;
  score: number;
  maxScore: number;
  feedback: string;
  passed: boolean;
}

export interface ATSScore {
  totalScore: number;
  criteria: Record<string, ATSCriteria>;
  strengths: string[];
  improvements: string[];
  summary: string;
}

export interface AnalysisResult {
  atsScore: ATSScore;
  aiAnalysis: string;
  detailedFeedback: {
    sections: Record<string, string>;
    fullText: string;
  };
}
