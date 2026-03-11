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
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
  alpha,
} from '@mui/material';

type SizeSystem = 'eu' | 'us_men' | 'us_women' | 'uk' | 'jp';
type Gender = 'men' | 'women';

const systemLabels: Record<SizeSystem, string> = {
  eu: 'EU',
  us_men: 'US (муж.)',
  us_women: 'US (жен.)',
  uk: 'UK',
  jp: 'JP (см)',
};

const systemShort: Record<SizeSystem, string> = {
  eu: 'EU',
  us_men: 'US М',
  us_women: 'US Ж',
  uk: 'UK',
  jp: 'см',
};

// All conversions go through EU as the common base
// EU -> cm (foot length) formula: cm = (EU + 2) * 2/3
// We use lookup-based approach for accuracy

// Men's size table: [EU, US Men, US Women, UK, JP cm]
const menSizeTable: [number, number, number, number, number][] = [
  [38, 5.5, 7, 5, 24],
  [38.5, 6, 7.5, 5.5, 24.5],
  [39, 6.5, 8, 6, 25],
  [40, 7, 8.5, 6.5, 25.5],
  [40.5, 7.5, 9, 7, 26],
  [41, 8, 9.5, 7.5, 26.5],
  [42, 8.5, 10, 8, 27],
  [42.5, 9, 10.5, 8.5, 27.5],
  [43, 9.5, 11, 9, 28],
  [44, 10, 11.5, 9.5, 28.5],
  [44.5, 10.5, 12, 10, 29],
  [45, 11, 12.5, 10.5, 29.5],
  [45.5, 11.5, 13, 11, 30],
  [46, 12, 13.5, 11.5, 30.5],
  [47, 13, 14.5, 12.5, 31],
  [48, 14, 15.5, 13.5, 32],
];

// Women's size table: [EU, US Men, US Women, UK, JP cm]
const womenSizeTable: [number, number, number, number, number][] = [
  [35, 3.5, 5, 2.5, 22],
  [35.5, 4, 5.5, 3, 22.5],
  [36, 4.5, 6, 3.5, 23],
  [36.5, 5, 6.5, 4, 23.5],
  [37, 5.5, 7, 4.5, 24],
  [37.5, 6, 7.5, 5, 24.5],
  [38, 6.5, 8, 5.5, 25],
  [38.5, 7, 8.5, 6, 25.5],
  [39, 7.5, 9, 6.5, 26],
  [40, 8, 9.5, 7, 26.5],
  [40.5, 8.5, 10, 7.5, 27],
  [41, 9, 10.5, 8, 27.5],
  [42, 9.5, 11, 8.5, 28],
  [42.5, 10, 11.5, 9, 28.5],
];

const systemIndex: Record<SizeSystem, number> = {
  eu: 0,
  us_men: 1,
  us_women: 2,
  uk: 3,
  jp: 4,
};

function findClosestRow(
  value: number,
  system: SizeSystem,
  table: [number, number, number, number, number][]
): [number, number, number, number, number] | null {
  const idx = systemIndex[system];
  let closest: [number, number, number, number, number] | null = null;
  let minDiff = Infinity;

  for (const row of table) {
    const diff = Math.abs(row[idx] - value);
    if (diff < minDiff) {
      minDiff = diff;
      closest = row;
    }
  }

  // Allow some tolerance for interpolation
  if (closest && minDiff <= 1.5) {
    return closest;
  }
  return null;
}

function interpolateConversion(
  value: number,
  fromSystem: SizeSystem,
  table: [number, number, number, number, number][]
): Record<SizeSystem, number> | null {
  const fromIdx = systemIndex[fromSystem];

  // Find surrounding rows
  let lowerRow: [number, number, number, number, number] | null = null;
  let upperRow: [number, number, number, number, number] | null = null;

  const sorted = [...table].sort((a, b) => a[fromIdx] - b[fromIdx]);

  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i][fromIdx] === value) {
      // Exact match
      return {
        eu: sorted[i][0],
        us_men: sorted[i][1],
        us_women: sorted[i][2],
        uk: sorted[i][3],
        jp: sorted[i][4],
      };
    }
    if (sorted[i][fromIdx] < value) {
      lowerRow = sorted[i];
    }
    if (sorted[i][fromIdx] > value && !upperRow) {
      upperRow = sorted[i];
    }
  }

  if (lowerRow && upperRow) {
    const range = upperRow[fromIdx] - lowerRow[fromIdx];
    const fraction = (value - lowerRow[fromIdx]) / range;

    const result: Record<SizeSystem, number> = {} as Record<SizeSystem, number>;
    const systems: SizeSystem[] = ['eu', 'us_men', 'us_women', 'uk', 'jp'];
    for (const sys of systems) {
      const sIdx = systemIndex[sys];
      const interpolated = lowerRow[sIdx] + fraction * (upperRow[sIdx] - lowerRow[sIdx]);
      result[sys] = parseFloat(interpolated.toFixed(1));
    }
    return result;
  }

  // If value is close to table boundaries, use closest row
  const closest = findClosestRow(value, fromSystem, table);
  if (closest) {
    return {
      eu: closest[0],
      us_men: closest[1],
      us_women: closest[2],
      uk: closest[3],
      jp: closest[4],
    };
  }

  return null;
}

