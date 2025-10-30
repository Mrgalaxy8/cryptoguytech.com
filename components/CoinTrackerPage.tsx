import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { Coin } from '../types';
import { PriceChart } from './PriceChart';
import { CoinDetailModal } from './CoinDetailModal';
import { CoinCard } from './CoinCard';


const API_URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true';

type FilterMode = 'all' | 'gainers' | 'losers';

export const CoinTrackerPage: React.FC = () => {
    const [coins, setCoins] = useState<Coin[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Coin, direction: 'asc' | 'desc' } | null>({ key: 'market_cap', direction: 'desc' });
    const [filterMode, setFilterMode] = useState<FilterMode>('all');
    const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);

    const fetchData = useCallback(async () => {
        setError(null);
        setIsLoading(true);
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`API request failed with status: ${response.status}`);
            }
            const data: Coin[] = await response.json();
            setCoins(data);
        } catch (err) {
            console.error(err);
            if (err instanceof Error) {
                setError(`Failed to fetch coin data. The CoinGecko API might be offline or the request is malformed. (${err.message})`);
            } else {
                setError("An unknown error occurred while fetching data.");
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData(); // Initial fetch
        const interval = setInterval(fetchData, 60000); // Auto-refresh every 60 seconds
        return () => clearInterval(interval);
    }, [fetchData]);

    const handleFilterChange = (mode: FilterMode) => {
        setFilterMode(mode);
        if (mode === 'gainers') {
            setSortConfig({ key: 'price_change_percentage_24h', direction: 'desc' });
        } else if (mode === 'losers') {
            setSortConfig({ key: 'price_change_percentage_24h', direction: 'asc' });
        } else { // 'all'
            setSortConfig({ key: 'market_cap', direction: 'desc' });
        }
    };
    
    const baseFilteredCoins = useMemo(() => {
        if (!coins) return [];
        if (filterMode === 'gainers') {
            return coins.filter(c => c.price_change_percentage_24h >= 0);
        }
        if (filterMode === 'losers') {
            return coins.filter(c => c.price_change_percentage_24h < 0);
        }
        return coins;
    }, [coins, filterMode]);

    const sortedCoins = useMemo(() => {
        let sortableCoins = [...baseFilteredCoins];
        if (sortConfig !== null) {
            sortableCoins.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                if (aValue === null || aValue === undefined) return 1;
                if (bValue === null || bValue === undefined) return -1;
                
                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableCoins;
    }, [baseFilteredCoins, sortConfig]);
    
    const filteredCoins = useMemo(() => {
        return sortedCoins.filter(coin =>
            coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [sortedCoins, searchTerm]);

    const requestSort = useCallback((key: keyof Coin) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    }, [sortConfig]);
    
    const getSortIndicator = (key: keyof Coin) => {
        if (!sortConfig || sortConfig.key !== key) {
            return '↕';
        }
        return sortConfig.direction === 'asc' ? '▲' : '▼';
    };

    const handleRowClick = (coin: Coin) => {
        setSelectedCoin(coin);
    };

    const filterButtons: { mode: FilterMode; label: string }[] = [
        { mode: 'all', label: 'All Coins' },
        { mode: 'gainers', label: 'Top Gainers' },
        { mode: 'losers', label: 'Top Losers' },
    ];

    const renderLoadingErrorOrEmpty = (isCardView = false) => {
        const loadingSpinner = (
            <div className="flex justify-center items-center space-x-2">
                <div className="w-4 h-4 bg-primary-green rounded-full animate-pulse"></div>
                <div className="w-4 h-4 bg-primary-green rounded-full animate-pulse [animation-delay:0.2s]"></div>
                <div className="w-4 h-4 bg-primary-green rounded-full animate-pulse [animation-delay:0.4s]"></div>
                <span className="ml-2 text-gray-500 dark:text-gray-400">Loading Market Data...</span>
            </div>
        );
        const errorDisplay = (
            <div className="text-red-500">
                <p className="font-semibold">Could not load data</p>
                <p className="text-sm mt-1">{error}</p>
            </div>
        );
        const noResultsDisplay = (
             <p className="text-gray-500 dark:text-gray-400">No coins found matching your criteria.</p>
        );

        if (isCardView) {
            return (
                <div className="text-center py-10">
                    {isLoading ? loadingSpinner : error ? errorDisplay : noResultsDisplay}
                </div>
            );
        }

        return (
             <tr>
                <td colSpan={5} className="text-center py-10">
                    {isLoading ? loadingSpinner : error ? errorDisplay : noResultsDisplay}
                </td>
            </tr>
        )
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
            <h1 className="text-3xl sm:text-4xl font-bold text-center mb-2 text-primary-blue dark:text-white">Live Coin Tracker</h1>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-8">Real-time cryptocurrency market data. Auto-refreshes every 60 seconds.</p>
            
            <div className="flex justify-center flex-wrap gap-2 md:gap-4 mb-6">
                {filterButtons.map(({ mode, label }) => (
                    <button
                        key={mode}
                        onClick={() => handleFilterChange(mode)}
                        className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-dark-bg focus:ring-primary-green ${
                            filterMode === mode
                                ? 'bg-primary-green text-primary-blue shadow-md'
                                : 'bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-bg border border-gray-300 dark:border-gray-700'
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search for a coin (e.g., Bitcoin, ETH)..."
                    className="w-full px-4 py-3 rounded-lg bg-white dark:bg-dark-card border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-green"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto bg-white dark:bg-dark-card rounded-lg shadow-lg">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-primary-blue">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                <button className="flex items-center gap-1 hover:text-primary-green" onClick={() => requestSort('name')}>
                                    Name <span>{getSortIndicator('name')}</span>
                                </button>
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                <button className="flex items-center gap-1 ml-auto hover:text-primary-green" onClick={() => requestSort('current_price')}>
                                    Price <span>{getSortIndicator('current_price')}</span>
                                </button>
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                <button className="flex items-center gap-1 ml-auto hover:text-primary-green" onClick={() => requestSort('price_change_percentage_24h')}>
                                    24h % <span>{getSortIndicator('price_change_percentage_24h')}</span>
                                </button>
                            </th>
                            <th className="hidden md:table-cell px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                <button className="flex items-center gap-1 ml-auto hover:text-primary-green" onClick={() => requestSort('market_cap')}>
                                    Market Cap <span>{getSortIndicator('market_cap')}</span>
                                </button>
                            </th>
                            <th className="hidden md:table-cell px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                7d Chart
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                       {(isLoading || error || filteredCoins.length === 0) ? renderLoadingErrorOrEmpty() : filteredCoins.map(coin => (
                           <tr 
                             key={coin.id} 
                             className="hover:bg-gray-100 dark:hover:bg-dark-bg transition-colors duration-200 cursor-pointer"
                             onClick={() => handleRowClick(coin)}
                           >
                               <td className="px-6 py-4 whitespace-nowrap">
                                   <div className="flex items-center">
                                       <div className="flex-shrink-0 h-10 w-10">
                                           <img className="h-10 w-10 rounded-full" src={coin.image} alt={coin.name} />
                                       </div>
                                       <div className="ml-4">
                                           <div className="text-sm font-medium text-gray-900 dark:text-white">{coin.name}</div>
                                           <div className="text-sm text-gray-500 dark:text-gray-400">{coin.symbol.toUpperCase()}</div>
                                       </div>
                                   </div>
                               </td>
                               <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</td>
                               <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${coin.price_change_percentage_24h >= 0 ? 'text-primary-green' : 'text-red-500'}`}>
                                   {coin.price_change_percentage_24h?.toFixed(2) ?? 'N/A'}%
                               </td>
                               <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">${coin.market_cap.toLocaleString()}</td>
                                <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                                   <div className="flex justify-center">
                                       {coin.sparkline_in_7d?.price && <PriceChart data={coin.sparkline_in_7d.price} />}
                                   </div>
                               </td>
                           </tr>
                       ))}
                    </tbody>
                </table>
            </div>

             {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {(isLoading || error || filteredCoins.length === 0) ? renderLoadingErrorOrEmpty(true) : filteredCoins.map(coin => (
                    <CoinCard key={coin.id} coin={coin} onClick={handleRowClick} />
                ))}
            </div>

            {selectedCoin && (
                <CoinDetailModal coin={selectedCoin} onClose={() => setSelectedCoin(null)} />
            )}
        </div>
    );
};