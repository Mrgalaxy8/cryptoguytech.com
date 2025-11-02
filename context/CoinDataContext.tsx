import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { Coin } from '../types';

const API_URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true';

interface CoinDataContextType {
    coins: Coin[];
    isLoading: boolean;
    error: string | null;
    fetchData: () => void; // Expose a simple manual fetch function
}

export const CoinDataContext = createContext<CoinDataContextType | undefined>(undefined);

export const CoinDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [coins, setCoins] = useState<Coin[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // This core fetching logic is wrapped in a useCallback with an empty dependency array,
    // making it a stable function. It uses functional state updates to prevent stale state issues.
    const fetchData = useCallback(async (isManualOrInitial = false) => {
        if (isManualOrInitial) {
            setIsLoading(true);
            setError(null);
        }

        if (!navigator.onLine) {
            setError("You appear to be offline. Please check your connection.");
            if (isManualOrInitial) setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                const errorText = response.status === 429 
                    ? 'API rate limit exceeded. Please try again in a minute.' 
                    : `Network response was not ok (status: ${response.status}).`;
                throw new Error(errorText);
            }
            const data: Coin[] = await response.json();
            setCoins(data);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch coin data:", err);
            const errorMessage = err instanceof Error && err.message.includes('Failed to fetch') 
                ? "A network error occurred. Please check your connection and try again."
                : (err instanceof Error ? err.message : "An unknown error occurred.");
            
            // Only set an error if we don't have existing data, or on a manual/initial load.
            setCoins(currentCoins => {
                if (currentCoins.length === 0 || isManualOrInitial) {
                    setError(errorMessage);
                }
                return currentCoins; // Keep existing data on background refresh failure
            });
        } finally {
            if (isManualOrInitial) {
                setIsLoading(false);
            }
        }
    }, []); // Empty array ensures this function is created only once.

    // This effect manages the initial fetch, background refresh interval, and online/offline events.
    useEffect(() => {
        let intervalId: number;

        const handleOnline = () => fetchData(true);
        const handleOffline = () => setError("You appear to be offline. Please check your connection.");

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Initial fetch on component mount.
        fetchData(true);

        // Set up interval for background refreshes.
        intervalId = window.setInterval(() => fetchData(false), 60000);

        // Cleanup function runs on component unmount.
        return () => {
            clearInterval(intervalId);
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [fetchData]); // This effect correctly depends on the stable fetchData function.

    // Create a stable function reference for consumers to call for a manual refresh.
    const manualFetch = useCallback(() => fetchData(true), [fetchData]);

    const value = useMemo(() => ({ coins, isLoading, error, fetchData: manualFetch }), [coins, isLoading, error, manualFetch]);

    return (
        <CoinDataContext.Provider value={value}>
            {children}
        </CoinDataContext.Provider>
    );
};