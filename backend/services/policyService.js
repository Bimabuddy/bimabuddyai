const pdf = require('pdf-parse');
const fs = require('fs');
const path = require('path');

class PolicyService {
  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    if (!this.openaiApiKey) {
      console.warn('OpenAI API key not configured. Using mock responses.');
    }
  }

  async analyzePolicy(file) {
    try {
      console.log('Analyzing policy file:', file.originalname);
      
      // Extract text from PDF
      const pdfText = await this.extractPDFText(file.path);
      
      if (!this.openaiApiKey) {
        return this.getMockAnalysis(pdfText);
      }
      
      // Use OpenAI for analysis (mock implementation for now)
      const analysis = await this.analyzeWithAI(pdfText);
      
      // Clean up uploaded file
      fs.unlinkSync(file.path);
      
      return analysis;
    } catch (error) {
      // Clean up file on error
      if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      throw error;
    }
  }

  async extractPDFText(filePath) {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdf(dataBuffer);
      return data.text;
    } catch (error) {
      console.error('PDF extraction error:', error);
      throw new Error('Failed to extract text from PDF');
    }
  }

  async analyzeWithAI(policyText) {
    // For now, return mock analysis. In production, this would call OpenAI API
    return this.getMockAnalysis(policyText);
  }

  getMockAnalysis(policyText) {
    return {
      summary: {
        sumInsured: '₹5,00,000',
        roomRentLimit: '₹2,000 per day',
        waitingPeriod: '30 days for new illnesses, 48 months for pre-existing diseases',
        coPay: '10% for senior citizens (60+ years)',
        keyExclusions: [
          'Pre-existing diseases for first 48 months',
          'Cosmetic treatments and plastic surgery',
          'Dental treatment unless due to accident',
          'Non-allopathic treatments',
          'Self-inflicted injuries or suicide attempts'
        ]
      },
      simplifiedClauses: [
        {
          originalText: 'The Company shall not be liable to make any payment under this Policy in respect of any expenses whatsoever incurred by any Insured Person in connection with or in respect of treatment of Pre-Existing Diseases until 48 months of continuous coverage has elapsed.',
          simplifiedText: 'If you already have any diseases before buying this policy, the company will not pay for their treatment for the first 4 years.',
          analogy: 'Think of it like planting a fruit tree. You cannot eat the fruit immediately; you have to wait for the tree to grow and bear fruit.',
          pageNumber: 12,
          clauseNumber: '3.1'
        },
        {
          originalText: 'The sum insured under this policy shall be reduced by the amount of claim paid during the policy period and shall be reinstated at the time of renewal.',
          simplifiedText: 'If you make a claim during the year, your coverage amount will reduce. It will be restored back to the original amount when you renew the policy.',
          analogy: 'Imagine your insurance coverage is like a water tank. When you use water (make a claim), the level goes down. When you renew, the tank gets filled back to the top.',
          pageNumber: 8,
          clauseNumber: '2.3'
        },
        {
          originalText: 'No claim shall be payable for any hospitalization within 30 days from the commencement date of the policy, except for accidents.',
          simplifiedText: 'For the first 30 days after buying the policy, you cannot claim for any hospitalization, except if it\'s due to an accident.',
          analogy: 'It\'s like a new phone warranty - you get some coverage immediately (accidents), but for other issues, you need to wait 30 days.',
          pageNumber: 10,
          clauseNumber: '2.8'
        }
      ],
      fullText: policyText
    };
  }

  async answerQuestion(question, policyText) {
    if (!this.openaiApiKey) {
      return this.getMockAnswer(question);
    }

    try {
      // In production, this would use OpenAI API with RAG
      return this.getMockAnswer(question);
    } catch (error) {
      console.error('Q&A error:', error);
      throw new Error('Failed to process question');
    }
  }

  getMockAnswer(question) {
    const lowerQuestion = question.toLowerCase();
    
    // Simple keyword-based matching for demo
    if (lowerQuestion.includes('diabetes') || lowerQuestion.includes('pre-existing')) {
      return {
        answer: 'No, this policy does not cover pre-existing diseases like diabetes for the first 48 months (4 years) from the policy start date. After 48 months of continuous coverage, diabetes treatment will be covered.',
        source: {
          page: 12,
          paragraph: 1,
          clause: '3.1'
        },
        confidence: 0.95
      };
    }
    
    if (lowerQuestion.includes('accident') || lowerQuestion.includes('emergency')) {
      return {
        answer: 'Yes, accident-related hospitalization is covered from day 1 of the policy, even within the initial 30-day waiting period. Emergency ambulance charges up to ₹2,000 are also covered.',
        source: {
          page: 10,
          paragraph: 3,
          clause: '2.8'
        },
        confidence: 0.92
      };
    }
    
    if (lowerQuestion.includes('room rent') || lowerQuestion.includes('hospital room')) {
      return {
        answer: 'This policy covers room rent up to ₹2,000 per day. If you choose a room with higher rent, you will need to pay the difference from your own pocket.',
        source: {
          page: 7,
          paragraph: 2,
          clause: '2.1'
        },
        confidence: 0.88
      };
    }
    
    return {
      answer: 'Based on the policy document, I can see information about coverage limits, exclusions, and claim procedures. However, for your specific question about "' + question + '", I recommend reviewing the policy terms carefully or contacting your insurance provider directly for clarification.',
      source: {
        page: 1,
        paragraph: 1
      },
      confidence: 0.45
    };
  }
}

module.exports = new PolicyService();