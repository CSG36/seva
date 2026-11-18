import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { UiDictionary } from '../i18n/translations';

interface HeaderProps {
  dict: UiDictionary;
  activeView: 'landing' | 'assistant';
  onNavigateSection: (sectionId: string) => void;
  onToggleAssistant: () => void;
}

export function Header({
  dict,
  activeView,
  onNavigateSection,
  onToggleAssistant,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: dict.nav.home },
    { id: 'services', label: dict.nav.services },
    { id: 'how-it-works', label: dict.nav.howItWorks },
    { id: 'about', label: dict.nav.about },
    { id: 'contact', label: dict.nav.contact },
  ];

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    onNavigateSection(sectionId);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('home');
          }}
          className="font-display text-xl font-bold tracking-tight text-[#0F1E36] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D97706] rounded"
        >
          SevaAI
        </a>

        {/* Zone 2: 5 single-line navigation links */}
        <nav
          aria-label="Primary navigation"
          className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600"
        >
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.id);
              }}
              className="hover:text-[#0F1E36] hover:underline underline-offset-4 decoration-[#D97706] decoration-2 transition-colors whitespace-nowrap shrink-0 py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D97706] rounded"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onToggleAssistant();
            }}
            className="px-4 py-2 text-sm font-semibold text-white bg-[#0F1E36] hover:bg-[#1A3154] rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[40px] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D97706]"
          >
            {activeView === 'assistant' ? dict.nav.backToHome : dict.nav.openAssistant}
          </button>

          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D97706]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 flex flex-col gap-1"
        >
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.id);
              }}
              className="px-3 py-2.5 text-sm font-medium text-slate-700 hover:text-[#0F1E36] hover:bg-slate-50 rounded-lg"
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
