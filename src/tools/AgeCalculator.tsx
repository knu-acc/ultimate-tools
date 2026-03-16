'use client';

import { useState, useMemo, useEffect } from 'react';
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

const DAYS_RU = [
  'Воскресенье',
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота',
];

const DAYS_EN = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const MONTHS_RU = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
];

const MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function pluralizeRu(n: number, one: string, few: string, many: string): string {
  const abs = Math.abs(n);
  const mod10 = abs % 10;
  const mod100 = abs % 100;
  if (mod100 >= 11 && mod100 <= 19) return `${n} ${many}`;
  if (mod10 === 1) return `${n} ${one}`;
  if (mod10 >= 2 && mod10 <= 4) return `${n} ${few}`;
  return `${n} ${many}`;
}

function pluralizeEn(n: number, one: string, many: string): string {
  return n === 1 ? `${n} ${one}` : `${n} ${many}`;
}

function calcAge(birthDate: Date, now: Date) {
  let years = now.getFullYear() - birthDate.getFullYear();
  let months = now.getMonth() - birthDate.getMonth();
  let days = now.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days };
}

function getNextBirthday(birthDate: Date, now: Date) {
  const thisYear = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  const target = thisYear > now ? thisYear : new Date(now.getFullYear() + 1, birthDate.getMonth(), birthDate.getDate());
  const diff = target.getTime() - now.getTime();
  const totalDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
  const m = Math.floor(totalDays / 30);
  const d = totalDays - m * 30;
  return { totalDays, months: m, days: d, date: target };
}

