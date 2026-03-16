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
import { useLanguage } from '@/src/i18n/LanguageContext';

type Gender = 'male' | 'female';

interface FormulaResult {
  name: string;
  description: string;
  weight: number;
  color: string;
}

function calcDevine(heightCm: number, gender: Gender): number {
  const heightInches = heightCm / 2.54;
  const over60 = heightInches - 60;
  if (gender === 'male') {
    return 50 + 2.3 * over60;
  }
  return 45.5 + 2.3 * over60;
}

function calcRobinson(heightCm: number, gender: Gender): number {
  const heightInches = heightCm / 2.54;
  const over60 = heightInches - 60;
  if (gender === 'male') {
    return 52 + 1.9 * over60;
  }
  return 49 + 1.7 * over60;
}

function calcMiller(heightCm: number, gender: Gender): number {
  const heightInches = heightCm / 2.54;
  const over60 = heightInches - 60;
  if (gender === 'male') {
    return 56.2 + 1.41 * over60;
  }
  return 53.1 + 1.36 * over60;
}

function calcHamwi(heightCm: number, gender: Gender): number {
  const heightInches = heightCm / 2.54;
  const over60 = heightInches - 60;
  if (gender === 'male') {
    return 48 + 2.7 * over60;
  }
  return 45.5 + 2.2 * over60;
}

