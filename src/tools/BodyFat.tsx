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
import { toggleButtonClasses } from '@mui/material/ToggleButton';
import { useLanguage } from '@/src/i18n/LanguageContext';

type Gender = 'male' | 'female';

interface Category {
  label: string;
  min: number;
  max: number;
  color: string;
}

interface CategoryI18n {
  labelRu: string;
  labelEn: string;
  min: number;
  max: number;
  color: string;
}

const MALE_CATEGORIES: CategoryI18n[] = [
  { labelRu: 'Необходимый жир', labelEn: 'Essential fat', min: 0, max: 6, color: '#1565c0' },
  { labelRu: 'Атлеты', labelEn: 'Athletes', min: 6, max: 14, color: '#2e7d32' },
  { labelRu: 'Фитнес', labelEn: 'Fitness', min: 14, max: 18, color: '#558b2f' },
  { labelRu: 'Средний уровень', labelEn: 'Average', min: 18, max: 25, color: '#f9a825' },
  { labelRu: 'Избыточный жир', labelEn: 'Excess fat', min: 25, max: 100, color: '#c62828' },
];

const FEMALE_CATEGORIES: CategoryI18n[] = [
  { labelRu: 'Необходимый жир', labelEn: 'Essential fat', min: 0, max: 14, color: '#1565c0' },
  { labelRu: 'Атлеты', labelEn: 'Athletes', min: 14, max: 21, color: '#2e7d32' },
  { labelRu: 'Фитнес', labelEn: 'Fitness', min: 21, max: 25, color: '#558b2f' },
  { labelRu: 'Средний уровень', labelEn: 'Average', min: 25, max: 32, color: '#f9a825' },
  { labelRu: 'Избыточный жир', labelEn: 'Excess fat', min: 32, max: 100, color: '#c62828' },
];

