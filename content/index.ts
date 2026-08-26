import { load as loadYaml } from 'js-yaml';
import textMd from '../text.md?raw';

export type TextContent = Record<string, any>;

function extractYamlBlock(raw: string): string {
  const fenced = raw.match(/```ya?ml\s*\n([\s\S]*?)```/);
  if (fenced) return fenced[1];
  const start = raw.search(/^[a-zA-Z_][\w]*:/m);
  return start >= 0 ? raw.slice(start) : raw;
}

function loadTextContent(): TextContent {
  const yamlSrc = extractYamlBlock(textMd);
  const parsed = loadYaml(yamlSrc);
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('text.md YAML 파싱 실패: 유효한 객체가 아닙니다.');
  }
  return parsed as TextContent;
}

/** 포트폴리오 전역 텍스트 — text.md 수정 시 반영 */
export const text: TextContent = loadTextContent();

/** 점 경로로 값 조회. 없으면 fallback */
export function t(path: string, fallback: string = ''): string {
  const parts = path.split('.');
  let cur: any = text;
  for (const p of parts) {
    if (cur == null || typeof cur !== 'object') return fallback;
    cur = cur[p];
  }
  if (cur == null) return fallback;
  if (typeof cur === 'string' || typeof cur === 'number') return String(cur);
  return fallback;
}

export function tList(path: string): any[] {
  const parts = path.split('.');
  let cur: any = text;
  for (const p of parts) {
    if (cur == null || typeof cur !== 'object') return [];
    cur = cur[p];
  }
  return Array.isArray(cur) ? cur : [];
}
