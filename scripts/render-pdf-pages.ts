#!/usr/bin/env tsx
/**
 * render-pdf-pages.ts
 *
 * Pre-build script to render PDF pages to WebP images.
 * Runs in Node.js (not Cloudflare Workers) so Puppeteer works correctly.
 *
 * Usage:
 *   pnpm tsx scripts/render-pdf-pages.ts
 *
 * This script:
 * 1. Fetches book data from Sanity
 * 2. Renders PDF pages to WebP images using Puppeteer
 * 3. Saves them to public/pdf-pages/
 * 4. The Astro build can then reference these pre-rendered images
 */

import { createClient } from "@sanity/client";
import { renderPdfToImages } from "../src/utils/pdfRenderer.js";

const SANITY_PROJECT_ID = "x31r8s87";
const SANITY_DATASET = process.env.SANITY_DATASET || "production";
const SANITY_TOKEN = process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_TOKEN;

console.log("╔════════════════════════════════════════════════════════════╗");
console.log("║  PDF Pages Pre-Renderer                                    ║");
console.log("╚════════════════════════════════════════════════════════════╝");
console.log();
console.log(`📊 Dataset: ${SANITY_DATASET}`);
console.log();

// Create Sanity client (try without token first for public datasets)
const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: "2026-01-13",
  useCdn: false,
  // Only use token if provided (local_dev needs token, production might be public)
  ...(SANITY_TOKEN ? { token: SANITY_TOKEN } : {}),
  perspective: "published", // Only fetch published documents
});

if (SANITY_TOKEN) {
  console.log(`🔑 Using authentication token`);
} else {
  console.log(`🔓 Using public access (no token)`);
}
console.log();

// Query to fetch book PDF URL
const BOOK_CONTENT_QUERY = `*[_type == "bookContent"][0]{ "pdfUrl": pdfFile.asset->url }`;

async function main() {
  try {
    console.log("📖 Fetching book data from Sanity...");
    const bookData = await client.fetch<{ pdfUrl?: string }>(BOOK_CONTENT_QUERY);

    if (!bookData || !bookData.pdfUrl) {
      console.log("⚠️  No PDF found in Sanity. Skipping PDF rendering.");
      console.log("   Make sure a 'bookContent' document with a PDF file exists and is published.");
      console.log(`   Dataset: ${SANITY_DATASET}`);
      process.exit(0);
    }

    const pdfUrl = bookData.pdfUrl;
    console.log(`✓ PDF URL: ${pdfUrl.slice(0, 80)}...`);
    console.log();

    console.log("🎨 Rendering PDF pages to WebP images...");
    const result = await renderPdfToImages(pdfUrl, {
      width: 1200,
      quality: 80,
    });

    console.log();
    console.log("╔════════════════════════════════════════════════════════════╗");
    console.log("║  ✓ PDF Rendering Complete                                 ║");
    console.log("╚════════════════════════════════════════════════════════════╝");
    console.log();
    console.log(`📄 Total pages: ${result.totalPages}`);
    console.log(`📐 Dimensions: ${result.width}x${result.height}px`);
    console.log(`📁 Output: public/pdf-pages/`);
    console.log();

    if (result.totalPages === 0) {
      console.error("❌ No pages were rendered! Check errors above.");
      process.exit(1);
    }

    console.log("✅ Ready for build!");
  } catch (error) {
    console.error();
    console.error("╔════════════════════════════════════════════════════════════╗");
    console.error("║  ❌ PDF Rendering Failed                                   ║");
    console.error("╚════════════════════════════════════════════════════════════╝");
    console.error();
    console.error(error);
    console.error();
    console.error("Possible solutions:");
    console.error("  1. Ensure Chrome is installed: pnpm exec puppeteer browsers install chrome");
    console.error("  2. Check that the PDF URL is accessible");
    console.error("  3. Verify Sanity credentials are correct");
    console.error();
    process.exit(1);
  }
}

main();
