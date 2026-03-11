'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Chip,
  Button,
  alpha,
  useTheme
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ListIcon from '@mui/icons-material/List';
import { CopyButton, ShareButton } from '@/src/components/CopyButton';


interface IpAnalysis {
  ip: string;
  valid: boolean;
  version: 'IPv4' | 'IPv6' | null;
  type: string;
  class: string;
  binary: string;
  errors: string[];
}

function validateIPv4(ip: string): IpAnalysis {
  const result: IpAnalysis = {
    ip,
    valid: false,
    version: 'IPv4',
    type: '',
    class: '',
    binary: '',
    errors: []
  };

  const parts = ip.split('.');
  if (parts.length !== 4) {
    result.errors.push('IPv4 должен содержать ровно 4 октета');
    return result;
  }

  const octets: number[] = [];
  for (const part of parts) {
    if (!/^\d{1,3}$/.test(part)) {
      result.errors.push(`Некорректный октет: "${part}"`);
      return result;
    }
    const num = parseInt(part);
    if (num < 0 || num > 255) {
      result.errors.push(`Октет вне диапазона 0-255: ${num}`);
      return result;
    }
    if (part.length > 1 && part.startsWith('0')) {
      result.errors.push(`Ведущий ноль в октете: "${part}"`);
      return result;
    }
    octets.push(num);
  }

  result.valid = true;
  result.binary = octets.map((o) => o.toString(2).padStart(8, '0')).join('.');

  // Determine type
  const [a, b, c, d] = octets;
  if (a === 127) {
    result.type = 'Loopback (петля)';
  } else if (a === 10) {
    result.type = 'Частный (Private)';
  } else if (a === 172 && b >= 16 && b <= 31) {
    result.type = 'Частный (Private)';
  } else if (a === 192 && b === 168) {
    result.type = 'Частный (Private)';
  } else if (a === 169 && b === 254) {
    result.type = 'Link-local (автоконфигурация)';
  } else if (a === 0) {
    result.type = 'Текущая сеть';
  } else if (a === 255 && b === 255 && c === 255 && d === 255) {
    result.type = 'Широковещательный (Broadcast)';
  } else if (a >= 224 && a <= 239) {
    result.type = 'Multicast (многоадресный)';
  } else if (a >= 240) {
    result.type = 'Зарезервированный';
  } else {
    result.type = 'Публичный (Public)';
  }

  // Determine class
  if (a <= 127) result.class = 'A';
  else if (a <= 191) result.class = 'B';
  else if (a <= 223) result.class = 'C';
  else if (a <= 239) result.class = 'D (Multicast)';
  else result.class = 'E (Зарезервированный)';

  return result;
}

function validateIPv6(ip: string): IpAnalysis {
  const result: IpAnalysis = {
    ip,
    valid: false,
    version: 'IPv6',
    type: '',
    class: '—',
    binary: '',
    errors: []
  };

  // Expand :: shorthand
  let expanded = ip;
  if (ip.includes('::')) {
    const halves = ip.split('::');
    if (halves.length > 2) {
      result.errors.push('IPv6 может содержать только одно "::"');
      return result;
    }
    const left = halves[0] ? halves[0].split(':') : [];
    const right = halves[1] ? halves[1].split(':') : [];
    const missing = 8 - left.length - right.length;
    if (missing < 0) {
      result.errors.push('Слишком много групп в IPv6');
      return result;
    }
    const middle = Array(missing).fill('0000');
    expanded = [...left, ...middle, ...right].join(':');
  }

  const groups = expanded.split(':');
  if (groups.length !== 8) {
    result.errors.push('IPv6 должен содержать 8 групп (или использовать ::)');
    return result;
  }

  for (const group of groups) {
    if (!/^[0-9a-fA-F]{1,4}$/.test(group)) {
      result.errors.push(`Некорректная группа: "${group}"`);
      return result;
    }
  }

  result.valid = true;
  result.binary = groups
    .map((g) => parseInt(g, 16).toString(2).padStart(16, '0'))
    .join(':');

  // Type detection
  const fullHex = groups.map((g) => g.padStart(4, '0')).join('');
  if (fullHex === '00000000000000000000000000000001') {
    result.type = 'Loopback (::1)';
  } else if (fullHex === '00000000000000000000000000000000') {
    result.type = 'Неопределённый (::)';
  } else if (fullHex.startsWith('fe80')) {
    result.type = 'Link-local';
  } else if (fullHex.startsWith('fc') || fullHex.startsWith('fd')) {
    result.type = 'Уникальный локальный (ULA)';
  } else if (fullHex.startsWith('ff')) {
    result.type = 'Multicast';
  } else if (fullHex.startsWith('2001')) {
    result.type = 'Глобальный (Global Unicast)';
  } else {
    result.type = 'Глобальный (Global Unicast)';
  }

  return result;
}

