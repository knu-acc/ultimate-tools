'use client';

import { useState } from 'react';
import {
  Box, Typography, Paper, TextField, Grid, alpha, useTheme
} from '@mui/material';
import CurrencySelector, { getCurrency } from '@/src/components/CurrencySelector';

export default function SalaryCalc() {
  const theme = useTheme();
  const [currency, setCurrency] = useState('RUB');
  const sym = getCurrency(currency).symbol;
  const [monthly, setMonthly] = useState('');

  const m = parseFloat(monthly) || 0;
  const annual = m * 12;
  const daily = m / 22;
  const hourly = daily / 8;
  const weekly = daily * 5;

  // Russian taxes
  const ndfl13 = m * 0.13;
  const netMonthly = m - ndfl13;
  const netAnnual = netMonthly * 12;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <CurrencySelector value={currency} onChange={setCurrency} />
      </Box>
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, background: theme.palette.surfaceContainerLow }}>
        <TextField fullWidth label={`Месячная зарплата до НДФЛ (${sym})`} type="number" value={monthly} onChange={e => setMonthly(e.target.value)} placeholder="Например: 100000" sx={{ mb: 2 }} />

        {m > 0 && (
          <>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>Разбивка по периодам (до НДФЛ)</Typography>
            <Grid container spacing={1.5} sx={{ mb: 2 }}>
              {[
                { label: 'В год', value: annual, color: theme.palette.primary.main },
                { label: 'В месяц', value: m, color: theme.palette.success.main },
                { label: 'В неделю', value: weekly, color: theme.palette.warning.main },
                { label: 'В день', value: daily, color: theme.palette.info.main },
                { label: 'В час', value: hourly, color: theme.palette.error.main },
              ].map(item => (
                <Grid size={{ xs: 6, sm: 4 }} key={item.label}>
                  <Paper elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: alpha(item.color, 0.06), textAlign: 'center', transition: 'background 150ms ease', '&:hover': { bgcolor: alpha(item.color, 0.10) } }}>
                    <Typography variant="caption" color="text.secondary">{item.label}</Typography>
                    <Typography variant="h6" fontWeight={700} sx={{ color: item.color }}>
                      {item.value.toLocaleString('ru-RU', { maximumFractionDigits: 0 })} {sym}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>После НДФЛ (13%)</Typography>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Paper elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: alpha(theme.palette.error.main, 0.06), textAlign: 'center', transition: 'background 150ms ease', '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.10) } }}>
                  <Typography variant="caption" color="text.secondary">НДФЛ (13%)</Typography>
                  <Typography variant="h6" fontWeight={700} color="error">{ndfl13.toLocaleString('ru-RU', { maximumFractionDigits: 0 })} {sym}</Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Paper elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: alpha(theme.palette.success.main, 0.08), textAlign: 'center', transition: 'background 150ms ease', '&:hover': { bgcolor: alpha(theme.palette.success.main, 0.12) } }}>
                  <Typography variant="caption" color="text.secondary">На руки (мес)</Typography>
                  <Typography variant="h6" fontWeight={700} sx={{ color: theme.palette.success.main }}>{netMonthly.toLocaleString('ru-RU', { maximumFractionDigits: 0 })} {sym}</Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Paper elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: alpha(theme.palette.success.main, 0.08), textAlign: 'center', transition: 'background 150ms ease', '&:hover': { bgcolor: alpha(theme.palette.success.main, 0.12) } }}>
                  <Typography variant="caption" color="text.secondary">На руки (год)</Typography>
                  <Typography variant="h6" fontWeight={700} sx={{ color: theme.palette.success.main }}>{netAnnual.toLocaleString('ru-RU', { maximumFractionDigits: 0 })} {sym}</Typography>
                </Paper>
              </Grid>
            </Grid>
          </>
        )}
      </Paper>
    </Box>
  );
}
