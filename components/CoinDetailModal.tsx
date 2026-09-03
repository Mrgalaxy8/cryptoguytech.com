import React, { useEffect, useRef } from 'react';
import type { Coin } from '../types';
import { DetailedPriceChart } from './DetailedPriceChart';

interface CoinDetailModalProps {
    coin: Coin;
    onClose: () => void;
}

const formatCompact = (val?: number | null): string => {
    if (val == null || isNaN(val)) return 'N/A';
    if (val >= 1e12) return `$${(val / 1e12).toFixed(2)}T`;
    if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
    if (val >= 1e6) return `$${(val / 1e6).toFixed(2)}M`;
    return `$${val.toLocaleString()}`;
};

const StatCard: React.FC<{ label: string; value: string; subValue?: string; className?: string }> = ({ label, value, subValue, className }) => (
    <div className="bg-gray-50 dark:bg-dark-bg p-3.5 rounded-xl border border-gray-200 dark:border-gray-800">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
        <p className={`text-base sm:text-lg font-bold font-mono tabular-nums text-gray-900 dark:text-white mt-0.5 truncate ${className}`}>{value}</p>
        {subValue && <p className="text-[11px] font-mono text-gray-400 dark:text-gray-500 truncate">{subValue}</p>}
    </div>
);


export const CoinDetailModal: React.FC<CoinDetailModalProps> = ({ coin, onClose }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            onClose();
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in"
            onClick={handleBackdropClick}
        >
            <div 
                ref={modalRef}
                className="bg-white dark:bg-dark-card rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-gray-200 dark:border-gray-700"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                        <img src={coin.image} alt={coin.name} className="w-10 h-10 rounded-full" />
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{coin.name}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{coin.symbol.toUpperCase()}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-800 dark:hover:text-white text-3xl">&times;</button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto">
                    {/* Price & Chart */}
                    <div className="mb-6">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Current Price</p>
                        <p className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            {coin.current_price != null ? `$${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}` : 'N/A'}
                        </p>
                        <div className="h-64 w-full bg-gray-100 dark:bg-dark-bg rounded-lg">
                           <DetailedPriceChart data={coin.sparkline_in_7d?.price} />
                        </div>
                    </div>

                    {/* Key Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <StatCard 
                            label="1h Change"
                            value={coin.price_change_percentage_1h_in_currency != null ? `${coin.price_change_percentage_1h_in_currency.toFixed(2)}%` : 'N/A'}
                            className={(coin.price_change_percentage_1h_in_currency ?? 0) >= 0 ? 'text-primary-green' : 'text-red-500'}
                        />
                        <StatCard 
                            label="24h Change"
                            value={`${coin.price_change_percentage_24h?.toFixed(2) ?? 'N/A'}%`}
                            className={(coin.price_change_percentage_24h ?? 0) >= 0 ? 'text-primary-green' : 'text-red-500'}
                        />
                        <StatCard 
                            label="7d Change"
                            value={coin.price_change_percentage_7d_in_currency != null ? `${coin.price_change_percentage_7d_in_currency.toFixed(2)}%` : 'N/A'}
                            className={(coin.price_change_percentage_7d_in_currency ?? 0) >= 0 ? 'text-primary-green' : 'text-red-500'}
                        />
                         <StatCard 
                            label="24h Volume"
                            value={formatCompact(coin.total_volume)}
                            subValue={coin.total_volume ? `$${coin.total_volume.toLocaleString()}` : undefined}
                        />
                         <StatCard 
                            label="Market Cap"
                            value={formatCompact(coin.market_cap)}
                            subValue={coin.market_cap ? `$${coin.market_cap.toLocaleString()}` : undefined}
                        />
                         <StatCard 
                            label="Symbol"
                            value={coin.symbol.toUpperCase()}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
