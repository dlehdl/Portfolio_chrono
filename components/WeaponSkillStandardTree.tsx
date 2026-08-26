import React, { useEffect } from 'react';
import { GitFork, Network, Sword, Flame, Wind, ChevronsRight, MousePointer2, Gamepad2, Plus, Settings2, RefreshCcw, Target, Zap } from 'lucide-react';
import { text } from '../content';

const wstUi = text.ui?.weaponSkillTree ?? {};

type WeaponSkillStandardTreeProps = {
  weaponName?: string;
};

// 원본 Matrix_node.html의 drawTree 로직을 그대로 옮긴 초기화 함수
const initMatrixNodeTree = () => {
  function drawTree() {
    const svg = document.getElementById('lines-svg') as unknown as SVGSVGElement | null;
    const container = document.querySelector('.tree-container') as HTMLElement | null;

    if (!svg || !container) return;

    // Setup SVG Definition for Arrowhead
    svg.innerHTML = `
                <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5"
                        markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#333" />
                    </marker>
                </defs>
            `;

    const containerRect = container.getBoundingClientRect();

    // Helper function to get element coordinates relative to the SVG container
    function getCoords(id: string) {
      const el = document.getElementById(id);
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      return {
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top + rect.height / 2,
        top: rect.top - containerRect.top,
        bottom: rect.bottom - containerRect.top,
      };
    }

    // Path generation helpers
    function drawPath(d: string, withArrow = false) {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', d);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', '#333');
      path.setAttribute('stroke-width', '1');
      if (withArrow) {
        path.setAttribute('marker-end', 'url(#arrow)');
      }
      svg.appendChild(path);
    }

    const start = getCoords('start_node');
    if (!start) return; // Wait for DOM if not ready

    const trunkX = start.x;
    let currentTrunkY = start.top;

    function extendTrunkTo(y: number) {
      drawPath(`M ${trunkX} ${currentTrunkY} L ${trunkX} ${y}`);
      currentTrunkY = y;
    }

    // Helper to draw horizontal branch to side dots
    function connectSideDots(
      dotL: { x: number; y: number } | null,
      dotR: { x: number; y: number } | null,
    ) {
      if (!dotL || !dotR) return;
      extendTrunkTo(dotL.y);
      drawPath(`M ${trunkX} ${dotL.y} L ${dotL.x} ${dotL.y}`);
      drawPath(`M ${trunkX} ${dotR.y} L ${dotR.x} ${dotR.y}`);
    }

    // Helper to draw UP from a dot to targets
    function branchUpFromDot(
      dot: { x: number; y: number } | null,
      targetIds: string[],
    ) {
      if (!dot) return;
      targetIds.forEach((id) => {
        const target = getCoords(id);
        if (target) {
          drawPath(
            `M ${dot.x} ${dot.y} L ${target.x} ${dot.y} L ${target.x} ${target.bottom}`,
            true,
          );
        }
      });
    }

    // Helper to draw DOWN from trunk to targets (Center Nodes)
    function branchDownFromTrunk(
      targetIds: string[],
      hasRedDot = false,
      dotId: string | null = null,
    ) {
      const targets = targetIds.map(getCoords).filter((t): t is NonNullable<ReturnType<typeof getCoords>> => t !== null);
      if (targets.length === 0) return;

      let branchY: number;
      if (hasRedDot && dotId) {
        const dot = getCoords(dotId);
        if (!dot) return;
        branchY = dot.y;
        extendTrunkTo(branchY);
      } else {
        // Calculate branch line slightly above the nodes
        branchY = targets[0].top - 15;
        extendTrunkTo(branchY);
      }

      const minX = Math.min(...targets.map((t) => t.x));
      const maxX = Math.max(...targets.map((t) => t.x));

      // Draw horizontal bar
      drawPath(`M ${minX} ${branchY} L ${maxX} ${branchY}`);

      // Draw arrows down
      targets.forEach((t) => {
        drawPath(`M ${t.x} ${branchY} L ${t.x} ${t.top}`, true);
      });
    }

    // Helper for simple vertical connections
    function connectVertical(fromId: string, toId: string) {
      const from = getCoords(fromId);
      const to = getCoords(toId);
      if (from && to) {
        drawPath(`M ${from.x} ${from.top} L ${to.x} ${to.bottom}`, true);
      }
    }

    // --- Start Drawing Sequence (Bottom to Top) ---

    // Tier 1
    const d1L = getCoords('dot_t1_l');
    const d1R = getCoords('dot_t1_r');
    connectSideDots(d1L, d1R);
    branchUpFromDot(d1L, ['t1_a2_up1', 't1_a1_up1']);
    branchUpFromDot(d1R, ['t1_b1_up1', 't1_b2_up1']);

    connectVertical('t1_a2_up1', 't1_a2_up2');
    connectVertical('t1_a1_up1', 't1_a1_up2');
    connectVertical('t1_b1_up1', 't1_b1_up2');
    connectVertical('t1_b2_up1', 't1_b2_up2');

    // Tier 2
    const d2L = getCoords('dot_t2_l');
    const d2R = getCoords('dot_t2_r');
    connectSideDots(d2L, d2R);
    branchUpFromDot(d2L, ['t2_a2_up1', 't2_a1_up1']);
    branchUpFromDot(d2R, ['t2_b1_up1', 't2_b2_up1']);
    connectVertical('t2_a2_up1', 't2_a2_up2');
    connectVertical('t2_a1_up1', 't2_a1_up2');
    connectVertical('t2_b1_up1', 't2_b1_up2');
    connectVertical('t2_b2_up1', 't2_b2_up2');

    branchDownFromTrunk(['t2_bot_s1', 't2_bot_s2', 't2_bot_s3', 't2_bot_s4']);
    branchDownFromTrunk(['t2_top_s1', 't2_top_s2', 't2_top_s3', 't2_top_s4']);

    // Tier 3
    const d3L = getCoords('dot_t3_l');
    const d3R = getCoords('dot_t3_r');
    connectSideDots(d3L, d3R);
    branchUpFromDot(d3L, ['t3_a2_up1', 't3_a1_up1']);
    branchUpFromDot(d3R, ['t3_b1_up1', 't3_b2_up1']);
    connectVertical('t3_a2_up1', 't3_a2_up2');
    connectVertical('t3_a1_up1', 't3_a1_up2');
    connectVertical('t3_b1_up1', 't3_b1_up2');
    connectVertical('t3_b2_up1', 't3_b2_up2');

    branchDownFromTrunk(['t3_m1', 't3_m2', 't3_m3', 't3_m4'], true, 'dot_t3_c');
    branchDownFromTrunk(['t3_s1', 't3_s2', 't3_s3', 't3_s4']);

    // Tier 4
    const d4L = getCoords('dot_t4_l');
    const d4R = getCoords('dot_t4_r');
    connectSideDots(d4L, d4R);
    branchUpFromDot(d4L, ['t4_a2_up1', 't4_a1_up1']);
    branchUpFromDot(d4R, ['t4_b1_up1', 't4_b2_up1']);
    connectVertical('t4_a2_up1', 't4_a2_up2');
    connectVertical('t4_a1_up1', 't4_a1_up2');
    connectVertical('t4_b1_up1', 't4_b1_up2');
    connectVertical('t4_b2_up1', 't4_b2_up2');

    branchDownFromTrunk(['t4_m1', 't4_m2', 't4_m3', 't4_m4'], true, 'dot_t4_c');
    branchDownFromTrunk(['t4_s1', 't4_s2', 't4_s3', 't4_s4']);

    // Tier 5
    branchDownFromTrunk(['t5_m1', 't5_m2', 't5_m3', 't5_m4'], true, 'dot_t5_c');
  }

  // SPA에서는 load 이벤트가 이미 발생한 뒤에 마운트되므로, 마운트 직후 한 번 반드시 호출
  const timeoutId = window.setTimeout(drawTree, 150);
  window.addEventListener('resize', drawTree);

  return () => {
    window.clearTimeout(timeoutId);
    window.removeEventListener('resize', drawTree);
  };
};

