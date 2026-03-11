'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, TextField, Button, Paper, Grid, Slider,
  useTheme, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { Download, QrCode2 } from '@mui/icons-material';
import { CopyButton } from '@/src/components/CopyButton';


import { generateQR } from './qrcore';

function generateQRMatrix(text: string): boolean[][] {
  return generateQR(text);
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
            Генератор создаёт полноценные сканируемые QR-коды стандарта ISO 18004.
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: theme.palette.surfaceContainerLow,
              textAlign: 'center'
            }}
          >
            <canvas
              ref={canvasRef}
              style={{
                maxWidth: '100%',
                height: 'auto',
                borderRadius: 8
              }}
            />

            <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center' }}>
              <Button
                variant="contained"
                startIcon={<Download />}
                onClick={handleDownload}
                sx={{ borderRadius: 5 }}
              >
                Скачать PNG
              </Button>
              <CopyButton text={text} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
