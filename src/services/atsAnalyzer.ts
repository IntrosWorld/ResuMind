import { ATSScore, ATSCriteria } from '@/types';

export class ATSAnalyzerService {
  static analyzeResume(resumeText: string): ATSScore {
    const criteria: Record<string, ATSCriteria> = {};
    const strengths: string[] = [];
    const improvements: string[] = [];
    let totalScore = 0;

    // 1. Contact Information (8 points)
    const contactScore = this.checkContactInfo(resumeText);
    criteria['contact'] = {
      name: 'Contact Information',
      score: contactScore,
      maxScore: 8,
      feedback:
        contactScore >= 6
          ? 'Complete contact information found'
          : 'Missing some contact details (email, phone, LinkedIn)',
      passed: contactScore >= 6,
    };
    totalScore += contactScore;

    if (contactScore >= 6) {
      strengths.push('Complete contact information provided');
    } else {
      improvements.push(
        'Add missing contact details (email, phone, LinkedIn profile)'
      );
    }

    // 2. Keywords & Skills (25 points) - CRITICAL FOR ATS
    const keywordsScore = this.checkKeywordsAndSkills(resumeText);
    criteria['keywords'] = {
      name: 'Keywords & Skills Match',
      score: keywordsScore,
      maxScore: 25,
      feedback:
        keywordsScore >= 20
          ? 'Strong keyword optimization with industry-relevant terms'
          : 'Insufficient keywords - add role-specific technical skills and industry terms',
      passed: keywordsScore >= 20,
    };
    totalScore += keywordsScore;

    if (keywordsScore >= 20) {
      strengths.push('Excellent keyword density and technical skill coverage');
    } else {
      improvements.push(
        'Mirror keywords from target job descriptions. Include both full terms and acronyms (e.g., "Search Engine Optimization (SEO)")'
      );
    }

    // 3. Work Experience & Quantifiable Achievements (22 points)
    const experienceScore = this.checkWorkExperience(resumeText);
    criteria['experience'] = {
      name: 'Work Experience & Achievements',
      score: experienceScore,
      maxScore: 22,
      feedback:
        experienceScore >= 18
          ? 'Well-documented work experience with quantifiable achievements'
          : 'Add more measurable results with specific metrics and numbers',
      passed: experienceScore >= 18,
    };
    totalScore += experienceScore;

    if (experienceScore >= 18) {
      strengths.push('Strong work history with quantifiable impact statements');
    } else {
      improvements.push(
        'Use the formula: Action Verb + Task + Measurable Result (e.g., "Increased revenue by 30% through new marketing strategy")'
      );
    }

    // 4. Education & Certifications (8 points)
    const educationScore = this.checkEducation(resumeText);
    criteria['education'] = {
      name: 'Education & Certifications',
      score: educationScore,
      maxScore: 8,
      feedback:
        educationScore >= 6
          ? 'Education and certifications properly documented'
          : 'Add degree, institution, graduation date, and relevant certifications',
      passed: educationScore >= 6,
    };
    totalScore += educationScore;

    if (educationScore >= 6) {
      strengths.push('Complete education and certification information');
    } else {
      improvements.push('Include all degrees, certifications, and professional development courses');
    }

    // 5. ATS-Friendly Formatting (15 points) - CRITICAL
    const formattingScore = this.checkFormatting(resumeText);
    criteria['formatting'] = {
      name: 'ATS-Friendly Formatting',
      score: formattingScore,
      maxScore: 15,
      feedback:
        formattingScore >= 12
          ? 'Clean formatting optimized for ATS parsing'
          : 'Avoid tables, columns, headers/footers, and graphics. Use standard section headings',
      passed: formattingScore >= 12,
    };
    totalScore += formattingScore;

    if (formattingScore >= 12) {
      strengths.push('Resume uses ATS-parseable formatting');
    } else {
      improvements.push(
        'Use reverse-chronological format with standard headings: Summary, Experience, Education, Skills. Avoid text boxes and special characters'
      );
    }

    // 6. Resume Length & Density (7 points)
    const lengthScore = this.checkLength(resumeText);
    criteria['length'] = {
      name: 'Resume Length & Content Density',
      score: lengthScore,
      maxScore: 7,
      feedback:
        lengthScore >= 5
          ? 'Optimal resume length (1-2 pages, 400-800 words)'
          : 'Resume is too short (lacking detail) or too long (unfocused)',
      passed: lengthScore >= 5,
    };
    totalScore += lengthScore;

    if (lengthScore >= 5) {
      strengths.push('Appropriate resume length with focused content');
    } else {
      improvements.push('Target 1 page for <10 years experience, 2 pages for 10+ years');
    }

    // 7. Action Verbs & Impact Language (10 points)
    const actionVerbsScore = this.checkActionVerbs(resumeText);
    criteria['actionVerbs'] = {
      name: 'Action Verbs & Impact',
      score: actionVerbsScore,
      maxScore: 10,
      feedback:
        actionVerbsScore >= 8
          ? 'Strong action verbs demonstrate clear impact'
          : 'Replace passive language with powerful action verbs (Led, Achieved, Optimized, Spearheaded)',
      passed: actionVerbsScore >= 8,
    };
    totalScore += actionVerbsScore;

    if (actionVerbsScore >= 8) {
      strengths.push('Compelling action-oriented language throughout');
    } else {
      improvements.push('Start all bullet points with strong action verbs in past tense');
    }

    // 8. Professional Summary/Objective (5 points) - NEW
    const summaryScore = this.checkProfessionalSummary(resumeText);
    criteria['summary'] = {
      name: 'Professional Summary',
      score: summaryScore,
      maxScore: 5,
      feedback:
        summaryScore >= 4
          ? 'Clear professional summary with key qualifications'
          : 'Add a 2-3 sentence summary highlighting your value proposition',
      passed: summaryScore >= 4,
    };
    totalScore += summaryScore;

    if (summaryScore >= 4) {
      strengths.push('Strong professional summary captures key qualifications');
    } else {
      improvements.push('Add a summary at the top with your title, years of experience, and top skills');
    }

    const summary = this.generateSummary(totalScore);

    return {
      totalScore,
      criteria,
      strengths,
      improvements,
      summary,
    };
  }

