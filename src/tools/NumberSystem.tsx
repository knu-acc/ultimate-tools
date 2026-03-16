'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  Paper,
  RadioGroup,
  Radio,
  FormControlLabel,
  Grid,
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import { CopyButton } from '@/src/components/CopyButton';
import { useLanguage } from '@/src/i18n/LanguageContext';


interface BaseInfo {
  name: string;
  short: string;
  base: number;
  prefix: string;
  color: string;
}

const bases: BaseInfo[] = [
  { name: 'Двоичная', short: 'BIN', base: 2, prefix: '0b', color: '#e91e63' },
  { name: 'Восьмеричная', short: 'OCT', base: 8, prefix: '0o', color: '#9c27b0' },
  { name: 'Десятичная', short: 'DEC', base: 10, prefix: '', color: '#2196f3' },
  { name: 'Шестнадцатеричная', short: 'HEX', base: 16, prefix: '0x', color: '#4caf50' },
];

export default function NumberSystem() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';

  const basesI18n: BaseInfo[] = [
    { name: isEn ? 'Binary' : 'Двоичная', short: 'BIN', base: 2, prefix: '0b', color: '#e91e63' },
    { name: isEn ? 'Octal' : 'Восьмеричная', short: 'OCT', base: 8, prefix: '0o', color: '#9c27b0' },
    { name: isEn ? 'Decimal' : 'Десятичная', short: 'DEC', base: 10, prefix: '', color: '#2196f3' },
    { name: isEn ? 'Hexadecimal' : 'Шестнадцатеричная', short: 'HEX', base: 16, prefix: '0x', color: '#4caf50' },
  ];
  const [input, setInput] = useState('');
  const [inputBase, setInputBase] = useState(10);

  const isValidInput = useCallback((value: string, base: number): boolean => {
    if (!value) return true;
    const validChars: Record<number, RegExp> = {
      2: /^[01]+$/,
      8: /^[0-7]+$/,
      10: /^[0-9]+$/,
      16: /^[0-9a-fA-F]+$/
    };
    return validChars[base]?.test(value) ?? false;
  }, []);

  const conversions = useMemo(() => {
    if (!input || !isValidInput(input, inputBase)) {
      return null;
    }

    try {
      const decimal = parseInt(input, inputBase);
      if (isNaN(decimal) || decimal < 0) return null;

      return {
        2: decimal.toString(2),
        8: decimal.toString(8),
        10: decimal.toString(10),
        16: decimal.toString(16).toUpperCase()
      };
    } catch {
      return null;
    }
  }, [input, inputBase, isValidInput]);

  const formatBinary = (bin: string): string => {
    return bin.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatHex = (hex: string): string => {
    return hex.replace(/(.{2})/g, '$1 ').trim();
  };

  const isValid = isValidInput(input, inputBase);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Input */}
      <Paper elevation={0} sx={{ p: 3, mb: 2 }}>
        <TextField
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value.trim())}
          placeholder={
            inputBase === 2
              ? '101010'
              : inputBase === 8
                ? '52'
                : inputBase === 10
                  ? '42'
                  : '2A'
          }
          error={!!input && !isValid}
          helperText={
            input && !isValid
              ? (isEn ? `Invalid characters for base-${inputBase} system` : `Недопустимые символы для системы с основанием ${inputBase}`)
              : undefined
          }
          sx={{
            '& .MuiInputBase-input': {
              fontFamily: 'monospace',
              fontSize: '1.3rem',
              letterSpacing: 1
            }
          }}
          slotProps={{
            input: {
              startAdornment: (
                <Typography
                  sx={{
                    mr: 1,
                    fontFamily: 'monospace',
                    color: 'text.secondary',
                    fontWeight: 600
                  }}
                >
                  {basesI18n.find((b) => b.base === inputBase)?.prefix || ''}
                </Typography>
              )
            }
          }}
        />

        <Box sx={{ mt: 2 }}>
          <RadioGroup
            row
            value={inputBase}
            onChange={(e) => {
              setInputBase(Number(e.target.value));
              setInput('');
            }}
          >
            {basesI18n.map((b) => (
              <FormControlLabel
                key={b.base}
                value={b.base}
                control={<Radio size="small" />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Chip
                      label={b.short}
                      size="small"
                      sx={{
                        fontSize: '0.7rem',
                        height: 22,
                        backgroundColor: alpha(b.color, 0.12),
                        color: b.color,
                        fontWeight: 700
                      }}
                    />
                    <Typography variant="body2">{b.name}</Typography>
                  </Box>
                }
              />
            ))}
          </RadioGroup>
        </Box>
      </Paper>

      {/* Results */}
      {conversions && (
        <Paper elevation={0} sx={{ p: 3 }}>
          <Box sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            {basesI18n.map((b) => {
              const value = conversions[b.base as keyof typeof conversions];
              const displayValue =
                b.base === 2
                  ? formatBinary(value)
                  : b.base === 16
                    ? formatHex(value)
                    : value;
              const isSource = b.base === inputBase;

              return (
                <Grid size={12} key={b.base}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      border: `1px solid ${isSource ? b.color : theme.palette.divider}`,
                      borderRadius: 18,
                      backgroundColor: isSource ? alpha(b.color, 0.04) : 'transparent',
                      transitionProperty: 'background-color', transitionDuration: '200ms', transitionTimingFunction: 'ease',
                      '&:hover': {
                        borderColor: b.color,
                        backgroundColor: alpha(b.color, 0.04)
                      }
                    }}
                  >
                    <Chip
                      label={b.short}
                      size="small"
                      sx={{
                        minWidth: 50,
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        backgroundColor: alpha(b.color, 0.15),
                        color: b.color
                      }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="caption" color="text.secondary">
                        {b.name} ({isEn ? 'base' : 'основание'} {b.base})
                        {isSource && (isEn ? ' — source' : ' — исходное')}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontFamily: 'monospace',
                          fontSize: '1.1rem',
                          fontWeight: 500,
                          letterSpacing: 1,
                          wordBreak: 'break-all'
                        }}
                      >
                        {b.prefix && (
                          <Typography
                            component="span"
                            sx={{ color: 'text.secondary', fontFamily: 'monospace', fontSize: '1.1rem' }}
                          >
                            {b.prefix}
                          </Typography>
                        )}
                        {displayValue}
                      </Typography>
                    </Box>
                    <CopyButton text={value} />
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Paper>
      )}
    </Box>
  );
}
