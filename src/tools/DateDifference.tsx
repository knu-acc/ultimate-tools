'use client';

import { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  TextField,
  Chip,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CalculateIcon from '@mui/icons-material/Calculate';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { useLanguage } from '@/src/i18n/LanguageContext';

interface DateResult {
  days: number;
  weeks: number;
  months: number;
  years: number;
  hours: number;
  minutes: number;
  seconds: number;
  readable: string;
}

export default function DateDifference() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [result, setResult] = useState<DateResult | null>(null);

  const calculateDifference = useCallback(() => {
    if (!dateFrom || !dateTo) return;

    const from = new Date(dateFrom);
    const to = new Date(dateTo);
    const diffMs = Math.abs(to.getTime() - from.getTime());

    const totalSeconds = Math.floor(diffMs / 1000);
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);

    // Calculate months and years more precisely
    const earlier = from < to ? from : to;
    const later = from < to ? to : from;

    let years = later.getFullYear() - earlier.getFullYear();
    let months = later.getMonth() - earlier.getMonth();
    if (months < 0) {
      years--;
      months += 12;
    }
    if (later.getDate() < earlier.getDate()) {
      months--;
      if (months < 0) {
        years--;
        months += 12;
      }
    }
    const totalMonths = years * 12 + months;

    // Build readable string
    const parts: string[] = [];
    if (isEn) {
      if (years > 0) parts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
      if (months > 0) parts.push(`${months % 12} ${months % 12 === 1 ? 'month' : 'months'}`);
      const remainingDays = totalDays - Math.floor(totalMonths * 30.4375);
      if (remainingDays > 0 && remainingDays < 31)
        parts.push(`${remainingDays} ${remainingDays === 1 ? 'day' : 'days'}`);
    } else {
      if (years > 0) parts.push(`${years} ${declension(years, 'год', 'года', 'лет')}`);
      if (months > 0) parts.push(`${months % 12} ${declension(months % 12, 'месяц', 'месяца', 'месяцев')}`);
      const remainingDays = totalDays - Math.floor(totalMonths * 30.4375);
      if (remainingDays > 0 && remainingDays < 31)
        parts.push(`${remainingDays} ${declension(remainingDays, 'день', 'дня', 'дней')}`);
    }

    setResult({
      days: totalDays,
      weeks: totalWeeks,
      months: totalMonths,
      years,
      hours: totalHours,
      minutes: totalMinutes,
      seconds: totalSeconds,
      readable: parts.length > 0 ? parts.join(', ') : (isEn ? '0 days' : '0 дней')
    });
  }, [dateFrom, dateTo]);

  const swapDates = () => {
    setDateFrom(dateTo);
    setDateTo(dateFrom);
  };

  const setToday = (setter: (v: string) => void) => {
    setter(new Date().toISOString().split('T')[0]);
  };

  function declension(n: number, one: string, few: string, many: string): string {
    const abs = Math.abs(n) % 100;
    const lastDigit = abs % 10;
    if (abs > 10 && abs < 20) return many;
    if (lastDigit > 1 && lastDigit < 5) return few;
    if (lastDigit === 1) return one;
    return many;
  }

  const loc = isEn ? 'en-US' : 'ru-RU';
  const resultItems = result
    ? [
        { label: isEn ? 'Days' : 'Дни', value: result.days.toLocaleString(loc) },
        { label: isEn ? 'Weeks' : 'Недели', value: result.weeks.toLocaleString(loc) },
        { label: isEn ? 'Months' : 'Месяцы', value: result.months.toLocaleString(loc) },
        { label: isEn ? 'Years' : 'Годы', value: result.years.toLocaleString(loc) },
        { label: isEn ? 'Hours' : 'Часы', value: result.hours.toLocaleString(loc) },
        { label: isEn ? 'Minutes' : 'Минуты', value: result.minutes.toLocaleString(loc) },
        { label: isEn ? 'Seconds' : 'Секунды', value: result.seconds.toLocaleString(loc) },
      ]
    : [];

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 2,
          borderRadius: 3,
          background: theme.palette.surfaceContainerLow
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 5 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: 'text.secondary' }}>
              {isEn ? 'Start date' : 'Начальная дата'}
            </Typography>
            <TextField
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <CalendarTodayIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                  )
                }
              }}
            />
            <Button size="small" onClick={() => setToday(setDateFrom)} sx={{ mt: 0.5 }}>
              {isEn ? 'Today' : 'Сегодня'}
            </Button>
          </Grid>

          <Grid size={{ xs: 12, md: 2 }} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              onClick={swapDates}
              sx={{ minWidth: 48, width: 48, height: 48, borderRadius: '50%', p: 0 }}
            >
              <SwapHorizIcon />
            </Button>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: 'text.secondary' }}>
              {isEn ? 'End date' : 'Конечная дата'}
            </Typography>
            <TextField
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <CalendarTodayIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                  )
                }
              }}
            />
            <Button size="small" onClick={() => setToday(setDateTo)} sx={{ mt: 0.5 }}>
              {isEn ? 'Today' : 'Сегодня'}
            </Button>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<CalculateIcon />}
            onClick={calculateDifference}
            disabled={!dateFrom || !dateTo}
            sx={{ px: 5 }}
          >
            {isEn ? 'Calculate' : 'Рассчитать'}
          </Button>
        </Box>
      </Paper>

      {result && (
        <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
          <Box sx={{ mb: 2, textAlign: 'center' }}>
            <Chip
              label={result.readable}
              color="primary"
              sx={{ fontSize: '1.1rem', py: 2.5, px: 2, fontWeight: 500 }}
            />
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            {resultItems.map((item) => (
              <Grid size={{ xs: 6, sm: 4, md: 3 }} key={item.label}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    borderRadius: 3,
                    backgroundColor: theme.palette.surfaceContainerLow,
                    transitionProperty: 'background-color', transitionDuration: '200ms', transitionTimingFunction: 'ease',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.04)
                    }
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}>
                    {item.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}
    </Box>
  );
}