export default function BodyFat() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
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
        isEn ? `Waist - Neck = ${wa} - ${n} = ${diff.toFixed(1)} cm` : `Талия - Шея = ${wa} - ${n} = ${diff.toFixed(1)} см`,
        `86.010 × log10(${diff.toFixed(1)}) = ${(86.010 * Math.log10(diff)).toFixed(2)}`,
        `70.041 × log10(${h}) = ${(70.041 * Math.log10(h)).toFixed(2)}`,
        `${isEn ? 'Result' : 'Результат'}: ${(86.010 * Math.log10(diff)).toFixed(2)} - ${(70.041 * Math.log10(h)).toFixed(2)} + 36.76 = ${bodyFatPct.toFixed(1)}%`,
      ];
    } else {
      const hi = parseFloat(hip);
      if (isNaN(hi) || hi <= 0) return null;

      // US Navy Women: 163.205 * log10(waist + hip - neck) - 97.684 * log10(height) - 78.387
      const sum = wa + hi - n;
      if (sum <= 0) return null;

      bodyFatPct = 163.205 * Math.log10(sum) - 97.684 * Math.log10(h) - 78.387;
      formulaSteps = [
        isEn ? `Waist + Hips - Neck = ${wa} + ${hi} - ${n} = ${sum.toFixed(1)} cm` : `Талия + Бёдра - Шея = ${wa} + ${hi} - ${n} = ${sum.toFixed(1)} см`,
        `163.205 × log10(${sum.toFixed(1)}) = ${(163.205 * Math.log10(sum)).toFixed(2)}`,
        `97.684 × log10(${h}) = ${(97.684 * Math.log10(h)).toFixed(2)}`,
        `${isEn ? 'Result' : 'Результат'}: ${(163.205 * Math.log10(sum)).toFixed(2)} - ${(97.684 * Math.log10(h)).toFixed(2)} - 78.387 = ${bodyFatPct.toFixed(1)}%`,
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
    n.toLocaleString(isEn ? 'en-US' : 'ru-RU', { maximumFractionDigits: 1 });

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Input */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 2,
          borderRadius: 18,
          background: theme.palette.surfaceContainerLow
        }}
      >
        <Box sx={{ mb: 2.5 }}>
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
                borderRadius: 10,
                [`&.${toggleButtonClasses.selected}`]: {
                  background: theme.palette.surfaceContainerHigh,
                  color: theme.palette.primary.main,
                  '&:hover': {
                    background: alpha(theme.palette.primary.main, 0.18)
                  }
                }
              }
            }}
          >
            <ToggleButton value="male">{isEn ? 'Male' : 'Мужчина'}</ToggleButton>
            <ToggleButton value="female">{isEn ? 'Female' : 'Женщина'}</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              placeholder={isEn ? 'Weight, kg' : 'Вес, кг'}
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              slotProps={{
                input: { inputProps: { min: 20, max: 400, step: 0.1 } }
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              placeholder={isEn ? 'Height, cm' : 'Рост, см'}
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              slotProps={{
                input: { inputProps: { min: 50, max: 300, step: 0.1 } }
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              placeholder={isEn ? 'Neck circumference, cm' : 'Обхват шеи, см'}
              type="number"
              value={neck}
              onChange={(e) => setNeck(e.target.value)}
              slotProps={{
                input: { inputProps: { min: 10, max: 100, step: 0.1 } }
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              placeholder={isEn ? 'Waist circumference, cm' : 'Обхват талии, см'}
              type="number"
              value={waist}
              onChange={(e) => setWaist(e.target.value)}
              slotProps={{
                input: { inputProps: { min: 30, max: 250, step: 0.1 } }
              }}
            />
          </Grid>
          {gender === 'female' && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                placeholder={isEn ? 'Hip circumference, cm' : 'Обхват бёдер, см'}
                type="number"
                value={hip}
                onChange={(e) => setHip(e.target.value)}
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
              p: { xs: 2, sm: 3 },
              mb: 2,
              textAlign: 'center',
              borderRadius: 18,
              background: alpha(results.category.color, 0.05)
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              {isEn ? 'Body fat percentage' : 'Процент жира в организме'}
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 700, color: results.category.color, mb: 1 }}>
              {formatNum(results.bodyFatPct)}%
            </Typography>
            <Chip
              label={isEn ? results.category.labelEn : results.category.labelRu}
              sx={{
                fontWeight: 600,
                color: '#fff',
                backgroundColor: results.category.color,
                fontSize: '0.9rem'
              }}
            />
          </Paper>

          {/* Body composition */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  textAlign: 'center',
                  borderRadius: 18,
                  background: alpha('#ef6c00', 0.06)
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {isEn ? 'Fat mass' : 'Жировая масса'}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#ef6c00' }}>
                  {formatNum(results.fatMass)} {isEn ? 'kg' : 'кг'}
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  textAlign: 'center',
                  borderRadius: 18,
                  background: alpha('#2e7d32', 0.06)
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {isEn ? 'Lean body mass' : 'Сухая масса тела'}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#2e7d32' }}>
                  {formatNum(results.leanMass)} {isEn ? 'kg' : 'кг'}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Visual bar */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              mb: 2,
              borderRadius: 18
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary', mb: 2 }}>
              {isEn ? 'Body composition' : 'Состав тела'}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                height: 32,
                borderRadius: 999,
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
                  {isEn ? 'Fat' : 'Жир'} {formatNum(results.bodyFatPct)}%
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
                  {isEn ? 'Lean mass' : 'Сухая масса'} {formatNum(100 - results.bodyFatPct)}%
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Categories */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              mb: 2,
              borderRadius: 18
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary', mb: 2 }}>
              {isEn ? `Categories (${gender === 'male' ? 'male' : 'female'})` : `Категории (${gender === 'male' ? 'мужчины' : 'женщины'})`}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {results.categories.map((cat: CategoryI18n) => {
                const isActive = results.category.labelRu === cat.labelRu;
                return (
                  <Box
                    key={cat.labelRu}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      p: 1.5,
                      borderRadius: 10,
                      backgroundColor: isActive ? alpha(cat.color, 0.08) : 'transparent',
                      border: 'none'
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
                      {isEn ? cat.labelEn : cat.labelRu}
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
              p: { xs: 2, sm: 3 },
              borderRadius: 18,
              background: theme.palette.surfaceContainerLow
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary', mb: 2 }}>
              {isEn ? 'Calculation' : 'Расчёт'}
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
