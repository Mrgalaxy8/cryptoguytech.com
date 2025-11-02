import React, { createContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { Coin } from '../types';

const API_URL = 'https://api.binance.com/api/v3/ticker/24hr';
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

const coinNameMap: { [key: string]: string } = {
    BTC: 'Bitcoin', ETH: 'Ethereum', BNB: 'BNB', SOL: 'Solana', XRP: 'XRP',
    DOGE: 'Dogecoin', TON: 'Toncoin', ADA: 'Cardano', SHIB: 'Shiba Inu', AVAX: 'Avalanche',
    DOT: 'Polkadot', LINK: 'Chainlink', TRX: 'TRON', BCH: 'Bitcoin Cash', MATIC: 'Polygon',
    LTC: 'Litecoin', ICP: 'Internet Computer', ETC: 'Ethereum Classic', UNI: 'Uniswap',
    XLM: 'Stellar', ATOM: 'Cosmos', ARB: 'Arbitrum', RNDR: 'Render', HBAR: 'Hedera',
    FIL: 'Filecoin'
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

    const fetchData = useCallback(async (isManualOrInitial = false) => {
        if (timeoutIdRef.current) {
            clearTimeout(timeoutIdRef.current);
        }

        if (isManualOrInitial) {
            setIsLoading(true);
            setError(null);
        }

        if (!navigator.onLine) {
            setError("You appear to be offline. Displaying cached data.");
            if (isManualOrInitial) setIsLoading(false);
            // Schedule a check for when we are back online
            timeoutIdRef.current = window.setTimeout(() => fetchData(false), retryDelayRef.current);
            return;
        }

        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                let errorText = `API Error (status: ${response.status}). Retrying...`;
                if (response.status === 429) {
                    errorText = 'API rate limit exceeded. Retrying...';
                }
                throw new Error(errorText);
            }
            const data: any[] = await response.json();
            
            const usdtPairs = data.filter(d => d.symbol.endsWith('USDT') && !d.symbol.match(/UP|DOWN|BEAR|BULL/));

            const mappedCoins: Coin[] = usdtPairs.map(d => {
                const baseAsset = d.symbol.replace('USDT', '');
                return {
                    id: d.symbol,
                    symbol: baseAsset,
                    name: coinNameMap[baseAsset] || baseAsset,
                    image: `https://assets.coincap.io/assets/icons/${baseAsset.toLowerCase()}@2x.png`,
                    current_price: parseFloat(d.lastPrice),
                    market_cap: parseFloat(d.quoteVolume), // Using 24h volume instead of market cap
                    price_change_percentage_24h: parseFloat(d.priceChangePercent),
                };
            });

            // Sort by "market cap" (which is now 24h volume) desc by default
            mappedCoins.sort((a, b) => b.market_cap - a.market_cap);
            
            const top100Coins = mappedCoins.slice(0, 100);

            setCoins(top100Coins);
            const now = new Date();
            setLastUpdated(now);
            setCachedData(top100Coins);
            setError(null);
            retryDelayRef.current = INITIAL_RETRY_DELAY;
        } catch (err) {
            console.error("Failed to fetch coin data:", err);
            const errorMessage = err instanceof Error && err.message.includes('Failed to fetch') 
                ? "Network error. Retrying..."
                : (err instanceof Error ? err.message : "An unknown error occurred.");
            
            setError(errorMessage);
            
            // Exponential backoff
            retryDelayRef.current = Math.min(retryDelayRef.current * 2, MAX_RETRY_DELAY);
        } finally {
            if (isManualOrInitial) {
                setIsLoading(false);
            }
            // Schedule the next fetch
            timeoutIdRef.current = window.setTimeout(() => fetchData(false), retryDelayRef.current);
        }
    }, []);

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
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [fetchData]);

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