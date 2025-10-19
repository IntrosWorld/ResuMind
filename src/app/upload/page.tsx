'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { PDFParser } from '@/services/pdfParser';

export default function UploadPage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    const file = acceptedFiles[0];

    if (!file) return;

    // Validate PDF
    if (!PDFParser.validatePDF(file)) {
      setError('Invalid file type. Please select a PDF file.');
      return;
    }

    // Check file size (max 10MB)
    const fileSizeMB = PDFParser.getFileSizeInMB(file);
    if (fileSizeMB > 10) {
      setError('File size exceeds 10MB. Please select a smaller file.');
      return;
    }

    setSelectedFile(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    multiple: false,
  });

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    try {
      // Store file in sessionStorage to pass to analyzing page
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (result) {
          sessionStorage.setItem('resumeFile', result as string);
          sessionStorage.setItem('resumeFileName', selectedFile.name);
          router.push('/analyzing');
        }
      };
      reader.readAsDataURL(selectedFile);
    } catch (err) {
      setError('Failed to process file. Please try again.');
      setIsLoading(false);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setError(null);
  };

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
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="pt-8 px-6"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
            Upload Your Resume
          </h1>
          <p className="text-[#9CA3AF] text-center mt-4 text-lg">
            Get instant AI-powered analysis and ATS score
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-2xl">
            <AnimatePresence mode="wait">
              {!selectedFile ? (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                >
                  <div
                    {...getRootProps()}
                    className={`glass-strong rounded-3xl p-12 cursor-pointer transition-all duration-300 ${
                      isDragActive
                        ? 'border-[#8B5CF6] scale-105'
                        : 'border-[#4A90E2] hover:border-[#8B5CF6]'
                    }`}
                    style={{
                      borderWidth: '2px',
                      borderStyle: 'solid',
                    }}
                  >
                    <input {...getInputProps()} />

                    <div className="flex flex-col items-center">
                      {/* Upload Icon */}
                      <motion.div
                        animate={{
                          y: isDragActive ? -10 : [0, -10, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                        className="w-24 h-24 rounded-full flex items-center justify-center mb-8"
                        style={{
                          background: 'linear-gradient(135deg, #4A90E2 0%, #8B5CF6 100%)',
                        }}
                      >
                        <svg
                          className="w-12 h-12 text-white"
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
                      </motion.div>

                      <h2 className="text-2xl font-bold text-white mb-3">
                        {isDragActive ? 'Drop your resume here' : 'Drop your resume here'}
                      </h2>
                      <p className="text-[#9CA3AF] mb-6">
                        or click to browse
                      </p>

                      <div className="px-6 py-3 rounded-full glass text-[#9CA3AF] text-sm">
                        PDF only • Max 10MB
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <div
                    className="glass-strong rounded-3xl p-12"
                    style={{
                      borderWidth: '2px',
                      borderStyle: 'solid',
                      borderColor: '#10B981',
                    }}
                  >
                    <div className="flex flex-col items-center">
                      {/* Success Icon */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: 'spring',
                          stiffness: 260,
                          damping: 20,
                        }}
                        className="w-24 h-24 rounded-full flex items-center justify-center mb-8"
                        style={{
                          background: 'linear-gradient(135deg, #10B981 0%, #4A90E2 100%)',
                        }}
                      >
                        <svg
                          className="w-12 h-12 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </motion.div>

                      <h2 className="text-2xl font-bold text-white mb-6">
                        Resume Ready
                      </h2>

                      {/* File Info */}
                      <div className="w-full glass rounded-2xl p-6 mb-6">
                        <div className="flex items-center mb-4">
                          <svg
                            className="w-6 h-6 text-[#4A90E2] mr-3"
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
                          <p className="text-white flex-1 truncate">
                            {selectedFile.name}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <svg
                            className="w-5 h-5 text-[#9CA3AF] mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                            />
                          </svg>
                          <p className="text-[#9CA3AF]">
                            {PDFParser.getFileSizeInMB(selectedFile).toFixed(2)} MB
                          </p>
                        </div>
                      </div>

                      {/* Change File Button */}
                      <button
                        onClick={clearSelection}
                        className="text-[#4A90E2] hover:text-[#8B5CF6] transition-colors flex items-center"
                      >
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
                        Choose different file
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-6 p-4 rounded-xl flex items-center"
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                  }}
                >
                  <svg
                    className="w-5 h-5 text-[#EF4444] mr-3"
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
                  <p className="text-[#EF4444]">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Analyze Button */}
            {selectedFile && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-8"
              >
                <button
                  onClick={handleAnalyze}
                  disabled={isLoading}
                  className="w-full py-4 px-8 rounded-2xl font-bold text-lg text-white transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, #4A90E2 0%, #8B5CF6 100%)',
                    boxShadow: '0 10px 40px rgba(74, 144, 226, 0.4)',
                  }}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin h-6 w-6 mr-3"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processing...
                    </div>
                  ) : (
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
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      Analyze Resume
                    </div>
                  )}
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
