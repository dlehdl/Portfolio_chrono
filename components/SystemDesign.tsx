import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { flushSync } from 'react-dom';
import { 
    Activity, Clock, TrendingDown, AlertTriangle, 
    Database, ArrowRight, XCircle, HeartPulse, 
    ShieldAlert, Skull, Ban, ArrowDown,
    Calculator, BarChart3, FileText, CheckCircle2,
    MonitorPlay, Zap, CornerDownRight, Play, Server, MousePointerClick, Layers, Syringe,
    Target, Workflow, Settings2, Crosshair
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { text } from '../content';

const sysUi = text.ui?.system ?? {};
const sysDoc = text.system?.doc ?? {};

// --- DOCUMENT DATA (Planning Doc Content) — 텍스트는 text.md system.doc ---
const DOC_DATA = {
    overview: {} as { gimmick?: string },
    rules: (sysDoc.rules as { title: string; desc: string }[]) ?? [],
    exceptions: ((sysDoc.exceptions as { label: string; desc: string }[]) ?? []).map((e, i) => {
        const icons = [<Syringe size={20} key="s" />, <ShieldAlert size={20} key="g" />, <Skull size={20} key="k" />, <Ban size={20} key="b" />];
        return { icon: icons[i], label: e.label, desc: e.desc };
    }),
    variables: (sysDoc.variables as { category: string; name: string; type: string; desc: string }[]) ?? [],
    scenarios: (sysDoc.scenarios as { type: string; title: string; action: string; desc: string }[]) ?? [],
};

// --- SMART TARGETING DOC DATA ---
const SMART_TARGETING_DATA = {
    overview: {
        purposes: [
            { desc: "락온 기능을 사용하지 않는 상태에서도 유저의 공격이 적을 타겟하도록 보조한다." },
            { desc: "타겟팅 과정이 유저의 조작이나 전투의 흐름을 방해하거나 끊어서는 안 된다." }
        ]
    },
    searchLogic: {
        camera: [
            { title: "기본 논리", desc: "유저의 시선(캐릭터 방향)을 유저의 의도로 간주한다." },
            { title: "탐색 범위", desc: "캐릭터 정면 벡터 기준 부채꼴 범위 내 대상을 1순위 후보군. 카메라 시야각 밖 적은 제외." },
            { title: "수직 고저차", desc: "대상과 고저차 발생 시, 카메라 상하 각도와 대상 물리적 위치가 일치할 때만 허용. 허용 범위: 상하 각 15도 이내." }
        ],
        dynamicRange: [
            { param: "Radius (반경)", melee: "스킬 사거리. 락온 최대 거리 초과 불가", ranged: "동일" },
            { param: "Angle (정면 벡터)", melee: "좌우 15도 (총 30도)", ranged: "좌우 30도 (총 60도)" },
            { param: "Pitch (카메라 높이)", melee: "15도", ranged: "카메라 각도·대상 위치 일치 시 (15도 오차 허용)" }
        ],
        scoring: [
            { factor: "Distance (거리)", desc: "캐릭터와 물리적 거리가 가까울수록 높은 점수." },
            { factor: "Angle (각도)", desc: "캐릭터 정면 벡터와 대상 각도가 0에 가까울수록(정면일수록) 높은 점수." },
            { weight: "근거리 스킬", desc: "Distance 가중치 > Angle 가중치 (가까운 놈 우선)" },
            { weight: "원거리 스킬", desc: "Angle 가중치 > Distance 가중치 (정확히 조준한 놈 우선)" }
        ],
        forwardException: {
            purpose: "뒤로 이동·화면 회전 중, 의도치 않게 등 뒤 적을 공격하여 180도 회전하는 부자연스러운 상황 방지.",
            logic: [
                { cond: "이동 입력 있음", base: "입력 방향 (Input Vector) 기준 판정" },
                { cond: "이동 입력 없음", base: "캐릭터 정면 (Actor Forward Vector) 기준 판정" }
            ]
        },
        obstacleCheck: "캐릭터와 적 사이에 벽·기둥 등 충돌체(Static Mesh)가 있으면 타겟 후보에서 즉시 제외."
    },
    stabilization: [
        { title: "타겟 확정", desc: "스킬 시전 입력 순간, 점수 계산으로 최고 점수 단일 대상을 타겟으로 확정." },
        { title: "타겟 유지 및 변경", desc: "스킬 연속 발동(콤보)·시전 시간 긴 스킬 사용 중. 현재 타겟이 탐색 범위 내면 더 높은 점수 적이 나와도 변경하지 않음. 타겟 사망·범위 이탈 시에만 재탐색.\n의도: 타겟 겹침 시 오락가락 방지 → 전투 연속성 보장." },
        { title: "시스템 해제", desc: "스킬 행동 완전 종료 또는 유저 캔슬 입력 시 타겟 정보 즉시 초기화." }
    ],
    cameraMagnetism: {
        function: "스마트 타겟팅으로 대상 결정·공격 시작 시, 카메라를 부드럽게 회전해 타겟을 화면 중앙 쪽으로 미세 보정.",
        intensity: "강한 락온처럼 고정이 아닌, 유저가 알아차리지 못할 정도의 부드러운 자석 효과.",
        condition: "유저가 마우스/스틱으로 카메라를 강하게 조작 중일 때는 보정 기능 일시 정지."
    },
    exceptions: [
        { type: "락온 중", desc: "이미 락온 걸어둔 상태면 스마트 타겟팅 로직을 수행하지 않고 무조건 락온 대상 공격." },
        { type: "지점 지정 스킬 (Area Picking)", desc: "바닥에 원을 그려 사용하는 장판형 스킬. 시스템 적용 제외." },
        { type: "논타겟 돌진기", desc: "방향 입력 그대로 돌진해야 하는 회피/이동 겸용 스킬. 적용 제외." },
        { type: "조준 모드", desc: "사용자가 직접 카메라로 정밀 조준하는 스킬. 적용 제외." }
    ]
};

// --- SUB COMPONENTS ---

const SpecHeader = ({ num, title, sub, icon, accent = 'red' }: { num: string, title: string, sub: string, icon: React.ReactNode; accent?: 'red' | 'cyan' | 'regain' }) => {
    const isCyan = accent === 'cyan';
    const isRegain = accent === 'regain';
    return (
    <div className={`flex items-start gap-4 mb-16 border-b pb-6 ${isRegain ? 'border-archival-ink/25' : isCyan ? 'border-cyan-900/30' : 'border-red-900/30'}`} style={isRegain ? { borderBottomWidth: '0.5px' } : undefined}>
        <div className={`p-2 rounded mt-1 ${isRegain ? 'bg-archival-ink/10 border border-archival-ink/25 text-archival-ink' : isCyan ? 'bg-cyan-950/30 border border-cyan-800/50 text-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'bg-red-950/30 border border-red-900/50 text-red-500 shadow-[0_0_15px_rgba(220,38,38,0.2)]'}`} style={isRegain ? { borderWidth: '0.5px' } : undefined}>
            {icon}
        </div>
        <div>
            <div className={`text-xs font-bold mb-1 ${isRegain ? 'font-archival-mono text-archival-ink/80' : isCyan ? 'font-mono text-cyan-500' : 'font-mono text-red-500'}`}>{num}</div>
            <h3 className={`text-xl font-bold ${isRegain ? 'font-archival-serif text-archival-ink' : 'font-serif text-stone-200'}`}>{title}</h3>
            <p className={`text-sm uppercase tracking-widest mt-1 ${isRegain ? 'font-archival-mono text-archival-ink/70' : 'font-sans text-stone-500'}`}>{sub}</p>
        </div>
    </div>
); };

const FlowBox = ({ label, type, sub }: { label: string, type: string, sub?: string }) => (
    <div className="flex flex-col items-center relative z-10 group w-full">
        <div className="w-36 py-3 bg-stone-900 border border-stone-700 rounded text-xs font-bold text-stone-300 shadow-lg group-hover:border-red-500 group-hover:text-white transition-all text-center">
            {label}
        </div>
        <span className="text-[9px] font-mono text-stone-600 uppercase tracking-wider bg-stone-950 px-2 -mt-2 z-20">{type}</span>
        {sub && <span className="absolute top-full mt-2 text-[9px] text-stone-500 w-full text-center leading-tight whitespace-nowrap">{sub}</span>}
    </div>
);

/** 의사결정 노드 (다이아몬드) — 스마트 타겟팅과 동일 비율 NODE_W/2+6 × NODE_H (56×34) */
const FlowDecision = ({ label }: { label: string }) => (
    <div className="flex flex-col items-center relative z-10 group">
        <div className="w-14 h-[34px] rotate-45 bg-stone-900 border border-amber-700/70 flex items-center justify-center shadow-lg group-hover:border-amber-500 transition-all">
            <span className="text-[9px] font-bold text-stone-300 -rotate-45 text-center leading-tight px-1">{label}</span>
        </div>
        <span className="text-[8px] font-mono text-amber-600/90 uppercase tracking-wider bg-stone-950 px-1.5 -mt-1.5 z-20">Decision</span>
    </div>
);

// --- SMART TARGETING FLOWCHART (smart-target-flow 인포그래픽 기반) ---
type FlowNodeType = 'START' | 'PROCESS' | 'DECISION' | 'TERMINATOR';

interface FlowNode {
    id: string; type: FlowNodeType; label: string; x: number; y: number; branch?: 'left' | 'right';
    description?: string; details?: string[];
}

interface FlowEdge { source: string; target: string; label?: string; dashed?: boolean; }

const CX = 160;
const GAP = 58;
const NODE_W = 100;
const NODE_H = 34;
const BRANCH_X = 78;
const DIAMOND_EXTRA = 6;
const SY = 36;
const EDGE_LABEL_OFFSET = 10;

const SMART_FLOW_NODES: FlowNode[] = [
    { id: 'start', type: 'START', label: '스킬 입력', x: CX, y: SY, description: '사용자가 스킬 버튼을 눌렀을 때 타겟팅 평가 프로세스가 시작됩니다.', details: ['타겟팅 평가 프로세스를 시작합니다.'] },
    { id: 'hard_lock', type: 'DECISION', label: '락온 중?', x: CX, y: SY + GAP, description: '사용자가 수동 락온한 상태인지 확인합니다.', details: ['우선순위: 최상', '활성화 시 스마트 타겟팅 로직을 건너뜁니다.'] },
    { id: 'attack_locked', type: 'TERMINATOR', label: '락온 타겟 공격', x: CX + BRANCH_X + 140, y: SY + GAP, branch: 'right', description: '락온된 타겟으로 스킬을 유도합니다.', details: ['스마트 타겟팅 미적용.'] },
    { id: 'non_target', type: 'DECISION', label: '장판/회피/조준 스킬?', x: CX, y: SY + GAP * 2, description: '장판/회피/조준 스킬인지 확인합니다.', details: ['장판 스킬 (지점 선택)', '회피 스킬 (이동/대시)', '조준 스킬 (수동 조준)'] },
    { id: 'use_input_dir', type: 'TERMINATOR', label: '입력/카메라 방향 공격', x: CX + BRANCH_X + 140, y: SY + GAP * 2, branch: 'right', description: '이동 입력 또는 카메라 방향 그대로 스킬이 시전됩니다.', details: ['스마트 타겟팅 미적용.'] },
    { id: 'input_check', type: 'DECISION', label: '이동 입력?', x: CX, y: SY + GAP * 3, description: '기준이 될 전방 벡터를 결정합니다.', details: ['이동 중: 입력 벡터 (180° 회전 방지)', '대기 중: 캐릭터 전방 벡터'] },
    { id: 'input_vec', type: 'PROCESS', label: '입력 방향', x: CX - BRANCH_X - 80, y: SY + GAP * 3, branch: 'left', description: '입력 방향(Input Vector)을 기준으로 판정합니다.', details: ['Forward Exception: 뒤로 이동 시 등 뒤 적 타겟 방지'] },
    { id: 'actor_vec', type: 'PROCESS', label: '캐릭터 방향', x: CX + BRANCH_X + 80, y: SY + GAP * 3, branch: 'right', description: '캐릭터 정면을 기준으로 판정합니다.', details: ['이동 입력 없을 때 적용'] },
    { id: 'search_area', type: 'PROCESS', label: '후보 탐색', x: CX, y: SY + GAP * 4, description: '유효 사거리 내 적을 스캔해 후보군을 생성합니다.', details: ['탐색 범위: 전방 부채꼴', '근거리 30° / 원거리 60°', '수직 15도 이내'] },
    { id: 'obstacle_check', type: 'PROCESS', label: '장애물 검사', x: CX, y: SY + GAP * 5, description: '레이캐스트로 시야(Line of Sight)를 검사합니다.', details: ['벽·정적 메시 시 타겟팅 차단', '가려진 타겟은 후보에서 제외'] },
    { id: 'filter_gate', type: 'DECISION', label: '유효성 검사', x: CX, y: SY + GAP * 6, description: 'Raycast·화면 밖·각도 차이로 유효성을 검사합니다.', details: ['통과 시 점수 산정으로 진행'] },
    { id: 'drop_candidate', type: 'TERMINATOR', label: '후보 제외', x: CX - BRANCH_X - 130, y: SY + GAP * 6, branch: 'left', description: '유효하지 않은 후보는 타겟 후보에서 제외됩니다.', details: ['Raycast 충돌, 화면 밖, 45도 이상 차이'] },
    { id: 'scoring', type: 'PROCESS', label: '점수 산정', x: CX, y: SY + GAP * 7, description: '거리·각도 가중치로 최적 타겟을 계산합니다.', details: ['근거리: 거리 우선', '원거리: 각도(중앙) 우선'] },
    { id: 'target_found', type: 'DECISION', label: '타겟 존재?', x: CX, y: SY + GAP * 8, description: '점수 산정 결과 유효 타겟이 있는지 판별합니다.', details: ['없으면 입력 방향 실행', '있으면 회전각 계산'] },
    { id: 'manual_action', type: 'TERMINATOR', label: '입력 방향 실행', x: CX - BRANCH_X - 80, y: SY + GAP * 8, branch: 'left', description: '타겟이 없을 때 입력 방향 그대로 실행합니다.', details: ['스마트 타겟팅 미적용.'] },
    { id: 'execute', type: 'TERMINATOR', label: '공격 실행', x: CX, y: SY + GAP * 9, description: '최종 타겟으로 공격을 실행합니다.', details: ['카메라 마그네티즘(부드러운 보정) 적용 가능'] },
    { id: 'reset_target', type: 'TERMINATOR', label: '타겟 즉시 초기화', x: CX, y: SY + GAP * 10, description: '스킬 종료 시 타겟 정보를 즉시 해제합니다.', details: ['연타 시 처음부터 재탐색'] },
];

const SMART_FLOW_EDGES: FlowEdge[] = [
    { source: 'start', target: 'hard_lock' },
    { source: 'hard_lock', target: 'attack_locked', label: '예' },
    { source: 'hard_lock', target: 'non_target', label: '아니오' },
    { source: 'non_target', target: 'use_input_dir', label: '예' },
    { source: 'non_target', target: 'input_check', label: '아니오' },
    { source: 'input_check', target: 'input_vec', label: '예' },
    { source: 'input_check', target: 'actor_vec', label: '아니오' },
    { source: 'input_vec', target: 'search_area' },
    { source: 'actor_vec', target: 'search_area' },
    { source: 'search_area', target: 'obstacle_check' },
    { source: 'obstacle_check', target: 'filter_gate' },
    { source: 'filter_gate', target: 'drop_candidate', label: 'Raycast/화면 밖' },
    { source: 'filter_gate', target: 'scoring', label: '통과' },
    { source: 'scoring', target: 'target_found' },
    { source: 'target_found', target: 'manual_action', label: '아니오' },
    { source: 'target_found', target: 'execute', label: '예' },
    { source: 'execute', target: 'reset_target' },
];

// --- REGAIN FLOW (동일 좌표/스타일 상수 재사용) ---
const REGAIN_CX = 160;
const REGAIN_SY = 36;
const REGAIN_GAP = 58;
const REGAIN_BRANCH_X = 78;

const REGAIN_BRANCH_OFFSET = 210;
const REGAIN_HEAL_SUB_OFFSET = 105;

const REGAIN_FLOW_NODES: FlowNode[] = [
    { id: 'hit', type: 'START', label: '피격 발생', x: REGAIN_CX, y: REGAIN_SY, description: '대미지 판정이 이루어지고 피격 이벤트가 발생한 시점입니다.' },
    { id: 'guard_break', type: 'DECISION', label: '가드 브레이크?', x: REGAIN_CX, y: REGAIN_SY + REGAIN_GAP, description: '가드 브레이크 상태인지 판별합니다.'},
    { id: 'gauge_clear', type: 'TERMINATOR', label: '리게인 게이지 소멸', x: REGAIN_CX + REGAIN_BRANCH_X + 100, y: REGAIN_SY + REGAIN_GAP, branch: 'right', description: '가드 브레이크 시 잔여 리게인 게이지를 즉시 제거합니다.' },
    { id: 'hp_zero', type: 'DECISION', label: '체력 0%?', x: REGAIN_CX, y: REGAIN_SY + REGAIN_GAP * 2, description: '현재 체력이 0 이하인지 판별합니다.', details: ['Yes: 사망 처리', 'No: 게이지 누적 진행'] },
    { id: 'death', type: 'TERMINATOR', label: '사망', x: REGAIN_CX + REGAIN_BRANCH_X + 100, y: REGAIN_SY + REGAIN_GAP * 2, branch: 'right', description: '체력 0 시 사망 처리됩니다. 리게인은 생존을 보장하지 않습니다.' },
    { id: 'accumulate', type: 'PROCESS', label: '리게인 게이지 누적', x: REGAIN_CX, y: REGAIN_SY + REGAIN_GAP * 3, description: '피격 대미지를 리게인 게이지로 전환합니다.', details: ['반복 피격 시 게이지 수치 합산', 'Cap: MaxHP - CurrentHP','리게인 전환 비율(RegainRatio) 적용' ] },
    { id: 'wait', type: 'PROCESS', label: '전투 대기', x: REGAIN_CX, y: REGAIN_SY + REGAIN_GAP * 4, description: '다음 행동을 대기하는 상태입니다.'},
    { id: 'branch_attack', type: 'TERMINATOR', label: '공격 성공', x: REGAIN_CX - REGAIN_BRANCH_OFFSET, y: REGAIN_SY + REGAIN_GAP * 5, description: '리게인 게이지를 보유한 상태에서 공격 이벤트를 판정합니다.' },
    { id: 'branch_heal', type: 'PROCESS', label: '생명력 회복 발생', x: REGAIN_CX, y: REGAIN_SY + REGAIN_GAP * 5, description: '물약/스킬/파티 회복 시 게이지 소멸·전환·보존 중 하나로 처리됩니다.'},
    { id: 'branch_idle', type: 'TERMINATOR', label: '아무 행동 없음', x: REGAIN_CX + REGAIN_BRANCH_OFFSET, y: REGAIN_SY + REGAIN_GAP * 5, description: '공격/피격 등의 이벤트가 발생하지 않는 상태입니다.' },
    { id: 'heal_potion', type: 'TERMINATOR', label: '물약', x: REGAIN_CX - REGAIN_HEAL_SUB_OFFSET, y: REGAIN_SY + REGAIN_GAP * 6, description: '물약/아이템 회복 여부를 판별합니다.'},
    { id: 'heal_skill', type: 'PROCESS', label: '자가 스킬', x: REGAIN_CX, y: REGAIN_SY + REGAIN_GAP * 6, description: '즉시 회복되는 자가 스킬 사용 여부를 판별합니다.'},
    { id: 'heal_party', type: 'PROCESS', label: '파티 / 도트', x: REGAIN_CX + REGAIN_HEAL_SUB_OFFSET, y: REGAIN_SY + REGAIN_GAP * 6, description: '파티 힐/도트 회복 여부를 판별합니다.' },
    { id: 'gauge_restore', type: 'TERMINATOR', label: '게이지 복구', x: REGAIN_CX - REGAIN_BRANCH_OFFSET, y: REGAIN_SY + REGAIN_GAP * 6, description: '공격 적중 시 가해 대미지에 비례하여 리게인 게이지를 체력으로 복구합니다.', details: ['스탯으로 복구 비율 증감 가능', '체력 회복'] },
    { id: 'gauge_clear_heal', type: 'TERMINATOR', label: '게이지 소멸', x: REGAIN_CX - REGAIN_HEAL_SUB_OFFSET, y: REGAIN_SY + REGAIN_GAP * 7, description: '리게인 게이지가 즉시 소멸합니다.', details: ['Clear 후 회복'] },
    { id: 'gauge_convert', type: 'PROCESS', label: '게이지 전환', x: REGAIN_CX, y: REGAIN_SY + REGAIN_GAP * 7, description: '리게인 게이지를 소모하여 체력을 회복합니다.', details: ['회복량만큼 게이지 소모'] },
    { id: 'gauge_preserve', type: 'PROCESS', label: '게이지 보존', x: REGAIN_CX + REGAIN_HEAL_SUB_OFFSET, y: REGAIN_SY + REGAIN_GAP * 7, description: '리게인 게이지는 유지되고 체력만 회복됩니다.', details: ['MaxHP 초과 시 초과분만 게이지 삭감'] },
    { id: 'gauge_decay', type: 'TERMINATOR', label: '게이지 감소', x: REGAIN_CX + REGAIN_BRANCH_OFFSET, y: REGAIN_SY + REGAIN_GAP * 6, description: '일정 시간 경과 시 리게인 게이지가 자연 감소(Decay)합니다.', details: ['WaitTime 경과 후 DecayRate', '틱 간격 적용'] },
];

const REGAIN_FLOW_EDGES: FlowEdge[] = [
    { source: 'hit', target: 'guard_break' },
    { source: 'guard_break', target: 'gauge_clear', label: 'Yes' },
    { source: 'guard_break', target: 'hp_zero', label: 'No' },
    { source: 'hp_zero', target: 'death', label: 'Yes' },
    { source: 'hp_zero', target: 'accumulate', label: 'No' },
    { source: 'accumulate', target: 'wait' },
    { source: 'wait', target: 'branch_attack' },
    { source: 'wait', target: 'branch_heal' },
    { source: 'wait', target: 'branch_idle' },
    { source: 'branch_heal', target: 'heal_potion' },
    { source: 'branch_heal', target: 'heal_skill' },
    { source: 'branch_heal', target: 'heal_party' },
    { source: 'branch_attack', target: 'gauge_restore' },
    { source: 'heal_potion', target: 'gauge_clear_heal' },
    { source: 'heal_skill', target: 'gauge_convert' },
    { source: 'heal_party', target: 'gauge_preserve' },
    { source: 'branch_idle', target: 'gauge_decay' },
];

const FlowDetailSidebar = ({ nodeId, onClose, theme = 'dark' }: { nodeId: string; onClose: () => void; theme?: 'dark' | 'light' }) => {
    const node = React.useMemo(() => SMART_FLOW_NODES.find((n) => n.id === nodeId) ?? null, [nodeId]);
    if (!node) return null;
    const isLight = theme === 'light';
    const getIcon = () => {
        switch (node.type) {
            case 'START': return <MousePointerClick size={20} />;
            case 'PROCESS': return <Target size={20} />;
            case 'DECISION': return <Crosshair size={20} />;
            case 'TERMINATOR': return <Activity size={20} />;
            default: return <Target size={20} />;
        }
    };
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex flex-col w-full min-w-0 max-w-full border rounded-lg overflow-hidden ${isLight ? 'border-archival-ink/25 bg-white/95' : 'border-stone-800 bg-stone-950/95'}`}
            style={isLight ? { borderWidth: '0.5px' } : undefined}
        >
            <div className={`p-4 border-b flex justify-between items-center ${isLight ? 'border-archival-ink/15 bg-archival-ink/5' : 'border-stone-800 bg-stone-900/80'}`} style={isLight ? { borderBottomWidth: '0.5px' } : undefined}>
                <div className="flex items-center gap-2">
                    <div className={`p-2 rounded border ${isLight ? 'border-archival-ink/25 bg-archival-ink/10 text-archival-ink' : 'border-cyan-800/50 bg-cyan-950/30 text-cyan-400'}`} style={isLight ? { borderWidth: '0.5px' } : undefined}>{getIcon()}</div>
                    <span className={`text-[10px] uppercase tracking-wider ${isLight ? 'font-archival-mono text-archival-ink/80' : 'font-mono text-cyan-500'}`}>{node.type}</span>
                </div>
                <button type="button" onClick={onClose} className={`p-1.5 rounded transition-colors ${isLight ? 'text-archival-ink/70 hover:text-archival-ink hover:bg-archival-ink/10' : 'text-stone-500 hover:text-stone-300 hover:bg-stone-800'}`} aria-label="닫기">
                    <XCircle size={18} />
                </button>
            </div>
            <div className="p-5 flex-1 overflow-y-auto text-left w-full box-border">
                <h3 className={`text-base font-bold mb-3 tracking-tight break-words ${isLight ? 'font-archival-serif text-archival-ink' : 'text-stone-200'}`}>{node.label}</h3>
                {node.description && <p className={`text-sm leading-relaxed mb-5 ${isLight ? 'text-archival-ink-deep/90' : 'text-stone-400'}`}>{node.description}</p>}
                {node.details && node.details.length > 0 && (
                    <div className="space-y-2">
                        <h4 className={`text-[10px] font-bold uppercase tracking-widest border-b pb-2 mb-3 ${isLight ? 'font-archival-mono text-archival-ink/80 border-archival-ink/15' : 'text-stone-500 border-stone-800'}`} style={isLight ? { borderBottomWidth: '0.5px' } : undefined}>시스템 로직 상세</h4>
                        <ul className="space-y-2">
                            {node.details.map((d, i) => (
                                <li key={i} className={`flex gap-2 text-xs ${isLight ? 'text-archival-ink-deep/90 font-archival-mono' : 'text-stone-500'}`}>
                                    <span className={`w-1.5 h-1.5 mt-1.5 rounded-full shrink-0 ${isLight ? 'bg-archival-ink/50' : 'bg-cyan-600/70'}`} />
                                    <span>{d}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

const SmartFlowNodeShape = ({ node, selected, theme = 'dark' }: { node: FlowNode; selected: boolean; theme?: 'dark' | 'light' }) => {
    const isLight = theme === 'light';
    const stroke = isLight ? (selected ? '#2A2A2A' : 'rgba(42,42,42,0.45)') : (selected ? '#22d3ee' : '#44403c');
    const fill = isLight ? 'rgba(232,228,217,0.98)' : 'rgba(12,10,9,0.98)';
    const w = NODE_W; const h = NODE_H;
    const rx = 6;
    const strokeW = isLight ? 0.8 : 1.2;
    if (node.type === 'START' || node.type === 'TERMINATOR') {
        return <rect x={-w/2} y={-h/2} width={w} height={h} rx={rx} fill={fill} stroke={stroke} strokeWidth={strokeW} />;
    }
    if (node.type === 'DECISION') {
        const d = `M 0 ${-h/2} L ${w/2 + DIAMOND_EXTRA} 0 L 0 ${h/2} L ${-w/2 - DIAMOND_EXTRA} 0 Z`;
        return <path d={d} fill={fill} stroke={stroke} strokeWidth={strokeW} />;
    }
    return <rect x={-w/2} y={-h/2} width={w} height={h} rx={rx} fill={fill} stroke={stroke} strokeWidth={strokeW} />;
};

const SmartTargetingFlowchart = ({ theme = 'light' }: { theme?: 'dark' | 'light' }) => {
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const isLight = theme === 'light';
    const selectedNode = selectedNodeId != null ? SMART_FLOW_NODES.find((n) => n.id === selectedNodeId) ?? null : null;
    const nodesById = React.useMemo(() => Object.fromEntries(SMART_FLOW_NODES.map(n => [n.id, n])), []);

    const getEdgePath = (edge: FlowEdge) => {
        const s = nodesById[edge.source], t = nodesById[edge.target];
        if (!s || !t) return '';
        const dw = s.type === 'DECISION' ? NODE_W/2 + DIAMOND_EXTRA : NODE_W/2;
        let sx = s.x, sy = s.y, ex = t.x, ey = t.y;
        if (t.branch === 'right' && s.x <= t.x) {
            sx = s.x + dw; sy = s.y; ex = t.x - NODE_W/2; ey = t.y;
        } else if (t.branch === 'left' && s.x >= t.x) {
            sx = s.x - dw; sy = s.y; ex = t.x + NODE_W/2; ey = t.y;
        } else if (s.branch) {
            sx = s.x; sy = s.y + NODE_H/2; ex = t.x; ey = t.y - NODE_H/2;
        } else {
            sx = s.x; sy = s.y + NODE_H/2; ex = t.x; ey = t.y - NODE_H/2;
        }
        const dx = Math.abs(ex - sx);
        const ELBOW_THRESHOLD = 35;
        if (dx > ELBOW_THRESHOLD) {
            const midY = (sy + ey) / 2;
            return `M ${sx} ${sy} L ${sx} ${midY} L ${ex} ${midY} L ${ex} ${ey}`;
        }
        return `M ${sx} ${sy} L ${ex} ${ey}`;
    };

    const vbMinX = -120;
    const vbW = 435;
    const vbH = SY + GAP * 10 + 50;

    const edgeStroke = isLight ? 'rgba(42,42,42,0.4)' : '#44403c';
    const labelFill = isLight ? 'rgba(42,42,42,0.65)' : '#78716c';
    const nodeTextFill = isLight ? '#2A2A2A' : '#e7e5e4';

    return (
        <div className={`p-4 sm:p-6 rounded-lg border ${isLight ? 'bg-white/40 border-archival-ink/20' : 'bg-stone-900/30 border-stone-800'}`} style={isLight ? { borderWidth: '0.5px' } : undefined}>
            <h4 className={`text-sm font-bold uppercase tracking-widest mb-4 md:mb-6 border-l pl-4 ${isLight ? 'font-archival-mono text-archival-ink/90 border-archival-ink/30' : 'text-stone-300 border-cyan-800'}`} style={isLight ? { borderLeftWidth: '0.5px' } : undefined}>1.1 시스템 플로우 개요</h4>
            <div className="flex flex-col lg:flex-row gap-3 items-stretch">
                <div className="flex-[1.6] min-w-0 shrink-0 lg:max-w-[60%] w-full max-h-[800px] flex items-center justify-center pl-2 overflow-visible">
                    <svg
                        className="w-full h-auto max-h-[800px] block"
                        viewBox={`${vbMinX} 0 ${vbW - vbMinX} ${vbH}`}
                        preserveAspectRatio="xMidYMid meet"
                    >
                    <defs>
                        <marker id="arrow-flow-smart" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
                            <polygon points="0 0, 6 2.5, 0 5" fill={edgeStroke} />
                        </marker>
                    </defs>
                    {/* Edges */}
                    {SMART_FLOW_EDGES.map((edge, i) => {
                        return (
                        <g key={i} style={{ pointerEvents: 'none' }}>
                            <path d={getEdgePath(edge)} fill="none" stroke={edgeStroke} strokeWidth={isLight ? 0.8 : 1.2} markerEnd="url(#arrow-flow-smart)" strokeDasharray={edge.dashed ? '3 3' : undefined} />
                            {edge.label && (() => {
                                const s = nodesById[edge.source], t = nodesById[edge.target];
                                if (!s || !t) return null;
                                const mx = (s.x + t.x) / 2, my = (s.y + t.y) / 2;
                                const isVertical = Math.abs(s.x - t.x) < 20;
                                if (isVertical) {
                                    return (
                                        <text x={mx + 20} y={my} textAnchor="start" fill={labelFill} fontSize="8" fontWeight="600" className="font-sans">
                                            {edge.label}
                                        </text>
                                    );
                                }
                                if (t.branch === 'left') {
                                    const labelX = t.x + NODE_W / 2 + 14;
                                    return (
                                        <text x={labelX} y={my - EDGE_LABEL_OFFSET} textAnchor="start" fill={labelFill} fontSize="8" fontWeight="600" className="font-sans">
                                            {edge.label}
                                        </text>
                                    );
                                }
                                return (
                                    <text x={mx} y={my - EDGE_LABEL_OFFSET} textAnchor="middle" fill={labelFill} fontSize="8" fontWeight="600" className="font-sans">
                                        {edge.label}
                                    </text>
                                );
                            })()}
                        </g>
                    );})}
                    {SMART_FLOW_NODES.map(node => (
                        <g
                            key={node.id}
                            transform={`translate(${node.x}, ${node.y})`}
                            className="cursor-pointer"
                            style={{ pointerEvents: 'all' }}
                            onClick={(e) => {
                                e.stopPropagation();
                                const id = node.id;
                                flushSync(() => setSelectedNodeId((prev) => (prev === id ? null : id)));
                            }}
                        >
                            {/* 넓은 히트 영역으로 클릭 인식 보장 */}
                            {node.type === 'DECISION' ? (
                                <path d={`M 0 ${-NODE_H/2} L ${NODE_W/2 + DIAMOND_EXTRA} 0 L 0 ${NODE_H/2} L ${-NODE_W/2 - DIAMOND_EXTRA} 0 Z`} fill="transparent" stroke="none" style={{ pointerEvents: 'all' }} />
                            ) : (
                                <rect x={-NODE_W/2 - 4} y={-NODE_H/2 - 4} width={NODE_W + 8} height={NODE_H + 8} fill="transparent" stroke="none" style={{ pointerEvents: 'all' }} />
                            )}
                            <SmartFlowNodeShape node={node} selected={selectedNodeId === node.id} theme={theme} />
                            <text x={0} y={2} textAnchor="middle" fill={nodeTextFill} fontSize="8" fontWeight="600" className="font-sans pointer-events-none select-none">
                                {node.label}
                            </text>
                        </g>
                    ))}
                </svg>
                </div>
                <div className="flex-[1] min-w-[280px] lg:min-w-[420px] w-full basis-0 flex flex-col min-h-[220px]">
                    <div className="relative w-full flex-1 min-h-[220px]">
                        <AnimatePresence mode="sync">
                            {selectedNodeId != null ? (
                                <motion.div
                                    key={selectedNodeId}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute inset-0 flex flex-col"
                                >
                                    <FlowDetailSidebar nodeId={selectedNodeId} onClose={() => setSelectedNodeId(null)} theme={theme} />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className={`absolute inset-0 flex items-center justify-center rounded-lg border border-dashed text-xs ${isLight ? 'border-archival-ink/25 bg-archival-ink/5 text-archival-ink/70 font-archival-mono' : 'border-stone-700 bg-stone-950/50 text-stone-500 font-mono'}`}
                                    style={isLight ? { borderWidth: '0.5px' } : undefined}
                                >
                                    노드를 클릭하면 상세 로직이 표시됩니다.
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
            <p className={`text-[9px] mt-3 ${isLight ? 'font-archival-mono text-archival-ink/70' : 'font-mono text-stone-500'}`}>노드를 클릭하면 상세 로직이 표시됩니다.</p>
        </div>
    );
};

// --- REGAIN FLOWCHART (1.1 로직 흐름도 — 기록물 컨셉 반영) ---
const RegainFlowNodeShape = ({ node, selected, theme = 'dark' }: { node: FlowNode; selected: boolean; theme?: 'dark' | 'light' }) => {
    const isLight = theme === 'light';
    const stroke = isLight ? (selected ? '#2A2A2A' : 'rgba(42,42,42,0.45)') : (selected ? '#dc2626' : '#44403c');
    const fill = isLight ? 'rgba(232,228,217,0.98)' : 'rgba(12,10,9,0.98)';
    const w = NODE_W; const h = NODE_H;
    const rx = 6;
    const strokeW = isLight ? 0.8 : 1.2;
    if (node.type === 'START' || node.type === 'TERMINATOR') {
        return <rect x={-w/2} y={-h/2} width={w} height={h} rx={rx} fill={fill} stroke={stroke} strokeWidth={strokeW} />;
    }
    if (node.type === 'DECISION') {
        const d = `M 0 ${-h/2} L ${w/2 + DIAMOND_EXTRA} 0 L 0 ${h/2} L ${-w/2 - DIAMOND_EXTRA} 0 Z`;
        return <path d={d} fill={fill} stroke={stroke} strokeWidth={strokeW} />;
    }
    return <rect x={-w/2} y={-h/2} width={w} height={h} rx={rx} fill={fill} stroke={stroke} strokeWidth={strokeW} />;
};

const RegainFlowDetailSidebar = ({ nodeId, onClose, theme = 'dark' }: { nodeId: string; onClose: () => void; theme?: 'dark' | 'light' }) => {
    const node = React.useMemo(() => REGAIN_FLOW_NODES.find((n) => n.id === nodeId) ?? null, [nodeId]);
    if (!node) return null;
    const isLight = theme === 'light';
    const getIcon = () => {
        switch (node.type) {
            case 'START': return <Zap size={20} />;
            case 'PROCESS': return <Activity size={20} />;
            case 'DECISION': return <Crosshair size={20} />;
            case 'TERMINATOR': return <Activity size={20} />;
            default: return <Target size={20} />;
        }
    };
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex flex-col w-full min-w-0 max-w-full rounded-lg overflow-hidden ${isLight ? 'border border-archival-ink/25 bg-white/95' : 'border border-stone-800 bg-stone-950/95'}`}
            style={isLight ? { borderWidth: '0.5px' } : undefined}
        >
            <div className={`p-4 border-b flex justify-between items-center ${isLight ? 'border-archival-ink/15 bg-archival-ink/5' : 'border-stone-800 bg-stone-900/80'}`} style={isLight ? { borderBottomWidth: '0.5px' } : undefined}>
                <div className="flex items-center gap-2">
                    <div className={`p-2 rounded border ${isLight ? 'border-archival-ink/25 bg-archival-ink/10 text-archival-ink' : 'border-red-800/50 bg-red-950/30 text-red-400'}`} style={isLight ? { borderWidth: '0.5px' } : undefined}>{getIcon()}</div>
                    <span className={`text-[10px] uppercase tracking-wider ${isLight ? 'font-archival-mono text-archival-ink/80' : 'font-mono text-red-500'}`}>{node.type}</span>
                </div>
                <button type="button" onClick={onClose} className={`p-1.5 rounded transition-colors ${isLight ? 'text-archival-ink/70 hover:text-archival-ink hover:bg-archival-ink/10' : 'text-stone-500 hover:text-stone-300 hover:bg-stone-800'}`} aria-label="닫기">
                    <XCircle size={18} />
                </button>
            </div>
            <div className="p-5 flex-1 overflow-y-auto text-left w-full box-border">
                <h3 className={`text-base font-bold mb-3 tracking-tight break-words ${isLight ? 'font-archival-serif text-archival-ink' : 'text-stone-200'}`}>{node.label}</h3>
                {node.description && <p className={`text-sm leading-relaxed mb-5 ${isLight ? 'text-archival-ink-deep/90' : 'text-stone-400'}`}>{node.description}</p>}
                {node.details && node.details.length > 0 && (
                    <div className="space-y-2">
                        <h4 className={`text-[10px] font-bold uppercase tracking-widest border-b pb-2 mb-3 ${isLight ? 'font-archival-mono text-archival-ink/80 border-archival-ink/15' : 'text-stone-500 border-stone-800'}`} style={isLight ? { borderBottomWidth: '0.5px' } : undefined}>시스템 로직 상세</h4>
                        <ul className="space-y-2">
                            {node.details.map((d, i) => (
                                <li key={i} className={`flex gap-2 text-xs ${isLight ? 'text-archival-ink-deep/90 font-archival-mono' : 'text-stone-500'}`}>
                                    <span className={`w-1.5 h-1.5 mt-1.5 rounded-full shrink-0 ${isLight ? 'bg-archival-ink/50' : 'bg-red-600/70'}`} />
                                    <span>{d}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

const RegainFlowchart = ({ theme = 'dark' }: { theme?: 'dark' | 'light' }) => {
    const isLight = theme === 'light';
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const nodesById = React.useMemo(() => Object.fromEntries(REGAIN_FLOW_NODES.map(n => [n.id, n])), []);

    const getEdgePath = (edge: FlowEdge) => {
        const s = nodesById[edge.source], t = nodesById[edge.target];
        if (!s || !t) return '';
        const dw = s.type === 'DECISION' ? NODE_W/2 + DIAMOND_EXTRA : NODE_W/2;
        let sx = s.x, sy = s.y, ex = t.x, ey = t.y;
        if (t.branch === 'right' && s.x <= t.x) {
            sx = s.x + dw; sy = s.y; ex = t.x - NODE_W/2; ey = t.y;
        } else if (t.branch === 'left' && s.x >= t.x) {
            sx = s.x - dw; sy = s.y; ex = t.x + NODE_W/2; ey = t.y;
        } else {
            sx = s.x; sy = s.y + NODE_H/2; ex = t.x; ey = t.y - NODE_H/2;
        }
        const dx = Math.abs(ex - sx);
        const ELBOW_THRESHOLD = 35;
        if (dx > ELBOW_THRESHOLD) {
            const midY = (sy + ey) / 2;
            return `M ${sx} ${sy} L ${sx} ${midY} L ${ex} ${midY} L ${ex} ${ey}`;
        }
        return `M ${sx} ${sy} L ${ex} ${ey}`;
    };

    const vbMinX = -100;
    const vbW = 530;
    const vbH = REGAIN_SY + REGAIN_GAP * 8 + 50;

    const edgeStroke = isLight ? 'rgba(42,42,42,0.4)' : '#44403c';
    const edgeLabelFill = isLight ? 'rgba(42,42,42,0.65)' : '#78716c';
    const nodeTextFill = isLight ? '#2A2A2A' : '#e7e5e4';
    const markerId = isLight ? 'arrow-flow-regain-light' : 'arrow-flow-regain';

    return (
        <div className="flex flex-col lg:flex-row gap-1 items-stretch">
            <div className="flex-[1.6] min-w-0 shrink-0 lg:max-w-[60%] w-full max-h-[600px] flex items-center justify-center pl-2 ml-2 overflow-visible">
                <svg
                    className="w-full h-auto max-h-[600px] block"
                    viewBox={`${vbMinX} 0 ${vbW - vbMinX} ${vbH}`}
                    preserveAspectRatio="xMidYMid meet"
                >
                    <defs>
                        <marker id={markerId} markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
                            <polygon points="0 0, 6 2.5, 0 5" fill={edgeStroke} />
                        </marker>
                    </defs>
                    {REGAIN_FLOW_EDGES.map((edge, i) => (
                        <g key={i} style={{ pointerEvents: 'none' }}>
                            <path d={getEdgePath(edge)} fill="none" stroke={edgeStroke} strokeWidth={isLight ? 0.8 : 1.2} markerEnd={`url(#${markerId})`} strokeDasharray={edge.dashed ? '3 3' : undefined} />
                            {edge.label && (() => {
                                const s = nodesById[edge.source], t = nodesById[edge.target];
                                if (!s || !t) return null;
                                const mx = (s.x + t.x) / 2, my = (s.y + t.y) / 2;
                                const isVertical = Math.abs(s.x - t.x) < 20;
                                if (isVertical) {
                                    return (
                                        <text x={mx + 20} y={my} textAnchor="start" fill={edgeLabelFill} fontSize="8" fontWeight="600" className="font-sans">
                                            {edge.label}
                                        </text>
                                    );
                                }
                                if (t.branch === 'left') {
                                    const labelX = t.x + NODE_W / 2 + 14;
                                    return (
                                        <text x={labelX} y={my - EDGE_LABEL_OFFSET} textAnchor="start" fill={edgeLabelFill} fontSize="8" fontWeight="600" className="font-sans">
                                            {edge.label}
                                        </text>
                                    );
                                }
                                return (
                                    <text x={mx} y={my - EDGE_LABEL_OFFSET} textAnchor="middle" fill={edgeLabelFill} fontSize="8" fontWeight="600" className="font-sans">
                                        {edge.label}
                                    </text>
                                );
                            })()}
                        </g>
                    ))}
                    {REGAIN_FLOW_NODES.map(node => (
                        <g
                            key={node.id}
                            transform={`translate(${node.x}, ${node.y})`}
                            className="cursor-pointer"
                            style={{ pointerEvents: 'all' }}
                            onClick={(e) => {
                                e.stopPropagation();
                                flushSync(() => setSelectedNodeId((prev) => (prev === node.id ? null : node.id)));
                            }}
                        >
                            {node.type === 'DECISION' ? (
                                <path d={`M 0 ${-NODE_H/2} L ${NODE_W/2 + DIAMOND_EXTRA} 0 L 0 ${NODE_H/2} L ${-NODE_W/2 - DIAMOND_EXTRA} 0 Z`} fill="transparent" stroke="none" style={{ pointerEvents: 'all' }} />
                            ) : (
                                <rect x={-NODE_W/2 - 4} y={-NODE_H/2 - 4} width={NODE_W + 8} height={NODE_H + 8} fill="transparent" stroke="none" style={{ pointerEvents: 'all' }} />
                            )}
                            <RegainFlowNodeShape node={node} selected={selectedNodeId === node.id} theme={theme} />
                            <text x={0} y={2} textAnchor="middle" fill={nodeTextFill} fontSize="8" fontWeight="600" className="font-sans pointer-events-none select-none">
                                {node.label}
                            </text>
                        </g>
                    ))}
                </svg>
            </div>
            <div className="flex-[1] min-w-[280px] lg:min-w-[420px] w-full basis-0 flex flex-col min-h-[220px]">
                <div className="relative w-full flex-1 min-h-[220px]">
                    <AnimatePresence mode="sync">
                        {selectedNodeId != null ? (
                            <motion.div
                                key={selectedNodeId}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="absolute inset-0 flex flex-col"
                            >
                                <RegainFlowDetailSidebar nodeId={selectedNodeId} onClose={() => setSelectedNodeId(null)} theme={theme} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className={`absolute inset-0 flex items-center justify-center rounded-lg border border-dashed text-xs ${isLight ? 'border-archival-ink/25 bg-archival-ink/5 text-archival-ink/70 font-archival-mono' : 'border-stone-700 bg-stone-950/50 text-stone-500 font-mono'}`}
                                style={isLight ? { borderWidth: '0.5px' } : undefined}
                            >
                                노드를 클릭하면 상세 로직이 표시됩니다.
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

// --- DATA PIPELINE (1:N Node Editor — Statuseffect → Regain + instantPassive → Passive) ---
type PipelineNode = {
    id: string;
    title: string;
    subtitle: string | null;
    isRegain: boolean;
    borderClass: string;
    headClass: string;
    outputs?: number;
    attributes: { name: string; value: string; isRegain: boolean; valueHighlight?: 'red' | 'amber' }[];
};

const PIPELINE_NODES: PipelineNode[] = [
    {
        id: 'statuseffect',
        title: 'Statuseffect',
        subtitle: null,
        isRegain: false,
        borderClass: 'border-purple-800/60',
        headClass: 'text-stone-400',
        outputs: 2,
        attributes: [
            { name: 'DataId', value: 'int', isRegain: false },
            { name: 'GroupId', value: 'int', isRegain: false },
            { name: 'Duration', value: 'float', isRegain: false },
            { name: 'StatuseffectType', value: 'enum', isRegain: false },
            { name: 'StackingType', value: 'enum', isRegain: false },
            { name: 'StatuseffectFunctionId_1', value: 'ref', isRegain: false },
            { name: 'StatuseffectFunctionId_2', value: 'ref', isRegain: false }
        ]
    },
    {
        id: 'regain',
        title: 'StatuseffectFunction_1',
        subtitle: null,
        isRegain: true,
        borderClass: 'border-red-800/70',
        headClass: 'text-stone-400',
        attributes: [
            { name: 'Type', value: 'Regain', isRegain: false, valueHighlight: 'red' },
            { name: 'Max', value: 'GaugeCap', isRegain: false },
            { name: 'WaitTime', value: 'float', isRegain: false }
        ]
    },
    {
        id: 'instantpassive',
        title: 'StatuseffectFunction_2',
        subtitle: null,
        isRegain: false,
        borderClass: 'border-amber-800/50',
        headClass: 'text-stone-400',
        attributes: [
            { name: 'Type', value: 'InstantPassive', isRegain: false, valueHighlight: 'amber' },
            { name: 'PassiveRef', value: 'ref', isRegain: false }
        ]
    },
    {
        id: 'passive',
        title: 'Passive',
        subtitle: null,
        isRegain: false,
        borderClass: 'border-amber-800/60',
        headClass: 'text-stone-400',
        attributes: [
            { name: 'ConditionType', value: 'enum', isRegain: false },
            { name: 'TriggerEvent', value: 'OnHit', isRegain: false },
            { name: 'EffectType', value: 'Exec', isRegain: false }
        ]
    },
    {
        id: 'exec',
        title: 'Exec',
        subtitle: null,
        isRegain: false,
        borderClass: 'border-stone-700/80',
        headClass: 'text-stone-400',
        attributes: [
            { name: 'ExecId', value: 'ref', isRegain: false },
            { name: 'ExecPropertyId_1', value: 'ref', isRegain: false }
        ]
    },
    {
        id: 'regainrestore',
        title: 'Execproperty_1',
        subtitle: null,
        isRegain: true,
        borderClass: 'border-red-800/70',
        headClass: 'text-stone-400',
        attributes: [
            { name: 'Value1', value: '10000 (만분율)', isRegain: false },
            { name: 'Type', value: 'RegainRestore', isRegain: false, valueHighlight: 'red' }
        ]
    }
];

const PIPELINE_EDGES = [
    { from: 'statuseffect', to: 'regain', isRef: false },
    { from: 'statuseffect', to: 'instantpassive', isRef: true },
    { from: 'instantpassive', to: 'passive', isRef: false },
    { from: 'passive', to: 'exec', isRef: false },
    { from: 'exec', to: 'regainrestore', isRef: false }
];

const Pin = ({ side, theme = 'dark' }: { side: 'left' | 'right'; theme?: 'dark' | 'light' }) => (
    <div
        className={`absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border ${theme === 'light' ? 'border-archival-ink/40 bg-white' : 'border-stone-600 bg-stone-950'} ${side === 'left' ? '-left-1' : '-right-1'}`}
        style={theme === 'light' ? { borderWidth: '0.5px' } : undefined}
    />
);

const NOOP = () => {};
const PipelineNodeCard = ({
    node,
    isHighlighted,
    onClick,
    onEnter = NOOP,
    onLeave = NOOP,
    pins = { left: 1, right: 1 },
    theme = 'dark'
}: {
    node: PipelineNode;
    isHighlighted: boolean;
    onClick?: () => void;
    onEnter?: () => void;
    onLeave?: () => void;
    pins?: { left?: number; right?: number };
    theme?: 'dark' | 'light';
}) => {
    const isLight = theme === 'light';
    return (
    <div
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onClick={onClick}
        onKeyDown={e => onClick && (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onClick())}
        className={`
            relative z-10 rounded border backdrop-blur-sm transition-all duration-200 pl-3
            ${isLight
                ? `bg-white/70 border-archival-ink/25 ${isHighlighted ? 'ring-2 ring-archival-ink/50 shadow-[0_0_16px_rgba(42,42,42,0.12)]' : 'hover:border-archival-ink/40'} ${onClick ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-archival-ink/40' : ''}`
                : `bg-stone-950/95 ${node.borderClass} ${isHighlighted ? 'ring-2 ring-red-500/70 shadow-[0_0_20px_rgba(220,38,38,0.2)]' : 'hover:border-stone-600'} ${onClick ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500/50' : ''}`
            }
        `}
        style={isLight ? { borderWidth: '0.5px' } : undefined}
    >
        {pins.left !== 0 && <Pin side="left" theme={theme} />}
        {node.outputs !== undefined && node.outputs >= 2 ? (
            <>
                <div className={`absolute top-[30%] -right-1 w-2 h-2 rounded-full border ${isLight ? 'border-archival-ink/40 bg-white' : 'border-stone-600 bg-stone-950'}`} style={isLight ? { borderWidth: '0.5px' } : undefined} />
                <div className={`absolute top-[70%] -right-1 w-2 h-2 rounded-full border ${isLight ? 'border-archival-gold/50 bg-white' : 'border-amber-700/70 bg-stone-950'}`} style={isLight ? { borderWidth: '0.5px' } : undefined} />
            </>
        ) : (pins.right ?? 1) !== 0 && <Pin side="right" theme={theme} />}
        <div className={`px-2 py-1.5 border-b ${isLight ? 'border-archival-ink/15' : 'border-stone-800/80'}`} style={isLight ? { borderBottomWidth: '0.5px' } : undefined}>
            <div className={`text-[9px] font-bold uppercase tracking-widest ${isLight ? 'font-archival-mono text-archival-ink/90' : node.headClass}`}>{node.title}</div>
            {node.subtitle && <div className={`text-[10px] font-bold mt-0.5 ${isLight ? 'text-archival-ink/70' : 'text-stone-400'}`}>{node.subtitle}</div>}
        </div>
        <div className="px-2 py-1.5 space-y-0.5">
            {node.attributes.map((a, i) => (
                <div key={i} className="flex justify-between items-baseline gap-1 text-[10px]">
                    <span className={`shrink-0 ${isLight ? 'font-archival-mono text-archival-ink/70' : 'font-mono text-stone-500'}`}>{a.name}</span>
                    <span className={`truncate ${isLight ? `font-archival-mono ${a.valueHighlight === 'red' ? 'text-archival-ink font-medium' : a.valueHighlight === 'amber' ? 'text-archival-gold font-medium' : 'text-archival-ink-deep/90'}` : `font-mono ${a.valueHighlight === 'red' ? 'text-red-400 font-medium' : a.valueHighlight === 'amber' ? 'text-amber-400 font-medium' : 'text-stone-400'}`}`}>{a.value}</span>
                </div>
            ))}
        </div>
    </div>
); };

// Connector: S-Curve 베지어 (M x1 y1 C x_mid y1, x_mid y2, x2 y2)
const PipelineConnector = ({
    x1, y1, x2, y2, highlight, theme = 'dark'
}: { key?: React.Key; x1: number; y1: number; x2: number; y2: number; highlight: boolean; theme?: 'dark' | 'light' }) => {
    const xMid = (x1 + x2) / 2;
    const d = `M ${x1} ${y1} C ${xMid} ${y1}, ${xMid} ${y2}, ${x2} ${y2}`;
    const isLight = theme === 'light';
    const stroke = isLight ? (highlight ? 'url(#pipeGradArchival)' : 'rgba(42,42,42,0.35)') : (highlight ? 'url(#pipeGradCrimson)' : '#a8a29e');
    return (
        <path
            d={d}
            fill="none"
            stroke={stroke}
            strokeWidth={highlight ? (isLight ? 1.2 : 2) : (isLight ? 0.8 : 1)}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={highlight ? 1 : (isLight ? 0.9 : 0.85)}
            strokeDasharray="6 4"
            style={{
                animation: 'pipelineFlow 1.2s linear infinite'
            }}
        />
    );
};

// 핀 오프셋: -right-1(w-2) → center x = right - 8px, -left-1 → center x = left
const PIN_RIGHT_OFFSET = 8;
const PIN_LEFT_OFFSET = 0;

const DataPipeline = ({ theme = 'dark' }: { theme?: 'dark' | 'light' }) => {
    const isLight = theme === 'light';
    const [pinnedStatuseffect, setPinnedStatuseffect] = useState(false);
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);
    const [connectorCoords, setConnectorCoords] = useState<Array<{ from: { x: number; y: number }; to: { x: number; y: number } }>>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const refs = useRef<Record<string, HTMLDivElement | null>>({});

    const activeNode = hoveredNode ?? (pinnedStatuseffect ? 'statuseffect' : null);
    const relatedPaths: number[] = [];

    const measureAndUpdate = () => {
        const cont = containerRef.current;
        const r = refs.current;
        if (!cont || !r.statuseffect || !r.regain || !r.instantpassive || !r.passive || !r.exec || !r.regainrestore) return;
        const cr = cont.getBoundingClientRect();
        const toSvg = (px: number, py: number) => ({
            x: ((px - cr.left) / cr.width) * 1000,
            y: ((py - cr.top) / cr.height) * 200
        });
        const getCardRect = (el: HTMLDivElement | null) => {
            const card = el?.firstElementChild as HTMLElement | undefined;
            return card?.getBoundingClientRect?.() ?? el?.getBoundingClientRect?.() ?? new DOMRect(0, 0, 0, 0);
        };
        const sr = getCardRect(r.statuseffect);
        const rr = getCardRect(r.regain);
        const ir = getCardRect(r.instantpassive);
        const pr = getCardRect(r.passive);
        const er = getCardRect(r.exec);
        const rr2 = getCardRect(r.regainrestore);

        const pinHalf = 4;
        setConnectorCoords([
            { from: toSvg(sr.right - PIN_RIGHT_OFFSET, sr.top + sr.height * 0.3 + pinHalf), to: toSvg(rr.left + PIN_LEFT_OFFSET, rr.top + rr.height / 2) },
            { from: toSvg(sr.right - PIN_RIGHT_OFFSET, sr.top + sr.height * 0.7 + pinHalf), to: toSvg(ir.left + PIN_LEFT_OFFSET, ir.top + ir.height / 2) },
            { from: toSvg(ir.right - PIN_RIGHT_OFFSET, ir.top + ir.height / 2), to: toSvg(pr.left + PIN_LEFT_OFFSET, pr.top + pr.height / 2) },
            { from: toSvg(pr.right - PIN_RIGHT_OFFSET, pr.top + pr.height / 2), to: toSvg(er.left + PIN_LEFT_OFFSET, er.top + er.height / 2) },
            { from: toSvg(er.right - PIN_RIGHT_OFFSET, er.top + er.height / 2), to: toSvg(rr2.left + PIN_LEFT_OFFSET, rr2.top + rr2.height / 2) }
        ]);
    };

    useLayoutEffect(() => {
        measureAndUpdate();
        const cont = containerRef.current;
        if (!cont) return;
        const ro = new ResizeObserver(measureAndUpdate);
        ro.observe(cont);
        return () => ro.disconnect();
    }, []);

    return (
        <div className={`rounded-xl border overflow-hidden p-4 md:p-5 ${isLight ? 'border-archival-ink/20 bg-white/40' : 'border-stone-800 bg-stone-950/50'}`} style={isLight ? { borderWidth: '0.5px' } : undefined}>
            <style>{`
                @keyframes pipelineFlow {
                    from { stroke-dashoffset: 0; }
                    to { stroke-dashoffset: 10; }
                }
            `}</style>
            <div
                ref={containerRef}
                onMouseLeave={e => {
                    const next = e.relatedTarget as Node | null;
                    if (!next || !containerRef.current?.contains(next)) setHoveredNode(null);
                }}
                className="relative min-h-[240px] flex flex-nowrap justify-between items-stretch gap-x-6 overflow-x-auto pb-2 py-6 px-6"
            >
                <svg
                    className="absolute inset-0 w-full h-full pointer-events-none z-0"
                    viewBox="0 0 1000 200"
                    preserveAspectRatio="none"
                >
                    <defs>
                        <linearGradient id="pipeGradCrimson" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#dc2626" /><stop offset="100%" stopColor="#dc2626" /></linearGradient>
                        <linearGradient id="pipeGradArchival" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#2A2A2A" /><stop offset="100%" stopColor="#2A2A2A" /></linearGradient>
                    </defs>
                    {connectorCoords.length >= 2 && (
                        <circle
                            cx={(connectorCoords[0].from.x + connectorCoords[1].from.x) / 2}
                            cy={(connectorCoords[0].from.y + connectorCoords[1].from.y) / 2}
                            r={4}
                            fill={isLight ? 'rgba(42,42,42,0.5)' : '#78716c'}
                            opacity={0.9}
                        />
                    )}
                    {connectorCoords.map((c, i) => (
                        <PipelineConnector
                            key={i}
                            x1={c.from.x}
                            y1={c.from.y}
                            x2={c.to.x}
                            y2={c.to.y}
                            highlight={(relatedPaths ?? []).includes(i)}
                            theme={theme}
                        />
                    ))}
                </svg>

                {/* Statuseffect */}
                <div ref={el => { refs.current.statuseffect = el; }} onMouseEnter={() => setHoveredNode('statuseffect')} className="flex-shrink-0 min-w-[140px] flex items-center z-10">
                    <PipelineNodeCard
                        node={PIPELINE_NODES[0]}
                        isHighlighted={activeNode === 'statuseffect'}
                        onClick={() => setPinnedStatuseffect(p => !p)}
                        pins={{ left: 0, right: 2 }}
                        theme={theme}
                    />
                </div>

                {/* 분기점: Function(Regain) + Passive(instantPassive) */}
                <div className="flex-shrink-0 flex flex-col justify-between gap-4 min-w-[180px] z-10">
                    <div ref={el => { refs.current.regain = el; }} onMouseEnter={() => setHoveredNode('regain')} className="flex justify-center">
                        <PipelineNodeCard
                            node={PIPELINE_NODES[1]}
                            isHighlighted={activeNode === 'regain'}
                            pins={{ left: 1, right: 0 }}
                            theme={theme}
                        />
                    </div>
                    <div ref={el => { refs.current.instantpassive = el; }} onMouseEnter={() => setHoveredNode('instantpassive')} className="flex justify-center">
                        <PipelineNodeCard
                            node={PIPELINE_NODES[2]}
                            isHighlighted={activeNode === 'instantpassive'}
                            pins={{ left: 1, right: 1 }}
                            theme={theme}
                        />
                    </div>
                </div>

                <div ref={el => { refs.current.passive = el; }} onMouseEnter={() => setHoveredNode('passive')} className="flex-shrink-0 min-w-[120px] flex items-center justify-center z-10">
                    <PipelineNodeCard
                        node={PIPELINE_NODES[3]}
                        isHighlighted={activeNode === 'passive'}
                        pins={{ left: 1, right: 1 }}
                        theme={theme}
                    />
                </div>
                <div ref={el => { refs.current.exec = el; }} onMouseEnter={() => setHoveredNode('exec')} className="flex-shrink-0 min-w-[120px] flex items-center justify-center z-10">
                    <PipelineNodeCard
                        node={PIPELINE_NODES[4]}
                        isHighlighted={activeNode === 'exec'}
                        pins={{ left: 1, right: 1 }}
                        theme={theme}
                    />
                </div>
                <div ref={el => { refs.current.regainrestore = el; }} onMouseEnter={() => setHoveredNode('regainrestore')} className="flex-shrink-0 min-w-[120px] flex items-center justify-center z-10">
                    <PipelineNodeCard
                        node={PIPELINE_NODES[5]}
                        isHighlighted={activeNode === 'regainrestore'}
                        pins={{ left: 1, right: 0 }}
                        theme={theme}
                    />
                </div>
            </div>
        </div>
    );
};

const MultiHitSimulation = ({ theme = 'dark' }: { theme?: 'dark' | 'light' }) => {
    const isLight = theme === 'light';
    const data = [
        { t: "대상 1", eff: 1.0, val: "100%", w: "100%", acc: "100%" },
        { t: "대상 2", eff: 0.5, val: "50%", w: "50%", acc: "150%" },
        { t: "대상 3", eff: 0.25, val: "25%", w: "25%", acc: "175%" },
        { t: "대상 4", eff: 0.125, val: "12.5%", w: "12.5%", acc: "187.5%" },
        { t: "대상 5", eff: 0.1, val: "10% (Min)", w: "10%", acc: "197.5%" },
    ];

    return (
        <div className={`border rounded p-6 font-mono text-xs h-full ${isLight ? 'bg-white/40 border-[#1A1A1A]/15' : 'bg-stone-950 border-stone-800'}`}>
            <div className={`grid grid-cols-12 gap-2 text-[9px] border-b pb-2 mb-2 uppercase tracking-wider ${isLight ? 'text-[#2D2D2D] border-[#1A1A1A]/15' : 'text-stone-500 border-stone-800'}`}>
                <div className="col-span-2">순서 (Order)</div>
                <div className="col-span-2 text-right">효율 (Eff)</div>
                <div className="col-span-6 pl-4">비주얼 스케일 (Scale)</div>
                <div className="col-span-2 text-right">누적 효율 (Sum)</div>
            </div>
            {data.map((d, i) => (
                <div key={i} className={`grid grid-cols-12 gap-2 items-center py-2 border-b transition-colors ${isLight ? 'border-[#1A1A1A]/10 hover:bg-[#1A1A1A]/5' : 'border-stone-800/50 hover:bg-white/5'}`}>
                    <div className={`col-span-2 font-bold ${isLight ? 'text-[#1A1A1A]' : 'text-stone-400'}`}>{d.t}</div>
                    <div className={`col-span-2 text-right ${isLight ? 'text-[#1A1A1A]' : 'text-red-400'}`}>{d.eff}</div>
                    <div className="col-span-6 pl-4 h-full flex items-center">
                        <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: d.w }}
                            transition={{ duration: 0.8, delay: i * 0.1 }}
                            className={`h-1.5 rounded-full opacity-80 ${isLight ? 'bg-[#1A1A1A]' : 'bg-red-600'}`}
                        />
                    </div>
                    <div className={`col-span-2 text-right ${isLight ? 'text-[#2D2D2D]' : 'text-stone-500'}`}>{d.acc}</div>
                </div>
            ))}
        </div>
    );
};

// --- ANIMATION COMPONENTS ---
const BarVisualizer = ({ type, label, description, theme = 'dark' }: { type: 'hit' | 'decay' | 'clear', label: string, description: string; theme?: 'dark' | 'light' }) => {
    const isLight = theme === 'light';
    return (
        <div className={`border p-8 rounded flex flex-col items-center h-full ${isLight ? 'bg-white/40 border-[#1A1A1A]/15' : 'bg-stone-900 border-stone-800'}`}>
             <div className={`text-sm font-bold mb-8 uppercase tracking-widest ${isLight ? 'text-[#1A1A1A]' : 'text-stone-300'}`}>{label}</div>
             
             {/* Health Bar Container */}
             <div className="w-full h-10 bg-stone-950 border border-white/10 rounded relative overflow-hidden mb-6 shadow-inner">
                {/* Background Grid */}
                <div className="absolute inset-0 grid grid-cols-10 divide-x divide-white/5 z-20 pointer-events-none">
                    {Array.from({length:10}).map((_,i) => <div key={i}></div>)}
                </div>

                {/* HP & Regain Logic */}
                {type === 'hit' && (
                     <>
                        <motion.div 
                            initial={{ width: "100%" }}
                            animate={{ width: "60%" }}
                            transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5, repeatDelay: 1 }}
                            className="absolute left-0 top-0 bottom-0 bg-red-800 z-10"
                        />
                        <motion.div 
                            initial={{ width: "100%", opacity: 0 }}
                            animate={{ width: "100%", opacity: 1 }}
                            transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5, repeatDelay: 1 }}
                            className="absolute left-0 top-0 bottom-0 bg-stone-600"
                        />
                     </>
                )}
                
                {type === 'decay' && (
                     <>
                        <div className="absolute left-0 top-0 bottom-0 bg-red-800 z-10 w-[40%]" />
                        <motion.div 
                             initial={{ width: "60%", left: "40%" }}
                             animate={{ width: "0%", left: "40%" }}
                             transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                             className="absolute top-0 bottom-0 bg-stone-600 z-0 border-r border-stone-500/50"
                        />
                     </>
                )}

                 {type === 'clear' && (
                     <>
                        <div className="absolute left-0 top-0 bottom-0 bg-red-800 z-10 w-[40%]" />
                        <motion.div 
                             initial={{ opacity: 1 }}
                             animate={{ opacity: 0 }}
                             transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 0.5, times: [0, 0.1, 1] }}
                             className="absolute left-[40%] top-0 bottom-0 w-[60%] bg-stone-600 z-0"
                        />
                     </>
                )}
             </div>

             <div className="text-xs text-stone-500 text-center leading-relaxed h-10">
                 {description}
             </div>
        </div>
    )
}


const SystemDesign: React.FC = () => {
  return (
    <div className="w-full font-sans text-stone-400 selection:bg-red-900/30 selection:text-red-200">
      
      {/* 리게인 시스템 — 기록물(Archival) 컨셉 */}
      <div id="regain-system">
      {/* 0. OVERVIEW */}
      <div className="mb-20">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-12 h-px bg-archival-ink/40" style={{ height: '0.5px' }} />
          <div className="p-2 rounded-lg bg-archival-ink/10 border border-archival-ink/25" style={{ borderWidth: '0.5px' }}>
            <Target size={18} className="text-archival-ink" strokeWidth={1.5} />
          </div>
          <span className="text-[10px] font-archival-mono text-archival-ink/80 uppercase tracking-widest">Core System</span>
        </div>
        <h2 className="text-xl md:text-2xl font-archival-serif font-light text-archival-ink mb-4 tracking-[0.15em] max-w-2xl">
          {sysUi.regainTitle ?? '리게인 시스템'}
        </h2>
        {DOC_DATA.overview.gimmick && (
          <p className="text-sm md:text-base text-archival-ink-deep/90 leading-relaxed max-w-2xl">
            {DOC_DATA.overview.gimmick}
          </p>
        )}

        <div className="pl-5 md:pl-8 py-6 border-l border-archival-ink/30 bg-archival-ink/5 rounded-r-lg mb-10 mt-8" style={{ borderLeftWidth: '0.5px' }}>
          <div className="text-[10px] font-archival-mono font-bold text-archival-ink/80 uppercase tracking-widest mb-4">{sysUi.intentSummary ?? '기획 의도 요약'}</div>
          <div className="space-y-3">
            <div className="text-archival-ink-deep/90 text-sm leading-relaxed">
              {text.system?.regainIntent ?? '피격 후 즉각적인 반격을 유도하여 공격적인 전투 템포를 유지하고 역전의 기회를 제공한다.'}
            </div>
          </div>
        </div>

        {DOC_DATA.overview.gimmick && (
          <div className="pl-5 md:pl-8 py-4 border-l border-archival-ink/25 bg-archival-ink/5 rounded-r-lg" style={{ borderLeftWidth: '0.5px' }}>
            <p className="text-sm text-archival-ink-deep/90 leading-relaxed italic font-archival-serif">"{DOC_DATA.overview.gimmick}"</p>
          </div>
        )}
      </div>

      <section className="mb-48">
          <SpecHeader num="01" title="시스템 흐름도 & 데이터" sub="Logic Architecture" icon={<Workflow size={24} />} accent="regain" />
          
          <div className="mb-24">
              <div className="bg-white/40 border border-archival-ink/20 p-4 sm:p-6 rounded-lg" style={{ borderWidth: '0.5px' }}>
                  <h4 className="text-sm font-archival-mono font-bold text-archival-ink/90 uppercase tracking-widest mb-4 md:mb-6 border-l border-archival-ink/30 pl-4" style={{ borderLeftWidth: '0.5px' }}>1.1 로직 흐름도</h4>
                  <RegainFlowchart theme="light" />
                  <p className="text-[9px] text-archival-ink/70 font-archival-mono mt-3">노드를 클릭하면 상세 로직이 표시됩니다.</p>
              </div>
          </div>

          <div className="mt-24">
               <h4 className="text-sm font-archival-mono font-bold text-archival-ink/90 uppercase tracking-widest mb-6 border-l border-archival-ink/30 pl-4" style={{ borderLeftWidth: '0.5px' }}>1.2 데이터 연결 구조</h4>
               <DataPipeline theme="light" />
          </div>

          <div className="mt-24">
               <h4 className="text-sm font-archival-mono font-bold text-archival-ink/90 uppercase tracking-widest mb-6 border-l border-archival-ink/30 pl-4" style={{ borderLeftWidth: '0.5px' }}>1.3 핵심 데이터 추가</h4>
               <div className="flex flex-col gap-6">
                    <div className="rounded-xl border border-archival-ink/20 bg-white/40 overflow-hidden flex flex-col" style={{ borderWidth: '0.5px' }}>
                         <div className="flex items-center gap-3 p-5 border-b border-archival-ink/15 bg-archival-ink/5" style={{ borderBottomWidth: '0.5px' }}>
                              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-archival-ink/10 border border-archival-ink/25 text-base font-archival-mono font-bold text-archival-ink" style={{ borderWidth: '0.5px' }}>1</span>
                              <div>
                                   <span className="inline-block px-2.5 py-1 rounded text-[10px] font-archival-mono font-bold bg-archival-ink/10 border border-archival-ink/20 text-archival-ink-deep/90 uppercase tracking-wider" style={{ borderWidth: '0.5px' }}>StatuseffectFunction</span>
                                   <div className="text-sm font-archival-serif font-bold text-archival-ink mt-1.5">Regain</div>
                              </div>
                         </div>
                         <div className="p-5 text-sm text-archival-ink-deep/90 leading-relaxed">효과가 유지되는 동안 입은 피해를 리게인 게이지로 환산</div>
                    </div>
                    <div className="rounded-xl border border-archival-ink/20 bg-white/40 overflow-hidden flex flex-col" style={{ borderWidth: '0.5px' }}>
                         <div className="flex items-center gap-3 p-5 border-b border-archival-ink/15 bg-archival-ink/5" style={{ borderBottomWidth: '0.5px' }}>
                              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-archival-ink/10 border border-archival-ink/25 text-base font-archival-mono font-bold text-archival-ink" style={{ borderWidth: '0.5px' }}>2</span>
                              <div>
                                   <span className="inline-block px-2.5 py-1 rounded text-[10px] font-archival-mono font-bold bg-archival-ink/10 border border-archival-ink/20 text-archival-ink-deep/90 uppercase tracking-wider" style={{ borderWidth: '0.5px' }}>Execproperty</span>
                                   <div className="text-sm font-archival-serif font-bold text-archival-ink mt-1.5">RegainRestore</div>
                              </div>
                         </div>
                         <div className="p-5 text-sm text-archival-ink-deep/90 leading-relaxed flex-1 space-y-3">
                              <p>가해 대미지에 따라 리게인 게이지의 일정 비율을 생명력으로 복구.</p>
                              <p className="text-archival-ink/80 font-archival-mono text-xs border-t border-archival-ink/15 pt-3" style={{ borderTopWidth: '0.5px' }}>최종 복구량 = 가해 대미지 × RegainRestoreDamageRatio × 다단히트 효율<br /><span className="text-archival-ink/70">단, 리게인 게이지 총량을 초과하여 복구할 수 없음. </span></p>
                              <div className="border-t border-archival-ink/15 pt-3" style={{ borderTopWidth: '0.5px' }}>
                                   <div className="text-[10px] font-archival-mono font-bold text-archival-ink/90 uppercase tracking-wider mb-2">Value1</div>
                                   <table className="archival-table text-xs">
                                        <tbody>
                                             <tr><td className="py-2 px-3 font-archival-mono font-bold text-archival-ink/90 align-top whitespace-nowrap" style={{ width: '1px' }}>설명</td><td className="py-2 px-3 text-archival-ink-deep/90 break-words min-w-0">리게인 게이지 고정 회복 비율값</td></tr>
                                             <tr><td className="py-2 px-3 font-archival-mono font-bold text-archival-ink/90 align-top whitespace-nowrap" style={{ width: '1px' }}>값이 0일 경우</td><td className="py-2 px-3 text-archival-ink-deep/90 break-words min-w-0">위 계산식에 따라 리게인 게이지 복구</td></tr>
                                             <tr><td className="py-2 px-3 font-archival-mono font-bold text-archival-ink/90 align-top whitespace-nowrap" style={{ width: '1px' }}>값이 0이 아닐 경우</td><td className="py-2 px-3 text-archival-ink-deep/90 break-words min-w-0">위 계산식을 무시하고 Value1만큼 리게인 게이지의 일정 비율 복구 (음수 기재 불가). 대미지 기반이 아닌 다른 공격으로 회복할 때의 확장용</td></tr>
                                        </tbody>
                                   </table>
                              </div>
                         </div>
                    </div>
               </div>
          </div>
      </section>

      <section className="mb-48">
           <SpecHeader num="02" title="상세 규칙" sub="Logic & Edge Cases" icon={<FileText size={24} />} accent="regain" />
           
           <div className="flex flex-col gap-24">
               <div>
                    <h4 className="text-sm font-archival-mono font-bold text-archival-ink/90 uppercase tracking-widest border-l border-archival-ink/30 pl-4 mb-6" style={{ borderLeftWidth: '0.5px' }}>2.1 상세 작동 규칙</h4>
                    <div className="archival-table-wrap">
                        <table className="archival-table">
                            <thead>
                                <tr>
                                    <th className="py-3 px-4 text-[10px] font-archival-mono font-bold uppercase tracking-widest w-14">No</th>
                                    <th className="py-3 px-4 text-xs font-archival-mono font-bold uppercase tracking-wider min-w-[140px]">규칙명</th>
                                    <th className="py-3 px-4 text-xs font-archival-mono font-bold uppercase tracking-wider">설명</th>
                                </tr>
                            </thead>
                            <tbody>
                                {DOC_DATA.rules.map((rule, i) => (
                                    <tr key={i}>
                                        <td className="py-4 px-4">
                                            <span className="inline-flex w-8 h-8 rounded-lg bg-archival-ink/10 border border-archival-ink/25 items-center justify-center text-sm font-archival-mono font-bold text-archival-ink" style={{ borderWidth: '0.5px' }}>{i + 1}</span>
                                        </td>
                                        <td className="py-4 px-4 text-sm font-archival-serif font-bold text-archival-ink">{rule.title}</td>
                                        <td className="py-4 px-4 text-xs text-archival-ink-deep/90 leading-relaxed">{rule.desc}</td>
                                    </tr>
                                ))}
                                <tr>
                                    <td className="py-4 px-4 align-top">
                                        <span className="inline-flex w-8 h-8 rounded-lg bg-archival-ink/10 border border-archival-ink/25 items-center justify-center text-archival-ink" style={{ borderWidth: '0.5px' }}><Layers size={16} strokeWidth={1.5} /></span>
                                    </td>
                                    <td className="py-4 px-4 text-sm font-archival-serif font-bold text-archival-ink">중첩 규칙</td>
                                    <td className="py-4 px-4 text-xs text-archival-ink-deep/90 leading-relaxed">
                                        리게인 게이지는 <span className="text-archival-ink font-archival-serif font-bold">덮어쓰기 (Overwrite)</span> 방식으로만 갱신. 지속시간만 갱신하며, 스택/등급 시스템 미적용.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
               </div>

               <div>
                    <h4 className="text-sm font-archival-mono font-bold text-archival-ink/90 uppercase tracking-widest mb-6 border-l border-archival-ink/30 pl-4" style={{ borderLeftWidth: '0.5px' }}>2.2 상황별 처리</h4>
                    <div className="archival-table-wrap">
                        <table className="archival-table">
                            <thead>
                                <tr>
                                    <th className="py-3 px-4 text-[10px] font-archival-mono font-bold uppercase tracking-widest w-12"></th>
                                    <th className="py-3 px-4 text-xs font-archival-mono font-bold uppercase tracking-wider min-w-[160px]">상황</th>
                                    <th className="py-3 px-4 text-xs font-archival-mono font-bold uppercase tracking-wider">동작</th>
                                </tr>
                            </thead>
                            <tbody>
                                {DOC_DATA.exceptions.map((ex, i) => (
                                    <tr key={i}>
                                        <td className="py-4 px-4 text-archival-ink">{ex.icon}</td>
                                        <td className="py-4 px-4 text-sm font-archival-serif font-bold text-archival-ink">{ex.label}</td>
                                        <td className="py-4 px-4 text-xs text-archival-ink-deep/90 leading-relaxed">{ex.desc}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
               </div>
           </div>
      </section>

      <section className="mb-48">
          <SpecHeader num="03" title="게임 설정 데이터" sub="Variable Definitions" icon={<Server size={24} />} accent="regain" />
          <div className="space-y-10">
              <div>
                  <div className="text-xs font-archival-mono font-bold text-archival-ink/90 uppercase tracking-widest mb-4">핵심 스탯</div>
                  <ul className="space-y-0 border border-archival-ink/20 rounded-xl overflow-hidden divide-y divide-archival-ink/15" style={{ borderWidth: '0.5px' }}>
                      {DOC_DATA.variables.filter(v => v.category?.includes('Stat')).map((v, i) => (
                          <li key={i} className="flex flex-wrap items-baseline gap-3 py-4 px-5 bg-white/30 hover:bg-archival-ink/5 transition-colors">
                              <span className="text-[10px] font-archival-mono font-bold text-archival-ink/80 uppercase tracking-wider">스탯</span>
                              <span className="font-archival-mono font-bold text-archival-ink">{v.name}</span>
                              <span className="text-[10px] font-archival-mono px-2 py-0.5 rounded bg-archival-ink/10 text-archival-ink-deep/90">{v.type}</span>
                              <span className="text-sm text-archival-ink-deep/90 flex-1 min-w-0">{v.desc}</span>
                          </li>
                      ))}
                  </ul>
              </div>
              <div>
                  <div className="text-xs font-archival-mono font-bold text-archival-ink/90 uppercase tracking-widest mb-4">설정 (Config)</div>
                  <ul className="space-y-0 border border-archival-ink/20 rounded-xl overflow-hidden divide-y divide-archival-ink/15" style={{ borderWidth: '0.5px' }}>
                      {DOC_DATA.variables.filter(v => v.category?.includes('설정')).map((v, i) => (
                          <li key={i} className="flex flex-wrap items-baseline gap-3 py-4 px-5 bg-white/30 hover:bg-archival-ink/5 transition-colors">
                              <span className="text-[10px] font-archival-mono font-bold text-archival-ink/80 uppercase tracking-wider">설정</span>
                              <span className="font-archival-mono font-bold text-archival-ink">{v.name}</span>
                              <span className="text-[10px] font-archival-mono px-2 py-0.5 rounded bg-archival-ink/10 text-archival-ink-deep/90">{v.type}</span>
                              <span className="text-sm text-archival-ink-deep/90 flex-1 min-w-0">{v.desc}</span>
                          </li>
                      ))}
                  </ul>
              </div>
          </div>
      </section>

      <section className="mb-48">
          <SpecHeader num="04" title="공식 및 밸런스" sub="Algorithm" icon={<Calculator size={24} />} accent="regain" />
          
          <div className="mb-24">
               <div className="mb-8">
                    <h4 className="text-sm font-archival-mono font-bold text-archival-ink/90 uppercase tracking-widest border-l border-archival-ink/30 pl-4 mb-3" style={{ borderLeftWidth: '0.5px' }}>4.1 회복 공식</h4>
               </div>
               <div className="bg-archival-ink/10 border border-archival-ink/20 px-8 py-10 rounded-2xl" style={{ borderWidth: '0.5px' }}>
                    <p className="font-archival-serif text-base md:text-lg text-archival-ink leading-relaxed">
                         최종 복구량 = 가해 대미지 × RegainRestoreDamageRatio × 다단히트 효율
                    </p>
               </div>
          </div>

          <div>
               <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8">
                    <div>
                         <h4 className="text-sm font-archival-mono font-bold text-archival-ink/90 uppercase tracking-widest border-l border-archival-ink/30 pl-4 mb-3" style={{ borderLeftWidth: '0.5px' }}>4.2 다중 타겟 로직</h4>
                         <p className="text-[0.7rem] text-archival-ink-deep/90 leading-relaxed max-w-2xl">
                             다수의 적을 동시에 타격하여 게이지가 순식간에 복구되는 밸런스 붕괴를 방지하기 위해, <span className="text-archival-ink font-archival-serif font-bold">감쇠 공식</span>을 적용합니다.
                         </p>
                    </div>
                    <div className="flex gap-4 shrink-0">
                         <div className="px-5 py-3 rounded-xl bg-white/40 border border-archival-ink/20 text-center" style={{ borderWidth: '0.5px' }}>
                              <div className="text-[10px] font-archival-mono text-archival-ink/80 uppercase tracking-wider">최소 효율</div>
                              <div className="text-base font-archival-serif font-bold text-archival-ink">10%</div>
                         </div>
                         <div className="px-5 py-3 rounded-xl bg-white/40 border border-archival-ink/20 text-center" style={{ borderWidth: '0.5px' }}>
                              <div className="text-[10px] font-archival-mono text-archival-ink/80 uppercase tracking-wider">최대 회복량</div>
                              <div className="text-sm font-archival-serif font-bold text-archival-ink">Regain Gauge Cap</div>
                         </div>
                    </div>
               </div>
               <MultiHitSimulation theme="light" />
          </div>
      </section>

      <section className="mb-48">
          <SpecHeader num="05" title="회복 시나리오" sub="Action Types" icon={<MousePointerClick size={24} />} accent="regain" />
          <div className="archival-table-wrap">
              <table className="archival-table">
                  <thead>
                      <tr>
                          <th className="py-3 px-4 text-[10px] font-archival-mono font-bold uppercase tracking-widest min-w-[80px]">유형</th>
                          <th className="py-3 px-4 text-xs font-archival-mono font-bold uppercase tracking-wider min-w-[140px]">시나리오</th>
                          <th className="py-3 px-4 text-xs font-archival-mono font-bold uppercase tracking-wider min-w-[100px]">처리</th>
                          <th className="py-3 px-4 text-xs font-archival-mono font-bold uppercase tracking-wider">설명</th>
                      </tr>
                  </thead>
                  <tbody>
                      {DOC_DATA.scenarios.map((s, i) => (
                          <tr key={i}>
                              <td className="py-4 px-4 font-archival-mono font-bold text-archival-ink align-top">{s.type}</td>
                              <td className="py-4 px-4 font-archival-serif font-bold text-archival-ink align-top">{s.title}</td>
                              <td className="py-4 px-4 align-top">
                                  <span className={`text-[10px] font-archival-mono font-bold px-2 py-1 rounded border uppercase ${s.action?.includes('소멸') ? 'bg-archival-ink/15 text-archival-ink border-archival-ink/25' : s.action?.includes('유지') ? 'bg-archival-ink/10 text-archival-ink-deep/90 border-archival-ink/20' : 'bg-archival-ink/10 text-archival-ink-deep/90 border-archival-ink/20'}`} style={{ borderWidth: '0.5px' }}>{s.action}</span>
                              </td>
                              <td className="py-4 px-4 text-sm text-archival-ink-deep/90">{s.desc}</td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </section>

      <section className="mb-32">
           <SpecHeader num="06" title="UI/UX 피드백" sub="Visual Guide" icon={<MonitorPlay size={24} />} accent="regain" />
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <BarVisualizer 
                   type="hit" 
                   label="상태 1: 누적 (Accumulate)" 
                   description="피격 시 체력이 감소하고, 감소한 만큼 리게인 게이지가 즉시 생성됩니다."
                   theme="light"
               />
               <BarVisualizer 
                   type="decay" 
                   label="상태 2: 감소 (Decay)" 
                   description="일정 시간 피격/공격이 없으면 리게인 게이지가 서서히 줄어듭니다."
                   theme="light"
               />
               <BarVisualizer 
                   type="clear" 
                   label="상태 3: 소멸 (Consume)" 
                   description="물약 사용, 가드 브레이크 시 리게인 게이지가 즉시 소멸합니다."
                   theme="light"
               />
           </div>
      </section>

      </div>
      {/* /regain-system */}

      {/* 7. SMART TARGETING SECTION — 기록물(Archival) 컨셉 */}
      <section id="smart-targeting" className="mb-48 pt-24">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-12 h-px bg-archival-ink/40" style={{ height: '0.5px' }} />
          <div className="p-2 rounded-lg bg-archival-ink/10 border border-archival-ink/25" style={{ borderWidth: '0.5px' }}>
            <Crosshair size={18} className="text-archival-ink" strokeWidth={1.5} />
          </div>
          <span className="text-[10px] font-archival-mono text-archival-ink/80 uppercase tracking-widest">Core System</span>
        </div>
        <h2 className="text-xl md:text-2xl font-archival-serif font-light text-archival-ink mb-4 tracking-[0.15em] max-w-2xl">
          {sysUi.smartTitle ?? '스마트 타겟팅 시스템'}
        </h2>

        <div className="pl-5 md:pl-8 py-6 border-l border-archival-ink/30 bg-archival-ink/5 rounded-r-lg mb-16 mt-8" style={{ borderLeftWidth: '0.5px' }}>
          <div className="text-[10px] font-archival-mono font-bold text-archival-ink/80 uppercase tracking-widest mb-4">{sysUi.intentSummary ?? '기획 의도 요약'}</div>
          <div className="space-y-3">
            {SMART_TARGETING_DATA.overview.purposes.map((p, i) => (
              <div key={i} className="text-archival-ink-deep/90 text-sm leading-relaxed">
                {p.desc}
              </div>
            ))}
          </div>
        </div>

        <SpecHeader num="01" title="스마트 타겟팅 플로우" sub="Targeting Logic Overview" icon={<Crosshair size={24} />} accent="regain" />
        <SmartTargetingFlowchart theme="light" />

        <div className="mt-24">
          <h4 className="text-sm font-archival-mono font-bold text-archival-ink/90 uppercase tracking-widest mb-6 border-l border-archival-ink/30 pl-4" style={{ borderLeftWidth: '0.5px' }}>02. 타겟 탐색 및 선정 로직</h4>
          <div className="space-y-10">
            <div>
              <div className="text-xs font-archival-mono font-bold text-archival-ink/90 uppercase tracking-widest mb-4">카메라 정면 기반 탐색</div>
              <ul className="space-y-0 border border-archival-ink/20 rounded-xl overflow-hidden divide-y divide-archival-ink/15" style={{ borderWidth: '0.5px' }}>
                {SMART_TARGETING_DATA.searchLogic.camera.map((c, i) => (
                  <li key={i} className="flex flex-col sm:flex-row sm:items-baseline gap-2 py-4 px-5 bg-white/30 hover:bg-archival-ink/5 transition-colors" style={i ? { borderTopWidth: '0.5px' } : undefined}>
                    <span className="text-sm font-archival-serif font-bold text-archival-ink shrink-0 min-w-[100px]">{c.title}</span>
                    <span className="text-xs text-archival-ink-deep/90 leading-relaxed flex-1">{c.desc}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-xs font-archival-mono font-bold text-archival-ink/90 uppercase tracking-widest mb-4">클래스별 동적 범위 (Dynamic Range)</div>
              <div className="archival-table-wrap">
                <table className="archival-table">
                  <thead>
                    <tr>
                      <th className="py-3 px-4 text-[10px] font-archival-mono font-bold uppercase tracking-widest min-w-[100px]">분류</th>
                      <th className="py-3 px-4 text-xs font-archival-mono font-bold uppercase tracking-wider">근거리</th>
                      <th className="py-3 px-4 text-xs font-archival-mono font-bold uppercase tracking-wider">원거리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SMART_TARGETING_DATA.searchLogic.dynamicRange.map((r, i) => (
                      <tr key={i}>
                        <td className="py-4 px-4 text-sm font-archival-serif font-bold text-archival-ink">{r.param}</td>
                        <td className="py-4 px-4 text-xs text-archival-ink-deep/90 leading-relaxed">{r.melee}</td>
                        <td className="py-4 px-4 text-xs text-archival-ink-deep/90 leading-relaxed">{r.ranged}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <div className="text-xs font-archival-mono font-bold text-archival-ink/90 uppercase tracking-widest mb-4">장애물 체크</div>
              <div className="pl-5 py-4 border-l border-archival-ink/30 bg-archival-ink/5 rounded-r-lg" style={{ borderLeftWidth: '0.5px' }}>
                <p className="text-xs text-archival-ink-deep/90 leading-relaxed">{SMART_TARGETING_DATA.searchLogic.obstacleCheck}</p>
              </div>
            </div>
            <div>
              <div className="text-xs font-archival-mono font-bold text-archival-ink/90 uppercase tracking-widest mb-4">타겟 선정 점수</div>
              <div className="space-y-8">
                <div>
                  <div className="text-[10px] font-archival-mono font-bold text-archival-ink/80 uppercase tracking-widest mb-2">점수 요소</div>
                  <div className="archival-table-wrap">
                    <table className="archival-table">
                      <thead>
                        <tr>
                          <th className="py-3 px-4 text-xs font-archival-mono font-bold uppercase tracking-wider min-w-[120px]">항목</th>
                          <th className="py-3 px-4 text-xs font-archival-mono font-bold uppercase tracking-wider">설명</th>
                        </tr>
                      </thead>
                      <tbody>
                        {SMART_TARGETING_DATA.searchLogic.scoring.filter((s): s is { factor: string; desc: string } => 'factor' in s && !!s.factor).map((s, i) => (
                          <tr key={i}>
                            <td className="py-4 px-4 text-sm font-archival-serif font-bold text-archival-ink">{s.factor}</td>
                            <td className="py-4 px-4 text-xs text-archival-ink-deep/90 leading-relaxed">{s.desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-archival-mono font-bold text-archival-ink/80 uppercase tracking-widest mb-2">가중치</div>
                  <div className="archival-table-wrap">
                    <table className="archival-table">
                      <thead>
                        <tr>
                          <th className="py-3 px-4 text-xs font-archival-mono font-bold uppercase tracking-wider min-w-[120px]">항목</th>
                          <th className="py-3 px-4 text-xs font-archival-mono font-bold uppercase tracking-wider">설명</th>
                        </tr>
                      </thead>
                      <tbody>
                        {SMART_TARGETING_DATA.searchLogic.scoring.filter((s): s is { weight: string; desc: string } => 'weight' in s && !!s.weight).map((s, i) => (
                          <tr key={i}>
                            <td className="py-4 px-4 text-sm font-archival-serif font-bold text-archival-ink">{s.weight}</td>
                            <td className="py-4 px-4 text-xs text-archival-ink-deep/90 leading-relaxed">{s.desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="text-xs font-archival-mono font-bold text-archival-ink/90 uppercase tracking-widest mb-4">캐릭터 이동 입력 시 예외</div>
              <div className="rounded-xl border border-archival-ink/20 bg-white/40 overflow-hidden" style={{ borderWidth: '0.5px' }}>
                <div className="p-5 border-b border-archival-ink/15" style={{ borderBottomWidth: '0.5px' }}>
                  <p className="text-xs text-archival-ink-deep/90 leading-relaxed"><span className="font-archival-mono font-bold text-archival-ink">기획 의도:</span> {SMART_TARGETING_DATA.searchLogic.forwardException.purpose}</p>
                </div>
                <ul className="divide-y divide-archival-ink/15">
                  {SMART_TARGETING_DATA.searchLogic.forwardException.logic.map((l, i) => (
                    <li key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 py-4 px-5" style={{ borderTopWidth: i ? '0.5px' : undefined }}>
                      <span className="font-archival-mono text-archival-ink text-xs shrink-0 min-w-[140px]">{l.cond}</span>
                      <span className="text-archival-ink/60 text-xs">→</span>
                      <span className="text-xs text-archival-ink-deep/90 leading-relaxed flex-1">{l.base}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 07.2 상태별 판정 및 안정화 */}
        <div className="mt-24">
          <h4 className="text-sm font-archival-mono font-bold text-archival-ink/90 uppercase tracking-widest mb-6 border-l border-archival-ink/30 pl-4" style={{ borderLeftWidth: '0.5px' }}>03. 상태별 판정 및 안정화</h4>
          <div className="archival-table-wrap">
            <table className="archival-table">
              <thead>
                <tr>
                  <th className="py-3 px-4 text-[10px] font-archival-mono font-bold uppercase tracking-widest w-14">No</th>
                  <th className="py-3 px-4 text-xs font-archival-mono font-bold uppercase tracking-wider min-w-[160px]">판정</th>
                  <th className="py-3 px-4 text-xs font-archival-mono font-bold uppercase tracking-wider">설명</th>
                </tr>
              </thead>
              <tbody>
                {SMART_TARGETING_DATA.stabilization.map((s, i) => (
                  <tr key={i}>
                    <td className="py-4 px-4">
                      <span className="inline-flex w-8 h-8 rounded-lg bg-archival-ink/10 border border-archival-ink/25 items-center justify-center text-sm font-archival-mono font-bold text-archival-ink" style={{ borderWidth: '0.5px' }}>{i + 1}</span>
                    </td>
                    <td className="py-4 px-4 text-sm font-archival-serif font-bold text-archival-ink">{s.title}</td>
                    <td className="py-4 px-4 text-xs text-archival-ink-deep/90 leading-relaxed whitespace-pre-line">{s.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 07.3 카메라 보정 */}
        <div className="mt-24">
          <h4 className="text-sm font-archival-mono font-bold text-archival-ink/90 uppercase tracking-widest mb-6 border-l border-archival-ink/30 pl-4" style={{ borderLeftWidth: '0.5px' }}>04. 카메라 보정</h4>
          <div className="rounded-xl border border-archival-ink/20 bg-white/40 overflow-hidden" style={{ borderWidth: '0.5px' }}>
            <div className="p-6 md:p-8 space-y-6">
              <div>
                <div className="text-[10px] font-archival-mono font-bold text-archival-ink/80 uppercase tracking-wider mb-2">기능</div>
                <p className="text-xs text-archival-ink-deep/90 leading-relaxed">{SMART_TARGETING_DATA.cameraMagnetism.function}</p>
              </div>
              <div>
                <div className="text-[10px] font-archival-mono font-bold text-archival-ink/80 uppercase tracking-wider mb-2">강도</div>
                <p className="text-xs text-archival-ink-deep/90 leading-relaxed">{SMART_TARGETING_DATA.cameraMagnetism.intensity}</p>
              </div>
              <div>
                <div className="text-[10px] font-archival-mono font-bold text-archival-ink/80 uppercase tracking-wider mb-2">조건</div>
                <p className="text-xs text-archival-ink-deep/90 leading-relaxed">{SMART_TARGETING_DATA.cameraMagnetism.condition}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 05. 예외 상황 처리 — 표 서식 통일 */}
        <div className="mt-24">
          <h4 className="text-sm font-archival-mono font-bold text-archival-ink/90 uppercase tracking-widest mb-6 border-l border-archival-ink/30 pl-4" style={{ borderLeftWidth: '0.5px' }}>05. 예외 상황 처리</h4>
          <div className="archival-table-wrap">
            <table className="archival-table">
              <thead>
                <tr>
                  <th className="py-3 px-4 text-[10px] font-archival-mono font-bold uppercase tracking-widest w-14"></th>
                  <th className="py-3 px-4 text-xs font-archival-mono font-bold uppercase tracking-wider min-w-[180px]">유형</th>
                  <th className="py-3 px-4 text-xs font-archival-mono font-bold uppercase tracking-wider">동작</th>
                </tr>
              </thead>
              <tbody>
                {SMART_TARGETING_DATA.exceptions.map((ex, i) => (
                  <tr key={i}>
                    <td className="py-4 px-4 text-archival-ink">{i === 0 ? <Target size={16} /> : <Ban size={16} className="text-archival-ink/70" />}</td>
                    <td className="py-4 px-4 text-sm font-archival-serif font-bold text-archival-ink">{ex.type}</td>
                    <td className="py-4 px-4 text-xs text-archival-ink-deep/90 leading-relaxed">{ex.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default SystemDesign;