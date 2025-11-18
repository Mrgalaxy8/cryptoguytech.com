import React from 'react';
import type { Coin } from '../types';
import { PriceChart } from './PriceChart';

interface CoinCardProps {
    coin: Coin;
    onClick: (coin: Coin) => void;
}

const Stat: React.FC<{ label: string; value: string | React.ReactNode; className?: string }> = ({ label, value, className }) => (
    <div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className={`text-sm font-medium ${className}`}>{value}</p>
    </div>
)

export const CoinCard: React.FC<CoinCardProps> = ({ coin, onClick }) => {
    return (
        <div 
            className="bg-white dark:bg-dark-card rounded-lg shadow-md p-4 flex flex-col gap-4 cursor-pointer transition-transform transform hover:scale-[1.02] border border-gray-200 dark:border-gray-800"
            onClick={() => onClick(coin)}
        >
            {/* Top Section: Icon, Name, Symbol, Chart */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img className="h-10 w-10 rounded-full" src={coin.image} alt={coin.name} />
                    <div>
                        <p className="font-bold text-gray-900 dark:text-white">{coin.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{coin.symbol.toUpperCase()}</p>
                    </div>
                </div>
                <PriceChart data={coin.sparkline_in_7d?.price} />
            </div>

            {/* Bottom Section: Stats */}
            <div className="grid grid-cols-3 gap-4 text-left">
                <Stat 
                    label="Price"
                    value={`$${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`}
                    className="text-gray-900 dark:text-white"
                />
                 <Stat 
                    label="24h %"
                    value={`${coin.price_change_percentage_24h?.toFixed(2) ?? 'N/A'}%`}
                    className={(coin.price_change_percentage_24h ?? 0) >= 0 ? 'text-primary-green' : 'text-red-500'}
                />
                 <Stat 
                    label="Market Cap"
                    value={coin.market_cap != null ? `$${(coin.market_cap / 1_000_000_000).toFixed(2)}B` : 'N/A'}
                    className="text-gray-900 dark:text-white"
                />
            </div>
        </div>
    )
}
