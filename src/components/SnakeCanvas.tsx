import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, Footprints, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Grid3X3 } from 'lucide-react';
import { Direction, Position } from '../types/lms';
import { sound } from '../audio/soundEffects';

interface SnakeCanvasProps {
  initialX?: number;
  initialY?: number;
  initialSpeed?: number;
  foodType?: 'apple' | 'star' | 'strawberry' | 'pizza' | 'donut';
  snakeColor?: string;
  hasLoop: boolean;
  hasInputControls: boolean;
  hasFood: boolean;
  hasGrowthAndScore: boolean;
  hasCollisions: boolean;
  onScoreChange?: (score: number, snakeLength: number) => void;
  onLevelGoalReached?: () => void;
  targetScore?: number;
  targetSteps?: number;
}

export const SnakeCanvas: React.FC<SnakeCanvasProps> = ({
  initialX = 10,
  initialY = 10,
  initialSpeed = 2,
  foodType = 'apple',
  snakeColor = '#10b981',
  hasLoop = true,
  hasInputControls = true,
  hasFood = true,
  hasGrowthAndScore = true,
  hasCollisions = true,
  onScoreChange,
  onLevelGoalReached,
  targetScore,
  targetSteps,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const GRID_SIZE = 20;

  // Game state
  const [snake, setSnake] = useState<Position[]>([
    { x: initialX, y: initialY },
    { x: Math.max(0, initialX - 1), y: initialY },
  ]);
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [food, setFood] = useState<Position>({ x: 15, y: 10 });
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isWon, setIsWon] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [steps, setSteps] = useState<number>(0);
  const [showGridCoordinates, setShowGridCoordinates] = useState<boolean>(false);
  const [gameSpeed, setGameSpeed] = useState<number>(initialSpeed);

  // References to keep loop callbacks up-to-date
  const snakeRef = useRef(snake);
  snakeRef.current = snake;
  const directionRef = useRef(direction);
  directionRef.current = direction;
  const foodRef = useRef(food);
  foodRef.current = food;
  const isRunningRef = useRef(isRunning);
  isRunningRef.current = isRunning;
  const isGameOverRef = useRef(isGameOver);
  isGameOverRef.current = isGameOver;

  // Sound & scoring helpers
  const spawnRandomFood = useCallback((currentSnake: Position[]): Position => {
    let newX = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1;
    let newY = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1;
    let attempts = 0;
    while (
      currentSnake.some((seg) => seg.x === newX && seg.y === newY) &&
      attempts < 50
    ) {
      newX = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1;
      newY = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1;
      attempts++;
    }
    return { x: newX, y: newY };
  }, []);

  const resetGame = useCallback(() => {
    const startX = Math.min(Math.max(1, initialX), 18);
    const startY = Math.min(Math.max(1, initialY), 18);
    const newSnake = [
      { x: startX, y: startY },
      { x: Math.max(0, startX - 1), y: startY },
    ];
    setSnake(newSnake);
    setDirection('RIGHT');
    setScore(0);
    setSteps(0);
    setIsGameOver(false);
    setIsWon(false);
    setIsRunning(false);
    const newFood = spawnRandomFood(newSnake);
    setFood(newFood);
    onScoreChange?.(0, newSnake.length);
  }, [initialX, initialY, onScoreChange, spawnRandomFood]);

  // Sync when initial values change
  useEffect(() => {
    resetGame();
  }, [initialX, initialY, initialSpeed, resetGame]);

  // Turn direction handler
  const handleTurn = useCallback(
    (newDir: Direction) => {
      if (!hasInputControls) return;
      const current = directionRef.current;
      // Prevent reversing directly onto itself
      if (
        (newDir === 'UP' && current === 'DOWN') ||
        (newDir === 'DOWN' && current === 'UP') ||
        (newDir === 'LEFT' && current === 'RIGHT') ||
        (newDir === 'RIGHT' && current === 'LEFT')
      ) {
        return;
      }
      setDirection(newDir);
      sound.playTurn();
    },
    [hasInputControls]
  );

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        handleTurn('UP');
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        handleTurn('DOWN');
      } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault();
        handleTurn('LEFT');
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        handleTurn('RIGHT');
      } else if (e.code === 'Space') {
        e.preventDefault();
        setIsRunning((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleTurn]);

  // Core movement step
  const stepGame = useCallback(() => {
    if (isGameOverRef.current) return;

    const currentSnake = [...snakeRef.current];
    const head = { ...currentSnake[0] };
    const curDir = directionRef.current;

    if (curDir === 'UP') head.y -= 1;
    if (curDir === 'DOWN') head.y += 1;
    if (curDir === 'LEFT') head.x -= 1;
    if (curDir === 'RIGHT') head.x += 1;

    // Check Wall Collisions
    if (hasCollisions) {
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setIsGameOver(true);
        setIsRunning(false);
        sound.playGameOver();
        return;
      }
      // Check Self Collision
      const hitSelf = currentSnake.slice(1).some((seg) => seg.x === head.x && seg.y === head.y);
      if (hitSelf) {
        setIsGameOver(true);
        setIsRunning(false);
        sound.playGameOver();
        return;
      }
    } else {
      // Wrap around if collision is not enabled yet in earlier levels
      if (head.x < 0) head.x = GRID_SIZE - 1;
      if (head.x >= GRID_SIZE) head.x = 0;
      if (head.y < 0) head.y = GRID_SIZE - 1;
      if (head.y >= GRID_SIZE) head.y = 0;
    }

    const curFood = foodRef.current;
    const ateFood = hasFood && head.x === curFood.x && head.y === curFood.y;

    const updatedSnake = [head, ...currentSnake];
    if (!ateFood || !hasGrowthAndScore) {
      updatedSnake.pop();
    } else {
      // Ate food!
      sound.playEat();
      const newScore = score + 10;
      setScore(newScore);
      const nextFood = spawnRandomFood(updatedSnake);
      setFood(nextFood);
      onScoreChange?.(newScore, updatedSnake.length);

      if (targetScore && newScore >= targetScore) {
        setIsWon(true);
        setIsRunning(false);
        sound.playLevelWin();
        onLevelGoalReached?.();
      }
    }

    setSnake(updatedSnake);
    setSteps((s) => {
      const nextSteps = s + 1;
      if (targetSteps && nextSteps >= targetSteps && !targetScore) {
        setIsWon(true);
        sound.playLevelWin();
        onLevelGoalReached?.();
      }
      return nextSteps;
    });
  }, [
    hasCollisions,
    hasFood,
    hasGrowthAndScore,
    onLevelGoalReached,
    onScoreChange,
    score,
    spawnRandomFood,
    targetScore,
    targetSteps,
  ]);

  // Main game tick loop
  useEffect(() => {
    if (!isRunning || !hasLoop || isGameOver || isWon) return;

    // Milliseconds per frame based on speed
    const intervalMs = Math.max(90, Math.floor(400 / gameSpeed));
    const timer = setInterval(() => {
      stepGame();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isRunning, hasLoop, isGameOver, isWon, gameSpeed, stepGame]);

  // Canvas drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cellSize = width / GRID_SIZE;

    // Draw grass checkerboard
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        ctx.fillStyle = (r + c) % 2 === 0 ? '#bbf7d0' : '#86efac';
        ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);

        // Optional coordinate grid overlay for elementary math clarity
        if (showGridCoordinates) {
          ctx.strokeStyle = 'rgba(21, 128, 61, 0.15)';
          ctx.strokeRect(c * cellSize, r * cellSize, cellSize, cellSize);
          ctx.fillStyle = 'rgba(20, 83, 45, 0.35)';
          ctx.font = '8px monospace';
          ctx.fillText(`${c},${r}`, c * cellSize + 2, r * cellSize + 9);
        }
      }
    }

    // Outer border boundary
    ctx.strokeStyle = hasCollisions ? '#15803d' : '#86efac';
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, width, height);

    // Draw Food
    if (hasFood) {
      const fx = food.x * cellSize + cellSize / 2;
      const fy = food.y * cellSize + cellSize / 2;
      const radius = cellSize * 0.42;

      ctx.save();
      if (foodType === 'apple') {
        // Juicy red apple with leaf
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(fx, fy + 1, radius, 0, Math.PI * 2);
        ctx.fill();

        // Highlight
        ctx.fillStyle = '#fca5a5';
        ctx.beginPath();
        ctx.arc(fx - radius * 0.3, fy - radius * 0.2, radius * 0.25, 0, Math.PI * 2);
        ctx.fill();

        // Stem & leaf
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(fx, fy - radius * 0.8);
        ctx.lineTo(fx, fy - radius * 1.2);
        ctx.stroke();

        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.ellipse(fx + 4, fy - radius * 1.1, 5, 2.5, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
      } else if (foodType === 'strawberry') {
        ctx.fillStyle = '#e11d48';
        ctx.beginPath();
        ctx.arc(fx, fy, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#15803d';
        ctx.beginPath();
        ctx.arc(fx, fy - radius * 0.7, 5, 0, Math.PI * 2);
        ctx.fill();
      } else if (foodType === 'star') {
        ctx.fillStyle = '#eab308';
        ctx.font = `${Math.floor(cellSize * 0.9)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⭐', fx, fy);
      } else if (foodType === 'donut') {
        ctx.font = `${Math.floor(cellSize * 0.9)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🍩', fx, fy);
      } else {
        ctx.font = `${Math.floor(cellSize * 0.9)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🍕', fx, fy);
      }
      ctx.restore();
    }

    // Draw Snake Segments
    snake.forEach((segment, index) => {
      const sx = segment.x * cellSize;
      const sy = segment.y * cellSize;
      const isHead = index === 0;

      ctx.save();
      if (isHead) {
        // Head of Kiki
        ctx.fillStyle = snakeColor;
        ctx.beginPath();
        ctx.roundRect(sx + 2, sy + 2, cellSize - 4, cellSize - 4, 8);
        ctx.fill();

        // Cute face & eyes
        const eyeRadius = cellSize * 0.12;
        ctx.fillStyle = '#ffffff';

        let eye1 = { x: sx + cellSize * 0.3, y: sy + cellSize * 0.3 };
        let eye2 = { x: sx + cellSize * 0.7, y: sy + cellSize * 0.3 };

        if (direction === 'DOWN') {
          eye1 = { x: sx + cellSize * 0.3, y: sy + cellSize * 0.7 };
          eye2 = { x: sx + cellSize * 0.7, y: sy + cellSize * 0.7 };
        } else if (direction === 'LEFT') {
          eye1 = { x: sx + cellSize * 0.3, y: sy + cellSize * 0.3 };
          eye2 = { x: sx + cellSize * 0.3, y: sy + cellSize * 0.7 };
        } else if (direction === 'RIGHT') {
          eye1 = { x: sx + cellSize * 0.7, y: sy + cellSize * 0.3 };
          eye2 = { x: sx + cellSize * 0.7, y: sy + cellSize * 0.7 };
        }

        ctx.beginPath();
        ctx.arc(eye1.x, eye1.y, eyeRadius, 0, Math.PI * 2);
        ctx.arc(eye2.x, eye2.y, eyeRadius, 0, Math.PI * 2);
        ctx.fill();

        // Pupils
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(eye1.x, eye1.y, eyeRadius * 0.6, 0, Math.PI * 2);
        ctx.arc(eye2.x, eye2.y, eyeRadius * 0.6, 0, Math.PI * 2);
        ctx.fill();

        // Cute tongue flick
        ctx.fillStyle = '#f43f5e';
        ctx.beginPath();
        if (direction === 'RIGHT') {
          ctx.fillRect(sx + cellSize - 2, sy + cellSize / 2 - 2, 5, 4);
        } else if (direction === 'LEFT') {
          ctx.fillRect(sx - 3, sy + cellSize / 2 - 2, 5, 4);
        } else if (direction === 'UP') {
          ctx.fillRect(sx + cellSize / 2 - 2, sy - 3, 4, 5);
        } else if (direction === 'DOWN') {
          ctx.fillRect(sx + cellSize / 2 - 2, sy + cellSize - 2, 4, 5);
        }
      } else {
        // Body segment
        const opacity = Math.max(0.65, 1 - index * 0.04);
        ctx.fillStyle = snakeColor;
        ctx.globalAlpha = opacity;
        ctx.beginPath();
        ctx.roundRect(sx + 3, sy + 3, cellSize - 6, cellSize - 6, 6);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }
      ctx.restore();
    });
  }, [
    snake,
    food,
    direction,
    foodType,
    snakeColor,
    hasFood,
    hasCollisions,
    showGridCoordinates,
  ]);

  return (
    <div className="flex flex-col items-center bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
      {/* Top Status & Controls */}
      <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-4 text-sm font-semibold">
          <div className="flex items-center gap-1.5 text-slate-700">
            <span className="text-base">🍎</span>
            <span>Skor:</span>
            <span className="font-mono text-emerald-700 font-bold text-base">{score}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-700">
            <span>📏 Panjang:</span>
            <span className="font-mono text-slate-900 font-bold">{snake.length}</span>
          </div>
          {targetScore ? (
            <div className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-medium">
              Target: {targetScore} Poin
            </div>
          ) : targetSteps ? (
            <div className="text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md font-medium">
              Target: {targetSteps} Langkah
            </div>
          ) : null}
        </div>

        {/* Coordinate toggle */}
        <button
          onClick={() => setShowGridCoordinates((prev) => !prev)}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
            showGridCoordinates
              ? 'bg-emerald-100 text-emerald-800 font-semibold'
              : 'bg-slate-100 text-slate-600 hover:text-slate-900'
          }`}
          title="Tampilkan angka koordinat X,Y pada kotak"
        >
          <Grid3X3 className="w-3.5 h-3.5" />
          <span>Grid (X,Y)</span>
        </button>
      </div>

      {/* Canvas Container with Overlays */}
      <div className="relative rounded-xl overflow-hidden shadow-inner border-2 border-emerald-600/30">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="w-[320px] h-[320px] sm:w-[360px] sm:h-[360px] md:w-[400px] md:h-[400px] block"
        />

        {/* Game Over Overlay */}
        {isGameOver && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center text-white">
            <div className="text-4xl mb-2">💥</div>
            <h4 className="text-xl font-extrabold text-white mb-1">Aduh, Menabrak!</h4>
            <p className="text-xs text-slate-300 mb-4 max-w-xs">
              Jangan menyerah ya! Programmer hebat selalu belajar dari kesalahan.
            </p>
            <button
              onClick={() => {
                sound.playClick();
                resetGame();
                setIsRunning(true);
              }}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white rounded-xl shadow-md transition-transform active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Coba Lagi!</span>
            </button>
          </div>
        )}

        {/* Victory Overlay */}
        {isWon && (
          <div className="absolute inset-0 bg-emerald-900/85 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center text-white animate-in fade-in duration-300">
            <div className="text-4xl mb-2 animate-bounce">🎉</div>
            <h4 className="text-xl font-extrabold text-yellow-300 mb-1">Hore! Misi Berhasil!</h4>
            <p className="text-xs text-emerald-100 mb-4 max-w-xs">
              Kamu berhasil menyelesaikan target level ini dengan hebat!
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  sound.playClick();
                  resetGame();
                }}
                className="px-4 py-2 text-xs font-bold bg-white/20 hover:bg-white/30 text-white rounded-xl transition-colors"
              >
                Main Lagi
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Control Buttons (Play, Pause, Step, Reset) */}
      <div className="w-full flex items-center justify-between mt-4 gap-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              sound.playClick();
              setIsRunning((r) => !r);
            }}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl shadow-xs transition-transform active:scale-95 ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Jeda Game</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Jalankan Game</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setIsRunning(false);
              stepGame();
            }}
            title="Maju 1 langkah untuk melihat logika kode bekerja perlahan"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-xl transition-colors"
          >
            <Footprints className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">1 Langkah</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              resetGame();
            }}
            title="Ulangi dari posisi awal"
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            aria-label="Reset Game"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Slider */}
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span className="hidden sm:inline font-medium">Kecepatan:</span>
          <select
            value={gameSpeed}
            onChange={(e) => setGameSpeed(Number(e.target.value))}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value={1}>1x Santai</option>
            <option value={2}>2x Sedang</option>
            <option value={3}>3x Cepat</option>
            <option value={4}>4x Kilat</option>
          </select>
        </div>
      </div>

      {/* Virtual D-Pad for Mobile or Click Controls */}
      {hasInputControls && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col items-center">
          <span className="text-[11px] font-semibold text-slate-500 mb-2">
            Kemudi Layar (atau pakai Tombol Panah Keyboard):
          </span>
          <div className="grid grid-cols-3 gap-1.5 w-36">
            <div />
            <button
              onClick={() => handleTurn('UP')}
              className="p-2.5 bg-slate-100 hover:bg-emerald-100 active:bg-emerald-200 text-slate-700 active:text-emerald-800 rounded-xl flex items-center justify-center shadow-xs transition-colors"
              aria-label="Atas"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <div />
            <button
              onClick={() => handleTurn('LEFT')}
              className="p-2.5 bg-slate-100 hover:bg-emerald-100 active:bg-emerald-200 text-slate-700 active:text-emerald-800 rounded-xl flex items-center justify-center shadow-xs transition-colors"
              aria-label="Kiri"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleTurn('DOWN')}
              className="p-2.5 bg-slate-100 hover:bg-emerald-100 active:bg-emerald-200 text-slate-700 active:text-emerald-800 rounded-xl flex items-center justify-center shadow-xs transition-colors"
              aria-label="Bawah"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleTurn('RIGHT')}
              className="p-2.5 bg-slate-100 hover:bg-emerald-100 active:bg-emerald-200 text-slate-700 active:text-emerald-800 rounded-xl flex items-center justify-center shadow-xs transition-colors"
              aria-label="Kanan"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
