import React from 'react';
import { useCoinData } from '../hooks/useCoinData';

export const PriceTicker: React.FC = () => {
    const { coins, isLoading, error } = useCoinData();

    if (isLoading && coins.length === 0) {
        return (
            <div className="bg-primary-blue/90 h-10 flex items-center justify-center">
                <p className="text-gray-400 text-sm">Loading market prices...</p>
            </div>
        );
    }

    if (error && coins.length === 0) {
        return (
            <div className="bg-primary-blue/90 h-10 flex items-center justify-center px-4">
                <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
        );
    }

    const tickerCoins = coins.slice(0, 25);

    if (tickerCoins.length === 0) {
        return null; // Don't render if there's no data and no error/loading state
    }
    
    const tickerItems = [...tickerCoins, ...tickerCoins]; // Duplicate for seamless loop

    return (
        <div className="group bg-primary-blue/90 backdrop-blur-sm overflow-hidden whitespace-nowrap relative border-b border-t border-gray-700">
            <div className="flex animate-marquee">
                {tickerItems.map((coin, index) => (
                    <div key={`${coin.id}-${index}`} className="flex items-center space-x-2 px-6 py-2 text-sm border-r border-gray-700">
                        <span className="font-bold text-white">{coin.symbol.toUpperCase()}</span>
                        <span className="text-gray-300">${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</span>
                        <span className={(coin.price_change_percentage_24h ?? 0) >= 0 ? 'text-primary-green' : 'text-red-500'}>
                            {coin.price_change_percentage_24h?.toFixed(2) ?? 'N/A'}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};