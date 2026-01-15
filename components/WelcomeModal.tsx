import React, { useState } from 'react';

interface WelcomeModalProps {
  onClose: () => void;
}

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
        } else {
             // Fallback for older browsers or non-secure context
             const textArea = document.createElement("textarea");
             textArea.value = text;
             textArea.style.position = "fixed"; // Avoid scrolling to bottom
             document.body.appendChild(textArea);
             textArea.focus();
             textArea.select();
             try {
                document.execCommand("copy");
             } catch (err) {
                 console.error("Fallback: Oops, unable to copy", err);
             }
             document.body.removeChild(textArea);
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    } catch (err) {
        console.error('Failed to copy!', err);
    }
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative w-full max-w-4xl bg-white dark:bg-dark-card rounded-lg shadow-2xl flex flex-col max-h-[95vh] border border-gray-200 dark:border-gray-700 animate-fade-in">
        
        {/* Header */}
        <div className="bg-primary-blue px-4 py-2 flex justify-between items-center shrink-0 rounded-t-lg">
          <div>
              <h2 className="text-lg font-black text-white tracking-tight">
                CryptoGuy<span className="text-primary-green">TECH</span>
              </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-xs text-gray-300 hover:text-white font-semibold px-2 py-1 border border-gray-600 rounded hover:border-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>

        {/* Content Body - Optimized for density */}
        <div className="p-3 overflow-y-auto custom-scrollbar">
          <p className="text-center text-xs text-gray-500 dark:text-gray-400 mb-3">
             Support our platform. Donations keep us running.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            
            {/* M-Pesa */}
            <div className="bg-gray-50 dark:bg-gray-800/40 rounded border border-gray-200 dark:border-gray-700 p-2">
              <div className="flex justify-between items-center mb-1">
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white">M-Pesa</h3>
                  <span className="text-[10px] text-gray-500">Safaricom</span>
              </div>
              <div className="bg-white dark:bg-gray-900 p-2 rounded border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                    <p className="text-base font-mono font-bold text-gray-800 dark:text-gray-200">0701476026</p>
                    <CopyButton text="0701476026" />
                </div>
              </div>
            </div>

            {/* PayPal */}
            <div className="bg-gray-50 dark:bg-gray-800/40 rounded border border-gray-200 dark:border-gray-700 p-2">
              <div className="flex justify-between items-center mb-1">
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white">PayPal</h3>
                  <span className="text-[10px] text-gray-500">Secure</span>
              </div>
              <div className="bg-white dark:bg-gray-900 p-2 rounded border border-gray-200 dark:border-gray-700 mb-2">
                 <div className="flex justify-between items-center">
                    <p className="text-[10px] font-mono text-gray-800 dark:text-gray-200 break-all">cryptoguytech@gmail.com</p>
                    <CopyButton text="cryptoguytech@gmail.com" />
                </div>
              </div>
              <a
                href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=cryptoguytech@gmail.com&item_name=Donation+to+CryptoGuyTECH&currency_code=USD"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-1 bg-[#0070BA] hover:bg-[#003087] text-white text-center text-xs font-bold rounded"
              >
                Donate via PayPal
              </a>
            </div>

            {/* Crypto */}
            <div className="bg-gray-50 dark:bg-gray-800/40 rounded border border-gray-200 dark:border-gray-700 p-2">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-1">Crypto</h3>
              <div className="space-y-1.5">
                 <div className="bg-white dark:bg-gray-900 p-1 rounded border border-gray-200 dark:border-gray-700 flex justify-between items-center">
                   <div className="overflow-hidden mr-1">
                       <span className="text-[9px] font-bold text-gray-500 block">BTC</span>
                       <p className="text-[9px] font-mono text-gray-800 dark:text-gray-300 truncate">bc1qcvdfs0n56f45jd8s85e9s0jxpj36hywhlvpzws</p>
                   </div>
                   <CopyButton text="bc1qcvdfs0n56f45jd8s85e9s0jxpj36hywhlvpzws" />
                 </div>

                 <div className="bg-white dark:bg-gray-900 p-1 rounded border border-gray-200 dark:border-gray-700 flex justify-between items-center">
                   <div className="overflow-hidden mr-1">
                       <span className="text-[9px] font-bold text-gray-500 block">ETH</span>
                       <p className="text-[9px] font-mono text-gray-800 dark:text-gray-300 truncate">0xa9dd3Ec443A8F4CeDC5fBbeB03F8D7858C4F596D</p>
                   </div>
                   <CopyButton text="0xa9dd3Ec443A8F4CeDC5fBbeB03F8D7858C4F596D" />
                 </div>

                  <div className="bg-white dark:bg-gray-900 p-1 rounded border border-gray-200 dark:border-gray-700 flex justify-between items-center">
                   <div className="overflow-hidden mr-1">
                       <span className="text-[9px] font-bold text-gray-500 block">SOL</span>
                       <p className="text-[9px] font-mono text-gray-800 dark:text-gray-300 truncate">9BZCsMtqXdvwvesozEgms8BPvrSN2236ts7TGyocpVkB</p>
                   </div>
                   <CopyButton text="9BZCsMtqXdvwvesozEgms8BPvrSN2236ts7TGyocpVkB" />
                 </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-2 bg-gray-50 dark:bg-dark-bg border-t border-gray-200 dark:border-gray-700 shrink-0 rounded-b-lg">
          <button
            onClick={onClose}
            className="w-full py-2 bg-primary-green text-primary-blue text-sm font-black rounded shadow hover:bg-green-400 transition-all duration-200 uppercase tracking-wide"
          >
            Enter App
          </button>
        </div>

      </div>
    </div>
  );
};