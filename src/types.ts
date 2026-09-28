export type MarketCategory =
  | 'US stocks'
  | 'World stocks'
  | 'Crypto'
  | 'Futures'
  | 'Forex'
  | 'Government bonds'
  | 'Corporate bonds'
  | 'ETFs'
  | 'Economy';

export type SubTab = 'Most active' | 'Gainers' | 'Losers' | 'All-time high' | 'Volume leaders';

export type TechRating = 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';

export interface MarketIndex {
  id: string;
  badge: string;
  badgeBg: string;
  name: string;
  ticker: string;
  exchange: string;
  price: number;
  changePts: number;
  changePct: number;
  sparkline: number[];
  category: MarketCategory;
  currency?: string;
  high52w?: number;
  low52w?: number;
  volume?: string;
}

export interface StockMover {
  ticker: string;
  name: string;
  symbolBadge: string;
  symbolBg: string;
  price: number;
  changeDollar: number;
  changePct: number;
  techRating: TechRating;
  sparkline: number[];
  volume: string;
  rawVolume: number;
  marketCap: string;
  rawMarketCap: number;
  peRatio: number | string;
  sector: string;
  dayHigh?: number;
  dayLow?: number;
  openPrice?: number;
  description?: string;
}

export interface TickerTapeItem {
  symbol: string;
  name?: string;
  price: string;
  change: string;
  isPositive: boolean;
}

export interface SectorPerformance {
  name: string;
  changePct: number;
  weightPct: number;
  leadingStock: string;
  subSectors?: { name: string; changePct: number }[];
}

export interface EconomicEvent {
  id: string;
  time: string;
  country: string;
  countryFlag: string;
  title: string;
  actual?: string;
  forecast?: string;
  previous: string;
  impact: 'High' | 'Medium' | 'Low';
  description?: string;
  period?: string;
}
