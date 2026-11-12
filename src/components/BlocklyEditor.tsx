import React, { useEffect, useRef, useState } from 'react';
import * as Blockly from 'blockly';
import { pythonGenerator } from 'blockly/python';
import { registerCustomBlocks, TOOLBOX_CONFIGURATION, getToolboxForGame } from '../blockly/customBlocks';
import { RotateCcw, Trash2, CheckCircle2, CheckCheck, Send } from 'lucide-react';
import { sound } from '../audio/soundEffects';

interface BlocklyEditorProps {
  initialXml: string;
  onCodeChange: (pythonCode: string, parsedConfig: ParsedBlocklyConfig) => void;
  levelId: number;
  gameId?: string;
  onSubmitCode?: (workspace: Blockly.WorkspaceSvg | null) => void;
  onWorkspaceReady?: (workspace: Blockly.WorkspaceSvg | null) => void;
}

export interface ParsedBlocklyConfig {
  hasInit: boolean;
  startX: number;
  startY: number;
  hasLoop: boolean;
  hasStepForward: boolean;
  hasKeyHandler: boolean;
  hasFood: boolean;
  hasCheckFood: boolean;
  hasAddScore: boolean;
  hasGrow: boolean;
  hasCollision: boolean;
  foodType: 'apple' | 'star' | 'strawberry' | 'pizza' | 'donut';
  speedLevel: number;
}

