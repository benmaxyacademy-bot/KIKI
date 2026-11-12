import React from 'react';
import { Volume2, VolumeX, Award, BookOpen } from 'lucide-react';
import { sound } from '../audio/soundEffects';

interface NavbarProps {
  activeTab: 'curriculum' | 'games' | 'sandbox' | 'badges' | 'glossary';
  onSelectTab: (tab: 'curriculum' | 'games' | 'sandbox' | 'badges' | 'glossary') => void;
  isMuted: boolean;
  onToggleMute: () => void;
  completedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  isMuted,
  onToggleMute,
  completedCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title, one line */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              sound.playClick();
              onSelectTab('curriculum');
            }}
            className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-xl shadow-sm text-white font-bold group-hover:scale-105 transition-transform">
              🎮
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 whitespace-nowrap">
              Gaming with <span className="text-emerald-600">KIKI</span>
            </span>
          </button>
        </div>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
          <button
            onClick={() => {
              sound.playClick();
              onSelectTab('curriculum');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'curriculum'
                ? 'text-emerald-600 font-bold border-b-2 border-emerald-600'
                : 'hover:text-slate-900'
            }`}
          >
            Misi Ular
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onSelectTab('games');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'games'
                ? 'text-indigo-600 font-bold border-b-2 border-indigo-600'
                : 'hover:text-slate-900'
            }`}
          >
            Studio Game Lainnya
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onSelectTab('sandbox');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'sandbox'
                ? 'text-emerald-600 font-bold border-b-2 border-emerald-600'
                : 'hover:text-slate-900'
            }`}
          >
            Arena Kreasi
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onSelectTab('badges');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'badges'
                ? 'text-emerald-600 font-bold border-b-2 border-emerald-600'
                : 'hover:text-slate-900'
            }`}
          >
            Piala & Lencana
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onSelectTab('glossary');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'glossary'
                ? 'text-emerald-600 font-bold border-b-2 border-emerald-600'
                : 'hover:text-slate-900'
            }`}
          >
            Kamus Koding
          </button>
        </nav>

        {/* Zone 3: Audio helper and player status badge */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200/80 rounded-xl text-xs font-bold text-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Misi Selesai: {completedCount} Level</span>
          </div>

          <button
            onClick={onToggleMute}
            title={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-label="Toggle Sound"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-emerald-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
