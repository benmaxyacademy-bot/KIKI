import React, { useState } from 'react';
import { QuizQuestion } from '../types/lms';
import { CheckCircle2, XCircle, ArrowRight, Sparkles, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../audio/soundEffects';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  quiz: QuizQuestion;
  levelNumber: number;
  onSuccess: () => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  isOpen,
  onClose,
  quiz,
  levelNumber,
  onSuccess,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSelect = (id: string) => {
    if (isSubmitted) return;
    sound.playClick();
    setSelectedOptionId(id);
  };

  const selectedOption = quiz.options.find((o) => o.id === selectedOptionId);
  const isCorrect = selectedOption?.isCorrect ?? false;

  const handleSubmit = () => {
    if (!selectedOptionId) return;
    setIsSubmitted(true);

    if (isCorrect) {
      sound.playLevelWin();
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {
        // confetti fallback
      }
      onSuccess();
    } else {
      sound.playGameOver();
    }
  };

  const handleReset = () => {
    sound.playClick();
    setSelectedOptionId(null);
    setIsSubmitted(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💡</span>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Kuis Cepat Pemahaman (Level {levelNumber})
              </h3>
              <p className="text-xs text-slate-500">Jawab dengan benar untuk mendapat Bintang Emas!</p>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="p-4 bg-amber-50/70 border border-amber-200/60 rounded-2xl mb-4">
          <p className="text-sm font-semibold text-slate-800 leading-relaxed">
            {quiz.question}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-2.5 mb-5">
          {quiz.options.map((opt) => {
            const isChosen = selectedOptionId === opt.id;
            let btnStyle = 'border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 bg-white text-slate-800';

            if (isSubmitted) {
              if (opt.isCorrect) {
                btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
              } else if (isChosen && !opt.isCorrect) {
                btnStyle = 'border-red-400 bg-red-50 text-red-900 line-through';
              }
            } else if (isChosen) {
              btnStyle = 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-500/30';
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between ${btnStyle}`}
              >
                <span>{opt.text}</span>
                {isSubmitted && opt.isCorrect && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
                {isSubmitted && isChosen && !opt.isCorrect && (
                  <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation upon submit */}
        {isSubmitted && (
          <div
            className={`p-3.5 rounded-xl text-xs mb-4 leading-relaxed ${
              isCorrect
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                : 'bg-red-50 border border-red-200 text-red-900'
            }`}
          >
            <strong className="block font-bold mb-1">
              {isCorrect ? '🌟 Luar biasa, jawabanmu benar!' : 'Yuk coba ingat lagi:'}
            </strong>
            {quiz.explanation}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
          {!isSubmitted ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl"
              >
                Nanti Saja
              </button>
              <button
                disabled={!selectedOptionId}
                onClick={handleSubmit}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl shadow-xs transition-colors"
              >
                <span>Periksa Jawaban</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          ) : isCorrect ? (
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors"
            >
              <span>Lanjutkan Koding!</span>
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="px-5 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Coba Pilih Lagi
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
