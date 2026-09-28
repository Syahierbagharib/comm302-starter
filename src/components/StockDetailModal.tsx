import React, { useState, useMemo } from 'react';
import { X, Star, Bell, TrendingUp, TrendingDown, BarChart2, DollarSign, CheckCircle2, ChevronRight } from 'lucide-react';
import { StockMover, MarketIndex } from '../types';

interface StockDetailModalProps {
  item: StockMover | MarketIndex | null;
  onClose: () => void;
}

type Timeframe = '1D' | '5D' | '1M' | '6M' | '1Y' | '5Y' | 'ALL';
type ChartType = 'line' | 'candles';

export const StockDetailModal: React.FC<StockDetailModalProps> = ({ item, onClose }) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('1D');
  const [chartType, setChartType] = useState<ChartType>('line');
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderType, setOrderType] = useState<'BUY' | 'SELL'>('BUY');
  const [orderShares, setOrderShares] = useState('10');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; price: number; time: string } | null>(null);

  if (!item) return null;

  const isStock = 'sector' in item;
  const ticker = item.ticker;
  const name = item.name;
  const price = typeof item.price === 'number' ? item.price : 100;
  const changePts = 'changeDollar' in item ? item.changeDollar : item.changePts;
  const changePct = item.changePct;
  const isPos = changePct >= 0;

  // Generate synthetic historical chart points based on timeframe and current price
  const chartData = useMemo(() => {
    let pointCount = 30;
    let volatility = 0.012;
    if (timeframe === '1D') {
      pointCount = 28;
      volatility = 0.006;
    } else if (timeframe === '5D') {
      pointCount = 35;
      volatility = 0.015;
    } else if (timeframe === '1M') {
      pointCount = 30;
      volatility = 0.025;
    } else if (timeframe === '1Y') {
      pointCount = 50;
      volatility = 0.05;
    } else {
      pointCount = 60;
      volatility = 0.08;
    }

    const data: { time: string; price: number; open: number; high: number; low: number; close: number; volume: number }[] = [];
    let current = price * (isPos ? 0.96 : 1.04);

    for (let i = 0; i < pointCount; i++) {
      const stepFactor = isPos ? 1 + (i / pointCount) * 0.04 : 1 - (i / pointCount) * 0.04;
      const noise = (Math.sin(i * 0.8) + (Math.random() - 0.48)) * volatility * price;
      const p = Math.max(current * stepFactor + noise, price * 0.5);

      const open = p - (Math.random() - 0.5) * (price * 0.008);
      const close = p;
      const high = Math.max(open, close) + Math.random() * (price * 0.006);
      const low = Math.min(open, close) - Math.random() * (price * 0.006);
      const volume = Math.floor(Math.random() * 500000 + 100000);

      const timeLabel = timeframe === '1D'
        ? `${9 + Math.floor(i / 4)}:${(i % 4) * 15 === 0 ? '00' : (i % 4) * 15}`
        : `Day ${i + 1}`;

      data.push({ time: timeLabel, price: p, open, high, low, close, volume });
    }

    // Ensure the last point matches the current price
    data[data.length - 1].close = price;
    data[data.length - 1].price = price;

    return data;
  }, [timeframe, price, isPos]);

  // Chart bounds
  const prices = chartData.map((d) => d.price);
  const minPrice = Math.min(...chartData.map((d) => d.low || d.price)) * 0.995;
  const maxPrice = Math.max(...chartData.map((d) => d.high || d.price)) * 1.005;
  const priceRange = maxPrice - minPrice || 1;

  // Chart SVG Dimensions
  const svgWidth = 720;
  const svgHeight = 240;

  // Line path coordinates
  const lineCoords = chartData.map((d, i) => {
    const x = (i / (chartData.length - 1)) * svgWidth;
    const y = svgHeight - ((d.price - minPrice) / priceRange) * (svgHeight - 40) - 20;
    return { x, y, price: d.price, time: d.time };
  });

  const pathD = lineCoords.reduce(
    (acc, pt, i) => (i === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`),
    ''
  );

  const areaD = `${pathD} L ${svgWidth},${svgHeight} L 0,${svgHeight} Z`;

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, mouseX / rect.width));
    const index = Math.round(ratio * (lineCoords.length - 1));
    if (lineCoords[index]) {
      setHoveredPoint(lineCoords[index]);
    }
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  const executeOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderSuccess(true);
    setTimeout(() => {
      setOrderSuccess(false);
      setOrderModalOpen(false);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-tv-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-tv-border overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-tv-border bg-white">
          <div className="flex items-center gap-3">
            <span
              className="w-9 h-9 rounded-full text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs"
              style={{ backgroundColor: 'symbolBg' in item ? (item as any).symbolBg : (item as any).badgeBg || '#2962FF' }}
            >
              {'symbolBadge' in item ? (item as any).symbolBadge : (item as any).badge}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-tv-black leading-none">{ticker}</h3>
                <span className="text-xs text-tv-gray font-normal px-2 py-0.5 bg-tv-lightGray rounded font-mono">
                  {'sector' in item ? item.sector : (item as any).exchange}
                </span>
              </div>
              <p className="text-xs text-tv-gray mt-0.5">{name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsWatchlisted(!isWatchlisted)}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                isWatchlisted
                  ? 'bg-amber-50 border-amber-300 text-amber-500'
                  : 'border-tv-border text-tv-gray hover:text-tv-black hover:bg-tv-lightGray'
              }`}
              title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              <Star className={`w-4 h-4 ${isWatchlisted ? 'fill-amber-400' : ''}`} />
            </button>

            <button
              onClick={() => setOrderModalOpen(true)}
              className="px-3.5 py-1.5 bg-tv-blue hover:bg-tv-blueHover text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Trade</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-tv-gray hover:text-tv-black rounded-lg hover:bg-tv-lightGray transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Price & Toolbar Section */}
        <div className="px-6 py-3.5 border-b border-tv-border bg-tv-ultraLight flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold font-mono text-tv-black">
              ${(hoveredPoint ? hoveredPoint.price : price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span
              className={`text-sm font-bold font-mono px-2 py-0.5 rounded flex items-center gap-1 ${
                isPos ? 'bg-tv-greenBg text-tv-green' : 'bg-tv-redBg text-tv-red'
              }`}
            >
              {isPos ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {isPos ? '+' : ''}${Math.abs(changePts).toFixed(2)} ({isPos ? '+' : ''}{changePct.toFixed(2)}%)
            </span>
            {hoveredPoint && (
              <span className="text-xs text-tv-gray font-mono ml-2">
                Time: {hoveredPoint.time}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Chart Type Toggle */}
            <div className="flex items-center p-0.5 bg-white border border-tv-border rounded-lg text-xs font-medium">
              <button
                onClick={() => setChartType('line')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  chartType === 'line' ? 'bg-tv-lightGray text-tv-black font-bold' : 'text-tv-gray hover:text-tv-black'
                }`}
              >
                Line
              </button>
              <button
                onClick={() => setChartType('candles')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  chartType === 'candles' ? 'bg-tv-lightGray text-tv-black font-bold' : 'text-tv-gray hover:text-tv-black'
                }`}
              >
                Candles
              </button>
            </div>

            {/* Timeframe selector */}
            <div className="flex items-center p-0.5 bg-white border border-tv-border rounded-lg text-xs font-semibold">
              {(['1D', '5D', '1M', '6M', '1Y', '5Y', 'ALL'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-2 py-1 rounded-md transition-colors ${
                    timeframe === tf
                      ? 'bg-tv-black text-white'
                      : 'text-tv-gray hover:text-tv-black'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Body - Chart and Analytics */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          {/* Main Interactive Chart Container */}
          <div className="relative bg-white rounded-xl border border-tv-border p-4">
            <div className="flex justify-between items-center text-xs text-tv-gray font-mono mb-2">
              <span>High: ${maxPrice.toFixed(2)}</span>
              <span>Low: ${minPrice.toFixed(2)}</span>
            </div>

            <div className="relative w-full h-64 overflow-hidden select-none">
              <svg
                className="w-full h-full cursor-crosshair overflow-visible"
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                preserveAspectRatio="none"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={isPos ? '#089981' : '#F23645'} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={isPos ? '#089981' : '#F23645'} stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal price guide gridlines */}
                {[0.25, 0.5, 0.75].map((pct) => (
                  <line
                    key={pct}
                    x1="0"
                    y1={svgHeight * pct}
                    x2={svgWidth}
                    y2={svgHeight * pct}
                    stroke="#E0E3EB"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                ))}

                {chartType === 'line' ? (
                  <>
                    {/* Area fill */}
                    <path d={areaD} fill="url(#chartGradient)" />
                    {/* Main stroke */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke={isPos ? '#089981' : '#F23645'}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </>
                ) : (
                  /* Candlesticks view */
                  chartData.map((d, i) => {
                    const x = (i / (chartData.length - 1)) * svgWidth;
                    const isGreen = d.close >= d.open;
                    const candleColor = isGreen ? '#089981' : '#F23645';

                    const highY = svgHeight - ((d.high - minPrice) / priceRange) * (svgHeight - 40) - 20;
                    const lowY = svgHeight - ((d.low - minPrice) / priceRange) * (svgHeight - 40) - 20;
                    const openY = svgHeight - ((d.open - minPrice) / priceRange) * (svgHeight - 40) - 20;
                    const closeY = svgHeight - ((d.close - minPrice) / priceRange) * (svgHeight - 40) - 20;

                    const bodyTop = Math.min(openY, closeY);
                    const bodyHeight = Math.max(Math.abs(closeY - openY), 2);

                    return (
                      <g key={i}>
                        {/* Wick */}
                        <line x1={x} y1={highY} x2={x} y2={lowY} stroke={candleColor} strokeWidth="1.5" />
                        {/* Body */}
                        <rect
                          x={x - 4}
                          y={bodyTop}
                          width="8"
                          height={bodyHeight}
                          fill={candleColor}
                          rx="1"
                        />
                      </g>
                    );
                  })
                )}

                {/* Hover crosshair */}
                {hoveredPoint && (
                  <g>
                    <line
                      x1={hoveredPoint.x}
                      y1="0"
                      x2={hoveredPoint.x}
                      y2={svgHeight}
                      stroke="#787B86"
                      strokeDasharray="3 3"
                      strokeWidth="1.2"
                    />
                    <circle
                      cx={hoveredPoint.x}
                      cy={hoveredPoint.y}
                      r="4.5"
                      fill={isPos ? '#089981' : '#F23645'}
                      stroke="#FFFFFF"
                      strokeWidth="2"
                    />
                  </g>
                )}
              </svg>

              {/* Volume bars strip along the bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-10 flex items-end gap-1 px-2 pointer-events-none opacity-40">
                {chartData.map((d, i) => {
                  const volHeight = Math.min((d.volume / 600000) * 100, 100);
                  const isUp = d.close >= d.open;
                  return (
                    <div
                      key={i}
                      className={`flex-1 rounded-t-xs ${isUp ? 'bg-tv-green' : 'bg-tv-red'}`}
                      style={{ height: `${volHeight}%` }}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Technical Summary Meter & Key Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tech Analysis Rating Card */}
            <div className="p-4 rounded-xl border border-tv-border bg-tv-ultraLight flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-tv-gray uppercase">Technical Analysis</span>
                <h4 className="text-base font-bold text-tv-black mt-1">Summary Rating</h4>
                <div className="mt-3 flex items-center justify-between text-xs font-semibold">
                  <span className="text-tv-red">Strong Sell</span>
                  <span className="text-tv-gray">Neutral</span>
                  <span className="text-tv-green">Strong Buy</span>
                </div>
                {/* Meter gauge */}
                <div className="w-full bg-tv-border h-2 rounded-full overflow-hidden mt-1.5 flex">
                  <div className="bg-tv-red h-full w-1/4" />
                  <div className="bg-amber-400 h-full w-1/4" />
                  <div className="bg-tv-lightGray h-full w-1/4" />
                  <div className="bg-tv-green h-full w-1/4" />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-tv-border flex items-center justify-between text-xs">
                <span className="text-tv-gray">Consensus:</span>
                <span className="font-bold text-tv-green">
                  {'techRating' in item ? (item as any).techRating : 'Buy'}
                </span>
              </div>
            </div>

            {/* Key Statistics Column 1 */}
            <div className="p-4 rounded-xl border border-tv-border bg-white space-y-2.5 text-xs">
              <span className="font-bold text-tv-gray uppercase block text-[11px]">Key Statistics</span>
              <div className="flex justify-between py-1 border-b border-tv-border/50">
                <span className="text-tv-gray">Open</span>
                <span className="font-mono font-semibold text-tv-black">
                  ${(price * 0.992).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-tv-border/50">
                <span className="text-tv-gray">Previous Close</span>
                <span className="font-mono font-semibold text-tv-black">
                  ${(price - changePts).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-tv-border/50">
                <span className="text-tv-gray">Day's Range</span>
                <span className="font-mono font-semibold text-tv-black">
                  ${(price * 0.985).toFixed(2)} – ${(price * 1.015).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-tv-gray">52-Week Range</span>
                <span className="font-mono font-semibold text-tv-black">
                  ${(price * 0.72).toFixed(2)} – ${(price * 1.08).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Key Statistics Column 2 */}
            <div className="p-4 rounded-xl border border-tv-border bg-white space-y-2.5 text-xs">
              <span className="font-bold text-tv-gray uppercase block text-[11px]">Valuation & Volume</span>
              <div className="flex justify-between py-1 border-b border-tv-border/50">
                <span className="text-tv-gray">Market Cap</span>
                <span className="font-mono font-semibold text-tv-black">
                  {'marketCap' in item ? (item as any).marketCap : '$2.4T'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-tv-border/50">
                <span className="text-tv-gray">Volume</span>
                <span className="font-mono font-semibold text-tv-black">
                  {'volume' in item ? (item as any).volume : '42.1M'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-tv-border/50">
                <span className="text-tv-gray">P/E Ratio</span>
                <span className="font-mono font-semibold text-tv-black">
                  {'peRatio' in item ? (item as any).peRatio : '32.4'}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-tv-gray">Div Yield</span>
                <span className="font-mono font-semibold text-tv-black">0.74%</span>
              </div>
            </div>
          </div>

          {/* Description */}
          {'description' in item && item.description && (
            <div className="p-4 rounded-xl bg-tv-ultraLight border border-tv-border">
              <span className="text-xs font-bold text-tv-gray uppercase block mb-1">Company Profile</span>
              <p className="text-xs text-tv-black/85 leading-relaxed">{item.description}</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-tv-ultraLight border-t border-tv-border flex items-center justify-between text-xs text-tv-gray">
          <span>Real-time quotes with NASDAQ / NYSE data integration</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-tv-black text-white rounded-lg font-medium hover:bg-tv-black/90 transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Simulated Order Execution Dialog */}
      {orderModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-tv-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-tv-border p-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-tv-border">
              <h4 className="font-bold text-base text-tv-black">Order Ticket — {ticker}</h4>
              <button
                onClick={() => setOrderModalOpen(false)}
                className="text-tv-gray hover:text-tv-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {orderSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-tv-green mx-auto animate-bounce" />
                <h5 className="font-bold text-lg text-tv-black">Order Placed Successfully!</h5>
                <p className="text-xs text-tv-gray">
                  {orderType} {orderShares} shares of {ticker} at ${price.toFixed(2)}
                </p>
              </div>
            ) : (
              <form onSubmit={executeOrder} className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setOrderType('BUY')}
                    className={`py-2 rounded-lg font-bold text-xs transition-colors ${
                      orderType === 'BUY'
                        ? 'bg-tv-green text-white shadow-xs'
                        : 'bg-tv-lightGray text-tv-gray hover:text-tv-black'
                    }`}
                  >
                    BUY
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType('SELL')}
                    className={`py-2 rounded-lg font-bold text-xs transition-colors ${
                      orderType === 'SELL'
                        ? 'bg-tv-red text-white shadow-xs'
                        : 'bg-tv-lightGray text-tv-gray hover:text-tv-black'
                    }`}
                  >
                    SELL
                  </button>
                </div>

                <div>
                  <label className="text-xs font-semibold text-tv-gray block mb-1">Quantity (Shares)</label>
                  <input
                    type="number"
                    min="1"
                    value={orderShares}
                    onChange={(e) => setOrderShares(e.target.value)}
                    className="w-full px-3 py-2 border border-tv-border rounded-lg text-sm font-mono text-tv-black focus:outline-none focus:border-tv-blue"
                  />
                </div>

                <div className="p-3 rounded-lg bg-tv-ultraLight border border-tv-border text-xs space-y-1.5 font-mono">
                  <div className="flex justify-between">
                    <span className="text-tv-gray">Market Price:</span>
                    <span className="font-bold">${price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-tv-gray">Estimated Total:</span>
                    <span className="font-bold text-tv-blue">
                      ${(price * (parseFloat(orderShares) || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className={`w-full py-2.5 rounded-lg text-white font-bold text-sm shadow-sm transition-opacity hover:opacity-95 ${
                    orderType === 'BUY' ? 'bg-tv-green' : 'bg-tv-red'
                  }`}
                >
                  Send {orderType} Order
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
