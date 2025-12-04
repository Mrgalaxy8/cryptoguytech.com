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

const HolidayBanner: React.FC = () => (
  <div className="w-full mb-4 relative overflow-hidden rounded-lg border border-gray-100 dark:border-gray-700">
    <style>
      {`
        @keyframes twinkle {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; filter: drop-shadow(0 0 2px gold); }
        }
        .light-bulb { animation: twinkle 3s infinite ease-in-out; }
        .light-bulb:nth-child(odd) { animation-delay: 0.5s; }
        .light-bulb:nth-child(even) { animation-delay: 1.5s; }
      `}
    </style>
    <svg viewBox="0 0 600 120" className="w-full h-auto bg-gradient-to-b from-blue-50 to-white dark:from-slate-800 dark:to-slate-900">
      <defs>
        <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#D42426" />
          <stop offset="50%" stopColor="#F2C94C" />
          <stop offset="100%" stopColor="#D42426" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Background Frosty Snowflakes */}
      <g fill="none" stroke="#A0AEC0" strokeWidth="1" opacity="0.2">
        <path d="M50,20 L60,30 M60,20 L50,30 M55,18 L55,32 M48,25 L62,25" transform="scale(0.8)" />
        <path d="M500,80 L510,90 M510,80 L500,90 M505,78 L505,92 M498,85 L512,85" />
        <path d="M100,90 L110,100 M110,90 L100,100 M105,88 L105,102 M98,95 L112,95" transform="scale(0.6)" />
        <path d="M450,30 L460,40 M460,30 L450,40 M455,28 L455,42 M448,35 L462,35" transform="scale(0.7)" />
      </g>

      {/* String of Lights */}
      <path d="M0,10 Q150,40 300,10 T600,10" fill="none" stroke="#2D3748" strokeWidth="1.5" opacity="0.6" />
      
      {/* Lights */}
      <g className="light-bulb">
        <circle cx="50" cy="24" r="4" fill="#F2C94C" />
        <path d="M48,18 L52,18 L51,21 L49,21 Z" fill="#4A5568" />
      </g>
      <g className="light-bulb">
        <circle cx="150" cy="24" r="4" fill="#D42426" />
        <path d="M148,18 L152,18 L151,21 L149,21 Z" fill="#4A5568" />
      </g>
      <g className="light-bulb">
        <circle cx="250" cy="18" r="4" fill="#00C853" />
        <path d="M248,12 L252,12 L251,15 L249,15 Z" fill="#4A5568" />
      </g>
      <g className="light-bulb">
        <circle cx="350" cy="18" r="4" fill="#D42426" />
        <path d="M348,12 L352,12 L351,15 L349,15 Z" fill="#4A5568" />
      </g>
      <g className="light-bulb">
        <circle cx="450" cy="24" r="4" fill="#F2C94C" />
        <path d="M448,18 L452,18 L451,21 L449,21 Z" fill="#4A5568" />
      </g>
      <g className="light-bulb">
        <circle cx="550" cy="24" r="4" fill="#00C853" />
        <path d="M548,18 L552,18 L551,21 L549,21 Z" fill="#4A5568" />
      </g>

      {/* Main Text */}
      <text x="300" y="75" textAnchor="middle" fontFamily="serif" fontSize="36" fontWeight="bold" fill="url(#textGradient)" filter="url(#glow)">
        Happy Holidays
      </text>

      {/* Decor Left (Holly) */}
      <g transform="translate(40, 70) rotate(-15)">
        <path d="M0,0 C-10,10 -10,25 0,35 C10,25 10,10 0,0" fill="#2E5B33" />
        <path d="M0,0 C-10,10 -10,25 0,35 C10,25 10,10 0,0" fill="#2E5B33" transform="rotate(45)" />
        <circle cx="5" cy="15" r="3" fill="#D42426" />
        <circle cx="10" cy="12" r="3" fill="#D42426" />
        <circle cx="1" cy="18" r="3" fill="#D42426" />
      </g>

      {/* Decor Right (Bell) */}
      <g transform="translate(540, 70) rotate(15)">
         <path d="M0,0 Q-5,15 -12,18 L12,18 Q5,15 0,0" fill="#F2C94C" />
         <circle cx="0" cy="18" r="2.5" fill="#D4AF37" />
         <path d="M0,0 C-10,-5 -10,-15 0,-20 C10,-15 10,-5 0,0" fill="#2E5B33" transform="translate(0,0) scale(0.6)"/>
         <circle cx="0" cy="-5" r="2" fill="#D42426" />
      </g>
    </svg>
  </div>
);

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
          
          <HolidayBanner />

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
