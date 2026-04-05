#!/usr/bin/env node

/**
 * Generate OG image from a built course page.
 *
 * Usage:
 *   node generate-og.mjs <course-dir>
 *   # e.g. node generate-og.mjs cake
 *
 * Requirements:
 *   npm install --save-dev puppeteer
 */

import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync } from 'fs';
import puppeteer from 'puppeteer';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.log('Usage:');
    console.log('  node generate-og.mjs <course-dir>   # e.g. node generate-og.mjs cake');
    process.exit(1);
  }

  const courseInput = args[0];
  const courseDir = resolve(courseInput);
  const indexPath = join(courseDir, 'index.html');

  if (!existsSync(indexPath)) {
    console.error(`❌ index.html not found. Build the course first: node build.mjs ${courseInput}`);
    process.exit(1);
  }

  const relCourse = courseDir;
  const assetsDir = join(courseDir, 'assets');
  if (!existsSync(assetsDir)) {
    mkdirSync(assetsDir, { recursive: true });
  }

  // NOTE: config/cake.yaml already points seo.image to "cake/assets/og-cake.jpg"
  // so we reuse that exact path here.
  const outputPath =
    /cake[\\/]*$/i.test(relCourse) || /[\\/](cake)[\\/]?$/i.test(relCourse)
      ? join(courseDir, 'assets', 'og-cake.jpg')
      : join(courseDir, 'assets', 'og-image.jpg');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({
      // 800x420 viewport + 1.5x scale → 輸出 1200x630（1.91:1 通用 OG 比例）
      width: 700,
      height: 368,
      deviceScaleFactor: 1.5,
    });

    // 啟用 og-mode（?og=1 會讓頁面隱藏 sidebar / 長文，只留 hero）
    const fileUrl = 'file://' + indexPath + '?og=1';
    await page.goto(fileUrl, { waitUntil: 'networkidle0' });

    // 給字型 / 動畫一點時間 settle（不用 puppeteer 的 waitForTimeout，避免版本差異）
    await new Promise((resolve) => setTimeout(resolve, 500));

    await page.screenshot({
      path: outputPath,
      fullPage: false,
      type: 'jpeg',
      quality: 90,
    });

    console.log(`✅ Generated OG image: ${outputPath}`);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('❌ Failed to generate OG image:');
  console.error(err);
  process.exit(1);
});

