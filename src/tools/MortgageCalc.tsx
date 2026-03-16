'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Grid,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import CurrencySelector, { getCurrency } from '@/src/components/CurrencySelector';
import { useLanguage } from '@/src/i18n/LanguageContext';

export default function MortgageCalc() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const [currency, setCurrency] = useState('RUB');
  const sym = getCurrency(currency).symbol;

  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState('');
  const [term, setTerm] = useState('');
  const [termUnit, setTermUnit] = useState<'years' | 'months'>('years');

  const results = useMemo(() => {
    const principal = parseFloat(amount);
    const annualRate = parseFloat(rate);
    const rawTerm = parseFloat(term);

    if (
      isNaN(principal) || isNaN(annualRate) || isNaN(rawTerm) ||
      principal <= 0 || annualRate <= 0 || rawTerm <= 0
    ) {
      return null;
    }

    const months = termUnit === 'years' ? Math.round(rawTerm * 12) : Math.round(rawTerm);
    if (months <= 0) return null;

    const monthlyRate = annualRate / 100 / 12;

    // Standard annuity formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
    const pow = Math.pow(1 + monthlyRate, months);
    const monthlyPayment = principal * (monthlyRate * pow) / (pow - 1);

    const totalPayment = monthlyPayment * months;
    const totalInterest = totalPayment - principal;
    const overpaymentPct = (totalInterest / principal) * 100;

    // First payment breakdown
    const firstInterest = principal * monthlyRate;
    const firstPrincipal = monthlyPayment - firstInterest;

    // Last payment breakdown
    const remainingBeforeLast = principal * (Math.pow(1 + monthlyRate, months - 1)) - monthlyPayment * ((Math.pow(1 + monthlyRate, months - 1) - 1) / monthlyRate);
    const lastInterest = Math.max(0, remainingBeforeLast * monthlyRate);
    const lastPrincipal = monthlyPayment - lastInterest;

    return {
      monthlyPayment,
      totalPayment,
      totalInterest,
      overpaymentPct,
      months,
      firstInterest,
      firstPrincipal,
      lastInterest,
      lastPrincipal
    };
  }, [amount, rate, term, termUnit]);

  const fmt = (n: number) =>
    n.toLocaleString(isEn ? 'en-US' : 'ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const fmtPct = (n: number) =>
    n.toLocaleString(isEn ? 'en-US' : 'ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  const handleReset = () => {
    setAmount('');
    setRate('');
    setTerm('');
  };

  interface StatCardProps {
    label: string;
    value: string;
    color: string;
  }

  const StatCard = ({ label, value, color }: StatCardProps) => (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        textAlign: 'center',
        borderRadius: 18,
        background: alpha(color, 0.06),
        transition: 'background 150ms ease',
        '&:hover': { background: alpha(color, 0.10) }
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
          borderRadius: 18
        }}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label={isEn ? `Loan amount (${sym})` : `Сумма кредита (${sym})`}
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={isEn ? 'e.g.: 3000000' : 'Например: 3000000'}
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
              label={isEn ? 'Interest rate' : 'Процентная ставка'}
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder={isEn ? 'e.g.: 12' : 'Например: 12'}
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
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
              <TextField
                fullWidth
                label={termUnit === 'years' ? (isEn ? 'Term (years)' : 'Срок (лет)') : (isEn ? 'Term (months)' : 'Срок (месяцев)')}
                type="number"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder={termUnit === 'years' ? (isEn ? 'e.g.: 15' : 'Например: 15') : (isEn ? 'e.g.: 180' : 'Например: 180')}
              />
              <ToggleButtonGroup
                value={termUnit}
                exclusive
                onChange={(_, val) => { if (val) setTermUnit(val); }}
                size="small"
                sx={{ mt: 0.5, flexShrink: 0 }}
              >
                <ToggleButton value="years" sx={{ textTransform: 'none', px: 1.5 }}>
                  {isEn ? 'Years' : 'Лет'}
                </ToggleButton>
                <ToggleButton value="months" sx={{ textTransform: 'none', px: 1.5 }}>
                  {isEn ? 'Mo.' : 'Мес'}
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
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
            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
              {isEn ? 'Calculation Results' : 'Результаты расчёта'}
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <StatCard
                  label={isEn ? 'Monthly payment' : 'Ежемесячный платёж'}
                  value={`${fmt(results.monthlyPayment)} ${sym}`}
                  color={theme.palette.primary.main}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <StatCard
                  label={isEn ? 'Total payments' : 'Общая сумма выплат'}
                  value={`${fmt(results.totalPayment)} ${sym}`}
                  color="#1565c0"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <StatCard
                  label={isEn ? 'Overpayment (interest)' : 'Переплата (проценты)'}
                  value={`${fmt(results.totalInterest)} ${sym}`}
                  color="#c62828"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <StatCard
                  label={isEn ? 'Overpayment rate' : 'Процент переплаты'}
                  value={`${fmtPct(results.overpaymentPct)}%`}
                  color="#e65100"
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
              {isEn ? 'Payment Structure' : 'Структура платежей'}
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 18,
                    background: alpha('#2e7d32', 0.04)
                  }}
                >
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
                    {isEn ? 'First payment' : 'Первый платёж'}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      {isEn ? 'Principal:' : 'Основной долг:'}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#2e7d32' }}>
                      {fmt(results.firstPrincipal)} {sym}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      {isEn ? 'Interest:' : 'Проценты:'}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#c62828' }}>
                      {fmt(results.firstInterest)} {sym}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 18,
                    background: alpha('#1565c0', 0.04)
                  }}
                >
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
                    {isEn ? 'Last payment' : 'Последний платёж'}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      {isEn ? 'Principal:' : 'Основной долг:'}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#2e7d32' }}>
                      {fmt(results.lastPrincipal)} {sym}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      {isEn ? 'Interest:' : 'Проценты:'}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#c62828' }}>
                      {fmt(results.lastInterest)} {sym}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {isEn ? `Loan term: ${results.months} mo. (${(results.months / 12).toFixed(1)} years)` : `Срок кредита: ${results.months} мес. (${(results.months / 12).toFixed(1)} лет)`}
              </Typography>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
}
