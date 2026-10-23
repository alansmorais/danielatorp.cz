import React, { useEffect } from 'react';
import { PILLARS } from '../data/pillars';
import { ContactForm } from '../components/ContactForm';

interface PillarsPageProps {
  onNavigate: (route: string, anchor?: string) => void;
  onOpenModal: (
    tag: string,
    title: string,
    content: React.ReactNode,
    actionText?: string,
    onAction?: () => void
  ) => void;
  onPrefillContact: (subject: string) => void;
  prefilledSubject: string;
  targetAnchor?: string;
}

export const PillarsPage: React.FC<PillarsPageProps> = ({
  onNavigate,
  onOpenModal,
  onPrefillContact,
  prefilledSubject,
  targetAnchor
}) => {
  useEffect(() => {
    if (targetAnchor) {
      setTimeout(() => {
        const el = document.getElementById(targetAnchor);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [targetAnchor]);

  const handleConsultationClick = (pillarTitle: string) => {
    onPrefillContact(`Konzultace: ${pillarTitle}`);
    const el = document.getElementById('kontakt');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      {/* ================= HERO ================= */}
      <section className="page-hero">
        <div className="wrap page-hero-content">
          <h1>6 pilířů intimity</h1>
          <p>
            Intimita je onen příjemný pocit bezpečí a důvěry mezi lidmi. Intimita nevzniká sama
            od sebe, je třeba o ni pečovat. Provází nás všemi fázemi života.
          </p>
          <p>
            Z mého pohledu stojí intimita na 6 základních pilířích. Při konzultacích s klienty
            se zaměřujeme především na vztah k vlastnímu tělu. Vše začíná a končí láskou k sobě
            samému. Když mám rád sám sebe, mohu mít rád i druhé. Když mám soucit sám se sebou,
            mohu jej projevovat druhým v různých fázích života.
          </p>
          <p>
            <strong>Respekt, láska a soucit.</strong>
          </p>
        </div>
      </section>

      {/* ================= 6 PILLARS ================= */}
      <main id="pilarer">
        {PILLARS.map((p) => (
          <section key={p.id} className="pillar-section" id={p.slug}>
            <div className="pillar-row">
              <div className="pillar-image">
                <img src={p.image} alt={p.title} />
              </div>
              <div className="pillar-content">
                <div className="svg-divider"></div>
                <h2>{p.title}</h2>
                {p.fullText ? (
                  p.fullText.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))
                ) : (
                  <p>{p.description}</p>
                )}
                <button
                  type="button"
                  className="button primary"
                  onClick={() => handleConsultationClick(p.title)}
                >
                  Objednat konzultaci
                </button>
              </div>
            </div>
          </section>
        ))}
      </main>

      {/* ================= CONTACT SECTION ================= */}
      <ContactForm
        prefilledSubject={prefilledSubject}
        onOpenModal={onOpenModal}
      />
    </div>
  );
};
