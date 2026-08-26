import React from 'react';
import { Sword, Axe, Hammer, RefreshCw, Crosshair, Database, Workflow, FileCode, AlertTriangle, ShieldAlert, Skull, Ban } from 'lucide-react';
import { NavItem, SkillTree, PassiveNode } from './types';
import { text } from './content';
import { applyWeaponTexts, getNavItemsFromText } from './content/apply';

export const NAV_ITEMS: NavItem[] = getNavItemsFromText();

// --- 1. CHAINSWORD PASSIVES ---
const CHAIN_SWORD_PASSIVES: PassiveNode[] = [
    // ... (Existing Passive Data - Kept concise for this response, assume existing data is here if not changing) ...
    // --- TIER 5 (MAINS ONLY) ---
    { 
        id: 'CS-T5-A1', tier: 5, side: 'A', type: 'Main', position: 1, 
        name: '만반의 태세', 
        summary: '강인도/피격 보상', 
        description: '피격 시 7초간 강인도 대폭 증가, 효과 지속 중 피격 시마다 받는 피해 10% 증가 (최대 5중첩)', 
        designerIntent: "[광란] 상태에서 공격이 끊기지 않도록 돕는 최종 노드. 공격적인 태세를 유지하면서도 적의 반격에 경직당하지 않는 '최소한의 안전장치'를 부여하여 빌드의 완결성을 제공.",
        tags: ['속도/치명']
    },
    { 
        id: 'CS-T5-A2', tier: 5, side: 'A', type: 'Main', position: 2, 
        name: '분노의 전사', 
        summary: '분노 구간 보상/페널티', 
        description: '분노 50% 이상일 때 스킬 피해량 대폭 증가 / 미만 시에는 방어력 35% 감소', 
        designerIntent: "분노 50% 이상 시 스킬 피해량을 대폭 증가시키고, 미만 시에는 방어력을 감소시키는 노드. 분노 게이지를 유지하는 것이 목표인 빌드에서 중요한 균형 조절 요소로 기능함.",
        tags: ['제어/범위']
    },
    { 
        id: 'CS-T5-B1', tier: 5, side: 'B', type: 'Main', position: 1, 
        name: '무아지경', 
        summary: '연격 분노/피해 보상', 
        description: '액티브 스킬 사용 중 분노 소모 가속화. 5회 이상 공격 적중 시 분노 대폭 생성 및 피해량 50% 증가', 
        designerIntent: "5회 이상 공격 적중 시 분노 대폭 생성 및 피해량 50% 증가. 적을 처치할 때마다 분노를 쌓을 수 있는 플레이를 유도.",
        tags: ['광역/생존']
    },
    { 
        id: 'CS-T5-B2', tier: 5, side: 'B', type: 'Main', position: 2, 
        name: '심판의 무게', 
        summary: '확정 경직/강인도 리스크', 
        description: '분노 100% 달성 시 다음 공격이 반드시 확정 경직 부여. 단, 효과 발동 후 5초간 자신의 강인도 또한 대폭 감소.', 
        designerIntent: "분노를 높이 유지했을 때 확정 경직으로 적을 제압할 수 있는 대신, 발동 후 강인도 감소로 리스크를 부여하는 노드.",
        tags: ['파괴/제압']
    },

    // --- TIER 4 (MAINS + SUBS) ---
    // A-Side Mains
    { 
        id: 'CS-T4-A1', tier: 4, side: 'A', type: 'Main', position: 1, 
        name: '각성', 
        summary: '광란 시 치피/방깍', 
        description: '분노 100% 도달 시 10초간 치명타 피해량 50% 증가, 대신 방어력 30% 추가 감소', 
        designerIntent: "[광란] 진입 시 치명타 피해를 극대화하되 방어력을 추가로 희생시켜, '불완전함의 의도적 설계' 원칙에 따른 극한의 공격 중심 빌드를 완성함.",
        tags: ['속도/치명']
    },
    { 
        id: 'CS-T4-A2', tier: 4, side: 'A', type: 'Main', position: 2, 
        name: '무력의 힘', 
        summary: 'CC 시 분노/공업·스테 소모', 
        description: '적에게 CC 부여 시마다 분노 10 생성 및 공격력 20% 증가, 대신 자신의 스테미나 소모량 20% 증가', 
        designerIntent: "cc를 부여하는 액티브 스킬 위주 플레이를 유도하고, 그만큼 기본 공격과 회피의 효율이 떨어지는 리스크-리턴 노드.",
        tags: ['제어/범위']
    },
    // B-Side Main
    { 
        id: 'CS-T4-B1', tier: 4, side: 'B', type: 'Main', position: 1, 
        name: '관성', 
        summary: '처치 후 무소모 스킬', 
        description: '적을 처치한 후, 다음에 사용하는 액티브 스킬 분노 소모 없음.', 
        designerIntent: "적을 처치할 때마다 분노를 쌓을 수 있는 플레이를 유도.",
        tags: ['광역/순환']
    },
    { 
        id: 'CS-T4-B2', tier: 4, side: 'B', type: 'Main', position: 2, 
        name: '절대적 압박', 
        summary: '분노 시 경직 상승/회피 스테 소모', 
        description: '분노 50% 이상일 때 모든 타격의 경직 부여 수치 30% 증가, 대신 회피 시 스태미나 소모량 20% 증가', 
        designerIntent: "분노를 높이 유지했을 때 경직으로 적을 제압하는 대신, 회피 비용 증가로 리스크를 부여하는 노드.",
        tags: ['파괴/방어']
    },

    // A-Side Subs (2 per branch)
    // A-1 Branch Subs
    { 
        id: 'CS-T4-AS1', tier: 4, side: 'A', type: 'Sub', position: 1, 
        name: '넘치는 힘', 
        summary: '치명타 시 피해/회복', 
        description: '치명타 발생 시마다 피해량 30% 증가, 생명력 3% 회복', 
        designerIntent: "치명타 발생 시 대미지 증가와 생명력 회복을 제공하여, 방어력이 낮은 A-1/B-1 빌드의 유지력을 보완하는 핵심 생존 기믹임.",
        tags: ['공격/분노']
    },
    // A-2 Branch Subs
    { 
        id: 'CS-T4-AS2', tier: 4, side: 'A', type: 'Sub', position: 2, 
        name: '전투 개시', 
        summary: '특수액션 후 기본공격/분노', 
        description: '특수액션 적중 후 기본 공격의 피해량 20% 증가, 분노 생성량 20% 증가', 
        designerIntent: "특수액션 적중 시 기본 공격의 피해량을 증가시키고, 분노 생성량을 증가시키는 노드. 스태마나 소모량이 증가하여 기본 액션을 자주 사용할 수 없는 상황에서 완충제 역할을 함.",
        tags: ['방어/수급']
    },

    // B-Side Subs (Generic for now, not detailed in prompt but kept for structure)
    { 
        id: 'CS-T4-BS1', tier: 4, side: 'B', type: 'Sub', position: 1, 
        name: '순환의 고리', 
        summary: '체인 스킬 적중 시 피해 상승', 
        description: '체인 스킬 적중 시마다 피해량 5% 증가 (10중첩)', 
        designerIntent: "체인 스킬을 적중할수록 피해량이 증가하여, 더 몰아칠 수 있는 플레이를 유도.",
        tags: ['광역/범위']
    },
    { 
        id: 'CS-T4-BS2', tier: 4, side: 'B', type: 'Sub', position: 2, 
        name: '기습의 고리', 
        summary: '체인 스킬 적중 시 경직 강화', 
        description: '체인 스킬 적중 시마다 자신의 경직 부여 수치 5% 강화 (10중첩)', 
        designerIntent: "체인 스킬을 적중할 때마다 경직 부여가 강해져 제압 플레이를 유도.",
        tags: ['디버프']
    },

    // --- TIER 3 (MAINS + SUBS) ---
    // A-Side Mains
    { 
        id: 'CS-T3-A1', tier: 3, side: 'A', type: 'Main', position: 1, 
        name: '광란', 
        summary: '광란 상태 진입', 
        description: '분노 100% 도달 시 [광란] 진입 (사거리 감소, 공속/치명타 피해량/강인도 증가, 받는 피해 및 초당 분노 소모량 증가)', 
        designerIntent: "분노 100% 시 강제 진입하는 하이 리스크-하이 리턴 상태로, 공속/치피 증가라는 리턴을 얻는 대신 사거리 감소와 피해 증가라는 명확한 약점을 노출시켜 긴장감 있는 근접전을 유도함." 
    },
    { 
        id: 'CS-T3-A2', tier: 3, side: 'A', type: 'Main', position: 2, 
        name: '통제 불가', 
        summary: 'CC 대상 추뎀', 
        description: '분노 100% 도달 시 CC 상태 적에게 공격 적중 시마다 30% 추가 피해. 대신 추가 피해 적중 시 자신의 강인도 20% 감소', 
        designerIntent: "분노를 높게 유지할수록 cc 상태 적에게 가하는 피해가 증가. cc를 활용하는 만큼 피격시 자신이 경직 당할 확률도 증가하는 리스크-리턴 노드." 
    },
    // B-Side Mains
    { 
        id: 'CS-T3-B1', tier: 3, side: 'B', type: 'Main', position: 1, 
        name: '학살자', 
        summary: '처치 시 공업/방깍', 
        description: '적 처치 시 공격력 10% 증가하는 대신 방어력 10% 감소 (5중첩)', 
        designerIntent: "적을 처치할수록 공격력이 증가하여, 더 몰아칠 수 있는 플레이를 유도." 
    },
    { 
        id: 'CS-T3-B2', tier: 3, side: 'B', type: 'Main', position: 2, 
        name: '중압', 
        summary: '경직 증가/스테 소모', 
        description: '기본 공격의 경직치가 20% 증가하는 대신 스테미나 소모량도 20% 증가', 
        designerIntent: "기본 공격의 경직치를 증가시키고, 스테미나 소모량도 증가시키는 노드. 스테미나를 높이 유지했을 때 더 빠르게 이동할 수 있는 플레이를 유도." 
    },

    // A-Side Subs
    { 
        id: 'CS-T3-AS1', tier: 3, side: 'A', type: 'Sub', position: 1, 
        name: '몰입', 
        summary: '스테미나 회복', 
        description: '분노가 50% 이상일 때 스테미나 회복량 30% 증가', 
        designerIntent: "분노 50% 이상 시 스테미나 회복력을 지원하여, 지속적인 공격을 가능하게 하며 타 트리의 스테미나 소모 페널티를 완화하는 교차 시너지 노드로 기능함." 
    },
    { 
        id: 'CS-T3-AS2', tier: 3, side: 'A', type: 'Sub', position: 2, 
        name: '분노 유지', 
        summary: '분노 소모 감소', 
        description: '액티브 스킬 분노 소모량 20% 감소', 
        designerIntent: "스킬 사용 빈도가 높은 구간에서 자원 고갈 스트레스를 완화하여, 지속적인 공격 의지를 유지할 수 있도록 돕는 노드." 
    },
    // B-Side Subs
    { 
        id: 'CS-T3-BS1', tier: 3, side: 'B', type: 'Sub', position: 1, 
        name: '강철의 의지', 
        summary: '조건부 강인도', 
        description: '분노가 50% 이상일 때 공격이 적중할 때마다 강인도 10% 강화 (5중첩)', 
        designerIntent: "분노 50% 이상 시 공격이 적중할 때마다 강인도를 강화하여, 자원을 높이 유지했을 때 공격이 끊기지 않는 경험 제공." 
    },
    { 
        id: 'CS-T3-BS2', tier: 3, side: 'B', type: 'Sub', position: 2, 
        name: '빈틈 공략', 
        summary: '경직 시 분노 생성', 
        description: '적 경직 시, 분노 생성량 30% 증가', 
        designerIntent: "적 경직 시 분노 생성량을 증가시키는 노드. 적을 경직시킬 때마다 분노를 쌓을 수 있는 플레이를 유도." 
    },


    // --- TIER 2 (SUBS ONLY - 8 Nodes) ---
    // A-Side Subs (Stacked: 2 for Tree A-1, 2 for Tree A-2)
    { 
        id: 'CS-T2-A1', tier: 2, side: 'A', type: 'Sub', position: 1, 
        name: '전투 집중', 
        summary: '치명타 확률', 
        description: '특수액션 적중 후 5초간 치명타 확률 20% 증가', 
        designerIntent: "특수액션 적중 시 치명타 확률을 높여, 사슬검의 폭발력을 위한 기초 예열 단계를 설계함.",
        tags: ['속도/치명']
    },
    { 
        id: 'CS-T2-A3', tier: 2, side: 'A', type: 'Sub', position: 1, 
        name: '환희', 
        summary: '치명타 시 분노', 
        description: '치명타 적중 시마다 분노 5 생성', 
        designerIntent: "치명타 적중과 분노 생성을 직접 연결하여, 유저의 숙련도(치명타 세팅 및 정확도)에 따라 자원 수급 속도를 차별화함.",
        tags: ['공격/분노']
    },
    { 
        id: 'CS-T2-A2', tier: 2, side: 'A', type: 'Sub', position: 2, 
        name: '활력', 
        summary: '분노 생성', 
        description: '적에게 CC 부여 시 7초간 분노 생성량 10% 증가 (최대 5중첩)', 
        designerIntent: "척력 빌드의 정체성의 기반. CC 기술을 통해 분노를 쌓고, 이를 통해 공격을 지속할 수 있도록 돕는 노드.",
        tags: ['제어/범위']
    },
    { 
        id: 'CS-T2-A4', tier: 2, side: 'A', type: 'Sub', position: 2, 
        name: '샘솟는 분노', 
        summary: '소모량 감소', 
        description: '분노 50% 이상 시 초당 분노 소모량 감소', 
        designerIntent: "분노 50% 이상 시 초당 분노 소모량을 감소하여, 분노를 더 오래 유지할 수 있도록 돕는 노드.",
        tags: ['방어/수급']
    },

    // B-Side Subs (Stacked: 2 for Tree B-1, 2 for Tree B-2)
    { 
        id: 'CS-T2-B1', tier: 2, side: 'B', type: 'Sub', position: 1, 
        name: '효율적 연격', 
        summary: '스테미나 회복', 
        description: '적에게 공격 적중 시마다 스테미나 5 회복 (소량 회복)', 
        designerIntent: "다수의 적과의 난전에 유리한 빌드의 시작점. 다수의 적을 맞추었을 때 의미가 있는 노드." 
    },
    { 
        id: 'CS-T2-B3', tier: 2, side: 'B', type: 'Sub', position: 1, 
        name: '분노 수급', 
        summary: '처치 후 분노', 
        description: '적 처치 후 7초간 모든 공격 적중 시마다 분노 5 생성', 
        designerIntent: "난전을 지속하여 적을 처치할수록 자원 수급이 빨라져, 더 몰아칠 수 있는 플레이를 유도." 
    },
    { 
        id: 'CS-T2-B2', tier: 2, side: 'B', type: 'Sub', position: 2, 
        name: '역전의 기회', 
        summary: '특수액션 분노', 
        description: '특수액션으로 생성하는 분노 수치 30% 증가', 
        designerIntent: "특수액션을 사용할 때마다 분노를 쌓을 수 있는 플레이를 유도." 
    },
    { 
        id: 'CS-T2-B4', tier: 2, side: 'B', type: 'Sub', position: 2, 
        name: '기민한 전진', 
        summary: '이동속도', 
        description: '스테미나 50% 이상일 때 이동속도 20% 증가', 
        designerIntent: "스테미나 50% 이상 시 이동속도를 증가시키는 노드. 스테미나를 높이 유지했을 때 더 빠르게 이동할 수 있는 플레이를 유도." 
    },
];

