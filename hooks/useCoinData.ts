import { useContext } from 'react';
import { CoinDataContext } from '../context/CoinDataContext';

export const useCoinData = () => {
    const context = useContext(CoinDataContext);
    if (context === undefined) {
        throw new Error('useCoinData must be used within a CoinDataProvider');
    }
    return context;
};