import React, { useState } from 'react';
import { WORKSHOPS } from '../data/workshops';
import { PILLARS } from '../data/pillars';

interface HeaderProps {
  currentRoute: string;
  onNavigate: (route: string, anchor?: string) => void;
  onOpenCancellation: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRoute, onNavigate, onOpenCancellation }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pillarsDropdownOpen, setPillarsDropdownOpen] = useState(false);
  const [workshopsDropdownOpen, setWorkshopsDropdownOpen] = useState(false);

  const handleLinkClick = (route: string, anchor?: string) => {
    onNavigate(route, anchor);
    setMobileMenuOpen(false);
    setPillarsDropdownOpen(false);
    setWorkshopsDropdownOpen(false);
  };

  return (
    <header>
      <div className="wrap">
        <a
          href="#/"
          className="logo-link"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('home');
          }}
        >
          <img
            className="logo"
            src="/images/logo_perem_bez_pozadí.png"
            alt="Daniela Torp"
          />
        </a>

        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Otevřít menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>

        <nav className={`nav ${mobileMenuOpen ? 'is-open' : ''}`} id="mainNav">
          <a
            href="#/"
            className={currentRoute === 'home' ? 'active' : ''}
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('home');
            }}
          >
            Domů
          </a>

          {/* 6 Pilířů Dropdown */}
          <div
            className="drop"
            onMouseEnter={() => window.innerWidth >= 992 && setPillarsDropdownOpen(true)}
            onMouseLeave={() => window.innerWidth >= 992 && setPillarsDropdownOpen(false)}
          >
            <button
              type="button"
              className="drop-toggle"
              onClick={() => setPillarsDropdownOpen(!pillarsDropdownOpen)}
              style={currentRoute === 'pillars' ? { color: 'var(--color-primary)', fontWeight: 500 } : {}}
            >
              6 pilířů intimity <span className="drop-arrow">▼</span>
            </button>

            {pillarsDropdownOpen && (
              <div className="dropdown-menu">
                {PILLARS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleLinkClick('pillars', p.slug)}
                  >
                    {p.id}. {p.title.replace(/^\d+\.\s*/, '')}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => handleLinkClick('pillars')}
                  style={{ fontWeight: 500, color: 'var(--color-primary)' }}
                >
                  Zobrazit všech 6 pilířů ➜
                </button>
              </div>
            )}
          </div>

          <a
            href="#om-daniela"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('home', 'om-daniela');
            }}
          >
            Kdo je Daniela
          </a>

          {/* Workshopy Dropdown */}
          <div
            className="drop"
            onMouseEnter={() => window.innerWidth >= 992 && setWorkshopsDropdownOpen(true)}
            onMouseLeave={() => window.innerWidth >= 992 && setWorkshopsDropdownOpen(false)}
          >
            <button
              type="button"
              className="drop-toggle"
              onClick={() => setWorkshopsDropdownOpen(!workshopsDropdownOpen)}
              style={currentRoute === 'workshops' || currentRoute.startsWith('workshop-') ? { color: 'var(--color-primary)', fontWeight: 500 } : {}}
            >
              Workshopy <span className="drop-arrow">▼</span>
            </button>

            {workshopsDropdownOpen && (
              <div className="dropdown-menu">
                {WORKSHOPS.map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => handleLinkClick(`workshop-${w.id}`)}
                  >
                    {w.title}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => handleLinkClick('workshops')}
                  style={{ fontWeight: 500, color: 'var(--color-primary)' }}
                >
                  Zobrazit všech 9 workshopů ➜
                </button>
              </div>
            )}
          </div>

          <a
            href="#/osobni-konzultace"
            className={currentRoute === 'consultations' ? 'active' : ''}
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('consultations');
            }}
          >
            Osobní konzultace
          </a>

          <a
            href="#/blog"
            className={currentRoute === 'blog' ? 'active' : ''}
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('blog');
            }}
          >
            Blog
          </a>

          <a
            href="#kontakt"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick(currentRoute, 'kontakt');
            }}
          >
            Kontakt
          </a>

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenCancellation();
            }}
            style={{ color: 'var(--color-text-muted)', fontSize: '13.5px', padding: '10px 0' }}
          >
            Storno podmínky
          </button>

          {/* Language Switcher */}
          <div className="language-switcher" aria-label="Language selection">
            <a
              className="language-link"
              href="https://danielatorp.no/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Norsk"
              title="Norsk"
            >
              <span className="language-flag" aria-hidden="true">
                <svg viewBox="0 0 22 16" role="img">
                  <rect width="22" height="16" fill="#ba0c2f" />
                  <rect x="6" width="4" height="16" fill="#fff" />
                  <rect y="6" width="22" height="4" fill="#fff" />
                  <rect x="7" width="2" height="16" fill="#00205b" />
                  <rect y="7" width="22" height="2" fill="#00205b" />
                </svg>
              </span>
              <span>NO</span>
            </a>

            <span className="language-link active" aria-label="Čeština" title="Čeština">
              <span className="language-flag" aria-hidden="true">
                <svg viewBox="0 0 22 16" role="img">
                  <rect width="22" height="8" fill="#fff" />
                  <rect y="8" width="22" height="8" fill="#d7141a" />
                  <path d="M0 0L11 8 0 16Z" fill="#11457e" />
                </svg>
              </span>
              <span>CZ</span>
            </span>

            <a
              className="language-link"
              href="https://danielatorp.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="English"
              title="English"
            >
              <span className="language-flag" aria-hidden="true">
                <svg viewBox="0 0 22 16" role="img">
                  <rect width="22" height="16" fill="#012169" />
                  <path d="M0 0L22 16M22 0L0 16" stroke="#fff" strokeWidth="4" />
                  <path d="M0 0L22 16M22 0L0 16" stroke="#c8102e" strokeWidth="2" />
                  <path d="M11 0V16M0 8H22" stroke="#fff" strokeWidth="6" />
                  <path d="M11 0V16M0 8H22" stroke="#c8102e" strokeWidth="3" />
                </svg>
              </span>
              <span>EN</span>
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
};
