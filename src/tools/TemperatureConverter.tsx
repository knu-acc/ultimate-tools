'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Chip,
  Grid,
  useTheme,
  alpha
} from '@mui/material';
import { CopyButton } from '@/src/components/CopyButton';
import { useLanguage } from '@/src/i18n/LanguageContext';

type TempUnit = 'celsius' | 'fahrenheit' | 'kelvin';

const unitLabelsRu: Record<TempUnit, string> = {
  celsius: 'Цельсий',
  fahrenheit: 'Фаренгейт',
  kelvin: 'Кельвин'
};

const unitLabelsEn: Record<TempUnit, string> = {
  celsius: 'Celsius',
  fahrenheit: 'Fahrenheit',
  kelvin: 'Kelvin'
};

const unitSymbols: Record<TempUnit, string> = {
  celsius: '°C',
  fahrenheit: '°F',
  kelvin: 'K'
};

function convert(value: number, from: TempUnit): Record<TempUnit, number> {
  let celsius: number;
  switch (from) {
    case 'celsius': celsius = value; break;
    case 'fahrenheit': celsius = (value - 32) * 5 / 9; break;
    case 'kelvin': celsius = value - 273.15; break;
  }
  return {
    celsius: parseFloat(celsius.toFixed(4)),
    fahrenheit: parseFloat((celsius * 9 / 5 + 32).toFixed(4)),
    kelvin: parseFloat((celsius + 273.15).toFixed(4))
  };
}

const commonTemps = [
  { name: 'Абсолютный ноль', nameEn: 'Absolute zero', celsius: -273.15, fahrenheit: -459.67, kelvin: 0 },
  { name: 'Замерзание воды', nameEn: 'Water freezing', celsius: 0, fahrenheit: 32, kelvin: 273.15 },
  { name: 'Комнатная', nameEn: 'Room temperature', celsius: 20, fahrenheit: 68, kelvin: 293.15 },
  { name: 'Тело человека', nameEn: 'Human body', celsius: 36.6, fahrenheit: 97.88, kelvin: 309.75 },
  { name: 'Кипение воды', nameEn: 'Water boiling', celsius: 100, fahrenheit: 212, kelvin: 373.15 },
];

export default function TemperatureConverter() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const unitLabels = isEn ? unitLabelsEn : unitLabelsRu;
  const [input, setInput] = useState('0');
  const [sourceUnit, setSourceUnit] = useState<TempUnit>('celsius');

  const numericValue = parseFloat(input);
  const isValid = input !== '' && !isNaN(numericValue);
  const converted = isValid ? convert(numericValue, sourceUnit) : null;

  const otherUnits = (Object.keys(unitLabels) as TempUnit[]).filter((u) => u !== sourceUnit);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 2,
          borderRadius: 3,
          background: theme.palette.surfaceContainerLow
        }}
      >
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <TextField
            fullWidth
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="0"
            sx={{
              flex: 1,
              minWidth: 200,
              '& .MuiInputBase-root': { fontFamily: 'monospace', fontSize: '1.2rem' }
            }}
            slotProps={{
              input: {
                endAdornment: (
                  <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.secondary', whiteSpace: 'nowrap' }}>
                    {unitSymbols[sourceUnit]}
                  </Typography>
                )
              }
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          {(Object.keys(unitLabels) as TempUnit[]).map((unit) => (
            <Chip
              key={unit}
              label={`${unitLabels[unit]} (${unitSymbols[unit]})`}
              onClick={() => setSourceUnit(unit)}
              color={sourceUnit === unit ? 'primary' : 'default'}
              variant={sourceUnit === unit ? 'filled' : 'outlined'}
              sx={{ fontWeight: sourceUnit === unit ? 600 : 400 }}
            />
          ))}
        </Box>
      </Paper>

      {converted && (
        <Grid container spacing={1.5} sx={{ mb: 2 }}>
          {otherUnits.map((unit) => (
            <Grid size={{ xs: 12, sm: 6 }} key={unit}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  transitionProperty: 'background-color', transitionDuration: '200ms', transitionTimingFunction: 'ease',
                  '&:hover': { background: alpha(theme.palette.primary.main, 0.04) }
                }}
              >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                    {unitLabels[unit]}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>
                    {converted[unit]} {unitSymbols[unit]}
                  </Typography>
                </Box>
                <CopyButton text={String(converted[unit])} />
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3 }}>
        <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 600, color: 'text.secondary' }}>
          {isEn ? 'Reference' : 'Справочник'}
        </Typography>
        <Box sx={{ overflowX: 'auto' }}>
          <Box
            component="table"
            sx={{
              width: '100%',
              borderCollapse: 'collapse',
              '& th, & td': {
                p: 1,
                textAlign: 'left',
                borderBottom: `1px solid ${theme.palette.divider}`,
                fontSize: '0.8rem'
              },
              '& th': { fontWeight: 600, color: 'text.secondary' },
              '& td': { fontFamily: 'monospace' },
              '& td:first-of-type': { fontFamily: 'inherit', fontWeight: 500 }
            }}
          >
            <thead>
              <tr><th>{isEn ? 'Description' : 'Описание'}</th><th>°C</th><th>°F</th><th>K</th></tr>
            </thead>
            <tbody>
              {commonTemps.map((row) => (
                <tr key={row.name}>
                  <td>{isEn ? row.nameEn : row.name}</td>
                  <td>{row.celsius}</td>
                  <td>{row.fahrenheit}</td>
                  <td>{row.kelvin}</td>
                </tr>
              ))}
            </tbody>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
