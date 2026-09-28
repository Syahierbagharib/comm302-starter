import React from 'react';
import { MarketIndex } from '../types';

interface IndexCardsGridProps {
  indices: MarketIndex[];
  onSelectIndex: (index: MarketIndex) => void;
}

export const IndexCardsGrid: React.FC<IndexCardsGridProps> = ({ indices, onSelectIndex }) => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-purpose="major-index-cards">
      {indices.map((idx) => {
        const isPos = idx.changePct >= 0;
        const ptsSign = isPos ? '+' : '';
        const pctSign = isPos ? '+' : '';

        // Generate smooth SVG path from sparkline points
        const points = idx.sparkline;
        const width = 100;
        const height = 40;
        const minVal = Math.min(...points);
        const maxVal = Math.max(...points);
        const range = maxVal - minVal || 1;

        const pathCoords = points
          .map((pt, i) => {
            const x = (i / (points.length - 1)) * width;
            const y = height - ((pt - minVal) / range) * (height - 10) - 5;
            return `${x},${y}`;
          })
          .join(' ');

        // Draw bezier or curve path
        let d = `M ${pathCoords.split(' ')[0]}`;
        const coords = pathCoords.split(' ');
        for (let i = 1; i < coords.length; i++) {
          const [prevX, prevY] = coords[i - 1].split(',').map(Number);
          const [currX, currY] = coords[i].split(',').map(Number);
          const midX = (prevX + currX) / 2;
          d += ` Q ${prevX},${currY} ${currX},${currY}`;
        }

        return (
          <div
            key={idx.id}
            onClick={() => onSelectIndex(idx)}
            className="market-card p-4 rounded-xl border border-tv-border bg-white hover:bg-tv-ultraLight flex flex-col justify-between cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span
                  className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-xs shadow-xs"
                  style={{ backgroundColor: idx.badgeBg }}
                >
                  {idx.badge}
                </span>
                <div>
                  <h2 className="text-sm font-bold text-tv-black group-hover:text-tv-blue transition-colors leading-tight">
                    {idx.name}
                  </h2>
                  <span className="text-xs text-tv-gray font-mono">
                    {idx.ticker} • {idx.exchange}
                  </span>
                </div>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                  isPos ? 'bg-tv-greenBg text-tv-green' : 'bg-tv-redBg text-tv-red'
                }`}
              >
                {pctSign}{idx.changePct.toFixed(2)}%
              </span>
            </div>

            <div className="flex items-end justify-between mt-2">
              <div>
                <div className="text-2xl font-bold font-mono text-tv-black tracking-tight">
                  {typeof idx.price === 'number'
                    ? idx.price.toLocaleString(undefined, {
                        minimumFractionDigits: idx.price < 10 ? 3 : 2,
                        maximumFractionDigits: idx.price < 10 ? 4 : 2
                      })
                    : idx.price}
                </div>
                <div
                  className={`text-xs font-semibold font-mono ${
                    isPos ? 'text-tv-green' : 'text-tv-red'
                  }`}
                >
                  {ptsSign}
                  {Math.abs(idx.changePts).toFixed(idx.price < 10 ? 3 : 2)} pts
                </div>
              </div>

              {/* Sparkline Mini Chart */}
              <svg className="w-24 h-10 overflow-visible shrink-0" viewBox="0 0 100 40">
                <path
                  d={d}
                  fill="none"
                  stroke={isPos ? '#089981' : '#F23645'}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                />
              </svg>
            </div>
          </div>
        );
      })}
    </section>
  );
};