// --- 2. DUAL AXES PASSIVES (Restored from previous) ---
const DUAL_AXE_PASSIVES: PassiveNode[] = [
    // TIER 5
    { id: 'DA-T5-A1', tier: 5, side: 'A', type: 'Main', position: 1, name: 'A-1: 폭주 기관', summary: '자원 무한 순환', description: '[광전사 궁극] 광기 게이지가 가득 차면 10초간 소모되지 않으며 공격 속도가 50% 증가합니다.', designerIntent: "리스크 관리 성공에 대한 압도적인 보상." },
    { id: 'DA-T5-A2', tier: 5, side: 'A', type: 'Main', position: 2, name: 'A-2: 그림자 밟기', summary: '후방 점멸', description: '[추격 궁극] 적의 후방에서 공격 시 모든 쿨타임이 1초 감소하고, 스테미나를 돌려받습니다.', designerIntent: "끊임없는 백어택 포지셔닝을 유도." },
    { id: 'DA-T5-B1', tier: 5, side: 'B', type: 'Main', position: 1, name: 'B-1: 혈액 폭발', summary: '출혈 스택 폭파', description: '[혈투 궁극] 출혈 5중첩 대상 타격 시 중첩을 모두 소모하여 남은 도트 데미지의 300%를 즉시 입힙니다.', designerIntent: "지속 딜러에게 한방 누킹 능력 부여." },
    { id: 'DA-T5-B2', tier: 5, side: 'B', type: 'Main', position: 2, name: 'B-2: 참수', summary: '즉사 판정', description: '[도살 궁극] 체력 15% 이하인 일반 몬스터를 즉사시키고, 보스에게는 잃은 체력 비례 막대한 피해를 줍니다.', designerIntent: "확실한 마무리 능력(Kill Confirm)." },
    // TIER 4
    { id: 'DA-T4-A1', tier: 4, side: 'A', type: 'Main', position: 1, name: '광기 전환', summary: '체력->자원', description: '체력이 70% 이하일 때 광기 획득량이 2배로 증가합니다.', designerIntent: "로우 라이프(Low Life) 플레이 장려." },
    { id: 'DA-T4-A2', tier: 4, side: 'A', type: 'Main', position: 2, name: '기습', summary: '첫 타격 강화', description: '비전투 상태인 적을 공격할 때 첫 타격이 확정 치명타로 적용됩니다.', designerIntent: "이니시에이팅 강화." },
    { id: 'DA-T4-B1', tier: 4, side: 'B', type: 'Main', position: 1, name: '상처 벌리기', summary: '출혈 지속', description: '출혈의 지속 시간이 50% 증가하고, 치유 효과를 50% 감소시킵니다.', designerIntent: "디버프 유지력." },
    { id: 'DA-T4-B2', tier: 4, side: 'B', type: 'Main', position: 2, name: '학살자', summary: '연속 처치', description: '적 처치 후 5초 내에 다음 적 처치 시 공격력이 10% 중첩 증가합니다.', designerIntent: "다수전 스노우볼링." },
    // TIER 4 Subs
    { id: 'DA-T4-AS1', tier: 4, side: 'A', type: 'Sub', position: 1, name: '아드레날린', summary: '공속 증가', description: '광기 50% 이상일 때 공속 10% 증가', designerIntent: "속도감." },
    { id: 'DA-T4-AS2', tier: 4, side: 'A', type: 'Sub', position: 2, name: '회피 기동', summary: '스테미나 감소', description: '회피 스테미나 소모 20% 감소', designerIntent: "기동성." },
    { id: 'DA-T4-BS1', tier: 4, side: 'B', type: 'Sub', position: 1, name: '피 냄새', summary: '적 탐지', description: '출혈 걸린 적의 위치가 벽 너머로 보임', designerIntent: "추적." },
    { id: 'DA-T4-BS2', tier: 4, side: 'B', type: 'Sub', position: 2, name: '무자비', summary: '경직 증가', description: '체력 50% 이하 적에게 경직치 증가', designerIntent: "제압." },
    // TIER 3
    { id: 'DA-T3-A1', tier: 3, side: 'A', type: 'Main', position: 1, name: '쌍수 연마', summary: '패널티 삭제', description: '쌍수 무기 사용 시 발생하는 명중률 감소 패널티가 삭제됩니다.', designerIntent: "기본기 강화." },
    { id: 'DA-T3-A2', tier: 3, side: 'A', type: 'Main', position: 2, name: '추적자', summary: '이속 증가', description: '적을 향해 이동할 때 이동 속도가 15% 증가합니다.', designerIntent: "접근성." },
    { id: 'DA-T3-B1', tier: 3, side: 'B', type: 'Main', position: 1, name: '톱날', summary: '도트 데미지', description: '기본 공격에 10% 확률로 열상(DoT) 효과를 부여합니다.', designerIntent: "상태이상 시동." },
    { id: 'DA-T3-B2', tier: 3, side: 'B', type: 'Main', position: 2, name: '급소 찌르기', summary: '치명타 피해', description: '치명타 피해량이 20% 증가합니다.', designerIntent: "결정력." },
    // TIER 3 Subs
    { id: 'DA-T3-AS1', tier: 3, side: 'A', type: 'Sub', position: 1, name: '광기', summary: '자원량', description: '최대 광기 수치 증가', designerIntent: "자원." },
    { id: 'DA-T3-AS2', tier: 3, side: 'A', type: 'Sub', position: 2, name: '도약', summary: '점프력', description: '점프 높이 증가', designerIntent: "지형 활용." },
    { id: 'DA-T3-BS1', tier: 3, side: 'B', type: 'Sub', position: 1, name: '숫돌', summary: '내구도', description: '무기 내구도 감소 완화', designerIntent: "유지." },
    { id: 'DA-T3-BS2', tier: 3, side: 'B', type: 'Sub', position: 2, name: '압박', summary: '방깎', description: '공격 시 적 방어력 미세 감소', designerIntent: "누적." },
    // TIER 2
    { id: 'DA-T2-A1', tier: 2, side: 'A', type: 'Sub', position: 1, name: '민첩', summary: '공속', description: '공격 속도 5% 증가', designerIntent: "기초." },
    { id: 'DA-T2-A2', tier: 2, side: 'A', type: 'Sub', position: 2, name: '반사신경', summary: '회피', description: '회피 무적 시간 증가', designerIntent: "생존." },
    { id: 'DA-T2-B1', tier: 2, side: 'B', type: 'Sub', position: 1, name: '잔혹', summary: '공격력', description: '공격력 5% 증가', designerIntent: "기초." },
    { id: 'DA-T2-B2', tier: 2, side: 'B', type: 'Sub', position: 2, name: '예리함', summary: '치명타', description: '치명타 확률 5% 증가', designerIntent: "기초." },
    // TIER 2 Subs
    { id: 'DA-T2-AS1', tier: 2, side: 'A', type: 'Sub', position: 1, name: '준비', summary: '교체', description: '무기 교체 속도 증가', designerIntent: "연계." },
    { id: 'DA-T2-AS2', tier: 2, side: 'A', type: 'Sub', position: 2, name: '탐색', summary: '시야', description: '시야 범위 증가', designerIntent: "정보." },
    { id: 'DA-T2-BS1', tier: 2, side: 'B', type: 'Sub', position: 1, name: '관리', summary: '수리', description: '수리 비용 감소', designerIntent: "경제." },
    { id: 'DA-T2-BS2', tier: 2, side: 'B', type: 'Sub', position: 2, name: '위협', summary: '공포', description: '약한 적 도주 확률', designerIntent: "탐험." },
];

