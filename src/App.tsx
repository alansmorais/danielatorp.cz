import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Modal } from './components/Modal';
import { CancellationPolicyContent } from './components/CancellationPolicyModal';
import { HomePage } from './pages/HomePage';
import { PillarsPage } from './pages/PillarsPage';
import { WorkshopsPage } from './pages/WorkshopsPage';
import { WorkshopDetailPage } from './pages/WorkshopDetailPage';
import { ConsultationsPage } from './pages/ConsultationsPage';
import { BlogPage } from './pages/BlogPage';
import { WORKSHOPS } from './data/workshops';
import { ModalState } from './types';

export const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [targetAnchor, setTargetAnchor] = useState<string | undefined>(undefined);
  const [prefilledSubject, setPrefilledSubject] = useState<string>('');

  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    title: '',
    content: ''
  });

  // Parse initial route from hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (!hash || hash === 'hjem' || hash === '') {
        setCurrentRoute('home');
        setTargetAnchor(undefined);
      } else if (hash === 'om-daniela' || hash === 'kontakt' || hash === 'workshops' || hash === 'pilarer') {
        setCurrentRoute('home');
        setTargetAnchor(hash);
      } else if (hash.startsWith('6-piliru-intimity') || hash === 'pillars') {
        setCurrentRoute('pillars');
        const anchorMatch = hash.match(/#(pilar-\d+)/);
        setTargetAnchor(anchorMatch ? anchorMatch[1] : undefined);
      } else if (hash.startsWith('workshops/') || hash.startsWith('workshop-')) {
        const workshopId = hash.replace(/^(workshops\/|workshop-)/, '').replace('.html', '');
        setCurrentRoute(`workshop-${workshopId}`);
        setTargetAnchor(undefined);
      } else if (hash === 'workshopy' || hash === 'workshops.html' || hash === 'workshops') {
        setCurrentRoute('workshops');
        setTargetAnchor(undefined);
      } else if (hash === 'konsultasjon.html' || hash === 'osobni-konzultace' || hash === 'osobni-konzultace.html' || hash === 'consultations') {
        setCurrentRoute('consultations');
        setTargetAnchor(undefined);
      } else if (hash === 'blog' || hash === 'blog.html') {
        setCurrentRoute('blog');
        setTargetAnchor(undefined);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (route: string, anchor?: string) => {
    setCurrentRoute(route);
    setTargetAnchor(anchor);

    // Update browser URL hash cleanly
    if (route === 'home') {
      window.location.hash = anchor ? `#${anchor}` : '#/';
      if (anchor) {
        setTimeout(() => {
          const el = document.getElementById(anchor);
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (route === 'pillars') {
      window.location.hash = anchor ? `#/6-piliru-intimity#${anchor}` : '#/6-piliru-intimity';
      if (anchor) {
        setTimeout(() => {
          const el = document.getElementById(anchor);
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (route.startsWith('workshop-') || route.startsWith('workshops/')) {
      const wId = route.replace(/^(workshop-|workshops\/)/, '').replace('.html', '');
      setCurrentRoute(`workshop-${wId}`);
      window.location.hash = `#/workshops/${wId}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (route === 'workshops') {
      window.location.hash = '#/workshopy';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (route === 'consultations') {
      window.location.hash = '#/osobni-konzultace';
      if (anchor) {
        setTimeout(() => {
          const el = document.getElementById(anchor);
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (route === 'blog') {
      window.location.hash = '#/blog';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const openModal = (
    tag: string,
    title: string,
    content: React.ReactNode,
    actionText?: string,
    onAction?: () => void
  ) => {
    setModalState({
      isOpen: true,
      tag,
      title,
      content,
      actionText,
      onAction
    });
  };

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const openCancellationModal = () => {
    openModal(
      'Podmínky',
      'Storno podmínky',
      <CancellationPolicyContent />
    );
  };

  const openMediaModal = () => {
    openModal(
      'Informace',
      'Daniela v médiích',
      `Rozhovory a podcasty:

• Podcast Životní cesta: «Intimita začíná před zrcadlem»
• Magazín Harmonie: «6 pilířů, které proměňují partnerství»
• Vztahy a kultura: «Umění naslouchat beze slov»
• Český rozhlas: «O tabu v intimitě a odvaze ke zranitelnosti»

Tiskové zprávy a podklady jsou k dispozici na vyžádání.`
    );
  };

  // Determine current main view
  let pageContent: React.ReactNode;
  if (currentRoute === 'pillars') {
    pageContent = (
      <PillarsPage
        onNavigate={navigateTo}
        onOpenModal={openModal}
        onPrefillContact={setPrefilledSubject}
        prefilledSubject={prefilledSubject}
        targetAnchor={targetAnchor}
      />
    );
  } else if (currentRoute === 'workshops') {
    pageContent = (
      <WorkshopsPage
        onNavigate={navigateTo}
        onOpenModal={openModal}
        onPrefillContact={setPrefilledSubject}
        prefilledSubject={prefilledSubject}
      />
    );
  } else if (currentRoute.startsWith('workshop-')) {
    const workshopId = currentRoute.replace(/^(workshop-|workshops\/)/, '').replace('.html', '');
    const workshop = WORKSHOPS.find(
      (w) => w.id.toLowerCase() === workshopId.toLowerCase() || w.slug.toLowerCase() === workshopId.toLowerCase()
    ) || WORKSHOPS[0];
    pageContent = (
      <WorkshopDetailPage
        workshop={workshop}
        onNavigate={navigateTo}
        onOpenModal={openModal}
        onPrefillContact={setPrefilledSubject}
        prefilledSubject={prefilledSubject}
      />
    );
  } else if (currentRoute === 'consultations') {
    pageContent = (
      <ConsultationsPage
        onNavigate={navigateTo}
        onOpenModal={openModal}
        onPrefillContact={setPrefilledSubject}
        prefilledSubject={prefilledSubject}
      />
    );
  } else if (currentRoute === 'blog') {
    pageContent = (
      <BlogPage
        onOpenModal={openModal}
        onNavigate={navigateTo}
      />
    );
  } else {
    pageContent = (
      <HomePage
        onNavigate={navigateTo}
        onOpenModal={openModal}
        onPrefillContact={setPrefilledSubject}
        prefilledSubject={prefilledSubject}
      />
    );
  }

  return (
    <div className="app-container">
      <Header
        currentRoute={currentRoute}
        onNavigate={navigateTo}
        onOpenCancellation={openCancellationModal}
      />

      {pageContent}

      <Footer
        onNavigate={navigateTo}
        onOpenCancellation={openCancellationModal}
        onOpenMediaModal={openMediaModal}
      />

      <Modal modal={modalState} onClose={closeModal} />
    </div>
  );
};
