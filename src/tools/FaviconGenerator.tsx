'use client';

import { useState, useCallback } from 'react';
import {
  Box, Typography, Paper, TextField, Grid, Button, Slider, useTheme, alpha
} from '@mui/material';
import { Download } from '@mui/icons-material';

export default function FaviconGenerator() {
  const theme = useTheme();
  const [text, setText] = useState('U');
  const [bgColor, setBgColor] = useState('#6750A4');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [fontSize, setFontSize] = useState(60);
  const [borderRadius, setBorderRadius] = useState(20);
  const drawFavicon = useCallback((size: number): string => {
    if (typeof document === 'undefined') return '';
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Background
    const r = (borderRadius / 100) * size;
    ctx.beginPath();
    ctx.roundRect(0, 0, size, size, r);
    ctx.fillStyle = bgColor;
    ctx.fill();

    // Text
    ctx.fillStyle = textColor;
    ctx.font = `bold ${(fontSize / 100) * size}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text.slice(0, 3), size / 2, size / 2 + (size * 0.03));

    return canvas.toDataURL('image/png');
  }, [text, bgColor, textColor, fontSize, borderRadius]);

  const download = (size: number) => {
    const url = drawFavicon(size);
    const a = document.createElement('a');
    a.href = url;
    a.download = `favicon-${size}x${size}.png`;
    a.click();
  };

  const sizes = [16, 32, 48, 64, 128, 256, 512];

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, mb: 2, borderRadius: 3 }}>
            <TextField fullWidth value={text} onChange={e => setText(e.target.value.slice(0, 3))} placeholder="U" label="Текст (1-3)" size="small" sx={{ mb: 2 }} />

            <Grid container spacing={1} sx={{ mb: 2 }}>
              <Grid size={6}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} style={{ width: 40, height: 32, border: 'none', cursor: 'pointer' }} />
                  <TextField size="small" value={bgColor} onChange={e => setBgColor(e.target.value)} placeholder="#6750A4" sx={{ flex: 1, '& .MuiOutlinedInput-root': { fontFamily: 'monospace' } }} />
                </Box>
              </Grid>
              <Grid size={6}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} style={{ width: 40, height: 32, border: 'none', cursor: 'pointer' }} />
                  <TextField size="small" value={textColor} onChange={e => setTextColor(e.target.value)} placeholder="#FFFFFF" sx={{ flex: 1, '& .MuiOutlinedInput-root': { fontFamily: 'monospace' } }} />
                </Box>
              </Grid>
            </Grid>

            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>Размер шрифта: {fontSize}%</Typography>
            <Slider value={fontSize} onChange={(_, v) => setFontSize(v as number)} min={20} max={90} sx={{ mb: 1 }} />

            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>Скругление: {borderRadius}%</Typography>
            <Slider value={borderRadius} onChange={(_, v) => setBorderRadius(v as number)} min={0} max={50} />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, textAlign: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', alignItems: 'end', flexWrap: 'wrap', mb: 2 }}>
              {[16, 32, 64, 128].map(size => (
                <Box key={size} sx={{ textAlign: 'center' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={drawFavicon(size)} alt={`${size}px`} width={size} height={size} style={{ imageRendering: size <= 32 ? 'pixelated' : 'auto' }} />
                  <Typography variant="caption" display="block" color="text.secondary">{size}px</Typography>
                </Box>
              ))}
            </Box>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
              {sizes.map(size => (
                <Button
                  key={size}
                  variant="outlined"
                  size="small"
                  startIcon={<Download />}
                  onClick={() => download(size)}
                  sx={{
                    borderRadius: 5,
                    transition: 'background-color 200ms',
                    '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.04) }
                  }}
                >
                  {size}x{size}
                </Button>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
