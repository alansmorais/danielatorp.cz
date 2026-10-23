import React, { useEffect } from 'react';
import { CONSULTATION_DATA } from '../data/consultations';
import { ContactForm } from '../components/ContactForm';

interface ConsultationsPageProps {
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

export const ConsultationsPage: React.FC<ConsultationsPageProps> = ({
  onNavigate,
  onOpenModal,
  onPrefillContact,
  prefilledSubject
}) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInquire = (serviceName?: string) => {
    onPrefillContact(serviceName ? `Objednávka konzultace: ${serviceName}` : 'Objednávka osobní konzultace');
    const el = document.getElementById('kontakt');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const openAboutModal = () => {
    onOpenModal(
      'O Daniele',
      'Daniela Torp',
      'Daniela má více než 15 let zkušeností se somatickým provázením a intimitní terapií. Studovala v Kalifornii a je certifikovanou somatickou terapeutkou.'
    );
  };

  const openMediaModal = () => {
    onOpenModal(
      'Informace',
      'Daniela v médiích',
      'Rozhovory a podcasty v médiích jsou k dispozici na vyžádání. Témata zahrnují partnerskou intimitu, somatické léčení a 6 pilířů.'
    );
  };

  return (
    <div>
      {/* PAGE HERO */}
      <section className="page-hero">
        <div className="wrap page-hero-content">
          <h1>{CONSULTATION_DATA.title}</h1>
          <p>{CONSULTATION_DATA.subtitle}</p>
        </div>
      </section>

      {/* CONSULTATION MAIN SECTION */}
      <section className="consultation-main">
        <div className="wrap">
          <div className="consultation-grid">
            {/* Left Column: Details & What I Help With */}
            <div className="consultation-col">
              <h2>Osobní a párové konzultace</h2>
              <p>{CONSULTATION_DATA.intro}</p>

              <h4 style={{ fontSize: '18px', fontWeight: 500, margin: '25px 0 10px', color: '#111' }}>
                Jak se setkáme?
              </h4>
              <p>{CONSULTATION_DATA.formatInfo}</p>

              <h4 style={{ fontSize: '18px', fontWeight: 500, margin: '25px 0 10px', color: '#111' }}>
                S čím vám mohu pomoci?
              </h4>
              <ul style={{ margin: '15px 0 20px 20px', color: '#555', fontSize: '15px', lineHeight: 1.8 }}>
                {CONSULTATION_DATA.topics.map((t, idx) => (
                  <li key={idx} style={{ marginBottom: '8px' }}>{t}</li>
                ))}
              </ul>
            </div>

            {/* Right Column: Pricing & Format */}
            <div className="consultation-col">
              <h2>Vhodné pro</h2>
              <p>Pouze pro dospělé (jednotlivce i páry).</p>

              <div className="pricing-box">
                <h3>Ceník a balíčky</h3>
                {CONSULTATION_DATA.pricing.map((p, idx) => (
                  <div key={idx} className="pricing-item">
                    <span>
                      <strong>{p.name}</strong>
                      {p.duration && <span style={{ color: '#777', fontSize: '13px' }}> ({p.duration})</span>}
                    </span>
                    <strong style={{ color: 'var(--color-primary)', marginLeft: '12px', whiteSpace: 'nowrap' }}>
                      {p.price}
                    </strong>
                  </div>
                ))}
              </div>

              <p style={{ marginTop: '15px', fontSize: '13px', color: '#777' }}>
                <strong>Zvýhodněné balíčky:</strong> {CONSULTATION_DATA.pricingNote}
              </p>

              <h3 style={{ marginTop: '30px', fontSize: '20px', fontWeight: 400 }}>
                Kde konzultace probíhají?
              </h3>
              <p style={{ color: '#555', fontSize: '15px' }}>
                V České republice (Praha / Kamenný Újezd u Nýřan), v Norsku nebo online.
              </p>

              <div style={{ marginTop: '25px' }}>
                <button
                  type="button"
                  className="button primary"
                  style={{ width: '100%', padding: '13px 20px' }}
                  onClick={() => handleInquire()}
                >
                  Mám zájem / Objednat konzultaci
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PHOTO GALLERY STRIP */}
      <section className="gallery-strip">
        <img src="/images/2.jpg" alt="Konzultace fotografie 1" />
        <img src="/images/3.jpg" alt="Konzultace fotografie 2" />
        <img src="/images/1.jpg" alt="Konzultace fotografie 3" />
      </section>

      {/* ABOUT DANIELA MINI SECTION */}
      <section style={{ padding: '80px 0', background: '#fdf8f9' }}>
        <div className="wrap">
          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '50px', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <img
                src="/images/daniela-torp.png"
                alt="Daniela Torp"
                style={{ width: '240px', height: '240px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}
              />
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
                <button
                  type="button"
                  className="button"
                  onClick={openMediaModal}
                  style={{ padding: '8px 16px', fontSize: '12px' }}
                >
                  Média
                </button>
                <button
                  type="button"
                  className="button"
                  onClick={openAboutModal}
                  style={{ padding: '8px 16px', fontSize: '12px' }}
                >
                  Více o Daniele
                </button>
              </div>
            </div>

            <div>
              <h2 style={{ fontSize: '28px', fontWeight: 300, marginBottom: '18px' }}>
                Kdo je Daniela Torp
              </h2>
              <p style={{ color: '#555', fontSize: '15px', lineHeight: 1.7, marginBottom: '14px' }}>
                Jsem člověk stejně jako vy. Cítím, vnímám a prožívám podobné situace, výzvy, radosti i bolesti.
                Pečuji o sebe, svou rodinu a přátele. Ctím přírodu a s pokorou obdivuji její zákonitosti,
                nekonečnou rozmanitost i smysl pro humor.
              </p>
              <p style={{ color: '#555', fontSize: '15px', lineHeight: 1.7, marginBottom: '14px' }}>
                Věděli jste, že na světě existuje více než 180 000 ostrovů? Některé si mohou být podobné,
                přesto je každý z nich jedinečným ekosystémem.
              </p>
              <p style={{ color: '#222', fontWeight: 500, fontSize: '15px' }}>
                Klíčem k úspěchu je láska – především láska k sobě samým.
              </p>
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
