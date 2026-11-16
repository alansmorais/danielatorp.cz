import React from 'react';
import { WORKSHOPS } from '../data/workshops';
import { PILLARS } from '../data/pillars';

interface FooterProps {
  onNavigate: (route: string, anchor?: string) => void;
  onOpenCancellation: () => void;
  onOpenMediaModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenCancellation,
  onOpenMediaModal
}) => {
  return (
    <footer>
      <div className="wrap">
        <div className="footer-grid">
          {/* Col 1 */}
          <div className="footer-col">
            <h4>Kontakt</h4>
            <div className="footer-links">
              <button type="button" onClick={() => onNavigate('home', 'hjem')}>
                Domů
              </button>
              <button type="button" onClick={() => onNavigate('home', 'om-daniela')}>
                Kdo je Daniela
              </button>
              <button type="button" onClick={onOpenMediaModal}>
                Daniela v médiích
              </button>
              <button type="button" onClick={() => onNavigate('blog')}>
                Blog
              </button>
              <button type="button" onClick={() => onNavigate('home', 'kontakt')}>
                Kontakt
              </button>
              <button type="button" onClick={onOpenCancellation}>
                Storno podmínky
              </button>
            </div>
          </div>

          {/* Col 2 */}
          <div className="footer-col">
            <h4>Workshopy</h4>
            <div className="footer-links">
              {WORKSHOPS.slice(0, 7).map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => onNavigate(`workshop-${w.id}`)}
                >
                  {w.title}
                </button>
              ))}
              <button
                type="button"
                onClick={() => onNavigate('workshops')}
                style={{ color: 'var(--color-primary)', fontWeight: 500 }}
              >
                Zobrazit všech 9 workshopů ➜
              </button>
            </div>
          </div>

          {/* Col 3 */}
          <div className="footer-col">
            <h4>Konzultace / 6 pilířů</h4>
            <div className="footer-links">
              <button type="button" onClick={() => onNavigate('consultations')}>
                Osobní konzultace
              </button>
              {PILLARS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onNavigate('pillars', p.slug)}
                >
                  {p.id}. {p.title.replace(/^\d+\.\s*/, '')}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="social">
            <a
              href="https://facebook.com/danielatorp"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              f
            </a>
            <a
              href="https://instagram.com/intimitycoachdanielatorp/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              ◎
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
            >
              ◉
            </a>
          </div>
          <div className="copyright">
            © 2026 Všechna práva vyhrazena | Daniela Torp
          </div>
        </div>
      </div>
    </footer>
  );
};
