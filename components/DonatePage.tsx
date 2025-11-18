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

const CompactCopyButton: React.FC<{ textToCopy: string }> = ({ textToCopy }) => {
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
            className={`flex-shrink-0 ml-2 p-1.5 rounded-md transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-primary-green ${
                copied 
                ? 'bg-primary-green text-primary-blue' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
            title="Copy to clipboard"
        >
            {copied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
        </button>
    );
};

const DonationCard: React.FC<{
    title: string;
    description: string;
    children: React.ReactNode;
}> = ({ title, description, children }) => (
    <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-4 flex flex-col border border-gray-100 dark:border-gray-700 h-full">
        <div className="text-center mb-3">
             <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-none">{title}</h2>
             <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
        </div>
        <div className="w-full mt-auto space-y-2">
            {children}
        </div>
    </div>
);

const CryptoAddress: React.FC<{ network: string; address: string }> = ({ network, address }) => (
    <div className="bg-gray-50 dark:bg-gray-800/30 p-2 rounded border border-gray-100 dark:border-gray-700 text-left">
        <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">{network}</p>
        <div className="flex items-center justify-between">
            <p className="text-xs font-mono text-gray-800 dark:text-gray-200 break-all leading-tight select-all">
                {address}
            </p>
            <CompactCopyButton textToCopy={address} />
        </div>
    </div>
)

export const DonatePage: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-4 animate-fade-in max-w-4xl">
            <div className="text-center mb-4">
                <span className="inline-block py-0.5 px-2 rounded-full bg-primary-green/10 text-primary-green text-[10px] font-bold mb-1">
                    Support Us
                </span>
                <h1 className="text-2xl font-black text-primary-blue dark:text-white tracking-tight mb-1">
                    Power the Future
                </h1>
                <p className="max-w-xl mx-auto text-xs text-gray-600 dark:text-gray-300">
                    CryptoGuyTECH is free. Donations keep it running.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-stretch">
                <DonationCard
                    title="PayPal"
                    description="Quick & secure."
                >
                    <div className="bg-gray-50 dark:bg-gray-800/30 p-2 rounded border border-gray-100 dark:border-gray-700 text-left">
                         <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">PayPal Email</p>
                         <div className="flex items-center justify-between">
                            <p className="text-sm font-mono text-gray-800 dark:text-gray-200 select-all truncate">cryptoguytech@gmail.com</p>
                            <CompactCopyButton textToCopy="cryptoguytech@gmail.com" />
                        </div>
                    </div>
                    <a
                        href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=cryptoguytech@gmail.com&item_name=Donation+to+CryptoGuyTECH&currency_code=USD"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full py-2 px-4 bg-[#0070BA] hover:bg-[#003087] text-white font-bold rounded shadow-sm transition-all duration-300 text-center text-xs sm:text-sm mt-2"
                    >
                        Donate via PayPal
                    </a>
                </DonationCard>

                <DonationCard
                    title="Crypto"
                    description="SOL, ETH, BTC."
                >
                    <div className="space-y-2">
                        <CryptoAddress network="Solana" address="9BZCsMtqXdvwvesozEgms8BPvrSN2236ts7TGyocpVkB" />
                        <CryptoAddress network="Ethereum (ERC-20)" address="0xa9dd3Ec443A8F4CeDC5fBbeB03F8D7858C4F596D" />
                        <CryptoAddress network="Bitcoin" address="bc1qcvdfs0n56f45jd8s85e9s0jxpj36hywhlvpzws" />
                    </div>
                </DonationCard>
            </div>
        </div>
    );
};