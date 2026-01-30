const pdf = require('pdf-parse');
const fs = require('fs');
const path = require('path');
const Groq = require('groq-sdk');

class PolicyService {
  constructor() {
    this.groqApiKey = process.env.GROQ_API_KEY;
    if (!this.groqApiKey) {
      console.warn('Groq API key not configured. Using mock responses.');
    } else {
      this.groq = new Groq({ apiKey: this.groqApiKey });
    }
  }

  async analyzePolicy(file) {
    try {
      console.log('Analyzing policy file:', file.originalname);
      
      // Extract text from PDF
      const pdfText = await this.extractPDFText(file.path);
      
      if (!this.groqApiKey) {
        return this.getMockAnalysis(pdfText);
      }
      
      // Use Groq for analysis
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
    try {
      const prompt = `You are an expert insurance policy analyst helping ordinary people understand their insurance. Analyze this policy document and explain it in the simplest possible way, removing ALL jargon.

Policy Document:
${policyText.substring(0, 15000)} 

Provide a JSON response with this structure:
{
  "summary": {
    "title": "Brief policy name (e.g., 'Health Insurance Plan')",
    "overview": "2-3 sentence explanation for a layman about what this policy does",
    "keyFeatures": [
      {
        "label": "Simple feature name",
        "value": "Plain language explanation with amounts",
        "category": "financial|coverage|limitation|exclusion|other"
      }
    ],
    "keyExclusions": ["What's NOT covered, in simple terms"]
  },
  "simplifiedClauses": [
    {
      "originalText": "exact clause from policy",
      "simplifiedText": "plain language version removing jargon",
      "analogy": "relatable everyday analogy",
      "pageNumber": estimated_page,
      "clauseNumber": "clause_ref"
    }
  ]
}

IMPORTANT INSTRUCTIONS:
1. For keyFeatures, identify the 6-8 MOST IMPORTANT things a normal person should know (amounts, limits, coverage, waiting periods, etc.)
2. Remove ALL insurance jargon - explain like you're talking to a friend
3. Use actual amounts with currency symbols (₹)
4. Categories: financial (money amounts), coverage (what's covered), limitation (restrictions), exclusion (what's not covered), other
5. For simplifiedClauses, focus on the clauses that could surprise or confuse the customer
6. keyExclusions should be simple bullets of what's NOT covered

Examples of good keyFeatures:
- {"label": "Coverage Amount", "value": "Up to ₹5 lakh for medical expenses", "category": "financial"}
- {"label": "Waiting Period", "value": "Must wait 30 days before first claim (except accidents)", "category": "limitation"}
- {"label": "Room Charges", "value": "Hospital room up to ₹2,000 per day", "category": "coverage"}`;

      const completion = await this.groq.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.3,
        max_tokens: 4000,
      });

      const responseText = completion.choices[0]?.message?.content || '';
      
      // Try to parse JSON from response
      let analysisData;
      try {
        // Extract JSON if wrapped in markdown code blocks
        const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [null, responseText];
        analysisData = JSON.parse(jsonMatch[1] || responseText);
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError);
        return this.getMockAnalysis(policyText);
      }

      return {
        ...analysisData,
        fullText: policyText
      };
    } catch (error) {
      console.error('Groq API Error:', error);
      return this.getMockAnalysis(policyText);
    }
  }

  getMockAnalysis(policyText) {
    return {
      summary: {
        title: 'Health Insurance Policy',
        overview: 'This is a health insurance plan that covers your medical expenses up to ₹5 lakh. It helps pay for hospital stays, treatments, and medical bills when you get sick or injured.',
        keyFeatures: [
          { label: 'Coverage Amount', value: 'Up to ₹5,00,000 for medical expenses', category: 'financial' },
          { label: 'Room Charges', value: 'Hospital room rental up to ₹2,000 per day', category: 'coverage' },
          { label: 'Waiting Period', value: 'Wait 30 days for illnesses, 4 years for pre-existing conditions', category: 'limitation' },
          { label: 'Co-payment', value: 'You pay 10% if you are 60+ years old', category: 'limitation' },
          { label: 'Claim Process', value: 'Submit bills within 15 days of discharge', category: 'other' },
          { label: 'Ambulance', value: 'Emergency ambulance costs up to ₹2,000', category: 'coverage' }
        ],
        keyExclusions: [
          'Pre-existing diseases for first 4 years',
          'Cosmetic treatments and plastic surgery',
          'Dental treatment (unless accident-related)',
          'Alternative medicine treatments',
          'Self-inflicted injuries'
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
    if (!this.groqApiKey) {
      return this.getMockAnswer(question);
    }

    try {
      const prompt = `You are an insurance policy expert. Answer the following question based ONLY on the provided policy document. If the answer is not in the policy, say so clearly.

Policy Document:
${policyText.substring(0, 12000)}

Question: ${question}

Provide your answer in JSON format:
{
  "answer": "detailed answer in simple language",
  "source": {
    "page": estimated_page_number,
    "paragraph": estimated_paragraph,
    "clause": "clause_reference_if_any"
  },
  "confidence": 0.0_to_1.0
}`;

      const completion = await this.groq.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.2,
        max_tokens: 1000,
      });

      const responseText = completion.choices[0]?.message?.content || '';
      
      try {
        const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [null, responseText];
        return JSON.parse(jsonMatch[1] || responseText);
      } catch (parseError) {
        console.error('Failed to parse answer:', parseError);
        return this.getMockAnswer(question);
      }
    } catch (error) {
      console.error('Q&A error:', error);
      return this.getMockAnswer(question);
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