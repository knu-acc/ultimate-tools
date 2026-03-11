'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Grid,
  Button,
  IconButton,
  useTheme,
  alpha
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

interface FuncEntry {
  id: number;
  expr: string;
  color: string;
}

const COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

function tokenize(expr: string): string[] {
  const tokens: string[] = [];
  let i = 0;
  while (i < expr.length) {
    if (/\s/.test(expr[i])) { i++; continue; }
    if ('+-*/()^,'.includes(expr[i])) { tokens.push(expr[i]); i++; continue; }
    if (/[0-9.]/.test(expr[i])) {
      let num = '';
      while (i < expr.length && /[0-9.]/.test(expr[i])) { num += expr[i]; i++; }
      tokens.push(num);
      continue;
    }
    if (/[a-zA-Z_]/.test(expr[i])) {
      let name = '';
      while (i < expr.length && /[a-zA-Z0-9_]/.test(expr[i])) { name += expr[i]; i++; }
      tokens.push(name);
      continue;
    }
    i++;
  }
  return tokens;
}

function parseExpr(tokens: string[], pos: { i: number }): (x: number) => number {
  return parseAddSub(tokens, pos);
}

function parseAddSub(tokens: string[], pos: { i: number }): (x: number) => number {
  let left = parseMulDiv(tokens, pos);
  while (pos.i < tokens.length && (tokens[pos.i] === '+' || tokens[pos.i] === '-')) {
    const op = tokens[pos.i]; pos.i++;
    const right = parseMulDiv(tokens, pos);
    const l = left, r = right;
    left = op === '+' ? (x: number) => l(x) + r(x) : (x: number) => l(x) - r(x);
  }
  return left;
}

function parseMulDiv(tokens: string[], pos: { i: number }): (x: number) => number {
  let left = parsePow(tokens, pos);
  while (pos.i < tokens.length && (tokens[pos.i] === '*' || tokens[pos.i] === '/')) {
    const op = tokens[pos.i]; pos.i++;
    const right = parsePow(tokens, pos);
    const l = left, r = right;
    left = op === '*' ? (x: number) => l(x) * r(x) : (x: number) => l(x) / r(x);
  }
  return left;
}

function parsePow(tokens: string[], pos: { i: number }): (x: number) => number {
  let left = parseUnary(tokens, pos);
  while (pos.i < tokens.length && tokens[pos.i] === '^') {
    pos.i++;
    const right = parseUnary(tokens, pos);
    const l = left, r = right;
    left = (x: number) => Math.pow(l(x), r(x));
  }
  return left;
}

function parseUnary(tokens: string[], pos: { i: number }): (x: number) => number {
  if (pos.i < tokens.length && tokens[pos.i] === '-') {
    pos.i++;
    const inner = parseAtom(tokens, pos);
    return (x: number) => -inner(x);
  }
  if (pos.i < tokens.length && tokens[pos.i] === '+') {
    pos.i++;
  }
  return parseAtom(tokens, pos);
}

function parseAtom(tokens: string[], pos: { i: number }): (x: number) => number {
  const token = tokens[pos.i];
  if (!token) return () => 0;

  if (token === '(') {
    pos.i++;
    const inner = parseExpr(tokens, pos);
    if (pos.i < tokens.length && tokens[pos.i] === ')') pos.i++;
    return inner;
  }

  if (/^[0-9.]/.test(token)) {
    pos.i++;
    const val = parseFloat(token);
    return () => val;
  }

  const name = token.toLowerCase();
  const funcs: Record<string, (v: number) => number> = {
    sin: Math.sin, cos: Math.cos, tan: Math.tan,
    sqrt: Math.sqrt, abs: Math.abs, log: Math.log,
    ln: Math.log, log10: Math.log10, exp: Math.exp,
    asin: Math.asin, acos: Math.acos, atan: Math.atan,
    ceil: Math.ceil, floor: Math.floor, round: Math.round
  };

  if (name === 'x') { pos.i++; return (x: number) => x; }
  if (name === 'pi') { pos.i++; return () => Math.PI; }
  if (name === 'e') { pos.i++; return () => Math.E; }

  if (funcs[name]) {
    pos.i++;
    if (pos.i < tokens.length && tokens[pos.i] === '(') {
      pos.i++;
      const arg = parseExpr(tokens, pos);
      if (pos.i < tokens.length && tokens[pos.i] === ')') pos.i++;
      const fn = funcs[name];
      return (x: number) => fn(arg(x));
    }
    const fn = funcs[name];
    return (x: number) => fn(x);
  }

  pos.i++;
  return () => 0;
}

