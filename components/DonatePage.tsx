import React, { useState } from 'react';

const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 4.625v2.625a2.625 2.625 0 01-2.625 2.625H6.75a2.625 2.625 0 01-2.625-2.625V7.875a2.625 2.625 0 012.625-2.625h2.625m7.5 4.625h-7.5" />
    </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
);


const CopyButton: React.FC<{ textToCopy: string, children: React.ReactNode }> = ({ textToCopy, children }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-dark-bg focus:ring-primary-green bg-primary-blue text-white hover:bg-opacity-80"
        >
            {copied ? <CheckIcon className="w-4 h-4 text-primary-green" /> : <CopyIcon className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : children}</span>
        </button>
    );
};

const CryptoOption: React.FC<{ name: string; network: string; address: string; }> = ({ name, network, address }) => (
    <div className="flex flex-col sm:flex-row items-center gap-4 py-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
        <div className="flex-grow text-center sm:text-left">
            <p className="font-bold text-gray-800 dark:text-white">{name} <span className="text-xs font-normal text-gray-500 dark:text-gray-400">({network})</span></p>
            <p className="text-xs text-gray-600 dark:text-gray-400 break-all">{address}</p>
        </div>
        <div className="w-full sm:w-auto flex-shrink-0">
            <CopyButton textToCopy={address}>Copy Address</CopyButton>
        </div>
    </div>
);


export const DonatePage: React.FC = () => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
            <div className="text-center">
                <h1 className="text-3xl sm:text-4xl font-bold text-primary-blue dark:text-white">Support CryptoGuyTECH</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
                    Your generous contributions help us maintain the platform, create high-quality educational content, and grow our community. Every donation makes a difference!
                </p>
            </div>

            <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* PayPal Card */}
                <div className="bg-white dark:bg-dark-card rounded-lg shadow-lg p-6 sm:p-8 flex flex-col items-center text-center h-full">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Donate with PayPal</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 flex-grow">Click the button below to make a secure donation via PayPal. Your support is greatly appreciated!</p>
                    <a
                        href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=cryptoguytech@gmail.com&item_name=Donation+to+CryptoGuyTECH&currency_code=USD"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto w-full max-w-sm inline-block px-8 py-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-500 transform hover:-translate-y-1 transition-all duration-300"
                    >
                        Donate Now
                    </a>
                </div>

                {/* Crypto Card */}
                <div className="bg-white dark:bg-dark-card rounded-lg shadow-lg p-6 sm:p-8">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1 text-center">Donate with Crypto</h2>
                     <p className="text-gray-500 dark:text-gray-400 mb-6 text-center text-sm">Send your contribution to one of the addresses below. Please double-check the network.</p>

                    <div className="space-y-2">
                        <CryptoOption 
                            name="Bitcoin"
                            network="BTC"
                            address="bc1qcvdfs0n56f45jd8s85e9s0jxpj36hywhlvpzws"
                        />
                        <CryptoOption 
                            name="Ethereum"
                            network="ERC20"
                            address="0xa9dd3Ec443A8F4CeDC5fBbeB03F8D7858C4F596D"
                        />
                         <CryptoOption 
                            name="Solana"
                            network="SOL"
                            address="9BZCsMtqXdvwvesozEgms8BPvrSN2236ts7TGyocpVkB"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};