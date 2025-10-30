
import React from 'react';

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, description }) => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 flex flex-col items-center justify-center text-center animate-fade-in">
      <h1 className="text-4xl sm:text-5xl font-bold text-primary-blue dark:text-white">{title}</h1>
      <p className="mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400">{description}</p>
      <div className="mt-8 text-6xl text-primary-green">
        🏗️
      </div>
       <p className="mt-4 text-sm text-gray-500 dark:text-gray-500">Feature Under Construction</p>
    </div>
  );
};
