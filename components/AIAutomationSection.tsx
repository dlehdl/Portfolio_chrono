import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Bot, Filter, Target } from 'lucide-react';
import { text } from '../content';

const ai = text.aiAutomation ?? {};

const pipelineSteps = (ai.pipeline as { title: string; desc: string }[]) ?? [
  { title: '데이터 경로 지정', desc: '쇼 경로/테이블 경로 지정, 스캔 범위 고정' },
  { title: '테이블 참조 해석', desc: 'skill → Exec → Execproperty → ExecpropertyResult 참조 추적' },
  { title: '연결 에셋 수집', desc: 'ShowAsset 기준 MotionAsset(PC/WP), MontageAsset 수집' },
  { title: '결과 포맷/검증', desc: '표 포맷 정리, ErrorType 검증' },
  { title: '데이터 필터링', desc: '중복 숨기기, 사용 스킬·오류·무기 타입 필터, 결과 표 열 표시/숨김' },
  { title: '데이터 추출', desc: '최종 리스트 엑셀 내보내기' },
];

const outputColumns = [
  {
    name: 'SourceFile',
    description: '데이터 출처가 된 원본 테이블 파일명',
    example: 'skill_Berserker.xlsm',
  },
  {
    name: 'SourceSheet',
    description: '행이 나온 시트/테이블 구분값. skill과 ExecpropertyResult 등이 다르면 동일 dataid를 별도 행으로 둘 수 있음',
    example: 'skill / ExecpropertyResult',
  },
  {
    name: 'dataid',
    description: '데이터 ID. SourceSheet·SourceFile과 조합해 행을 구분(동일 dataid + 다른 SourceSheet = 정상)',
    example: '50101000',
  },
  {
    name: 'devname',
    description: '기획 기준 스킬/데이터 명칭',
    example: '버서커 사슬검 일반공격 3타',
  },
  {
    name: 'WeaponType',
    description: '스킬이 속한 무기 체계(사슬검·쌍도끼·전투도끼 등). 리스트/필터 기준값',
    example: 'ChainSwords / DualAxes / BattleAxe',
  },
  {
    name: 'showcolumn',
    description: 'ShowAsset이 추출된 컬럼 종류',
    example: 'ExecStepShow',
  },
  {
    name: 'ShowAsset',
    description: '참조된 쇼 파일명',
    example: 'PC501_NormalAttack_Combo03',
  },
  {
    name: 'MotionAsset_PC',
    description: '쇼에 연결된 PC 모션. 남성(PC_M)·여성(PC_F)이 모두 있어야 Error 없음(남/여는 두 줄로 표기)',
    example: 'PC_M_J0501_NormalAttack_Combo03\nPC_F_J0501_NormalAttack_Combo03',
  },
  {
    name: 'MotionAsset_WP',
    description: '쇼에 연결된 무기 모션. 남성(WP_M)·여성(WP_F)이 모두 있어야 Error 없음',
    example: 'WP_M_J0501_NormalAttack_Combo03\nWP_F_J0501_NormalAttack_Combo03',
  },
  {
    name: 'MontageAsset',
    description: '모션에 연결된 몽타주(남/여 각각 연결된 경우 개행으로 표기)',
    example: 'PC_M_J0501_NormalAttack_Combo03_Montage\nPC_F_J0501_NormalAttack_Combo03_Montage',
  },
  {
    name: 'Error',
    description: '연결 누락이 있는 경우 출력되는 오류 타입',
    example: 'Motion_PC_F_MISSING | Motion_WP_F_MISSING',
  },
];

