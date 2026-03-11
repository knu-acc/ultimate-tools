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
  useTheme,
  alpha,
  LinearProgress,
} from '@mui/material';
import TodayIcon from '@mui/icons-material/Today';
import SearchIcon from '@mui/icons-material/Search';

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const MONTHS_GEN = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
];

function padTwo(n: number): string {
  return String(n).padStart(2, '0');
}

function todayString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${padTwo(now.getMonth() + 1)}-${padTwo(now.getDate())}`;
}

function getISOWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date.getTime() - start.getTime()) / 86400000);
}

function getDaysInYear(year: number): number {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 366 : 365;
}

function getWeekDateRange(weekNum: number, year: number): { start: Date; end: Date } {
  // ISO week: week 1 contains Jan 4
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const dayOfWeek = jan4.getUTCDay() || 7;
  const monday = new Date(jan4);
  monday.setUTCDate(jan4.getUTCDate() - dayOfWeek + 1);
  // Move to desired week
  const start = new Date(monday);
  start.setUTCDate(monday.getUTCDate() + (weekNum - 1) * 7);
  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 6);
  return { start, end };
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

export default function WeekNumber() {
  const theme = useTheme();
  const [dateStr, setDateStr] = useState(todayString());
  const [reverseWeek, setReverseWeek] = useState('');
  const [reverseYear, setReverseYear] = useState(String(new Date().getFullYear()));

  const date = dateStr ? new Date(dateStr + 'T00:00:00') : null;
  const isValidDate = date && !isNaN(date.getTime());

  const weekNumber = isValidDate ? getISOWeekNumber(date) : 0;
  const dayOfYear = isValidDate ? getDayOfYear(date) : 0;
  const totalDays = isValidDate ? getDaysInYear(date.getFullYear()) : 365;
  const daysRemaining = totalDays - dayOfYear;
  const yearProgress = (dayOfYear / totalDays) * 100;

  // Reverse lookup
  const reverseWeekNum = parseInt(reverseWeek);
  const reverseYearNum = parseInt(reverseYear);
  const reverseValid = reverseWeekNum >= 1 && reverseWeekNum <= 53 && reverseYearNum >= 1900 && reverseYearNum <= 2100;
  const reverseRange = reverseValid ? getWeekDateRange(reverseWeekNum, reverseYearNum) : null;

  // Mini calendar data
  const calMonth = isValidDate ? date.getMonth() : new Date().getMonth();
  const calYear = isValidDate ? date.getFullYear() : new Date().getFullYear();
  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfWeek(calYear, calMonth);
  const today = new Date();

  // Determine which days are in the selected week
  const weekStart = isValidDate ? (() => {
    const d = new Date(date);
    const dow = d.getDay() || 7;
    d.setDate(d.getDate() - dow + 1);
    return d;
  })() : null;

  const weekEnd = weekStart ? (() => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 6);
    return d;
  })() : null;

  const isInWeek = (day: number): boolean => {
    if (!weekStart || !weekEnd) return false;
    const d = new Date(calYear, calMonth, day);
    return d >= weekStart && d <= weekEnd;
  };

  const isToday = (day: number): boolean =>
    day === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear();

  const isSelectedDay = (day: number): boolean =>
    !!(isValidDate && day === date.getDate() && calMonth === date.getMonth() && calYear === date.getFullYear());

  const calCells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) calCells.push(d);
  while (calCells.length % 7 !== 0) calCells.push(null);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 3,
          p: 3,
        }}
      >
        {/* Date input */}
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
          Номер недели по дате
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 8, sm: 6 }}>
            <TextField
              label="Дата"
              type="date"
              value={dateStr}
              onChange={(e) => setDateStr(e.target.value)}
              fullWidth
              size="small"
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
          <Grid size={{ xs: 4, sm: 3 }}>
            <Button
              variant="outlined"
              onClick={() => setDateStr(todayString())}
              fullWidth
              startIcon={<TodayIcon />}
              sx={{ height: '100%' }}
            >
              Сегодня
            </Button>
          </Grid>
        </Grid>

        {/* Results */}
        {isValidDate && (
          <>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Paper
                  elevation={0}
                  sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 3,
                    p: 2,
                    textAlign: 'center',
                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    ISO неделя
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '2rem',
                      fontWeight: 700,
                      color: 'primary.main',
                      fontFamily: 'monospace',
                    }}
                  >
                    {weekNumber}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Paper
                  elevation={0}
                  sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 3,
                    p: 2,
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    День года
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '2rem',
                      fontWeight: 700,
                      fontFamily: 'monospace',
                    }}
                  >
                    {dayOfYear}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Paper
                  elevation={0}
                  sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 3,
                    p: 2,
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Осталось дней
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '2rem',
                      fontWeight: 700,
                      fontFamily: 'monospace',
                    }}
                  >
                    {daysRemaining}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Paper
                  elevation={0}
                  sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 3,
                    p: 2,
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Всего дней
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '2rem',
                      fontWeight: 700,
                      fontFamily: 'monospace',
                    }}
                  >
                    {totalDays}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Year progress */}
            <Paper
              elevation={0}
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 3,
                p: 2,
                mb: 3,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Прогресс года
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                  {yearProgress.toFixed(1)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={yearProgress}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 5,
                  },
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  1 января
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  31 декабря
                </Typography>
              </Box>
            </Paper>

            {/* Mini calendar */}
            <Paper
              elevation={0}
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 3,
                p: 2,
                mb: 3,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5, textAlign: 'center' }}>
                {date.getDate()} {MONTHS_GEN[calMonth]} {calYear} — Неделя {weekNumber}
              </Typography>

              {/* Weekday headers */}
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0 }}>
                {WEEKDAYS.map((wd) => (
                  <Box key={wd} sx={{ textAlign: 'center', py: 0.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                      {wd}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Days */}
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0 }}>
                {calCells.map((day, idx) => {
                  if (day === null) return <Box key={`e-${idx}`} sx={{ height: 36 }} />;

                  const inWeek = isInWeek(day);
                  const todayMatch = isToday(day);
                  const selectedMatch = isSelectedDay(day);

                  return (
                    <Box
                      key={day}
                      sx={{
                        height: 36,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        backgroundColor: selectedMatch
                          ? 'primary.main'
                          : inWeek
                            ? alpha(theme.palette.primary.main, 0.12)
                            : todayMatch
                              ? alpha(theme.palette.warning.main, 0.12)
                              : 'transparent',
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: selectedMatch || todayMatch ? 700 : 400,
                          color: selectedMatch
                            ? 'primary.contrastText'
                            : 'text.primary',
                        }}
                      >
                        {day}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Paper>
          </>
        )}

        {/* Reverse lookup */}
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, mt: 1 }}>
          Обратный поиск: неделя → даты
        </Typography>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 5, sm: 4 }}>
            <TextField
              label="Номер недели"
              type="number"
              value={reverseWeek}
              onChange={(e) => setReverseWeek(e.target.value)}
              fullWidth
              size="small"
              slotProps={{ htmlInput: { min: 1, max: 53 } }}
            />
          </Grid>
          <Grid size={{ xs: 5, sm: 4 }}>
            <TextField
              label="Год"
              type="number"
              value={reverseYear}
              onChange={(e) => setReverseYear(e.target.value)}
              fullWidth
              size="small"
              slotProps={{ htmlInput: { min: 1900, max: 2100 } }}
            />
          </Grid>
          <Grid size={{ xs: 2, sm: 4 }}>
            <Button
              variant="outlined"
              disabled={!reverseValid}
              fullWidth
              sx={{ height: '100%' }}
              startIcon={<SearchIcon />}
              onClick={() => {
                // Just triggers display via state
                if (reverseValid && reverseRange) {
                  setDateStr(
                    `${reverseRange.start.getUTCFullYear()}-${padTwo(reverseRange.start.getUTCMonth() + 1)}-${padTwo(reverseRange.start.getUTCDate())}`
                  );
                }
              }}
            >
              Найти
            </Button>
          </Grid>
        </Grid>

        {reverseValid && reverseRange && (
          <Paper
            elevation={0}
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 3,
              p: 2,
              backgroundColor: alpha(theme.palette.info.main, 0.04),
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              Неделя {reverseWeekNum} / {reverseYearNum}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Chip
                label={`Начало: ${reverseRange.start.getUTCDate()} ${MONTHS_GEN[reverseRange.start.getUTCMonth()]} ${reverseRange.start.getUTCFullYear()}`}
                size="small"
                color="info"
                variant="outlined"
              />
              <Chip
                label={`Конец: ${reverseRange.end.getUTCDate()} ${MONTHS_GEN[reverseRange.end.getUTCMonth()]} ${reverseRange.end.getUTCFullYear()}`}
                size="small"
                color="info"
                variant="outlined"
              />
            </Box>
          </Paper>
        )}
      </Paper>
    </Box>
  );
}
