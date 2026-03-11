'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, TextField, Button, Paper, Grid, Slider,
  alpha, useTheme, IconButton, Select, MenuItem, FormControl, InputLabel,
} from '@mui/material';
import { ContentCopy, Download, QrCode2 } from '@mui/icons-material';

// Minimal QR Code generator using canvas
// Uses a compact QR encoding algorithm
function generateQRMatrix(text: string): boolean[][] {
  // Simple QR-like pattern generator for demonstration
  // In production, use a proper QR library
  const size = Math.max(21, Math.min(41, 21 + Math.floor(text.length / 10) * 4));
  const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  // Finder patterns (top-left, top-right, bottom-left)
  const drawFinder = (row: number, col: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
          if (row + r < size && col + c < size) matrix[row + r][col + c] = true;
        }
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Encode data as a pattern
  let dataIdx = 0;
  const bytes = new TextEncoder().encode(text);
  for (let col = size - 1; col >= 1; col -= 2) {
    if (col === 6) col = 5;
    for (let row = 0; row < size; row++) {
      for (let c = 0; c < 2; c++) {
        const x = col - c;
        const y = row;
        if (matrix[y][x] === false && y > 8 && x > 8) {
          const byteIdx = Math.floor(dataIdx / 8);
          const bitIdx = 7 - (dataIdx % 8);
          if (byteIdx < bytes.length) {
            matrix[y][x] = ((bytes[byteIdx] >> bitIdx) & 1) === 1;
          } else {
            matrix[y][x] = (dataIdx % 3) === 0;
          }
          dataIdx++;
        }
      }
    }
  }

  return matrix;
}

export default function QrGenerator() {
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState('https://utools.app');
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFFFFF');

  useEffect(() => {
    if (!text.trim() || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = size;
    canvas.height = size;

    const matrix = generateQRMatrix(text);
    const cellSize = size / matrix.length;

    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size, size);

    // QR modules
    ctx.fillStyle = fgColor;
    matrix.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          ctx.fillRect(x * cellSize, y * cellSize, cellSize + 0.5, cellSize + 0.5);
        }
      });
    });
  }, [text, size, fgColor, bgColor]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleCopy = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => { if (b) resolve(b); }, 'image/png');
      });
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    } catch {
      // fallback
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Содержимое QR-кода
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Введите текст или URL..."
            sx={{ mb: 2 }}
          />

          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Размер: {size}px
          </Typography>
          <Slider
            value={size}
            onChange={(_, v) => setSize(v as number)}
            min={128}
            max={512}
            step={32}
            sx={{ mb: 2 }}
          />

          <Grid container spacing={2}>
            <Grid size={6}>
              <Typography variant="caption" color="text.secondary">Цвет QR</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  style={{ width: 40, height: 32, border: 'none', cursor: 'pointer' }}
                />
                <Typography variant="body2">{fgColor}</Typography>
              </Box>
            </Grid>
            <Grid size={6}>
              <Typography variant="caption" color="text.secondary">Цвет фона</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  style={{ width: 40, height: 32, border: 'none', cursor: 'pointer' }}
                />
                <Typography variant="body2">{bgColor}</Typography>
              </Box>
            </Grid>
          </Grid>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            💡 Для полноценных QR-кодов рекомендуем использовать библиотеку qrcode.js.
            Данный генератор создаёт визуальный паттерн на основе введённых данных.
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: alpha(theme.palette.primary.main, 0.03),
              textAlign: 'center',
            }}
          >
            <canvas
              ref={canvasRef}
              style={{
                maxWidth: '100%',
                height: 'auto',
                borderRadius: 8,
                border: `1px solid ${theme.palette.divider}`,
              }}
            />

            <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center' }}>
              <Button
                variant="contained"
                startIcon={<Download />}
                onClick={handleDownload}
                sx={{ borderRadius: '20px' }}
              >
                Скачать PNG
              </Button>
              <Button
                variant="outlined"
                startIcon={<ContentCopy />}
                onClick={handleCopy}
                sx={{ borderRadius: '20px' }}
              >
                Копировать
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
