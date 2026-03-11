'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Grid,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
  alpha
} from '@mui/material';

type Gender = 'male' | 'female';

interface Category {
  label: string;
  min: number;
  max: number;
  color: string;
}

const MALE_CATEGORIES: Category[] = [
  { label: 'Необходимый жир', min: 0, max: 6, color: '#1565c0' },
  { label: 'Атлеты', min: 6, max: 14, color: '#2e7d32' },
  { label: 'Фитнес', min: 14, max: 18, color: '#558b2f' },
  { label: 'Средний уровень', min: 18, max: 25, color: '#f9a825' },
  { label: 'Избыточный жир', min: 25, max: 100, color: '#c62828' },
];

const FEMALE_CATEGORIES: Category[] = [
  { label: 'Необходимый жир', min: 0, max: 14, color: '#1565c0' },
  { label: 'Атлеты', min: 14, max: 21, color: '#2e7d32' },
  { label: 'Фитнес', min: 21, max: 25, color: '#558b2f' },
  { label: 'Средний уровень', min: 25, max: 32, color: '#f9a825' },
  { label: 'Избыточный жир', min: 32, max: 100, color: '#c62828' },
];

export default function BodyFat() {
  const theme = useTheme();
  const [gender, setGender] = useState<Gender>('male');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [neck, setNeck] = useState('');
  const [waist, setWaist] = useState('');
  const [hip, setHip] = useState('');

  const handleGender = (_: React.MouseEvent<HTMLElement>, val: Gender | null) => {
    if (val !== null) setGender(val);
  };

  const results = useMemo(() => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    const n = parseFloat(neck);
    const wa = parseFloat(waist);

    if (isNaN(h) || isNaN(w) || isNaN(n) || isNaN(wa) || h <= 0 || w <= 0 || n <= 0 || wa <= 0) {
      return null;
    }

    let bodyFatPct: number;
    let formulaSteps: string[];

    if (gender === 'male') {
      // US Navy Men: 86.010 * log10(waist - neck) - 70.041 * log10(height) + 36.76
      const diff = wa - n;
      if (diff <= 0) return null;

      bodyFatPct = 86.010 * Math.log10(diff) - 70.041 * Math.log10(h) + 36.76;
      formulaSteps = [
        `Талия - Шея = ${wa} - ${n} = ${diff.toFixed(1)} см`,
        `86.010 × log10(${diff.toFixed(1)}) = ${(86.010 * Math.log10(diff)).toFixed(2)}`,
        `70.041 × log10(${h}) = ${(70.041 * Math.log10(h)).toFixed(2)}`,
        `Результат: ${(86.010 * Math.log10(diff)).toFixed(2)} - ${(70.041 * Math.log10(h)).toFixed(2)} + 36.76 = ${bodyFatPct.toFixed(1)}%`,
      ];
    } else {
      const hi = parseFloat(hip);
      if (isNaN(hi) || hi <= 0) return null;

      // US Navy Women: 163.205 * log10(waist + hip - neck) - 97.684 * log10(height) - 78.387
      const sum = wa + hi - n;
      if (sum <= 0) return null;

      bodyFatPct = 163.205 * Math.log10(sum) - 97.684 * Math.log10(h) - 78.387;
      formulaSteps = [
        `Талия + Бёдра - Шея = ${wa} + ${hi} - ${n} = ${sum.toFixed(1)} см`,
        `163.205 × log10(${sum.toFixed(1)}) = ${(163.205 * Math.log10(sum)).toFixed(2)}`,
        `97.684 × log10(${h}) = ${(97.684 * Math.log10(h)).toFixed(2)}`,
        `Результат: ${(163.205 * Math.log10(sum)).toFixed(2)} - ${(97.684 * Math.log10(h)).toFixed(2)} - 78.387 = ${bodyFatPct.toFixed(1)}%`,
      ];
    }

    bodyFatPct = Math.max(0, bodyFatPct);

    const fatMass = w * (bodyFatPct / 100);
    const leanMass = w - fatMass;

    const categories = gender === 'male' ? MALE_CATEGORIES : FEMALE_CATEGORIES;
    const category = categories.find((c) => bodyFatPct >= c.min && bodyFatPct < c.max) || categories[categories.length - 1];

    return { bodyFatPct, fatMass, leanMass, category, categories, formulaSteps };
  }, [gender, weight, height, neck, waist, hip]);

  const formatNum = (n: number) =>
    n.toLocaleString('ru-RU', { maximumFractionDigits: 1 });

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto' }}>
      {/* Input */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: theme.palette.surfaceContainerLowest
        }}
      >
        <Typography variant="body2" sx={{ mb: 2, fontWeight: 500, color: 'text.secondary' }}>
          Введите параметры (метод ВМС США)
        </Typography>

        {/* Gender toggle */}
        <Box sx={{ mb: 2.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', mb: 1 }}>
            Пол
          </Typography>
          <ToggleButtonGroup
            value={gender}
            exclusive
            onChange={handleGender}
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                px: 3,
                py: 1,
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 2,
                '&.Mui-selected': {
                  background: theme.palette.surfaceContainerHigh,
                  color: theme.palette.primary.main,
                  '&:hover': {
                    background: alpha(theme.palette.primary.main, 0.18)
                  }
                }
              }
            }}
          >
            <ToggleButton value="male">Мужчина</ToggleButton>
            <ToggleButton value="female">Женщина</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Вес (кг)"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="70"
              slotProps={{
                input: { inputProps: { min: 20, max: 400, step: 0.1 } }
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Рост (см)"
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="175"
              slotProps={{
                input: { inputProps: { min: 50, max: 300, step: 0.1 } }
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Обхват шеи (см)"
              type="number"
              value={neck}
              onChange={(e) => setNeck(e.target.value)}
              placeholder="38"
              slotProps={{
                input: { inputProps: { min: 10, max: 100, step: 0.1 } }
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Обхват талии (см)"
              type="number"
              value={waist}
              onChange={(e) => setWaist(e.target.value)}
              placeholder="85"
              slotProps={{
                input: { inputProps: { min: 30, max: 250, step: 0.1 } }
              }}
            />
          </Grid>
          {gender === 'female' && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Обхват бёдер (см)"
                type="number"
                value={hip}
                onChange={(e) => setHip(e.target.value)}
                placeholder="95"
                slotProps={{
                  input: { inputProps: { min: 30, max: 250, step: 0.1 } }
                }}
              />
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Results */}
      {results && (
        <>
          {/* Main result */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              textAlign: 'center',
              borderRadius: 3,
              background: alpha(results.category.color, 0.05)
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Процент жира в организме
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 700, color: results.category.color, mb: 1 }}>
              {formatNum(results.bodyFatPct)}%
            </Typography>
            <Chip
              label={results.category.label}
              sx={{
                fontWeight: 600,
                color: '#fff',
                backgroundColor: results.category.color,
                fontSize: '0.9rem'
              }}
            />
          </Paper>

          {/* Body composition */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  textAlign: 'center',
                  borderRadius: 3,
                  border: `1px solid ${alpha('#ef6c00', 0.3)}`,
                  background: alpha('#ef6c00', 0.05)
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Жировая масса
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#ef6c00' }}>
                  {formatNum(results.fatMass)} кг
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  textAlign: 'center',
                  borderRadius: 3,
                  border: `1px solid ${alpha('#2e7d32', 0.3)}`,
                  background: alpha('#2e7d32', 0.05)
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Сухая масса тела
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#2e7d32' }}>
                  {formatNum(results.leanMass)} кг
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Visual bar */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', mb: 2 }}>
              Состав тела
            </Typography>
            <Box
              sx={{
                display: 'flex',
                height: 32,
                borderRadius: 16,
                overflow: 'hidden',
                mb: 1.5
              }}
            >
              <Box
                sx={{
                  width: `${results.bodyFatPct}%`,
                  backgroundColor: '#ef6c00',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: 40
                }}
              >
                <Typography variant="caption" sx={{ color: '#fff', fontWeight: 700, fontSize: '0.65rem' }}>
                  Жир {formatNum(results.bodyFatPct)}%
                </Typography>
              </Box>
              <Box
                sx={{
                  flex: 1,
                  backgroundColor: '#2e7d32',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Typography variant="caption" sx={{ color: '#fff', fontWeight: 700, fontSize: '0.65rem' }}>
                  Сухая масса {formatNum(100 - results.bodyFatPct)}%
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Categories */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', mb: 2 }}>
              Категории ({gender === 'male' ? 'мужчины' : 'женщины'})
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {results.categories.map((cat) => {
                const isActive = results.category.label === cat.label;
                return (
                  <Box
                    key={cat.label}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: isActive ? alpha(cat.color, 0.08) : 'transparent',
                      border: isActive ? `1px solid ${alpha(cat.color, 0.3)}` : '1px solid transparent'
                    }}
                  >
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: cat.color,
                        flexShrink: 0
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        flex: 1,
                        fontWeight: isActive ? 700 : 400,
                        color: isActive ? cat.color : 'text.secondary'
                      }}
                    >
                      {cat.label}
                    </Typography>
                    <Typography variant="caption" color="text.disabled" sx={{ fontFamily: 'monospace' }}>
                      {cat.min}–{cat.max < 100 ? cat.max : `${cat.min}+`}%
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Paper>

          {/* Formula steps */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              background: theme.palette.surfaceContainerLowest
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', mb: 2 }}>
              Шаги расчёта (метод ВМС США)
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {results.formulaSteps.map((step, i) => (
                <Box
                  key={i}
                  sx={{
                    display: 'flex',
                    gap: 1.5,
                    alignItems: 'flex-start'
                  }}
                >
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main', fontSize: '0.7rem' }}>
                      {i + 1}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: 'monospace',
                      color: i === results.formulaSteps.length - 1 ? results.category.color : 'text.secondary',
                      fontWeight: i === results.formulaSteps.length - 1 ? 600 : 400
                    }}
                  >
                    {step}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </>
      )}
    </Box>
  );
}
