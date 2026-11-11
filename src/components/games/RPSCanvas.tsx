import React, { useState } from 'react';
import { RotateCcw, Trophy, Sparkles } from 'lucide-react';
import { sound } from '../../audio/soundEffects';

type Choice = 'Batu' | 'Gunting' | 'Kertas';

const CHOICES: Array<{ id: Choice; label: string; icon: string; beats: Choice; color: string }> = [
  { id: 'Batu', label: 'Batu 🪨', icon: '🪨', beats: 'Gunting', color: 'from-slate-600 to-slate-800' },
  { id: 'Gunting', label: 'Gunting ✂️', icon: '✂️', beats: 'Kertas', color: 'from-amber-500 to-orange-600' },
  { id: 'Kertas', label: 'Kertas 📄', icon: '📄', beats: 'Batu', color: 'from-blue-500 to-indigo-600' },
];

export const RPSCanvas: React.FC = () => {
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [botChoice, setBotChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<'MENANG' | 'KALAH' | 'SERI' | null>(null);
  const [playerScore, setPlayerScore] = useState<number>(0);
  const [botScore, setBotScore] = useState<number>(0);
  const [isShuffling, setIsShuffling] = useState<boolean>(false);
  const [explanation, setExplanation] = useState<string>('Pilih tanganmu di bawah untuk melawan Komputer!');

  const handlePlay = (choice: Choice) => {
    sound.playClick();
    setIsShuffling(true);
    setPlayerChoice(choice);
    setBotChoice(null);
    setResult(null);

    // Playful suspense for kids
    setTimeout(() => {
      const allChoices: Choice[] = ['Batu', 'Gunting', 'Kertas'];
      const randomBot = allChoices[Math.floor(Math.random() * allChoices.length)];
      setBotChoice(randomBot);
      setIsShuffling(false);

      if (choice === randomBot) {
        setResult('SERI');
        setExplanation(`Sama-sama memilih ${choice}! Hasilnya Seri! 🤝`);
        sound.playBounce();
      } else if (
        (choice === 'Batu' && randomBot === 'Gunting') ||
        (choice === 'Gunting' && randomBot === 'Kertas') ||
        (choice === 'Kertas' && randomBot === 'Batu')
      ) {
        setResult('MENANG');
        setPlayerScore((p) => p + 1);
        setExplanation(`Hebat! ${choice} mengalahkan ${randomBot}! Kamu Menang! 🎉`);
        sound.playLevelWin();
      } else {
        setResult('KALAH');
        setBotScore((b) => b + 1);
        setExplanation(`Aduh! ${randomBot} mengalahkan ${choice}! Komputer Menang! Coba lagi ya! 💪`);
        sound.playGameOver();
      }
    }, 500);
  };

  const handleReset = () => {
    sound.playClick();
    setPlayerChoice(null);
    setBotChoice(null);
    setResult(null);
    setPlayerScore(0);
    setBotScore(0);
    setExplanation('Pilih tanganmu di bawah untuk melawan Komputer!');
  };

  return (
    <div className="flex flex-col items-center bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      {/* Header score */}
      <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">Skor Kamu:</span>
          <span className="font-mono text-emerald-600 font-extrabold text-base">{playerScore}</span>
        </div>

        <button
          onClick={handleReset}
          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg text-xs flex items-center gap-1 font-semibold"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">Skor Bot:</span>
          <span className="font-mono text-purple-600 font-extrabold text-base">{botScore}</span>
        </div>
      </div>

      {/* Battle Arena */}
      <div className="w-full h-56 bg-gradient-to-b from-slate-900 to-indigo-950 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden text-white shadow-inner mb-4">
        {/* Background artwork */}
        <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
          <img
            src="/src/assets/images/game_rps_hands_1794382232346.jpg"
            alt="RPS Illustration"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="flex items-center justify-around w-full max-w-sm relative z-10">
          {/* Player Choice */}
          <div className="flex flex-col items-center">
            <span className="text-[11px] text-cyan-300 font-bold mb-1">Pilihanmu:</span>
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-3xl shadow-sm">
              {playerChoice ? (
                playerChoice === 'Batu' ? '🪨' : playerChoice === 'Gunting' ? '✂️' : '📄'
              ) : (
                '❓'
              )}
            </div>
            <span className="text-xs font-bold mt-1 text-slate-200">
              {playerChoice || 'Belum dipilih'}
            </span>
          </div>

          <div className="text-xl font-black text-amber-400">VS</div>

          {/* Bot Choice */}
          <div className="flex flex-col items-center">
            <span className="text-[11px] text-purple-300 font-bold mb-1">Komputer (Bot):</span>
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-3xl shadow-sm">
              {isShuffling ? (
                <span className="animate-spin text-2xl">🎲</span>
              ) : botChoice ? (
                botChoice === 'Batu' ? '🪨' : botChoice === 'Gunting' ? '✂️' : '📄'
              ) : (
                '🤖'
              )}
            </div>
            <span className="text-xs font-bold mt-1 text-slate-200">
              {isShuffling ? 'Memilih...' : botChoice || 'Siap'}
            </span>
          </div>
        </div>

        {/* Result banner */}
        {result && (
          <div className="mt-4 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wide bg-white/20 backdrop-blur-xs flex items-center gap-1.5 animate-in zoom-in duration-200">
            {result === 'MENANG' && <span className="text-emerald-300">🎉 Kamu Menang Ronde Ini!</span>}
            {result === 'KALAH' && <span className="text-rose-300">💥 Komputer Menang!</span>}
            {result === 'SERI' && <span className="text-yellow-300">🤝 Hasilnya Seri!</span>}
          </div>
        )}
      </div>

      {/* Explanation banner */}
      <div className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs font-medium text-slate-700 mb-4">
        {explanation}
      </div>

      {/* Choice Buttons for kids */}
      <div className="w-full flex items-center justify-center gap-2.5">
        {CHOICES.map((c) => (
          <button
            key={c.id}
            onClick={() => handlePlay(c.id)}
            className="flex-1 py-3 px-2 bg-gradient-to-r hover:scale-105 active:scale-95 transition-all text-white font-bold text-xs rounded-xl shadow-xs flex flex-col items-center gap-1 border border-white/20"
            style={{
              backgroundImage:
                c.id === 'Batu'
                  ? 'linear-gradient(to right, #475569, #334155)'
                  : c.id === 'Gunting'
                  ? 'linear-gradient(to right, #ea580c, #c2410c)'
                  : 'linear-gradient(to right, #2563eb, #1d4ed8)',
            }}
          >
            <span className="text-2xl">{c.icon}</span>
            <span>{c.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
