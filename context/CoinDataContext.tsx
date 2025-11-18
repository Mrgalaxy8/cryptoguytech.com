import React, { createContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { Coin } from '../types';

const API_URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true';
const INITIAL_RETRY_DELAY = 60 * 1000; // 1 minute
const MAX_RETRY_DELAY = 5 * 60 * 1000; // 5 minutes
const CACHE_KEY = 'coinDataCache';
const CACHE_EXPIRATION = 5 * 60 * 1000; // 5 minutes

interface CoinDataContextType {
    coins: Coin[];
    isLoading: boolean;
    error: string | null;
    fetchData: () => void;
    lastUpdated: Date | null;
}

interface CachedData {
    coins: Coin[];
    timestamp: number;
}

const getCachedData = (): CachedData | null => {
    try {
        const cachedItem = localStorage.getItem(CACHE_KEY);
        if (!cachedItem) return null;

        const data: CachedData = JSON.parse(cachedItem);
        // Check if cache has expired
        if (new Date().getTime() - data.timestamp > CACHE_EXPIRATION) {
            localStorage.removeItem(CACHE_KEY);
            return null;
        }
        return data;
    } catch (e) {
        console.error("Failed to read or parse cache", e);
        return null;
    }
};

const setCachedData = (coins: Coin[]) => {
    try {
        const data: CachedData = {
            coins,
            timestamp: new Date().getTime(),
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch (e) {
        console.error("Failed to save data to cache", e);
    }
};

export const CoinDataContext = createContext<CoinDataContextType | undefined>(undefined);

export const CoinDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [coins, setCoins] = useState<Coin[]>(() => getCachedData()?.coins ?? []);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(() => {
        const timestamp = getCachedData()?.timestamp;
        return timestamp ? new Date(timestamp) : null;
    });

    const timeoutIdRef = useRef<number | null>(null);
    const retryDelayRef = useRef(INITIAL_RETRY_DELAY);
    const abortControllerRef = useRef<AbortController | null>(null);

    const fetchData = useCallback(async (isManualOrInitial = false) => {
        // Abort any pending request. This is safe to call even if there's no pending request.
        abortControllerRef.current?.abort();
        
        if (timeoutIdRef.current) {
            clearTimeout(timeoutIdRef.current);
        }

        // Create a new controller for the new request.
        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        if (isManualOrInitial) {
            setIsLoading(true);
            setError(null);
        }

        if (!navigator.onLine) {
            setError("You appear to be offline. Displaying cached data.");
            if (isManualOrInitial) setIsLoading(false);
            timeoutIdRef.current = window.setTimeout(() => fetchData(false), retryDelayRef.current);
            return;
        }

        const fetchTimeout = setTimeout(() => {
            abortControllerRef.current?.abort();
        }, 15000); // 15 second timeout

        try {
            const response = await fetch(API_URL, {
                signal,
                credentials: 'omit',
                headers: { 'Accept': 'application/json' }
            });
            clearTimeout(fetchTimeout);

            if (!response.ok) {
                let errorText = `API Error (status: ${response.status}). Retrying...`;
                if (response.status === 429) {
                    errorText = 'API rate limit exceeded. Retrying after a longer delay...';
                    retryDelayRef.current = MAX_RETRY_DELAY;
                }
                throw new Error(errorText);
            }
            const data: Coin[] = await response.json();
            
            setCoins(data);
            setLastUpdated(new Date());
            setCachedData(data);
            setError(null);
            retryDelayRef.current = INITIAL_RETRY_DELAY;
        } catch (err) {
            clearTimeout(fetchTimeout);

            // Don't treat expected aborts as critical errors.
            if (err instanceof Error && err.name === 'AbortError') {
                console.log("Fetch was aborted, likely due to a timeout or component cleanup.");
                // Only set an error if the request was initiated manually or if there isn't a more specific error already.
                if (isManualOrInitial || !error) {
                    setError("Request timed out or was cancelled. Retrying...");
                }
            } else {
                console.error("Failed to fetch coin data:", err);
                
                let errorMessage = "An unknown error occurred while fetching data. Retrying...";
                if (err instanceof Error) {
                     if (err.message.includes('Failed to fetch')) {
                        errorMessage = "Network error. This could be due to a connection issue, an ad-blocker, or API rate-limiting. Retrying...";
                    } else {
                        errorMessage = err.message;
                    }
                }
                setError(errorMessage);
                
                if (!(err instanceof Error && err.message.includes('API rate limit exceeded'))) {
                     retryDelayRef.current = Math.min(retryDelayRef.current * 2, MAX_RETRY_DELAY);
                }
            }
        } finally {
            if (isManualOrInitial) {
                setIsLoading(false);
            }
            // Schedule the next fetch, but only if the request wasn't aborted by a component unmount/cleanup.
            if (!signal.aborted) {
                timeoutIdRef.current = window.setTimeout(() => fetchData(false), retryDelayRef.current);
            }
        }
    }, [error]); // Dependency on 'error' helps avoid stale closures when deciding to set a new error message.

    useEffect(() => {
        const handleOnline = () => {
            setError(null);
            retryDelayRef.current = INITIAL_RETRY_DELAY;
            fetchData(true);
        };
        const handleOffline = () => {
            if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
            setError("You appear to be offline. Displaying cached data.");
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        fetchData(true);

        return () => {
            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current);
            }
            // Abort any ongoing fetch request when the component unmounts.
            abortControllerRef.current?.abort();
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
        // Use a stable reference for fetchData by removing dependencies
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const manualFetch = useCallback(() => {
        retryDelayRef.current = INITIAL_RETRY_DELAY;
        fetchData(true);
    }, [fetchData]);

    const value = useMemo(() => ({ coins, isLoading, error, fetchData: manualFetch, lastUpdated }), [coins, isLoading, error, manualFetch, lastUpdated]);

    return (
        <CoinDataContext.Provider value={value}>
            {children}
        </CoinDataContext.Provider>
    );
};