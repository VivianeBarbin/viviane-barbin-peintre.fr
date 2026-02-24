/**
 * pdfRenderer.ts
 *
 * Build-time utility to render PDF pages to WebP images using Puppeteer.
 * Downloads PDF first, then renders each page using Chrome's built-in PDF viewer.
 *
 * This runs at build time (server-side) to pre-render PDF pages
 * as static images, making the slider instant at runtime.
 */

import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import puppeteer, { type Browser } from "puppeteer";
import sharp from "sharp";

/** Configuration for PDF rendering */
export interface PdfRenderConfig {
  /** Target width in pixels (height calculated from aspect ratio) */
  width: number;
  /** WebP quality (0-100) */
  quality: number;
  /** Output directory relative to project root */
  outputDir: string;
  /** Device pixel ratio for sharper rendering */
  devicePixelRatio: number;
}

/** Result of rendering a PDF */
export interface PdfRenderResult {
  /** Array of public URLs for the rendered pages */
  pageUrls: string[];
  /** Total number of pages */
  totalPages: number;
  /** Width of rendered images */
  width: number;
  /** Height of rendered images */
  height: number;
}

/** Default configuration */
const DEFAULT_CONFIG: PdfRenderConfig = {
  width: 1200,
  quality: 80,
  outputDir: "public/pdf-pages",
  devicePixelRatio: 2,
};

/**
 * Generate a short hash from a URL for cache busting
 */
function hashUrl(url: string): string {
  return createHash("md5").update(url).digest("hex").slice(0, 8);
}

/**
 * Render all pages of a PDF to WebP images using Puppeteer
 *
 * @param pdfUrl - URL of the PDF to render
 * @param config - Optional configuration overrides
 * @returns Result containing page URLs and metadata
 */
