'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Select,
  MenuItem,
  Grid,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
  alpha
} from '@mui/material';
import { useLanguage } from '@/src/i18n/LanguageContext';

type Gender = 'male' | 'female';
type ClothingCategory = 'outerwear' | 'pants' | 'shirts';
type SizeSystem = 'RU' | 'EU' | 'US' | 'UK' | 'INT';

const categoryLabelsRu: Record<ClothingCategory, string> = {
  outerwear: 'Верхняя одежда',
  pants: 'Брюки',
  shirts: 'Рубашки'
};

const categoryLabelsEn: Record<ClothingCategory, string> = {
  outerwear: 'Outerwear',
  pants: 'Pants',
  shirts: 'Shirts'
};

const sizeSystemLabelsRu: Record<SizeSystem, string> = {
  RU: 'Россия (RU)',
  EU: 'Европа (EU)',
  US: 'США (US)',
  UK: 'Великобритания (UK)',
  INT: 'Международный'
};

const sizeSystemLabelsEn: Record<SizeSystem, string> = {
  RU: 'Russia (RU)',
  EU: 'Europe (EU)',
  US: 'USA (US)',
  UK: 'United Kingdom (UK)',
  INT: 'International'
};

// Size data: [RU, EU, US, UK, INT, chest_cm, waist_cm, hips_cm]
interface SizeRow {
  ru: string;
  eu: string;
  us: string;
  uk: string;
  int: string;
  chest: string;
  waist: string;
  hips: string;
}

const maleOuterwear: SizeRow[] = [
  { ru: '44', eu: '38', us: 'XS', uk: '34', int: 'XS', chest: '86-89', waist: '70-73', hips: '90-93' },
  { ru: '46', eu: '40', us: 'S', uk: '36', int: 'S', chest: '90-93', waist: '74-77', hips: '94-97' },
  { ru: '48', eu: '42', us: 'M', uk: '38', int: 'M', chest: '94-97', waist: '78-81', hips: '98-101' },
  { ru: '50', eu: '44', us: 'L', uk: '40', int: 'L', chest: '98-101', waist: '82-85', hips: '102-105' },
  { ru: '52', eu: '46', us: 'XL', uk: '42', int: 'XL', chest: '102-105', waist: '86-89', hips: '106-109' },
  { ru: '54', eu: '48', us: 'XXL', uk: '44', int: 'XXL', chest: '106-109', waist: '90-94', hips: '110-113' },
  { ru: '56', eu: '50', us: '3XL', uk: '46', int: '3XL', chest: '110-113', waist: '95-99', hips: '114-117' },
  { ru: '58', eu: '52', us: '4XL', uk: '48', int: '3XL', chest: '114-117', waist: '100-104', hips: '118-121' },
];

const malePants: SizeRow[] = [
  { ru: '44', eu: '38', us: '28', uk: '28', int: 'XS', chest: '—', waist: '70-73', hips: '90-93' },
  { ru: '46', eu: '40', us: '30', uk: '30', int: 'S', chest: '—', waist: '74-77', hips: '94-97' },
  { ru: '48', eu: '42', us: '32', uk: '32', int: 'M', chest: '—', waist: '78-81', hips: '98-101' },
  { ru: '50', eu: '44', us: '34', uk: '34', int: 'L', chest: '—', waist: '82-85', hips: '102-105' },
  { ru: '52', eu: '46', us: '36', uk: '36', int: 'XL', chest: '—', waist: '86-89', hips: '106-109' },
  { ru: '54', eu: '48', us: '38', uk: '38', int: 'XXL', chest: '—', waist: '90-94', hips: '110-113' },
  { ru: '56', eu: '50', us: '40', uk: '40', int: '3XL', chest: '—', waist: '95-99', hips: '114-117' },
  { ru: '58', eu: '52', us: '42', uk: '42', int: '3XL', chest: '—', waist: '100-104', hips: '118-121' },
];

