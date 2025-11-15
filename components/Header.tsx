import React, { useState } from 'react';
import type { Page } from '../types';
import { PageType } from '../types';

interface HeaderProps {
  currentPage: Page;
  navigate: (page: Page) => void;
}

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


export const Header: React.FC<HeaderProps> = ({ currentPage, navigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navItems: Page[] = [PageType.Home, PageType.Tracker, PageType.Academy, PageType.Community, PageType.Donate];

  const handleNavClick = (page: Page) => {
    navigate(page);
    setIsMenuOpen(false);
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-primary-blue/80 backdrop-blur-md shadow-md shadow-primary-green/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left Side: Logo */}
            <div className="flex-1 flex justify-start">
                <div className="flex-shrink-0 cursor-pointer" onClick={() => handleNavClick(PageType.Home)}>
                  <h1 className="text-3xl font-black text-white tracking-tight">
                      CryptoGuy<span className="text-primary-green">TECH</span>
                  </h1>
                </div>
            </div>

            {/* Center: Desktop Nav */}
            <div className="hidden md:flex justify-center">
                <nav className="flex items-center space-x-6 lg:space-x-8">
                  {navItems.map((item) => {
                    if (item === PageType.Donate) {
                        return (
                             <button
                                key={item}
                                onClick={() => handleNavClick(item)}
                                className={`px-5 py-2 text-base font-bold rounded-lg transition-all duration-300 transform shadow-md hover:shadow-lg hover:-translate-y-0.5 ${currentPage === item ? 'bg-yellow-400 text-primary-blue ring-2 ring-offset-2 ring-offset-primary-blue ring-yellow-400' : 'bg-yellow-500 text-primary-blue hover:bg-yellow-400'}`}
                            >
                                {item}
                            </button>
                        )
                    }
                    return (
                        <button
                          key={item}
                          onClick={() => handleNavClick(item)}
                          className={`text-base font-semibold transition-colors duration-200 ${
                            currentPage === item
                              ? 'text-primary-green'
                              : 'text-gray-300 hover:text-primary-green'
                          }`}
                        >
                          {item}
                        </button>
                      )
                  })}
                </nav>
            </div>

            {/* Right Side: Spacer for desktop, Menu button for mobile */}
            <div className="flex-1 flex justify-end">
                <div className="md:hidden">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-300 hover:text-white">
                        <MenuIcon className="h-8 w-8" />
                    </button>
                </div>
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
              {navItems.map((item) => {
                 if (item === PageType.Donate) {
                    return (
                         <button
                            key={item}
                            onClick={() => handleNavClick(item)}
                            className="w-48 text-center px-8 py-4 text-2xl font-bold rounded-lg transition-all duration-300 bg-yellow-500 text-primary-blue hover:bg-yellow-400 shadow-lg"
                        >
                            {item}
                        </button>
                    )
                }
                return (
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
                )
              })}
          </nav>
      </div>
    </>
  );
};