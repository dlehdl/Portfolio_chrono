import React, { useEffect, useMemo, useState } from 'react';
import { Pencil, Search, X, Save, Check } from 'lucide-react';
import { text } from '../content';
import { fieldGroup, fieldLabel, flattenContent, parseFieldValue, type ContentField } from '../content/fields';

type Drafts = Record<string, string>;

export default function ContentEditor() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [drafts, setDrafts] = useState<Drafts>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [error, setError] = useState('');

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const fields = useMemo(() => flattenContent(text), [text]);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? fields.filter((f) =>
          f.path.toLowerCase().includes(q)
          || f.value.toLowerCase().includes(q)
          || fieldLabel(f.path, text).toLowerCase().includes(q)
          || fieldGroup(f.path).toLowerCase().includes(q),
        )
      : fields;

    const map = new Map<string, ContentField[]>();
    for (const f of filtered) {
      const g = fieldGroup(f.path);
      const list = map.get(g) ?? [];
      list.push(f);
      map.set(g, list);
    }
    return [...map.entries()];
  }, [fields, query]);

  const dirtyCount = Object.keys(drafts).length;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const saveOne = async (field: ContentField) => {
    const raw = drafts[field.path];
    if (raw === undefined) return;
    setSaving(field.path);
    setError('');
    try {
      const res = await fetch('/__content/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: field.path, value: parseFieldValue(field.kind, raw) }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || '저장 실패');
      setDrafts((d) => {
        const next = { ...d };
        delete next[field.path];
        return next;
      });
      setSaved(field.path);
      window.setTimeout(() => setSaved((cur) => (cur === field.path ? null : cur)), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(null);
    }
  };

  const saveAll = async () => {
    const pending = fields.filter((f) => drafts[f.path] !== undefined);
    for (const f of pending) await saveOne(f);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-[80] flex items-center gap-2 px-3.5 py-2.5 bg-archival-ink text-[#F2EFE9] text-[11px] font-archival-mono tracking-[0.14em] uppercase shadow-lg hover:bg-archival-ink-deep"
      >
        <Pencil size={13} strokeWidth={1.5} />
        문구 편집
      </button>

      {open && (
        <aside className="fixed inset-y-0 right-0 z-[90] w-full max-w-[440px] bg-[#F2EFE9] border-l border-archival-ink/20 flex flex-col">
          <div className="px-5 pt-5 pb-4 border-b border-archival-ink/15">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p className="text-[10px] font-archival-mono tracking-[0.28em] uppercase text-archival-ink/55 mb-1">Content</p>
                <h2 className="font-archival-serif text-xl text-archival-ink">문구 편집</h2>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="p-1 text-archival-ink/60 hover:text-archival-ink" aria-label="닫기">
                <X size={18} />
              </button>
            </div>
            <p className="text-[11px] text-archival-ink/70 mb-3 leading-relaxed">
              검색 후 수정하고 저장하면 <span className="font-archival-mono">text.md</span>에 바로 반영됩니다. ⌘⇧E
            </p>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-archival-ink/40" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="스킬명, CS_01, 문구 검색"
                className="w-full pl-9 pr-3 py-2 text-sm bg-white/70 border border-archival-ink/20 outline-none focus:border-archival-ink/50 font-archival-mono"
              />
            </div>
            {error && <p className="mt-2 text-[11px] text-red-800">{error}</p>}
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[10px] font-archival-mono text-archival-ink/50">{fields.length} fields · {dirtyCount} unsaved</span>
              <button
                type="button"
                disabled={!dirtyCount || saving !== null}
                onClick={saveAll}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-archival-mono tracking-wider uppercase border border-archival-ink/40 disabled:opacity-40 hover:bg-archival-ink hover:text-[#F2EFE9]"
              >
                <Save size={12} />
                변경 저장
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
            {groups.map(([group, list]) => {
              const expanded = query.trim().length > 0 || openGroups[group] === true;
              return (
              <section key={group}>
                <button
                  type="button"
                  onClick={() => setOpenGroups((g) => ({ ...g, [group]: !expanded }))}
                  className="w-full text-left text-[10px] font-archival-mono tracking-[0.22em] uppercase text-archival-ink/70 mb-2 py-1 border-b border-archival-ink/10"
                >
                  {group}  ·  {list.length}
                </button>
                {expanded && (
                <div className="space-y-3">
                  {list.map((field) => {
                    const current = drafts[field.path] ?? field.value;
                    const dirty = drafts[field.path] !== undefined;
                    const rows = current.includes('\n') || current.length > 80 ? 4 : 2;
                    return (
                      <label key={field.path} className="block">
                        <span className="flex items-baseline justify-between gap-2 mb-1">
                          <span className="text-[11px] font-medium text-archival-ink">{fieldLabel(field.path, text)}</span>
                          <span className="text-[9px] font-archival-mono text-archival-ink/40 truncate">{field.path}</span>
                        </span>
                        <textarea
                          value={current}
                          rows={rows}
                          onChange={(e) => setDrafts((d) => ({ ...d, [field.path]: e.target.value }))}
                          className={`w-full px-2.5 py-2 text-[12px] leading-relaxed bg-white/80 border outline-none resize-y ${
                            dirty ? 'border-archival-ink/70' : 'border-archival-ink/15 focus:border-archival-ink/40'
                          }`}
                        />
                        {dirty && (
                          <button
                            type="button"
                            onClick={() => saveOne(field)}
                            className="mt-1 text-[10px] font-archival-mono tracking-wider uppercase text-archival-ink/80 hover:text-archival-ink"
                          >
                            {saving === field.path ? '저장 중…' : saved === field.path ? (
                              <span className="inline-flex items-center gap-1"><Check size={11} /> 저장됨</span>
                            ) : '이 항목 저장'}
                          </button>
                        )}
                      </label>
                    );
                  })}
                </div>
                )}
              </section>
              );
            })}
          </div>
        </aside>
      )}
    </>
  );
}
