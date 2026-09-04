import React from 'react';
import { TelegramIcon } from './icons/SocialIcons';

export const TelegramButton: React.FC = () => {
    return (
        <a
            href="https://t.me/+WEgyTDQYI4FmNzQ0"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-[5.5rem] right-6 z-40 w-16 h-16 bg-[#24A1DE] hover:bg-[#1d8fc6] rounded-full shadow-lg text-white flex items-center justify-center transform hover:scale-110 transition-all duration-200"
            aria-label="Join our Telegram channel"
        >
            <TelegramIcon className="w-8 h-8" />
        </a>
    );
};
