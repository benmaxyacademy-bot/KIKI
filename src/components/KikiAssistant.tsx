import React, { useState } from 'react';
import { Sparkles, MessageCircle, Send, HelpCircle, Lightbulb } from 'lucide-react';
import { sound } from '../audio/soundEffects';

interface KikiAssistantProps {
  currentHint: string;
  levelTitle: string;
}

const PRESET_QUESTIONS = [
  'Apa itu Koordinat X dan Y?',
  'Kenapa Ular butuh Game Loop?',
  'Bagaimana komputer tahu Ular makan apel?',
  'Kenapa koding Python sangat seru?',
];

const PRESET_ANSWERS: Record<string, string> = {
  'Apa itu Koordinat X dan Y?':
    'Bayangkan papan catur atau ubin lantai di kamarmu! Koordinat X adalah nomor ubin dari kiri ke kanan. Koordinat Y adalah nomor ubin dari atas ke bawah. Titik (10, 10) artinya 10 langkah ke kanan dan 10 langkah ke bawah, tepat di tengah ruangan!',
  'Kenapa Ular butuh Game Loop?':
    'Game loop itu seperti detak jantung game! Setiap sepersekian detik, komputer mengecek: "Ular melangkah ke mana? Apakah tombol ditekan? Apakah apel termakan?". Tanpa game loop, ular kita akan diam membeku seperti foto!',
  'Bagaimana komputer tahu Ular makan apel?':
    'Komputer itu jago matematika! Dia mencocokkan: apakah koordinat kepala ular sama persis dengan koordinat apel? Jika ular_x == apel_x dan ular_y == apel_y, komputer langsung berseru: "Hore! Ular makan apel!" lalu skor kita dinaikkan!',
  'Kenapa koding Python sangat seru?':
    'Karena dengan Python, kamu adalah pencipta duniamu sendiri! Kamu bisa membuat game kesukaanmu, memilih warna ularmu, dan membuat aturan sendiri. Banyak programmer hebat di dunia memulainya dari game Snake seperti kamu!',
};

export const KikiAssistant: React.FC<KikiAssistantProps> = ({ currentHint, levelTitle }) => {
  const [messages, setMessages] = useState<Array<{ sender: 'kiki' | 'user'; text: string }>>([
    {
      sender: 'kiki',
      text: `Halo teman pintar! Aku Kiki si Ular Hijau 🐍. Di ${levelTitle}, aku siap membantumu jika kamu bingung menyusun balok Blockly!`,
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendQuestion = (questionText: string) => {
    if (!questionText.trim()) return;
    sound.playClick();

    const userQ = questionText.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userQ }]);
    setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      let answer = PRESET_ANSWERS[userQ];
      if (!answer) {
        // Friendly smart fallback response
        answer = `Pertanyaan bagus tentang "${userQ}"! Di level ini, coba perhatikan balok warna-warni di sebelah kiri. Ingat, kamu selalu bisa klik tombol "Balok Awal" jika ingin memulai susunan yang rapi ya! Semangat terus, kamu hebat! ✨`;
      }
      setMessages((prev) => [...prev, { sender: 'kiki', text: answer }]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden flex flex-col">
      {/* Mascot Header */}
      <div className="p-3.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-white/80 overflow-hidden bg-white shrink-0 shadow-sm">
            <img
              src="/src/assets/images/hero_snake_mascot_1794361233716.jpg"
              alt="Kiki si Ular Pintar"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h4 className="text-sm font-bold leading-tight">Kiki si Sahabat Koding</h4>
            <p className="text-[11px] text-emerald-100">Tutor Ramah Anak SD</p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-lg text-xs font-semibold">
          <Lightbulb className="w-3.5 h-3.5 text-yellow-300" />
          <span>Tips</span>
        </div>
      </div>

      {/* Current Hint Banner */}
      <div className="p-3 bg-emerald-50 border-b border-emerald-100 text-xs text-emerald-900 flex items-start gap-2">
        <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <p className="leading-snug">
          <strong className="font-bold">Petunjuk Kiki: </strong>
          {currentHint}
        </p>
      </div>

      {/* Chat Messages */}
      <div className="p-3 space-y-2.5 max-h-48 overflow-y-auto text-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-3 py-2 leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-emerald-600 text-white rounded-tr-xs'
                  : 'bg-slate-100 text-slate-800 rounded-tl-xs'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="text-xs text-slate-400 italic flex items-center gap-1">
            <span>Kiki sedang mengetik jawaban</span>
            <span className="animate-pulse">...</span>
          </div>
        )}
      </div>

      {/* Quick Questions buttons for Kids */}
      <div className="px-3 pt-1 pb-2 flex flex-wrap gap-1 border-t border-slate-100 bg-slate-50">
        <span className="text-[10px] text-slate-500 w-full mb-0.5">Tanya cepat:</span>
        {PRESET_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendQuestion(q)}
            className="text-[11px] px-2.5 py-1 bg-white hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 rounded-lg text-slate-700 transition-colors text-left"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendQuestion(inputVal);
        }}
        className="p-2 bg-white border-t border-slate-200 flex items-center gap-1.5"
      >
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Tanya apa saja ke Kiki..."
          className="flex-1 text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800"
        />
        <button
          type="submit"
          className="p-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl transition-colors"
          title="Kirim pertanyaan"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
