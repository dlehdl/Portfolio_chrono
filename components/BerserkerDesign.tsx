import React from 'react';
import { motion } from 'framer-motion';
import { Sword, Axe, Hammer, PenTool, GitBranch, Settings, TrendingDown } from 'lucide-react';
import WeaponSkillStandardTree from './WeaponSkillStandardTree';
import overviewImage from '../images/overview.jpg';
import berserkerHero from '../images/berserker-bg.png-Photoroom.png';
import { text } from '../content';

const ROLE_ICONS = [
  <PenTool size={20} key="p" />,
  <Settings size={20} key="s" />,
  <GitBranch size={20} key="g" />,
];

const WEAPON_ICONS: Record<string, React.ReactNode> = {
  chainsword: <Sword strokeWidth={1} size={32} />,
  dualaxe: <Axe strokeWidth={1} size={32} />,
  battleaxe: <Hammer strokeWidth={1} size={32} />,
};

const WEAPON_STATS: Record<string, Record<string, number>> = {
  chainsword: { Speed: 80, Range: 100, Impact: 50, Control: 90, Mobility: 70 },
  dualaxe: { Speed: 100, Range: 30, Impact: 70, Control: 40, Mobility: 90 },
  battleaxe: { Speed: 30, Range: 60, Impact: 100, Control: 80, Mobility: 20 },
};

const bz = text.berserker;
const MY_ROLES = ((bz.roles as any[]) ?? []).map((r, i) => ({
  ...r,
  icon: ROLE_ICONS[i],
}));
const WEAPON_LOADOUT = ((bz.weapons as any[]) ?? []).map((w) => ({
  id: w.slug,
  name: w.name,
  eng: w.eng,
  keyword: w.keyword,
  desc: w.desc,
  icon: WEAPON_ICONS[w.slug],
  stats: WEAPON_STATS[w.slug] ?? {},
  fig: w.fig,
  serial: w.serial,
}));

// --- SUB COMPONENTS ---

const TechRadar = ({ stats, theme = 'dark' }: { stats: any; theme?: 'dark' | 'light' }) => {
    const isLight = theme === 'light';
    const size = 160;
    const center = size / 2;
    const radius = 55;
    const axes = Object.keys(stats);
    const angleStep = (Math.PI * 2) / axes.length;
    const strokeColor = isLight ? '#a8a29e' : '#333';
    const fillColor = isLight ? 'rgba(120, 113, 108, 0.12)' : undefined;
    const accentColor = isLight ? '#57534e' : '#9f1239';
    const markerColor = isLight ? '#44403c' : '#fff';
    const labelCls = isLight ? 'fill-stone-600' : 'fill-stone-600';

    const getPoint = (val: number, index: number) => {
        const value = val / 100;
        const x = center + radius * value * Math.cos(index * angleStep - Math.PI / 2);
        const y = center + radius * value * Math.sin(index * angleStep - Math.PI / 2);
        return `${x},${y}`;
    };

    const dataPoints = axes.map((key, i) => getPoint(stats[key], i)).join(' ');
    const bgPoints = axes.map((_, i) => getPoint(100, i)).join(' ');
    const midPoints = axes.map((_, i) => getPoint(50, i)).join(' ');

    return (
        <div className="relative w-[160px] h-[160px] mx-auto my-8">
            <svg width={size} height={size} className="overflow-visible">
                {!isLight && (
                    <defs>
                        <linearGradient id="techGradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#9f1239" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#9f1239" stopOpacity="0.1" />
                        </linearGradient>
                    </defs>
                )}
                <polygon points={bgPoints} fill="none" stroke={strokeColor} strokeWidth="0.5" />
                <polygon points={midPoints} fill="none" stroke={strokeColor} strokeWidth="0.5" strokeDasharray="3 3" />
                {axes.map((_, i) => {
                    const p = getPoint(100, i);
                    return <line key={i} x1={center} y1={center} x2={p.split(',')[0]} y2={p.split(',')[1]} stroke={strokeColor} strokeWidth="0.5" />;
                })}
                <polygon points={dataPoints} fill={isLight ? fillColor : 'url(#techGradient)'} stroke={accentColor} strokeWidth="1" />
                {axes.map((key, i) => {
                    const p = getPoint(stats[key], i);
                    const [cx, cy] = p.split(',');
                    return <circle key={i} cx={cx} cy={cy} r="1.5" fill={markerColor} />;
                })}
                {axes.map((key, i) => {
                    const labelRadius = radius + 20;
                    const x = center + labelRadius * Math.cos(i * angleStep - Math.PI / 2);
                    const y = center + labelRadius * Math.sin(i * angleStep - Math.PI / 2);
                    return (
                        <text key={key} x={x} y={y} textAnchor="middle" dominantBaseline="middle" className={`${labelCls} text-[9px] font-sans font-light tracking-widest uppercase`}>
                            {key}
                        </text>
                    );
                })}
            </svg>
        </div>
    );
};

