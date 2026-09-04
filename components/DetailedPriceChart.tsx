import React, { useMemo } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { useTheme } from '../hooks/useTheme';
import { Theme, type ChartPoint, type TimeRange } from '../types';

interface DetailedPriceChartProps {
    data?: number[]; // Legacy sparkline array
    points?: ChartPoint[]; // Timestamped chart points
    timeRange?: TimeRange;
    changePercent?: number;
    isLoading?: boolean;
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
        value: number;
        payload: ChartPoint;
    }>;
    startPrice?: number;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, startPrice }) => {
    if (active && payload && payload.length && payload[0].value != null) {
        const item = payload[0].payload;
        const currentVal = payload[0].value;
        const diff = startPrice ? currentVal - startPrice : 0;
        const diffPercent = startPrice ? (diff / startPrice) * 100 : 0;
        const isGain = diff >= 0;

        return (
            <div className="bg-white/95 dark:bg-dark-card/95 backdrop-blur-md p-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-xs shadow-xl min-w-[140px] pointer-events-none">
                <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1">
                    {item.formattedDate || `Point ${item.index + 1}`}
                </p>
                <p className="font-mono text-sm font-bold tracking-tight">
                    ${currentVal.toLocaleString(undefined, {
                        minimumFractionDigits: currentVal < 1 ? 4 : 2,
                        maximumFractionDigits: currentVal < 1 ? 6 : 2
                    })}
                </p>
                {startPrice != null && startPrice > 0 && (
                    <p className={`text-[11px] font-mono font-semibold mt-0.5 ${isGain ? 'text-emerald-600 dark:text-primary-green' : 'text-rose-600 dark:text-red-400'}`}>
                        {isGain ? '+' : ''}{diffPercent.toFixed(2)}% ({isGain ? '+$' : '-$'}{Math.abs(diff).toLocaleString(undefined, { maximumFractionDigits: 2 })})
                    </p>
                )}
            </div>
        );
    }
    return null;
};

export const DetailedPriceChart: React.FC<DetailedPriceChartProps> = ({
    data,
    points: propPoints,
    timeRange = '7D',
    changePercent: propChangePercent,
    isLoading = false
}) => {
    const { theme } = useTheme();

    // Normalize incoming data into ChartPoint[]
    const chartPoints: ChartPoint[] = useMemo(() => {
        if (propPoints && propPoints.length > 0) {
            return propPoints;
        }

        if (data && data.length > 0) {
            const now = Date.now();
            const durationMs = 7 * 24 * 60 * 60 * 1000;
            const step = durationMs / Math.max(1, data.length - 1);
            return data.map((price, index) => {
                const ts = now - durationMs + (index * step);
                return {
                    index,
                    timestamp: ts,
                    price,
                    formattedDate: new Date(ts).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                    }),
                    shortLabel: new Date(ts).toLocaleDateString('en-US', { weekday: 'short' })
                };
            });
        }

        return [];
    }, [propPoints, data]);

    const startPrice = chartPoints[0]?.price ?? 0;
    const endPrice = chartPoints[chartPoints.length - 1]?.price ?? 0;

    const isPositive = useMemo(() => {
        if (propChangePercent !== undefined) {
            return propChangePercent >= 0;
        }
        return endPrice >= startPrice;
    }, [propChangePercent, endPrice, startPrice]);

    if (!chartPoints || chartPoints.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                No price data available for {timeRange}.
            </div>
        );
    }

    const strokeColor = isPositive ? '#00C853' : '#EF4444';
    const gradientId = `chartGradient_${isPositive ? 'green' : 'red'}`;
    const tickColor = theme === Theme.Dark ? '#9ca3af' : '#6b7280';
    const axisLineColor = theme === Theme.Dark ? '#374151' : '#e5e7eb';
    const gridColor = theme === Theme.Dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';

    // Choose tick count according to data length and timeframe
    const tickInterval = Math.max(1, Math.floor(chartPoints.length / 5));

    return (
        <div className="relative w-full h-full">
            {isLoading && (
                <div className="absolute inset-0 bg-white/50 dark:bg-dark-bg/60 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-lg transition-opacity duration-200">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-dark-card shadow-md border border-gray-200 dark:border-gray-700">
                        <div className="w-3.5 h-3.5 border-2 border-primary-green border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Updating {timeRange} chart...</span>
                    </div>
                </div>
            )}

            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <AreaChart
                    data={chartPoints}
                    margin={{
                        top: 10,
                        right: 15,
                        left: -15,
                        bottom: 0,
                    }}
                >
                    <defs>
                        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={strokeColor} stopOpacity={0.25} />
                            <stop offset="95%" stopColor={strokeColor} stopOpacity={0.0} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />

                    <XAxis
                        dataKey="index"
                        tickFormatter={(index: number) => {
                            const pt = chartPoints[index];
                            return pt ? pt.shortLabel : '';
                        }}
                        interval={tickInterval}
                        tick={{ fill: tickColor, fontSize: 11 }}
                        axisLine={{ stroke: axisLineColor }}
                        tickLine={false}
                        padding={{ left: 10, right: 10 }}
                    />

                    <YAxis
                        domain={['auto', 'auto']}
                        tickFormatter={(value: number) => {
                            if (value >= 1000) {
                                return `$${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`;
                            }
                            if (value >= 1) {
                                return `$${value.toFixed(2)}`;
                            }
                            return `$${value.toFixed(4)}`;
                        }}
                        tick={{ fill: tickColor, fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        width={58}
                    />

                    <Tooltip content={<CustomTooltip startPrice={startPrice} />} />

                    <Area
                        type="monotone"
                        dataKey="price"
                        stroke={strokeColor}
                        strokeWidth={2.2}
                        fill={`url(#${gradientId})`}
                        dot={false}
                        activeDot={{
                            r: 4.5,
                            fill: strokeColor,
                            stroke: theme === Theme.Dark ? '#1F2937' : '#FFFFFF',
                            strokeWidth: 2
                        }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};
