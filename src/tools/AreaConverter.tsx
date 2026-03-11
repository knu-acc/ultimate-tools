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
  alpha,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';

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
  squareMeters: 'Квадратные метры (м²)',
  squareKilometers: 'Квадратные километры (км²)',
  squareFeet: 'Квадратные футы (ft²)',
  squareYards: 'Квадратные ярды (yd²)',
  acres: 'Акры (ac)',
  hectares: 'Гектары (га)',
  squareMiles: 'Квадратные мили (mi²)',
  squareCentimeters: 'Квадратные сантиметры (см²)',
  squareInches: 'Квадратные дюймы (in²)',
  sotka: 'Сотки (сот.)',
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
  sotka: 'сот.',
};

// Conversion factors to square meters
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
  sotka: 100,
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
  const [input, setInput] = useState<string>('1');
  const [sourceUnit, setSourceUnit] = useState<AreaUnit>('squareMeters');
  const [copied, setCopied] = useState<string>('');

  const numericValue = parseFloat(input);
  const isValid = input !== '' && !isNaN(numericValue) && numericValue >= 0;
  const converted = isValid ? convertAll(numericValue, sourceUnit) : null;

  const otherUnits = (Object.keys(unitLabels) as AreaUnit[]).filter((u) => u !== sourceUnit);

  const copyValue = async (unit: AreaUnit, value: string) => {
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
          border: `1px solid ${theme.palette.divider}`,
          background: alpha(theme.palette.primary.main, 0.04),
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
              '& .MuiInputBase-root': { fontFamily: 'monospace', fontSize: '1.1rem' },
            }}
          />
          <Select
            size="small"
            value={sourceUnit}
            onChange={(e) => setSourceUnit(e.target.value as AreaUnit)}
            sx={{
              flex: 1,
              minWidth: 200,
              borderRadius: 2,
            }}
          >
            {(Object.keys(unitLabels) as AreaUnit[]).map((unit) => (
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
                background: alpha(theme.palette.primary.main, 0.08),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
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
                    border: `1px solid ${theme.palette.divider}`,
                    transition: 'all 200ms ease',
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      background: alpha(theme.palette.primary.main, 0.04),
                    },
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
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {valueStr} {unitShort[unit]}
                      </Typography>
                    </Box>
                    <Tooltip title={copied === unit ? 'Скопировано!' : 'Копировать'}>
                      <IconButton
                        size="small"
                        onClick={() => copyValue(unit, `${valueStr} ${unitShort[unit]}`)}
                        color={copied === unit ? 'success' : 'default'}
                        sx={{ mt: 0.5 }}
                      >
                        {copied === unit ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
                      </IconButton>
                    </Tooltip>
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
            border: `1px solid ${theme.palette.divider}`,
            textAlign: 'center',
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
          borderRadius: 4,
          border: `1px solid ${theme.palette.divider}`,
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
                  border: `1px solid ${theme.palette.divider}`,
                  textAlign: 'center',
                  background: alpha(theme.palette.primary.main, 0.02),
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