const maleShirts: SizeRow[] = [
  { ru: '44', eu: '36', us: '14', uk: '14', int: 'XS', chest: '86-89', waist: '70-73', hips: '—' },
  { ru: '46', eu: '37-38', us: '14.5-15', uk: '14.5-15', int: 'S', chest: '90-93', waist: '74-77', hips: '—' },
  { ru: '48', eu: '39-40', us: '15.5', uk: '15.5', int: 'M', chest: '94-97', waist: '78-81', hips: '—' },
  { ru: '50', eu: '41-42', us: '16', uk: '16', int: 'L', chest: '98-101', waist: '82-85', hips: '—' },
  { ru: '52', eu: '43-44', us: '16.5', uk: '16.5', int: 'XL', chest: '102-105', waist: '86-89', hips: '—' },
  { ru: '54', eu: '45-46', us: '17', uk: '17', int: 'XXL', chest: '106-109', waist: '90-94', hips: '—' },
  { ru: '56', eu: '47-48', us: '17.5', uk: '17.5', int: '3XL', chest: '110-113', waist: '95-99', hips: '—' },
];

const femaleOuterwear: SizeRow[] = [
  { ru: '40', eu: '34', us: '2', uk: '6', int: 'XS', chest: '78-81', waist: '58-61', hips: '84-87' },
  { ru: '42', eu: '36', us: '4', uk: '8', int: 'S', chest: '82-85', waist: '62-65', hips: '88-91' },
  { ru: '44', eu: '38', us: '6', uk: '10', int: 'M', chest: '86-89', waist: '66-69', hips: '92-95' },
  { ru: '46', eu: '40', us: '8', uk: '12', int: 'M', chest: '90-93', waist: '70-73', hips: '96-99' },
  { ru: '48', eu: '42', us: '10', uk: '14', int: 'L', chest: '94-97', waist: '74-77', hips: '100-103' },
  { ru: '50', eu: '44', us: '12', uk: '16', int: 'L', chest: '98-101', waist: '78-81', hips: '104-107' },
  { ru: '52', eu: '46', us: '14', uk: '18', int: 'XL', chest: '102-105', waist: '82-85', hips: '108-111' },
  { ru: '54', eu: '48', us: '16', uk: '20', int: 'XXL', chest: '106-109', waist: '86-90', hips: '112-115' },
  { ru: '56', eu: '50', us: '18', uk: '22', int: '3XL', chest: '110-113', waist: '91-95', hips: '116-119' },
];

const femalePants: SizeRow[] = [
  { ru: '40', eu: '34', us: '2', uk: '6', int: 'XS', chest: '—', waist: '58-61', hips: '84-87' },
  { ru: '42', eu: '36', us: '4', uk: '8', int: 'S', chest: '—', waist: '62-65', hips: '88-91' },
  { ru: '44', eu: '38', us: '6', uk: '10', int: 'M', chest: '—', waist: '66-69', hips: '92-95' },
  { ru: '46', eu: '40', us: '8', uk: '12', int: 'M', chest: '—', waist: '70-73', hips: '96-99' },
  { ru: '48', eu: '42', us: '10', uk: '14', int: 'L', chest: '—', waist: '74-77', hips: '100-103' },
  { ru: '50', eu: '44', us: '12', uk: '16', int: 'L', chest: '—', waist: '78-81', hips: '104-107' },
  { ru: '52', eu: '46', us: '14', uk: '18', int: 'XL', chest: '—', waist: '82-85', hips: '108-111' },
  { ru: '54', eu: '48', us: '16', uk: '20', int: 'XXL', chest: '—', waist: '86-90', hips: '112-115' },
];

