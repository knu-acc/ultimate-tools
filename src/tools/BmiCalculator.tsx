'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Grid,
  Chip,
  LinearProgress,
  useTheme,
  alpha,
} from '@mui/material';

interface BmiCategory {
  label: string;
  description: string;
  color: string;
  min: number;
  max: number;
}

const categories: BmiCategory[] = [
  { label: 'Дефицит массы', description: 'Рекомендуется набрать вес для улучшения здоровья', color: '#1976d2', min: 0, max: 18.5 },
  { label: 'Норма', description: 'Ваш вес находится в здоровом диапазоне', color: '#2e7d32', min: 18.5, max: 25 },
  { label: 'Избыточный вес', description: 'Рекомендуется скорректировать питание и увеличить активность', color: '#f57c00', min: 25, max: 30 },
  { label: 'Ожирение I степени', description: 'Повышенный риск для здоровья, рекомендуется консультация врача', color: '#d32f2f', min: 30, max: 35 },
  { label: 'Ожирение II степени', description: 'Высокий риск для здоровья, необходима консультация специалиста', color: '#b71c1c', min: 35, max: 40 },
  { label: 'Ожирение III степени', description: 'Крайне высокий риск, требуется медицинская помощь', color: '#880e4f', min: 40, max: 100 },
];

