'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Grid,
  Button,
  Divider,
  Chip,
  MenuItem,
  useTheme,
  alpha
} from '@mui/material';
import CurrencySelector, { getCurrency } from '@/src/components/CurrencySelector';

const frequencies = [
  { value: 1, label: 'Ежегодно' },
  { value: 2, label: 'Раз в полгода' },
  { value: 4, label: 'Ежеквартально' },
  { value: 12, label: 'Ежемесячно' },
  { value: 365, label: 'Ежедневно' },
];

export default function CompoundInterest() {
  const theme = useTheme();

  const [currency, setCurrency] = useState('RUB');
  const sym = getCurrency(currency).symbol;
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');
  const [frequency, setFrequency] = useState(12);
  const [monthlyAdd, setMonthlyAdd] = useState('');

  const results = useMemo(() => {
    const P = parseFloat(principal);
    const r = parseFloat(rate);
    const t = parseFloat(years);
    const n = frequency;
    const add = parseFloat(monthlyAdd) || 0;

    if (isNaN(P) || isNaN(r) || isNaN(t) || P < 0 || r <= 0 || t <= 0) {
      return null;
    }

    // Формула сложного процента: A = P(1 + r/n)^(nt)
    const rateDecimal = r / 100;
    const compoundFactor = Math.pow(1 + rateDecimal / n, n * t);
    const amountFromPrincipal = P * compoundFactor;

    // Будущая стоимость регулярных взносов (если есть)
    // FV = add * [((1 + r/n)^(nt) - 1) / (r/n)]
    // Пересчёт на период капитализации
    let amountFromContributions = 0;
    if (add > 0) {
      // Приводим ежемесячные взносы к периоду капитализации
      const periodsPerYear = n;
      const contributionPerPeriod = add * (12 / periodsPerYear);
      const totalPeriods = periodsPerYear * t;
      const ratePerPeriod = rateDecimal / periodsPerYear;

      if (ratePerPeriod > 0) {
        amountFromContributions = contributionPerPeriod * ((Math.pow(1 + ratePerPeriod, totalPeriods) - 1) / ratePerPeriod);
      } else {
        amountFromContributions = contributionPerPeriod * totalPeriods;
      }
    }

    const finalAmount = amountFromPrincipal + amountFromContributions;
    const totalContributions = P + add * 12 * t;
    const totalInterest = finalAmount - totalContributions;
    const growthPercent = totalContributions > 0 ? (totalInterest / totalContributions) * 100 : 0;

    // Таблица по годам
    const yearlyBreakdown: Array<{
      year: number;
      balance: number;
      contributed: number;
      interestEarned: number;
    }> = [];

    let runningBalance = P;
    let runningContributed = P;

    for (let yr = 1; yr <= Math.min(t, 50); yr++) {
      // Проценты за год на текущий баланс
      const periodsInYear = n;
      const ratePerPeriod = rateDecimal / n;
      const contributionPerPeriod = add * (12 / n);

      let balanceStart = runningBalance;
      for (let p = 0; p < periodsInYear; p++) {
        runningBalance = runningBalance * (1 + ratePerPeriod) + contributionPerPeriod;
      }

      runningContributed += add * 12;
      const interestThisYear = runningBalance - balanceStart - add * 12;

      yearlyBreakdown.push({
        year: yr,
        balance: runningBalance,
        contributed: runningContributed,
        interestEarned: interestThisYear
      });
    }

    return {
      finalAmount,
      totalContributions,
      totalInterest,
      growthPercent,
      yearlyBreakdown
    };
  }, [principal, rate, years, frequency, monthlyAdd]);

  const fmt = (n: number) =>
    n.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const fmtInt = (n: number) =>
    n.toLocaleString('ru-RU', { maximumFractionDigits: 0 });

  const handleReset = () => {
    setPrincipal('');
    setRate('');
    setYears('');
    setFrequency(12);
    setMonthlyAdd('');
  };

  const StatCard = ({ label, value, color }: { label: string; value: string; color: string }) => (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        textAlign: 'center',
        borderRadius: 3,
        background: alpha(color, 0.06)
      }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
        {label}
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 700, color }}>
        {value}
      </Typography>
    </Paper>
  );

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <CurrencySelector value={currency} onChange={setCurrency} />
      </Box>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          background: theme.palette.surfaceContainerLow,
          borderRadius: 3
        }}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Начальная сумма ({sym})"
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              placeholder="Например: 100000"
              slotProps={{
                input: {
                  endAdornment: (
                    <Typography variant="body2" color="text.disabled">
                      {sym}
                    </Typography>
                  )
                }
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Годовая ставка"
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="Например: 10"
              slotProps={{
                input: {
                  endAdornment: (
                    <Typography variant="body2" color="text.disabled">
                      %
                    </Typography>
                  )
                }
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="Срок (лет)"
              type="number"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              placeholder="Например: 5"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              select
              label="Капитализация"
              value={frequency}
              onChange={(e) => setFrequency(Number(e.target.value))}
            >
              {frequencies.map((f) => (
                <MenuItem key={f.value} value={f.value}>
                  {f.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="Ежемесячное пополнение ({sym})"
              type="number"
              value={monthlyAdd}
              onChange={(e) => setMonthlyAdd(e.target.value)}
              placeholder="0"
              slotProps={{
                input: {
                  endAdornment: (
                    <Typography variant="body2" color="text.disabled">
                      {sym}
                    </Typography>
                  )
                }
              }}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Button
              variant="outlined"
              onClick={handleReset}
              size="small"
              sx={{ textTransform: 'none' }}
            >
              Сбросить
            </Button>
          </Grid>
        </Grid>

        {results && (
          <>
            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Результаты
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <StatCard
                  label="Итоговая сумма"
                  value={`${fmt(results.finalAmount)} {sym}`}
                  color={theme.palette.primary.main}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <StatCard
                  label="Всего внесено"
                  value={`${fmt(results.totalContributions)} {sym}`}
                  color="#1565c0"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <StatCard
                  label="Заработано на процентах"
                  value={`${fmt(results.totalInterest)} {sym}`}
                  color="#2e7d32"
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
              <Chip
                label={`Доходность: +${results.growthPercent.toFixed(1)}%`}
                size="small"
                color="success"
                variant="outlined"
              />
              <Chip
                label={frequencies.find((f) => f.value === frequency)?.label || ''}
                size="small"
                variant="outlined"
              />
            </Box>

            {/* Визуальная шкала */}
            <Paper
              elevation={0}
              sx={{
                mt: 3,
                p: 2,
                borderRadius: 2
              }}
            >
              <Box sx={{ display: 'flex', height: 28, borderRadius: 2, overflow: 'hidden' }}>
                <Box
                  sx={{
                    width: `${(results.totalContributions / results.finalAmount) * 100}%`,
                    bgcolor: '#1565c0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'width 0.3s ease'
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600, fontSize: 10 }}>
                    Вложения
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: `${(results.totalInterest / results.finalAmount) * 100}%`,
                    bgcolor: '#2e7d32',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'width 0.3s ease'
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600, fontSize: 10 }}>
                    Проценты
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  {((results.totalContributions / results.finalAmount) * 100).toFixed(1)}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {((results.totalInterest / results.finalAmount) * 100).toFixed(1)}%
                </Typography>
              </Box>
            </Paper>

            {/* Таблица по годам */}
            {results.yearlyBreakdown.length > 0 && (
              <>
                <Divider sx={{ my: 3 }} />

                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Рост по годам
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {results.yearlyBreakdown.map((row) => (
                    <Paper
                      key={row.year}
                      elevation={0}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 1
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 80 }}>
                        <Chip
                          label={`${row.year} год`}
                          size="small"
                          sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            fontWeight: 600,
                            minWidth: 60
                          }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="caption" color="text.secondary">
                            Баланс
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {fmtInt(row.balance)} {sym}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="caption" color="text.secondary">
                            Внесено
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#1565c0' }}>
                            {fmtInt(row.contributed)} {sym}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="caption" color="text.secondary">
                            Проценты за год
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#2e7d32' }}>
                            +{fmtInt(row.interestEarned)} {sym}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              </>
            )}
          </>
        )}
      </Paper>
    </Box>
  );
}
