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

interface ActivityLevel {
  key: string;
  label: string;
  description: string;
  multiplier: number;
}

const ACTIVITY_LEVELS: ActivityLevel[] = [
  { key: 'sedentary', label: 'Минимальная', description: 'Сидячий образ жизни, без тренировок', multiplier: 1.2 },
  { key: 'light', label: 'Низкая', description: '1–3 тренировки в неделю', multiplier: 1.375 },
  { key: 'moderate', label: 'Средняя', description: '3–5 тренировок в неделю', multiplier: 1.55 },
  { key: 'high', label: 'Высокая', description: '6–7 тренировок в неделю', multiplier: 1.725 },
  { key: 'extreme', label: 'Очень высокая', description: 'Ежедневные интенсивные тренировки', multiplier: 1.9 },
];

function calcBMR(weight: number, height: number, age: number, gender: Gender): number {
  // Mifflin-St Jeor
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  }
  return 10 * weight + 6.25 * height - 5 * age - 161;
}

function calcMacros(calories: number) {
  // 30% protein, 40% carbs, 30% fat
  const proteinCal = calories * 0.3;
  const carbsCal = calories * 0.4;
  const fatCal = calories * 0.3;
  return {
    protein: Math.round(proteinCal / 4),   // 4 kcal per gram
    carbs: Math.round(carbsCal / 4),        // 4 kcal per gram
    fat: Math.round(fatCal / 9),            // 9 kcal per gram
  };
}

const formatNum = (n: number) =>
  n.toLocaleString('ru-RU', { maximumFractionDigits: 0 });

