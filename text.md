# Portfolio Text Content

> 이 파일의 YAML 블록만 수정하면 포트폴리오 표시 문구가 반영됩니다.
> 프레임·아이콘·레이아웃 ID 등 **구조 데이터**는 코드에 두고, **표시 텍스트**만 여기서 관리합니다.

## 액티브 스킬 「기본」열 설명 — 여기 수정

표의 **기본** 칸 문구는 아래 `baseDescription` 키입니다. (검색: `baseDescription` 또는 스킬 ID)

### 사슬검 (`weapons.chainsword.skills`)

- **휩쓸기** (`CS_01`) → `weapons.chainsword.skills.CS_01.baseDescription`
- **사슬 베기** (`CS_02`) → `weapons.chainsword.skills.CS_02.baseDescription`
- **사슬 도약** (`CS_03`) → `weapons.chainsword.skills.CS_03.baseDescription`
- **붕괴의 일격** (`CS_04`) → `weapons.chainsword.skills.CS_04.baseDescription`
- **회전 베기** (`CS_05`) → `weapons.chainsword.skills.CS_05.baseDescription`
- **사슬 강타** (`CS_06`) → `weapons.chainsword.skills.CS_06.baseDescription`
- **솟아나는 칼날** (`CS_07`) → `weapons.chainsword.skills.CS_07.baseDescription`
- **강철 회오리** (`CS_08`) → `weapons.chainsword.skills.CS_08.baseDescription`



### 쌍도끼 (`weapons.dualaxe.skills`)

- **학살** (`DA_01`) → `weapons.dualaxe.skills.DA_01.baseDescription`
- **도끼 투척** (`DA_02`) → `weapons.dualaxe.skills.DA_02.baseDescription`
- **후려치기** (`DA_03`) → `weapons.dualaxe.skills.DA_03.baseDescription`
- **투신** (`DA_04`) → `weapons.dualaxe.skills.DA_04.baseDescription`
- **쪼개기** (`DA_05`) → `weapons.dualaxe.skills.DA_05.baseDescription`
- **도끼 강화** (`DA_06`) → `weapons.dualaxe.skills.DA_06.baseDescription`
- **박치기** (`DA_07`) → `weapons.dualaxe.skills.DA_07.baseDescription`
- **도끼 난타** (`DA_08`) → `weapons.dualaxe.skills.DA_08.baseDescription`



### 전투도끼 (`weapons.battleaxe.skills`)

- **소용돌이** (`BA_01`) → `weapons.battleaxe.skills.BA_01.baseDescription`
- **분노의 도끼** (`BA_02`) → `weapons.battleaxe.skills.BA_02.baseDescription`
- **천둥의 역습** (`BA_03`) → `weapons.battleaxe.skills.BA_03.baseDescription`
- **혼신의 일격** (`BA_04`) → `weapons.battleaxe.skills.BA_04.baseDescription`
- **절단** (`BA_05`) → `weapons.battleaxe.skills.BA_05.baseDescription`
- **피의 장막** (`BA_06`) → `weapons.battleaxe.skills.BA_06.baseDescription`
- **처형 예고** (`BA_07`) → `weapons.battleaxe.skills.BA_07.baseDescription`
- **회전격** (`BA_08`) → `weapons.battleaxe.skills.BA_08.baseDescription`

1·2단계 강화 문구는 같은 스킬의 `evolution.pathA|pathB.nodes[].description` / `insight` 에서 수정합니다.
자원 소모는 `weapons.*.skills.{ID}.resource`(기본)와 `nodes[].resource`(해당 단계, 없으면 이전 단계 유지)에서 수정합니다.

## 섹션 맵


| 키                                          | 용도                    |
| ------------------------------------------ | --------------------- |
| `nav` / `hero` / `about` / `footer`        | 네비·히어로·자기소개·푸터        |
| `project` / `berserker`                    | 프로젝트 개요·버서커 소개        |
| `ui.classDesign`                           | 클래스 설계 섹션/표 라벨        |
| `weapons.*.skills.{ID}.baseDescription`    | 액티브 표 **기본** 열 설명     |
| `weapons.*.skills.{ID}.resource`           | 액티브 표 **기본** 자원 소모    |
| `weapons.*.skills.{ID}.designIntent`       | 액티브 표 기본 열 기획 의도      |
| `weapons.*.skills.{ID}.evolution`          | 1·2단계 강화 설명·자원        |
| `passives.{ID}`                            | 패시브 문구 (**id 변경 금지**) |
| `combatSystem` / `system` / `aiAutomation` | 전투·AI 섹션              |