  private static checkContactInfo(text: string): number {
    let score = 0;
    const lowerText = text.toLowerCase();

    // Check for email (CRITICAL)
    if (/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(text)) {
      score += 3;
    }

    // Check for phone number (CRITICAL)
    if (/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(text) || /\(\d{3}\)\s*\d{3}[-.]?\d{4}/.test(text)) {
      score += 3;
    }

    // Check for LinkedIn (Important for 2025 ATS)
    if (lowerText.includes('linkedin') || lowerText.includes('linkedin.com')) {
      score += 1;
    }

    // Check for location/address
    if (/\b[A-Z][a-z]+,\s*[A-Z]{2}\b/.test(text) || /\b\d{5}\b/.test(text)) {
      score += 1;
    }

    return Math.min(score, 8);
  }

  private static checkKeywordsAndSkills(text: string): number {
    let score = 0;
    const lowerText = text.toLowerCase();

    // Expanded keyword list based on 2025 ATS best practices
    const techKeywords = [
      'python', 'java', 'javascript', 'typescript', 'react', 'angular', 'vue', 'node.js',
      'flutter', 'dart', 'kotlin', 'swift', 'sql', 'nosql', 'mongodb', 'postgresql',
      'aws', 'azure', 'gcp', 'cloud', 'api', 'rest', 'graphql', 'microservices',
      'agile', 'scrum', 'kanban', 'git', 'docker', 'kubernetes', 'ci/cd', 'devops',
      'machine learning', 'ai', 'artificial intelligence', 'data analysis', 'data science',
      'project management', 'leadership', 'team management', 'stakeholder management',
      'testing', 'automation', 'security', 'performance optimization', 'scalability',
      'html', 'css', 'sass', 'webpack', 'redux', 'next.js', 'express', 'django', 'flask',
      'spring', 'hibernate', '.net', 'c#', 'c++', 'go', 'rust', 'ruby', 'rails', 'php',
    ];

    const softSkills = [
      'communication', 'collaboration', 'problem-solving', 'critical thinking',
      'leadership', 'teamwork', 'adaptability', 'time management', 'strategic planning',
    ];

    // Check for technical keywords (higher weight)
    let techKeywordCount = 0;
    for (const keyword of techKeywords) {
      if (lowerText.includes(keyword)) {
        techKeywordCount++;
      }
    }

    // Check for soft skills
    let softSkillCount = 0;
    for (const skill of softSkills) {
      if (lowerText.includes(skill)) {
        softSkillCount++;
      }
    }

    // Check for dedicated Skills section
    const hasSkillsSection = /\b(skills|technical skills|core competencies|expertise)\b/i.test(text);

    // Scoring based on keyword density (critical for ATS in 2025)
    if (techKeywordCount >= 15) {
      score = 20;
    } else if (techKeywordCount >= 12) {
      score = 17;
    } else if (techKeywordCount >= 9) {
      score = 14;
    } else if (techKeywordCount >= 6) {
      score = 11;
    } else if (techKeywordCount >= 3) {
      score = 8;
    } else {
      score = 4;
    }

    // Bonus for soft skills (up to 3 points)
    if (softSkillCount >= 4) {
      score += 3;
    } else if (softSkillCount >= 2) {
      score += 2;
    } else if (softSkillCount >= 1) {
      score += 1;
    }

    // Bonus for having a dedicated skills section (2 points)
    if (hasSkillsSection) {
      score += 2;
    }

    return Math.min(score, 25);
  }