export default function BmiCalculator() {
  const theme = useTheme();
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  const bmi = useMemo(() => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) return null;
    const hMeters = h / 100;
    return w / (hMeters * hMeters);
  }, [height, weight]);

  const category = useMemo(() => {
    if (bmi === null) return null;
    return categories.find((c) => bmi >= c.min && bmi < c.max) || categories[categories.length - 1];
  }, [bmi]);

  const healthyRange = useMemo(() => {
    const h = parseFloat(height);
    if (isNaN(h) || h <= 0) return null;
    const hMeters = h / 100;
    const minWeight = 18.5 * hMeters * hMeters;
    const maxWeight = 24.9 * hMeters * hMeters;
    return { min: minWeight, max: maxWeight };
  }, [height]);

  const gaugePosition = useMemo(() => {
    if (bmi === null) return 0;
    // Scale: 10 to 45 mapped to 0-100%
    const clamped = Math.max(10, Math.min(45, bmi));
    return ((clamped - 10) / 35) * 100;
  }, [bmi]);

  const formatNum = (n: number) =>
    n.toLocaleString('ru-RU', { maximumFractionDigits: 1 });

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto' }}>
      {/* Input */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, border: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="body2" sx={{ mb: 2, fontWeight: 500, color: 'text.secondary' }}>
          Введите ваши параметры
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Рост (см)"
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="170"
              slotProps={{
                input: {
                  inputProps: { min: 50, max: 300, step: 1 },
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Вес (кг)"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="70"
              slotProps={{
                input: {
                  inputProps: { min: 10, max: 500, step: 0.1 },
                },
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Result */}
      {bmi !== null && category && (
        <>
          {/* BMI Value */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              textAlign: 'center',
              border: `1px solid ${theme.palette.divider}`,
              background: alpha(category.color, 0.05),
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Ваш индекс массы тела
            </Typography>
            <Typography
              variant="h3"
              sx={{ fontWeight: 700, color: category.color, mb: 1 }}
            >
              {formatNum(bmi)}
            </Typography>
            <Chip
              label={category.label}
              sx={{
                fontWeight: 600,
                color: '#fff',
                backgroundColor: category.color,
                fontSize: '0.9rem',
                mb: 1.5,
              }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {category.description}
            </Typography>
          </Paper>

          {/* Visual Gauge */}
          <Paper elevation={0} sx={{ p: 3, mb: 3, border: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Шкала ИМТ
            </Typography>

            {/* Gradient bar */}
            <Box sx={{ position: 'relative', mb: 3 }}>
              <Box
                sx={{
                  height: 20,
                  borderRadius: 10,
                  background: 'linear-gradient(to right, #1976d2 0%, #2e7d32 24%, #2e7d32 43%, #f57c00 57%, #d32f2f 72%, #b71c1c 86%, #880e4f 100%)',
                }}
              />
              {/* Marker */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -6,
                  left: `${gaugePosition}%`,
                  transform: 'translateX(-50%)',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: category.color,
                  border: `3px solid ${theme.palette.background.paper}`,
                  boxShadow: `0 2px 8px ${alpha(category.color, 0.5)}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'left 0.3s ease',
                }}
              >
                <Typography variant="caption" sx={{ color: '#fff', fontWeight: 700, fontSize: '0.6rem' }}>
                  {formatNum(bmi)}
                </Typography>
              </Box>
            </Box>

            {/* Scale labels */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 0.5 }}>
              {[
                { value: '10', label: '' },
                { value: '18.5', label: 'Дефицит' },
                { value: '25', label: 'Норма' },
                { value: '30', label: 'Избыток' },
                { value: '35', label: 'Ожир. I' },
                { value: '40+', label: 'Ожир. II+' },
              ].map((item) => (
                <Box key={item.value} sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, fontSize: '0.65rem' }}>
                    {item.value}
                  </Typography>
                  {item.label && (
                    <Typography variant="caption" display="block" color="text.disabled" sx={{ fontSize: '0.6rem' }}>
                      {item.label}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          </Paper>

          {/* Categories breakdown */}
          <Paper elevation={0} sx={{ p: 3, mb: 3, border: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Категории ИМТ
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {categories.map((cat) => {
                const isActive = category.label === cat.label;
                const barValue = bmi !== null && isActive
                  ? Math.min(((bmi - cat.min) / (cat.max - cat.min)) * 100, 100)
                  : 0;
                return (
                  <Box key={cat.label}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            backgroundColor: cat.color,
                            flexShrink: 0,
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: isActive ? 700 : 400,
                            color: isActive ? cat.color : 'text.secondary',
                          }}
                        >
                          {cat.label}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.disabled">
                        {cat.min} — {cat.max < 100 ? cat.max : '40+'}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={isActive ? barValue : 0}
                      sx={{
                        height: isActive ? 8 : 4,
                        borderRadius: 4,
                        backgroundColor: alpha(cat.color, 0.1),
                        transition: 'height 0.3s ease',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: cat.color,
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>
                );
              })}
            </Box>
          </Paper>

          {/* Healthy range */}
          {healthyRange && (
            <Paper
              elevation={0}
              sx={{
                p: 3,
                border: `1px solid ${theme.palette.divider}`,
                background: alpha('#2e7d32', 0.04),
              }}
            >
              <Typography variant="h6" sx={{ mb: 1.5 }}>
                Здоровый диапазон веса
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Для вашего роста ({height} см) нормальный вес составляет:
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      borderRadius: 3,
                      border: `1px solid ${alpha('#2e7d32', 0.2)}`,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Минимум
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#2e7d32' }}>
                      {formatNum(healthyRange.min)} кг
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      borderRadius: 3,
                      border: `1px solid ${alpha('#2e7d32', 0.2)}`,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Максимум
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#2e7d32' }}>
                      {formatNum(healthyRange.max)} кг
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
              {bmi < 18.5 && (
                <Chip
                  label={`Вам нужно набрать ~${formatNum(healthyRange.min - parseFloat(weight))} кг`}
                  variant="outlined"
                  sx={{ mt: 2, color: '#1976d2', borderColor: '#1976d2' }}
                />
              )}
              {bmi >= 25 && (
                <Chip
                  label={`Рекомендуется снизить вес на ~${formatNum(parseFloat(weight) - healthyRange.max)} кг`}
                  variant="outlined"
                  sx={{ mt: 2, color: '#f57c00', borderColor: '#f57c00' }}
                />
              )}
            </Paper>
          )}
        </>
      )}
    </Box>
  );
}
