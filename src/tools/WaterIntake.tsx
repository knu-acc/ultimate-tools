'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Grid,
  Button,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
  alpha
} from '@mui/material';
import { toggleButtonClasses } from '@mui/material/ToggleButton';
import { useLanguage } from '@/src/i18n/LanguageContext';

type ActivityLevel = 'low' | 'medium' | 'high';
type Climate = 'normal' | 'hot';

const GLASS_ML = 250;

function calcWaterMl(weightKg: number, activity: ActivityLevel, climate: Climate): number {
  // Base: 30 ml per kg
  let base = weightKg * 30;

  // Activity adjustment
  if (activity === 'medium') base += 500;
  if (activity === 'high') base += 1000;

  // Climate adjustment
  if (climate === 'hot') base += 500;

  return Math.round(base);
}

export default function WaterIntake() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const [weight, setWeight] = useState('');
  const [activity, setActivity] = useState<ActivityLevel>('medium');
  const [climate, setClimate] = useState<Climate>('normal');
  const [glasses, setGlasses] = useState(0);

  const waterMl = useMemo(() => {
    const w = parseFloat(weight);
    if (isNaN(w) || w <= 0 || w > 500) return null;
    return calcWaterMl(w, activity, climate);
  }, [weight, activity, climate]);

  const waterLiters = waterMl !== null ? (waterMl / 1000).toFixed(1) : null;
  const totalGlasses = waterMl !== null ? Math.ceil(waterMl / GLASS_ML) : null;

  const progressPct = waterMl !== null && waterMl > 0
    ? Math.min((glasses * GLASS_ML) / waterMl * 100, 100)
    : 0;

  const drunkMl = glasses * GLASS_ML;
  const isGoalReached = waterMl !== null && drunkMl >= waterMl;

  const handleActivity = (_: React.MouseEvent<HTMLElement>, val: ActivityLevel | null) => {
    if (val !== null) setActivity(val);
  };

  const handleClimate = (_: React.MouseEvent<HTMLElement>, val: Climate | null) => {
    if (val !== null) setClimate(val);
  };

  const getProgressColor = () => {
    if (progressPct >= 100) return '#2e7d32';
    if (progressPct >= 60) return '#1976d2';
    if (progressPct >= 30) return '#f57c00';
    return '#d32f2f';
  };

  const progressColor = getProgressColor();

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Inputs */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 2,
          borderRadius: 18,
          background: theme.palette.surfaceContainerLow
        }}
      >
        <TextField
          fullWidth
          placeholder={isEn ? 'Weight, kg' : 'Вес, кг'}
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          sx={{ mb: 2.5 }}
          slotProps={{
            input: { inputProps: { min: 20, max: 500, step: 0.5 } }
          }}
        />

        {/* Activity level */}
        <Box sx={{ mb: 2.5 }}>
          <ToggleButtonGroup
            value={activity}
            exclusive
            onChange={handleActivity}
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
            <ToggleButton value="low">{isEn ? 'Low' : 'Низкая'}</ToggleButton>
            <ToggleButton value="medium">{isEn ? 'Medium' : 'Средняя'}</ToggleButton>
            <ToggleButton value="high">{isEn ? 'High' : 'Высокая'}</ToggleButton>
          </ToggleButtonGroup>
          <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: 'block' }}>
            {activity === 'low' && (isEn ? 'Sedentary work, minimal movement' : 'Сидячая работа, минимум движения')}
            {activity === 'medium' && (isEn ? 'Moderate exercise 2-4 times a week' : 'Умеренные тренировки 2–4 раза в неделю')}
            {activity === 'high' && (isEn ? 'Intense training or physical labor' : 'Интенсивные тренировки или физический труд')}
          </Typography>
        </Box>

        {/* Climate */}
        <Box>
          <ToggleButtonGroup
            value={climate}
            exclusive
            onChange={handleClimate}
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
            <ToggleButton value="normal">{isEn ? 'Normal' : 'Обычный'}</ToggleButton>
            <ToggleButton value="hot">{isEn ? 'Hot' : 'Жаркий'}</ToggleButton>
          </ToggleButtonGroup>
          <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: 'block' }}>
            {climate === 'normal' ? (isEn ? 'Moderate temperature' : 'Умеренная температура') : (isEn ? 'Hot weather or dry climate (+500 ml)' : 'Жаркая погода или сухой климат (+500 мл)')}
          </Typography>
        </Box>
      </Paper>

      {/* Result */}
      {waterMl !== null && totalGlasses !== null && (
        <>
          {/* Daily recommendation */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 3 },
                  textAlign: 'center',
                  borderRadius: 18,
                  background: alpha('#1976d2', 0.06)
                }}
              >
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                  {isEn ? 'Daily intake' : 'Суточная норма'}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', my: 0.5 }}>
                  {waterLiters} {isEn ? 'L' : 'л'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {waterMl} {isEn ? 'ml per day' : 'мл в день'}
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 3 },
                  textAlign: 'center',
                  borderRadius: 18,
                  background: alpha('#2e7d32', 0.06)
                }}
              >
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                  {isEn ? 'Glasses (250 ml)' : 'Стаканов (250 мл)'}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#2e7d32', my: 0.5 }}>
                  {totalGlasses}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {isEn ? (totalGlasses === 1 ? 'glass' : 'glasses') : (totalGlasses === 1 ? 'стакан' : totalGlasses < 5 ? 'стакана' : 'стаканов')}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Progress tracker */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              mb: 2,
              borderRadius: 18
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                {isEn ? 'Today\'s tracker' : 'Трекер на сегодня'}
              </Typography>
              {isGoalReached && (
                <Chip
                  label={isEn ? 'Goal reached!' : 'Цель достигнута!'}
                  size="small"
                  sx={{
                    fontWeight: 600,
                    color: '#fff',
                    backgroundColor: '#2e7d32',
                    fontSize: '0.75rem'
                  }}
                />
              )}
            </Box>

            {/* Progress bar */}
            <Box sx={{ position: 'relative', mb: 2 }}>
              <Box
                sx={{
                  height: 16,
                  borderRadius: 18,
                  backgroundColor: alpha(progressColor, 0.12),
                  overflow: 'hidden'
                }}
              >
                <Box
                  sx={{
                    height: '100%',
                    width: `${progressPct}%`,
                    borderRadius: 18,
                    backgroundColor: progressColor,
                    transitionProperty: 'width, background-color', transitionDuration: '0.3s', transitionTimingFunction: 'ease'
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                <Typography variant="caption" color="text.disabled">
                  {drunkMl} {isEn ? 'ml' : 'мл'}
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 600, color: progressColor }}>
                  {Math.round(progressPct)}%
                </Typography>
                <Typography variant="caption" color="text.disabled">
                  {waterMl} {isEn ? 'ml' : 'мл'}
                </Typography>
              </Box>
            </Box>

            {/* Glass grid */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2.5 }}>
              {Array.from({ length: totalGlasses }).map((_, i) => {
                const isFilled = i < glasses;
                return (
                  <Box
                    key={i}
                    onClick={() => setGlasses(isFilled ? i : i + 1)}
                    sx={{
                      width: 40,
                      height: 48,
                      borderRadius: '8px 8px 6px 6px',
                      border: `2px solid ${isFilled ? '#1976d2' : alpha(theme.palette.text.disabled, 0.25)}`,
                      backgroundColor: isFilled ? alpha('#1976d2', 0.15) : 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transitionProperty: 'background-color', transitionDuration: '150ms', transitionTimingFunction: 'ease',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        borderColor: '#1976d2',
                        backgroundColor: alpha('#1976d2', 0.08)
                      }
                    }}
                  >
                    {isFilled && (
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: '70%',
                          backgroundColor: alpha('#1976d2', 0.25),
                          borderRadius: '0 0 4px 4px'
                        }}
                      />
                    )}
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 700,
                        fontSize: '0.65rem',
                        color: isFilled ? '#1976d2' : 'text.disabled',
                        position: 'relative',
                        zIndex: 1
                      }}
                    >
                      {i + 1}
                    </Typography>
                  </Box>
                );
              })}
            </Box>

            {/* Action buttons */}
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                onClick={() => setGlasses((prev) => Math.min(prev + 1, totalGlasses))}
                disabled={glasses >= totalGlasses}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 10,
                  px: 3
                }}
              >
                {isEn ? '+ 1 glass (250 ml)' : '+ 1 стакан (250 мл)'}
              </Button>
              <Button
                variant="outlined"
                onClick={() => setGlasses((prev) => Math.max(prev - 1, 0))}
                disabled={glasses <= 0}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 10,
                  px: 3
                }}
              >
                {isEn ? 'Remove glass' : 'Убрать стакан'}
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setGlasses(0)}
                disabled={glasses === 0}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 10,
                  px: 3
                }}
              >
                {isEn ? 'Reset' : 'Сбросить'}
              </Button>
            </Box>
          </Paper>

          {/* Breakdown */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 18,
              background: alpha('#0288d1', 0.03)
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', mb: 2 }}>
              {isEn ? 'Intake calculation' : 'Расчёт нормы'}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[
                {
                  label: isEn ? 'Base need' : 'Базовая потребность',
                  value: isEn ? `${weight} kg x 30 ml = ${Math.round(parseFloat(weight) * 30)} ml` : `${weight} кг x 30 мл = ${Math.round(parseFloat(weight) * 30)} мл`
                },
                ...(activity !== 'low'
                  ? [{
                      label: isEn ? 'Activity' : 'Активность',
                      value: `+${activity === 'medium' ? 500 : 1000} ${isEn ? 'ml' : 'мл'}`
                    }]
                  : []),
                ...(climate === 'hot'
                  ? [{ label: isEn ? 'Hot climate' : 'Жаркий климат', value: `+500 ${isEn ? 'ml' : 'мл'}` }]
                  : []),
                { label: isEn ? 'Total' : 'Итого', value: `${waterMl} ${isEn ? 'ml' : 'мл'} (${waterLiters} ${isEn ? 'L' : 'л'})` },
              ].map((row) => (
                <Box
                  key={row.label}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 0.5,
                    borderBottom: (row.label === 'Итого' || row.label === 'Total')
                      ? 'none'
                      : `1px solid ${alpha(theme.palette.divider, 0.5)}`
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: (row.label === 'Итого' || row.label === 'Total') ? 'primary.main' : 'text.secondary',
                      fontWeight: (row.label === 'Итого' || row.label === 'Total') ? 700 : 400
                    }}
                  >
                    {row.label}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      fontFamily: 'monospace',
                      color: (row.label === 'Итого' || row.label === 'Total') ? 'primary.main' : 'text.primary'
                    }}
                  >
                    {row.value}
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
