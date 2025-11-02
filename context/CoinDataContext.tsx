import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { Coin } from '../types';

const API_URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true';

interface CoinDataContextType {
    coins: Coin[];
    isLoading: boolean;
    error: string | null;
    fetchData: () => Promise<void>;
}

export const CoinDataContext = createContext<CoinDataContextType | undefined>(undefined);

export const CoinDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [coins, setCoins] = useState<Coin[]>([]);
    const [isLoading, setIsLoading] = useState(true); // Start true for initial load
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async (isManualRetry = false) => {
        if (isManualRetry) {
            setIsLoading(true);
        }
        // Don't clear previous error on silent background refresh
        if (isManualRetry || isLoading) {
            setError(null);
        }
        
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const data: Coin[] = await response.json();
            setCoins(data);
            setError(null); // Clear error on successful fetch
        } catch (err) {
            console.error("Failed to fetch coin data:", err);
            // Only set error if we don't already have data to display
            if (coins.length === 0) {
                setError("Could not load market data. The API may be down or rate-limited. Retrying automatically.");
            }
        } finally {
            if (isLoading) {
                setIsLoading(false);
            }
        }
    }, [isLoading, coins.length]);

    useEffect(() => {
        fetchData(true); // Initial fetch
        const interval = setInterval(() => fetchData(false), 60000); // Background refresh
        return () => clearInterval(interval);
    }, []);

    const manualFetch = useCallback(() => fetchData(true), [fetchData]);

    const value = useMemo(() => ({ coins, isLoading, error, fetchData: manualFetch }), [coins, isLoading, error, manualFetch]);

    return (
        <CoinDataContext.Provider value={value}>
            {children}
        </CoinDataContext.Provider>
    );
};