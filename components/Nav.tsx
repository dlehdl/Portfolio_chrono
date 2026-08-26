import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { NAV_ITEMS } from '../constants';
import { text } from '../content';

const ACTIVE_ZONE_TOP = 120; // 섹션이 이 선(px) 위에 있으면 해당 섹션을 "현재 구간"으로 간주

const Nav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const navText = text.nav;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      setScrollProgress(Math.min(100, progress));

      // 현재 뷰포트 상단 근처에 있는 섹션을 활성으로 설정
      // 보다 구체적인(하위) 섹션이 상위 섹션보다 우선되도록, NAV_ITEMS를 뒤에서부터 검사
      let active: string | null = null;
      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const item = NAV_ITEMS[i];
        const el = document.getElementById(item.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= ACTIVE_ZONE_TOP && rect.bottom > 0) {
          active = item.id;
          break;
        }
      }

      // '클래스 설계'는 인트로 구간(첫 무기 블록 위)에 있을 때만 활성. 무기 구간 사이에서는 방금 지나친 무기 서브섹션 유지
      const CLASS_SUBSECTION_IDS = ['class-chainsword', 'class-dualaxe', 'class-battleaxe'];
      if (active === 'class-design') {
        const chainswordEl = document.getElementById('class-chainsword');
        if (chainswordEl) {
          const csRect = chainswordEl.getBoundingClientRect();
          if (csRect.top <= ACTIVE_ZONE_TOP) {
            // 이미 첫 무기(사슬검) 위쪽을 지남 → 인트로 아님. 구간 사이면 방금 지나친 무기로 유지
            let lastPassed: string | null = null;
            let maxBottom = -Infinity;
            for (const id of CLASS_SUBSECTION_IDS) {
              const subEl = document.getElementById(id);
              if (!subEl) continue;
              const r = subEl.getBoundingClientRect();
              if (r.bottom <= ACTIVE_ZONE_TOP && r.bottom > maxBottom) {
                maxBottom = r.bottom;
                lastPassed = id;
              }
            }
            if (lastPassed) active = lastPassed;
          }
        }
      }

      // class-design은 project 섹션 내부에 있어, 스크롤 시 project가 활성으로 잡혀 3→4.1로 튐. 이미 class-design을 지났다면 project 대신 class-design 유지
      const classDesignEl = document.getElementById('class-design');
      if (active === 'project' && classDesignEl) {
        const cdRect = classDesignEl.getBoundingClientRect();
        if (cdRect.bottom < ACTIVE_ZONE_TOP) {
          active = 'class-design';
        }
      }

      if (active === null && NAV_ITEMS.length > 0) {
        const first = document.getElementById(NAV_ITEMS[0].id);
        if (first && first.getBoundingClientRect().top <= window.innerHeight)
          active = NAV_ITEMS[0].id;
      }
      setActiveSectionId(active);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      window.dispatchEvent(new CustomEvent('section-nav', { detail: id }));
      try {
        window.history.pushState(null, '', `#${id}`);
      } catch (e) {}
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 nav-minimalism ${
          scrolled ? 'nav-scrolled border-b border-archival-ink/20' : 'bg-transparent'
        }`}
        style={scrolled ? { borderBottomWidth: '0.5px' } : undefined}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-16">
          <div className="flex justify-between items-center py-4 md:py-5">
            <button
              onClick={() => scrollTo('hero')}
              className="flex items-center gap-4 group"
            >
              <div className="w-8 h-px bg-archival-ink/40 group-hover:bg-archival-ink/70 transition-colors" style={{ height: '0.5px' }} aria-hidden />
              <span className="font-archival-serif text-sm md:text-base font-semibold tracking-[0.25em] text-archival-ink/90 group-hover:text-archival-ink transition-colors">
                {navText.brand}
              </span>
              <span className="font-archival-mono text-[9px] text-archival-ink/70 uppercase tracking-[0.35em] hidden sm:inline">
                {navText.brandSuffix}
              </span>
            </button>

            <div className="hidden md:flex items-center gap-6">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSectionId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    className={`relative font-archival-mono text-[10px] px-0 py-1 tracking-[0.2em] uppercase transition-colors ${
                      isActive ? 'text-archival-ink font-medium' : 'text-archival-ink/70 hover:text-archival-ink'
                    }`}
                    title={item.label}
                  >
                    {item.label}
                    {isActive && <span className="absolute bottom-0 left-0 right-0 h-px bg-archival-ink/50" style={{ height: '0.5px' }} aria-hidden />}
                  </button>
                );
              })}
            </div>

            <button
              className="md:hidden p-2 -mr-2 text-archival-ink"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? navText.ariaClose : navText.ariaOpen}
            >
              {isOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 w-full bg-[#F2EFE9] border-b border-archival-ink/20 md:hidden nav-dropdown-texture" style={{ borderBottomWidth: '0.5px' }}>
            <div className="relative z-10 max-w-7xl mx-auto px-6 py-5 space-y-0.5">
              <div className="w-12 h-px bg-archival-ink/30 mb-4" style={{ height: '0.5px' }} />
              {NAV_ITEMS.map((item) => {
                const isActive = activeSectionId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    className={`w-full text-left font-archival-mono text-xs py-3 tracking-[0.15em] uppercase transition-colors ${
                      isActive ? 'text-archival-ink font-medium' : 'text-archival-ink/70 hover:text-archival-ink'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div
          className="absolute left-0 right-0 bottom-0 h-px bg-archival-ink/15 overflow-hidden"
          style={{ height: '0.5px' }}
          aria-hidden
        >
          <div
            className="h-full bg-archival-ink/50 transition-transform duration-150 ease-out origin-left"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </nav>
    </>
  );
};

export default Nav;
