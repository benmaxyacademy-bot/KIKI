import React, { useState } from 'react';
import { X, Printer, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import { sound } from '../audio/soundEffects';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  onUpdateName: (name: string) => void;
  completedLevelsCount: number;
  totalLevelsCount: number;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  studentName,
  onUpdateName,
  completedLevelsCount,
  totalLevelsCount,
}) => {
  const [name, setName] = useState(studentName || 'Budi Santoso');
  const isEligible = completedLevelsCount >= 4; // unlocked when they finish 4+ levels or all 6

  if (!isOpen) return null;

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  const todayStr = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 flex flex-col print:shadow-none print:border-none print:max-w-none">
        {/* Header / Close bar */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-extrabold text-slate-900">
              Sertifikat Kelulusan Programmer Python Cilik
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student name input box for customization */}
        <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3 print:hidden">
          <label className="text-xs font-bold text-slate-700 whitespace-nowrap">
            Nama Siswa:
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              onUpdateName(e.target.value);
            }}
            placeholder="Tulis namamu di sini..."
            className="flex-1 text-xs sm:text-sm px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold text-slate-900"
          />
        </div>

        {/* The Printable Certificate Design */}
        <div className="relative border-8 border-double border-amber-400/80 rounded-2xl p-6 sm:p-8 bg-gradient-to-b from-amber-50/40 via-white to-emerald-50/30 text-center flex flex-col items-center shadow-inner">
          {/* Watermark badge */}
          <div className="w-20 h-20 mb-3 drop-shadow-md">
            <img
              src="/src/assets/images/badge_python_master_1794361234669.jpg"
              alt="Lencana Juara"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>

          <span className="text-xs uppercase tracking-widest text-emerald-700 font-extrabold mb-1">
            SERTIFIKAT KELULUSAN KODING SD
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            Master Game Snake Python
          </h2>
          <p className="text-xs text-slate-500 mb-4 max-w-md">
            Diberikan dengan bangga atas keberhasilan menyelesaikan kurikulum logika pemrograman
            Python menggunakan balok visual Blockly:
          </p>

          {/* Student Name callout */}
          <div className="w-full max-w-md border-b-2 border-emerald-600 pb-1 mb-4">
            <span className="text-xl sm:text-2xl font-black text-emerald-800 tracking-wide font-sans">
              {name || 'Nama Siswa'}
            </span>
          </div>

          <p className="text-xs text-slate-600 max-w-lg leading-relaxed mb-6">
            Telah berhasil merancang algoritma game Snake, menguasai sistem koordinat layar,
            perulangan Game Loop, deteksi tabrakan makan apel, dan kontrol keyboard interaktif.
          </p>

          {/* Footer of certificate with signature and date */}
          <div className="w-full flex items-center justify-between text-xs text-slate-600 pt-4 border-t border-slate-200">
            <div className="text-left">
              <span className="block text-[11px] text-slate-400">Tanggal Kelulusan:</span>
              <strong className="font-semibold text-slate-800">{todayStr}</strong>
            </div>

            <div className="text-center">
              <span className="block text-[11px] text-slate-400">Pencapaian:</span>
              <span className="font-mono font-bold text-emerald-700">
                {completedLevelsCount} / {totalLevelsCount} Misi Tuntas
              </span>
            </div>

            <div className="text-right">
              <span className="block text-[11px] text-slate-400">Mentor Koding:</span>
              <strong className="font-semibold text-slate-800">Kiki si Ular Pintar 🐍</strong>
            </div>
          </div>
        </div>

        {/* Footer print action */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 print:hidden">
          <p className="text-xs text-slate-500">
            {completedLevelsCount >= totalLevelsCount
              ? '🌟 Sempurna! Kamu telah menuntaskan seluruh misi koding!'
              : `Kamu sudah menyelesaikan ${completedLevelsCount} dari ${totalLevelsCount} level.`}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl"
            >
              Tutup
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Sertifikat</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
