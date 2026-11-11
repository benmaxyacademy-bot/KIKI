import React, { useState, useRef } from 'react';
import * as Blockly from 'blockly';
import { BlocklyEditor, ParsedBlocklyConfig } from './BlocklyEditor';
import { PythonViewer } from './PythonViewer';
import { PongCanvas } from './games/PongCanvas';
import { RPSCanvas } from './games/RPSCanvas';
import { FlappyBirdCanvas } from './games/FlappyBirdCanvas';
import { SpaceShooterCanvas } from './games/SpaceShooterCanvas';
import { SnakeCanvas } from './SnakeCanvas';
import { QuizModal } from './QuizModal';
import { ScoreReportModal } from './ScoreReportModal';
import { GAME_CURRICULA, GameStageModule } from '../data/gameModules';
import { CURRICULUM_LEVELS } from '../data/curriculum';
import { evaluateGameStage, EvaluationResult } from '../utils/codeEvaluator';
import {
  Sparkles,
  Gamepad2,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Trophy,
  Star,
  Award,
  CheckCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../audio/soundEffects';

export type GameType = 'snake' | 'pong' | 'rps' | 'flappy' | 'space';

interface GameInfo {
  id: GameType;
  title: string;
  tagline: string;
  concept: string;
  icon: string;
  coverImage: string;
  color: string;
}

export const GAMES_CATALOG: GameInfo[] = [
  {
    id: 'snake',
    title: 'Game Snake (Ular)',
    tagline: 'Meluncur di rumput dan memakan apel lezat!',
    concept: 'Koordinat X & Y, Game Loop, List Badan Ular',
    icon: '🐍',
    coverImage: '/src/assets/images/hero_snake_mascot_1794361233716.jpg',
    color: '#10b981',
  },
  {
    id: 'pong',
    title: 'Game PONG (Tenis Meja)',
    tagline: 'Pantulkan bola neon dengan raket tenis meja!',
    concept: 'Fisika Pantulan X/Y, Kecepatan & Kontrol Raket',
    icon: '🏓',
    coverImage: '/src/assets/images/game_pong_retro_1794382231323.jpg',
    color: '#0284c7',
  },
  {
    id: 'rps',
    title: 'Batu Gunting Kertas',
    tagline: 'Adu taktik melawan komputer pintar!',
    concept: 'Percabangan If-Elif-Else & Pilihan Acak (Random)',
    icon: '🪨📄✂️',
    coverImage: '/src/assets/images/game_rps_hands_1794382232346.jpg',
    color: '#e11d48',
  },
  {
    id: 'flappy',
    title: 'Flappy Bird Sederhana',
    tagline: 'Terbangkan burung kuning melewati rintangan pipa!',
    concept: 'Fisika Gravitasi, Gaya Angkat & Rintangan Bergerak',
    icon: '🐦',
    coverImage: '/src/assets/images/game_flappy_bird_1794382232397.jpg',
    color: '#d97706',
  },
  {
    id: 'space',
    title: 'Space Shooter (Antariksa)',
    tagline: 'Luncurkan laser biru dan kalahkan monster alien!',
    concept: 'Proyektil Laser, Monster Alien & Sistem Nyawa',
    icon: '👾',
    coverImage: '/src/assets/images/game_space_shooter_1794382232638.jpg',
    color: '#9333ea',
  },
];

interface MultiGameStudioProps {
  studentName: string;
}

export const MultiGameStudio: React.FC<MultiGameStudioProps> = ({ studentName }) => {
  const [selectedGameId, setSelectedGameId] = useState<GameType>('pong');
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
  const [completedStages, setCompletedStages] = useState<Record<string, number[]>>({
    pong: [1, 2, 3, 4, 5],
    rps: [1, 2, 3, 4],
    flappy: [1, 2, 3, 4, 5],
    space: [1, 2, 3, 4, 5],
    snake: [1, 2, 3, 4, 5, 6, 7],
  });

  // Quiz & Evaluation Modal states
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [stageStars, setStageStars] = useState<Record<string, number>>({});
  const [evalResult, setEvalResult] = useState<EvaluationResult | null>(null);
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);

  const activeGame = GAMES_CATALOG.find((g) => g.id === selectedGameId) || GAMES_CATALOG[1];
  const curriculum = GAME_CURRICULA[selectedGameId];
  const stages = curriculum?.stages || [];
  const currentStage: GameStageModule | undefined = stages[currentStageIndex] || stages[0];

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

  const handleCodeChange = (code: string, config: ParsedBlocklyConfig) => {
    setPythonCode(code);
    setParsedConfig(config);
  };

  const handleSelectGame = (id: GameType) => {
    sound.playClick();
    setSelectedGameId(id);
    setCurrentStageIndex(0);
  };

  const handleStageSelect = (idx: number) => {
    sound.playClick();
    setCurrentStageIndex(idx);
  };

  const handleEvaluateStage = (ws?: Blockly.WorkspaceSvg | null) => {
    const activeWs = ws || workspaceRef.current;
    const stageId = currentStage?.id || 1;
    const res = evaluateGameStage(selectedGameId, stageId, activeWs, pythonCode);
    setEvalResult(res);
    setIsScoreModalOpen(true);

    if (res.passed) {
      sound.playLevelWin();
      try {
        confetti({
          particleCount: 65,
          spread: 75,
          origin: { y: 0.6 },
        });
      } catch {}

      const gameKey = selectedGameId;
      const currentCompleted = completedStages[gameKey] || [];
      const nextStageId = stageId + 1;
      const starKey = `${gameKey}_${stageId}`;
      const curStars = stageStars[starKey] || 0;

      setCompletedStages((prev) => ({
        ...prev,
        [gameKey]: Array.from(new Set([...currentCompleted, stageId, nextStageId])),
      }));

      setStageStars((prev) => ({
        ...prev,
        [starKey]: Math.max(curStars, res.stars),
      }));
    } else {
      sound.playTurn();
    }
  };

  const handleNextStage = () => {
    sound.playLevelWin();
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {}

    const gameKey = selectedGameId;
    const currentCompleted = completedStages[gameKey] || [];
    const nextStageId = (currentStage?.id || 1) + 1;

    setCompletedStages((prev) => ({
      ...prev,
      [gameKey]: Array.from(new Set([...currentCompleted, currentStage?.id || 1, nextStageId])),
    }));

    if (currentStageIndex < stages.length - 1) {
      setCurrentStageIndex((prev) => prev + 1);
    }
  };

  const handleQuizSuccess = () => {
    sound.playLevelWin();
    const starKey = `${selectedGameId}_${currentStage?.id}`;
    setStageStars((prev) => ({ ...prev, [starKey]: 3 }));
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      {/* Studio Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
          <Gamepad2 className="w-4 h-4" />
          <span>Modul Pembelajaran & Studio Game Siswa SD</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Pilih Modul Game Python yang Ingin Kamu Buat!
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Setiap game memiliki modul bertahap lengkap dengan misi cerita, balok Blockly khusus, kuis pemahaman, dan simulator langsung!
        </p>
      </div>

      {/* 5-Game Picker Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {GAMES_CATALOG.map((g) => {
          const isSelected = selectedGameId === g.id;

          return (
            <button
              key={g.id}
              onClick={() => handleSelectGame(g.id)}
              className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between group relative overflow-hidden ${
                isSelected
                  ? 'bg-white border-indigo-600 shadow-md ring-2 ring-indigo-500/20'
                  : 'bg-slate-50 hover:bg-white border-slate-200'
              }`}
            >
              <div className="w-full h-20 rounded-xl overflow-hidden mb-2 bg-slate-100 border border-slate-200/60">
                <img
                  src={g.coverImage}
                  alt={g.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-base">{g.icon}</span>
                  <h4 className="text-xs font-bold text-slate-900 truncate">{g.title}</h4>
                </div>
                <p className="text-[10px] text-slate-500 line-clamp-1">{g.concept}</p>
              </div>

              {isSelected && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white" />
              )}
            </button>
          );
        })}
      </div>

      {/* If this is Snake, note that it also has the full primary 6-level curriculum */}
      {selectedGameId === 'snake' ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center mb-6">
          <div className="text-3xl mb-2">🐍</div>
          <h3 className="text-base font-extrabold text-emerald-950 mb-1">
            Modul Lengkap Game Snake Aktif di Tab "Misi Ular"
          </h3>
          <p className="text-xs text-emerald-800 max-w-md mx-auto mb-4">
            Game Snake memiliki kurikulum berjenjang 6 level dengan sertifikat resmi! Kamu juga bisa bereksperimen bebas di sini atau di menu Misi Ular.
          </p>
        </div>
      ) : null}

      {/* Stage Roadmap Selector for the Active Game */}
      {stages.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">
                Tahapan Modul: {activeGame.title} ({stages.length} Tahap)
              </h3>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Tahap {currentStageIndex + 1} dari {stages.length}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {stages.map((st, idx) => {
              const isCurrent = currentStageIndex === idx;
              const isDone = (completedStages[selectedGameId] || []).includes(st.id);
              const stars = stageStars[`${selectedGameId}_${st.id}`] || (isDone ? 2 : 0);

              let style = 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100';
              if (isCurrent) {
                style = 'bg-indigo-50 border-indigo-600 text-indigo-950 font-bold ring-2 ring-indigo-500/20';
              } else if (isDone) {
                style = 'bg-white border-emerald-300 text-slate-800';
              }

              return (
                <button
                  key={st.id}
                  onClick={() => handleStageSelect(idx)}
                  className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${style}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold">Tahap {st.id}</span>
                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <span className="text-xs">{st.icon}</span>
                    )}
                  </div>
                  <div className="text-[11px] truncate font-medium">{st.conceptName}</div>
                  <div className="flex items-center gap-0.5 mt-1.5">
                    {[1, 2, 3].map((s) => (
                      <Star
                        key={s}
                        className={`w-2.5 h-2.5 ${
                          s <= stars ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Stage Mission Card */}
      {currentStage && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-2xl shrink-0 shadow-xs">
              {currentStage.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md border text-indigo-700 bg-indigo-50 border-indigo-100">
                  Tahap #{currentStage.id}: {currentStage.conceptName}
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-500">{activeGame.title}</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                {currentStage.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                {currentStage.story}
              </p>
            </div>
          </div>

          {/* Action buttons: Submit / Periksa Kode & Quiz */}
          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end shrink-0 flex-wrap">
            <button
              onClick={() => handleEvaluateStage()}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-black text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:scale-95 rounded-xl shadow-xs transition-transform"
              title="Periksa kodemu dan dapatkan skor penilaian langsung!"
            >
              <CheckCheck className="w-4 h-4 text-yellow-300" />
              <span>Kumpulkan & Periksa Kode</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setIsQuizOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-xl transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Kuis Tahap Ini</span>
            </button>

            {currentStageIndex < stages.length - 1 && (
              <button
                onClick={handleNextStage}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
              >
                <span>Tahap Berikutnya</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Studio 2-Column Split: Blockly Workspace (Left) + Simulator & Live Python (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Blockly Visual Workspace for the selected game and stage */}
        <div className="lg:col-span-7 h-[680px]">
          <BlocklyEditor
            key={`${selectedGameId}_${currentStage?.id || 1}`}
            levelId={currentStage?.id || 1}
            gameId={selectedGameId}
            initialXml={currentStage?.defaultXml || ''}
            onCodeChange={handleCodeChange}
            onSubmitCode={handleEvaluateStage}
            onWorkspaceReady={(ws) => {
              workspaceRef.current = ws;
            }}
          />
        </div>

        {/* Right: Live Interactive Canvas for the chosen game + Python Viewer */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {selectedGameId === 'snake' && (
            <SnakeCanvas
              initialX={10}
              initialY={10}
              initialSpeed={2}
              foodType="apple"
              hasLoop={true}
              hasInputControls={true}
              hasFood={true}
              hasGrowthAndScore={true}
              hasCollisions={true}
            />
          )}

          {selectedGameId === 'pong' && <PongCanvas ballSpeed={4} maxScore={5} />}

          {selectedGameId === 'rps' && <RPSCanvas />}

          {selectedGameId === 'flappy' && <FlappyBirdCanvas gravity={0.45} jumpStrength={6.5} />}

          {selectedGameId === 'space' && <SpaceShooterCanvas initialLives={3} laserSpeed={7} />}

          {/* Python live translated code for this game */}
          <div className="h-[270px]">
            <PythonViewer code={pythonCode} studentName={studentName} />
          </div>
        </div>
      </div>

      {/* Mini Quiz Modal for the current stage */}
      {currentStage && (
        <QuizModal
          isOpen={isQuizOpen}
          onClose={() => setIsQuizOpen(false)}
          quiz={currentStage.quiz}
          levelNumber={currentStage.id}
          onSuccess={handleQuizSuccess}
        />
      )}

      {/* Automated Code Evaluation & Scoring Modal */}
      <ScoreReportModal
        isOpen={isScoreModalOpen}
        onClose={() => setIsScoreModalOpen(false)}
        result={evalResult}
        levelTitle={`${activeGame.title} - Tahap ${currentStage?.id || 1}: ${currentStage?.title || ''}`}
        onNextLevel={() => {
          setIsScoreModalOpen(false);
          handleNextStage();
        }}
      />
    </div>
  );
};
