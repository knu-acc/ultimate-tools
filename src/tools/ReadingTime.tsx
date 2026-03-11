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

interface StatCard {
  label: string;
  value: string;
  suffix?: string;
  color: string;
}

export default function ReadingTime() {
  const theme = useTheme();
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const charCount = text.length;
    const charNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim() ? text.trim().split(/\s+/) : [];
    const wordCount = words.length;
    const sentenceCount = text.trim()
      ? (text.match(/[.!?…]+/g) || []).length || (text.trim() ? 1 : 0)
      : 0;
    const paragraphCount = text.trim()
      ? text.split(/\n\s*\n/).filter((p) => p.trim()).length
      : 0;

    const readingTimeSec = wordCount > 0 ? (wordCount / 200) * 60 : 0;
    const speakingTimeSec = wordCount > 0 ? (wordCount / 130) * 60 : 0;

    const avgWordLength =
      wordCount > 0
        ? words.reduce((sum, w) => sum + w.replace(/[^a-zA-Zа-яёА-ЯЁ0-9]/g, '').length, 0) / wordCount
        : 0;

    return {
      charCount,
      charNoSpaces,
      wordCount,
      sentenceCount,
      paragraphCount,
      readingTimeSec,
      speakingTimeSec,
      avgWordLength
    };
  }, [text]);

  function formatTime(seconds: number): string {
    if (seconds === 0) return '0 сек';
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    if (m === 0) return `${s} сек`;
    if (s === 0) return `${m} мин`;
    return `${m} мин ${s} сек`;
  }

  const statCards: StatCard[] = [
    {
      label: 'Время чтения',
      value: formatTime(stats.readingTimeSec),
      suffix: '~200 сл/мин',
      color: theme.palette.primary.main
    },
    {
      label: 'Время речи',
      value: formatTime(stats.speakingTimeSec),
      suffix: '~130 сл/мин',
      color: theme.palette.secondary.main
    },
    {
      label: 'Слова',
      value: stats.wordCount.toLocaleString('ru-RU'),
      color: theme.palette.info.main
    },
    {
      label: 'Символы',
      value: stats.charCount.toLocaleString('ru-RU'),
      suffix: `без пробелов: ${stats.charNoSpaces.toLocaleString('ru-RU')}`,
      color: theme.palette.success.main
    },
    {
      label: 'Предложения',
      value: stats.sentenceCount.toLocaleString('ru-RU'),
      color: theme.palette.warning.main
    },
    {
      label: 'Абзацы',
      value: stats.paragraphCount.toLocaleString('ru-RU'),
      color: theme.palette.error.main
    },
  ];

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 2,
          borderRadius: 3,
          background: theme.palette.surfaceContainerLow
        }}
      >
        <TextField
          multiline
          minRows={6}
          maxRows={16}
          fullWidth
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Текст..."
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              fontSize: '1rem',
              lineHeight: 1.7
            }
          }}
        />
      </Paper>

      <Grid container spacing={1.5} sx={{ mb: 2 }}>
        {statCards.map((card) => (
          <Grid size={{ xs: 6, md: 4 }} key={card.label}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                textAlign: 'center',
                borderRadius: 3,
                backgroundColor: alpha(card.color, 0.06)
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 700, color: card.color, mb: 0.5 }}>
                {card.value}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                {card.label}
              </Typography>
              {card.suffix && (
                <Typography variant="caption" sx={{ color: alpha(card.color, 0.7), fontSize: '0.65rem', display: 'block', mt: 0.3 }}>
                  {card.suffix}
                </Typography>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
          <Chip
            label={`Средняя длина слова: ${stats.avgWordLength.toFixed(1)} симв.`}
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              backgroundColor: theme.palette.surfaceContainerHigh,
              color: theme.palette.primary.dark,
            }}
          />
          <Chip
            label={`Символов без пробелов: ${stats.charNoSpaces.toLocaleString('ru-RU')}`}
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              backgroundColor: alpha(theme.palette.success.main, 0.08),
              color: theme.palette.success.dark,
            }}
          />
          <Chip
            label={`Слов в предложении: ${stats.sentenceCount > 0 ? (stats.wordCount / stats.sentenceCount).toFixed(1) : '0'}`}
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              backgroundColor: alpha(theme.palette.warning.main, 0.08),
              color: theme.palette.warning.dark,
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
}
