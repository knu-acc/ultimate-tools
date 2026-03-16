'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Grid,
  Button,
  Chip,
  IconButton,
  MenuItem,
  useTheme,
  alpha
} from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useLanguage } from '@/src/i18n/LanguageContext';

interface TimezoneOption {
  label: string;
  offset: number;
}

const TIMEZONES: TimezoneOption[] = [
  { label: 'UTC-12:00', offset: -12 },
  { label: 'UTC-11:00', offset: -11 },
  { label: 'UTC-10:00 (HST)', offset: -10 },
  { label: 'UTC-9:00 (AKST)', offset: -9 },
  { label: 'UTC-8:00 (PST)', offset: -8 },
  { label: 'UTC-7:00 (MST)', offset: -7 },
  { label: 'UTC-6:00 (CST)', offset: -6 },
  { label: 'UTC-5:00 (EST)', offset: -5 },
  { label: 'UTC-4:00 (AST)', offset: -4 },
  { label: 'UTC-3:00 (BRT)', offset: -3 },
  { label: 'UTC-2:00', offset: -2 },
  { label: 'UTC-1:00', offset: -1 },
  { label: 'UTC+0:00 (GMT/WET)', offset: 0 },
  { label: 'UTC+1:00 (CET)', offset: 1 },
  { label: 'UTC+2:00 (EET)', offset: 2 },
  { label: 'UTC+3:00 (MSK)', offset: 3 },
  { label: 'UTC+3:30 (IRST)', offset: 3.5 },
  { label: 'UTC+4:00 (GST)', offset: 4 },
  { label: 'UTC+4:30 (AFT)', offset: 4.5 },
  { label: 'UTC+5:00 (PKT)', offset: 5 },
  { label: 'UTC+5:30 (IST)', offset: 5.5 },
  { label: 'UTC+5:45 (NPT)', offset: 5.75 },
  { label: 'UTC+6:00 (BST)', offset: 6 },
  { label: 'UTC+7:00 (ICT)', offset: 7 },
  { label: 'UTC+8:00 (CST/SGT)', offset: 8 },
  { label: 'UTC+9:00 (JST/KST)', offset: 9 },
  { label: 'UTC+9:30 (ACST)', offset: 9.5 },
  { label: 'UTC+10:00 (AEST)', offset: 10 },
  { label: 'UTC+11:00 (SBT)', offset: 11 },
  { label: 'UTC+12:00 (NZST)', offset: 12 },
  { label: 'UTC+13:00', offset: 13 },
  { label: 'UTC+14:00', offset: 14 },
];

function padTwo(n: number): string {
  return String(n).padStart(2, '0');
}

function getNowString(): { date: string; time: string } {
  const now = new Date();
  const y = now.getFullYear();
  const m = padTwo(now.getMonth() + 1);
  const d = padTwo(now.getDate());
  const h = padTwo(now.getHours());
  const min = padTwo(now.getMinutes());
  return { date: `${y}-${m}-${d}`, time: `${h}:${min}` };
}

function getLocalUtcOffset(): number {
  return -(new Date().getTimezoneOffset() / 60);
}

function convertTime(
  date: string,
  time: string,
  sourceOffset: number,
  targetOffset: number
): { date: string; time: string; dayShift: number } {
  if (!date || !time) return { date: '', time: '', dayShift: 0 };

  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);

  const sourceDate = new Date(Date.UTC(year, month - 1, day, hour, minute));
  const diffMs = (targetOffset - sourceOffset) * 3600000;
  const targetDate = new Date(sourceDate.getTime() + diffMs);

  const origDay = new Date(Date.UTC(year, month - 1, day));
  const newDay = new Date(Date.UTC(targetDate.getUTCFullYear(), targetDate.getUTCMonth(), targetDate.getUTCDate()));
  const dayShift = Math.round((newDay.getTime() - origDay.getTime()) / 86400000);

  return {
    date: `${targetDate.getUTCFullYear()}-${padTwo(targetDate.getUTCMonth() + 1)}-${padTwo(targetDate.getUTCDate())}`,
    time: `${padTwo(targetDate.getUTCHours())}:${padTwo(targetDate.getUTCMinutes())}`,
    dayShift
  };
}

function formatDiff(sourceOffset: number, targetOffset: number, isEn: boolean): string {
  const diff = targetOffset - sourceOffset;
  const absDiff = Math.abs(diff);
  const hours = Math.floor(absDiff);
  const minutes = (absDiff % 1) * 60;
  const sign = diff >= 0 ? '+' : '-';
  if (minutes > 0) {
    return isEn ? `${sign}${hours}h ${minutes}min` : `${sign}${hours} ч ${minutes} мин`;
  }
  return isEn ? `${sign}${hours}h` : `${sign}${hours} ч`;
}

