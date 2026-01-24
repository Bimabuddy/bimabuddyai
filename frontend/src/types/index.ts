export interface PolicySummary {
  sumInsured: string;
  roomRentLimit: string;
  waitingPeriod: string;
  coPay: string;
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