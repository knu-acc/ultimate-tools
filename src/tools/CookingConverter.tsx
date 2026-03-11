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
  IconButton,
  Tooltip,
  useTheme,
  alpha
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { CopyButton, ShareButton } from '@/src/components/CopyButton';


type VolumeUnit = 'cups' | 'tbsp' | 'tsp' | 'ml' | 'liters' | 'floz';
type WeightUnit = 'grams';
type CookingUnit = VolumeUnit | WeightUnit;
type Ingredient = 'water' | 'flour' | 'sugar' | 'butter' | 'oil';

const unitLabels: Record<CookingUnit, string> = {
  cups: 'Стаканы (cup)',
  tbsp: 'Ст. ложки (ст.л.)',
  tsp: 'Ч. ложки (ч.л.)',
  ml: 'Миллилитры (мл)',
  liters: 'Литры (л)',
  floz: 'Жидкие унции (fl oz)',
  grams: 'Граммы (г)'
};

const unitShort: Record<CookingUnit, string> = {
  cups: 'cup',
  tbsp: 'ст.л.',
  tsp: 'ч.л.',
  ml: 'мл',
  liters: 'л',
  floz: 'fl oz',
  grams: 'г'
};

const ingredientLabels: Record<Ingredient, string> = {
  water: 'Вода',
  flour: 'Мука',
  sugar: 'Сахар',
  butter: 'Масло сливочное',
  oil: 'Масло растительное'
};

// Density in g/ml for weight conversions
const ingredientDensity: Record<Ingredient, number> = {
  water: 1.0,
  flour: 0.53,
  sugar: 0.85,
  butter: 0.91,
  oil: 0.92
};

// Conversion factors to ml
const toMl: Record<VolumeUnit, number> = {
  cups: 240,
  tbsp: 15,
  tsp: 5,
  ml: 1,
  liters: 1000,
  floz: 29.5735
};

const volumeUnits: VolumeUnit[] = ['cups', 'tbsp', 'tsp', 'ml', 'liters', 'floz'];

function convertAll(
  value: number,
  from: CookingUnit,
  ingredient: Ingredient
): Record<CookingUnit, number> {
  let inMl: number;

  if (from === 'grams') {
    // grams -> ml via density, then to all units
    inMl = value / ingredientDensity[ingredient];
  } else {
    inMl = value * toMl[from];
  }

  const result: Partial<Record<CookingUnit, number>> = {};
  for (const unit of volumeUnits) {
    const raw = inMl / toMl[unit];
    result[unit] = parseFloat(raw.toPrecision(8));
  }
  // ml -> grams via density
  result.grams = parseFloat((inMl * ingredientDensity[ingredient]).toPrecision(8));

  return result as Record<CookingUnit, number>;
}

function formatNumber(n: number): string {
  if (n === 0) return '0';
  if (Number.isInteger(n) && Math.abs(n) < 1e12) return n.toString();
  if (Math.abs(n) >= 1e8 || (Math.abs(n) < 1e-4 && n !== 0)) {
    return n.toExponential(4);
  }
  return parseFloat(n.toFixed(4)).toString();
}

const commonConversions = [
  { from: '1 cup', to: '240 мл' },
  { from: '1 ст.л.', to: '15 мл' },
  { from: '1 ч.л.', to: '5 мл' },
  { from: '1 cup', to: '16 ст.л.' },
  { from: '1 ст.л.', to: '3 ч.л.' },
  { from: '1 fl oz', to: '29.57 мл' },
  { from: '1 л', to: '4.17 cup' },
  { from: '1 cup муки', to: '~128 г' },
];

export default function CookingConverter() {
  const theme = useTheme();
  const [input, setInput] = useState<string>('1');
  const [sourceUnit, setSourceUnit] = useState<CookingUnit>('cups');
  const [ingredient, setIngredient] = useState<Ingredient>('water');
  const [copied, setCopied] = useState<string>('');

  const numericValue = parseFloat(input);
  const isValid = input !== '' && !isNaN(numericValue) && numericValue >= 0;
  const converted = isValid ? convertAll(numericValue, sourceUnit, ingredient) : null;

  const otherUnits = (Object.keys(unitLabels) as CookingUnit[]).filter((u) => u !== sourceUnit);

  const copyValue = async (unit: CookingUnit, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(unit);
      setTimeout(() => setCopied(''), 2000);
    } catch {
      // clipboard not available
    }
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
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2.5 }}>
          <TextField
            size="small"
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Введите число"
            slotProps={{ htmlInput: { min: 0, step: 'any' } }}
            sx={{
              flex: 2,
              minWidth: 160,
              '& .MuiInputBase-root': { fontFamily: 'monospace', fontSize: '1.1rem' }
            }}
          />
          <Select
            size="small"
            value={sourceUnit}
            onChange={(e) => setSourceUnit(e.target.value as CookingUnit)}
            sx={{
              flex: 1,
              minWidth: 200,
              borderRadius: 2
            }}
          >
            {(Object.keys(unitLabels) as CookingUnit[]).map((unit) => (
              <MenuItem key={unit} value={unit}>
                {unitLabels[unit]}
              </MenuItem>
            ))}
          </Select>
        </Box>

        {input !== '' && !isValid && (
          <Typography variant="caption" color="error" sx={{ mb: 2, display: 'block' }}>
            Введите корректное неотрицательное число
          </Typography>
        )}

        <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
          Ингредиент (для пересчёта в граммы)
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {(Object.keys(ingredientLabels) as Ingredient[]).map((ing) => (
            <Chip
              key={ing}
              label={ingredientLabels[ing]}
              onClick={() => setIngredient(ing)}
              color={ingredient === ing ? 'primary' : 'default'}
              variant={ingredient === ing ? 'filled' : 'outlined'}
              sx={{
                borderRadius: 3,
                fontWeight: ingredient === ing ? 600 : 400,
                transition: 'all 200ms ease'
              }}
            />
          ))}
        </Box>
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
                textAlign: 'center'
              }}
            >
              <Typography
                variant="caption"
                sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }}
              >
                Исходное значение
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: 'monospace', mt: 0.5 }}>
                {formatNumber(converted[sourceUnit])} {unitShort[sourceUnit]}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {unitLabels[sourceUnit]}
                {(sourceUnit === 'grams' || otherUnits.includes('grams' as CookingUnit)) && (
                  <> &middot; {ingredientLabels[ingredient]}</>
                )}
              </Typography>
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
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}
                      >
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
                      {unit === 'grams' && (
                        <Typography variant="caption" color="text.secondary">
                          {ingredientLabels[ingredient]}
                        </Typography>
                      )}
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

      {/* Распространённые соотношения */}
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
