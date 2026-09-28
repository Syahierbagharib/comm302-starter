import React, { useState } from 'react';
import { X, Check, Sparkles, Shield, Zap } from 'lucide-react';

interface GetStartedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GetStartedModal: React.FC<GetStartedModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-tv-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-tv-border overflow-hidden p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-tv-gray hover:text-tv-black rounded-lg hover:bg-tv-lightGray transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-10 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-tv-greenBg text-tv-green mx-auto flex items-center justify-center animate-bounce">
              <Check className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-tv-black">Welcome to TradingView!</h4>
            <p className="text-xs text-tv-gray">
              Verification email sent to <strong className="text-tv-black">{email}</strong>. Prepare for the markets!
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#2962FF] to-[#B028F5] flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-sm tracking-tight text-tv-black">
                TradingView Account
              </span>
            </div>

            <div>
              <h3 className="text-2xl font-black tracking-tight text-tv-black">
                Look first / Then leap.
              </h3>
              <p className="text-xs text-tv-gray mt-1 leading-relaxed">
                Join 60+ million traders and investors charting, researching, and conquering global markets.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-tv-black">
                <Zap className="w-4 h-4 text-tv-blue shrink-0" />
                <span>Real-time quotes across 1,350,000+ financial instruments</span>
              </div>
              <div className="flex items-center gap-2 text-tv-black">
                <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                <span>100+ pre-built technical indicators & Pine Script™ custom strategies</span>
              </div>
              <div className="flex items-center gap-2 text-tv-black">
                <Shield className="w-4 h-4 text-tv-green shrink-0" />
                <span>Multi-broker trade execution and unified portfolio tracking</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-tv-gray block mb-1">Email address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-tv-border text-sm text-tv-black placeholder:text-tv-gray focus:outline-none focus:border-tv-blue"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#2962FF] via-[#5B3CF5] to-[#B028F5] text-white text-sm font-bold shadow-md hover:opacity-95 transition-opacity cursor-pointer"
              >
                Create Free Account
              </button>
            </form>

            <div className="text-[11px] text-center text-tv-gray">
              By continuing, you agree to TradingView's Terms of Use & Privacy Policy.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
