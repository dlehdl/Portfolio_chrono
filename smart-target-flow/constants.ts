import { FlowNode, FlowEdge, NodeType } from './types';

// Coordinates layout helper
const CX = 400; // Center X
const SY = 50;  // Start Y
const GAP = 140; // Vertical Gap

export const NODES: FlowNode[] = [
  {
    id: 'start',
    type: NodeType.START,
    label: '스킬 입력',
    description: '사용자가 스킬 버튼을 눌렀습니다.',
    details: ['타겟팅 평가 프로세스를 시작합니다.'],
    x: CX,
    y: SY,
  },
  {
    id: 'hard_lock',
    type: NodeType.DECISION,
    label: '하드 락온 상태?',
    description: '사용자가 수동으로 타겟을 고정한 상태인지 확인합니다 (예: Tab 키).',
    details: ['우선순위: 최상', '활성화 시 스마트 타겟팅 로직을 건너뜁니다.'],
    x: CX,
    y: SY + GAP,
  },
  {
    id: 'attack_locked',
    type: NodeType.TERMINATOR,
    label: '고정 타겟 공격',
    description: '시스템이 하드 락온된 타겟으로 스킬을 유도합니다.',
    x: CX + 250,
    y: SY + GAP,
  },
  {
    id: 'non_target_check',
    type: NodeType.DECISION,
    label: '논타겟 스킬인가?',
    description: '특정 타겟 지정이 필요 없는 스킬인지 확인합니다.',
    details: ['지점 선택 (장판기)', '이동/회피기 (대시)', '수동 조준 스킬'],
    x: CX,
    y: SY + GAP * 2,
  },
  {
    id: 'use_input_dir',
    type: NodeType.TERMINATOR,
    label: '입력/카메라 방향',
    description: '이동 입력 방향 또는 카메라가 보는 방향으로 스킬이 시전됩니다.',
    x: CX + 250,
    y: SY + GAP * 2,
  },
  {
    id: 'search_area',
    type: NodeType.PROCESS,
    label: '후보 탐색',
    description: '유효 사거리 내의 적들을 스캔하여 후보군을 생성합니다.',
    details: [
      '탐색 범위: 전방 부채꼴 벡터',
      '높이 제한: 수직 15도 이내',
      '거리 제한: 최대 락온 거리 미만',
      '동적 범위: 근거리 30° vs 원거리 60°'
    ],
    x: CX,
    y: SY + GAP * 3,
  },
  {
    id: 'obstacle_check',
    type: NodeType.PROCESS,
    label: '장해물 검사 (LoS)',
    description: '시야(Line of Sight) 확보를 위한 레이캐스트 검사를 수행합니다.',
    details: ['벽이나 정적 메시는 타겟팅을 차단합니다.', '가려진 타겟은 후보 목록에서 제외됩니다.'],
    x: CX,
    y: SY + GAP * 4,
  },
  {
    id: 'input_exception',
    type: NodeType.DECISION,
    label: '이동 입력 중?',
    description: '타겟팅의 기준이 될 전방 벡터를 결정합니다.',
    details: [
      '이동 중: 입력 벡터 사용 (급격한 180° 회전 방지)',
      '대기 중: 캐릭터의 전방 벡터 사용'
    ],
    x: CX,
    y: SY + GAP * 5,
  },
  {
    id: 'scoring',
    type: NodeType.PROCESS,
    label: '점수 산정 시스템',
    description: '가중치를 기반으로 후보 중 최적의 타겟을 계산합니다.',
    details: [
      '총점 = 거리 가중치 + 각도 가중치',
      '근거리 스킬: 거리 우선',
      '원거리 스킬: 각도(중앙) 우선'
    ],
    x: CX,
    y: SY + GAP * 6,
  },
  {
    id: 'hysteresis',
    type: NodeType.DECISION,
    label: '타겟 유지 (Sticky)?',
    description: '히스테리시스 규칙을 적용하여 타겟 변경을 억제합니다.',
    details: [
      '현재 타겟이 유효하다면 가급적 유지합니다.',
      '타겟이 빈번하게 바뀌는(Jittering) 현상을 방지합니다.',
      '현재 타겟이 사망하거나 범위를 벗어날 때만 교체합니다.'
    ],
    x: CX,
    y: SY + GAP * 7,
  },
  {
    id: 'action',
    type: NodeType.TERMINATOR,
    label: '액션 및 카메라 보정',
    description: '최종 결정된 타겟으로 실행합니다.',
    details: [
      '소프트 락: 공격 방향을 타겟 쪽으로 자동 보정',
      '마그네티즘: 카메라를 타겟 방향으로 부드럽게 회전',
      '스킬 종료 후 즉시 보정 상태 초기화'
    ],
    x: CX,
    y: SY + GAP * 8,
  },
];

export const EDGES: FlowEdge[] = [
  { id: 'e1', source: 'start', target: 'hard_lock' },
  { id: 'e2', source: 'hard_lock', target: 'attack_locked', label: '예' },
  { id: 'e3', source: 'hard_lock', target: 'non_target_check', label: '아니오' },
  { id: 'e4', source: 'non_target_check', target: 'use_input_dir', label: '예' },
  { id: 'e5', source: 'non_target_check', target: 'search_area', label: '아니오' },
  { id: 'e6', source: 'search_area', target: 'obstacle_check' },
  { id: 'e7', source: 'obstacle_check', target: 'input_exception' },
  { id: 'e8', source: 'input_exception', target: 'scoring' },
  { id: 'e9', source: 'scoring', target: 'hysteresis' },
  { id: 'e10', source: 'hysteresis', target: 'action', label: '타겟 확정' },
];