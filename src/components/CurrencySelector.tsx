'use client';

import { Select, MenuItem, Box, Typography, useTheme } from '@mui/material';

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  flag: string;
  locale: string;
}

export const CIS_CURRENCIES: Currency[] = [
  { code: 'RUB', symbol: '₽', name: 'Российский рубль',     flag: '🇷🇺', locale: 'ru-RU' },
  { code: 'KZT', symbol: '₸', name: 'Казахстанский тенге',  flag: '🇰🇿', locale: 'kk-KZ' },
  { code: 'USD', symbol: '$', name: 'Доллар США',            flag: '🇺🇸', locale: 'en-US' },
  { code: 'EUR', symbol: '€', name: 'Евро',                  flag: '🇪🇺', locale: 'de-DE' },
  { code: 'BYN', symbol: 'Br', name: 'Белорусский рубль',    flag: '🇧🇾', locale: 'be-BY' },
  { code: 'KGS', symbol: 'с', name: 'Кыргызский сом',        flag: '🇰🇬', locale: 'ky-KG' },
  { code: 'UZS', symbol: 'сўм', name: 'Узбекский сум',       flag: '🇺🇿', locale: 'uz-UZ' },
  { code: 'UAH', symbol: '₴', name: 'Украинская гривна',     flag: '🇺🇦', locale: 'uk-UA' },
  { code: 'GEL', symbol: '₾', name: 'Грузинский лари',       flag: '🇬🇪', locale: 'ka-GE' },
  { code: 'AMD', symbol: '֏', name: 'Армянский драм',         flag: '🇦🇲', locale: 'hy-AM' },
  { code: 'AZN', symbol: '₼', name: 'Азербайджанский манат', flag: '🇦🇿', locale: 'az-AZ' },
  { code: 'TJS', symbol: 'SM', name: 'Таджикский сомони',    flag: '🇹🇯', locale: 'tg-TJ' },
  { code: 'TMT', symbol: 'T', name: 'Туркменский манат',     flag: '🇹🇲', locale: 'tk-TM' },
];

export function getCurrency(code: string): Currency {
  return CIS_CURRENCIES.find(c => c.code === code) ?? CIS_CURRENCIES[0];
}

export function formatAmount(amount: number, currencyCode: string): string {
  const c = getCurrency(currencyCode);
  return `${amount.toLocaleString('ru-RU', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} ${c.symbol}`;
}

interface Props {
  value: string;
  onChange: (code: string) => void;
  size?: 'small' | 'medium';
}

export default function CurrencySelector({ value, onChange, size = 'small' }: Props) {
  const theme = useTheme();
  const selected = getCurrency(value);

  return (
    <Select
      value={value}
      onChange={e => onChange(e.target.value)}
      size={size}
      sx={{
        bgcolor: theme.palette.surfaceContainerHigh,
        '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
        '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
        borderRadius: 2,
        fontWeight: 500,
        minWidth: 110,
      }}
      renderValue={() => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>{selected.flag}</span>
          <Typography variant="body2" fontWeight={600}>{selected.code}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 0.25 }}>{selected.symbol}</Typography>
        </Box>
      )}
    >
      {CIS_CURRENCIES.map(c => (
        <MenuItem key={c.code} value={c.code}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 0.25 }}>
            <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>{c.flag}</span>
            <Box>
              <Typography variant="body2" fontWeight={600}>
                {c.code} <Typography component="span" variant="body2" color="text.secondary">{c.symbol}</Typography>
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                {c.name}
              </Typography>
            </Box>
          </Box>
        </MenuItem>
      ))}
    </Select>
  );
}
