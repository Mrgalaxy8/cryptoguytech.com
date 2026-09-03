import React from 'react';
import type { Coin } from '../types';
import { PriceChart } from './PriceChart';

interface CoinCardProps {
    coin: Coin;
    onClick: (coin: Coin) => void;
    rank?: number;
}

const formatCompactCurrency = (value?: number | null): string => {
    if (value == null || isNaN(value)) return 'N/A';
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toLocaleString()}`;
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

const formatPercent = (val?: number | null) => {
    if (val == null || isNaN(val)) return 'N/A';
    const isPositive = val >= 0;
    return `${isPositive ? '+' : ''}${val.toFixed(2)}%`;
};

export const CoinCard: React.FC<CoinCardProps> = ({ coin, onClick, rank }) => {
    const is24hPositive = (coin.price_change_percentage_24h ?? 0) >= 0;
    const is1hPositive = (coin.price_change_percentage_1h_in_currency ?? 0) >= 0;
    const is7dPositive = (coin.price_change_percentage_7d_in_currency ?? 0) >= 0;

    return (
        <div 
            className="bg-white dark:bg-dark-card rounded-xl shadow-sm hover:shadow-md p-4 flex flex-col gap-3.5 cursor-pointer border border-gray-200 dark:border-gray-800 hover:border-primary-green/50 dark:hover:border-primary-green/40 transition-colors"
            onClick={() => onClick(coin)}
        >
            {/* Top Row: Rank, Icon, Name, Price, 24h Pill */}
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                    {rank != null && (
                        <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 w-6 text-center shrink-0">
                            #{rank}
                        </span>
                    )}
                    <img className="h-9 w-9 rounded-full shrink-0" src={coin.image} alt={coin.name} />
                    <div className="min-w-0">
                        <p className="font-bold text-sm text-gray-900 dark:text-white truncate">
                            {coin.name}
                        </p>
                        <span className="inline-block text-[11px] font-mono font-semibold uppercase px-1.5 py-0.2 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                            {coin.symbol}
                        </span>
                    </div>
                </div>

                <div className="text-right shrink-0">
                    <p className="font-bold font-mono tabular-nums text-sm sm:text-base text-gray-900 dark:text-white">
                        {formatPrice(coin.current_price)}
                    </p>
                    <span 
                        className={`inline-flex items-center text-xs font-mono font-semibold px-2 py-0.5 rounded-md mt-0.5 ${
                            is24hPositive 
                                ? 'bg-green-50 dark:bg-green-950/40 text-emerald-600 dark:text-primary-green' 
                                : 'bg-red-50 dark:bg-red-950/40 text-rose-600 dark:text-red-400'
                        }`}
                    >
                        {is24hPositive ? '▲ ' : '▼ '}
                        {formatPercent(coin.price_change_percentage_24h)}
                    </span>
                </div>
            </div>

            {/* Middle Grid: Arranged stats in static 4-cell layout */}
            <div className="grid grid-cols-4 gap-2 bg-gray-50 dark:bg-dark-bg/60 p-2.5 rounded-lg border border-gray-100 dark:border-gray-800/80 text-center">
                <div>
                    <span className="block text-[10px] uppercase font-medium text-gray-500 dark:text-gray-400 tracking-wider">Market Cap</span>
                    <span className="block text-xs font-mono tabular-nums font-semibold text-gray-800 dark:text-gray-200 mt-0.5 truncate">
                        {formatCompactCurrency(coin.market_cap)}
                    </span>
                </div>
                <div>
                    <span className="block text-[10px] uppercase font-medium text-gray-500 dark:text-gray-400 tracking-wider">24h Vol</span>
                    <span className="block text-xs font-mono tabular-nums font-semibold text-gray-800 dark:text-gray-200 mt-0.5 truncate">
                        {formatCompactCurrency(coin.total_volume)}
                    </span>
                </div>
                <div>
                    <span className="block text-[10px] uppercase font-medium text-gray-500 dark:text-gray-400 tracking-wider">1h %</span>
                    <span className={`block text-xs font-mono tabular-nums font-semibold mt-0.5 ${is1hPositive ? 'text-emerald-600 dark:text-primary-green' : 'text-rose-600 dark:text-red-400'}`}>
                        {formatPercent(coin.price_change_percentage_1h_in_currency)}
                    </span>
                </div>
                <div>
                    <span className="block text-[10px] uppercase font-medium text-gray-500 dark:text-gray-400 tracking-wider">7d %</span>
                    <span className={`block text-xs font-mono tabular-nums font-semibold mt-0.5 ${is7dPositive ? 'text-emerald-600 dark:text-primary-green' : 'text-rose-600 dark:text-red-400'}`}>
                        {formatPercent(coin.price_change_percentage_7d_in_currency)}
                    </span>
                </div>
            </div>

            {/* Bottom Row: 7d Sparkline Chart */}
            <div className="flex items-center justify-between pt-1 border-t border-gray-100 dark:border-gray-800/60">
                <span className="text-[11px] text-gray-400 dark:text-gray-500 font-medium">
                    7-Day Trend
                </span>
                <div className="w-[120px] h-[40px]">
                    <PriceChart data={coin.sparkline_in_7d?.price || []} />
                </div>
            </div>
        </div>
    );
};