export const BlocklyEditor: React.FC<BlocklyEditorProps> = ({
  initialXml,
  onCodeChange,
  levelId,
  gameId = 'snake',
  onSubmitCode,
  onWorkspaceReady,
}) => {
  const blocklyDivRef = useRef<HTMLDivElement | null>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    registerCustomBlocks();

    if (!blocklyDivRef.current) return;

    // Inject Blockly workspace with game-specific toolbox
    const ws = Blockly.inject(blocklyDivRef.current, {
      toolbox: getToolboxForGame(gameId),
      trashcan: true,
      zoom: {
        controls: true,
        wheel: true,
        startScale: 0.9,
        maxScale: 1.8,
        minScale: 0.5,
        scaleSpeed: 1.1,
      },
      grid: {
        spacing: 20,
        length: 3,
        colour: '#e2e8f0',
        snap: true,
      },
      sounds: false,
    });
    workspaceRef.current = ws;
    onWorkspaceReady?.(ws);

    // Parse blocks and generate Python
    const updateWorkspaceCode = () => {
      try {
        const code = pythonGenerator.workspaceToCode(ws);

        // Analyze what blocks are present in the workspace
        const allBlocks = ws.getAllBlocks(false);
        const hasInit = allBlocks.some((b) => b.type === 'snake_init');
        const posBlock = allBlocks.find((b) => b.type === 'snake_set_position');
        const hasLoop = allBlocks.some((b) => b.type === 'snake_loop');
        const hasStepForward = allBlocks.some((b) => b.type === 'snake_step_forward');
        const hasKeyHandler = allBlocks.some((b) => b.type === 'snake_key_handler');
        const foodBlock = allBlocks.find((b) => b.type === 'snake_spawn_food');
        const hasCheckFood = allBlocks.some((b) => b.type === 'snake_check_food');
        const hasAddScore = allBlocks.some((b) => b.type === 'snake_add_score');
        const hasGrow = allBlocks.some((b) => b.type === 'snake_grow');
        const hasCollision = allBlocks.some((b) => b.type === 'snake_check_collision');
        const speedBlock = allBlocks.find((b) => b.type === 'snake_set_speed');

        let startX = 10;
        let startY = 10;
        if (posBlock) {
          const posXCode = pythonGenerator.valueToCode(posBlock, 'POS_X', 0) || '10';
          const posYCode = pythonGenerator.valueToCode(posBlock, 'POS_Y', 0) || '10';
          const parsedX = parseInt(posXCode.trim(), 10);
          const parsedY = parseInt(posYCode.trim(), 10);
          if (!isNaN(parsedX)) startX = parsedX;
          if (!isNaN(parsedY)) startY = parsedY;
        }

        let foodType: 'apple' | 'star' | 'strawberry' | 'pizza' | 'donut' = 'apple';
        if (foodBlock) {
          const val = foodBlock.getFieldValue('FOOD_TYPE');
          if (['apple', 'star', 'strawberry', 'pizza', 'donut'].includes(val)) {
            foodType = val as typeof foodType;
          }
        }

        let speedLevel = 2;
        if (speedBlock) {
          speedLevel = Number(speedBlock.getFieldValue('SPEED')) || 2;
        }

        onCodeChange(code, {
          hasInit,
          startX,
          startY,
          hasLoop,
          hasStepForward,
          hasKeyHandler,
          hasFood: Boolean(foodBlock),
          hasCheckFood,
          hasAddScore,
          hasGrow,
          hasCollision,
          foodType,
          speedLevel,
        });
      } catch (err) {
        console.error('Error generating Python from Blockly:', err);
      }
    };

    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    ws.addChangeListener((event) => {
      // Skip pure UI events (e.g. zooming, scrolling, clicking category)
      if (event.isUiEvent) return;

      if (
        event.type === Blockly.Events.BLOCK_CREATE ||
        event.type === Blockly.Events.BLOCK_DELETE ||
        event.type === Blockly.Events.BLOCK_CHANGE ||
        event.type === Blockly.Events.BLOCK_MOVE
      ) {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          updateWorkspaceCode();
        }, 120);
      }
    });

    // Load initial XML
    if (initialXml) {
      try {
        const dom = Blockly.utils.xml.textToDom(initialXml);
        Blockly.Xml.domToWorkspace(dom, ws);
      } catch (e) {
        console.error('Error loading default xml', e);
      }
    }

    updateWorkspaceCode();

    const handleResize = () => {
      Blockly.svgResize(ws);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      window.removeEventListener('resize', handleResize);
      onWorkspaceReady?.(null);
      ws.dispose();
      workspaceRef.current = null;
    };
  }, [levelId, gameId]); // reload when level or game changes

  // Reload starter blocks
  const handleResetXml = () => {
    sound.playClick();
    if (!workspaceRef.current) return;
    workspaceRef.current.clear();
    try {
      const dom = Blockly.utils.xml.textToDom(initialXml);
      Blockly.Xml.domToWorkspace(dom, workspaceRef.current);
    } catch (e) {
      console.error(e);
    }
  };

  const handleClear = () => {
    sound.playClick();
    if (!workspaceRef.current) return;
    workspaceRef.current.clear();
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Workspace Header Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-700">
        <div className="flex items-center gap-2">
          <span className="text-base">🧩</span>
          <span>Area Rakit Balok Blockly</span>
        </div>

        <div className="flex items-center gap-2">
          {onSubmitCode && (
            <button
              onClick={() => {
                sound.playClick();
                onSubmitCode(workspaceRef.current);
              }}
              className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 active:scale-95 text-white font-bold rounded-lg shadow-xs transition-transform"
              title="Periksa apakah kodemu sudah benar dan dapatkan nilai skor!"
            >
              <CheckCheck className="w-3.5 h-3.5 text-yellow-300" />
              <span>Kumpulkan & Nilai Kode</span>
            </button>
          )}

          <button
            onClick={handleResetXml}
            className="flex items-center gap-1.5 px-2.5 py-1 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
            title="Kembalikan susunan balok awal untuk level ini"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Balok Awal</span>
          </button>

          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 px-2.5 py-1 text-red-600 hover:text-red-700 bg-white hover:bg-red-50 border border-red-200 rounded-lg transition-colors"
            title="Bersihkan area kerja"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Bersihkan</span>
          </button>
        </div>
      </div>

      {/* Embedded Blockly Workspace container */}
      <div className="relative flex-1 min-h-[460px] w-full">
        <div ref={blocklyDivRef} className="absolute inset-0 w-full h-full" />
      </div>
    </div>
  );
};
