'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, TextField, Button, Paper, Grid, Slider,
  useTheme, alpha
} from '@mui/material';
import { Download } from '@mui/icons-material';
import { CopyButton } from '@/src/components/CopyButton';
import ColorPickerInput from '@/src/components/ColorPickerInput';
import { useLanguage } from '@/src/i18n/LanguageContext';


import { generateQR } from './qrcore';

function generateQRMatrix(text: string): boolean[][] {
  return generateQR(text);
}

export default function QrGenerator() {
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState('https://ulti-tools.com');
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const { locale } = useLanguage();
  const isEn = locale === 'en';

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
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              mb: 2,
              borderRadius: 3,
              bgcolor: theme.palette.surfaceContainerLow,
              transition: 'all 200ms ease',
              '&:hover': { background: alpha(theme.palette.primary.main, 0.04) }
            }}
          >
            <TextField
              fullWidth
              multiline
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={isEn ? 'Enter text or URL...' : 'Введите текст или URL...'}
              sx={{ mb: 2 }}
            />

            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              {isEn ? 'Size' : 'Размер'}: {size}px
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
                <Typography variant="caption" color="text.secondary">{isEn ? 'QR color' : 'Цвет QR'}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <ColorPickerInput value={fgColor} onChange={setFgColor} label={isEn ? 'QR color' : 'Цвет QR'} size="small" />
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{fgColor}</Typography>
                </Box>
              </Grid>
              <Grid size={6}>
                <Typography variant="caption" color="text.secondary">{isEn ? 'Background color' : 'Цвет фона'}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <ColorPickerInput value={bgColor} onChange={setBgColor} label={isEn ? 'Background color' : 'Цвет фона'} size="small" />
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{bgColor}</Typography>
                </Box>
              </Grid>
            </Grid>

            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
              {isEn
                ? 'The generator creates fully scannable QR codes compliant with ISO 18004.'
                : 'Генератор создаёт полноценные сканируемые QR-коды стандарта ISO 18004.'}
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 3,
              bgcolor: theme.palette.surfaceContainerLow,
              textAlign: 'center',
              transition: 'all 200ms ease',
              '&:hover': { background: alpha(theme.palette.primary.main, 0.04) }
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
                {isEn ? 'Download PNG' : 'Скачать PNG'}
              </Button>
              <CopyButton text={text} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
