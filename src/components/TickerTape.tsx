import React, { useState, useEffect } from 'react';
import { TickerTapeItem } from '../types';

interface TickerTapeProps {
  items: TickerTapeItem[];
  onSelectItem?: (symbol: string) => void;
  isLiveSimulating?: boolean;
}

export const TickerTape: React.FC<TickerTapeProps> = ({
  items: initialItems,
  onSelectItem,
  isLiveSimulating = true
}) => {
  const [tapeItems, setTapeItems] = useState<TickerTapeItem[]>(initialItems);
  const [flashSymbol, setFlashSymbol] = useState<{ symbol: string; isUp: boolean } | null>(null);

  useEffect(() => {
    setTapeItems(initialItems);
  }, [initialItems]);

  // Subtle real-time tick pulse
  useEffect(() => {
    if (!isLiveSimulating) return;

    const interval = setInterval(() => {
      // Pick a random index
      const randIdx = Math.floor(Math.random() * tapeItems.length);
      const target = tapeItems[randIdx];
      const isUp = Math.random() > 0.45;

      setFlashSymbol({ symbol: target.symbol, isUp });

      setTimeout(() => {
        setFlashSymbol(null);
      }, 1000);
    }, 3500);

    return () => clearInterval(interval);
  }, [tapeItems, isLiveSimulating]);

  return (
    <section
      className="border border-tv-border rounded-xl bg-tv-ultraLight p-3 overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
      data-purpose="crypto-forex-ticker-bar"
    >
      <div className="flex items-center divide-x divide-tv-border overflow-x-auto custom-scrollbar text-xs">
        {tapeItems.map((item) => {
          const isFlashing = flashSymbol?.symbol === item.symbol;
          const flashBg = isFlashing
            ? flashSymbol?.isUp
              ? 'bg-tv-greenBg'
              : 'bg-tv-redBg'
            : '';

          return (
            <div
              key={item.symbol}
              onClick={() => onSelectItem && onSelectItem(item.symbol)}
              className={`px-4 py-0.5 flex items-center gap-2 whitespace-nowrap cursor-pointer hover:bg-tv-lightGray rounded transition-colors ${flashBg}`}
            >
              <span className="font-bold text-tv-black hover:text-tv-blue transition-colors">
                {item.symbol}
              </span>
              <span className="font-mono text-tv-black font-semibold">
                {item.price}
              </span>
              <span
                className={`font-mono font-medium ${
                  item.isPositive ? 'text-tv-green' : 'text-tv-red'
                }`}
              >
                {item.change}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
