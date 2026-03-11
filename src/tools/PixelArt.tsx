'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  Tooltip,
  useTheme,
  alpha
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import ColorizeIcon from '@mui/icons-material/Colorize';
import GridOnIcon from '@mui/icons-material/GridOn';
import GridOffIcon from '@mui/icons-material/GridOff';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import UndoIcon from '@mui/icons-material/Undo';

const PRESET_COLORS = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00',
  '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
  '#FF8000', '#8000FF', '#0080FF', '#FF0080',
  '#808080', '#C0C0C0', '#800000', '#008000',
];

const GRID_SIZES = [8, 16, 32] as const;
type GridSize = typeof GRID_SIZES[number];
type Tool = 'draw' | 'erase' | 'fill' | 'pick';

function createEmptyGrid(size: number): string[][] {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => ''));
}

export default function PixelArt() {
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gridSize, setGridSize] = useState<GridSize>(16);
  const [grid, setGrid] = useState<string[][]>(() => createEmptyGrid(16));
  const [color, setColor] = useState('#000000');
  const [tool, setTool] = useState<Tool>('draw');
  const [showGrid, setShowGrid] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState<string[][][]>([]);
  const canvasSize = 512;

  const pushHistory = useCallback((currentGrid: string[][]) => {
    setHistory((prev) => {
      const next = [...prev, currentGrid.map((row) => [...row])];
      if (next.length > 20) next.shift();
      return next;
    });
  }, []);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvasSize / gridSize;
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    // Checkerboard background for transparency
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const isLight = (x + y) % 2 === 0;
        ctx.fillStyle = isLight ? '#f0f0f0' : '#d8d8d8';
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);

        if (grid[y] && grid[y][x]) {
          ctx.fillStyle = grid[y][x];
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }
    }

    // Grid lines
    if (showGrid) {
      ctx.strokeStyle = alpha(theme.palette.text.primary, 0.15);
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= gridSize; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, canvasSize);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(canvasSize, i * cellSize);
        ctx.stroke();
      }
    }
  }, [grid, gridSize, showGrid, theme]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const getCellFromEvent = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvasSize / rect.width;
      const scaleY = canvasSize / rect.height;
      const x = Math.floor(((e.clientX - rect.left) * scaleX) / (canvasSize / gridSize));
      const y = Math.floor(((e.clientY - rect.top) * scaleY) / (canvasSize / gridSize));
      if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) return null;
      return { x, y };
    },
    [gridSize]
  );

  const floodFill = useCallback(
    (startX: number, startY: number, fillColor: string, currentGrid: string[][]) => {
      const targetColor = currentGrid[startY][startX];
      if (targetColor === fillColor) return currentGrid;

      const newGrid = currentGrid.map((row) => [...row]);
      const stack = [{ x: startX, y: startY }];

      while (stack.length > 0) {
        const { x, y } = stack.pop()!;
        if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) continue;
        if (newGrid[y][x] !== targetColor) continue;

        newGrid[y][x] = fillColor;
        stack.push({ x: x + 1, y }, { x: x - 1, y }, { x, y: y + 1 }, { x, y: y - 1 });
      }
      return newGrid;
    },
    [gridSize]
  );

  const applyTool = useCallback(
    (x: number, y: number, saveHistory = true) => {
      if (tool === 'pick') {
        const c = grid[y][x];
        if (c) setColor(c);
        return;
      }

      if (saveHistory) pushHistory(grid);

      if (tool === 'fill') {
        const fillColor = color;
        const newGrid = floodFill(x, y, fillColor, grid);
        setGrid(newGrid);
        return;
      }

      setGrid((prev) => {
        const newGrid = prev.map((row) => [...row]);
        newGrid[y][x] = tool === 'erase' ? '' : color;
        return newGrid;
      });
    },
    [tool, color, grid, pushHistory, floodFill]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const cell = getCellFromEvent(e);
      if (!cell) return;
      setIsDrawing(true);
      applyTool(cell.x, cell.y, true);
    },
    [getCellFromEvent, applyTool]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing || tool === 'fill' || tool === 'pick') return;
      const cell = getCellFromEvent(e);
      if (!cell) return;
      applyTool(cell.x, cell.y, false);
    },
    [isDrawing, tool, getCellFromEvent, applyTool]
  );

  const handleMouseUp = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setGrid(prev);
  }, [history]);

  const handleClear = useCallback(() => {
    pushHistory(grid);
    setGrid(createEmptyGrid(gridSize));
  }, [grid, gridSize, pushHistory]);

  const handleGridSizeChange = useCallback(
    (newSize: GridSize) => {
      pushHistory(grid);
      setGridSize(newSize);
      setGrid(createEmptyGrid(newSize));
    },
    [grid, pushHistory]
  );

  const handleDownload = useCallback(() => {
    const exportCanvas = document.createElement('canvas');
    const exportSize = 512;
    exportCanvas.width = exportSize;
    exportCanvas.height = exportSize;
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    const cellSize = exportSize / gridSize;
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        if (grid[y][x]) {
          ctx.fillStyle = grid[y][x];
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }
    }

    const link = document.createElement('a');
    link.download = `pixel-art-${gridSize}x${gridSize}.png`;
    link.href = exportCanvas.toDataURL('image/png');
    link.click();
  }, [grid, gridSize]);

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <Grid container spacing={3}>
        {/* Tools panel */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={0}
            sx={{ p: 3, borderRadius: 3 }}
          >
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Инструменты
            </Typography>
            <ToggleButtonGroup
              value={tool}
              exclusive
              onChange={(_, v) => v && setTool(v)}
              fullWidth
              size="small"
              sx={{ mb: 3 }}
            >
              <ToggleButton value="draw">
                <Tooltip title="Рисовать">
                  <EditIcon />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value="erase">
                <Tooltip title="Стереть">
                  <AutoFixHighIcon />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value="fill">
                <Tooltip title="Заливка">
                  <FormatColorFillIcon />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value="pick">
                <Tooltip title="Пипетка">
                  <ColorizeIcon />
                </Tooltip>
              </ToggleButton>
            </ToggleButtonGroup>

            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Цвет
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1,
                  backgroundColor: color,
                  border: `2px solid ${theme.palette.divider}`,
                  flexShrink: 0
                }}
              />
              <TextField
                size="small"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                slotProps={{
                  input: {
                    sx: { fontFamily: 'monospace' }
                  }
                }}
                fullWidth
              />
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 3 }}>
              {PRESET_COLORS.map((c) => (
                <IconButton
                  key={c}
                  onClick={() => setColor(c)}
                  sx={{
                    width: 32,
                    height: 32,
                    backgroundColor: c,
                    border: color === c
                      ? `3px solid ${theme.palette.primary.main}`
                      : `1px solid ${theme.palette.divider}`,
                    borderRadius: 1,
                    '&:hover': { backgroundColor: c, opacity: 0.8 }
                  }}
                />
              ))}
            </Box>

            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Размер сетки
            </Typography>
            <ToggleButtonGroup
              value={gridSize}
              exclusive
              onChange={(_, v) => v && handleGridSizeChange(v)}
              fullWidth
              size="small"
              sx={{ mb: 3 }}
            >
              {GRID_SIZES.map((s) => (
                <ToggleButton key={s} value={s}>
                  {s}×{s}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={showGrid ? <GridOffIcon /> : <GridOnIcon />}
                onClick={() => setShowGrid((v) => !v)}
                fullWidth
              >
                {showGrid ? 'Скрыть сетку' : 'Показать сетку'}
              </Button>
              <Button
                variant="outlined"
                startIcon={<UndoIcon />}
                onClick={handleUndo}
                disabled={history.length === 0}
                fullWidth
              >
                Отменить ({history.length})
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleClear}
                fullWidth
              >
                Очистить
              </Button>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={handleDownload}
                fullWidth
              >
                Скачать PNG
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Canvas */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <canvas
              ref={canvasRef}
              width={canvasSize}
              height={canvasSize}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{
                width: '100%',
                maxWidth: canvasSize,
                height: 'auto',
                cursor: tool === 'pick' ? 'crosshair' : 'pointer',
                imageRendering: 'pixelated',
                borderRadius: 8
              }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