export default function CalorieCalc() {
  const theme = useTheme();
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<Gender>('male');
  const [activeLevel, setActiveLevel] = useState('moderate');

  const bmr = useMemo(() => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);
    if (isNaN(w) || isNaN(h) || isNaN(a) || w <= 0 || h <= 0 || a <= 0 || a > 150) return null;
    return calcBMR(w, h, a, gender);
  }, [weight, height, age, gender]);

  const selectedLevel = ACTIVITY_LEVELS.find((l) => l.key === activeLevel)!;
  const tdee = bmr !== null ? Math.round(bmr * selectedLevel.multiplier) : null;
  const macros = tdee !== null ? calcMacros(tdee) : null;

  const handleGender = (_: React.MouseEvent<HTMLElement>, val: Gender | null) => {
    if (val !== null) setGender(val);
  };

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto' }}>
      {/* Inputs */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
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
            <ToggleButton value="male">Мужской</ToggleButton>
            <ToggleButton value="female">Женский</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="Вес (кг)"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="70"
              slotProps={{
                input: { inputProps: { min: 20, max: 400, step: 0.5 } }
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="Рост (см)"
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="175"
              slotProps={{
                input: { inputProps: { min: 50, max: 300, step: 1 } }
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="Возраст (лет)"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="25"
              slotProps={{
                input: { inputProps: { min: 1, max: 150, step: 1 } }
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Activity level */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary', mb: 1.5 }}>
          Активность
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {ACTIVITY_LEVELS.map((level) => {
            const isActive = activeLevel === level.key;
            return (
              <Paper
                key={level.key}
                elevation={0}
                onClick={() => setActiveLevel(level.key)}
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  borderRadius: 2,
                  border: `1.5px solid ${isActive ? theme.palette.primary.main : theme.palette.divider}`,
                  background: isActive
                    ? theme.palette.surfaceContainerLow
                    : 'transparent',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    background: theme.palette.surfaceContainerLow
                  }
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? 'primary.main' : 'text.primary'
                      }}
                    >
                      {level.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {level.description}
                    </Typography>
                  </Box>
                  <Chip
                    label={`x${level.multiplier}`}
                    size="small"
                    variant={isActive ? 'filled' : 'outlined'}
                    color={isActive ? 'primary' : 'default'}
                    sx={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '0.8rem' }}
                  />
                </Box>
              </Paper>
            );
          })}
        </Box>
      </Paper>

      {/* Results */}
      {bmr !== null && tdee !== null && macros !== null && (
        <>
          {/* BMR & TDEE cards */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  borderRadius: 3,
                  background: alpha('#1976d2', 0.05)
                }}
              >
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Базовый обмен (BMR)
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', my: 0.5 }}>
                  {formatNum(Math.round(bmr))}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ккал / день
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  borderRadius: 3,
                  background: alpha('#2e7d32', 0.05)
                }}
              >
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Суточная норма (TDEE)
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#2e7d32', my: 0.5 }}>
                  {formatNum(tdee)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ккал / день
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Macronutrient breakdown */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 2,
              borderRadius: 3
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary', mb: 2 }}>
              Макронутриенты
            </Typography>
            <Grid container spacing={2}>
              {[
                { label: 'Белки', value: macros.protein, unit: 'г', color: '#e53935', pct: '30%' },
                { label: 'Углеводы', value: macros.carbs, unit: 'г', color: '#fb8c00', pct: '40%' },
                { label: 'Жиры', value: macros.fat, unit: 'г', color: '#43a047', pct: '30%' },
              ].map((m) => (
                <Grid key={m.label} size={{ xs: 12, sm: 4 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      borderRadius: 2,
                      background: alpha(m.color, 0.06)
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: m.color,
                        mx: 'auto',
                        mb: 0.5
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {m.label} ({m.pct})
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: m.color }}>
                      {formatNum(m.value)} {m.unit}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* TDEE for all activity levels */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', mb: 2 }}>
              TDEE по уровням активности
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {ACTIVITY_LEVELS.map((level) => {
                const levelTdee = Math.round(bmr * level.multiplier);
                const isActive = activeLevel === level.key;
                const maxTdee = bmr * 1.9;
                const barWidth = (levelTdee / maxTdee) * 100;
                return (
                  <Box key={level.key}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: isActive ? 700 : 400,
                          color: isActive ? 'primary.main' : 'text.secondary'
                        }}
                      >
                        {level.label}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          fontFamily: 'monospace',
                          color: isActive ? 'primary.main' : 'text.primary'
                        }}
                      >
                        {formatNum(levelTdee)} ккал
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        height: isActive ? 10 : 6,
                        borderRadius: 5,
                        backgroundColor: theme.palette.surfaceContainerHigh,
                        overflow: 'hidden',
                        transition: 'height 0.2s ease'
                      }}
                    >
                      <Box
                        sx={{
                          height: '100%',
                          width: `${barWidth}%`,
                          borderRadius: 5,
                          backgroundColor: isActive
                            ? theme.palette.primary.main
                            : alpha(theme.palette.primary.main, 0.3),
                          transition: 'width 0.4s ease, background-color 0.2s ease'
                        }}
                      />
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Paper>

          {/* Goal-based calorie targets */}
          <Paper
            elevation={0}
            sx={{
              mt: 2,
              p: 3,
              borderRadius: 3,
              background: alpha(theme.palette.warning.main, 0.03)
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', mb: 2 }}>
              Рекомендации по целям
            </Typography>
            <Grid container spacing={2}>
              {[
                { label: 'Похудение', delta: -500, color: '#e53935', desc: '−500 ккал' },
                { label: 'Поддержание', delta: 0, color: '#2e7d32', desc: '±0 ккал' },
                { label: 'Набор массы', delta: 500, color: '#1565c0', desc: '+500 ккал' },
              ].map((goal) => (
                <Grid key={goal.label} size={{ xs: 12, sm: 4 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      borderRadius: 2,
                      background: alpha(goal.color, 0.06)
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {goal.label}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: goal.color }}>
                      {formatNum(Math.max(tdee + goal.delta, 1200))} ккал
                    </Typography>
                    <Typography variant="caption" color="text.disabled">
                      {goal.desc}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </>
      )}
    </Box>
  );
}
