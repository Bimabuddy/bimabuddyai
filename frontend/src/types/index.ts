export interface KeyFeature {
  label: string;
  value: string;
  category: 'financial' | 'coverage' | 'limitation' | 'exclusion' | 'other';
}

export interface PolicySummary {
  title: string;
  overview: string;
  keyFeatures: KeyFeature[];
  keyExclusions: string[];
}

export interface SimplifiedClause {
  originalText: string;
  simplifiedText: string;
  analogy: string;
  pageNumber: number;
  clauseNumber: string;
}

export interface PolicyAnalysis {
  summary: PolicySummary;
  simplifiedClauses: SimplifiedClause[];
  fullText: string;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
  supportsTTS?: boolean;
}

export interface QAResponse {
  answer: string;
  source: {
    page: number;
    paragraph: number;
    clause?: string;
  };
  confidence: number;
}