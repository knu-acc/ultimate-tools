'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Box, Typography, Paper, Grid, Button, Chip, TextField, alpha, useTheme
} from '@mui/material';
import { Casino } from '@mui/icons-material';

const WHEEL_COLORS = [
  '#E53935', '#1E88E5', '#43A047', '#FB8C00',
  '#8E24AA', '#00ACC1', '#F4511E', '#3949AB',
  '#7CB342', '#D81B60', '#00897B', '#6D4C41',
];

const DEFAULT_ITEMS = 'Вариант 1\nВариант 2\nВариант 3\nВариант 4';

export default function WheelSpinner() {
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState(DEFAULT_ITEMS);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [rotation, setRotation] = useState(0);
  const animRef = useRef<number>(0);
  const speedRef = useRef(0);

  const getItems = useCallback(() => {
    return text.split('\n').map(s => s.trim()).filter(Boolean);
  }, [text]);

  const drawWheel = useCallback((angle: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const items = getItems();
    if (items.length === 0) return;

    const size = canvas.width;
    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2 - 8;

    ctx.clearRect(0, 0, size, size);

    const sliceAngle = (2 * Math.PI) / items.length;

    items.forEach((item, i) => {
      const startAngle = angle + i * sliceAngle;
      const endAngle = startAngle + sliceAngle;

      // Sector
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = WHEEL_COLORS[i % WHEEL_COLORS.length];
      ctx.fill();

      // Border
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Text
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.font = `bold ${Math.max(11, Math.min(16, 200 / items.length))}px sans-serif`;
      const label = item.length > 18 ? item.slice(0, 16) + '...' : item;
      ctx.fillText(label, r - 14, 5);
      ctx.restore();
    });

    // Center circle
    ctx.beginPath();
    ctx.arc(cx, cy, 22, 0, 2 * Math.PI);
    ctx.fillStyle = theme.palette.mode === 'dark' ? '#333' : '#fff';
    ctx.fill();
    ctx.strokeStyle = theme.palette.divider;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Pointer (triangle at the right)
    ctx.beginPath();
    ctx.moveTo(size - 4, cy - 16);
    ctx.lineTo(size - 4, cy + 16);
    ctx.lineTo(size - 28, cy);
    ctx.closePath();
    ctx.fillStyle = theme.palette.error.main;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [getItems, theme]);

  useEffect(() => {
    drawWheel(rotation);
  }, [rotation, drawWheel, text]);

  const spin = useCallback(() => {
    const items = getItems();
    if (items.length < 2 || spinning) return;

    setSpinning(true);
    setResult(null);

    const totalRotation = rotation + Math.PI * 2 * (8 + Math.random() * 6) + Math.random() * Math.PI * 2;
    const duration = 4000;
    const startTime = performance.now();
    const startRotation = rotation;

    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOut(progress);
      const currentAngle = startRotation + (totalRotation - startRotation) * easedProgress;

      setRotation(currentAngle);
      drawWheel(currentAngle);

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        setRotation(currentAngle);
        // Determine winner
        const sliceAngle = (2 * Math.PI) / items.length;
        const normalizedAngle = ((-(currentAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI));
        const winnerIndex = Math.floor(normalizedAngle / sliceAngle) % items.length;
        const winner = items[winnerIndex];
        setResult(winner);
        setHistory(prev => [winner, ...prev].slice(0, 30));
        setSpinning(false);
      }
    };

    animRef.current = requestAnimationFrame(animate);
  }, [getItems, spinning, rotation, drawWheel]);

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  const items = getItems();

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Элементы (по одному на строку)
          </Typography>
          <TextField
            multiline
            minRows={5}
            maxRows={10}
            fullWidth
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Введите варианты..."
            disabled={spinning}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': { borderRadius: 3 }
            }}
          />

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Вариантов: {items.length}
          </Typography>

          <Button
            variant="contained"
            fullWidth
            size="large"
            startIcon={<Casino />}
            onClick={spin}
            disabled={spinning || items.length < 2}
            sx={{ borderRadius: 6, py: 1.2 }}
          >
            {spinning ? 'Кручу...' : 'Крутить колесо'}
          </Button>

          {items.length < 2 && (
            <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
              Нужно минимум 2 варианта
            </Typography>
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          {/* Wheel */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <canvas
              ref={canvasRef}
              width={340}
              height={340}
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </Box>

          {/* Result */}
          {result && (
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                bgcolor: alpha(theme.palette.success.main, 0.08),
                textAlign: 'center',
                mb: 2
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Результат
              </Typography>
              <Typography variant="h4" fontWeight={700} color="success.main">
                {result}
              </Typography>
            </Paper>
          )}

          {!result && !spinning && (
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: theme.palette.surfaceContainerLow,
                textAlign: 'center'
              }}
            >
              <Casino sx={{ fontSize: 40, color: theme.palette.text.secondary, mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Нажмите «Крутить колесо» для начала
              </Typography>
            </Paper>
          )}

          {/* History */}
          {history.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                История ({history.length})
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                {history.map((h, i) => (
                  <Chip
                    key={i}
                    label={h}
                    size="small"
                    sx={{
                      fontWeight: i === 0 ? 700 : 400,
                      bgcolor: i === 0
                        ? alpha(theme.palette.success.main, 0.15)
                        : theme.palette.surfaceContainerLow
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
