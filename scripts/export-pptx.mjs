/**
 * 포트폴리오 콘텐츠 → PPTX
 * 실행: npm run export:pptx
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { load as loadYaml } from 'js-yaml';
import PptxGenJS from 'pptxgenjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'export', 'LEE_DOYI_Combat_Design_Portfolio.pptx');

const C = {
  bg: 'F2EFE9',
  card: 'E8E4D9',
  ink: '2A2A2A',
  inkDeep: '1F1F1F',
  muted: '6B6B6B',
  gold: 'A89870',
  line: '2A2A2A',
};

const FONT = 'Malgun Gothic';
const FONT_SERIF = 'Georgia';
const FONT_MONO = 'Consolas';

const WEAPON_STATS = {
  chainsword: { Speed: 80, Range: 100, Impact: 50, Control: 90, Mobility: 70 },
  dualaxe: { Speed: 100, Range: 30, Impact: 70, Control: 40, Mobility: 90 },
  battleaxe: { Speed: 30, Range: 60, Impact: 100, Control: 80, Mobility: 20 },
};

const STANCE_ORDER = ['A-1', 'A-2', 'B-1', 'B-2'];

function extractYaml(raw) {
  const fenced = raw.match(/```ya?ml\s*\n([\s\S]*?)```/);
  if (fenced) return fenced[1];
  const start = raw.search(/^[a-zA-Z_][\w]*:/m);
  return start >= 0 ? raw.slice(start) : raw;
}

function loadText() {
  const raw = fs.readFileSync(path.join(ROOT, 'text.md'), 'utf8');
  const parsed = loadYaml(extractYaml(raw));
  if (!parsed || typeof parsed !== 'object') throw new Error('text.md YAML 파싱 실패');
  return parsed;
}

function clean(v) {
  if (v == null) return '';
  return String(v).replace(/\r/g, '').trim();
}

function isPlaceholder(v) {
  const s = clean(v);
  return !s || s === '추가 필요' || s === 'null';
}

function lines(v) {
  return clean(v)
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

function skillEntries(weapon) {
  const skills = weapon?.skills ?? {};
  return Object.entries(skills).map(([id, s]) => ({
    id,
    name: clean(s?.name) || id,
    desc: isPlaceholder(s?.baseDescription ?? s?.description) ? '—' : clean(s?.baseDescription ?? s?.description),
    resource: isPlaceholder(s?.resource) ? '—' : clean(s?.resource),
  }));
}

function stanceList(weapon) {
  const stances = weapon?.stances ?? {};
  return STANCE_ORDER.filter((id) => stances[id]).map((id) => ({ id, ...stances[id] }));
}

const T = {
  x: 0.55,
  w: 12.23,
  y0: 0.38,
};

function addBg(slide) {
  slide.addShape('rect', {
    x: 0, y: 0, w: 13.333, h: 7.5,
    fill: { color: C.bg },
    line: { color: C.bg },
  });
}

function addFooter(slide, page, total) {
  slide.addShape('rect', {
    x: T.x, y: 7.18, w: 0.42, h: 0.012,
    fill: { color: C.ink },
    line: { color: C.ink },
  });
  slide.addText('LEE.D.Y  ·  COMBAT DESIGN PORTFOLIO', {
    x: 1.08, y: 7.08, w: 9.4, h: 0.28,
    fontFace: FONT_MONO, fontSize: 8, color: C.muted, margin: 0, charSpacing: 1.2,
  });
  slide.addText(`${page} / ${total}`, {
    x: 11.3, y: 7.08, w: 1.48, h: 0.28,
    fontFace: FONT_MONO, fontSize: 8, color: C.muted, align: 'right', margin: 0,
  });
}

function addKicker(slide, text) {
  slide.addShape('rect', {
    x: T.x, y: T.y0 + 0.06, w: 0.42, h: 0.012,
    fill: { color: C.ink },
    line: { color: C.ink },
  });
  slide.addText(text, {
    x: 1.08, y: T.y0 - 0.04, w: 11.7, h: 0.28,
    fontFace: FONT_MONO, fontSize: 10, color: C.muted, charSpacing: 2.4, margin: 0,
  });
}

function addTitle(slide, text, y = 0.68) {
  slide.addText(text, {
    x: T.x, y, w: T.w, h: 0.52,
    fontFace: FONT_SERIF, fontSize: 26, color: C.ink, bold: true, margin: 0,
  });
}

function card(slide, x, y, w, h) {
  slide.addShape('rect', {
    x, y, w, h,
    fill: { color: C.card },
    line: { color: C.ink, pt: 0.5, transparency: 70 },
  });
}

function tableOpts({ x, y, w, colW, fontSize = 10, align }) {
  return {
    x, y, w,
    colW,
    border: [
      { pt: 0.4, color: 'C2BDB0' },
      { pt: 0.4, color: 'C2BDB0' },
      { pt: 0.4, color: 'C2BDB0' },
      { pt: 0.4, color: 'C2BDB0' },
    ],
    fontFace: FONT,
    fontSize,
    color: C.ink,
    align: align ?? 'left',
    valign: 'middle',
  };
}

function headerRow(cells) {
  return cells.map((text) => ({
    text,
    options: {
      fill: { color: 'DCD8CC' },
      bold: true,
      fontFace: FONT_MONO,
      fontSize: 9,
      color: C.muted,
      align: 'center',
    },
  }));
}

function cell(text, opts = {}) {
  return { text: clean(text) || '—', options: { fontFace: FONT, fontSize: 10, color: C.ink, ...opts } };
}

async function main() {
  const t = loadText();
  const hero = t.hero ?? {};
  const about = t.about ?? {};
  const project = t.project ?? {};
  const bz = t.berserker ?? {};
  const combat = t.combatSystem ?? {};
  const sys = t.system ?? {};
  const ai = t.aiAutomation ?? {};
  const weaponsMd = t.weapons ?? {};
  const navItems = t.nav?.items ?? [];

  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: 'WIDE', width: 13.333, height: 7.5 });
  pptx.layout = 'WIDE';
  pptx.author = 'LEE DOYI';
  pptx.title = 'Combat Design Portfolio';
  pptx.subject = 'PC Combat Designer — Chrono Odyssey';
  pptx.company = 'LEE DOYI';

  const slides = [];
  const add = (build) => {
    const slide = pptx.addSlide();
    addBg(slide);
    slides.push({ slide, build });
    return slide;
  };

  // 1. Cover
  {
    const s = add();
    addKicker(s, hero.tagline ?? 'GAME COMBAT DESIGN PORTFOLIO');
    s.addText(hero.name ?? 'LEE DOYI', {
      x: T.x, y: 2.15, w: T.w, h: 1.15,
      fontFace: FONT_SERIF, fontSize: 48, color: C.ink, bold: true, margin: 0, charSpacing: 8,
    });
    s.addShape('rect', {
      x: T.x, y: 3.4, w: 1.1, h: 0.014,
      fill: { color: C.ink },
      line: { color: C.ink },
    });
    s.addText(lines(hero.statement).join('\n'), {
      x: T.x, y: 3.65, w: 8.4, h: 1.4,
      fontFace: FONT, fontSize: 16, color: C.inkDeep, margin: 0,
    });
    s.addText('PC Combat Designer  ·  Chrono Odyssey  ·  2024', {
      x: T.x, y: 5.55, w: T.w, h: 0.3,
      fontFace: FONT_MONO, fontSize: 11, color: C.gold, margin: 0,
    });
  }

  // 2. TOC
  {
    const s = add();
    addKicker(s, 'CONTENTS');
    addTitle(s, '목차');
    const items = navItems.length
      ? navItems.map((n) => n.label)
      : ['1. 개요', '2. 자기소개', '3. 프로젝트 개요', '4. 클래스 설계', '5. 전투 시스템', '6. AI 자동화'];
    items.forEach((label, i) => {
      const col = i < 5 ? 0 : 1;
      const row = i < 5 ? i : i - 5;
      const x = T.x + col * 6.2;
      const y = 1.45 + row * 0.72;
      s.addText(String(i + 1).padStart(2, '0'), {
        x, y, w: 0.7, h: 0.5,
        fontFace: FONT_MONO, fontSize: 12, color: C.gold, margin: 0, valign: 'middle',
      });
      s.addText(label, {
        x: x + 0.75, y, w: 5.1, h: 0.5,
        fontFace: FONT, fontSize: 16, color: C.ink, margin: 0, valign: 'middle',
      });
    });
  }

  // 3. About
  {
    const s = add();
    addKicker(s, about.sectionLabel ?? '02. 자기소개');
    addTitle(s, `${about.name ?? 'LEE DOYI'}  ·  ${about.role ?? 'PC Combat Designer'}`);
    s.addText(`“${about.quote ?? ''}”`, {
      x: T.x, y: 1.28, w: T.w, h: 0.48,
      fontFace: FONT_SERIF, fontSize: 18, italic: true, color: C.ink, margin: 0,
    });
    s.addText(lines(about.bio).join('\n'), {
      x: T.x, y: 1.82, w: 7.4, h: 1.35,
      fontFace: FONT, fontSize: 13, color: C.inkDeep, margin: 0,
    });
    card(s, 8.3, 1.82, 4.48, 1.35);
    s.addText([
      { text: 'CONTACT\n', options: { fontFace: FONT_MONO, fontSize: 9, color: C.muted, breakLine: true } },
      { text: `${about.email ?? ''}\n${about.phone ?? ''}`, options: { fontFace: FONT, fontSize: 12, color: C.ink } },
    ], { x: 8.5, y: 1.95, w: 4.1, h: 1.1, margin: 0 });

    (about.skills ?? []).forEach((sk, i) => {
      const x = T.x + (i % 3) * 4.08;
      const y = 3.4 + Math.floor(i / 3) * 0.55;
      card(s, x, y, 3.9, 0.46);
      s.addText(sk, {
        x, y, w: 3.9, h: 0.46,
        fontFace: FONT_MONO, fontSize: 12, color: C.ink, align: 'center', valign: 'middle', margin: 0,
      });
    });
  }

  // 4. Timeline
  {
    const s = add();
    addKicker(s, 'CAREER');
    addTitle(s, '경력 · 학력');
    const timeline = about.timeline ?? [];
    timeline.forEach((item, i) => {
      const y = 1.35 + i * 1.35;
      s.addShape('ellipse', {
        x: T.x + 0.08, y: y + 0.12, w: 0.16, h: 0.16,
        fill: { color: i === 0 ? C.ink : C.gold },
        line: { color: C.ink, pt: 0.75 },
      });
      if (i < timeline.length - 1) {
        s.addShape('rect', {
          x: T.x + 0.145, y: y + 0.32, w: 0.012, h: 1.05,
          fill: { color: 'C2BDB0' },
          line: { color: 'C2BDB0' },
        });
      }
      s.addText(item.date ?? '', {
        x: 1.0, y, w: 3.2, h: 0.28,
        fontFace: FONT_MONO, fontSize: 10, color: C.gold, margin: 0,
      });
      s.addText(item.title ?? '', {
        x: 1.0, y: y + 0.26, w: 6.2, h: 0.32,
        fontFace: FONT, fontSize: 16, bold: true, color: C.ink, margin: 0,
      });
      s.addText(item.role ?? '', {
        x: 1.0, y: y + 0.56, w: 6.2, h: 0.24,
        fontFace: FONT_MONO, fontSize: 11, color: C.muted, margin: 0,
      });
      s.addText(item.desc ?? '', {
        x: 1.0, y: y + 0.8, w: 6.4, h: 0.4,
        fontFace: FONT, fontSize: 12, color: C.inkDeep, margin: 0,
      });
    });
    card(s, 8.2, 1.35, 4.58, 4.55);
    s.addText(about.achievements?.title ?? 'Key Achievements', {
      x: 8.4, y: 1.5, w: 4.2, h: 0.35,
      fontFace: FONT_MONO, fontSize: 11, color: C.muted, margin: 0,
    });
    (about.achievements?.items ?? []).forEach((line, i) => {
      s.addText(`·  ${line}`, {
        x: 8.4, y: 2.0 + i * 1.15, w: 4.2, h: 1.05,
        fontFace: FONT, fontSize: 13, color: C.ink, margin: 0,
      });
    });
  }

  // 5. Project
  {
    const s = add();
    addKicker(s, project.subtitle ?? '03. 프로젝트 개요');
    addTitle(s, project.title ?? 'Project: Chrono Odyssey');
    s.addText(bz.heroBadge ?? 'ACTION MMORPG', {
      x: T.x, y: 1.28, w: T.w, h: 0.28,
      fontFace: FONT_MONO, fontSize: 11, color: C.gold, margin: 0,
    });
    s.addText(lines(bz.overviewBody).join('\n'), {
      x: T.x, y: 1.62, w: T.w, h: 1.05,
      fontFace: FONT, fontSize: 14, color: C.inkDeep, margin: 0,
    });
    (bz.meta ?? []).forEach((m, i) => {
      const x = T.x + (i % 4) * 3.06;
      const y = 2.85;
      card(s, x, y, 2.92, 1.15);
      s.addText(m.label ?? '', {
        x: x + 0.16, y: y + 0.18, w: 2.6, h: 0.28,
        fontFace: FONT_MONO, fontSize: 10, color: C.muted, margin: 0,
      });
      s.addText(m.value ?? '', {
        x: x + 0.16, y: y + 0.48, w: 2.6, h: 0.48,
        fontFace: FONT, fontSize: 14, bold: true, color: C.ink, margin: 0,
      });
    });
    s.addText(bz.contributionHeader ?? 'My Contribution', {
      x: T.x, y: 4.22, w: T.w, h: 0.32,
      fontFace: FONT_MONO, fontSize: 11, color: C.muted, margin: 0,
    });
    (bz.roles ?? []).forEach((r, i) => {
      const x = T.x + i * 4.08;
      card(s, x, 4.58, 3.9, 1.95);
      s.addText(r.title ?? '', {
        x: x + 0.2, y: 4.7, w: 3.5, h: 0.32,
        fontFace: FONT_MONO, fontSize: 11, color: C.gold, margin: 0,
      });
      s.addText(r.subtitle ?? '', {
        x: x + 0.2, y: 5.02, w: 3.5, h: 0.32,
        fontFace: FONT, fontSize: 15, bold: true, color: C.ink, margin: 0,
      });
      s.addText(lines(r.desc).join(' '), {
        x: x + 0.2, y: 5.4, w: 3.5, h: 0.95,
        fontFace: FONT, fontSize: 12, color: C.inkDeep, margin: 0,
      });
    });
  }

  // 8. Berserker
  {
    const s = add();
    addKicker(s, bz.classSectionLabel ?? '4. 클래스 설계');
    addTitle(s, `${bz.heroClassName ?? 'BERSERKER'}  ·  ${bz.heroRef ?? ''}`);
    s.addText(`“${bz.heroQuote ?? ''}”`, {
      x: T.x, y: 1.28, w: T.w, h: 0.5,
      fontFace: FONT_SERIF, fontSize: 16, italic: true, color: C.ink, margin: 0,
    });
    s.addText(lines(bz.heroBody).join('\n'), {
      x: T.x, y: 1.88, w: T.w, h: 1.55,
      fontFace: FONT, fontSize: 13, color: C.inkDeep, margin: 0,
    });
    s.addText(lines(bz.classIntro).join(' '), {
      x: T.x, y: 3.55, w: T.w, h: 0.7,
      fontFace: FONT, fontSize: 13, color: C.ink, margin: 0,
    });
    (bz.heroTags ?? []).forEach((tag, i) => {
      const x = T.x + i * 2.15;
      card(s, x, 4.4, 2.0, 0.42);
      s.addText(tag, {
        x, y: 4.4, w: 2.0, h: 0.42,
        fontFace: FONT_MONO, fontSize: 11, color: C.ink, align: 'center', valign: 'middle', margin: 0,
      });
    });
  }

  // 9. Weapon lineup
  {
    const s = add();
    addKicker(s, 'WEAPON LOADOUT');
    addTitle(s, '무기 설계 개요');
    (bz.weapons ?? []).forEach((w, i) => {
      const x = T.x + i * 4.08;
      card(s, x, 1.4, 3.9, 5.15);
      s.addText(w.eng ?? '', {
        x: x + 0.22, y: 1.55, w: 3.46, h: 0.26,
        fontFace: FONT_MONO, fontSize: 10, color: C.gold, margin: 0,
      });
      s.addText(w.name ?? '', {
        x: x + 0.22, y: 1.82, w: 3.46, h: 0.4,
        fontFace: FONT, fontSize: 22, bold: true, color: C.ink, margin: 0,
      });
      s.addText(w.keyword ?? '', {
        x: x + 0.22, y: 2.28, w: 3.46, h: 0.28,
        fontFace: FONT_MONO, fontSize: 12, color: C.muted, margin: 0,
      });
      s.addText(lines(w.desc).join('\n'), {
        x: x + 0.22, y: 2.65, w: 3.46, h: 1.15,
        fontFace: FONT, fontSize: 12, color: C.inkDeep, margin: 0,
      });
      const stats = WEAPON_STATS[w.slug] ?? {};
      Object.entries(stats).forEach(([k, v], si) => {
        const sy = 3.95 + si * 0.42;
        s.addText(k, {
          x: x + 0.22, y: sy, w: 1.35, h: 0.32,
          fontFace: FONT_MONO, fontSize: 10, color: C.muted, margin: 0, valign: 'middle',
        });
        s.addShape('rect', {
          x: x + 1.6, y: sy + 0.1, w: 1.9, h: 0.12,
          fill: { color: 'D6D1C4' },
          line: { color: 'D6D1C4' },
        });
        s.addShape('rect', {
          x: x + 1.6, y: sy + 0.1, w: 1.9 * (v / 100), h: 0.12,
          fill: { color: C.ink },
          line: { color: C.ink },
        });
        s.addText(String(v), {
          x: x + 3.52, y: sy, w: 0.32, h: 0.32,
          fontFace: FONT_MONO, fontSize: 9, color: C.ink, margin: 0, valign: 'middle',
        });
      });
    });
  }

  // Per-weapon slides
  const weaponSlugs = ['chainsword', 'dualaxe', 'battleaxe'];
  const weaponMeta = Object.fromEntries((bz.weapons ?? []).map((w) => [w.slug, w]));

  for (const slug of weaponSlugs) {
    const w = weaponsMd[slug] ?? {};
    const meta = weaponMeta[slug] ?? {};
    const name = w.name ?? meta.name ?? slug;
    const eng = meta.eng ?? slug.toUpperCase();

    {
      const s = add();
      addKicker(s, `CLASS DESIGN  ·  ${eng}`);
      addTitle(s, name);
      s.addText(w.description ?? meta.desc ?? '', {
        x: T.x, y: 1.28, w: T.w, h: 0.45,
        fontFace: FONT, fontSize: 14, color: C.inkDeep, margin: 0,
      });
      s.addText(w.mechanic ?? '', {
        x: T.x, y: 1.72, w: T.w, h: 0.4,
        fontFace: FONT_MONO, fontSize: 12, color: C.gold, margin: 0,
      });

      const blocks = [
        { label: '기본 공격', body: `${w.basicAttack?.name ?? ''}\n${w.basicAttack?.description ?? ''}\n${(w.basicAttack?.steps ?? []).map((st) => `· ${st.name}: ${st.description}`).join('\n')}` },
        { label: w.specialAction?.name ?? '특수 액션', body: `${w.specialAction?.description ?? ''}\n${w.specialAction?.mechanic ?? ''}` },
        { label: '연계 공격', body: (w.movementAttackSteps ?? []).map((st) => `· ${st.name}: ${st.description}`).join('\n') },
      ];
      blocks.forEach((b, i) => {
        const x = T.x + i * 4.08;
        card(s, x, 2.25, 3.9, 4.3);
        s.addText(b.label, {
          x: x + 0.2, y: 2.4, w: 3.5, h: 0.32,
          fontFace: FONT_MONO, fontSize: 11, color: C.gold, margin: 0,
        });
        s.addText(b.body, {
          x: x + 0.2, y: 2.78, w: 3.5, h: 3.55,
          fontFace: FONT, fontSize: 12, color: C.ink, margin: 0,
        });
      });
    }

    {
      const s = add();
      addKicker(s, `${eng}  ·  STANCE`);
      addTitle(s, `${name} 전투 태세`);
      stanceList(w).forEach((st, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = T.x + col * 6.2;
        const y = 1.32 + row * 2.75;
        card(s, x, y, 5.95, 2.58);
        s.addText(`${st.id}  ·  ${st.concept ?? ''}`, {
          x: x + 0.22, y: y + 0.14, w: 5.5, h: 0.24,
          fontFace: FONT_MONO, fontSize: 10, color: C.gold, margin: 0,
        });
        s.addText(st.name ?? '', {
          x: x + 0.22, y: y + 0.38, w: 5.5, h: 0.34,
          fontFace: FONT, fontSize: 18, bold: true, color: C.ink, margin: 0,
        });
        s.addText(st.description ?? '', {
          x: x + 0.22, y: y + 0.74, w: 5.5, h: 0.55,
          fontFace: FONT, fontSize: 11, color: C.inkDeep, margin: 0,
        });
        const kws = (st.keywords ?? []).map((k) => `#${k}`).join('   ');
        s.addText(kws, {
          x: x + 0.22, y: y + 1.28, w: 5.5, h: 0.22,
          fontFace: FONT_MONO, fontSize: 9, color: C.muted, margin: 0,
        });
        s.addText(`흐름  ${(st.flowSteps ?? []).join('  →  ')}`, {
          x: x + 0.22, y: y + 1.52, w: 5.5, h: 0.28,
          fontFace: FONT, fontSize: 10, color: C.ink, margin: 0,
        });
        const fury = [`트리거: ${st.furyTrigger ?? '—'}`, `효과: ${st.furyEffect ?? '—'}`, `리스크: ${st.furyRisk ?? '—'}`].join('\n');
        s.addText(fury, {
          x: x + 0.22, y: y + 1.82, w: 5.5, h: 0.62,
          fontFace: FONT, fontSize: 10, color: C.inkDeep, margin: 0,
        });
      });
    }

    {
      const s = add();
      addKicker(s, `${eng}  ·  ACTIVE SKILLS`);
      addTitle(s, `${name} 액티브 스킬`);
      const skills = skillEntries(w);
      s.addTable(
        [
          headerRow(['ID', '스킬', '기본 설명', '자원']),
          ...skills.map((sk) => [
            cell(sk.id, { fontFace: FONT_MONO, fontSize: 9, align: 'center' }),
            cell(sk.name, { bold: true }),
            cell(sk.desc, { fontSize: 10 }),
            cell(sk.resource, { fontFace: FONT_MONO, fontSize: 9, align: 'center' }),
          ]),
        ],
        tableOpts({ x: T.x, y: 1.32, w: T.w, colW: [1.35, 1.9, 7.38, 1.6], fontSize: 11 }),
      );
    }
  }

  // Combat intro
  {
    const s = add();
    addKicker(s, combat.subtitle ?? '05. 전투 시스템');
    addTitle(s, combat.title ?? 'Combat System');
    s.addText(combat.intro ?? '', {
      x: T.x, y: 1.35, w: T.w, h: 0.7,
      fontFace: FONT, fontSize: 16, color: C.inkDeep, margin: 0,
    });
    const systems = [
      { title: sys.regain?.title ?? '리게인 시스템', body: sys.regainIntent ?? '' },
      {
        title: sys.smartTargeting?.title ?? '스마트 타겟팅',
        body: sys.smartTargeting?.synergy?.desc ?? '',
      },
    ];
    systems.forEach((item, i) => {
      const y = 2.25 + i * 2.15;
      card(s, T.x, y, T.w, 1.98);
      s.addText(item.title, {
        x: 0.8, y: y + 0.22, w: 11.7, h: 0.38,
        fontFace: FONT, fontSize: 18, bold: true, color: C.ink, margin: 0,
      });
      s.addText(item.body, {
        x: 0.8, y: y + 0.7, w: 11.7, h: 1.05,
        fontFace: FONT, fontSize: 13, color: C.inkDeep, margin: 0,
      });
    });
  }

  // Regain
  {
    const s = add();
    addKicker(s, 'COMBAT SYSTEM');
    addTitle(s, sys.regain?.title ?? '리게인 시스템');
    s.addText(sys.regainIntent ?? '', {
      x: T.x, y: 1.28, w: T.w, h: 0.55,
      fontFace: FONT, fontSize: 13, color: C.inkDeep, margin: 0,
    });
    s.addText('규칙', {
      x: T.x, y: 1.9, w: 6.0, h: 0.28,
      fontFace: FONT_MONO, fontSize: 11, color: C.gold, margin: 0,
    });
    (sys.doc?.rules ?? []).forEach((r, i) => {
      s.addText(`${r.title}  —  ${r.desc}`, {
        x: T.x, y: 2.22 + i * 0.55, w: 6.05, h: 0.52,
        fontFace: FONT, fontSize: 12, color: C.ink, margin: 0,
      });
    });
    s.addText('예외', {
      x: 7.0, y: 1.9, w: 5.7, h: 0.28,
      fontFace: FONT_MONO, fontSize: 11, color: C.gold, margin: 0,
    });
    (sys.doc?.exceptions ?? sys.regain?.exceptions ?? []).forEach((e, i) => {
      s.addText(`${e.label ?? e.title}  —  ${e.desc}`, {
        x: 7.0, y: 2.22 + i * 0.55, w: 5.78, h: 0.52,
        fontFace: FONT, fontSize: 12, color: C.ink, margin: 0,
      });
    });
    s.addText(sys.regain?.synergy?.desc ?? '', {
      x: T.x, y: 4.55, w: T.w, h: 1.0,
      fontFace: FONT, fontSize: 13, italic: true, color: C.inkDeep, margin: 0,
    });
  }

  {
    const s = add();
    addKicker(s, 'REGAIN  ·  SPEC');
    addTitle(s, '리게인 변수 · 시나리오');
    const vars = sys.doc?.variables ?? sys.regain?.variables ?? [];
    s.addTable(
      [
        headerRow(['구분', '변수', '타입', '설명']),
        ...vars.map((v) => [
          cell(v.category ?? '—', { fontSize: 9, color: C.muted }),
          cell(v.name, { fontFace: FONT_MONO, fontSize: 10, bold: true }),
          cell(v.type, { align: 'center', fontFace: FONT_MONO, fontSize: 9 }),
          cell(v.desc, { fontSize: 10 }),
        ]),
      ],
      tableOpts({ x: T.x, y: 1.28, w: T.w, colW: [1.8, 3.1, 1.15, 6.18], fontSize: 10 }),
    );
    const scenarios = sys.doc?.scenarios ?? [];
    scenarios.forEach((sc, i) => {
      const x = T.x + i * 4.08;
      card(s, x, 5.05, 3.9, 1.55);
      s.addText(`${sc.type}  ·  ${sc.action ?? ''}`, {
        x: x + 0.18, y: 5.15, w: 3.54, h: 0.24,
        fontFace: FONT_MONO, fontSize: 10, color: C.gold, margin: 0,
      });
      s.addText(sc.title ?? '', {
        x: x + 0.18, y: 5.38, w: 3.54, h: 0.28,
        fontFace: FONT, fontSize: 13, bold: true, color: C.ink, margin: 0,
      });
      s.addText(sc.desc ?? '', {
        x: x + 0.18, y: 5.7, w: 3.54, h: 0.75,
        fontFace: FONT, fontSize: 11, color: C.inkDeep, margin: 0,
      });
    });
  }

  // Smart targeting
  {
    const s = add();
    addKicker(s, 'COMBAT SYSTEM');
    addTitle(s, sys.smartTargeting?.title ?? '스마트 타겟팅');
    s.addText('FinalScore = (DistanceScore × W_Dist) + (AngleScore × W_Angle) + (InputScore × W_Input)', {
      x: T.x, y: 1.28, w: T.w, h: 0.4,
      fontFace: FONT_MONO, fontSize: 13, color: C.ink, margin: 0,
    });
    (sys.smartTargeting?.formula?.params ?? []).forEach((p, i) => {
      card(s, T.x + i * 4.08, 1.85, 3.9, 1.15);
      s.addText(p, {
        x: T.x + i * 4.08 + 0.2, y: 2.05, w: 3.5, h: 0.8,
        fontFace: FONT, fontSize: 13, color: C.ink, margin: 0,
      });
    });
    s.addText(sys.smartTargeting?.synergy?.weapon ?? 'Action Camera System', {
      x: T.x, y: 3.25, w: T.w, h: 0.3,
      fontFace: FONT_MONO, fontSize: 11, color: C.gold, margin: 0,
    });
    s.addText(sys.smartTargeting?.synergy?.desc ?? '', {
      x: T.x, y: 3.58, w: T.w, h: 1.2,
      fontFace: FONT, fontSize: 14, color: C.inkDeep, margin: 0,
    });
  }

  // AI
  {
    const s = add();
    addKicker(s, ai.subtitle ?? '06. AI 도구 활용 자동화');
    addTitle(s, ai.heading ?? ai.title ?? 'AI Automation');
    s.addText(lines(ai.intro).join('\n'), {
      x: T.x, y: 1.28, w: T.w, h: 0.85,
      fontFace: FONT, fontSize: 13, color: C.inkDeep, margin: 0,
    });
    s.addText(ai.backgroundTitle ?? '도입 배경', {
      x: T.x, y: 2.25, w: 7.4, h: 0.28,
      fontFace: FONT_MONO, fontSize: 11, color: C.gold, margin: 0,
    });
    (ai.background ?? []).forEach((b, i) => {
      s.addText(`·  ${b}`, {
        x: T.x, y: 2.58 + i * 0.5, w: 7.4, h: 0.48,
        fontFace: FONT, fontSize: 13, color: C.ink, margin: 0,
      });
    });
    card(s, 8.2, 2.25, 4.58, 2.55);
    s.addText(ai.resultsTitle ?? '성과', {
      x: 8.4, y: 2.4, w: 4.2, h: 0.28,
      fontFace: FONT_MONO, fontSize: 11, color: C.gold, margin: 0,
    });
    (ai.results ?? []).forEach((r, i) => {
      s.addText(r, {
        x: 8.4, y: 2.8 + i * 0.85, w: 4.2, h: 0.8,
        fontFace: FONT, fontSize: 13, color: C.ink, margin: 0,
      });
    });
    s.addText(ai.roleTitle ?? '역할 및 검증', {
      x: T.x, y: 4.3, w: T.w, h: 0.26,
      fontFace: FONT_MONO, fontSize: 11, color: C.gold, margin: 0,
    });
    s.addText(lines(ai.roleBody).join(' '), {
      x: T.x, y: 4.58, w: T.w, h: 0.7,
      fontFace: FONT, fontSize: 13, color: C.ink, margin: 0,
    });
    s.addText(`${ai.limitTitle ?? '한계'}  ·  ${clean(ai.limitBody)}`, {
      x: T.x, y: 5.35, w: T.w, h: 0.7,
      fontFace: FONT, fontSize: 12, color: C.muted, margin: 0,
    });
  }

  {
    const s = add();
    addKicker(s, 'PIPELINE');
    addTitle(s, ai.pipelineTitle ?? '자동화 파이프라인');
    (ai.pipeline ?? []).forEach((step, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const x = T.x + col * 4.08;
      const y = 1.4 + row * 2.55;
      card(s, x, y, 3.9, 2.35);
      s.addText(String(i + 1).padStart(2, '0'), {
        x: x + 0.22, y: y + 0.18, w: 3.46, h: 0.28,
        fontFace: FONT_MONO, fontSize: 12, color: C.gold, margin: 0,
      });
      s.addText(step.title ?? '', {
        x: x + 0.22, y: y + 0.5, w: 3.46, h: 0.55,
        fontFace: FONT, fontSize: 16, bold: true, color: C.ink, margin: 0,
      });
      s.addText(step.desc ?? '', {
        x: x + 0.22, y: y + 1.12, w: 3.46, h: 1.0,
        fontFace: FONT, fontSize: 12, color: C.inkDeep, margin: 0,
      });
    });
  }

  // Closing
  {
    const s = add();
    addKicker(s, t.footer?.tagline ?? 'COMBAT DESIGNER PORTFOLIO');
    s.addText(t.footer?.name ?? hero.name ?? 'LEE DOYI', {
      x: T.x, y: 2.3, w: T.w, h: 0.9,
      fontFace: FONT_SERIF, fontSize: 40, bold: true, color: C.ink, margin: 0, charSpacing: 6,
    });
    s.addShape('rect', {
      x: T.x, y: 3.35, w: 1.1, h: 0.014,
      fill: { color: C.ink },
      line: { color: C.ink },
    });
    s.addText(lines(hero.statement).join('\n'), {
      x: T.x, y: 3.6, w: 9, h: 1.1,
      fontFace: FONT, fontSize: 16, color: C.inkDeep, margin: 0,
    });
    s.addText(`${about.email ?? ''}   ·   ${about.phone ?? ''}`, {
      x: T.x, y: 5.1, w: T.w, h: 0.35,
      fontFace: FONT_MONO, fontSize: 13, color: C.gold, margin: 0,
    });
  }

  const total = slides.length;
  slides.forEach(({ slide }, i) => addFooter(slide, i + 1, total));

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  await pptx.writeFile({ fileName: OUT });
  console.log(`Wrote ${total} slides → ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
