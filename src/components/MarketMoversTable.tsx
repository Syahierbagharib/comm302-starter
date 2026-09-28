import React, { useState, useMemo } from 'react';
import { ChevronRight, ArrowUpDown, ChevronDown } from 'lucide-react';
import { StockMover, SubTab, TechRating } from '../types';

interface MarketMoversTableProps {
  stocks: StockMover[];
  onSelectStock: (stock: StockMover) => void;
}

type SortField = 'ticker' | 'price' | 'changeDollar' | 'changePct' | 'rawVolume' | 'rawMarketCap' | 'peRatio';
type SortOrder = 'asc' | 'desc';

export const MarketMoversTable: React.FC<MarketMoversTableProps> = ({ stocks, onSelectStock }) => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('Most active');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const subTabs: SubTab[] = ['Most active', 'Gainers', 'Losers', 'All-time high', 'Volume leaders'];

  // Handle column header sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortOrder === 'desc') {
        setSortOrder('asc');
      } else {
        setSortField(null);
      }
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Filter & sort data
  const displayedStocks = useMemo(() => {
    let list = [...stocks];

    // Filter by subtab
    if (activeSubTab === 'Gainers') {
      list = list.filter((s) => s.changePct > 0).sort((a, b) => b.changePct - a.changePct);
    } else if (activeSubTab === 'Losers') {
      list = list.filter((s) => s.changePct < 0).sort((a, b) => a.changePct - b.changePct);
    } else if (activeSubTab === 'Volume leaders') {
      list = list.sort((a, b) => b.rawVolume - a.rawVolume);
    } else if (activeSubTab === 'All-time high') {
      list = list.filter((s) => s.changePct > 1.2).sort((a, b) => b.rawMarketCap - a.rawMarketCap);
    } else {
      // Most active - sort by volume / activity
      list = list.sort((a, b) => b.rawVolume - a.rawVolume);
    }

    // Custom sorting if user clicked a column header
    if (sortField) {
      list.sort((a, b) => {
        let valA: any = a[sortField];
        let valB: any = b[sortField];

        if (sortField === 'peRatio') {
          valA = typeof valA === 'number' ? valA : 0;
          valB = typeof valB === 'number' ? valB : 0;
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // Limit if not expanded
    if (!isExpanded) {
      return list.slice(0, 5);
    }

    return list;
  }, [stocks, activeSubTab, sortField, sortOrder, isExpanded]);

  const renderTechRating = (rating: TechRating) => {
    switch (rating) {
      case 'Strong Buy':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#089981]/10 text-tv-green whitespace-nowrap">
            Strong Buy
          </span>
        );
      case 'Buy':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#089981]/10 text-tv-green whitespace-nowrap">
            Buy
          </span>
        );
      case 'Neutral':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-tv-gray/10 text-tv-gray whitespace-nowrap">
            Neutral
          </span>
        );
      case 'Sell':
      case 'Strong Sell':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F23645]/10 text-tv-red whitespace-nowrap">
            {rating}
          </span>
        );
      default:
        return null;
    }
  };

  const renderTrajectory = (sparkline: number[], isPos: boolean) => {
    const width = 80;
    const height = 24;
    const min = Math.min(...sparkline);
    const max = Math.max(...sparkline);
    const range = max - min || 1;

    const coords = sparkline.map((v, i) => {
      const x = (i / (sparkline.length - 1)) * width;
      const y = height - ((v - min) / range) * (height - 6) - 3;
      return `${x},${y}`;
    });

    let d = `M ${coords[0]}`;
    for (let i = 1; i < coords.length; i++) {
      const [prevX, prevY] = coords[i - 1].split(',').map(Number);
      const [currX, currY] = coords[i].split(',').map(Number);
      d += ` Q ${prevX},${currY} ${currX},${currY}`;
    }

    return (
      <svg className="w-20 h-6 mx-auto overflow-visible" viewBox="0 0 80 24">
        <path
          d={d}
          fill="none"
          stroke={isPos ? '#089981' : '#F23645'}
          strokeLinecap="round"
          strokeWidth="1.8"
        />
      </svg>
    );
  };

  return (
    <section
      className="border border-tv-border rounded-xl bg-white shadow-xs overflow-hidden"
      data-purpose="market-data-table-container"
    >
      {/* Table Header & Sub-tabs */}
      <div className="p-4 sm:p-5 border-b border-tv-border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-tv-black">United States Market Movers</h3>
          <p className="text-xs text-tv-gray">Real-time performance across major actively traded equities</p>
        </div>

        {/* Filter Sub-tabs */}
        <div className="inline-flex p-1 bg-tv-lightGray rounded-lg text-xs font-semibold overflow-x-auto custom-scrollbar">
          {subTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer whitespace-nowrap ${
                activeSubTab === tab
                  ? 'bg-white text-tv-black shadow-xs font-bold'
                  : 'text-tv-gray hover:text-tv-black'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Financial Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse" id="markets-table">
          <thead>
            <tr className="border-b border-tv-border text-[11px] font-bold text-tv-gray uppercase tracking-wider bg-tv-ultraLight select-none">
              <th
                className="py-3 px-4 min-w-[200px] cursor-pointer hover:text-tv-black transition-colors"
                onClick={() => handleSort('ticker')}
              >
                <div className="flex items-center gap-1.5">
                  <span>Ticker / Company</span>
                  <ArrowUpDown className="w-3 h-3 text-tv-gray" />
                </div>
              </th>
              <th
                className="py-3 px-4 text-right cursor-pointer hover:text-tv-black transition-colors"
                onClick={() => handleSort('price')}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Last Price</span>
                  <ArrowUpDown className="w-3 h-3 text-tv-gray" />
                </div>
              </th>
              <th
                className="py-3 px-4 text-right cursor-pointer hover:text-tv-black transition-colors"
                onClick={() => handleSort('changeDollar')}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Change ($)</span>
                  <ArrowUpDown className="w-3 h-3 text-tv-gray" />
                </div>
              </th>
              <th
                className="py-3 px-4 text-right cursor-pointer hover:text-tv-black transition-colors"
                onClick={() => handleSort('changePct')}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Change (%)</span>
                  <ArrowUpDown className="w-3 h-3 text-tv-gray" />
                </div>
              </th>
              <th className="py-3 px-4 text-center">Tech Rating</th>
              <th className="py-3 px-4 text-center">24h Trajectory</th>
              <th
                className="py-3 px-4 text-right cursor-pointer hover:text-tv-black transition-colors"
                onClick={() => handleSort('rawVolume')}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Volume</span>
                  <ArrowUpDown className="w-3 h-3 text-tv-gray" />
                </div>
              </th>
              <th
                className="py-3 px-4 text-right cursor-pointer hover:text-tv-black transition-colors"
                onClick={() => handleSort('rawMarketCap')}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Market Cap</span>
                  <ArrowUpDown className="w-3 h-3 text-tv-gray" />
                </div>
              </th>
              <th
                className="py-3 px-4 text-right cursor-pointer hover:text-tv-black transition-colors"
                onClick={() => handleSort('peRatio')}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>P/E</span>
                  <ArrowUpDown className="w-3 h-3 text-tv-gray" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-tv-border text-xs">
            {displayedStocks.map((stock) => {
              const isPos = stock.changePct >= 0;
              const sign = isPos ? '+' : '';

              return (
                <tr
                  key={stock.ticker}
                  onClick={() => onSelectStock(stock)}
                  className="table-row-hover transition-colors cursor-pointer group"
                >
                  {/* Ticker / Company */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-[10px] shrink-0 shadow-xs"
                        style={{ backgroundColor: stock.symbolBg }}
                      >
                        {stock.symbolBadge}
                      </div>
                      <div>
                        <span className="font-bold text-tv-black group-hover:text-tv-blue transition-colors">
                          {stock.ticker}
                        </span>
                        <span className="block text-[11px] text-tv-gray truncate max-w-[140px] sm:max-w-[180px]">
                          {stock.name}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Last Price */}
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-tv-black">
                    ${stock.price.toFixed(2)}
                  </td>

                  {/* Change ($) */}
                  <td
                    className={`py-3.5 px-4 text-right font-mono font-semibold ${
                      isPos ? 'text-tv-green' : 'text-tv-red'
                    }`}
                  >
                    {isPos ? '+$' : '-$'}
                    {Math.abs(stock.changeDollar).toFixed(2)}
                  </td>

                  {/* Change (%) */}
                  <td className="py-3.5 px-4 text-right">
                    <span
                      className={`px-2 py-0.5 rounded font-mono font-semibold ${
                        isPos ? 'bg-tv-greenBg text-tv-green' : 'bg-tv-redBg text-tv-red'
                      }`}
                    >
                      {sign}
                      {stock.changePct.toFixed(2)}%
                    </span>
                  </td>

                  {/* Tech Rating */}
                  <td className="py-3.5 px-4 text-center">
                    {renderTechRating(stock.techRating)}
                  </td>

                  {/* 24h Trajectory */}
                  <td className="py-3.5 px-4 text-center">
                    {renderTrajectory(stock.sparkline, isPos)}
                  </td>

                  {/* Volume */}
                  <td className="py-3.5 px-4 text-right font-mono text-tv-black">
                    {stock.volume}
                  </td>

                  {/* Market Cap */}
                  <td className="py-3.5 px-4 text-right font-mono text-tv-black">
                    {stock.marketCap}
                  </td>

                  {/* P/E */}
                  <td className="py-3.5 px-4 text-right font-mono text-tv-gray">
                    {stock.peRatio}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer pagination/view all */}
      <div className="p-3 bg-tv-ultraLight border-t border-tv-border flex items-center justify-between text-xs text-tv-gray">
        <span>
          Showing {displayedStocks.length} of {stocks.length} results
        </span>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="font-semibold text-tv-blue hover:text-tv-blueHover flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>{isExpanded ? 'Collapse list' : 'View entire list'}</span>
          {isExpanded ? (
            <ChevronDown className="w-3.5 h-3.5" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </section>
  );
};
