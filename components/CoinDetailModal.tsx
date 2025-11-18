import React, { useEffect, useRef } from 'react';
import type { Coin } from '../types';
import { DetailedPriceChart } from './DetailedPriceChart';

interface CoinDetailModalProps {
    coin: Coin;
    onClose: () => void;
}

const StatCard: React.FC<{ label: string; value: string; className?: string }> = ({ label, value, className }) => (
    <div className="bg-gray-100 dark:bg-dark-bg p-4 rounded-lg">
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className={`text-lg font-semibold text-gray-900 dark:text-white ${className}`}>{value}</p>
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
                            ${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                        </p>
                        <div className="h-64 w-full bg-gray-100 dark:bg-dark-bg rounded-lg">
                           <DetailedPriceChart data={coin.sparkline_in_7d?.price} />
                        </div>
                    </div>

                    {/* Key Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <StatCard 
                            label="24h Change"
                            value={`${coin.price_change_percentage_24h?.toFixed(2) ?? 'N/A'}%`}
                            className={(coin.price_change_percentage_24h ?? 0) >= 0 ? 'text-primary-green' : 'text-red-500'}
                        />
                         <StatCard 
                            label="Market Cap"
                            value={coin.market_cap ? `$${coin.market_cap.toLocaleString()}` : 'N/A'}
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
