import React, { useEffect } from 'react';
import { WORKSHOPS } from '../data/workshops';
import { ContactForm } from '../components/ContactForm';

interface WorkshopsPageProps {
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

export const WorkshopsPage: React.FC<WorkshopsPageProps> = ({
  onNavigate,
  onOpenModal,
  onPrefillContact,
  prefilledSubject
}) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      {/* PAGE HERO */}
      <section className="page-hero">
        <div className="wrap page-hero-content">
          <h1>Naše workshopy</h1>
          <p>
            Každý z nás se občas ocitne v situaci, se kterou si neví úplně rady. Na mých workshopech
            najdete odpovědi na své otázky v bezpečném a respektujícím prostředí.
          </p>
        </div>
      </section>

      {/* WORKSHOPS CATALOG */}
      <section style={{ padding: '80px 0 100px', background: '#fff' }}>
        <div className="wrap">
          <div className="cards-grid">
            {WORKSHOPS.map((w) => (
              <article key={w.id} className="card">
                <a
                  href={`#/workshopy/${w.id}`}
                  className="card-img-link"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(`workshop-${w.id}`);
                  }}
                >
                  <img src={w.image} alt={w.title} />
                </a>
                <div className="card-body">
                  <div className="card-content-top">
                    <span
                      style={{
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        color: 'var(--color-primary)',
                        fontWeight: 500,
                        display: 'block',
                        marginBottom: '6px'
                      }}
                    >
                      {w.tag}
                    </span>
                    <h3>
                      <a
                        href={`#/workshopy/${w.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          onNavigate(`workshop-${w.id}`);
                        }}
                      >
                        {w.title}
                      </a>
                    </h3>
                    <p>{w.subtitle}</p>
                  </div>
                  <div>
                    <button
                      type="button"
                      className="button"
                      onClick={() => onNavigate(`workshop-${w.id}`)}
                    >
                      Podrobnosti workshopu
                    </button>
                  </div>
                </div>
              </article>
            ))}
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
