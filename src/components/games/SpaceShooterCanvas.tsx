import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, ArrowLeft, ArrowRight, Zap, Heart } from 'lucide-react';
import { sound } from '../../audio/soundEffects';

interface SpaceShooterCanvasProps {
  initialLives?: number;
  laserSpeed?: number;
}

export const SpaceShooterCanvas: React.FC<SpaceShooterCanvasProps> = ({
  initialLives = 3,
  laserSpeed = 8,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(initialLives);

  // Mutable state for high-performance 60fps loop
  const stateRef = useRef({
    playerX: 180,
    lasers: [] as Array<{ x: number; y: number }>,
    aliens: [
      { x: 60, y: 40, vx: 1.5, color: '#a855f7' },
      { x: 140, y: 60, vx: -1.5, color: '#22c55e' },
      { x: 220, y: 40, vx: 1.5, color: '#a855f7' },
      { x: 300, y: 70, vx: -1.5, color: '#ec4899' },
    ],
    stars: Array.from({ length: 45 }, () => ({
      x: Math.random() * 400,
      y: Math.random() * 300,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 2 + 0.5,
    })),
    keys: { left: false, right: false },
    isRunning: false,
    isGameOver: false,
    lives: initialLives,
    score: 0,
    lastShootTime: 0,
  });

  stateRef.current.isRunning = isRunning;
  stateRef.current.isGameOver = isGameOver;

  const movePlayer = (delta: number) => {
    sound.playTurn();
    stateRef.current.playerX = Math.max(10, Math.min(350, stateRef.current.playerX + delta));
  };

  const shootLaser = useCallback(() => {
    const s = stateRef.current;
    if (!s.isRunning || s.isGameOver) return;
    const now = performance.now();
    if (now - s.lastShootTime < 180) return; // cooldown to prevent flooding
    s.lastShootTime = now;

    sound.playLaser();
    s.lasers.push({
      x: s.playerX + 18,
      y: 250,
    });
  }, []);

  const resetGame = () => {
    const s = stateRef.current;
    s.playerX = 180;
    s.lasers = [];
    s.score = 0;
    s.lives = initialLives;
    s.aliens = [
      { x: 60, y: 40, vx: 1.5, color: '#a855f7' },
      { x: 140, y: 60, vx: -1.5, color: '#22c55e' },
      { x: 220, y: 40, vx: 1.5, color: '#a855f7' },
      { x: 300, y: 70, vx: -1.5, color: '#ec4899' },
    ];
    setScore(0);
    setLives(initialLives);
    setIsGameOver(false);
    setIsRunning(false);
  };

  // Keyboard navigation with continuous key state for zero lag
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault();
        stateRef.current.keys.left = true;
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        stateRef.current.keys.right = true;
      } else if (['Space', 'KeyW', 'ArrowUp'].includes(e.code)) {
        e.preventDefault();
        shootLaser();
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault();
        stateRef.current.keys.left = false;
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        stateRef.current.keys.right = false;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [shootLaser]);

  // High-performance 60 FPS requestAnimationFrame loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      const s = stateRef.current;
      const canvas = canvasRef.current;

      // Always animate stars background
      s.stars.forEach((st) => {
        st.y += st.speed * (dt * 60);
        if (st.y > 300) {
          st.y = 0;
          st.x = Math.random() * 400;
        }
      });

      if (s.isRunning && !s.isGameOver) {
        // Continuous smooth ship movement
        if (s.keys.left) {
          s.playerX = Math.max(10, s.playerX - 250 * dt);
        }
        if (s.keys.right) {
          s.playerX = Math.min(350, s.playerX + 250 * dt);
        }

        // Move Lasers upward
        const lSpd = laserSpeed * (dt * 60);
        for (let i = s.lasers.length - 1; i >= 0; i--) {
          s.lasers[i].y -= lSpd;
          if (s.lasers[i].y < -15) {
            s.lasers.splice(i, 1);
          }
        }

        // Move Aliens
        s.aliens.forEach((al) => {
          al.x += al.vx * (dt * 60);
          if (al.x <= 15) {
            al.x = 15;
            al.vx = Math.abs(al.vx);
            al.y += 14;
          } else if (al.x >= 355) {
            al.x = 355;
            al.vx = -Math.abs(al.vx);
            al.y += 14;
          }

          // Alien reached bottom level (near ship)
          if (al.y >= 240) {
            al.y = 30;
            al.x = Math.random() * 320 + 20;
            sound.playGameOver();
            s.lives -= 1;
            const newLives = s.lives;
            setLives(newLives);

            if (newLives <= 0) {
              s.isGameOver = true;
              setIsGameOver(true);
              setIsRunning(false);
            }
          }
        });

        // Laser - Alien Collision Detection
        for (let i = s.lasers.length - 1; i >= 0; i--) {
          const l = s.lasers[i];
          for (let j = 0; j < s.aliens.length; j++) {
            const al = s.aliens[j];
            if (l.x >= al.x && l.x <= al.x + 28 && l.y >= al.y && l.y <= al.y + 24) {
              // Laser Hit!
              s.lasers.splice(i, 1);
              al.y = 20;
              al.x = Math.random() * 320 + 20;
              sound.playEat();
              s.score += 20;
              const newScore = s.score;
              setScore(newScore);
              break;
            }
          }
        }
      }

      // Draw Canvas Frame
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Deep Space Dark Blue
          ctx.fillStyle = '#050814';
          ctx.fillRect(0, 0, 400, 300);

          // Draw Stars
          ctx.fillStyle = '#ffffff';
          s.stars.forEach((st) => {
            ctx.beginPath();
            ctx.arc(st.x, st.y, st.size, 0, Math.PI * 2);
            ctx.fill();
          });

          // Draw Lasers (Glowing Blue)
          ctx.fillStyle = '#38bdf8';
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 8;
          s.lasers.forEach((l) => {
            ctx.fillRect(l.x, l.y, 4, 12);
          });
          ctx.shadowBlur = 0;

          // Draw Aliens (Squids)
          s.aliens.forEach((al) => {
            ctx.save();
            ctx.translate(al.x, al.y);
            ctx.fillStyle = al.color;

            // Alien Head
            ctx.beginPath();
            ctx.arc(14, 10, 11, 0, Math.PI * 2);
            ctx.fill();

            // Tentacles
            ctx.fillRect(5, 15, 3.5, 8);
            ctx.fillRect(11, 15, 3.5, 10);
            ctx.fillRect(17, 15, 3.5, 8);

            // Cute Eyes
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(10, 8, 3, 0, Math.PI * 2);
            ctx.arc(17, 8, 3, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#0f172a';
            ctx.beginPath();
            ctx.arc(10, 8, 1.5, 0, Math.PI * 2);
            ctx.arc(17, 8, 1.5, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
          });

          // Draw Spaceship
          const px = s.playerX;
          const py = 260;

          ctx.save();
          // Fuselage
          ctx.fillStyle = '#f97316';
          ctx.beginPath();
          ctx.moveTo(px + 20, py - 12);
          ctx.lineTo(px + 36, py + 16);
          ctx.lineTo(px + 20, py + 10);
          ctx.lineTo(px + 4, py + 16);
          ctx.closePath();
          ctx.fill();

          // Cockpit
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.ellipse(px + 20, py + 2, 5, 8, 0, 0, Math.PI * 2);
          ctx.fill();

          // Thruster flame
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.moveTo(px + 16, py + 12);
          ctx.lineTo(px + 20, py + 20);
          ctx.lineTo(px + 24, py + 12);
          ctx.fill();

          ctx.restore();
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [laserSpeed]);

  return (
    <div className="flex flex-col items-center bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
      <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">Skor:</span>
          <span className="font-mono text-purple-600 font-extrabold text-base">{score}</span>
        </div>

        {/* Lives */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 3 }).map((_, idx) => (
            <Heart
              key={idx}
              className={`w-4 h-4 ${
                idx < lives ? 'text-rose-500 fill-rose-500' : 'text-slate-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div className="relative rounded-xl overflow-hidden border-2 border-slate-900 shadow-inner">
        <canvas ref={canvasRef} width={400} height={300} className="w-[360px] h-[270px] block" />

        {isGameOver && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center text-white">
            <div className="text-4xl mb-1">💥</div>
            <h4 className="text-lg font-black text-white mb-1">Pesawat Tertabrak!</h4>
            <p className="text-xs text-slate-300 mb-3">Skor akhir kamu: {score} Poin!</p>
            <button
              onClick={() => {
                sound.playClick();
                resetGame();
                setIsRunning(true);
              }}
              className="px-4 py-2 text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-xs transition-transform active:scale-95"
            >
              Luncurkan Lagi!
            </button>
          </div>
        )}

        {!isRunning && !isGameOver && (
          <div className="absolute inset-0 bg-slate-950/40 flex flex-col items-center justify-center p-4 text-center text-white pointer-events-none">
            <div className="text-3xl mb-1 animate-bounce">👾</div>
            <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">
              Tekan "Mulai" atau Tombol Spasi untuk Bertempur!
            </span>
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="w-full flex items-center justify-between mt-3 gap-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              sound.playClick();
              setIsRunning((r) => !r);
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white rounded-xl transition-transform active:scale-95 ${
              isRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
            <span>{isRunning ? 'Jeda' : 'Mulai'}</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              resetGame();
            }}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
            title="Reset Game"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Touch movement & shoot buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => movePlayer(-25)}
            className="p-2 bg-slate-100 hover:bg-purple-100 active:bg-purple-200 text-slate-700 rounded-xl transition-colors"
            title="Geser Kiri"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => movePlayer(25)}
            className="p-2 bg-slate-100 hover:bg-purple-100 active:bg-purple-200 text-slate-700 rounded-xl transition-colors"
            title="Geser Kanan"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={shootLaser}
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1 transition-transform"
            title="Tembak Laser"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Tembak!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
