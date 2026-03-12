'use client';

import React, { useState, useCallback } from 'react';
import {
  Box, Typography, Paper, Grid, Button, Chip, alpha, useTheme
} from '@mui/material';
import { Casino } from '@mui/icons-material';

const diceFaces: Record<number, string[]> = {
  1: ['⚀'], 2: ['⚁'], 3: ['⚂'], 4: ['⚃'], 5: ['⚄'], 6: ['⚅']
};

export default function DiceRoller() {
  const theme = useTheme();
  const [diceCount, setDiceCount] = useState(2);
  const [sides, setSides] = useState(6);
  const [results, setResults] = useState<number[]>([]);
  const [rolling, setRolling] = useState(false);
  const [history, setHistory] = useState<{ dice: number[]; sum: number }[]>([]);

  const roll = useCallback(() => {
    setRolling(true);

    let animCount = 0;
    const interval = setInterval(() => {
      const animResults = Array.from({ length: diceCount }, () =>
        Math.floor(Math.random() * sides) + 1
      );
      setResults(animResults);
      animCount++;
      if (animCount > 6) {
        clearInterval(interval);
        const finalResults = Array.from({ length: diceCount }, () =>
          Math.floor(Math.random() * sides) + 1
        );
        setResults(finalResults);
        setRolling(false);
        setHistory(prev => [
          { dice: finalResults, sum: finalResults.reduce((a, b) => a + b, 0) },
          ...prev,
        ].slice(0, 20));
      }
    }, 70);
  }, [diceCount, sides]);

  const sum = results.reduce((a, b) => a + b, 0);
  const diceOptions = [1, 2, 3, 4, 5, 6, 8, 10];
  const sideOptions = [4, 6, 8, 10, 12, 20, 100];

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
            Количество кубиков
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mb: 2 }}>
            {diceOptions.map((n) => (
              <Chip
                key={n}
                label={`${n}d`}
                onClick={() => setDiceCount(n)}
                sx={{
                  fontWeight: diceCount === n ? 700 : 400,
                  bgcolor: diceCount === n
                    ? alpha(theme.palette.primary.main, 0.15)
                    : theme.palette.surfaceContainerLow,
                  cursor: 'pointer'
                }}
              />
            ))}
          </Box>

          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Граней
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mb: 2 }}>
            {sideOptions.map((s) => (
              <Chip
                key={s}
                label={`d${s}`}
                onClick={() => setSides(s)}
                sx={{
                  fontWeight: sides === s ? 700 : 400,
                  bgcolor: sides === s
                    ? alpha(theme.palette.secondary.main || '#7D5260', 0.15)
                    : theme.palette.surfaceContainerLow,
                  cursor: 'pointer'
                }}
              />
            ))}
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Бросок: {diceCount}d{sides} (мин: {diceCount}, макс: {diceCount * sides})
          </Typography>

          <Button
            variant="contained"
            fullWidth
            size="large"
            startIcon={<Casino />}
            onClick={roll}
            disabled={rolling}
            sx={{ borderRadius: 6, py: 1.2 }}
          >
            {rolling ? 'Бросаю...' : 'Бросить кубики'}
          </Button>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          {results.length > 0 ? (
            <>
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: 'center', mb: 2 }}>
                {results.map((val, i) => (
                  <Paper
                    key={i}
                    elevation={0}
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: theme.palette.surfaceContainerHigh,
                      border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                      transition: 'transform 0.2s ease',
                      transform: rolling ? 'rotate(15deg)' : 'rotate(0)'
                    }}
                  >
                    {sides === 6 && diceFaces[val] ? (
                      <Typography sx={{ fontSize: 36 }}>{diceFaces[val][0]}</Typography>
                    ) : (
                      <Typography variant="h5" fontWeight={700} color="primary">
                        {val}
                      </Typography>
                    )}
                  </Paper>
                ))}
              </Box>

              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  bgcolor: alpha(theme.palette.success.main, 0.08),
                  textAlign: 'center',
                  mb: 2
                }}
              >
                <Typography variant="caption" color="text.secondary">Сумма</Typography>
                <Typography variant="h3" fontWeight={700} color="success.main">
                  {sum}
                </Typography>
              </Paper>

              {results.length > 1 && (
                <Grid container spacing={1}>
                  <Grid size={4}>
                    <Paper elevation={0} sx={{ p: 1.5, borderRadius: 2, bgcolor: theme.palette.surfaceContainerLow, textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary">Мин</Typography>
                      <Typography variant="body1" fontWeight={600}>{Math.min(...results)}</Typography>
                    </Paper>
                  </Grid>
                  <Grid size={4}>
                    <Paper elevation={0} sx={{ p: 1.5, borderRadius: 2, bgcolor: theme.palette.surfaceContainerLow, textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary">Макс</Typography>
                      <Typography variant="body1" fontWeight={600}>{Math.max(...results)}</Typography>
                    </Paper>
                  </Grid>
                  <Grid size={4}>
                    <Paper elevation={0} sx={{ p: 1.5, borderRadius: 2, bgcolor: theme.palette.surfaceContainerLow, textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary">Среднее</Typography>
                      <Typography variant="body1" fontWeight={600}>{(sum / results.length).toFixed(1)}</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              )}
            </>
          ) : (
            <Paper
              elevation={0}
              sx={{ p: 4, borderRadius: 3, bgcolor: theme.palette.surfaceContainerLow, textAlign: 'center' }}
            >
              <Casino sx={{ fontSize: 48, color: theme.palette.text.secondary, mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Нажмите «Бросить кубики» для броска
              </Typography>
            </Paper>
          )}

          {history.length > 1 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                История бросков
              </Typography>
              {history.slice(1, 8).map((h, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ width: 20 }}>
                    {i + 1}.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {h.dice.map((d, j) => (
                      <Chip
                        key={j}
                        label={d}
                        size="small"
                        sx={{ height: 22, fontSize: '0.7rem', minWidth: 28 }}
                      />
                    ))}
                  </Box>
                  <Typography variant="body2" fontWeight={600} sx={{ ml: 'auto' }}>
                    = {h.sum}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
