import React from 'react';
import type { Page } from '../types';
import { PageType } from '../types';
import { PriceTicker } from './PriceTicker';


interface AboutPageProps {
    navigate: (page: Page) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate }) => {
  return (
    <div className="relative flex flex-col h-full">
      <PriceTicker />
      
      <div className="relative overflow-hidden flex-grow flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-50 dark:bg-gradient-to-br dark:from-primary-blue dark:via-dark-bg dark:to-primary-blue dark:bg-[200%_200%] dark:animate-background-pan -z-10">
            <div className="absolute inset-0 opacity-5 dark:opacity-10 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <div className="animate-fade-in">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-primary-blue dark:text-white">
                    CryptoGuyTECH
                </h1>
                <p className="mt-4 text-lg md:text-xl lg:text-2xl text-primary-green">
                    Learn, Track & Grow in the Crypto World
                </p>
                <p className="mt-6 max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
                    A professional platform merging crypto education, live coin tracking, and AI tutoring focused on the blockchain ecosystem.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button 
                        onClick={() => navigate(PageType.Academy)}
                        className="w-full sm:w-auto px-8 py-4 bg-primary-green text-primary-blue font-bold rounded-lg shadow-lg hover:bg-green-400 transform hover:-translate-y-1 transition-all duration-300"
                    >
                        Explore Academy
                    </button>
                    <a 
                        href="https://chat.whatsapp.com/ENRVqPrrY4yHxSEW9xH6jn"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto inline-block text-center px-8 py-4 border-2 border-primary-green text-primary-green font-bold rounded-lg shadow-lg hover:bg-primary-green hover:text-primary-blue transform hover:-translate-y-1 transition-all duration-300"
                    >
                        Join Community
                    </a>
                </div>
            </div>
          </div>
      </div>
    </div>
  );
};