function analyzeIP(ip: string): IpAnalysis {
  const trimmed = ip.trim();
  if (!trimmed) {
    return { ip: trimmed, valid: false, version: null, type: '', class: '', binary: '', errors: ['Введите IP-адрес'] };
  }
  if (trimmed.includes(':')) {
    return validateIPv6(trimmed);
  }
  return validateIPv4(trimmed);
}

export default function IpValidator() {
  const theme = useTheme();
  const [singleIp, setSingleIp] = useState('');
  const [batchMode, setBatchMode] = useState(false);
  const [batchInput, setBatchInput] = useState('');

  const singleResult = useMemo(() => (singleIp ? analyzeIP(singleIp) : null), [singleIp]);

  const batchResults = useMemo(() => {
    if (!batchInput.trim()) return [];
    return batchInput
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map(analyzeIP);
  }, [batchInput]);

  const copyBinary = (binary: string) => {
    navigator.clipboard.writeText(binary);
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      {/* Mode toggle */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        <Chip
          label="Одиночный IP"
          onClick={() => setBatchMode(false)}
          variant={!batchMode ? 'filled' : 'outlined'}
          color={!batchMode ? 'primary' : 'default'}
          sx={{ cursor: 'pointer' }}
        />
        <Chip
          label="Пакетный режим"
          icon={<ListIcon />}
          onClick={() => setBatchMode(true)}
          variant={batchMode ? 'filled' : 'outlined'}
          color={batchMode ? 'primary' : 'default'}
          sx={{ cursor: 'pointer' }}
        />
      </Box>

      {!batchMode ? (
        <>
          {/* Single IP */}
          <Paper
            elevation={0}
            sx={{ p: 3, mb: 3, borderRadius: 3 }}
          >
            <TextField
              label="IP-адрес (IPv4 или IPv6)"
              value={singleIp}
              onChange={(e) => setSingleIp(e.target.value)}
              fullWidth
              placeholder="192.168.1.1 или 2001:db8::1"
              slotProps={{
                input: {
                  sx: { fontFamily: 'monospace', fontSize: 16 }
                }
              }}
            />
          </Paper>

          {singleResult && singleIp && (
            <Grid container spacing={2}>
              {/* Status */}
              <Grid size={{ xs: 12 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    backgroundColor: singleResult.valid
                      ? alpha(theme.palette.success.main, 0.06)
                      : alpha(theme.palette.error.main, 0.06)
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {singleResult.valid ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <ErrorIcon color="error" />
                    )}
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {singleResult.valid ? 'Корректный IP-адрес' : 'Некорректный IP-адрес'}
                    </Typography>
                    {singleResult.version && (
                      <Chip label={singleResult.version} size="small" variant="outlined" sx={{ ml: 1 }} />
                    )}
                  </Box>
                  {singleResult.errors.map((err, i) => (
                    <Typography key={i} variant="body2" color="error" sx={{ mt: 0.5, ml: 4 }}>
                      {err}
                    </Typography>
                  ))}
                </Paper>
              </Grid>

              {singleResult.valid && (
                <>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Paper elevation={0} sx={{ p: 2, textAlign: 'center', borderRadius: 3 }}>
                      <Typography variant="caption" color="text.secondary">Версия</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>{singleResult.version}</Typography>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Paper elevation={0} sx={{ p: 2, textAlign: 'center', borderRadius: 3 }}>
                      <Typography variant="caption" color="text.secondary">Класс</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>{singleResult.class}</Typography>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Paper elevation={0} sx={{ p: 2, textAlign: 'center', borderRadius: 3 }}>
                      <Typography variant="caption" color="text.secondary">Тип</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>{singleResult.type}</Typography>
                    </Paper>
                  </Grid>

                  {/* Binary */}
                  <Grid size={{ xs: 12 }}>
                    <Paper elevation={0} sx={{ p: 2, borderRadius: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>Двоичное представление</Typography>
                        <Button
                          size="small"
                          startIcon={<ContentCopyIcon />}
                          onClick={() => copyBinary(singleResult.binary)}
                        >
                          Копировать
                        </Button>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: 'monospace',
                          wordBreak: 'break-all',
                          p: 1.5,
                          backgroundColor: alpha(theme.palette.background.default, 0.5),
                          borderRadius: 2
                        }}
                      >
                        {singleResult.binary}
                      </Typography>
                    </Paper>
                  </Grid>
                </>
              )}
            </Grid>
          )}
        </>
      ) : (
        <>
          {/* Batch mode */}
          <Paper
            elevation={0}
            sx={{ p: 3, mb: 3, borderRadius: 3 }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5 }}>
              Введите IP-адреса (по одному на строку)
            </Typography>
            <TextField
              multiline
              rows={6}
              value={batchInput}
              onChange={(e) => setBatchInput(e.target.value)}
              fullWidth
              placeholder={'192.168.1.1\n10.0.0.1\n8.8.8.8\n2001:db8::1'}
              slotProps={{
                input: {
                  sx: { fontFamily: 'monospace', fontSize: 13 }
                }
              }}
            />
          </Paper>

          {batchResults.length > 0 && (
            <Paper
              elevation={0}
              sx={{ p: 2, borderRadius: 3 }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
                Результаты ({batchResults.filter((r) => r.valid).length}/{batchResults.length} корректных)
              </Typography>
              <Box sx={{ overflowX: 'auto' }}>
                <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <Box component="tr" sx={{ borderBottom: `2px solid ${theme.palette.divider}` }}>
                      {['Статус', 'IP-адрес', 'Версия', 'Тип', 'Класс'].map((h) => (
                        <Box component="th" key={h} sx={{ py: 1, px: 1.5, textAlign: 'left' }}>
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>{h}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </thead>
                  <tbody>
                    {batchResults.map((r, i) => (
                      <Box
                        component="tr"
                        key={i}
                        sx={{
                          borderBottom: `1px solid ${theme.palette.divider}`,
                          backgroundColor: r.valid
                            ? 'transparent'
                            : alpha(theme.palette.error.main, 0.04)
                        }}
                      >
                        <Box component="td" sx={{ py: 1, px: 1.5 }}>
                          {r.valid ? (
                            <CheckCircleIcon sx={{ fontSize: 18, color: 'success.main' }} />
                          ) : (
                            <ErrorIcon sx={{ fontSize: 18, color: 'error.main' }} />
                          )}
                        </Box>
                        <Box component="td" sx={{ py: 1, px: 1.5 }}>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{r.ip}</Typography>
                        </Box>
                        <Box component="td" sx={{ py: 1, px: 1.5 }}>
                          <Typography variant="body2">{r.version || '—'}</Typography>
                        </Box>
                        <Box component="td" sx={{ py: 1, px: 1.5 }}>
                          <Typography variant="body2">{r.type || (r.errors[0] || '—')}</Typography>
                        </Box>
                        <Box component="td" sx={{ py: 1, px: 1.5 }}>
                          <Typography variant="body2">{r.class || '—'}</Typography>
                        </Box>
                      </Box>
                    ))}
                  </tbody>
                </Box>
              </Box>
            </Paper>
          )}
        </>
      )}
    </Box>
  );
}
