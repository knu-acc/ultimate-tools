'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Grid,
  Button,
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import { CopyButton } from '@/src/components/CopyButton';
import { useLanguage } from '@/src/i18n/LanguageContext';


function formatRelative(date: Date, now: Date, isEn: boolean): string {
  const diffMs = now.getTime() - date.getTime();
  const future = diffMs < 0;
  const abs = Math.abs(diffMs);
  const seconds = Math.floor(abs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (isEn) {
    const pluralEn = (n: number, word: string) => n === 1 ? `${n} ${word}` : `${n} ${word}s`;
    let text: string;
    if (seconds < 60) text = pluralEn(seconds, 'second');
    else if (minutes < 60) text = pluralEn(minutes, 'minute');
    else if (hours < 24) text = pluralEn(hours, 'hour');
    else if (days < 30) text = pluralEn(days, 'day');
    else if (months < 12) text = pluralEn(months, 'month');
    else text = pluralEn(years, 'year');
    return future ? `in ${text}` : `${text} ago`;
  }

  const pluralize = (n: number, one: string, few: string, many: string) => {
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod100 >= 11 && mod100 <= 19) return `${n} ${many}`;
    if (mod10 === 1) return `${n} ${one}`;
    if (mod10 >= 2 && mod10 <= 4) return `${n} ${few}`;
    return `${n} ${many}`;
  };

  let text: string;
  if (seconds < 60) text = pluralize(seconds, 'секунду', 'секунды', 'секунд');
  else if (minutes < 60) text = pluralize(minutes, 'минуту', 'минуты', 'минут');
  else if (hours < 24) text = pluralize(hours, 'час', 'часа', 'часов');
  else if (days < 30) text = pluralize(days, 'день', 'дня', 'дней');
  else if (months < 12) text = pluralize(months, 'месяц', 'месяца', 'месяцев');
  else text = pluralize(years, 'год', 'года', 'лет');

  return future ? `через ${text}` : `${text} назад`;
}

