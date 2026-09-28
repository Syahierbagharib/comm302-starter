import React, { useState } from 'react';
import { X, CheckCircle, Database, Shield, FileText } from 'lucide-react';

export const Footer: React.FC = () => {
  const [dataStatusOpen, setDataStatusOpen] = useState(false);
  const [tosOpen, setTosOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  return (
    <>
      <footer className="mt-16 border-t border-tv-border bg-tv-ultraLight text-tv-gray text-xs" data-purpose="site-footer">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-8 space-y-6">
          {/* Top Disclaimer & Market data status */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-tv-border pb-6">
            <div className="space-y-1">
              <p className="text-tv-black font-semibold">Market Data Notice</p>
              <p className="max-w-2xl leading-relaxed">
                Market data provided is delayed unless explicitly indicated as real-time. Quotes, charts, technical indicators and financial data are powered for informational and analytical purposes.
              </p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <button
                onClick={() => setDataStatusOpen(true)}
                className="px-3 py-1.5 border border-tv-border bg-white rounded-md text-tv-black font-medium hover:border-tv-gray transition-colors cursor-pointer"
              >
                Data status
              </button>
              <button
                onClick={() => setTosOpen(true)}
                className="px-3 py-1.5 border border-tv-border bg-white rounded-md text-tv-black font-medium hover:border-tv-gray transition-colors cursor-pointer"
              >
                Terms of service
              </button>
            </div>
          </div>

          {/* Copyright & Brand info */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <div className="flex items-center gap-2">
              {/* Mini Monogram */}
              <svg className="w-4 h-4 text-tv-black" fill="currentColor" viewBox="0 0 36 28">
                <path d="M14 22H7V6h7v16zm8-16h-7v22h7V6zm8 7h-7v15h7V13z" />
              </svg>
              <span>© 2025 TradingView. Look first / Then leap.</span>
            </div>
            <div className="flex items-center gap-6">
              <button
                onClick={() => setPrivacyOpen(true)}
                className="hover:text-tv-black transition-colors cursor-pointer"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => alert('Cookie Preferences: All cookies active (functional & analytical).')}
                className="hover:text-tv-black transition-colors cursor-pointer"
              >
                Cookies
              </button>
              <button
                onClick={() => alert('Security: 256-bit SSL encryption, SOC-2 compliant data infrastructure.')}
                className="hover:text-tv-black transition-colors cursor-pointer"
              >
                Security
              </button>
              <button
                onClick={() => alert('Chart API: TradingView Charting Library & Lightweight Charts available.')}
                className="hover:text-tv-black transition-colors cursor-pointer"
              >
                Chart API
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Data Status Modal */}
      {dataStatusOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-tv-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-tv-border p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-tv-border">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-tv-blue" />
                <h4 className="font-bold text-base text-tv-black">Exchange Feeds & Data Status</h4>
              </div>
              <button onClick={() => setDataStatusOpen(false)} className="text-tv-gray hover:text-tv-black">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-tv-ultraLight border border-tv-border">
                <div>
                  <span className="font-bold text-tv-black block">Cboe BZX Exchange (US Stocks)</span>
                  <span className="text-tv-gray">Real-time quotes with full book depth</span>
                </div>
                <span className="flex items-center gap-1 font-semibold text-tv-green">
                  <CheckCircle className="w-4 h-4" /> Operational
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-tv-ultraLight border border-tv-border">
                <div>
                  <span className="font-bold text-tv-black block">CME Group (Futures)</span>
                  <span className="text-tv-gray">10-minute delayed session data</span>
                </div>
                <span className="flex items-center gap-1 font-semibold text-tv-green">
                  <CheckCircle className="w-4 h-4" /> Operational
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-tv-ultraLight border border-tv-border">
                <div>
                  <span className="font-bold text-tv-black block">Crypto Global Aggregate</span>
                  <span className="text-tv-gray">Sub-second websocket ticks</span>
                </div>
                <span className="flex items-center gap-1 font-semibold text-tv-green">
                  <CheckCircle className="w-4 h-4" /> Operational
                </span>
              </div>
            </div>
            <button
              onClick={() => setDataStatusOpen(false)}
              className="w-full py-2 bg-tv-black text-white text-xs font-semibold rounded-lg hover:bg-tv-black/90 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Terms of Service Modal */}
      {tosOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-tv-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-tv-border p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-tv-border">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-tv-blue" />
                <h4 className="font-bold text-base text-tv-black">Terms of Service</h4>
              </div>
              <button onClick={() => setTosOpen(false)} className="text-tv-gray hover:text-tv-black">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-xs text-tv-gray leading-relaxed space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
              <p>
                By using TradingView Markets, you agree that financial information, charts, analysis, and data provided through our platform are for informational, educational, and research purposes only.
              </p>
              <p>
                No content published on the site constitutes a recommendation that any particular security, portfolio of securities, transaction or investment strategy is suitable for any specific person.
              </p>
              <p>
                Trading equities, options, futures, forex, and cryptocurrency involves significant financial risk of capital loss. Past performance is no guarantee of future returns.
              </p>
            </div>
            <button
              onClick={() => setTosOpen(false)}
              className="w-full py-2 bg-tv-black text-white text-xs font-semibold rounded-lg hover:bg-tv-black/90 transition-colors"
            >
              I Understand
            </button>
          </div>
        </div>
      )}

      {/* Privacy Modal */}
      {privacyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-tv-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-tv-border p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-tv-border">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-tv-blue" />
                <h4 className="font-bold text-base text-tv-black">Privacy Notice</h4>
              </div>
              <button onClick={() => setPrivacyOpen(false)} className="text-tv-gray hover:text-tv-black">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-xs text-tv-gray leading-relaxed space-y-2">
              <p>
                Your privacy is paramount. We do not sell your personal data or trading activity to third-party data brokers.
              </p>
              <p>
                Session preferences and watchlist selections are maintained locally for your convenience.
              </p>
            </div>
            <button
              onClick={() => setPrivacyOpen(false)}
              className="w-full py-2 bg-tv-black text-white text-xs font-semibold rounded-lg hover:bg-tv-black/90 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
