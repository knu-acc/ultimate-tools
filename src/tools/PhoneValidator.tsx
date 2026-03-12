'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  Paper,
  Chip,
  Grid,
  useTheme,
  alpha
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

interface CountryInfo {
  code: string;
  name: string;
  prefix: string;
  length: number[];
  format: (digits: string) => { international: string; national: string; e164: string };
}

const countries: CountryInfo[] = [
  {
    code: 'RU',
    name: 'Россия',
    prefix: '+7',
    length: [11],
    format: (d) => {
      const n = d.replace(/\D/g, '').slice(-10);
      return {
        international: `+7 (${n.slice(0, 3)}) ${n.slice(3, 6)}-${n.slice(6, 8)}-${n.slice(8, 10)}`,
        national: `8 (${n.slice(0, 3)}) ${n.slice(3, 6)}-${n.slice(6, 8)}-${n.slice(8, 10)}`,
        e164: `+7${n}`
      };
    }
  },
  {
    code: 'US',
    name: 'США',
    prefix: '+1',
    length: [11],
    format: (d) => {
      const n = d.replace(/\D/g, '').slice(-10);
      return {
        international: `+1 (${n.slice(0, 3)}) ${n.slice(3, 6)}-${n.slice(6, 10)}`,
        national: `(${n.slice(0, 3)}) ${n.slice(3, 6)}-${n.slice(6, 10)}`,
        e164: `+1${n}`
      };
    }
  },
  {
    code: 'UA',
    name: 'Украина',
    prefix: '+380',
    length: [12],
    format: (d) => {
      const n = d.replace(/\D/g, '').slice(-9);
      return {
        international: `+380 (${n.slice(0, 2)}) ${n.slice(2, 5)}-${n.slice(5, 7)}-${n.slice(7, 9)}`,
        national: `0${n.slice(0, 2)} ${n.slice(2, 5)} ${n.slice(5, 7)} ${n.slice(7, 9)}`,
        e164: `+380${n}`
      };
    }
  },
  {
    code: 'BY',
    name: 'Беларусь',
    prefix: '+375',
    length: [12],
    format: (d) => {
      const n = d.replace(/\D/g, '').slice(-9);
      return {
        international: `+375 (${n.slice(0, 2)}) ${n.slice(2, 5)}-${n.slice(5, 7)}-${n.slice(7, 9)}`,
        national: `8 (0${n.slice(0, 2)}) ${n.slice(2, 5)}-${n.slice(5, 7)}-${n.slice(7, 9)}`,
        e164: `+375${n}`
      };
    }
  },
  {
    code: 'KZ',
    name: 'Казахстан',
    prefix: '+7',
    length: [11],
    format: (d) => {
      const n = d.replace(/\D/g, '').slice(-10);
      return {
        international: `+7 (${n.slice(0, 3)}) ${n.slice(3, 6)}-${n.slice(6, 8)}-${n.slice(8, 10)}`,
        national: `8 (${n.slice(0, 3)}) ${n.slice(3, 6)}-${n.slice(6, 8)}-${n.slice(8, 10)}`,
        e164: `+7${n}`
      };
    }
  },
  {
    code: 'DE',
    name: 'Германия',
    prefix: '+49',
    length: [11, 12, 13],
    format: (d) => {
      const n = d.replace(/\D/g, '').slice(-11);
      return {
        international: `+49 ${n.slice(0, 3)} ${n.slice(3, 7)} ${n.slice(7)}`,
        national: `0${n.slice(0, 3)} ${n.slice(3, 7)} ${n.slice(7)}`,
        e164: `+49${n}`
      };
    }
  },
  {
    code: 'GB',
    name: 'Великобритания',
    prefix: '+44',
    length: [12],
    format: (d) => {
      const n = d.replace(/\D/g, '').slice(-10);
      return {
        international: `+44 ${n.slice(0, 4)} ${n.slice(4)}`,
        national: `0${n.slice(0, 4)} ${n.slice(4)}`,
        e164: `+44${n}`
      };
    }
  },
];

function detectCountry(input: string): { country: CountryInfo | null; digits: string } {
  const digits = input.replace(/\D/g, '');
  if (!digits) return { country: null, digits };

  // Check for explicit + prefix matches
  const cleaned = input.replace(/[\s()-]/g, '');

  if (cleaned.startsWith('+380') || digits.startsWith('380')) {
    return { country: countries.find((c) => c.code === 'UA')!, digits };
  }
  if (cleaned.startsWith('+375') || digits.startsWith('375')) {
    return { country: countries.find((c) => c.code === 'BY')!, digits };
  }
  if (cleaned.startsWith('+49') || digits.startsWith('49')) {
    return { country: countries.find((c) => c.code === 'DE')!, digits };
  }
  if (cleaned.startsWith('+44') || digits.startsWith('44')) {
    return { country: countries.find((c) => c.code === 'GB')!, digits };
  }
  if (cleaned.startsWith('+1') || (digits.startsWith('1') && digits.length === 11)) {
    return { country: countries.find((c) => c.code === 'US')!, digits };
  }
  // +7: distinguish Russia vs Kazakhstan by area code
  if (cleaned.startsWith('+7') || digits.startsWith('7') || digits.startsWith('8')) {
    const localDigits = digits.startsWith('8') ? '7' + digits.slice(1) : digits.startsWith('7') ? digits : digits;
    const areaCode = localDigits.slice(1, 4);
    // Kazakhstan area codes: 6xx, 7xx
    if (/^[67]\d{2}$/.test(areaCode)) {
      return { country: countries.find((c) => c.code === 'KZ')!, digits: localDigits };
    }
    return { country: countries.find((c) => c.code === 'RU')!, digits: localDigits };
  }

  return { country: null, digits };
}

