import React, { useState, useEffect } from 'react';

interface ContactFormProps {
  prefilledSubject?: string;
  onOpenModal: (tag: string, title: string, content: React.ReactNode) => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({ prefilledSubject, onOpenModal }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState(prefilledSubject || '');
  const [message, setMessage] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (prefilledSubject) {
      setSubject(prefilledSubject);
    }
  }, [prefilledSubject]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Honeypot check
    if (honeypot.trim() !== '') {
      console.warn('Blocked by honeypot');
      return;
    }

    // Captcha verification (1 + 1 = 2)
    if (captcha.trim() !== '2') {
      setErrorMessage('Zkontrolujte prosím odpověď na otázku: Kolik je 1 + 1?');
      return;
    }

    setIsSubmitting(true);

    const formattedMessage = subject ? `[Předmět: ${subject}]\n\n${message}` : message;
    const payload = {
      type: 'contact',
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: formattedMessage,
      source_website: 'danielatorp.cz',
      source_language: 'cs',
      admin_language: 'en',
      captcha_answer: captcha,
      website: honeypot,
      submitted_at: new Date().toISOString(),
      page_url: window.location.href
    };

    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwiptZDdNVNSavoyJeHCvoc7XxOSTG0yg_K5Z-Si81Up_4CSBo5AJUUOuMYLNh2eT3h/exec';

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(payload)
      });

      setIsSuccess(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setCaptcha('');
    } catch (err) {
      console.error('Contact submission error:', err);
      // Even if network fails, show friendly retry
      setErrorMessage('Při odesílání formuláře došlo k chybě. Zkuste to prosím znovu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openGdprModal = () => {
    onOpenModal(
      'Informace',
      'Zpracování osobních údajů',
      <div style={{ lineHeight: 1.7, color: '#444' }}>
        <p>
          Správcem osobních údajů je Daniela Torp. Veškeré informace a dotazy zaslané prostřednictvím
          tohoto formuláře podléhají přísné mlčenlivosti, etickému kodexu a zásadám ochrany osobních
          údajů (GDPR).
        </p>
        <p>
          Vaše údaje (jméno, e-mail a obsah zprávy) slouží výhradně ke zpětnému kontaktování za účelem
          domluvy termínu konzultace či účasti na workshopu. Nikdy je neposkytujeme třetím stranám.
        </p>
      </div>
    );
  };

  return (
    <section className="contact" id="kontakt">
      <div className="wrap">
        <h2>Napište mi</h2>
        <p className="contact-intro">Máte dotaz? Jsem tu pro vás.</p>

        {isSuccess ? (
          <div className="success-box">
            <h3>Děkuji za vaši zprávu!</h3>
            <p>Vaše zpráva byla odeslána. Daniela se vám ozve co nejdříve.</p>
            <button
              type="button"
              className="button primary"
              style={{ marginTop: '18px' }}
              onClick={() => setIsSuccess(false)}
            >
              Odeslat další zprávu
            </button>
          </div>
        ) : (
          <form className="form" onSubmit={handleSubmit}>
            {/* Honeypot field for anti-spam bots */}
            <div className="anti-spam-field" aria-hidden="true">
              <label htmlFor="website-hp">Nechte toto pole prázdné</label>
              <input
                type="text"
                id="website-hp"
                name="website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="field">
              <label htmlFor="formName">
                Jméno a příjmení <span className="required">*</span>
              </label>
              <input
                type="text"
                id="formName"
                required
                placeholder="Jan Novák"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="formEmail">
                Váš e-mail <span className="required">*</span>
              </label>
              <input
                type="email"
                id="formEmail"
                required
                placeholder="jan.novak@example.cz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="field full">
              <label htmlFor="formSubject">
                Předmět <span className="required">*</span>
              </label>
              <input
                type="text"
                id="formSubject"
                required
                placeholder="Konzultace, workshop, dotaz"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className="field full">
              <label htmlFor="formMessage">
                Zpráva <span className="required">*</span>
              </label>
              <textarea
                id="formMessage"
                required
                placeholder="Napište svou zprávu..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            {errorMessage && (
              <div
                style={{
                  gridColumn: '1 / -1',
                  color: '#e7485e',
                  fontSize: '14px',
                  fontWeight: 500,
                  background: '#fff3f5',
                  padding: '10px 14px',
                  borderRadius: '6px'
                }}
              >
                {errorMessage}
              </div>
            )}

            <div className="form-bottom">
              <div className="security-notice">
                <div className="shield-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <polyline points="9 12 11 14 15 10" />
                  </svg>
                  Bezpečné odeslání (Anti-Spam)
                </div>

                <div className="captcha-question">
                  <label htmlFor="captchaAnswer">Kolik je 1 + 1? <span className="required">*</span></label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="off"
                    id="captchaAnswer"
                    required
                    value={captcha}
                    onChange={(e) => setCaptcha(e.target.value)}
                  />
                </div>

                <div className="notice">
                  Pole označená hvězdičkou jsou povinná.<br />
                  Odesláním formuláře souhlasím se{' '}
                  <a onClick={openGdprModal}>zpracováním osobních údajů</a>.
                </div>
              </div>

              <button className="send" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Odesílám...' : 'Odeslat ➜'}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};
