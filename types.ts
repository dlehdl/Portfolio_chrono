import React from 'react';

export interface NavItem {
  id: string;
  label: string;
  subItems?: NavItem[];
}

export interface Stance {
  id: string; // e.g., 'Tree-1'
  name: string;
  concept: string;
  keywords: string[];
  description: string;
  /** 전투 흐름 단계 (표시용, 줄글 X) */
  flowSteps?: string[];
  /** 설명 불릿 (줄글 X) */
  descriptionPoints?: string[];
  /** 핵심 액션 한 줄 요약 (컨셉 카드) */
  actionSummary?: string;
  /** 분노 자원 연계: 조건/트리거 */
  furyTrigger?: string;
  /** 분노 연계 효과 */
  furyEffect?: string;
  /** 분노 연계 리스크 */
  furyRisk?: string;
}

export interface FrameData {
  start: number;
  active: number;
  recovery: number;
  total: number;
  /** 캔슬 가능 프레임(액티브 종료 후, 리커버리 내). 있으면 바에 c 구간 표시, cancel(s+a+c) 하단 표기 */
  c?: number;
  /** 2타 액션 시 1타 액티브 프레임. a2와 함께 있으면 프레임바에 A1/A2 구간 분리 표시 */
  a1?: number;
  /** 1타~2타 사이 스타트(공백) 프레임. 특수액션 등에서만 사용 */
  s2?: number;
  /** 2타 액티브 프레임. a1과 함께 있으면 프레임바에 A1/A2 구간 분리 표시 */
  a2?: number;
}

// Updated: Evolution Logic
export interface EvolutionNode {
  tier: number;
  name: string;
  type: 'Damage' | 'Utility' | 'Survival' | 'Control' | 'Range';
  description: string;
  frameDataOverride?: FrameData; // Changes frame data if selected
  specOverride?: {
    radius?: string;
    angle?: string;
    damage?: string;
    resource?: string;
  };
  synergyPassiveIds: string[]; // IDs of passives that synergize with this node
  insight: string; // Designer's note on why this synergy exists
}

export interface ActiveSkillDetail {
  id: string;
  name: string;
  /** 스킬 한줄 설명 (선택) */
  description?: string;
  frameData: FrameData;
  specs: {
    radius: string;
    angle: string;
    damage: string;
    resource: string;
  };
  designIntent: string;
  meaningfulChoice: string;
  variants: [SkillVariant, SkillVariant]; // Legacy simple variants
  evolution?: {
    pathA: { name: string; concept: string; nodes: EvolutionNode[] };
    pathB: { name: string; concept: string; nodes: EvolutionNode[] };
  };
}

export interface SkillVariant {
  name: string;
  type: 'Damage' | 'Utility' | 'Range' | 'Survival';
  description: string;
}

export interface ComboStep {
  step: number; // 1, 2, 3
  name: string;
  input: string; // e.g. "LMB"
  description: string;
  frameData: FrameData;
  /** 기획 의도 (설명 하단, 프레임바 위) */
  designIntent?: string;
}

export interface BasicAttack {
  name: string;
  description: string;
  steps: ComboStep[]; // 3 steps
}

export interface SpecialAction {
  name: string;
  description: string;
  mechanic: string;
  frameData: FrameData;
  /** 기획 의도 (특수액션 설명 하단, 프레임바 위) */
  designIntent?: string;
  /** 첫 번째 프레임바 라벨(두 가지 상황일 때) */
  frameDataLabel?: string;
  /** 두 번째 상황 프레임 표기용 */
  frameDataAlt?: { label: string; frameData: FrameData };
}

// Updated: Passive Tree Logic for Dual Diagram
export interface PassiveNode {
  id: string;
  tier: number; // 1 to 5
  side: 'A' | 'B' | 'Center'; // Which tree side
  type: 'Main' | 'Sub';
  name: string;
  summary: string; // Short effect text for the node
  description: string;
  position: number; // Horizontal position index for grid layout
  designerIntent?: string; // Added for Deep-Dive
  tags?: string[]; // Added for Build Synergy Matrix (e.g. "Speed/Crit")
}

export interface PassiveSkill {
  name: string;
  description: string;
  iconType: 'offensive' | 'defensive' | 'utility';
}

export interface SkillTree {
  name: string;
  description: string;
  mechanic: string;
  icon: React.ReactNode;
  basicAttack: BasicAttack;
  specialAction: SpecialAction;
  /** 연계 공격(이동/회피 공격) 단계. 없으면 공통 MOVEMENT_ATTACK_STEPS 사용 */
  movementAttackSteps?: ComboStep[];
  stances: Stance[]; // 4 Class Trees
  activeSkills: ActiveSkillDetail[]; // 8 Skills
  passives: PassiveSkill[]; // Legacy list
  passiveTree?: PassiveNode[]; // New Graph Structure
}

export interface ProjectInfo {
  title: string;
  role: string;
  duration: string;
  engine: string;
  summary: string;
}