import React, { useState } from 'react';

interface WelcomeModalProps {
  onClose: () => void;
}

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={handleCopy}
      className={`ml-2 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded transition-colors duration-200 border ${
        copied 
        ? 'bg-primary-green text-primary-blue border-primary-green' 
        : 'bg-white dark:bg-dark-card text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:border-primary-green hover:text-primary-green'
      }`}
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
};

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative w-full max-w-5xl bg-white dark:bg-dark-card rounded-lg shadow-2xl flex flex-col max-h-[95vh] border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in">
        
        {/* Header */}
        <div className="bg-primary-blue px-4 py-3 flex justify-between items-center shrink-0">
          <div>
              <h2 className="text-xl font-black text-white tracking-tight">
                CryptoGuy<span className="text-primary-green">TECH</span>
              </h2>
              <p className="text-gray-400 text-xs">Support the platform.</p>
          </div>
          <button 
            onClick={onClose}
            className="text-xs text-gray-300 hover:text-white font-semibold px-2 py-1 border border-gray-600 rounded hover:border-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>

        {/* Content Body */}
        <div className="p-3 sm:p-4 overflow-y-auto custom-scrollbar">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            
            {/* M-Pesa */}
            <div className="bg-gray-50 dark:bg-gray-800/40 rounded border border-gray-200 dark:border-gray-700 p-3 flex flex-col">
              <div className="mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">
                  <h3 className="font-bold text-gray-900 dark:text-white">M-Pesa</h3>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">Safaricom Mobile Money</p>
              </div>
              <div className="flex-grow flex flex-col justify-center">
                 <div className="bg-white dark:bg-gray-900 p-2 rounded border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-gray-500 uppercase">Number</span>
                        <CopyButton text="0701476026" />
                    </div>
                    <p className="text-lg font-mono font-bold text-gray-800 dark:text-gray-200 mt-1">0701476026</p>
                 </div>
              </div>
            </div>

            {/* PayPal */}
            <div className="bg-gray-50 dark:bg-gray-800/40 rounded border border-gray-200 dark:border-gray-700 p-3 flex flex-col">
               <div className="mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">
                  <h3 className="font-bold text-gray-900 dark:text-white">PayPal</h3>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">Secure Transfer</p>
              </div>
              <div className="space-y-2 flex-grow flex flex-col justify-center">
                 <div className="bg-white dark:bg-gray-900 p-2 rounded border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-gray-500 uppercase">Email</span>
                        <CopyButton text="cryptoguytech@gmail.com" />
                    </div>
                    <p className="text-xs font-mono text-gray-800 dark:text-gray-200 mt-1 break-all">cryptoguytech@gmail.com</p>
                 </div>
                 <a
                    href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=cryptoguytech@gmail.com&item_name=Donation+to+CryptoGuyTECH&currency_code=USD"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-1.5 bg-[#0070BA] hover:bg-[#003087] text-white text-center text-xs font-bold rounded transition-colors shadow-sm"
                  >
                    Pay via PayPal Link
                  </a>
              </div>
            </div>

            {/* Crypto */}
            <div className="bg-gray-50 dark:bg-gray-800/40 rounded border border-gray-200 dark:border-gray-700 p-3 flex flex-col">
               <div className="mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">
                  <h3 className="font-bold text-gray-900 dark:text-white">Crypto</h3>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">BTC, ETH, SOL</p>
              </div>
              <div className="space-y-2">
                 {/* Bitcoin */}
                 <div className="bg-white dark:bg-gray-900 p-1.5 rounded border border-gray-200 dark:border-gray-700">
                   <div className="flex justify-between items-center">
                        <span className="text-[9px] font-bold text-gray-500 uppercase">Bitcoin</span>
                        <CopyButton text="bc1qcvdfs0n56f45jd8s85e9s0jxpj36hywhlvpzws" />
                   </div>
                   <p className="text-[9px] font-mono text-gray-800 dark:text-gray-300 break-all leading-tight mt-0.5">bc1qcvdfs0n56f45jd8s85e9s0jxpj36hywhlvpzws</p>
                 </div>

                 {/* Ethereum */}
                 <div className="bg-white dark:bg-gray-900 p-1.5 rounded border border-gray-200 dark:border-gray-700">
                   <div className="flex justify-between items-center">
                        <span className="text-[9px] font-bold text-gray-500 uppercase">ETH / ERC20</span>
                        <CopyButton text="0xa9dd3Ec443A8F4CeDC5fBbeB03F8D7858C4F596D" />
                   </div>
                   <p className="text-[9px] font-mono text-gray-800 dark:text-gray-300 break-all leading-tight mt-0.5">0xa9dd3Ec443A8F4CeDC5fBbeB03F8D7858C4F596D</p>
                 </div>

                 {/* Solana */}
                  <div className="bg-white dark:bg-gray-900 p-1.5 rounded border border-gray-200 dark:border-gray-700">
                   <div className="flex justify-between items-center">
                        <span className="text-[9px] font-bold text-gray-500 uppercase">Solana</span>
                        <CopyButton text="9BZCsMtqXdvwvesozEgms8BPvrSN2236ts7TGyocpVkB" />
                   </div>
                   <p className="text-[9px] font-mono text-gray-800 dark:text-gray-300 break-all leading-tight mt-0.5">9BZCsMtqXdvwvesozEgms8BPvrSN2236ts7TGyocpVkB</p>
                 </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-50 dark:bg-dark-bg border-t border-gray-200 dark:border-gray-700 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-primary-green text-primary-blue text-sm font-black rounded shadow hover:bg-green-400 transition-all duration-200 uppercase tracking-wide"
          >
            Enter App
          </button>
        </div>

      </div>
    </div>
  );
};