// --- 3. BATTLE AXE PASSIVES (Restored) ---
const BATTLE_AXE_PASSIVES: PassiveNode[] = [
    // TIER 5
    { id: 'BA-T5-A1', tier: 5, side: 'A', type: 'Main', position: 1, name: 'A-1: 파괴신', summary: '풀차징 슈아', description: '[축적 궁극] 3단계 풀차징 공격 시 절대 슈퍼아머 상태가 되며 데미지가 300% 증가합니다.', designerIntent: "하이 리스크 하이 리턴의 정점." },
    { id: 'BA-T5-A2', tier: 5, side: 'A', type: 'Main', position: 2, name: 'A-2: 대지진', summary: '가드 파괴', description: '[분쇄 궁극] 공격이 방어 중인 적을 타격하면 방어를 강제로 해제하고 3초간 기절시킵니다.', designerIntent: "방패병/보스 패턴 파훼." },
    { id: 'BA-T5-B1', tier: 5, side: 'B', type: 'Main', position: 1, name: 'B-1: 인과응보', summary: '반격 확정 치명', description: '[응징 궁극] 퍼펙트 가드 성공 후 3초 내에 가하는 다음 공격은 100% 치명타 및 방어 관통이 적용됩니다.', designerIntent: "피지컬 기반의 카운터 플레이." },
    { id: 'BA-T5-B2', tier: 5, side: 'B', type: 'Main', position: 2, name: 'B-2: 블랙홀', summary: '초광역 끌어당김', description: '[파쇄 궁극] 내려찍기 공격 시 10m 내의 적들을 자신의 앞으로 강제 이동시킵니다.', designerIntent: "진형 붕괴 및 아군 연계 유도." },
    // TIER 4
    { id: 'BA-T4-A1', tier: 4, side: 'A', type: 'Main', position: 1, name: '오버히트', summary: '열기 축적', description: '공격할 때마다 열기가 축적되어 최대 20%의 추가 화염 피해를 입힙니다.', designerIntent: "지속 딜링 강화." },
    { id: 'BA-T4-A2', tier: 4, side: 'A', type: 'Main', position: 2, name: '갑옷 찌그러뜨리기', summary: '영구 방깎', description: '강공격 적중 시 적의 방어력을 영구적으로 5% 감소시킵니다 (최대 5중첩).', designerIntent: "레이드 기여." },
    { id: 'BA-T4-B1', tier: 4, side: 'B', type: 'Main', position: 1, name: '철옹성', summary: '가드 범위', description: '가드 각도가 180도에서 360도로 확장됩니다.', designerIntent: "후방 보호." },
    { id: 'BA-T4-B2', tier: 4, side: 'B', type: 'Main', position: 2, name: '진동', summary: '둔화', description: '공격 적중 시 적의 이동 속도와 공격 속도를 20% 감소시킵니다.', designerIntent: "전투 템포 조절." },
    // TIER 4 Subs
    { id: 'BA-T4-AS1', tier: 4, side: 'A', type: 'Sub', position: 1, name: '가속 차징', summary: '시간 단축', description: '차징 속도 20% 증가', designerIntent: "템포." },
    { id: 'BA-T4-AS2', tier: 4, side: 'A', type: 'Sub', position: 2, name: '파괴 본능', summary: '추뎀', description: '구조물/오브젝트 파괴 시 버프', designerIntent: "환경." },
    { id: 'BA-T4-BS1', tier: 4, side: 'B', type: 'Sub', position: 1, name: '반사', summary: '데미지', description: '가드 시 데미지 반사', designerIntent: "딜탱." },
    { id: 'BA-T4-BS2', tier: 4, side: 'B', type: 'Sub', position: 2, name: '중력', summary: '무게', description: '넉백 저항 증가', designerIntent: "버티기." },
    // TIER 3
    { id: 'BA-T3-A1', tier: 3, side: 'A', type: 'Main', position: 1, name: '힘의 집중', summary: '한방 강화', description: '이동하지 않고 공격 시 데미지가 15% 증가합니다.', designerIntent: "말뚝딜 보상." },
    { id: 'BA-T3-A2', tier: 3, side: 'A', type: 'Main', position: 2, name: '약점 파괴', summary: '부위 파괴', description: '부위 파괴 수치가 50% 증가합니다.', designerIntent: "몬스터 헌팅." },
    { id: 'BA-T3-B1', tier: 3, side: 'B', type: 'Main', position: 1, name: '태산', summary: '넉백 면역', description: '피격 시 밀려나는 거리가 50% 감소합니다.', designerIntent: "포지션 유지." },
    { id: 'BA-T3-B2', tier: 3, side: 'B', type: 'Main', position: 2, name: '충격 흡수', summary: '회복', description: '피격 시 받은 피해의 10%를 5초에 걸쳐 회복합니다.', designerIntent: "유지력." },
    // TIER 3 Subs
    { id: 'BA-T3-AS1', tier: 3, side: 'A', type: 'Sub', position: 1, name: '근력', summary: '스탯', description: '힘 스탯 보정', designerIntent: "기초." },
    { id: 'BA-T3-AS2', tier: 3, side: 'A', type: 'Sub', position: 2, name: '광폭화', summary: '공격력', description: '체력 비례 공격력', designerIntent: "조건부." },
    { id: 'BA-T3-BS1', tier: 3, side: 'B', type: 'Sub', position: 1, name: '체력', summary: '스탯', description: '체력 스탯 보정', designerIntent: "기초." },
    { id: 'BA-T3-BS2', tier: 3, side: 'B', type: 'Sub', position: 2, name: '인내', summary: '저항', description: '상태이상 저항', designerIntent: "방어." },
    // TIER 2
    { id: 'BA-T2-A1', tier: 2, side: 'A', type: 'Sub', position: 1, name: '무거운 일격', summary: '경직', description: '기본 공격의 경직치 증가', designerIntent: "기초." },
    { id: 'BA-T2-A2', tier: 2, side: 'A', type: 'Sub', position: 2, name: '학살', summary: '범위', description: '기본 공격 범위 증가', designerIntent: "기초." },
    { id: 'BA-T2-B1', tier: 2, side: 'B', type: 'Sub', position: 1, name: '철갑', summary: '방어력', description: '기본 방어력 10% 증가', designerIntent: "기초." },
    { id: 'BA-T2-B2', tier: 2, side: 'B', type: 'Sub', position: 2, name: '수호', summary: '체력', description: '최대 체력 10% 증가', designerIntent: "기초." },
    // TIER 2 Subs
    { id: 'BA-T2-AS1', tier: 2, side: 'A', type: 'Sub', position: 1, name: '무게', summary: '소지량', description: '무게 한도 증가', designerIntent: "유틸." },
    { id: 'BA-T2-AS2', tier: 2, side: 'A', type: 'Sub', position: 2, name: '파괴', summary: '채굴', description: '채굴 속도 증가', designerIntent: "생활." },
    { id: 'BA-T2-BS1', tier: 2, side: 'B', type: 'Sub', position: 1, name: '요리', summary: '버프', description: '음식 효과 증가', designerIntent: "도핑." },
    { id: 'BA-T2-BS2', tier: 2, side: 'B', type: 'Sub', position: 2, name: '휴식', summary: '회복', description: '앉기 회복량 증가', designerIntent: "유지." },
];