```yaml
nav:
  brand: LEE.D.Y
  brandSuffix: TIS
  ariaOpen: 메뉴 열기
  ariaClose: 메뉴 닫기
  items:
    - id: hero
      label: 1. 개요
    - id: about
      label: 2. 자기소개
    - id: project
      label: 3. 프로젝트 개요
    - id: class-design
      label: 4. 클래스 설계
    - id: class-chainsword
      label: 4.1 사슬검
    - id: class-dualaxe
      label: 4.2 쌍도끼
    - id: class-battleaxe
      label: 4.3 전투도끼
    - id: combat-system
      label: 5. 전투 시스템
    - id: ai-automation
      label: 6. AI 자동화
hero:
  tagline: Game Combat Design Portfolio
  name: LEE DOYI
  statement: |-
    설계는 논리적이어야 하고,
    전투는 본능적이어야 한다.
about:
  sectionLabel: 02. 자기소개
  name: LEE DOYI
  role: PC Combat Designer
  quote: 모든 액션에는 리스크가 있다.
  bio: |-
    전조와 후딜레이를 고려한 명확한 액션 플로우를 설계하며,
    유저의 모든 선택이 의미가 있는 전투를 기획합니다.
  email: dlehdl2000@naver.com
  phone: 010-8547-5509
  skills:
    - Combat Logic Design
    - Data Structure (Table)
  timeline:
    - title: 크로노 스튜디오
      date: 2024.04 ~ 2026.06
      role: 기획 전투 PC팀
      desc: 버서커 클래스 스킬 기획 및 전투 매커니즘 설계, 전투 시스템 기획
    - title: 에스에이엠지 엔터테인먼트
      date: 2022.06 ~ 2024.04
      role: 3D 애니메이션 제작 PD
      desc: 스튜디오 D 본부 공정 관리, 뉴미디어 콘텐츠 기획 및 연출 보조
    - title: 청강문화산업대학교
      date: 2019.03 ~ 2023.02
      role: 만화애니게임학과 학사
      desc: 학점 4.5 / 4.5 만점 졸업, 애니메이션스쿨 학생회장 역임
  achievements:
    title: Key Achievements
    items:
      - '''좀비어리'' 웹애니메이션 제작: SBA 애니메이션 제작지원사업 선정'
      - '''귀군분투'' 단편 애니메이션 제작: 제23회 정동진독립영화제 초청'
footer:
  name: LEE DOYI
  tagline: Combat Designer Portfolio 2026
project:
  subtitle: 03. 프로젝트 개요
  title: 'Project: Chrono Odyssey'
berserker:
  overviewLabel: Project Overview
  overviewBody: |-
    대규모 필드와 보스전을 중심으로 한 액션 MMORPG 프로젝트로,
    리스크를 감수하는 공격적 템포와 정교한 클래스 빌드를 핵심 경험으로 삼고 있습니다.
  heroBadge: ACTION MMORPG
  heroTitle: CHRONO ODYSSEY
  meta:
    - label: Engine
      value: Unreal Engine 5
    - label: Platform
      value: PC / Console
    - label: Scale
      value: 180+ Developers
    - label: Period
      value: 2019 - Present
  contributionHeader: My Contribution
  roles:
    - title: Class Mechanics
      subtitle: 클래스 메카닉 설계
      desc: |-
        버서커 클래스 스킬 기획 및
        액션 매커니즘 설계
    - title: Combat System
      subtitle: 전투 시스템 기획
      desc: 전투 시스템 기획
    - title: Build Structure
      subtitle: 패시브 빌드 수립
      desc: |-
        매트릭스 패시브 스킬 트리의
        유기적 빌드 수립
  classSectionLabel: 4. 클래스 설계
  classFig: FIG.01
  classSerial: SERIAL NO. 0401
  classTitle: Class Design
  classIntro: |-
    무기별로 고유한 자원 루프와 전투의 리듬감을 설계하여,
    단순한 대미지 딜링이 아닌 '롤플레잉의 재미'를 추구했습니다.
  heroAlt: Berserker Class
  heroRef: REF. BERSERKER
  heroClassName: BESERKER
  heroAttribute: CLASS ATTRIBUTE · ANNUAL
  heroQuote: 피격의 리스크를 공격의 기회로 전환하는 공격적 템포의 정점
  heroBody: |-
    버서커는 기본 공격 또는 피격을 통해 분노를 축적하고, 축적된 분노로 통제할 수 없는 강력한 공격을 퍼붓습니다.
    공격을 지속하지 않으면 분노는 서서히 감소합니다. 분노가 높을수록 강력해지지만, 리스크도 함께 증가합니다.
    플레이어는 리스크를 통제하기 위해 물러서기 보다, 분노가 사라지기 전에 적을 먼저 섬멸하는 압도적인 맹공을 펼쳐야 합니다.
  heroTags:
    - Equip
    - Rage Loop
    - Live
  weapons:
    - slug: chainsword
      name: 사슬검
      eng: CHAINSWORD
      keyword: IRREGULARITY
      desc: |-
        사거리 조절과 변칙적인 반격을 통해
        중거리에서 전장을 통제합니다.
      fig: FIG.02
      serial: SERIAL 8922
    - slug: dualaxe
      name: 쌍도끼
      eng: DUAL AXES
      keyword: EXPLOSION
      desc: |-
        광기 자원을 활용하여 쉼 없이 몰아치며
        순간적인 폭딜을 쏟아냅니다.
      fig: FIG.03
      serial: SERIAL 8923
    - slug: battleaxe
      name: 전투도끼
      eng: BATTLE AXE
      keyword: DESTRUCTION
      desc: |-
        높은 강인도로 적의 공격을 받아내며
        묵직한 한 방으로 궤멸시킵니다.
      fig: FIG.04
      serial: SERIAL 8924
ui:
  classDesign:
    basicActions: 기본 액션
    specialAction: 특수 액션
    basicCombo: 기본 공격 콤보
    movementAttack: 연계 공격
    activeSkills: 액티브 스킬
    treeA: A트리
    treeB: B트리
    skillEvolution: 액티브 스킬 강화
    skillEvolutionNote: 액티브 스킬은 2가지의 선택 분기를 가지며, 최대 2단계까지 강화할 수 있습니다.
    stageBasic: 기본
    stageEnhanced: 1단계 강화
    stageFinal: 2단계 강화
    evolvedProficient: 숙련
    evolvedExpert: 전문
    nameColumn: 이름
    rageColumn: 분노
    skillEffect: 스킬 효과
    stance: 전투 태세
    stanceNote: 4가지의 핵심 전투 컨셉에 따라 전투 태세가 달라집니다.
    combatFlow: 전투 흐름
    furyLink: 분노 자원 연계
    signatureVideo: 시그니처 컨셉 영상
    signatureAction: 시그니처 액션
    signatureActive: 시그니처 액티브 스킬
    passiveSkill: 패시브 스킬
    designIntent: 기획 의도
    frame: Frame
    attribute: Attribute
    skillId: Skill ID
    description: Description
    frameAnalysis: Frame Analysis
    skillColumn: 스킬
    stageContentColumn: 내용
    resourceColumn: 자원
    evolutionStages:
      - 기본
      - 1단계 강화
      - 2단계 강화
    passiveColType: 타입
    passiveColTier: 티어
    passiveColName: 이름
    passiveColDesc: 내용
    passiveColIntent: 기획 의도
    passiveTypeMain: 메인
    passiveTypeSub: 서브
    stanceDescription: 설명
  weaponSkillTree:
    baseOps: 기본 조작
    comboOps: 연계 조작
    skillEquip: 액티브 스킬 장착과 무기 교체
    standardStructure: 무기 전용 스킬 습득 표준 구조
    legendActive: 액티브
    legendPassive: 패시브
    legendExclusive: 배타적 선택 분기
  system:
    regainTitle: 리게인 시스템
    smartTitle: 스마트 타겟팅 시스템
    close: 닫기
    logicDetail: 시스템 로직 상세
    intentSummary: 기획 의도 요약
    coreSystem: Core System
weaponTrees:
  사슬검:
    A-1:
      name: 섬영
      skills:
        - CS_01
        - CS_02
        - CS_03
        - CS_04
      path: pathA
      passive: A/1
    A-2:
      name: 척력
      skills:
        - CS_01
        - CS_02
        - CS_03
        - CS_04
      path: pathB
      passive: A/2
    B-1:
      name: 원무
      skills:
        - CS_05
        - CS_06
        - CS_07
        - CS_08
      path: pathA
      passive: B/1
    B-2:
      name: 중압
      skills:
        - CS_05
        - CS_06
        - CS_07
        - CS_08
      path: pathB
      passive: B/2
  쌍도끼:
    A-1:
      name: 광전사
      skills:
        - DA_01
        - DA_02
        - DA_03
        - DA_04
      path: pathA
      passive: A/1
    A-2:
      name: 추격
      skills:
        - DA_01
        - DA_02
        - DA_03
        - DA_04
      path: pathB
      passive: A/2
    B-1:
      name: 혈투
      skills:
        - DA_05
        - DA_06
        - DA_07
        - DA_08
      path: pathA
      passive: B/1
    B-2:
      name: 도살
      skills:
        - DA_05
        - DA_06
        - DA_07
        - DA_08
      path: pathB
      passive: B/2
  전투도끼:
    A-1:
      name: 축적
      skills:
        - BA_01
        - BA_02
        - BA_03
        - BA_04
      path: pathA
      passive: A/1
    A-2:
      name: 분쇄
      skills:
        - BA_01
        - BA_02
        - BA_03
        - BA_04
      path: pathB
      passive: A/2
    B-1:
      name: 응징
      skills:
        - BA_05
        - BA_06
        - BA_07
        - BA_08
      path: pathA
      passive: B/1
    B-2:
      name: 파쇄
      skills:
        - BA_05
        - BA_06
        - BA_07
        - BA_08
      path: pathB
      passive: B/2
weapons:
  chainsword:
    name: 사슬검
    description: 사거리 조절과 변칙적인 반격을 통해 중거리에서 전장을 통제합니다.
    mechanic: '특수 액션: 끌어당기기 / 고정 대시 / 분노 생성'
    basicAttack:
      name: 기본 공격
      description: 빠른 속도로 적을 제압하는 3연타 콤보 공격입니다.
      steps:
        - step: 1
          name: 기본 공격 1타
          description: 좌측 사슬검을 사선으로 빠르게 베어 피해를 줌.
          designIntent: 사슬이 돌아오는 관성 표현을 위해 후딜 프레임을 더 길게 조정.
        - step: 2
          name: 기본 공격 2타
          description: 양쪽 사슬검을 사선으로 빠르게 베어 피해를 줌.
          designIntent: 다음 기본공격과의 연계를 위해 캔슬 프레임을 보다 짧게 설정.
        - step: 3
          name: 기본 공격 3타
          description: 양쪽 사슬검을 전방을 향해 내려찍어 큰 피해를 줌.
          designIntent: 연속 공격의 마지막으로, 리스크에 기반하여 기본 공격 중 가장 큰 피해량을 가짐.
    specialAction:
      name: 특수 액션
      description: 사슬을 던져 적을 끌어오거나, 벽 또는 적에 고정하여 돌진.
      mechanic: 적중 시 분노 자원 획득, Hold 입력 시 홀딩 상태 유지
      designIntent: '사슬의 특성을 활용해 접근기, 당겨오는 기술로 사용 '
      frameDataLabel: 적을 끌어당길 때
      frameDataAltLabel: 벽 또는 적에 고정해서 돌진할 때
    movementAttackSteps:
      - step: 1
        name: 회피 공격 (앞)
        description: 앞으로 회피 후, 사슬검을 짧게 잡아 내려치며 공격.
        designIntent: 사거리가 짧아지는 대신 보다 빠르게 공격 가능.
      - step: 2
        name: 회피 공격 (뒤)
        description: 뒤로 회피 후, 전진하며 사슬검을 올려쳐 공격.
        designIntent: 뒤로 회피하여 멀어진 거리만큼 전진하여 공격.
      - step: 3
        name: 전력질주 공격
        description: 전력질주 중 양쪽 사슬검을 올려치며 공격.
        designIntent: 선딜은 일반 평타와 비슷하지만, 반동을 이용해 훨씬 빠르게 공격.
    stances:
      A-1:
        name: 섬영
        concept: 근접 난무 특화
        actionSummary: 변칙적인 액션
        keywords:
          - 고속연타
          - 치명타특화
          - 근접
        description: 사슬검을 짧게 잡아 빠른 속도로 반격하여 치명타를 가하는 전진형 스타일.
        flowSteps:
          - 적 당기기
          - 피격 시 즉시 반격
          - 광란 상태의 고속 연타
        descriptionPoints:
          - 스킬 사용 중 피격 시 즉각적인 후속타 연계 가능
          - 매 타격 시 치명타 확률 중첩 및 강인도 보정
        furyTrigger: 분노 100% 도달 시 [광란] 돌입
        furyEffect: 사거리 감소 대신 기본 공격 속도·치명타 피해 대폭 증가
        furyRisk: 받는 피해 증가 및 초당 분노 소모량 증가
      A-2:
        name: 척력
        concept: 거리 유지 및 통제
        actionSummary: 거리 봉쇄 액션
        keywords:
          - 접근봉쇄
          - 군중제어(cc)
          - 유틸리티통제
        description: 사슬의 척력으로 적을 튕겨내며 접근을 원천 봉쇄하는 거리 유지 스타일.
        flowSteps:
          - 사슬로 적 튕겨내기
          - CC기 부여
          - 고분노 상태 유틸 통제
        descriptionPoints:
          - 사슬검을 휘둘러 그 척력으로 적을 튕겨내는 유틸 성능
          - 적에게 CC 부여 시 분노 생성량 및 공격력 증가
        furyTrigger: 분노 수치가 높을수록 튕겨내기·유틸리티 성능 강화
        furyEffect: 분노 50% 이상 시 스태미나 회복 증가, 분노 소모량 감소
        furyRisk: 추가 피해 적중 시 자신의 강인도 대폭 감소
      B-1:
        name: 원무
        concept: 광역 지속 딜링
        actionSummary: 광역 회전 액션
        keywords:
          - 광역
          - 처치보상
          - 무한동력
        description: 사슬을 횡으로 휘둘러 다수의 적을 휩쓸며 전장을 장악하는 광역 스타일.
        flowSteps:
          - 광역 회전 베기
          - 적 처치
          - 패시브 효과 기반 스킬 연속 사용
        descriptionPoints:
          - 회전 베기 및 원형 타격을 통한 다수 대상 분노 수급
          - 적 처치 시 공격력 증가·방어력 감소 (하이 리스크 중첩)
        furyTrigger: 적 처치 후 일정 시간 타격 시 분노 생성량 증폭
        furyEffect: 처치 후 다음 액티브 스킬 분노 소모 0
        furyRisk: '[학살 관성] 발동 후 액티브 사용 전까지 회피 불가'
      B-2:
        name: 중압
        concept: 무력화 및 강타
        actionSummary: 무력화 강타 액션
        keywords:
          - 무력화특화
          - 경직연계
          - 확정그로기
        description: 사슬의 반동과 무게감을 실어 적의 방어에 '균열'을 만드는 무력화 스타일.
        flowSteps:
          - 사슬 공격
          - 무력화 저항 감소
          - 확정 경직 연계로 그로기 유도
        descriptionPoints:
          - 사슬 공격으로 무력화 게이지 갉아먹는 이미지
          - 적 경직 시 무력화 저항력 감소 디버프 상시 부여
        furyTrigger: 분노 100% 달성 시 다음 공격 확정 경직 부여
        furyEffect: 분노 70% 이상 시 모든 타격 경직치 증가
        furyRisk: 기본 공격 경직치 증가 시 스태미나 소모량 동시 증가
    skills:
      CS_01:
        name: 휩쓸기
        baseDescription: 사슬검을 교차하여 2번 베어 150% 피해
        resource: 분노 20
        designIntent: '사슬을 빠르게 휘두르는 주딜기 '
        meaningfulChoice: 특수액션 직후 짧은 사슬 연계(섬영) vs 타수·다운으로 거리 유지(척력)
        evolution:
          pathA:
            name: 'Type A-1: 섬영'
            concept: 고속 연타
            nodes:
              - tier: 1
                name: 추가 필요
                description: 특수액션 적중 직후 사용 시, 사슬검을 짧게 잡아 교차하며 빠르게 휘둘러 150% 피해
                insight: 특수액션 적중 후 휩쓸기 연계 유도
                resource: '분노 20 '
              - tier: 2
                name: 추가 필요
                description: 특수액션 적중 직후 사용 시, 반동으로 전방 대시하며 이동 거리 증가
                insight: 특수액션 적중 후 사용 시 접근기로 활용성 강화
                resource: '분노 20 '
          pathB:
            name: 'Type A-2: 척력'
            concept: 거리 유지
            nodes:
              - tier: 1
                name: 추가 필요
                description: 사슬검을 세로로 회전시켜 내리찍어 150% 피해. 타수 2 → 4
                insight: 타수를 늘려 거리 유지 안정화
                resource: 분노 15
              - tier: 2
                name: 추가 필요
                description: 분노 50% 이상이면 마지막 타격에서 적 [다운]
                insight: 분노 50% 이상일 때 마지막 타로 다운을 얻어 거리를 벌림
                resource: 분노 15
      CS_02:
        name: 사슬 베기
        baseDescription: 한쪽 사슬검으로 1회 베어 100% 피해
        resource: 분노 10
        designIntent: '휩쓸기보다 빠르게 치고 빠질 수 있는 주력기 '
        meaningfulChoice: 맞으면서 후속타를 넣을 것인가(섬영) vs 뻗어 당겨 특수액션을 대체할 것인가(척력)
        evolution:
          pathA:
            name: 'Type A-1: 섬영'
            concept: 피격 연계
            nodes:
              - tier: 1
                name: 추가 필요
                description: 스킬 사용 중 피격 시 후속타 연계 가능. 피격 후 일반공격 사용 시 돌진하며 양쪽 사슬검으로 빠르게 찔러 200% 피해
                insight: 적의 공격을 맞으면서 사용 시 더 높은 피해를 주도록 유도
                resource: '분노 20 '
              - tier: 2
                name: 추가 필요
                description: 후속타 3콤보까지 사용 가능. 연속으로 찔러 총 300% 피해
                insight: 적의 공격을 맞으면서 사용 시 연속 공격 기회
                resource: '분노 20 '
          pathB:
            name: 'Type A-2: 척력'
            concept: 거리 조절
            nodes:
              - tier: 1
                name: 추가 필요
                description: 2콤보로 사용 가능. 한쪽 사슬검으로 1회 베어 90% 피해 후 반대쪽 사슬검을 길게 뻗어 120% 피해
                insight: '사슬을 뻗어 거리를 유지하며 공격 '
                resource: 분노 15
              - tier: 2
                name: 추가 필요
                description: 2콤보에서 사슬검을 뻗은 후 적을 끌어당김
                insight: 당기기를 스킬 안에 넣어 특수액션 없이도 적을 붙잡음
                resource: 분노 18
      CS_03:
        name: 사슬 도약
        baseDescription: 도약 후 사슬검을 내리찍어 200% 피해
        resource: 분노 30
        designIntent: '접근기, 주딜기 '
        meaningfulChoice: 제자리 차징으로 치피를 열 것인가(섬영) vs 원거리에서 반동 접근할 것인가(척력)
        evolution:
          pathA:
            name: 'Type A-1: 섬영'
            concept: 차징 강습
            nodes:
              - tier: 1
                name: 추가 필요
                description: 도약하지 않는 대신 차징 가능. 힘을 모아 내리찍고 전방 부채꼴 충격파로 250% 피해. 적 치명타 저항 감소
                insight: 범위 증가, 디버프 부여
                resource: 분노 30
              - tier: 2
                name: 추가 필요
                description: 적중 후 특수액션 피해량 50% 증가
                insight: 적중 후 특수액션 사용 유도
                resource: 분노 30
          pathB:
            name: 'Type A-2: 척력'
            concept: 반동 도약
            nodes:
              - tier: 1
                name: 추가 필요
                description: 적이 5미터 이상 멀리 있을 때 사용 시, 도약 전 전방에 사슬검을 내려친 뒤 반동으로 도약하여 총 200% 피해
                insight: '접근 가능 거리 증가 '
                resource: 분노 25
              - tier: 2
                name: 추가 필요
                description: 분노 50% 이상일 때 도약 거리 증가. 도약 전 내려치기 2타로 증가
                insight: 분노를 유지한 대가로 접근 거리와 타수를 보상
                resource: 분노 25
      CS_04:
        name: 붕괴의 일격
        baseDescription: 사슬검을 땅에 박은 후 적에게 접근하고 강하게 착지하며 220% 피해
        resource: 분노 50
        designIntent: '필살기 '
        meaningfulChoice: 분노를 더 태워 다단 치피를 노릴 것인가(섬영) vs CC가 열린 적에게 짧게 붙을 것인가(척력)
        evolution:
          pathA:
            name: 'Type A-1: 섬영'
            concept: 난무
            nodes:
              - tier: 1
                name: 난격
                description: 분노 소모량 증가. 착지 후 돌진, 사슬검을 짧게 잡아 휘두르며 5타 , 260% 피해
                insight: 다단히트로 치명타 피해를 노린 필살기
                resource: 분노 60
              - tier: 2
                name: 추가 필요
                description: 최대 2단계 후속타 충전 가능. 충전 사용 시 공격 속도·타수 증가. 매 타격마다 치명타 확률 5% 증가
                insight: 충전해서 사용 시 매 타격 치명타 확률 증가 효과로 딜 폭증 가능
                resource: 분노 60
          pathB:
            name: 'Type A-2: 척력'
            concept: 접근 회전
            nodes:
              - tier: 1
                name: 추가 필요
                description: '땅에 사슬검을 박은 뒤 도약해 접근, 몸을 회전시키며 50% 피해 추가. 접근 거리는 감소하지만 이동 중에도 피해를 줌 '
                insight: '접근 거리는 감소하지만 이동 중에도 피해를 줌. 근거리 적 압박 '
                resource: 분노 35
              - tier: 2
                name: 추가 필요
                description: CC 상태인 적에게 피해량 50% 증가
                insight: CC 상태 적 에게 필살 피해를 몰아줌
                resource: 분노 35
      CS_05:
        name: 회전 베기
        baseDescription: 한쪽 사슬검을 머리 위로 회전시켜 40% 피해, 총 4타
        resource: 분노 25
        designIntent: 머리 위 회전으로 전방을 장악하는 주력 광역기
        meaningfulChoice: 횡 광역으로 다수를 쓸 것인가(원무) vs 올려베기로 강인도를 깎을 것인가(중압)
        evolution:
          pathA:
            name: 'Type B-1: 원무'
            concept: 횡베기
            nodes:
              - tier: 1
                name: 추가 필요
                description: 머리 위로 회전시킨 후 타격 추가. 전방을 크게 횡으로 베어 180% 피해
                insight: '전방 타격 추가 '
                resource: 분노 25
              - tier: 2
                name: 추가 필요
                description: 충전하여 사용 가능 (2단계). 풀차징 완료 시 한 번 더 회전하여 총 2타, 범위 증가
                insight: '차징으로 범위와 타수를 늘려 난전 유지 '
                resource: 분노 30
          pathB:
            name: 'Type B-2: 중압'
            concept: 올려베기
            nodes:
              - tier: 1
                name: 추가 필요
                description: 머리 위로 회전시킨 뒤 위로 올려베며 200% 피해
                insight: '올려베기로 한 명의 강인도 감소 유도 '
                resource: 분노 28
              - tier: 2
                name: 추가 필요
                description: 위로 올려벨 때 선딜 증가하는 대신 적 강인도 대폭 감소
                insight: '선딜을 대가로 강인도를 깎아 그로기 유도 '
                resource: 분노 32
      CS_06:
        name: 사슬 강타
        baseDescription: 사슬검을 전방으로 내리찍어 180% 피해
        resource: 분노 18
        designIntent: 전방 강타로 경직을 쌓는 중거리기
        meaningfulChoice: 흡인으로 다음 광역을 세팅할 것인가(원무) vs 좁은 3연타로 경직을 쌓을 것인가(중압)
        evolution:
          pathA:
            name: 'Type B-1: 원무'
            concept: 흡인
            nodes:
              - tier: 1
                name: 추가 필요
                description: 좌우 범위 증가. 180% 피해를 주고 적을 가운데로 모음
                insight: '적을 한 점으로 모아 다음 광역을 맞추도록 함 '
                resource: 분노 15
              - tier: 2
                name: 추가 필요
                description: 사슬을 강타한 뒤 회수할 때도 80% 피해 추가
                insight: '모은 적에게 추가 피해 '
                resource: 분노 15
          pathB:
            name: 'Type B-2: 중압'
            concept: 연타 경직
            nodes:
              - tier: 1
                name: 추가 필요
                description: 한 손으로 내려찍어 3번 연타하는 스킬로 변경. 범위는 좁아지지만 모든 타격 경직치 증가
                insight: '범위를 버리고 3연타 경직으로 단일 적 공략 '
                resource: 분노 20
              - tier: 2
                name: 추가 필요
                description: 2, 3타 피해량 증가. 3타까지 연결했을 때 강인도 감소 수치 증가
                insight: '3타까지 연결해 단일 적 대상으로 강인도를 크게 감소시킴 '
                resource: 분노 25
      CS_07:
        name: 솟아나는 칼날
        baseDescription: 사슬검을 크게 올려쳐 150% 피해
        resource: 분노 15
        designIntent: 올려치기로 연계를 여는 기동기
        meaningfulChoice: 난전 중 맞으면서 버틸 것인가(원무) vs 점프 후 특수액션으로 이을 것인가(중압)
        evolution:
          pathA:
            name: 'Type B-1: 원무'
            concept: 올려치기
            nodes:
              - tier: 1
                name: 추가 필요
                description: 올려치는 속도 증가. 올려칠 때 피격 시 받는 피해 20% 감소
                insight: 올려치는 동안 맞아도 버틸 수 있게 해 난전이 끊기지 않도록 유도
                resource: 분노 18
              - tier: 2
                name: 추가 필요
                description: 특수액션 적중 직후 사용 시, 선딜 증가하는 대신 받는 피해 감소율 30%로 증가
                insight: '특수액션 직후 맞딜 구간을 더 길게 가져가도록 함 '
                resource: 분노 22
          pathB:
            name: 'Type B-2: 중압'
            concept: 점프 연계
            nodes:
              - tier: 1
                name: 추가 필요
                description: 점프하며 전방을 1회 내려친 후 이어서 올려치며 220% 피해
                insight: '점프 연계로 접근과 올려치기를 연결  '
                resource: 분노 15
              - tier: 2
                name: 추가 필요
                description: 이후에 사용하는 특수액션 피해량 50% 증가
                insight: '적중 후 특수액션 피해를 키워 특수액션 연계 유도 '
                resource: 분노 20
      CS_08:
        name: 강철 회오리
        baseDescription: 양손으로 사슬검을 잡고 길게 늘려 회전하며 주변에 50% 피해
        resource: 분노 45
        designIntent: '광역 필살기 '
        meaningfulChoice: 연속 회전으로 처치를 굴릴 것인가(원무) vs 착지 한 방으로 그로기를 확정할 것인가(중압)
        evolution:
          pathA:
            name: 'Type B-1: 원무'
            concept: 연속 회전
            nodes:
              - tier: 1
                name: 추가 필요
                description: 연속 사용 시마다 범위·속도 증가 (총 3단계). 분노 소모량 증가
                insight: '연속 사용 시 효과 증가'
                resource: 분노 45
              - tier: 2
                name: 추가 필요
                description: 앞 키를 누르고 사용 시 전방으로 돌진하면서 사용 가능. 생명력 30% 이하인 적에게 피해량 증가
                insight: '남은 적을 쫓아 끊임없이 처치하도록 유도 '
                resource: 분노 55
          pathB:
            name: 'Type B-2: 중압'
            concept: 착지 강타
            nodes:
              - tier: 1
                name: 추가 필요
                description: 점프하여 사슬검을 회전시킨 후 아래로 강하게 착지하며 260% 피해
                insight: '착지 한 방으로 그로기 확정 유도 '
                resource: 분노 50
              - tier: 2
                name: 추가 필요
                description: 분노 소모량 증가. 마지막 타격 적중 시 적 스태미나 크게 감소
                insight: '분노를 더 태워 마지막 타로 가드브레이크 유도 '
                resource: 분노 55
  dualaxe:
    name: 쌍도끼
    description: 광기 스택을 쌓고 소모하며 변신·연계 콤보를 운용하는 쌍도끼.
    mechanic: '특수액션 돌진: 피격 시 [광기] 획득(최대 10중첩), 분노 5 생성. [광기]: 공격력 5% 증가, 받는 피해 5% 증가'
    basicAttack:
      name: 기본 공격
      description: 좌우 도끼를 번갈아 휘두르는 3연타 공격입니다.
      steps:
        - step: 1
          name: 기본 공격 1타
          description: 빠른 사선 베기
          designIntent: '첫 타이므로 시작할 때 선딜 타이밍을 좀 더 줌 '
        - step: 2
          name: 기본 공격 2타
          description: 반대쪽 사선 베기
          designIntent: 다음 타와의 연계를 위해 캔슬 프레임을 더 짧게 설정.
        - step: 3
          name: 기본 공격 3타
          description: 양손 동시 공격
          designIntent: 양손 동시 공격. 캔슬이 늦어 3타를 끝까지 칠 것인지 말 것인지 리스크를 줌
    specialAction:
      name: 돌진
      description: 짧은 거리를 돌진하여 도끼를 내려찍어 피해. 강인도 보정. 피격 시 [광기] 획득(공격력 3% 증가, 받는 피해량 3% 증가, 최대 10중첩), 분노 5 생성.
      mechanic: '피격 시 [광기] 획득, 분노 5 생성. [광기] 효과: 공격력 5% 증가, 받는 피해 5% 증가'
      designIntent: '피격 시 [광기]를 쌓는 접근기, 의도적으로 적의 공격 타이밍에 달려들어 공격을 맞음'
    movementAttackSteps:
      - step: 1
        name: 회피 공격 (앞)
        description: 앞으로 회피 후 쌍도끼를 휘둘러 공격
        designIntent: 선딜을 짧게 잡아 회피 직후 바로 공격 가능.
      - step: 2
        name: 회피 공격 (뒤)
        description: 뒤로 회피 후 쌍도끼를 양손으로 내려찍어 공격
        designIntent: 뒤로 빠진 거리만큼 양손 내려찍기로 다시 붙게 함.
      - step: 3
        name: 전력질주 공격
        description: '전력질주 중 오른쪽으로 쌍도끼를 휘둘러 공격 '
        designIntent: '전력질주 후 회전력을 이용해 짧은 선딜로 공격 '
    stances:
      A-1:
        name: 광전사
        concept: 폭발적 화력
        actionSummary: 변신 액션
        keywords:
          - 폭발적 화력
          - 분노 회복
          - 광역 섬멸
        description: 변신 전 광기를 빠르게 모아, 변신 직후 화력을 폭발시킨다.
        flowSteps:
          - 스킬로 [광기] 추가 획득
          - '[광기] 중첩 상태에서 [투신] 변신'
          - 변신 중 분노 지속 소모
        descriptionPoints:
          - '[광기] 전량 소모 / 분노 즉시 회복 / 광역 스킬 활성화'
          - 스킬 사용 시 광기 추가 획득 후 [투신]으로 화력 해방
        furyTrigger: '[광기]를 쌓은 상태에서 [투신] 변신'
        furyEffect: 변신 시 [광기] 전량 소모, 분노 즉시 회복, 광역 스킬 활성화
        furyRisk: 변신 중 분노 지속 소모. 분노가 모두 소진되면 [투신] 종료
      A-2:
        name: 추격
        concept: 스택 유지
        actionSummary: 도끼를 던지고 쫓아가는 액션
        keywords:
          - 스택 유지
          - 공속 시너지
          - 경직 강화
        description: '[광기] 스택을 상시 유지하며, 연속 공격으로 공속·경직을 극대화한다. (유리대포)'
        flowSteps:
          - 특수액션으로 접근
          - 연타로 [광기] 획득·유지
          - 리스크를 보고 후퇴 후 다음 기회
        descriptionPoints:
          - '[광기] 상태 유지 / 경직 부여 보너스 / 분노 생성량 증강'
          - '[투신] 중에도 [광기] 유지. 후퇴하며 다음 공격 기회를 엿봄'
        furyTrigger: 연타·특수액션으로 [광기] 상시 유지
        furyEffect: 스택 유지 시 공속·경직 부여 보너스, 분노 생성량 증강
        furyRisk: 유리대포. 리스크를 고려해 후퇴해야 함
      B-1:
        name: 혈투
        concept: 회피 반격
        actionSummary: 회피 반격 액션
        keywords:
          - 말뚝 딜링
          - 회피 반격
          - 리스크 전환
        description: 회피도 공격으로 취급한다. 특수액션으로 [광기] 리스크를 상쇄하고, [광기]를 전량 소모해 강력한 피해를 낸다.
        flowSteps:
          - 회피-공격 연계
          - '[광기] 리스크 상쇄'
          - 전량 소모로 강력한 피해
        descriptionPoints:
          - 최종타 전량 소모 / 방어 무시 피해 / 생명력 회복
          - 회피를 공격으로 취급하며 쌓인 리스크를 한 번에 전환
        furyTrigger: 회피 공격·특수액션으로 [광기] 운용
        furyEffect: 최종타에서 [광기] 전량 소모, 방어 무시 피해, 생명력 회복
        furyRisk: '[광기] 스택의 받는 피해 증가 패널티'
      B-2:
        name: 도살
        concept: 무한 콤보
        actionSummary: 무한 콤보 액션
        keywords:
          - 무한 콤보
          - 후딜 전용
          - 유틸리티
        description: 추가 타격으로 [광기]를 획득하고, 1스택을 소모해 후딜 캔슬 연계 또는 일반공격 콤보를 이어간다.
        flowSteps:
          - 추가 타격으로 [광기] 획득
          - 1스택 소모로 후딜 캔슬
          - 콤보 유지
        descriptionPoints:
          - '[광기] 1스택 소모 / 스태미나 즉시 회복 / 후딜 캔슬 연계'
          - 공격 사이 틈을 [광기] 소모로 메워 끊기지 않는 콤보 유지
        furyTrigger: 추가 타격으로 [광기] 획득
        furyEffect: '[광기] 1스택 소모로 후속타 연계·스태미나 즉시 회복'
        furyRisk: 콤보가 끊기면 [광기] 순환이 멈춤
    skills:
      DA_01:
        name: 학살
        baseDescription: 도끼를 왼손으로 휘둘러 80% 피해, 오른손으로 휘둘러 80% 피해
        resource: 분노 22
        designIntent: 양손 연타 주딜기
        meaningfulChoice: 소모를 올려 한 방을 무겁게 칠 것인가(광전사) vs 연속 타로 광기를 쌓을 것인가(추격)
        evolution:
          pathA:
            name: 'Type A-1: 광전사'
            concept: 광역 섬멸
            nodes:
              - tier: 1
                name: 추가 필요
                description: 분노 소모량 증가. 왼손으로 베고 오른손으로 내리쳐 120%·155% 피해
                insight: 분노를 더 태워 피해를 키운 주력기
                resource: 분노 32
              - tier: 2
                name: 추가 필요
                description: 2타 경직 부여치 25% 증가. 적중 직후 분노 생성량 25% 증가
                insight: 적중 후 경직과 분노 수급을 키워 투신 변신 전 준비 유도
                resource: 분노 32
          pathB:
            name: 'Type A-2: 추격'
            concept: 연속 추격
            nodes:
              - tier: 1
                name: 추가 필요
                description: 최대 6회 연속 공격 가능. 각 타 42% 피해. 공격 속도 15% 증가
                insight: 타수를 늘려 추격 연타를 안정화
                resource: 분노 18
              - tier: 2
                name: 추가 필요
                description: 콤보 증가 시마다 피해량 6% 증가. 콤보 적중 시마다 [광기] 획득
                insight: 콤보마다 광기를 쌓아 스택 유지 유도
                resource: 분노 18
      DA_02:
        name: 도끼 투척
        baseDescription: 도끼를 던져 100% 피해
        resource: 분노 12
        designIntent: 견제기, 연계기
        meaningfulChoice: 체인 타수로 방어를 깎을 것인가(광전사) vs 다음 스킬·특수액션을 세팅할 것인가(추격)
        evolution:
          pathA:
            name: 'Type A-1: 광전사'
            concept: 연속 타격
            nodes:
              - tier: 1
                name: 연속 타격
                description: 체인 스킬로 변경. 양손으로 도끼를 던져 80%·95% 피해
                insight: 2회로 나눠 던져 타수 증가
                resource: 분노 12
              - tier: 2
                name: 추가 필요
                description: 적 방어력 15% 감소. 2콤보 공격 시 도끼를 회수하며 반동으로 더 강하게 던져 130% 피해
                insight: 추가 피해와 방깎 부여
                resource: 분노 15
          pathB:
            name: 'Type A-2: 추격'
            concept: 연계 투척
            nodes:
              - tier: 1
                name: 추가 필요
                description: 적중 후 다음에 사용하는 스킬 피해량 25% 증가
                insight: 적중 후 다음 스킬 피해 증가로 연계 유도
                resource: 분노 10
              - tier: 2
                name: 추가 필요
                description: 특수액션 이후 연계하여 사용 시 도끼를 아래에서 위로 던져 175% 피해
                insight: 특수액션 이후 사용 시 연계기로 활용성 강화
                resource: 분노 10
      DA_03:
        name: 후려치기
        baseDescription: 양손으로 도끼를 휘둘러 70%·80% 피해
        resource: 분노 18
        designIntent: 주력 연계기
        meaningfulChoice: 3콤보로 다음 액션을 무소모로 열 것인가(광전사) vs 싸게 빨리 때리며 광기를 유지할 것인가(추격)
        evolution:
          pathA:
            name: 'Type A-1: 광전사'
            concept: 3콤보
            nodes:
              - tier: 1
                name: 추가 필요
                description: 3콤보 스킬로 사용 가능. 70%·85%·115% 피해
                insight: 3콤보로 연계 구간 확대
                resource: 분노 22
              - tier: 2
                name: 추가 필요
                description: 3콤보 적중 시 다음 액션이 스태미나를 소모하지 않음. 적중 후 5초간 초당 분노 4 생성
                insight: 3콤보 적중 시 스태미나 무소모와 분노 수급으로 변신 준비 유도
                resource: 분노 22
          pathB:
            name: 'Type A-2: 추격'
            concept: 광기 강화
            nodes:
              - tier: 1
                name: 추가 필요
                description: 공격 속도 18% 증가. 분노 소모량 감소
                insight: 소모 감소와 공속으로 스택 유지에 유리하게 함
                resource: 분노 14
              - tier: 2
                name: 추가 필요
                description: '[광기] 상태에서 적중 시 피해량 25% 증가. 적중 시 [광기] 1회 획득'
                insight: 광기 상태에서 피해와 스택을 동시에 늘려 유지 보상
                resource: 분노 14
      DA_04:
        name: 투신
        baseDescription: 8초간 [투신]으로 변신. 기본 액션만 사용 가능, 슈퍼아머. 분노가 모두 소진되면 종료. [광기] 획득 불가. (참고) 기본 공격 속도가 빠름
        resource: 분노 45
        designIntent: 변신 필살기
        meaningfulChoice: 광기를 분노로 바꿔 폭주할 것인가(광전사) vs 변신 중에도 돌진하며 스택을 들고 갈 것인가(추격)
        evolution:
          pathA:
            name: 'Type A-1: 광전사'
            concept: 광기 해방
            nodes:
              - tier: 1
                name: 추가 필요
                description: 사용 시점에 [광기]가 있으면 모두 소모하여 스택당 분노 6 회복 (최대 60)
                insight: 광기 전량 소모로 분노를 채워 변신 유지
                resource: 분노 50
              - tier: 2
                name: 추가 필요
                description: '[광기] 최대 중첩에서 사용 시 더 강화된 [투신]으로 변신. 액티브 스킬 1번 사용 가능: 점프 공격으로 주변 넓은 범위 280% 피해, 분노 모두 소모'
                insight: 최대 중첩에서 강화 투신과 광역 일격으로 전량 소모 보상
                resource: 분노 50
          pathB:
            name: 'Type A-2: 추격'
            concept: 투신 유지
            nodes:
              - tier: 1
                name: 추가 필요
                description: '[투신] 상태에서 특수액션 돌진 사용 가능. 돌진 시 적 관통, 돌진 거리 25% 증가'
                insight: 투신 중 돌진을 열어 추격을 끊지 않게 함
                resource: 분노 40
              - tier: 2
                name: 추가 필요
                description: '[투신] 상태에서 스태미나 회복량 40% 증가. 기본 공격 속도 20% 증가'
                insight: 투신 중 스태미나와 공속을 키워 유지력 강화
                resource: 분노 40
      DA_05:
        name: 쪼개기
        baseDescription: 도끼를 내려찍어 180% 피해
        resource: 분노 18
        designIntent: 내려찍기 주력기
        meaningfulChoice: 회피 공격 후 점프 강타로 이을 것인가(혈투) vs 느린 한 방을 1스택으로 후속타할 것인가(도살)
        evolution:
          pathA:
            name: 'Type B-1: 혈투'
            concept: 회피 연계
            nodes:
              - tier: 1
                name: 집념
                description: 회피 공격 성공 후 사용 시 점프하여 도끼를 내리찍어 240% 피해
                insight: 회피 공격 성공 후 사용을 유도
                resource: 분노 15
              - tier: 2
                name: 추가 필요
                description: 내려찍을 때 경직치 25% 증가
                insight: 내려찍기 경직을 키워 회피 연계 보상
                resource: 분노 15
          pathB:
            name: 'Type B-2: 도살'
            concept: 후속타
            nodes:
              - tier: 1
                name: 추가 필요
                description: 공격 속도 20% 감소하는 대신 250% 피해
                insight: 속도를 버려 피해를 키운 한 방
                resource: 분노 24
              - tier: 2
                name: 추가 필요
                description: '[광기]가 있으면 1스택 소모하여 후속타 연계 가능. 후속타 125% 피해'
                insight: 광기 1스택으로 후속타를 열어 콤보 유지 유도
                resource: 분노 24
      DA_06:
        name: 도끼 강화
        baseDescription: 8초간 피해량 20% 증가, 이동속도 15% 증가
        resource: 분노 25
        designIntent: 버프기
        meaningfulChoice: 광기 비례 회복·넉백으로 거리를 벌 것인가(혈투) vs 분노 회복·경직 저항으로 콤보를 버틸 것인가(도살)
        evolution:
          pathA:
            name: 'Type B-1: 혈투'
            concept: 혈기
            nodes:
              - tier: 1
                name: 추가 필요
                description: 사용 시 주변 적을 1초간 [넉백]
                insight: 사용 시 넉백으로 다음 회피 공격 준비
                resource: 분노 22
              - tier: 2
                name: 혈기
                description: 사용 시 [광기] 스택 수에 비례해 생명력 4% 회복
                insight: 광기 스택 비례 회복으로 리스크 상쇄
                resource: 분노 22
          pathB:
            name: 'Type B-2: 도살'
            concept: 강인
            nodes:
              - tier: 1
                name: 추가 필요
                description: 초당 분노 7 회복
                insight: 초당 분노 회복으로 콤보 연료를 보충
                resource: 분노 20
              - tier: 2
                name: 추가 필요
                description: 사용 시 [광기] 스택 수에 비례해 경직 저항 8% 증가
                insight: 광기 비례 경직 저항으로 맞딜 유지 유도
                resource: 분노 20
      DA_07:
        name: 박치기
        baseDescription: 전방으로 돌진하며 150% 피해
        resource: 분노 18
        designIntent: 접근기
        meaningfulChoice: 다운으로 판을 열 것인가(혈투) vs 맞으면서 광기를 벌 것인가(도살)
        evolution:
          pathA:
            name: 'Type B-1: 혈투'
            concept: 돌진 압박
            nodes:
              - tier: 1
                name: 추가 필요
                description: 박치기 돌진 거리 35% 증가. 적 공격력 15% 감소
                insight: 돌진 거리와 디버프로 압박 강화
                resource: 분노 22
              - tier: 2
                name: 추가 필요
                description: '[광기] 상태에서 피해량 30% 증가, 적 [다운]'
                insight: 광기 상태에서 다운을 통해 회피 연계 유도
                resource: 분노 25
          pathB:
            name: 'Type B-2: 도살'
            concept: 맞딜
            nodes:
              - tier: 1
                name: 추가 필요
                description: 스킬 사용 중 받는 피해 25% 감소
                insight: 사용 중 받는 피해 감소로 맞딜 구간 확보
                resource: 분노 15
              - tier: 2
                name: 추가 필요
                description: 스킬 사용 중 피격 시 [광기] 1스택 획득
                insight: 사용 중 피격 시 광기를 쌓아 맞으면서 때리게 함
                resource: 분노 15
      DA_08:
        name: 도끼 난타
        baseDescription: 점프하여 도끼를 내리찍어 220% 피해
        resource: 분노 45
        designIntent: 필살기
        meaningfulChoice: 2타에서 광기 전량을 소모할 것인가(혈투) vs 평타로 1스택 후딜 캔슬을 살 것인가(도살)
        evolution:
          pathA:
            name: 'Type B-1: 혈투'
            concept: 전량 소모
            nodes:
              - tier: 1
                name: 추가 필요
                description: 점프하여 접근. 1타 올려치기 110%, 2타 내려찍기 170%
                insight: 점프 2타로 접근과 강타를 한 동작에 넣음
                resource: 분노 50
              - tier: 2
                name: 추가 필요
                description: 2타에서 [광기] 전량 소모하여 스택당 18% 추가 피해
                insight: 2타에서 광기 전량 소모로 강력한 피해를 보상
                resource: 분노 55
          pathB:
            name: 'Type B-2: 도살'
            concept: 후딜 캔슬
            nodes:
              - tier: 1
                name: 추가 필요
                description: '일반공격 입력 시 후속타 연계: 도끼를 들고 전방으로 빠르게 회전하며 95% 피해. [광기] 1스택 소모'
                insight: 평타 입력으로 후딜을 지워 콤보 유지 유도
                resource: 분노 40
              - tier: 2
                name: 추가 필요
                description: 시전 중 CC 면역
                insight: 시전 중 CC 면역으로 캔슬 구간을 보호
                resource: 분노 40
  battleaxe:
    name: 전투도끼
    description: 분노를 수급·유지·소모하며 축적/분쇄/응징/파쇄 빌드를 운용하는 전투도끼.
    mechanic: 핵심 자원 분노. 평타·돌진·가드·피격으로 수급. 분노를 생성하는 액티브는 소모하지 않음.
    basicAttack:
      name: 기본 공격
      description: 느리지만 강력한 3연타 공격입니다. 슈퍼아머가 적용됩니다.
      steps:
        - step: 1
          name: 기본 공격 1타
          description: '오른쪽에서 왼쪽 사선으로 내려그으며 피해 '
          designIntent: 긴 선딜로 무게감을 주고 맞으면서 분노를 쌓는 시작.
        - step: 2
          name: 기본 공격 2타
          description: 왼쪽에서 오른쪽 사선으로 내려그으며 피해
          designIntent: 반대 사선으로 이어 1타의 느린 템포를 중간에서 만회.
        - step: 3
          name: 기본 공격 3타
          description: 위에서 아래로 내려찍으며 피해
          designIntent: 내려찍기 결산. 넓은 판정과 늦은 캔슬로 한 방의 리스크를 남김.
    specialAction:
      name: 돌진
      description: 적을 향해 돌진. 유지 중 스태미나 소모, 피격 시에도 스태미나 소모(오버밸런스 방지). 타격마다 분노 5 생성.
      mechanic: 유지·피격 시 스태미나 소모. 타격마다 분노 5 생성
      designIntent: 스태미나를 태우며 분노를 쌓는 접근기
    movementAttackSteps:
      - step: 1
        name: 회피 공격 (앞)
        description: 앞으로 회피 후 전투도끼를 뒤로 뺀 후 내려찍어 피해
        designIntent: 회피 후에도 캔슬이 늦어 무게감을 유지.
      - step: 2
        name: 회피 공격 (뒤)
        description: '뒤로 회피 후 한 손으로 전투도끼를 내려찍어 피해 '
        designIntent: '한 손 내려찍기로 후퇴하기 전의 거리 만큼은 때릴 수 있도록 함 '
      - step: 3
        name: 전력질주 공격
        description: 전력질주 중 점프하여 양 손으로 도끼를 내려찍어 피해
        designIntent: 전력질주 후 공격은 캔슬을 당겨 접근 후 스킬로 잇게 함.
    stances:
      A-1:
        name: 축적
        concept: 그릇 확장
        actionSummary: 휠윈드 액션
        keywords:
          - 그릇 확장
          - 지속딜
          - 일격
        description: 최대 분노량을 늘려 소용돌이로 무한 지속딜을 넣거나, 모든 분노를 한 번에 쏟아 일격으로 마무리한다.
        flowSteps:
          - 분노 확장
          - 지속딜 유지
          - 전량 소모 일격
        descriptionPoints:
          - 스킬 사용 중 피격 시 최대 분노 획득량 증가
          - 분노로 소용돌이를 최대한 오래 유지. 리스크 완화·지속력에 집중
        furyTrigger: 스킬 사용 중 피격 시 최대 분노량 확장
        furyEffect: 확장된 분노로 지속딜 유지 후 전량 소모 일격
        furyRisk: 분노 50% 이하 시 받는 피해 18% 증가
      A-2:
        name: 분쇄
        concept: 경직 활용
        actionSummary: 순간 가속 액션
        keywords:
          - 경직 활용
          - 빠른 수급
          - 빠른 소모
        description: 적이 경직된 틈을 노려 빠른 소용돌이로 압박한다. 분노를 매우 빠르게 쌓고 즉시 소진하는 순환에 특화.
        flowSteps:
          - 경직 틈새
          - 폭발적 수급
          - 가속 소모 타격
        descriptionPoints:
          - 특수액션 돌진으로 분노를 수급한 뒤 빠른 연타로 경직·무력화
          - 폭발적 위력·무력화에 집중
        furyTrigger: 경직된 적 상대로 분노 수급 효율 증가
        furyEffect: 빠른 수급 후 가속 소용돌이로 즉시 소모
        furyRisk: 순환이 끊기면 위력 40% 감소
      B-1:
        name: 응징
        concept: 피격 환원
        actionSummary: 견뎌내는 액션
        keywords:
          - 피격 강화
          - 피해 환원
          - 반격
        description: 차징 중 적의 공격을 의도적으로 허용해 분노와 위력을 증폭한다. 받은 피해를 파괴력으로 돌려주는 복수형 반격.
        flowSteps:
          - 차징 대기
          - 피격 에너지
          - 피해 환원 타격
        descriptionPoints:
          - 충전 중 피격으로 분노를 채우고 최대 분노에서 풀충전 스킬 즉시 발동
          - 충전 단계가 높을수록 리턴이 큼. 잘 예측하고 맞는다
        furyTrigger: 충전 중 피격 시 분노·위력 증폭
        furyEffect: 받은 피해를 파괴력으로 환원. 풀충전 스킬 즉시 발동
        furyRisk: 차징 중 피격을 허용해야 함
      B-2:
        name: 파쇄
        concept: 경직 면역
        actionSummary: 전차처럼 돌파하는 액션
        keywords:
          - 경직 면역
          - 패널티 상쇄
          - 콤보 연계
        description: 분노 100%에서 완전한 경직 면역. 100% 미만 패널티는 기본 공격·스킬 연계로 끊임없이 상쇄한다.
        flowSteps:
          - 분노 MAX
          - 면역 돌파
          - 패널티 상쇄 콤보
        descriptionPoints:
          - 스킬에서 분노를 많이 쓰지만 다른 효과로 즉시 수급
          - '"멈추면 죽는" 패널티. 절대적인 강인함으로 억압'
        furyTrigger: 분노 100%에서 경직 면역
        furyEffect: 콤보 연계로 100% 미만 패널티를 상쇄하며 돌파
        furyRisk: 분노가 100% 미만으로 떨어지면 강인도 32% 감소. 멈추면 죽는 패널티
    skills:
      BA_01:
        name: 소용돌이
        baseDescription: 타격당 42% 피해, 최대 8회 회전. 회전마다 분노 8 소모. 분노 모두 소모 시 또는 재사용 시 종료. 사용 중 이동 가능
        resource: 분노 8 / 회전
        designIntent: 회전 지속 주딜기
        meaningfulChoice: 회전 수를 늘려 그릇을 비울 것인가(축적) vs 보유량으로 가속해 창에 쏟을 것인가(분쇄)
        evolution:
          pathA:
            name: 'Type A-1: 축적'
            concept: 무한 지속
            nodes:
              - tier: 1
                name: 무한
                description: 최대 회전 횟수 12회로 증가
                insight: 회전 상한을 올려 소용돌이 유지를 강화
                resource: 분노 8 / 회전
              - tier: 2
                name: 추진력
                description: 종료 시 도끼를 올려치며 210% 피해
                insight: '종료 올려치기로 유지 구간에 축적된 피해를 보상 '
                resource: 분노 8 / 회전
          pathB:
            name: 'Type A-2: 분쇄'
            concept: 가속 분쇄
            nodes:
              - tier: 1
                name: 가속
                description: 분노 보유량에 따라 회전 속도 증가(총 3단계). 속도가 빠를수록 선딜/후딜 증가. 단계에 따라 분노 8 / 12 / 16 소모
                insight: 보유량에 비례해 가속하되 분노 소모량도 증가해 오래 사용하지 못함
                resource: 분노 8~16 / 회전
              - tier: 2
                name: 바람의 톱날
                description: 3단계 소용돌이 피해량 28% 증가. 3단계 소용돌이 타격당 적 스태미나 8% 감소
                insight: 3단계 피해·스태미나 깎기로 분노 가속 소모 구간의 압박을 보상
                resource: 분노 8~16 / 회전
      BA_02:
        name: 분노의 도끼
        baseDescription: 도끼를 내려찍어 190% 피해
        resource: 분노 25
        designIntent: 내려찍기 주력기
        meaningfulChoice: 선딜을 먹고 다운·피격 수급을 받을 것인가(축적) vs 평타 후속타로 경직을 깎을 것인가(분쇄)
        evolution:
          pathA:
            name: 'Type A-1: 축적'
            concept: 강타
            nodes:
              - tier: 1
                name: 추가 필요
                description: 선딜 증가, 피해량 65% 증가. 적 [다운]
                insight: 선딜을 대가로 다운을 얻어 일격 전 적을 무방비 상태로 만듦
                resource: 분노 28
              - tier: 2
                name: 추가 필요
                description: 선딜 동작에 타격 추가, 95% 피해. 사용 중 피격 시 분노 14 회복
                insight: 선딜 타격과 피격 분노 회복으로 맞으면서 분노 수급
                resource: 분노 32
          pathB:
            name: 'Type A-2: 분쇄'
            concept: 후속타
            nodes:
              - tier: 1
                name: 추가 필요
                description: 사용 후 기본 공격 시 후속타 연계하여 135% 피해
                insight: 평타 후속타를 열어 경직 연계 유도
                resource: 분노 22
              - tier: 2
                name: 추가 필요
                description: 후속타 피해량 25% 증가. 후속타 적중 시 적 경직치 30% 감소
                insight: '후속타 피해·경직 깎기로 경직 연계 유도 '
                resource: 분노 22
      BA_03:
        name: 천둥의 역습
        baseDescription: 적의 공격 [가드], 성공 시 분노 18 생성
        resource: 분노 +18
        designIntent: 가드, 분노 수급기
        meaningfulChoice: 충전 패링으로 판을 리셋할 것인가(축적) vs 가드 성공을 다운 후속타로 바꿀 것인가(분쇄)
        evolution:
          pathA:
            name: 'Type A-1: 축적'
            concept: 패링
            nodes:
              - tier: 1
                name: 추가 필요
                description: 충전 가능. 충전 중 [가드]. 완료 시 도끼를 올려쳐 패링 가능
                insight: 충전 가드·패링으로 피격을 받아내는 선택을 유도
                resource: 분노 +18
              - tier: 2
                name: 추가 필요
                description: 패링 성공 시 후속타 연결 가능. 패링 성공 시 분노 22 생성
                insight: 패링 성공 후속타로 공격 연계
                resource: 분노 +22
          pathB:
            name: 'Type A-2: 분쇄'
            concept: 가드 연계
            nodes:
              - tier: 1
                name: 추가 필요
                description: '[가드] 성공 후 일반공격이 후속타로 발동 (총 2콤보, 어깨로 친 후 내려치는 모션). 가드 성공 시 분노 22 생성'
                insight: 가드 성공을 2콤보 후속타로 바꿔 순환 유도
                resource: 분노 +22
              - tier: 2
                name: 추가 필요
                description: 후속타 적중 시 적 [다운]. 가드 성공 시 분노 25 생성
                insight: '후속타 다운으로 경직 발판 마련 '
                resource: 분노 +25
      BA_04:
        name: 혼신의 일격
        baseDescription: 전방 범위 235% 피해, 적 다운
        resource: 분노 42
        designIntent: 전량 결산 필살기
        meaningfulChoice: 분노 전량을 한 방에 넣을 것인가(축적) vs 2타 후속타로 무력화를 깎을 것인가(분쇄)
        evolution:
          pathA:
            name: 'Type A-1: 축적'
            concept: 전량 소모
            nodes:
              - tier: 1
                name: 정신 집중
                description: 힘을 모아 340% 피해
                insight: 모아서 피해를 키운 일격
                resource: 분노 48
              - tier: 2
                name: 혼신의 힘
                description: 3단계 충전 공격 가능. 분노를 모두 소모해 분노 10당 32% 추가 피해
                insight: 3단계 충전·전량 소모로 키운 분노 최대치를 모두 소모
                resource: 분노 전량
          pathB:
            name: 'Type A-2: 분쇄'
            concept: 무력화
            nodes:
              - tier: 1
                name: 반동
                description: 올려친 뒤 다시 내려치며 90%·200% 피해
                insight: 2타로 나눠 경직 상태에서 타격을 늘림
                resource: 분노 38
              - tier: 2
                name: 압도적인 힘
                description: 적중 시 후속타 연계 가능. 후속타 적중 시 적 무력화 게이지 35% 감소
                insight: 후속타 무력화 깎기로 다음 순환을 유도
                resource: 분노 38
      BA_05:
        name: 절단
        baseDescription: 도끼를 내려찍어 165% 피해, 충전 가능 (2단계)
        resource: 분노 18
        designIntent: 내려찍기 주력기
        meaningfulChoice: 3단계 충전 후 올려치기로 이을 것인가(응징) vs 충전을 버리고 평타 직후 무소모로 칠 것인가(파쇄)
        evolution:
          pathA:
            name: 'Type B-1: 응징'
            concept: 충전
            nodes:
              - tier: 1
                name: 추가 필요
                description: 3단계까지 충전 가능. 단계당 피해량 22% 증가
                insight: 충전 단계를 늘려 맞아 주는 시간을 늘림
                resource: 분노 22
              - tier: 2
                name: 추가 필요
                description: 적중 후 일반공격 사용 시 후속타 연계 가능. 도끼를 올려치며 140% 피해
                insight: '적중 후 후속타로 충전 중 맞은 후 추가 효과 부여 예정 '
                resource: 분노 22
          pathB:
            name: 'Type B-2: 파쇄'
            concept: 가속
            nodes:
              - tier: 1
                name: 추가 필요
                description: 충전 불가능한 대신 공격 속도 18% 증가. 분노 소모량 감소
                insight: 충전 삭제·소모 감소로 콤보 접착을 빠르게 함
                resource: 분노 14
              - tier: 2
                name: 추가 필요
                description: 기본 공격 적중 직후 사용 시 분노 소모하지 않음
                insight: 평타 직후 무소모로 100 유지를 유도
                resource: 분노 14
      BA_06:
        name: 피의 장막
        baseDescription: 8초간 생명력 22%의 보호막 생성. 8초간 피격 시 피해 유예
        resource: 분노 28
        designIntent: 유예 버프기
        meaningfulChoice: 피격 횟수를 공업·폭발로 바꿀 것인가(응징) vs 유예 창의 수급·CC 해제를 살 것인가(파쇄)
        evolution:
          pathA:
            name: 'Type B-1: 응징'
            concept: 피격 보상
            nodes:
              - tier: 1
                name: 추가 필요
                description: 효과 종료 시 주변에 175% 피해
                insight: 종료 폭발로 유예 구간의 결산을 보상
                resource: 분노 32
              - tier: 2
                name: 추가 필요
                description: 유지 중 피격 시마다 공격력 7% 증가
                insight: 피격마다 공업으로 맞아 주는 선택을 강화
                resource: 분노 32
          pathB:
            name: 'Type B-2: 파쇄'
            concept: 유예 수급
            nodes:
              - tier: 1
                name: 추가 필요
                description: 피해가 유예되는 동안 분노 생성량 28% 증가
                insight: 유예 동안 수급을 키워 100을 다시 채우게 함
                resource: 분노 24
              - tier: 2
                name: 추가 필요
                description: CC 해제하면서 사용 가능
                insight: CC 해제로 끊긴 콤보를 잇게 함
                resource: 분노 24
      BA_07:
        name: 처형 예고
        baseDescription: 도끼를 던져 95% 피해, 분노 12 생성
        resource: 분노 +12
        designIntent: 견제 수급기
        meaningfulChoice: 생성·도발 후 평타를 충전할 것인가(응징) vs 생성을 포기하고 충전 투척으로 경직을 깎을 것인가(파쇄)
        evolution:
          pathA:
            name: 'Type B-1: 응징'
            concept: 도발
            nodes:
              - tier: 1
                name: 추가 필요
                description: 도끼가 적중한 곳에 충격파 발생, 범위 도발. 분노 12 생성
                insight: 충격파 도발로 맞을 판을 스스로 만듦
                resource: 분노 +12
              - tier: 2
                name: 주목의 순간
                description: 적중 후 다음에 사용하는 기본공격 1타 충전 가능 (총 3단계). 분노 16 생성
                insight: 다음 평타 충전으로 피격 환원을 평타까지 연장
                resource: 분노 +16
          pathB:
            name: 'Type B-2: 파쇄'
            concept: 충전 투척
            nodes:
              - tier: 1
                name: 추가 필요
                description: 분노를 생성하지 않는 대신 충전 가능. 충전 후 도끼 적중 시 피해량 60% 증가
                insight: '충전 투척으로 견제를 콤보 타격으로 변경 '
                resource: 분노 22
              - tier: 2
                name: 추가 필요
                description: 적중한 적의 경직치 25% 감소
                insight: '경직치 감소 효과로 견제기 성능 강화 '
                resource: 분노 22
      BA_08:
        name: 회전격
        baseDescription: 도끼를 들고 힘으로 회전해 총 210% 피해. 사용 중 [슈퍼아머]
        resource: 분노 42
        designIntent: 슈퍼아머 필살기
        meaningfulChoice: 풀차징 추가 회전을 버틸 것인가(응징) vs 전량을 쏟고 처치 리턴을 노릴 것인가(파쇄)
        evolution:
          pathA:
            name: 'Type B-1: 응징'
            concept: 풀차징
            nodes:
              - tier: 1
                name: 추가 필요
                description: 충전하여 사용 가능 (2단계). 풀차징 공격은 1회 추가 회전하여 2타 130%·150% 피해
                insight: '풀차징 추가 회전으로 피해량 증가 '
                resource: 분노 48
              - tier: 2
                name: 추가 필요
                description: 풀차징 공격의 공격 속도 22% 증가
                insight: '풀차징 공속으로 맞을 필요 없이 일격에 마무리 '
                resource: 분노 48
          pathB:
            name: 'Type B-2: 파쇄'
            concept: 전진 회전
            nodes:
              - tier: 1
                name: 추가 필요
                description: 앞으로 전진하며 도끼를 회전시켜 6번 타격, 총 230% 피해. 좌우 범위 감소, 사거리 증가
                insight: 전진 회전으로 사거리를 확보해 콤보가 끊기지 않게 함
                resource: 분노 42
              - tier: 2
                name: 추가 필요
                description: 사용 시점의 분노 10당 28% 추가 피해 → 분노 모두 소모. 적 처치 시 소모된 분노 리턴
                insight: 전량 소모·처치 리턴으로 다시 분노를 100으로 만들 수 있는 순환의 여지를 남겨둠
                resource: 분노 전량
passives:
  CS-T5-A1:
    name: 피의 강인
    summary: 추가 필요
    description: 피격 시 5초간 강인도 대폭 증가
    designerIntent: 피격 후 공격을 끊기지 않고 퍼부울 수 있도록 하는 중요 패시브
  CS-T5-A2:
    name: 분노의 맹약
    summary: 추가 필요
    description: 분노 50% 이상일 때 스킬 피해량 대폭 증가. 분노 50% 미만이면 방어력 20% 감소
    designerIntent: 분노 50% 유지를 성공 조건으로 걸고, 미만이면 방어를 깎아 게이지 운영을 강제
  CS-T5-B1:
    name: 무아지경
    summary: 추가 필요
    description: 액티브 스킬 사용 중 분노 소모 속도 가속화. 대신 액티브 사용 중 5회 이상 적중 시 분노 대폭 생성 및 피해량 50% 증가 (5중첩)
    designerIntent: 난전에서 타수를 유지하면 자원을 돌려받고 피해가 폭증하도록 처치 순환 유도
  CS-T5-B2:
    name: 광폭한 일격
    summary: 추가 필요
    description: 분노 100% 달성 시 다음 공격이 반드시 확정 경직. 단, 효과 발동 후 5초간 자신의 강인도도 대폭 감소
    designerIntent: 분노 100%에서 그로기를 확정하되, 직후 강인도가 감소되는 리스크로 대가 부여
  CS-T4-A1:
    name: '날카로운 광란 '
    summary: 추가 필요
    description: 분노 100% 도달 시 10초간 치명타 피해량 20% 증가, 대신 방어력 20% 추가 감소
    designerIntent: 패시브 광란과 조합하여 효과를 극대화하는 패시브
  CS-T4-A2:
    name: 속박
    summary: 추가 필요
    description: 적에게 CC 부여 시마다 분노 10 생성 및 공격력 20% 증가. 대신 자신의 스태미나 소모량 20% 증가
    designerIntent: CC 액티브 위주 운영을 유도하고, 평타·회피 비용을 올려 거리 통제에 투자하게 함
  CS-T4-B1:
    name: 학살 관성
    summary: 처치 후 무소모
    description: 적을 처치한 후 다음 액티브 스킬이 분노를 소모하지 않음. 단, 액티브 사용 전까지 회피 불가
    designerIntent: 처치 직후 다음 스킬을 공짜로 만들되, 그 사이 회피를 막아 리스크를 둠
  CS-T4-B2:
    name: 광압
    summary: 추가 필요
    description: 분노 70% 이상일 때 모든 타격 경직치 20% 증가. 대신 회피 시 스태미나 소모량 20% 증가
    designerIntent: 분노 70% 이상에서 전 타격 경직을 키우고, 회피 비용을 올려 붙어서 때리게 함
  CS-T4-AS1:
    name: 피의 환희
    summary: 추가 필요
    description: 치명타 발생 시마다 피해량 5% 증가, 생명력 3% 회복
    designerIntent: 다단히트로 치명타 발생 시 유리한 패시브
  CS-T4-AS2:
    name: 전투 개시
    summary: 추가 필요
    description: 특수액션 적중 후 기본 공격 피해량 20% 증가, 분노 생성량 20% 증가
    designerIntent: 특수액션 적중 후 평타를 통한 자원 수급량을 키워, 스테미나 부담이 큰 척력의 빈 구간을 메꿈
  CS-T4-BS1:
    name: 사슬의 학살
    summary: 추가 필요
    description: 체인 스킬 적중 시마다 피해량 5% 증가 (10중첩)
    designerIntent: '체인 적중이 쌓일수록 광역 피해가 커져 처치 속도를 가속화 '
  CS-T4-BS2:
    name: 연속 제압
    summary: 추가 필요
    description: 체인 스킬 적중 시마다 공격의 경직치 5% 증가 (10중첩)
    designerIntent: 체인 적중이 쌓일수록 경직이 커져 그로기 발생이 쉬워짐
  CS-T3-A1:
    name: 광란
    summary: 광란 상태
    description: 분노 100% 도달 시 10초간 [광란]. 기본 공격의 사거리가 감소하는 대신 공격 속도 증가, 강인도 증가. 대신 초당 분노 소모량 10% 증가, 받는 피해 10% 증가
    designerIntent: '분노 100% 도달 시 기본 공격의 속도가 빨라져 순간적인 폭딜 가능. '
  CS-T3-A2:
    name: 피의 거래
    summary: 추가 필요
    description: 분노 100% 도달 시 CC 상태 적에게 공격이 적중할 때마다 10% 추가 피해. 추가 피해 적중 시마다 자신의 강인도 5% 감소
    designerIntent: 분노를 100%로 유지할 때 이점을 주기 위한 패시브
  CS-T3-B1:
    name: '처치 가속 '
    summary: 추가 필요
    description: 적 처치 시 공격력 10% 증가, 대신 방어력 10% 감소 (5중첩)
    designerIntent: 처치할수록 공격이 세지고 방어가 깎여, 난전을 이어야 이득이 되도록 유도함
  CS-T3-B2:
    name: 압살
    summary: 추가 필요
    description: 기본 공격 경직치 20% 증가, 대신 스태미나 소모량도 20% 증가
    designerIntent: '평타 경직을 키우는 대신 스테미나를 더 쓰게 해, 무게를 싣는 만큼 기동력 감소 '
  CS-T3-AS1:
    name: 끓는 숨
    summary: 추가 필요
    description: 분노가 50% 이상일 때 스태미나 회복량 30% 증가
    designerIntent: 분노를 높게 가져갈 때 회피, 특수액션 사용에 유리함
  CS-T3-AS2:
    name: 절제된 광기
    summary: 추가 필요
    description: 액티브 스킬 분노 소모량 15% 감소
    designerIntent: '분노 수급을 용이하게 해주는 패시브 '
  CS-T3-BS1:
    name: 불굴 난무
    summary: 추가 필요
    description: 분노가 50% 이상일 때 공격 적중마다 강인도 10% 강화 (5중첩)
    designerIntent: 분노를 높게 유지한 채 때릴수록 강인도가 쌓여 공격이 끊기지 않게 함
  CS-T3-BS2:
    name: 제압
    summary: 추가 필요
    description: 적 경직 시 분노 생성량 30% 증가
    designerIntent: 경직시킬수록 분노를 수급, 무력화와 수급을 같은 행동에 묶음
  CS-T2-A1:
    name: 살의 예열
    summary: 추가 필요
    description: 특수액션 적중 후 5초간 치명타 확률 5% 증가
    designerIntent: '공격 전 특수액션 활용 유도 '
  CS-T2-A3:
    name: 활력
    summary: 추가 필요
    description: 치명타 발생 시마다 분노 5 생성
    designerIntent: '치명타 발생 -> 자원 수급으로 순환 유도 '
  CS-T2-A2:
    name: 제압의 숨
    summary: 추가 필요
    description: '적에게 CC 부여 후 5초간 분노 생성량 20% 증가 '
    designerIntent: 'CC 부여 시 자원 수급 속도 증가 '
  CS-T2-A4:
    name: 분노 유지
    summary: 추가 필요
    description: 분노 50% 이상이면 초당 분노 소모량 감소
    designerIntent: '분노를 높은 상태로 유지하기 쉽게 도움을 주는 패시브 '
  CS-T2-B1:
    name: '전투 호흡 '
    summary: 추가 필요
    description: '적에게 공격 적중 시마다 스태미나 5 회복. '
    designerIntent: 한 방이 아니라 다수 적중일 때 의미가 있으므로 난전을 유도
  CS-T2-B3:
    name: '전투의 흥분 '
    summary: 추가 필요
    description: 적 처치 후 5초간 모든 공격 적중 시마다 분노 5 생성
    designerIntent: '처치 후 짧은 시간 타격마다 분노가 생성되므로 계속 몰아치는 플레이 유도 '
  CS-T2-B2:
    name: 넘치는 분노
    summary: 추가 필요
    description: 특수액션으로 생성하는 분노 수치 30% 증가
    designerIntent: '특수액션 수급을 키워 해당 빌드 내 특수액션 운용 증가 유도 '
  CS-T2-B4:
    name: 내려치는 사슬
    summary: 추가 필요
    description: 적을 경직시킬 때 무력화 저항력 15% 감소 디버프 부여
    designerIntent: '경직할 때마다 무력화 저항을 깎아, 같은 대상을 계속 공격하도록 유도 '
  DA-T5-A1:
    name: 투신 회귀
    summary: 추가 필요
    description: '[투신] 종료 시 공격 횟수만큼 분노 최대 6 리턴. 대신 [투신] 유지 중 분노 지속 소모량 12% 증가. [투신] 유지시간 12초로 연장'
    designerIntent: '[투신] 중 더 많이 때릴수록 종료 후 분노를 돌려받는 순환 유도'
  DA-T5-A2:
    name: 투신 흡혈
    summary: 추가 필요
    description: '[투신] 종료 시 공격 횟수만큼 생명력 최대 4% 리턴. [투신] 유지 중 분노 지속 소모량 15% 감소. 대신 [투신] 중 피격 시 분노 8 추가 소모'
    designerIntent: '[투신] 소모를 줄여 유지를 돕되, 피격 시 분노 추가 소모로 리스크 부여'
  DA-T5-B1:
    name: 극한의 혈투
    summary: 추가 필요
    description: '[광기] 최대 중첩 시 공격력과 받는 피해 모두 45% 증가'
    designerIntent: '[광기] 최대에서 화력과 받는 피해를 동시에 극대화하는 패시브'
  DA-T5-B2:
    name: 치명적인 도살
    summary: 치명타 순환
    description: 치명타 발생 시 스태미나·분노 8% 회복, 25% 확률로 [광기] 1 추가 획득
    designerIntent: 치명타 발생 -> 자원·광기 수급으로 콤보 순환 유도
  DA-T4-A1:
    name: 불안정한 광기
    summary: 전량 소모 폭주
    description: >-
      회피 스태미나 소모량 25% 증가하는 대신 액티브 스킬 피해량 25% 증가. [광기]를 최대 중첩에서 모두 소모할 때 5초간 피해량 35% 증가. [광기]가 지속시간 만료로 사라지면 탈진: 8초간 분노 생성량
      25% 감소, 이동 속도 15% 감소
    designerIntent: '[광기] 전량 소모 시 폭주, 만료 시 탈진으로 투신 전 사용을 유도'
  DA-T4-A2:
    name: 광기 도약
    summary: 회피 충전
    description: >-
      [광기] 상태에서 기본 공격 적중 시 3초간 다음 공격에 경직 부여치 25% 보너스, 대신 경직 저항 25% 감소. [광기] 상태에서 회피 공격을 충전해서 사용 가능. 충전 완료 시 회피 공격 돌진 거리
      40% 증가
    designerIntent: '[광기] 유지 중 평타 경직을 키우고, 충전 회피로 거리를 다시 잡게 함'
  DA-T4-B1:
    name: '혈공 '
    summary: 추가 필요
    description: '[광기] 상태에서 특수액션 돌진의 후속타 연계 가능. 후속타는 공중에서 도끼를 내리찍어 210% 피해'
    designerIntent: 특수액션 돌진 후 후속타를 넣어 회피-돌진 연계 유도
  DA-T4-B2:
    name: 연쇄 도살
    summary: 추가 필요
    description: 체인 공격 사용마다 치명타 피해 6% 증가 (최대 10중첩). 단, 스킬 분노 소모량 12% 증가
    designerIntent: 체인 적중이 쌓일수록 치명타 피해가 커져 콤보 유지 유도
  DA-T4-AS1:
    name: 끓어오르는 일격
    summary: 추가 필요
    description: 분노량이 50% 이상일 때 기본 공격 피해량 25% 증가
    designerIntent: 분노를 높게 가져갈 때 평타 화력이 커지는 패시브
  DA-T4-AS2:
    name: 분노의 숨
    summary: 추가 필요
    description: '[광기] 상태에서 연속 공격 시마다 분노 생성량 8% 증가 (5중첩)'
    designerIntent: '[광기] 상태에서 연속 공격할수록 분노 수급 가속 유도'
  DA-T4-BS1:
    name: 고통 전환
    summary: 피격 보상
    description: 특수액션 중 피격 시 4초간 다음 스킬 피해량 70% 증가
    designerIntent: 특수액션 중 피격을 다음 스킬 피해로 전환하는 패시브
  DA-T4-BS2:
    name: 예리한 도끼
    summary: 추가 필요
    description: '[광기] 소모 시마다 치명타 확률 8% 증가 (최대 5중첩)'
    designerIntent: '[광기] 소모 시 치명타 확률을 올려 후딜 캔슬을 보상'
  DA-T3-A1:
    name: 피의 광기
    summary: 추가 필요
    description: 생명력이 50% 이하일 때 돌진 중 피격 시 [광기] 1회 추가 획득
    designerIntent: 생명력이 낮을 때 돌진 피격으로 광기를 더 쌓게 유도
  DA-T3-A2:
    name: 살인 돌격
    summary: 추가 필요
    description: 도끼 적중 후 다음 특수액션 돌진이 강화되어 180% 피해, 경직 부여치 25% 증가. 중간에 다른 스킬을 쓰면 효과 발동 안 함
    designerIntent: 도끼 적중 직후 돌진만 연결해야 강화되도록 연계를 강제
  DA-T3-B1:
    name: 피의 돌진
    summary: 강화 회피 공격
    description: 공격 종료 후 1초 이내 전방 회피 시 강화 회피 공격 발동 (회피 판정). 적중 시 [광기] 1 획득
    designerIntent: 공격 직후 회피를 강화 회피 공격으로 바꿔, 회피를 공격으로 쓰게 함
  DA-T3-B2:
    name: 광기의 숨
    summary: 추가 필요
    description: 일반공격 3콤보 적중 시 [광기] 1스택 소모하여 스태미나 35% 즉시 회복
    designerIntent: 평타 3콤보에 광기 1스택을 태워 스태미나를 돌려받는 콤보 유지 유도
  DA-T3-AS1:
    name: 분노의 돌진
    summary: 추가 필요
    description: 특수액션 중 피격 시 얻는 분노 생성량 25% 증가
    designerIntent: 특수액션 중 피격 시 분노 수급을 키워 돌진 활용 유도
  DA-T3-AS2:
    name: 집착의 광기
    summary: 추가 필요
    description: 같은 적에게 공격 적중 시마다 35% 확률로 [광기] 획득
    designerIntent: 같은 적을 계속 때릴수록 광기 수급 유도
  DA-T3-BS1:
    name: 혈막
    summary: 추가 필요
    description: 특수액션 사용 중 [광기] 스택의 받는 피해 증가 패널티를 60% 상쇄
    designerIntent: 특수액션 중 광기 피격 패널티를 줄여 돌진으로 리스크를 상쇄하게 함
  DA-T3-BS2:
    name: 분노의 광기
    summary: 추가 필요
    description: '[광기] 상태에서 분노 생성량 25% 증가'
    designerIntent: '[광기] 상태에서 분노 수급을 키워 스택 유지를 도움'
  DA-T2-A1:
    name: 피의 분노
    summary: 추가 필요
    description: 생명력이 50% 이하일 때 5초간 매 타격마다 분노 6 생성
    designerIntent: '생명력이 낮을 때 타격마다 분노를 수급해 투신 하이 리스크 하이 리턴을 향한 발판 마련 '
  DA-T2-A2:
    name: 광격
    summary: 추가 필요
    description: 액티브 스킬 적중 시마다 18% 확률로 35% 추가 피해
    designerIntent: 액티브 적중 시 추가 피해로 주력기 화력 보조
  DA-T2-B1:
    name: 전투 호흡
    summary: 추가 필요
    description: 적중 시 25% 확률로 스태미나 15% 회복
    designerIntent: 적중 시 스태미나 회복으로 회피 공격 순환을 도움
  DA-T2-B2:
    name: 광기의 고통
    summary: 추가 필요
    description: 공격 중 피격 시 [광기] 1스택 획득 (내부 쿨타임 4초)
    designerIntent: 공격 중 피격 시 광기를 쌓아, 맞으면서 때리는 운영 유도
  DA-T2-AS1:
    name: 달려드는 자
    summary: 피격 광기
    description: 피격으로 [광기] 획득 시 5초간 경직 저항 수치 25% 증가
    designerIntent: 피격으로 광기를 얻을 때 경직 저항을 주어 돌진 피격을 유도
  DA-T2-AS2:
    name: 광기의 잔숨
    summary: 추가 필요
    description: '[광기] 상태에서 회피 시 28% 확률로 스태미나 20% 즉시 회복'
    designerIntent: '[광기] 상태에서 회피 시 스태미나 회복으로 생존을 도움 '
  DA-T2-BS1:
    name: 혈액 순환
    summary: 로우라이프 회복
    description: '현재 생명력 50% 이하일 때 피격 시 45% 확률로 생명력 12% 회복 '
    designerIntent: 생명력이 낮을 때 피격 시 회복으로 유지력을 보완
  DA-T2-BS2:
    name: 광기 흡혈
    summary: 추가 필요
    description: '[광기] 소모 시 생명력 4% 회복'
    designerIntent: '[광기] 소모 시 생명력 회복으로 후딜 캔슬에 유지력을 줌'
  BA-T5-A1:
    name: 부동심
    summary: 추가 필요
    description: 스킬 사용 중 분노가 자연 감소하지 않음. 대신 스태미나 회복 속도 25% 감소
    designerIntent: 분노 소모량을 최대한 적게 해준 뒤 일격을 준비하게 함
  BA-T5-A2:
    name: 무력한 포식자
    summary: 추가 필요
    description: 적을 경직·무력화한 후 5초간 타격마다 분노 8 생성. 대신 받는 피해 15% 증가
    designerIntent: '경직 상태에서 분노 수급을 최대한 하는 대신, 피해 증가로 리스크 부여 '
  BA-T5-B1:
    name: 광폭화
    summary: 추가 필요
    description: 분노 100%일 때 모든 충전형 공격이 사용 시 즉시 풀충전 공격으로 발동. 적중 후 5초간 분노 수급 불가
    designerIntent: '분노가 100%일 때 풀충전으로 공격 속도 증가, 이후 5초 공백으로 분노를 100%로 만들 타이밍을 고려하도록 함 '
  BA-T5-B2:
    name: 분노의 포화
    summary: 추가 필요
    description: 분노 100%일 때 기본 공격 피해량 28% 증가, 스태미나 소모량 25% 증가
    designerIntent: '분노 100 유지 중 평타 화력을 키우되 스태미나 부담으로 스킬과 섞어 공격을 이어가도록 함 '
  BA-T4-A1:
    name: 과잉 분노
    summary: 추가 필요
    description: 분노가 100을 초과해 증가할 때 매 타격마다 공격력 6% 증가 (10중첩). 단, 분노 50% 이하 시 받는 피해 22% 증가
    designerIntent: 분노 최대치를 100 너머로 밀어 올리게 하고, 미만이면 맞딜이 불리하도록 유도
  BA-T4-A2:
    name: 폭주
    summary: 추가 필요
    description: 공격 중 받는 피해량 12% 증가하는 대신, 피격 시 4초간 주는 피해량 38% 증가
    designerIntent: '맞으면서 때릴 때 리스크 증가하는 대신, 폭딜로 보상 '
  BA-T4-B1:
    name: 즉각적인 응징
    summary: 충전 피격 폭주
    description: 1초 이상 충전 유지 중 피격 시 4초간 피해량 40% 증가 (공격 적중 후 효과 종료)
    designerIntent: 충전 중 피격을 폭딜로 보상해 맞아 주는 플레이 유도
  BA-T4-B2:
    name: 불굴의 투지
    summary: 추가 필요
    description: 분노 100%일 때 경직 면역. 단, 효과 적용 중 분노가 100% 미만으로 떨어지면 5초간 강인도 32% 감소
    designerIntent: '100을 유지해야만 면역이 켜지게 해 콤보 정지가 리스크로 작동하게 함 '
  BA-T4-AS1:
    name: 분노 상승
    summary: 100 이상 수급
    description: 현재 분노가 100 이상일 때 분노 생성량 28% 증가
    designerIntent: '초과 구간에서 수급을 가속해 분노 최대치를 확장한 후 분노 수급이 용이하도록 함 '
  BA-T4-AS2:
    name: 균열 확대
    summary: 추가 필요
    description: 경직된 대상을 공격할 때마다 무력화 게이지 감소 스탯 18% 증가
    designerIntent: '경직된 대상을 계속 공격하도록 유도 -> 무력화로 연계 '
  BA-T4-BS1:
    name: 부동 자세
    summary: 충전 강인도
    description: 충전 중 강인도 28% 증가
    designerIntent: 충전 중 피격을 버틸 수 있게 해 응징 루프를 성립
  BA-T4-BS2:
    name: 파쇄 순환
    summary: 추가 필요
    description: 액티브 적중 후 사용하는 기본 공격 피해량 25% 증가. 5초 이내 공격을 이어갈 때마다 기본 공격으로 얻는 분노 3 증가 (최대 5중첩)
    designerIntent: 스킬 뒤 평타를 붙여 분노 100을 다시 채우게 유도
  BA-T3-A1:
    name: 상흔 축적
    summary: 추가 필요
    description: 액티브 사용 중 피격 시, 해당 스킬이 적중하면 최대 분노량 12% 증가 (최대 5중첩)
    designerIntent: 스킬 중 피격을 분노 최대치 증가로 바꿔 맞으면서 유지 유도
  BA-T3-A2:
    name: 상흔의 추격
    summary: 추가 필요
    description: 액티브 사용 중 피격 시, 2초 이내 다음 타격에 28% 추가 피해 (내부 쿨타임 없음)
    designerIntent: 피격 직후 추격을 강제해 순환이 끊기지 않게 함
  BA-T3-B1:
    name: '버티는 힘 '
    summary: 추가 필요
    description: 충전 중 피격 시마다 분노 12% 회복. 충전 1초당 분노 생성량 10% 증가
    designerIntent: 충전 시간을 수급 수단으로 만들어 맞아 주는 선택을 유도
  BA-T3-B2:
    name: 유지되는 분노
    summary: 추가 필요
    description: 분노 100% 달성 시 5초간 분노 자연 소모하지 않음. 대신 자신이 경직되면 분노 15 감소
    designerIntent: '분노 100을 유지할 수 있는 시간을 주되 경직될 때마다 분노가 감소하여 너무 쉽게 효과를 얻을 수 없도록 조정 '
  BA-T3-AS1:
    name: 강행 돌파
    summary: 추가 필요
    description: 분노 80 이상일 때 액티브 사용 시 경직 면역 (스킬 종료 시 해제)
    designerIntent: '높은 분노에서 스킬이 끊기지 않게 해 분노 최대치 증가 효과를 볼 때 보호 '
  BA-T3-AS2:
    name: 무력한 처형
    summary: 추가 필요
    description: 적을 경직·무력화시킨 후 다음에 사용하는 스킬 피해량 40% 증가
    designerIntent: '경직 직후 다음 스킬을 필살기로 사용하도록 유도 '
  BA-T3-BS1:
    name: 재생
    summary: 추가 필요
    description: 분노 50% 이상일 때 받는 회복량 25% 증가
    designerIntent: '충전·피격 운영의 유지력을 50% 이상 구간에 더욱 메리트를 줌 '
  BA-T3-BS2:
    name: 전투 순환
    summary: 추가 필요
    description: 일반공격 3콤보 적중 시 분노 생성량 40% 증가. 스킬 사용 중 피격 시 다음 기본 공격 피해량 25% 증가
    designerIntent: '평타-스킬-평타 연계로, 맞을 것 같을 때 스킬을 써가면서 분노 100을 쌓을 수 있도록 완충지 역할을 함 '
  BA-T2-A1:
    name: 지속력
    summary: 추가 필요
    description: 액티브 스킬 분노 소모량 12% 감소
    designerIntent: '소용돌이 유지 비용을 낮춰 오랫동안 시전 가능하도록 함 '
  BA-T2-A2:
    name: 일격의 숨
    summary: 스태미나 회복
    description: 액티브 스킬 사용 후 5초간 초당 스태미나 8% 회복
    designerIntent: '액티브 스킬 후 스태미나를 채워 다음 공격 순환이 일어나도록 함 '
  BA-T2-B1:
    name: 철갑
    summary: 추가 필요
    description: 충전 중 받는 피해량 28% 감소
    designerIntent: 충전 중 맞아도 덜 아프게 해 피격 환원을 성립
  BA-T2-B2:
    name: 맹타
    summary: 추가 필요
    description: 공격을 이어갈 때마다 공격력 6% 증가 (5중첩). 회피 시 효과 종료
    designerIntent: '피하지 않고 맞아가면서 플레이하는 것을 유도함 '
  BA-T2-AS1:
    name: 복수심
    summary: 피격 수급
    description: 공격 중 피격 시 분노 7 생성
    designerIntent: 맞으면서 때릴 때 분노를 주어 피격 루프를 보조
  BA-T2-AS2:
    name: 연격 제압
    summary: 추가 필요
    description: 3초 이내 공격 연속 적중 시마다 경직 부여치 7% 증가 (5중첩)
    designerIntent: '타격을 이어갈수록 경직 확률이 높아지도록 설계. 소용돌이에 활용 '
  BA-T2-BS1:
    name: 축력
    summary: 추가 필요
    description: 충전 유지 시간에 따라 피해량 12%씩 추가 증가 (3중첩)
    designerIntent: '충전을 오래 버틸수록 이후 공격 피해량이 커지게 함 '
  BA-T2-BS2:
    name: 전장의 호흡
    summary: 추가 필요
    description: 일반공격 적중 시 28% 확률로 스태미나 8% 회복
    designerIntent: 평타 구간에 스태미나를 보충해 콤보 유지 유도
combatSystem:
  subtitle: 05. 전투 시스템
  title: Combat System
  intro: 크로노 오디세이 전투의 몰입감을 높이기 위한 신규 전투 시스템을 기획하였습니다.
system:
  regain:
    title: 리게인 시스템
    variables:
      - name: RegainRatio
        type: Float
        desc: 피격 시 리게인 전환 비율 (1.0 = 100%)
      - name: RegainRestoreRatio
        type: Float
        desc: 리게인 게이지 복구량 증감
      - name: Regain_DecayWaitTime
        type: Float
        desc: 마지막 액션 후 감소 대기 시간
      - name: Regain_DecayRate
        type: Float
        desc: 초당 감소 비율
      - name: Regain_DecayTick
        type: Float
        desc: 감소 연산 간격
    exceptions:
      - title: Potion Use
        desc: 물약 사용 시 잔여 게이지 즉시 소멸 후 회복
      - title: Guard Break
        desc: 가드 파괴 발생 시 즉시 소멸
      - title: Status End
        desc: Regain 버프 지속 시간 종료 시 소멸
      - title: Zero HP
        desc: 체력이 0이 되면 리게인은 생존을 보장하지 않음
    synergy:
      weapon: Berserker Synergy
      desc: 버서커 클래스는 기본 방어력이 낮은 대신 리게인 효율이 높게 설정되어 있어, 끊임없이 공격해야만 생존할 수 있는 '하이 리스크 하이 리턴' 구조를 완성함.
  smartTargeting:
    title: 스마트 타겟팅 (Smart Targeting)
    formula:
      params:
        - 'DistanceScore: 가까울수록 높은 점수'
        - 'AngleScore: 카메라 정면에 가까울수록 높은 점수'
        - 'InputScore: 플레이어 입력 방향과 일치할수록 가산점'
    synergy:
      weapon: Action Camera System
      desc: 타겟팅된 적을 중심으로 카메라가 부드럽게 보정되어, 화려한 액션 연출을 놓치지 않으면서도 플레이어가 상황을 명확히 인지할 수 있도록 돕는 시스템임.
  regainIntent: 피격 후 즉각적인 반격을 유도하여 공격적인 전투 템포를 유지하고 역전의 기회를 제공한다.
  doc:
    rules:
      - title: 피해 누적
        desc: 게이지 존재 시 재피격되면 [기존량 + 신규 피해] 합산
      - title: 최대치 제한
        desc: 리게인 게이지 총량은 [최대 체력 - 현재 체력]을 초과할 수 없음
      - title: 자연 감소
        desc: WaitTime 경과 후 DecayRate에 따라 틱(Tick)당 감소
      - title: 예외 사항
        desc: 낙하 대미지 등 특정 환경 피해는 게이지를 생성하지 않음
    exceptions:
      - label: 물약 사용 (Potion)
        desc: 물약 사용 시 잔여 게이지 즉시 소멸 후 회복
      - label: 가드 파괴 (Guard Break)
        desc: 가드 파괴(Stance Broken) 발생 시 즉시 소멸
      - label: 사망 (Zero HP)
        desc: 체력이 0이 되면 리게인은 생존을 보장하지 않음
      - label: 버프 종료 (Status End)
        desc: 버프 지속 시간(Duration) 종료 시 소멸
    variables:
      - category: 스탯 (Stat)
        name: RegainRatio
        type: Float
        desc: '피격 대미지의 리게인 전환 비율 (Default: 1.0)'
      - category: 스탯 (Stat)
        name: RegainRestoreDamageRatio
        type: Float
        desc: '가해 대미지의 리게인 체력 복구 비율 (Default: 1.0)'
      - category: 스탯 (Stat)
        name: RegainRestoreRatio
        type: Float
        desc: 리게인 게이지 복구량 증감
      - category: 설정 (Config)
        name: Regain_DecayWaitTime
        type: Float
        desc: 액션 종료 후 감소 시작 대기 시간
      - category: 설정 (Config)
        name: Regain_DecayRate
        type: Float
        desc: 초당 감소 비율 (Percentage)
      - category: 설정 (Config)
        name: Regain_DecayTick
        type: Float
        desc: 감소 연산 주기 (Tick Interval)
    scenarios:
      - type: A
        title: 스킬 / 패시브
        action: 전환 (Convert)
        desc: 회복량만큼 리게인 소모 → 체력 회복 (남은 게이지 유지)
      - type: B
        title: 치유 / 자연 회복
        action: 유지 (Preserve)
        desc: 리게인 소모 없음. 단, MaxHP 초과 시 초과분만큼 게이지 삭감
      - type: C
        title: 물약 (아이템)
        action: 소멸 (Clear)
        desc: 남은 리게인 게이지를 즉시 제거하고 생명력 회복
aiAutomation:
  subtitle: 06. AI 도구 활용 자동화
  title: AI Automation
  heading: AI 기반 업무 자동화
  intro: |-
    테이블 기준으로 스킬 쇼, 모션, 몽타주를 일괄 추적하여 리스트업하는 내부 자동화 도구를 설계/구현했습니다.
    반복 확인 작업을 축소하고, 누락 검증을 표준화하는 데 목적을 둔 실무형 파이프라인입니다.
  backgroundTitle: 도입 배경
  background:
    - 스킬별 연결 쇼/모션 확인을 위해 엔진 실행이 반복되어 검토 시간이 길어짐
    - 남/여 캐릭터 및 무기 모션 연결 누락 여부를 한 화면에서 판단하기 어려움
    - 모션/이펙트/사운드 협업 요청 대응 시 리소스 리스트업에 작업 비용이 큼
  resultsTitle: 성과
  results:
    - '모션 리스트업: 작업자 3명 3시간 → 작업자 1명 5분 내외'
    - '연결 누락 검출: 작업자 3명 반나절 → 작업자 1명 5분 내외'
  roleTitle: 역할 및 검증
  roleBody: |-
    참조 구조/필터/검증 기준을 수동 설계하고, Cursor AI는 구현을 담당했습니다.
    샘플 스킬 50건을 대조하여 참조 추적 일치성을 확인했습니다.
  limitTitle: 한계
  limitBody: 내부 전용 도구 특성상 실제 데이터와 이미지 원문은 비공개 처리했으며, 본 문서는 구조와 검증 방식 중심으로 정리했습니다.
  pipelineTitle: 자동화 파이프라인
  pipeline:
    - title: 데이터 경로 지정
      desc: 쇼 경로/테이블 경로 지정, 스캔 범위 고정
    - title: 테이블 참조 해석
      desc: skill → Exec → Execproperty → ExecpropertyResult 참조 추적
    - title: 연결 에셋 수집
      desc: ShowAsset 기준 MotionAsset(PC/WP), MontageAsset 수집
    - title: 결과 포맷/검증
      desc: 표 포맷 정리, ErrorType 검증
    - title: 데이터 필터링
      desc: 중복 숨기기, 사용 스킬·오류·무기 타입 필터, 결과 표 열 표시/숨김
    - title: 데이터 추출
      desc: 최종 리스트 엑셀 내보내기
  columnsTitle: 출력 컬럼 정의
  exampleTitle: 결과 출력 예시
  filters:
    - key: hideDuplicateAssets
      label: 중복 에셋 숨기기
    - key: activeSkillsOnly
      label: 사용 중인 스킬만 보기
    - key: errorsOnly
      label: 오류 데이터만 보기
  weaponFilters:
    - key: ChainSwords
      label: ChainSwords (사슬검)
    - key: DualAxes
      label: DualAxes (쌍도끼)
    - key: BattleAxe
      label: BattleAxe (전투도끼)
  filterLabel: 필터
  byWeapon: 무기별로 보기
  columnVisibility: 열 표시
  selectAll: 전체
  selectNone: 선택 없음
  implNote: '구현 방식: Cursor AI + Python 기반 자동 수집/가공'

```

