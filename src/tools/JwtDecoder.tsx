'use client';

import React, { useState, useMemo } from 'react';
import {
  Box, Typography, TextField, Paper, Grid, Chip, alpha, useTheme, Divider
} from '@mui/material';
import { ContentCopy, CheckCircle, Error as ErrorIcon } from '@mui/icons-material';
import { CopyButton, ShareButton } from '@/src/components/CopyButton';


function base64UrlDecode(str: string): string {
  try {
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    const padding = base64.length % 4 === 0 ? '' : '='.repeat(4 - (base64.length % 4));
    return decodeURIComponent(
      atob(base64 + padding)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  } catch {
    return '';
  }
}

interface JwtParts {
  header: Record<string, unknown> | null;
  payload: Record<string, unknown> | null;
  signature: string;
  valid: boolean;
  error?: string;
}

function decodeJwt(token: string): JwtParts {
  const parts = token.trim().split('.');
  if (parts.length !== 3) {
    return { header: null, payload: null, signature: '', valid: false, error: 'JWT должен содержать 3 части, разделённые точками' };
  }

  try {
    const header = JSON.parse(base64UrlDecode(parts[0]));
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    return { header, payload, signature: parts[2], valid: true };
  } catch (e) {
    return { header: null, payload: null, signature: '', valid: false, error: 'Невозможно декодировать JWT' };
  }
}

function formatTimestamp(ts: number): string {
  try {
    return new Date(ts * 1000).toLocaleString('ru-RU', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  } catch {
    return String(ts);
  }
}

export default function JwtDecoder() {
  const theme = useTheme();
  const [token, setToken] = useState('');

  const decoded = useMemo(() => {
    if (!token.trim()) return null;
    return decodeJwt(token);
  }, [token]);

  const isExpired = decoded?.payload?.exp
    ? (decoded.payload.exp as number) * 1000 < Date.now()
    : false;

  const timeFields = ['exp', 'iat', 'nbf', 'auth_time'];

  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
        JWT токен
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={4}
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="Вставьте JWT токен (eyJhbGci...)"
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': { fontFamily: 'monospace', fontSize: '0.8rem' }
        }}
      />

      {decoded && !decoded.valid && (
        <Paper
          elevation={0}
          sx={{ p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.error.main, 0.08), mb: 2 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ErrorIcon sx={{ color: theme.palette.error.main }} />
            <Typography color="error" fontWeight={600}>{decoded.error}</Typography>
          </Box>
        </Paper>
      )}

      {decoded?.valid && (
        <Grid container spacing={2}>
          {/* Header */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{ p: 2, borderRadius: 2, bgcolor: alpha('#E74C3C', 0.06), height: '100%' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <Chip label="HEADER" size="small" sx={{ bgcolor: alpha('#E74C3C', 0.15), fontWeight: 700, fontSize: '0.7rem' }} />
                <Typography variant="caption" color="text.secondary">Алгоритм и тип</Typography>
              </Box>
              <Box
                component="pre"
                sx={{
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  m: 0,
                  whiteSpace: 'pre-wrap',
                  color: theme.palette.text.primary
                }}
              >
                {JSON.stringify(decoded.header, null, 2)}
              </Box>
            </Paper>
          </Grid>

          {/* Payload */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{ p: 2, borderRadius: 2, bgcolor: alpha('#6750A4', 0.06), height: '100%' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <Chip label="PAYLOAD" size="small" sx={{ bgcolor: alpha('#6750A4', 0.15), fontWeight: 700, fontSize: '0.7rem' }} />
                <Typography variant="caption" color="text.secondary">Данные</Typography>
                {isExpired && (
                  <Chip label="Истёк" size="small" color="error" sx={{ fontSize: '0.65rem', height: 20 }} />
                )}
              </Box>
              <Box
                component="pre"
                sx={{
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  m: 0,
                  whiteSpace: 'pre-wrap',
                  color: theme.palette.text.primary
                }}
              >
                {JSON.stringify(decoded.payload, null, 2)}
              </Box>
            </Paper>
          </Grid>

          {/* Decoded claims */}
          <Grid size={12}>
            <Paper
              elevation={0}
              sx={{ p: 2, borderRadius: 2, bgcolor: theme.palette.surfaceContainerLow }}
            >
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Расшифрованные поля
              </Typography>
              <Grid container spacing={1}>
                {decoded.payload && Object.entries(decoded.payload).map(([key, value]) => (
                  <Grid key={key} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                      <Typography variant="caption" fontWeight={700} sx={{ fontFamily: 'monospace', color: theme.palette.primary.main }}>
                        {key}:
                      </Typography>
                      <Typography variant="caption" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                        {timeFields.includes(key) && typeof value === 'number'
                          ? formatTimestamp(value)
                          : String(value)
                        }
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>

          {/* Signature */}
          <Grid size={12}>
            <Paper
              elevation={0}
              sx={{ p: 2, borderRadius: 2, bgcolor: alpha('#2E86C1', 0.06) }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Chip label="SIGNATURE" size="small" sx={{ bgcolor: alpha('#2E86C1', 0.15), fontWeight: 700, fontSize: '0.7rem' }} />
              </Box>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', wordBreak: 'break-all', color: theme.palette.text.secondary }}>
                {decoded.signature}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                ⚠️ Подпись не может быть проверена без секретного ключа
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