export default function IdealWeight() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const [height, setHeight] = useState('');
  const [gender, setGender] = useState<Gender>('male');

  const results = useMemo((): FormulaResult[] | null => {
    const h = parseFloat(height);
    if (isNaN(h) || h < 100 || h > 250) return null;

    return [
      {
        name: isEn ? 'Devine' : 'Девайн',
        description: isEn ? 'Most common formula, widely used in medicine and pharmacology' : 'Наиболее распространённая формула, часто используется в медицине и фармакологии',
        weight: calcDevine(h, gender),
        color: '#1976d2'
      },
      {
        name: isEn ? 'Robinson' : 'Робинсон',
        description: isEn ? 'Modification of Devine formula (1983), considered more accurate' : 'Модификация формулы Девайна 1983 года, считается более точной',
        weight: calcRobinson(h, gender),
        color: '#2e7d32'
      },
      {
        name: isEn ? 'Miller' : 'Миллер',
        description: isEn ? 'Formula from 1983, gives slightly higher values' : 'Формула 1983 года, даёт несколько более высокие значения',
        weight: calcMiller(h, gender),
        color: '#7b1fa2'
      },
      {
        name: isEn ? 'Hamwi' : 'Хамви',
        description: isEn ? 'One of the first formulas (1964), basis for many subsequent ones' : 'Одна из первых формул (1964), основа для многих последующих',
        weight: calcHamwi(h, gender),
        color: '#e65100'
      },
    ];
  }, [height, gender, isEn]);

  const average = useMemo(() => {
    if (!results) return null;
    const sum = results.reduce((acc, r) => acc + r.weight, 0);
    return sum / results.length;
  }, [results]);

  const fmt = (n: number) =>
    n.toLocaleString(isEn ? 'en-US' : 'ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, mb: 2, borderRadius: 18, background: theme.palette.surfaceContainerLow }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              placeholder={isEn ? "Height, cm" : "Рост, см"}
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              slotProps={{
                input: {
                  inputProps: { min: 100, max: 250, step: 1 }
                }
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <ToggleButtonGroup
              value={gender}
              exclusive
              onChange={(_, val) => { if (val) setGender(val); }}
              fullWidth
            >
              <ToggleButton value="male" sx={{ textTransform: 'none', py: 1.5 }}>
                {isEn ? 'Male' : 'Мужчина'}
              </ToggleButton>
              <ToggleButton value="female" sx={{ textTransform: 'none', py: 1.5 }}>
                {isEn ? 'Female' : 'Женщина'}
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>
      </Paper>

      {/* Средний результат */}
      {results && average && (
        <>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              mb: 2,
              borderRadius: 18,
              textAlign: 'center',
              background: theme.palette.surfaceContainerLow
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              {isEn ? 'Average across all formulas' : 'Среднее значение по всем формулам'}
            </Typography>
            <Typography
              variant="h3"
              sx={{ fontWeight: 700, color: theme.palette.primary.main, mb: 1 }}
            >
              {fmt(average)} {isEn ? 'kg' : 'кг'}
            </Typography>
            <Chip
              label={isEn ? `Range: ${fmt(Math.min(...results.map((r) => r.weight)))} — ${fmt(Math.max(...results.map((r) => r.weight)))} kg` : `Диапазон: ${fmt(Math.min(...results.map((r) => r.weight)))} — ${fmt(Math.max(...results.map((r) => r.weight)))} кг`}
              variant="outlined"
              sx={{ fontWeight: 500 }}
            />
          </Paper>

          {/* Визуальная шкала сравнения */}
          <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, mb: 2, borderRadius: 18, background: theme.palette.surfaceContainerLow }}>
            <Typography variant="body2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>
              {isEn ? 'Formula comparison' : 'Сравнение формул'}
            </Typography>

            {(() => {
              const weights = results.map((r) => r.weight);
              const minW = Math.min(...weights) - 2;
              const maxW = Math.max(...weights) + 2;
              const range = maxW - minW;

              return (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {results.map((r) => {
                    const pos = ((r.weight - minW) / range) * 100;
                    return (
                      <Box key={r.name}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {r.name}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: r.color }}>
                            {fmt(r.weight)} {isEn ? 'kg' : 'кг'}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            position: 'relative',
                            height: 12,
                            borderRadius: 18,
                            backgroundColor: alpha(r.color, 0.1)
                          }}
                        >
                          <Box
                            sx={{
                              position: 'absolute',
                              left: 0,
                              top: 0,
                              height: '100%',
                              width: `${pos}%`,
                              borderRadius: 18,
                              backgroundColor: alpha(r.color, 0.6),
                              transition: 'width 0.4s ease'
                            }}
                          />
                          <Box
                            sx={{
                              position: 'absolute',
                              top: -2,
                              left: `${pos}%`,
                              transform: 'translateX(-50%)',
                              width: 16,
                              height: 16,
                              borderRadius: '50%',
                              backgroundColor: r.color,
                              border: `2px solid ${theme.palette.background.paper}`,
                              boxShadow: `0 1px 4px ${alpha(r.color, 0.4)}`,
                              transition: 'left 0.4s ease'
                            }}
                          />
                        </Box>
                      </Box>
                    );
                  })}

                  {/* Средняя линия */}
                  <Box sx={{ mt: 1, pt: 2, borderTop: `1px dashed ${theme.palette.divider}` }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        {isEn ? 'Average' : 'Среднее'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                        {fmt(average)} {isEn ? 'kg' : 'кг'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })()}
          </Paper>

          {/* Подробные карточки */}
          <Grid container spacing={2}>
            {results.map((r) => (
              <Grid size={{ xs: 12, sm: 6 }} key={r.name}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    height: '100%',
                    borderLeft: `3px solid ${r.color}`,
                    borderRadius: 18
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5, color: r.color }}>
                    {isEn ? `${r.name} Formula` : `Формула ${r.name}`}
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, mb: 1 }}
                  >
                    {fmt(r.weight)} {isEn ? 'kg' : 'кг'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {r.description}
                  </Typography>
                  {average && (
                    <Chip
                      label={
                        r.weight > average
                          ? `+${fmt(r.weight - average)} ${isEn ? 'kg from average' : 'кг от среднего'}`
                          : r.weight < average
                            ? `${fmt(r.weight - average)} ${isEn ? 'kg from average' : 'кг от среднего'}`
                            : isEn ? 'Matches average' : 'Совпадает со средним'
                      }
                      size="small"
                      sx={{
                        mt: 1.5,
                        fontWeight: 500,
                        color: r.color,
                        backgroundColor: alpha(r.color, 0.1)
                      }}
                    />
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>

        </>
      )}
    </Box>
  );
}
