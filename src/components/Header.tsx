import React, { useState, useRef, useEffect } from 'react';
import { Search, Globe, User, ChevronDown, Check, Sparkles, BookOpen, Layers, Users, TrendingUp, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenGetStarted: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch, onOpenGetStarted }) => {
  const [langOpen, setLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('EN');
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const communityRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'EN', name: 'English (US)' },
    { code: 'ES', name: 'Español' },
    { code: 'DE', name: 'Deutsch' },
    { code: 'FR', name: 'Français' },
    { code: 'JA', name: '日本語' },
    { code: 'ZH', name: '简体中文' }
  ];

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountMenuOpen(false);
      }
      if (productsRef.current && !productsRef.current.contains(e.target as Node)) {
        setProductsOpen(false);
      }
      if (communityRef.current && !communityRef.current.contains(e.target as Node)) {
        setCommunityOpen(false);
      }
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-tv-border" data-purpose="primary-navbar">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left brand & quick search */}
        <div className="flex items-center gap-6">
          {/* TradingView Monogram Mark Logo */}
          <a
            aria-label="TradingView Home"
            className="flex items-center gap-2 group cursor-pointer focus:outline-hidden"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <svg
              className="w-9 h-7 text-tv-black transition-transform group-hover:scale-105"
              fill="currentColor"
              viewBox="0 0 36 28"
            >
              <path d="M14 22H7V6h7v16zm8-16h-7v22h7V6zm8 7h-7v15h7V13z" />
            </svg>
          </a>

          {/* Search input trigger pill */}
          <div className="relative w-64 lg:w-72 hidden md:block">
            <button
              onClick={onOpenSearch}
              className="w-full flex items-center justify-between pl-4 pr-3 py-2 bg-tv-lightGray hover:bg-[#E6EAF2] rounded-full text-tv-gray text-sm transition-colors border border-transparent hover:border-tv-border cursor-pointer group"
              data-purpose="global-search-pill"
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-tv-gray group-hover:text-tv-black transition-colors" />
                <span className="text-xs font-normal group-hover:text-tv-black transition-colors">
                  Search (Ctrl+K)
                </span>
              </div>
            </button>
          </div>

          {/* Navigation categories links */}
          <nav className="hidden lg:flex items-center gap-6 text-[15px] font-medium" data-purpose="desktop-nav-links">
            {/* Products Dropdown */}
            <div className="relative" ref={productsRef}>
              <button
                onClick={() => setProductsOpen(!productsOpen)}
                className="flex items-center gap-1 text-tv-black hover:text-tv-blue transition-colors cursor-pointer"
              >
                <span>Products</span>
                <ChevronDown className={`w-3.5 h-3.5 text-tv-gray transition-transform duration-200 ${productsOpen ? 'rotate-180' : ''}`} />
              </button>
              {productsOpen && (
                <div className="absolute left-0 mt-3 w-64 bg-white rounded-xl shadow-xl border border-tv-border p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); setProductsOpen(false); }}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-tv-lightGray text-sm text-tv-black transition-colors"
                  >
                    <Layers className="w-4 h-4 text-tv-blue" />
                    <div>
                      <div className="font-semibold">Supercharts</div>
                      <div className="text-xs text-tv-gray">Next-gen financial charting</div>
                    </div>
                  </a>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); setProductsOpen(false); }}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-tv-lightGray text-sm text-tv-black transition-colors"
                  >
                    <TrendingUp className="w-4 h-4 text-tv-green" />
                    <div>
                      <div className="font-semibold">Screeners</div>
                      <div className="text-xs text-tv-gray">Filter stocks, crypto & forex</div>
                    </div>
                  </a>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); setProductsOpen(false); }}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-tv-lightGray text-sm text-tv-black transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <div>
                      <div className="font-semibold">Pine Script™</div>
                      <div className="text-xs text-tv-gray">Algorithm strategy builder</div>
                    </div>
                  </a>
                </div>
              )}
            </div>

            {/* Community Dropdown */}
            <div className="relative" ref={communityRef}>
              <button
                onClick={() => setCommunityOpen(!communityOpen)}
                className="flex items-center gap-1 text-tv-black hover:text-tv-blue transition-colors cursor-pointer"
              >
                <span>Community</span>
                <ChevronDown className={`w-3.5 h-3.5 text-tv-gray transition-transform duration-200 ${communityOpen ? 'rotate-180' : ''}`} />
              </button>
              {communityOpen && (
                <div className="absolute left-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-tv-border p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); setCommunityOpen(false); }}
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-tv-lightGray text-sm text-tv-black transition-colors"
                  >
                    <Users className="w-4 h-4 text-tv-blue" />
                    <span>Trade Ideas & Streams</span>
                  </a>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); setCommunityOpen(false); }}
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-tv-lightGray text-sm text-tv-black transition-colors"
                  >
                    <BookOpen className="w-4 h-4 text-tv-black" />
                    <span>Educational Hub</span>
                  </a>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); setCommunityOpen(false); }}
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-tv-lightGray text-sm text-tv-black transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Community Scripts</span>
                  </a>
                </div>
              )}
            </div>

            {/* Markets Active Tab */}
            <a className="text-tv-blue font-semibold border-b-2 border-tv-blue pb-0.5 cursor-pointer" href="#">
              Markets
            </a>

            {/* Brokers */}
            <a
              className="text-tv-black hover:text-tv-blue transition-colors cursor-pointer"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert('Integrated Brokers: Interactive Brokers, TradeStation, Tradovate, Saxo Bank, and OANDA.');
              }}
            >
              Brokers
            </a>

            {/* More Dropdown */}
            <div className="relative" ref={moreRef}>
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                className="flex items-center gap-1 text-tv-black hover:text-tv-blue transition-colors cursor-pointer"
              >
                <span>More</span>
                <ChevronDown className={`w-3.5 h-3.5 text-tv-gray transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`} />
              </button>
              {moreOpen && (
                <div className="absolute left-0 mt-3 w-48 bg-white rounded-xl shadow-xl border border-tv-border p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); setMoreOpen(false); }}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-tv-lightGray text-sm text-tv-black transition-colors"
                  >
                    <span>News & Analysis</span>
                  </a>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); setMoreOpen(false); }}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-tv-lightGray text-sm text-tv-black transition-colors"
                  >
                    <span>Mobile App</span>
                  </a>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); setMoreOpen(false); }}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-tv-lightGray text-sm text-tv-black transition-colors"
                  >
                    <HelpCircle className="w-4 h-4 text-tv-gray" />
                    <span>Help Center</span>
                  </a>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Right utility actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Mobile search trigger */}
          <button
            onClick={onOpenSearch}
            className="md:hidden p-2 text-tv-black hover:text-tv-blue rounded-full hover:bg-tv-lightGray transition-colors"
            title="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 text-tv-black hover:text-tv-blue text-sm font-semibold py-1.5 px-2 rounded-md hover:bg-tv-lightGray transition-colors cursor-pointer"
              title="Language selection"
            >
              <Globe className="w-5 h-5 text-tv-black" />
              <span className="text-xs uppercase tracking-wide">{currentLang}</span>
            </button>

            {langOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-tv-border p-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="text-[11px] font-semibold text-tv-gray px-2.5 py-1 uppercase">
                  Select Language
                </div>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setCurrentLang(lang.code);
                      setLangOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg transition-colors text-left ${
                      currentLang === lang.code
                        ? 'bg-tv-lightGray font-bold text-tv-blue'
                        : 'text-tv-black hover:bg-tv-ultraLight'
                    }`}
                  >
                    <span>{lang.name}</span>
                    {currentLang === lang.code && <Check className="w-3.5 h-3.5 text-tv-blue" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Profile Avatar Dropdown */}
          <div className="relative" ref={accountRef}>
            <button
              onClick={() => setAccountMenuOpen(!accountMenuOpen)}
              aria-label="User Account"
              className="p-2 text-tv-black hover:text-tv-blue rounded-full hover:bg-tv-lightGray transition-colors cursor-pointer"
            >
              <User className="w-5 h-5" />
            </button>

            {accountMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-tv-border p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-3 py-2 border-b border-tv-border mb-1">
                  <div className="font-bold text-sm text-tv-black">Trader Account</div>
                  <div className="text-xs text-tv-gray">Free Plan · Real-time feed</div>
                </div>
                <button
                  onClick={() => {
                    setAccountMenuOpen(false);
                    alert('Watchlist loaded: NVDA, AAPL, TSLA, BTC/USD');
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-tv-black hover:bg-tv-lightGray rounded-lg font-medium transition-colors"
                >
                  My Watchlists
                </button>
                <button
                  onClick={() => {
                    setAccountMenuOpen(false);
                    alert('Alerts manager: All price alerts active');
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-tv-black hover:bg-tv-lightGray rounded-lg font-medium transition-colors"
                >
                  Price Alerts
                </button>
                <button
                  onClick={() => {
                    setAccountMenuOpen(false);
                    onOpenGetStarted();
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-tv-blue hover:bg-tv-lightGray rounded-lg font-semibold transition-colors"
                >
                  Upgrade to Pro+
                </button>
              </div>
            )}
          </div>

          {/* CTA "Get started" button with signature vibrant gradient */}
          <button
            onClick={onOpenGetStarted}
            className="bg-gradient-to-r from-[#2962FF] via-[#5B3CF5] to-[#B028F5] text-white text-sm font-semibold px-5 py-2 rounded-full hover:opacity-95 shadow-sm transition-all transform active:scale-95 cursor-pointer whitespace-nowrap"
            data-purpose="cta-get-started"
          >
            Get started
          </button>
        </div>
      </div>
    </header>
  );
};
