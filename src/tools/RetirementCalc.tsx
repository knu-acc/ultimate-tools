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
  useTheme,
  alpha
} from '@mui/material';
import CurrencySelector, { getCurrency } from '@/src/components/CurrencySelector';
import { useLanguage } from '@/src/i18n/LanguageContext';

export default function RetirementCalc() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';

  const [currency, setCurrency] = useState('RUB');
  const sym = getCurrency(currency).symbol;
  const [currentAge, setCurrentAge] = useState('');
  const [retirementAge, setRetirementAge] = useState('');
  const [currentSavings, setCurrentSavings] = useState('');
  const [monthlySavings, setMonthlySavings] = useState('');
  const [annualReturn, setAnnualReturn] = useState('');
  const [desiredMonthlyIncome, setDesiredMonthlyIncome] = useState('');

  const results = useMemo(() => {
    const age = parseInt(currentAge);
    const retAge = parseInt(retirementAge);
    const savings = parseFloat(currentSavings) || 0;
    const monthly = parseFloat(monthlySavings) || 0;
    const returnRate = parseFloat(annualReturn);
    const desiredIncome = parseFloat(desiredMonthlyIncome) || 0;

    if (
      isNaN(age) || isNaN(retAge) || isNaN(returnRate) ||
      age < 0 || retAge <= age || returnRate < 0
    ) {
      return null;
    }

    const yearsToRetirement = retAge - age;
    const monthlyRate = returnRate / 100 / 12;
    const totalMonths = yearsToRetirement * 12;

    // Year-by-year projection
    const projection: Array<{
      age: number;
      year: number;
      contributed: number;
      interest: number;
      balance: number;
    }> = [];

    let balance = savings;
    let totalContributed = savings;
    let totalInterest = 0;
    const thisYear = new Date().getFullYear();

    for (let yr = 0; yr < yearsToRetirement; yr++) {
      const startBalance = balance;
      for (let m = 0; m < 12; m++) {
        const interest = balance * monthlyRate;
        balance += interest + monthly;
        totalInterest += interest;
      }
      totalContributed += monthly * 12;

      projection.push({
        age: age + yr + 1,
        year: thisYear + yr + 1,
        contributed: totalContributed,
        interest: totalInterest,
        balance
      });
    }

    const totalAtRetirement = balance;

    // How long savings will last with desired income
    let yearsLast = 0;
    if (desiredIncome > 0) {
      let drawdownBalance = totalAtRetirement;
      while (drawdownBalance > 0 && yearsLast < 100) {
        for (let m = 0; m < 12; m++) {
          const interest = drawdownBalance * monthlyRate;
          drawdownBalance += interest - desiredIncome;
          if (drawdownBalance <= 0) {
            yearsLast += m / 12;
            break;
          }
        }
        if (drawdownBalance <= 0) break;
        yearsLast += 1;
      }
      if (drawdownBalance > 0) yearsLast = 100; // Effectively infinite
    }

    // Monthly income possible (perpetual: only from interest)
    const monthlyIncomePossible = totalAtRetirement * monthlyRate;

    // Monthly income for 20 years drawdown
    let monthlyIncome20 = 0;
    if (monthlyRate > 0) {
      const n20 = 20 * 12;
      const pow20 = Math.pow(1 + monthlyRate, n20);
      monthlyIncome20 = totalAtRetirement * (monthlyRate * pow20) / (pow20 - 1);
    } else {
      monthlyIncome20 = totalAtRetirement / (20 * 12);
    }

    // Shortfall or surplus
    const annualDesired = desiredIncome * 12;
    const neededCapital = desiredIncome > 0 && monthlyRate > 0
      ? desiredIncome / monthlyRate
      : desiredIncome * 12 * 25;
    const shortfall = neededCapital - totalAtRetirement;

    return {
      totalAtRetirement,
      totalContributed,
      totalInterest,
      yearsToRetirement,
      yearsLast,
      monthlyIncomePossible,
      monthlyIncome20,
      shortfall,
      annualDesired,
      projection
    };
  }, [currentAge, retirementAge, currentSavings, monthlySavings, annualReturn, desiredMonthlyIncome]);

  const fmt = (n: number) =>
    n.toLocaleString(isEn ? 'en-US' : 'ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const fmtInt = (n: number) =>
    n.toLocaleString(isEn ? 'en-US' : 'ru-RU', { maximumFractionDigits: 0 });

  const handleReset = () => {
    setCurrentAge('');
    setRetirementAge('');
    setCurrentSavings('');
    setMonthlySavings('');
    setAnnualReturn('');
    setDesiredMonthlyIncome('');
  };

  const StatCard = ({ label, value, color }: { label: string; value: string; color: string }) => (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        textAlign: 'center',
        borderRadius: 18,
        background: alpha(color, 0.06),
        transitionProperty: 'background-color', transitionDuration: '200ms', transitionTimingFunction: 'ease',
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
          borderRadius: 18,
          transitionProperty: 'background-color', transitionDuration: '200ms', transitionTimingFunction: 'ease',
          '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) }
        }}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              placeholder={isEn ? "Current age" : "Текущий возраст"}
              type="number"
              value={currentAge}
              onChange={(e) => setCurrentAge(e.target.value)}
              slotProps={{
                input: {
                  endAdornment: (
                    <Typography variant="body2" color="text.disabled">
                      {isEn ? 'years' : 'лет'}
                    </Typography>
                  )
                }
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              placeholder={isEn ? "Retirement age" : "Возраст выхода на пенсию"}
              type="number"
              value={retirementAge}
              onChange={(e) => setRetirementAge(e.target.value)}
              slotProps={{
                input: {
                  endAdornment: (
                    <Typography variant="body2" color="text.disabled">
                      {isEn ? 'years' : 'лет'}
                    </Typography>
                  )
                }
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              placeholder={isEn ? `Current savings, ${sym}` : `Текущие накопления, ${sym}`}
              type="number"
              value={currentSavings}
              onChange={(e) => setCurrentSavings(e.target.value)}
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
              placeholder={isEn ? `Monthly savings, ${sym}` : `Ежемесячные накопления, ${sym}`}
              type="number"
              value={monthlySavings}
              onChange={(e) => setMonthlySavings(e.target.value)}
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
              placeholder={isEn ? "Annual return, %" : "Годовая доходность, %"}
              type="number"
              value={annualReturn}
              onChange={(e) => setAnnualReturn(e.target.value)}
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

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              placeholder={isEn ? `Desired retirement income, ${sym}/mo` : `Желаемый доход на пенсии, ${sym}/мес`}
              type="number"
              value={desiredMonthlyIncome}
              onChange={(e) => setDesiredMonthlyIncome(e.target.value)}
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
              {isEn ? 'Reset' : 'Сбросить'}
            </Button>
          </Grid>
        </Grid>

        {results && (
          <>
            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              {isEn ? 'Results' : 'Результаты'}
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <StatCard
                  label={isEn ? "Saved by retirement" : "Накоплено к пенсии"}
                  value={`${fmtInt(results.totalAtRetirement)} ${sym}`}
                  color={theme.palette.primary.main}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <StatCard
                  label={isEn ? "Possible monthly income (perpetual)" : "Возможный ежемес. доход (бессрочно)"}
                  value={`${fmtInt(results.monthlyIncomePossible)} ${sym}`}
                  color="#2e7d32"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <StatCard
                  label={isEn ? "Monthly income (for 20 years)" : "Ежемес. доход (на 20 лет)"}
                  value={`${fmtInt(results.monthlyIncome20)} ${sym}`}
                  color="#1565c0"
                />
              </Grid>
            </Grid>

            {parseFloat(desiredMonthlyIncome) > 0 && (
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 18,
                        background: alpha(results.yearsLast >= 30 ? '#2e7d32' : '#c62828', 0.06)
                      }}
                    >
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        {isEn ? 'Savings will last for' : 'Накоплений хватит на'}
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          color: results.yearsLast >= 30 ? '#2e7d32' : '#c62828'
                        }}
                      >
                        {results.yearsLast >= 100 ? (isEn ? 'Indefinitely' : 'Бессрочно') : `${results.yearsLast.toFixed(1)} ${isEn ? 'years' : 'лет'}`}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 18,
                        background: alpha(results.shortfall <= 0 ? '#2e7d32' : '#c62828', 0.06)
                      }}
                    >
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        {results.shortfall <= 0 ? (isEn ? 'Capital surplus' : 'Избыток капитала') : (isEn ? 'Capital shortfall' : 'Дефицит капитала')}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 700,
                            color: results.shortfall <= 0 ? '#2e7d32' : '#c62828'
                          }}
                        >
                          {fmtInt(Math.abs(results.shortfall))} {sym}
                        </Typography>
                        <Chip
                          label={results.shortfall <= 0 ? (isEn ? 'Sufficient' : 'Достаточно') : (isEn ? 'Insufficient' : 'Не хватает')}
                          size="small"
                          sx={{
                            bgcolor: alpha(results.shortfall <= 0 ? '#2e7d32' : '#c62828', 0.1),
                            color: results.shortfall <= 0 ? '#2e7d32' : '#c62828',
                            fontWeight: 600
                          }}
                        />
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}

            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label={isEn ? `Years to retirement: ${results.yearsToRetirement}` : `Лет до пенсии: ${results.yearsToRetirement}`}
                size="small"
                variant="outlined"
              />
              <Chip
                label={isEn ? `Total contributed: ${fmtInt(results.totalContributed)} ${sym}` : `Всего внесено: ${fmtInt(results.totalContributed)} ${sym}`}
                size="small"
                variant="outlined"
              />
              <Chip
                label={isEn ? `Interest earned: ${fmtInt(results.totalInterest)} ${sym}` : `Заработано на процентах: ${fmtInt(results.totalInterest)} ${sym}`}
                size="small"
                color="success"
                variant="outlined"
              />
            </Box>

            {/* Year-by-year projection */}
            {results.projection.length > 0 && (
              <>
                <Divider sx={{ my: 3 }} />

                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  {isEn ? 'Year-by-year projection' : 'Проекция по годам'}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {results.projection.map((row) => (
                    <Paper
                      key={row.age}
                      elevation={0}
                      sx={{
                        p: 1.5,
                        borderRadius: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 1
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 100 }}>
                        <Chip
                          label={isEn ? `${row.age} y.o.` : `${row.age} лет`}
                          size="small"
                          sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            fontWeight: 600,
                            minWidth: 70
                          }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {row.year}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="caption" color="text.secondary">
                            {isEn ? 'Balance' : 'Баланс'}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {fmtInt(row.balance)} {sym}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="caption" color="text.secondary">
                            {isEn ? 'Contributed' : 'Внесено'}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#1565c0' }}>
                            {fmtInt(row.contributed)} {sym}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="caption" color="text.secondary">
                            {isEn ? 'Interest' : 'Проценты'}
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
