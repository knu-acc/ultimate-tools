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
import { useLanguage } from '@/src/i18n/LanguageContext';

const TIP_PRESETS = [5, 10, 15, 20, 25];

export default function TipCalculator() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';

  const [currency, setCurrency] = useState('RUB');
  const sym = getCurrency(currency).symbol;
  const [billAmount, setBillAmount] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [customTip, setCustomTip] = useState('');
  const [people, setPeople] = useState('1');

  const tipPercent = selectedPreset !== null ? selectedPreset : parseFloat(customTip) || 0;

  const handlePresetClick = (preset: number) => {
    if (selectedPreset === preset) {
      setSelectedPreset(null);
    } else {
      setSelectedPreset(preset);
      setCustomTip('');
    }
  };

  const handleCustomTipChange = (value: string) => {
    setCustomTip(value);
    setSelectedPreset(null);
  };

  const results = useMemo(() => {
    const bill = parseFloat(billAmount);
    const numPeople = parseInt(people, 10);

    if (isNaN(bill) || bill <= 0) return null;
    if (tipPercent <= 0) return null;

    const safePeople = isNaN(numPeople) || numPeople < 1 ? 1 : numPeople;

    const tipAmount = bill * (tipPercent / 100);
    const total = bill + tipAmount;
    const perPerson = total / safePeople;
    const tipPerPerson = tipAmount / safePeople;

    return {
      tipAmount,
      total,
      perPerson,
      tipPerPerson,
      people: safePeople
    };
  }, [billAmount, tipPercent, people]);

  const fmt = (n: number) =>
    n.toLocaleString(isEn ? 'en-US' : 'ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

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
              label={isEn ? `Bill amount (${sym})` : `Сумма счёта (${sym})`}
              type="number"
              value={billAmount}
              onChange={(e) => setBillAmount(e.target.value)}
              placeholder={isEn ? 'e.g.: 2500' : 'Например: 2500'}
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
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {isEn ? 'Tip percentage' : 'Процент чаевых'}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
              {TIP_PRESETS.map((preset) => (
                <Chip
                  key={preset}
                  label={`${preset}%`}
                  onClick={() => handlePresetClick(preset)}
                  variant={selectedPreset === preset ? 'filled' : 'outlined'}
                  color={selectedPreset === preset ? 'primary' : 'default'}
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    px: 0.5,
                    cursor: 'pointer'
                  }}
                />
              ))}
            </Box>
            <TextField
              fullWidth
              label={isEn ? 'Custom percentage' : 'Свой процент'}
              type="number"
              size="small"
              value={customTip}
              onChange={(e) => handleCustomTipChange(e.target.value)}
              placeholder={isEn ? 'Enter your %' : 'Введите свой %'}
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

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label={isEn ? 'Number of guests' : 'Количество гостей'}
              type="number"
              value={people}
              onChange={(e) => setPeople(e.target.value)}
              slotProps={{
                htmlInput: { min: 1 }
              }}
            />
          </Grid>
        </Grid>

        {results && (
          <>
            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
              {isEn ? 'Result' : 'Результат'}
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <StatCard
                  label={isEn ? 'Tip' : 'Чаевые'}
                  value={`${fmt(results.tipAmount)} ${sym}`}
                  color={theme.palette.primary.main}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <StatCard
                  label={isEn ? 'Total with bill' : 'Итого со счётом'}
                  value={`${fmt(results.total)} ${sym}`}
                  color="#1565c0"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <StatCard
                  label={isEn ? 'Per person' : 'На каждого'}
                  value={`${fmt(results.perPerson)} ${sym}`}
                  color="#2e7d32"
                />
              </Grid>
            </Grid>

            {results.people > 1 && (
              <Paper
                elevation={0}
                sx={{
                  mt: 2,
                  p: 2,
                  borderRadius: 3,
                  background: alpha('#6a1b9a', 0.04)
                }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
                  {isEn ? `Split for ${results.people} people` : `Разбивка на ${results.people} чел.`}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    {isEn ? 'Bill per person:' : 'Счёт на каждого:'}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {fmt(parseFloat(billAmount) / results.people)} {sym}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    {isEn ? 'Tip per person:' : 'Чаевые на каждого:'}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                    {fmt(results.tipPerPerson)} {sym}
                  </Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {isEn ? 'Total per person:' : 'Итого на каждого:'}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#2e7d32' }}>
                    {fmt(results.perPerson)} {sym}
                  </Typography>
                </Box>
              </Paper>
            )}
          </>
        )}
      </Paper>
    </Box>
  );
}
