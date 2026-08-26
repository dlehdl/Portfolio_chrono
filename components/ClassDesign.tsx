import React, { useMemo, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WEAPON_DATA } from '../constants';
import chainswordSpecialActionVideo from '../video/Chainsword_Specialaction.mp4';
import dualaxeSpecialActionVideo from '../video/dualaxes_specialaction.mp4';
import dualaxeNormalAttack01Video from '../video/dualaxes_normalattack01.mp4';
import dualaxeNormalAttack02Video from '../video/dualaxes_normalattack02.mp4';
import dualaxeNormalAttack03Video from '../video/dualaxes_normalattack03.mp4';
import dualaxeSprintAttackVideo from '../video/dualaxes_sprintattack.mp4';
import dualaxeEvadeAttackFVideo from '../video/dualaxes_evadeattack_f.mp4';
import dualaxeEvadeAttackBVideo from '../video/dualaxes_evadeattack_b.mp4';
import chainswordNormalAttack01Video from '../video/chainsword_normalattack01.mp4';
import chainswordNormalAttack02Video from '../video/chainsword_normalattack02.mp4';
import chainswordNormalAttack03Video from '../video/chainsword_normalattack03.mp4';
import battleaxeNormalAttack01Video from '../video/battleaxe_normalattack01.mp4';
import battleaxeNormalAttack02Video from '../video/battleaxe_normalattack02.mp4';
import battleaxeNormalAttack03Video from '../video/battleaxe_normalattack03.mp4';
import chainswordSprintAttackVideo from '../video/chainsword_sprintattack.mp4';
import chainswordEvadeAttackFVideo from '../video/chainsword_evadeattack_F.mp4';
import chainswordEvadeAttackBVideo from '../video/chainsword_evadeattack_b.mp4';
import battleaxeSpecialActionVideo from '../video/battleaxe_specialaction.mp4';
import battleaxeSprintAttackVideo from '../video/battleaxe_sprintattack.mp4';
import battleaxeEvadeAttackFVideo from '../video/battleaxe_evadeattack_f.mp4';
import battleaxeEvadeAttackBVideo from '../video/battleaxe_evadeattack_b.mp4';
import { EvolutionNode, PassiveNode, FrameData, Stance, ActiveSkillDetail, SkillTree, ComboStep } from '../types';
import { Play, Ruler, MousePointer2, GitFork, Lightbulb, Workflow, Info, BarChart3, ChevronRight, ChevronDown, Zap, Database, Sword, Target, Crosshair, Split, CornerDownRight, Grid3X3, ArrowDown, Network, Layers, ArrowUp, Hexagon, Circle, Settings2, Activity, Hash, MousePointerClick, Move, ShieldAlert, Shield, RotateCw, Hammer } from 'lucide-react';
import { text } from '../content';

const ui = text.ui?.classDesign ?? {};

// --- HELPERS ---

type StanceConfigItem = {
    color: string;
    border: string;
    bg: string;
    text: string;
    shade?: string; // EvolutionCard 등에서 사용 (기본 500 대신 600/700 등)
    evolutionBorder?: string;
    evolutionText?: string;
    evolutionBg?: string;
};
const STANCE_CONFIG: Record<string, StanceConfigItem> = {
    'A-1': { color: 'rose', border: 'border-rose-700', bg: 'bg-rose-900/20', text: 'text-rose-600', shade: '700', evolutionBorder: 'border-rose-700/30', evolutionText: 'text-rose-600', evolutionBg: 'bg-rose-900/20' },
    'A-2': { color: 'amber', border: 'border-amber-700', bg: 'bg-amber-900/20', text: 'text-amber-600', shade: '700', evolutionBorder: 'border-amber-700/30', evolutionText: 'text-amber-600', evolutionBg: 'bg-amber-900/20' },
    'B-1': { color: 'teal', border: 'border-teal-500', bg: 'bg-teal-500/20', text: 'text-teal-400' },
    'B-2': { color: 'slate', border: 'border-slate-400', bg: 'bg-slate-500/20', text: 'text-slate-400' },
};

const STANCE_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
    'A-1': Zap,
    'A-2': Shield,
    'B-1': RotateCw,
    'B-2': Hammer,
};

const MOVEMENT_ATTACK_STEPS: ComboStep[] = [
    { step: 1, name: "회피 공격(앞)", input: "—", description: "전방 회피 후 발동하는 공격.", frameData: { start: 8, active: 6, recovery: 12, total: 26 } },
    { step: 2, name: "회피 공격(뒤)", input: "—", description: "후방 회피 후 발동하는 공격.", frameData: { start: 8, active: 6, recovery: 12, total: 26 } },
    { step: 3, name: "전력질주 공격", input: "—", description: "전력질주 중 발동하는 공격.", frameData: { start: 10, active: 8, recovery: 14, total: 32 } },
];

const getStanceIdFromName = (name: string | undefined | null): string => {
    try {
        const s = (name != null && typeof name === 'string') ? name : '';
        if (typeof s !== 'string') return 'A-1';
        if (s.includes('A-1')) return 'A-1';
        if (s.includes('A-2')) return 'A-2';
        if (s.includes('B-1')) return 'B-1';
        if (s.includes('B-2')) return 'B-2';
        return 'A-1';
    } catch {
        return 'A-1';
    }
};

// --- SUB COMPONENTS ---

