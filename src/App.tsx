import React, { useState, useEffect, useRef } from 'react';
import * as Blockly from 'blockly';
import { Navbar } from './components/Navbar';
import { LevelSelector } from './components/LevelSelector';
import { BlocklyEditor, ParsedBlocklyConfig } from './components/BlocklyEditor';
import { SnakeCanvas } from './components/SnakeCanvas';
import { PythonViewer } from './components/PythonViewer';
import { KikiAssistant } from './components/KikiAssistant';
import { QuizModal } from './components/QuizModal';
import { CertificateModal } from './components/CertificateModal';
import { CoordinatesGuideModal } from './components/CoordinatesGuideModal';
import { BadgesView } from './components/BadgesView';
import { GlossaryView } from './components/GlossaryView';
import { SandboxView } from './components/SandboxView';
import { MultiGameStudio } from './components/MultiGameStudio';
import { CURRICULUM_LEVELS } from './data/curriculum';
import { LevelConfig } from './types/lms';
import { CheckCircle2, ArrowRight, HelpCircle, Sparkles, Star, Trophy, BookOpen, Gamepad2, CheckCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from './audio/soundEffects';
import { evaluateSnakeLevel, EvaluationResult } from './utils/codeEvaluator';
import { ScoreReportModal } from './components/ScoreReportModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<'curriculum' | 'games' | 'sandbox' | 'badges' | 'glossary'>('curriculum');
  const ALL_LEVELS = [1, 2, 3, 4, 5, 6, 7];
  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const [studentName, setStudentName] = useState<string>('Siswa Cilik');
  const [unlockedLevels, setUnlockedLevels] = useState<number[]>(ALL_LEVELS);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [levelStars, setLevelStars] = useState<Record<number, number>>({ 1: 0 });
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Modals & Evaluation state
  const [showQuizModal, setShowQuizModal] = useState<boolean>(false);
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);
  const [showCoordinatesGuide, setShowCoordinatesGuide] = useState<boolean>(false);
  const [showLevelSuccessBanner, setShowLevelSuccessBanner] = useState<boolean>(false);
  const [evalResult, setEvalResult] = useState<EvaluationResult | null>(null);
  const [isScoreModalOpen, setIsScoreModalOpen] = useState<boolean>(false);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);

  // Blockly state for current level
  const currentLevel: LevelConfig =
    CURRICULUM_LEVELS.find((l) => l.id === currentLevelId) || CURRICULUM_LEVELS[0];
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

  // Load progress from localStorage on mount
  useEffect(() => {
    try {
      const savedName = localStorage.getItem('ularpintar_name');
      if (savedName) setStudentName(savedName);

      const savedCompleted = localStorage.getItem('ularpintar_completed');
      if (savedCompleted) setCompletedLevels(JSON.parse(savedCompleted));

      // Always ensure all levels 1..7 are unlocked
      const savedUnlocked = localStorage.getItem('ularpintar_unlocked');
      if (savedUnlocked) {
        const parsed = JSON.parse(savedUnlocked);
        const merged = Array.from(new Set([...ALL_LEVELS, ...parsed]));
        setUnlockedLevels(merged);
      } else {
        setUnlockedLevels(ALL_LEVELS);
      }

      const savedStars = localStorage.getItem('ularpintar_stars');
      if (savedStars) setLevelStars(JSON.parse(savedStars));
    } catch {
      // LocalStorage fallback
    }
  }, []);

  const saveProgress = (newCompleted: number[], newUnlocked: number[], newStars: Record<number, number>) => {
    try {
      localStorage.setItem('ularpintar_completed', JSON.stringify(newCompleted));
      localStorage.setItem('ularpintar_unlocked', JSON.stringify(newUnlocked));
      localStorage.setItem('ularpintar_stars', JSON.stringify(newStars));
    } catch {
      // fallback
    }
  };

  const handleUpdateStudentName = (name: string) => {
    setStudentName(name);
    try {
      localStorage.setItem('ularpintar_name', name);
    } catch {}
  };

  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const handleCodeChange = (code: string, config: ParsedBlocklyConfig) => {
    setPythonCode(code);
    setParsedConfig(config);
  };

  // Called when student finishes game objective for current level
  const handleLevelCompleted = () => {
    sound.playLevelWin();
    try {
      confetti({
        particleCount: 75,
        spread: 80,
        origin: { y: 0.5 },
      });
    } catch {}

    const newCompleted = Array.from(new Set([...completedLevels, currentLevelId]));
    const nextLevelId = currentLevelId + 1;
    const newUnlocked = Array.from(new Set([...unlockedLevels, nextLevelId]));
    const curStars = levelStars[currentLevelId] || 0;
    const newStars = { ...levelStars, [currentLevelId]: Math.max(curStars, 2) };

    setCompletedLevels(newCompleted);
    setUnlockedLevels(newUnlocked);
    setLevelStars(newStars);
    saveProgress(newCompleted, newUnlocked, newStars);
    setShowLevelSuccessBanner(true);
  };

  const handleEvaluateCode = (ws?: Blockly.WorkspaceSvg | null) => {
    const activeWs = ws || workspaceRef.current;
    const res = evaluateSnakeLevel(currentLevelId, activeWs, pythonCode);
    setEvalResult(res);
    setIsScoreModalOpen(true);

    if (res.passed) {
      sound.playLevelWin();
      try {
        confetti({
          particleCount: 75,
          spread: 80,
          origin: { y: 0.5 },
        });
      } catch {}

      const newCompleted = Array.from(new Set([...completedLevels, currentLevelId]));
      const nextLevelId = currentLevelId + 1;
      const newUnlocked = Array.from(new Set([...unlockedLevels, nextLevelId]));
      const curStars = levelStars[currentLevelId] || 0;
      const newStars = { ...levelStars, [currentLevelId]: Math.max(curStars, res.stars) };

      setCompletedLevels(newCompleted);
      setUnlockedLevels(newUnlocked);
      setLevelStars(newStars);
      saveProgress(newCompleted, newUnlocked, newStars);
      setShowLevelSuccessBanner(true);
    } else {
      sound.playTurn();
    }
  };

  const handleNextLevel = () => {
    sound.playClick();
    setShowLevelSuccessBanner(false);
    if (currentLevelId < CURRICULUM_LEVELS.length) {
      setCurrentLevelId(currentLevelId + 1);
    }
  };

  const handleQuizSuccess = () => {
    // Award 3rd golden star for answering quiz correctly!
    const newStars = { ...levelStars, [currentLevelId]: 3 };
    setLevelStars(newStars);
    saveProgress(completedLevels, unlockedLevels, newStars);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* 3-Zone Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenCertificate={() => setShowCertificateModal(true)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        completedCount={completedLevels.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'curriculum' && (
          <div>
            {/* Other Games Spotlight Banner */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-3.5 mb-6 text-white shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-lg shrink-0">
                  🎮
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold block">
                    Mau coba bikin game seru lainnya?
                  </span>
                  <span className="text-[11px] text-purple-100">
                    Kamu juga bisa merakit 🏓 Pong, 🪨📄✂️ Batu Gunting Kertas, 🐦 Flappy Bird, & 👾 Space Shooter dengan Python!
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  setActiveTab('games');
                }}
                className="px-4 py-1.5 text-xs font-bold bg-white text-purple-900 hover:bg-yellow-300 active:scale-95 transition-all rounded-xl shadow-xs whitespace-nowrap self-stretch sm:self-auto"
              >
                Buka Studio Game →
              </button>
            </div>

            {/* Level Selector Roadmap */}
            <LevelSelector
              currentLevelId={currentLevelId}
              unlockedLevels={unlockedLevels}
              completedLevels={completedLevels}
              levelStars={levelStars}
              onSelectLevel={(id) => {
                setCurrentLevelId(id);
                setShowLevelSuccessBanner(false);
              }}
              onOpenGuideModal={() => setShowCoordinatesGuide(true)}
            />

            {/* Level Goal & Story Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-2xl shrink-0 shadow-xs">
                  {currentLevel.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Misi Koding #{currentLevel.id}
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs font-semibold text-slate-500">
                      {currentLevel.conceptName}
                    </span>
                  </div>
                  <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                    {currentLevel.title}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                    {currentLevel.story}
                  </p>
                </div>
              </div>

              {/* Quiz & Action Pill */}
              <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end shrink-0 flex-wrap">
                <button
                  onClick={() => handleEvaluateCode()}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-black text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 active:scale-95 rounded-xl shadow-xs transition-transform"
                  title="Periksa kodemu dan dapatkan skor penilaian langsung!"
                >
                  <CheckCheck className="w-4 h-4 text-yellow-300" />
                  <span>Kumpulkan & Periksa Kode</span>
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    setShowQuizModal(true);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-xl transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  <span>Kuis Bintang 3</span>
                </button>

                {completedLevels.includes(currentLevel.id) && currentLevelId < 7 && (
                  <button
                    onClick={handleNextLevel}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors"
                  >
                    <span>Misi Berikutnya</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Level Success Celebration Banner */}
            {showLevelSuccessBanner && (
              <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white p-4 rounded-2xl mb-6 shadow-md flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top duration-300">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">🎉</div>
                  <div>
                    <h4 className="text-sm font-extrabold text-white">
                      Selamat! Misi Level {currentLevelId} Berhasil Diselesaikan!
                    </h4>
                    <p className="text-xs text-emerald-100">
                      Kamu mendapat lencana "{currentLevel.badgeName}". Ayo lanjut ke misi berikutnya!
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowQuizModal(true)}
                    className="px-3 py-1.5 text-xs font-bold bg-white/20 hover:bg-white/30 text-white rounded-xl transition-colors"
                  >
                    Ikut Kuis
                  </button>
                  {currentLevelId < 7 && (
                    <button
                      onClick={handleNextLevel}
                      className="px-4 py-1.5 text-xs font-bold bg-yellow-400 hover:bg-yellow-300 text-slate-900 rounded-xl shadow-sm transition-transform active:scale-95 flex items-center gap-1"
                    >
                      <span>Lanjut</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Studio Workspace: Split 2-Zone Educational Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Zone: Blockly Visual Editor */}
              <div className="lg:col-span-7 h-[680px]">
                <BlocklyEditor
                  key={currentLevel.id}
                  levelId={currentLevel.id}
                  initialXml={currentLevel.defaultXml}
                  onCodeChange={handleCodeChange}
                  onSubmitCode={handleEvaluateCode}
                  onWorkspaceReady={(ws) => {
                    workspaceRef.current = ws;
                  }}
                />
              </div>

              {/* Right Zone: Interactive Simulator Canvas + Live Python Viewer + Kiki Tutor */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                {/* 1. Live Interactive Snake Canvas */}
                <SnakeCanvas
                  initialX={parsedConfig.startX}
                  initialY={parsedConfig.startY}
                  initialSpeed={currentLevel.speedDefault}
                  foodType={parsedConfig.foodType}
                  hasLoop={parsedConfig.hasLoop}
                  hasInputControls={currentLevel.id >= 3 && parsedConfig.hasKeyHandler}
                  hasFood={currentLevel.id >= 4 && parsedConfig.hasFood}
                  hasGrowthAndScore={currentLevel.id >= 5 && parsedConfig.hasAddScore}
                  hasCollisions={currentLevel.id >= 6 && parsedConfig.hasCollision}
                  targetSteps={currentLevel.id === 2 ? 6 : undefined}
                  targetScore={
                    currentLevel.id === 5 ? 30 : currentLevel.id === 6 ? 50 : undefined
                  }
                  onLevelGoalReached={handleLevelCompleted}
                />

                {/* 2. Live Python Code Viewer */}
                <div className="h-[270px]">
                  <PythonViewer code={pythonCode} studentName={studentName} />
                </div>

                {/* 3. Kiki Mascot Assistant */}
                <KikiAssistant
                  currentHint={currentLevel.hint}
                  levelTitle={currentLevel.title}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Studio Game Lainnya (Pong, RPS, Flappy, Space) */}
        {activeTab === 'games' && <MultiGameStudio studentName={studentName} />}

        {/* Tab 3: Free Sandbox Lab */}
        {activeTab === 'sandbox' && <SandboxView studentName={studentName} />}

        {/* Tab 4: Badges & Trophies Gallery */}
        {activeTab === 'badges' && (
          <BadgesView
            completedLevels={completedLevels}
            levelStars={levelStars}
            onOpenCertificate={() => setShowCertificateModal(true)}
          />
        )}

        {/* Tab 5: Coding Glossary for Kids */}
        {activeTab === 'glossary' && <GlossaryView />}
      </main>

      {/* Modals */}
      <QuizModal
        isOpen={showQuizModal}
        onClose={() => setShowQuizModal(false)}
        quiz={currentLevel.quiz}
        levelNumber={currentLevel.id}
        onSuccess={handleQuizSuccess}
      />

      <CertificateModal
        isOpen={showCertificateModal}
        onClose={() => setShowCertificateModal(false)}
        studentName={studentName}
        onUpdateName={handleUpdateStudentName}
        completedLevelsCount={completedLevels.length}
        totalLevelsCount={7}
      />

      <CoordinatesGuideModal
        isOpen={showCoordinatesGuide}
        onClose={() => setShowCoordinatesGuide(false)}
      />

      {/* Instant Automated Code Evaluation & Scoring Modal */}
      <ScoreReportModal
        isOpen={isScoreModalOpen}
        onClose={() => setIsScoreModalOpen(false)}
        result={evalResult}
        levelTitle={currentLevel.title}
        onNextLevel={() => {
          setIsScoreModalOpen(false);
          handleNextLevel();
        }}
      />
    </div>
  );
}
