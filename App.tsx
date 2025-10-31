import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
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


const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(PageType.Home);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

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
      case PageType.Home:
        return <HomePage navigate={navigate} />;
      case PageType.Tracker:
        return <CoinTrackerPage />;
      case PageType.Academy:
        return <AcademyPage onSelectCourse={handleSelectCourse} />;
      case PageType.Community:
        return <CommunityPage />;
      default:
        return <HomePage navigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-200 transition-colors duration-300">
      <Header currentPage={currentPage} navigate={navigate} />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default App;