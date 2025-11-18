import React, { createContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { Coin } from '../types';

const API_URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true';
const INITIAL_RETRY_DELAY = 60 * 1000; // 1 minute
const MAX_RETRY_DELAY = 5 * 60 * 1000; // 5 minutes
const CACHE_KEY = 'coinDataCache';
const CACHE_EXPIRATION = 5 * 60 * 1000; // 5 minutes

// Fallback data to ensure the UI is never empty even if the API is completely blocked or down
const FALLBACK_COINS: Coin[] = [
    { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png', current_price: 64230.50, market_cap: 1200000000000, price_change_percentage_24h: 1.2, sparkline_in_7d: { price: [62000, 63000, 62500, 64000, 63500, 64230] } },
    { id: 'ethereum', symbol: 'eth', name: 'Ethereum', image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png', current_price: 3450.12, market_cap: 400000000000, price_change_percentage_24h: -0.5, sparkline_in_7d: { price: [3500, 3480, 3450, 3460, 3440, 3450] } },
    { id: 'solana', symbol: 'sol', name: 'Solana', image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png', current_price: 145.20, market_cap: 65000000000, price_change_percentage_24h: 5.4, sparkline_in_7d: { price: [130, 135, 138, 140, 142, 145] } },
    { id: 'binancecoin', symbol: 'bnb', name: 'BNB', image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png', current_price: 590.10, market_cap: 87000000000, price_change_percentage_24h: 0.8, sparkline_in_7d: { price: [580, 585, 588, 590, 592, 590] } },
    { id: 'ripple', symbol: 'xrp', name: 'XRP', image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png', current_price: 0.62, market_cap: 34000000000, price_change_percentage_24h: -1.2, sparkline_in_7d: { price: [0.64, 0.63, 0.62, 0.61, 0.62, 0.62] } },
    { id: 'dogecoin', symbol: 'doge', name: 'Dogecoin', image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png', current_price: 0.16, market_cap: 23000000000, price_change_percentage_24h: 2.1, sparkline_in_7d: { price: [0.15, 0.155, 0.16, 0.158, 0.16, 0.16] } },
    { id: 'cardano', symbol: 'ada', name: 'Cardano', image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png', current_price: 0.45, market_cap: 16000000000, price_change_percentage_24h: -0.8, sparkline_in_7d: { price: [0.46, 0.455, 0.45, 0.448, 0.45, 0.45] } },
    { id: 'avalanche-2', symbol: 'avax', name: 'Avalanche', image: 'https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png', current_price: 35.40, market_cap: 13000000000, price_change_percentage_24h: 3.2, sparkline_in_7d: { price: [32, 33, 34, 35, 34.5, 35.4] } }
];

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
        // Abort any pending request.
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
            setError("You appear to be offline. Displaying cached or fallback data.");
            if (coins.length === 0) {
                setCoins(FALLBACK_COINS);
            }
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
                console.log("Fetch was aborted.");
                if (isManualOrInitial && !error) {
                    setError("Request timed out. Retrying...");
                }
            } else {
                console.error("Failed to fetch coin data:", err);
                
                let errorMessage = "Unable to fetch live market data.";
                if (err instanceof Error) {
                     if (err.message.includes('Failed to fetch')) {
                        errorMessage = "Network connection issue or API block. Showing fallback data.";
                    } else if (err.message.includes('rate limit')) {
                        errorMessage = "API rate limit reached. Showing cached/fallback data.";
                    } else {
                        errorMessage = err.message;
                    }
                }
                setError(errorMessage);
                
                // Load fallback data if we have absolutely nothing so the app isn't empty
                setCoins(prevCoins => {
                    if (prevCoins.length === 0) {
                        return FALLBACK_COINS;
                    }
                    return prevCoins;
                });
                
                if (!(err instanceof Error && err.message.includes('API rate limit exceeded'))) {
                     retryDelayRef.current = Math.min(retryDelayRef.current * 2, MAX_RETRY_DELAY);
                }
            }
        } finally {
            if (isManualOrInitial) {
                setIsLoading(false);
            }
            // Schedule the next fetch
            if (!signal.aborted) {
                timeoutIdRef.current = window.setTimeout(() => fetchData(false), retryDelayRef.current);
            }
        }
    }, [coins.length, error]); 

    useEffect(() => {
        const handleOnline = () => {
            setError(null);
            retryDelayRef.current = INITIAL_RETRY_DELAY;
            fetchData(true);
        };
        const handleOffline = () => {
            if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
            setError("You appear to be offline.");
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        fetchData(true);

        return () => {
            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current);
            }
            abortControllerRef.current?.abort();
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
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
