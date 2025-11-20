import React, { createContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { Coin } from '../types';

const API_URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true';

// Fallback data to ensure the UI is never empty even if the API is completely blocked or down
const FALLBACK_COINS: Coin[] = [
    { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png', current_price: 64230.50, market_cap: 1264000000000, price_change_percentage_24h: 1.2, sparkline_in_7d: { price: [62000, 63000, 62500, 64000, 63500, 64230, 64500, 64100, 63800, 64200] } },
    { id: 'ethereum', symbol: 'eth', name: 'Ethereum', image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png', current_price: 3450.12, market_cap: 415000000000, price_change_percentage_24h: -0.5, sparkline_in_7d: { price: [3500, 3480, 3450, 3460, 3440, 3450, 3420, 3440, 3460, 3450] } },
    { id: 'solana', symbol: 'sol', name: 'Solana', image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png', current_price: 145.20, market_cap: 67000000000, price_change_percentage_24h: 5.4, sparkline_in_7d: { price: [130, 135, 132, 140, 138, 142, 144, 146, 145, 145.2] } },
    { id: 'binancecoin', symbol: 'bnb', name: 'BNB', image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png', current_price: 590.10, market_cap: 87000000000, price_change_percentage_24h: 0.8, sparkline_in_7d: { price: [580, 585, 582, 588, 590, 592, 585, 588, 590, 590] } },
    { id: 'ripple', symbol: 'xrp', name: 'XRP', image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png', current_price: 0.62, market_cap: 34000000000, price_change_percentage_24h: -1.2, sparkline_in_7d: { price: [0.60, 0.61, 0.63, 0.62, 0.61, 0.62, 0.61, 0.62, 0.62, 0.62] } },
    { id: 'dogecoin', symbol: 'doge', name: 'Dogecoin', image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png', current_price: 0.16, market_cap: 23000000000, price_change_percentage_24h: 3.1, sparkline_in_7d: { price: [0.14, 0.15, 0.15, 0.16, 0.15, 0.16, 0.17, 0.16, 0.16, 0.16] } },
    { id: 'cardano', symbol: 'ada', name: 'Cardano', image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png', current_price: 0.45, market_cap: 16000000000, price_change_percentage_24h: 0.5, sparkline_in_7d: { price: [0.44, 0.45, 0.44, 0.45, 0.46, 0.45, 0.45, 0.45, 0.45, 0.45] } },
    { id: 'avalanche-2', symbol: 'avax', name: 'Avalanche', image: 'https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png', current_price: 35.40, market_cap: 13000000000, price_change_percentage_24h: 2.1, sparkline_in_7d: { price: [32, 33, 34, 33, 35, 34, 35, 36, 35, 35.4] } },
];

interface CoinDataContextType {
    coins: Coin[];
    isLoading: boolean;
    error: string | null;
    fetchData: () => Promise<void>;
    lastUpdated: Date | null;
}

export const CoinDataContext = createContext<CoinDataContextType | undefined>(undefined);

export const CoinDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [coins, setCoins] = useState<Coin[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    
    // Use refs to track mounted state and prevent state updates on unmounted component
    const isMounted = useRef(true);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    const fetchData = useCallback(async () => {
        if (!isMounted.current) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(API_URL);
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();

            if (isMounted.current) {
                if (Array.isArray(data) && data.length > 0) {
                    setCoins(data);
                    setLastUpdated(new Date());
                    setError(null);
                } else {
                    // If API returns empty or invalid data, use fallback
                    throw new Error('Invalid data received');
                }
            }
        } catch (err) {
            if (isMounted.current) {
                console.warn('Failed to fetch coin data, using fallback:', err);
                // On error, use fallback data but indicate there's a connection issue
                setCoins(FALLBACK_COINS);
                setError('Unable to fetch live data. Showing demo data.');
                setLastUpdated(new Date());
            }
        } finally {
            if (isMounted.current) {
                setIsLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        fetchData();
        
        // Refresh every 60 seconds
        const intervalId = setInterval(fetchData, 60000);
        
        return () => clearInterval(intervalId);
    }, [fetchData]);

    const value = useMemo(() => ({
        coins,
        isLoading,
        error,
        fetchData,
        lastUpdated
    }), [coins, isLoading, error, fetchData, lastUpdated]);

    return (
        <CoinDataContext.Provider value={value}>
            {children}
        </CoinDataContext.Provider>
    );
};