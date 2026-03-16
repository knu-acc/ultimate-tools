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
  alpha,
  IconButton,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { CopyButton } from '@/src/components/CopyButton';
import { useLanguage } from '@/src/i18n/LanguageContext';


interface UrlParts {
  valid: boolean;
  protocol: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  origin: string;
  searchParams: [string, string][];
}

function parseUrl(input: string): UrlParts | null {
  if (!input.trim()) return null;
  try {
    const url = new URL(input);
    const params: [string, string][] = [];
    url.searchParams.forEach((value, key) => {
      params.push([key, value]);
    });
    return {
      valid: true,
      protocol: url.protocol,
      hostname: url.hostname,
      port: url.port,
      pathname: url.pathname,
      search: url.search,
      hash: url.hash,
      origin: url.origin,
      searchParams: params
    };
  } catch {
    return {
      valid: false,
      protocol: '',
      hostname: '',
      port: '',
      pathname: '',
      search: '',
      hash: '',
      origin: '',
      searchParams: []
    };
  }
}

export default function UrlValidator() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const [url, setUrl] = useState('');

  const result = useMemo(() => parseUrl(url), [url]);

  const parts: { label: string; value: string; key: string }[] = result && result.valid
    ? [
        { label: isEn ? 'Protocol' : 'Протокол', value: result.protocol, key: 'protocol' },
        { label: isEn ? 'Host' : 'Хост', value: result.hostname, key: 'hostname' },
        { label: isEn ? 'Port' : 'Порт', value: result.port || (isEn ? '(default)' : '(по умолчанию)'), key: 'port' },
        { label: isEn ? 'Path' : 'Путь', value: result.pathname, key: 'pathname' },
        { label: isEn ? 'Query string' : 'Строка запроса', value: result.search || (isEn ? '(none)' : '(отсутствует)'), key: 'search' },
        { label: isEn ? 'Hash (fragment)' : 'Хэш (фрагмент)', value: result.hash || (isEn ? '(none)' : '(отсутствует)'), key: 'hash' },
        { label: 'Origin', value: result.origin, key: 'origin' },
      ]
    : [];

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: { xs: 2, sm: 3 } }}>
      {/* Input */}
      <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, mb: 2, borderRadius: 18, bgcolor: theme.palette.surfaceContainerLow, transitionProperty: 'background-color', transitionDuration: '200ms', transitionTimingFunction: 'ease', '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) } }}>
        <TextField
          fullWidth
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com:8080/path?key=value&foo=bar#section"
          sx={{ '& .MuiInputBase-input': { fontFamily: 'monospace', fontSize: '1rem' } }}
          slotProps={{
            input: {
              endAdornment: url.trim() ? (
                <IconButton size="small" onClick={() => setUrl('')} sx={{ mr: 0.5 }}>
                  <CancelIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                </IconButton>
              ) : null
            }
          }}
        />

        {result && (
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            {result.valid ? (
              <Chip
                icon={<CheckCircleIcon />}
                label={isEn ? 'URL is valid' : 'URL валиден'}
                color="success"
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
            ) : (
              <Chip
                icon={<CancelIcon />}
                label={isEn ? 'URL is invalid' : 'URL невалиден'}
                color="error"
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
            )}
          </Box>
        )}
      </Paper>

      {/* URL Parts */}
      {result && result.valid && (
        <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, mb: 2, borderRadius: 18, bgcolor: theme.palette.surfaceContainerLow, transitionProperty: 'background-color', transitionDuration: '200ms', transitionTimingFunction: 'ease', '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) } }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
            {isEn ? 'URL components' : 'Компоненты URL'}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {parts.map((part) => (
              <Box
                key={part.key}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 1.5,
                  borderRadius: 10,
                  backgroundColor: theme.palette.surfaceContainerLow,
                  border: `1px solid ${theme.palette.surfaceContainerHigh}`
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, minWidth: 140, color: 'text.secondary' }}
                >
                  {part.label}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontFamily: 'monospace', flex: 1, wordBreak: 'break-all' }}
                >
                  {part.value}
                </Typography>
                {part.value && !part.value.startsWith('(') && (
                  <CopyButton text={part.value} />
                )}
              </Box>
            ))}
          </Box>
        </Paper>
      )}

      {/* Query Parameters Table */}
      {result && result.valid && result.searchParams.length > 0 && (
        <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 18, bgcolor: theme.palette.surfaceContainerLow, transitionProperty: 'background-color', transitionDuration: '200ms', transitionTimingFunction: 'ease', '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) } }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
            {isEn ? 'Query parameters' : 'Параметры запроса'}
          </Typography>
          <Grid container spacing={1}>
            {/* Header */}
            <Grid size={5}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 10,
                  backgroundColor: theme.palette.surfaceContainerHigh
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {isEn ? 'Key' : 'Ключ'}
                </Typography>
              </Box>
            </Grid>
            <Grid size={7}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 10,
                  backgroundColor: theme.palette.surfaceContainerHigh
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {isEn ? 'Value' : 'Значение'}
                </Typography>
              </Box>
            </Grid>

            {/* Rows */}
            {result.searchParams.map(([key, value], i) => (
              <Grid container spacing={1} key={i} size={12}>
                <Grid size={5}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}
                    >
                      {key}
                    </Typography>
                    <CopyButton text={key} />
                  </Box>
                </Grid>
                <Grid size={7}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}
                    >
                      {decodeURIComponent(value)}
                    </Typography>
                    <CopyButton text={value} />
                  </Box>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}
    </Box>
  );
}
