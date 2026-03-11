'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Select,
  MenuItem,
  Grid,
  useTheme,
  alpha
} from '@mui/material';
import { CopyButton } from '@/src/components/CopyButton';

type VolumeUnit =
  | 'liters'
  | 'milliliters'
  | 'gallons'
  | 'quarts'
  | 'pints'
  | 'cups'
  | 'tablespoons'
  | 'teaspoons'
  | 'cubicMeters'
  | 'cubicCentimeters';

const unitLabels: Record<VolumeUnit, string> = {
  liters: 'Литры',
  milliliters: 'Миллилитры',
  gallons: 'Галлоны US',
  quarts: 'Кварты',
  pints: 'Пинты',
  cups: 'Чашки',
  tablespoons: 'Столовые ложки',
  teaspoons: 'Чайные ложки',
  cubicMeters: 'Кубические метры',
  cubicCentimeters: 'Кубические сантиметры'
};

const unitShort: Record<VolumeUnit, string> = {
  liters: 'л',
  milliliters: 'мл',
  gallons: 'gal',
  quarts: 'qt',
  pints: 'pt',
  cups: 'cup',
  tablespoons: 'tbsp',
  teaspoons: 'tsp',
  cubicMeters: 'м³',
  cubicCentimeters: 'см³'
};

const toLiters: Record<VolumeUnit, number> = {
  liters: 1,
  milliliters: 0.001,
  gallons: 3.785411784,
  quarts: 0.946352946,
  pints: 0.473176473,
  cups: 0.2365882365,
  tablespoons: 0.01478676478,
  teaspoons: 0.00492892159,
  cubicMeters: 1000,
  cubicCentimeters: 0.001
};

function convertAll(value: number, from: VolumeUnit): Record<VolumeUnit, number> {
  const inLiters = value * toLiters[from];
  const result: Partial<Record<VolumeUnit, number>> = {};
  for (const unit of Object.keys(toLiters) as VolumeUnit[]) {
    const raw = inLiters / toLiters[unit];
    result[unit] = parseFloat(raw.toPrecision(10));
  }
  return result as Record<VolumeUnit, number>;
}

function formatNumber(n: number): string {
  if (Number.isInteger(n) && Math.abs(n) < 1e15) return n.toString();
  if (Math.abs(n) >= 1e10 || (Math.abs(n) < 1e-6 && n !== 0)) {
    return n.toExponential(6);
  }
  return parseFloat(n.toFixed(8)).toString();
}

const commonConversions = [
  { from: '1 л', to: '1000 мл' },
  { from: '1 gal', to: '3.785 л' },
  { from: '1 qt', to: '0.946 л' },
  { from: '1 pt', to: '473.2 мл' },
  { from: '1 cup', to: '236.6 мл' },
  { from: '1 tbsp', to: '14.79 мл' },
  { from: '1 tsp', to: '4.929 мл' },
  { from: '1 м³', to: '1000 л' },
];

export default function VolumeConverter() {
  const theme = useTheme();
  const [input, setInput] = useState('1');
  const [sourceUnit, setSourceUnit] = useState<VolumeUnit>('liters');

  const numericValue = parseFloat(input);
  const isValid = input !== '' && !isNaN(numericValue) && numericValue >= 0;
  const converted = isValid ? convertAll(numericValue, sourceUnit) : null;

  const otherUnits = (Object.keys(unitLabels) as VolumeUnit[]).filter((u) => u !== sourceUnit);

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
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="1"
            error={input !== '' && !isValid}
            slotProps={{
              htmlInput: { min: 0 },
              input: {
                endAdornment: (
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary', whiteSpace: 'nowrap' }}>
                    {unitShort[sourceUnit]}
                  </Typography>
                )
              }
            }}
            sx={{
              flex: 2,
              minWidth: 180,
              '& .MuiInputBase-root': { fontFamily: 'monospace', fontSize: '1.2rem' }
            }}
          />
          <Select
            value={sourceUnit}
            onChange={(e) => setSourceUnit(e.target.value as VolumeUnit)}
            sx={{ flex: 1, minWidth: 200 }}
          >
            {(Object.keys(unitLabels) as VolumeUnit[]).map((unit) => (
              <MenuItem key={unit} value={unit}>
                {unitLabels[unit]} ({unitShort[unit]})
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Paper>

      {converted && (
        <Grid container spacing={1.5} sx={{ mb: 2 }}>
          {otherUnits.map((unit) => {
            const valueStr = formatNumber(converted[unit]);
            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={unit}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    transition: 'all 200ms ease',
                    '&:hover': { background: alpha(theme.palette.primary.main, 0.04) }
                  }}
                >
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                      {unitLabels[unit]}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        fontFamily: 'monospace',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {valueStr} {unitShort[unit]}
                    </Typography>
                  </Box>
                  <CopyButton text={valueStr} />
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3 }}>
        <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 600, color: 'text.secondary' }}>
          Справочник
        </Typography>
        <Grid container spacing={1.5}>
          {commonConversions.map((item, idx) => (
            <Grid size={{ xs: 6, sm: 3 }} key={idx}>
              <Paper
                elevation={0}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  textAlign: 'center',
                  background: theme.palette.surfaceContainerLow
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '0.8rem' }}>
                  {item.from} = {item.to}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
}
