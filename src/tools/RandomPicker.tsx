'use client';

import React, { useState, useRef, useCallback } from 'react';
import {
  Box, Typography, Paper, Grid, Button, Chip, TextField, alpha, useTheme, Slider
} from '@mui/material';
import { Casino } from '@mui/icons-material';

const DEFAULT_ITEMS = 'Вариант 1\nВариант 2\nВариант 3\nВариант 4\nВариант 5';

export default function RandomPicker() {
  const theme = useTheme();
  const [text, setText] = useState(DEFAULT_ITEMS);
  const [pickCount, setPickCount] = useState(1);
  const [removePicked, setRemovePicked] = useState(false);
  const [result, setResult] = useState<string[]>([]);
  const [animating, setAnimating] = useState(false);
  const [animText, setAnimText] = useState('');
  const [history, setHistory] = useState<{ items: string[]; time: string }[]>([]);
  const animRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const getItems = useCallback(() => {
    return text.split('\n').map(s => s.trim()).filter(Boolean);
  }, [text]);

  const pick = useCallback(() => {
    const items = getItems();
    if (items.length === 0 || animating) return;

    const count = Math.min(pickCount, items.length);
    setAnimating(true);
    setResult([]);
    setAnimText('');

    let tick = 0;
    const totalTicks = 18;
    animRef.current = setInterval(() => {
      tick++;
      const randomIdx = Math.floor(Math.random() * items.length);
      setAnimText(items[randomIdx]);

      if (tick >= totalTicks) {
        if (animRef.current) clearInterval(animRef.current);

        const shuffled = [...items].sort(() => Math.random() - 0.5);
        const picked = shuffled.slice(0, count);

        setResult(picked);
        setAnimText('');
        setAnimating(false);

        const now = new Date();
        const timeStr = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setHistory(prev => [{ items: picked, time: timeStr }, ...prev].slice(0, 20));

        if (removePicked) {
          const remaining = items.filter(item => !picked.includes(item));
          setText(remaining.join('\n'));
        }
      }
    }, 60);
  }, [getItems, pickCount, animating, removePicked]);

  const items = getItems();

  return (
    <Box sx={{
      maxWidth: 800,
      mx: 'auto',
      mb: 2,
      borderRadius: 3,
      bgcolor: theme.palette.surfaceContainerLow,
      p: { xs: 2, sm: 3 },
      transition: 'background 0.2s ease',
      '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) }
    }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Элементы (по одному на строку)
          </Typography>
          <TextField
            multiline
            minRows={5}
            maxRows={10}
            fullWidth
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Введите варианты..."
            disabled={animating}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': { borderRadius: 3 }
            }}
          />

          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Элементов: {items.length}
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Выбрать: {pickCount}
            </Typography>
            <Slider
              value={pickCount}
              onChange={(_, val) => setPickCount(val as number)}
              min={1}
              max={Math.max(1, items.length)}
              step={1}
              marks={items.length <= 10 ? items.map((_, i) => ({ value: i + 1 })) : undefined}
              disabled={animating || items.length === 0}
              sx={{ mx: 1 }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Chip
              label={removePicked ? 'Удалять выбранные: Вкл' : 'Удалять выбранные: Выкл'}
              onClick={() => setRemovePicked(!removePicked)}
              sx={{
                fontWeight: 600,
                cursor: 'pointer',
                bgcolor: removePicked
                  ? alpha(theme.palette.warning.main, 0.15)
                  : theme.palette.surfaceContainerLow,
                color: removePicked ? theme.palette.warning.dark : theme.palette.text.primary
              }}
            />
          </Box>

          <Button
            variant="contained"
            fullWidth
            size="large"
            startIcon={<Casino />}
            onClick={pick}
            disabled={animating || items.length === 0}
            sx={{ borderRadius: 6, py: 1.2 }}
          >
            {animating
              ? 'Выбираю...'
              : pickCount === 1
                ? 'Выбрать один'
                : `Выбрать ${pickCount}`}
          </Button>

          {items.length === 0 && (
            <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
              Список пуст. Добавьте элементы.
            </Typography>
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          {animating && (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                bgcolor: theme.palette.surfaceContainerHigh,
                textAlign: 'center',
                mb: 2
              }}
            >
              <Typography
                variant="h3"
                fontWeight={700}
                color="primary"
                sx={{
                  transition: 'opacity 0.05s',
                  animation: 'pulse 0.15s infinite alternate',
                  '@keyframes pulse': {
                    '0%': { opacity: 0.6, transform: 'scale(0.97)' },
                    '100%': { opacity: 1, transform: 'scale(1.03)' }
                  }
                }}
              >
                {animText}
              </Typography>
            </Paper>
          )}

          {!animating && result.length > 0 && (
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: alpha(theme.palette.success.main, 0.08),
                textAlign: 'center',
                mb: 2
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {result.length === 1 ? 'Результат' : `Выбрано: ${result.length}`}
              </Typography>
              {result.length === 1 ? (
                <Typography variant="h3" fontWeight={700} color="success.main">
                  {result[0]}
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center', mt: 1.5 }}>
                  {result.map((r, i) => (
                    <Chip
                      key={i}
                      label={r}
                      sx={{
                        fontWeight: 700,
                        fontSize: '1rem',
                        py: 2.5,
                        px: 1,
                        bgcolor: alpha(theme.palette.success.main, 0.12),
                        color: theme.palette.success.dark
                      }}
                    />
                  ))}
                </Box>
              )}
            </Paper>
          )}

          {!animating && result.length === 0 && (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                bgcolor: theme.palette.surfaceContainerLow,
                textAlign: 'center'
              }}
            >
              <Casino sx={{ fontSize: 48, color: theme.palette.text.secondary, mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Нажмите кнопку, чтобы выбрать случайный элемент
              </Typography>
            </Paper>
          )}

          {history.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                История выбора ({history.length})
              </Typography>
              {history.map((h, i) => (
                <Box
                  key={i}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 0.75,
                    py: 0.5,
                    px: 1,
                    borderRadius: 2,
                    bgcolor: i === 0 ? alpha(theme.palette.success.main, 0.05) : 'transparent'
                  }}
                >
                  <Typography variant="caption" color="text.secondary" sx={{ minWidth: 55 }}>
                    {h.time}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {h.items.map((item, j) => (
                      <Chip
                        key={j}
                        label={item}
                        size="small"
                        sx={{
                          fontWeight: i === 0 ? 700 : 400,
                          bgcolor: i === 0
                            ? alpha(theme.palette.success.main, 0.12)
                            : theme.palette.surfaceContainerLow
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
