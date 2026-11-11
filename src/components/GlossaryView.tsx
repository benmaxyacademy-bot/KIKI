import React from 'react';
import { GLOSSARY_TERMS } from '../data/curriculum';
import { BookOpen, Code2 } from 'lucide-react';

export const GlossaryView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto py-6 px-4">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-emerald-600 mb-1">
          <BookOpen className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wide">
            Kamus Istilah Koding SD
          </span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Kata Kunci Pemrograman Python untuk Anak Pintar
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Pelajari istilah-istilah keren yang digunakan para programmer dunia saat membuat game!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {GLOSSARY_TERMS.map((term, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{term.icon}</span>
                <h3 className="text-base font-bold text-slate-900">{term.term}</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                {term.simpleExplain}
              </p>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono text-emerald-300">
              <div className="text-[10px] text-slate-400 mb-1 font-sans flex items-center gap-1">
                <Code2 className="w-3 h-3 text-emerald-400" />
                <span>Bentuk di Python:</span>
              </div>
              <pre className="whitespace-pre font-mono text-[11px] overflow-x-auto text-emerald-200">
                {term.pythonExample}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
