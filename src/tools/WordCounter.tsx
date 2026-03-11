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
  InputAdornment
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

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

  const statCards = [
    { label: 'Символы', value: stats.chars.toLocaleString('ru-RU'), color: theme.palette.primary.main },
    { label: 'Слова', value: stats.words.toLocaleString('ru-RU'), color: theme.palette.secondary.main },
    { label: 'Предложения', value: stats.sentences.toLocaleString('ru-RU'), color: theme.palette.info.main },
    { label: 'Абзацы', value: stats.paragraphs.toLocaleString('ru-RU'), color: theme.palette.success.main },
    { label: 'Чтение', value: stats.readingTime < 1 ? '< 1 мин' : `${stats.readingTime} мин`, color: theme.palette.warning.main },
    { label: 'Речь', value: stats.speakingTime < 1 ? '< 1 мин' : `${stats.speakingTime} мин`, color: theme.palette.error.main },
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
              ) : undefined
            }
          }}
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
          <Grid size={{ xs: 6, md: 4, lg: 2 }} key={card.label}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                textAlign: 'center',
                borderRadius: 3,
                backgroundColor: alpha(card.color, 0.06)
              }}
            >
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: card.color, mb: 0.5 }}
              >
                {card.value}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', fontWeight: 500 }}
              >
                {card.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {stats.topWords.length > 0 && (
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, mb: 2 }}>
            Частые слова
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {stats.topWords.map(([word, count], index) => (
              <Chip
                key={word}
                label={`${word} (${count})`}
                size="medium"
                sx={{
                  borderRadius: 2,
                  fontWeight: 600,
                  backgroundColor: alpha(theme.palette.primary.main, 0.08 + (10 - index) * 0.015),
                  color: theme.palette.primary.dark
                }}
              />
            ))}
          </Box>
        </Paper>
      )}
    </Box>
  );
}
