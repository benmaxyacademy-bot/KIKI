import React, { useState } from 'react';
import { Sparkles, MessageCircle, RotateCcw, Lightbulb, Code2, HelpCircle } from 'lucide-react';
import { sound } from '../audio/soundEffects';

interface KikiAssistantProps {
  currentHint: string;
  levelTitle: string;
}

interface PythonQA {
  id: string;
  category: 'dasar' | 'koordinat' | 'loop' | 'logika' | 'lanjutan';
  question: string;
  icon: string;
  shortLabel: string;
  explanation: string;
  codeSnippet?: string;
}

const PYTHON_KNOWLEDGE_BASE: PythonQA[] = [
  {
    id: 'koordinat',
    category: 'koordinat',
    icon: '📍',
    question: 'Bagaimana cara kerja Koordinat X dan Y di Python?',
    shortLabel: 'Koordinat X & Y',
    explanation:
      'Bayangkan papan catur atau ubin kamar! Koordinat X adalah nomor kotak dari kiri ke kanan (mendatar). Koordinat Y adalah nomor kotak dari atas ke bawah (tegak). Pada papan 20x20, kotak (10, 10) artinya tepat 10 petak ke kanan dan 10 petak ke bawah, tepat di tengah ruangan!',
    codeSnippet: '# Menaruh ular di tengah papan 20x20\nular_x = 10\nular_y = 10\nprint(f"Ular berada di petak ({ular_x}, {ular_y})")',
  },
  {
    id: 'variabel',
    category: 'dasar',
    icon: '📦',
    question: 'Apa itu Variabel di Python? (Contoh: skor = 0)',
    shortLabel: 'Variabel Python',
    explanation:
      'Variabel itu seperti kotak bekal yang diberi label nama! Kamu bisa menyimpan angka, kata, atau posisi di dalamnya. Misalnya, kotak bernama "skor" berisi angka 0. Saat makan apel, angka di dalam kotak "skor" diganti menjadi 10!',
    codeSnippet: '# Membuat variabel skor dan nyawa\nskor = 0\nnyawa = 3\n# Tambah skor saat makan apel\nskor = skor + 10',
  },
  {
    id: 'game_loop',
    category: 'loop',
    icon: '🔄',
    question: 'Apa itu Game Loop (while game_aktif:) di Python?',
    shortLabel: 'Game Loop (while)',
    explanation:
      'Game loop itu seperti detak jantung permainan! Komputer akan mengulang kode di dalamnya puluhan kali setiap detik untuk mengecek: "Ular maju ke mana? Apakah tombol ditekan? Apakah apel termakan?". Tanpa game loop, game akan diam membeku seperti gambar foto!',
    codeSnippet: 'while game_aktif:\n    gerakkan_ular_maju()\n    periksa_makan_apel()\n    tunggu_detik(0.2)',
  },
  {
    id: 'indentasi',
    category: 'dasar',
    icon: '📏',
    question: 'Mengapa di Python harus ada spasi menjorok (Indentasi)?',
    shortLabel: 'Spasi Indentasi',
    explanation:
      'Di bahasa Python, spasi menjorok ke dalam (4 spasi) adalah cara kita memberi tahu komputer balok mana yang berada DI DALAM perulangan atau syarat if. Tanpa spasi menjorok, Python akan bingung mana kode yang harus diulang!',
    codeSnippet: '# Perhatikan 4 spasi menjorok:\nwhile game_aktif:\n    ular_x += 1   # Ini berjalan di dalam loop!\nprint("Selesai")  # Ini di luar loop',
  },
  {
    id: 'makan_apel',
    category: 'logika',
    icon: '🍎',
    question: 'Bagaimana komputer tahu Ular makan apel?',
    shortLabel: 'Deteksi Makan Apel',
    explanation:
      'Komputer itu jago matematika! Setiap langkah, komputer mencocokkan: apakah koordinat kepala ular sama persis dengan koordinat apel? Jika ular_x == apel_x dan ular_y == apel_y, komputer langsung tahu apel termakan!',
    codeSnippet: 'if ular_x == apel_x and ular_y == apel_y:\n    skor += 10\n    ular_panjang += 1\n    pindahkan_apel_ke_titik_acak()',
  },
  {
    id: 'random',
    category: 'lanjutan',
    icon: '🎲',
    question: 'Apa fungsi import random dan random.randint()?',
    shortLabel: 'Acak (Random)',
    explanation:
      'Modul random seperti kocokan dadu ajaib! Dengan random.randint(1, 18), Python akan memilihkan angka secara acak. Inilah yang membuat apel muncul di tempat yang berbeda-beda setiap kali dimakan!',
    codeSnippet: 'import random\n# Memunculkan apel di koordinat acak\napel_x = random.randint(1, 18)\napel_y = random.randint(1, 18)',
  },
  {
    id: 'if_else',
    category: 'logika',
    icon: '🔀',
    question: 'Bagaimana cara kerja percabangan if, elif, dan else?',
    shortLabel: 'If, Elif, Else',
    explanation:
      'Percabangan seperti lampu lalu lintas atau persimpangan jalan! "JIKA (if) tombol KANAN ditekan, ular geser ke kanan. JIKA LAINNYA (elif) tombol ATAS ditekan, ular geser ke atas. SELAIN ITU (else), tetap jalan lurus."',
    codeSnippet: 'if arah == "KANAN":\n    ular_x += 1\nelif arah == "KIRI":\n    ular_x -= 1\nelse:\n    ular_y += 1',
  },
  {
    id: 'list_badan',
    category: 'lanjutan',
    icon: '🐍',
    question: 'Bagaimana cara menyimpan tubuh ular di List [ ] Python?',
    shortLabel: 'List Badan Ular',
    explanation:
      'List [ ] seperti gerbong kereta api yang berjejer! Gerbong paling depan adalah kepala ular [X, Y], diikuti ruas badan kedua, ketiga, dan seterusnya. Saat ular berjalan, gerbong kepala baru ditambah di depan, dan gerbong paling belakang dilepas!',
    codeSnippet: '# List koordinat gerbong tubuh ular\nbadan_ular = [[10, 10], [9, 10], [8, 10]]\n# Tambah kepala baru di index 0:\nbadan_ular.insert(0, [baru_x, baru_y])',
  },
  {
    id: 'game_over',
    category: 'logika',
    icon: '💥',
    question: 'Apa yang terjadi saat Game Over di kode Python?',
    shortLabel: 'Aturan Game Over',
    explanation:
      'Komputer mengecek apakah ular keluar batas (misal: ular_x < 0 atau ular_x >= 20) atau menabrak tubuhnya sendiri. Jika ya, variabel game_aktif diubah dari True menjadi False. Akibatnya, perulangan while berhenti!',
    codeSnippet: 'if ular_x < 0 or ular_x >= 20:\n    game_aktif = False\n    print("Game Over! Kamu menabrak dinding!")',
  },
];

