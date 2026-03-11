'use client';

import React, { useState } from 'react';
import {
  Box, Typography, Paper, Grid, Button, Chip, Slider, alpha, useTheme, IconButton, TextField,
  ToggleButton, ToggleButtonGroup,
} from '@mui/material';
import { ContentCopy, Refresh, Add } from '@mui/icons-material';

export default function GradientGenerator() {
  const theme = useTheme();
  const [colors, setColors] = useState(['#6750A4', '#D0BCFF']);
  const [angle, setAngle] = useState(135);
  const [type, setType] = useState<'linear' | 'radial'>('linear');
  const [copied, setCopied] = useState(false);

  const gradientCSS = type === 'linear'
    ? `linear-gradient(${angle}deg, ${colors.join(', ')})`
    : `radial-gradient(circle, ${colors.join(', ')})`;

  const cssCode = `background: ${gradientCSS};`;

  const copyCSS = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const randomize = () => {
    const randomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    setColors([randomColor(), randomColor()]);
    setAngle(Math.floor(Math.random() * 360));
  };

  const addColor = () => {
    if (colors.length < 5) {
      const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
      setColors([...colors, randomColor]);
    }
  };

  const removeColor = (index: number) => {
    if (colors.length > 2) {
      setColors(colors.filter((_, i) => i !== index));
    }
  };

  const presets = [
    { name: 'Закат', colors: ['#FF6B6B', '#FFA07A', '#FFD700'] },
    { name: 'Океан', colors: ['#0077B6', '#00B4D8', '#90E0EF'] },
    { name: 'Лес', colors: ['#2D6A4F', '#52B788', '#B7E4C7'] },
    { name: 'Фиолетовый', colors: ['#7B2FF7', '#C084FC', '#F0ABFC'] },
    { name: 'Огонь', colors: ['#DC2626', '#F97316', '#FACC15'] },
    { name: 'Ночь', colors: ['#1E1B4B', '#312E81', '#4338CA'] },
  ];

  return (
    <Box>
      {/* Preview */}
      <Box
        sx={{
          width: '100%',
          height: { xs: 150, md: 200 },
          borderRadius: 3,
          background: gradientCSS,
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          sx={{
            color: '#fff',
            fontWeight: 700,
            fontSize: { xs: '0.9rem', md: '1.1rem' },
            textShadow: '0 1px 4px rgba(0,0,0,0.3)',
          }}
        >
          {gradientCSS.substring(0, 50)}...
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          {/* Type */}
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>Тип градиента</Typography>
          <ToggleButtonGroup
            value={type}
            exclusive
            onChange={(_, v) => v && setType(v)}
            size="small"
            sx={{ mb: 2 }}
          >
            <ToggleButton value="linear" sx={{ borderRadius: '16px 0 0 16px', px: 3 }}>Линейный</ToggleButton>
            <ToggleButton value="radial" sx={{ borderRadius: '0 16px 16px 0', px: 3 }}>Радиальный</ToggleButton>
          </ToggleButtonGroup>

          {/* Angle (only for linear) */}
          {type === 'linear' && (
            <>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Угол: {angle}°
              </Typography>
              <Slider
                value={angle}
                onChange={(_, v) => setAngle(v as number)}
                min={0}
                max={360}
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: 'flex', gap: 0.5, mb: 2 }}>
                {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
                  <Chip
                    key={a}
                    label={`${a}°`}
                    size="small"
                    onClick={() => setAngle(a)}
                    sx={{
                      cursor: 'pointer',
                      fontWeight: angle === a ? 700 : 400,
                      bgcolor: angle === a
                        ? alpha(theme.palette.primary.main, 0.12)
                        : alpha(theme.palette.primary.main, 0.04),
                    }}
                  />
                ))}
              </Box>
            </>
          )}

          {/* Colors */}
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>Цвета</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
            {colors.map((color, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => {
                    const newColors = [...colors];
                    newColors[i] = e.target.value;
                    setColors(newColors);
                  }}
                  style={{ width: 40, height: 32, border: 'none', cursor: 'pointer', borderRadius: 4 }}
                />
                <TextField
                  size="small"
                  value={color}
                  onChange={(e) => {
                    const newColors = [...colors];
                    newColors[i] = e.target.value;
                    setColors(newColors);
                  }}
                  sx={{ flex: 1, '& .MuiOutlinedInput-root': { fontFamily: 'monospace' } }}
                />
                {colors.length > 2 && (
                  <Chip
                    label="×"
                    size="small"
                    onClick={() => removeColor(i)}
                    sx={{ cursor: 'pointer', minWidth: 28 }}
                  />
                )}
              </Box>
            ))}
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {colors.length < 5 && (
              <Button size="small" startIcon={<Add />} onClick={addColor} sx={{ borderRadius: '16px' }}>
                Добавить цвет
              </Button>
            )}
            <Button size="small" startIcon={<Refresh />} onClick={randomize} sx={{ borderRadius: '16px' }}>
              Случайный
            </Button>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          {/* Presets */}
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>Пресеты</Typography>
          <Grid container spacing={1} sx={{ mb: 3 }}>
            {presets.map((preset) => (
              <Grid key={preset.name} size={4}>
                <Paper
                  elevation={0}
                  onClick={() => setColors([...preset.colors])}
                  sx={{
                    height: 56,
                    borderRadius: 2,
                    background: `linear-gradient(135deg, ${preset.colors.join(', ')})`,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-end',
                    p: 1,
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.05)' },
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                    {preset.name}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* CSS Output */}
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>CSS код</Typography>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.04),
              fontFamily: 'monospace',
              fontSize: '0.85rem',
            }}
          >
            <Typography sx={{ fontFamily: 'monospace', fontSize: '0.85rem', wordBreak: 'break-all' }}>
              {cssCode}
            </Typography>
          </Paper>
          <Button
            size="small"
            startIcon={<ContentCopy />}
            onClick={copyCSS}
            sx={{ mt: 1, borderRadius: '16px' }}
          >
            {copied ? 'Скопировано!' : 'Копировать CSS'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
