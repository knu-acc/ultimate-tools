'use client';

import React, { useState, useCallback } from 'react';
import {
  Box, Typography, Paper, Grid, Button, Chip, alpha, useTheme
} from '@mui/material';
import { Toll, Refresh } from '@mui/icons-material';

export default function CoinFlip() {
  const theme = useTheme();
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);
  const [flipping, setFlipping] = useState(false);
  const [stats, setStats] = useState({ heads: 0, tails: 0 });
  const [history, setHistory] = useState<('heads' | 'tails')[]>([]);

  const flip = useCallback(() => {
    setFlipping(true);
    // Animate for 600ms
    const interval = setInterval(() => {
      setResult(Math.random() > 0.5 ? 'heads' : 'tails');
    }, 80);

    setTimeout(() => {
      clearInterval(interval);
      const finalResult: 'heads' | 'tails' = Math.random() > 0.5 ? 'heads' : 'tails';
      setResult(finalResult);
      setFlipping(false);
      setStats(prev => ({
        ...prev,
        [finalResult]: prev[finalResult] + 1
      }));
      setHistory(prev => [finalResult, ...prev].slice(0, 50));
    }, 600);
  }, []);

  const reset = () => {
    setResult(null);
    setStats({ heads: 0, tails: 0 });
    setHistory([]);
  };

  const total = stats.heads + stats.tails;
  const headsPercent = total > 0 ? ((stats.heads / total) * 100).toFixed(1) : '0';
  const tailsPercent = total > 0 ? ((stats.tails / total) * 100).toFixed(1) : '0';

  return (
    <Box sx={{ textAlign: 'center' }}>
      {/* Coin display */}
      <Paper
        elevation={0}
        sx={{
          width: 180,
          height: 180,
          borderRadius: '50%',
          mx: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: result === 'heads'
            ? alpha('#FFD700', 0.15)
            : result === 'tails'
              ? alpha('#C0C0C0', 0.2)
              : theme.palette.surfaceContainerLow,
          border: `3px solid ${result === 'heads' ? '#FFD700' : result === 'tails' ? '#C0C0C0' : theme.palette.divider}`,
          transition: 'all 0.3s ease',
          transform: flipping ? 'rotateY(180deg)' : 'rotateY(0)',
          mb: 3
        }}
      >
        {result ? (
          <Box>
            <Typography variant="h3" fontWeight={700} sx={{ color: result === 'heads' ? '#B8860B' : '#708090' }}>
              {result === 'heads' ? 'О' : 'Р'}
            </Typography>
            <Typography variant="body2" fontWeight={600} sx={{ color: result === 'heads' ? '#B8860B' : '#708090' }}>
              {result === 'heads' ? 'Орёл' : 'Решка'}
            </Typography>
          </Box>
        ) : (
          <Toll sx={{ fontSize: 48, color: theme.palette.text.secondary }} />
        )}
      </Paper>

      <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', mb: 4 }}>
        <Button
          variant="contained"
          size="large"
          onClick={flip}
          disabled={flipping}
          sx={{ borderRadius: 6, px: 4 }}
        >
          {flipping ? 'Подбрасываю...' : 'Подбросить'}
        </Button>
        {total > 0 && (
          <Button
            variant="outlined"
            onClick={reset}
            startIcon={<Refresh />}
            sx={{ borderRadius: 6 }}
          >
            Сброс
          </Button>
        )}
      </Box>

      {/* Stats */}
      {total > 0 && (
        <Grid container spacing={2} sx={{ maxWidth: 500, mx: 'auto' }}>
          <Grid size={4}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 3,
                bgcolor: alpha('#FFD700', 0.08)
              }}
            >
              <Typography variant="h4" fontWeight={700} sx={{ color: '#B8860B' }}>
                {stats.heads}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Орёл ({headsPercent}%)
              </Typography>
            </Paper>
          </Grid>
          <Grid size={4}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 3,
                bgcolor: theme.palette.surfaceContainerLow
              }}
            >
              <Typography variant="h4" fontWeight={700}>
                {total}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Всего
              </Typography>
            </Paper>
          </Grid>
          <Grid size={4}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 3,
                bgcolor: alpha('#C0C0C0', 0.12)
              }}
            >
              <Typography variant="h4" fontWeight={700} sx={{ color: '#708090' }}>
                {stats.tails}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Решка ({tailsPercent}%)
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Distribution bar */}
      {total > 0 && (
        <Box sx={{ mt: 2, maxWidth: 500, mx: 'auto' }}>
          <Box sx={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden' }}>
            <Box sx={{ width: `${headsPercent}%`, bgcolor: '#FFD700', transition: 'width 0.3s' }} />
            <Box sx={{ width: `${tailsPercent}%`, bgcolor: '#C0C0C0', transition: 'width 0.3s' }} />
          </Box>
        </Box>
      )}

      {/* History */}
      {history.length > 0 && (
        <Box sx={{ mt: 3, maxWidth: 500, mx: 'auto' }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            История
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', justifyContent: 'center' }}>
            {history.map((r, i) => (
              <Chip
                key={i}
                label={r === 'heads' ? 'О' : 'Р'}
                size="small"
                sx={{
                  width: 28,
                  height: 28,
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  bgcolor: r === 'heads' ? alpha('#FFD700', 0.15) : alpha('#C0C0C0', 0.2),
                  color: r === 'heads' ? '#B8860B' : '#708090'
                }}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}
