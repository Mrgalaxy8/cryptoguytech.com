import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { AboutPage } from './components/HomePage';
import { CoinTrackerPage } from './components/CoinTrackerPage';
import { Footer } from './components/Footer';
import { CommunityPage } from './components/CommunityPage';
import type { Page } from './types';
import { PageType } from './types';
import { WhatsAppButton } from './components/WhatsAppButton';
import { AcademyPage } from './components/AcademyPage';
import { CourseDetailPage } from './components/CourseDetailPage';
import { BitcoinCoursePage } from './components/BitcoinCoursePage';
import { VirtualAssetsCoursePage } from './components/VirtualAssetsCoursePage';
import { EthereumCoursePage } from './components/EthereumCoursePage';
import { CoinDataProvider } from './context/CoinDataContext';
import { NetworkStatusBanner } from './components/NetworkStatusBanner';
import { DonatePage } from './components/DonatePage';
import { WelcomeModal } from './components/WelcomeModal';


const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(PageType.Tracker);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);

  useEffect(() => {
    // This effect addresses the common issue on mobile devices where the viewport height
    // changes when the browser's address bar appears or disappears. By setting a CSS
    // variable (--vh) to the actual inner window height, we can create a stable layout
    // that doesn't jump or resize unexpectedly.
    const setVhProperty = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    window.addEventListener('resize', setVhProperty);
    setVhProperty(); // Set the value on initial load

    // Cleanup the event listener when the component unmounts
    return () => window.removeEventListener('resize', setVhProperty);
  }, []);

  const navigate = useCallback((page: Page) => {
    setCurrentPage(page);
    setSelectedCourse(null); // Deselect course when navigating
  }, []);

  const handleSelectCourse = (courseTitle: string) => {
    setSelectedCourse(courseTitle);
  };

  const handleBackToAcademy = () => {
    setSelectedCourse(null);
    setCurrentPage(PageType.Academy);
  };

  const renderPage = () => {
    if (selectedCourse === 'Blockchain Technology') {
      return <CourseDetailPage onBack={handleBackToAcademy} />;
    }
    if (selectedCourse === 'Bitcoin') {
      return <BitcoinCoursePage onBack={handleBackToAcademy} />;
    }
    if (selectedCourse === 'Virtual Assets & DeFi') {
      return <VirtualAssetsCoursePage onBack={handleBackToAcademy} />;
    }
    if (selectedCourse === 'Ethereum & Web3') {
      return <EthereumCoursePage onBack={handleBackToAcademy} />;
    }

    switch (currentPage) {
      case PageType.About:
        return <AboutPage navigate={navigate} />;
      case PageType.Tracker:
        return <CoinTrackerPage />;
      case PageType.Academy:
        return <AcademyPage onSelectCourse={handleSelectCourse} />;
      case PageType.Community:
        return <CommunityPage />;
      case PageType.Donate:
        return <DonatePage />;
      default:
        return <CoinTrackerPage />;
    }
  };

  return (
    <CoinDataProvider>
      <div className="h-[calc(var(--vh,1vh)*100)] flex flex-col font-sans text-gray-900 dark:text-gray-200 transition-colors duration-300 overflow-y-auto">
        {showWelcomeModal && <WelcomeModal onClose={() => setShowWelcomeModal(false)} />}
        <Header currentPage={currentPage} navigate={navigate} />
        <NetworkStatusBanner />
        <main className="flex-grow">
          {renderPage()}
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </CoinDataProvider>
  );
};

export default App;