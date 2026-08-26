import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Sword, Flame, TrendingDown, Info, Play } from 'lucide-react';
import { MechanicNode } from './components/MechanicNode';
import { FuryGauge } from './components/FuryGauge';

// Constants
const MAX_FURY = 100;
const FURY_PER_HIT = 15;
const DECAY_RATE_MS = 100; // How often decay ticks happen
const DECAY_AMOUNT = 2; // How much fury lost per tick
const DECAY_START_DELAY_MS = 2000; // Time without attacking before decay starts

export default function App() {
  const [fury, setFury] = useState(0);
  const [lastHitTime, setLastHitTime] = useState(0);
  const [isDecaying, setIsDecaying] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);

  // Handle Attack (Input)
  const handleAttack = useCallback(() => {
    const now = Date.now();
    setLastHitTime(now);
    setIsDecaying(false);
    setShowTutorial(false);
    
    setFury((prev) => {
      const newVal = prev + FURY_PER_HIT;
      return newVal > MAX_FURY ? MAX_FURY : newVal;
    });
  }, []);

  // Handle Decay Loop
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const timeSinceLastHit = now - lastHitTime;

      if (timeSinceLastHit > DECAY_START_DELAY_MS && fury > 0) {
        setIsDecaying(true);
        setFury((prev) => {
          const newVal = prev - DECAY_AMOUNT;
          return newVal < 0 ? 0 : newVal;
        });
      } else {
        setIsDecaying(false);
      }
    }, DECAY_RATE_MS);

    return () => clearInterval(interval);
  }, [fury, lastHitTime]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex flex-col overflow-hidden selection:bg-berserker-900 selection:text-white">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-red-900/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-orange-900/5 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 pt-16 pb-8 text-center space-y-4">
        <div className="inline-block border-b border-berserker-600 pb-2 mb-2">
           <h2 className="text-berserker-500 font-display tracking-[0.3em] text-sm font-bold uppercase">Class Identity</h2>
        </div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white uppercase font-display">
          Berserker
        </h1>
        <p className="max-w-2xl mx-auto text-zinc-400 text-lg md:text-xl font-light leading-relaxed px-4">
          "<span className="text-zinc-200 font-medium">피격의 리스크</span>를 <span className="text-berserker-500 font-bold">공격의 기회</span>로 전환하는<br className="hidden md:block"/> 공격적 템포의 정점"
        </p>
      </header>

      {/* Main Interactive Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 md:px-8 pb-12">
        
        {/* Tutorial Overlay (Dismissible) */}
        {showTutorial && fury === 0 && (
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none animate-bounce">
                <div className="bg-zinc-800 text-white px-4 py-2 rounded-full shadow-lg border border-zinc-700 flex items-center gap-2">
                    <Play size={16} fill="white" />
                    <span className="text-sm">Click "Normal Attack" to start</span>
                </div>
            </div>
        )}

        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-4 items-center relative">
          
          {/* Decorative Connecting Lines (Desktop only) */}
          <div className="hidden md:block absolute top-[110px] left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent -z-10" />

          {/* 1. INPUT: Attack */}
          <div className="flex justify-center order-2 md:order-1">
            <MechanicNode 
              title="Normal Attack"
              subtitle="Input"
              description="일반 공격 적중 시 분노를 획득합니다."
              icon={<Sword size={40} strokeWidth={1.5} />}
              isActive={Date.now() - lastHitTime < 500}
              isButton={true}
              onClick={handleAttack}
            />
          </div>

          {/* 2. RESOURCE: Fury Gauge */}
          <div className="flex flex-col items-center justify-center order-1 md:order-2">
            <div className="relative">
                <FuryGauge value={fury} max={MAX_FURY} isDecaying={isDecaying} />
            </div>
            <div className="mt-8 text-center space-y-1">
                <div className="uppercase tracking-widest text-xs text-zinc-500 font-display">Resource</div>
                <h3 className="text-2xl font-bold text-white">Fury Generation</h3>
                <p className="text-sm text-zinc-400">분노 0~100까지 축적</p>
            </div>
          </div>

          {/* 3. LOOP/OUTPUT: Decay */}
          <div className="flex justify-center order-3 md:order-3">
            <MechanicNode 
              title="Natural Decay"
              subtitle="Passive"
              description="비전투 상태 지속 시 분노가 서서히 감소합니다."
              icon={<TrendingDown size={40} strokeWidth={1.5} />}
              isActive={isDecaying}
            />
          </div>

        </div>

        {/* Legend / Additional Info */}
        <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
           <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-lg backdrop-blur-sm flex gap-4 items-start hover:border-zinc-700 transition-colors">
              <div className="p-2 bg-zinc-800 rounded-md text-berserker-400">
                  <Flame size={24} />
              </div>
              <div>
                  <h4 className="text-white font-bold mb-1">폭주 (Burst Mode)</h4>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                      분노 게이지가 100에 도달하면 <span className="text-berserker-400">폭주 상태</span>에 돌입할 수 있으며, 
                      공격 속도와 치명타 확률이 대폭 상승합니다.
                  </p>
              </div>
           </div>
           
           <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-lg backdrop-blur-sm flex gap-4 items-start hover:border-zinc-700 transition-colors">
              <div className="p-2 bg-zinc-800 rounded-md text-zinc-400">
                  <Info size={24} />
              </div>
              <div>
                  <h4 className="text-white font-bold mb-1">전투 흐름 (Combat Flow)</h4>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                      공격이 멈추면 자원이 감소합니다. 끊임없이 공격을 이어가며 
                      <span className="text-zinc-200"> 분노 수치를 유지하는 것</span>이 핵심입니다.
                  </p>
              </div>
           </div>
        </div>
      </main>

    </div>
  );
}
