import React from 'react';
import type { Page } from '../types';
import { PageType } from '../types';
import { PriceTicker } from './PriceTicker';


interface HomePageProps {
    navigate: (page: Page) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  return (
    <div className="relative">
      <PriceTicker />
      
      <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-blue via-dark-bg to-primary-blue bg-[200%_200%] animate-background-pan -z-10">
            <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-48 text-center">
            <div className="animate-fade-in">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white">
                    CryptoGuyTECH
                </h1>
                <p className="mt-4 text-lg md:text-xl lg:text-2xl text-primary-green">
                    Learn, Track & Grow in the Crypto World
                </p>
                <p className="mt-6 max-w-2xl mx-auto text-gray-300">
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