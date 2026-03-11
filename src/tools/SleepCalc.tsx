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

type Mode = 'bedtime' | 'wakeup';

interface SleepOption {
  time: string;
  cycles: number;
  duration: number;
  label: string;
  color: string;
  tag: string;
}

const CYCLE_MINUTES = 90;
const FALL_ASLEEP_MINUTES = 14;

function padTime(h: number, m: number): string {
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function addMinutes(hours: number, minutes: number, add: number): { h: number; m: number } {
  let total = hours * 60 + minutes + add;
  total = ((total % 1440) + 1440) % 1440;
  return { h: Math.floor(total / 60), m: total % 60 };
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (m === 0) return `${h} ч`;
  return `${h} ч ${m} мин`;
}

function getColor(durationMin: number): string {
  const hours = durationMin / 60;
  if (hours >= 7.5 && hours <= 9) return '#2e7d32';
  if (hours >= 6 && hours < 7.5) return '#f57c00';
  return '#d32f2f';
}

function getTag(durationMin: number): string {
  const hours = durationMin / 60;
  if (hours >= 7.5 && hours <= 9) return 'Рекомендуется';
  if (hours >= 6 && hours < 7.5) return 'Допустимо';
  return 'Недостаточно';
}

const TIPS = [
  'Ложитесь и вставайте в одно и то же время каждый день, даже в выходные.',
  'Избегайте кофеина за 6 часов до сна и тяжёлой еды за 2–3 часа.',
  'Выключите экраны (телефон, ТВ, ноутбук) за 30–60 минут до сна.',
  'Поддерживайте температуру в спальне 18–20 °C и проветривайте комнату.',
  'Физическая активность днём улучшает качество сна, но не тренируйтесь перед сном.',
  'Короткий дневной сон (до 20 мин) полезен, но длинный нарушает ночной режим.',
];

export default function SleepCalc() {
  const theme = useTheme();
  const [mode, setMode] = useState<Mode>('bedtime');
  const [time, setTime] = useState('');

  const options = useMemo((): SleepOption[] => {
    if (!time) return [];
    const [hStr, mStr] = time.split(':');
    const h = parseInt(hStr, 10);
    const m = parseInt(mStr, 10);
    if (isNaN(h) || isNaN(m)) return [];

    const results: SleepOption[] = [];

    if (mode === 'bedtime') {
      // Given bedtime, calculate wake-up times (4–6 cycles)
      for (let cycles = 6; cycles >= 4; cycles--) {
        const sleepMin = cycles * CYCLE_MINUTES;
        const totalMin = sleepMin + FALL_ASLEEP_MINUTES;
        const wake = addMinutes(h, m, totalMin);
        results.push({
          time: padTime(wake.h, wake.m),
          cycles,
          duration: sleepMin,
          label: `Подъём в ${padTime(wake.h, wake.m)}`,
          color: getColor(sleepMin),
          tag: getTag(sleepMin)
        });
      }
    } else {
      // Given wake-up time, calculate bedtimes (4–6 cycles)
      for (let cycles = 6; cycles >= 4; cycles--) {
        const sleepMin = cycles * CYCLE_MINUTES;
        const totalMin = sleepMin + FALL_ASLEEP_MINUTES;
        const bed = addMinutes(h, m, -totalMin);
        results.push({
          time: padTime(bed.h, bed.m),
          cycles,
          duration: sleepMin,
          label: `Лечь в ${padTime(bed.h, bed.m)}`,
          color: getColor(sleepMin),
          tag: getTag(sleepMin)
        });
      }
    }

    return results;
  }, [time, mode]);

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto' }}>
      {/* Mode & Input */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 2,
          borderRadius: 3,
          background: theme.palette.surfaceContainerLow
        }}
      >
        <Box sx={{ display: 'flex', gap: 1.5, mb: 2.5, flexWrap: 'wrap' }}>
          {([
            { key: 'bedtime' as Mode, label: 'Я знаю время отхода ко сну' },
            { key: 'wakeup' as Mode, label: 'Я знаю время подъёма' },
          ]).map((opt) => {
            const isActive = mode === opt.key;
            return (
              <Paper
                key={opt.key}
                elevation={0}
                onClick={() => setMode(opt.key)}
                sx={{
                  px: 2.5,
                  py: 1.5,
                  cursor: 'pointer',
                  borderRadius: 2,
                  border: `1.5px solid ${isActive ? theme.palette.primary.main : theme.palette.divider}`,
                  background: isActive
                    ? theme.palette.surfaceContainerHigh
                    : 'transparent',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    background: theme.palette.surfaceContainerLow
                  }
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? 'primary.main' : 'text.primary'
                  }}
                >
                  {opt.label}
                </Typography>
              </Paper>
            );
          })}
        </Box>

        <TextField
          fullWidth
          type="time"
          label={mode === 'bedtime' ? 'Время отхода ко сну' : 'Время подъёма'}
          value={time}
          onChange={(e) => setTime(e.target.value)}
          slotProps={{
            inputLabel: { shrink: true }
          }}
        />

        <Typography variant="caption" color="text.disabled" sx={{ mt: 1, display: 'block' }}>
          Учитывается ~14 минут на засыпание. Цикл сна — 90 минут.
        </Typography>
      </Paper>

      {/* Results */}
      {options.length > 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 2,
            borderRadius: 3
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', mb: 2 }}>
            {mode === 'bedtime'
              ? 'Оптимальное время подъёма'
              : 'Оптимальное время отхода ко сну'}
          </Typography>

          <Grid container spacing={2}>
            {options.map((opt) => (
              <Grid key={opt.cycles} size={{ xs: 12, sm: 4 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    textAlign: 'center',
                    borderRadius: 3,
                    background: alpha(opt.color, 0.05),
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: `0 4px 16px ${alpha(opt.color, 0.15)}`
                    }
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: opt.color, mb: 0.5 }}
                  >
                    {opt.time}
                  </Typography>
                  <Chip
                    label={opt.tag}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      color: '#fff',
                      backgroundColor: opt.color,
                      fontSize: '0.75rem',
                      mb: 1.5
                    }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {opt.cycles} {opt.cycles === 6 ? 'циклов' : opt.cycles === 5 ? 'циклов' : 'цикла'}
                  </Typography>
                  <Typography variant="caption" color="text.disabled">
                    {formatDuration(opt.duration)} сна
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* Cycle explanation */}
      {options.length > 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 2,
            borderRadius: 3
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', mb: 1.5 }}>
            Цветовая шкала
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {[
              { color: '#2e7d32', label: 'Рекомендуется', desc: '7.5–9 часов (5–6 циклов)' },
              { color: '#f57c00', label: 'Допустимо', desc: '6 часов (4 цикла)' },
              { color: '#d32f2f', label: 'Недостаточно', desc: 'менее 6 часов' },
            ].map((item) => (
              <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: item.color,
                    flexShrink: 0
                  }}
                />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: item.color }}>
                    {item.label}
                  </Typography>
                  <Typography variant="caption" color="text.disabled">
                    {item.desc}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Paper>
      )}

      {/* Sleep hygiene tips */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          background: alpha('#7b1fa2', 0.03)
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', mb: 2 }}>
          Советы по гигиене сна
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {TIPS.map((tip, i) => (
            <Box key={i} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  backgroundColor: alpha('#7b1fa2', 0.1),
                  color: '#7b1fa2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}
              >
                {i + 1}
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                {tip}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
}
