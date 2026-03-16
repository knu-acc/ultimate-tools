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
  alpha
} from '@mui/material';
import { useLanguage } from '@/src/i18n/LanguageContext';

interface Milestone {
  week: number;
  text: string;
  textEn: string;
}

const MILESTONES: Milestone[] = [
  { week: 4, text: 'Имплантация эмбриона', textEn: 'Embryo implantation' },
  { week: 6, text: 'Начинает биться сердце', textEn: 'Heart starts beating' },
  { week: 8, text: 'Формируются органы', textEn: 'Organs forming' },
  { week: 12, text: 'Конец первого триместра', textEn: 'End of first trimester' },
  { week: 16, text: 'Можно определить пол', textEn: 'Gender can be determined' },
  { week: 20, text: 'Половина срока, первые шевеления', textEn: 'Halfway, first movements' },
  { week: 24, text: 'Лёгкие начинают развиваться', textEn: 'Lungs begin to develop' },
  { week: 28, text: 'Начало третьего триместра', textEn: 'Third trimester begins' },
  { week: 32, text: 'Ребёнок занимает положение', textEn: 'Baby takes position' },
  { week: 36, text: 'Лёгкие почти готовы', textEn: 'Lungs nearly ready' },
  { week: 40, text: 'Предполагаемая дата родов', textEn: 'Estimated due date' },
];

function getTrimester(week: number, isEn = false): { num: number; label: string; color: string } {
  if (week <= 13) return { num: 1, label: isEn ? 'First trimester' : 'Первый триместр', color: '#1976d2' };
  if (week <= 27) return { num: 2, label: isEn ? 'Second trimester' : 'Второй триместр', color: '#2e7d32' };
  return { num: 3, label: isEn ? 'Third trimester' : 'Третий триместр', color: '#ef6c00' };
}

function formatDate(d: Date, isEn = false): string {
  return d.toLocaleDateString(isEn ? 'en-US' : 'ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function PregnancyCalc() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
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

    const trimester = getTrimester(currentWeek, isEn);

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
      t2End
    };
  }, [lmpDate]);

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
        <TextField
          fullWidth
          type="date"
          value={lmpDate}
          onChange={(e) => setLmpDate(e.target.value)}
          slotProps={{
            input: { inputProps: { max: new Date().toISOString().split('T')[0] } }
          }}
        />
      </Paper>

      {/* Results */}
      {results && (
        <>
          {/* Main info cards */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  textAlign: 'center',
                  borderRadius: 18,
                  background: alpha(results.trimester.color, 0.05)
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {isEn ? 'Current week' : 'Текущая неделя'}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: results.trimester.color }}>
                  {results.currentWeek}
                  <Typography component="span" variant="body2" color="text.secondary">
                    {isEn ? ` wk ${results.currentDay} d` : ` нед ${results.currentDay} дн`}
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
                  borderRadius: 18,
                  background: alpha('#c62828', 0.05)
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {isEn ? 'Days until delivery' : 'Дней до родов'}
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
                  borderRadius: 18,
                  background: alpha('#7b1fa2', 0.05)
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {isEn ? 'Due date (EDD)' : 'Дата родов (ПДР)'}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#7b1fa2' }}>
                  {formatDate(results.edd, isEn)}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Trimester indicator */}
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
                {isEn ? 'Pregnancy progress' : 'Прогресс беременности'}
              </Typography>
              <Chip
                label={results.trimester.label}
                size="small"
                sx={{
                  fontWeight: 600,
                  backgroundColor: alpha(results.trimester.color, 0.12),
                  color: results.trimester.color
                }}
              />
            </Box>

            {/* Progress bar */}
            <Box sx={{ position: 'relative', mb: 1 }}>
              <Box
                sx={{
                  height: 16,
                  borderRadius: 18,
                  backgroundColor: theme.palette.surfaceContainerHigh,
                  overflow: 'hidden'
                }}
              >
                <Box
                  sx={{
                    height: '100%',
                    width: `${results.progressPct}%`,
                    borderRadius: 18,
                    background: `linear-gradient(to right, #1976d2, #2e7d32, #ef6c00)`,
                    transition: 'width 0.4s ease'
                  }}
                />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" color="text.disabled">{isEn ? '0 wk' : '0 нед'}</Typography>
              <Typography variant="caption" color="text.disabled">{isEn ? '40 wk' : '40 нед'}</Typography>
            </Box>

            {/* Trimester timeline */}
            <Box sx={{ display: 'flex', mt: 2, gap: 0.5 }}>
              {[
                { label: isEn ? '1st trimester' : '1 триместр', color: '#1976d2', weeks: isEn ? '1–13 wk' : '1–13 нед', pct: 13 / 40 * 100 },
                { label: isEn ? '2nd trimester' : '2 триместр', color: '#2e7d32', weeks: isEn ? '14–27 wk' : '14–27 нед', pct: 14 / 40 * 100 },
                { label: isEn ? '3rd trimester' : '3 триместр', color: '#ef6c00', weeks: isEn ? '28–40 wk' : '28–40 нед', pct: 13 / 40 * 100 },
              ].map((t) => (
                <Box key={t.label} sx={{ flex: t.pct, textAlign: 'center' }}>
                  <Box
                    sx={{
                      height: 8,
                      borderRadius: 18,
                      backgroundColor: alpha(t.color, 0.25),
                      mb: 0.5
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
              p: { xs: 2, sm: 3 },
              borderRadius: 18
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', mb: 2 }}>
              {isEn ? 'Key development milestones' : 'Ключевые этапы развития'}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {MILESTONES.map((milestone) => {
                const isPast = results.currentWeek >= milestone.week;
                const isCurrent = results.currentWeek >= milestone.week - 1 && results.currentWeek <= milestone.week + 1;
                const trimester = getTrimester(milestone.week, isEn);

                return (
                  <Box
                    key={milestone.week}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      p: 1.5,
                      borderRadius: 10,
                      backgroundColor: isCurrent ? alpha(trimester.color, 0.06) : 'transparent',
                      border: 'none'
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
                        flexShrink: 0
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 700,
                          color: isPast ? '#fff' : 'text.disabled',
                          fontSize: '0.65rem'
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
                          color: isPast ? 'text.primary' : 'text.disabled'
                        }}
                      >
                        {isEn ? milestone.textEn : milestone.text}
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