export default function PhoneValidator() {
  const theme = useTheme();
  const [phone, setPhone] = useState('');

  const result = useMemo(() => {
    const trimmed = phone.trim();
    if (!trimmed) return null;

    const { country, digits } = detectCountry(trimmed);
    const digitsOnly = digits.replace(/\D/g, '');

    if (!country) {
      return {
        country: null,
        valid: false,
        digits: digitsOnly,
        formatted: null,
        reason: 'Не удалось определить страну. Проверьте код страны.'
      };
    }

    const valid = country.length.includes(digitsOnly.length);

    const formatted = valid ? country.format(digitsOnly) : null;

    const reason = valid
      ? null
      : `Ожидается ${country.length.join(' или ')} цифр для ${country.name} (${country.prefix}), получено ${digitsOnly.length}`;

    return { country, valid, digits: digitsOnly, formatted, reason };
  }, [phone]);

  const commonCodes = [
    { country: 'Россия', prefix: '+7', flag: 'RU' },
    { country: 'Казахстан', prefix: '+7', flag: 'KZ' },
    { country: 'США / Канада', prefix: '+1', flag: 'US' },
    { country: 'Украина', prefix: '+380', flag: 'UA' },
    { country: 'Беларусь', prefix: '+375', flag: 'BY' },
    { country: 'Германия', prefix: '+49', flag: 'DE' },
    { country: 'Великобритания', prefix: '+44', flag: 'GB' },
    { country: 'Франция', prefix: '+33', flag: 'FR' },
    { country: 'Италия', prefix: '+39', flag: 'IT' },
    { country: 'Испания', prefix: '+34', flag: 'ES' },
    { country: 'Китай', prefix: '+86', flag: 'CN' },
    { country: 'Япония', prefix: '+81', flag: 'JP' },
    { country: 'Индия', prefix: '+91', flag: 'IN' },
    { country: 'Бразилия', prefix: '+55', flag: 'BR' },
    { country: 'Турция', prefix: '+90', flag: 'TR' },
    { country: 'Польша', prefix: '+48', flag: 'PL' },
  ];

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: { xs: 2, sm: 3 } }}>
      {/* Input */}
      <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, mb: 2, borderRadius: 3, bgcolor: theme.palette.surfaceContainerLow, transition: 'background-color 0.2s ease', '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) } }}>
        <TextField
          fullWidth
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+7 (999) 123-45-67"
          sx={{ '& .MuiInputBase-input': { fontFamily: 'monospace', fontSize: '1.1rem' } }}
        />

        {result && (
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            {result.valid ? (
              <Chip
                icon={<CheckCircleIcon />}
                label="Номер валиден"
                color="success"
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
            ) : (
              <Chip
                icon={<CancelIcon />}
                label="Номер невалиден"
                color="error"
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
            )}
            {result.country && (
              <Chip
                label={`${result.country.name} (${result.country.prefix})`}
                variant="outlined"
                sx={{ fontWeight: 500 }}
              />
            )}
          </Box>
        )}

        {result && !result.valid && result.reason && (
          <Typography variant="body2" sx={{ mt: 1.5, color: 'error.main' }}>
            {result.reason}
          </Typography>
        )}
      </Paper>

      {result && result.valid && result.formatted && (
        <Grid container spacing={3}>
          {/* Formatted Versions */}
          <Grid size={12}>
            <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, bgcolor: theme.palette.surfaceContainerLow, transition: 'background-color 0.2s ease', '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) } }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Форматированные версии
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {[
                  { label: 'Международный', value: result.formatted.international },
                  { label: 'Национальный', value: result.formatted.national },
                  { label: 'E.164', value: result.formatted.e164 },
                ].map((item) => (
                  <Box
                    key={item.label}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: theme.palette.surfaceContainerLow,
                      border: `1px solid ${theme.palette.surfaceContainerHigh}`
                    }}
                  >
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                      {item.label}
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '1rem' }}>
                      {item.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>

          {/* Details */}
          <Grid size={12}>
            <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, bgcolor: theme.palette.surfaceContainerLow }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Информация
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip label={`Страна: ${result.country!.name}`} variant="outlined" />
                <Chip label={`Код: ${result.country!.prefix}`} variant="outlined" />
                <Chip label={`Цифр: ${result.digits.length}`} variant="outlined" />
                <Chip label={`Код страны: ${result.country!.code}`} variant="outlined" />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Common Country Codes */}
      <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, mt: 3, borderRadius: 3, bgcolor: theme.palette.surfaceContainerLow, transition: 'background-color 0.2s ease', '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) } }}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
          Справочник кодов стран
        </Typography>
        <Grid container spacing={1}>
          {commonCodes.map((item) => (
            <Grid size={{ xs: 6, sm: 4, md: 3 }} key={item.flag + item.prefix}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.text.primary, 0.03),
                  cursor: 'pointer',
                  transition: 'background-color 0.15s',
                  '&:hover': {
                    backgroundColor: theme.palette.surfaceContainerHigh
                  }
                }}
                onClick={() => setPhone(item.prefix + ' ')}
              >
                <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8rem' }} noWrap>
                  {item.country}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontFamily: 'monospace', fontWeight: 600, color: 'primary.main', ml: 1 }}
                >
                  {item.prefix}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
}
