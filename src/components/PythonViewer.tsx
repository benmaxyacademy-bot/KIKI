import React, { useState } from 'react';
import { Copy, Check, Download, Code2, Sparkles, HelpCircle } from 'lucide-react';
import { sound } from '../audio/soundEffects';

interface PythonViewerProps {
  code: string;
  studentName?: string;
}

export const PythonViewer: React.FC<PythonViewerProps> = ({ code, studentName = 'Juara Cilik' }) => {
  const [copied, setCopied] = useState(false);
  const [showExplanation, setShowExplanation] = useState(true);

  const cleanCode = code.trim() || '# Susun balok di sebelah kiri untuk melihat baris kode Python-mu!';

  const handleCopy = () => {
    sound.playClick();
    navigator.clipboard.writeText(cleanCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    sound.playClick();
    // Wrap with full runnable standalone Python script (Turtle / Pygame friendly)
    const fullPythonScript = `"""
Game Snake Python - Karya Siswa SD: ${studentName}
Dibuat dengan platform UlarPintar (Blockly to Python)
"""
import time
import random

# ==========================================
# KODE HASIL SUSUNAN BALOK BLOCKLY KAMU:
# ==========================================
${cleanCode}

# Penjelasan:
# Kode di atas adalah logika inti dari Game Snake yang kamu rakit dengan balok!
# Komputer mengeksekusi perintah baris demi baris dari atas ke bawah.
`;

    const blob = new Blob([fullPythonScript], { type: 'text/x-python;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `game_snake_${studentName.toLowerCase().replace(/\s+/g, '_')}.py`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Simple pedagogical parser to highlight Python concepts for elementary kids
  const renderHighlightedCode = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const isComment = line.trim().startsWith('#');
      const isKeyword =
        line.includes('while ') ||
        line.includes('if ') ||
        line.includes('elif ') ||
        line.includes('def ') ||
        line.includes('import ') ||
        line.includes('print');

      return (
        <div key={idx} className="flex font-mono text-xs sm:text-sm leading-relaxed hover:bg-slate-800/40 px-2 py-0.5 rounded">
          <span className="text-slate-500 w-8 select-none text-right pr-3 shrink-0 tabular-nums">
            {idx + 1}
          </span>
          <span
            className={
              isComment
                ? 'text-emerald-400 italic'
                : isKeyword
                ? 'text-cyan-300 font-medium'
                : 'text-slate-200'
            }
          >
            {line}
          </span>
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-2xl border border-slate-800 shadow-sm overflow-hidden text-slate-100">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/70 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold tracking-tight text-white">
            Bahasa Python Langsung (Live Python)
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowExplanation((prev) => !prev)}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg transition-colors ${
              showExplanation
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Tampilkan arti kode dalam bahasa sehari-hari"
          >
            <HelpCircle className="w-3 h-3" />
            <span className="hidden sm:inline">Arti Kode</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 rounded-lg transition-colors"
            title="Salin kode Python"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Salin</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
            title="Unduh file .py"
          >
            <Download className="w-3 h-3" />
            <span>Unduh .py</span>
          </button>
        </div>
      </div>

      {/* Code Editor body */}
      <div className="flex-1 overflow-auto p-3 bg-slate-900 font-mono">
        {renderHighlightedCode(cleanCode)}
      </div>

      {/* Kid-friendly translation box */}
      {showExplanation && (
        <div className="p-3 bg-slate-950/90 border-t border-slate-800 text-xs text-slate-300">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kamus Bahasa Ular untuk Anak SD:</span>
          </div>
          <p className="leading-relaxed text-[11px] text-slate-400">
            Setiap balok warna-warni yang kamu hubungkan berubah menjadi teks Python di atas!
            Contohnya <code className="text-cyan-300 font-mono">while game_aktif:</code> artinya
            komputer disuruh mengulang perintah di dalamnya terus-menerus selama ular tidak menabrak!
          </p>
        </div>
      )}
    </div>
  );
};
