'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Grid,
  Chip,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import CurrencySelector, { getCurrency } from '@/src/components/CurrencySelector';

interface YearData {
  year: number;
  startBalance: number;
  contribution: number;
  interest: number;
  endBalance: number;
  totalContributions: number;
  totalInterest: number;
}

export default function InvestmentCalc() {
  const theme = useTheme();
  const [currency, setCurrency] = useState('RUB');
  const sym = getCurrency(currency).symbol;
  const [initial, setInitial] = useState('');
  const [monthly, setMonthly] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');

  const results = useMemo(() => {
    const P = parseFloat(initial);
    const M = parseFloat(monthly) || 0;
    const r = parseFloat(rate);
    const t = parseFloat(years);

    if (isNaN(P) || isNaN(r) || isNaN(t) || P < 0 || r <= 0 || t <= 0 || t > 100) {
      return null;
    }

    const monthlyRate = r / 100 / 12;
    const totalMonths = Math.round(t * 12);

    const yearlyData: YearData[] = [];
    let balance = P;
    let totalContributed = P;
    let totalEarned = 0;

    for (let y = 1; y <= t; y++) {
      const startBalance = balance;
      let yearInterest = 0;
      const yearContribution = M * 12;

      for (let m = 0; m < 12; m++) {
        const interest = balance * monthlyRate;
        balance += interest + M;
        yearInterest += interest;
      }

      totalContributed += yearContribution;
      totalEarned += yearInterest;

      yearlyData.push({
        year: y,
        startBalance,
        contribution: yearContribution,
        interest: yearInterest,
        endBalance: balance,
        totalContributions: totalContributed,
        totalInterest: totalEarned
      });
    }

    const finalAmount = balance;
    const totalContributions = P + M * totalMonths;
    const totalEarnings = finalAmount - totalContributions;
    const contributionsPct = (totalContributions / finalAmount) * 100;
    const earningsPct = (totalEarnings / finalAmount) * 100;

    return {
      finalAmount,
      totalContributions,
      totalEarnings,
      contributionsPct,
      earningsPct,
      yearlyData
    };
  }, [initial, monthly, rate, years]);

  const fmt = (n: number) =>
    n.toLocaleString('ru-RU', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const fmtPct = (n: number) =>
    n.toLocaleString('ru-RU', { maximumFractionDigits: 1 });

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <CurrencySelector value={currency} onChange={setCurrency} />
      </Box>
      {/* Input */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: theme.palette.surfaceContainerLowest
        }}
      >
        <Typography variant="body2" sx={{ mb: 2, fontWeight: 500, color: 'text.secondary' }}>
          Параметры инвестиции
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label={`Начальная сумма (${sym})`}
              type="number"
              value={initial}
              onChange={(e) => setInitial(e.target.value)}
              placeholder="100000"
              slotProps={{
                input: { inputProps: { min: 0, step: 1000 } }
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label={`Ежемесячное пополнение (${sym})`}
              type="number"
              value={monthly}
              onChange={(e) => setMonthly(e.target.value)}
              placeholder="10000"
              slotProps={{
                input: { inputProps: { min: 0, step: 500 } }
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Годовая доходность (%)"
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="10"
              slotProps={{
                input: {
                  inputProps: { min: 0.1, max: 100, step: 0.1 },
                  endAdornment: (
                    <Typography variant="body2" color="text.disabled">
                      %
                    </Typography>
                  )
                }
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Срок (лет)"
              type="number"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              placeholder="10"
              slotProps={{
                input: { inputProps: { min: 1, max: 100, step: 1 } }
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Results */}
      {results && (
        <>
          {/* Main result */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              textAlign: 'center',
              borderRadius: 3,
              background: alpha('#2e7d32', 0.04)
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Итоговая сумма
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 700, color: '#2e7d32', mb: 1 }}>
              {fmt(results.finalAmount)} {sym}
            </Typography>
          </Paper>

          {/* Breakdown cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  textAlign: 'center',
                  borderRadius: 3,
                  border: `1px solid ${alpha('#1565c0', 0.3)}`,
                  background: alpha('#1565c0', 0.05)
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Ваши взносы
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1565c0' }}>
                  {fmt(results.totalContributions)} {sym}
                </Typography>
                <Chip
                  label={`${fmtPct(results.contributionsPct)}%`}
                  size="small"
                  sx={{
                    mt: 0.5,
                    fontWeight: 600,
                    backgroundColor: alpha('#1565c0', 0.12),
                    color: '#1565c0'
                  }}
                />
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  textAlign: 'center',
                  borderRadius: 3,
                  border: `1px solid ${alpha('#2e7d32', 0.3)}`,
                  background: alpha('#2e7d32', 0.05)
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Доход от инвестиций
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#2e7d32' }}>
                  {fmt(results.totalEarnings)} {sym}
                </Typography>
                <Chip
                  label={`${fmtPct(results.earningsPct)}%`}
                  size="small"
                  sx={{
                    mt: 0.5,
                    fontWeight: 600,
                    backgroundColor: alpha('#2e7d32', 0.12),
                    color: '#2e7d32'
                  }}
                />
              </Paper>
            </Grid>
          </Grid>

          {/* Visual bar: contributions vs earnings */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', mb: 2 }}>
              Соотношение взносов и дохода
            </Typography>
            <Box
              sx={{
                display: 'flex',
                height: 36,
                borderRadius: 18,
                overflow: 'hidden',
                mb: 1.5
              }}
            >
              <Box
                sx={{
                  width: `${results.contributionsPct}%`,
                  backgroundColor: '#1565c0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: 50
                }}
              >
                <Typography variant="caption" sx={{ color: '#fff', fontWeight: 700, fontSize: '0.65rem' }}>
                  Взносы {fmtPct(results.contributionsPct)}%
                </Typography>
              </Box>
              <Box
                sx={{
                  flex: 1,
                  backgroundColor: '#2e7d32',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: 50
                }}
              >
                <Typography variant="caption" sx={{ color: '#fff', fontWeight: 700, fontSize: '0.65rem' }}>
                  Доход {fmtPct(results.earningsPct)}%
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Year-by-year table */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', mb: 2 }}>
              Рост по годам
            </Typography>

            {/* Table header */}
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                pb: 1,
                mb: 1,
                borderBottom: `1px solid ${theme.palette.divider}`
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 700, width: 40, color: 'text.secondary' }}>
                Год
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 700, flex: 1, color: 'text.secondary', textAlign: 'right' }}>
                Взносы за год
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 700, flex: 1, color: 'text.secondary', textAlign: 'right' }}>
                Доход за год
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 700, flex: 1.2, color: 'text.secondary', textAlign: 'right' }}>
                Итого
              </Typography>
            </Box>

            {/* Table rows */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {results.yearlyData.map((row) => {
                const barWidth = (row.endBalance / results.finalAmount) * 100;
                return (
                  <Box key={row.year}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', py: 0.5 }}>
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: 600, width: 40, color: 'text.secondary', fontFamily: 'monospace' }}
                      >
                        {row.year}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ flex: 1, textAlign: 'right', fontFamily: 'monospace', color: '#1565c0' }}
                      >
                        {fmt(row.contribution)}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ flex: 1, textAlign: 'right', fontFamily: 'monospace', color: '#2e7d32' }}
                      >
                        {fmt(row.interest)}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ flex: 1.2, textAlign: 'right', fontFamily: 'monospace', fontWeight: 600 }}
                      >
                        {fmt(row.endBalance)}
                      </Typography>
                    </Box>
                    {/* Mini bar */}
                    <Box
                      sx={{
                        height: 3,
                        borderRadius: 1.5,
                        backgroundColor: alpha('#2e7d32', 0.08),
                        overflow: 'hidden'
                      }}
                    >
                      <Box
                        sx={{
                          height: '100%',
                          display: 'flex',
                          width: `${barWidth}%`,
                          transition: 'width 0.3s ease'
                        }}
                      >
                        <Box
                          sx={{
                            width: `${(row.totalContributions / row.endBalance) * 100}%`,
                            backgroundColor: '#1565c0',
                            borderRadius: '1.5px 0 0 1.5px'
                          }}
                        />
                        <Box
                          sx={{
                            flex: 1,
                            backgroundColor: '#2e7d32',
                            borderRadius: '0 1.5px 1.5px 0'
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Paper>
        </>
      )}
    </Box>
  );
}
