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
  IconButton,
  Tooltip,
  useTheme,
  alpha
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { CopyButton, ShareButton } from '@/src/components/CopyButton';


type LengthUnit = 'meters' | 'kilometers' | 'centimeters' | 'millimeters' | 'miles' | 'yards' | 'feet' | 'inches';

const unitLabels: Record<LengthUnit, string> = {
  meters: 'Метры (м)',
  kilometers: 'Километры (км)',
  centimeters: 'Сантиметры (см)',
  millimeters: 'Миллиметры (мм)',
  miles: 'Мили (mi)',
  yards: 'Ярды (yd)',
  feet: 'Футы (ft)',
  inches: 'Дюймы (in)'
};

const unitShort: Record<LengthUnit, string> = {
  meters: 'м',
  kilometers: 'км',
  centimeters: 'см',
  millimeters: 'мм',
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

const commonConversions = [
  { from: '1 км', to: '1000 м' },
  { from: '1 миля', to: '1.609 км' },
  { from: '1 ярд', to: '0.9144 м' },
  { from: '1 фут', to: '30.48 см' },
  { from: '1 дюйм', to: '2.54 см' },
  { from: '1 м', to: '3.281 фута' },
  { from: '1 км', to: '0.6214 мили' },
  { from: '1 м', to: '39.37 дюймов' },
];

export default function LengthConverter() {
  const theme = useTheme();
  const [input, setInput] = useState<string>('1');
  const [sourceUnit, setSourceUnit] = useState<LengthUnit>('meters');
  const [copied, setCopied] = useState<string>('');

  const numericValue = parseFloat(input);
  const isValid = input !== '' && !isNaN(numericValue) && numericValue >= 0;
  const converted = isValid ? convertAll(numericValue, sourceUnit) : null;

  const otherUnits = (Object.keys(unitLabels) as LengthUnit[]).filter((u) => u !== sourceUnit);

  const copyValue = async (unit: LengthUnit, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(unit);
    setTimeout(() => setCopied(''), 2000);
  };

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
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            size="small"
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Введите число"
            slotProps={{ htmlInput: { min: 0 } }}
            sx={{
              flex: 2,
              minWidth: 180,
              '& .MuiInputBase-root': { fontFamily: 'monospace', fontSize: '1.1rem' }
            }}
          />
          <Select
            size="small"
            value={sourceUnit}
            onChange={(e) => setSourceUnit(e.target.value as LengthUnit)}
            sx={{
              flex: 1,
              minWidth: 200,
              borderRadius: 2
            }}
          >
            {(Object.keys(unitLabels) as LengthUnit[]).map((unit) => (
              <MenuItem key={unit} value={unit}>
                {unitLabels[unit]}
              </MenuItem>
            ))}
          </Select>
        </Box>
        {input !== '' && !isValid && (
          <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
            Введите корректное неотрицательное число
          </Typography>
        )}
      </Paper>

      {/* Результаты */}
      {converted ? (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {/* Исходное значение */}
          <Grid size={{ xs: 12 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 4,
                border: `2px solid ${theme.palette.primary.main}`,
                background: theme.palette.surfaceContainerHigh,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }}>
                  Исходное значение
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: 'monospace', mt: 0.5 }}>
                  {formatNumber(converted[sourceUnit])} {unitShort[sourceUnit]}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Карточки результатов */}
          {otherUnits.map((unit) => {
            const valueStr = formatNumber(converted[unit]);
            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={unit}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 4,
                    transition: 'all 200ms ease',
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      background: theme.palette.surfaceContainerLow
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        {unitLabels[unit]}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          fontFamily: 'monospace',
                          mt: 0.5,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {valueStr} {unitShort[unit]}
                      </Typography>
                    </Box>
                    <CopyButton text={valueStr} />
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 4,
            textAlign: 'center'
          }}
        >
          <Typography color="text.secondary">
            Введите корректное число для конвертации
          </Typography>
        </Paper>
      )}

      {/* Справочная таблица */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 4
        }}
      >
        <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
          Распространённые соотношения
        </Typography>
        <Grid container spacing={1.5}>
          {commonConversions.map((item, idx) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
              <Paper
                elevation={0}
                sx={{
                  p: 1.5,
                  borderRadius: 3,
                  textAlign: 'center',
                  background: theme.palette.surfaceContainerLowest
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                  {item.from}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  =
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, fontFamily: 'monospace' }}>
                  {item.to}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
}
