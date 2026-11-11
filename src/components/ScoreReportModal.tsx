import React from 'react';
import { EvaluationResult } from '../utils/codeEvaluator';
import { CheckCircle2, XCircle, Star, ArrowRight, RotateCcw, Sparkles, Trophy } from 'lucide-react';
import { sound } from '../audio/soundEffects';

interface ScoreReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: EvaluationResult | null;
  levelTitle: string;
  onNextLevel?: () => void;
}

export const ScoreReportModal: React.FC<ScoreReportModalProps> = ({
  isOpen,
  onClose,
  result,
  levelTitle,
  onNextLevel,
}) => {
  if (!isOpen || !result) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header banner */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-green-600 text-white shadow-md mb-2">
            {result.passed ? (
              <Trophy className="w-8 h-8 text-yellow-300 drop-shadow" />
            ) : (
              <Sparkles className="w-8 h-8 text-white" />
            )}
          </div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">
            {result.message}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">{levelTitle}</p>
        </div>

        {/* Score & Stars Card */}
        <div className="bg-gradient-to-b from-slate-50 to-emerald-50/40 border border-slate-200/80 rounded-2xl p-4 mb-4 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-2">
            {[1, 2, 3].map((s) => (
              <Star
                key={s}
                className={`w-7 h-7 ${
                  s <= result.stars
                    ? 'text-amber-400 fill-amber-400 drop-shadow-xs animate-bounce-gentle'
                    : 'text-slate-200'
                }`}
              />
            ))}
          </div>

          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-black text-emerald-700 font-mono">
              {result.score}
            </span>
            <span className="text-slate-400 font-bold text-sm">/ 100 Poin</span>
          </div>

          <span
            className={`inline-block mt-2 px-3 py-0.5 text-xs font-bold rounded-full ${
              result.passed
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-amber-100 text-amber-800 border border-amber-300'
            }`}
          >
            {result.passed ? '🎉 KODE LULUS EVALUASI!' : '💡 PERLU SEDIKIT PERBAIKAN'}
          </span>
        </div>

        {/* Mascot Feedback Quote */}
        <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl mb-4 flex items-start gap-2.5">
          <span className="text-2xl shrink-0">🐍</span>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
              Catatan Tutor Kiki:
            </span>
            <p className="text-xs text-emerald-950 font-medium leading-relaxed">
              {result.feedback}
            </p>
          </div>
        </div>

        {/* Criteria Checklist */}
        <div className="mb-5">
          <span className="text-xs font-bold text-slate-700 block mb-2">
            Kriteria Penilaian Kode:
          </span>
          <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
            {result.criteria.map((c) => (
              <div
                key={c.id}
                className={`p-2.5 rounded-xl border text-xs flex items-center justify-between transition-colors ${
                  c.passed
                    ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                    : 'bg-slate-50 border-slate-200 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  {c.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                  <span className={c.passed ? 'font-semibold' : 'text-slate-600'}>
                    {c.label}
                  </span>
                </div>
                <span
                  className={`font-mono font-bold text-[11px] shrink-0 ml-2 ${
                    c.passed ? 'text-emerald-700' : 'text-slate-400'
                  }`}
                >
                  +{c.points} Poin
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl"
          >
            Tutup
          </button>

          {result.passed && onNextLevel ? (
            <button
              onClick={() => {
                sound.playClick();
                onNextLevel();
              }}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-xl shadow-xs transition-all"
            >
              <span>Lanjut ke Misi Berikutnya</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs"
            >
              Coba Perbaiki Balok
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
