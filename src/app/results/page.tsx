'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useAnimation } from 'framer-motion';
import { AnalysisResult, ATSCriteria } from '@/types';
import { getScoreColor, getScoreGradient } from '@/config/theme';

// Function to convert AI analysis text to formatted HTML
function formatAIAnalysis(text: string): string {
  // Convert text to HTML with proper formatting
  let html = text;

  // Convert UPPERCASE headers to styled headers
  html = html.replace(/^([A-Z][A-Z\s]+)$/gm, '<h2>$1</h2>');

  // Convert numbered lists
  html = html.replace(/^(\d+)\.\s+(.+)$/gm, '<li><strong>$2</strong></li>');

  // Convert bullet points
  html = html.replace(/^-\s+(.+)$/gm, '<li>$1</li>');

  // Convert bold markdown
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Wrap consecutive li elements in ul/ol
  html = html.replace(/(<li>(?:(?!<\/li>).|\n)*<\/li>\s*)+/g, (match) => {
    if (/<strong>/.test(match)) {
      return '<ol>' + match + '</ol>';
    }
    return '<ul>' + match + '</ul>';
  });

  // Convert line breaks to paragraphs
  html = html.split('\n\n').map(para => {
    if (para.trim() && !para.startsWith('<') && !para.match(/^[A-Z][A-Z\s]+$/)) {
      return '<p>' + para.trim() + '</p>';
    }
    return para;
  }).join('\n');

  return html;
}

