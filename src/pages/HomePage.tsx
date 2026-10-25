import React, { useState, useEffect } from 'react';
import { PILLARS } from '../data/pillars';
import { WORKSHOPS } from '../data/workshops';
import { fetchLiveUpcomingDates, DEFAULT_UPCOMING_DATES } from '../data/upcomingDates';
import { UpcomingDateItem } from '../types';
import { ContactForm } from '../components/ContactForm';

interface HomePageProps {
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
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenModal,
  onPrefillContact,
  prefilledSubject
}) => {
  const [upcomingDates, setUpcomingDates] = useState<UpcomingDateItem[]>(DEFAULT_UPCOMING_DATES);

  useEffect(() => {
    fetchLiveUpcomingDates().then((dates) => {
      if (dates && dates.length > 0) {
        setUpcomingDates(dates);
      }
    });
  }, []);

  const handleDateClick = (item: UpcomingDateItem) => {
    if (item.url) {
      if (item.url.startsWith('http')) {
        // Keep internal workshop links inside this app; only external links open a new tab.
        try {
          const link = new URL(item.url);
          if (link.hostname === window.location.hostname) {
            const match = link.pathname.match(/workshops\/([^/]+?)(?:\.html)?\/?$/i);
            if (match?.[1]) {
              onNavigate(`workshop-${decodeURIComponent(match[1])}`);
              return;
            }
          }
        } catch {
          // Fall through to the safe internal-link handling below.
        }
        window.open(item.url, '_blank', 'noopener,noreferrer');
      } else {
        const cleanPath = item.url.replace(/^(\.\.\/|\/)/, '').replace('.html', '');
        const workshopPath = cleanPath.match(/^workshops\/([^/]+)$/i);
        onNavigate(workshopPath ? `workshop-${decodeURIComponent(workshopPath[1])}` : cleanPath);
      }
      return;
    }

    if (item.workshopId) {
      onNavigate(`workshop-${item.workshopId}`);
      return;
    }

    // Live Google Sheets entries sometimes contain only display text and no URL.
    // Resolve known workshop titles so these items still open the full detail page.
    const normalizedText = item.text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const matchedWorkshop = WORKSHOPS.find((workshop) => {
      const normalizedTitle = workshop.title.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      return normalizedText.includes(normalizedTitle);
    });
    if (matchedWorkshop) {
      onNavigate(`workshop-${matchedWorkshop.id}`);
      return;
    }

    onOpenModal(
      'Termín akce',
      item.text,
      `Přejete si více informací nebo rezervaci místa na tuto akci?\n\n${item.text}\n\nMůžete mi poslat dotaz přímo z kontaktního formuláře níže.`,
      'Mám zájem / Zeptat se',
      () => {
        onPrefillContact(`Zájem o akci: ${item.text}`);
        const el = document.getElementById('kontakt');
        el?.scrollIntoView({ behavior: 'smooth' });
      }
    );
  };

  const openAboutModal = () => {
    onOpenModal(
      'O Daniele',
      'Více o Daniele Torp',
      `Daniela se věnuje somatické práci, intimitní terapii a partnerskému provázení více než 15 let.

Studovala v Kalifornii a je zakladatelkou České asociace Sexological Bodywork. Skrze 6 pilířů intimity pomáhá lidem nacházet pocit bezpečí, sebeúcty a opravdové životní energie.

Věří, že vztah k vlastnímu tělu je základem pro veškerou intimitu s partnerem i se světem. Její přístup je citlivý, nesoudící a respektující individuální tempo každého člověka.`
    );
  };

  const openMediaModal = () => {
    onOpenModal(
      'Informace',
      'Daniela v médiích',
      `Vybrané rozhovory, podcasty a články:

• Podcast Životní cesta: «Intimita začíná před zrcadlem»
• Magazín Harmonie: «6 pilířů, které proměňují partnerství»
• Vztahy a kultura: «Umění naslouchat beze slov»
• Český rozhlas: «O tabu v intimitě a odvaze ke zranitelnosti»

Další rozhovory a podcasty jsou k dispozici na vyžádání.`
    );
  };

  // Top 3 featured workshops for home page
  const featuredWorkshops = [
    WORKSHOPS.find((w) => w.id === 'umeni-potesit-zenu') || WORKSHOPS[0],
    WORKSHOPS.find((w) => w.id === 'umeni-potesit-muze') || WORKSHOPS[1],
    WORKSHOPS.find((w) => w.id === 'jen-pro-pary') || WORKSHOPS[2]
  ];

  return (
    <main>
      {/* ================= HERO ================= */}
      <section className="hero" id="hjem">
        <div className="wrap">
          <div className="intro">
            <h1>Intimita v souvislostech</h1>

            <div className="intro-text-block">
              <p>
                Intimita není jen sex. Jde o navázání důvěrného a pravdivého vztahu k sobě samému
                i k lidem ve vaší blízkosti. Intimita – onen příjemný pocit bezpečí, souznění a
                porozumění beze slov – spočívá na 6 pilířích. Vše začíná u nás samých. Udělejte
                se mnou krok na cestu k důvěře, lásce a laskavé péči.
              </p>
              <p>Pomohu vám najít cestu k vašemu pravému já i k vašim nejbližším.</p>
            </div>

            {/* Upcoming dates banner */}
            <div className="dates">
              <h2>Nadcházející termíny</h2>
              <div className="dynamic-dates-list">
                {upcomingDates.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleDateClick(item)}
                  >
                    {item.text}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="button primary"
              onClick={() => onNavigate('workshops')}
            >
              Zobrazit workshopy
            </button>
          </div>
        </div>
      </section>

      {/* ================= 6 PILLARS SECTION ================= */}
      <section className="pillars-section" id="pilarer">
        <div className="wrap">
          <div className="pillar-grid">
            {PILLARS.map((p) => (
              <div
                key={p.id}
                className="pillar"
                onClick={() => onNavigate('pillars', p.slug)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onNavigate('pillars', p.slug);
                }}
              >
                <div className="pillar-inner">
                  <div className="pillar-img-wrapper">
                    <img src={p.image} alt={p.title} />
                  </div>
                  <h3>{p.shortTitle}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ABOUT SECTION ================= */}
      <section className="about" id="om-daniela">
        <div className="wrap">
          <div className="about-grid">
            <div className="about-visual">
              <img
                className="portrait"
                src="/images/untitled-design-7.jpg"
                alt="Daniela Torp"
              />
              <div className="photo-buttons">
                <button
                  type="button"
                  className="button"
                  onClick={openAboutModal}
                >
                  Více o Daniele
                </button>
                <button
                  type="button"
                  className="button"
                  onClick={openMediaModal}
                >
                  Média
                </button>
              </div>
            </div>

            <div className="about-content">
              <h2>Kdo je Daniela</h2>
              <div className="about-copy">
                <div>
                  <p>
                    Jsem člověk. Cítím a vnímám přesně tak jako vy. Prožívám podobné situace,
                    výzvy, radosti i bolesti. Pečuji o sebe, o svou rodinu a přátele. Ctím
                    přírodu a s pokorou se skláním před jejími zákony, nekonečnou rozmanitostí
                    i smyslem pro humor.
                  </p>
                  <p>
                    <strong>Věděli jste, že na světě je více než 180 000 ostrovů?</strong>
                  </p>
                  <p>
                    Jsou jich tisíce a často si bývají podobné. Přesto je každý z nich
                    naprosto jedinečným ekosystémem.
                  </p>
                </div>
                <div>
                  <p>
                    Dovedete si představit pěstovat švestky v ráji kokosových palem? Chvíli by to
                    možná šlo, ale museli byste vynaložit obrovské úsilí, které jde proti
                    přirozenosti.
                  </p>
                  <p>
                    Často se k sobě chováme úplně stejně. Nutíme se do věcí, které jsou v rozporu
                    s naší skutečnou podstatou.
                  </p>
                  <p>I já sama jsem prošla tisíci ostrovy, než jsem objevila ten svůj.</p>
                  <p>
                    <strong>Základním klíčem k úspěchu je láska – láska k sobě samému.</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WORKSHOPS SECTION ================= */}
      <section className="workshops" id="workshops">
        <div className="wrap">
          <div className="section-title">
            <h2>Workshopy</h2>
            <p>
              Každý z nás se občas ocitne v situaci, se kterou si neví úplně rady. Na mých
              workshopech najdete odpovědi na své otázky. V bezpečném a chráněném prostoru.
            </p>
          </div>

          <div className="cards">
            {featuredWorkshops.map((w) => (
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

          <div className="workshops-cta">
            <button
              type="button"
              className="button primary"
              style={{ padding: '13px 34px', fontSize: '13.5px' }}
              onClick={() => onNavigate('workshops')}
            >
              Zobrazit všech 9 workshopů ➜
            </button>
          </div>
        </div>
      </section>

      {/* ================= CONTACT SECTION ================= */}
      <ContactForm
        prefilledSubject={prefilledSubject}
        onOpenModal={onOpenModal}
      />
    </main>
  );
};
