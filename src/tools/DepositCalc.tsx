'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Grid,
  Button,
  Chip,
  Divider,
  MenuItem,
  useTheme,
  alpha
} from '@mui/material';
import CurrencySelector, { getCurrency } from '@/src/components/CurrencySelector';

const capitalizationOptions = [
  { value: 'monthly', label: 'Ежемесячно', periods: 12 },
  { value: 'quarterly', label: 'Ежеквартально', periods: 4 },
  { value: 'annually', label: 'Ежегодно', periods: 1 },
  { value: 'end', label: 'В конце срока', periods: 0 },
];

export default function DepositCalc() {
  const theme = useTheme();

  const [currency, setCurrency] = useState('RUB');
  const sym = getCurrency(currency).symbol;
  const [deposit, setDeposit] = useState('');
  const [rate, setRate] = useState('');
  const [termMonths, setTermMonths] = useState('');
  const [capitalization, setCapitalization] = useState('monthly');
  const [monthlyAddition, setMonthlyAddition] = useState('');

  const results = useMemo(() => {
    const P = parseFloat(deposit);
    const r = parseFloat(rate);
    const months = parseInt(termMonths);
    const add = parseFloat(monthlyAddition) || 0;

    if (isNaN(P) || isNaN(r) || isNaN(months) || P <= 0 || r <= 0 || months <= 0) {
      return null;
    }

    const capOption = capitalizationOptions.find((c) => c.value === capitalization)!;
    const rateDecimal = r / 100;

    // --- WITH capitalization ---
    let balanceCap = P;
    const monthlyBreakdown: Array<{
      month: number;
      balance: number;
      interest: number;
      addition: number;
    }> = [];

    let totalInterestCap = 0;
    let accruedInterest = 0;

    for (let m = 1; m <= months; m++) {
      let interestThisMonth = 0;

      if (capOption.value === 'end') {
        // Simple interest, no capitalization
        interestThisMonth = (balanceCap + add * (m - 1)) * 0; // interest only at end
        const simpleInterest = P * rateDecimal * (m / 12);
        const additionsInterest = add > 0
          ? Array.from({ length: m - 1 }, (_, i) => add * rateDecimal * ((m - 1 - i) / 12)).reduce((a, b) => a + b, 0)
          : 0;
        accruedInterest = simpleInterest + additionsInterest;
        balanceCap = P + add * m;

        monthlyBreakdown.push({
          month: m,
          balance: balanceCap + accruedInterest,
          interest: accruedInterest,
          addition: add
        });
      } else {
        // Compound interest
        const monthlyRate = rateDecimal / 12;
        interestThisMonth = balanceCap * monthlyRate;
        accruedInterest += interestThisMonth;

        // Capitalize based on frequency
        const shouldCapitalize =
          (capOption.value === 'monthly') ||
          (capOption.value === 'quarterly' && m % 3 === 0) ||
          (capOption.value === 'annually' && m % 12 === 0);

        if (shouldCapitalize) {
          balanceCap += accruedInterest;
          totalInterestCap += accruedInterest;
          accruedInterest = 0;
        }

        balanceCap += add;

        monthlyBreakdown.push({
          month: m,
          balance: balanceCap + accruedInterest,
          interest: totalInterestCap + accruedInterest,
          addition: add
        });
      }
    }

    // Final capitalization of remaining accrued
    if (capOption.value !== 'end') {
      totalInterestCap += accruedInterest;
      balanceCap += accruedInterest;
    }

    const finalWithCap = capOption.value === 'end'
      ? P + add * months + accruedInterest
      : balanceCap;
    const totalInterestWithCap = capOption.value === 'end'
      ? accruedInterest
      : totalInterestCap;

    // --- WITHOUT capitalization (simple interest) ---
    const totalAdditions = add * months;
    const simpleInterest = P * rateDecimal * (months / 12);
    const additionsSimpleInterest = add > 0
      ? Array.from({ length: months }, (_, i) => add * rateDecimal * ((months - 1 - i) / 12)).reduce((a, b) => a + b, 0)
      : 0;
    const totalInterestNoCap = simpleInterest + additionsSimpleInterest;
    const finalNoCap = P + totalAdditions + totalInterestNoCap;

    // Effective rate
    const effectiveRate = (totalInterestWithCap / P) * (12 / months) * 100;
    const capBenefit = totalInterestWithCap - totalInterestNoCap;

    return {
      finalWithCap,
      totalInterestWithCap,
      finalNoCap,
      totalInterestNoCap,
      effectiveRate,
      capBenefit,
      totalAdditions,
      months,
      monthlyBreakdown
    };
  }, [deposit, rate, termMonths, capitalization, monthlyAddition]);

  const fmt = (n: number) =>
    n.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const fmtInt = (n: number) =>
    n.toLocaleString('ru-RU', { maximumFractionDigits: 0 });

  const handleReset = () => {
    setDeposit('');
    setRate('');
    setTermMonths('');
    setCapitalization('monthly');
    setMonthlyAddition('');
  };

  const StatCard = ({ label, value, color }: { label: string; value: string; color: string }) => (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        textAlign: 'center',
        borderRadius: 3,
        background: alpha(color, 0.06),
        transition: 'background-color 0.2s ease',
        '&:hover': { background: alpha(color, 0.1) }
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
          p: { xs: 2, sm: 3 },
          bgcolor: theme.palette.surfaceContainerLow,
          borderRadius: 3,
          transition: 'background-color 0.2s ease',
          '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) }
        }}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              placeholder={`Сумма вклада, ${sym}`}
              type="number"
              value={deposit}
              onChange={(e) => setDeposit(e.target.value)}
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
              placeholder="Годовая ставка, %"
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
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
              placeholder="Срок, месяцев"
              type="number"
              value={termMonths}
              onChange={(e) => setTermMonths(e.target.value)}
              slotProps={{
                input: {
                  endAdornment: (
                    <Typography variant="body2" color="text.disabled">
                      мес
                    </Typography>
                  )
                }
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              select
              placeholder="Капитализация"
              value={capitalization}
              onChange={(e) => setCapitalization(e.target.value)}
            >
              {capitalizationOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              placeholder={`Ежемесячное пополнение, ${sym}`}
              type="number"
              value={monthlyAddition}
              onChange={(e) => setMonthlyAddition(e.target.value)}
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
              Результаты (с капитализацией)
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <StatCard
                  label="Итоговая сумма"
                  value={`${fmt(results.finalWithCap)} ${sym}`}
                  color={theme.palette.primary.main}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <StatCard
                  label="Начислено процентов"
                  value={`${fmt(results.totalInterestWithCap)} ${sym}`}
                  color="#2e7d32"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <StatCard
                  label="Эффективная ставка"
                  value={`${results.effectiveRate.toFixed(2)}%`}
                  color="#e65100"
                />
              </Grid>
            </Grid>

            {/* Comparison: with vs without */}
            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Сравнение: с капитализацией vs без
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    background: alpha('#2e7d32', 0.04)
                  }}
                >
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
                    С капитализацией
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      Итого:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#2e7d32' }}>
                      {fmt(results.finalWithCap)} {sym}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Проценты:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#2e7d32' }}>
                      {fmt(results.totalInterestWithCap)} {sym}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    background: alpha('#1565c0', 0.04)
                  }}
                >
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
                    Без капитализации (простой %)
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      Итого:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#1565c0' }}>
                      {fmt(results.finalNoCap)} {sym}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Проценты:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#1565c0' }}>
                      {fmt(results.totalInterestNoCap)} {sym}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>

            {results.capBenefit > 0 && (
              <Box sx={{ mt: 2 }}>
                <Chip
                  label={`Выгода от капитализации: +${fmt(results.capBenefit)} ${sym}`}
                  size="small"
                  color="success"
                  variant="outlined"
                />
              </Box>
            )}

            {/* Visual bar */}
            <Paper
              elevation={0}
              sx={{
                mt: 2,
                p: { xs: 1.5, sm: 2 },
                borderRadius: 3,
                bgcolor: theme.palette.surfaceContainerLow
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                Структура итоговой суммы
              </Typography>
              <Box sx={{ display: 'flex', height: 28, borderRadius: 2, overflow: 'hidden' }}>
                <Box
                  sx={{
                    width: `${(parseFloat(deposit) / results.finalWithCap) * 100}%`,
                    bgcolor: '#1565c0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'width 0.3s ease'
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600, fontSize: 10 }}>
                    Вклад
                  </Typography>
                </Box>
                {results.totalAdditions > 0 && (
                  <Box
                    sx={{
                      width: `${(results.totalAdditions / results.finalWithCap) * 100}%`,
                      bgcolor: '#6a1b9a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'width 0.3s ease'
                    }}
                  >
                    <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600, fontSize: 10 }}>
                      Пополнения
                    </Typography>
                  </Box>
                )}
                <Box
                  sx={{
                    width: `${(results.totalInterestWithCap / results.finalWithCap) * 100}%`,
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
            </Paper>

            {/* Monthly breakdown */}
            {results.monthlyBreakdown.length > 0 && (
              <>
                <Divider sx={{ my: 3 }} />

                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Помесячная таблица
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {results.monthlyBreakdown.map((row) => (
                    <Paper
                      key={row.month}
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
                          label={`${row.month} мес`}
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
                            Проценты
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#2e7d32' }}>
                            +{fmtInt(row.interest)} {sym}
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
