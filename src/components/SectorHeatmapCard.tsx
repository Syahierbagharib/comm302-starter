import React, { useState } from 'react';
import { X, ExternalLink, Layers, ArrowUpRight } from 'lucide-react';
import { SectorPerformance } from '../types';

interface SectorHeatmapCardProps {
  sectors: SectorPerformance[];
}

export const SectorHeatmapCard: React.FC<SectorHeatmapCardProps> = ({ sectors }) => {
  const [isHeatmapModalOpen, setIsHeatmapModalOpen] = useState(false);
  const [selectedSector, setSelectedSector] = useState<SectorPerformance | null>(null);

  // Take top 5 for the main card view as in the screenshot
  const topSectors = sectors.slice(0, 5);

  // Calculate bar width based on absolute change percentage
  const getBarWidth = (pct: number) => {
    const abs = Math.abs(pct);
    // map 0% - 2.5% to 25% - 85% width
    return Math.min(Math.max(Math.round((abs / 2.5) * 80 + 20), 25), 90);
  };

  return (
    <>
      <div className="lg:col-span-2 border border-tv-border rounded-xl p-5 bg-white shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-bold text-tv-black">S&amp;P 500 Sectors Today</h4>
            <span className="text-xs text-tv-gray">11 Sectors tracked</span>
          </div>

          {/* Sector list with relative bar progress */}
          <div className="space-y-3.5 text-xs font-medium">
            {topSectors.map((sector) => {
              const isPos = sector.changePct >= 0;
              const sign = isPos ? '+' : '';
              const barWidth = getBarWidth(sector.changePct);

              return (
                <div
                  key={sector.name}
                  className="cursor-pointer group"
                  onClick={() => {
                    setSelectedSector(sector);
                    setIsHeatmapModalOpen(true);
                  }}
                >
                  <div className="flex justify-between mb-1">
                    <span className="text-tv-black font-semibold group-hover:text-tv-blue transition-colors">
                      {sector.name}
                    </span>
                    <span
                      className={`font-mono font-bold ${
                        isPos ? 'text-tv-green' : 'text-tv-red'
                      }`}
                    >
                      {sign}{sector.changePct.toFixed(2)}%
                    </span>
                  </div>
                  <div className="w-full bg-tv-lightGray h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isPos ? 'bg-tv-green' : 'bg-tv-red'
                      }`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => {
            setSelectedSector(null);
            setIsHeatmapModalOpen(true);
          }}
          className="mt-4 text-xs font-semibold text-tv-blue hover:text-tv-blueHover inline-flex items-center gap-1 cursor-pointer transition-colors text-left"
        >
          <span>Open interactive market heatmap →</span>
        </button>
      </div>

      {/* Interactive S&P 500 Heatmap Modal */}
      {isHeatmapModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-tv-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-tv-border overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-tv-border bg-white">
              <div className="flex items-center gap-2.5">
                <Layers className="w-5 h-5 text-tv-blue" />
                <div>
                  <h3 className="text-lg font-bold text-tv-black">S&P 500 Sector Heatmap</h3>
                  <p className="text-xs text-tv-gray">Market capitalization weighted performance</p>
                </div>
              </div>
              <button
                onClick={() => setIsHeatmapModalOpen(false)}
                className="p-1.5 text-tv-gray hover:text-tv-black rounded-lg hover:bg-tv-lightGray transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Treemap visual grid representation */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4">
              <div className="flex items-center justify-between text-xs text-tv-gray pb-2 border-b border-tv-border">
                <span className="font-semibold text-tv-black">All 11 Sectors</span>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-tv-green inline-block"></span> Up</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-tv-red inline-block"></span> Down</span>
                </div>
              </div>

              {/* Grid of Sector tiles */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {sectors.map((sec) => {
                  const isPos = sec.changePct >= 0;
                  const sign = isPos ? '+' : '';
                  const isSelected = selectedSector?.name === sec.name;

                  return (
                    <div
                      key={sec.name}
                      onClick={() => setSelectedSector(sec)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-tv-blue ring-2 ring-tv-blue/20 bg-tv-ultraLight'
                          : 'border-tv-border hover:border-tv-gray bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-bold text-sm text-tv-black">{sec.name}</div>
                          <div className="text-[11px] text-tv-gray mt-0.5">
                            Weight: {sec.weightPct}% of Index
                          </div>
                        </div>
                        <span
                          className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                            isPos ? 'bg-tv-greenBg text-tv-green' : 'bg-tv-redBg text-tv-red'
                          }`}
                        >
                          {sign}{sec.changePct.toFixed(2)}%
                        </span>
                      </div>

                      <div className="mt-3 pt-3 border-t border-tv-border/60 flex items-center justify-between text-xs">
                        <span className="text-tv-gray">Top mover:</span>
                        <span className="font-medium text-tv-black font-mono">
                          {sec.leadingStock}
                        </span>
                      </div>

                      <div className="mt-2 w-full bg-tv-lightGray h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${isPos ? 'bg-tv-green' : 'bg-tv-red'}`}
                          style={{ width: `${Math.min(Math.abs(sec.changePct) * 40 + 10, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Details of Selected Sector */}
              {selectedSector && (
                <div className="mt-4 p-4 rounded-xl bg-tv-ultraLight border border-tv-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-tv-black">
                        {selectedSector.name} Key Constituents
                      </h4>
                      <p className="text-xs text-tv-gray">Relative weighting in index: {selectedSector.weightPct}%</p>
                    </div>
                    <span
                      className={`text-sm font-mono font-bold ${
                        selectedSector.changePct >= 0 ? 'text-tv-green' : 'text-tv-red'
                      }`}
                    >
                      {selectedSector.changePct >= 0 ? '+' : ''}{selectedSector.changePct.toFixed(2)}%
                    </span>
                  </div>
                  <p className="text-xs text-tv-black/80 mt-2">
                    Leading performance driven by <strong>{selectedSector.leadingStock}</strong> alongside institutional inflows across large-cap constituents.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-tv-ultraLight border-t border-tv-border flex items-center justify-between text-xs text-tv-gray">
              <span>Data refreshes continuously throughout trading sessions</span>
              <button
                onClick={() => setIsHeatmapModalOpen(false)}
                className="px-4 py-1.5 bg-tv-black text-white rounded-lg font-medium hover:bg-tv-black/90 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
