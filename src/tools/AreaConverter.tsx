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

type AreaUnit =
  | 'squareMeters'
  | 'squareKilometers'
  | 'squareFeet'
  | 'squareYards'
  | 'acres'
  | 'hectares'
  | 'squareMiles'
  | 'squareCentimeters'
  | 'squareInches'
  | 'sotka';

const unitLabels: Record<AreaUnit, string> = {
  squareMeters: 'Квадратные метры',
  squareKilometers: 'Квадратные километры',
  squareFeet: 'Квадратные футы',
  squareYards: 'Квадратные ярды',
  acres: 'Акры',
  hectares: 'Гектары',
  squareMiles: 'Квадратные мили',
  squareCentimeters: 'Квадратные сантиметры',
  squareInches: 'Квадратные дюймы',
  sotka: 'Сотки'
};

const unitShort: Record<AreaUnit, string> = {
  squareMeters: 'м²',
  squareKilometers: 'км²',
  squareFeet: 'ft²',
  squareYards: 'yd²',
  acres: 'ac',
  hectares: 'га',
  squareMiles: 'mi²',
  squareCentimeters: 'см²',
  squareInches: 'in²',
  sotka: 'сот.'
};

const toSquareMeters: Record<AreaUnit, number> = {
  squareMeters: 1,
  squareKilometers: 1e6,
  squareFeet: 0.09290304,
  squareYards: 0.83612736,
  acres: 4046.8564224,
  hectares: 10000,
  squareMiles: 2589988.110336,
  squareCentimeters: 0.0001,
  squareInches: 0.00064516,
  sotka: 100
};

function convertAll(value: number, from: AreaUnit): Record<AreaUnit, number> {
  const inSqMeters = value * toSquareMeters[from];
  const result: Partial<Record<AreaUnit, number>> = {};
  for (const unit of Object.keys(toSquareMeters) as AreaUnit[]) {
    const raw = inSqMeters / toSquareMeters[unit];
    result[unit] = parseFloat(raw.toPrecision(10));
  }
  return result as Record<AreaUnit, number>;
}

function formatNumber(n: number): string {
  if (Number.isInteger(n) && Math.abs(n) < 1e15) return n.toString();
  if (Math.abs(n) >= 1e10 || (Math.abs(n) < 1e-6 && n !== 0)) {
    return n.toExponential(6);
  }
  return parseFloat(n.toFixed(8)).toString();
}

const commonConversions = [
  { from: '1 га', to: '10 000 м²' },
  { from: '1 сотка', to: '100 м²' },
  { from: '1 км²', to: '100 га' },
  { from: '1 акр', to: '4047 м²' },
  { from: '1 mi²', to: '2.59 км²' },
  { from: '1 м²', to: '10.76 ft²' },
  { from: '1 yd²', to: '0.8361 м²' },
  { from: '1 га', to: '2.471 акра' },
];

export default function AreaConverter() {
  const theme = useTheme();
  const [input, setInput] = useState('1');
  const [sourceUnit, setSourceUnit] = useState<AreaUnit>('squareMeters');

  const numericValue = parseFloat(input);
  const isValid = input !== '' && !isNaN(numericValue) && numericValue >= 0;
  const converted = isValid ? convertAll(numericValue, sourceUnit) : null;

  const otherUnits = (Object.keys(unitLabels) as AreaUnit[]).filter((u) => u !== sourceUnit);

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
            onChange={(e) => setSourceUnit(e.target.value as AreaUnit)}
            sx={{ flex: 1, minWidth: 200 }}
          >
            {(Object.keys(unitLabels) as AreaUnit[]).map((unit) => (
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
                  background: theme.palette.surfaceContainerLowest
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
