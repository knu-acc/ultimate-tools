'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Grid,
  Chip,
  Button,
  useTheme,
  alpha,
  InputAdornment,
} from '@mui/material';
import AbcIcon from '@mui/icons-material/Abc';
import NotesIcon from '@mui/icons-material/Notes';
import ShortTextIcon from '@mui/icons-material/ShortText';
import SubjectIcon from '@mui/icons-material/Subject';
import TimerIcon from '@mui/icons-material/Timer';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import ClearIcon from '@mui/icons-material/Clear';
import TagIcon from '@mui/icons-material/Tag';

interface StatCard {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

export default function WordCounter() {
  const theme = useTheme();
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const chars = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentences = text.trim()
      ? (text.match(/[.!?]+/g) || []).length || (text.trim() ? 1 : 0)
      : 0;
    const paragraphs = text.trim()
      ? text.split(/\n\s*\n/).filter((p) => p.trim()).length
      : 0;
    const readingTime = Math.ceil(words / 200);
    const speakingTime = Math.ceil(words / 130);

    const wordFreq: Record<string, number> = {};
    if (text.trim()) {
      text
        .toLowerCase()
        .replace(/[^a-zа-яёA-ZА-ЯЁ0-9\s]/g, '')
        .split(/\s+/)
        .filter((w) => w.length > 2)
        .forEach((w) => {
          wordFreq[w] = (wordFreq[w] || 0) + 1;
        });
    }
    const topWords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    return { chars, words, sentences, paragraphs, readingTime, speakingTime, topWords };
  }, [text]);

  const handleClear = useCallback(() => setText(''), []);

  function declMinutes(n: number): string {
    const abs = Math.abs(n) % 100;
    const last = abs % 10;
    if (abs > 10 && abs < 20) return 'мин';
    if (last > 1 && last < 5) return 'мин';
    if (last === 1) return 'мин';
    return 'мин';
  }

  const statCards: StatCard[] = [
    {
      label: 'Символы',
      value: stats.chars.toLocaleString('ru-RU'),
      icon: <AbcIcon />,
      color: theme.palette.primary.main,
    },
    {
      label: 'Слова',
      value: stats.words.toLocaleString('ru-RU'),
      icon: <NotesIcon />,
      color: theme.palette.secondary.main,
    },
    {
      label: 'Предложения',
      value: stats.sentences.toLocaleString('ru-RU'),
      icon: <ShortTextIcon />,
      color: theme.palette.info.main,
    },
    {
      label: 'Абзацы',
      value: stats.paragraphs.toLocaleString('ru-RU'),
      icon: <SubjectIcon />,
      color: theme.palette.success.main,
    },
    {
      label: 'Время чтения',
      value: stats.readingTime < 1 ? '< 1' : `${stats.readingTime}`,
      icon: <TimerIcon />,
      color: theme.palette.warning.main,
    },
    {
      label: 'Время речи',
      value: stats.speakingTime < 1 ? '< 1' : `${stats.speakingTime}`,
      icon: <RecordVoiceOverIcon />,
      color: theme.palette.error.main,
    },
  ];

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      {/* Textarea */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 3,
        }}
      >
        <TextField
          multiline
          minRows={8}
          maxRows={20}
          fullWidth
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Вставьте или введите текст..."
          variant="outlined"
          slotProps={{
            input: {
              endAdornment: text.length > 0 ? (
                <InputAdornment position="end" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<ClearIcon />}
                    onClick={handleClear}
                    sx={{ textTransform: 'none', fontWeight: 600 }}
                  >
                    Очистить
                  </Button>
                </InputAdornment>
              ) : undefined,
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              fontSize: '1rem',
              lineHeight: 1.7,
            },
          }}
        />
      </Paper>

      {/* Stat Cards Grid */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {statCards.map((card) => (
          <Grid size={{ xs: 6, md: 4, lg: 2 }} key={card.label}>
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
                  boxShadow: `0 4px 20px ${alpha(card.color, 0.15)}`,
                },
              }}
            >
              <Box
                sx={{
                  display: 'inline-flex',
                  p: 1,
                  borderRadius: 2,
                  backgroundColor: alpha(card.color, 0.12),
                  color: card.color,
                  mb: 1.5,
                }}
              >
                {card.icon}
              </Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: card.color,
                  lineHeight: 1.2,
                  mb: 0.5,
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
                }}
              >
                {card.label}
                {(card.label === 'Время чтения' || card.label === 'Время речи') &&
                  ` (${declMinutes(
                    card.label === 'Время чтения' ? stats.readingTime : stats.speakingTime
                  )})`}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Top Words */}
      {stats.topWords.length > 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <TagIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
            <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              Топ-10 частых слов
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {stats.topWords.map(([word, count], index) => (
              <Chip
                key={word}
                label={`${word} (${count})`}
                size="medium"
                sx={{
                  borderRadius: 2,
                  fontWeight: 600,
                  backgroundColor: alpha(
                    theme.palette.primary.main,
                    0.08 + (10 - index) * 0.015
                  ),
                  color: theme.palette.primary.dark,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.16),
                  },
                }}
              />
            ))}
          </Box>
        </Paper>
      )}
    </Box>
  );
}
