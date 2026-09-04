import React, { useState, useEffect, useRef } from 'react';
import type { Coin, TimeRange, HistoricalPriceData } from '../types';
import { DetailedPriceChart } from './DetailedPriceChart';
import { fetchHistoricalData, buildFromSparkline } from '../services/historicalPriceService';

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

const formatCurrency = (val?: number | null, maxDecimals = 2): string => {
    if (val == null || isNaN(val)) return 'N/A';
    return `$${val.toLocaleString(undefined, {
        minimumFractionDigits: val < 1 ? 4 : 2,
        maximumFractionDigits: val < 1 ? 6 : maxDecimals
    })}`;
};

const StatCard: React.FC<{ label: string; value: string; subValue?: string; className?: string }> = ({ label, value, subValue, className }) => (
    <div className="bg-gray-50 dark:bg-dark-bg p-3.5 rounded-xl border border-gray-200 dark:border-gray-800">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
        <p className={`text-base sm:text-lg font-bold font-mono tabular-nums text-gray-900 dark:text-white mt-0.5 truncate ${className}`}>{value}</p>
        {subValue && <p className="text-[11px] font-mono text-gray-400 dark:text-gray-500 truncate">{subValue}</p>}
    </div>
);

const TIME_RANGE_OPTIONS: { id: TimeRange; label: string; periodName: string }[] = [
    { id: '7D', label: '7D', periodName: 'Past 7 Days' },
    { id: '1M', label: '1M', periodName: 'Past 1 Month' },
    { id: '3M', label: '3M', periodName: 'Past 3 Months' },
    { id: 'YTD', label: 'YTD', periodName: 'Year to Date' },
    { id: '1Y', label: '1Y', periodName: 'Past 1 Year' },
    { id: 'MAX', label: 'MAX', periodName: 'All Time' },
];

