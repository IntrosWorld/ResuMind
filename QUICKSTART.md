# Quick Start Guide - AI Resume Analyzer Web

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies

```bash
cd ai_resume_analyzer_web
npm install
```

### 2. Add Your Gemini API Key

Create `.env.local` file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your key (and optional model):

```
NEXT_PUBLIC_GEMINI_API_KEY=your_actual_gemini_api_key
NEXT_PUBLIC_GEMINI_MODEL=gemini-2.0-flash
```

**Get API Key**: https://makersuite.google.com/app/apikey

### 3. Run the App

```bash
npm run dev
```

Open http://localhost:3000

## ✨ Features Ready

- ✅ Drag & drop PDF upload
- ✅ Real-time ATS analysis
- ✅ AI-powered insights
- ✅ Beautiful animations
- ✅ Glassmorphism UI

## 📱 User Flow

1. **Splash** → Auto-redirects to upload
2. **Upload** → Drag PDF or click to browse
3. **Analyzing** → Watch progress (5 steps)
4. **Results** → View score, insights, improvements

## 🎨 Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Google Gemini AI

## 🔧 Troubleshooting

**Port 3000 in use?**
```bash
npm run dev -- -p 3001
```

**API Key/Model error?**
- Ensure key starts with `NEXT_PUBLIC_`
- If you get NOT_FOUND, set `NEXT_PUBLIC_GEMINI_MODEL` to a supported model (e.g., `gemini-2.0-flash` or `gemini-1.5-flash-001`)
- Restart dev server after adding/updating env vars

**PDF not uploading?**
- Check file size (<10MB)
- Ensure it's a valid PDF

## 📚 Project Structure

```
src/
├── app/
│   ├── page.tsx          # Splash ✅
│   ├── upload/           # Upload ✅
│   ├── analyzing/        # Loading ✅
│   └── results/          # Results ✅
├── services/
│   ├── atsAnalyzer.ts    # Scoring ✅
│   ├── geminiService.ts  # AI ✅
│   └── pdfParser.ts      # PDF ✅
└── config/
    └── theme.ts          # Theme ✅
```

## 🚢 Deploy

### Vercel (Recommended)
1. Push to GitHub
2. Import on vercel.com
3. Add `NEXT_PUBLIC_GEMINI_API_KEY` env var
4. Deploy!

### Build Manually
```bash
npm run build
npm start
```

## 💡 Tips

- **Development**: Use `npm run dev`
- **Production**: Use `npm run build && npm start`
- **Type Check**: Use `npm run type-check` (if configured)
- **Lint**: Use `npm run lint`

## 🎯 What's Next?

The app is **100% complete** and ready to use!

Optional enhancements:
- Add PDF.js for better PDF parsing
- Implement resume history
- Add export to PDF
- Support DOCX files

## 📖 Full Documentation

See [README.md](README.md) for complete documentation.

---

**Questions?** Check the main README or create an issue!
