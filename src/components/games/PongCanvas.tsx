import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, ArrowUp, ArrowDown } from 'lucide-react';
import { sound } from '../../audio/soundEffects';

interface PongCanvasProps {
  ballSpeed?: number;
  maxScore?: number;
  onGoalScore?: (playerScore: number, botScore: number) => void;
}

export const PongCanvas: React.FC<PongCanvasProps> = ({
  ballSpeed = 4.5,
  maxScore = 5,
  onGoalScore,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [playerScore, setPlayerScore] = useState(0);
  const [botScore, setBotScore] = useState(0);
  const [winner, setWinner] = useState<'player' | 'bot' | null>(null);

  // Mutable game state for high-performance 60fps loop
  const stateRef = useRef({
    ballX: 200,
    ballY: 150,
    ballVx: ballSpeed,
    ballVy: ballSpeed * 0.7,
    playerY: 115,
    botY: 115,
    paddleHeight: 70,
    paddleWidth: 12,
    playerVy: 0,
    keys: { up: false, down: false },
    isRunning: false,
    winner: null as 'player' | 'bot' | null,
    playerScore: 0,
    botScore: 0,
  });

  // Keep stateRef in sync with React state
  stateRef.current.isRunning = isRunning;
  stateRef.current.winner = winner;

  const resetBall = useCallback(
    (scorer: 'player' | 'bot') => {
      const s = stateRef.current;
      s.ballX = 200;
      s.ballY = 150;
      s.ballVx = scorer === 'player' ? -ballSpeed : ballSpeed;
      s.ballVy = (Math.random() - 0.5) * ballSpeed * 1.4;
    },
    [ballSpeed]
  );

  const resetGame = useCallback(() => {
    const s = stateRef.current;
    s.playerScore = 0;
    s.botScore = 0;
    s.playerY = 115;
    s.botY = 115;
    setPlayerScore(0);
    setBotScore(0);
    setWinner(null);
    setIsRunning(false);
    resetBall('player');
  }, [resetBall]);

  const movePaddle = (dir: 'UP' | 'DOWN') => {
    sound.playTurn();
    const s = stateRef.current;
    if (dir === 'UP') {
      s.playerY = Math.max(10, s.playerY - 30);
    } else {
      s.playerY = Math.min(220, s.playerY + 30);
    }
  };

  // Keyboard controls with active key tracking for butter-smooth movement
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        stateRef.current.keys.up = true;
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        stateRef.current.keys.down = true;
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        stateRef.current.keys.up = false;
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        stateRef.current.keys.down = false;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  // Butter-Smooth 60 FPS RequestAnimationFrame Loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      const s = stateRef.current;
      const canvas = canvasRef.current;

      if (s.isRunning && !s.winner) {
        // Continuous smooth paddle movement
        if (s.keys.up) {
          s.playerY = Math.max(10, s.playerY - 240 * dt);
        }
        if (s.keys.down) {
          s.playerY = Math.min(220, s.playerY + 240 * dt);
        }

        // Ball movement
        s.ballX += s.ballVx * (dt * 60);
        s.ballY += s.ballVy * (dt * 60);

        // Top & Bottom boundary bounce
        if (s.ballY <= 10) {
          s.ballY = 10;
          s.ballVy = Math.abs(s.ballVy);
          sound.playBounce();
        } else if (s.ballY >= 290) {
          s.ballY = 290;
          s.ballVy = -Math.abs(s.ballVy);
          sound.playBounce();
        }

        // Smooth AI Tracking
        const botCenter = s.botY + s.paddleHeight / 2;
        const targetY = s.ballY;
        if (botCenter < targetY - 10) {
          s.botY = Math.min(220, s.botY + 180 * dt);
        } else if (botCenter > targetY + 10) {
          s.botY = Math.max(10, s.botY - 180 * dt);
        }

        // Player Paddle Collision (Left side)
        if (
          s.ballX <= 28 &&
          s.ballX >= 12 &&
          s.ballY >= s.playerY &&
          s.ballY <= s.playerY + s.paddleHeight
        ) {
          s.ballVx = Math.abs(s.ballVx) * 1.04; // slight speed increase
          const offset = (s.ballY - (s.playerY + s.paddleHeight / 2)) / (s.paddleHeight / 2);
          s.ballVy = offset * 4.2;
          s.ballX = 29;
          sound.playBounce();
        }

        // Bot Paddle Collision (Right side)
        if (
          s.ballX >= 370 &&
          s.ballX <= 386 &&
          s.ballY >= s.botY &&
          s.ballY <= s.botY + s.paddleHeight
        ) {
          s.ballVx = -Math.abs(s.ballVx) * 1.04;
          const offset = (s.ballY - (s.botY + s.paddleHeight / 2)) / (s.paddleHeight / 2);
          s.ballVy = offset * 4.2;
          s.ballX = 369;
          sound.playBounce();
        }

        // Goal Left (Bot Scores)
        if (s.ballX < 0) {
          sound.playGameOver();
          s.botScore += 1;
          const newBotScore = s.botScore;
          setBotScore(newBotScore);
          onGoalScore?.(s.playerScore, newBotScore);

          if (newBotScore >= maxScore) {
            s.winner = 'bot';
            setWinner('bot');
            setIsRunning(false);
          } else {
            resetBall('bot');
          }
        }

        // Goal Right (Player Scores!)
        if (s.ballX > 400) {
          sound.playLevelWin();
          s.playerScore += 1;
          const newPlayerScore = s.playerScore;
          setPlayerScore(newPlayerScore);
          onGoalScore?.(newPlayerScore, s.botScore);

          if (newPlayerScore >= maxScore) {
            s.winner = 'player';
            setWinner('player');
            setIsRunning(false);
          } else {
            resetBall('player');
          }
        }
      }

      // Render Frame on Canvas
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Dark retro cyber background
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(0, 0, 400, 300);

          // Grid lines
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
          ctx.lineWidth = 1;
          for (let x = 0; x < 400; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, 300);
            ctx.stroke();
          }

          // Center net line
          ctx.setLineDash([6, 6]);
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(200, 0);
          ctx.lineTo(200, 300);
          ctx.stroke();
          ctx.setLineDash([]);

          // Draw Player Paddle (Blue Glow)
          ctx.fillStyle = '#38bdf8';
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.roundRect(16, s.playerY, s.paddleWidth, s.paddleHeight, 4);
          ctx.fill();

          // Draw Bot Paddle (Pink Glow)
          ctx.fillStyle = '#f43f5e';
          ctx.shadowColor = '#f43f5e';
          ctx.beginPath();
          ctx.roundRect(372, s.botY, s.paddleWidth, s.paddleHeight, 4);
          ctx.fill();

          // Draw Glowing Ball
          ctx.fillStyle = '#facc15';
          ctx.shadowColor = '#facc15';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(s.ballX, s.ballY, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [maxScore, resetBall, onGoalScore]);

  return (
    <div className="flex flex-col items-center bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
      {/* Score Header */}
      <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyan-400" />
          <span className="text-xs font-bold text-slate-700">Kamu (Biru):</span>
          <span className="font-mono text-cyan-600 font-extrabold text-base">{playerScore}</span>
        </div>

        <div className="text-xs font-bold text-slate-400">VS</div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-rose-600 font-extrabold text-base">{botScore}</span>
          <span className="text-xs font-bold text-slate-700">:Komputer (Pink)</span>
          <div className="w-3 h-3 rounded-full bg-rose-400" />
        </div>
      </div>

      {/* Canvas */}
      <div className="relative rounded-xl overflow-hidden border-2 border-slate-800 shadow-inner">
        <canvas ref={canvasRef} width={400} height={300} className="w-[360px] h-[270px] block" />

        {winner && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center text-white">
            <div className="text-4xl mb-2">{winner === 'player' ? '🏆' : '🤖'}</div>
            <h4 className="text-lg font-black text-white mb-1">
              {winner === 'player' ? 'Kamu Menang Tenis Meja!' : 'Komputer Menang! Coba Lagi!'}
            </h4>
            <p className="text-xs text-slate-300 mb-3">
              {winner === 'player' ? 'Refleks tanganmu hebat sekali!' : 'Ayo tingkatkan fokus dan coba lagi!'}
            </p>
            <button
              onClick={() => {
                sound.playClick();
                resetGame();
                setIsRunning(true);
              }}
              className="px-4 py-2 text-xs font-bold bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl shadow-xs"
            >
              Main Lagi
            </button>
          </div>
        )}

        {!isRunning && !winner && (
          <div className="absolute inset-0 bg-slate-950/40 flex flex-col items-center justify-center p-4 text-center text-white pointer-events-none">
            <div className="text-3xl mb-1 animate-bounce">🏓</div>
            <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">
              Tekan "Mulai Main" atau Tombol Panah!
            </span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="w-full flex items-center justify-between mt-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playClick();
              setIsRunning((r) => !r);
            }}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl text-white transition-transform active:scale-95 ${
              isRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-cyan-600 hover:bg-cyan-700'
            }`}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
            <span>{isRunning ? 'Jeda' : 'Mulai Main'}</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              resetGame();
            }}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
            title="Ulangi Game"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Paddle buttons for touch / click */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => movePaddle('UP')}
            className="p-2.5 bg-slate-100 hover:bg-cyan-100 active:bg-cyan-200 text-slate-700 rounded-xl transition-colors"
            title="Raket Atas"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <button
            onClick={() => movePaddle('DOWN')}
            className="p-2.5 bg-slate-100 hover:bg-cyan-100 active:bg-cyan-200 text-slate-700 rounded-xl transition-colors"
            title="Raket Bawah"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