export const CoinDetailModal: React.FC<CoinDetailModalProps> = ({ coin, onClose }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [selectedRange, setSelectedRange] = useState<TimeRange>('7D');
    const [chartData, setChartData] = useState<HistoricalPriceData | null>(() => buildFromSparkline(coin));
    const [isLoadingChart, setIsLoadingChart] = useState<boolean>(false);

    // Fetch or calculate price data when coin or selected time range changes
    useEffect(() => {
        let isSubscribed = true;

        if (selectedRange === '7D' && coin.sparkline_in_7d?.price?.length) {
            setChartData(buildFromSparkline(coin));
            setIsLoadingChart(false);
            return;
        }

        setIsLoadingChart(true);
        fetchHistoricalData(coin, selectedRange)
            .then(data => {
                if (isSubscribed) {
                    setChartData(data);
                    setIsLoadingChart(false);
                }
            })
            .catch(() => {
                if (isSubscribed) {
                    setIsLoadingChart(false);
                }
            });

        return () => {
            isSubscribed = false;
        };
    }, [selectedRange, coin]);

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    // Close on backdrop click
    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            onClose();
        }
    };

    const activeRangeInfo = TIME_RANGE_OPTIONS.find(opt => opt.id === selectedRange) || TIME_RANGE_OPTIONS[0];
    const isGain = (chartData?.changePercent ?? 0) >= 0;

    return (
        <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 animate-fade-in"
            onClick={handleBackdropClick}
        >
            <div 
                ref={modalRef}
                className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col border border-gray-200 dark:border-gray-800 overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-dark-card/50">
                    <div className="flex items-center gap-3.5">
                        <img 
                            src={coin.image} 
                            alt={coin.name} 
                            className="w-10 h-10 rounded-full ring-2 ring-gray-100 dark:ring-gray-800 shadow-sm" 
                            onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.display = 'none';
                            }}
                        />
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight">{coin.name}</h2>
                                <span className="px-2 py-0.5 rounded text-[11px] font-bold font-mono tracking-wider uppercase bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                                    {coin.symbol}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                Live Interactive Price Movement
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-2xl font-light"
                        aria-label="Close modal"
                    >
                        &times;
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
                    {/* Price Header & Timeframe Switcher */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                Current Price
                            </span>
                            <div className="flex items-baseline gap-3 mt-0.5">
                                <p className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-gray-900 dark:text-white">
                                    {coin.current_price != null ? formatCurrency(coin.current_price, 2) : 'N/A'}
                                </p>
                            </div>

                            {/* Dynamic Movement for the selected time range */}
                            {chartData && (
                                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                    <span className={`inline-flex items-center gap-1 text-xs sm:text-sm font-mono font-bold px-2 py-0.5 rounded-md ${
                                        isGain 
                                            ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60' 
                                            : 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60'
                                    }`}>
                                        <span>{isGain ? '▲' : '▼'}</span>
                                        <span>{isGain ? '+' : ''}{chartData.changePercent.toFixed(2)}%</span>
                                        <span className="text-[11px] opacity-80">
                                            ({isGain ? '+$' : '-$'}{Math.abs(chartData.changeAmount).toLocaleString(undefined, { maximumFractionDigits: 2 })})
                                        </span>
                                    </span>
                                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                        {activeRangeInfo.periodName}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Interactive Time Range Buttons: 7D, 1M, 3M, YTD, 1Y, MAX */}
                        <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-dark-bg/90 rounded-xl border border-gray-200/80 dark:border-gray-800 self-start sm:self-auto shadow-inner">
                            {TIME_RANGE_OPTIONS.map((opt) => {
                                const isActive = selectedRange === opt.id;
                                return (
                                    <button
                                        key={opt.id}
                                        onClick={() => setSelectedRange(opt.id)}
                                        className={`px-3 py-1.5 text-xs font-bold font-mono rounded-lg transition-all duration-200 ${
                                            isActive
                                                ? 'bg-primary-green text-primary-blue shadow-sm shadow-primary-green/30 scale-[1.02]'
                                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-gray-800/60'
                                        }`}
                                        title={`Show ${opt.periodName} movement`}
                                        aria-pressed={isActive}
                                    >
                                        {opt.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Chart Container */}
                    <div className="relative">
                        <div className="h-64 sm:h-72 w-full bg-gray-50/60 dark:bg-dark-bg/50 rounded-2xl p-2.5 border border-gray-200/80 dark:border-gray-800/80">
                            <DetailedPriceChart 
                                points={chartData?.points}
                                timeRange={selectedRange}
                                changePercent={chartData?.changePercent}
                                isLoading={isLoadingChart}
                            />
                        </div>

                        {/* Period High / Low Summary Pill Bar */}
                        {chartData && (
                            <div className="flex items-center justify-between px-3 py-2 mt-2 bg-gray-50 dark:bg-dark-bg/60 rounded-xl border border-gray-100 dark:border-gray-800 text-xs font-mono">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-gray-500 dark:text-gray-400">Period Low:</span>
                                    <span className="font-semibold text-rose-600 dark:text-rose-400">
                                        {formatCurrency(chartData.lowPrice)}
                                    </span>
                                </div>
                                <div className="hidden sm:flex items-center gap-1.5">
                                    <span className="text-gray-500 dark:text-gray-400">Range:</span>
                                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                                        {activeRangeInfo.periodName}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-gray-500 dark:text-gray-400">Period High:</span>
                                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                        {formatCurrency(chartData.highPrice)}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Key Market Stats Grid */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                            Market Performance & Fundamentals
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <StatCard 
                                label="1h Change"
                                value={coin.price_change_percentage_1h_in_currency != null ? `${coin.price_change_percentage_1h_in_currency.toFixed(2)}%` : 'N/A'}
                                className={(coin.price_change_percentage_1h_in_currency ?? 0) >= 0 ? 'text-primary-green' : 'text-rose-500'}
                            />
                            <StatCard 
                                label="24h Change"
                                value={`${coin.price_change_percentage_24h?.toFixed(2) ?? 'N/A'}%`}
                                className={(coin.price_change_percentage_24h ?? 0) >= 0 ? 'text-primary-green' : 'text-rose-500'}
                            />
                            <StatCard 
                                label="7d Change"
                                value={coin.price_change_percentage_7d_in_currency != null ? `${coin.price_change_percentage_7d_in_currency.toFixed(2)}%` : 'N/A'}
                                className={(coin.price_change_percentage_7d_in_currency ?? 0) >= 0 ? 'text-primary-green' : 'text-rose-500'}
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
                                subValue={coin.name}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