  private static checkWorkExperience(text: string): number {
    let score = 0;
    const lowerText = text.toLowerCase();

    // Check for Experience section header (4 points)
    if (
      lowerText.includes('experience') ||
      lowerText.includes('employment') ||
      lowerText.includes('work history') ||
      lowerText.includes('professional experience')
    ) {
      score += 4;
    }

    // Check for professional job titles (5 points)
    const jobTitlePatterns = [
      'developer', 'engineer', 'manager', 'director', 'analyst', 'designer',
      'consultant', 'specialist', 'coordinator', 'lead', 'senior', 'architect',
      'administrator', 'technician', 'associate', 'executive', 'officer',
    ];

    let titleCount = 0;
    for (const title of jobTitlePatterns) {
      if (lowerText.includes(title)) {
        titleCount++;
      }
    }
    if (titleCount >= 3) {
      score += 5;
    } else if (titleCount >= 1) {
      score += 3;
    }

    // Check for quantifiable metrics (CRITICAL - 8 points)
    const metricPatterns = [
      /\d+%/g,  // Percentages (30%, 50%)
      /\$\d+[KMB]?/g,  // Dollar amounts ($50K, $2M)
      /\d+\+?\s*(users|customers|clients|employees|team members)/gi,
      /\d+x/gi,  // Multipliers (2x, 10x)
    ];

    let metricCount = 0;
    for (const pattern of metricPatterns) {
      const matches = text.match(pattern);
      if (matches) {
        metricCount += matches.length;
      }
    }

    if (metricCount >= 5) {
      score += 8;
    } else if (metricCount >= 3) {
      score += 6;
    } else if (metricCount >= 1) {
      score += 3;
    }

    // Check for proper date formatting (5 points)
    const hasDateRanges = /\d{4}\s*[-–]\s*\d{4}/.test(text) ||
                         /\d{4}\s*[-–]\s*(Present|Current)/i.test(text) ||
                         /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}/i.test(text);

    if (hasDateRanges) {
      score += 5;
    }

