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
  alpha,
} from '@mui/material';

interface Zone {
  name: string;
  description: string;
  minPct: number;
  maxPct: number;
  color: string;
}

const ZONES: Zone[] = [
  { name: 'Зона 1', description: 'Разминка', minPct: 50, maxPct: 60, color: '#1976d2' },
  { name: 'Зона 2', description: 'Жиросжигание', minPct: 60, maxPct: 70, color: '#2e7d32' },
  { name: 'Зона 3', description: 'Аэробная', minPct: 70, maxPct: 80, color: '#f9a825' },
  { name: 'Зона 4', description: 'Анаэробная', minPct: 80, maxPct: 90, color: '#ef6c00' },
  { name: 'Зона 5', description: 'Максимальная', minPct: 90, maxPct: 100, color: '#c62828' },
];

export default function HeartRateZone() {
  const theme = useTheme();
  const [age, setAge] = useState('');
  const [restingHR, setRestingHR] = useState('');

  const results = useMemo(() => {
    const a = parseFloat(age);
    if (isNaN(a) || a <= 0 || a > 120) return null;

    const maxHR = 220 - a;
    const rhr = parseFloat(restingHR);
    const hasResting = !isNaN(rhr) && rhr > 0 && rhr < maxHR;

    const zones = ZONES.map((zone) => {
      let minBpm: number;
      let maxBpm: number;

      if (hasResting) {
        // Karvonen: Target = ((MaxHR - RestHR) * %Intensity) + RestHR
        const reserve = maxHR - rhr;
        minBpm = Math.round(reserve * (zone.minPct / 100) + rhr);
        maxBpm = Math.round(reserve * (zone.maxPct / 100) + rhr);
      } else {
        minBpm = Math.round(maxHR * (zone.minPct / 100));
        maxBpm = Math.round(maxHR * (zone.maxPct / 100));
      }

      return { ...zone, minBpm, maxBpm };
    });

    return { maxHR, hasResting, rhr: hasResting ? rhr : null, zones };
  }, [age, restingHR]);

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto' }}>
      {/* Input */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 3,
          background: alpha(theme.palette.primary.main, 0.02),
        }}
      >
        <Typography variant="body2" sx={{ mb: 2, fontWeight: 500, color: 'text.secondary' }}>
          Введите ваши параметры
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Возраст (лет)"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="25"
              slotProps={{
                input: { inputProps: { min: 1, max: 120, step: 1 } },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="ЧСС в покое (уд/мин) — необязательно"
              type="number"
              value={restingHR}
              onChange={(e) => setRestingHR(e.target.value)}
              placeholder="60"
              slotProps={{
                input: { inputProps: { min: 30, max: 200, step: 1 } },
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Results */}
      {results && (
        <>
          {/* Max HR card */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              textAlign: 'center',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 3,
              background: alpha('#c62828', 0.04),
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Максимальная ЧСС (220 - возраст)
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 700, color: '#c62828', mb: 0.5 }}>
              {results.maxHR} <Typography component="span" variant="h6" color="text.secondary">уд/мин</Typography>
            </Typography>
            {results.hasResting && (
              <Chip
                label={`Формула Карвонена (ЧСС покоя: ${results.rhr} уд/мин)`}
                size="small"
                sx={{
                  mt: 1,
                  fontWeight: 500,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                }}
              />
            )}
            {!results.hasResting && (
              <Typography variant="caption" color="text.disabled">
                Укажите ЧСС покоя для расчёта по формуле Карвонена
              </Typography>
            )}
          </Paper>

          {/* Zone Cards */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {results.zones.map((zone) => {
              const widthPct = ((zone.maxPct - zone.minPct) / 50) * 100;
              return (
                <Paper
                  key={zone.name}
                  elevation={0}
                  sx={{
                    p: 2.5,
                    border: `1px solid ${alpha(zone.color, 0.3)}`,
                    borderRadius: 3,
                    background: alpha(zone.color, 0.04),
                    borderLeft: `4px solid ${zone.color}`,
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 700, color: zone.color }}>
                        {zone.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {zone.description}
                      </Typography>
                    </Box>
                    <Chip
                      label={`${zone.minPct}–${zone.maxPct}%`}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        backgroundColor: alpha(zone.color, 0.15),
                        color: zone.color,
                      }}
                    />
                  </Box>

                  {/* HR range */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Box
                        sx={{
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: alpha(zone.color, 0.12),
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          sx={{
                            height: '100%',
                            width: `${widthPct}%`,
                            borderRadius: 5,
                            backgroundColor: zone.color,
                            transition: 'width 0.4s ease',
                          }}
                        />
                      </Box>
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 700, color: zone.color, whiteSpace: 'nowrap', minWidth: 120, textAlign: 'right' }}
                    >
                      {zone.minBpm} — {zone.maxBpm} уд/мин
                    </Typography>
                  </Box>
                </Paper>
              );
            })}
          </Box>

          {/* Summary bar */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mt: 3,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 3,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', mb: 2 }}>
              Обзор зон
            </Typography>
            <Box
              sx={{
                display: 'flex',
                height: 28,
                borderRadius: 14,
                overflow: 'hidden',
              }}
            >
              {results.zones.map((zone) => (
                <Box
                  key={zone.name}
                  sx={{
                    flex: 1,
                    backgroundColor: zone.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#fff', fontWeight: 700, fontSize: '0.6rem' }}>
                    {zone.minBpm}–{zone.maxBpm}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Box sx={{ display: 'flex', mt: 1 }}>
              {results.zones.map((zone) => (
                <Box key={zone.name} sx={{ flex: 1, textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: zone.color, fontWeight: 600, fontSize: '0.6rem' }}>
                    {zone.description}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </>
      )}
    </Box>
  );
}