const femaleShirts: SizeRow[] = [
  { ru: '40', eu: '34', us: '2', uk: '6', int: 'XS', chest: '78-81', waist: '58-61', hips: '—' },
  { ru: '42', eu: '36', us: '4', uk: '8', int: 'S', chest: '82-85', waist: '62-65', hips: '—' },
  { ru: '44', eu: '38', us: '6', uk: '10', int: 'M', chest: '86-89', waist: '66-69', hips: '—' },
  { ru: '46', eu: '40', us: '8', uk: '12', int: 'M', chest: '90-93', waist: '70-73', hips: '—' },
  { ru: '48', eu: '42', us: '10', uk: '14', int: 'L', chest: '94-97', waist: '74-77', hips: '—' },
  { ru: '50', eu: '44', us: '12', uk: '16', int: 'L', chest: '98-101', waist: '78-81', hips: '—' },
  { ru: '52', eu: '46', us: '14', uk: '18', int: 'XL', chest: '102-105', waist: '82-85', hips: '—' },
  { ru: '54', eu: '48', us: '16', uk: '20', int: 'XXL', chest: '106-109', waist: '86-90', hips: '—' },
];

function getTable(gender: Gender, category: ClothingCategory): SizeRow[] {
  if (gender === 'male') {
    if (category === 'outerwear') return maleOuterwear;
    if (category === 'pants') return malePants;
    return maleShirts;
  }
  if (category === 'outerwear') return femaleOuterwear;
  if (category === 'pants') return femalePants;
  return femaleShirts;
}

function getSizeValue(row: SizeRow, system: SizeSystem): string {
  switch (system) {
    case 'RU': return row.ru;
    case 'EU': return row.eu;
    case 'US': return row.us;
    case 'UK': return row.uk;
    case 'INT': return row.int;
  }
}

function getAllSizesForSystem(table: SizeRow[], system: SizeSystem): string[] {
  const seen = new Set<string>();
  return table
    .map((row) => getSizeValue(row, system))
    .filter((v) => {
      if (seen.has(v)) return false;
      seen.add(v);
      return true;
    });
}