// 분노 인포그래픽 (berserker-fury-identity 참고)
const MAX_FURY = 100;
const FURY_PER_HIT = 15;

const FuryGaugeBar: React.FC<{ value: number; max: number; isDecaying: boolean }> = ({ value, max }) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    return (
        <div className="w-full max-w-[280px] flex-shrink-0 space-y-2">
            <div className="flex justify-between text-[10px] font-mono text-stone-500">
                <span className="tracking-[0.2em] uppercase">Fury</span>
                <span className="tabular-nums">{Math.floor(value)} / {max}</span>
            </div>
            <div className="h-6 rounded-full bg-stone-800/80 border border-stone-700 overflow-hidden">
                <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-red-950 to-red-800 border-r border-red-600/50 shadow-[0_0_10px_rgba(185,28,28,0.3)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ type: 'spring', stiffness: 50, damping: 15 }}
                />
            </div>
        </div>
    );
};

const FuryInfographic: React.FC = () => {
    const [fury, setFury] = React.useState(0);
    const [lastHitTime, setLastHitTime] = React.useState(0);
    const [isDecaying, setIsDecaying] = React.useState(false);

    React.useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            if (now - lastHitTime > 2000 && fury > 0) {
                setIsDecaying(true);
                setFury((prev) => Math.max(0, prev - 2));
            } else setIsDecaying(false);
        }, 100);
        return () => clearInterval(interval);
    }, [fury, lastHitTime]);

    const handleAttack = () => {
        setLastHitTime(Date.now());
        setIsDecaying(false);
        setFury((prev) => Math.min(MAX_FURY, prev + FURY_PER_HIT));
    };

    return (
        <div className="w-full max-w-5xl mx-auto space-y-10 md:space-y-14 pt-1 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 items-center">
                <div className="flex flex-col items-center text-center order-2 md:order-1">
                    <span className="text-[10px] font-mono text-stone-600 uppercase tracking-widest mb-3">Input</span>
                    <motion.button
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={handleAttack}
                        className={`w-20 h-20 rounded-full border-2 flex items-center justify-center bg-stone-900/80 backdrop-blur-sm transition-all
                            ${Date.now() - lastHitTime < 400 ? 'border-red-700 shadow-[0_0_20px_rgba(185,28,28,0.4)] text-white' : 'border-stone-700 text-stone-500 hover:border-stone-600'}`}
                    >
                        <Sword size={28} strokeWidth={1.5} />
                    </motion.button>
                    <h4 className="text-sm font-serif text-stone-300 mt-3">Normal Attack</h4>
                    <p className="text-[10px] text-stone-500 mt-1">일반 공격 적중 시 분노 획득</p>
                </div>

                <div className="flex flex-col items-center order-1 md:order-2">
                    <FuryGaugeBar value={fury} max={MAX_FURY} isDecaying={isDecaying} />
                    <div className="mt-4 text-center">
                        <span className="text-[10px] font-mono text-stone-600 uppercase tracking-widest">Resource</span>
                        <p className="text-xs text-stone-500 mt-1">분노 0~100 축적</p>
                    </div>
                </div>

                <div className="flex flex-col items-center text-center order-3">
                    <span className="text-[10px] font-mono text-stone-600 uppercase tracking-widest mb-3">Passive</span>
                    <div className={`w-20 h-20 rounded-full border-2 flex items-center justify-center bg-stone-900/80 backdrop-blur-sm transition-all
                        ${isDecaying ? 'border-red-700 text-red-800' : 'border-stone-700 text-stone-600'}`}>
                        <TrendingDown size={28} strokeWidth={1.5} />
                    </div>
                    <h4 className="text-sm font-serif text-stone-300 mt-3">Natural Decay</h4>
                    <p className="text-[10px] text-stone-500 mt-1">비전투 시 분노 서서히 감소</p>
                </div>
            </div>
        </div>
    );
};

