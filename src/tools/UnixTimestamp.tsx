'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Grid,
  Button,
  IconButton,
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import ContentCopy from '@mui/icons-material/ContentCopy';
import { CopyButton, ShareButton } from '@/src/components/CopyButton';


function formatRelative(date: Date, now: Date): string {
  const diffMs = now.getTime() - date.getTime();
  const future = diffMs < 0;
  const abs = Math.abs(diffMs);
  const seconds = Math.floor(abs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

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
  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000));
  const [tsInput, setTsInput] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [timeInput, setTimeInput] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(timer);
  }, []);

  const copyToClipboard = useCallback((text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1500);
    });
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
      locale: date.toLocaleString('ru-RU', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
      utc: date.toUTCString(),
      relative: formatRelative(date, new Date())
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

  const CopyBtn = ({ value, field }: { value: string; field: string }) => (
    <IconButton
      size="small"
      onClick={() => copyToClipboard(value, field)}
      sx={{ color: copiedField === field ? '#2e7d32' : 'text.secondary' }}
    >
      <ContentCopy sx={{ fontSize: 16 }} />
    </IconButton>
  );

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto' }}>
      {/* Current timestamp */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          textAlign: 'center',
          background: alpha(accentColor, 0.04)
        }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          Текущая метка времени Unix
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
          <IconButton
            onClick={() => copyToClipboard(String(now), 'current')}
            sx={{ color: copiedField === 'current' ? '#2e7d32' : 'text.secondary' }}
          >
            <ContentCopy />
          </IconButton>
        </Box>
        <Typography variant="caption" color="text.secondary">
          {new Date(now * 1000).toLocaleString('ru-RU')}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
          <Chip
            label="Секунды"
            size="small"
            sx={{ backgroundColor: alpha(accentColor, 0.1), color: accentColor, fontWeight: 500 }}
          />
          <Chip
            label={`Мс: ${now * 1000}`}
            size="small"
            variant="outlined"
            onClick={() => copyToClipboard(String(now * 1000), 'currentMs')}
            sx={{
              cursor: 'pointer',
              borderColor: theme.palette.divider,
              color: copiedField === 'currentMs' ? '#2e7d32' : 'text.secondary'
            }}
          />
        </Box>
      </Paper>

      {/* Timestamp -> Date */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3
        }}
      >
        <Typography variant="body2" sx={{ mb: 2, fontWeight: 500, color: 'text.secondary' }}>
          Метка времени в дату
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            fullWidth
            label="Unix-метка времени"
            value={tsInput}
            onChange={(e) => setTsInput(e.target.value)}
            placeholder="1700000000"
            type="number"
          />
          <Button
            variant="outlined"
            onClick={() => setTsInput(String(now))}
            sx={{ whiteSpace: 'nowrap', minWidth: 'auto', px: 2, borderRadius: 2 }}
          >
            Сейчас
          </Button>
        </Box>

        {tsInput && !tsResult && (
          <Typography variant="caption" color="error">
            Некорректная метка времени
          </Typography>
        )}

        {tsResult && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {[
              { label: 'ISO 8601', value: tsResult.iso, field: 'tsIso' },
              { label: 'Локальный формат', value: tsResult.locale, field: 'tsLocale' },
              { label: 'UTC', value: tsResult.utc, field: 'tsUtc' },
              { label: 'Относительно', value: tsResult.relative, field: 'tsRel' },
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
                  justifyContent: 'space-between'
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
                <CopyBtn value={item.value} field={item.field} />
              </Paper>
            ))}
          </Box>
        )}
      </Paper>

      {/* Date -> Timestamp */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3
        }}
      >
        <Typography variant="body2" sx={{ mb: 2, fontWeight: 500, color: 'text.secondary' }}>
          Дата в метку времени
        </Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, sm: 7 }}>
            <TextField
              fullWidth
              type="date"
              label="Дата"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 5 }}>
            <TextField
              fullWidth
              type="time"
              label="Время"
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
          Текущая дата и время
        </Button>

        {dateInput && !dateResult && (
          <Typography variant="caption" color="error" sx={{ display: 'block', mb: 1 }}>
            Некорректная дата
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
                  Секунды
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#2e7d32', fontFamily: 'monospace' }}>
                    {dateResult.ts}
                  </Typography>
                  <CopyBtn value={String(dateResult.ts)} field="dateSec" />
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
                  Миллисекунды
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1976d2', fontFamily: 'monospace' }}>
                    {dateResult.tsMs}
                  </Typography>
                  <CopyBtn value={String(dateResult.tsMs)} field="dateMs" />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Paper>
    </Box>
  );
}
