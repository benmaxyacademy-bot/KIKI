import React from 'react';
import { CURRICULUM_LEVELS } from '../data/curriculum';
import { CheckCircle2, Lock, Star, Award, Sparkles } from 'lucide-react';
import { sound } from '../audio/soundEffects';

interface BadgesViewProps {
  completedLevels: number[];
  levelStars: Record<number, number>;
  onOpenCertificate: () => void;
}

export const BadgesView: React.FC<BadgesViewProps> = ({
  completedLevels,
  levelStars,
  onOpenCertificate,
}) => {
  const completedCount = completedLevels.length;
  const totalStars = Object.values(levelStars).reduce((acc, s) => acc + s, 0);

  return (
    <div className="max-w-5xl mx-auto py-6 px-4">
      {/* Hero Achievement Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-700 rounded-3xl p-6 sm:p-8 text-white shadow-md mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-24 h-24 rounded-2xl bg-white/10 p-2 border-2 border-white/20 backdrop-blur-xs shrink-0 flex items-center justify-center">
            <img
              src="/src/assets/images/badge_python_master_1794361234669.jpg"
              alt="Piala Juara Python"
              className="w-full h-full object-contain drop-shadow"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
              Galeri Prestasi Siswa
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-0.5">
              Koleksi Lencana & Trofi Juara
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-md">
              Kumpulkan semua lencana koding dengan menyelesaikan tantangan logika game Snake!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-emerald-800/60 p-4 rounded-2xl border border-emerald-400/20">
          <div className="text-center px-2">
            <span className="block text-2xl font-black text-yellow-300 font-mono">
              {completedCount} / 6
            </span>
            <span className="text-[11px] text-emerald-200">Misi Tuntas</span>
          </div>
          <div className="w-px h-10 bg-emerald-600" />
          <div className="text-center px-2">
            <span className="block text-2xl font-black text-amber-300 font-mono flex items-center justify-center gap-1">
              <Star className="w-5 h-5 fill-amber-300" />
              {totalStars}
            </span>
            <span className="text-[11px] text-emerald-200">Bintang Emas</span>
          </div>
        </div>
      </div>

      {/* Grid of Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {CURRICULUM_LEVELS.map((lvl) => {
          const isEarned = completedLevels.includes(lvl.id);
          const stars = levelStars[lvl.id] || (isEarned ? 2 : 0);

          return (
            <div
              key={lvl.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                isEarned
                  ? 'bg-white border-emerald-200 shadow-sm'
                  : 'bg-slate-50 border-slate-200 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-xs ${
                      isEarned
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {lvl.icon}
                  </div>

                  {isEarned ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Diraih
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-medium text-slate-400">
                      <Lock className="w-3.5 h-3.5" />
                      Terkunci
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  {lvl.badgeName}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-3">
                  {lvl.badgeDescription}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Level {lvl.id}</span>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= stars
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Certificate CTA */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Award className="w-8 h-8 text-amber-600 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-amber-950">
              Klaim Sertifikat Kelulusan Resmi
            </h4>
            <p className="text-xs text-amber-800">
              Selesaikan minimal 4 misi untuk membuka sertifikat digital dengan namamu!
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onOpenCertificate();
          }}
          className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-xs transition-colors whitespace-nowrap"
        >
          Lihat Sertifikat
        </button>
      </div>
    </div>
  );
};
