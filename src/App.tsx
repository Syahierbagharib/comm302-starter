import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Activity, Clock, RefreshCw, Check } from 'lucide-react';
import { Header } from './components/Header';
import { IndexCardsGrid } from './components/IndexCardsGrid';
import { TickerTape } from './components/TickerTape';
import { MarketMoversTable } from './components/MarketMoversTable';
import { SectorHeatmapCard } from './components/SectorHeatmapCard';
import { EconomicEventsCard } from './components/EconomicEventsCard';
import { StockDetailModal } from './components/StockDetailModal';
import { SearchModal } from './components/SearchModal';
import { GetStartedModal } from './components/GetStartedModal';
import { Footer } from './components/Footer';

import {
  INITIAL_INDICES,
  INITIAL_TICKER_TAPE,
  ALL_STOCKS,
  SP500_SECTORS,
  ECONOMIC_EVENTS
} from './data/marketData';
import { MarketCategory, MarketIndex, StockMover } from './types';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<MarketCategory>('US stocks');
  const [selectedItemForModal, setSelectedItemForModal] = useState<StockMover | MarketIndex | null>(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [getStartedModalOpen, setGetStartedModalOpen] = useState(false);
  const [regionMenuOpen, setRegionMenuOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('everywhere');
  const [isLiveSimulating, setIsLiveSimulating] = useState(true);

  const categories: MarketCategory[] = [
    'US stocks',
    'World stocks',
    'Crypto',
    'Futures',
    'Forex',
    'Government bonds',
    'Corporate bonds',
    'ETFs',
    'Economy'
  ];

  const regions = [
    { id: 'everywhere', label: 'everywhere' },
    { id: 'americas', label: 'in Americas' },
    { id: 'europe', label: 'in Europe & EMEA' },
    { id: 'asia', label: 'in Asia-Pacific' }
  ];

  // Global Ctrl+K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentIndices = INITIAL_INDICES[selectedCategory] || INITIAL_INDICES['US stocks'];

  const handleSelectTickerSymbol = (symbol: string) => {
    // Check in stocks first
    const foundStock = ALL_STOCKS.find((s) => s.ticker === symbol || symbol.startsWith(s.ticker));
    if (foundStock) {
      setSelectedItemForModal(foundStock);
      return;
    }
    // Check in all indices
    for (const cat of Object.keys(INITIAL_INDICES) as MarketCategory[]) {
      const foundIdx = INITIAL_INDICES[cat].find((idx) => idx.ticker === symbol || symbol.includes(idx.ticker));
      if (foundIdx) {
        setSelectedItemForModal(foundIdx);
        return;
      }
    }
    // Default open first stock
    setSelectedItemForModal(ALL_STOCKS[0]);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white selection:bg-tv-blue selection:text-white">
      {/* Top Navbar */}
      <Header
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenGetStarted={() => setGetStartedModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 lg:px-8 py-8 space-y-8">
        {/* BEGIN: HeroTitleSection */}
        <section className="flex flex-col items-center justify-center text-center pt-4 pb-2 relative" data-purpose="hero-title">
          {/* Main Dropdown Heading */}
          <div className="relative">
            <button
              onClick={() => setRegionMenuOpen(!regionMenuOpen)}
              className="inline-flex items-center gap-3 group text-3xl sm:text-5xl lg:text-[56px] font-black tracking-tight text-tv-black hover:text-tv-blue transition-colors cursor-pointer select-none"
            >
              <span>Markets, {selectedRegion}</span>
              <ChevronDown
                className={`w-6 h-6 sm:w-8 sm:h-8 stroke-tv-black group-hover:stroke-tv-blue transition-transform duration-200 stroke-[3] -mb-1 ${
                  regionMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {regionMenuOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-tv-border p-2 z-30 text-left animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="text-[11px] font-semibold text-tv-gray px-3 py-1.5 uppercase">
                  Select Scope
                </div>
                {regions.map((reg) => (
                  <button
                    key={reg.id}
                    onClick={() => {
                      setSelectedRegion(reg.label);
                      setRegionMenuOpen(false);
                      if (reg.id === 'europe' || reg.id === 'asia') {
                        setSelectedCategory('World stocks');
                      } else {
                        setSelectedCategory('US stocks');
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg font-medium transition-colors cursor-pointer ${
                      selectedRegion === reg.label
                        ? 'bg-tv-lightGray text-tv-blue font-bold'
                        : 'text-tv-black hover:bg-tv-ultraLight'
                    }`}
                  >
                    <span>Markets, {reg.label}</span>
                    {selectedRegion === reg.label && <Check className="w-4 h-4 text-tv-blue" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Live Market Pulse Status Pill */}
          <div className="mt-4 flex items-center gap-2 px-3 py-1 bg-tv-greenBg rounded-full text-tv-green text-xs font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-tv-green animate-pulse" />
            <span>US Markets Open</span>
            <span className="text-tv-gray font-normal">• Regular Trading Session (EDT)</span>
          </div>
        </section>
        {/* END: HeroTitleSection */}

        {/* BEGIN: MarketCategoryNav */}
        <section
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-tv-border"
          data-purpose="market-category-filters"
        >
          {/* Section Title link */}
          <a
            className="inline-flex items-center gap-1.5 text-2xl font-bold text-tv-black hover:text-tv-blue transition-colors cursor-pointer"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setSelectedCategory('US stocks');
            }}
          >
            <span>Indices</span>
            <ChevronRight className="w-5 h-5 mt-0.5 text-tv-gray" />
          </a>

          {/* Horizontal Pill Filter Scroller */}
          <div className="overflow-x-auto custom-scrollbar pb-2 md:pb-0">
            <div className="inline-flex items-center p-1 bg-white border border-tv-border rounded-full text-xs font-semibold whitespace-nowrap shadow-xs">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`cursor-pointer transition-colors ${
                      isActive
                        ? 'px-4 py-1.5 rounded-full bg-tv-black text-white shadow-xs font-bold'
                        : 'px-3.5 py-1.5 rounded-full text-tv-gray hover:text-tv-black hover:bg-tv-lightGray'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </section>
        {/* END: MarketCategoryNav */}

        {/* BEGIN: BenchmarkIndexCardsGrid */}
        <IndexCardsGrid
          indices={currentIndices}
          onSelectIndex={(idx) => setSelectedItemForModal(idx)}
        />
        {/* END: BenchmarkIndexCardsGrid */}

        {/* BEGIN: QuickTickerTape */}
        <TickerTape
          items={INITIAL_TICKER_TAPE}
          onSelectItem={handleSelectTickerSymbol}
          isLiveSimulating={isLiveSimulating}
        />
        {/* END: QuickTickerTape */}

        {/* BEGIN: MarketDataTableSection */}
        <MarketMoversTable
          stocks={ALL_STOCKS}
          onSelectStock={(stk) => setSelectedItemForModal(stk)}
        />
        {/* END: MarketDataTableSection */}

        {/* BEGIN: MarketHeatmapPreview & Economic Events */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6" data-purpose="sector-performance-breakdown">
          <SectorHeatmapCard sectors={SP500_SECTORS} />
          <EconomicEventsCard events={ECONOMIC_EVENTS} />
        </section>
        {/* END: MarketHeatmapPreview */}
      </main>

      {/* Interactive Stock / Index Chart Modal */}
      <StockDetailModal
        item={selectedItemForModal}
        onClose={() => setSelectedItemForModal(null)}
      />

      {/* Global Search Modal (Ctrl+K) */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectStock={(stk) => setSelectedItemForModal(stk)}
      />

      {/* Get Started Welcome Dialog */}
      <GetStartedModal
        isOpen={getStartedModalOpen}
        onClose={() => setGetStartedModalOpen(false)}
      />

      {/* Main Footer */}
      <Footer />
    </div>
  );
}