export default function ResultsPage() {
  const router = useRouter();
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Get analysis result from sessionStorage
    const storedResult = sessionStorage.getItem('analysisResult');
    if (!storedResult) {
      router.push('/upload');
      return;
    }

    const result: AnalysisResult = JSON.parse(storedResult);
    setAnalysisResult(result);

    // Animate score
    const targetScore = result.atsScore.totalScore;
    const duration = 2000;
    const steps = 60;
    const increment = targetScore / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(step * increment, targetScore);
      setAnimatedScore(Math.round(current));

      if (step >= steps) {
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [router]);

  if (!analysisResult) {
    return null;
  }

  const { atsScore, aiAnalysis } = analysisResult;
  const criteriaArray = Object.entries(atsScore.criteria).map(([key, value]) => ({
    key,
    ...value,
  }));

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradient Background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #0F0F1E 0%, #16213E 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-6"
        >
          <button
            onClick={() => router.push('/upload')}
            className="text-white hover:text-[#4A90E2] transition-colors flex items-center"
          >
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>
          <h1 className="text-2xl font-bold text-white">Analysis Results</h1>
          <div className="w-20" /> {/* Spacer */}
        </motion.div>

        {/* Scrollable Content */}
        <div className="px-6 pb-12 max-w-6xl mx-auto">
          {/* ATS Score Circle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="flex justify-center my-12"
          >
            <div className="relative w-60 h-60">
              {/* Background Circle */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="120"
                  cy="120"
                  r="100"
                  stroke="rgba(156, 163, 175, 0.2)"
                  strokeWidth="16"
                  fill="none"
                />
                {/* Progress Circle */}
                <motion.circle
                  cx="120"
                  cy="120"
                  r="100"
                  stroke={`url(#scoreGradient${atsScore.totalScore})`}
                  strokeWidth="16"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: 628 }}
                  animate={{
                    strokeDashoffset: 628 - (628 * animatedScore) / 100,
                  }}
                  style={{
                    strokeDasharray: 628,
                  }}
                  transition={{ duration: 2, ease: 'easeOut' }}
                />
                <defs>
                  <linearGradient
                    id={`scoreGradient${atsScore.totalScore}`}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      stopColor={
                        atsScore.totalScore >= 85
                          ? '#10B981'
                          : atsScore.totalScore >= 70
                          ? '#4A90E2'
                          : atsScore.totalScore >= 55
                          ? '#F59E0B'
                          : '#EF4444'
                      }
                    />
                    <stop
                      offset="100%"
                      stopColor={
                        atsScore.totalScore >= 85
                          ? '#34D399'
                          : atsScore.totalScore >= 70
                          ? '#8B5CF6'
                          : atsScore.totalScore >= 55
                          ? '#FBBF24'
                          : '#F87171'
                      }
                    />
                  </linearGradient>
                </defs>
              </svg>

              {/* Score Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-6xl font-bold text-white"
                >
                  {animatedScore}
                </motion.div>
                <div className="text-[#9CA3AF] text-lg">ATS Score</div>
              </div>
            </div>
          </motion.div>

          {/* Summary Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-strong rounded-3xl p-6 mb-6"
          >
            <div className="flex items-start mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mr-4"
                style={{
                  background: 'linear-gradient(135deg, #4A90E2 0%, #8B5CF6 100%)',
                }}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-2">Summary</h2>
                <p className="text-white leading-relaxed">{atsScore.summary}</p>
              </div>
            </div>
          </motion.div>

          {/* Strengths Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-strong rounded-3xl p-6 mb-6"
            style={{
              borderWidth: '2px',
              borderStyle: 'solid',
              borderColor: '#10B981',
            }}
          >
            <div className="flex items-start mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mr-4"
                style={{
                  background: 'linear-gradient(135deg, #10B981 0%, #4A90E2 100%)',
                }}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-4">Strengths</h2>
                <div className="space-y-3">
                  {atsScore.strengths.map((strength, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="flex items-start"
                    >
                      <svg
                        className="w-5 h-5 text-[#10B981] mr-3 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <p className="text-white">{strength}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Improvements Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="glass-strong rounded-3xl p-6 mb-6"
            style={{
              borderWidth: '2px',
              borderStyle: 'solid',
              borderColor: '#F59E0B',
            }}
          >
            <div className="flex items-start mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mr-4"
                style={{
                  background: 'linear-gradient(135deg, #F59E0B 0%, #4A90E2 100%)',
                }}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-4">
                  Areas to Improve
                </h2>
                <div className="space-y-3">
                  {atsScore.improvements.map((improvement, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + index * 0.1 }}
                      className="flex items-start"
                    >
                      <svg
                        className="w-5 h-5 text-[#F59E0B] mr-3 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                      <p className="text-white">{improvement}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Detailed Breakdown */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mb-6"
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              Detailed Breakdown
            </h2>
            <div className="space-y-4">
              {criteriaArray.map((criterion, index) => (
                <motion.div
                  key={criterion.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="p-6 rounded-2xl"
                  style={{
                    background: 'linear-gradient(135deg, #1F1F3A 0%, #2A2A4A 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-white">
                      {criterion.name}
                    </h3>
                    <span
                      className="font-bold text-lg"
                      style={{
                        color: criterion.passed ? '#10B981' : '#F59E0B',
                      }}
                    >
                      {criterion.score}/{criterion.maxScore}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3 h-2 rounded-full overflow-hidden bg-gray-700">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(criterion.score / criterion.maxScore) * 100}%`,
                      }}
                      transition={{ delay: 1.2 + index * 0.1, duration: 0.8 }}
                      className="h-full rounded-full"
                      style={{
                        background: criterion.passed
                          ? 'linear-gradient(90deg, #10B981 0%, #34D399 100%)'
                          : 'linear-gradient(90deg, #F59E0B 0%, #FBBF24 100%)',
                      }}
                    />
                  </div>

                  <p className="text-[#9CA3AF]">{criterion.feedback}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* AI Analysis Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="glass-strong rounded-3xl p-8 mb-6"
            style={{
              borderWidth: '2px',
              borderStyle: 'solid',
              borderColor: '#8B5CF6',
            }}
          >
            <div className="flex items-start mb-6">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mr-4 flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #4A90E2 100%)',
                }}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-6">AI Insights</h2>
                <div
                  className="prose prose-invert max-w-none"
                  style={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  }}
                >
                  <style jsx>{`
                    .prose {
                      color: #E5E7EB;
                      line-height: 1.7;
                      font-size: 16px;
                      font-weight: 400;
                    }
                    .prose h1, .prose h2, .prose h3, .prose h4 {
                      color: #FFFFFF;
                      font-weight: 700;
                      letter-spacing: -0.01em;
                      margin-top: 2em;
                      margin-bottom: 1em;
                      line-height: 1.4;
                    }
                    .prose h2:first-child {
                      margin-top: 0;
                    }
                    .prose h1 {
                      font-size: 1.5rem;
                      border-bottom: 2px solid rgba(139, 92, 246, 0.3);
                      padding-bottom: 0.5em;
                    }
                    .prose h2 {
                      color: #A78BFA;
                      text-transform: uppercase;
                      font-weight: 700;
                      letter-spacing: 0.08em;
                      font-size: 0.75rem;
                      margin-bottom: 0.75em;
                      margin-top: 2.5em;
                    }
                    .prose h3 {
                      font-size: 1rem;
                      color: #F3F4F6;
                      font-weight: 600;
                    }
                    .prose strong {
                      color: #FFFFFF;
                      font-weight: 600;
                    }
                    .prose ul, .prose ol {
                      margin-top: 1em;
                      margin-bottom: 1.5em;
                      padding-left: 1.5em;
                      list-style-position: outside;
                    }
                    .prose li {
                      margin-top: 0.5em;
                      margin-bottom: 0.5em;
                      color: #D1D5DB;
                      line-height: 1.6;
                    }
                    .prose p {
                      margin-top: 0;
                      margin-bottom: 1.25em;
                      color: #D1D5DB;
                      line-height: 1.7;
                      text-align: left;
                    }
                    .prose p + p {
                      margin-top: 1.25em;
                    }
                    .prose ul > li::marker {
                      color: #8B5CF6;
                    }
                    .prose ol > li::marker {
                      color: #4A90E2;
                      font-weight: 700;
                    }
                    .prose ol > li {
                      padding-left: 0.5em;
                    }
                    .prose ol {
                      counter-reset: item;
                    }
                    .prose ol > li {
                      display: block;
                      margin-bottom: 1em;
                    }
                  `}</style>
                  <div dangerouslySetInnerHTML={{ __html: formatAIAnalysis(aiAnalysis) }} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
          >
            <button
              onClick={() => router.push('/upload')}
              className="w-full py-4 px-8 rounded-2xl font-bold text-lg text-white transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #4A90E2 0%, #8B5CF6 100%)',
                boxShadow: '0 10px 40px rgba(74, 144, 226, 0.4)',
              }}
            >
              <div className="flex items-center justify-center">
                <svg
                  className="w-6 h-6 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                Analyze Another Resume
              </div>
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
