import { GoogleGenerativeAI } from '@google/generative-ai';
import type { GenerativeModel } from '@google/generative-ai';
import { ATSScore, AnalysisResult } from '@/types';
import { ATSAnalyzerService } from './atsAnalyzer';

export class GeminiService {
  private model: GenerativeModel;

  constructor() {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      throw new Error('GEMINI_API_KEY not found or invalid in environment variables');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelName = process.env.NEXT_PUBLIC_GEMINI_MODEL || 'gemini-2.0-flash';
    this.model = genAI.getGenerativeModel({ model: modelName });
  }

  async analyzeResume(resumeText: string): Promise<AnalysisResult> {
    try {
      // First, get the ATS score using predefined rules
      const atsScore = ATSAnalyzerService.analyzeResume(resumeText);

      // Then use Gemini for detailed qualitative analysis
      const prompt = this.buildAnalysisPrompt(resumeText, atsScore);

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const geminiAnalysis = response.text();

      return {
        atsScore,
        aiAnalysis: geminiAnalysis,
        detailedFeedback: this.parseGeminiResponse(geminiAnalysis),
      };
    } catch (error) {
      throw new Error(
        `Failed to analyze resume: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  private buildAnalysisPrompt(resumeText: string, atsScore: ATSScore): string {
    return `You are an expert resume coach. Analyze this resume and provide concise, actionable improvement advice.

RESUME TEXT:
${resumeText}

CURRENT ATS SCORE: ${atsScore.totalScore}/100

CONTEXT:
${atsScore.summary}

YOUR TASK:
Write a brief, focused analysis (250-350 words max) that tells the candidate exactly what to improve. Use this structure:

OVERVIEW
[One paragraph: What's working well and the main issue holding this resume back]

TOP 3 IMPROVEMENTS

1. [Title]
What to do: [Specific action in 1-2 sentences]
Example: [Quick before/after or concrete example]

2. [Title]
What to do: [Specific action in 1-2 sentences]
Example: [Quick before/after or concrete example]

3. [Title]
What to do: [Specific action in 1-2 sentences]
Example: [Quick before/after or concrete example]

QUICK WINS
[One short paragraph listing 2-3 easy changes they can make today]

WRITING GUIDELINES:
- NO emojis, keep it professional
- Use UPPERCASE for section headers only
- Write in clear, short paragraphs (3-4 lines max)
- Be direct and specific - focus on WHAT TO CHANGE, not explanations
- Reference actual content from the resume
- Skip generic advice - make it personal to this resume
- Keep total response under 350 words
- Use conversational but professional tone

Focus on the highest-impact changes that will improve their ATS score and get them interviews.`;
  }

  private parseGeminiResponse(response: string): {
    sections: Record<string, string>;
    fullText: string;
  } {
    const sections: Record<string, string> = {};
    const lines = response.split('\n');
    let currentSection = 'general';
    let currentContent: string[] = [];

    for (const line of lines) {
      if (line.trim().startsWith('**') && line.trim().endsWith('**')) {
        if (currentContent.length > 0) {
          sections[currentSection] = currentContent.join('\n').trim();
        }
        currentSection = line.replaceAll('**', '').trim().toLowerCase();
        currentContent = [];
      } else {
        currentContent.push(line);
      }
    }

    if (currentContent.length > 0) {
      sections[currentSection] = currentContent.join('\n').trim();
    }

    return {
      sections,
      fullText: response,
    };
  }

  async getImprovementSuggestions(
    resumeText: string,
    criteriaName: string
  ): Promise<string[]> {
    try {
      const prompt = `
Analyze this resume and provide 3-5 specific, actionable suggestions to improve the "${criteriaName}" aspect:

RESUME TEXT:
${resumeText}

Provide only a bulleted list of concrete suggestions. Be specific and actionable.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const suggestions = response.text();

      return suggestions
        .split('\n')
        .filter((line) => line.trim())
        .filter((line) => line.includes('•') || line.includes('-') || line.includes('*'))
        .map((line) => line.replace(/^[•\-*]\s*/, '').trim());
    } catch (error) {
      return [`Unable to generate suggestions: ${error}`];
    }
  }

  async getTailoredAdvice(resumeText: string, targetRole: string): Promise<string> {
    try {
      const prompt = `
This candidate is targeting a ${targetRole} position. Review their resume and provide specific advice on:

1. How to better tailor this resume for ${targetRole} roles
2. What keywords or skills are missing for this target role
3. How to restructure accomplishments to appeal to ${targetRole} hiring managers

RESUME TEXT:
${resumeText}

Keep your response concise and actionable (200-300 words).
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      return `Unable to generate advice: ${error}`;
    }
  }
}