/** 기본 액션 섹션용: 프레임 데이터 표 — 1행: 구분, 2행: 프레임(f) */
const FrameDataTable: React.FC<{ data: FrameData; variant?: 'editorial' }> = ({ data, variant = 'editorial' }) => {
  const { start, active, recovery, total, c, a1, s2, a2 } = data;
  const useSplitActive = a1 != null && a2 != null;
  const activeTotal = useSplitActive ? (a1 ?? 0) + (s2 ?? 0) + (a2 ?? 0) : active;
  const cancelValue = c != null && c > 0 ? start + activeTotal + c : null;

  const cols: { label: string; value: number }[] = [
    { label: 'Start-up', value: start },
    ...(useSplitActive
      ? [
          ...(a1 != null ? [{ label: 'Active 1', value: a1 }] : []),
          ...(s2 != null && s2 > 0 ? [{ label: 'S(2)', value: s2 }] : []),
          ...(a2 != null ? [{ label: 'Active 2', value: a2 }] : []),
        ]
      : [{ label: 'Active', value: active }]),
    { label: 'Recovery (전체)', value: recovery },
    ...(c != null && c > 0 ? [{ label: 'Recovery (캔슬 불가)', value: c }] : []),
    { label: 'Total', value: total ?? start + activeTotal + recovery },
    ...(cancelValue != null ? [{ label: 'Cancel', value: cancelValue }] : []),
  ];

  const isEditorial = variant === 'editorial';
  const borderCls = isEditorial ? 'border-archival-ink/20' : 'border-stone-600/30';
  const headerBg = isEditorial ? 'bg-archival-ink/5' : 'bg-stone-800/50';
  const cellCls = isEditorial ? 'text-archival-ink' : 'text-stone-200';
  const labelCls = isEditorial ? 'text-archival-ink/70 font-archival-mono' : 'text-stone-400';

  const renderLabel = (label: string) => {
    if (label.includes(' (')) {
      const [main, rest] = label.split(' (');
      return <>{main}<br />({rest}</>;
    }
    return label;
  };

  return (
    <div className="w-full min-w-0 overflow-visible rounded-xl border border-archival-ink/20 bg-white/40" style={isEditorial ? { borderWidth: '0.5px' } : undefined}>
      <table className="w-max min-w-full border-collapse table-auto">
        <thead>
          <tr>
            {cols.map((col, i) => (
              <th key={i} className={`px-3 py-2.5 text-[9px] font-archival-mono uppercase tracking-[0.2em] ${headerBg} ${labelCls} border-b ${i > 0 ? 'border-l' : ''} ${borderCls} text-center whitespace-normal leading-tight`} style={{ borderWidth: '0.5px' }}>{renderLabel(col.label)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {cols.map((col, i) => (
              <td key={i} className={`px-3 py-2.5 text-[11px] font-mono font-semibold ${cellCls} tabular-nums text-center border-b border-archival-ink/10 ${i > 0 ? 'border-l border-archival-ink/10' : ''}`} style={{ borderWidth: '0.5px' }}>{col.value}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

type SARBarProps = {
  start: number;
  active: number;
  recovery: number;
  total: number;
  c?: number;
  a1?: number;
  s2?: number;
  a2?: number;
  compact?: boolean;
  maxFrameRef?: number;
  variant?: 'default' | 'editorial';
};

const SARBar: React.FC<SARBarProps> = ({ start, active: activeProp, recovery, total, c, a1, s2, a2, compact = false, maxFrameRef, variant = 'default' }) => {
  const useSplitActive = a1 != null && a2 != null;
  const active = useSplitActive ? a1 + (s2 ?? 0) + a2 : activeProp;
  const safeTotal = total || (start + active + recovery) || 100;
  const widthScale = maxFrameRef ? (safeTotal / maxFrameRef) * 100 : 100;
  const hasC = c != null && c > 0 && c <= recovery;
  const recoveryRest = hasC ? recovery - c : recovery;
  const startPct = (start / safeTotal) * 100;
  const a1Pct = useSplitActive ? ((a1 ?? 0) / safeTotal) * 100 : 0;
  const s2Pct = useSplitActive && (s2 != null && s2 > 0) ? (s2 / safeTotal) * 100 : 0;
  const a2Pct = useSplitActive ? ((a2 ?? 0) / safeTotal) * 100 : 0;
  const activePct = useSplitActive ? a1Pct + s2Pct + a2Pct : (active / safeTotal) * 100;
  const cPct = hasC ? (c / safeTotal) * 100 : 0;
  const recoveryPct = (recovery / safeTotal) * 100;
  const recoveryRestPct = hasC ? (recoveryRest / safeTotal) * 100 : recoveryPct;
  const cancelValue = hasC ? start + active + c : 0;
  const isEditorial = variant === 'editorial';

  const barHeight = compact ? 'h-2' : 'h-2.5';
  const labelSize = compact ? 'text-[8px]' : 'text-[9px]';

  if (isEditorial) {
    return (
      <div className="w-full min-w-[280px] max-w-[400px]">
        <div style={{ width: `${widthScale}%` }} className={`flex flex-nowrap gap-x-1 mb-2 ${labelSize} text-archival-ink/70 font-mono uppercase tracking-[0.2em]`}>
          <div style={{ width: `${startPct}%` }} className="flex justify-center shrink-0"><span>S<span className="text-archival-ink">{start}</span></span></div>
          {useSplitActive ? (
            <>
              <div style={{ width: `${a1Pct}%`, minWidth: '2.25rem' }} className="flex flex-col items-center justify-center shrink-0 gap-0.5">
                <span>A(1)</span>
                <span className="text-[#1A1A1A]">{a1}</span>
              </div>
              {s2 != null && s2 > 0 && (
                <div style={{ width: `${s2Pct}%`, minWidth: '2.25rem' }} className="flex flex-col items-center justify-center shrink-0 gap-0.5">
                  <span>S(2)</span>
                  <span className="text-[#1A1A1A]">{s2}</span>
                </div>
              )}
              <div style={{ width: `${a2Pct}%`, minWidth: '2.25rem' }} className="flex flex-col items-center justify-center shrink-0 gap-0.5">
                <span>A(2)</span>
                <span className="text-[#1A1A1A]">{a2}</span>
              </div>
            </>
          ) : (
            <div style={{ width: `${activePct}%` }} className="flex justify-center"><span>A<span className="text-archival-ink">{active}</span></span></div>
          )}
          <div style={{ width: `${recoveryPct}%` }} className="flex justify-center shrink-0"><span>R<span className="text-archival-ink">{recovery}</span>{hasC && <span className="text-archival-ink/80"> (c{c})</span>}</span></div>
        </div>
        <div className="w-full h-1.5 rounded-full bg-archival-ink/10 border border-archival-ink/15 overflow-hidden relative">
          <div style={{ width: `${widthScale}%` }} className="flex h-full relative">
            <div style={{ width: `${startPct}%` }} className="h-full bg-archival-ink/25 border-r border-archival-ink/20" />
            {useSplitActive ? (
              <>
                <div style={{ width: `${a1Pct}%` }} className="h-full bg-archival-ink/45 border-r border-archival-ink/20" />
                {s2 != null && s2 > 0 && <div style={{ width: `${s2Pct}%` }} className="h-full bg-archival-ink/30 border-r border-archival-ink/20" />}
                <div style={{ width: `${a2Pct}%` }} className="h-full bg-archival-ink/50 border-r border-archival-ink/20" />
              </>
            ) : (
              <div style={{ width: `${activePct}%` }} className="h-full bg-archival-ink/50 border-r border-archival-ink/20" />
            )}
            <div style={{ width: `${recoveryPct}%` }} className="h-full bg-archival-ink/20" />
          </div>
        </div>
        <div className={`mt-1 flex justify-end ${labelSize} text-archival-ink/60 font-mono tracking-wider`}>
          <span>{hasC ? `${safeTotal}f (cancel: ${cancelValue}f)` : `${safeTotal}f`}</span>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full">
      {!compact && (
        <div style={{ width: `${widthScale}%` }} className={`flex flex-nowrap gap-x-1 mb-1 px-0.5 ${labelSize} text-stone-400 font-mono font-bold uppercase tracking-wider`}>
          <div style={{ width: `${startPct}%` }} className="flex justify-center shrink-0"><span className="text-blue-400 drop-shadow-sm">Start <span className="text-white">{start}</span></span></div>
          {useSplitActive ? (
            <>
              <div style={{ width: `${a1Pct}%`, minWidth: '2.25rem' }} className="flex flex-col items-center justify-center shrink-0 gap-0.5"><span className="text-red-500 drop-shadow-sm">A(1)</span><span className="text-white">{a1}</span></div>
              {s2 != null && s2 > 0 && <div style={{ width: `${s2Pct}%`, minWidth: '2.25rem' }} className="flex flex-col items-center justify-center shrink-0 gap-0.5"><span className="text-amber-500/90 drop-shadow-sm">S(2)</span><span className="text-white">{s2}</span></div>}
              <div style={{ width: `${a2Pct}%`, minWidth: '2.25rem' }} className="flex flex-col items-center justify-center shrink-0 gap-0.5"><span className="text-red-600 drop-shadow-sm">A(2)</span><span className="text-white">{a2}</span></div>
            </>
          ) : (
            <div style={{ width: `${activePct}%` }} className="flex justify-center"><span className="text-red-500 drop-shadow-sm">Active <span className="text-white">{active}</span></span></div>
          )}
          <div style={{ width: `${recoveryPct}%` }} className="flex justify-center shrink-0"><span className="text-stone-500 drop-shadow-sm">Recv <span className="text-white">{recovery}</span>{hasC && <span className="text-white/80"> (c{c})</span>}</span></div>
        </div>
      )}
      <div className={`w-full bg-stone-900/40 rounded-[3px] overflow-hidden border border-white/10 backdrop-blur-sm relative ${barHeight} shadow-inner`}>
          <div className="absolute inset-0 w-full h-full flex">
              <div className="w-1/3 h-full border-r border-white/5"></div>
              <div className="w-1/3 h-full border-r border-white/5"></div>
          </div>
          <div style={{ width: `${widthScale}%` }} className="flex h-full relative z-10">
            <div style={{ width: `${startPct}%` }} className="h-full bg-blue-500/90 shadow-[0_0_8px_rgba(59,130,246,0.25)] border-r border-black/20" title={`Start: ${start}f`} />
            {useSplitActive ? (
              <>
                <div style={{ width: `${a1Pct}%` }} className="h-full bg-red-500/90 shadow-[0_0_8px_rgba(220,38,38,0.25)] border-r border-black/20" title={`Active1: ${a1}f`} />
                {s2 != null && s2 > 0 && <div style={{ width: `${s2Pct}%` }} className="h-full bg-amber-600/70 border-r border-black/20" title={`Start2: ${s2}f`} />}
                <div style={{ width: `${a2Pct}%` }} className="h-full bg-red-600/90 shadow-[0_0_8px_rgba(220,38,38,0.25)] border-r border-black/20" title={`Active2: ${a2}f`} />
              </>
            ) : (
              <div style={{ width: `${activePct}%` }} className="h-full bg-red-600/90 shadow-[0_0_8px_rgba(220,38,38,0.25)] border-r border-black/20" title={`Active: ${active}f`} />
            )}
            <div style={{ width: `${recoveryPct}%` }} className="h-full bg-stone-600/60" title={`Recovery: ${recovery}f`} />
          </div>
      </div>
      <div className={`mt-0.5 flex justify-between items-center px-0.5 ${labelSize} text-stone-500 font-mono`}>
          <span>0f</span>
          <span className="font-bold tracking-tight">TOTAL <span className="text-stone-300">{hasC ? `${safeTotal}f (cancel: ${cancelValue}f)` : `${safeTotal}f`}</span></span>
      </div>
    </div>
  );
};

// 5x5 Grid Component for Range Visualization — 그리드는 참조용, 범위는 도형으로 위에 그림
const GRID_SIZE = 70;
const CELL = GRID_SIZE / 5;
const CX = GRID_SIZE / 2;
const CY = GRID_SIZE / 2;
const PLAYER_CELL = 17; // 한 칸 아래 (row 3, col 2). 센터는 12
const CY_PLAYER = CELL * 3.5; // 셀 17 중심 Y (플레이어 위치)

const RangeGrid: React.FC<{ specs: { angle?: string; radius?: string } | undefined, isInherited: boolean, color: string, basicAttackStep?: 1 | 2 | 3; variant?: 'default' | 'editorial' }> = ({ specs, isInherited, color, basicAttackStep, variant = 'default' }) => {
    const getPattern = (angle?: string, radius?: string): number[] => {
        const pLoc = 12;
        try {
            if (angle == null || typeof angle !== 'string') return [pLoc];
            const a = String(angle).toLowerCase();
            const pattern = new Set<number>();
            if (a.includes('360') || a.includes('circle')) {
                [6, 7, 8, 11, 13, 16, 17, 18].forEach(i => pattern.add(i));
            } else if (a.includes('line') || a.includes('front')) {
                [2, 7, 17, 22].forEach(i => pattern.add(i));
            } else if (a.includes('cone') || a.includes('120') || a.includes('90')) {
                [6, 7, 8, 11, 13].forEach(i => pattern.add(i));
            } else if (a.includes('single') || a.includes('target')) {
                [7].forEach(i => pattern.add(i));
            } else {
                [7].forEach(i => pattern.add(i));
            }
            return Array.from(pattern);
        } catch {
            return [pLoc];
        }
    };

    // 기본공격 1·2·3타: SVG 도형 (1·2타 부채꼴, 3타 박스)
    const basicAttackPatterns: Record<1 | 2 | 3, number[]> = {
        1: [],
        2: [],
        3: [],
    };
    const useShapeOverlay = basicAttackStep === 1 || basicAttackStep === 2 || basicAttackStep === 3;
    const rawCells = basicAttackStep != null && !useShapeOverlay
        ? basicAttackPatterns[basicAttackStep]
        : (specs ? getPattern(specs?.angle, specs?.radius) : []);
    const activeCells = Array.isArray(rawCells) ? rawCells : [];
    const playerCell = PLAYER_CELL;
    const isEditorial = variant === 'editorial';

    const fillStyle = isEditorial ? 'rgba(42,42,42,0.35)' : 'rgba(197,157,89,0.35)';
    const strokeStyle = isEditorial ? 'rgba(42,42,42,0.6)' : 'rgba(197,157,89,0.6)';

    // 1타: 전방 50° 부채꼴, 반경 3칸
    const r1 = CELL * 3;
    const deg50 = 50 * (Math.PI / 180);
    const half50 = deg50 / 2;
    const upAngle = -Math.PI / 2;
    const sectorPath1 = (() => {
        const x1 = CX + r1 * Math.cos(upAngle - half50);
        const y1 = CY_PLAYER + r1 * Math.sin(upAngle - half50);
        const x2 = CX + r1 * Math.cos(upAngle + half50);
        const y2 = CY_PLAYER + r1 * Math.sin(upAngle + half50);
        return `M ${CX} ${CY_PLAYER} L ${x1} ${y1} A ${r1} ${r1} 0 0 1 ${x2} ${y2} Z`;
    })();

    // 2타: 전방 90° 부채꼴, 정면 기준 좌 20°. 꼭짓점을 플레이어 중앙 (CX, CY_PLAYER)에 두어 중앙 정렬
    const r2 = CELL * 2.5;
    const deg90 = 90 * (Math.PI / 180);
    const half90 = deg90 / 2;
    const centerAngle2 = -Math.PI / 2 - (20 * (Math.PI / 180));
    const sectorPath2 = (() => {
        const x1 = CX + r2 * Math.cos(centerAngle2 - half90);
        const y1 = CY_PLAYER + r2 * Math.sin(centerAngle2 - half90);
        const x2 = CX + r2 * Math.cos(centerAngle2 + half90);
        const y2 = CY_PLAYER + r2 * Math.sin(centerAngle2 + half90);
        return `M ${CX} ${CY_PLAYER} L ${x1} ${y1} A ${r2} ${r2} 0 0 1 ${x2} ${y2} Z`;
    })();

    // 3타: 전방 반경 4칸, 좌우 총 2칸 박스
    const box3 = {
        x: CX - CELL,
        y: CY_PLAYER - CELL * 4,
        width: CELL * 2,
        height: CELL * 4,
    };

    return (
        <div className={`w-full pt-2 ${isEditorial ? 'border-t border-[#1A1A1A]/15 pt-3' : 'border-t border-white/5'} ${isInherited ? 'opacity-60' : 'opacity-100'}`}>
            <div className="flex justify-between items-center mb-1">
                <span className={`text-[8px] font-mono uppercase tracking-[0.2em] flex items-center gap-1 ${isEditorial ? 'text-[#1A1A1A]/60' : 'font-bold text-stone-400 tracking-wider'}`}>
                    <Grid3X3 size={8} /> Hitbox
                </span>
                {isInherited && (
                    <span className="text-[7px] text-stone-400 bg-stone-800/80 px-1 py-0.5 rounded border border-white/5">INHERITED</span>
                )}
            </div>
            <div className="flex items-center justify-center py-0.5 relative">
                <div className={`relative transition-all duration-300 ${isInherited ? 'grayscale opacity-70 scale-95' : ''}`} style={{ width: GRID_SIZE, height: GRID_SIZE }}>
                    {/* 그리드: 참조용 라인만 */}
                    <div className="absolute inset-0 flex flex-wrap" style={{ width: GRID_SIZE, height: GRID_SIZE }}>
                        {Array.from({ length: 25 }).map((_, i) => {
                            const isPlayer = i === playerCell;
                            const borderCls = isEditorial ? 'border-[#1A1A1A]/25' : 'border-white/20';
                            const cellCls = isPlayer
                                ? (isEditorial ? 'bg-[#1A1A1A] ring-1 ring-[#1A1A1A]/40' : 'bg-white shadow-[0_0_4px_rgba(255,255,255,0.8)]')
                                : 'bg-transparent';
                            return <div key={i} className={`border ${borderCls} ${cellCls}`} style={{ width: CELL, height: CELL, boxSizing: 'border-box' }} />;
                        })}
                    </div>
                    {/* 범위 도형: 1타 50° 3칸, 2타 90° 좌 20°+좌표이동, 3타 전방 4칸·좌우 1.5칸 박스 */}
                    {useShapeOverlay && (
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 ${GRID_SIZE} ${GRID_SIZE}`} preserveAspectRatio="none">
                            {basicAttackStep === 1 && <path d={sectorPath1} fill={fillStyle} stroke={strokeStyle} strokeWidth={0.8} />}
                            {basicAttackStep === 2 && <path d={sectorPath2} fill={fillStyle} stroke={strokeStyle} strokeWidth={0.8} />}
                            {basicAttackStep === 3 && <rect x={box3.x} y={box3.y} width={box3.width} height={box3.height} fill={fillStyle} stroke={strokeStyle} strokeWidth={0.8} />}
                        </svg>
                    )}
                    {/* 2·3타: 그리드 위에 범위 셀 표시 */}
                    {!useShapeOverlay && (
                        <div className="absolute inset-0 flex flex-wrap pointer-events-none" style={{ width: GRID_SIZE, height: GRID_SIZE }}>
                            {Array.from({ length: 25 }).map((_, i) => {
                                const isActive = activeCells.includes(i);
                                if (!isActive) return <div key={i} style={{ width: CELL, height: CELL }} />;
                                return (
                                    <div
                                        key={i}
                                        className={isEditorial ? 'bg-[#1A1A1A]/40 border border-[#1A1A1A]/30' : 'bg-stone-500/50 border border-stone-400/50'}
                                        style={{ width: CELL, height: CELL, boxSizing: 'border-box' }}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const VideoReference = ({ label, color = "stone", isWide = false, variant, src }: { label: string, color?: string, isWide?: boolean; variant?: 'default' | 'editorial'; src?: string }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isEditorial = variant === 'editorial';
    const borderCls = isEditorial ? 'border-archival-ink/20' : `border-white/10 hover:border-${color}-500/50`;
    const innerCls = isWide ? "absolute inset-0" : (isEditorial ? "absolute inset-0" : "aspect-video relative");

    useEffect(() => {
        if (!src || !containerRef.current) return;
        const el = containerRef.current;
        const play = () => { videoRef.current?.play().catch(() => {}); };
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) play();
                else videoRef.current?.pause();
            },
            { threshold: 0, rootMargin: '120px 0px' }
        );
        obs.observe(el);
        play();
        return () => obs.disconnect();
    }, [src]);

    const handlePlay = () => { if (src && videoRef.current) { videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause(); } };

    const showOverlay = !src;
    return (
    <div ref={containerRef} className={`w-full h-full min-h-0 bg-black relative group overflow-hidden ${!isWide && !isEditorial ? 'border-b' : ''} ${isWide ? 'md:border-r border-b md:border-b-0' : ''} ${borderCls} transition-all duration-500`}>
        <div className={innerCls}>
            {src && (
                <video
                    ref={videoRef}
                    src={src}
                    className="absolute inset-0 w-full h-full object-cover"
                    playsInline
                    muted
                    loop
                    autoPlay
                    preload="auto"
                    onCanPlay={() => { videoRef.current?.play().catch(() => {}); }}
                    onClick={handlePlay}
                />
            )}
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${showOverlay ? 'bg-stone-900/60 group-hover:bg-stone-900/20' : 'bg-transparent pointer-events-none'}`} style={{ pointerEvents: showOverlay ? undefined : 'none' }}>
                <div className={`w-12 h-12 rounded-full border border-white/10 bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/50 transition-all duration-300 shadow-2xl ${showOverlay ? '' : 'opacity-0 pointer-events-none'} ${!src ? 'group-hover:text-white group-hover:scale-110 group-hover:border-stone-500 group-hover:bg-stone-500/20' : ''}`}>
                    <Play size={16} fill="currentColor" />
                </div>
            </div>
            {/* HUD Elements */}
            <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-2 py-0.5 bg-black/60 backdrop-blur-md border border-white/10 rounded text-[9px] font-mono text-stone-400 uppercase tracking-wider">
                    CAM_01
                </span>
                <span className="px-2 py-0.5 bg-red-900/40 backdrop-blur-md border border-red-500/30 rounded text-[9px] font-mono text-red-400 uppercase tracking-wider animate-pulse">
                    REC
                </span>
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none opacity-10"></div>
        </div>
    </div>
    );
};

const EvolutionCard = ({ 
    stepName, 
    nodeName, 
    description, 
    frameData, 
    specs,
    color, 
    shade,
    isBase = false,
    maxFrameRef,
    isInheritedSpec = false,
    isWide = false,
    isTextOnly = false,
    isFinal = false,
    alignLeft = false
}: { 
    stepName: string, 
    nodeName: string, 
    description: string, 
    frameData?: FrameData, 
    specs?: { angle?: string; radius?: string },
    color: string, 
    shade?: string,
    isBase?: boolean,
    maxFrameRef?: number,
    isInheritedSpec?: boolean,
    isWide?: boolean,
    isTextOnly?: boolean,
    isFinal?: boolean,
    alignLeft?: boolean
}) => {
    const s = shade ?? '500';
    // WIDE CARD LAYOUT (Base) — 영상 16:9(넓은 너비) | 설명+프레임
    if (isWide) {
        return (
            <div className={`
                w-full max-w-[640px] ${alignLeft ? '' : 'mx-auto'} bg-stone-900/60 border border-white/10 rounded-xl overflow-hidden backdrop-blur-md
                hover:bg-stone-900/90 hover:border-${color}-${s}/40 transition-all duration-500 group
                grid grid-cols-1 md:grid-cols-[1.5fr_1.5fr] md:items-stretch shadow-xl relative z-20
            `}>
                {/* Left: 영상 16:9, 셀 전체 채움(밑 여백 없음) */}
                <div className="w-full min-h-[180px] md:min-h-0 aspect-video md:aspect-auto border-b md:border-b-0 md:border-r border-white/5 min-w-0 overflow-hidden md:h-full">
                    <VideoReference label={nodeName} color={color} isWide />
                </div>
                
                {/* Center: 설명+프레임 (영상과 동일 세로 높이) */}
                <div className="px-2 py-2 md:px-3 md:py-3 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent min-w-0 min-h-0 overflow-y-auto">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <span className={`text-[9px] font-bold uppercase tracking-[0.2em] text-${color}-${s}`}>
                                {stepName}
                            </span>
                            {isBase && (
                                <span className="flex items-center gap-1 text-[8px] px-1.5 py-0.5 bg-stone-800/80 text-stone-400 rounded border border-white/10">
                                    <Database size={8} /> ORIGINAL
                                </span>
                            )}
                        </div>
                        <h4 className="text-sm font-serif font-bold text-white mb-2 tracking-tight">{nodeName}</h4>
                        <p className="text-xs text-stone-400 leading-relaxed mb-4 font-light border-l-2 border-stone-700 pl-3">
                            {description}
                        </p>
                    </div>
                    <div>
                        <div className="text-[9px] font-bold text-stone-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                            <BarChart3 size={10} /> Frame Analysis
                        </div>
                        {frameData ? <SARBar {...frameData} maxFrameRef={maxFrameRef} compact /> : <span className="text-[10px] text-stone-600">N/A</span>}
                    </div>
                </div>
            </div>
        );
    }

    // TEXT ONLY LAYOUT (Upgrade I/II — 슬림)
    if (isTextOnly) {
        return (
            <div className={`
                w-full bg-stone-900/40 border border-white/10 rounded-md overflow-hidden backdrop-blur-sm
                hover:bg-stone-900/80 hover:border-${color}-${s}/40 transition-all duration-300
                flex flex-col p-2.5 shadow relative
            `}>
                <div className="absolute top-0 right-0 p-2 opacity-10">
                     <Circle size={24} className={`text-${color}-${s}`} />
                </div>
                <div className="flex flex-col relative z-10 gap-0">
                    <div className="flex items-baseline justify-between gap-2">
                        <h5 className="text-xs font-bold text-stone-200 leading-tight truncate min-w-0">{nodeName}</h5>
                        <span className={`text-[8px] font-bold uppercase tracking-[0.15em] text-${color}-${s} shrink-0`}>{stepName}</span>
                    </div>
                    <p className="text-[10px] text-stone-500 leading-snug border-t border-white/5 pt-1.5 mt-1">
                        {description}
                    </p>
                </div>
            </div>
        );
    }

    // FINAL FORM / STANDARD LAYOUT (isFinal 시 비율 유지하며 크기만 축소)
    return (
        <div className={`
            w-full h-full bg-stone-900/60 border ${isFinal ? `border-${color}-${s}/30` : 'border-white/10'} rounded-xl overflow-hidden backdrop-blur-md
            hover:bg-stone-900/90 hover:border-${color}-${s}/60 hover:-translate-y-1 transition-all duration-500 group
            flex flex-col shadow-xl relative
            ${isFinal ? 'w-full' : ''}
        `}>
            {isFinal && (
                 <div className={`absolute top-0 right-0 bg-${color}-${s === '700' ? '600' : s} text-white text-[8px] font-bold px-2 py-0.5 rounded-bl-lg z-30 uppercase tracking-widest shadow-lg`}>
                    Completed
                 </div>
            )}

            {/* Header / Video */}
            <div className="w-full aspect-video border-b border-white/10 relative">
                <VideoReference label={nodeName} color={color} />
                {isFinal && <div className={`absolute inset-0 border-2 border-${color}-${s}/20 pointer-events-none`}></div>}
            </div>

            {/* Body */}
            <div className={`flex flex-col flex-1 gap-2 bg-gradient-to-b from-transparent to-black/20 ${isFinal ? 'p-3' : 'p-4'}`}>
                <div>
                     <div className="flex justify-between items-baseline mb-1">
                        <span className={`text-[9px] font-bold uppercase tracking-[0.15em] text-${color}-${s} flex items-center gap-2`}>
                            {isFinal && <Hexagon size={10} fill="currentColor" />}
                            {stepName}
                        </span>
                    </div>
                    <h5 className={`font-bold text-stone-200 leading-tight group-hover:text-white transition-colors ${isFinal ? 'text-xs mb-1' : 'text-sm mb-2'}`}>{nodeName}</h5>
                    <p className="text-[10px] text-stone-500 leading-relaxed line-clamp-2">{description}</p>
                </div>

                <div className={`mt-auto border-t border-white/5 ${isFinal ? 'space-y-2 pt-2' : 'space-y-3 pt-3'}`}>
                    {frameData ? (
                        <SARBar {...frameData} maxFrameRef={maxFrameRef} compact />
                    ) : (
                        <div className="text-[10px] text-stone-600 font-mono text-center py-2 border border-dashed border-stone-800 rounded">No Frame Change</div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- STANCE & OVERVIEW COMPONENTS ---

const StanceCard: React.FC<{ stance: Stance; theme?: 'dark' | 'light' }> = ({ stance, theme = 'dark' }) => {
    const config = STANCE_CONFIG[stance.id];
    const isLight = theme === 'light';
    return (
        <div className={`
            rounded-lg p-6 relative overflow-hidden group transition-all duration-300 h-full flex flex-col
            ${isLight 
                ? 'bg-white/40 border border-[#1A1A1A]/20 hover:bg-white/60 hover:border-[#1A1A1A]/35' 
                : `bg-stone-900/50 border border-white/5 hover:bg-stone-900 hover:${config.border}/30`
            }
        `}>
            {/* Background Accent */}
            <div className={`absolute right-0 top-0 p-12 transition-opacity ${isLight ? 'opacity-[0.06] group-hover:opacity-10 text-[#1A1A1A]' : `opacity-5 group-hover:opacity-10 ${config.text}`}`}>
                <Crosshair size={100} />
            </div>

            <div className="relative z-10 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                     <span className={`text-xs font-bold font-mono px-2 py-1 rounded ${isLight ? 'bg-[#1A1A1A]/10 border border-[#1A1A1A]/25 text-[#1A1A1A]' : `bg-stone-950 border border-white/10 ${config.text}`}`}>
                         {stance.id}
                     </span>
                     <span className={`text-[10px] font-mono uppercase tracking-widest ${isLight ? 'text-[#2D2D2D]' : 'text-stone-500'}`}>{stance.concept}</span>
                </div>
                <h4 className={`text-base font-serif font-bold mb-3 transition-colors ${isLight ? 'text-[#1A1A1A] group-hover:text-[#1A1A1A]' : 'text-stone-200 group-hover:text-white'}`}>{stance.name}</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                    {stance.keywords.map((kw, i) => (
                        <span key={i} className={`text-[9px] px-1.5 py-0.5 rounded ${isLight ? 'bg-[#1A1A1A]/10 text-[#2D2D2D] border border-[#1A1A1A]/15' : 'bg-white/5 text-stone-400 border border-white/5'}`}>
                            #{kw}
                        </span>
                    ))}
                </div>
                <p className={`text-xs leading-relaxed border-t pt-3 mt-auto ${isLight ? 'text-[#2D2D2D] border-[#1A1A1A]/15' : 'text-stone-500 border-white/5'}`}>
                    {stance.description}
                </p>
            </div>
            
            {/* Color Bar at bottom */}
            <div className={`absolute bottom-0 left-0 w-full h-1 ${isLight ? 'bg-[#1A1A1A]/30' : config.bg} opacity-50`}></div>
        </div>
    );
};

// --- COMBAT STANCE (Horizontal Expanding Cards — Organic Archival Sci‑Fi) ---

const ARCHIVAL_NOISE =
    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E\")";

const CombatStanceSection: React.FC<{
    stances: Stance[];
    sectionId: string;
    weaponName?: string;
    skillTree?: SkillTree;
}> = ({ stances, sectionId, weaponName, skillTree }) => {
    const treeSections = weaponName ? WEAPON_TREE_SECTIONS[weaponName] : undefined;
    const accordion = !!skillTree && !!treeSections;
    const [openStanceId, setOpenStanceId] = useState<string | null>(null);

    const toggleStance = (id: string) => {
        if (!accordion) return;
        setOpenStanceId((prev) => (prev === id ? null : id));
    };

    useEffect(() => {
        if (!openStanceId) return;
        const timer = window.setTimeout(() => {
            document.getElementById(`tree-skills-${sectionId}-${openStanceId}`)?.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        }, 60);
        return () => window.clearTimeout(timer);
    }, [openStanceId, sectionId]);

    return (
        <div
            id={sectionId}
            className="relative bg-transparent"
        >
            <div
                className="absolute inset-0 pointer-events-none opacity-100 mix-blend-multiply"
                style={{ backgroundImage: ARCHIVAL_NOISE }}
            />
            <div className="relative z-10 p-5 md:p-8">
                <div className="flex items-center gap-4 mb-2">
                    <span className="text-[10px] uppercase tracking-[0.35em] text-archival-ink/80 font-archival-mono">
                        Choose your path
                    </span>
                </div>
                {accordion && (
                    <p className="text-[10px] font-archival-mono text-archival-ink/50 mb-6 tracking-wide">
                        트리 카드를 선택하면 해당 액티브·패시브 스킬이 펼쳐집니다.
                    </p>
                )}

                <div className={`flex flex-col gap-4 sm:gap-6 w-full ${accordion ? '' : 'mt-4'}`}>
                    {stances.map((stance) => {
                        const Icon = STANCE_ICONS[stance.id] ?? Crosshair;
                        const hasSections = !!(stance.flowSteps?.length || stance.descriptionPoints?.length || stance.furyTrigger || stance.furyEffect || stance.furyRisk);
                        const section = treeSections?.find((s) => s.stanceId === stance.id);
                        const isOpen = accordion && openStanceId === stance.id;
                        return (
                            <div key={stance.id} className="flex flex-col gap-3">
                            <div
                                className={`relative overflow-hidden flex flex-col border bg-archival-bg-deep/50 ${
                                    accordion ? 'cursor-pointer' : ''
                                } ${
                                    isOpen
                                        ? 'border-archival-ink/55'
                                        : 'border-archival-ink/30 hover:border-archival-ink/40'
                                }`}
                                style={{ backgroundColor: 'rgba(220,216,204,0.6)' }}
                                onClick={accordion ? () => toggleStance(stance.id) : undefined}
                                onKeyDown={accordion ? (e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        toggleStance(stance.id);
                                    }
                                } : undefined}
                                role={accordion ? 'button' : undefined}
                                tabIndex={accordion ? 0 : undefined}
                                aria-expanded={accordion ? isOpen : undefined}
                            >
                                <div className="flex flex-row flex-1 min-w-0 gap-3 sm:gap-4 p-5 sm:p-6 md:p-8">
                                    {/* 좌측: 텍스트 (좌측 정렬) */}
                                    <div className="flex flex-col flex-1 min-w-0 text-left relative">
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 w-20 aspect-square pointer-events-none opacity-[0.06] hidden lg:block">
                                            <svg viewBox="0 0 100 100" className="w-full h-full text-archival-ink" fill="none" stroke="currentColor" strokeWidth="0.3">
                                                {[1, 2, 3].map((r) => (
                                                    <circle key={r} cx="50" cy="50" r={15 + r * 12} />
                                                ))}
                                            </svg>
                                        </div>
                                        <div className="absolute top-3 left-3 flex gap-1">
                                            {[0, 1, 2].map((i) => (
                                                <span key={i} className="w-px h-2 bg-archival-ink/25" style={{ width: '0.5px' }} />
                                            ))}
                                        </div>

                                        <span className="text-[11px] font-archival-mono text-archival-ink/70 uppercase tracking-[0.25em]">STANCE {stance.id}</span>
                                        <div className="flex items-center gap-2 mt-1.5 mb-4">
                                            <div className="w-8 h-8 border border-archival-ink/35 flex items-center justify-center shrink-0" style={{ borderWidth: '0.5px' }}>
                                                <Icon size={14} className="text-archival-ink/80" />
                                            </div>
                                            <h4 className="font-archival-serif font-semibold text-archival-ink text-lg sm:text-xl tracking-wide">{stance.name}</h4>
                                        </div>

                                        {hasSections ? (
                                            <>
                                                {stance.flowSteps?.length ? (
                                                    <div className="mb-4 pr-2">
                                                        <span className="text-[13px] font-archival-mono font-semibold text-archival-ink/80 uppercase tracking-wider block mb-1.5">{ui.combatFlow ?? '전투 흐름'}</span>
                                                        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[13px] leading-relaxed text-archival-ink-deep/90" style={{ fontFamily: 'inherit' }}>
                                                            {stance.flowSteps.map((step, i) => (
                                                                <span key={i}>
                                                                    <span>{step}</span>
                                                                    {i < stance.flowSteps!.length - 1 && <span className="text-archival-ink/50 mx-0.5">→</span>}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ) : null}
                                                <div className="mb-4 pr-2">
                                                    <span className="text-[13px] font-archival-mono font-semibold text-archival-ink/80 uppercase tracking-wider block mb-1.5">{ui.stanceDescription ?? '설명'}</span>
                                                    <ul className="space-y-1 list-none text-[13px] leading-relaxed text-archival-ink-deep/90">
                                                        <li className="before:content-['·'] before:mr-1.5 before:text-archival-ink/70">{stance.description}</li>
                                                        {(stance.descriptionPoints ?? []).map((pt, i) => (
                                                            <li key={i} className="before:content-['·'] before:mr-1.5 before:text-archival-ink/70">{pt}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                {(stance.furyTrigger || stance.furyEffect || stance.furyRisk) ? (
                                                    <div className="mb-3 pr-2">
                                                        <span className="text-[13px] font-archival-mono font-semibold text-archival-ink/80 uppercase tracking-wider block mb-1.5">{ui.furyLink ?? '분노 자원 연계'}</span>
                                                        <ul className="space-y-1 list-none text-[13px] leading-relaxed text-archival-ink-deep/90">
                                                            {stance.furyTrigger && <li className="flex gap-1.5"><span className="text-archival-ink/60 shrink-0">▸</span><span>{stance.furyTrigger}</span></li>}
                                                            {stance.furyEffect && <li className="flex gap-1.5"><span className="font-archival-mono text-[13px] font-semibold text-archival-ink/75 shrink-0">효과</span><span>{stance.furyEffect}</span></li>}
                                                            {stance.furyRisk && <li className="flex gap-1.5"><span className="font-archival-mono text-[13px] font-semibold text-archival-ink/75 shrink-0">리스크</span><span>{stance.furyRisk}</span></li>}
                                                        </ul>
                                                    </div>
                                                ) : null}
                                            </>
                                        ) : (
                                            <p className="text-[13px] text-archival-ink-deep/90 leading-relaxed mb-4 flex-1 pr-2" style={{ fontFamily: 'inherit' }}>{stance.description}</p>
                                        )}

                                        <div className="flex flex-wrap gap-1.5 mt-auto pt-3">
                                            {stance.keywords.map((kw, i) => (
                                                <span key={i} className="text-[10px] sm:text-[11px] font-archival-mono px-2 py-0.5 border border-archival-ink/25 text-archival-ink/85" style={{ borderWidth: '0.5px' }}>#{kw}</span>
                                            ))}
                                        </div>
                                    </div>

                                    {accordion && (
                                        <div className="shrink-0 w-8 sm:w-10 flex items-center justify-center self-stretch">
                                            <ChevronDown
                                                size={20}
                                                className={`text-archival-ink/45 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                                                aria-hidden
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-archival-ink/20" />
                            </div>
                            <AnimatePresence initial={false}>
                                {isOpen && section && skillTree && (
                                    <motion.div
                                        id={`tree-skills-${sectionId}-${stance.id}`}
                                        initial={{ opacity: 0, y: -6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -6 }}
                                        transition={{ duration: 0.22 }}
                                    >
                                        <TreeSkillDetailCards
                                            skills={skillTree.activeSkills}
                                            skillIds={section.skillIds}
                                            treePath={section.treePath}
                                            passiveTree={skillTree.passiveTree ?? []}
                                            passiveSide={section.passiveSide}
                                            passivePosition={section.passivePosition}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// --- SIGNATURE ACTION: 두 개의 상호보완 섹션 ---

const getSynergyPassives = (skill: ActiveSkillDetail, passiveTree: PassiveNode[] | undefined): PassiveNode[] => {
    if (!passiveTree?.length) return [];
    const ids = new Set<string>();
    if (skill.evolution) {
        [...(skill.evolution.pathA?.nodes ?? []), ...(skill.evolution.pathB?.nodes ?? [])].forEach(n => n.synergyPassiveIds.forEach(id => ids.add(id)));
    }
    const map = new Map(passiveTree.map(p => [p.id, p]));
    const synced = [...ids].map(id => map.get(id)).filter((p): p is PassiveNode => !!p).slice(0, 4);
    return synced.length > 0 ? synced : passiveTree.filter(p => p.type === 'Main').slice(0, 4);
};

const NOISE_SVG = "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E\")";

/** Section 1: 분석형 시그니처 액션 영역 — 데이터 시트 */
const SignatureActionDataSheet: React.FC<{ skill: ActiveSkillDetail; variant?: 'archival' }> = ({ skill, variant }) => {
    const isArchival = variant === 'archival';
    return (
        <div id="signature-action-data" className="relative overflow-hidden" style={{ background: isArchival ? 'transparent' : '#F2EFE9' }}>
            {!isArchival && <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: NOISE_SVG }} />}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-0 min-h-[360px]">
                <div className={`aspect-video lg:aspect-auto lg:min-h-[360px] overflow-hidden border-b lg:border-b-0 lg:border-r ${isArchival ? 'border-archival-ink/20' : ''}`} style={isArchival ? { borderWidth: '0.5px', borderColor: 'rgba(42,42,42,0.2)' } : { borderColor: 'rgba(26,26,26,0.08)' }}>
                    <VideoReference label={skill.name} color="stone" variant="editorial" />
                </div>
                <div className={`p-6 lg:p-8 flex flex-col justify-between gap-6 ${isArchival ? 'font-archival-serif' : ''}`} style={isArchival ? undefined : { fontFamily: 'Cormorant Garamond, Georgia, serif' }}>
                    <div>
                        <div className="mb-4 pb-3" style={{ borderBottom: isArchival ? '0.5px solid rgba(42,42,42,0.2)' : '0.5px solid rgba(26,26,26,0.15)' }}>
                            <span className={`text-[9px] uppercase tracking-[0.3em] block mb-1 ${isArchival ? 'font-archival-mono text-archival-ink/60' : 'font-mono text-[#1A1A1A]/50'}`}>Skill ID</span>
                            <h3 className={`text-2xl font-bold tracking-[0.08em] ${isArchival ? 'text-archival-ink font-archival-serif' : 'text-[#1A1A1A]'}`}>{skill.name}</h3>
                        </div>
                        <div className="mb-6">
                            <span className={`text-[9px] uppercase tracking-[0.2em] block mb-2 ${isArchival ? 'font-archival-mono text-archival-ink/60' : 'font-mono text-[#1A1A1A]/50'}`}>Description</span>
                            <p className={`text-sm leading-relaxed ${isArchival ? 'text-archival-ink-deep/90' : 'text-[#2D2D2D] font-serif'}`}>{skill.designIntent}</p>
                        </div>
                        <div className="mb-6">
                            <span className={`text-[9px] uppercase tracking-[0.2em] block mb-2 ${isArchival ? 'font-archival-mono text-archival-ink/60' : 'font-mono text-[#1A1A1A]/50'}`}>Frame Analysis</span>
                            <SARBar {...skill.frameData} compact variant="editorial" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/** Section 2: 거대 행성 궤도 스타일 — 우주 성도/추상화 */
const SignatureActionOrbit: React.FC<{ skill: ActiveSkillDetail; passives: PassiveNode[]; variant?: 'archival' }> = ({ skill, passives, variant }) => {
    const isArchival = variant === 'archival';
    const stroke = isArchival ? '#2A2A2A' : '#1A1A1A';
    const gradientId = `orbitFade-${skill.id}-${isArchival ? 'a' : 'd'}`;
    const orbiterPositions = [
        { x: 38, y: 42, size: 7, filled: true },
        { x: 42, y: 35, size: 4, filled: false },
        { x: 48, y: 48, size: 6, filled: true },
        { x: 58, y: 28, size: 5, filled: false },
        { x: 62, y: 52, size: 8, filled: true },
        { x: 72, y: 38, size: 4, filled: false },
        { x: 68, y: 22, size: 6, filled: true },
        { x: 78, y: 45, size: 5, filled: false },
    ].slice(0, passives.length);

    return (
        <div id="signature-action-orbit" className="relative flex flex-col lg:flex-row overflow-hidden py-20 lg:py-28" style={{ background: isArchival ? 'transparent' : '#F2EFE9', minHeight: 560 }}>
            {!isArchival && <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: NOISE_SVG }} />}

            <div className="relative w-full lg:w-[60%] overflow-hidden" style={{ minHeight: 480 }}>
                <div className="absolute inset-0" style={{ clipPath: 'inset(0)' }}>
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="xMinYMid meet" style={{ zIndex: 1 }}>
                        <ellipse cx="28" cy="72" rx="32" ry="26" fill="none" stroke={stroke} strokeWidth="0.5" strokeOpacity="0.06" strokeDasharray="1 3" transform="rotate(-22, 28, 72)" />
                        <ellipse cx="22" cy="78" rx="24" ry="20" fill="none" stroke={stroke} strokeWidth="0.5" strokeOpacity="0.05" transform="rotate(12, 22, 78)" />
                    </svg>
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="xMinYMid meet" style={{ zIndex: 2 }}>
                        <defs>
                            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor={stroke} stopOpacity="0.14" />
                                <stop offset="100%" stopColor={stroke} stopOpacity="0.03" />
                            </linearGradient>
                        </defs>
                        <g transform="translate(28, 65)">
                            <ellipse cx="0" cy="0" rx="48" ry="20" fill="none" stroke={`url(#${gradientId})`} strokeWidth="0.5" transform="rotate(-12, 0, 0)" />
                            <ellipse cx="0" cy="0" rx="38" ry="16" fill="none" stroke={stroke} strokeWidth="0.5" strokeOpacity="0.08" strokeDasharray="2 5" transform="rotate(18, 0, 0)" />
                            <ellipse cx="0" cy="0" rx="54" ry="22" fill="none" stroke={stroke} strokeWidth="0.5" strokeOpacity="0.06" strokeDasharray="1 4" transform="rotate(-28, 0, 0)" />
                            <ellipse cx="0" cy="0" rx="32" ry="14" fill="none" stroke={`url(#${gradientId})`} strokeWidth="0.5" transform="rotate(32, 0, 0)" />
                            <ellipse cx="0" cy="0" rx="58" ry="24" fill="none" stroke={stroke} strokeWidth="0.5" strokeOpacity="0.05" strokeDasharray="3 6" transform="rotate(-18, 0, 0)" />
                        </g>
                    </svg>
                    {passives.map((p, i) => {
                        const pos = orbiterPositions[i];
                        if (!pos) return null;
                        return (
                            <div key={p.id} data-passive-id={i} className="absolute z-10" style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)', width: pos.size * 4, height: pos.size * 4 }}>
                                {pos.filled ? (
                                    <div className="w-full h-full rounded-full" style={{ background: isArchival ? 'rgba(42,42,42,0.85)' : 'rgba(26,26,26,0.88)', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }} />
                                ) : (
                                    <div className="w-full h-full rounded-full border" style={{ borderColor: isArchival ? 'rgba(42,42,42,0.4)' : 'rgba(26,26,26,0.45)', background: 'transparent', borderWidth: '0.5px' }} />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="relative w-full lg:w-[40%] flex flex-col justify-center px-6 lg:px-10 py-16 lg:py-20 border-l z-10" style={{ borderColor: isArchival ? 'rgba(42,42,42,0.2)' : 'rgba(26,26,26,0.12)', borderLeftWidth: '0.5px' }}>
                <h4 className={`font-bold text-4xl lg:text-5xl tracking-[0.1em] mb-4 ${isArchival ? 'font-archival-serif text-archival-ink' : 'font-hero-serif text-[#1A1A1A]'}`} style={!isArchival ? { fontFamily: 'Cormorant Garamond, Georgia, serif' } : undefined}>Attribute</h4>
                <p className={`text-sm font-bold mb-8 tracking-[0.08em] ${isArchival ? 'font-archival-serif text-archival-ink/90' : 'font-hero-serif text-[#1A1A1A]/90'}`} style={!isArchival ? { fontFamily: 'Cormorant Garamond, serif' } : undefined}>{skill.name}</p>
                <div className="space-y-8">
                    {passives.map((p) => (
                        <div key={p.id} className="relative">
                            <span className={`font-bold text-sm block mb-1.5 ${isArchival ? 'font-archival-serif text-archival-ink' : 'font-hero-serif text-[#1A1A1A]'}`} style={!isArchival ? { fontFamily: 'Cormorant Garamond, serif' } : undefined}>{p.name}</span>
                            <p className={`text-[11px] leading-relaxed font-light ${isArchival ? 'text-archival-ink-deep/85' : 'text-[#2D2D2D]/85'}`} style={!isArchival ? { fontFamily: 'Cormorant Garamond, serif' } : undefined}>{p.summary}</p>
                        </div>
                    ))}
                </div>
            </div>

            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }} preserveAspectRatio="none">
                {passives.map((_, i) => {
                    const pos = orbiterPositions[i];
                    if (!pos) return null;
                    const leftPct = (pos.x / 100) * 60;
                    const rightX = 62;
                    const blockY = 32 + i * 15;
                    return <line key={i} x1={`${rightX}%`} y1={`${blockY}%`} x2={`${leftPct}%`} y2={`${pos.y}%`} stroke={stroke} strokeWidth="0.5" strokeDasharray="2 4" strokeOpacity="0.1" />;
                })}
            </svg>
        </div>
    );
};

/** 통합: 두 섹션 + 넓은 여백 */
const SignatureActionSection: React.FC<{ weapon: SkillTree; variant?: 'archival' }> = ({ weapon, variant }) => {
    const signature = weapon.activeSkills[0];
    const passives = useMemo(() => getSynergyPassives(signature, weapon.passiveTree), [signature, weapon.passiveTree]);
    if (!signature) return null;

    return (
        <div id="signature-action" className="flex flex-col gap-32">
            <SignatureActionDataSheet skill={signature} variant={variant} />
            <SignatureActionOrbit skill={signature} passives={passives} variant={variant} />
        </div>
    );
};

/** 무기별 태세 → 액티브/패시브 매핑 (A-1~B-2) */
type WeaponTreeSection = {
  stanceId: string;
  label: string;
  skillIds: readonly string[];
  treePath: 'pathA' | 'pathB';
  passiveSide: 'A' | 'B';
  passivePosition: number;
};

const WEAPON_TREE_SECTIONS: Record<string, WeaponTreeSection[]> = {
  사슬검: [
    { stanceId: 'A-1', label: 'A-1 섬영', skillIds: ['CS_01', 'CS_02', 'CS_03', 'CS_04'], treePath: 'pathA', passiveSide: 'A', passivePosition: 1 },
    { stanceId: 'A-2', label: 'A-2 척력', skillIds: ['CS_01', 'CS_02', 'CS_03', 'CS_04'], treePath: 'pathB', passiveSide: 'A', passivePosition: 2 },
    { stanceId: 'B-1', label: 'B-1 원무', skillIds: ['CS_05', 'CS_06', 'CS_07', 'CS_08'], treePath: 'pathA', passiveSide: 'B', passivePosition: 1 },
    { stanceId: 'B-2', label: 'B-2 중압', skillIds: ['CS_05', 'CS_06', 'CS_07', 'CS_08'], treePath: 'pathB', passiveSide: 'B', passivePosition: 2 },
  ],
  쌍도끼: [
    { stanceId: 'A-1', label: 'A-1 광전사', skillIds: ['DA_01', 'DA_02', 'DA_03', 'DA_04'], treePath: 'pathA', passiveSide: 'A', passivePosition: 1 },
    { stanceId: 'A-2', label: 'A-2 추격', skillIds: ['DA_01', 'DA_02', 'DA_03', 'DA_04'], treePath: 'pathB', passiveSide: 'A', passivePosition: 2 },
    { stanceId: 'B-1', label: 'B-1 혈투', skillIds: ['DA_05', 'DA_06', 'DA_07', 'DA_08'], treePath: 'pathA', passiveSide: 'B', passivePosition: 1 },
    { stanceId: 'B-2', label: 'B-2 도살', skillIds: ['DA_05', 'DA_06', 'DA_07', 'DA_08'], treePath: 'pathB', passiveSide: 'B', passivePosition: 2 },
  ],
  전투도끼: [
    { stanceId: 'A-1', label: 'A-1 축적', skillIds: ['BA_01', 'BA_02', 'BA_03', 'BA_04'], treePath: 'pathA', passiveSide: 'A', passivePosition: 1 },
    { stanceId: 'A-2', label: 'A-2 분쇄', skillIds: ['BA_01', 'BA_02', 'BA_03', 'BA_04'], treePath: 'pathB', passiveSide: 'A', passivePosition: 2 },
    { stanceId: 'B-1', label: 'B-1 응징', skillIds: ['BA_05', 'BA_06', 'BA_07', 'BA_08'], treePath: 'pathA', passiveSide: 'B', passivePosition: 1 },
    { stanceId: 'B-2', label: 'B-2 파쇄', skillIds: ['BA_05', 'BA_06', 'BA_07', 'BA_08'], treePath: 'pathB', passiveSide: 'B', passivePosition: 2 },
  ],
};

/** 액티브 N종 × 기본/1·2단계 강화 매트릭스 */
const formatSkillResource = (value?: string) => {
  if (value == null || value.trim() === '') return '—';
  if (/^none$/i.test(value.trim())) return '없음';
  return value;
};

const WeaponSignatureActiveTable: React.FC<{
  skills: ActiveSkillDetail[];
  skillIds: readonly string[];
  treePath?: 'pathA' | 'pathB';
}> = ({ skills, skillIds, treePath = 'pathA' }) => {
  const stageLabels = (text.ui?.classDesign?.evolutionStages as string[]) ?? [
    '기본',
    '1단계 강화',
    '2단계 강화',
  ];
  const contentLabel = ui.stageContentColumn ?? '내용';
  const resourceLabel = ui.resourceColumn ?? '자원';

  const rows = skillIds.map((id) => {
    const skill = skills.find((s) => s.id === id);
    if (!skill?.evolution?.[treePath]) return null;
    const path = skill.evolution[treePath];
    const baseDesc = skill.description
      || (skill.specs
        ? `${skill.specs.damage} · 범위 ${skill.specs.radius} · 각도 ${skill.specs.angle}`
        : '');
    const baseResource = skill.specs.resource;
    const stage1Resource = path.nodes[0]?.specOverride?.resource ?? baseResource;
    const stage2Resource = path.nodes[1]?.specOverride?.resource ?? stage1Resource;
    return {
      id: skill.id,
      name: skill.name,
      cells: [
        {
          description: baseDesc,
          intent: skill.designIntent,
          resource: baseResource,
        },
        {
          description: path.nodes[0]?.description ?? '',
          intent: path.nodes[0]?.insight,
          resource: stage1Resource,
        },
        {
          description: path.nodes[1]?.description ?? '',
          intent: path.nodes[1]?.insight,
          resource: stage2Resource,
        },
      ],
    };
  }).filter(Boolean) as {
    id: string;
    name: string;
    cells: { description: string; intent?: string; resource?: string }[];
  }[];

  if (rows.length === 0) return null;

  return (
    <div className="archival-table-wrap archival-table-wrap--fit">
      <table className="archival-table archival-table--fit text-sm">
        <colgroup>
          <col className="col-skill" />
          {stageLabels.map((label) => (
            <React.Fragment key={`${label}-cols`}>
              <col className="col-content" />
              <col className="col-resource" />
            </React.Fragment>
          ))}
        </colgroup>
        <thead>
          <tr className="archival-table-width-row" aria-hidden="true">
            <th className="col-skill" />
            {stageLabels.map((label) => (
              <React.Fragment key={`${label}-width`}>
                <th className="col-content" />
                <th className="col-resource" />
              </React.Fragment>
            ))}
          </tr>
          <tr>
            <th rowSpan={2} className="sticky-col py-2 px-2 font-medium text-[10px] font-archival-mono tracking-wider uppercase align-middle">
              {ui.skillColumn ?? '스킬'}
            </th>
            {stageLabels.map((label) => (
              <th
                key={label}
                colSpan={2}
                className="py-1.5 px-1.5 font-medium text-[10px] font-archival-mono tracking-wider uppercase text-center"
              >
                {label}
              </th>
            ))}
          </tr>
          <tr>
            {stageLabels.map((label) => (
              <React.Fragment key={`${label}-sub`}>
                <th className="py-1.5 px-1.5 font-medium text-[9px] font-archival-mono tracking-wider uppercase">
                  {contentLabel}
                </th>
                <th className="resource-col py-1.5 px-1 font-medium text-[9px] font-archival-mono tracking-wider uppercase">
                  {resourceLabel}
                </th>
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="group">
              <td className="sticky-col py-3 px-2 align-top">
                <div className="font-medium font-archival-serif text-archival-ink tracking-[0.05em] text-[12px] leading-snug">
                  {row.name}
                </div>
                <div className="mt-1 font-archival-mono text-[8px] text-archival-ink/45 tracking-wider uppercase">
                  {row.id}
                </div>
              </td>
              {row.cells.map((cell, idx) => (
                <React.Fragment key={idx}>
                  <td className="py-3 px-2 align-top">
                    {cell.description && (
                      <p className={`leading-snug text-archival-ink-deep/90 text-[11px] ${cell.intent ? 'mb-1.5' : ''}`}>
                        {cell.description}
                      </p>
                    )}
                    {cell.intent && (
                      <p className="text-archival-ink/65 text-[10px] leading-snug font-archival-mono">
                        <span className="font-medium text-archival-ink/75">
                          {ui.designIntent ?? '기획 의도'}:
                        </span>{' '}
                        {cell.intent}
                      </p>
                    )}
                  </td>
                  <td className="resource-col py-3 px-1 align-top leading-snug text-archival-ink-deep/90 font-archival-mono">
                    {formatSkillResource(cell.resource)}
                  </td>
                </React.Fragment>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/** 특정 트리의 패시브 스킬 테이블 */
const WeaponPassiveSkillTable: React.FC<{ passiveTree: PassiveNode[]; side: string; position: number }> = ({ passiveTree, side, position }) => {
    const passives = passiveTree
        .filter(p => p.side === side && p.position === position)
        .sort((a, b) => a.tier - b.tier);

    if (passives.length === 0) return null;

    return (
        <div className="archival-table-wrap">
            <table className="archival-table text-sm min-w-[800px]">
                <thead>
                    <tr>
                        <th className="stub py-3 px-4 font-medium w-20 text-[11px] font-archival-mono tracking-wider uppercase">{ui.passiveColType ?? '타입'}</th>
                        <th className="stub py-3 px-4 font-medium w-16 text-[11px] font-archival-mono tracking-wider uppercase">{ui.passiveColTier ?? '티어'}</th>
                        <th className="stub py-3 px-4 font-medium w-[140px] text-[11px] font-archival-mono tracking-wider uppercase">{ui.passiveColName ?? '이름'}</th>
                        <th className="py-3 px-4 font-medium w-2/5 text-[11px] font-archival-mono tracking-wider uppercase">{ui.passiveColDesc ?? '내용'}</th>
                        <th className="py-3 px-4 font-medium text-[11px] font-archival-mono tracking-wider uppercase">{ui.passiveColIntent ?? ui.designIntent ?? '기획 의도'}</th>
                    </tr>
                </thead>
                <tbody>
                    {passives.map(p => (
                        <tr key={p.id} className="group">
                            <td className="stub py-6 px-4 align-top font-medium font-archival-mono text-archival-ink/80 text-[11px]">{p.type === 'Main' ? (ui.passiveTypeMain ?? '메인') : (ui.passiveTypeSub ?? '서브')}</td>
                            <td className="stub py-6 px-4 align-top font-medium font-archival-mono text-archival-ink/80 text-[11px]">{p.tier}</td>
                            <td className="stub py-6 px-4 align-top font-medium font-archival-serif text-archival-ink">{p.name}</td>
                            <td className="py-6 px-4 align-top leading-relaxed text-archival-ink-deep/90 text-[12px]">{p.description}</td>
                            <td className="py-6 px-4 align-top leading-relaxed text-archival-ink-deep/90 text-[12px]">{p.designerIntent}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

/** 트리 카드 하단에 이어지는 액티브/패시브 표 카드 */
const TreeSkillDetailCards: React.FC<{
    skills: ActiveSkillDetail[];
    skillIds: readonly string[];
    treePath: 'pathA' | 'pathB';
    passiveTree: PassiveNode[];
    passiveSide: string;
    passivePosition: number;
}> = ({ skills, skillIds, treePath, passiveTree, passiveSide, passivePosition }) => {
    return (
        <div className="flex flex-col gap-3 pl-2 sm:pl-3 border-l border-archival-ink/20 ml-1 mt-1 min-w-0">
            <div
                className="border border-archival-ink/30 overflow-hidden min-w-0"
                style={{ backgroundColor: 'rgba(220,216,204,0.45)' }}
            >
                <div className="flex items-center gap-2 px-3 sm:px-4 pt-4 pb-3">
                    <div className="w-6 h-px bg-archival-ink/25" style={{ height: '0.5px' }} />
                    <span className="text-[10px] font-archival-mono font-semibold text-archival-ink/80 uppercase tracking-[0.2em]">
                        {ui.signatureActive ?? '시그니처 액티브 스킬'}
                    </span>
                </div>
                <div className="px-1.5 sm:px-2 pb-4 min-w-0">
                    <WeaponSignatureActiveTable
                        skills={skills}
                        skillIds={skillIds}
                        treePath={treePath}
                    />
                </div>
            </div>
            <div
                className="border border-archival-ink/30 overflow-hidden"
                style={{ backgroundColor: 'rgba(220,216,204,0.45)' }}
            >
                <div className="flex items-center gap-2 px-4 sm:px-5 pt-4 pb-3">
                    <div className="w-6 h-px bg-archival-ink/25" style={{ height: '0.5px' }} />
                    <span className="text-[10px] font-archival-mono font-semibold text-archival-ink/80 uppercase tracking-[0.2em]">
                        {ui.passiveSkill ?? '패시브 스킬'}
                    </span>
                </div>
                <div className="px-2 sm:px-4 pb-4">
                    <WeaponPassiveSkillTable
                        passiveTree={passiveTree}
                        side={passiveSide}
                        position={passivePosition}
                    />
                </div>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---

const ClassDesign: React.FC = () => {
  const WEAPON_IDS = ['class-chainsword', 'class-dualaxe', 'class-battleaxe'];
  const SUB_TITLES = ['4.1', '4.2', '4.3'];
  const WEAPON_BASIC_ACTION_IDS: Record<string, string> = { '사슬검': 'chainsword-basic-action', '쌍도끼': 'dualaxe-basic-action', '전투도끼': 'battleaxe-basic-action' };
  const WEAPON_STANCES_IDS: Record<string, string> = { '사슬검': 'chainsword-stances', '쌍도끼': 'dualaxe-stances', '전투도끼': 'battleaxe-stances' };
  const isLightWeapon = (name: string) => ['사슬검', '쌍도끼', '전투도끼'].includes(name);

  return (
    <div className="w-full space-y-48">
        {WEAPON_DATA.map((weapon, wIdx) => (
            <div key={wIdx} id={WEAPON_IDS[wIdx]} className="scroll-mt-32">
                {/* Header + 기본 액션 — 4.1~4.3 모두 Artistic Minimalism */}
                {isLightWeapon(weapon.name) ? (
                    <div id={WEAPON_BASIC_ACTION_IDS[weapon.name]} className="mb-0 text-archival-ink">
                        <div className="flex items-end gap-4 mb-4 pb-2" style={{ borderBottom: '0.5px solid rgba(42,42,42,0.25)' }}>
                            <span className="font-archival-mono font-bold tracking-[0.25em] text-[10px] text-archival-ink/80">{SUB_TITLES[wIdx]}</span>
                            <h2 className="text-2xl font-archival-serif font-semibold tracking-[0.12em] text-archival-ink">{weapon.name}</h2>
                        </div>
                        <div className="mb-4 px-0 py-1.5 border-l-2 border-archival-ink/20 pl-4">
                            <p className="text-[11px] font-archival-mono text-archival-ink/70 leading-relaxed tracking-[0.02em]">
                                · 공개된 적 없는 리소스는 레퍼런스 영상으로 대체하였습니다.<br />
                                · 프레임 정보는 60fps(초당 60프레임) 기준입니다.<br />
                                · 프레임은 영상 기준이 아닌, 기획 의도에 따라 기재하였습니다.
                            </p>
                        </div>
                {/* CORE MECHANICS — Organic Archival Sci‑Fi */}
                {(() => {
                    const isLight = isLightWeapon(weapon.name);
                    const Wrap = ({ children }: { children: React.ReactNode }) => <>{children}</>;
                    const h3Cls = isLight ? 'text-lg font-archival-serif font-semibold text-archival-ink flex items-center gap-3' : 'text-lg font-serif font-bold text-stone-300 flex items-center gap-3';
                    const lineCls = isLight ? 'h-px flex-1 bg-archival-ink/20' : 'h-px bg-white/10 flex-1';
                    const iconCls = isLight ? 'text-archival-ink/70' : 'text-gold';
                    return (
                    <Wrap>
                <div className="mb-20">
                    <div className="flex items-center gap-3 mb-12">
                            <h3 className={h3Cls}>
                                <Settings2 className={iconCls} /> {ui.basicActions ?? '기본 액션'}
                            </h3>
                            <div className={lineCls} style={{ height: '0.5px' }} />
                    </div>

                    {/* Special Action */}
                    <div className="mb-24">
                        <div className="flex items-center gap-2 mb-12">
                            <div className="w-8 h-px bg-archival-ink/25" style={{ height: '0.5px' }} />
                            <span className="text-xs font-archival-mono font-semibold text-archival-ink uppercase tracking-[0.2em]">{ui.specialAction ?? '특수 액션'}</span>
                        </div>
                        <div className="flex flex-col lg:flex-row gap-0 lg:gap-24 items-start overflow-visible">
                            <div className="flex-shrink-0 w-full lg:w-[38%] aspect-video overflow-hidden border border-archival-ink/20" style={{ borderWidth: '0.5px' }}>
                                <VideoReference label={weapon.specialAction.name} color="stone" variant="editorial" src={weapon.name === '사슬검' ? chainswordSpecialActionVideo : weapon.name === '쌍도끼' ? dualaxeSpecialActionVideo : weapon.name === '전투도끼' ? battleaxeSpecialActionVideo : undefined} />
                            </div>
                            <div className="flex-1 pt-8 lg:pt-0 lg:pl-0 flex flex-col justify-center min-w-0 w-full lg:max-w-2xl overflow-visible">
                                <h4 className="font-archival-serif font-semibold text-2xl md:text-3xl text-archival-ink tracking-[0.1em] mb-4">{weapon.specialAction.name}</h4>
                                <p className="text-sm text-archival-ink-deep/90 leading-relaxed mb-8">{weapon.specialAction.description}</p>
                                {weapon.specialAction.designIntent && (
                                    <div className="mb-6">
                                        <p className="text-[9px] font-archival-mono text-archival-ink/50 uppercase tracking-[0.2em] mb-1">기획 의도</p>
                                        <p className="text-[11px] text-archival-ink-deep/70 leading-relaxed">{weapon.specialAction.designIntent}</p>
                                    </div>
                                )}
                                <div className="h-px w-12 bg-archival-ink/20 mb-6" style={{ height: '0.5px' }} />
                                <div className="flex flex-col gap-6">
                                    {weapon.specialAction.frameDataAlt ? (
                                        <>
                                            <div>
                                                <div className="text-[9px] font-archival-mono text-archival-ink/60 uppercase tracking-[0.25em] mb-2">{weapon.specialAction.frameDataLabel ?? 'Frame'}</div>
                                                <FrameDataTable data={weapon.specialAction.frameData} variant="editorial" />
                                            </div>
                                            <div>
                                                <div className="text-[9px] font-archival-mono text-archival-ink/60 uppercase tracking-[0.25em] mb-2">{weapon.specialAction.frameDataAlt.label}</div>
                                                <FrameDataTable data={weapon.specialAction.frameDataAlt.frameData} variant="editorial" />
                                            </div>
                                        </>
                                    ) : (
                                        <div>
                                            <div className="text-[9px] font-archival-mono text-archival-ink/60 uppercase tracking-[0.25em] mb-3">Frame</div>
                                            <FrameDataTable data={weapon.specialAction.frameData} variant="editorial" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Basic Attack */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-16">
                            <div className="w-8 h-px bg-archival-ink/25" style={{ height: '0.5px' }} />
                            <span className="text-xs font-archival-mono font-semibold text-archival-ink uppercase tracking-[0.2em]">{ui.basicCombo ?? '기본 공격 콤보'}</span>
                        </div>
                        <div className="space-y-32">
                            {weapon.basicAttack.steps.map((step, i) => (
                                <div key={i} className="flex flex-col lg:flex-row gap-0 lg:gap-24 items-start overflow-visible">
                                    <div className="flex-shrink-0 lg:w-[38%] aspect-video overflow-hidden w-full border border-archival-ink/20" style={{ borderWidth: '0.5px' }}>
                                        <VideoReference
                                            label={step.name}
                                            color="stone"
                                            variant="editorial"
                                            src={
                                                weapon.name === '사슬검' && step.step === 1 ? chainswordNormalAttack01Video
                                                : weapon.name === '사슬검' && step.step === 2 ? chainswordNormalAttack02Video
                                                : weapon.name === '사슬검' && step.step === 3 ? chainswordNormalAttack03Video
                                                : weapon.name === '쌍도끼' && step.step === 1 ? dualaxeNormalAttack01Video
                                                : weapon.name === '쌍도끼' && step.step === 2 ? dualaxeNormalAttack02Video
                                                : weapon.name === '쌍도끼' && step.step === 3 ? dualaxeNormalAttack03Video
                                                : weapon.name === '전투도끼' && step.step === 1 ? battleaxeNormalAttack01Video
                                                : weapon.name === '전투도끼' && step.step === 2 ? battleaxeNormalAttack02Video
                                                : weapon.name === '전투도끼' && step.step === 3 ? battleaxeNormalAttack03Video
                                                : undefined
                                            }
                                        />
                                        <div className="mt-2 text-[8px] font-archival-mono text-archival-ink/50 uppercase tracking-[0.2em]">Step {step.step}</div>
                                    </div>
                                    <div className="flex-1 pt-6 lg:pt-0 min-w-0 w-full lg:max-w-2xl overflow-visible">
                                        <div className="flex items-baseline gap-4 mb-2">
                                            <h4 className="font-archival-serif font-semibold text-xl md:text-2xl text-archival-ink tracking-[0.12em]">{step.name}</h4>
                                            <span className="text-[9px] font-archival-mono text-archival-ink/60">{step.input}</span>
                                        </div>
                                        <p className="text-sm text-archival-ink-deep/90 leading-relaxed mb-8">{step.description}</p>
                                        {step.designIntent && (
                                            <div className="mb-6">
                                                <p className="text-[9px] font-archival-mono text-archival-ink/50 uppercase tracking-[0.2em] mb-1">기획 의도</p>
                                                <p className="text-[11px] text-archival-ink-deep/70 leading-relaxed">{step.designIntent}</p>
                                            </div>
                                        )}
                                        <div className="h-px w-12 bg-archival-ink/20 mb-6" style={{ height: '0.5px' }} />
                                        <div>
                                            <div className="text-[9px] font-archival-mono text-archival-ink/60 uppercase tracking-[0.25em] mb-3">Frame</div>
                                            <FrameDataTable data={step.frameData} variant="editorial" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 연계 공격 */}
                    <div className="mt-24">
                        <div className="flex items-center gap-2 mb-16">
                            <div className="w-8 h-px bg-archival-ink/25" style={{ height: '0.5px' }} />
                            <span className="text-xs font-archival-mono font-semibold text-archival-ink uppercase tracking-[0.2em]">{ui.movementAttack ?? '연계 공격'}</span>
                        </div>
                        <div className="space-y-32">
                            {(weapon.movementAttackSteps ?? MOVEMENT_ATTACK_STEPS).map((step, i) => (
                                <div key={i} className="flex flex-col lg:flex-row gap-0 lg:gap-24 items-start overflow-visible">
                                    <div className="flex-shrink-0 lg:w-[38%] aspect-video overflow-hidden w-full border border-archival-ink/20" style={{ borderWidth: '0.5px' }}>
                                        <VideoReference
                                            label={step.name}
                                            color="stone"
                                            variant="editorial"
                                            src={
                                                weapon.name === '사슬검' && step.step === 1 ? chainswordEvadeAttackFVideo
                                                : weapon.name === '사슬검' && step.step === 2 ? chainswordEvadeAttackBVideo
                                                : weapon.name === '사슬검' && step.step === 3 ? chainswordSprintAttackVideo
                                                : weapon.name === '쌍도끼' && step.step === 1 ? dualaxeEvadeAttackFVideo
                                                : weapon.name === '쌍도끼' && step.step === 2 ? dualaxeEvadeAttackBVideo
                                                : weapon.name === '쌍도끼' && step.step === 3 ? dualaxeSprintAttackVideo
                                                : weapon.name === '전투도끼' && step.step === 1 ? battleaxeEvadeAttackFVideo
                                                : weapon.name === '전투도끼' && step.step === 2 ? battleaxeEvadeAttackBVideo
                                                : weapon.name === '전투도끼' && step.step === 3 ? battleaxeSprintAttackVideo
                                                : undefined
                                            }
                                        />
                                        <div className="mt-2 text-[8px] font-archival-mono text-archival-ink/50 uppercase tracking-[0.2em]">Step {step.step}</div>
                                    </div>
                                    <div className="flex-1 pt-6 lg:pt-0 min-w-0 w-full lg:max-w-2xl overflow-visible">
                                        <div className="flex items-baseline gap-4 mb-2">
                                            <h4 className="font-archival-serif font-semibold text-xl md:text-2xl text-archival-ink tracking-[0.12em]">{step.name}</h4>
                                            <span className="text-[9px] font-archival-mono text-archival-ink/60">{step.input}</span>
                                        </div>
                                        <p className="text-sm text-archival-ink-deep/90 leading-relaxed mb-8">{step.description}</p>
                                        {step.designIntent && (
                                            <div className="mb-6">
                                                <p className="text-[9px] font-archival-mono text-archival-ink/50 uppercase tracking-[0.2em] mb-1">기획 의도</p>
                                                <p className="text-[11px] text-archival-ink-deep/70 leading-relaxed">{step.designIntent}</p>
                                            </div>
                                        )}
                                        <div className="h-px w-12 bg-archival-ink/20 mb-6" style={{ height: '0.5px' }} />
                                        <div>
                                            <div className="text-[9px] font-archival-mono text-archival-ink/60 uppercase tracking-[0.25em] mb-3">Frame</div>
                                            <FrameDataTable data={step.frameData} variant="editorial" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                    </Wrap>
                    );
                })()}
                </div>
                ) : null}
                {/* COMBAT STANCES */}
                <div className="mb-32">
                    <div className="flex items-center gap-3 mb-10">
                        <h3 className={`text-lg font-semibold flex items-center gap-3 ${isLightWeapon(weapon.name) ? 'font-archival-serif text-archival-ink' : 'font-serif font-bold text-[#1A1A1A]'}`}>
                            <Layers className={isLightWeapon(weapon.name) ? 'text-archival-ink/70' : 'text-[#2D2D2D]'} /> {ui.stance ?? '전투 태세'}
                        </h3>
                        <div className={`h-px flex-1 ${isLightWeapon(weapon.name) ? 'bg-archival-ink/20' : 'bg-[#1A1A1A]/25'}`} style={isLightWeapon(weapon.name) ? { height: '0.5px' } : undefined} />
                    </div>
                    <CombatStanceSection
                        stances={weapon.stances}
                        sectionId={WEAPON_STANCES_IDS[weapon.name]}
                        weaponName={weapon.name}
                        skillTree={WEAPON_TREE_SECTIONS[weapon.name] ? weapon : undefined}
                    />
                </div>

                {/* SIGNATURE SKILLS — 트리 섹션이 있으면 카드 아코디언으로 표시 */}
                {WEAPON_TREE_SECTIONS[weapon.name] ? null : (
                    <div className="mb-16">
                        <div className="flex items-center gap-3 mb-10">
                            <h3 className={`text-lg font-semibold flex items-center gap-3 ${isLightWeapon(weapon.name) ? 'font-archival-serif text-archival-ink' : 'font-serif font-bold text-[#1A1A1A]'}`}>
                                <Workflow className={isLightWeapon(weapon.name) ? 'text-archival-gold' : 'text-gold'} /> {ui.signatureAction ?? '시그니처 액션'}
                            </h3>
                            <div className={`h-px flex-1 ${isLightWeapon(weapon.name) ? 'bg-archival-ink/20' : 'bg-[#1A1A1A]/25'}`} style={isLightWeapon(weapon.name) ? { height: '0.5px' } : undefined} />
                        </div>
                        <SignatureActionSection weapon={weapon} variant={isLightWeapon(weapon.name) ? 'archival' : undefined} />
                    </div>
                )}
            </div>
        ))}
    </div>
  );
};

export default ClassDesign;