// 기본 조작 데이터
const BASE_ACTIONS = [
  { title: '기본 액션', subtitle: '빠른 템포의 연속 공격', icon: Sword, keyboard: '좌클릭', gamepad: 'R1', iconCls: 'text-archival-ink/80' },
  { title: '특수 액션', subtitle: '강력한 한 방 (강공격)', icon: Flame, keyboard: '우클릭', gamepad: 'R2', iconCls: 'text-archival-ink/80' },
  { title: '회피', subtitle: '적의 공격을 무효화하며 이동', icon: Wind, keyboard: 'Shift', gamepad: '◯', iconCls: 'text-archival-ink/80' },
];
const COMBO_ACTIONS = [
  { title: '회피 공격', subtitle: '회피 직후 파고드는 반격기', icon: Wind, iconCls: 'text-archival-ink/70', keyboardSteps: ['Shift', '좌클릭'], gamepadSteps: ['◯', 'R1'] },
  { title: '전력질주 공격', subtitle: '거리를 좁히며 강력하게 진입', icon: ChevronsRight, iconCls: 'text-archival-ink/70', keyboardSteps: ['전력질주', '좌클릭'], gamepadSteps: ['L3', 'R1'] },
];
// 액티브 스킬 장착·무기 교체 — 무기별 스킬 슬롯 아이콘 (시각적 구분)
const WEAPON1_SKILL_ICONS = [Target, Flame, Zap, Wind];
const WEAPON2_SKILL_ICONS = [Wind, Target, Flame, Zap];

