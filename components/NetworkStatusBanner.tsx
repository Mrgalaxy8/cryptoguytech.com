import React from 'react';
import { useCoinData } from '../hooks/useCoinData';

export const NetworkStatusBanner: React.FC = () => {
    const { error, coins } = useCoinData();

    // Only show the banner if there's an error but we have cached data to display.
    if (!error || coins.length === 0) {
        return null;
    }

    return (
        <div role="alert" className="bg-yellow-500/20 border-b-2 border-yellow-400/30 text-yellow-200 text-center py-2 px-4 text-sm">
            <p>
                <span className="font-bold">Connection Issue:</span> {error} Displaying last available data.
            </p>
        </div>
    );
};
