import React, { useState, useEffect } from 'react';

interface TickerCoin {
    id: string;
    symbol: string;
    current_price: number;
    price_change_percentage_24h: number;
}

const API_URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=25&page=1&sparkline=false';

export const PriceTicker: React.FC = () => {
    const [coins, setCoins] = useState<TickerCoin[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTickerData = async () => {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error('Failed to fetch ticker data');
                }
                const data: TickerCoin[] = await response.json();
                setCoins(data);
            } catch (error) {
                console.error("Error fetching ticker data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTickerData();
        const interval = setInterval(fetchTickerData, 60000); // Refresh every minute
        return () => clearInterval(interval);
    }, []);

    if (isLoading) {
        return (
            <div className="bg-primary-blue/90 h-10 flex items-center justify-center">
                <p className="text-gray-400 text-sm">Loading prices...</p>
            </div>
        );
    }

    if (coins.length === 0) {
        return null; // Don't render if there's no data
    }
    
    const tickerItems = [...coins, ...coins]; // Duplicate for seamless loop

    return (
        <div className="group bg-primary-blue/90 backdrop-blur-sm overflow-hidden whitespace-nowrap relative border-b border-t border-gray-700">
            <div className="flex animate-marquee">
                {tickerItems.map((coin, index) => (
                    <div key={`${coin.id}-${index}`} className="flex items-center space-x-2 px-6 py-2 text-sm border-r border-gray-700">
                        <span className="font-bold text-white">{coin.symbol.toUpperCase()}</span>
                        <span className="text-gray-300">${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</span>
                        <span className={coin.price_change_percentage_24h >= 0 ? 'text-primary-green' : 'text-red-500'}>
                            {coin.price_change_percentage_24h.toFixed(2)}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};