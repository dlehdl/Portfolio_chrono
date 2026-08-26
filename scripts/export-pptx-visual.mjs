/**
 * 웹 레이아웃 스크린샷 + 영상 오버레이 PPT
 * 실행: npm run export:pptx:visual
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import PptxGenJS from 'pptxgenjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'export', 'LEE_DOYI_Combat_Design_Portfolio_Visual.pptx');
const CAPTURE_DIR = path.join(ROOT, 'export', 'captures');
const VIDEO_DIR = path.join(ROOT, 'video');

const VW = 1920;
const VH = 1080;
const SLIDE_W = 13.333;
const SLIDE_H = 7.5;
const BASE = process.env.PPTX_URL || 'http://localhost:5173';

const VIDEO_FILES = fs.readdirSync(VIDEO_DIR).filter((f) => f.toLowerCase().endsWith('.mp4'));

function resolveVideoFile(src) {
  if (!src) return null;
  let name = src.split('?')[0].split('#')[0];
  try {
    name = decodeURIComponent(name);
  } catch {
    /* ignore */
  }
  name = name.split('/').pop();
  if (!name) return null;
  const exact = path.join(VIDEO_DIR, name);
  if (fs.existsSync(exact)) return exact;
  const lower = name.toLowerCase();
  const hit = VIDEO_FILES.find((f) => f.toLowerCase() === lower);
  return hit ? path.join(VIDEO_DIR, hit) : null;
}

function pxToIn(rect) {
  return {
    x: (rect.x / VW) * SLIDE_W,
    y: (rect.y / VH) * SLIDE_H,
    w: (rect.w / VW) * SLIDE_W,
    h: (rect.h / VH) * SLIDE_H,
  };
}

async function freezeVisible(page) {
  await page.evaluate(async () => {
    document.querySelectorAll('[style]').forEach((el) => {
      const s = el.getAttribute('style') || '';
      if (s.includes('opacity: 0') || s.includes('opacity:0')) {
        el.style.setProperty('opacity', '1', 'important');
      }
    });
    for (const v of document.querySelectorAll('video')) {
      const r = v.getBoundingClientRect();
      if (r.bottom < 0 || r.top > 1080) continue;
      v.muted = true;
      try {
        if (v.currentTime < 0.2) v.currentTime = 0.35;
        await v.play().catch(() => {});
        v.pause();
      } catch {
        /* ignore */
      }
    }
  });
}

async function preparePage(page) {
  await page.addStyleTag({
    content: `
      nav { display: none !important; }
      html, body { scrollbar-width: none; }
      ::-webkit-scrollbar { display: none !important; width: 0 !important; height: 0 !important; }
      *, *::before, *::after {
        animation: none !important;
        animation-play-state: paused !important;
        transition: none !important;
      }
    `,
  });

  await page.evaluate(async () => {
    const hero = document.getElementById('hero');
    const src = hero?.getAttribute('data-cover');
    if (hero && src) {
      hero.style.backgroundImage = `linear-gradient(90deg, rgba(242,239,233,0.92) 0%, rgba(242,239,233,0.55) 42%, rgba(242,239,233,0.12) 70%), url("${src}")`;
      hero.style.backgroundSize = 'cover';
      hero.style.backgroundPosition = 'right center';
    }
    await document.fonts.ready;
    await Promise.all(
      [...document.images].map((img) =>
        img.complete ? Promise.resolve() : new Promise((resolve) => {
          img.onload = img.onerror = () => resolve();
        }),
      ),
    );
  });

  await freezeVisible(page);
  await page.waitForTimeout(250);
}

async function collectVideos(page, clipH) {
  return page.evaluate((maxH) => {
    const out = [];
    for (const v of document.querySelectorAll('video')) {
      const r = v.getBoundingClientRect();
      const visibleH = Math.min(r.bottom, maxH) - Math.max(r.top, 0);
      const visibleW = Math.min(r.right, 1920) - Math.max(r.left, 0);
      if (visibleH < 48 || visibleW < 80) continue;
      if (visibleH / Math.max(r.height, 1) < 0.45) continue;
      out.push({
        src: v.currentSrc || v.src || v.getAttribute('src') || '',
        x: Math.max(0, r.x),
        y: Math.max(0, r.y),
        w: Math.min(r.width, 1920 - Math.max(0, r.x)),
        h: Math.min(visibleH, maxH - Math.max(0, r.y)),
      });
    }
    return out;
  }, clipH);
}

