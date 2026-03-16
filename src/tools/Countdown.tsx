'use client';

import { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, TextField, Grid, alpha, useTheme,
} from '@mui/material';
import { useLanguage } from '@/src/i18n/LanguageContext';

export default function Countdown() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const [targetDate, setTargetDate] = useState('');
  const [targetName, setTargetName] = useState('');
  const [now, setNow] = useState(0);

  useEffect(() => {
    setNow(Date.now()); // Sync immediately on mount
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const target = targetDate ? new Date(targetDate).getTime() : 0;
  const diff = target - now;
  const isPast = diff < 0;
  const absDiff = Math.abs(diff);

  const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((absDiff % (1000 * 60)) / 1000);

  const totalHours = Math.floor(absDiff / (1000 * 60 * 60));
  const totalMinutes = Math.floor(absDiff / (1000 * 60));
  const totalSeconds = Math.floor(absDiff / 1000);

  return (
    <Box sx={{
      maxWidth: 800,
      mx: 'auto',
      mb: 2,
      borderRadius: 18,
      bgcolor: theme.palette.surfaceContainerLow,
      p: { xs: 2, sm: 3 },
      transition: 'background 0.2s ease',
      '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) }
    }}>
      <Paper elevation={0} sx={{ p: 3, borderRadius: 18, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth value={targetName} onChange={e => setTargetName(e.target.value)} placeholder={isEn ? 'New Year, Birthday...' : 'Новый год, День рождения...'} size="small" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth type="datetime-local" value={targetDate} onChange={e => setTargetDate(e.target.value)} size="small" />
          </Grid>
        </Grid>
      </Paper>

      {target > 0 && (
        <>
          <Typography variant="h6" textAlign="center" gutterBottom fontWeight={600}>
            {targetName || (isEn ? 'Countdown' : 'Обратный отсчёт')} {isPast ? (isEn ? '(elapsed)' : '(прошло)') : ''}
          </Typography>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            {[
              { label: isEn ? 'Days' : 'Дней', value: days, color: theme.palette.primary.main },
              { label: isEn ? 'Hours' : 'Часов', value: hours, color: theme.palette.success.main },
              { label: isEn ? 'Minutes' : 'Минут', value: minutes, color: theme.palette.warning.main },
              { label: isEn ? 'Seconds' : 'Секунд', value: seconds, color: theme.palette.error.main },
            ].map(item => (
              <Grid size={{ xs: 6, sm: 3 }} key={item.label}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 18, bgcolor: alpha(item.color, 0.08), textAlign: 'center' }}>
                  <Typography variant="h2" fontWeight={700} sx={{ color: item.color, fontFamily: 'monospace' }}>
                    {item.value.toString().padStart(2, '0')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>{item.label}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Paper elevation={0} sx={{ p: 2, borderRadius: 18, bgcolor: theme.palette.surfaceContainerLow }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>{isEn ? 'Also equals:' : 'Также это:'}</Typography>
            <Typography variant="body2" color="text.secondary">
              {totalHours.toLocaleString(isEn ? 'en-US' : 'ru-RU')} {isEn ? 'hours' : 'часов'} • {totalMinutes.toLocaleString(isEn ? 'en-US' : 'ru-RU')} {isEn ? 'minutes' : 'минут'} • {totalSeconds.toLocaleString(isEn ? 'en-US' : 'ru-RU')} {isEn ? 'seconds' : 'секунд'}
            </Typography>
          </Paper>
        </>
      )}
    </Box>
  );
}
