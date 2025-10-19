# AI Resume Analyzer - Web Version

A modern Next.js 14 web application that analyzes resumes using AI. This is an exact replica of the Flutter mobile app, featuring glassmorphism UI and smooth animations.

## Features

- **Modern Glassmorphism UI** - Glass-effect cards with blur and gradients
- **Smooth Animations** - Framer Motion for seamless transitions
- **Predefined ATS Scoring** - Consistent 100-point scoring system
- **AI-Powered Analysis** - Google Gemini API for detailed feedback
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Type-Safe** - Built with TypeScript

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animation library
- **@google/generative-ai** - Gemini API
- **pdf-parse** - PDF text extraction

## Quick Start

```bash
# Install dependencies
npm install

# Add your Gemini API key
cp .env.example .env.local
# Edit .env.local and set:
# NEXT_PUBLIC_GEMINI_API_KEY=your_key_here
# Optional: NEXT_PUBLIC_GEMINI_MODEL=gemini-2.0-flash

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Add it to `.env.local`

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Splash screen ✅
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Theme & styles
├── config/
│   └── theme.ts              # Color palette & gradients
├── services/
│   ├── atsAnalyzer.ts        # ATS scoring logic
│   ├── geminiService.ts      # AI integration
│   └── pdfParser.ts          # PDF extraction
└── types/
    └── index.ts              # TypeScript types
```

## ATS Scoring (Max 100 Points)

1. **Contact Information** (10pts) - Email, phone, LinkedIn
2. **Keywords & Skills** (25pts) - Technical terms, skills
3. **Work Experience** (20pts) - Job titles, achievements
4. **Education** (10pts) - Degree, institution, dates
5. **Formatting** (15pts) - ATS-friendly structure
6. **Length** (10pts) - 1-2 pages optimal
7. **Action Verbs** (10pts) - Led, Developed, Achieved...

## ✨ Complete & Ready to Use!

All features implemented:

- ✅ Next.js 14 + TypeScript + Tailwind setup
- ✅ Glassmorphism styles and CSS utilities
- ✅ Theme configuration (colors, gradients)
- ✅ ATS Analyzer service (identical to Flutter)
- ✅ Gemini API integration
- ✅ PDF parser utility
- ✅ Splash screen with animations
- ✅ Upload page with drag-and-drop
- ✅ Analysis loading page with progress steps
- ✅ Results page with animated score circle
- ✅ All UI components and animations
- ✅ Full end-to-end flow

## Pages Overview

### 1. Splash Screen (`/`)
- Animated gradient background with pulsing logo
- Auto-redirects to upload page after 3 seconds

### 2. Upload Page (`/upload`)
- Drag-and-drop file upload with react-dropzone
- File validation (PDF only, max 10MB)
- Glassmorphic card UI with smooth animations
- File preview with size information

### 3. Analysis Page (`/analyzing`)
- 5-step progress indicator
- Rotating gradient loader animation
- Shimmer loading cards
- Real-time analysis with Gemini API
- Error handling with retry option

### 4. Results Page (`/results`)
- Animated circular score progress (0-100)
- Color-coded score (green/blue/yellow/red)
- Summary, Strengths, and Improvements cards
- Detailed criteria breakdown with progress bars
- AI insights from Gemini
- "Analyze Another" button

## Customization

**ATS Rules**: Edit `src/services/atsAnalyzer.ts`
**AI Prompts**: Edit `src/services/geminiService.ts`
**Theme**: Edit `src/config/theme.ts` and `src/app/globals.css`

## Deployment

### Vercel
1. Push to GitHub
2. Import on [Vercel](https://vercel.com)
3. Add env var `NEXT_PUBLIC_GEMINI_API_KEY`
   - Optional: add `NEXT_PUBLIC_GEMINI_MODEL` (e.g., `gemini-2.0-flash`)
4. Deploy!

### Manual
```bash
npm run build
npm run start
```

## Troubleshooting

**API Key/Model Error**: Ensure `.env.local` exists and key starts with `NEXT_PUBLIC_`. If you see NOT_FOUND, set `NEXT_PUBLIC_GEMINI_MODEL` to a supported name like `gemini-2.0-flash` or use a versioned 1.5 model (e.g., `gemini-1.5-flash-001`). Restart dev server after changes.
**PDF Upload**: Check file size (<10MB) and use pdfjs-dist for better parsing
**Port 3000 in use**: Use `npm run dev -- -p 3001`

## License

MIT License - Open source

## Credits

Built with Next.js, TypeScript, Tailwind CSS, and Google Gemini AI
