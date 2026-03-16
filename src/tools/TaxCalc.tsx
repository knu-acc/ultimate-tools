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
  FormControlLabel,
  Checkbox,
  useTheme,
  alpha
} from '@mui/material';
import CurrencySelector, { getCurrency } from '@/src/components/CurrencySelector';
import { useLanguage } from '@/src/i18n/LanguageContext';

export default function TaxCalc() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';

  const [currency, setCurrency] = useState('RUB');
  const sym = getCurrency(currency).symbol;
  const [salary, setSalary] = useState('');
  const [isMonthly, setIsMonthly] = useState(true);

  // Вычеты
  const [deductionStandard, setDeductionStandard] = useState(false); // 1400 на ребёнка
  const [childrenCount, setChildrenCount] = useState('1');
  const [deductionProperty, setDeductionProperty] = useState(false); // имущественный
  const [propertyAmount, setPropertyAmount] = useState('');
  const [deductionEducation, setDeductionEducation] = useState(false); // обучение
  const [educationAmount, setEducationAmount] = useState('');

  const results = useMemo(() => {
    const raw = parseFloat(salary);
    if (isNaN(raw) || raw <= 0) return null;

    const annualGross = isMonthly ? raw * 12 : raw;
    const monthlyGross = isMonthly ? raw : raw / 12;

    // Рассчитываем вычеты (годовые)
    let totalDeductions = 0;

    if (deductionStandard) {
      const kids = parseInt(childrenCount) || 0;
      // 1400 за 1-го и 2-го ребёнка, 3000 за 3-го и последующих, в месяц
      // Действует пока доход нарастающим итогом не превысит 350 000
      let monthlyDeduction = 0;
      for (let i = 1; i <= kids; i++) {
        monthlyDeduction += i <= 2 ? 1400 : 3000;
      }
      // Количество месяцев, пока нарастающий доход < 350000
      const monthsEligible = Math.min(12, Math.floor(350000 / monthlyGross));
      totalDeductions += monthlyDeduction * monthsEligible;
    }

    if (deductionProperty) {
      const propAmt = parseFloat(propertyAmount) || 0;
      // Максимум 2 000 000 {sym} (260 000 {sym} возврат)
      totalDeductions += Math.min(propAmt, 2000000);
    }

    if (deductionEducation) {
      const eduAmt = parseFloat(educationAmount) || 0;
      // Максимум 150 000 {sym} в год
      totalDeductions += Math.min(eduAmt, 150000);
    }

    const taxableIncome = Math.max(0, annualGross - totalDeductions);

    // НДФЛ: 13% до 5 млн, 15% свыше 5 млн
    const threshold = 5000000;
    let annualTax: number;

    if (taxableIncome <= threshold) {
      annualTax = taxableIncome * 0.13;
    } else {
      annualTax = threshold * 0.13 + (taxableIncome - threshold) * 0.15;
    }

    const annualNet = annualGross - annualTax;
    const monthlyTax = annualTax / 12;
    const monthlyNet = annualNet / 12;
    const effectiveRate = annualGross > 0 ? (annualTax / annualGross) * 100 : 0;

    return {
      monthlyGross,
      monthlyNet,
      monthlyTax,
      annualGross,
      annualNet,
      annualTax,
      effectiveRate,
      taxableIncome,
      totalDeductions,
      isHighRate: taxableIncome > threshold
    };
  }, [salary, isMonthly, deductionStandard, childrenCount, deductionProperty, propertyAmount, deductionEducation, educationAmount]);

  const fmt = (n: number) =>
    n.toLocaleString(isEn ? 'en-US' : 'ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const fmtInt = (n: number) =>
    n.toLocaleString(isEn ? 'en-US' : 'ru-RU', { maximumFractionDigits: 0 });

  const handleReset = () => {
    setSalary('');
    setDeductionStandard(false);
    setChildrenCount('1');
    setDeductionProperty(false);
    setPropertyAmount('');
    setDeductionEducation(false);
    setEducationAmount('');
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
              label={isMonthly ? (isEn ? 'Monthly salary (before income tax)' : 'Зарплата в месяц (до вычета НДФЛ)') : (isEn ? 'Annual income (before income tax)' : 'Годовой доход (до вычета НДФЛ)')}
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder={isMonthly ? (isEn ? 'e.g.: 100000' : 'Например: 100000') : (isEn ? 'e.g.: 1200000' : 'Например: 1200000')}
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
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label={isEn ? 'Monthly' : 'В месяц'}
                size="small"
                onClick={() => setIsMonthly(true)}
                sx={{
                  bgcolor: isMonthly
                    ? alpha(theme.palette.primary.main, 0.15)
                    : theme.palette.surfaceContainerLow,
                  fontWeight: isMonthly ? 600 : 400,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: theme.palette.surfaceContainerHigh }
                }}
              />
              <Chip
                label={isEn ? 'Annual' : 'В год'}
                size="small"
                onClick={() => setIsMonthly(false)}
                sx={{
                  bgcolor: !isMonthly
                    ? alpha(theme.palette.primary.main, 0.15)
                    : theme.palette.surfaceContainerLow,
                  fontWeight: !isMonthly ? 600 : 400,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: theme.palette.surfaceContainerHigh }
                }}
              />
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
          {isEn ? 'Tax deductions' : 'Налоговые вычеты'}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 3,
              background: deductionStandard ? alpha('#2e7d32', 0.04) : 'transparent'
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={deductionStandard}
                  onChange={(e) => setDeductionStandard(e.target.checked)}
                  size="small"
                />
              }
              label={
                <Typography variant="body2">
                  {isEn ? `Standard child deduction (1,400 ${sym}/mo for 1-2 children, 3,000 ${sym} for 3+)` : `Стандартный вычет на детей (1 400 ${sym}/мес за 1-2 ребёнка, 3 000 ${sym} за 3+)`}
                </Typography>
              }
            />
            {deductionStandard && (
              <TextField
                label={isEn ? 'Number of children' : 'Количество детей'}
                type="number"
                size="small"
                value={childrenCount}
                onChange={(e) => setChildrenCount(e.target.value)}
                sx={{ ml: 4, mt: 1, width: 180 }}
              />
            )}
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 3,
              background: deductionProperty ? alpha('#2e7d32', 0.04) : 'transparent'
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={deductionProperty}
                  onChange={(e) => setDeductionProperty(e.target.checked)}
                  size="small"
                />
              }
              label={
                <Typography variant="body2">
                  {isEn ? `Property deduction (max 2,000,000 ${sym})` : `Имущественный вычет (макс. 2 000 000 ${sym})`}
                </Typography>
              }
            />
            {deductionProperty && (
              <TextField
                label={isEn ? `Expenses (${sym})` : `Сумма расходов (${sym})`}
                type="number"
                size="small"
                value={propertyAmount}
                onChange={(e) => setPropertyAmount(e.target.value)}
                placeholder={isEn ? 'e.g.: 2000000' : 'Например: 2000000'}
                sx={{ ml: 4, mt: 1, width: 220 }}
              />
            )}
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 3,
              background: deductionEducation ? alpha('#2e7d32', 0.04) : 'transparent'
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={deductionEducation}
                  onChange={(e) => setDeductionEducation(e.target.checked)}
                  size="small"
                />
              }
              label={
                <Typography variant="body2">
                  {isEn ? `Education deduction (max 150,000 ${sym}/year)` : `Вычет за обучение (макс. 150 000 ${sym}/год)`}
                </Typography>
              }
            />
            {deductionEducation && (
              <TextField
                label={isEn ? `Expenses (${sym})` : `Сумма расходов (${sym})`}
                type="number"
                size="small"
                value={educationAmount}
                onChange={(e) => setEducationAmount(e.target.value)}
                placeholder={isEn ? 'e.g.: 100000' : 'Например: 100000'}
                sx={{ ml: 4, mt: 1, width: 220 }}
              />
            )}
          </Paper>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            onClick={handleReset}
            size="small"
            sx={{ textTransform: 'none' }}
          >
            {isEn ? 'Reset' : 'Сбросить'}
          </Button>
        </Box>

        {results && (
          <>
            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {isEn ? 'Results' : 'Результаты'}
              </Typography>
              <Chip
                label={results.isHighRate ? (isEn ? 'Income tax 13% + 15%' : 'НДФЛ 13% + 15%') : (isEn ? 'Income tax 13%' : 'НДФЛ 13%')}
                size="small"
                color={results.isHighRate ? 'warning' : 'default'}
                variant="outlined"
              />
            </Box>

            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: 'text.secondary' }}>
              {isEn ? 'Monthly' : 'В месяц'}
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <StatCard
                  label={isEn ? 'Gross' : 'Начислено (гросс)'}
                  value={`${fmt(results.monthlyGross)} ${sym}`}
                  color="#1565c0"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <StatCard
                  label={isEn ? 'Income tax' : 'НДФЛ'}
                  value={`${fmt(results.monthlyTax)} ${sym}`}
                  color="#c62828"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <StatCard
                  label={isEn ? 'Net' : 'На руки (нетто)'}
                  value={`${fmt(results.monthlyNet)} ${sym}`}
                  color="#2e7d32"
                />
              </Grid>
            </Grid>

            <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 3, mb: 1.5, color: 'text.secondary' }}>
              {isEn ? 'Annual' : 'В год'}
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <StatCard
                  label={isEn ? 'Annual income' : 'Годовой доход'}
                  value={`${fmtInt(results.annualGross)} ${sym}`}
                  color="#1565c0"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <StatCard
                  label={isEn ? 'Annual tax' : 'НДФЛ за год'}
                  value={`${fmtInt(results.annualTax)} ${sym}`}
                  color="#c62828"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <StatCard
                  label={isEn ? 'Annual net' : 'На руки за год'}
                  value={`${fmtInt(results.annualNet)} ${sym}`}
                  color="#2e7d32"
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    borderRadius: 3,
                    background: alpha('#e65100', 0.06),
                    transition: 'background 150ms ease',
                    '&:hover': { background: alpha('#e65100', 0.10) }
                  }}
                >
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    {isEn ? 'Effective rate' : 'Эффективная ставка'}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#e65100' }}>
                    {results.effectiveRate.toFixed(2)}%
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    borderRadius: 3,
                    background: theme.palette.surfaceContainerLow,
                    transition: 'background 150ms ease',
                    '&:hover': { background: alpha(theme.palette.primary.main, 0.04) }
                  }}
                >
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    {isEn ? 'Taxable income' : 'Налогооблагаемая база'}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {fmtInt(results.taxableIncome)} {sym}
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    borderRadius: 3,
                    background: alpha('#2e7d32', 0.06),
                    transition: 'background 150ms ease',
                    '&:hover': { background: alpha('#2e7d32', 0.10) }
                  }}
                >
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    {isEn ? 'Total deductions' : 'Сумма вычетов'}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#2e7d32' }}>
                    {fmtInt(results.totalDeductions)} {sym}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {results.isHighRate && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {isEn ? `Income exceeds 5,000,000 ${sym} per year. Amount above is taxed at 15%.` : `Доход превышает 5 000 000 ${sym} в год. Сумма свыше облагается по ставке 15%.`}
                </Typography>
              </Box>
            )}
          </>
        )}
      </Paper>
    </Box>
  );
}
