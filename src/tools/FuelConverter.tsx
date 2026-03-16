'use client';

import { useState } from 'react';
import {
  Box, Typography, Paper, TextField, Grid, alpha, useTheme
} from '@mui/material';
import { CopyButton } from '@/src/components/CopyButton';
import { useLanguage } from '@/src/i18n/LanguageContext';

export default function FuelConverter() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const [liters100, setLiters100] = useState('8');

  const val = parseFloat(liters100) || 0;
  const mpg = val > 0 ? 235.215 / val : 0;
  const mpgUK = val > 0 ? 282.481 / val : 0;
  const kmPerL = val > 0 ? 100 / val : 0;

  const results = val > 0 ? [
    { label: isEn ? 'Miles per gallon (US)' : 'Мили на галлон (US)', value: mpg.toFixed(2), unit: 'MPG', color: theme.palette.primary.main },
    { label: isEn ? 'Miles per gallon (UK)' : 'Мили на галлон (UK)', value: mpgUK.toFixed(2), unit: 'MPG', color: theme.palette.success.main },
    { label: isEn ? 'Kilometers per liter' : 'Километров на литр', value: kmPerL.toFixed(2), unit: isEn ? 'km/L' : 'км/л', color: theme.palette.warning.main },
    { label: isEn ? 'Liters per 100 km' : 'Литров на 100 км', value: val.toFixed(2), unit: isEn ? 'L/100km' : 'л/100км', color: theme.palette.error.main },
  ] : [];

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 2,
          background: theme.palette.surfaceContainerLow,
          borderRadius: 3
        }}
      >
        <TextField
          fullWidth
          type="number"
          value={liters100}
          onChange={e => setLiters100(e.target.value)}
          placeholder="8"
          sx={{
            '& .MuiInputBase-root': { fontFamily: 'monospace', fontSize: '1.2rem' }
          }}
          slotProps={{
            htmlInput: { min: 0 },
            input: {
              endAdornment: (
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary', whiteSpace: 'nowrap' }}>
                  {isEn ? 'L/100km' : 'л/100км'}
                </Typography>
              )
            }
          }}
        />
      </Paper>

      {results.length > 0 && (
        <Grid container spacing={1.5} sx={{ mb: 2 }}>
          {results.map((r) => (
            <Grid size={{ xs: 12, sm: 6 }} key={r.label}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  transition: 'all 200ms ease',
                  '&:hover': { background: alpha(r.color, 0.04) }
                }}
              >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                    {r.label}
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ fontFamily: 'monospace', fontWeight: 700, color: r.color }}
                  >
                    {r.value}
                    <Typography component="span" variant="body2" sx={{ ml: 0.5, color: 'text.secondary', fontWeight: 400 }}>
                      {r.unit}
                    </Typography>
                  </Typography>
                </Box>
                <CopyButton text={r.value} />
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Paper elevation={0} sx={{ p: 2, borderRadius: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
          {isEn ? '1 US gal = 3.785 L · 1 UK gal = 4.546 L · MPG = 235.215 / (L/100km)' : '1 US gal = 3.785 л · 1 UK gal = 4.546 л · MPG = 235.215 / (л/100км)'}
        </Typography>
      </Paper>
    </Box>
  );
}
