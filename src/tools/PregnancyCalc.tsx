'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Grid,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';

interface Milestone {
  week: number;
  text: string;
}

const MILESTONES: Milestone[] = [
  { week: 4, text: 'Имплантация эмбриона' },
  { week: 6, text: 'Начинает биться сердце' },
  { week: 8, text: 'Формируются органы' },
  { week: 12, text: 'Конец первого триместра' },
  { week: 16, text: 'Можно определить пол' },
  { week: 20, text: 'Половина срока, первые шевеления' },
  { week: 24, text: 'Лёгкие начинают развиваться' },
  { week: 28, text: 'Начало третьего триместра' },
  { week: 32, text: 'Ребёнок занимает положение' },
  { week: 36, text: 'Лёгкие почти готовы' },
  { week: 40, text: 'Предполагаемая дата родов' },
];

function getTrimester(week: number): { num: number; label: string; color: string } {
  if (week <= 13) return { num: 1, label: 'Первый триместр', color: '#1976d2' };
  if (week <= 27) return { num: 2, label: 'Второй триместр', color: '#2e7d32' };
  return { num: 3, label: 'Третий триместр', color: '#ef6c00' };
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function PregnancyCalc() {
  const theme = useTheme();
  const [lmpDate, setLmpDate] = useState('');

  const results = useMemo(() => {
    if (!lmpDate) return null;

    const lmp = new Date(lmpDate);
    if (isNaN(lmp.getTime())) return null;

    const now = new Date();

    // Naegele's rule: EDD = LMP + 280 days
    const edd = new Date(lmp);
    edd.setDate(edd.getDate() + 280);

    // Current week
    const diffMs = now.getTime() - lmp.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return null; // Date in the future

    const currentWeek = Math.floor(diffDays / 7);
    const currentDay = diffDays % 7;

    if (currentWeek > 42) return null; // Too far past due date

    const daysRemaining = Math.max(0, Math.ceil((edd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    const progressPct = Math.min(100, (diffDays / 280) * 100);

    const trimester = getTrimester(currentWeek);

    // Trimester date ranges
    const t1End = new Date(lmp);
    t1End.setDate(t1End.getDate() + 13 * 7);
    const t2End = new Date(lmp);
    t2End.setDate(t2End.getDate() + 27 * 7);

    return {
      edd,
      currentWeek,
      currentDay,
      daysRemaining,
      progressPct,
      trimester,
      diffDays,
      t1End,
      t2End,
    };
  }, [lmpDate]);

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto' }}>
      {/* Input */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 3,
          background: alpha(theme.palette.primary.main, 0.02),
        }}
      >
        <Typography variant="body2" sx={{ mb: 2, fontWeight: 500, color: 'text.secondary' }}>
          Дата последней менструации
        </Typography>
        <TextField
          fullWidth
          type="date"
          value={lmpDate}
          onChange={(e) => setLmpDate(e.target.value)}
          slotProps={{
            input: { inputProps: { max: new Date().toISOString().split('T')[0] } },
          }}
        />
      </Paper>

      {/* Results */}
      {results && (
        <>
          {/* Main info cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  textAlign: 'center',
                  borderRadius: 3,
                  border: `1px solid ${alpha(results.trimester.color, 0.3)}`,
                  background: alpha(results.trimester.color, 0.05),
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Текущая неделя
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: results.trimester.color }}>
                  {results.currentWeek}
                  <Typography component="span" variant="body2" color="text.secondary">
                    {' '}нед {results.currentDay} дн
                  </Typography>
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  textAlign: 'center',
                  borderRadius: 3,
                  border: `1px solid ${alpha('#c62828', 0.3)}`,
                  background: alpha('#c62828', 0.05),
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Дней до родов
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#c62828' }}>
                  {results.daysRemaining}
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  textAlign: 'center',
                  borderRadius: 3,
                  border: `1px solid ${alpha('#7b1fa2', 0.3)}`,
                  background: alpha('#7b1fa2', 0.05),
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Дата родов (ПДР)
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#7b1fa2' }}>
                  {formatDate(results.edd)}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Trimester indicator */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 3,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                Прогресс беременности
              </Typography>
              <Chip
                label={results.trimester.label}
                size="small"
                sx={{
                  fontWeight: 600,
                  backgroundColor: alpha(results.trimester.color, 0.12),
                  color: results.trimester.color,
                }}
              />
            </Box>

            {/* Progress bar */}
            <Box sx={{ position: 'relative', mb: 1 }}>
              <Box
                sx={{
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    height: '100%',
                    width: `${results.progressPct}%`,
                    borderRadius: 8,
                    background: `linear-gradient(to right, #1976d2, #2e7d32, #ef6c00)`,
                    transition: 'width 0.4s ease',
                  }}
                />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" color="text.disabled">0 нед</Typography>
              <Typography variant="caption" color="text.disabled">40 нед</Typography>
            </Box>

            {/* Trimester timeline */}
            <Box sx={{ display: 'flex', mt: 2, gap: 0.5 }}>
              {[
                { label: '1 триместр', color: '#1976d2', weeks: '1–13 нед', pct: 13 / 40 * 100 },
                { label: '2 триместр', color: '#2e7d32', weeks: '14–27 нед', pct: 14 / 40 * 100 },
                { label: '3 триместр', color: '#ef6c00', weeks: '28–40 нед', pct: 13 / 40 * 100 },
              ].map((t) => (
                <Box key={t.label} sx={{ flex: t.pct, textAlign: 'center' }}>
                  <Box
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: alpha(t.color, 0.25),
                      mb: 0.5,
                    }}
                  />
                  <Typography variant="caption" sx={{ fontWeight: 600, color: t.color, fontSize: '0.65rem' }}>
                    {t.label}
                  </Typography>
                  <Typography variant="caption" display="block" color="text.disabled" sx={{ fontSize: '0.6rem' }}>
                    {t.weeks}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>

          {/* Milestones */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 3,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', mb: 2 }}>
              Ключевые этапы развития
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {MILESTONES.map((milestone) => {
                const isPast = results.currentWeek >= milestone.week;
                const isCurrent = results.currentWeek >= milestone.week - 1 && results.currentWeek <= milestone.week + 1;
                const trimester = getTrimester(milestone.week);

                return (
                  <Box
                    key={milestone.week}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: isCurrent ? alpha(trimester.color, 0.06) : 'transparent',
                      border: isCurrent ? `1px solid ${alpha(trimester.color, 0.2)}` : '1px solid transparent',
                    }}
                  >
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        backgroundColor: isPast ? trimester.color : alpha(theme.palette.text.disabled, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 700,
                          color: isPast ? '#fff' : 'text.disabled',
                          fontSize: '0.65rem',
                        }}
                      >
                        {milestone.week}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: isCurrent ? 700 : isPast ? 500 : 400,
                          color: isPast ? 'text.primary' : 'text.disabled',
                        }}
                      >
                        {milestone.text}
                      </Typography>
                    </Box>
                    {isPast && (
                      <Typography variant="caption" sx={{ color: trimester.color, fontWeight: 600 }}>
                        ✓
                      </Typography>
                    )}
                  </Box>
                );
              })}
            </Box>
          </Paper>
        </>
      )}
    </Box>
  );
}
