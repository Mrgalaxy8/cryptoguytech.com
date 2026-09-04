import React from 'react';
import { WhatsAppIcon } from './icons/SocialIcons';

export const WhatsAppButton: React.FC = () => {
    return (
        <a
            href="https://whatsapp.com/channel/0029VbCfQwq6xCSPYAxV591N"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-[5.5rem] right-6 z-40 w-16 h-16 bg-green-500 rounded-full shadow-lg text-white flex items-center justify-center transform hover:scale-110 transition-transform duration-200"
            aria-label="Follow our WhatsApp channel"
        >
            <WhatsAppIcon className="w-8 h-8" />
        </a>
    );
};