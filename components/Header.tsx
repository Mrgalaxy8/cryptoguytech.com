import React, { useState } from 'react';
import type { Page } from '../types';
import { PageType } from '../types';

interface HeaderProps {
  currentPage: Page;
  navigate: (page: Page) => void;
  onTutorClick: () => void;
}

const GeminiIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.75L13.75 8.25L19.25 10L13.75 11.75L12 17.25L10.25 11.75L4.75 10L10.25 8.25L12 2.75Z M12 10.5C11.1716 10.5 10.5 11.1716 10.5 12C10.5 12.8284 11.1716 13.5 12 13.5C12.8284 13.5 13.5 12.8284 13.5 12C13.5 11.1716 12.8284 10.5 12 10.5Z"/>
    </svg>
);

const MenuIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);


export const Header: React.FC<HeaderProps> = ({ currentPage, navigate, onTutorClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navItems: Page[] = [PageType.Home, PageType.Tracker, PageType.Academy, PageType.Community];

  const handleNavClick = (page: Page) => {
    navigate(page);
    setIsMenuOpen(false);
  }

  const handleTutorClick = () => {
    onTutorClick();
    setIsMenuOpen(false);
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-primary-blue/80 backdrop-blur-md shadow-md shadow-primary-green/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex-1 flex justify-start">
                <div className="flex-shrink-0 cursor-pointer" onClick={() => handleNavClick(PageType.Home)}>
                  <h1 className="text-3xl font-black text-white tracking-tight">
                      CryptoGuy<span className="text-primary-green">TECH</span>
                  </h1>
                </div>
            </div>

            {/* Desktop Nav & Tutor Button */}
            <div className="hidden md:flex items-center gap-10">
                <nav className="flex items-center space-x-8">
                  {navItems.map((item) => (
                    <button
                      key={item}
                      onClick={() => handleNavClick(item)}
                      className={`text-base font-medium transition-colors duration-200 ${
                        currentPage === item
                          ? 'text-primary-green'
                          : 'text-gray-300 hover:text-primary-green'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </nav>

                <button 
                    onClick={onTutorClick}
                    className="flex items-center gap-2 text-base font-medium bg-primary-green/10 hover:bg-primary-green/20 text-primary-green px-4 py-2 rounded-lg transition-colors duration-200"
                >
                    <GeminiIcon className="w-5 h-5" />
                    <span>AI Tutor</span>
                </button>
            </div>


            <div className="md:hidden">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-300 hover:text-white">
                    <MenuIcon className="h-8 w-8" />
                </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-primary-blue z-50 transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}>
          <div className="flex justify-between items-center h-20 px-4 sm:px-6">
              <div className="flex-shrink-0 cursor-pointer" onClick={() => handleNavClick(PageType.Home)}>
                <h1 className="text-3xl font-black text-white tracking-tight">
                    CryptoGuy<span className="text-primary-green">TECH</span>
                </h1>
              </div>
              <button onClick={() => setIsMenuOpen(false)} className="text-gray-300 hover:text-white">
                  <CloseIcon className="h-8 w-8" />
              </button>
          </div>
          <nav className="flex flex-col items-center justify-center space-y-8 mt-16">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => handleNavClick(item)}
                  className={`text-2xl font-bold transition-colors duration-200 ${
                    currentPage === item
                      ? 'text-primary-green'
                      : 'text-gray-300 hover:text-primary-green'
                  }`}
                >
                  {item}
                </button>
              ))}
                <button 
                    onClick={handleTutorClick}
                    className="flex items-center gap-3 text-2xl font-bold text-gray-300 hover:text-primary-green transition-colors duration-200"
                >
                    <GeminiIcon className="w-7 h-7" />
                    <span>AI Tutor</span>
                </button>
          </nav>
      </div>
    </>
  );
};