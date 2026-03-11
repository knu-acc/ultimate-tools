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
  Slider,
  useTheme,
  alpha
} from '@mui/material';
import CurrencySelector, { getCurrency } from '@/src/components/CurrencySelector';

const presets = [
  { label: 'РФ среднее (~7.5%)', value: 7.5 },
  { label: 'РФ 2023 (~7.4%)', value: 7.4 },
  { label: 'РФ 2022 (~11.9%)', value: 11.9 },
  { label: 'Умеренная (5%)', value: 5 },
  { label: 'Низкая (3%)', value: 3 },
];

const currentYear = new Date().getFullYear();

export default function InflationCalc() {
  const theme = useTheme();

  const [currency, setCurrency] = useState('RUB');
  const sym = getCurrency(currency).symbol;
  const [amount, setAmount] = useState('');
  const [startYear, setStartYear] = useState(String(currentYear - 10));
  const [endYear, setEndYear] = useState(String(currentYear));
  const [rate, setRate] = useState('7.5');
  const [yearsAgo, setYearsAgo] = useState(10);
  const [mode, setMode] = useState<'years' | 'slider'>('years');

  const effectiveStartYear = mode === 'slider' ? currentYear - yearsAgo : parseInt(startYear) || currentYear;
  const effectiveEndYear = mode === 'slider' ? currentYear : parseInt(endYear) || currentYear;

  const results = useMemo(() => {
    const principal = parseFloat(amount);
    const annualRate = parseFloat(rate);
    const start = effectiveStartYear;
    const end = effectiveEndYear;

    if (isNaN(principal) || isNaN(annualRate) || principal <= 0 || annualRate <= 0 || start >= end) {
      return null;
    }

    const years = end - start;
    const breakdown: Array<{
      year: number;
      rate: number;
      amount: number;
    }> = [];

    let current = principal;
    breakdown.push({ year: start, rate: 0, amount: current });

    for (let i = 1; i <= years; i++) {
      current = current * (1 + annualRate / 100);
      breakdown.push({ year: start + i, rate: annualRate, amount: current });
    }

    const equivalentAmount = current;
    const purchasingPowerLoss = ((equivalentAmount - principal) / equivalentAmount) * 100;
    const multiplier = equivalentAmount / principal;

    return {
      equivalentAmount,
      purchasingPowerLoss,
      multiplier,
      years,
      breakdown
    };
  }, [amount, rate, effectiveStartYear, effectiveEndYear]);

  const fmt = (n: number) =>
    n.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const handleReset = () => {
    setAmount('');
    setRate('7.5');
    setStartYear(String(currentYear - 10));
    setEndYear(String(currentYear));
    setYearsAgo(10);
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
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Сумма ({sym})"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
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

          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <Chip
                label="По годам"
                size="small"
                onClick={() => setMode('years')}
                variant={mode === 'years' ? 'filled' : 'outlined'}
                color={mode === 'years' ? 'primary' : 'default'}
              />
              <Chip
                label="Лет назад"
                size="small"
                onClick={() => setMode('slider')}
                variant={mode === 'slider' ? 'filled' : 'outlined'}
                color={mode === 'slider' ? 'primary' : 'default'}
              />
            </Box>
          </Grid>

          {mode === 'years' ? (
            <>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Начальный год"
                  type="number"
                  value={startYear}
                  onChange={(e) => setStartYear(e.target.value)}
                  placeholder="2014"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Конечный год"
                  type="number"
                  value={endYear}
                  onChange={(e) => setEndYear(e.target.value)}
                  placeholder={String(currentYear)}
                />
              </Grid>
            </>
          ) : (
            <Grid size={{ xs: 12 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Лет назад: {yearsAgo}
              </Typography>
              <Slider
                value={yearsAgo}
                onChange={(_, val) => setYearsAgo(val as number)}
                min={1}
                max={50}
                marks={[
                  { value: 1, label: '1' },
                  { value: 10, label: '10' },
                  { value: 20, label: '20' },
                  { value: 30, label: '30' },
                  { value: 50, label: '50' },
                ]}
                valueLabelDisplay="auto"
              />
            </Grid>
          )}

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Годовая инфляция"
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="7.5"
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
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', alignItems: 'center', height: '100%' }}>
              {presets.map((p) => (
                <Chip
                  key={p.value}
                  label={p.label}
                  size="small"
                  variant="outlined"
                  onClick={() => setRate(String(p.value))}
                  sx={{
                    cursor: 'pointer',
                    borderColor: parseFloat(rate) === p.value ? theme.palette.primary.main : undefined,
                    color: parseFloat(rate) === p.value ? theme.palette.primary.main : undefined
                  }}
                />
              ))}
            </Box>
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
                  label="Эквивалентная сумма"
                  value={`${fmt(results.equivalentAmount)} {sym}`}
                  color={theme.palette.primary.main}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <StatCard
                  label="Потеря покупательной способности"
                  value={`${results.purchasingPowerLoss.toFixed(1)}%`}
                  color="#c62828"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <StatCard
                  label="Множитель цен"
                  value={`x${results.multiplier.toFixed(2)}`}
                  color="#e65100"
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {fmt(parseFloat(amount))} {sym} в {effectiveStartYear} году эквивалентны {fmt(results.equivalentAmount)} {sym} в {effectiveEndYear} году
              </Typography>
            </Box>

            {/* Visual bar showing value erosion */}
            <Paper
              elevation={0}
              sx={{
                mt: 2,
                p: 2,
                borderRadius: 2
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                Обесценивание
              </Typography>
              <Box sx={{ display: 'flex', height: 28, borderRadius: 2, overflow: 'hidden' }}>
                <Box
                  sx={{
                    width: `${100 - results.purchasingPowerLoss}%`,
                    bgcolor: '#2e7d32',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'width 0.3s ease',
                    minWidth: 40
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600, fontSize: 10 }}>
                    Сохранено
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: `${results.purchasingPowerLoss}%`,
                    bgcolor: '#c62828',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'width 0.3s ease',
                    minWidth: 40
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600, fontSize: 10 }}>
                    Потеряно
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  {(100 - results.purchasingPowerLoss).toFixed(1)}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {results.purchasingPowerLoss.toFixed(1)}%
                </Typography>
              </Box>
            </Paper>

            {/* Year-by-year breakdown */}
            {results.breakdown.length > 0 && (
              <>
                <Divider sx={{ my: 3 }} />

                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Разбивка по годам
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {results.breakdown.map((row) => (
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
                          label={row.year}
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
                            Ставка
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#c62828' }}>
                            {row.rate > 0 ? `${row.rate}%` : '—'}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="caption" color="text.secondary">
                            Сумма
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {fmt(row.amount)} {sym}
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
