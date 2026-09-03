import React, { useState, useMemo, useCallback } from 'react';
import type { Coin } from '../types';
import { CoinDetailModal } from './CoinDetailModal';
import { CoinCard } from './CoinCard';
import { useCoinData } from '../hooks/useCoinData';
import { PriceChart } from './PriceChart';
import { PriceTicker } from './PriceTicker';

type FilterMode = 'all' | 'gainers' | 'losers';

const formatCompact = (val?: number | null): string => {
    if (val == null || isNaN(val)) return 'N/A';
    if (val >= 1e12) return `$${(val / 1e12).toFixed(2)}T`;
    if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
    if (val >= 1e6) return `$${(val / 1e6).toFixed(2)}M`;
    return `$${val.toLocaleString()}`;
};

const formatPrice = (price?: number | null): string => {
    if (price == null || isNaN(price)) return 'N/A';
    if (price >= 1) {
        return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    if (price >= 0.01) {
        return `$${price.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}`;
    }
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 6, maximumFractionDigits: 6 })}`;
};

const formatPercent = (val?: number | null): string => {
    if (val == null || isNaN(val)) return 'N/A';
    const isPositive = val >= 0;
    return `${isPositive ? '+' : ''}${val.toFixed(2)}%`;
};

export const CoinTrackerPage: React.FC = () => {
    const { coins: contextCoins, isLoading, error, fetchData } = useCoinData();
    
    // Search State
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Coin, direction: 'asc' | 'desc' } | null>({ key: 'market_cap', direction: 'desc' });
    const [filterMode, setFilterMode] = useState<FilterMode>('all');
    const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);

    // Summary market stats computed from the coin dataset
    const marketStats = useMemo(() => {
        const total = contextCoins.length;
        if (total === 0) {
            return { totalCoins: 0, gainers: 0, losers: 0, totalMarketCap: 0, totalVolume: 0, topPerformers: [] as Coin[] };
        }
        let gainers = 0;
        let losers = 0;
        let totalMarketCap = 0;
        let totalVolume = 0;

        for (const c of contextCoins) {
            const chg = c.price_change_percentage_24h ?? 0;
            if (chg >= 0) gainers++;
            else losers++;

            totalMarketCap += c.market_cap || 0;
            totalVolume += c.total_volume || 0;
        }

        const topPerformers = [...contextCoins]
            .filter(c => c.price_change_percentage_24h != null)
            .sort((a, b) => (b.price_change_percentage_24h ?? -Infinity) - (a.price_change_percentage_24h ?? -Infinity))
            .slice(0, 3);

        return { totalCoins: total, gainers, losers, totalMarketCap, totalVolume, topPerformers };
    }, [contextCoins]);

    const handleFilterChange = (mode: FilterMode) => {
        setFilterMode(mode);
        if (mode === 'gainers') {
            setSortConfig({ key: 'price_change_percentage_24h', direction: 'desc' });
        } else if (mode === 'losers') {
            setSortConfig({ key: 'price_change_percentage_24h', direction: 'asc' });
        } else {
            setSortConfig({ key: 'market_cap', direction: 'desc' });
        }
    };

    // 1. Filter by Search Term
    const searchedCoins = useMemo(() => {
        const trimmedTerm = searchTerm.trim().toLowerCase();
        if (!trimmedTerm) return contextCoins;
        return contextCoins.filter(coin => 
            coin.name.toLowerCase().includes(trimmedTerm) || 
            coin.symbol.toLowerCase().includes(trimmedTerm)
        );
    }, [contextCoins, searchTerm]);

    // 2. Filter by Mode (Gainers/Losers)
    const baseFilteredCoins = useMemo(() => {
        if (filterMode === 'gainers') {
            return searchedCoins.filter(c => (c.price_change_percentage_24h ?? 0) >= 0);
        }
        if (filterMode === 'losers') {
            return searchedCoins.filter(c => (c.price_change_percentage_24h ?? 0) < 0);
        }
        return searchedCoins;
    }, [searchedCoins, filterMode]);

    // 3. Sort
    const sortedCoins = useMemo(() => {
        const sortableCoins = [...baseFilteredCoins];
        if (sortConfig !== null) {
            sortableCoins.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                if (aValue === undefined || aValue === null) return 1;
                if (bValue === undefined || bValue === null) return -1;

                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    return sortConfig.direction === 'asc' 
                        ? aValue.localeCompare(bValue) 
                        : bValue.localeCompare(aValue);
                }

                if (typeof aValue === 'number' && typeof bValue === 'number') {
                    return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
                }

                return 0;
            });
        }
        return sortableCoins;
    }, [baseFilteredCoins, sortConfig]);
    
    const coinsToDisplay = sortedCoins;

    const requestSort = useCallback((key: keyof Coin) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    }, [sortConfig]);
    
    const getSortIndicator = (key: keyof Coin) => {
        if (!sortConfig || sortConfig.key !== key) {
            return <span className="text-gray-400 opacity-60">↕</span>;
        }
        return <span className="text-primary-green">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>;
    };

    const handleRowClick = (coin: Coin) => {
        setSelectedCoin(coin);
    };

    const filterButtons: { mode: FilterMode; label: string; count: number }[] = [
        { mode: 'all', label: 'All Coins', count: marketStats.totalCoins },
        { mode: 'gainers', label: 'Gainers', count: marketStats.gainers },
        { mode: 'losers', label: 'Losers', count: marketStats.losers },
    ];

    const renderLoadingErrorOrEmpty = (isCardView = false) => {
        const loadingSpinner = (
            <div className="flex justify-center items-center space-x-2 py-8">
                <div className="w-3.5 h-3.5 bg-primary-green rounded-full animate-pulse"></div>
                <div className="w-3.5 h-3.5 bg-primary-green rounded-full animate-pulse [animation-delay:0.2s]"></div>
                <div className="w-3.5 h-3.5 bg-primary-green rounded-full animate-pulse [animation-delay:0.4s]"></div>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                    Updating market prices...
                </span>
            </div>
        );
        const errorDisplay = (
            <div className="text-center text-red-500 py-8">
                <p className="font-semibold text-sm">Could not refresh market data</p>
                <p className="text-xs mt-1 mb-3 text-gray-500 dark:text-gray-400">{error}</p>
                <button
                    onClick={fetchData}
                    className="px-4 py-1.5 text-xs bg-primary-green text-primary-blue font-bold rounded-lg shadow hover:bg-green-400 transition-colors"
                >
                    Retry Now
                </button>
            </div>
        );
        const noResultsDisplay = (
             <div className="py-12 text-center">
                 <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                     No cryptocurrencies matching "{searchTerm}"
                 </p>
                 <button
                     onClick={() => setSearchTerm('')}
                     className="mt-2 text-xs font-semibold text-primary-green hover:underline"
                 >
                     Clear search filter
                 </button>
             </div>
        );

        if (isCardView) {
            return (
                <div className="text-center py-6">
                    {isLoading ? loadingSpinner : error ? errorDisplay : noResultsDisplay}
                </div>
            );
        }

        return (
             <tr>
                <td colSpan={9} className="text-center py-8">
                    {isLoading ? loadingSpinner : error ? errorDisplay : noResultsDisplay}
                </td>
            </tr>
        );
    };

    return (
        <div className="w-full">
            {/* Live Asset Price & % Change Ticker Trail */}
            <PriceTicker />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Top Market Overview - Static Stat Cards arranging the high-level data */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                {/* Metric 1: Market Cap */}
                <div className="bg-white dark:bg-dark-card rounded-xl p-3.5 sm:p-4 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between">
                    <span className="text-xs uppercase font-medium tracking-wider text-gray-500 dark:text-gray-400">
                        Total Market Cap
                    </span>
                    <div className="mt-1.5 flex items-baseline justify-between">
                        <span className="text-lg sm:text-xl font-bold font-mono tabular-nums text-gray-900 dark:text-white">
                            {formatCompact(marketStats.totalMarketCap)}
                        </span>
                        <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500">
                            100 Assets
                        </span>
                    </div>
                </div>

                {/* Metric 2: 24h Total Volume */}
                <div className="bg-white dark:bg-dark-card rounded-xl p-3.5 sm:p-4 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between">
                    <span className="text-xs uppercase font-medium tracking-wider text-gray-500 dark:text-gray-400">
                        24h Market Volume
                    </span>
                    <div className="mt-1.5 flex items-baseline justify-between">
                        <span className="text-lg sm:text-xl font-bold font-mono tabular-nums text-gray-900 dark:text-white">
                            {formatCompact(marketStats.totalVolume)}
                        </span>
                        <span className="text-[11px] font-semibold text-primary-green flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary-green animate-pulse"></span>
                            Live
                        </span>
                    </div>
                </div>

                {/* Metric 3: Market Sentiment (Gainers vs Losers) */}
                <div className="bg-white dark:bg-dark-card rounded-xl p-3.5 sm:p-4 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between">
                    <span className="text-xs uppercase font-medium tracking-wider text-gray-500 dark:text-gray-400">
                        24h Market Pulse
                    </span>
                    <div className="mt-1.5">
                        <div className="flex items-center justify-between text-xs font-mono font-semibold mb-1">
                            <span className="text-emerald-600 dark:text-primary-green">{marketStats.gainers} Gainers</span>
                            <span className="text-rose-600 dark:text-red-400">{marketStats.losers} Losers</span>
                        </div>
                        <div className="h-1.5 w-full bg-red-200 dark:bg-red-950/60 rounded-full overflow-hidden flex">
                            <div 
                                className="bg-emerald-500 dark:bg-primary-green h-full transition-all duration-300"
                                style={{ 
                                    width: `${marketStats.totalCoins > 0 ? (marketStats.gainers / marketStats.totalCoins) * 100 : 50}%` 
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Metric 4: Top 3 Performers */}
                <div className="bg-white dark:bg-dark-card rounded-xl p-3 sm:p-3.5 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-xs uppercase font-medium tracking-wider text-gray-500 dark:text-gray-400">
                            Top 3 Performers
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-primary-green bg-green-50 dark:bg-green-950/40 px-1.5 py-0.5 rounded uppercase font-mono">
                            24h
                        </span>
                    </div>
                    <div className="mt-1.5 space-y-1">
                        {marketStats.topPerformers.length > 0 ? (
                            marketStats.topPerformers.map((coin, idx) => (
                                <button
                                    key={coin.id}
                                    onClick={() => handleRowClick(coin)}
                                    className="w-full flex items-center justify-between p-1 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left group"
                                    title={`View ${coin.name} details`}
                                >
                                    <div className="flex items-center gap-1.5 min-w-0">
                                        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 font-mono w-3.5 shrink-0">
                                            #{idx + 1}
                                        </span>
                                        <img src={coin.image} alt="" className="w-4 h-4 rounded-full shrink-0" />
                                        <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate group-hover:text-primary-green transition-colors">
                                            {coin.name}
                                        </span>
                                    </div>
                                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-primary-green tabular-nums shrink-0 ml-1">
                                        +{(coin.price_change_percentage_24h ?? 0).toFixed(1)}%
                                    </span>
                                </button>
                            ))
                        ) : (
                            <span className="text-xs text-gray-400">Analyzing...</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Stable Control Toolbar: Filter Tabs + Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
                {/* Left: Filter Buttons */}
                <div className="flex items-center gap-1.5 p-1 bg-gray-100 dark:bg-dark-card/90 rounded-xl border border-gray-200/80 dark:border-gray-800 shrink-0">
                    {filterButtons.map(({ mode, label, count }) => (
                        <button
                            key={mode}
                            onClick={() => handleFilterChange(mode)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                                filterMode === mode
                                    ? 'bg-white dark:bg-primary-blue text-gray-900 dark:text-white shadow-sm border border-gray-200 dark:border-gray-700'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                        >
                            <span>{label}</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                                filterMode === mode
                                    ? 'bg-primary-green/20 text-emerald-700 dark:text-primary-green font-bold'
                                    : 'bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                            }`}>
                                {count}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Right: Search Input */}
                <div className="relative flex-grow sm:flex-grow-0 sm:w-72">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search coin or symbol..."
                        className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-1 focus:ring-primary-green text-gray-900 dark:text-white shadow-sm placeholder-gray-400"
                        onChange={(e) => setSearchTerm(e.target.value)}
                        value={searchTerm}
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-white text-xs"
                            title="Clear search"
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>

            {/* Desktop Table View - Static, Fixed Columns, Pinned Sticky Header */}
            <div className="hidden md:block bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                <table className="w-full table-fixed border-separate border-spacing-0">
                    <colgroup>
                        <col className="w-12 sm:w-14" />
                        <col className="w-auto min-w-[160px]" />
                        <col className="w-28 sm:w-32" />
                        <col className="w-20 sm:w-24 hidden lg:table-column" />
                        <col className="w-20 sm:w-24" />
                        <col className="w-20 sm:w-24" />
                        <col className="w-28 sm:w-36" />
                        <col className="w-28 sm:w-36" />
                        <col className="w-32 sm:w-36 hidden lg:table-column" />
                    </colgroup>
                    <thead>
                        <tr>
                            <th className="sticky top-20 z-20 bg-gray-50/98 dark:bg-dark-card/98 backdrop-blur-md border-b-2 border-gray-200 dark:border-gray-700 px-3 py-3.5 text-center text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider rounded-tl-xl shadow-sm">
                                #
                            </th>
                            <th className="sticky top-20 z-20 bg-gray-50/98 dark:bg-dark-card/98 backdrop-blur-md border-b-2 border-gray-200 dark:border-gray-700 px-4 py-3.5 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider shadow-sm">
                                <button className="flex items-center gap-1.5 hover:text-primary-green transition-colors" onClick={() => requestSort('name')} title="Sort by Asset Name">
                                    Asset {getSortIndicator('name')}
                                </button>
                            </th>
                            <th className="sticky top-20 z-20 bg-gray-50/98 dark:bg-dark-card/98 backdrop-blur-md border-b-2 border-gray-200 dark:border-gray-700 px-4 py-3.5 text-right text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider shadow-sm">
                                <button className="flex items-center justify-end gap-1.5 ml-auto hover:text-primary-green transition-colors" onClick={() => requestSort('current_price')} title="Sort by Current Price">
                                    Price {getSortIndicator('current_price')}
                                </button>
                            </th>
                            <th className="sticky top-20 z-20 bg-gray-50/98 dark:bg-dark-card/98 backdrop-blur-md border-b-2 border-gray-200 dark:border-gray-700 px-3 py-3.5 text-right text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider hidden lg:table-cell shadow-sm">
                                <button className="flex items-center justify-end gap-1.5 ml-auto hover:text-primary-green transition-colors" onClick={() => requestSort('price_change_percentage_1h_in_currency')} title="Sort by 1-Hour Price % Change">
                                    1h % {getSortIndicator('price_change_percentage_1h_in_currency')}
                                </button>
                            </th>
                            <th className="sticky top-20 z-20 bg-gray-50/98 dark:bg-dark-card/98 backdrop-blur-md border-b-2 border-gray-200 dark:border-gray-700 px-3 py-3.5 text-right text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider shadow-sm">
                                <button className="flex items-center justify-end gap-1.5 ml-auto hover:text-primary-green transition-colors" onClick={() => requestSort('price_change_percentage_24h')} title="Sort by 24-Hour Price % Change">
                                    24h % {getSortIndicator('price_change_percentage_24h')}
                                </button>
                            </th>
                            <th className="sticky top-20 z-20 bg-gray-50/98 dark:bg-dark-card/98 backdrop-blur-md border-b-2 border-gray-200 dark:border-gray-700 px-3 py-3.5 text-right text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider shadow-sm">
                                <button className="flex items-center justify-end gap-1.5 ml-auto hover:text-primary-green transition-colors" onClick={() => requestSort('price_change_percentage_7d_in_currency')} title="Sort by 7-Day Price % Change">
                                    7d % {getSortIndicator('price_change_percentage_7d_in_currency')}
                                </button>
                            </th>
                            <th className="sticky top-20 z-20 bg-gray-50/98 dark:bg-dark-card/98 backdrop-blur-md border-b-2 border-gray-200 dark:border-gray-700 px-4 py-3.5 text-right text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider shadow-sm">
                                <button className="flex items-center justify-end gap-1.5 ml-auto hover:text-primary-green transition-colors" onClick={() => requestSort('total_volume')} title="Sort by 24-Hour Volume">
                                    24h Volume {getSortIndicator('total_volume')}
                                </button>
                            </th>
                            <th className="sticky top-20 z-20 bg-gray-50/98 dark:bg-dark-card/98 backdrop-blur-md border-b-2 border-gray-200 dark:border-gray-700 px-4 py-3.5 text-right text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider rounded-tr-xl lg:rounded-none shadow-sm">
                                <button className="flex items-center justify-end gap-1.5 ml-auto hover:text-primary-green transition-colors" onClick={() => requestSort('market_cap')} title="Sort by Market Cap">
                                    Market Cap {getSortIndicator('market_cap')}
                                </button>
                            </th>
                            <th className="sticky top-20 z-20 bg-gray-50/98 dark:bg-dark-card/98 backdrop-blur-md border-b-2 border-gray-200 dark:border-gray-700 px-4 py-3.5 text-right text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider hidden lg:table-cell rounded-tr-xl shadow-sm">
                                Last 7 Days
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading && contextCoins.length === 0
                            ? renderLoadingErrorOrEmpty() 
                            : error && contextCoins.length === 0
                                ? renderLoadingErrorOrEmpty() 
                                : coinsToDisplay.length === 0 
                                    ? renderLoadingErrorOrEmpty() 
                                    : coinsToDisplay.map((coin, index) => {
                                        const is24hPositive = (coin.price_change_percentage_24h ?? 0) >= 0;
                                        const is1hPositive = (coin.price_change_percentage_1h_in_currency ?? 0) >= 0;
                                        const is7dPositive = (coin.price_change_percentage_7d_in_currency ?? 0) >= 0;

                                        return (
                                            <tr 
                                                key={coin.id} 
                                                className="h-14 hover:bg-gray-50/80 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                                                onClick={() => handleRowClick(coin)}
                                            >
                                                {/* Rank # */}
                                                <td className="px-3 py-3 text-center text-xs font-semibold text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-800/80">
                                                    {index + 1}
                                                </td>

                                                {/* Asset: Icon, Name, Symbol */}
                                                <td className="px-4 py-3 whitespace-nowrap border-b border-gray-100 dark:border-gray-800/80">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <img className="h-8 w-8 rounded-full shrink-0" src={coin.image} alt={coin.name} />
                                                        <div className="min-w-0">
                                                            <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                                                {coin.name}
                                                            </div>
                                                            <div className="text-[11px] font-mono font-medium text-gray-500 dark:text-gray-400 uppercase">
                                                                {coin.symbol}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Price */}
                                                <td className="px-4 py-3 whitespace-nowrap text-right font-mono tabular-nums text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800/80">
                                                    {formatPrice(coin.current_price)}
                                                </td>

                                                {/* 1h % */}
                                                <td className={`px-3 py-3 whitespace-nowrap text-right font-mono tabular-nums text-xs font-semibold hidden lg:table-cell border-b border-gray-100 dark:border-gray-800/80 ${is1hPositive ? 'text-emerald-600 dark:text-primary-green' : 'text-rose-600 dark:text-red-400'}`}>
                                                    {formatPercent(coin.price_change_percentage_1h_in_currency)}
                                                </td>

                                                {/* 24h % */}
                                                <td className={`px-3 py-3 whitespace-nowrap text-right font-mono tabular-nums text-xs font-semibold border-b border-gray-100 dark:border-gray-800/80 ${is24hPositive ? 'text-emerald-600 dark:text-primary-green' : 'text-rose-600 dark:text-red-400'}`}>
                                                    {formatPercent(coin.price_change_percentage_24h)}
                                                </td>

                                                {/* 7d % */}
                                                <td className={`px-3 py-3 whitespace-nowrap text-right font-mono tabular-nums text-xs font-semibold border-b border-gray-100 dark:border-gray-800/80 ${is7dPositive ? 'text-emerald-600 dark:text-primary-green' : 'text-rose-600 dark:text-red-400'}`}>
                                                    {formatPercent(coin.price_change_percentage_7d_in_currency)}
                                                </td>

                                                {/* 24h Volume */}
                                                <td className="px-4 py-3 whitespace-nowrap text-right font-mono tabular-nums text-xs font-medium text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800/80">
                                                    {formatCompact(coin.total_volume)}
                                                </td>

                                                {/* Market Cap */}
                                                <td className="px-4 py-3 whitespace-nowrap text-right font-mono tabular-nums text-xs font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-gray-800/80">
                                                    {formatCompact(coin.market_cap)}
                                                </td>

                                                {/* 7d Chart */}
                                                <td className="px-4 py-3 whitespace-nowrap text-right hidden lg:table-cell border-b border-gray-100 dark:border-gray-800/80">
                                                    <div className="w-[120px] h-[40px] ml-auto">
                                                        <PriceChart data={coin.sparkline_in_7d?.price || []} />
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View - Static, Structured Cards */}
            <div className="md:hidden space-y-3">
                {isLoading && contextCoins.length === 0
                    ? renderLoadingErrorOrEmpty(true) 
                    : error && contextCoins.length === 0
                        ? renderLoadingErrorOrEmpty(true) 
                        : coinsToDisplay.length === 0 
                            ? renderLoadingErrorOrEmpty(true) 
                            : coinsToDisplay.map((coin, index) => (
                                <CoinCard 
                                    key={coin.id} 
                                    coin={coin} 
                                    rank={index + 1}
                                    onClick={handleRowClick} 
                                />
                            ))}
            </div>

            {selectedCoin && (
                <CoinDetailModal coin={selectedCoin} onClose={() => setSelectedCoin(null)} />
            )}
        </div>
    </div>
    );
};