export default function AgeCalculator() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const [birthInput, setBirthInput] = useState('');
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const birthDate = useMemo(() => {
    if (!birthInput) return null;
    const d = new Date(birthInput + 'T00:00:00');
    if (isNaN(d.getTime())) return null;
    if (d > now) return null;
    return d;
  }, [birthInput, now]);

  const age = useMemo(() => {
    if (!birthDate) return null;
    return calcAge(birthDate, now);
  }, [birthDate, now]);

  const stats = useMemo(() => {
    if (!birthDate) return null;
    const diffMs = now.getTime() - birthDate.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = (now.getFullYear() - birthDate.getFullYear()) * 12 + (now.getMonth() - birthDate.getMonth());
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    return { totalDays, totalWeeks, totalMonths, totalHours };
  }, [birthDate, now]);

  const nextBday = useMemo(() => {
    if (!birthDate) return null;
    return getNextBirthday(birthDate, now);
  }, [birthDate, now]);

  const dayOfWeek = useMemo(() => {
    if (!birthDate) return null;
    return isEn ? DAYS_EN[birthDate.getDay()] : DAYS_RU[birthDate.getDay()];
  }, [birthDate, isEn]);

  const formattedBirth = useMemo(() => {
    if (!birthDate) return '';
    return isEn
      ? `${(isEn ? MONTHS_EN : MONTHS_RU)[birthDate.getMonth()]} ${birthDate.getDate()}, ${birthDate.getFullYear()}`
      : `${birthDate.getDate()} ${MONTHS_RU[birthDate.getMonth()]} ${birthDate.getFullYear()} г.`;
  }, [birthDate, isEn]);

  const accentColor = theme.palette.primary.main;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
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
          label={isEn ? 'Date of birth' : 'Дата рождения'}
          value={birthInput}
          onChange={(e) => setBirthInput(e.target.value)}
          slotProps={{
            inputLabel: { shrink: true },
            input: {
              inputProps: {
                max: now.toISOString().split('T')[0]
              }
            }
          }}
        />
        {birthInput && !birthDate && (
          <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
            {isEn ? 'Invalid date or date is in the future' : 'Некорректная дата или дата в будущем'}
          </Typography>
        )}
      </Paper>

      {age && birthDate && stats && nextBday && (
        <>
          {/* Main age */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 2,
              borderRadius: 18,
              textAlign: 'center',
              background: alpha(accentColor, 0.04)
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              {isEn ? 'Your age' : 'Ваш возраст'}
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 700, color: accentColor }}>
              {isEn ? pluralizeEn(age.years, 'year', 'years') : pluralizeRu(age.years, 'год', 'года', 'лет')}
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mt: 0.5 }}>
              {isEn ? pluralizeEn(age.months, 'month', 'months') : pluralizeRu(age.months, 'месяц', 'месяца', 'месяцев')}{isEn ? ' and ' : ' и '}
              {isEn ? pluralizeEn(age.days, 'day', 'days') : pluralizeRu(age.days, 'день', 'дня', 'дней')}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2, flexWrap: 'wrap' }}>
              <Chip
                label={`${dayOfWeek}`}
                variant="outlined"
                sx={{ borderColor: accentColor, color: accentColor, fontWeight: 500 }}
              />
              <Chip
                label={formattedBirth}
                variant="outlined"
                sx={{ borderColor: theme.palette.divider }}
              />
            </Box>
          </Paper>

          {/* Statistics */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 2,
              borderRadius: 18
            }}
          >
            <Typography variant="body2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>
              {isEn ? 'Lived' : 'Прожито'}
            </Typography>
            <Grid container spacing={2}>
              {[
                {
                  label: isEn ? 'Days' : 'Дней',
                  value: stats.totalDays.toLocaleString(isEn ? 'en-US' : 'ru-RU'),
                  color: '#2e7d32'
                },
                {
                  label: isEn ? 'Weeks' : 'Недель',
                  value: stats.totalWeeks.toLocaleString(isEn ? 'en-US' : 'ru-RU'),
                  color: '#1976d2'
                },
                {
                  label: isEn ? 'Months' : 'Месяцев',
                  value: stats.totalMonths.toLocaleString(isEn ? 'en-US' : 'ru-RU'),
                  color: '#7b1fa2'
                },
                {
                  label: isEn ? 'Hours' : 'Часов',
                  value: stats.totalHours.toLocaleString(isEn ? 'en-US' : 'ru-RU'),
                  color: '#f57c00'
                },
              ].map((item) => (
                <Grid size={{ xs: 6, sm: 3 }} key={item.label}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      borderRadius: 18,
                      background: alpha(item.color, 0.06),
                      transitionProperty: 'background-color', transitionDuration: '200ms', transitionTimingFunction: 'ease',
                      '&:hover': {
                        background: alpha(item.color, 0.1)
                      }
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {item.label}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: item.color }}>
                      {item.value}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Next birthday countdown */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 18,
              background: alpha('#e91e63', 0.04)
            }}
          >
            <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 600, color: 'text.secondary' }}>
              {isEn ? 'Until birthday' : 'До дня рождения'}
            </Typography>
            {nextBday.totalDays === 0 ? (
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#e91e63' }}>
                {isEn ? 'Happy birthday!' : 'С днём рождения!'}
              </Typography>
            ) : (
              <>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#e91e63' }}>
                  {isEn ? pluralizeEn(nextBday.totalDays, 'day', 'days') : pluralizeRu(nextBday.totalDays, 'день', 'дня', 'дней')}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {isEn
                    ? (nextBday.months > 0 ? `${pluralizeEn(nextBday.months, 'month', 'months')} and ` : '') + pluralizeEn(nextBday.days, 'day', 'days')
                    : (nextBday.months > 0 ? `${pluralizeRu(nextBday.months, 'месяц', 'месяца', 'месяцев')} и ` : '') + pluralizeRu(nextBday.days, 'день', 'дня', 'дней')
                  }
                </Typography>
                <Chip
                  label={isEn ? `You will turn ${age.years + 1}` : `Вам исполнится ${age.years + 1} ${age.years + 1 === 1 ? 'год' : (age.years + 1 >= 2 && age.years + 1 <= 4) || (age.years + 1 >= 22 && age.years + 1 <= 24) ? 'года' : 'лет'}`}
                  sx={{
                    mt: 1.5,
                    fontWeight: 500,
                    backgroundColor: alpha('#e91e63', 0.1),
                    color: '#e91e63'
                  }}
                />
              </>
            )}
          </Paper>
        </>
      )}
    </Box>
  );
}
