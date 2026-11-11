import React from 'react';
import { CURRICULUM_LEVELS } from '../data/curriculum';
import { Star, Lock, CheckCircle2, Play, Sparkles } from 'lucide-react';
import { sound } from '../audio/soundEffects';

interface LevelSelectorProps {
  currentLevelId: number;
  unlockedLevels: number[];
  completedLevels: number[];
  levelStars: Record<number, number>;
  onSelectLevel: (id: number) => void;
  onOpenGuideModal: () => void;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({
  currentLevelId,
  unlockedLevels,
  completedLevels,
  levelStars,
  onSelectLevel,
  onOpenGuideModal,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span>🗺️ Peta Petualangan Koding Ular</span>
            </h2>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              🔓 Semua Misi Terbuka
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Semua level terbuka bebas! Kamu bisa memilih level mana saja untuk dipelajari atau diselesaikan.
          </p>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onOpenGuideModal();
          }}
          className="flex items-center gap-1.5 self-start sm:self-auto px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Lihat Panduan Koordinat (X,Y)</span>
        </button>
      </div>

      {/* Grid of Level Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2.5">
        {CURRICULUM_LEVELS.map((lvl) => {
          const isUnlocked = unlockedLevels.includes(lvl.id);
          const isCompleted = completedLevels.includes(lvl.id);
          const isCurrent = currentLevelId === lvl.id;
          const stars = levelStars[lvl.id] || (isCompleted ? 2 : 0);

          let borderStyle = 'border-slate-200 bg-slate-50/70 text-slate-400';
          if (isCurrent) {
            borderStyle = 'border-emerald-600 bg-emerald-50/60 text-slate-900 ring-2 ring-emerald-500/20';
          } else if (isCompleted) {
            borderStyle = 'border-emerald-200 bg-white text-slate-800 hover:border-emerald-400';
          } else if (isUnlocked) {
            borderStyle = 'border-slate-200 bg-white text-slate-800 hover:border-slate-300';
          }

          return (
            <button
              key={lvl.id}
              disabled={!isUnlocked}
              onClick={() => {
                sound.playClick();
                onSelectLevel(lvl.id);
              }}
              className={`text-left p-3 rounded-xl border transition-all flex flex-col justify-between relative group ${borderStyle} ${
                !isUnlocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-lg">{lvl.icon}</span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : !isUnlocked ? (
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                  ) : isCurrent ? (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  ) : null}
                </div>

                <div className="text-xs font-bold truncate">
                  Level {lvl.id}
                </div>
                <div className="text-[11px] text-slate-500 font-medium line-clamp-1">
                  {lvl.conceptName}
                </div>
              </div>

              {/* Star rating */}
              <div className="flex items-center gap-0.5 mt-2 pt-2 border-t border-slate-100/80">
                {[1, 2, 3].map((starIdx) => (
                  <Star
                    key={starIdx}
                    className={`w-3 h-3 ${
                      starIdx <= stars
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
