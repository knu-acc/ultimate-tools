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
  liters: 'Литры (л)',
  milliliters: 'Миллилитры (мл)',
  gallons: 'Галлоны US (gal)',
  quarts: 'Кварты (qt)',
  pints: 'Пинты (pt)',
  cups: 'Чашки (cup)',
  tablespoons: 'Столовые ложки (tbsp)',
  teaspoons: 'Чайные ложки (tsp)',
  cubicMeters: 'Кубические метры (м³)',
  cubicCentimeters: 'Кубические сантиметры (см³)'
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

// Conversion factors to liters
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
  const [input, setInput] = useState<string>('1');
  const [sourceUnit, setSourceUnit] = useState<VolumeUnit>('liters');
  const [copied, setCopied] = useState<string>('');

  const numericValue = parseFloat(input);
  const isValid = input !== '' && !isNaN(numericValue) && numericValue >= 0;
  const converted = isValid ? convertAll(numericValue, sourceUnit) : null;

  const otherUnits = (Object.keys(unitLabels) as VolumeUnit[]).filter((u) => u !== sourceUnit);

  const copyValue = async (unit: VolumeUnit, value: string) => {
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
            onChange={(e) => setSourceUnit(e.target.value as VolumeUnit)}
            sx={{
              flex: 1,
              minWidth: 200,
              borderRadius: 2
            }}
          >
            {(Object.keys(unitLabels) as VolumeUnit[]).map((unit) => (
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
