import React, { useState } from 'react';
import { PaypalIcon, BitcoinIcon, EthereumIcon, SolanaIcon } from './icons/DonationIcons';

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

const CopyButton: React.FC<{ textToCopy: string }> = ({ textToCopy }) => {
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
            className={`flex items-center justify-center gap-2 w-full px-3 py-2 text-sm font-semibold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-dark-card ${
                copied 
                ? 'bg-primary-green text-primary-blue' 
                : 'bg-gray-200 dark:bg-primary-blue text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-opacity-80'
            }`}
        >
            {copied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
    );
};

const DonationCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    children: React.ReactNode;
}> = ({ icon, title, description, children }) => (
    <div className="bg-white dark:bg-dark-card rounded-lg shadow-lg p-6 flex flex-col items-center text-center border border-gray-200 dark:border-gray-700">
        <div className="w-16 h-16 mb-4">{icon}</div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{title}</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 flex-grow">{description}</p>
        <div className="w-full mt-auto">
            {children}
        </div>
    </div>
);

const CryptoAddress: React.FC<{ network: string; address: string }> = ({ network, address }) => (
    <div className="space-y-2">
        <p className="font-semibold text-gray-800 dark:text-white">{network}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 break-all font-mono">{address}</p>
        <CopyButton textToCopy={address} />
    </div>
)

export const DonatePage: React.FC = () => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
            <div className="text-center">
                <h1 className="text-3xl sm:text-4xl font-bold text-primary-blue dark:text-white">Support CryptoGuyTECH</h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-400">
                    Your generous contributions help us maintain the platform, create high-quality educational content, and grow our community. Every donation makes a difference!
                </p>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                <DonationCard
                    icon={<PaypalIcon />}
                    title="PayPal"
                    description="Make a secure one-time donation using your PayPal account or credit card."
                >
                    <a
                        href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=cryptoguytech@gmail.com&item_name=Donation+to+CryptoGuyTECH&currency_code=USD"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-block px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-500 transform hover:-translate-y-1 transition-all duration-300"
                    >
                        Donate via PayPal
                    </a>
                </DonationCard>

                <DonationCard
                    icon={<BitcoinIcon />}
                    title="Bitcoin"
                    description="Send BTC to our secure wallet. Please ensure you are on the correct Bitcoin network."
                >
                     <CryptoAddress network="Bitcoin (BTC)" address="bc1qcvdfs0n56f45jd8s85e9s0jxpj36hywhlvpzws" />
                </DonationCard>
                
                <DonationCard
                    icon={<div className="flex items-center justify-center gap-2 w-full h-full"><EthereumIcon className="w-12 h-12" /><SolanaIcon className="w-11 h-11" /></div>}
                    title="ETH & SOL"
                    description="We also accept Ethereum, Solana, and any tokens on their respective networks."
                >
                    <div className="space-y-4">
                        <CryptoAddress network="Ethereum (ERC20)" address="0xa9dd3Ec443A8F4CeDC5fBbeB03F8D7858C4F596D" />
                        <CryptoAddress network="Solana (SOL)" address="9BZCsMtqXdvwvesozEgms8BPvrSN2236ts7TGyocpVkB" />
                    </div>
                </DonationCard>
            </div>
        </div>
    );
};
