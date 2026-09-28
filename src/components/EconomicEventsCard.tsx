import React, { useState } from 'react';
import { Calendar, X, Filter, Clock, AlertCircle } from 'lucide-react';
import { EconomicEvent } from '../types';

interface EconomicEventsCardProps {
  events: EconomicEvent[];
}

export const EconomicEventsCard: React.FC<EconomicEventsCardProps> = ({ events }) => {
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [impactFilter, setImpactFilter] = useState<'All' | 'High' | 'Medium'>('All');

  const filteredEvents = events.filter((ev) => {
    if (impactFilter === 'All') return true;
    return ev.impact === impactFilter;
  });

  return (
    <>
      <div className="border border-tv-border rounded-xl p-5 bg-white shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-base font-bold text-tv-black">Economic Events</h4>
            <span className="text-[11px] font-bold text-tv-blue">Today</span>
          </div>

          <div className="space-y-3 divide-y divide-tv-border">
            {/* Initial Jobless Claims */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-tv-black">Initial Jobless Claims</span>
                <span className="text-tv-gray font-mono">13:30</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-tv-gray font-mono mt-1">
                <span>
                  Act: <b className="text-tv-black">213K</b>
                </span>
                <span>Fcst: 216K</span>
                <span>Prev: 219K</span>
              </div>
            </div>

            {/* Core PPI (MoM) */}
            <div className="pt-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-tv-black">Core PPI (MoM)</span>
                <span className="text-tv-gray font-mono">13:30</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-tv-gray font-mono mt-1">
                <span>
                  Act: <b className="text-tv-green">+0.2%</b>
                </span>
                <span>Fcst: +0.2%</span>
                <span>Prev: +0.1%</span>
              </div>
            </div>

            {/* Fed Chair Powell Speaks */}
            <div className="pt-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-tv-black">Fed Chair Powell Speaks</span>
                <span className="text-tv-blue font-semibold font-mono">18:00</span>
              </div>
              <p className="text-[11px] text-tv-gray mt-1">
                Monetary policy discussion in Dallas
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsCalendarModalOpen(true)}
          className="mt-4 text-xs font-semibold text-tv-blue hover:text-tv-blueHover inline-flex items-center gap-1 cursor-pointer transition-colors text-left"
        >
          <span>Check full calendar schedule →</span>
        </button>
      </div>

      {/* Full Economic Calendar Modal */}
      {isCalendarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-tv-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-tv-border overflow-hidden flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-tv-border bg-white">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-5 h-5 text-tv-blue" />
                <div>
                  <h3 className="text-lg font-bold text-tv-black">Economic Calendar</h3>
                  <p className="text-xs text-tv-gray">Global macroeconomic announcements & consensus</p>
                </div>
              </div>
              <button
                onClick={() => setIsCalendarModalOpen(false)}
                className="p-1.5 text-tv-gray hover:text-tv-black rounded-lg hover:bg-tv-lightGray transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter bar */}
            <div className="flex items-center justify-between px-6 py-2.5 bg-tv-ultraLight border-b border-tv-border text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-tv-gray font-medium">Impact:</span>
                {(['All', 'High', 'Medium'] as const).map((imp) => (
                  <button
                    key={imp}
                    onClick={() => setImpactFilter(imp)}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                      impactFilter === imp
                        ? 'bg-tv-black text-white'
                        : 'text-tv-gray hover:text-tv-black hover:bg-tv-lightGray'
                    }`}
                  >
                    {imp}
                  </button>
                ))}
              </div>
              <span className="text-tv-gray text-[11px] font-mono">Timezone: EDT</span>
            </div>

            {/* Events schedule */}
            <div className="p-6 overflow-y-auto custom-scrollbar divide-y divide-tv-border">
              {filteredEvents.map((ev) => (
                <div key={ev.id} className="py-3.5 first:pt-0 last:pb-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{ev.countryFlag}</span>
                        <span className="font-bold text-sm text-tv-black">{ev.title}</span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            ev.impact === 'High'
                              ? 'bg-tv-redBg text-tv-red'
                              : 'bg-amber-50 text-amber-600'
                          }`}
                        >
                          {ev.impact} Impact
                        </span>
                      </div>
                      {ev.description && (
                        <p className="text-xs text-tv-gray mt-1 leading-relaxed">
                          {ev.description}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-mono text-xs font-bold text-tv-black bg-tv-lightGray px-2 py-0.5 rounded">
                        {ev.time}
                      </span>
                    </div>
                  </div>

                  {/* Macro figures */}
                  {(ev.actual || ev.forecast || ev.previous !== '—') && (
                    <div className="mt-2.5 grid grid-cols-3 gap-2 p-2 rounded-lg bg-tv-ultraLight text-xs font-mono text-center">
                      <div>
                        <span className="text-[10px] text-tv-gray block uppercase">Actual</span>
                        <span className="font-bold text-tv-black">{ev.actual || '—'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-tv-gray block uppercase">Forecast</span>
                        <span className="text-tv-black">{ev.forecast || '—'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-tv-gray block uppercase">Previous</span>
                        <span className="text-tv-gray">{ev.previous}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="px-6 py-3 bg-tv-ultraLight border-t border-tv-border flex items-center justify-between text-xs text-tv-gray">
              <span>Source: Government Statistics Bureaus & Central Banks</span>
              <button
                onClick={() => setIsCalendarModalOpen(false)}
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
