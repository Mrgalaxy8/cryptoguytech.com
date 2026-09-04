import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { AboutPage } from './components/HomePage';
import { CoinTrackerPage } from './components/CoinTrackerPage';
import { Footer } from './components/Footer';
import { CommunityPage } from './components/CommunityPage';
import type { Page } from './types';
import { PageType } from './types';
import { TelegramButton } from './components/TelegramButton';
import { AcademyPage } from './components/AcademyPage';
import { CourseDetailPage } from './components/CourseDetailPage';
import { BitcoinCoursePage } from './components/BitcoinCoursePage';
import { VirtualAssetsCoursePage } from './components/VirtualAssetsCoursePage';
import { EthereumCoursePage } from './components/EthereumCoursePage';
import { CoinDataProvider } from './context/CoinDataContext';
import { NetworkStatusBanner } from './components/NetworkStatusBanner';
import { DonatePage } from './components/DonatePage';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(PageType.Tracker);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  const navigate = useCallback((page: Page) => {
    setCurrentPage(page);
    setSelectedCourse(null);
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
      <div className="min-h-screen flex flex-col font-sans text-gray-900 dark:text-gray-200 bg-gray-50 dark:bg-dark-bg transition-colors duration-300">
        <Header currentPage={currentPage} navigate={navigate} />
        <NetworkStatusBanner />
        <main className="flex-grow">
          {renderPage()}
        </main>
        <Footer />
        <TelegramButton />
      </div>
    </CoinDataProvider>
  );
};

export default App;