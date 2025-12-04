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
  <div className="w-full mb-4 relative overflow-hidden rounded-lg border border-gray-100 dark:border-gray-700 shadow-inner">
    <style>
      {`
        @keyframes snowfall {
          0% { transform: translateY(-10px); opacity: 0; }
          20% { opacity: 0.8; }
          100% { transform: translateY(120px); opacity: 0; }
        }
        @keyframes sway {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        @keyframes twinkle-gold {
          0%, 100% { opacity: 0.4; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .snow { animation: snowfall 8s linear infinite; }
        .ornament { transform-origin: top center; animation: sway 6s ease-in-out infinite; }
        .ornament:nth-child(odd) { animation-duration: 7s; }
        .star { animation: twinkle-gold 3s ease-in-out infinite; }
        .star:nth-child(even) { animation-delay: 1.5s; }
      `}
    </style>
    <svg viewBox="0 0 600 150" className="w-full h-auto bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#334155]">
        <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDE68A" />
                <stop offset="50%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#92400E" />
            </linearGradient>
            <linearGradient id="redBauble" x1="30%" y1="30%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#991b1b" />
            </linearGradient>
             <linearGradient id="greenBauble" x1="30%" y1="30%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#14532d" />
            </linearGradient>
            <radialGradient id="glowRadial" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="white" stopOpacity="0.8" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
            <filter id="textShadow">
                <feDropShadow dx="1" dy="2" stdDeviation="1" floodColor="#000" floodOpacity="0.5" />
            </filter>
        </defs>

        {/* Snowy Background */}
        <rect width="600" height="150" fill="none" />
        <circle cx="50" cy="20" r="1.5" fill="white" className="snow" style={{animationDelay: '0s'}} />
        <circle cx="150" cy="10" r="2" fill="white" className="snow" style={{animationDelay: '2s'}} />
        <circle cx="250" cy="30" r="1" fill="white" className="snow" style={{animationDelay: '4s'}} />
        <circle cx="350" cy="15" r="1.5" fill="white" className="snow" style={{animationDelay: '1s'}} />
        <circle cx="450" cy="25" r="2" fill="white" className="snow" style={{animationDelay: '3s'}} />
        <circle cx="550" cy="5" r="1.5" fill="white" className="snow" style={{animationDelay: '5s'}} />
        <circle cx="100" cy="50" r="1" fill="white" className="snow" style={{animationDelay: '2.5s'}} />
        <circle cx="300" cy="60" r="1.5" fill="white" className="snow" style={{animationDelay: '0.5s'}} />
        <circle cx="500" cy="40" r="2" fill="white" className="snow" style={{animationDelay: '1.5s'}} />
        <circle cx="200" cy="80" r="1.5" fill="white" className="snow" style={{animationDelay: '3.5s'}} />
        <circle cx="400" cy="90" r="1" fill="white" className="snow" style={{animationDelay: '4.5s'}} />

        {/* Pine Branches (Top Corners) */}
        <g transform="translate(-10,-10)">
             <path d="M0,0 L40,20 L30,25 L60,35 L40,40 L70,60" stroke="#14532d" strokeWidth="4" strokeLinecap="round" />
             <path d="M0,5 L35,25 L25,30 L55,40 L35,45 L65,65" stroke="#166534" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
             <path d="M0,0 L80,10 L70,20 L100,30" stroke="#14532d" strokeWidth="4" strokeLinecap="round" />
        </g>
        <g transform="translate(610,-10) scale(-1, 1)">
             <path d="M0,0 L40,20 L30,25 L60,35 L40,40 L70,60" stroke="#14532d" strokeWidth="4" strokeLinecap="round" />
             <path d="M0,5 L35,25 L25,30 L55,40 L35,45 L65,65" stroke="#166534" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
        </g>

        {/* Strings for Ornaments */}
        <line x1="100" y1="0" x2="100" y2="40" stroke="#e2e8f0" strokeWidth="1" opacity="0.5" />
        <line x1="500" y1="0" x2="500" y2="40" stroke="#e2e8f0" strokeWidth="1" opacity="0.5" />
        <line x1="300" y1="0" x2="300" y2="25" stroke="#e2e8f0" strokeWidth="1" opacity="0.5" />
        <line x1="50" y1="0" x2="50" y2="60" stroke="#e2e8f0" strokeWidth="1" opacity="0.5" />
        <line x1="550" y1="0" x2="550" y2="60" stroke="#e2e8f0" strokeWidth="1" opacity="0.5" />

        {/* Hanging Ornaments */}
        <g className="ornament" style={{transformOrigin: '50px 0px'}}>
             <circle cx="50" cy="70" r="10" fill="url(#goldGradient)" />
             <circle cx="50" cy="70" r="10" fill="url(#glowRadial)" opacity="0.3" />
             <rect x="48" y="58" width="4" height="4" fill="#9ca3af" rx="1" />
        </g>
         <g className="ornament" style={{transformOrigin: '550px 0px', animationDelay: '-2s'}}>
             <circle cx="550" cy="70" r="10" fill="url(#goldGradient)" />
             <circle cx="550" cy="70" r="10" fill="url(#glowRadial)" opacity="0.3" />
             <rect x="548" y="58" width="4" height="4" fill="#9ca3af" rx="1" />
        </g>

        <g className="ornament" style={{transformOrigin: '100px 0px', animationDelay: '-1s'}}>
             <circle cx="100" cy="50" r="12" fill="url(#redBauble)" />
             {/* Highlight on Bauble */}
             <path d="M96,46 Q100,42 104,46" stroke="white" strokeWidth="2" strokeOpacity="0.5" fill="none" />
             <rect x="98" y="36" width="4" height="6" fill="#fcd34d" rx="1" />
        </g>

        <g className="ornament" style={{transformOrigin: '500px 0px', animationDelay: '-3s'}}>
             <circle cx="500" cy="50" r="12" fill="url(#greenBauble)" />
             <path d="M496,46 Q500,42 504,46" stroke="white" strokeWidth="2" strokeOpacity="0.5" fill="none" />
             <rect x="498" y="36" width="4" height="6" fill="#fcd34d" rx="1" />
        </g>
        
        {/* Center Decoration */}
        <g className="ornament" style={{transformOrigin: '300px 0px', animationDelay: '-1.5s'}}>
            <circle cx="300" cy="35" r="10" fill="url(#redBauble)" />
            <rect x="298" y="23" width="4" height="4" fill="#fcd34d" rx="1" />
        </g>

        {/* Main Text */}
        <text x="300" y="100" textAnchor="middle" fontFamily="'Times New Roman', serif" fontSize="42" fontWeight="bold" fill="url(#goldGradient)" filter="url(#textShadow)" letterSpacing="2">
          Happy Holidays
        </text>
         <text x="300" y="125" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fill="#94a3b8" letterSpacing="4" opacity="0.8">
          FROM CRYPTOGUYTECH
        </text>

        {/* Twinkling Stars */}
        <path d="M200,80 L202,85 L207,87 L202,89 L200,94 L198,89 L193,87 L198,85 Z" fill="#FDE68A" className="star" />
        <path d="M400,90 L402,95 L407,97 L402,99 L400,104 L398,99 L393,97 L398,95 Z" fill="#FDE68A" className="star" />
        <circle cx="50" cy="110" r="2" fill="#FDE68A" className="star" />
        <circle cx="550" cy="120" r="2" fill="#FDE68A" className="star" />

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