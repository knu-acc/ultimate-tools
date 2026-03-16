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
import { useLanguage } from '@/src/i18n/LanguageContext';

interface StatCard {
  label: string;
  value: string;
  suffix?: string;
  color: string;
}

export default function ReadingTime() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
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
    if (seconds === 0) return isEn ? '0 sec' : '0 сек';
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    if (m === 0) return `${s} ${isEn ? 'sec' : 'сек'}`;
    if (s === 0) return `${m} ${isEn ? 'min' : 'мин'}`;
    return `${m} ${isEn ? 'min' : 'мин'} ${s} ${isEn ? 'sec' : 'сек'}`;
  }

  const statCards: StatCard[] = [
    {
      label: isEn ? 'Reading time' : 'Время чтения',
      value: formatTime(stats.readingTimeSec),
      suffix: isEn ? '~200 w/min' : '~200 сл/мин',
      color: theme.palette.primary.main
    },
    {
      label: isEn ? 'Speaking time' : 'Время речи',
      value: formatTime(stats.speakingTimeSec),
      suffix: isEn ? '~130 w/min' : '~130 сл/мин',
      color: theme.palette.secondary.main
    },
    {
      label: isEn ? 'Words' : 'Слова',
      value: stats.wordCount.toLocaleString(isEn ? 'en-US' : 'ru-RU'),
      color: theme.palette.info.main
    },
    {
      label: isEn ? 'Characters' : 'Символы',
      value: stats.charCount.toLocaleString(isEn ? 'en-US' : 'ru-RU'),
      suffix: isEn ? `no spaces: ${stats.charNoSpaces.toLocaleString('en-US')}` : `без пробелов: ${stats.charNoSpaces.toLocaleString('ru-RU')}`,
      color: theme.palette.success.main
    },
    {
      label: isEn ? 'Sentences' : 'Предложения',
      value: stats.sentenceCount.toLocaleString(isEn ? 'en-US' : 'ru-RU'),
      color: theme.palette.warning.main
    },
    {
      label: isEn ? 'Paragraphs' : 'Абзацы',
      value: stats.paragraphCount.toLocaleString(isEn ? 'en-US' : 'ru-RU'),
      color: theme.palette.error.main
    },
  ];

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
        <TextField
          multiline
          minRows={6}
          maxRows={16}
          fullWidth
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={isEn ? "Text..." : "Текст..."}
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
                backgroundColor: alpha(card.color, 0.06),
                transition: 'all 200ms ease',
                '&:hover': { backgroundColor: alpha(card.color, 0.1) }
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

      <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
          <Chip
            label={isEn ? `Avg word length: ${stats.avgWordLength.toFixed(1)} chars` : `Средняя длина слова: ${stats.avgWordLength.toFixed(1)} симв.`}
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              backgroundColor: theme.palette.surfaceContainerHigh,
              color: theme.palette.primary.dark,
            }}
          />
          <Chip
            label={isEn ? `Characters without spaces: ${stats.charNoSpaces.toLocaleString('en-US')}` : `Символов без пробелов: ${stats.charNoSpaces.toLocaleString('ru-RU')}`}
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              backgroundColor: alpha(theme.palette.success.main, 0.08),
              color: theme.palette.success.dark,
            }}
          />
          <Chip
            label={isEn ? `Words per sentence: ${stats.sentenceCount > 0 ? (stats.wordCount / stats.sentenceCount).toFixed(1) : '0'}` : `Слов в предложении: ${stats.sentenceCount > 0 ? (stats.wordCount / stats.sentenceCount).toFixed(1) : '0'}`}
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