export const _WEAPON_DATA_STRUCT: SkillTree[] = [
  // ... (Skill Trees kept same, abbreviated for response length) ...
  {
    name: "사슬검",
    description: "사거리 조절과 변칙적인 반격을 통해 중거리에서 전장을 통제합니다.",
    mechanic: "특수 액션: 끌어당기기 / 고정 대시 / 분노 생성",
    icon: <Sword className="w-5 h-5" />,
    passiveTree: CHAIN_SWORD_PASSIVES, 
    basicAttack: {
      name: "기본 공격",
      description: "빠른 속도로 적을 제압하는 3연타 콤보 공격입니다.",
      steps: [
        { step: 1, name: "기본 공격 1타", input: "LMB", description: "좌측 사슬검을 사선으로 빠르게 베어 피해를 줌.", frameData: { start: 40, active: 32, recovery: 68, total: 140, c: 40 }, designIntent: "사슬이 돌아오는 관성 표현을 위해 후딜 프레임을 더 길게 조정." },
        { step: 2, name: "기본 공격 2타", input: "LMB", description: "양쪽 사슬검을 사선으로 빠르게 베어 피해를 줌.", frameData: { start: 60, active: 28, recovery: 84, total: 172, c: 48 }, designIntent: "다음 기본공격과의 연계를 위해 캔슬 프레임을 보다 짧게 설정." },
        { step: 3, name: "기본 공격 3타", input: "LMB", description: "양쪽 사슬검을 전방을 향해 내려찍어 큰 피해를 줌.", frameData: { start: 64, active: 36, recovery: 96, total: 196, c: 56 }, designIntent: "연속 공격의 마지막으로, 리스크에 기반하여 기본 공격 중 가장 큰 피해량을 가짐." }
      ]
    },
    specialAction: {
      name: "특수 액션",
      description: "사슬을 던져 적을 끌어오거나, 벽 또는 적에 고정하여 돌진.",
      mechanic: "적중 시 분노 자원 획득, Hold 입력 시 홀딩 상태 유지",
      frameData: { start: 28, active: 28, recovery: 60, total: 116, c: 36 },
      designIntent: "온몸으로 돌진하는 동작의 무게감을 살리기 위해, 돌진하는 공격의 캔슬 프레임을 더 늦게 설정.",
      frameDataLabel: "적을 끌어당길 때",
      frameDataAlt: { label: "벽 또는 적에 고정해서 돌진할 때", frameData: { start: 32, active: 28, recovery: 60, total: 120, c: 48 } }
    },
    movementAttackSteps: [
      { step: 1, name: "회피 공격 (앞)", input: "—", description: "앞으로 회피 후, 사슬검을 짧게 잡아 내려치며 공격.", frameData: { start: 28, active: 20, recovery: 64, total: 112, c: 40 }, designIntent: "사거리가 짧아지는 대신 보다 빠르게 공격 가능." },
      { step: 2, name: "회피 공격 (뒤)", input: "—", description: "뒤로 회피 후, 전진하며 사슬검을 올려쳐 공격.", frameData: { start: 32, active: 28, recovery: 76, total: 136, c: 44 }, designIntent: "뒤로 회피하여 멀어진 거리만큼 전진하여 공격." },
      { step: 3, name: "전력질주 공격", input: "—", description: "전력질주 중 양쪽 사슬검을 올려치며 공격.", frameData: { start: 48, active: 20, recovery: 72, total: 140, c: 40 }, designIntent: "선딜은 일반 평타와 비슷하지만, 반동을 이용해 훨씬 빠르게 공격." }
    ],
    stances: [
      {
        id: "A-1", name: "섬영", concept: "근접 난무 특화", keywords: ["고속연타", "치명타특화", "근접"],
        description: "사슬검을 짧게 잡아 빠른 속도로 반격하여 치명타를 가하는 전진형 스타일.",
        flowSteps: ["적 당기기", "피격 시 즉시 반격", "광란 상태의 고속 연타"],
        descriptionPoints: ["스킬 사용 중 피격 시 즉각적인 후속타 연계 가능", "매 타격 시 치명타 확률 중첩 및 강인도 보정"],
        furyTrigger: "분노 100% 도달 시 [광란] 돌입",
        furyEffect: "사거리 감소 대신 기본 공격 속도·치명타 피해 대폭 증가",
        furyRisk: "받는 피해 증가 및 초당 분노 소모량 증가"
      },
      {
        id: "A-2", name: "척력", concept: "거리 유지 및 통제", keywords: ["접근봉쇄", "군중제어(cc)", "유틸리티통제"],
        description: "사슬의 척력으로 적을 튕겨내며 접근을 원천 봉쇄하는 거리 유지 스타일.",
        flowSteps: ["사슬로 적 튕겨내기", "CC기 부여", "고분노 상태 유틸 통제"],
        descriptionPoints: ["사슬검을 휘둘러 그 척력으로 적을 튕겨내는 유틸 성능", "적에게 CC 부여 시 분노 생성량 및 공격력 증가"],
        furyTrigger: "분노 수치가 높을수록 튕겨내기·유틸리티 성능 강화",
        furyEffect: "분노 50% 이상 시 스태미나 회복 증가, 분노 소모량 감소",
        furyRisk: "추가 피해 적중 시 자신의 강인도 대폭 감소"
      },
      {
        id: "B-1", name: "원무", concept: "광역 지속 딜링", keywords: ["광역", "처치보상", "무한동력"],
        description: "사슬을 횡으로 휘둘러 다수의 적을 휩쓸며 전장을 장악하는 광역 스타일.",
        flowSteps: ["광역 회전 베기", "적 처치", "패시브 효과 기반 스킬 연속 사용"],
        descriptionPoints: ["회전 베기 및 원형 타격을 통한 다수 대상 분노 수급", "적 처치 시 공격력 증가·방어력 감소 (하이 리스크 중첩)"],
        furyTrigger: "적 처치 후 일정 시간 타격 시 분노 생성량 증폭",
        furyEffect: "처치 후 다음 액티브 스킬 분노 소모 0",
        furyRisk: "연속 스킬 사용 시마다 적의 공격에 노출"
      },
      {
        id: "B-2", name: "중압", concept: "무력화 및 강타", keywords: ["무력화특화", "경직연계", "확정그로기"],
        description: "사슬의 반동과 무게감을 실어 적의 방어에 '균열'을 만드는 무력화 스타일.",
        flowSteps: ["사슬 공격", "무력화 저항 감소", "확정 경직 연계로 그로기 유도"],
        descriptionPoints: ["사슬 공격으로 무력화 게이지 갉아먹는 이미지", "적 경직 시 무력화 저항력 감소 디버프 상시 부여"],
        furyTrigger: "분노 100% 달성 시 다음 공격 확정 경직 부여",
        furyEffect: "분노 70% 이상 시 모든 타격 경직치 증가",
        furyRisk: "기본 공격 경직치 증가 시 스태미나 소모량 동시 증가"
      }
    ],
    activeSkills: [
      { id: "CS_01", name: "휩쓸기", frameData: { start: 10, active: 8, recovery: 12, total: 30 }, specs: { radius: "300", angle: "120°", damage: "150% x 2", resource: "None" }, designIntent: "Tree A: 견제 및 시동기", meaningfulChoice: "속도(A-1) vs 사거리(A-2)", variants: [{name:"",type:"Damage",description:""}, {name:"",type:"Utility",description:""}], evolution: { pathA: { name: "Type A-1: 섬영", concept: "고속 연타", nodes: [{ tier: 1, name: "경량화", type: "Utility", description: "공속 20% 증가", synergyPassiveIds: ['CS-T3-A1'], insight: "선딜레이 감소" }, { tier: 2, name: "잔상 베기", type: "Damage", description: "3회 추가 타격", synergyPassiveIds: ['CS-T4-A1'], insight: "타수 증가" }] }, pathB: { name: "Type A-2: 척력", concept: "사거리 증가", nodes: [{ tier: 1, name: "사슬 연장", type: "Utility", description: "사거리 30% 증가", synergyPassiveIds: ['CS-T3-A2'], insight: "팁 히트 용이" }, { tier: 2, name: "밀쳐내기", type: "Control", description: "적중 시 넉백", synergyPassiveIds: ['CS-T5-A2'], insight: "거리 벌리기" }] } } },
      { id: "CS_02", name: "사슬 베기", frameData: { start: 14, active: 6, recovery: 18, total: 38 }, specs: { radius: "400", angle: "90°", damage: "220%", resource: "10 Fury" }, designIntent: "Tree A: 주력 딜링기", meaningfulChoice: "치명타(A-1) vs 견제(A-2)", variants: [{name:"",type:"Damage",description:""}, {name:"",type:"Utility",description:""}], evolution: { pathA: { name: "Type A-1: 섬영", concept: "급소 타격", nodes: [{ tier: 1, name: "약점 포착", type: "Damage", description: "치명타 확률 30% 보정", synergyPassiveIds: ['CS-T2-A1'], insight: "누킹" }, { tier: 2, name: "참수", type: "Damage", description: "체력 30% 이하 적에게 50% 추뎀", synergyPassiveIds: ['CS-T5-A1'], insight: "킬 캐치" }] }, pathB: { name: "Type A-2: 척력", concept: "원거리 저격", nodes: [{ tier: 1, name: "충격파", type: "Range", description: "검기 발사 (원거리)", synergyPassiveIds: ['CS-T3-A2'], insight: "안전 거리 확보" }, { tier: 2, name: "관통", type: "Utility", description: "적을 관통하여 뒤의 적 타격", synergyPassiveIds: ['CS-T4-A2'], insight: "라인 클리어" }] } } },
      { id: "CS_03", name: "사슬 도약", frameData: { start: 20, active: 12, recovery: 24, total: 56 }, specs: { radius: "350", angle: "360°", damage: "300%", resource: "20 Fury" }, designIntent: "Tree A: 진입/이탈기", meaningfulChoice: "접근(A-1) vs 회피(A-2)", variants: [{name:"",type:"Damage",description:""}, {name:"",type:"Utility",description:""}], evolution: { pathA: { name: "Type A-1: 섬영", concept: "강습", nodes: [{ tier: 1, name: "신속 도약", type: "Utility", description: "체공 시간 감소, 즉시 낙하", synergyPassiveIds: ['CS-T3-A1'], insight: "빠른 템포" }, { tier: 2, name: "추격", type: "Damage", description: "타겟 대상에게 유도 성능 추가", synergyPassiveIds: ['CS-T4-A1'], insight: "추노" }] }, pathB: { name: "Type A-2: 척력", concept: "후퇴 사격", nodes: [{ tier: 1, name: "백덤블링", type: "Survival", description: "뒤로 도약하며 공격", synergyPassiveIds: ['CS-T3-AS2'], insight: "카이팅" }, { tier: 2, name: "지뢰 설치", type: "Control", description: "도약 위치에 폭발물 설치", synergyPassiveIds: ['CS-T5-A2'], insight: "진입 차단" }] } } },
      { id: "CS_04", name: "붕괴의 일격", frameData: { start: 25, active: 10, recovery: 30, total: 65 }, specs: { radius: "500", angle: "Target", damage: "400%", resource: "30 Fury" }, designIntent: "Tree A: 마무리 일격", meaningfulChoice: "연타(A-1) vs 한방(A-2)", variants: [{name:"",type:"Damage",description:""}, {name:"",type:"Utility",description:""}], evolution: { pathA: { name: "Type A-1: 섬영", concept: "난무", nodes: [{ tier: 1, name: "연속 찌르기", type: "Damage", description: "5연타로 변경", synergyPassiveIds: ['CS-T4-A1'], insight: "타수 누적" }, { tier: 2, name: "광란", type: "Utility", description: "적중 시 공속 버프 획득", synergyPassiveIds: ['CS-T5-A1'], insight: "무한 가속" }] }, pathB: { name: "Type A-2: 척력", concept: "저격", nodes: [{ tier: 1, name: "차징", type: "Damage", description: "모으기 가능, 사거리 2배", synergyPassiveIds: ['CS-T3-A2'], insight: "원거리 누킹" }, { tier: 2, name: "헤드샷", type: "Damage", description: "약점 적중 시 데미지 2배", synergyPassiveIds: ['CS-T4-A2'], insight: "정밀 타격" }] } } },
      { id: "CS_05", name: "회전 베기", frameData: { start: 12, active: 40, recovery: 15, total: 67 }, specs: { radius: "250", angle: "360°", damage: "40% x 4", resource: "None" }, designIntent: "Tree B: 광역 견제", meaningfulChoice: "이동(B-1) vs 방어(B-2)", variants: [{name:"",type:"Damage",description:""}, {name:"",type:"Utility",description:""}], evolution: { pathA: { name: "Type B-1: 원무", concept: "이동형 휠윈드", nodes: [{ tier: 1, name: "무빙", type: "Utility", description: "시전 중 이동 가능", synergyPassiveIds: ['CS-T4-B1'], insight: "진형 붕괴" }, { tier: 2, name: "가속 회전", type: "Damage", description: "회전 속도 및 타수 증가", synergyPassiveIds: ['CS-T5-B1'], insight: "DPS 상승" }] }, pathB: { name: "Type B-2: 중압", concept: "제자리 방어", nodes: [{ tier: 1, name: "강철의 벽", type: "Survival", description: "투사체 삭제 및 방어력 증가", synergyPassiveIds: ['CS-T3-B2'], insight: "탱킹" }, { tier: 2, name: "반격", type: "Damage", description: "피격 시 충격파 발생", synergyPassiveIds: ['CS-T4-B2'], insight: "카운터" }] } } },
      { id: "CS_06", name: "사슬 강타", frameData: { start: 18, active: 6, recovery: 20, total: 44 }, specs: { radius: "600", angle: "Line", damage: "250%", resource: "15 Fury" }, designIntent: "Tree B: 라인 클리어", meaningfulChoice: "집결(B-1) vs 파괴(B-2)", variants: [{name:"",type:"Damage",description:""}, {name:"",type:"Utility",description:""}], evolution: { pathA: { name: "Type B-1: 원무", concept: "몹 몰이", nodes: [{ tier: 1, name: "자력", type: "Control", description: "적을 중앙으로 끌어당김", synergyPassiveIds: ['CS-T4-BS1'], insight: "광역 연계 준비" }, { tier: 2, name: "연쇄 폭발", type: "Damage", description: "모인 적에게 광역 폭발", synergyPassiveIds: ['CS-T3-BS1'], insight: "쓸어담기" }] }, pathB: { name: "Type B-2: 중압", concept: "지진", nodes: [{ tier: 1, name: "여진", type: "Control", description: "광역 둔화 지대 생성", synergyPassiveIds: ['CS-T5-BS2'], insight: "지역 장악" }, { tier: 2, name: "분쇄", type: "Damage", description: "넘어진 적에게 2배 피해", synergyPassiveIds: ['CS-T5-B2'], insight: "확인 사살" }] } } },
      { id: "CS_07", name: "솟아나는 칼날", frameData: { start: 12, active: 8, recovery: 16, total: 36 }, specs: { radius: "250", angle: "Front", damage: "200%", resource: "10 Fury" }, designIntent: "Tree B: 에어본/CC", meaningfulChoice: "범위(B-1) vs 슈퍼아머(B-2)", variants: [{name:"",type:"Damage",description:""}, {name:"",type:"Utility",description:""}], evolution: { pathA: { name: "Type B-1: 원무", concept: "칼날 폭풍", nodes: [{ tier: 1, name: "확산", type: "Range", description: "공격 범위가 원형으로 변경", synergyPassiveIds: ['CS-T5-BS1'], insight: "사각지대 제거" }, { tier: 2, name: "칼날 비", type: "Damage", description: "공중에 뜬 적에게 추가 타격", synergyPassiveIds: ['CS-T3-BS1'], insight: "공중 콤보" }] }, pathB: { name: "Type B-2: 중압", concept: "화산 폭발", nodes: [{ tier: 1, name: "용암", type: "Damage", description: "화상 장판 생성", synergyPassiveIds: ['CS-T4-B2'], insight: "지속 딜링" }, { tier: 2, name: "분출", type: "Control", description: "슈퍼아머 상태로 시전, 에어본 강화", synergyPassiveIds: ['CS-T3-B2'], insight: "강제 이니시" }] } } },
      { id: "CS_08", name: "강철 회오리", frameData: { start: 20, active: 60, recovery: 30, total: 110 }, specs: { radius: "450", angle: "360°", damage: "80% x N", resource: "Continuous Fury" }, designIntent: "Tree B: 결전기", meaningfulChoice: "지속(B-1) vs 한방(B-2)", variants: [{name:"",type:"Damage",description:""}, {name:"",type:"Utility",description:""}], evolution: { pathA: { name: "Type B-1: 원무", concept: "죽음의 무도", nodes: [{ tier: 1, name: "피의 축제", type: "Survival", description: "타격 당 체력 회복", synergyPassiveIds: ['CS-T5-B1'], insight: "불사신" }, { tier: 2, name: "폭풍의 눈", type: "Control", description: "적을 계속 중심부로 당김", synergyPassiveIds: ['CS-T4-BS1'], insight: "블랙홀" }] }, pathB: { name: "Type B-2: 중압", concept: "대지 파괴", nodes: [{ tier: 1, name: "압축", type: "Utility", description: "범위는 줄어들지만 데미지 3배", synergyPassiveIds: ['CS-T2-B2'], insight: "보스 딜링" }, { tier: 2, name: "대폭발", type: "Damage", description: "피니시 동작 추가 (핵폭발)", synergyPassiveIds: ['CS-T5-B2'], insight: "전멸기" }] } } }
    ],
    passives: []
  },
  // ... Dual Axe & Battle Axe (kept same as previous) ...
  {
    name: "쌍도끼",
    description: "광기 자원을 활용하여 쉼 없이 몰아치며 순간적인 폭딜을 쏟아냅니다.",
    mechanic: "광기(Rage): 공격 시 축적, 최대치 도달 시 폭주 상태 돌입",
    icon: <Axe className="w-5 h-5" />,
    passiveTree: DUAL_AXE_PASSIVES,
    basicAttack: {
      name: "기본 공격",
      description: "좌우 도끼를 번갈아 휘두르는 3연타 공격입니다.",
      steps: [
        { step: 1, name: "기본 공격 1타", input: "LMB", description: "빠른 사선 베기", frameData: { start: 28, active: 8, recovery: 41, total: 77, c: 14, a1: 2, a2: 6 } },
        { step: 2, name: "기본 공격 2타", input: "LMB", description: "반대쪽 사선 베기", frameData: { start: 20, active: 8, recovery: 44, total: 72, c: 10, a1: 2, a2: 6 } },
        { step: 3, name: "기본 공격 3타", input: "LMB", description: "양손 동시 공격", frameData: { start: 22, active: 10, recovery: 41, total: 73, c: 28, a1: 2, a2: 8 } }
      ]
    },
    specialAction: {
      name: "돌진",
      description: "자신의 체력을 소모하여 즉시 광기 게이지를 채우고 공격력을 강화합니다.",
      mechanic: "체력 10% 소모 -> 광기 30% 회복",
      frameData: { start: 33, active: 20, recovery: 45, total: 98, c: 16, a1: 3, a2: 17 }
    },
    movementAttackSteps: [
      { step: 1, name: "회피 공격 (앞)", input: "—", description: "앞으로 회피 후 쌍도끼로 공격.", frameData: { start: 13, active: 5, recovery: 47, total: 65, c: 10, a1: 2, a2: 3 } },
      { step: 2, name: "회피 공격 (뒤)", input: "—", description: "뒤로 회피 후 쌍도끼로 공격.", frameData: { start: 22, active: 4, recovery: 54, total: 80, c: 16 } },
      { step: 3, name: "전력질주 공격", input: "—", description: "전력질주 중 쌍도끼로 공격.", frameData: { start: 18, active: 18, recovery: 49, total: 85, c: 12, a1: 3, a2: 15 } }
    ],
    stances: [
      { id: "A-1", name: "광전사", concept: "고속 지속 딜링", keywords: ["공속", "폭주", "난무"], description: "방어를 포기하고 극한의 공격 속도로 적을 압살하는 스타일." },
      { id: "A-2", name: "추격", concept: "기동성 및 백어택", keywords: ["이동", "배후", "회피"], description: "빠른 기동성으로 적의 사각을 파고들어 치명상을 입히는 스타일." },
      { id: "B-1", name: "혈투", concept: "출혈 및 광역", keywords: ["도트", "확산", "흡혈"], description: "적에게 출혈을 강요하고 피 냄새를 맡아 더욱 강해지는 스타일." },
      { id: "B-2", name: "도살", concept: "처형 및 누킹", keywords: ["한방", "마무리", "파괴"], description: "약해진 적을 확실하게 끝장내는 결정타 위주의 스타일." }
    ],
    activeSkills: [
       // ... (All Dual Axe Active Skills) ...
       { id: "DA_01", name: "광란의 춤", frameData: { start: 8, active: 30, recovery: 12, total: 50 }, specs: { radius: "200", angle: "180°", damage: "80% x 6", resource: "Stamina" }, designIntent: "Tree A: DPS 시동기", meaningfulChoice: "지속(A-1) vs 이동(A-2)", variants: [{name:"",type:"Damage",description:""}, {name:"",type:"Utility",description:""}], evolution: { pathA: { name: "Type A-1: 광전사", concept: "무한 난무", nodes: [{ tier: 1, name: "가속", type: "Utility", description: "타격 당 공속 증가", synergyPassiveIds: ['DA-T4-AS1'], insight: "가속" }, { tier: 2, name: "광기 흡수", type: "Damage", description: "타격 당 광기 회복", synergyPassiveIds: ['DA-T5-A1'], insight: "자원" }] }, pathB: { name: "Type A-2: 추격", concept: "돌진 난무", nodes: [{ tier: 1, name: "전진", type: "Utility", description: "앞으로 이동하며 공격", synergyPassiveIds: ['DA-T3-A2'], insight: "접근" }, { tier: 2, name: "회전", type: "Damage", description: "백어택 판정 범위 증가", synergyPassiveIds: ['DA-T5-A2'], insight: "위치" }] } } },
       { id: "DA_02", name: "도약 찍기", frameData: { start: 15, active: 8, recovery: 18, total: 41 }, specs: { radius: "300", angle: "Circle", damage: "250%", resource: "10 Rage" }, designIntent: "Tree A: 진입기", meaningfulChoice: "충격(A-1) vs 기습(A-2)", variants: [{name:"",type:"Damage",description:""}, {name:"",type:"Utility",description:""}], evolution: { pathA: { name: "Type A-1: 광전사", concept: "충격파", nodes: [{ tier: 1, name: "지진", type: "Range", description: "착지 시 충격파 발생", synergyPassiveIds: ['DA-T2-B1'], insight: "광역" }, { tier: 2, name: "연속 도약", type: "Damage", description: "적 처치 시 쿨타임 초기화", synergyPassiveIds: ['DA-T4-A1'], insight: "리셋" }] }, pathB: { name: "Type A-2: 추격", concept: "암살", nodes: [{ tier: 1, name: "은밀", type: "Utility", description: "공중에서 타겟팅 불가", synergyPassiveIds: ['DA-T2-A2'], insight: "생존" }, { tier: 2, name: "급습", type: "Damage", description: "비인식 대상 2배 피해", synergyPassiveIds: ['DA-T4-A2'], insight: "첫타" }] } } },
       { id: "DA_03", name: "이중 투척", frameData: { start: 12, active: 20, recovery: 14, total: 46 }, specs: { radius: "800", angle: "Line", damage: "150% x 2", resource: "None" }, designIntent: "Tree A: 원거리 견제", meaningfulChoice: "관통(A-1) vs 이동(A-2)", variants: [{name:"",type:"Damage",description:""}, {name:"",type:"Utility",description:""}], evolution: { pathA: { name: "Type A-1: 광전사", concept: "분쇄", nodes: [{ tier: 1, name: "회전날", type: "Damage", description: "도끼가 제자리에서 회전하며 다단히트", synergyPassiveIds: ['DA-T3-B1'], insight: "누적딜" }, { tier: 2, name: "폭발", type: "Damage", description: "회수 시 폭발", synergyPassiveIds: ['DA-T5-A1'], insight: "마무리" }] }, pathB: { name: "Type A-2: 추격", concept: "순간이동", nodes: [{ tier: 1, name: "그림자 이동", type: "Utility", description: "도끼 위치로 순간이동", synergyPassiveIds: ['DA-T5-A2'], insight: "기동" }, { tier: 2, name: "잔상", type: "Damage", description: "이동 경로에 데미지", synergyPassiveIds: ['DA-T2-A2'], insight: "유틸" }] } } },
       { id: "DA_04", name: "광폭화", frameData: { start: 0, active: 20, recovery: 10, total: 30 }, specs: { radius: "Self", angle: "None", damage: "Buff", resource: "20 HP" }, designIntent: "Tree A: 버프기", meaningfulChoice: "공격(A-1) vs 속도(A-2)", variants: [{name:"",type:"Damage",description:""}, {name:"",type:"Utility",description:""}], evolution: { pathA: { name: "Type A-1: 광전사", concept: "불사", nodes: [{ tier: 1, name: "고통 무시", type: "Survival", description: "받는 피해 30% 감소", synergyPassiveIds: ['DA-T5-AS1'], insight: "탱킹" }, { tier: 2, name: "피의 대가", type: "Damage", description: "잃은 체력 비례 공업", synergyPassiveIds: ['DA-T4-A1'], insight: "배수진" }] }, pathB: { name: "Type A-2: 추격", concept: "신속", nodes: [{ tier: 1, name: "바람", type: "Utility", description: "이속 50% 증가", synergyPassiveIds: ['DA-T5-AS2'], insight: "추노" }, { tier: 2, name: "프리패스", type: "Utility", description: "충돌 무시 및 둔화 면역", synergyPassiveIds: ['DA-T3-A2'], insight: "돌파" }] } } },
       { id: "DA_05", name: "피의 회오리", frameData: { start: 15, active: 40, recovery: 20, total: 75 }, specs: { radius: "400", angle: "Circle", damage: "100% x 5", resource: "20 Rage" }, designIntent: "Tree B: 광역 딜링", meaningfulChoice: "출혈(B-1) vs 처형(B-2)", variants: [{name:"",type:"Damage",description:""}, {name:"",type:"Utility",description:""}], evolution: { pathA: { name: "Type B-1: 혈투", concept: "혈폭풍", nodes: [{ tier: 1, name: "피뿌리기", type: "Range", description: "범위 증가 및 출혈 부여", synergyPassiveIds: ['DA-T4-B1'], insight: "광역" }, { tier: 2, name: "과다출혈", type: "Damage", description: "출혈 대상 추뎀", synergyPassiveIds: ['DA-T5-B1'], insight: "조건부" }] }, pathB: { name: "Type B-2: 도살", concept: "믹서기", nodes: [{ tier: 1, name: "강철날", type: "Damage", description: "방어 관통 50%", synergyPassiveIds: ['DA-T2-B2'], insight: "관통" }, { tier: 2, name: "끌어오기", type: "Control", description: "적을 중앙으로 당김", synergyPassiveIds: ['DA-T4-BS2'], insight: "몰이" }] } } },
       { id: "DA_06", name: "십자 베기", frameData: { start: 20, active: 6, recovery: 24, total: 50 }, specs: { radius: "300", angle: "120°", damage: "400%", resource: "15 Rage" }, designIntent: "Tree B: 누킹기", meaningfulChoice: "상처(B-1) vs 절단(B-2)", variants: [{name:"",type:"Damage",description:""}, {name:"",type:"Utility",description:""}], evolution: { pathA: { name: "Type B-1: 혈투", concept: "깊은 상처", nodes: [{ tier: 1, name: "동맥 절단", type: "Damage", description: "출혈 스택 즉시 최대", synergyPassiveIds: ['DA-T3-B1'], insight: "디버프" }, { tier: 2, name: "흡혈", type: "Survival", description: "데미지 50% 회복", synergyPassiveIds: ['DA-T5-B1'], insight: "생존" }] }, pathB: { name: "Type B-2: 도살", concept: "단두대", nodes: [{ tier: 1, name: "처형인", type: "Damage", description: "체력 30% 이하 치명타", synergyPassiveIds: ['DA-T5-B2'], insight: "마무리" }, { tier: 2, name: "초기화", type: "Utility", description: "처치 시 쿨타임 초기화", synergyPassiveIds: ['DA-T4-B2'], insight: "연속" }] } } },
       { id: "DA_07", name: "대지 강타", frameData: { start: 25, active: 10, recovery: 30, total: 65 }, specs: { radius: "600", angle: "Cone", damage: "300%", resource: "10 Rage" }, designIntent: "Tree B: 견제기", meaningfulChoice: "확산(B-1) vs 파괴(B-2)", variants: [{name:"",type:"Damage",description:""}, {name:"",type:"Utility",description:""}], evolution: { pathA: { name: "Type B-1: 혈투", concept: "오염지대", nodes: [{ tier: 1, name: "독성", type: "Control", description: "장판 생성 (이속감소)", synergyPassiveIds: ['DA-T4-BS1'], insight: "지역장악" }, { tier: 2, name: "전염", type: "Damage", description: "상태이상 전이", synergyPassiveIds: ['DA-T5-BS1'], insight: "확산" }] }, pathB: { name: "Type B-2: 도살", concept: "지진", nodes: [{ tier: 1, name: "충격", type: "Control", description: "스턴 유발", synergyPassiveIds: ['DA-T4-BS2'], insight: "무력화" }, { tier: 2, name: "파쇄", type: "Damage", description: "보호막 파괴", synergyPassiveIds: ['DA-T2-B2'], insight: "유틸" }] } } },
       { id: "DA_08", name: "난도질", frameData: { start: 10, active: 60, recovery: 30, total: 100 }, specs: { radius: "200", angle: "Front", damage: "50% x 8", resource: "30 Rage" }, designIntent: "Tree B: 폭딜기", meaningfulChoice: "가속(B-1) vs 묵직(B-2)", variants: [{name:"",type:"Damage",description:""}, {name:"",type:"Utility",description:""}], evolution: { pathA: { name: "Type B-1: 혈투", concept: "피의 축제", nodes: [{ tier: 1, name: "가속", type: "Utility", description: "타격마다 공속 증가", synergyPassiveIds: ['DA-T4-AS1'], insight: "DPS" }, { tier: 2, name: "폭발", type: "Damage", description: "마지막 타격 시 출혈 폭발", synergyPassiveIds: ['DA-T5-B1'], insight: "피니시" }] }, pathB: { name: "Type B-2: 도살", concept: "무자비", nodes: [{ tier: 1, name: "슈퍼아머", type: "Survival", description: "시전 중 경직 면역", synergyPassiveIds: ['DA-T5-AS1'], insight: "맞딜" }, { tier: 2, name: "확인사살", type: "Damage", description: "모든 타격 치명타", synergyPassiveIds: ['DA-T3-B2'], insight: "누킹" }] } } }
    ],
    passives: []
  },
  // ... Battle Axe (kept same as previous) ...
  {
    name: "전투도끼",
    description: "높은 강인도로 적의 공격을 받아내며 묵직한 한 방으로 궤멸시킵니다.",
    mechanic: "열기(Heat): 공격 시 차오르며, 일정 수치 이상 시 공격력 강화 및 화염 피해",
    icon: <Hammer className="w-5 h-5" />,
    passiveTree: BATTLE_AXE_PASSIVES,
    basicAttack: {
      name: "기본 공격",
      description: "느리지만 강력한 3연타 공격입니다. 슈퍼아머가 적용됩니다.",
      steps: [
        { step: 1, name: "기본 공격 1타", input: "LMB", description: "수직 강타", frameData: { start: 68, active: 16, recovery: 96, total: 180, c: 48 } },
        { step: 2, name: "기본 공격 2타", input: "LMB", description: "적을 띄우는 상단 공격", frameData: { start: 30, active: 20, recovery: 84, total: 134, c: 40 } },
        { step: 3, name: "기본 공격 3타", input: "LMB", description: "넓은 범위를 타격", frameData: { start: 64, active: 28, recovery: 88, total: 180, c: 48 } }
      ]
    },
    specialAction: {
      name: "철벽 방어",
      description: "도끼 자루로 적의 공격을 막습니다. 타이밍에 맞춰 사용 시 튕겨냅니다.",
      mechanic: "가드 성공 시 열기 획득, 퍼펙트 가드 시 적 경직",
      frameData: { start: 33, active: 3, recovery: 45, total: 81, c: 16 }
    },
    movementAttackSteps: [
      { step: 1, name: "회피 공격 (앞)", input: "—", description: "앞으로 회피 후 전투도끼로 공격.", frameData: { start: 36, active: 20, recovery: 70, total: 126, c: 50 } },
      { step: 2, name: "회피 공격 (뒤)", input: "—", description: "뒤로 회피 후 전투도끼로 공격.", frameData: { start: 40, active: 16, recovery: 68, total: 124, c: 48 } },
      { step: 3, name: "전력질주 공격", input: "—", description: "전력질주 중 전투도끼로 공격.", frameData: { start: 44, active: 16, recovery: 76, total: 136, c: 36 } }
    ],
    stances: [
      { id: "A-1", name: "축적", concept: "차징 및 한방", keywords: ["모으기", "슈퍼아머", "인내"], description: "적의 공격을 버티며 힘을 모아 강력한 카운터 한 방을 날리는 스타일." },
      { id: "A-2", name: "분쇄", concept: "가드 파괴", keywords: ["파괴", "충격", "압박"], description: "단단한 방어구나 방패를 든 적을 무력화시키는데 특화된 스타일." },
      { id: "B-1", name: "응징", concept: "반격 및 패링", keywords: ["반사", "타이밍", "치명타"], description: "적의 공격 타이밍을 읽고 받아쳐 치명적인 피해를 입히는 스타일." },
      { id: "B-2", name: "파쇄", concept: "군중 제어", keywords: ["끌어당김", "범위", "진동"], description: "넓은 범위의 적을 끌어오거나 넘어뜨려 아군의 연계를 돕는 스타일." }
    ],
    activeSkills: [
       // ... (All Battle Axe Active Skills) ...
       { id: "BA_01", name: "차징 강타", frameData: { start: 30, active: 10, recovery: 40, total: 80 }, specs: { radius: "400", angle: "Line", damage: "300%~900%", resource: "Stamina" }, designIntent: "Tree A: 주력기", meaningfulChoice: "위력(A-1) vs 범위(A-2)", variants: [{name:"",type:"Damage",description:""}, {name:"",type:"Utility",description:""}], evolution: { pathA: { name: "Type A-1: 축적", concept: "풀차징", nodes: [{ tier: 1, name: "슈퍼아머", type: "Survival", description: "차징 중 피격 이상 면역", synergyPassiveIds: ['BA-T5-AS1'], insight: "버티기" }, { tier: 2, name: "과충전", type: "Damage", description: "최대 차징 단계 증가", synergyPassiveIds: ['BA-T5-A1'], insight: "한방" }] }, pathB: { name: "Type A-2: 분쇄", concept: "지진파", nodes: [{ tier: 1, name: "충격파", type: "Range", description: "범위 50% 증가", synergyPassiveIds: ['BA-T5-AS2'], insight: "광역" }, { tier: 2, name: "방어 파괴", type: "Utility", description: "방어력 100% 무시", synergyPassiveIds: ['BA-T5-A2'], insight: "관통" }] } } },
       { id: "BA_02", name: "휠윈드", frameData: { start: 20, active: 60, recovery: 30, total: 110 }, specs: { radius: "350", angle: "Circle", damage: "80% x N", resource: "Stamina" }, designIntent: "Tree A: 광역기", meaningfulChoice: "이동(A-1) vs 분쇄(A-2)", variants: [{name:"",type:"Damage",description:""}, {name:"",type:"Utility",description:""}], evolution: { pathA: { name: "Type A-1: 축적", concept: "가속", nodes: [{ tier: 1, name: "무빙", type: "Utility", description: "이동 속도 증가", synergyPassiveIds: ['BA-T4-B2'], insight: "기동" }, { tier: 2, name: "열기 방출", type: "Damage", description: "열기 비례 화염 데미지", synergyPassiveIds: ['BA-T4-A1'], insight: "DPS" }] }, pathB: { name: "Type A-2: 분쇄", concept: "믹서", nodes: [{ tier: 1, name: "끌어당김", type: "Control", description: "적을 중앙으로 당김", synergyPassiveIds: ['BA-T5-B2'], insight: "몰이" }, { tier: 2, name: "갈아버리기", type: "Damage", description: "방어구 파괴 중첩", synergyPassiveIds: ['BA-T4-A2'], insight: "디버프" }] } } },
       { id: "BA_03", name: "어깨치기", frameData: { start: 10, active: 5, recovery: 15, total: 30 }, specs: { radius: "150", angle: "Front", damage: "100%", resource: "None" }, designIntent: "Tree A: 유틸기", meaningfulChoice: "연계(A-1) vs 파괴(A-2)", variants: [{name:"",type:"Damage",description:""}, {name:"",type:"Utility",description:""}], evolution: { pathA: { name: "Type A-1: 축적", concept: "연계", nodes: [{ tier: 1, name: "캔슬", type: "Utility", description: "후딜레이 캔슬 가능", synergyPassiveIds: ['BA-T2-AS1'], insight: "콤보" }, { tier: 2, name: "강타 연계", type: "Damage", description: "다음 스킬 차징 시간 단축", synergyPassiveIds: ['BA-T4-AS1'], insight: "연계" }] }, pathB: { name: "Type A-2: 분쇄", concept: "돌파", nodes: [{ tier: 1, name: "철산고", type: "Damage", description: "넉백 거리 증가", synergyPassiveIds: ['BA-T3-B1'], insight: "거리벌리기" }, { tier: 2, name: "스턴", type: "Control", description: "벽꿍 시 스턴", synergyPassiveIds: ['BA-T5-A2'], insight: "CC" }] } } },
       { id: "BA_04", name: "지면 폭발", frameData: { start: 25, active: 10, recovery: 30, total: 65 }, specs: { radius: "500", angle: "Circle", damage: "400%", resource: "20 Heat" }, designIntent: "Tree A: 누킹기", meaningfulChoice: "화염(A-1) vs 충격(A-2)", variants: [{name:"",type:"Damage",description:""}, {name:"",type:"Utility",description:""}], evolution: { pathA: { name: "Type A-1: 축적", concept: "화산", nodes: [{ tier: 1, name: "용암", type: "Damage", description: "화염 장판 생성", synergyPassiveIds: ['BA-T4-A1'], insight: "도트" }, { tier: 2, name: "대폭발", type: "Damage", description: "중심부 데미지 2배", synergyPassiveIds: ['BA-T5-A1'], insight: "폭딜" }] }, pathB: { name: "Type A-2: 분쇄", concept: "지진", nodes: [{ tier: 1, name: "둔화", type: "Control", description: "이속/공속 감소", synergyPassiveIds: ['BA-T4-B2'], insight: "디버프" }, { tier: 2, name: "넘어뜨리기", type: "Control", description: "확정 다운", synergyPassiveIds: ['BA-T5-A2'], insight: "무력화" }] } } },
       { id: "BA_05", name: "가드 카운터", frameData: { start: 5, active: 60, recovery: 20, total: 85 }, specs: { radius: "300", angle: "Front", damage: "500%", resource: "Stamina" }, designIntent: "Tree B: 반격기", meaningfulChoice: "위력(B-1) vs 범위(B-2)", variants: [{name:"",type:"Damage",description:""}, {name:"",type:"Utility",description:""}], evolution: { pathA: { name: "Type B-1: 응징", concept: "일섬", nodes: [{ tier: 1, name: "저스트", type: "Damage", description: "타이밍 맞추면 데미지 2배", synergyPassiveIds: ['BA-T5-B1'], insight: "피지컬" }, { tier: 2, name: "관통", type: "Utility", description: "무적 판정", synergyPassiveIds: ['BA-T3-B1'], insight: "생존" }] }, pathB: { name: "Type B-2: 파쇄", concept: "방패 치기", nodes: [{ tier: 1, name: "충격파", type: "Range", description: "반격 범위 증가", synergyPassiveIds: ['BA-T4-B1'], insight: "안정성" }, { tier: 2, name: "도발", type: "Control", description: "어그로 최대치", synergyPassiveIds: ['BA-T5-BS2'], insight: "탱킹" }] } } },
       { id: "BA_06", name: "포획", frameData: { start: 15, active: 10, recovery: 20, total: 45 }, specs: { radius: "300", angle: "Single", damage: "200%", resource: "None" }, designIntent: "Tree B: CC기", meaningfulChoice: "연계(B-1) vs 제압(B-2)", variants: [{name:"",type:"Damage",description:""}, {name:"",type:"Utility",description:""}], evolution: { pathA: { name: "Type B-1: 응징", concept: "넘기기", nodes: [{ tier: 1, name: "마운트", type: "Damage", description: "넘어진 적 추가 타격", synergyPassiveIds: ['BA-T5-B1'], insight: "연계" }, { tier: 2, name: "관절기", type: "Control", description: "일어나는 시간 증가", synergyPassiveIds: ['BA-T4-B2'], insight: "제압" }] }, pathB: { name: "Type B-2: 파쇄", concept: "집게", nodes: [{ tier: 1, name: "광역 포획", type: "Range", description: "부채꼴 범위 포획", synergyPassiveIds: ['BA-T5-B2'], insight: "다수" }, { tier: 2, name: "패대기", type: "Damage", description: "주변 적에게 충격 피해", synergyPassiveIds: ['BA-T2-A2'], insight: "광역" }] } } },
       { id: "BA_07", name: "함성", frameData: { start: 10, active: 20, recovery: 20, total: 50 }, specs: { radius: "1000", angle: "Circle", damage: "Buff", resource: "20 Heat" }, designIntent: "Tree B: 버프/디버프", meaningfulChoice: "버프(B-1) vs 디버프(B-2)", variants: [{name:"",type:"Damage",description:""}, {name:"",type:"Utility",description:""}], evolution: { pathA: { name: "Type B-1: 응징", concept: "투지", nodes: [{ tier: 1, name: "공격력", type: "Utility", description: "아군 공격력 증가", synergyPassiveIds: ['BA-T3-AS2'], insight: "지원" }, { tier: 2, name: "슈퍼아머", type: "Survival", description: "아군 경직 저항", synergyPassiveIds: ['BA-T4-BS2'], insight: "보호" }] }, pathB: { name: "Type B-2: 파쇄", concept: "공포", nodes: [{ tier: 1, name: "위협", type: "Control", description: "적 공격력 감소", synergyPassiveIds: ['BA-T5-BS2'], insight: "생존" }, { tier: 2, name: "패닉", type: "Control", description: "적 도주 유발", synergyPassiveIds: ['BA-T2-BS2'], insight: "군중제어" }] } } },
       { id: "BA_08", name: "처형", frameData: { start: 30, active: 10, recovery: 50, total: 90 }, specs: { radius: "200", angle: "Single", damage: "1000%", resource: "50 Heat" }, designIntent: "Tree B: 피니시", meaningfulChoice: "확정(B-1) vs 광역(B-2)", variants: [{name:"",type:"Damage",description:""}, {name:"",type:"Utility",description:""}], evolution: { pathA: { name: "Type B-1: 응징", concept: "참수", nodes: [{ tier: 1, name: "약점", type: "Damage", description: "치명타 확률 100%", synergyPassiveIds: ['BA-T5-B1'], insight: "확정킬" }, { tier: 2, name: "초기화", type: "Utility", description: "처치 시 열기 반환", synergyPassiveIds: ['BA-T4-A1'], insight: "난사" }] }, pathB: { name: "Type B-2: 파쇄", concept: "충격파", nodes: [{ tier: 1, name: "여파", type: "Range", description: "주변 적에게 50% 피해", synergyPassiveIds: ['BA-T5-AS2'], insight: "스플래시" }, { tier: 2, name: "지진", type: "Control", description: "주변 적 다운", synergyPassiveIds: ['BA-T5-B2'], insight: "CC" }] } } }
    ],
    passives: []
  },
] as SkillTree[];

