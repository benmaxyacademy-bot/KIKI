import React, { useState } from 'react';
import { BlocklyEditor, ParsedBlocklyConfig } from './BlocklyEditor';
import { SnakeCanvas } from './SnakeCanvas';
import { PythonViewer } from './PythonViewer';
import { CURRICULUM_LEVELS } from '../data/curriculum';
import { Palette, Sparkles, Download } from 'lucide-react';
import { sound } from '../audio/soundEffects';

interface SandboxViewProps {
  studentName: string;
}

const SNAKE_COLOR_OPTIONS = [
  { name: 'Hijau Segar', color: '#10b981' },
  { name: 'Naga Api', color: '#ef4444' },
  { name: 'Naga Es', color: '#0ea5e9' },
  { name: 'Ular Emas', color: '#eab308' },
  { name: 'Ular Alien', color: '#8b5cf6' },
  { name: 'Ular Cokelat', color: '#92400e' },
];

const FOOD_OPTIONS: Array<{ id: 'apple' | 'star' | 'strawberry' | 'pizza' | 'donut'; label: string; icon: string }> = [
  { id: 'apple', label: 'Apel Merah', icon: '🍎' },
  { id: 'strawberry', label: 'Stroberi Manis', icon: '🍓' },
  { id: 'star', label: 'Bintang Emas', icon: '⭐' },
  { id: 'donut', label: 'Donat Cokelat', icon: '🍩' },
  { id: 'pizza', label: 'Pizza Gurih', icon: '🍕' },
];

export const SandboxView: React.FC<SandboxViewProps> = ({ studentName }) => {
  const sandboxLevel = CURRICULUM_LEVELS.find((l) => l.id === 7) || CURRICULUM_LEVELS[6];
  const [pythonCode, setPythonCode] = useState<string>('');
  const [parsedConfig, setParsedConfig] = useState<ParsedBlocklyConfig>({
    hasInit: true,
    startX: 10,
    startY: 10,
    hasLoop: true,
    hasStepForward: true,
    hasKeyHandler: true,
    hasFood: true,
    hasCheckFood: true,
    hasAddScore: true,
    hasGrow: true,
    hasCollision: true,
    foodType: 'apple',
    speedLevel: 2,
  });

  const [customColor, setCustomColor] = useState<string>('#10b981');
  const [customFood, setCustomFood] = useState<'apple' | 'star' | 'strawberry' | 'pizza' | 'donut'>('apple');

  const handleCodeChange = (code: string, config: ParsedBlocklyConfig) => {
    setPythonCode(code);
    setParsedConfig(config);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      {/* Sandbox Header */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 rounded-3xl p-6 text-white shadow-md mb-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-yellow-300 font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Laboratorium Eksperimen Siswa</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Arena Kreasi Game Snake Bebas
          </h2>
          <p className="text-xs sm:text-sm text-purple-100 mt-1 max-w-lg">
            Di sini semua balok terbuka! Ubah warna kulit ularmu, pilih camilan favorit,
            dan atur aturan permainan sesuai imajinasimu!
          </p>
        </div>

        {/* Customization controls bar */}
        <div className="flex flex-wrap items-center gap-4 bg-white/10 p-3.5 rounded-2xl backdrop-blur-xs border border-white/20">
          <div>
            <span className="block text-[11px] text-purple-200 font-semibold mb-1">
              Warna Ular:
            </span>
            <div className="flex items-center gap-1.5">
              {SNAKE_COLOR_OPTIONS.map((opt) => (
                <button
                  key={opt.color}
                  onClick={() => {
                    sound.playClick();
                    setCustomColor(opt.color);
                  }}
                  title={opt.name}
                  style={{ backgroundColor: opt.color }}
                  className={`w-6 h-6 rounded-full border-2 transition-transform ${
                    customColor === opt.color
                      ? 'border-white scale-110 shadow-sm'
                      : 'border-transparent opacity-80 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="w-px h-8 bg-white/20" />

          <div>
            <span className="block text-[11px] text-purple-200 font-semibold mb-1">
              Camilan Ular:
            </span>
            <div className="flex items-center gap-1.5">
              {FOOD_OPTIONS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    sound.playClick();
                    setCustomFood(f.id);
                  }}
                  title={f.label}
                  className={`px-2 py-0.5 rounded-lg text-sm bg-white/20 hover:bg-white/30 transition-transform ${
                    customFood === f.id ? 'ring-2 ring-yellow-300 bg-white/30 scale-105' : ''
                  }`}
                >
                  {f.icon}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Studio 3-Column / 2-Row Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Blockly Workspace */}
        <div className="lg:col-span-7 h-[680px]">
          <BlocklyEditor
            key={7}
            levelId={7}
            initialXml={sandboxLevel.defaultXml}
            onCodeChange={handleCodeChange}
          />
        </div>

        {/* Right: Live Simulator + Python Code */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <SnakeCanvas
            initialX={parsedConfig.startX}
            initialY={parsedConfig.startY}
            initialSpeed={parsedConfig.speedLevel}
            foodType={customFood}
            snakeColor={customColor}
            hasLoop={parsedConfig.hasLoop}
            hasInputControls={parsedConfig.hasKeyHandler}
            hasFood={parsedConfig.hasFood}
            hasGrowthAndScore={parsedConfig.hasAddScore && parsedConfig.hasGrow}
            hasCollisions={parsedConfig.hasCollision}
          />

          <div className="h-[280px]">
            <PythonViewer code={pythonCode} studentName={studentName} />
          </div>
        </div>
      </div>
    </div>
  );
};