function formatSize(n: number): string {
  if (Number.isInteger(n)) return n.toString();
  // Round to nearest 0.5
  const rounded = Math.round(n * 2) / 2;
  return rounded.toFixed(1).replace('.0', '');
}

export default function ShoeSize() {
  const theme = useTheme();
  const [input, setInput] = useState<string>('42');
  const [sourceSystem, setSourceSystem] = useState<SizeSystem>('eu');
  const [gender, setGender] = useState<Gender>('men');

  const numericValue = parseFloat(input);
  const isValid = input !== '' && !isNaN(numericValue) && numericValue > 0;

  const table = gender === 'men' ? menSizeTable : womenSizeTable;
  const converted = isValid ? interpolateConversion(numericValue, sourceSystem, table) : null;

  const otherSystems = (Object.keys(systemLabels) as SizeSystem[]).filter((s) => s !== sourceSystem);

  const displayTable = gender === 'men' ? menSizeTable : womenSizeTable;

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
          Пол
        </Typography>
        <ToggleButtonGroup
          value={gender}
          exclusive
          onChange={(_, val) => {
            if (val !== null) setGender(val);
          }}
          size="small"
          sx={{
            mb: 2.5,
            '& .MuiToggleButton-root': {
              borderRadius: 3,
              px: 3,
              textTransform: 'none',
              fontWeight: 500,
              transition: 'all 200ms ease',
              '&.Mui-selected': {
                background: alpha(theme.palette.primary.main, 0.12),
                color: theme.palette.primary.main,
                fontWeight: 600,
                '&:hover': {
                  background: alpha(theme.palette.primary.main, 0.18),
                },
              },
            },
          }}
        >
          <ToggleButton value="men">Мужской</ToggleButton>
          <ToggleButton value="women">Женский</ToggleButton>
        </ToggleButtonGroup>

        <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 600, color: 'text.secondary' }}>
          Введите размер
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            size="small"
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Введите размер"
            slotProps={{ htmlInput: { min: 0, step: 0.5 } }}
            sx={{
              flex: 2,
              minWidth: 160,
              '& .MuiInputBase-root': { fontFamily: 'monospace', fontSize: '1.1rem' },
            }}
          />
          <Select
            size="small"
            value={sourceSystem}
            onChange={(e) => setSourceSystem(e.target.value as SizeSystem)}
            sx={{
              flex: 1,
              minWidth: 180,
              borderRadius: 2,
            }}
          >
            {(Object.keys(systemLabels) as SizeSystem[]).map((sys) => (
              <MenuItem key={sys} value={sys}>
                {systemLabels[sys]}
              </MenuItem>
            ))}
          </Select>
        </Box>
        {input !== '' && !isValid && (
          <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
            Введите корректное положительное число
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
                textAlign: 'center',
              }}
            >
              <Typography
                variant="caption"
                sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }}
              >
                Исходный размер
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: 'monospace', mt: 0.5 }}>
                {formatSize(converted[sourceSystem])} {systemShort[sourceSystem]}
              </Typography>
              <Chip
                label={gender === 'men' ? 'Мужской' : 'Женский'}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ mt: 1, borderRadius: 2 }}
              />
            </Paper>
          </Grid>

          {/* Карточки результатов */}
          {otherSystems.map((sys) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={sys}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 4,
                  border: `1px solid ${theme.palette.divider}`,
                  textAlign: 'center',
                  transition: 'all 200ms ease',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    background: alpha(theme.palette.primary.main, 0.04),
                  },
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}
                >
                  {systemLabels[sys]}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    fontFamily: 'monospace',
                    mt: 0.5,
                  }}
                >
                  {formatSize(converted[sys])}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : isValid ? (
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
            Размер вне диапазона таблицы. Попробуйте другое значение.
          </Typography>
        </Paper>
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
            Введите корректный размер для конвертации
          </Typography>
        </Paper>
      )}

      {/* Таблица размеров */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 4,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
          Таблица размеров ({gender === 'men' ? 'мужские' : 'женские'})
        </Typography>
        <Box sx={{ overflowX: 'auto' }}>
          <Box
            component="table"
            sx={{
              width: '100%',
              borderCollapse: 'collapse',
              '& th, & td': {
                p: 1.5,
                textAlign: 'center',
                borderBottom: `1px solid ${theme.palette.divider}`,
                fontSize: '0.875rem',
                whiteSpace: 'nowrap',
              },
              '& th': {
                fontWeight: 600,
                color: 'text.secondary',
                background: alpha(theme.palette.primary.main, 0.04),
              },
              '& td': {
                fontFamily: 'monospace',
              },
              '& tr:hover td': {
                background: alpha(theme.palette.primary.main, 0.03),
              },
            }}
          >
            <thead>
              <tr>
                <th>EU</th>
                <th>US (муж.)</th>
                <th>US (жен.)</th>
                <th>UK</th>
                <th>JP (см)</th>
              </tr>
            </thead>
            <tbody>
              {displayTable.map((row, idx) => (
                <tr key={idx}>
                  <td>{row[0]}</td>
                  <td>{row[1]}</td>
                  <td>{row[2]}</td>
                  <td>{row[3]}</td>
                  <td>{row[4]}</td>
                </tr>
              ))}
            </tbody>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