/** text.md 의 weapons / passives 텍스트를 구조 데이터에 병합 */
export const WEAPON_DATA: SkillTree[] = applyWeaponTexts(_WEAPON_DATA_STRUCT);

const sys = text.system ?? {};

export const SYSTEM_DATA = {
  regain: {
    title: sys.regain?.title ?? "리게인 시스템",
    icon: <RefreshCw className="w-6 h-6" />,
    variables: (sys.regain?.variables ?? []).map((v: any) => ({
      name: v.name,
      type: v.type,
      desc: v.desc,
    })),
    exceptions: (sys.regain?.exceptions ?? []).map((e: any, i: number) => {
      const icons = [
        <RefreshCw size={14} key="r" />,
        <ShieldAlert size={14} key="s" />,
        <Ban size={14} key="b" />,
        <Skull size={14} key="k" />,
      ];
      return { icon: icons[i] ?? <RefreshCw size={14} />, title: e.title, desc: e.desc };
    }),
    multiHit: {
        formula: "Efficiency = Factor ^ (Order - 1)",
        factor: 0.5,
        min: 0.1
    },
    synergy: {
      weapon: sys.regain?.synergy?.weapon ?? "Berserker Synergy",
      desc: sys.regain?.synergy?.desc ?? "",
    }
  },
  smartTargeting: {
    title: sys.smartTargeting?.title ?? "스마트 타겟팅 (Smart Targeting)",
    icon: <Crosshair className="w-6 h-6" />,
    formula: {
      main: "FinalScore = (DistanceScore * W_Dist) + (AngleScore * W_Angle) + (InputScore * W_Input)",
      params: sys.smartTargeting?.formula?.params ?? [],
    },
    synergy: {
      weapon: sys.smartTargeting?.synergy?.weapon ?? "Action Camera System",
      desc: sys.smartTargeting?.synergy?.desc ?? "",
    }
  }
};