import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DetailedPriceChartProps {
    data: number[];
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-dark-card p-2 border border-gray-700 rounded-md text-white text-xs shadow-lg">
                <p>{`Price: $${payload[0].value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`}</p>
            </div>
        );
    }
    return null;
};

export const DetailedPriceChart: React.FC<DetailedPriceChartProps> = ({ data }) => {
    if (!data || data.length === 0) {
        return <div className="flex items-center justify-center h-full text-gray-500">No chart data available.</div>;
    }

    const chartData = data.map((price, index) => ({ index, price }));
    
    const dayLabels = useMemo(() => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = new Date().getDay();
        const result = [];
        for (let i = 0; i < 7; i++) {
            // Go back 6 days from today, then move forward
            result.push(days[(today - 6 + i + 7) % 7]);
        }
        return result;
    }, []);

    const tickFormatter = (index: number) => {
        if (index >= chartData.length) return '';
        // Approximate points per day (usually ~24)
        const pointsPerDay = chartData.length / 7;
        const dayIndex = Math.floor(index / pointsPerDay);
        return dayLabels[dayIndex] || '';
    };

    const firstPrice = data[0];
    const lastPrice = data[data.length - 1];
    const strokeColor = lastPrice >= firstPrice ? '#00C853' : '#EF4444';

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={chartData}
                margin={{
                    top: 5,
                    right: 20,
                    left: -10,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis 
                    dataKey="index" 
                    tickFormatter={tickFormatter}
                    interval={Math.floor(chartData.length / 7)} // Show a tick for each day
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    axisLine={{ stroke: '#4b5563' }}
                    tickLine={{ stroke: '#4b5563' }}
                    padding={{ left: 20, right: 20 }}
                />
                <YAxis 
                    domain={['auto', 'auto']}
                    tickFormatter={(value: number) => `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    axisLine={{ stroke: '#4b5563' }}
                    tickLine={{ stroke: '#4b5563' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="price" stroke={strokeColor} strokeWidth={2} dot={false} />
            </LineChart>
        </ResponsiveContainer>
    );
};