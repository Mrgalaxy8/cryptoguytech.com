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

const CopyButton: React.FC<{ textToCopy: string; label?: string }> = ({ textToCopy, label }) => {
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
            className={`flex items-center justify-center gap-2 w-full px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-dark-card ${
                copied 
                ? 'bg-primary-green text-primary-blue' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
        >
            {copied ? <CheckIcon className="w-3.5 h-3.5" /> : <CopyIcon className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : (label || 'Copy')}</span>
        </button>
    );
};

const DonationCard: React.FC<{
    title: string;
    description: string;
    children: React.ReactNode;
}> = ({ title, description, children }) => (
    <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6 flex flex-col items-center text-center border border-gray-100 dark:border-gray-700 transition-transform hover:-translate-y-1 duration-300 h-full">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 flex-grow leading-relaxed">{description}</p>
        <div className="w-full mt-auto">
            {children}
        </div>
    </div>
);

const CryptoAddress: React.FC<{ network: string; address: string }> = ({ network, address }) => (
    <div className="space-y-1 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
        <p className="font-bold text-xs text-gray-700 dark:text-gray-300 flex items-center justify-between">
            {network}
        </p>
        <div className="flex flex-col gap-2">
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 break-all font-mono bg-white dark:bg-dark-bg p-2 rounded border border-gray-200 dark:border-gray-700 select-all">
                {address}
            </p>
            <CopyButton textToCopy={address} label="Copy Address" />
        </div>
    </div>
)

export const DonatePage: React.FC = () => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            <div className="text-center mb-8">
                <span className="inline-block py-1 px-3 rounded-full bg-primary-green/10 text-primary-green text-xs font-bold mb-3">
                    Support Our Mission
                </span>
                <h1 className="text-3xl sm:text-4xl font-black text-primary-blue dark:text-white tracking-tight mb-3">
                    Power the Future of Crypto Education
                </h1>
                <p className="max-w-2xl mx-auto text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                    CryptoGuyTECH is free for everyone. Your donations directly support server costs and content creation.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start max-w-5xl mx-auto">
                <DonationCard
                    title="PayPal"
                    description="Quick and secure donation using your PayPal account or credit card."
                >
                    <div className="space-y-3">
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider font-semibold">PayPal Email</p>
                            <p className="text-sm font-mono text-gray-800 dark:text-gray-200 mb-2 select-all">cryptoguytech@gmail.com</p>
                            <CopyButton textToCopy="cryptoguytech@gmail.com" label="Copy Email" />
                        </div>
                        <a
                            href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=cryptoguytech@gmail.com&item_name=Donation+to+CryptoGuyTECH&currency_code=USD"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full py-2.5 px-4 bg-[#0070BA] hover:bg-[#003087] text-white font-bold rounded-lg shadow-md transition-all duration-300 text-center text-sm"
                        >
                            Donate via PayPal
                        </a>
                    </div>
                </DonationCard>

                <DonationCard
                    title="Cryptocurrency"
                    description="Support us directly via blockchain. We accept SOL, ETH, and BTC."
                >
                    <div className="space-y-3">
                        <CryptoAddress network="Solana (SOL)" address="9BZCsMtqXdvwvesozEgms8BPvrSN2236ts7TGyocpVkB" />
                        <CryptoAddress network="Ethereum (ERC-20)" address="0xa9dd3Ec443A8F4CeDC5fBbeB03F8D7858C4F596D" />
                        <CryptoAddress network="Bitcoin (BTC)" address="bc1qcvdfs0n56f45jd8s85e9s0jxpj36hywhlvpzws" />
                    </div>
                </DonationCard>
            </div>
        </div>
    );
};