function compileExpr(expr: string): ((x: number) => number) | null {
  try {
    const tokens = tokenize(expr);
    if (tokens.length === 0) return null;
    const pos = { i: 0 };
    return parseExpr(tokens, pos);
  } catch {
    return null;
  }
}

export default function GraphPlotter() {
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [functions, setFunctions] = useState<FuncEntry[]>([
    { id: 1, expr: 'sin(x)', color: COLORS[0] },
  ]);
  const [xMin, setXMin] = useState(-10);
  const [xMax, setXMax] = useState(10);
  const [yMin, setYMin] = useState(-10);
  const [yMax, setYMax] = useState(10);
  const nextId = useRef(2);

  const addFunction = () => {
    const colorIdx = functions.length % COLORS.length;
    setFunctions((prev) => [...prev, { id: nextId.current++, expr: '', color: COLORS[colorIdx] }]);
  };

  const removeFunction = (id: number) => {
    setFunctions((prev) => prev.filter((f) => f.id !== id));
  };

  const updateExpr = (id: number, expr: string) => {
    setFunctions((prev) => prev.map((f) => (f.id === id ? { ...f, expr } : f)));
  };

  const zoom = (factor: number) => {
    const cx = (xMin + xMax) / 2;
    const cy = (yMin + yMax) / 2;
    const hw = ((xMax - xMin) / 2) * factor;
    const hh = ((yMax - yMin) / 2) * factor;
    setXMin(cx - hw);
    setXMax(cx + hw);
    setYMin(cy - hh);
    setYMax(cy + hh);
  };

  const resetView = () => {
    setXMin(-10); setXMax(10); setYMin(-10); setYMax(10);
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    const isDark = theme.palette.mode === 'dark';
    ctx.fillStyle = isDark ? '#1e1e1e' : '#ffffff';
    ctx.fillRect(0, 0, w, h);

    const toCanvasX = (x: number) => ((x - xMin) / (xMax - xMin)) * w;
    const toCanvasY = (y: number) => h - ((y - yMin) / (yMax - yMin)) * h;

    // Grid
    ctx.strokeStyle = isDark ? alpha('#fff', 0.08) : alpha('#000', 0.08);
    ctx.lineWidth = 1;

    const gridStep = (range: number) => {
      const raw = range / 10;
      const mag = Math.pow(10, Math.floor(Math.log10(raw)));
      const norm = raw / mag;
      if (norm < 2) return mag;
      if (norm < 5) return 2 * mag;
      return 5 * mag;
    };

    const stepX = gridStep(xMax - xMin);
    const stepY = gridStep(yMax - yMin);

    const startX = Math.ceil(xMin / stepX) * stepX;
    for (let gx = startX; gx <= xMax; gx += stepX) {
      const px = toCanvasX(gx);
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, h);
      ctx.stroke();
    }

    const startY = Math.ceil(yMin / stepY) * stepY;
    for (let gy = startY; gy <= yMax; gy += stepY) {
      const py = toCanvasY(gy);
      ctx.beginPath();
      ctx.moveTo(0, py);
      ctx.lineTo(w, py);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = isDark ? alpha('#fff', 0.4) : alpha('#000', 0.4);
    ctx.lineWidth = 1.5;

    if (yMin <= 0 && yMax >= 0) {
      const y0 = toCanvasY(0);
      ctx.beginPath();
      ctx.moveTo(0, y0);
      ctx.lineTo(w, y0);
      ctx.stroke();
    }

    if (xMin <= 0 && xMax >= 0) {
      const x0 = toCanvasX(0);
      ctx.beginPath();
      ctx.moveTo(x0, 0);
      ctx.lineTo(x0, h);
      ctx.stroke();
    }

    // Tick labels
    ctx.fillStyle = isDark ? alpha('#fff', 0.6) : alpha('#000', 0.6);
    ctx.font = '11px monospace';
    ctx.textAlign = 'center';

    for (let gx = startX; gx <= xMax; gx += stepX) {
      if (Math.abs(gx) < stepX * 0.01) continue;
      const px = toCanvasX(gx);
      const label = Number(gx.toPrecision(4)).toString();
      const baseY = yMin <= 0 && yMax >= 0 ? toCanvasY(0) : h;
      ctx.fillText(label, px, Math.min(baseY + 14, h - 2));
    }

    ctx.textAlign = 'right';
    for (let gy = startY; gy <= yMax; gy += stepY) {
      if (Math.abs(gy) < stepY * 0.01) continue;
      const py = toCanvasY(gy);
      const label = Number(gy.toPrecision(4)).toString();
      const baseX = xMin <= 0 && xMax >= 0 ? toCanvasX(0) : 0;
      ctx.fillText(label, Math.max(baseX - 4, 30), py + 4);
    }

    // Functions
    functions.forEach((fn) => {
      if (!fn.expr.trim()) return;
      const compiled = compileExpr(fn.expr);
      if (!compiled) return;

      ctx.strokeStyle = fn.color;
      ctx.lineWidth = 2;
      ctx.beginPath();

      let started = false;
      const steps = w * 2;
      for (let i = 0; i <= steps; i++) {
        const x = xMin + (i / steps) * (xMax - xMin);
        const y = compiled(x);
        if (!isFinite(y) || isNaN(y)) {
          started = false;
          continue;
        }
        const px = toCanvasX(x);
        const py = toCanvasY(y);
        if (!started) {
          ctx.moveTo(px, py);
          started = true;
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.stroke();
    });
  }, [functions, xMin, xMax, yMin, yMax, theme.palette.mode]);

  useEffect(() => {
    draw();
    const handleResize = () => draw();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [draw]);

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 2,
          borderRadius: 3
        }}
      >
        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
          Поддержка: x, +, -, *, /, ^, sin, cos, tan, sqrt, abs, log, PI, E
        </Typography>

        {functions.map((fn, idx) => (
          <Box key={fn.id} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                backgroundColor: fn.color,
                flexShrink: 0
              }}
            />
            <TextField
              fullWidth
              size="small"
              label={`f${idx + 1}(x)`}
              placeholder="sin(x), x^2, 2*x+1..."
              value={fn.expr}
              onChange={(e) => updateExpr(fn.id, e.target.value)}
              slotProps={{
                htmlInput: { style: { fontFamily: 'monospace' } }
              }}
            />
            {functions.length > 1 && (
              <IconButton size="small" onClick={() => removeFunction(fn.id)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        ))}

        <Button
          size="small"
          startIcon={<AddIcon />}
          onClick={addFunction}
          sx={{ mt: 1, borderRadius: 2 }}
        >
          Добавить функцию
        </Button>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 3
        }}
      >
        <Grid container spacing={1} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 6, sm: 3 }}>
            <TextField
              fullWidth
              size="small"
              label="X мин"
              type="number"
              value={xMin}
              onChange={(e) => setXMin(parseFloat(e.target.value) || -10)}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <TextField
              fullWidth
              size="small"
              label="X макс"
              type="number"
              value={xMax}
              onChange={(e) => setXMax(parseFloat(e.target.value) || 10)}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <TextField
              fullWidth
              size="small"
              label="Y мин"
              type="number"
              value={yMin}
              onChange={(e) => setYMin(parseFloat(e.target.value) || -10)}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <TextField
              fullWidth
              size="small"
              label="Y макс"
              type="number"
              value={yMax}
              onChange={(e) => setYMax(parseFloat(e.target.value) || 10)}
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
          <Button size="small" variant="outlined" startIcon={<ZoomInIcon />} onClick={() => zoom(0.5)} sx={{ borderRadius: 2 }}>
            Приблизить
          </Button>
          <Button size="small" variant="outlined" startIcon={<ZoomOutIcon />} onClick={() => zoom(2)} sx={{ borderRadius: 2 }}>
            Отдалить
          </Button>
          <Button size="small" variant="outlined" startIcon={<RestartAltIcon />} onClick={resetView} sx={{ borderRadius: 2 }}>
            Сброс
          </Button>
        </Box>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          overflow: 'hidden'
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: 500,
            display: 'block'
          }}
        />
      </Paper>
    </Box>
  );
}
