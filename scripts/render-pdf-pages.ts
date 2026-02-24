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
const SANITY_DATASET = "production";
const SANITY_TOKEN = process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_TOKEN;

// Create Sanity client (try without token first for public datasets)
const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: "2026-01-13",
  useCdn: false,
  // Only use token if provided
  ...(SANITY_TOKEN ? { token: SANITY_TOKEN } : {}),
  perspective: "published", // Only fetch published documents
});

// Query to fetch book PDF URL
const BOOK_CONTENT_QUERY = `*[_type == "bookContent"][0]{ "pdfUrl": pdfFile.asset->url }`;

async function main() {
  try {
    const bookData = await client.fetch<{ pdfUrl?: string }>(BOOK_CONTENT_QUERY);

    if (!bookData || !bookData.pdfUrl) {
      process.exit(0);
    }

    const pdfUrl = bookData.pdfUrl;

    const result = await renderPdfToImages(pdfUrl, {
      width: 1800,
      quality: 80,
    });

    if (result.totalPages === 0) {
      console.error("❌ No pages were rendered! Check errors above.");
      process.exit(1);
    }
  } catch (error) {
    process.exit(1);
  }
}
main();
