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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import CurrencySelector, { getCurrency } from '@/src/components/CurrencySelector';
import { useLanguage } from '@/src/i18n/LanguageContext';

export default function LoanCalc() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';

  const [currency, setCurrency] = useState('RUB');
  const sym = getCurrency(currency).symbol;
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState('');
  const [term, setTerm] = useState('');
  const [termUnit, setTermUnit] = useState<'years' | 'months'>('years');
  const [showSchedule, setShowSchedule] = useState(false);

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

    // Аннуитетная формула: M = P * [r(1+r)^n] / [(1+r)^n - 1]
    const pow = Math.pow(1 + monthlyRate, months);
    const monthlyPayment = principal * (monthlyRate * pow) / (pow - 1);

    const totalPayment = monthlyPayment * months;
    const totalInterest = totalPayment - principal;

    // График амортизации
    const schedule: Array<{
      month: number;
      payment: number;
      principalPart: number;
      interestPart: number;
      balance: number;
    }> = [];

    let balance = principal;
    for (let i = 1; i <= months; i++) {
      const interestPart = balance * monthlyRate;
      const principalPart = monthlyPayment - interestPart;
      balance = Math.max(0, balance - principalPart);

      schedule.push({
        month: i,
        payment: monthlyPayment,
        principalPart,
        interestPart,
        balance
      });
    }

    return {
      monthlyPayment,
      totalPayment,
      totalInterest,
      months,
      schedule
    };
  }, [amount, rate, term, termUnit]);

  const fmt = (n: number) =>
    n.toLocaleString(isEn ? 'en-US' : 'ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const handleReset = () => {
    setAmount('');
    setRate('');
    setTerm('');
    setShowSchedule(false);
  };

  const StatCard = ({ label, value, color }: { label: string; value: string; color: string }) => (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        textAlign: 'center',
        borderRadius: 3,
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
          borderRadius: 3
        }}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label={isEn ? `Loan amount (${sym})` : `Сумма займа (${sym})`}
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={isEn ? "e.g.: 500000" : "Например: 500000"}
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
              label={isEn ? "Interest rate (annual)" : "Процентная ставка (годовая)"}
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder={isEn ? "e.g.: 15" : "Например: 15"}
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
                placeholder={termUnit === 'years' ? (isEn ? 'e.g.: 3' : 'Например: 3') : (isEn ? 'e.g.: 36' : 'Например: 36')}
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
                  {isEn ? 'Mo' : 'Мес'}
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
              {isEn ? 'Calculation results' : 'Результаты расчёта'}
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <StatCard
                  label={isEn ? "Monthly payment" : "Ежемесячный платёж"}
                  value={`${fmt(results.monthlyPayment)} ${sym}`}
                  color={theme.palette.primary.main}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <StatCard
                  label={isEn ? "Total payments" : "Общая сумма выплат"}
                  value={`${fmt(results.totalPayment)} ${sym}`}
                  color={theme.palette.info.main}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <StatCard
                  label={isEn ? 'Overpayment (interest)' : 'Переплата (проценты)'}
                  value={`${fmt(results.totalInterest)} ${sym}`}
                  color={theme.palette.error.main}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Срок: {results.months} мес. ({(results.months / 12).toFixed(1)} лет)
              </Typography>
              <Chip
                label={
                  (results.totalInterest / parseFloat(amount) * 100).toFixed(1) + '% переплата'
                }
                size="small"
                color="warning"
                variant="outlined"
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                График амортизации
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setShowSchedule(!showSchedule)}
                sx={{ textTransform: 'none' }}
              >
                {showSchedule ? 'Скрыть' : 'Показать'}
              </Button>
            </Box>

            {showSchedule && (
              <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                  borderRadius: theme.shape?.medium ?? 12,
                  maxHeight: 400
                }}
              >
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, bgcolor: theme.palette.surfaceContainerHigh }}>
                        Месяц
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, bgcolor: theme.palette.surfaceContainerHigh }}>
                        Платёж
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, bgcolor: theme.palette.surfaceContainerHigh }}>
                        Основной долг
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, bgcolor: theme.palette.surfaceContainerHigh }}>
                        Проценты
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, bgcolor: theme.palette.surfaceContainerHigh }}>
                        Остаток
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {results.schedule.map((row) => (
                      <TableRow key={row.month} hover>
                        <TableCell>{row.month}</TableCell>
                        <TableCell align="right">{fmt(row.payment)}</TableCell>
                        <TableCell align="right" sx={{ color: theme.palette.success.main }}>
                          {fmt(row.principalPart)}
                        </TableCell>
                        <TableCell align="right" sx={{ color: theme.palette.error.main }}>
                          {fmt(row.interestPart)}
                        </TableCell>
                        <TableCell align="right">{fmt(row.balance)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}
      </Paper>
    </Box>
  );
}
