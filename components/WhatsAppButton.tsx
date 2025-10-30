import React from 'react';
import { WhatsAppIcon } from './icons/SocialIcons';

export const WhatsAppButton: React.FC = () => {
    return (
        <a
            href="https://wa.me/254701476026"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-[5.5rem] right-6 z-40 w-16 h-16 bg-green-500 rounded-full shadow-lg text-white flex items-center justify-center transform hover:scale-110 transition-transform duration-200"
            aria-label="Contact us on WhatsApp"
        >
            <WhatsAppIcon className="w-8 h-8" />
        </a>
    );
};