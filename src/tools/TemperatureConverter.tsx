'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Chip,
  Grid,
  useTheme } from '@mui/material';

type TempUnit = 'celsius' | 'fahrenheit' | 'kelvin';

interface ConvertedValues {
  celsius: number;
  fahrenheit: number;
  kelvin: number;
}

const unitLabels: Record<TempUnit, string> = {
  celsius: 'Цельсий (°C)',
  fahrenheit: 'Фаренгейт (°F)',
  kelvin: 'Кельвин (K)'
};

const unitSymbols: Record<TempUnit, string> = {
  celsius: '°C',
  fahrenheit: '°F',
  kelvin: 'K'
};

function convert(value: number, from: TempUnit): ConvertedValues {
  let celsius: number;
  switch (from) {
    case 'celsius':
      celsius = value;
      break;
    case 'fahrenheit':
      celsius = (value - 32) * 5 / 9;
      break;
    case 'kelvin':
      celsius = value - 273.15;
      break;
  }
  return {
    celsius: parseFloat(celsius.toFixed(4)),
    fahrenheit: parseFloat((celsius * 9 / 5 + 32).toFixed(4)),
    kelvin: parseFloat((celsius + 273.15).toFixed(4))
  };
}

const commonTemperatures = [
  { name: 'Абсолютный ноль', celsius: -273.15, fahrenheit: -459.67, kelvin: 0 },
  { name: 'Замерзание воды', celsius: 0, fahrenheit: 32, kelvin: 273.15 },
  { name: 'Комнатная температура', celsius: 20, fahrenheit: 68, kelvin: 293.15 },
  { name: 'Температура тела', celsius: 36.6, fahrenheit: 97.88, kelvin: 309.75 },
  { name: 'Кипение воды', celsius: 100, fahrenheit: 212, kelvin: 373.15 },
];

export default function TemperatureConverter() {
  const theme = useTheme();
  const [input, setInput] = useState<string>('0');
  const [sourceUnit, setSourceUnit] = useState<TempUnit>('celsius');

  const numericValue = parseFloat(input);
  const isValid = input !== '' && !isNaN(numericValue);
  const converted: ConvertedValues | null = isValid ? convert(numericValue, sourceUnit) : null;

  const otherUnits = (Object.keys(unitLabels) as TempUnit[]).filter((u) => u !== sourceUnit);

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      {/* Ввод */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 4,
          background: theme.palette.surfaceContainerLow
        }}
      >
        <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 600, color: 'text.secondary' }}>
          Введите значение
        </Typography>
        <TextField
          fullWidth
          size="small"
          type="number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Введите число"
          sx={{
            mb: 2.5,
            '& .MuiInputBase-root': { fontFamily: 'monospace', fontSize: '1.1rem' }
          }}
        />

        <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
          Исходная единица
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {(Object.keys(unitLabels) as TempUnit[]).map((unit) => (
            <Chip
              key={unit}
              label={unitLabels[unit]}
              onClick={() => setSourceUnit(unit)}
              color={sourceUnit === unit ? 'primary' : 'default'}
              variant={sourceUnit === unit ? 'filled' : 'outlined'}
              sx={{
                borderRadius: 3,
                fontWeight: sourceUnit === unit ? 600 : 400,
                transition: 'all 200ms ease'
              }}
            />
          ))}
        </Box>
      </Paper>

      {/* Результаты */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {converted ? (
          <>
            {/* Карточка исходного значения */}
            <Grid size={{ xs: 12 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 4,
                  border: `2px solid ${theme.palette.primary.main}`,
                  background: theme.palette.surfaceContainerHigh,
                  textAlign: 'center'
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }}>
                  Исходное значение
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: 'monospace', mt: 0.5 }}>
                  {converted[sourceUnit]} {unitSymbols[sourceUnit]}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {unitLabels[sourceUnit]}
                </Typography>
              </Paper>
            </Grid>

            {/* Карточки конвертированных значений */}
            {otherUnits.map((unit) => (
              <Grid size={{ xs: 12, sm: 6 }} key={unit}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 4,
                    textAlign: 'center',
                    transition: 'all 200ms ease',
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      background: theme.palette.surfaceContainerLow
                    }
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }}>
                    {unitLabels[unit]}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: 'monospace', mt: 0.5 }}>
                    {converted[unit]} {unitSymbols[unit]}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </>
        ) : (
          <Grid size={{ xs: 12 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                textAlign: 'center'
              }}
            >
              <Typography color="text.secondary">
                Введите корректное число для конвертации
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Справочная таблица */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 4
        }}
      >
        <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
          Справочная таблица
        </Typography>
        <Box sx={{ overflowX: 'auto' }}>
          <Box
            component="table"
            sx={{
              width: '100%',
              borderCollapse: 'collapse',
              '& th, & td': {
                p: 1.5,
                textAlign: 'left',
                borderBottom: `1px solid ${theme.palette.divider}`,
                fontSize: '0.875rem'
              },
              '& th': {
                fontWeight: 600,
                color: 'text.secondary',
                background: theme.palette.surfaceContainerLow
              },
              '& td': {
                fontFamily: 'monospace'
              },
              '& td:first-of-type': {
                fontFamily: 'inherit',
                fontWeight: 500
              }
            }}
          >
            <thead>
              <tr>
                <th>Описание</th>
                <th>°C</th>
                <th>°F</th>
                <th>K</th>
              </tr>
            </thead>
            <tbody>
              {commonTemperatures.map((row) => (
                <tr key={row.name}>
                  <td>{row.name}</td>
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
