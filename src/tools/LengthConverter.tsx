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
import { useLanguage } from '@/src/i18n/LanguageContext';


type LengthUnit = 'meters' | 'kilometers' | 'centimeters' | 'millimeters' | 'miles' | 'yards' | 'feet' | 'inches';

const unitLabelsRu: Record<LengthUnit, string> = {
  meters: 'Метры (м)',
  kilometers: 'Километры (км)',
  centimeters: 'Сантиметры (см)',
  millimeters: 'Миллиметры (мм)',
  miles: 'Мили (mi)',
  yards: 'Ярды (yd)',
  feet: 'Футы (ft)',
  inches: 'Дюймы (in)'
};

const unitLabelsEn: Record<LengthUnit, string> = {
  meters: 'Meters (m)',
  kilometers: 'Kilometers (km)',
  centimeters: 'Centimeters (cm)',
  millimeters: 'Millimeters (mm)',
  miles: 'Miles (mi)',
  yards: 'Yards (yd)',
  feet: 'Feet (ft)',
  inches: 'Inches (in)'
};

const unitShortRu: Record<LengthUnit, string> = {
  meters: 'м',
  kilometers: 'км',
  centimeters: 'см',
  millimeters: 'мм',
  miles: 'mi',
  yards: 'yd',
  feet: 'ft',
  inches: 'in'
};

const unitShortEn: Record<LengthUnit, string> = {
  meters: 'm',
  kilometers: 'km',
  centimeters: 'cm',
  millimeters: 'mm',
  miles: 'mi',
  yards: 'yd',
  feet: 'ft',
  inches: 'in'
};

// Conversion factors to meters
const toMeters: Record<LengthUnit, number> = {
  meters: 1,
  kilometers: 1000,
  centimeters: 0.01,
  millimeters: 0.001,
  miles: 1609.344,
  yards: 0.9144,
  feet: 0.3048,
  inches: 0.0254
};

function convertAll(value: number, from: LengthUnit): Record<LengthUnit, number> {
  const inMeters = value * toMeters[from];
  const result: Partial<Record<LengthUnit, number>> = {};
  for (const unit of Object.keys(toMeters) as LengthUnit[]) {
    const raw = inMeters / toMeters[unit];
    result[unit] = parseFloat(raw.toPrecision(10));
  }
  return result as Record<LengthUnit, number>;
}

function formatNumber(n: number): string {
  if (Number.isInteger(n) && Math.abs(n) < 1e15) return n.toString();
  if (Math.abs(n) >= 1e10 || (Math.abs(n) < 1e-6 && n !== 0)) {
    return n.toExponential(6);
  }
  return parseFloat(n.toFixed(8)).toString();
}

const commonConversionsRu = [
  { from: '1 км', to: '1000 м' },
  { from: '1 миля', to: '1.609 км' },
  { from: '1 ярд', to: '0.9144 м' },
  { from: '1 фут', to: '30.48 см' },
  { from: '1 дюйм', to: '2.54 см' },
  { from: '1 м', to: '3.281 фута' },
  { from: '1 км', to: '0.6214 мили' },
  { from: '1 м', to: '39.37 дюймов' },
];

const commonConversionsEn = [
  { from: '1 km', to: '1000 m' },
  { from: '1 mile', to: '1.609 km' },
  { from: '1 yard', to: '0.9144 m' },
  { from: '1 foot', to: '30.48 cm' },
  { from: '1 inch', to: '2.54 cm' },
  { from: '1 m', to: '3.281 feet' },
  { from: '1 km', to: '0.6214 miles' },
  { from: '1 m', to: '39.37 inches' },
];

export default function LengthConverter() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const unitLabels = isEn ? unitLabelsEn : unitLabelsRu;
  const unitShort = isEn ? unitShortEn : unitShortRu;
  const commonConversions = isEn ? commonConversionsEn : commonConversionsRu;
  const [input, setInput] = useState<string>('1');
  const [sourceUnit, setSourceUnit] = useState<LengthUnit>('meters');
  const numericValue = parseFloat(input);
  const isValid = input !== '' && !isNaN(numericValue) && numericValue >= 0;
  const converted = isValid ? convertAll(numericValue, sourceUnit) : null;

  const otherUnits = (Object.keys(unitLabels) as LengthUnit[]).filter((u) => u !== sourceUnit);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 2,
          borderRadius: 18,
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
            onChange={(e) => setSourceUnit(e.target.value as LengthUnit)}
            sx={{ flex: 1, minWidth: 200 }}
          >
            {(Object.keys(unitLabels) as LengthUnit[]).map((unit) => (
              <MenuItem key={unit} value={unit}>
                {unitLabels[unit]}
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
                    borderRadius: 18,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    transitionProperty: 'background-color', transitionDuration: '200ms', transitionTimingFunction: 'ease',
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

      <Paper elevation={0} sx={{ p: 2.5, borderRadius: 18 }}>
        <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 600, color: 'text.secondary' }}>
          {isEn ? 'Reference' : 'Справочник'}
        </Typography>
        <Grid container spacing={1.5}>
          {commonConversions.map((item, idx) => (
            <Grid size={{ xs: 6, sm: 3 }} key={idx}>
              <Paper
                elevation={0}
                sx={{
                  p: 1.5,
                  borderRadius: 10,
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