    return Math.min(score, 22);
  }

  private static checkEducation(text: string): number {
    let score = 0;
    const lowerText = text.toLowerCase();

    // Check for Education section header (2 points)
    if (lowerText.includes('education')) {
      score += 2;
    }

    // Check for degree types (3 points)
    const degrees = [
      'bachelor', 'master', 'phd', 'doctorate', 'associate', 'diploma',
      'b.s.', 'm.s.', 'b.a.', 'm.a.', 'mba', 'b.sc', 'm.sc', 'b.tech', 'm.tech',
    ];

    for (const degree of degrees) {
      if (lowerText.includes(degree)) {
        score += 3;
        break;
      }
    }

    // Check for graduation year (1 point)
    if (/\b(19|20)\d{2}\b/.test(text)) {
      score += 1;
    }

    // Check for certifications (2 points) - Important for 2025 ATS
    const certificationKeywords = [
      'certification', 'certified', 'certificate', 'credential',
      'aws certified', 'pmp', 'cissp', 'comptia', 'scrum master',
      'google certified', 'microsoft certified', 'oracle certified',
    ];

    for (const cert of certificationKeywords) {
      if (lowerText.includes(cert)) {
        score += 2;
        break;
      }
    }

    return Math.min(score, 8);
  }

  private static checkFormatting(text: string): number {
    let score = 15;

    const specialCharCount = (text.match(/[■●★▪►◆]/g) || []).length;
    if (specialCharCount > 10) {
      score -= 5;
    }

    const headers = ['experience', 'education', 'skills', 'summary'];
    let headerCount = 0;
    for (const header of headers) {
      if (text.toLowerCase().includes(header)) {
        headerCount++;
      }
    }
    if (headerCount < 2) {
      score -= 5;
    }

    return Math.max(score, 0);
  }

  private static checkLength(text: string): number {
    const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;

    // Based on 2025 ATS standards: 1-2 pages = 400-800 words optimal
    if (wordCount >= 400 && wordCount <= 800) {
      return 7;
    } else if (wordCount >= 300 && wordCount < 400) {
      return 6;
    } else if (wordCount > 800 && wordCount <= 1000) {
      return 5;
    } else if (wordCount >= 200 && wordCount < 300) {
      return 4;
    } else if (wordCount > 1000 && wordCount <= 1200) {
      return 3;
    } else {
      return 2;
    }
  }

  private static checkActionVerbs(text: string): number {
    let score = 0;
    const lowerText = text.toLowerCase();

    // Expanded list of power action verbs for 2025 ATS
    const actionVerbs = [
      'led', 'developed', 'created', 'managed', 'implemented', 'designed', 'built',
      'improved', 'increased', 'reduced', 'achieved', 'delivered', 'launched',
      'collaborated', 'coordinated', 'spearheaded', 'orchestrated', 'pioneered',
      'optimized', 'streamlined', 'transformed', 'drove', 'executed', 'established',
      'accelerated', 'scaled', 'architected', 'engineered', 'automated', 'migrated',
      'deployed', 'integrated', 'analyzed', 'resolved', 'enhanced', 'generated',
      'facilitated', 'mentored', 'trained', 'directed', 'supervised', 'oversaw',
    ];

    let verbCount = 0;
    for (const verb of actionVerbs) {
      if (lowerText.includes(verb)) {
        verbCount++;
      }
    }

    // Higher standards for 2025 - need more variety in action verbs
    if (verbCount >= 12) {
      score = 10;
    } else if (verbCount >= 9) {
      score = 8;
    } else if (verbCount >= 6) {
      score = 6;
    } else if (verbCount >= 4) {
      score = 4;
    } else if (verbCount >= 2) {
      score = 2;
    } else {
      score = 1;
    }

    return score;
  }

  private static checkProfessionalSummary(text: string): number {
    let score = 0;
    const lowerText = text.toLowerCase();

    // Check for summary/objective section keywords (2 points)
    const summaryKeywords = [
      'summary', 'professional summary', 'career summary', 'profile',
      'objective', 'career objective', 'professional profile', 'about',
    ];

    let hasSummarySection = false;
    for (const keyword of summaryKeywords) {
      if (lowerText.includes(keyword)) {
        hasSummarySection = true;
        score += 2;
        break;
      }
    }

    // Check for years of experience mention (1 point)
    if (/\d+[\+]?\s*(years?|yrs?)(\s+of)?\s+(experience|expertise)/i.test(text)) {
      score += 1;
    }

    // Check for professional title/role (1 point)
    const titleIndicators = [
      'software engineer', 'developer', 'manager', 'analyst', 'designer',
      'consultant', 'specialist', 'director', 'architect', 'lead',
    ];

    for (const title of titleIndicators) {
      if (lowerText.includes(title)) {
        score += 1;
        break;
      }
    }

    // Bonus for having value proposition keywords (1 point)
    const valueKeywords = [
      'proven', 'experienced', 'skilled', 'expertise in', 'specializing in',
      'passionate', 'dedicated', 'results-driven', 'track record',
    ];

    for (const keyword of valueKeywords) {
      if (lowerText.includes(keyword)) {
        score += 1;
        break;
      }
    }

    return Math.min(score, 5);
  }

  private static generateSummary(score: number): string {
    if (score >= 80) {
      return 'Excellent! Your resume is highly ATS-optimized and should perform well in automated screening systems. You have a strong match rate.';
    } else if (score >= 65) {
      return 'Good! Your resume is ATS-friendly with minor improvements needed to maximize your chances. You\'re above the 65% success threshold.';
    } else if (score >= 50) {
      return 'Fair. Your resume needs several improvements to pass through ATS systems effectively. Focus on keywords and formatting.';
    } else {
      return 'Needs Improvement. Significant changes are required to make your resume ATS-compatible. Priority: add keywords and quantifiable achievements.';
    }
  }
}