export const KikiAssistant: React.FC<KikiAssistantProps> = ({ currentHint, levelTitle }) => {
  const [messages, setMessages] = useState<
    Array<{ sender: 'kiki' | 'user'; text: string; code?: string }>
  >([
    {
      sender: 'kiki',
      text: `Halo teman pintar! Aku Kiki 🐍 dari Gaming with KIKI. Di ${levelTitle}, kamu bisa klik tombol pertanyaan Python di bawah ini untuk belajar rahasia koding Python bersamaku tanpa perlu mengetik!`,
    },
  ]);
  const [activeCategory, setActiveCategory] = useState<
    'semua' | 'dasar' | 'koordinat' | 'loop' | 'logika' | 'lanjutan'
  >('semua');
  const [isTyping, setIsTyping] = useState(false);

  const filteredQuestions =
    activeCategory === 'semua'
      ? PYTHON_KNOWLEDGE_BASE
      : PYTHON_KNOWLEDGE_BASE.filter((q) => q.category === activeCategory);

  const handleSelectQuestion = (qa: PythonQA) => {
    sound.playClick();
    setMessages((prev) => [...prev, { sender: 'user', text: qa.question }]);
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'kiki',
          text: qa.explanation,
          code: qa.codeSnippet,
        },
      ]);
      setIsTyping(false);
    }, 400);
  };

  const handleResetChat = () => {
    sound.playClick();
    setMessages([
      {
        sender: 'kiki',
        text: `Obrolan di-reset! Pilih pertanyaan tentang Python di bawah ini ya teman-teman! 🐍`,
      },
    ]);
  };

  return (
    <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden flex flex-col">
      {/* Mascot Header */}
      <div className="p-3.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-white/80 overflow-hidden bg-white shrink-0 shadow-sm">
            <img
              src="/src/assets/images/hero_snake_mascot_1794361233716.jpg"
              alt="Kiki si Sahabat Koding"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h4 className="text-sm font-bold leading-tight">Tanya Python ke Kiki</h4>
            <p className="text-[11px] text-emerald-100">Gaming with KIKI · Tanya Jawab Interaktif</p>
          </div>
        </div>

        <button
          onClick={handleResetChat}
          title="Bersihkan obrolan"
          className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-2 py-1 rounded-lg text-xs font-semibold text-white transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Current Level Hint Banner */}
      <div className="p-3 bg-emerald-50 border-b border-emerald-100 text-xs text-emerald-950 flex items-start gap-2">
        <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <p className="leading-snug">
          <strong className="font-bold text-emerald-800">Petunjuk Misi Ini: </strong>
          {currentHint}
        </p>
      </div>

      {/* Chat Messages */}
      <div className="p-3 space-y-3 max-h-56 overflow-y-auto text-xs bg-slate-50/50">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[90%] rounded-2xl p-3 leading-relaxed shadow-2xs ${
                m.sender === 'user'
                  ? 'bg-emerald-600 text-white rounded-tr-xs font-medium'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs'
              }`}
            >
              {m.sender === 'kiki' && (
                <div className="flex items-center gap-1.5 mb-1 text-[11px] font-bold text-emerald-700">
                  <span>🐍</span>
                  <span>Kiki Menjelaskan:</span>
                </div>
              )}
              <p>{m.text}</p>

              {/* Code snippet display */}
              {m.code && (
                <div className="mt-2 p-2 rounded-lg bg-slate-900 text-emerald-300 font-mono text-[11px] overflow-x-auto border border-slate-800 leading-tight">
                  <div className="text-[10px] text-slate-400 mb-1 flex items-center gap-1 font-sans border-b border-slate-800 pb-0.5">
                    <Code2 className="w-3 h-3 text-emerald-400" />
                    <span>Contoh Kode Python:</span>
                  </div>
                  <pre>{m.code}</pre>
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="text-xs text-slate-400 italic flex items-center gap-1">
            <span>Kiki sedang menyiapkan jawaban Python</span>
            <span className="animate-pulse">...</span>
          </div>
        )}
      </div>

      {/* Interactive Python Question Selector (NO TEXT TYPING) */}
      <div className="p-3 border-t border-slate-200 bg-white flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Pilih Pertanyaan Python yang Ingin Kamu Ketahui:</span>
          </span>
          <span className="text-[10px] text-slate-400 font-medium">Klik untuk bertanya</span>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10px]">
          {(
            [
              { id: 'semua', label: 'Semua' },
              { id: 'koordinat', label: 'Koordinat' },
              { id: 'dasar', label: 'Variabel & Dasar' },
              { id: 'loop', label: 'Game Loop' },
              { id: 'logika', label: 'If & Tabrakan' },
              { id: 'lanjutan', label: 'List & Acak' },
            ] as const
          ).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-2 py-0.5 rounded-md whitespace-nowrap font-semibold transition-colors ${
                activeCategory === cat.id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Question Button Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-40 overflow-y-auto pr-1">
          {filteredQuestions.map((qa) => (
            <button
              key={qa.id}
              onClick={() => handleSelectQuestion(qa)}
              className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 hover:border-emerald-300 bg-slate-50 hover:bg-emerald-50/70 text-left transition-all active:scale-98 group"
            >
              <span className="text-base shrink-0 group-hover:scale-110 transition-transform">
                {qa.icon}
              </span>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold text-slate-800 block truncate group-hover:text-emerald-800">
                  {qa.shortLabel}
                </span>
                <span className="text-[10px] text-slate-500 line-clamp-1">
                  {qa.question}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
