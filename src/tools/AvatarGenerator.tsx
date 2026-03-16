'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box, Typography, Paper, Grid, Button, Chip, TextField, alpha, useTheme
} from '@mui/material';
import { Download, Refresh } from '@mui/icons-material';
import { useLanguage } from '@/src/i18n/LanguageContext';

type AvatarStyle = 'geometric' | 'pixel' | 'gradient';

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function hashToColor(hash: number): string {
  const h = hash % 360;
  const s = 55 + (hash % 30);
  const l = 45 + (hash % 20);
  return `hsl(${h}, ${s}%, ${l}%)`;
}

function hashToSecondaryColor(hash: number): string {
  const h = (hash + 120) % 360;
  const s = 50 + (hash % 25);
  const l = 50 + (hash % 20);
  return `hsl(${h}, ${s}%, ${l}%)`;
}

function drawGeometric(ctx: CanvasRenderingContext2D, size: number, seed: string, bgWhite: boolean) {
  const hash = hashString(seed);
  const color = hashToColor(hash);

  if (bgWhite) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
  } else {
    ctx.clearRect(0, 0, size, size);
  }

  const gridSize = 5;
  const cellSize = size / gridSize;
  const cells: boolean[][] = [];

  for (let row = 0; row < gridSize; row++) {
    cells[row] = [];
    for (let col = 0; col < gridSize; col++) {
      if (col <= 2) {
        const bitIndex = row * 3 + col;
        const pseudoRandom = hashString(seed + String(bitIndex));
        cells[row][col] = pseudoRandom % 3 !== 0;
      } else {
        cells[row][col] = cells[row][gridSize - 1 - col];
      }
    }
  }

  ctx.fillStyle = color;
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (cells[row][col]) {
        const x = col * cellSize;
        const y = row * cellSize;
        ctx.beginPath();
        ctx.roundRect(x + 1, y + 1, cellSize - 2, cellSize - 2, cellSize * 0.15);
        ctx.fill();
      }
    }
  }
}

function drawPixel(ctx: CanvasRenderingContext2D, size: number, seed: string, bgWhite: boolean) {
  const hash = hashString(seed);
  const color = hashToColor(hash);

  if (bgWhite) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
  } else {
    ctx.clearRect(0, 0, size, size);
  }

  const gridSize = 5;
  const cellSize = size / gridSize;

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col <= 2; col++) {
      const bitIndex = row * 3 + col;
      const pseudoRandom = hashString(seed + String(bitIndex));
      if (pseudoRandom % 3 !== 0) {
        ctx.fillStyle = color;
        ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
        ctx.fillRect((gridSize - 1 - col) * cellSize, row * cellSize, cellSize, cellSize);
      }
    }
  }
}

function drawGradient(ctx: CanvasRenderingContext2D, size: number, seed: string, bgWhite: boolean) {
  const hash = hashString(seed);
  const color1 = hashToColor(hash);
  const color2 = hashToSecondaryColor(hash);

  if (bgWhite) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
  } else {
    ctx.clearRect(0, 0, size, size);
  }

  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.42;

  const gradient = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.3, 0, cx, cy, radius);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();

  const gridSize = 5;
  const patternSize = size * 0.6;
  const cellSize = patternSize / gridSize;
  const offsetX = (size - patternSize) / 2;
  const offsetY = (size - patternSize) / 2;

  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col <= 2; col++) {
      const bitIndex = row * 3 + col;
      const pseudoRandom = hashString(seed + String(bitIndex));
      if (pseudoRandom % 3 !== 0) {
        const x = offsetX + col * cellSize;
        const y = offsetY + row * cellSize;
        ctx.beginPath();
        ctx.roundRect(x + 1, y + 1, cellSize - 2, cellSize - 2, cellSize * 0.2);
        ctx.fill();
        const mx = offsetX + (gridSize - 1 - col) * cellSize;
        ctx.beginPath();
        ctx.roundRect(mx + 1, y + 1, cellSize - 2, cellSize - 2, cellSize * 0.2);
        ctx.fill();
      }
    }
  }
}

