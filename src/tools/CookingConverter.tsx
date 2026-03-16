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
  useTheme,
  alpha
} from '@mui/material';
import { CopyButton } from '@/src/components/CopyButton';
import { useLanguage } from '@/src/i18n/LanguageContext';

type VolumeUnit = 'cups' | 'tbsp' | 'tsp' | 'ml' | 'liters' | 'floz';
type WeightUnit = 'grams';
type CookingUnit = VolumeUnit | WeightUnit;
type Ingredient = 'water' | 'flour' | 'sugar' | 'butter' | 'oil';

const ingredientDensity: Record<Ingredient, number> = {
  water: 1.0,
  flour: 0.53,
  sugar: 0.85,
  butter: 0.91,
  oil: 0.92
};

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
    inMl = value / ingredientDensity[ingredient];
  } else {
    inMl = value * toMl[from];
  }

  const result: Partial<Record<CookingUnit, number>> = {};
  for (const unit of volumeUnits) {
    const raw = inMl / toMl[unit];
    result[unit] = parseFloat(raw.toPrecision(8));
  }
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

// commonConversions moved inside component for i18n

export default function CookingConverter() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';

  const unitLabels: Record<CookingUnit, string> = {
    cups: isEn ? 'Cups' : 'Стаканы',
    tbsp: isEn ? 'Tablespoons' : 'Ст. ложки',
    tsp: isEn ? 'Teaspoons' : 'Ч. ложки',
    ml: isEn ? 'Milliliters' : 'Миллилитры',
    liters: isEn ? 'Liters' : 'Литры',
    floz: isEn ? 'Fluid ounces' : 'Жидкие унции',
    grams: isEn ? 'Grams' : 'Граммы'
  };

  const unitShort: Record<CookingUnit, string> = {
    cups: 'cup',
    tbsp: isEn ? 'tbsp' : 'ст.л.',
    tsp: isEn ? 'tsp' : 'ч.л.',
    ml: isEn ? 'ml' : 'мл',
    liters: isEn ? 'L' : 'л',
    floz: 'fl oz',
    grams: isEn ? 'g' : 'г'
  };

  const ingredientLabels: Record<Ingredient, string> = {
    water: isEn ? 'Water' : 'Вода',
    flour: isEn ? 'Flour' : 'Мука',
    sugar: isEn ? 'Sugar' : 'Сахар',
    butter: isEn ? 'Butter' : 'Масло сливочное',
    oil: isEn ? 'Vegetable oil' : 'Масло растительное'
  };

  const commonConversions = [
    { from: '1 cup', to: isEn ? '240 ml' : '240 мл' },
    { from: isEn ? '1 tbsp' : '1 ст.л.', to: isEn ? '15 ml' : '15 мл' },
    { from: isEn ? '1 tsp' : '1 ч.л.', to: isEn ? '5 ml' : '5 мл' },
    { from: '1 cup', to: isEn ? '16 tbsp' : '16 ст.л.' },
    { from: isEn ? '1 tbsp' : '1 ст.л.', to: isEn ? '3 tsp' : '3 ч.л.' },
    { from: '1 fl oz', to: isEn ? '29.57 ml' : '29.57 мл' },
    { from: isEn ? '1 L' : '1 л', to: '4.17 cup' },
    { from: isEn ? '1 cup flour' : '1 cup муки', to: isEn ? '~128 g' : '~128 г' },
  ];
  const [input, setInput] = useState('1');
  const [sourceUnit, setSourceUnit] = useState<CookingUnit>('cups');
  const [ingredient, setIngredient] = useState<Ingredient>('water');

  const numericValue = parseFloat(input);
  const isValid = input !== '' && !isNaN(numericValue) && numericValue >= 0;
  const converted = isValid ? convertAll(numericValue, sourceUnit, ingredient) : null;

  const otherUnits = (Object.keys(unitLabels) as CookingUnit[]).filter((u) => u !== sourceUnit);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 2,
          borderRadius: 18,
          background: theme.palette.surfaceContainerLow
        }}
      >
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          <TextField
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="1"
            error={input !== '' && !isValid}
            slotProps={{
              htmlInput: { min: 0, step: 'any' },
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
              minWidth: 160,
              '& .MuiInputBase-root': { fontFamily: 'monospace', fontSize: '1.2rem' }
            }}
          />
          <Select
            value={sourceUnit}
            onChange={(e) => setSourceUnit(e.target.value as CookingUnit)}
            sx={{ flex: 1, minWidth: 180 }}
          >
            {(Object.keys(unitLabels) as CookingUnit[]).map((unit) => (
              <MenuItem key={unit} value={unit}>
                {unitLabels[unit]} ({unitShort[unit]})
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {(Object.keys(ingredientLabels) as Ingredient[]).map((ing) => (
            <Chip
              key={ing}
              label={ingredientLabels[ing]}
              onClick={() => setIngredient(ing)}
              color={ingredient === ing ? 'primary' : 'default'}
              variant={ingredient === ing ? 'filled' : 'outlined'}
              size="small"
              sx={{
                fontWeight: ingredient === ing ? 600 : 400,
                transitionProperty: 'background-color', transitionDuration: '200ms', transitionTimingFunction: 'ease'
              }}
            />
          ))}
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
                      {valueStr}
                      <Typography component="span" variant="body2" sx={{ ml: 0.5, color: 'text.secondary', fontWeight: 400 }}>
                        {unitShort[unit]}
                      </Typography>
                    </Typography>
                    {unit === 'grams' && (
                      <Typography variant="caption" color="text.secondary">
                        {ingredientLabels[ingredient]}
                      </Typography>
                    )}
                  </Box>
                  <CopyButton text={valueStr} />
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 18 }}>
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
