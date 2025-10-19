// PDF parsing utility for browser environment using pdfjs-dist
// Import dynamically to avoid SSR issues
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let pdfjsLib: any = null;

// Dynamically import pdfjs-dist only on client side
async function getPdfJs() {
  if (typeof window === 'undefined') {
    throw new Error('PDF parsing is only available in browser environment');
  }

  if (!pdfjsLib) {
    pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
  }

  return pdfjsLib;
}

export class PDFParser {
  static async extractTextFromFile(file: File): Promise<string> {
    try {
      // Dynamically import pdfjs-dist to avoid SSR issues
      const pdfjs = await getPdfJs();

      const arrayBuffer = await file.arrayBuffer();

      // Configure loading task with proper settings
      const loadingTask = pdfjs.getDocument({
        data: arrayBuffer,
        useWorkerFetch: false,
        isEvalSupported: false,
        useSystemFonts: true,
      });

      const pdf = await loadingTask.promise;

      let fullText = '';

      // Extract text from all pages
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();

        // Extract text items and preserve spacing
        const pageText = textContent.items
          .map((item: { str?: string }) => {
            // Check if item has str property (TextItem)
            if ('str' in item && item.str) {
              return item.str;
            }
            return '';
          })
          .join(' ');

        fullText += pageText + '\n\n';
      }

      // Clean up the extracted text
      fullText = this.cleanExtractedText(fullText);

      if (!fullText || fullText.trim().length < 50) {
        return 'Unable to extract sufficient text from PDF. Please ensure the PDF contains selectable text (not scanned images).';
      }

      return fullText;
    } catch (error) {
      console.error('PDF parsing error:', error);
      throw new Error(
        `Failed to parse PDF: ${error instanceof Error ? error.message : 'Unknown error'}. Please ensure the file is a valid PDF.`
      );
    }
  }

  private static cleanExtractedText(text: string): string {
    // Remove excessive whitespace while preserving structure
    const cleaned = text
      .replace(/\r\n/g, '\n')  // Normalize line endings
      .replace(/\n{3,}/g, '\n\n')  // Max 2 consecutive newlines
      .replace(/ {2,}/g, ' ')  // Remove multiple spaces
      .trim();

    return cleaned;
  }

  static validatePDF(file: File): boolean {
    return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  }

  static getFileSizeInMB(file: File): number {
    return file.size / (1024 * 1024);
  }

  static async getPDFInfo(file: File): Promise<{ pages: number; size: number }> {
    try {
      // Dynamically import pdfjs-dist to avoid SSR issues
      const pdfjs = await getPdfJs();

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;

      return {
        pages: pdf.numPages,
        size: this.getFileSizeInMB(file),
      };
    } catch (error) {
      console.error('Failed to get PDF info:', error);
      return {
        pages: 0,
        size: this.getFileSizeInMB(file),
      };
    }
  }
}
