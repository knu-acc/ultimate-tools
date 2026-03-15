'use client';

import { useState } from 'react';
import {
  Box, Typography, Paper, Grid, Button, Chip, Slider, useTheme, TextField,
  ToggleButton, ToggleButtonGroup, alpha
} from '@mui/material';
import { Refresh, Add } from '@mui/icons-material';
import { CopyButton } from '@/src/components/CopyButton';
import ColorPickerInput from '@/src/components/ColorPickerInput';

export default function GradientGenerator() {
  const theme = useTheme();
  const [colors, setColors] = useState(['#6750A4', '#D0BCFF']);
  const [angle, setAngle] = useState(135);
  const [type, setType] = useState<'linear' | 'radial'>('linear');
  const gradientCSS = type === 'linear'
    ? `linear-gradient(${angle}deg, ${colors.join(', ')})`
    : `radial-gradient(circle, ${colors.join(', ')})`;

  const cssCode = `background: ${gradientCSS};`;

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
    <Box sx={{ maxWidth: 800, mx: 'auto', p: { xs: 2, sm: 3 } }}>
      {/* Preview */}
      <Box
        sx={{
          width: '100%',
          height: { xs: 150, md: 200 },
          borderRadius: 3,
          background: gradientCSS,
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography
          sx={{
            color: '#fff',
            fontWeight: 700,
            fontSize: { xs: '0.9rem', md: '1.1rem' },
            textShadow: '0 1px 4px rgba(0,0,0,0.3)'
          }}
        >
          {gradientCSS.substring(0, 50)}...
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
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

          {type === 'linear' && (
            <>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', mb: 1 }}>
                  Угол: {angle}°
                </Typography>
                <Slider
                  value={angle}
                  onChange={(_, v) => setAngle(v as number)}
                  min={0}
                  max={360}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 0.5, mb: 2, flexWrap: 'wrap' }}>
                {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
                  <Chip
                    key={a}
                    label={`${a}°`}
                    size="small"
                    onClick={() => setAngle(a)}
                    variant={angle === a ? 'filled' : 'outlined'}
                    color={angle === a ? 'primary' : 'default'}
                    sx={{ cursor: 'pointer', fontWeight: angle === a ? 700 : 400 }}
                  />
                ))}
              </Box>
            </>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
            {colors.map((color, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ColorPickerInput
                  value={color}
                  onChange={(hex) => {
                    const newColors = [...colors];
                    newColors[i] = hex;
                    setColors(newColors);
                  }}
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
                    label="x"
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
              <Button size="small" startIcon={<Add />} onClick={addColor} sx={{ borderRadius: 3 }}>
                Добавить цвет
              </Button>
            )}
            <Button size="small" startIcon={<Refresh />} onClick={randomize} sx={{ borderRadius: 3 }}>
              Случайный
            </Button>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Grid container spacing={1} sx={{ mb: 2 }}>
            {presets.map((preset) => (
              <Grid key={preset.name} size={4}>
                <Paper
                  elevation={0}
                  onClick={() => setColors([...preset.colors])}
                  sx={{
                    height: 56,
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${preset.colors.join(', ')})`,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-end',
                    p: 1,
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.05)' }
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                    {preset.name}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 3,
              bgcolor: theme.palette.surfaceContainerLow,
              '&:hover': { background: alpha(theme.palette.primary.main, 0.04) }
            }}
          >
            <Typography
              sx={{
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                wordBreak: 'break-all',
                mb: 1
              }}
            >
              {cssCode}
            </Typography>
            <CopyButton text={cssCode} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
