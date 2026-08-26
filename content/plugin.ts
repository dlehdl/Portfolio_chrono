import fs from 'node:fs';
import path from 'node:path';
import { parseDocument } from 'yaml';
import type { Plugin } from 'vite';

const TEXT_MD = 'text.md';

function extractYaml(raw: string): { yaml: string; before: string; after: string } {
  const fenced = raw.match(/```ya?ml\s*\n([\s\S]*?)```/);
  if (fenced && fenced.index != null) {
    const inner = fenced[1];
    const start = fenced.index + fenced[0].indexOf('\n') + 1;
    const end = start + inner.length;
    return { yaml: inner, before: raw.slice(0, start), after: raw.slice(end) };
  }
  const start = raw.search(/^[a-zA-Z_][\w]*:/m);
  if (start >= 0) return { yaml: raw.slice(start), before: raw.slice(0, start), after: '' };
  throw new Error('text.md에서 YAML을 찾지 못했습니다.');
}

function toYamlPath(dot: string): Array<string | number> {
  return dot.split('.').map((seg) => (/^\d+$/.test(seg) ? Number(seg) : seg));
}

function needsQuotes(s: string): boolean {
  if (s === '') return true;
  if (/^[-:?!&*!|>@`#{}[\],]|[\n:]/.test(s)) return true;
  if (s.startsWith(' ') || s.endsWith(' ')) return true;
  if (/^(true|false|null|yes|no|on|off)$/i.test(s)) return true;
  if (/^-?\d+(\.\d+)?$/.test(s)) return true;
  return false;
}

function serializeScalar(node: any, yamlSrc: string, value: unknown): string {
  if (value === null) return 'null';
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);

  const text = String(value);
  const orig = yamlSrc.slice(node.range[0], node.range[1]);
  const type = node.type as string;

  if (type === 'BLOCK_LITERAL' || type === 'BLOCK_FOLDED' || text.includes('\n')) {
    const header = orig.match(/^([|>][+-]?)/)?.[1] || '|-';
    const indentMatch = orig.match(/\n([ \t]+)\S/);
    const indent = indentMatch ? indentMatch[1] : '    ';
    const body = text.split('\n').map((line) => indent + line).join('\n');
    const trailing = orig.endsWith('\n') ? '\n' : '';
    return `${header}\n${body}${trailing}`;
  }

  if (type === 'QUOTE_SINGLE' || needsQuotes(text)) {
    return `'${text.replace(/'/g, "''")}'`;
  }

  return text;
}

function readJson(req: import('http').IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (c) => chunks.push(c as Buffer));
    req.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function send(res: import('http').ServerResponse, code: number, body: unknown) {
  res.statusCode = code;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

export function contentEditorPlugin(root: string): Plugin {
  const file = path.join(root, TEXT_MD);

  return {
    name: 'content-editor',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0];
        if (req.method !== 'POST' || url !== '/__content/save') return next();

        try {
          const { path: dotPath, value } = await readJson(req);
          if (!dotPath || typeof dotPath !== 'string') {
            send(res, 400, { ok: false, error: 'path가 필요합니다.' });
            return;
          }

          const raw = fs.readFileSync(file, 'utf8');
          const parts = extractYaml(raw);
          const doc = parseDocument(parts.yaml);
          const ypath = toYamlPath(dotPath);
          const node = doc.getIn(ypath, true) as { type?: string; range?: [number, number] } | null;
          if (!node?.range) {
            send(res, 404, { ok: false, error: `키를 찾을 수 없습니다: ${dotPath}` });
            return;
          }

          const [start, end] = node.range;
          const nextScalar = serializeScalar(node, parts.yaml, value);
          const yamlOut = `${parts.yaml.slice(0, start)}${nextScalar}${parts.yaml.slice(end)}`;
          fs.writeFileSync(file, `${parts.before}${yamlOut}${parts.after}`, 'utf8');
          send(res, 200, { ok: true, path: dotPath });
        } catch (err) {
          send(res, 500, { ok: false, error: err instanceof Error ? err.message : String(err) });
        }
      });
    },
  };
}
