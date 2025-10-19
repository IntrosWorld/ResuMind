'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { PDFParser } from '@/services/pdfParser';
import { GeminiService } from '@/services/geminiService';
import { AnalysisResult } from '@/types';

const LOADING_STEPS = [
  'Extracting resume text...',
  'Analyzing format and structure...',
  'Calculating ATS score...',
  'Generating AI insights...',
  'Preparing recommendations...',
];

export default function AnalyzingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    startAnalysis();
  }, []);

  const startAnalysis = async () => {
    try {
      // Get file from sessionStorage
      const fileData = sessionStorage.getItem('resumeFile');
      const fileName = sessionStorage.getItem('resumeFileName');

      if (!fileData || !fileName) {
        throw new Error('No resume file found. Please upload a file first.');
      }

      // Step 1: Extract text
      await updateStep(0);
      await delay(1500);

      // Convert base64 to File
      const base64Response = await fetch(fileData);
      const blob = await base64Response.blob();
      const file = new File([blob], fileName, { type: 'application/pdf' });

      const resumeText = await PDFParser.extractTextFromFile(file);

      // Step 2: Analyze format
      await updateStep(1);
      await delay(1000);

      // Step 3: Calculate ATS score
      await updateStep(2);
      await delay(1500);

      // Step 4: Generate AI insights
      await updateStep(3);
      await delay(500);

      const geminiService = new GeminiService();
      const analysisResult = await geminiService.analyzeResume(resumeText);

      // Step 5: Prepare recommendations
      await updateStep(4);
      await delay(1000);

      // Store results and navigate
      sessionStorage.setItem('analysisResult', JSON.stringify(analysisResult));
      router.push('/results');
    } catch (error) {
      console.error('Analysis error:', error);
      setHasError(true);
      setErrorMessage(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    }
  };

  const updateStep = async (step: number) => {
    setCurrentStep(step);
  };

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  if (hasError) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, #0F0F1E 0%, #16213E 100%)',
          }}
        />

        <div className="relative z-10 max-w-md px-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="flex flex-col items-center"
          >
            {/* Error Icon */}
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center mb-8"
              style={{
                background: 'rgba(239, 68, 68, 0.2)',
              }}
            >
              <svg
                className="w-16 h-16 text-[#EF4444]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-white mb-4">Analysis Failed</h1>
            <p className="text-[#9CA3AF] text-center mb-8">{errorMessage}</p>

            <button
              onClick={() => router.push('/upload')}
              className="px-8 py-4 rounded-2xl font-bold text-white transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #4A90E2 0%, #8B5CF6 100%)',
              }}
            >
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Try Again
              </div>
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Gradient Background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #0F0F1E 0%, #16213E 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6">
        {/* Animated Loader */}
        <div className="relative mb-16">
          {/* Outer rotating circle */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="w-48 h-48 rounded-full"
            style={{
              background: 'linear-gradient(135deg, #2E5BFF 0%, #8B5CF6 50%, #B794F4 100%)',
              boxShadow: '0 0 60px 20px rgba(74, 144, 226, 0.5)',
            }}
          />

          {/* Middle pulsing circle */}
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-4 rounded-full"
            style={{
              background: '#0F0F1E',
            }}
          />

          {/* Inner icon */}
          <div
            className="absolute inset-8 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #4A90E2 0%, #8B5CF6 100%)',
            }}
          >
            <motion.svg
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-16 h-16 text-white"
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
            </motion.svg>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-3 mb-12">
          {LOADING_STEPS.map((_, index) => (
            <motion.div
              key={index}
              initial={{ width: 12 }}
              animate={{
                width: index === currentStep ? 40 : 12,
                background:
                  index <= currentStep
                    ? 'linear-gradient(135deg, #4A90E2 0%, #8B5CF6 100%)'
                    : 'rgba(156, 163, 175, 0.3)',
              }}
              className="h-3 rounded-full"
            />
          ))}
        </div>

        {/* Current Step Text */}
        <motion.h2
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-semibold text-white text-center mb-16"
        >
          {LOADING_STEPS[currentStep]}
        </motion.h2>

        {/* Shimmer Loading Cards */}
        <div className="w-full max-w-md space-y-4">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className="h-20 rounded-2xl overflow-hidden relative"
              style={{
                background: '#1A1A2E',
              }}
            >
              <motion.div
                animate={{
                  x: ['-100%', '200%'],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: index * 0.2,
                }}
                className="absolute inset-0 w-1/2"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, rgba(156, 163, 175, 0.2), transparent)',
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
