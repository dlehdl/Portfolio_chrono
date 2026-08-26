import React, { useEffect } from 'react';
import Nav from './components/Nav';
import Section from './components/Section';
import ClassDesign from './components/ClassDesign';
import SystemDesign from './components/SystemDesign';
import BerserkerDesign from './components/BerserkerDesign';
import AIAutomationSection from './components/AIAutomationSection';
import { motion } from 'framer-motion';
import { Swords, Mail, Phone, Film, Database, Award, Briefcase, GraduationCap } from 'lucide-react';
import coverImage from './images/ruedi-haberli-c65n6pgkXkI-unsplash.jpg';
import { text } from './content';
import ContentEditor from './components/ContentEditor';

const TIMELINE_ICONS = [Briefcase, Film, GraduationCap];
const SKILL_ICONS = [
  <Swords size={14} strokeWidth={1.5} key="s" />,
  <Database size={14} strokeWidth={1.5} key="d" />,
];

export default function App() {
  useEffect(() => {
    document.getElementById('preview-fallback')?.remove();
  }, []);

  const hero = text.hero;
  const about = text.about;
  const project = text.project;
  const combatSystem = text.combatSystem;
  const aiAutomation = text.aiAutomation;
  const footer = text.footer;

  return (
    <div className="bg-[#F2EFE9] text-[#1A1A1A] font-sans selection:bg-gold selection:text-[#1A1A1A] min-h-screen">
      <Nav />

      {/* 1. Hero Section — Organic Archival Sci‑Fi */}
      <section id="hero" className="relative min-h-screen flex items-end md:items-center overflow-hidden" data-cover={coverImage}>
        <div className="absolute top-[12%] right-[8%] w-44 h-44 md:w-56 md:h-56 rounded-full hero-sphere opacity-[0.35]" aria-hidden />
        <div className="absolute top-[22%] right-[22%] w-40 h-40 md:w-48 md:h-48 rounded-full hero-sphere opacity-[0.4]" aria-hidden />
        <div className="absolute bottom-[28%] left-[4%] w-28 h-28 md:w-36 md:h-36 rounded-full hero-sphere opacity-[0.3]" aria-hidden />
        <div className="absolute bottom-[18%] right-[12%] w-20 h-20 md:w-24 md:h-24 rounded-full hero-sphere opacity-[0.35]" aria-hidden />
        <div className="absolute top-[35%] right-[35%] w-16 h-16 rounded-full border border-archival-ink/25" style={{ borderWidth: '0.5px' }} aria-hidden />

        <div className="absolute top-24 left-8 md:left-16 flex flex-col gap-2 pointer-events-none z-10">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="w-px h-2 bg-archival-ink/25" style={{ width: '0.5px' }} />
          ))}
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-16 pb-24 md:pb-32 pt-32 md:pt-0">
          <div className="grid md:grid-cols-12 gap-12 md:gap-0">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="md:col-span-6 md:col-start-1 md:pl-0"
            >
              <div className="w-12 h-px bg-archival-ink/40 mb-8" style={{ height: '0.5px' }} />
              <h2 className="text-[10px] md:text-xs font-archival-mono tracking-[0.4em] uppercase text-archival-ink/75 mb-6">
                {hero.tagline}
              </h2>
              <h1 className="font-archival-serif text-5xl md:text-7xl lg:text-8xl font-semibold tracking-[0.35em] leading-[1.1] text-archival-ink">
                {hero.name}
              </h1>
              <div className="w-24 h-px bg-archival-ink/40 mt-8 mb-8" style={{ height: '0.5px' }} />
              <p className="text-base md:text-lg font-light leading-relaxed max-w-sm text-archival-ink-deep/90 whitespace-pre-line">
                {hero.statement}
              </p>
            </motion.div>
            <div className="hidden md:block md:col-span-6" />
          </div>
        </div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.2 }}
          className="absolute bottom-8 left-8 md:left-16"
        >
          <div className="w-px h-14 bg-archival-ink/35" style={{ width: '0.5px' }} />
        </motion.div>
      </section>

      {/* 2. About Me */}
      <Section id="about" className="relative">
        <div className="relative z-10 max-w-7xl mx-auto grid md:grid-cols-12 gap-16 md:gap-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-5"
          >
            <div className="w-12 h-px bg-archival-ink/40 mb-8" style={{ height: '0.5px' }} />
            <h2 className="text-[10px] font-archival-mono tracking-[0.35em] uppercase text-archival-ink/80 mb-4">{about.sectionLabel}</h2>
            <h1 className="font-archival-serif text-3xl md:text-4xl font-semibold tracking-[0.2em] mb-2 text-archival-ink">
              {about.name}
            </h1>
            <p className="text-archival-ink/75 font-archival-mono text-xs tracking-[0.2em] mb-8">{about.role}</p>
            <div className="w-24 h-px bg-archival-ink/40 mb-8" style={{ height: '0.5px' }} />
            <blockquote className="font-archival-serif text-lg md:text-xl font-light leading-relaxed mb-6 text-archival-ink-deep/90 tracking-wide">
              "<span className="font-semibold text-archival-ink">{about.quote}</span>"
            </blockquote>
            <p className="text-[0.7rem] md:text-[0.8rem] leading-relaxed mb-10 text-archival-ink-deep/90 whitespace-pre-line">
              {about.bio}
            </p>
            <div className="flex flex-wrap gap-6 text-xs font-archival-mono text-archival-ink/75 tracking-wider">
              <span className="flex items-center gap-2 hover:text-archival-ink transition-colors"><Mail size={14} strokeWidth={1.5} /> {about.email}</span>
              <span className="flex items-center gap-2 hover:text-archival-ink transition-colors"><Phone size={14} strokeWidth={1.5} /> {about.phone}</span>
            </div>

            <div className="flex flex-wrap gap-3 mt-12">
              {(about.skills as string[]).map((label: string, i: number) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 border border-archival-ink/25 text-xs text-archival-ink/90 hover:border-archival-ink/40 hover:text-archival-ink transition-colors cursor-default" style={{ borderWidth: '0.5px' }}>
                  {SKILL_ICONS[i]}
                  <span className="font-medium tracking-wide font-archival-mono">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="md:col-span-7 md:pl-8">
            <div className="h-px bg-archival-ink/20 mb-12" style={{ height: '0.5px' }} />
            <div className="relative">
              <div className="absolute left-[11px] top-0 bottom-0 w-px bg-archival-ink/15" style={{ width: '0.5px' }} />
              <div className="space-y-10">
                {(about.timeline as any[]).map((item: any, i: number) => {
                  const Icon = TIMELINE_ICONS[i] ?? Briefcase;
                  return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="relative pl-10 group"
                  >
                    <div className={`absolute left-[5px] top-2 w-3 h-3 rounded-full border ${i === 0 ? 'border-archival-ink bg-archival-ink/10' : 'border-archival-ink/35 bg-archival-ink/5'}`} style={{ borderWidth: '0.5px' }} />
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-1">
                      <h4 className="text-base font-semibold font-archival-serif text-archival-ink group-hover:text-archival-ink transition-colors">{item.title}</h4>
                      <span className="text-[10px] font-archival-mono text-archival-ink/70 tracking-wider">{item.date}</span>
                    </div>
                    <div className="text-xs text-archival-ink/75 font-medium mb-1 flex items-center gap-2 font-archival-mono"><Icon size={12} strokeWidth={1.5} /> {item.role}</div>
                    <p className="text-xs text-archival-ink-deep/85 leading-relaxed">{item.desc}</p>
                  </motion.div>
                  );
                })}
                <div className="relative pl-10">
                  <div className="absolute left-[5px] top-2 w-2 h-2 rounded-full bg-archival-ink/25" />
                  <h4 className="text-xs font-semibold font-archival-mono text-archival-ink/90 mb-2 flex items-center gap-2"><Award size={12} strokeWidth={1.5} /> {about.achievements.title}</h4>
                  <ul className="text-xs text-archival-ink-deep/85 space-y-1 list-disc list-inside">
                    {(about.achievements.items as string[]).map((line: string, i: number) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section id="project" title={project.title} subtitle={project.subtitle} theme="light" variant="archival">
        <BerserkerDesign theme="light" variant="archival" />
      </Section>

      <Section id="class-design-detail" theme="light">
        <ClassDesign />
      </Section>

      <Section id="combat-system" title={combatSystem.title} subtitle={combatSystem.subtitle} theme="light">
        <p className="text-[#2D2D2D]/80 mb-12 max-w-3xl">
          {combatSystem.intro}
        </p>
        <SystemDesign />
      </Section>

      <Section id="ai-automation" title={aiAutomation.title} subtitle={aiAutomation.subtitle} theme="light" variant="archival">
        <AIAutomationSection />
      </Section>

      <footer className="py-12 bg-[#F2EFE9] border-t border-[#1A1A1A]/15 text-center">
        <div className="font-serif text-xl font-bold text-[#2D2D2D] mb-4">{footer.name}</div>
        <p className="text-[#2D2D2D]/70 text-sm">{footer.tagline}</p>
      </footer>
      {import.meta.env.DEV && <ContentEditor />}
    </div>
  );
}