export default function ClothingSize() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const categoryLabels = isEn ? categoryLabelsEn : categoryLabelsRu;
  const sizeSystemLabels = isEn ? sizeSystemLabelsEn : sizeSystemLabelsRu;
  const [gender, setGender] = useState<Gender>('male');
  const [category, setCategory] = useState<ClothingCategory>('outerwear');
  const [sizeSystem, setSizeSystem] = useState<SizeSystem>('RU');
  const [selectedSize, setSelectedSize] = useState('');

  const table = getTable(gender, category);
  const availableSizes = getAllSizesForSystem(table, sizeSystem);

  // Find matching row
  const matchedRow = selectedSize
    ? table.find((row) => getSizeValue(row, sizeSystem) === selectedSize)
    : null;

  const handleGenderChange = (_: React.MouseEvent<HTMLElement>, val: Gender | null) => {
    if (val !== null) {
      setGender(val);
      setSelectedSize('');
    }
  };

  const handleCategoryChange = (cat: ClothingCategory) => {
    setCategory(cat);
    setSelectedSize('');
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Настройки */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 2,
          borderRadius: 3,
          background: theme.palette.surfaceContainerLow
        }}
      >
        <ToggleButtonGroup
          value={gender}
          exclusive
          onChange={handleGenderChange}
          size="small"
          sx={{
            mb: 2.5,
            '& .MuiToggleButton-root': {
              borderRadius: 3,
              px: 3,
              textTransform: 'none',
              fontWeight: 500,
              '&.Mui-selected': {
                background: theme.palette.surfaceContainerHigh,
                color: theme.palette.primary.main,
                fontWeight: 600,
                '&:hover': {
                  background: alpha(theme.palette.primary.main, 0.18)
                }
              }
            }
          }}
        >
          <ToggleButton value="male">{isEn ? 'Male' : 'Мужчина'}</ToggleButton>
          <ToggleButton value="female">{isEn ? 'Female' : 'Женщина'}</ToggleButton>
        </ToggleButtonGroup>

        <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
          {isEn ? 'Category' : 'Категория'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2.5 }}>
          {(Object.keys(categoryLabels) as ClothingCategory[]).map((cat) => (
            <Chip
              key={cat}
              label={categoryLabels[cat]}
              size="small"
              variant={category === cat ? 'filled' : 'outlined'}
              color={category === cat ? 'primary' : 'default'}
              onClick={() => handleCategoryChange(cat)}
              sx={{ borderRadius: 2, cursor: 'pointer' }}
            />
          ))}
        </Box>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Select
              size="small"
              fullWidth
              value={sizeSystem}
              onChange={(e) => {
                setSizeSystem(e.target.value as SizeSystem);
                setSelectedSize('');
              }}
              sx={{ borderRadius: 2 }}
            >
              {(Object.keys(sizeSystemLabels) as SizeSystem[]).map((sys) => (
                <MenuItem key={sys} value={sys}>
                  {sizeSystemLabels[sys]}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Select
              size="small"
              fullWidth
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              displayEmpty
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="">{isEn ? 'Select size' : 'Выберите размер'}</MenuItem>
              {availableSizes.map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>
      </Paper>

      {/* Результат конвертации */}
      {matchedRow && (
        <>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            {(Object.keys(sizeSystemLabels) as SizeSystem[]).map((sys) => (
              <Grid size={{ xs: 6, sm: 4, md: 2.4 }} key={sys}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    background: sys === sizeSystem ? theme.palette.surfaceContainerHigh : 'transparent',
                    textAlign: 'center',
                    transition: 'all 200ms ease',
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      background: alpha(theme.palette.primary.main, 0.04)
                    }
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}
                  >
                    {sys}
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, fontFamily: 'monospace', mt: 0.5 }}
                  >
                    {getSizeValue(matchedRow, sys)}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Мерки */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              mb: 2,
              borderRadius: 3
            }}
          >
            <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
              {isEn ? 'Body measurements (cm)' : 'Мерки тела (см)'}
            </Typography>
            <Grid container spacing={2}>
              {[
                { label: isEn ? 'Chest' : 'Обхват груди', value: matchedRow.chest },
                { label: isEn ? 'Waist' : 'Обхват талии', value: matchedRow.waist },
                { label: isEn ? 'Hips' : 'Обхват бёдер', value: matchedRow.hips },
              ]
                .filter((m) => m.value !== '—')
                .map((m) => (
                  <Grid size={{ xs: 12, sm: 4 }} key={m.label}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        background: theme.palette.surfaceContainerLow,
                        textAlign: 'center'
                      }}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                        {m.label}
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'monospace', mt: 0.5 }}>
                        {m.value} {isEn ? 'cm' : 'см'}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
            </Grid>
          </Paper>
        </>
      )}

      {/* Полная таблица */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 3
        }}
      >
        <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
          {isEn ? `Full size chart — ${categoryLabels[category]} (${gender === 'male' ? 'men' : 'women'})` : `Полная таблица размеров — ${categoryLabels[category]} (${gender === 'male' ? 'мужские' : 'женские'})`}
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
                fontSize: '0.85rem',
                whiteSpace: 'nowrap'
              },
              '& th': {
                fontWeight: 600,
                color: 'text.secondary',
                background: theme.palette.surfaceContainerLow
              },
              '& td': {
                fontFamily: 'monospace'
              },
              '& tr:hover td': {
                background: theme.palette.surfaceContainerLow
              }
            }}
          >
            <thead>
              <tr>
                <th>RU</th>
                <th>EU</th>
                <th>US</th>
                <th>UK</th>
                <th>INT</th>
                <th>{isEn ? 'Chest (cm)' : 'Грудь (см)'}</th>
                <th>{isEn ? 'Waist (cm)' : 'Талия (см)'}</th>
                <th>{isEn ? 'Hips (cm)' : 'Бёдра (см)'}</th>
              </tr>
            </thead>
            <tbody>
              {table.map((row, idx) => (
                <tr
                  key={idx}
                  style={{
                    background:
                      matchedRow && row.ru === matchedRow.ru
                        ? theme.palette.surfaceContainerHigh
                        : undefined
                  }}
                >
                  <td>{row.ru}</td>
                  <td>{row.eu}</td>
                  <td>{row.us}</td>
                  <td>{row.uk}</td>
                  <td>{row.int}</td>
                  <td>{row.chest}</td>
                  <td>{row.waist}</td>
                  <td>{row.hips}</td>
                </tr>
              ))}
            </tbody>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
