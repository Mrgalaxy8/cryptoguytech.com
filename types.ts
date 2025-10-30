export enum PageType {
    Home = 'Home',
    Academy = 'Academy',
    Tracker = 'Tracker',
    Community = 'Community',
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
  market_cap: number;
  price_change_percentage_24h: number;
  sparkline_in_7d?: {
    price: number[];
  };
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}