import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1a1a1a] font-sans selection:bg-gray-200">
      <div className="max-w-6xl mx-auto px-8 py-16 md:py-24">
        
        <header className="mb-24">
          <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-4">Skill Design Document</h1>
          <p className="text-gray-500 font-light tracking-wide">포트폴리오 - 액티브 및 패시브 스킬 기획서</p>
        </header>

        {/* Active Skills Section */}
        <section className="mb-32">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-xl font-medium tracking-wide uppercase text-gray-900">Active Skills</h2>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>

          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="py-3 px-4 font-medium text-gray-500 w-32">단계</th>
                  <th className="py-3 px-4 font-medium text-gray-500 w-1/5">분류</th>
                  <th className="py-3 px-4 font-medium text-gray-500 w-2/5">참고 이미지</th>
                  <th className="py-3 px-4 font-medium text-gray-500">설명</th>
                </tr>
              </thead>
              <tbody>
                {/* Base Stage */}
                <tr className="border-b border-gray-100 group hover:bg-white transition-colors">
                  <td className="py-6 px-4 align-top relative">
                    <div className="absolute left-8 top-[44px] bottom-[-44px] w-px bg-gray-200 z-0"></div>
                    <div className="flex items-start gap-4 relative z-10">
                      <div className="w-8 h-8 rounded-full border border-gray-300 bg-[#fafafa] flex items-center justify-center mt-1 shrink-0">
                        <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                      </div>
                      <div className="pt-2 font-medium text-gray-700">기본</div>
                    </div>
                  </td>
                  <td className="py-6 px-4 align-top font-medium">전방 베기</td>
                  <td className="py-6 px-4 align-top">
                    <div className="aspect-video bg-gray-100 border border-gray-200 rounded flex items-center justify-center text-gray-400">
                      <ImageIcon size={20} strokeWidth={1.5} />
                    </div>
                  </td>
                  <td className="py-6 px-4 align-top">
                    <p className="mb-3 leading-relaxed text-gray-700">전방 부채꼴 범위의 적들에게 무기 공격력의 120%에 해당하는 물리 피해를 입힙니다.</p>
                    <p className="text-gray-500 text-xs leading-relaxed"><span className="font-medium text-gray-600">기획 의도:</span> 다수의 적을 상대할 때 유용한 기본 스킬로, 플레이어의 위치 선정이 중요하도록 설계하였습니다.</p>
                  </td>
                </tr>

                {/* Stage 1 */}
                <tr className="border-b border-gray-100 group hover:bg-white transition-colors">
                  <td className="py-6 px-4 align-top relative">
                    <div className="absolute left-8 top-[44px] bottom-[-44px] w-px bg-gray-200 z-0"></div>
                    <div className="flex items-start gap-4 relative z-10">
                      <div className="w-8 h-8 rounded-full border border-gray-300 bg-[#fafafa] flex items-center justify-center mt-1 shrink-0">
                        <div className="w-2.5 h-2.5 rounded-full bg-gray-600"></div>
                      </div>
                      <div className="pt-2 font-medium text-gray-700">1단계</div>
                    </div>
                  </td>
                  <td className="py-6 px-4 align-top font-medium">범위 확장</td>
                  <td className="py-6 px-4 align-top">
                    <div className="aspect-video bg-gray-100 border border-gray-200 rounded flex items-center justify-center text-gray-400">
                      <ImageIcon size={20} strokeWidth={1.5} />
                    </div>
                  </td>
                  <td className="py-6 px-4 align-top">
                    <p className="mb-3 leading-relaxed text-gray-700">공격 범위가 30% 증가하고, 타격된 적에게 3초간 출혈 효과를 부여합니다.</p>
                    <p className="text-gray-500 text-xs leading-relaxed"><span className="font-medium text-gray-600">기획 의도:</span> 안정적인 사거리 확보와 지속 피해를 통해 히트 앤 런 전술을 강화합니다.</p>
                  </td>
                </tr>

                {/* Stage 2 */}
                <tr className="border-b border-gray-100 group hover:bg-white transition-colors">
                  <td className="py-6 px-4 align-top relative">
                    <div className="flex items-start gap-4 relative z-10">
                      <div className="w-8 h-8 rounded-full border border-gray-800 bg-white flex items-center justify-center mt-1 shadow-sm shrink-0">
                        <div className="w-3 h-3 rounded-full bg-gray-900"></div>
                      </div>
                      <div className="pt-2 font-medium text-gray-900">2단계</div>
                    </div>
                  </td>
                  <td className="py-6 px-4 align-top font-medium">검기 방출</td>
                  <td className="py-6 px-4 align-top">
                    <div className="aspect-video bg-gray-100 border border-gray-200 rounded flex items-center justify-center text-gray-400">
                      <ImageIcon size={20} strokeWidth={1.5} />
                    </div>
                  </td>
                  <td className="py-6 px-4 align-top">
                    <p className="mb-3 leading-relaxed text-gray-700">스킬 사용 시 전방으로 관통하는 검기를 날려보내며, 출혈 상태인 적에게 50%의 추가 피해를 입힙니다.</p>
                    <p className="text-gray-500 text-xs leading-relaxed"><span className="font-medium text-gray-600">기획 의도:</span> 1단계의 출혈 효과와 시너지를 내어 조건부 폭발적인 딜링이 가능하도록 설계하였습니다.</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Passive Skills Section */}
        <section>
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-xl font-medium tracking-wide uppercase text-gray-900">Passive Skills</h2>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="py-3 px-4 font-medium text-gray-500 w-20">타입</th>
                  <th className="py-3 px-4 font-medium text-gray-500 w-20">티어</th>
                  <th className="py-3 px-4 font-medium text-gray-500 w-1/5">제목</th>
                  <th className="py-3 px-4 font-medium text-gray-500 w-2/5">내용</th>
                  <th className="py-3 px-4 font-medium text-gray-500">기획 의도</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 group hover:bg-white transition-colors">
                  <td className="py-6 px-4 align-top font-medium text-gray-700">메인</td>
                  <td className="py-6 px-4 align-top font-medium text-gray-700">2</td>
                  <td className="py-6 px-4 align-top font-medium text-gray-900">바람의 발걸음</td>
                  <td className="py-6 px-4 align-top leading-relaxed text-gray-700">
                    전투 중 기본 이동 속도가 10% 증가하며, 적의 공격을 회피(대시)한 직후 2초간 이동 속도가 추가로 15% 증가합니다.
                  </td>
                  <td className="py-6 px-4 align-top text-gray-500 text-xs leading-relaxed">
                    기동성을 높여 적의 공격 패턴을 피하고 빠르게 사각으로 접근할 수 있도록 유도하는 패시브입니다.
                  </td>
                </tr>
                <tr className="border-b border-gray-100 group hover:bg-white transition-colors">
                  <td className="py-6 px-4 align-top font-medium text-gray-700">서브</td>
                  <td className="py-6 px-4 align-top font-medium text-gray-700">2</td>
                  <td className="py-6 px-4 align-top font-medium text-gray-900">예리한 감각</td>
                  <td className="py-6 px-4 align-top leading-relaxed text-gray-700">
                    체력이 30% 이하인 적을 공격할 때 치명타 확률이 20% 증가합니다.
                  </td>
                  <td className="py-6 px-4 align-top text-gray-500 text-xs leading-relaxed">
                    마무리 일격의 쾌감을 극대화하고, 전투 후반부의 텐션을 높이기 위한 장치입니다.
                  </td>
                </tr>
                <tr className="border-b border-gray-100 group hover:bg-white transition-colors">
                  <td className="py-6 px-4 align-top font-medium text-gray-700">메인</td>
                  <td className="py-6 px-4 align-top font-medium text-gray-700">3</td>
                  <td className="py-6 px-4 align-top font-medium text-gray-900">강인한 육체</td>
                  <td className="py-6 px-4 align-top leading-relaxed text-gray-700">
                    최대 체력이 15% 증가하며, 체력이 40% 이하일 때 받는 모든 피해가 10% 감소합니다.
                  </td>
                  <td className="py-6 px-4 align-top text-gray-500 text-xs leading-relaxed">
                    근접 전투에서 플레이어의 생존력을 높이고, 위기 상황에서 한 번의 실수를 만회할 수 있는 기회를 제공합니다.
                  </td>
                </tr>
                <tr className="border-b border-gray-100 group hover:bg-white transition-colors">
                  <td className="py-6 px-4 align-top font-medium text-gray-700">서브</td>
                  <td className="py-6 px-4 align-top font-medium text-gray-700">3</td>
                  <td className="py-6 px-4 align-top font-medium text-gray-900">피의 갈증</td>
                  <td className="py-6 px-4 align-top leading-relaxed text-gray-700">
                    출혈 상태인 적을 처치하거나 치명타를 적중시킬 경우, 잃은 체력의 2%를 즉시 회복합니다.
                  </td>
                  <td className="py-6 px-4 align-top text-gray-500 text-xs leading-relaxed">
                    액티브 스킬의 출혈 효과와 연계하여 전투 유지력을 높이고, 공격적인 플레이를 보상합니다.
                  </td>
                </tr>
                <tr className="border-b border-gray-100 group hover:bg-white transition-colors">
                  <td className="py-6 px-4 align-top font-medium text-gray-700">메인</td>
                  <td className="py-6 px-4 align-top font-medium text-gray-700">4</td>
                  <td className="py-6 px-4 align-top font-medium text-gray-900">전투의 흐름</td>
                  <td className="py-6 px-4 align-top leading-relaxed text-gray-700">
                    기본 공격이 적중할 때마다 공격 속도가 2%씩 증가합니다. (최대 5중첩, 3초간 미적중 시 초기화)
                  </td>
                  <td className="py-6 px-4 align-top text-gray-500 text-xs leading-relaxed">
                    끊임없는 콤보 공격을 유도하여 전투의 템포를 끌어올리고 타격감을 극대화합니다.
                  </td>
                </tr>
                <tr className="border-b border-gray-100 group hover:bg-white transition-colors">
                  <td className="py-6 px-4 align-top font-medium text-gray-700">서브</td>
                  <td className="py-6 px-4 align-top font-medium text-gray-700">4</td>
                  <td className="py-6 px-4 align-top font-medium text-gray-900">불굴의 의지</td>
                  <td className="py-6 px-4 align-top leading-relaxed text-gray-700">
                    최대 체력의 20% 이상의 피해를 한 번에 받을 경우, 1.5초 동안 경직 면역 상태가 됩니다. (재사용 대기시간 15초)
                  </td>
                  <td className="py-6 px-4 align-top text-gray-500 text-xs leading-relaxed">
                    강력한 적의 공격에 피격당했을 때 연속으로 콤보를 맞는 불쾌한 경험을 방지하고 반격의 여지를 줍니다.
                  </td>
                </tr>
                <tr className="border-b border-gray-100 group hover:bg-white transition-colors">
                  <td className="py-6 px-4 align-top font-medium text-gray-700">메인</td>
                  <td className="py-6 px-4 align-top font-medium text-gray-700">5</td>
                  <td className="py-6 px-4 align-top font-medium text-gray-900">약점 포착</td>
                  <td className="py-6 px-4 align-top leading-relaxed text-gray-700">
                    상태 이상(출혈, 둔화 등)에 걸린 적을 공격할 때 방어력을 15% 무시하고 피해를 입힙니다.
                  </td>
                  <td className="py-6 px-4 align-top text-gray-500 text-xs leading-relaxed">
                    다양한 디버프 스킬과의 시너지를 창출하여 스킬 연계의 중요성을 강조합니다.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  );
}
