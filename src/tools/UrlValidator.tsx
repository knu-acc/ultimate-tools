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
import ContentCopy from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

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
      searchParams: params,
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
      searchParams: [],
    };
  }
}

export default function UrlValidator() {
  const theme = useTheme();
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const result = useMemo(() => parseUrl(url), [url]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  };

  const parts: { label: string; value: string; key: string }[] = result && result.valid
    ? [
        { label: 'Протокол', value: result.protocol, key: 'protocol' },
        { label: 'Хост', value: result.hostname, key: 'hostname' },
        { label: 'Порт', value: result.port || '(по умолчанию)', key: 'port' },
        { label: 'Путь', value: result.pathname, key: 'pathname' },
        { label: 'Строка запроса', value: result.search || '(отсутствует)', key: 'search' },
        { label: 'Хэш (фрагмент)', value: result.hash || '(отсутствует)', key: 'hash' },
        { label: 'Origin', value: result.origin, key: 'origin' },
      ]
    : [];

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Input */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: 3 }}>
        <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 500, color: 'text.secondary' }}>
          Введите URL для анализа
        </Typography>
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
              ) : null,
            },
          }}
        />

        {result && (
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            {result.valid ? (
              <Chip
                icon={<CheckCircleIcon />}
                label="URL валиден"
                color="success"
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
            ) : (
              <Chip
                icon={<CancelIcon />}
                label="URL невалиден"
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
        <Paper elevation={0} sx={{ p: 3, mb: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Компоненты URL
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
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
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
                  <IconButton
                    size="small"
                    onClick={() => handleCopy(part.value, part.key)}
                    sx={{ color: copied === part.key ? 'success.main' : 'text.disabled' }}
                  >
                    <ContentCopy fontSize="small" />
                  </IconButton>
                )}
              </Box>
            ))}
          </Box>
        </Paper>
      )}

      {/* Query Parameters Table */}
      {result && result.valid && result.searchParams.length > 0 && (
        <Paper elevation={0} sx={{ p: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Параметры запроса
          </Typography>
          <Grid container spacing={1}>
            {/* Header */}
            <Grid size={5}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  Ключ
                </Typography>
              </Box>
            </Grid>
            <Grid size={7}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  Значение
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
                      borderRadius: 2,
                      border: `1px solid ${theme.palette.divider}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}
                    >
                      {key}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleCopy(key, `key-${i}`)}
                      sx={{ color: copied === `key-${i}` ? 'success.main' : 'text.disabled', ml: 0.5 }}
                    >
                      <ContentCopy sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Box>
                </Grid>
                <Grid size={7}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      border: `1px solid ${theme.palette.divider}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}
                    >
                      {decodeURIComponent(value)}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleCopy(value, `val-${i}`)}
                      sx={{ color: copied === `val-${i}` ? 'success.main' : 'text.disabled', ml: 0.5 }}
                    >
                      <ContentCopy sx={{ fontSize: 14 }} />
                    </IconButton>
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
