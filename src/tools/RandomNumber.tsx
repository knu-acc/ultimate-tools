'use client';

import React, { useState } from 'react';
import {
  Box, Typography, TextField, Paper, Grid, Button, Chip, alpha, useTheme, Divider,
} from '@mui/material';
import { Casino, ContentCopy, Refresh } from '@mui/icons-material';

export default function RandomNumber() {
  const theme = useTheme();
  const [min, setMin] = useState('1');
  const [max, setMax] = useState('100');
  const [count, setCount] = useState('1');
  const [results, setResults] = useState<number[]>([]);
  const [history, setHistory] = useState<number[][]>([]);
  const [unique, setUnique] = useState(false);

  const generate = () => {
    const minNum = parseInt(min) || 0;
    const maxNum = parseInt(max) || 100;
    const countNum = Math.min(parseInt(count) || 1, unique ? (maxNum - minNum + 1) : 1000);

    if (minNum > maxNum) return;

    const nums: number[] = [];
    if (unique) {
      const pool = Array.from({ length: maxNum - minNum + 1 }, (_, i) => minNum + i);
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      nums.push(...pool.slice(0, countNum));
    } else {
      for (let i = 0; i < countNum; i++) {
        nums.push(Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum);
      }
    }

    setResults(nums);
    setHistory(prev => [nums, ...prev].slice(0, 10));
  };

  const quickRanges = [
    { label: '1-10', min: '1', max: '10' },
    { label: '1-100', min: '1', max: '100' },
    { label: '1-1000', min: '1', max: '1000' },
    { label: '0-1', min: '0', max: '1' },
    { label: '1-6 (кубик)', min: '1', max: '6' },
    { label: '1-52 (карты)', min: '1', max: '52' },
  ];

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Grid container spacing={2}>
            <Grid size={6}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Минимум
              </Typography>
              <TextField
                fullWidth
                type="number"
                value={min}
                onChange={(e) => setMin(e.target.value)}
              />
            </Grid>
            <Grid size={6}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Максимум
              </Typography>
              <TextField
                fullWidth
                type="number"
                value={max}
                onChange={(e) => setMax(e.target.value)}
              />
            </Grid>
          </Grid>

          <Typography variant="subtitle2" fontWeight={600} sx={{ mt: 2 }} gutterBottom>
            Количество
          </Typography>
          <TextField
            fullWidth
            type="number"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            inputProps={{ min: 1, max: 1000 }}
            sx={{ mb: 2 }}
          />

          <Chip
            label={unique ? 'Уникальные числа' : 'С повторами'}
            onClick={() => setUnique(!unique)}
            sx={{
              bgcolor: unique ? alpha(theme.palette.primary.main, 0.12) : alpha(theme.palette.primary.main, 0.05),
              fontWeight: unique ? 600 : 400,
              mb: 2,
            }}
          />

          <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mb: 2 }}>
            {quickRanges.map((r) => (
              <Chip
                key={r.label}
                label={r.label}
                size="small"
                onClick={() => { setMin(r.min); setMax(r.max); }}
                sx={{
                  cursor: 'pointer',
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) },
                }}
              />
            ))}
          </Box>

          <Button
            variant="contained"
            fullWidth
            startIcon={<Casino />}
            onClick={generate}
            sx={{ borderRadius: '20px', py: 1.2 }}
          >
            Генерировать
          </Button>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          {results.length > 0 ? (
            <>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: alpha(theme.palette.primary.main, 0.06),
                  textAlign: 'center',
                  mb: 2,
                }}
              >
                {results.length === 1 ? (
                  <Typography variant="h2" fontWeight={700} color="primary">
                    {results[0]}
                  </Typography>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {results.map((num, i) => (
                      <Chip
                        key={i}
                        label={num}
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.9rem',
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                        }}
                      />
                    ))}
                  </Box>
                )}
              </Paper>

              {results.length > 1 && (
                <Paper
                  elevation={0}
                  sx={{ p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.03) }}
                >
                  <Grid container spacing={1}>
                    <Grid size={4}>
                      <Typography variant="caption" color="text.secondary">Мин</Typography>
                      <Typography variant="body1" fontWeight={600}>{Math.min(...results)}</Typography>
                    </Grid>
                    <Grid size={4}>
                      <Typography variant="caption" color="text.secondary">Макс</Typography>
                      <Typography variant="body1" fontWeight={600}>{Math.max(...results)}</Typography>
                    </Grid>
                    <Grid size={4}>
                      <Typography variant="caption" color="text.secondary">Среднее</Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {(results.reduce((a, b) => a + b, 0) / results.length).toFixed(1)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              )}

              <Button
                size="small"
                startIcon={<ContentCopy />}
                onClick={() => navigator.clipboard.writeText(results.join(', '))}
                sx={{ mt: 1, borderRadius: '16px' }}
              >
                Копировать
              </Button>
            </>
          ) : (
            <Paper
              elevation={0}
              sx={{ p: 4, borderRadius: 3, bgcolor: alpha(theme.palette.primary.main, 0.04), textAlign: 'center' }}
            >
              <Casino sx={{ fontSize: 48, color: theme.palette.text.secondary, mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Нажмите «Генерировать» для получения случайных чисел
              </Typography>
            </Paper>
          )}

          {history.length > 1 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                История
              </Typography>
              {history.slice(1, 6).map((nums, i) => (
                <Typography key={i} variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace', mb: 0.5 }}>
                  {nums.join(', ')}
                </Typography>
              ))}
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
