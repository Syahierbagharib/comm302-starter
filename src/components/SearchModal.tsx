import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, X, ArrowRight, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { ALL_STOCKS, INITIAL_INDICES } from '../data/marketData';
import { StockMover } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStock: (stock: StockMover) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectStock }) => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Stocks' | 'Indices' | 'Crypto'>('All');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle keyboard events (Escape, ArrowUp, ArrowDown, Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredItems = useMemo(() => {
    const q = query.toLowerCase().trim();
    let results: StockMover[] = [];

    if (activeTab === 'All' || activeTab === 'Stocks') {
      results = results.concat(ALL_STOCKS);
    }

    if (activeTab === 'All' || activeTab === 'Indices') {
      // Map indices into StockMover-compatible shapes
      const usIndices = INITIAL_INDICES['US stocks'].map((idx) => ({
        ticker: idx.ticker,
        name: idx.name,
        symbolBadge: idx.badge,
        symbolBg: idx.badgeBg,
        price: idx.price,
        changeDollar: idx.changePts,
        changePct: idx.changePct,
        techRating: (idx.changePct >= 0 ? 'Buy' : 'Neutral') as any,
        sparkline: idx.sparkline,
        volume: idx.volume || '2.5B',
        rawVolume: 2500000000,
        marketCap: '$45T',
        rawMarketCap: 45000000000000,
        peRatio: '24.2',
        sector: 'Index'
      }));
      results = results.concat(usIndices);
    }

    if (activeTab === 'All' || activeTab === 'Crypto') {
      const cryptos = INITIAL_INDICES['Crypto'].map((c) => ({
        ticker: c.ticker,
        name: c.name,
        symbolBadge: c.badge,
        symbolBg: c.badgeBg,
        price: c.price,
        changeDollar: c.changePts,
        changePct: c.changePct,
        techRating: (c.changePct >= 0 ? 'Strong Buy' : 'Neutral') as any,
        sparkline: c.sparkline,
        volume: c.volume || '$10B',
        rawVolume: 10000000000,
        marketCap: '$1.8T',
        rawMarketCap: 1800000000000,
        peRatio: '—',
        sector: 'Crypto'
      }));
      results = results.concat(cryptos);
    }

    if (!q) {
      return results.slice(0, 8);
    }

    return results
      .filter(
        (item) =>
          item.ticker.toLowerCase().includes(q) ||
          item.name.toLowerCase().includes(q) ||
          item.sector.toLowerCase().includes(q)
      )
      .slice(0, 10);
  }, [query, activeTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-tv-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-tv-border overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search header bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-tv-border bg-white">
          <Search className="w-5 h-5 text-tv-gray shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tickers, companies, indices, or crypto..."
            className="flex-1 bg-transparent text-tv-black placeholder:text-tv-gray text-base focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-tv-gray hover:text-tv-black rounded hover:bg-tv-lightGray"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-block px-1.5 py-0.5 text-[11px] font-mono font-semibold bg-tv-lightGray text-tv-gray rounded border border-tv-border">
            ESC to close
          </span>
          <button
            onClick={onClose}
            className="sm:hidden p-1 text-tv-gray hover:text-tv-black rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1 px-4 py-2 bg-tv-ultraLight border-b border-tv-border text-xs overflow-x-auto custom-scrollbar">
          {(['All', 'Stocks', 'Indices', 'Crypto'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-full font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-tv-black text-white'
                  : 'text-tv-gray hover:text-tv-black hover:bg-tv-lightGray'
              }`}
            >
              {tab}
            </button>
          ))}
          <span className="ml-auto text-[11px] text-tv-gray hidden sm:block">
            {filteredItems.length} results
          </span>
        </div>

        {/* Search Results List */}
        <div className="overflow-y-auto custom-scrollbar divide-y divide-tv-border p-2">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-tv-gray">
              <p className="text-sm font-medium">No results found for "{query}"</p>
              <p className="text-xs mt-1 text-tv-gray/80">Try searching for AAPL, NVDA, SPX, Bitcoin, or Tech</p>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isPos = item.changePct >= 0;
              return (
                <div
                  key={`${item.ticker}-${index}`}
                  onClick={() => {
                    onSelectStock(item);
                    onClose();
                  }}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedIndex === index ? 'bg-tv-lightGray' : 'hover:bg-tv-ultraLight'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs"
                      style={{ backgroundColor: item.symbolBg }}
                    >
                      {item.symbolBadge}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-tv-black">{item.ticker}</span>
                        <span className="text-[11px] text-tv-gray font-normal px-1.5 py-0.2 bg-tv-lightGray rounded">
                          {item.sector}
                        </span>
                      </div>
                      <span className="text-xs text-tv-gray block truncate max-w-[200px] sm:max-w-xs">
                        {item.name}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <div className="font-mono font-bold text-sm text-tv-black">
                        ${typeof item.price === 'number' ? item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : item.price}
                      </div>
                      <div
                        className={`text-xs font-mono font-semibold flex items-center justify-end gap-0.5 ${
                          isPos ? 'text-tv-green' : 'text-tv-red'
                        }`}
                      >
                        {isPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {isPos ? '+' : ''}
                        {item.changePct.toFixed(2)}%
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-tv-gray" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Quick popular tickers footer */}
        <div className="p-3 bg-tv-ultraLight border-t border-tv-border flex items-center justify-between text-xs text-tv-gray">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-medium">Trending:</span>
            <div className="flex items-center gap-1.5">
              {['NVDA', 'AAPL', 'TSLA', 'BTC'].map((t) => (
                <button
                  key={t}
                  onClick={() => setQuery(t)}
                  className="px-1.5 py-0.5 rounded bg-white border border-tv-border hover:border-tv-gray text-tv-black font-semibold text-[11px]"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <span className="text-[11px]">Click to inspect chart</span>
        </div>
      </div>
    </div>
  );
};
