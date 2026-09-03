import React from 'react';
import { useCoinData } from '../hooks/useCoinData';

export const PriceTicker: React.FC = () => {
    const { coins, isLoading, error } = useCoinData();

    if (isLoading && coins.length === 0) {
        return (
            <div className="bg-primary-blue/90 h-10 flex items-center justify-center border-b border-gray-700">
                <p className="text-gray-400 text-xs sm:text-sm">Syncing live market prices...</p>
            </div>
        );
    }

    if (error && coins.length === 0) {
        return (
            <div className="bg-primary-blue/90 h-10 flex items-center justify-center px-4 border-b border-gray-700">
                <p className="text-red-400 text-xs sm:text-sm text-center">{error}</p>
            </div>
        );
    }

    const tickerCoins = coins.slice(0, 25);

    if (tickerCoins.length === 0) {
        return null;
    }
    
    // Duplicate for seamless infinite loop
    const tickerItems = [...tickerCoins, ...tickerCoins];

    return (
        <div 
            className="group bg-primary-blue/95 backdrop-blur-sm overflow-hidden whitespace-nowrap relative border-b border-gray-700/80 h-10 flex items-center shadow-inner"
            title="Hover or press to pause trail"
        >
            {/* Pinned Live Status Pill */}
            <div className="shrink-0 z-20 flex items-center gap-1.5 px-3 sm:px-4 bg-primary-blue border-r border-gray-700/80 h-full text-xs font-semibold select-none shadow-sm">
                <span className="w-2 h-2 rounded-full bg-primary-green animate-pulse" />
                <span className="text-[11px] font-bold text-gray-200 uppercase tracking-wider">Live</span>
            </div>

            {/* Moving Marquee Trail Container */}
            <div className="relative overflow-hidden flex-1 h-full">
                {/* Left and right soft edge fade masks */}
                <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 sm:w-10 bg-gradient-to-r from-primary-blue to-transparent z-10" />
                <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 sm:w-10 bg-gradient-to-l from-primary-blue to-transparent z-10" />

                <div className="flex animate-marquee items-center h-full will-change-transform">
                    {tickerItems.map((coin, index) => {
                        const change = coin.price_change_percentage_24h ?? 0;
                        const isPositive = change >= 0;

                        return (
                            <div 
                                key={`${coin.id}-${index}`} 
                                className="flex items-center space-x-2 px-4 sm:px-5 h-full text-xs sm:text-sm border-r border-gray-700/60 font-mono hover:bg-white/10 transition-colors cursor-default select-none"
                            >
                                {coin.image && (
                                    <img 
                                        src={coin.image} 
                                        alt={coin.symbol} 
                                        className="w-4 h-4 rounded-full shrink-0 object-contain"
                                        loading="lazy"
                                    />
                                )}
                                <span className="font-bold text-white tracking-wide">{coin.symbol.toUpperCase()}</span>
                                <span className="text-gray-200 tabular-nums">
                                    {coin.current_price != null 
                                        ? `$${coin.current_price.toLocaleString(undefined, { 
                                            minimumFractionDigits: coin.current_price < 1 ? 4 : 2, 
                                            maximumFractionDigits: coin.current_price < 1 ? 6 : 2 
                                        })}` 
                                        : 'N/A'}
                                </span>
                                <span className={`tabular-nums flex items-center font-medium ${isPositive ? 'text-primary-green' : 'text-red-400'}`}>
                                    <span className="mr-0.5 text-[10px]">{isPositive ? '▲' : '▼'}</span>
                                    {coin.price_change_percentage_24h != null ? `${Math.abs(coin.price_change_percentage_24h).toFixed(2)}%` : 'N/A'}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