export default function TimezoneConverter() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';

  const localOffset = getLocalUtcOffset();
  const closestIdx = TIMEZONES.findIndex((tz) => tz.offset === localOffset);
  const defaultSourceIdx = closestIdx >= 0 ? closestIdx : TIMEZONES.findIndex((tz) => tz.offset === 3);

  const { date: nowDate, time: nowTime } = getNowString();
  const [sourceIdx, setSourceIdx] = useState(defaultSourceIdx);
  const [date, setDate] = useState(nowDate);
  const [time, setTime] = useState(nowTime);
  const [targetIndices, setTargetIndices] = useState<number[]>([
    TIMEZONES.findIndex((tz) => tz.offset === 0),
    TIMEZONES.findIndex((tz) => tz.offset === -5),
    TIMEZONES.findIndex((tz) => tz.offset === 9),
  ]);

  const handleSetNow = () => {
    const { date: d, time: t } = getNowString();
    setDate(d);
    setTime(t);
  };

  const swapWithFirst = () => {
    if (targetIndices.length === 0) return;
    const firstTarget = targetIndices[0];
    const result = convertTime(date, time, TIMEZONES[sourceIdx].offset, TIMEZONES[firstTarget].offset);
    setSourceIdx(firstTarget);
    setTargetIndices([sourceIdx, ...targetIndices.slice(1)]);
    if (result.date && result.time) {
      setDate(result.date);
      setTime(result.time);
    }
  };

  const addTarget = () => {
    const usedOffsets = new Set([TIMEZONES[sourceIdx].offset, ...targetIndices.map((i) => TIMEZONES[i].offset)]);
    const next = TIMEZONES.findIndex((tz) => !usedOffsets.has(tz.offset));
    if (next >= 0) setTargetIndices([...targetIndices, next]);
  };

  const removeTarget = (idx: number) => {
    setTargetIndices(targetIndices.filter((_, i) => i !== idx));
  };

  const updateTarget = (pos: number, newIdx: number) => {
    const copy = [...targetIndices];
    copy[pos] = newIdx;
    setTargetIndices(copy);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          p: { xs: 2, sm: 3 },
          backgroundColor: theme.palette.surfaceContainerLow
        }}
      >
        {/* Source */}
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
          {isEn ? 'Source time' : 'Исходное время'}
        </Typography>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              select
              label={isEn ? 'Timezone' : 'Часовой пояс'}
              value={sourceIdx}
              onChange={(e) => setSourceIdx(Number(e.target.value))}
              fullWidth
              size="small"
            >
              {TIMEZONES.map((tz, i) => (
                <MenuItem key={i} value={i}>
                  {tz.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <TextField
              label={isEn ? 'Date' : 'Дата'}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              fullWidth
              size="small"
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <TextField
              label={isEn ? 'Time' : 'Время'}
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              fullWidth
              size="small"
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 2 }}>
            <Button
              variant="outlined"
              onClick={handleSetNow}
              fullWidth
              startIcon={<AccessTimeIcon />}
              sx={{ height: '100%' }}
            >
              {isEn ? 'Now' : 'Сейчас'}
            </Button>
          </Grid>
        </Grid>

        {/* Swap button */}
        {targetIndices.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <IconButton
              onClick={swapWithFirst}
              sx={{
                borderRadius: 2
              }}
            >
              <SwapHorizIcon />
            </IconButton>
          </Box>
        )}

        {/* Targets */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {isEn ? 'Target timezones' : 'Целевые часовые пояса'}
          </Typography>
          <Button size="small" startIcon={<AddIcon />} onClick={addTarget}>
            {isEn ? 'Add' : 'Добавить'}
          </Button>
        </Box>

        {targetIndices.map((tIdx, pos) => {
          const result = convertTime(date, time, TIMEZONES[sourceIdx].offset, TIMEZONES[tIdx].offset);
          const diff = formatDiff(TIMEZONES[sourceIdx].offset, TIMEZONES[tIdx].offset, isEn);

          return (
            <Paper
              key={pos}
              elevation={0}
              sx={{
                borderRadius: 3,
                p: 2,
                mb: 2,
                backgroundColor: theme.palette.surfaceContainerHigh,
                transition: 'all 200ms ease',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.04)
                }
              }}
            >
              <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    select
                    label={isEn ? 'Timezone' : 'Часовой пояс'}
                    value={tIdx}
                    onChange={(e) => updateTarget(pos, Number(e.target.value))}
                    fullWidth
                    size="small"
                  >
                    {TIMEZONES.map((tz, i) => (
                      <MenuItem key={i} value={i}>
                        {tz.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {isEn ? 'Date' : 'Дата'}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: 'monospace',
                        fontSize: '1.1rem',
                        fontWeight: 500
                      }}
                    >
                      {result.date || '—'}
                    </Typography>
                    {result.dayShift !== 0 && (
                      <Chip
                        label={result.dayShift > 0
                          ? (isEn ? `+${result.dayShift} d` : `+${result.dayShift} дн.`)
                          : (isEn ? `${result.dayShift} d` : `${result.dayShift} дн.`)}
                        size="small"
                        color={result.dayShift > 0 ? 'info' : 'warning'}
                        sx={{ mt: 0.5 }}
                      />
                    )}
                  </Box>
                </Grid>
                <Grid size={{ xs: 4, sm: 3 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {isEn ? 'Time' : 'Время'}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: 'monospace',
                        fontSize: '1.5rem',
                        fontWeight: 400,
                        color: 'primary.main'
                      }}
                    >
                      {result.time || '—'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 2, sm: 2 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                    <Chip label={diff} size="small" variant="outlined" />
                    <IconButton size="small" onClick={() => removeTarget(pos)} color="error">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          );
        })}

        {targetIndices.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">
              {isEn ? 'Add a target timezone to convert' : 'Добавьте целевой часовой пояс для конвертации'}
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