export default function UnixTimestamp() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000));
  const [tsInput, setTsInput] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [timeInput, setTimeInput] = useState('');
  useEffect(() => {
    const timer = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(timer);
  }, []);

  // Timestamp -> Date conversion
  const tsResult = useMemo(() => {
    if (!tsInput.trim()) return null;
    const num = Number(tsInput.trim());
    if (isNaN(num)) return null;
    // Handle seconds vs milliseconds
    const ms = num > 1e12 ? num : num * 1000;
    const date = new Date(ms);
    if (isNaN(date.getTime())) return null;
    return {
      date,
      iso: date.toISOString(),
      locale: date.toLocaleString(isEn ? 'en-US' : 'ru-RU', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
      utc: date.toUTCString(),
      relative: formatRelative(date, new Date(), isEn)
    };
  }, [tsInput, now]);

  // Date -> Timestamp conversion
  const dateResult = useMemo(() => {
    if (!dateInput) return null;
    const dateStr = timeInput ? `${dateInput}T${timeInput}` : `${dateInput}T00:00:00`;
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return null;
    const ts = Math.floor(date.getTime() / 1000);
    const tsMs = date.getTime();
    return { ts, tsMs, date };
  }, [dateInput, timeInput]);

  const accentColor = theme.palette.primary.main;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Current timestamp */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 2,
          borderRadius: 3,
          textAlign: 'center',
          background: alpha(accentColor, 0.04)
        }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          {isEn ? 'Current Unix timestamp' : 'Текущая метка времени Unix'}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: accentColor,
              fontFamily: 'monospace'
            }}
          >
            {now}
          </Typography>
          <CopyButton text={String(now)} />
        </Box>
        <Typography variant="caption" color="text.secondary">
          {new Date(now * 1000).toLocaleString(isEn ? 'en-US' : 'ru-RU')}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
          <Chip
            label={isEn ? 'Seconds' : 'Секунды'}
            size="small"
            sx={{ backgroundColor: alpha(accentColor, 0.1), color: accentColor, fontWeight: 500 }}
          />
          <Chip
            label={isEn ? `Ms: ${now * 1000}` : `Мс: ${now * 1000}`}
            size="small"
            variant="outlined"
            sx={{
              borderColor: theme.palette.divider,
              color: 'text.secondary'
            }}
          />
        </Box>
      </Paper>

      {/* Timestamp -> Date */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 2,
          borderRadius: 3
        }}
      >
        <Typography variant="body2" sx={{ mb: 2, fontWeight: 500, color: 'text.secondary' }}>
          {isEn ? 'Timestamp to date' : 'Метка времени в дату'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            fullWidth
            placeholder="1700000000"
            value={tsInput}
            onChange={(e) => setTsInput(e.target.value)}
            type="number"
          />
          <Button
            variant="outlined"
            onClick={() => setTsInput(String(now))}
            sx={{ whiteSpace: 'nowrap', minWidth: 'auto', px: 2, borderRadius: 2 }}
          >
            {isEn ? 'Now' : 'Сейчас'}
          </Button>
        </Box>

        {tsInput && !tsResult && (
          <Typography variant="caption" color="error">
            {isEn ? 'Invalid timestamp' : 'Некорректная метка времени'}
          </Typography>
        )}

        {tsResult && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {[
              { label: 'ISO 8601', value: tsResult.iso, field: 'tsIso' },
              { label: isEn ? 'Local format' : 'Локальный формат', value: tsResult.locale, field: 'tsLocale' },
              { label: 'UTC', value: tsResult.utc, field: 'tsUtc' },
              { label: isEn ? 'Relative' : 'Относительно', value: tsResult.relative, field: 'tsRel' },
            ].map((item) => (
              <Paper
                key={item.field}
                elevation={0}
                sx={{
                  p: 1.5,
                  px: 2,
                  borderRadius: 2,
                  border: `1px solid ${alpha(accentColor, 0.15)}`,
                  background: alpha(accentColor, 0.02),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 200ms ease',
                  '&:hover': {
                    background: alpha(accentColor, 0.06)
                  }
                }}
              >
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {item.label}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, fontFamily: item.field !== 'tsRel' ? 'monospace' : 'inherit' }}
                  >
                    {item.value}
                  </Typography>
                </Box>
                <CopyButton text={item.value} />
              </Paper>
            ))}
          </Box>
        )}
      </Paper>

      {/* Date -> Timestamp */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 3
        }}
      >
        <Typography variant="body2" sx={{ mb: 2, fontWeight: 500, color: 'text.secondary' }}>
          {isEn ? 'Date to timestamp' : 'Дата в метку времени'}
        </Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, sm: 7 }}>
            <TextField
              fullWidth
              type="date"
              label={isEn ? 'Date' : 'Дата'}
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 5 }}>
            <TextField
              fullWidth
              type="time"
              label={isEn ? 'Time' : 'Время'}
              value={timeInput}
              onChange={(e) => setTimeInput(e.target.value)}
              slotProps={{
                inputLabel: { shrink: true },
                input: { inputProps: { step: 1 } }
              }}
            />
          </Grid>
        </Grid>
        <Button
          variant="outlined"
          size="small"
          onClick={() => {
            const d = new Date();
            setDateInput(d.toISOString().split('T')[0]);
            setTimeInput(d.toTimeString().slice(0, 8));
          }}
          sx={{ mb: 2, borderRadius: 2 }}
        >
          {isEn ? 'Current date and time' : 'Текущая дата и время'}
        </Button>

        {dateInput && !dateResult && (
          <Typography variant="caption" color="error" sx={{ display: 'block', mb: 1 }}>
            {isEn ? 'Invalid date' : 'Некорректная дата'}
          </Typography>
        )}

        {dateResult && (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  textAlign: 'center',
                  borderRadius: 3,
                  border: `1px solid ${alpha('#2e7d32', 0.2)}`,
                  background: alpha('#2e7d32', 0.04)
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {isEn ? 'Seconds' : 'Секунды'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#2e7d32', fontFamily: 'monospace' }}>
                    {dateResult.ts}
                  </Typography>
                  <CopyButton text={String(dateResult.ts)} />
                </Box>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  textAlign: 'center',
                  borderRadius: 3,
                  border: `1px solid ${alpha('#1976d2', 0.2)}`,
                  background: alpha('#1976d2', 0.04)
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {isEn ? 'Milliseconds' : 'Миллисекунды'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1976d2', fontFamily: 'monospace' }}>
                    {dateResult.tsMs}
                  </Typography>
                  <CopyButton text={String(dateResult.tsMs)} />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Paper>
    </Box>
  );
}