interface BerserkerDesignProps {
  theme?: 'dark' | 'light';
  variant?: 'archival';
}

const BerserkerDesign: React.FC<BerserkerDesignProps> = ({ theme = 'dark', variant }) => {
    const isLight = theme === 'light';
    const isArchival = isLight && variant === 'archival';

    return (
        <div className="w-full space-y-20">
            <div className="space-y-8">
                <div className="space-y-3 max-w-3xl">
                    <div className={`w-12 h-px mb-4 ${isArchival ? 'bg-archival-ink/40' : isLight ? 'bg-[#1A1A1A]/50' : ''}`} style={isArchival ? { height: '0.5px' } : undefined} />
                    <div className={`text-[10px] tracking-[0.35em] uppercase ${isArchival ? 'font-archival-mono text-archival-ink/80' : isLight ? 'font-mono text-[#2D2D2D]/90' : 'text-stone-500'}`}>
                        {bz.overviewLabel}
                    </div>
                    <p className={`text-[0.7rem] md:text-[0.8rem] leading-relaxed whitespace-pre-line ${isArchival ? 'text-archival-ink-deep/90' : isLight ? 'text-[#2D2D2D]' : 'text-stone-300'}`}>
                        {bz.overviewBody}
                    </p>
                </div>

                <div className="lg:grid lg:grid-cols-[minmax(0,6fr)_minmax(0,2fr)] gap-8 lg:gap-12 items-stretch">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className={`w-full aspect-[21/9] relative overflow-hidden ${isArchival ? 'border border-archival-ink/20' : isLight ? 'border border-[#1A1A1A]/20' : 'bg-stone-900 rounded-xl border border-white/10'} group shadow-2xl`}
                        style={isArchival ? { borderWidth: '0.5px' } : undefined}
                    >
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${overviewImage})`, backgroundPosition: 'center 60%' }} />
                        <div className={`absolute inset-0 z-0 ${isLight ? 'bg-gradient-to-t from-[#F2EFE9] via-transparent to-transparent' : 'bg-gradient-to-t from-stone-950 via-transparent to-transparent'}`} />

                        <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 z-10">
                            <div className={`px-3 py-1 text-xs font-medium inline-block mb-2 backdrop-blur-sm ${isArchival ? 'bg-white/60 border border-archival-ink/25 text-archival-ink font-archival-mono' : isLight ? 'bg-white/60 border border-[#1A1A1A]/20 text-[#2D2D2D]' : 'bg-gold/10 border border-gold/30 text-gold'}`} style={isArchival ? { borderWidth: '0.5px' } : undefined}>
                                {bz.heroBadge}
                            </div>
                            <h2 className={`text-3xl md:text-5xl font-light tracking-[0.2em] drop-shadow-lg whitespace-pre-line ${isArchival ? 'font-archival-serif text-archival-ink' : isLight ? 'font-hero-serif text-[#1A1A1A]' : 'text-white font-hero-serif'}`}>
                                {(bz.heroTitle as string).replace(' ', '\n')}
                            </h2>
                        </div>

                        <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 z-10 max-w-xs">
                            <div className={`backdrop-blur-md rounded-xl p-4 shadow-xl ${isArchival ? 'bg-white/70 border border-archival-ink/15' : isLight ? 'bg-white/70 border border-[#1A1A1A]/15' : 'bg-black/60 border border-white/10 shadow-black/40'}`} style={isArchival ? { borderWidth: '0.5px' } : undefined}>
                                <div className="space-y-1.5">
                                    {(bz.meta as any[]).map((item: any) => (
                                        <div key={item.label} className={`flex items-baseline gap-2 text-[10px] ${isArchival ? 'font-archival-mono text-archival-ink/90' : isLight ? 'font-mono text-[#2D2D2D]' : 'font-mono text-stone-200/80'}`}>
                                            <span className={`inline-flex w-1 h-1 rounded-full mt-[3px] ${isArchival ? 'bg-archival-ink' : isLight ? 'bg-[#1A1A1A]' : 'bg-gold'}`} />
                                            <span className={`uppercase tracking-[0.16em] mr-1 ${isArchival ? 'text-archival-ink/75' : isLight ? 'text-[#2D2D2D]/80' : 'text-stone-400'}`}>{item.label}:</span>
                                            <span className={`tracking-tight ${isArchival ? 'text-archival-ink' : isLight ? 'text-[#1A1A1A]' : 'text-stone-100'}`}>{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <div className="mt-8 lg:mt-0 flex flex-col h-full">
                        <div className={`flex items-center gap-2 mb-6 pb-3 border-b ${isArchival ? 'border-archival-ink/20' : isLight ? 'border-[#1A1A1A]/15' : 'border-gold/20'}`} style={isArchival ? { borderBottomWidth: '0.5px' } : undefined}>
                            <div className={`w-8 h-px ${isArchival ? 'bg-archival-ink/40' : isLight ? 'bg-[#1A1A1A]/50' : ''}`} style={isArchival ? { height: '0.5px' } : undefined} />
                            <PenTool size={14} className={isArchival ? 'text-archival-ink/80' : isLight ? 'text-[#2D2D2D]' : 'text-gold'} strokeWidth={1.5} />
                            <h3 className={`text-xs font-medium uppercase tracking-widest ${isArchival ? 'font-archival-mono text-archival-ink/90' : isLight ? 'text-[#2D2D2D]' : 'text-gold'}`}>{bz.contributionHeader}</h3>
                        </div>
                        <div className="grid md:grid-cols-3 lg:grid-cols-1 gap-3 h-full">
                            {MY_ROLES.map((role, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + (i * 0.1) }}
                                    className={`p-4 flex flex-col h-full transition-all group ${isArchival ? 'border border-archival-ink/25 hover:border-archival-ink/40' : isLight ? 'border border-[#1A1A1A]/20 hover:border-[#1A1A1A]/35' : 'bg-stone-900/60 rounded-xl border border-white/5 hover:border-gold/30 hover:bg-stone-900'}`}
                                    style={isArchival ? { borderWidth: '0.5px' } : undefined}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className={`text-2xl font-light select-none ${isArchival ? 'text-archival-ink/30 group-hover:text-archival-ink/50 font-archival-mono' : isLight ? 'text-[#1A1A1A]/30 group-hover:text-[#1A1A1A]/50' : 'text-stone-800 group-hover:text-gold/20'}`}>0{i+1}</div>
                                        <div className={isArchival ? 'text-archival-ink/80 group-hover:text-archival-ink' : isLight ? 'text-[#2D2D2D] group-hover:text-[#1A1A1A]' : 'text-stone-600 group-hover:text-gold'}>{role.icon}</div>
                                    </div>
                                    <h4 className={`text-xs md:text-sm font-medium mb-0.5 ${isArchival ? 'font-archival-serif text-archival-ink' : isLight ? 'text-[#1A1A1A]' : 'text-stone-200'}`}>{role.subtitle}</h4>
                                    <h5 className={`text-[10px] mb-3 uppercase tracking-tighter ${isArchival ? 'font-archival-mono text-archival-ink/75' : isLight ? 'font-mono text-[#2D2D2D]/80' : 'font-mono text-stone-500'}`}>{role.title}</h5>
                                    <p className={`text-[11px] leading-relaxed whitespace-pre-line mt-auto pt-3 border-t ${isArchival ? 'text-archival-ink-deep/85 border-archival-ink/15 font-archival-mono' : isLight ? 'text-[#2D2D2D]/85 border-[#1A1A1A]/15' : 'text-stone-400 border-white/5'}`} style={isArchival ? { borderTopWidth: '0.5px' } : undefined}>
                                        {role.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 무기 전용 스킬 습득 표준 구조 — 03 하위, 04 클래스 설계 블록 바로 위 */}
            <div className="mt-12">
                <WeaponSkillStandardTree />
            </div>

            <div id="class-design" className="berserker-archival-section -mx-6 md:-mx-12 px-6 md:px-12 py-16 md:py-24 rounded-none">
                <div className="relative z-10 max-w-7xl mx-auto">
                    {/* 4. 클래스 설계 헤더 + Micro Data */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.6 }}
                        className="mb-20 pl-6 border-l border-archival-ink/30"
                        style={{ borderLeftWidth: '0.5px' }}
                    >
                        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 mb-2">
                            <span className="font-archival-mono tracking-[0.25em] text-sm font-medium uppercase text-archival-ink/80">{bz.classSectionLabel}</span>
                            <span className="font-archival-mono text-[10px] text-archival-ink/50 uppercase tracking-widest">{bz.classFig}</span>
                            <span className="font-archival-mono text-[10px] text-archival-ink/45 tracking-tight">{bz.classSerial}</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-light font-archival-serif text-[#2C2C2C] mb-4" style={{ letterSpacing: '0.12em' }}>{bz.classTitle}</h2>
                        <p className="max-w-3xl text-[0.8rem] leading-relaxed text-archival-ink-deep/90 tracking-[0.02em] whitespace-pre-line">
                            {bz.classIntro}
                        </p>
                    </motion.div>

                    {/* BESERKER Hero: 좌 캐릭터 + 기하학 / 우 타이포 + 인용·설명 */}
                    <div className="relative min-h-[520px] md:min-h-[600px] flex flex-col lg:flex-row gap-12 lg:gap-0">
                        {/* 기하학 장식: 얇은 원·호·십자선 (일부 회전) — 캐릭터 영역에 맞춤 */}
                        <div className="pointer-events-none absolute inset-0 overflow-hidden">
                            <motion.div className="absolute left-[22%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full border border-archival-ink/12" style={{ borderWidth: '0.5px' }} animate={{ rotate: 360 }} transition={{ duration: 48, repeat: Infinity, ease: 'linear' }} />
                            <motion.div className="absolute left-[22%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full border border-archival-gold/20" style={{ borderWidth: '0.5px' }} animate={{ rotate: -360 }} transition={{ duration: 72, repeat: Infinity, ease: 'linear' }} />
                            <div className="absolute left-[22%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] rounded-full border border-archival-ink/18" style={{ borderWidth: '0.5px' }} />
                            <svg className="absolute left-[12%] top-1/2 -translate-y-1/2 w-72 h-72 opacity-40" viewBox="0 0 100 100" fill="none" stroke="rgba(42,42,42,0.15)" strokeWidth="0.5">
                                <path d="M 50 10 A 40 40 0 0 1 90 50" />
                                <path d="M 50 90 A 40 40 0 0 1 10 50" />
                            </svg>
                            <div className="absolute right-[12%] top-1/2 -translate-y-1/2 w-px h-32 bg-archival-ink/15" style={{ height: '8rem' }} />
                            <div className="absolute right-[12%] top-1/2 -translate-y-1/2 w-32 h-px bg-archival-ink/15" style={{ width: '8rem', marginLeft: '-4rem' }} />
                        </div>

                        {/* 좌측: 캐릭터 이미지 (multiply + 마스크) + 분석선 — 크기·위치 확대 */}
                        <div className="relative flex-shrink-0 w-full lg:w-[58%] min-h-[360px] lg:min-h-[560px] flex items-end">
                            <div className="absolute inset-0 flex items-end">
                                <div className="relative w-full min-w-0 h-[420px] md:h-[520px] lg:h-[560px] overflow-hidden" style={{ maskImage: 'linear-gradient(to top, black 85%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to top, black 85%, transparent 100%)' }}>
                                    <img
                                        src={berserkerHero}
                                        alt={bz.heroAlt}
                                        draggable={false}
                                        onDragStart={(e) => e.preventDefault()}
                                        className="h-full w-full object-contain object-left-bottom scale-[1.55] lg:scale-[1.62] translate-y-20 md:translate-y-24 mix-blend-multiply opacity-95 origin-left-bottom"
                                    />
                                </div>
                            </div>
                            <div className="absolute left-4 bottom-24 w-12 h-px bg-archival-ink/25" style={{ width: '3rem', borderWidth: '0.5px' }} />
                            <div className="absolute left-4 bottom-24 w-px h-8 bg-archival-ink/25" style={{ height: '2rem', borderWidth: '0.5px' }} />
                            <span className="absolute left-4 bottom-14 font-archival-mono text-[9px] text-archival-ink/50 uppercase tracking-widest">{bz.heroRef}</span>
                        </div>

                        {/* 우측: 초대형 배경 타이포 + 메인 타이틀 + 인용 + 설명 + 하단 스탯 */}
                        <div className="relative z-10 lg:flex-1 flex flex-col justify-center lg:pl-0 lg:-ml-4">
                            <span className="pointer-events-none absolute right-0 top-0 text-[clamp(4rem,12vw,8rem)] font-archival-serif font-light tracking-[0.2em] uppercase text-archival-ink/[0.07] leading-none select-none" aria-hidden>{bz.heroClassName}</span>
                            <div className="relative">
                                <h2 className="text-2xl md:text-3xl font-archival-serif font-light text-[#2C2C2C] tracking-[0.15em] uppercase mb-6">{bz.heroClassName}</h2>
                                <p className="font-archival-mono text-[10px] text-archival-ink/55 uppercase tracking-[0.2em] mb-4">{bz.heroAttribute}</p>
                                <blockquote className="text-lg md:text-xl font-archival-serif text-archival-ink-deep/95 leading-relaxed tracking-[0.02em] mb-6">
                                    &ldquo;{bz.heroQuote}&rdquo;
                                </blockquote>
                                <p className="text-[0.8rem] leading-relaxed text-archival-ink-deep/85 tracking-[0.02em] max-w-xl mb-10 whitespace-pre-line">
                                    {bz.heroBody}
                                </p>
                                <div className="flex flex-wrap gap-6 font-archival-mono text-[10px] text-archival-ink/65 uppercase tracking-widest">
                                    {(bz.heroTags as string[]).map((tag: string) => (
                                      <span key={tag}>{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 무기 카드 그리드 + Micro Data */}
                    <div className="mt-20 grid md:grid-cols-3 gap-px bg-archival-ink/10 border border-archival-ink/15" style={{ borderWidth: '0.5px' }}>
                        {WEAPON_LOADOUT.map((weapon, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: idx * 0.15 }}
                                className="p-8 md:p-10 flex flex-col items-center text-center group transition-all duration-300 bg-white/50 hover:bg-white/70 border border-archival-ink/15"
                                style={{ borderWidth: '0.5px' }}
                            >
                                <div className="flex items-center justify-center gap-2 w-full mb-6">
                                    <span className="font-archival-mono text-[9px] text-archival-ink/45 uppercase tracking-widest">{weapon.fig ?? `FIG.0${idx + 2}`}</span>
                                    <span className="font-archival-mono text-[9px] text-archival-ink/40">{weapon.serial ?? `SERIAL ${['8922', '8923', '8924'][idx]}`}</span>
                                </div>
                                <div className="mb-6 transition-colors duration-300 text-archival-ink/75 group-hover:text-archival-ink">
                                    {weapon.icon}
                                </div>
                                <h4 className="text-lg font-archival-serif font-light text-[#2C2C2C] mb-1">{weapon.name}</h4>
                                <div className="font-archival-mono text-[10px] tracking-[0.2em] uppercase text-archival-ink/75 mb-0.5">{weapon.eng}</div>
                                <div className="font-archival-mono text-[9px] uppercase tracking-widest text-archival-ink/60 mb-6">{weapon.keyword}</div>
                                <TechRadar stats={weapon.stats} theme="light" />
                                <p className="text-[0.75rem] font-archival-mono leading-relaxed text-archival-ink-deep/85 mt-4 tracking-tight whitespace-pre-line">
                                    {weapon.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BerserkerDesign;