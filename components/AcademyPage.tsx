import React from 'react';

interface AcademyPageProps {
    onSelectCourse: (courseTitle: string) => void;
}

const courses = [
    {
        title: "Blockchain Technology",
        description: "Understand the fundamental concepts of distributed ledger technology and how blockchains work.",
    },
    {
        title: "Virtual Assets & DeFi",
        description: "Explore the world of decentralized finance and learn about digital assets, lending, and yield farming.",
    },
    {
        title: "Bitcoin",
        description: "Dive deep into the original cryptocurrency, its history, technology, and economic principles.",
    },
    {
        title: "Ethereum & Web3",
        description: "Learn about smart contracts, dApps, and the evolution of the internet with Ethereum and Web3.",
    }
];

const CourseCard: React.FC<{ course: typeof courses[0]; onStartClick: () => void; disabled: boolean; }> = ({ course, onStartClick, disabled }) => (
    <div className={`group flex flex-col bg-white dark:bg-dark-card rounded-lg shadow-md ${!disabled && 'hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300'} border border-gray-200 dark:border-gray-700 overflow-hidden`}>
        <div className="p-6 flex-grow flex flex-col items-start">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{course.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm flex-grow">{course.description}</p>
        </div>
        <div className={`p-6 mt-auto ${disabled ? 'bg-gray-100 dark:bg-gray-800' : 'bg-gray-50 dark:bg-dark-bg'}`}>
            <button
                onClick={onStartClick}
                disabled={disabled}
                className="w-full px-4 py-2 bg-primary-green text-primary-blue font-bold rounded-lg shadow-md hover:bg-green-400 transform group-hover:-translate-y-1 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                aria-label={`Start learning ${course.title}`}
            >
                {disabled ? 'Coming Soon' : 'Start Learning'}
            </button>
        </div>
    </div>
);


export const AcademyPage: React.FC<AcademyPageProps> = ({ onSelectCourse }) => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
            <div className="text-center">
                <h1 className="text-3xl sm:text-4xl font-bold text-primary-blue dark:text-white">CryptoGuyTECH Academy</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
                    Start your journey into the world of blockchain. Select a course to begin your learning adventure.
                </p>
            </div>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {courses.map(course => (
                    <CourseCard 
                        key={course.title} 
                        course={course} 
                        onStartClick={() => onSelectCourse(course.title)}
                        disabled={
                            course.title !== 'Blockchain Technology' && 
                            course.title !== 'Bitcoin' && 
                            course.title !== 'Virtual Assets & DeFi' &&
                            course.title !== 'Ethereum & Web3'
                        }
                    />
                ))}
            </div>
        </div>
    );
};