const WeaponSkillStandardTree: React.FC<WeaponSkillStandardTreeProps> = ({ weaponName }) => {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const cleanup = initMatrixNodeTree();
    return cleanup;
  }, []);

  return (
    <section className="mt-24">
      {/* 기본 조작 — 스킬 트리 상단 */}
      <div className="mb-16">
        <div className="mb-6 flex items-center gap-3">
          <h3 className="text-sm font-archival-mono tracking-[0.3em] uppercase text-archival-ink/80 flex items-center gap-2">
            <Settings2 className="h-4 w-4 text-archival-ink/70" />
            {wstUi.baseOps ?? '기본 조작'}
          </h3>
          <div className="h-px flex-1 bg-archival-ink/20" style={{ height: '0.5px' }} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {BASE_ACTIONS.map((action, idx) => {
            const Icon = action.icon;
            return (
              <div key={idx} className="rounded-lg border border-archival-ink/20 bg-white/40 p-4 transition-colors hover:bg-white/60" style={{ borderWidth: '0.5px' }}>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-archival-serif font-semibold text-archival-ink tracking-[0.05em]">{action.title}</h4>
                  <p className="text-[10px] font-archival-mono text-archival-ink/70 mt-0.5 leading-snug">{action.subtitle}</p>
                  <div className="mt-3 pt-3 border-t border-archival-ink/15 flex flex-wrap gap-2" style={{ borderTopWidth: '0.5px' }}>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-archival-ink/25 text-[9px] font-archival-mono uppercase tracking-wider text-archival-ink/90 bg-white/60">
                      <MousePointer2 className="h-2.5 w-2.5" /> {action.keyboard}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-archival-ink/25 text-[9px] font-archival-mono uppercase tracking-wider text-archival-ink/90 bg-archival-ink/5">
                      <Gamepad2 className="h-2.5 w-2.5" /> {action.gamepad}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-px bg-archival-ink/25" style={{ height: '0.5px' }} />
          <span className="text-[10px] font-archival-mono font-semibold text-archival-ink/80 uppercase tracking-[0.2em]">{wstUi.comboOps ?? '연계 조작'}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {COMBO_ACTIONS.map((action, idx) => {
            const Icon = action.icon;
            return (
              <div key={idx} className="rounded-lg border border-archival-ink/20 bg-white/40 p-4 transition-colors hover:bg-white/60" style={{ borderWidth: '0.5px' }}>
                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-archival-serif font-semibold text-archival-ink tracking-[0.05em]">{action.title}</h4>
                    <p className="text-[10px] font-archival-mono text-archival-ink/70 mt-0.5 leading-snug">{action.subtitle}</p>
                    <div className="mt-3 pt-3 border-t border-archival-ink/15 flex items-center gap-3 flex-wrap" style={{ borderTopWidth: '0.5px' }}>
                      <span className="inline-flex items-center gap-1.5 flex-wrap">
                        {action.keyboardSteps.map((key, i) => (
                          <span key={i} className="inline-flex items-center gap-1">
                            {i > 0 && <Plus className="h-3 w-3 text-archival-ink/50 shrink-0" strokeWidth={2.5} />}
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-archival-ink/25 text-[9px] font-archival-mono uppercase tracking-wider text-archival-ink/90 bg-white/60">
                              <MousePointer2 className="h-2.5 w-2.5" /> {key}
                            </span>
                          </span>
                        ))}
                      </span>
                      <span className="inline-flex items-center gap-1.5 flex-wrap">
                        {action.gamepadSteps.map((pad, i) => (
                          <span key={i} className="inline-flex items-center gap-1">
                            {i > 0 && <Plus className="h-3 w-3 text-archival-ink/50 shrink-0" strokeWidth={2.5} />}
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-archival-ink/25 text-[9px] font-archival-mono uppercase tracking-wider text-archival-ink/90 bg-archival-ink/5">
                              <Gamepad2 className="h-2.5 w-2.5" /> {pad}
                            </span>
                          </span>
                        ))}
                      </span>
                    </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 액티브 스킬 장착과 무기 교체 — 기본 조작과 스킬 트리 사이 */}
      <div className="mb-16">
        <div className="mb-6 flex items-center gap-3">
          <h3 className="text-sm font-archival-mono tracking-[0.3em] uppercase text-archival-ink/80 flex items-center gap-2">
            <RefreshCcw className="h-4 w-4 text-archival-ink/70" />
            {wstUi.skillEquip ?? '액티브 스킬 장착과 무기 교체'}
          </h3>
          <div className="h-px flex-1 bg-archival-ink/20" style={{ height: '0.5px' }} />
        </div>
        <p className="mb-8 text-xs font-sans leading-relaxed text-archival-ink-deep/90 text-left max-w-3xl">
          플레이어는 두 개의 무기를 장착하여 무기당 4개의 액티브 스킬을 사용할 수 있습니다. 전투 중 무기 교체를 통해 즉각적으로 무기와 스킬셋을 전환하며, 액티브 스킬은 각 클래스의 고유한 자원(CP)을 소모합니다.
        </p>
        <div className="overflow-x-auto pb-4">
          <div className="relative flex flex-row items-center justify-between min-w-[720px] px-6 py-12 lg:py-16 rounded-xl border border-archival-ink/20 bg-white/40 shadow-sm" style={{ borderWidth: '0.5px' }}>
            {/* 무기 1 (주무기) */}
            <div className="flex flex-col items-start gap-6 flex-1">
              <div className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-archival-ink/30 bg-archival-ink/10 text-archival-ink" style={{ borderWidth: '0.5px' }}>
                <Sword className="h-4 w-4 text-archival-ink/90" strokeWidth={1.5} />
                <span className="text-[10px] font-archival-mono font-bold uppercase tracking-[0.15em] whitespace-nowrap">1번 무기 (주무기)</span>
              </div>
              <div className="flex flex-row gap-3 lg:gap-4">
                {[1, 2, 3, 4].map((num, idx) => {
                  const Icon = WEAPON1_SKILL_ICONS[idx];
                  return (
                    <div key={`w1-${num}`} className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-archival-ink/25 flex items-center justify-center bg-white/60 text-archival-ink/90" style={{ borderWidth: '0.5px' }}>
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.5} />
                      </div>
                      <span className="text-[9px] font-archival-mono font-semibold text-archival-ink/80 uppercase tracking-wider">스킬 {num}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* 교체 (Swap) */}
            <div className="flex flex-col items-center gap-2 z-10 shrink-0 px-4">
              <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-archival-ink/30 bg-white/80 text-archival-ink" style={{ borderWidth: '0.5px' }}>
                <RefreshCcw className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1.5} />
              </div>
              <span className="text-[9px] font-archival-mono font-bold uppercase tracking-[0.2em] text-archival-ink/90 bg-archival-ink/5 px-2.5 py-1 rounded border border-archival-ink/20" style={{ borderWidth: '0.5px' }}>교체 (Swap)</span>
            </div>
            {/* 무기 2 (보조무기) */}
            <div className="flex flex-col items-end gap-6 flex-1">
              <div className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-archival-ink/30 bg-archival-ink/10 text-archival-ink" style={{ borderWidth: '0.5px' }}>
                <span className="text-[10px] font-archival-mono font-bold uppercase tracking-[0.15em] whitespace-nowrap">2번 무기 (보조무기)</span>
                <Sword className="h-4 w-4 text-archival-ink/90 scale-x-[-1]" strokeWidth={1.5} />
              </div>
              <div className="flex flex-row-reverse gap-3 lg:gap-4">
                {[1, 2, 3, 4].map((num, idx) => {
                  const Icon = WEAPON2_SKILL_ICONS[idx];
                  return (
                    <div key={`w2-${num}`} className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-archival-ink/25 flex items-center justify-center bg-white/60 text-archival-ink/90" style={{ borderWidth: '0.5px' }}>
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.5} />
                      </div>
                      <span className="text-[9px] font-archival-mono font-semibold text-archival-ink/80 uppercase tracking-wider">스킬 {num}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <h3 className="text-sm font-archival-mono tracking-[0.3em] uppercase text-archival-ink/80 flex items-center gap-2">
          <GitFork className="h-4 w-4 text-archival-ink/70" />
          {wstUi.standardStructure ?? '무기 전용 스킬 습득 표준 구조'}
        </h3>
        <div className="h-px flex-1 bg-archival-ink/20" style={{ height: '0.5px' }} />
      </div>

      <p className="mb-4 text-xs font-sans leading-relaxed text-archival-ink-deep/80">
        {weaponName && (
          <span className="mr-1 inline-flex items-center gap-1 rounded border border-archival-ink/25 px-1.5 py-0.5 text-[9px] text-archival-ink/80">
            <Network className="h-3 w-3" />
            {weaponName}
          </span>
        )}
        각 무기는 동일한 구조의 스킬 트리를 공유하며, 독립적인 액티브 업그레이드 및 패시브 효과를 가집니다. 아래 다이어그램은 티어 간 위계와 선택 분기를 정리한
        &nbsp;<span className="font-semibold">표준 스킬 트리 구조</span>입니다.
      </p>

      <div className="overflow-x-auto rounded-xl border border-archival-ink/20 bg-archival-bg-deep/60 p-6 shadow-sm">
        <div className="relative mx-auto max-w-5xl">
          <div className="tree-container relative mx-auto w-full pt-8 pb-10 pr-32">
            {/* SVG Lines Layer — 노드/점 아래, 테두리 뒤 */}
            <svg
              id="lines-svg"
              className="pointer-events-none absolute inset-0 z-0 h-full w-full"
            />

            {/* Legend: 트리 우측 상단, 노드 영역과 겹치지 않도록 여백 확보 */}
            <div className="legend pointer-events-none absolute right-4 top-4 z-20 flex w-32 flex-col items-stretch gap-4 rounded-lg border border-archival-ink/30 bg-archival-bg-deep/95 p-3 shadow-sm">
              <div className="legend-title mx-auto -mt-4 rounded border border-archival-ink/60 bg-archival-bg-deep px-3 py-0.5 text-center text-[10px] font-archival-mono font-bold uppercase tracking-[0.15em] text-archival-ink">
                Key
              </div>
              <div className="legend-item flex flex-col items-center gap-1 text-[10px] text-archival-ink-deep/90">
                <div className="legend-box flex h-9 w-20 items-center justify-center rounded-full border border-sky-500/50 bg-sky-900/10 text-[10px] font-archival-mono text-sky-700">
                  Active
                </div>
                <span className="text-[9px] text-archival-ink/70">액티브 스킬</span>
              </div>
              <div className="legend-item flex flex-col items-center gap-1 text-[10px] text-archival-ink-deep/90">
                <div className="legend-circle flex h-11 w-11 items-center justify-center rounded-full border border-amber-500/70 bg-amber-900/10 text-[10px] font-archival-mono text-amber-800">
                  Passive
                </div>
                <span className="text-[9px] text-archival-ink/70">패시브 노드</span>
              </div>
              <div className="legend-item mt-1 flex flex-col items-center gap-1 text-[10px] text-archival-ink-deep/90">
                <div className="legend-dot-wrap flex items-center gap-2">
                  <div className="red-dot relative z-10 h-2.5 w-2.5 rounded-full border border-red-700 bg-red-500 shadow-[0_0_6px_rgba(248,113,113,0.7)]" />
                  <span className="text-xs">→</span>
                </div>
                <span className="text-[9px] text-archival-ink/80">배타적 선택 분기</span>
              </div>
            </div>

            {/* Tiers */}
            <div className="tiers-wrapper relative z-10 flex flex-col gap-8">
              {/* Tier 5 */}
              <div
                className="tier relative flex justify-center rounded-2xl border border-dashed border-archival-ink/30 px-5 py-6"
                id="tier-5"
              >
                <div className="tier-label absolute left-5 top-4 text-[10px] font-archival-mono font-bold uppercase tracking-[0.2em] text-archival-ink/70">
                  Tier 5
                </div>
                <div className="tier-content flex w-full max-w-3xl justify-between">
                  <div className="side-col flex w-40 flex-col items-center gap-6" />
                  <div className="center-col flex w-80 flex-col items-center gap-4 justify-end">
                    <div className="routing-row relative flex h-4 w-full items-center justify-center pb-1">
                      <div
                        className="red-dot relative z-20 h-3 w-3 rounded-full border border-red-700 bg-red-500 shadow-[0_0_8px_rgba(248,113,113,0.8)]"
                        id="dot_t5_c"
                      />
                    </div>
                    <div className="node-row flex w-full justify-center gap-4">
                      <div
                        className="node passive-main flex h-12 w-16 items-center justify-center rounded-full border border-amber-500/60 bg-amber-900/15 px-2 text-center text-[10px] font-archival-mono text-amber-900"
                        id="t5_m1"
                      >
                        Main
                      </div>
                      <div
                        className="node passive-main flex h-12 w-16 items-center justify-center rounded-full border border-amber-500/60 bg-amber-900/15 px-2 text-center text-[10px] font-archival-mono text-amber-900"
                        id="t5_m2"
                      >
                        Main
                      </div>
                      <div
                        className="node passive-main flex h-12 w-16 items-center justify-center rounded-full border border-amber-500/60 bg-amber-900/15 px-2 text-center text-[10px] font-archival-mono text-amber-900"
                        id="t5_m3"
                      >
                        Main
                      </div>
                      <div
                        className="node passive-main flex h-12 w-16 items-center justify-center rounded-full border border-amber-500/60 bg-amber-900/15 px-2 text-center text-[10px] font-archival-mono text-amber-900"
                        id="t5_m4"
                      >
                        Main
                      </div>
                    </div>
                  </div>
                  <div className="side-col flex w-40 flex-col items-center gap-6" />
                </div>
              </div>

              {/* Tier 4 */}
              <div
                className="tier relative flex justify-center rounded-2xl border border-dashed border-archival-ink/30 px-5 py-6"
                id="tier-4"
              >
                <div className="tier-label absolute left-5 top-4 text-[10px] font-archival-mono font-bold uppercase tracking-[0.2em] text-archival-ink/70">
                  Tier 4
                </div>
                <div className="tier-content flex w-full max-w-3xl justify-between">
                  {/* Left */}
                  <div className="side-col flex w-40 flex-col items-center gap-4">
                    <div className="node-row flex w-full justify-center gap-3">
                      <div
                        className="node active-blue flex h-12 w-[72px] items-center justify-center rounded-full border border-sky-500/50 bg-sky-900/15 px-2 text-center text-[10px] font-archival-mono text-sky-800"
                        id="t4_a2_up2"
                      >
                        Active4
                        <br />
                        A2 UP2
                      </div>
                      <div
                        className="node active-blue flex h-12 w-[72px] items-center justify-center rounded-full border border-sky-500/50 bg-sky-900/15 px-2 text-center text-[10px] font-archival-mono text-sky-800"
                        id="t4_a1_up2"
                      >
                        Active4
                        <br />
                        A1 UP2
                      </div>
                    </div>
                    <div className="node-row flex w-full justify-center gap-3">
                      <div
                        className="node active-blue flex h-12 w-[72px] items-center justify-center rounded-full border border-sky-500/50 bg-sky-900/15 px-2 text-center text-[10px] font-archival-mono text-sky-800"
                        id="t4_a2_up1"
                      >
                        Active4
                        <br />
                        A2 UP1
                      </div>
                      <div
                        className="node active-blue flex h-12 w-[72px] items-center justify-center rounded-full border border-sky-500/50 bg-sky-900/15 px-2 text-center text-[10px] font-archival-mono text-sky-800"
                        id="t4_a1_up1"
                      >
                        Active4
                        <br />
                        A1 UP1
                      </div>
                    </div>
                    <div className="routing-row relative flex h-4 w-full items-center justify-center pt-1">
                      <div
                        className="red-dot relative z-20 h-3 w-3 rounded-full border border-red-700 bg-red-500 shadow-[0_0_8px_rgba(248,113,113,0.8)]"
                        id="dot_t4_l"
                      />
                    </div>
                  </div>

                  {/* Center */}
                  <div className="center-col flex w-80 flex-col items-center gap-3">
                    <div className="node-row flex w-full justify-center gap-4">
                      <div
                        className="node passive-sub flex h-11 w-11 items-center justify-center rounded-full border border-amber-400/70 bg-amber-900/10 text-center text-[9px] font-archival-mono text-amber-900"
                        id="t4_s1"
                      >
                        Sub
                      </div>
                      <div
                        className="node passive-sub flex h-11 w-11 items-center justify-center rounded-full border border-amber-400/70 bg-amber-900/10 text-center text-[9px] font-archival-mono text-amber-900"
                        id="t4_s2"
                      >
                        Sub
                      </div>
                      <div
                        className="node passive-sub flex h-11 w-11 items-center justify-center rounded-full border border-amber-400/70 bg-amber-900/10 text-center text-[9px] font-archival-mono text-amber-900"
                        id="t4_s3"
                      >
                        Sub
                      </div>
                      <div
                        className="node passive-sub flex h-11 w-11 items-center justify-center rounded-full border border-amber-400/70 bg-amber-900/10 text-center text-[9px] font-archival-mono text-amber-900"
                        id="t4_s4"
                      >
                        Sub
                      </div>
                    </div>
                    <div className="routing-row relative flex h-4 w-full items-center justify-center">
                      <div
                        className="red-dot relative z-20 h-3 w-3 rounded-full border border-red-700 bg-red-500 shadow-[0_0_8px_rgba(248,113,113,0.8)]"
                        id="dot_t4_c"
                      />
                    </div>
                    <div className="node-row flex w-full justify-center gap-4">
                      <div
                        className="node passive-main flex h-12 w-16 items-center justify-center rounded-full border border-amber-500/60 bg-amber-900/15 px-2 text-center text-[10px] font-archival-mono text-amber-900"
                        id="t4_m1"
                      >
                        Main
                      </div>
                      <div
                        className="node passive-main flex h-12 w-16 items-center justify-center rounded-full border border-amber-500/60 bg-amber-900/15 px-2 text-center text-[10px] font-archival-mono text-amber-900"
                        id="t4_m2"
                      >
                        Main
                      </div>
                      <div
                        className="node passive-main flex h-12 w-16 items-center justify-center rounded-full border border-amber-500/60 bg-amber-900/15 px-2 text-center text-[10px] font-archival-mono text-amber-900"
                        id="t4_m3"
                      >
                        Main
                      </div>
                      <div
                        className="node passive-main flex h-12 w-16 items-center justify-center rounded-full border border-amber-500/60 bg-amber-900/15 px-2 text-center text-[10px] font-archival-mono text-amber-900"
                        id="t4_m4"
                      >
                        Main
                      </div>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="side-col flex w-40 flex-col items-center gap-4">
                    <div className="node-row flex w-full justify-center gap-3">
                      <div
                        className="node active-green flex h-12 w-[72px] items-center justify-center rounded-full border border-emerald-500/60 bg-emerald-900/15 px-2 text-center text-[10px] font-archival-mono text-emerald-800"
                        id="t4_b1_up2"
                      >
                        Active4
                        <br />
                        B1 UP2
                      </div>
                      <div
                        className="node active-green flex h-12 w-[72px] items-center justify-center rounded-full border border-emerald-500/60 bg-emerald-900/15 px-2 text-center text-[10px] font-archival-mono text-emerald-800"
                        id="t4_b2_up2"
                      >
                        Active4
                        <br />
                        B2 UP2
                      </div>
                    </div>
                    <div className="node-row flex w-full justify-center gap-3">
                      <div
                        className="node active-green flex h-12 w-[72px] items-center justify-center rounded-full border border-emerald-500/60 bg-emerald-900/15 px-2 text-center text-[10px] font-archival-mono text-emerald-800"
                        id="t4_b1_up1"
                      >
                        Active4
                        <br />
                        B1 UP1
                      </div>
                      <div
                        className="node active-green flex h-12 w-[72px] items-center justify-center rounded-full border border-emerald-500/60 bg-emerald-900/15 px-2 text-center text-[10px] font-archival-mono text-emerald-800"
                        id="t4_b2_up1"
                      >
                        Active4
                        <br />
                        B2 UP1
                      </div>
                    </div>
                    <div className="routing-row relative flex h-4 w-full items-center justify-center pt-1">
                      <div
                        className="red-dot relative z-20 h-3 w-3 rounded-full border border-red-700 bg-red-500 shadow-[0_0_8px_rgba(248,113,113,0.8)]"
                        id="dot_t4_r"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tier 3 */}
              <div
                className="tier relative flex justify-center rounded-2xl border border-dashed border-archival-ink/30 px-5 py-6"
                id="tier-3"
              >
                <div className="tier-label absolute left-5 top-4 text-[10px] font-archival-mono font-bold uppercase tracking-[0.2em] text-archival-ink/70">
                  Tier 3
                </div>
                <div className="tier-content flex w-full max-w-3xl justify-between">
                  {/* Left */}
                  <div className="side-col flex w-40 flex-col items-center gap-4">
                    <div className="node-row flex w-full justify-center gap-3">
                      <div
                        className="node active-blue flex h-12 w-[72px] items-center justify-center rounded-full border border-sky-500/50 bg-sky-900/15 px-2 text-center text-[10px] font-archival-mono text-sky-800"
                        id="t3_a2_up2"
                      >
                        Active3
                        <br />
                        A2 UP2
                      </div>
                      <div
                        className="node active-blue flex h-12 w-[72px] items-center justify-center rounded-full border border-sky-500/50 bg-sky-900/15 px-2 text-center text-[10px] font-archival-mono text-sky-800"
                        id="t3_a1_up2"
                      >
                        Active3
                        <br />
                        A1 UP2
                      </div>
                    </div>
                    <div className="node-row flex w-full justify-center gap-3">
                      <div
                        className="node active-blue flex h-12 w-[72px] items-center justify-center rounded-full border border-sky-500/50 bg-sky-900/15 px-2 text-center text-[10px] font-archival-mono text-sky-800"
                        id="t3_a2_up1"
                      >
                        Active3
                        <br />
                        A2 UP1
                      </div>
                      <div
                        className="node active-blue flex h-12 w-[72px] items-center justify-center rounded-full border border-sky-500/50 bg-sky-900/15 px-2 text-center text-[10px] font-archival-mono text-sky-800"
                        id="t3_a1_up1"
                      >
                        Active3
                        <br />
                        A1 UP1
                      </div>
                    </div>
                    <div className="routing-row relative flex h-4 w-full items-center justify-center pt-1">
                      <div
                        className="red-dot relative z-20 h-3 w-3 rounded-full border border-red-700 bg-red-500 shadow-[0_0_8px_rgba(248,113,113,0.8)]"
                        id="dot_t3_l"
                      />
                    </div>
                  </div>

                  {/* Center */}
                  <div className="center-col flex w-80 flex-col items-center gap-3">
                    <div className="node-row flex w-full justify-center gap-4">
                      <div
                        className="node passive-sub flex h-11 w-11 items-center justify-center rounded-full border border-amber-400/70 bg-amber-900/10 text-center text-[9px] font-archival-mono text-amber-900"
                        id="t3_s1"
                      >
                        Sub
                      </div>
                      <div
                        className="node passive-sub flex h-11 w-11 items-center justify-center rounded-full border border-amber-400/70 bg-amber-900/10 text-center text-[9px] font-archival-mono text-amber-900"
                        id="t3_s2"
                      >
                        Sub
                      </div>
                      <div
                        className="node passive-sub flex h-11 w-11 items-center justify-center rounded-full border border-amber-400/70 bg-amber-900/10 text-center text-[9px] font-archival-mono text-amber-900"
                        id="t3_s3"
                      >
                        Sub
                      </div>
                      <div
                        className="node passive-sub flex h-11 w-11 items-center justify-center rounded-full border border-amber-400/70 bg-amber-900/10 text-center text-[9px] font-archival-mono text-amber-900"
                        id="t3_s4"
                      >
                        Sub
                      </div>
                    </div>
                    <div className="routing-row relative flex h-4 w-full items-center justify-center">
                      <div
                        className="red-dot relative z-20 h-3 w-3 rounded-full border border-red-700 bg-red-500 shadow-[0_0_8px_rgba(248,113,113,0.8)]"
                        id="dot_t3_c"
                      />
                    </div>
                    <div className="node-row flex w-full justify-center gap-4">
                      <div
                        className="node passive-main flex h-12 w-16 items-center justify-center rounded-full border border-amber-500/60 bg-amber-900/15 px-2 text-center text-[10px] font-archival-mono text-amber-900"
                        id="t3_m1"
                      >
                        Main
                      </div>
                      <div
                        className="node passive-main flex h-12 w-16 items-center justify-center rounded-full border border-amber-500/60 bg-amber-900/15 px-2 text-center text-[10px] font-archival-mono text-amber-900"
                        id="t3_m2"
                      >
                        Main
                      </div>
                      <div
                        className="node passive-main flex h-12 w-16 items-center justify-center rounded-full border border-amber-500/60 bg-amber-900/15 px-2 text-center text-[10px] font-archival-mono text-amber-900"
                        id="t3_m3"
                      >
                        Main
                      </div>
                      <div
                        className="node passive-main flex h-12 w-16 items-center justify-center rounded-full border border-amber-500/60 bg-amber-900/15 px-2 text-center text-[10px] font-archival-mono text-amber-900"
                        id="t3_m4"
                      >
                        Main
                      </div>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="side-col flex w-40 flex-col items-center gap-4">
                    <div className="node-row flex w-full justify-center gap-3">
                      <div
                        className="node active-green flex h-12 w-[72px] items-center justify-center rounded-full border border-emerald-500/60 bg-emerald-900/15 px-2 text-center text-[10px] font-archival-mono text-emerald-800"
                        id="t3_b1_up2"
                      >
                        Active3
                        <br />
                        B1 UP2
                      </div>
                      <div
                        className="node active-green flex h-12 w-[72px] items-center justify-center rounded-full border border-emerald-500/60 bg-emerald-900/15 px-2 text-center text-[10px] font-archival-mono text-emerald-800"
                        id="t3_b2_up2"
                      >
                        Active3
                        <br />
                        B2 UP2
                      </div>
                    </div>
                    <div className="node-row flex w-full justify-center gap-3">
                      <div
                        className="node active-green flex h-12 w-[72px] items-center justify-center rounded-full border border-emerald-500/60 bg-emerald-900/15 px-2 text-center text-[10px] font-archival-mono text-emerald-800"
                        id="t3_b1_up1"
                      >
                        Active3
                        <br />
                        B1 UP1
                      </div>
                      <div
                        className="node active-green flex h-12 w-[72px] items-center justify-center rounded-full border border-emerald-500/60 bg-emerald-900/15 px-2 text-center text-[10px] font-archival-mono text-emerald-800"
                        id="t3_b2_up1"
                      >
                        Active3
                        <br />
                        B2 UP1
                      </div>
                    </div>
                    <div className="routing-row relative flex h-4 w-full items-center justify-center pt-1">
                      <div
                        className="red-dot relative z-20 h-3 w-3 rounded-full border border-red-700 bg-red-500 shadow-[0_0_8px_rgba(248,113,113,0.8)]"
                        id="dot_t3_r"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tier 2 */}
              <div
                className="tier relative flex justify-center rounded-2xl border border-dashed border-archival-ink/30 px-5 py-6"
                id="tier-2"
              >
                <div className="tier-label absolute left-5 top-4 text-[10px] font-archival-mono font-bold uppercase tracking-[0.2em] text-archival-ink/70">
                  Tier 2
                </div>
                <div className="tier-content flex w-full max-w-3xl justify-between">
                  {/* Left */}
                  <div className="side-col flex w-40 flex-col items-center gap-4">
                    <div className="node-row flex w-full justify-center gap-3">
                      <div
                        className="node active-blue flex h-12 w-[72px] items-center justify-center rounded-full border border-sky-500/50 bg-sky-900/15 px-2 text-center text-[10px] font-archival-mono text-sky-800"
                        id="t2_a2_up2"
                      >
                        Active2
                        <br />
                        A2 UP2
                      </div>
                      <div
                        className="node active-blue flex h-12 w-[72px] items-center justify-center rounded-full border border-sky-500/50 bg-sky-900/15 px-2 text-center text-[10px] font-archival-mono text-sky-800"
                        id="t2_a1_up2"
                      >
                        Active2
                        <br />
                        A1 UP2
                      </div>
                    </div>
                    <div className="node-row flex w-full justify-center gap-3">
                      <div
                        className="node active-blue flex h-12 w-[72px] items-center justify-center rounded-full border border-sky-500/50 bg-sky-900/15 px-2 text-center text-[10px] font-archival-mono text-sky-800"
                        id="t2_a2_up1"
                      >
                        Active2
                        <br />
                        A2 UP1
                      </div>
                      <div
                        className="node active-blue flex h-12 w-[72px] items-center justify-center rounded-full border border-sky-500/50 bg-sky-900/15 px-2 text-center text-[10px] font-archival-mono text-sky-800"
                        id="t2_a1_up1"
                      >
                        Active2
                        <br />
                        A1 UP1
                      </div>
                    </div>
                    <div className="routing-row relative flex h-4 w-full items-center justify-center pt-1">
                      <div
                        className="red-dot relative z-20 h-3 w-3 rounded-full border border-red-700 bg-red-500 shadow-[0_0_8px_rgba(248,113,113,0.8)]"
                        id="dot_t2_l"
                      />
                    </div>
                  </div>

                  {/* Center */}
                  <div className="center-col flex w-80 flex-col items-center gap-3">
                    <div className="node-row flex w-full justify-center gap-4">
                      <div
                        className="node passive-sub flex h-11 w-11 items-center justify-center rounded-full border border-amber-400/70 bg-amber-900/10 text-center text-[9px] font-archival-mono text-amber-900"
                        id="t2_top_s1"
                      >
                        Sub
                      </div>
                      <div
                        className="node passive-sub flex h-11 w-11 items-center justify-center rounded-full border border-amber-400/70 bg-amber-900/10 text-center text-[9px] font-archival-mono text-amber-900"
                        id="t2_top_s2"
                      >
                        Sub
                      </div>
                      <div
                        className="node passive-sub flex h-11 w-11 items-center justify-center rounded-full border border-amber-400/70 bg-amber-900/10 text-center text-[9px] font-archival-mono text-amber-900"
                        id="t2_top_s3"
                      >
                        Sub
                      </div>
                      <div
                        className="node passive-sub flex h-11 w-11 items-center justify-center rounded-full border border-amber-400/70 bg-amber-900/10 text-center text-[9px] font-archival-mono text-amber-900"
                        id="t2_top_s4"
                      >
                        Sub
                      </div>
                    </div>
                    <div className="h-2" />
                    <div className="node-row flex w-full justify-center gap-4">
                      <div
                        className="node passive-sub flex h-11 w-11 items-center justify-center rounded-full border border-amber-400/70 bg-amber-900/10 text-center text-[9px] font-archival-mono text-amber-900"
                        id="t2_bot_s1"
                      >
                        Sub
                      </div>
                      <div
                        className="node passive-sub flex h-11 w-11 items-center justify-center rounded-full border border-amber-400/70 bg-amber-900/10 text-center text-[9px] font-archival-mono text-amber-900"
                        id="t2_bot_s2"
                      >
                        Sub
                      </div>
                      <div
                        className="node passive-sub flex h-11 w-11 items-center justify-center rounded-full border border-amber-400/70 bg-amber-900/10 text-center text-[9px] font-archival-mono text-amber-900"
                        id="t2_bot_s3"
                      >
                        Sub
                      </div>
                      <div
                        className="node passive-sub flex h-11 w-11 items-center justify-center rounded-full border border-amber-400/70 bg-amber-900/10 text-center text-[9px] font-archival-mono text-amber-900"
                        id="t2_bot_s4"
                      >
                        Sub
                      </div>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="side-col flex w-40 flex-col items-center gap-4">
                    <div className="node-row flex w-full justify-center gap-3">
                      <div
                        className="node active-green flex h-12 w-[72px] items-center justify-center rounded-full border border-emerald-500/60 bg-emerald-900/15 px-2 text-center text-[10px] font-archival-mono text-emerald-800"
                        id="t2_b1_up2"
                      >
                        Active2
                        <br />
                        B1 UP2
                      </div>
                      <div
                        className="node active-green flex h-12 w-[72px] items-center justify-center rounded-full border border-emerald-500/60 bg-emerald-900/15 px-2 text-center text-[10px] font-archival-mono text-emerald-800"
                        id="t2_b2_up2"
                      >
                        Active2
                        <br />
                        B2 UP2
                      </div>
                    </div>
                    <div className="node-row flex w-full justify-center gap-3">
                      <div
                        className="node active-green flex h-12 w-[72px] items-center justify-center rounded-full border border-emerald-500/60 bg-emerald-900/15 px-2 text-center text-[10px] font-archival-mono text-emerald-800"
                        id="t2_b1_up1"
                      >
                        Active2
                        <br />
                        B1 UP1
                      </div>
                      <div
                        className="node active-green flex h-12 w-[72px] items-center justify-center rounded-full border border-emerald-500/60 bg-emerald-900/15 px-2 text-center text-[10px] font-archival-mono text-emerald-800"
                        id="t2_b2_up1"
                      >
                        Active2
                        <br />
                        B2 UP1
                      </div>
                    </div>
                    <div className="routing-row relative flex h-4 w-full items-center justify-center pt-1">
                      <div
                        className="red-dot relative z-20 h-3 w-3 rounded-full border border-red-700 bg-red-500 shadow-[0_0_8px_rgba(248,113,113,0.8)]"
                        id="dot_t2_r"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tier 1 */}
              <div
                className="tier relative flex justify-center rounded-2xl border border-dashed border-archival-ink/30 px-5 py-6"
                id="tier-1"
              >
                <div className="tier-label absolute left-5 top-4 text-[10px] font-archival-mono font-bold uppercase tracking-[0.2em] text-archival-ink/70">
                  Tier 1
                </div>
                <div className="tier-content flex w-full max-w-3xl justify-between">
                  {/* Left */}
                  <div className="side-col flex w-40 flex-col items-center gap-4">
                    <div className="node-row flex w-full justify-center gap-3">
                      <div
                        className="node active-blue flex h-12 w-[72px] items-center justify-center rounded-full border border-sky-500/50 bg-sky-900/15 px-2 text-center text-[10px] font-archival-mono text-sky-800"
                        id="t1_a2_up2"
                      >
                        Active1
                        <br />
                        A2 UP2
                      </div>
                      <div
                        className="node active-blue flex h-12 w-[72px] items-center justify-center rounded-full border border-sky-500/50 bg-sky-900/15 px-2 text-center text-[10px] font-archival-mono text-sky-800"
                        id="t1_a1_up2"
                      >
                        Active1
                        <br />
                        A1 UP2
                      </div>
                    </div>
                    <div className="node-row flex w-full justify-center gap-3">
                      <div
                        className="node active-blue flex h-12 w-[72px] items-center justify-center rounded-full border border-sky-500/50 bg-sky-900/15 px-2 text-center text-[10px] font-archival-mono text-sky-800"
                        id="t1_a2_up1"
                      >
                        Active1
                        <br />
                        A2 UP1
                      </div>
                      <div
                        className="node active-blue flex h-12 w-[72px] items-center justify-center rounded-full border border-sky-500/50 bg-sky-900/15 px-2 text-center text-[10px] font-archival-mono text-sky-800"
                        id="t1_a1_up1"
                      >
                        Active1
                        <br />
                        A1 UP1
                      </div>
                    </div>
                    <div className="routing-row relative flex h-4 w-full items-center justify-center pt-1">
                      <div
                        className="red-dot relative z-20 h-3 w-3 rounded-full border border-red-700 bg-red-500 shadow-[0_0_8px_rgba(248,113,113,0.8)]"
                        id="dot_t1_l"
                      />
                    </div>
                  </div>

                  {/* Center (Empty layout spacer) */}
                  <div className="center-col w-80" />

                  {/* Right */}
                  <div className="side-col flex w-40 flex-col items-center gap-4">
                    <div className="node-row flex w-full justify-center gap-3">
                      <div
                        className="node active-green flex h-12 w-[72px] items-center justify-center rounded-full border border-emerald-500/60 bg-emerald-900/15 px-2 text-center text-[10px] font-archival-mono text-emerald-800"
                        id="t1_b1_up2"
                      >
                        Active1
                        <br />
                        B1 UP2
                      </div>
                      <div
                        className="node active-green flex h-12 w-[72px] items-center justify-center rounded-full border border-emerald-500/60 bg-emerald-900/15 px-2 text-center text-[10px] font-archival-mono text-emerald-800"
                        id="t1_b2_up2"
                      >
                        Active1
                        <br />
                        B2 UP2
                      </div>
                    </div>
                    <div className="node-row flex w-full justify-center gap-3">
                      <div
                        className="node active-green flex h-12 w-[72px] items-center justify-center rounded-full border border-emerald-500/60 bg-emerald-900/15 px-2 text-center text-[10px] font-archival-mono text-emerald-800"
                        id="t1_b1_up1"
                      >
                        Active1
                        <br />
                        B1 UP1
                      </div>
                      <div
                        className="node active-green flex h-12 w-[72px] items-center justify-center rounded-full border border-emerald-500/60 bg-emerald-900/15 px-2 text-center text-[10px] font-archival-mono text-emerald-800"
                        id="t1_b2_up1"
                      >
                        Active1
                        <br />
                        B2 UP1
                      </div>
                    </div>
                    <div className="routing-row relative flex h-4 w-full items-center justify-center pt-1">
                      <div
                        className="red-dot relative z-20 h-3 w-3 rounded-full border border-red-700 bg-red-500 shadow-[0_0_8px_rgba(248,113,113,0.8)]"
                        id="dot_t1_r"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Start Node */}
              <div
                className="node start-node mx-auto mt-2 flex h-11 w-32 items-center justify-center rounded-full border border-archival-ink/50 bg-archival-bg-deep/90 text-center text-[11px] font-archival-mono font-semibold text-archival-ink shadow-sm"
                id="start_node"
              >
                Start
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeaponSkillStandardTree;

