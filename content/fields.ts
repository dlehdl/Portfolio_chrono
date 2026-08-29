export type ContentField = {
  path: string;
  value: string;
  kind: 'string' | 'number' | 'boolean' | 'null';
};

const GROUP_LABEL: Record<string, string> = {
  nav: '내비',
  hero: '1. 개요',
  about: '2. 자기소개',
  footer: '푸터',
  project: '3. 프로젝트',
  berserker: '3. 버서커',
  ui: 'UI 라벨',
  weaponTrees: '스킬 트리 맵',
  weapons: '무기',
  passives: '패시브',
  combatSystem: '5. 전투 시스템',
  system: '5. 시스템 상세',
  aiAutomation: '6. AI 자동화',
};

export function fieldGroup(path: string): string {
  const [root, second] = path.split('.');
  if (root === 'weapons' && second) {
    const names: Record<string, string> = {
      chainsword: '4.1 사슬검',
      dualaxe: '4.2 쌍도끼',
      battleaxe: '4.3 전투도끼',
    };
    return names[second] ?? `무기 · ${second}`;
  }
  return GROUP_LABEL[root] ?? root;
}

const KEY_KO: Record<string, string> = {
  resource: '자원',
  actionSummary: '핵심 액션',
  baseDescription: '기본 설명',
  designIntent: '기획 의도',
  insight: '기획 의도',
  description: '설명',
  meaningfulChoice: '의미 있는 선택',
  name: '이름',
  concept: '콘셉트',
};

export function fieldLabel(path: string, root?: Record<string, any>): string {
  const parts = path.split('.');
  const last = parts[parts.length - 1];
  const keyKo = KEY_KO[last] ?? last;

  const skillIdx = parts.indexOf('skills');
  if (skillIdx >= 0 && parts[skillIdx + 1]) {
    const weapon = parts[1];
    const skillId = parts[skillIdx + 1];
    const skillName = root?.weapons?.[weapon]?.skills?.[skillId]?.name ?? skillId;
    const nodesIdx = parts.indexOf('nodes');
    if (nodesIdx >= 0) {
      const n = Number(parts[nodesIdx + 1]);
      const stage = n === 0 ? '1단계' : n === 1 ? '2단계' : `${n + 1}단계`;
      const pathKey = parts[nodesIdx - 1];
      const pathName = root?.weapons?.[weapon]?.skills?.[skillId]?.evolution?.[pathKey]?.name ?? pathKey;
      return `${skillName} · ${pathName} · ${stage} ${keyKo}`;
    }
    if (last === 'resource') return `${skillName} · 기본 자원`;
    return `${skillName} · ${keyKo}`;
  }

  const parent = parts[parts.length - 2];
  if (parent && /^[A-Z]{2}_\d+$/.test(parent)) return `${parent} · ${keyKo}`;
  if (parent && /^[A-Z]{2}-T\d/.test(parent)) return `${parent} · ${keyKo}`;
  if (parent && /^\d+$/.test(parent)) {
    const grand = parts[parts.length - 3];
    return `${grand ?? ''}[${parent}] · ${keyKo}`.replace(/^\s·\s/, '');
  }
  return keyKo;
}

export function flattenContent(obj: unknown, prefix = ''): ContentField[] {
  if (obj == null) {
    return prefix ? [{ path: prefix, value: '', kind: 'null' }] : [];
  }
  if (typeof obj === 'string') return [{ path: prefix, value: obj, kind: 'string' }];
  if (typeof obj === 'number') return [{ path: prefix, value: String(obj), kind: 'number' }];
  if (typeof obj === 'boolean') return [{ path: prefix, value: obj ? 'true' : 'false', kind: 'boolean' }];
  if (Array.isArray(obj)) {
    return obj.flatMap((item, i) => flattenContent(item, prefix ? `${prefix}.${i}` : String(i)));
  }
  if (typeof obj === 'object') {
    return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) =>
      flattenContent(v, prefix ? `${prefix}.${k}` : k),
    );
  }
  return [];
}

export function parseFieldValue(kind: ContentField['kind'], raw: string): string | number | boolean | null {
  if (kind === 'null' && raw.trim() === '') return null;
  if (kind === 'number') {
    const n = Number(raw);
    return Number.isFinite(n) ? n : raw;
  }
  if (kind === 'boolean') return raw === 'true' || raw === '1';
  return raw;
}
