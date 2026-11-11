import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { sound } from '../../audio/soundEffects';

interface FlappyBirdCanvasProps {
  gravity?: number;
  jumpStrength?: number;
}

export const FlappyBirdCanvas: React.FC<FlappyBirdCanvasProps> = ({
  gravity = 0.45,
  jumpStrength = 6.5,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  // Mutable state for high-performance 60fps loop
  const stateRef = useRef({
    birdY: 150,
    birdVy: 0,
    pipes: [
      { x: 300, topH: 90, botY: 190, passed: false },
      { x: 480, topH: 120, botY: 220, passed: false },
    ],
    isRunning: false,
    isGameOver: false,
    score: 0,
  });

  stateRef.current.isRunning = isRunning;
  stateRef.current.isGameOver = isGameOver;

  const jump = useCallback(() => {
    const s = stateRef.current;
    if (s.isGameOver) {
      resetGame();
      setIsRunning(true);
      return;
    }
    sound.playFlap();
    s.birdVy = -jumpStrength;
    if (!s.isRunning) {
      s.isRunning = true;
      setIsRunning(true);
    }
  }, [jumpStrength]);

  const resetGame = () => {
    const s = stateRef.current;
    s.birdY = 150;
    s.birdVy = 0;
    s.score = 0;
    s.pipes = [
      { x: 300, topH: 90, botY: 190, passed: false },
      { x: 480, topH: 130, botY: 230, passed: false },
    ];
    setScore(0);
    setIsGameOver(false);
    setIsRunning(false);
  };

  // Keyboard Space listener
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [jump]);

  // High-performance 60 FPS requestAnimationFrame loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      const s = stateRef.current;
      const canvas = canvasRef.current;

      if (s.isRunning && !s.isGameOver) {
        // Apply Gravity (framerate independent)
        s.birdVy += gravity * (dt * 60);
        s.birdY += s.birdVy * (dt * 60);

        // Ground / Ceiling collision
        if (s.birdY >= 268) {
          s.birdY = 268;
          s.isGameOver = true;
          setIsGameOver(true);
          setIsRunning(false);
          sound.playGameOver();
        } else if (s.birdY <= 12) {
          s.birdY = 12;
          s.birdVy = 0;
        }

        // Move pipes
        const pipeSpeed = 160 * dt;
        s.pipes.forEach((p) => {
          p.x -= pipeSpeed;

          // Score pass (bird X is 60)
          if (!p.passed && p.x + 40 < 60) {
            p.passed = true;
            sound.playBounce();
            s.score += 1;
            const newScore = s.score;
            setScore(newScore);
            setBestScore((b) => Math.max(b, newScore));
          }

          // Bounding Box Collision Check (Bird at X=60, radius=12)
          if (p.x < 74 && p.x + 40 > 46) {
            if (s.birdY - 10 < p.topH || s.birdY + 10 > p.botY) {
              s.isGameOver = true;
              setIsGameOver(true);
              setIsRunning(false);
              sound.playGameOver();
            }
          }
        });

        // Recycle off-screen pipes
        if (s.pipes.length > 0 && s.pipes[0].x < -50) {
          s.pipes.shift();
          const topH = Math.floor(Math.random() * 105) + 55;
          const gap = 100;
          const lastPipeX = s.pipes[s.pipes.length - 1]?.x || 300;
          s.pipes.push({
            x: lastPipeX + 180,
            topH: topH,
            botY: topH + gap,
            passed: false,
          });
        }
      }

      // Draw Canvas Frame
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Sky Background
          ctx.fillStyle = '#7dd3fc';
          ctx.fillRect(0, 0, 400, 300);

          // Fluffy Clouds
          ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
          ctx.beginPath();
          ctx.arc(60, 50, 18, 0, Math.PI * 2);
          ctx.arc(85, 45, 24, 0, Math.PI * 2);
          ctx.arc(110, 50, 18, 0, Math.PI * 2);
          ctx.fill();

          ctx.beginPath();
          ctx.arc(280, 70, 18, 0, Math.PI * 2);
          ctx.arc(305, 65, 24, 0, Math.PI * 2);
          ctx.arc(330, 70, 18, 0, Math.PI * 2);
          ctx.fill();

          // Green Pipes
          s.pipes.forEach((p) => {
            // Top pipe
            ctx.fillStyle = '#22c55e';
            ctx.fillRect(p.x, 0, 40, p.topH);
            ctx.fillStyle = '#16a34a';
            ctx.fillRect(p.x - 3, p.topH - 12, 46, 12);

            // Bottom pipe
            ctx.fillStyle = '#22c55e';
            ctx.fillRect(p.x, p.botY, 40, 300 - p.botY);
            ctx.fillStyle = '#16a34a';
            ctx.fillRect(p.x - 3, p.botY, 46, 12);
          });

          // Ground Grass & Soil
          ctx.fillStyle = '#16a34a';
          ctx.fillRect(0, 275, 400, 10);
          ctx.fillStyle = '#78350f';
          ctx.fillRect(0, 285, 400, 15);

          // Draw Bird (Bibo)
          const bx = 60;
          const by = s.birdY;

          ctx.save();
          ctx.translate(bx, by);
          const angle = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, (s.birdVy * 4 * Math.PI) / 180));
          ctx.rotate(angle);

          // Body
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.arc(0, 0, 13, 0, Math.PI * 2);
          ctx.fill();

          // Flight Goggles
          ctx.fillStyle = '#475569';
          ctx.fillRect(-2, -8, 12, 4);
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(4, -6, 3, 0, Math.PI * 2);
          ctx.fill();

          // Eye
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(5, -2, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.arc(6, -2, 2, 0, Math.PI * 2);
          ctx.fill();

          // Beak
          ctx.fillStyle = '#ea580c';
          ctx.beginPath();
          ctx.moveTo(9, 1);
          ctx.lineTo(17, 4);
          ctx.lineTo(9, 7);
          ctx.closePath();
          ctx.fill();

          // Wing
          ctx.fillStyle = '#eab308';
          ctx.beginPath();
          ctx.ellipse(-4, 3, 6, 4, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gravity]);

  return (
    <div className="flex flex-col items-center bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
      <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">Skor:</span>
          <span className="font-mono text-emerald-600 font-extrabold text-base">{score}</span>
        </div>
        <div className="text-xs text-slate-500 font-semibold">
          Rekor Terbaik: <span className="font-mono text-slate-800 font-bold">{bestScore}</span>
        </div>
      </div>

      {/* Canvas */}
      <div
        onClick={jump}
        className="relative rounded-xl overflow-hidden border-2 border-slate-800 cursor-pointer shadow-inner"
      >
        <canvas ref={canvasRef} width={400} height={300} className="w-[360px] h-[270px] block" />

        {isGameOver && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center text-white">
            <div className="text-4xl mb-1">💥</div>
            <h4 className="text-lg font-black text-white mb-1">Aduh, Terjatuh!</h4>
            <p className="text-xs text-slate-300 mb-3">
              Skor: {score} Pipa! Klik layar atau tekan Spasi untuk terbang lagi!
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                sound.playClick();
                resetGame();
                setIsRunning(true);
              }}
              className="px-4 py-2 text-xs font-bold bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white rounded-xl shadow-xs transition-transform"
            >
              Terbang Lagi!
            </button>
          </div>
        )}

        {!isRunning && !isGameOver && (
          <div className="absolute inset-0 bg-slate-900/40 flex flex-col items-center justify-center p-4 text-center text-white pointer-events-none">
            <div className="text-3xl mb-1 animate-bounce">🐦</div>
            <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">
              Klik Layar atau Tekan Spasi untuk Terbang!
            </span>
          </div>
        )}
      </div>

      {/* Jump Button for touch */}
      <div className="w-full flex items-center justify-between mt-3 gap-2">
        <button
          onClick={resetGame}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
          title="Reset Game"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={jump}
          className="flex-1 max-w-[220px] py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-transform flex items-center justify-center gap-2"
        >
          <span>Kepakkan Sayap (Lompat!)</span>
        </button>
      </div>
    </div>
  );
};