async function captureViewport(page, index, clipH = VH) {
  const file = path.join(CAPTURE_DIR, `slide-${String(index).padStart(3, '0')}.jpg`);
  await page.screenshot({
    path: file,
    type: 'jpeg',
    quality: 88,
    clip: { x: 0, y: 0, width: VW, height: clipH },
  });
  const videos = await collectVideos(page, clipH);
  return { file, clipH, videos };
}

async function main() {
  fs.mkdirSync(CAPTURE_DIR, { recursive: true });
  for (const f of fs.readdirSync(CAPTURE_DIR)) {
    if (f.endsWith('.jpg')) fs.unlinkSync(path.join(CAPTURE_DIR, f));
  }

  let browser;
  try {
    browser = await chromium.launch({ headless: true, channel: 'chrome' });
  } catch {
    browser = await chromium.launch({ headless: true });
  }
  const page = await browser.newPage({
    viewport: { width: VW, height: VH },
    deviceScaleFactor: 2,
  });

  console.log(`Open ${BASE}`);
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForSelector('#hero', { timeout: 30000 });
  await preparePage(page);

  const totalHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  const slices = [];
  let y = 0;
  let i = 0;
  while (y < totalHeight - 24) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(380);
    await freezeVisible(page);
    await page.waitForTimeout(120);
    const remaining = totalHeight - y;
    const clipH = Math.min(VH, Math.max(remaining, 1));
    const shot = await captureViewport(page, i, clipH);
    slices.push(shot);
    console.log(`  capture ${i + 1}  y=${y}  h=${clipH}  videos=${shot.videos.length}`);
    y += VH;
    i += 1;
    if (i > 80) break;
  }

  const stanceCount = await page.locator('[aria-expanded]').count();
  for (let s = 0; s < stanceCount; s += 1) {
    try {
      const btn = page.locator('[aria-expanded]').nth(s);
      await btn.scrollIntoViewIfNeeded();
      await btn.click({ force: true });
      await page.waitForTimeout(320);
      const panel = page.locator('[id^="tree-skills-"]').filter({ visible: true }).first();
      if (await panel.count()) {
        await panel.scrollIntoViewIfNeeded({ timeout: 3000 }).catch(() => {});
        await page.waitForTimeout(180);
      }
      await freezeVisible(page);
      const shot = await captureViewport(page, i, VH);
      slices.push(shot);
      console.log(`  stance tree ${s + 1}/${stanceCount}`);
      i += 1;
    } catch (err) {
      console.warn(`  skip stance ${s + 1}: ${err.message}`);
    }
  }

  await browser.close();

  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: 'WIDE', width: SLIDE_W, height: SLIDE_H });
  pptx.layout = 'WIDE';
  pptx.author = 'LEE DOYI';
  pptx.title = 'Combat Design Portfolio (Visual)';
  pptx.subject = 'Website layout capture with embedded video';

  let embedded = 0;
  for (const shot of slices) {
    const slide = pptx.addSlide();
    slide.background = { color: 'F2EFE9' };
    const imgH = SLIDE_H * (shot.clipH / VH);
    slide.addImage({
      path: shot.file,
      x: 0,
      y: 0,
      w: SLIDE_W,
      h: imgH,
    });
    const used = new Set();
    for (const v of shot.videos) {
      const file = resolveVideoFile(v.src);
      if (!file || used.has(file)) continue;
      used.add(file);
      const box = pxToIn(v);
      if (box.w < 0.6 || box.h < 0.4) continue;
      try {
        slide.addMedia({
          type: 'video',
          path: file,
          x: box.x,
          y: box.y,
          w: box.w,
          h: box.h,
        });
        embedded += 1;
      } catch (err) {
        console.warn(`  skip video ${path.basename(file)}: ${err.message}`);
      }
    }
  }

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  await pptx.writeFile({ fileName: OUT });
  const mb = (fs.statSync(OUT).size / (1024 * 1024)).toFixed(1);
  console.log(`Wrote ${slices.length} slides, ${embedded} videos, ${mb} MB → ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
