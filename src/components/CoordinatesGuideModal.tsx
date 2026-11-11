import React from 'react';
import { X, MapPin } from 'lucide-react';

interface CoordinatesGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CoordinatesGuideModal: React.FC<CoordinatesGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-extrabold text-slate-900">
              Panduan Koordinat X dan Y untuk Game Snake
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Infographic Image */}
        <div className="rounded-2xl overflow-hidden border border-slate-200 mb-4 bg-emerald-50">
          <img
            src="/src/assets/images/guide_grid_illustration_1794361235658.jpg"
            alt="Panduan Koordinat Game Snake"
            className="w-full h-auto object-contain max-h-[360px]"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Kid-friendly explanations */}
        <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
            <strong className="text-emerald-900 block font-bold mb-0.5">
              1. Koordinat X (Mendatar / Kiri - Kanan)
            </strong>
            Angka X menghitung petak dari kiri ke kanan. Angka 0 ada di paling kiri, dan angka 19 ada di paling kanan.
          </div>

          <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
            <strong className="text-blue-900 block font-bold mb-0.5">
              2. Koordinat Y (Tegak / Atas - Bawah)
            </strong>
            Angka Y menghitung petak dari atas ke bawah. Angka 0 ada di baris paling atas, dan angka 19 ada di baris paling bawah.
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
            <strong className="text-amber-900 block font-bold mb-0.5">
              3. Titik Tengah (10, 10)
            </strong>
            Jika papan game kita berukuran 20x20, maka posisi X = 10 dan Y = 10 adalah tepat di tengah-tengah lapangan rumput Kiki!
          </div>
        </div>

        <div className="flex justify-end pt-4 mt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors"
          >
            Aku Mengerti!
          </button>
        </div>
      </div>
    </div>
  );
};
