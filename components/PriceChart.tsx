import React from 'react';
import { LineChart, Line, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface PriceChartProps {
    data: number[];
}

const CustomTooltip: React.FC<any> = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-dark-card p-2 border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-white text-xs shadow-lg">
                <p>{`$${payload[0].value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`}</p>
            </div>
        );
    }
    return null;
};


export const PriceChart: React.FC<PriceChartProps> = ({ data }) => {
    if (!data || data.length === 0) {
        return <div className="text-xs text-gray-500">No data</div>;
    }

    const chartData = data.map((price) => ({ price }));
    
    const firstPrice = data[0];
    const lastPrice = data[data.length - 1];
    const strokeColor = lastPrice >= firstPrice ? '#00C853' : '#EF4444'; // green or red

    return (
        <div style={{ width: '120px', height: '40px' }}>
            <ResponsiveContainer>
                <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <Tooltip 
                        content={<CustomTooltip />} 
                        cursor={{ stroke: 'rgba(100, 116, 139, 0.5)', strokeWidth: 1, strokeDasharray: '3 3' }} 
                    />
                    <YAxis domain={['dataMin', 'dataMax']} hide={true} />
                    <Line
                        type="monotone"
                        dataKey="price"
                        stroke={strokeColor}
                        strokeWidth={2}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};