export default function AvatarGenerator() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [seed, setSeed] = useState('Привет мир');
  const [size, setSize] = useState(256);
  const [style, setStyle] = useState<AvatarStyle>('geometric');
  const [bgWhite, setBgWhite] = useState(true);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = size;
    canvas.height = size;

    const input = seed.trim() || 'default';

    switch (style) {
      case 'geometric':
        drawGeometric(ctx, size, input, bgWhite);
        break;
      case 'pixel':
        drawPixel(ctx, size, input, bgWhite);
        break;
      case 'gradient':
        drawGradient(ctx, size, input, bgWhite);
        break;
    }
  }, [seed, size, style, bgWhite]);

  useEffect(() => {
    render();
  }, [render]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `avatar-${seed.trim().replace(/\s+/g, '-') || 'identicon'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleRandomSeed = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setSeed(result);
  };

  const sizeOptions = [64, 128, 256, 512];
  const styleOptions: { value: AvatarStyle; label: string }[] = [
    { value: 'geometric', label: isEn ? 'Geometric' : 'Геометрический' },
    { value: 'pixel', label: isEn ? 'Pixel' : 'Пиксельный' },
    { value: 'gradient', label: isEn ? 'Gradient' : 'Градиент' },
  ];

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: { xs: 2, sm: 3 } }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              fullWidth
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              placeholder={isEn ? 'Text (seed)...' : 'Текст (seed)...'}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 18 } }}
              slotProps={{
                input: {
                  endAdornment: (
                    <Button size="small" onClick={handleRandomSeed} sx={{ minWidth: 36 }}>
                      <Refresh fontSize="small" />
                    </Button>
                  )
                }
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            {styleOptions.map(opt => (
              <Chip
                key={opt.value}
                label={opt.label}
                onClick={() => setStyle(opt.value)}
                variant={style === opt.value ? 'filled' : 'outlined'}
                color={style === opt.value ? 'primary' : 'default'}
                sx={{ fontWeight: 600, cursor: 'pointer' }}
              />
            ))}
          </Box>

          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            {sizeOptions.map(s => (
              <Chip
                key={s}
                label={`${s}px`}
                onClick={() => setSize(s)}
                variant={size === s ? 'filled' : 'outlined'}
                color={size === s ? 'primary' : 'default'}
                sx={{ fontWeight: 600, cursor: 'pointer' }}
              />
            ))}
          </Box>

          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Chip
              label={isEn ? 'White background' : 'Белый фон'}
              onClick={() => setBgWhite(true)}
              variant={bgWhite ? 'filled' : 'outlined'}
              color={bgWhite ? 'primary' : 'default'}
              sx={{ fontWeight: 600, cursor: 'pointer' }}
            />
            <Chip
              label={isEn ? 'Transparent' : 'Прозрачный'}
              onClick={() => setBgWhite(false)}
              variant={!bgWhite ? 'filled' : 'outlined'}
              color={!bgWhite ? 'primary' : 'default'}
              sx={{ fontWeight: 600, cursor: 'pointer' }}
            />
          </Box>

          <Button
            variant="contained"
            fullWidth
            size="large"
            startIcon={<Download />}
            onClick={handleDownload}
            sx={{ borderRadius: 18, py: 1.2, textTransform: 'none', fontWeight: 600 }}
          >
            {isEn ? 'Download PNG' : 'Скачать PNG'}
          </Button>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 18,
              bgcolor: theme.palette.surfaceContainerLow,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              '&:hover': { background: alpha(theme.palette.primary.main, 0.04) }
            }}
          >
            <canvas
              ref={canvasRef}
              style={{
                maxWidth: '100%',
                height: 'auto',
                borderRadius: 18,
                background: !bgWhite
                  ? `repeating-conic-gradient(${alpha(theme.palette.text.primary, 0.08)} 0% 25%, transparent 0% 50%) 50% / 16px 16px`
                  : undefined
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
              {size} x {size} px | {styleOptions.find(s => s.value === style)?.label}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