export async function renderPdfToImages(
  pdfUrl: string,
  config: Partial<PdfRenderConfig> = {}
): Promise<PdfRenderResult> {
  const { width, quality, outputDir, devicePixelRatio } = { ...DEFAULT_CONFIG, ...config };

  // Generate a hash from the PDF URL for unique filenames
  const urlHash = hashUrl(pdfUrl);

  // Ensure output directory exists
  const fullOutputDir = join(process.cwd(), outputDir);
  if (!existsSync(fullOutputDir)) {
    await mkdir(fullOutputDir, { recursive: true });
  }

  // Clean up old files with different hashes (PDF was updated)
  try {
    const existingFiles = await readdir(fullOutputDir);
    const oldFiles = existingFiles.filter((f) => f.endsWith(".webp") && !f.startsWith(urlHash));
    for (const oldFile of oldFiles) {
      await rm(join(fullOutputDir, oldFile));
      console.log(`[pdfRenderer] Removed old cached file: ${oldFile}`);
    }
  } catch {
    // Directory might not exist yet, that's fine
  }

  // Check if images already exist for this PDF
  const existingFiles = existsSync(fullOutputDir) ? await readdir(fullOutputDir) : [];
  const cachedPages = existingFiles
    .filter((f) => f.startsWith(urlHash) && f.endsWith(".webp"))
    .sort((a, b) => {
      const numA = parseInt(a.match(/-(\d+)\.webp$/)?.[1] || "0");
      const numB = parseInt(b.match(/-(\d+)\.webp$/)?.[1] || "0");
      return numA - numB;
    });

  // If we have cached pages, return them
  if (cachedPages.length > 0) {
    console.log(`[pdfRenderer] Using ${cachedPages.length} cached pages for ${urlHash}`);

    // Get dimensions from first cached image
    const firstImagePath = join(fullOutputDir, cachedPages[0]);
    const metadata = await sharp(firstImagePath).metadata();

    return {
      pageUrls: cachedPages.map((f) => `/pdf-pages/${f}`),
      totalPages: cachedPages.length,
      width: metadata.width || width,
      height: metadata.height || Math.round(width * 1.414),
    };
  }

  console.log(`[pdfRenderer] Rendering PDF: ${pdfUrl.slice(0, 80)}...`);

  // First, download the PDF
  console.log(`[pdfRenderer] Downloading PDF...`);
  const response = await fetch(pdfUrl);
  if (!response.ok) {
    throw new Error(`Failed to download PDF: ${response.status} ${response.statusText}`);
  }
  const pdfBuffer = Buffer.from(await response.arrayBuffer());
  const pdfBase64 = pdfBuffer.toString("base64");
  const pdfDataUrl = `data:application/pdf;base64,${pdfBase64}`;

  console.log(`[pdfRenderer] PDF downloaded (${Math.round(pdfBuffer.length / 1024)}KB)`);

  let browser: Browser | null = null;

  try {
    // Launch Puppeteer
    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-web-security",
        "--allow-file-access-from-files",
      ],
    });

    const page = await browser.newPage();

    // Set viewport for rendering
    const viewportWidth = width * devicePixelRatio;
    const viewportHeight = Math.round(viewportWidth * 1.5);

    await page.setViewport({
      width: viewportWidth,
      height: viewportHeight,
      deviceScaleFactor: 1,
    });

    // Create an HTML page that renders the PDF using PDF.js with embedded data
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { background: white; }
          canvas { display: block; }
        </style>
      </head>
      <body>
        <canvas id="pdf-canvas"></canvas>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.min.mjs" type="module"></script>
        <script type="module">
          const pdfjsLib = await import('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.min.mjs');
          pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs';

          // Store the PDF data passed from Node.js
          window.pdfDataUrl = null;
          window.pdfDoc = null;

          window.loadPdf = async function(dataUrl) {
            try {
              window.pdfDataUrl = dataUrl;
              window.pdfDoc = await pdfjsLib.getDocument(dataUrl).promise;
              return { success: true, totalPages: window.pdfDoc.numPages };
            } catch (error) {
              return { success: false, error: error.message };
            }
          };

          window.renderPage = async function(pageNum, scale) {
            try {
              if (!window.pdfDoc) {
                return { success: false, error: 'PDF not loaded' };
              }

              const page = await window.pdfDoc.getPage(pageNum);
              const viewport = page.getViewport({ scale });

              const canvas = document.getElementById('pdf-canvas');
              const context = canvas.getContext('2d');
              canvas.width = viewport.width;
              canvas.height = viewport.height;

              // Clear canvas with white background
              context.fillStyle = 'white';
              context.fillRect(0, 0, canvas.width, canvas.height);

              await page.render({ canvasContext: context, viewport }).promise;

              return {
                success: true,
                width: viewport.width,
                height: viewport.height
              };
            } catch (error) {
              return { success: false, error: error.message };
            }
          };

          window.pdfReady = true;
        </script>
      </body>
      </html>
    `;

    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    // Wait for PDF.js to be ready
    await page.waitForFunction("window.pdfReady === true", { timeout: 30000 });

    // Load the PDF from base64 data URL
    console.log(`[pdfRenderer] Loading PDF in browser...`);
    const loadResult = await page.evaluate(async (dataUrl: string) => {
      // @ts-expect-error - loadPdf is defined in page context
      return await window.loadPdf(dataUrl);
    }, pdfDataUrl);

    if (!loadResult.success) {
      throw new Error(`Failed to load PDF: ${loadResult.error}`);
    }

    const totalPages = loadResult.totalPages;
    console.log(`[pdfRenderer] PDF has ${totalPages} pages`);

    // Calculate scale to achieve target width
    const scale = devicePixelRatio;

    const pageUrls: string[] = [];
    let finalHeight = 0;

    // Render each page
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      const filename = `${urlHash}-${pageNum}.webp`;
      const filePath = join(fullOutputDir, filename);

      console.log(`[pdfRenderer] Rendering page ${pageNum}/${totalPages}...`);

      // Render the page
      const result = await page.evaluate(
        async (pNum: number, s: number) => {
          // @ts-expect-error - renderPage is defined in page context
          return await window.renderPage(pNum, s);
        },
        pageNum,
        scale
      );

      if (!result.success) {
        console.error(`[pdfRenderer] Failed to render page ${pageNum}: ${result.error}`);
        continue;
      }

      // Take screenshot of the canvas
      const canvasElement = await page.$("#pdf-canvas");
      if (!canvasElement) {
        console.error(`[pdfRenderer] Canvas not found for page ${pageNum}`);
        continue;
      }

      const pngBuffer = await canvasElement.screenshot({ type: "png" });

      // Convert to WebP with sharp and resize to target width
      const webpBuffer = await sharp(pngBuffer)
        .resize(width, null, { fit: "inside" })
        .webp({ quality })
        .toBuffer();

      await writeFile(filePath, webpBuffer);
      pageUrls.push(`/pdf-pages/${filename}`);

      // Track height from first page
      if (pageNum === 1) {
        const meta = await sharp(webpBuffer).metadata();
        finalHeight = meta.height || Math.round(width * 1.414);
      }
    }

    console.log(`[pdfRenderer] ✓ Finished rendering ${totalPages} pages to WebP`);

    return {
      pageUrls,
      totalPages,
      width,
      height: finalHeight,
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * Clear all cached PDF page images
 */
export async function clearPdfCache(outputDir = DEFAULT_CONFIG.outputDir): Promise<void> {
  const fullOutputDir = join(process.cwd(), outputDir);
  if (existsSync(fullOutputDir)) {
    const files = await readdir(fullOutputDir);
    const webpFiles = files.filter((f) => f.endsWith(".webp"));
    for (const file of webpFiles) {
      await rm(join(fullOutputDir, file));
    }
    console.log(`[pdfRenderer] Cleared ${webpFiles.length} cached images`);
  }
}

/**
 * Check if a PDF has already been rendered (cached)
 */
export async function isPdfCached(
  pdfUrl: string,
  outputDir = DEFAULT_CONFIG.outputDir
): Promise<boolean> {
  const urlHash = hashUrl(pdfUrl);
  const fullOutputDir = join(process.cwd(), outputDir);

  if (!existsSync(fullOutputDir)) {
    return false;
  }

  const files = await readdir(fullOutputDir);
  return files.some((f) => f.startsWith(urlHash) && f.endsWith(".webp"));
}
