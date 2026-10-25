import React, { useEffect } from 'react';
import { WorkshopItem } from '../types';
import { ContactForm } from '../components/ContactForm';

interface WorkshopDetailPageProps {
  workshop: WorkshopItem;
  onNavigate: (route: string) => void;
  onOpenModal: (
    tag: string,
    title: string,
    content: React.ReactNode,
    actionText?: string,
    onAction?: () => void
  ) => void;
  onPrefillContact: (subject: string) => void;
  prefilledSubject: string;
}

export const WorkshopDetailPage: React.FC<WorkshopDetailPageProps> = ({
  workshop,
  onNavigate,
  onOpenModal,
  onPrefillContact,
  prefilledSubject
}) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [workshop.id]);

  const handleInquire = () => {
    onPrefillContact(`Přihláška na workshop: ${workshop.title}`);
    const el = document.getElementById('kontakt');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      {/* HERO SECTION */}
      <section className="page-hero">
        <div className="wrap page-hero-content">
          <span
            style={{
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              color: 'var(--color-primary)',
              fontWeight: 500,
              display: 'block',
              marginBottom: '10px'
            }}
          >
            {workshop.tag}
          </span>
          <h1>{workshop.title}</h1>
          <p>{workshop.subtitle}</p>
          <div style={{ marginTop: '20px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              type="button"
              className="button primary"
              onClick={handleInquire}
            >
              Přihlásit se na workshop
            </button>
            <button
              type="button"
              className="button"
              onClick={() => onNavigate('workshops')}
            >
              ← Zpět na přehled
            </button>
          </div>
        </div>
      </section>

      {/* WORKSHOP DETAILS SECTION */}
      <section className="workshop-detail-main">
        <div className="wrap">
          <div className="workshop-grid">
            {/* Left Column */}
            <div className="workshop-left">
              <h2>{workshop.title}</h2>
              <h3 className="subtitle">{workshop.subtitle}</h3>

              {workshop.fullDescription.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}

              {workshop.features && workshop.features.length > 0 && (
                <div
                  style={{
                    background: '#fdf8f9',
                    borderLeft: '4px solid var(--color-primary)',
                    padding: '24px 28px',
                    borderRadius: '0 8px 8px 0',
                    margin: '30px 0'
                  }}
                >
                  <h4 style={{ margin: '0 0 12px', color: '#111' }}>Co vás na workshopu čeká:</h4>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    {workshop.features.map((feat, idx) => (
                      <li key={idx} style={{ marginBottom: '8px' }}>{feat}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Seasons Grid if applicable (e.g. Ženská esence) */}
              {workshop.seasons && (
                <div>
                  <h4 style={{ fontSize: '20px', margin: '35px 0 16px' }}>Čtyři letošní setkání:</h4>
                  <div className="seasons-grid">
                    {workshop.seasons.map((s, idx) => (
                      <div key={idx} className="season-card">
                        <img src={s.image} alt={s.name} />
                        <div className="season-card-body">
                          <h5>{s.name}</h5>
                          <span className="date">{s.date}</span>
                          <p>{s.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {workshop.targetAudience && (
                <div style={{ marginTop: '30px' }}>
                  <h4>Pro koho je workshop určen:</h4>
                  <p>{workshop.targetAudience}</p>
                </div>
              )}
            </div>

            {/* Right Column: Pricing & Practicalities */}
            <div className="workshop-right">
              {workshop.datesAndLocation?.dates && (
                <>
                  <h4>Termín a harmonogram</h4>
                  <p>
                    <strong>Termín:</strong> {workshop.datesAndLocation.dates}
                  </p>
                  {workshop.datesAndLocation.schedule && (
                    <p style={{ whiteSpace: 'pre-line' }}>
                      <strong>Čas:</strong> {workshop.datesAndLocation.schedule}
                    </p>
                  )}
                </>
              )}

              {workshop.datesAndLocation?.location && (
                <>
                  <h4>Místo konání</h4>
                  <p>{workshop.datesAndLocation.location}</p>
                </>
              )}

              {workshop.datesAndLocation?.price && (
                <>
                  <h4>Cena</h4>
                  <p style={{ fontSize: '20px', fontWeight: 500, color: 'var(--color-primary)' }}>
                    {workshop.datesAndLocation.price}
                  </p>
                  {workshop.datesAndLocation.note && (
                    <p style={{ fontSize: '13px', color: '#777' }}>
                      {workshop.datesAndLocation.note}
                    </p>
                  )}
                </>
              )}

              {workshop.whatToBring && (
                <>
                  <h4>Co si vzít s sebou</h4>
                  <ul>
                    {workshop.whatToBring.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </>
              )}

              <div
                style={{
                  background: '#fdf8f9',
                  border: '1px solid #f8e7ec',
                  borderRadius: '8px',
                  padding: '20px',
                  marginTop: '25px'
                }}
              >
                <h5 style={{ fontSize: '15px', color: 'var(--color-primary)', marginBottom: '8px' }}>
                  O Daniele Torp
                </h5>
                <p style={{ fontSize: '13.5px', color: '#555', lineHeight: 1.6, margin: 0 }}>
                  Tělová terapeutka a průvodkyně v oblasti intimity a somatické přítomnosti.
                  Vzdělaná v Kalifornii, zakladatelka České asociace Sexological Bodywork.
                </p>
              </div>

              <div style={{ marginTop: '25px' }}>
                <button
                  type="button"
                  className="button primary"
                  style={{ width: '100%', padding: '13px 20px' }}
                  onClick={handleInquire}
                >
                  Mám zájem / Přihlásit se
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <ContactForm
        prefilledSubject={prefilledSubject}
        onOpenModal={onOpenModal}
      />
    </div>
  );
};
