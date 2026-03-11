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
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      {/* Ввод текста */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3
        }}
      >
        <TextField
          multiline
          minRows={8}
          maxRows={20}
          fullWidth
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Вставьте или введите текст для анализа времени чтения..."
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

      {/* Карточки статистики */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {statCards.map((card) => (
          <Grid size={{ xs: 6, md: 4 }} key={card.label}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                textAlign: 'center',
                borderRadius: 3,
                backgroundColor: alpha(card.color, 0.06),
                border: `1px solid ${alpha(card.color, 0.15)}`,
                transition: 'transform 150ms ease, box-shadow 150ms ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 4px 20px ${alpha(card.color, 0.15)}`
                }
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: card.color,
                  lineHeight: 1.2,
                  mb: 0.5
                }}
              >
                {card.value}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  display: 'block'
                }}
              >
                {card.label}
              </Typography>
              {card.suffix && (
                <Typography
                  variant="caption"
                  sx={{
                    color: alpha(card.color, 0.7),
                    fontSize: '0.68rem',
                    display: 'block',
                    mt: 0.5
                  }}
                >
                  {card.suffix}
                </Typography>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Средняя длина слова */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3
        }}
      >
        <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600, mb: 2 }}>
          Дополнительная статистика
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
          <Chip
            label={`Средняя длина слова: ${stats.avgWordLength.toFixed(1)} симв.`}
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              backgroundColor: theme.palette.surfaceContainerHigh,
              color: theme.palette.primary.dark,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
            }}
          />
          <Chip
            label={`Символов без пробелов: ${stats.charNoSpaces.toLocaleString('ru-RU')}`}
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              backgroundColor: alpha(theme.palette.success.main, 0.08),
              color: theme.palette.success.dark,
              border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
            }}
          />
          <Chip
            label={`Слов в предложении: ${stats.sentenceCount > 0 ? (stats.wordCount / stats.sentenceCount).toFixed(1) : '0'}`}
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              backgroundColor: alpha(theme.palette.warning.main, 0.08),
              color: theme.palette.warning.dark,
              border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
}
