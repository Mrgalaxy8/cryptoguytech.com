import React from 'react';

export const PaypalIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg fill="#003087" className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.064 20.865h3.018c.23 0 .432-.15.504-.363l2.484-8.28H9.84a.5.5 0 01-.497-.438L8.24 3.363a.5.5 0 01.497-.562h5.58c.24 0 .445.158.5.38l.962 3.204c.05.166.21.28.38.28h2.643a.5.5 0 00.495-.563l-.33-1.125a.5.5 0 00-.496-.437h-2.12a2.502 2.502 0 00-2.48-2.224h-6.21a2.5 2.5 0 00-2.48 2.224H2.497a.5.5 0 00-.495.563l2.67 9.025a.5.5 0 00.496.438h1.896Z"/>
        <path fill="#009cde" d="M12.45 12.222H9.432c-.23 0-.432.15-.504.363l-1.008 3.36H4.896a.5.5 0 00-.496.562l.96 3.237a.5.5 0 00.496.438h3.018c.23 0 .432-.15.504-.363l2.484-8.28a.5.5 0 00-.496-.637h-.912Z"/>
        <path fill="#002f86" d="M13.432 12.584c-.072-.213-.274-.362-.504-.362H9.912c-.24 0-.445-.158-.5-.38l-.168-.56H7.32a.5.5 0 01-.496-.563L9.54 2.8a.5.5 0 01.497-.437h3.018c.23 0 .432.15.504.363L15.42 8.58a.5.5 0 01-.496.637h-2.736l1.242 4.14a.5.5 0 01-.496.637h-.5Z"/>
    </svg>
);

export const BitcoinIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg fill="currentColor" className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" color="#F7931A">
        <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16z"/>
        <path d="M14.05 15.618c.456-.275.742-.77.742-1.328 0-1.166-.993-1.89-2.227-2.126v-2.31c0-.203-.165-.368-.368-.368H11.53c-.203 0-.368.165-.368.368v2.25c-1.18.26-1.92.81-1.92 1.94 0 .72.48 1.34 1.25 1.63.19.07.3.26.3.46v.83c0 .28-.23.51-.51.51h-.52c-.28 0-.51-.23-.51-.51v-.09c0-.65-.48-1.2-1.12-1.32-.2-.04-.38.12-.38.32v.65c0 .2.17.37.37.37h.1a2.82 2.82 0 002.82 2.82h.4c1.6 0 2.82-1.22 2.82-2.82 0-.8-.32-1.5-.83-2.03zm-2.09-.76c1.17.21 1.76.67 1.76 1.39 0 .61-.4 1.05-1.13 1.05h-.23c-.2 0-.37-.17-.37-.37v-1.7c0-.2.17-.37.37-.37h.23v0zm.04-3.14c.73 0 1.25.4 1.25 1.01 0 .6-.52 1-1.25 1h-.23c-.2 0-.37-.17-.37-.37v-1.28c0-.2.17-.37.37-.37h.23v0z"/>
    </svg>
);

export const EthereumIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path fill="#8A92B2" d="M12 12.722L17.95 9.407L12 2L6.05 9.407L12 12.722Z"/>
        <path fill="#62688F" d="M12 12.722L6.05 9.407L12 16.593V12.722Z"/>
        <path fill="#454A75" d="M12 12.722L17.95 9.407L12 16.593V12.722Z"/>
        <path fill="#8A92B2" d="M12 17.593L17.95 13.722L12 22V17.593Z"/>
        <path fill="#62688F" d="M12 17.593L6.05 13.722L12 22V17.593Z"/>
    </svg>
);

export const SolanaIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <linearGradient id="solana-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: '#00FFA3'}} />
            <stop offset="100%" style={{stopColor: '#DC1FFF'}} />
        </linearGradient>
        <path d="M4.65 8.65999L1.5 10.33V13.68L4.65 15.35V8.65999Z" fill="url(#solana-gradient)"></path>
        <path d="M19.35 15.35L22.5 13.68V10.33L19.35 8.65999V15.35Z" fill="url(#solana-gradient)"></path>
        <path d="M9.3 19.35L6.15 17.67V11.5L9.3 13.18V19.35Z" fill="url(#solana-gradient)"></path>
        <path d="M14.7 4.65001L17.85 6.33001V12.5L14.7 10.82V4.65001Z" fill="url(#solana-gradient)"></path>
        <path d="M9.3 11.5L6.15 13.18V14.51L11.52 17.61L17.85 14.16V12.83L14.7 11.16L9.3 14.16V11.5Z" fill="url(#solana-gradient)" opacity="0.5"></path>
        <path d="M14.7 12.5L17.85 10.82V9.49001L12.48 6.39001L6.15 9.84001V11.17L9.3 12.84L14.7 9.84001V12.5Z" fill="url(#solana-gradient)"></path>
    </svg>
);
