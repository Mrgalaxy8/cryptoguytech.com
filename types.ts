export enum PageType {
    About = 'About',
    Academy = 'Academy',
    Tracker = 'Tracker',
    Community = 'Community',
    Donate = 'Donate',
}

export type Page = PageType;

// FIX: Added missing Theme enum to resolve import errors.
export enum Theme {
    Light = 'light',
    Dark = 'dark',
}

export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number | null;
  price_change_percentage_24h: number | null;
  price_change_percentage_1h_in_currency: number | null;
  price_change_percentage_7d_in_currency: number | null;
  total_volume: number | null;
  sparkline_in_7d: { price: number[] };
}

export type TimeRange = '7D' | '1M' | '3M' | 'YTD' | '1Y' | 'MAX';

export interface ChartPoint {
  index: number;
  timestamp: number;
  price: number;
  formattedDate: string;
  shortLabel: string;
}

export interface HistoricalPriceData {
  timeRange: TimeRange;
  points: ChartPoint[];
  changePercent: number;
  changeAmount: number;
  highPrice: number;
  lowPrice: number;
  startPrice: number;
  endPrice: number;
  isSimulated?: boolean;
}