const AIAutomationSection: React.FC = () => {
  return (
    <div className="space-y-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-6"
      >
        <div>
          <div className="w-12 h-px bg-archival-ink/40 mb-6" style={{ height: '0.5px' }} />
          <h3 className="font-archival-serif text-xl md:text-2xl font-light text-archival-ink mb-4 tracking-[0.08em]">
            {ai.heading ?? 'AI 기반 업무 자동화'}
          </h3>
          <p className="text-sm md:text-base text-archival-ink-deep/85 leading-relaxed whitespace-pre-line">
            {ai.intro}
          </p>

          <div className="mt-8 border border-archival-ink/20 p-5 md:p-6" style={{ borderWidth: '0.5px' }}>
            <div className="flex items-center gap-2 mb-5">
              <Target size={14} strokeWidth={1.5} className="text-archival-ink/80" />
              <h4 className="font-archival-mono text-xs tracking-[0.2em] uppercase text-archival-ink/80">{ai.backgroundTitle ?? '도입 배경'}</h4>
            </div>
            <ul className="space-y-2 text-sm text-archival-ink-deep/85 leading-relaxed list-disc pl-4">
              {((ai.background as string[]) ?? []).map((line: string) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>

          <div className="mt-8">
            <div
              className="flex items-start gap-3 p-3 border border-archival-ink/20"
              style={{ borderWidth: '0.5px' }}
            >
              <Bot size={14} strokeWidth={1.5} className="mt-0.5 text-archival-ink/80" />
              <p className="text-sm text-archival-ink-deep/85 leading-relaxed">
                {ai.implNote ?? '구현 방식: Cursor AI + Python 기반 자동 수집/가공'}
              </p>
            </div>
          </div>
        </div>

      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid md:grid-cols-3 gap-4"
      >
        <div className="border border-archival-ink/20 p-5" style={{ borderWidth: '0.5px' }}>
          <h4 className="font-archival-mono text-xs tracking-[0.2em] uppercase text-archival-ink/80 mb-4">{ai.resultsTitle ?? '성과'}</h4>
          <ul className="space-y-2 text-sm text-archival-ink-deep/85 leading-relaxed list-disc pl-4">
            {((ai.results as string[]) ?? []).map((line: string) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
        <div className="border border-archival-ink/20 p-5" style={{ borderWidth: '0.5px' }}>
          <h4 className="font-archival-mono text-xs tracking-[0.2em] uppercase text-archival-ink/80 mb-3">{ai.roleTitle ?? '역할 및 검증'}</h4>
          <p className="text-sm text-archival-ink-deep/85 leading-relaxed whitespace-pre-line">
            {ai.roleBody}
          </p>
        </div>
        <div className="border border-archival-ink/20 p-5" style={{ borderWidth: '0.5px' }}>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={14} strokeWidth={1.5} className="text-archival-ink/80" />
            <h4 className="font-archival-mono text-xs tracking-[0.2em] uppercase text-archival-ink/80">{ai.limitTitle ?? '한계'}</h4>
          </div>
          <p className="text-sm text-archival-ink-deep/85 leading-relaxed">
            {ai.limitBody}
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid md:grid-cols-12 gap-6"
      >
        <div className="md:col-span-12 border border-archival-ink/20 p-5 md:p-6" style={{ borderWidth: '0.5px' }}>
          <div className="flex items-center gap-2 mb-5">
            <Filter size={14} strokeWidth={1.5} className="text-archival-ink/80" />
            <h4 className="font-archival-mono text-xs tracking-[0.2em] uppercase text-archival-ink/80">{ai.pipelineTitle ?? '자동화 파이프라인'}</h4>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {pipelineSteps.map((step, idx) => (
              <div key={step.title} className="relative border border-archival-ink/15 p-4" style={{ borderWidth: '0.5px' }}>
                <p className="font-archival-mono text-[10px] tracking-[0.18em] uppercase text-archival-ink/60 mb-2">
                  Step {idx + 1}
                </p>
                <h5 className="font-archival-serif text-base text-archival-ink mb-2">{step.title}</h5>
                <p className="text-sm text-archival-ink-deep/80 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="border border-archival-ink/20 p-5 md:p-6"
        style={{ borderWidth: '0.5px' }}
      >
        <h4 className="font-archival-mono text-xs tracking-[0.2em] uppercase text-archival-ink/80 mb-4">{ai.columnsTitle ?? '출력 컬럼 정의'}</h4>
        <div className="archival-table-wrap">
          <table className="archival-table min-w-[760px]">
            <thead>
              <tr>
                <th className="py-3 px-3 text-xs font-archival-mono uppercase tracking-[0.14em]">컬럼명</th>
                <th className="py-3 px-3 text-xs font-archival-mono uppercase tracking-[0.14em]">설명</th>
                <th className="py-3 px-3 text-xs font-archival-mono uppercase tracking-[0.14em]">값 예시</th>
              </tr>
            </thead>
            <tbody>
              {outputColumns.map((column) => (
                <tr key={column.name}>
                  <td className="py-3 px-3 text-sm font-archival-mono text-archival-ink/90 whitespace-nowrap">{column.name}</td>
                  <td className="py-3 px-3 text-sm text-archival-ink-deep/85">{column.description}</td>
                  <td className="py-3 px-3 text-sm text-archival-ink-deep/85 break-all whitespace-pre-wrap font-archival-mono text-[13px]">
                    {column.example}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AIAutomationSection;
