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
  Tabs,
  Tab,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

interface ValidationCheck {
  label: string;
  passed: boolean;
}

interface BatchResult {
  email: string;
  valid: boolean;
}

function validateEmail(email: string): ValidationCheck[] {
  const trimmed = email.trim();
  if (!trimmed) return [];

  const hasAt = trimmed.includes('@');
  const parts = trimmed.split('@');
  const localPart = parts[0] || '';
  const domainPart = parts.length === 2 ? parts[1] : '';

  const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*$/;
  const domainValid = hasAt && domainPart.length > 0 && domainRegex.test(domainPart) && domainPart.includes('.');

  const tldPart = domainPart.split('.').pop() || '';
  const tldValid = domainValid && tldPart.length >= 2 && /^[a-zA-Z]{2,}$/.test(tldPart);

  const localValid = localPart.length > 0 && /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(localPart) && !localPart.startsWith('.') && !localPart.endsWith('.') && !localPart.includes('..');

  const formatValid = hasAt && parts.length === 2 && localValid && domainValid && tldValid;

  return [
    { label: 'Корректный формат', passed: formatValid },
    { label: 'Содержит символ @', passed: hasAt && parts.length === 2 },
    { label: 'Валидный домен', passed: domainValid },
    { label: 'Валидный TLD (домен верхнего уровня)', passed: tldValid },
    { label: 'Валидная локальная часть', passed: localValid },
    { label: 'Нет двойных точек', passed: !trimmed.includes('..') },
  ];
}

function isEmailValid(email: string): boolean {
  const checks = validateEmail(email.trim());
  return checks.length > 0 && checks.every((c) => c.passed);
}

export default function EmailValidator() {
  const theme = useTheme();
  const [tab, setTab] = useState(0);
  const [email, setEmail] = useState('');
  const [batchText, setBatchText] = useState('');

  const checks = useMemo(() => validateEmail(email), [email]);
  const allPassed = checks.length > 0 && checks.every((c) => c.passed);

  const batchResults = useMemo((): BatchResult[] => {
    if (!batchText.trim()) return [];
    const lines = batchText
      .split(/[\n,;]+/)
      .map((l) => l.trim())
      .filter(Boolean);
    return lines.map((e) => ({ email: e, valid: isEmailValid(e) }));
  }, [batchText]);

  const validCount = batchResults.filter((r) => r.valid).length;
  const invalidCount = batchResults.filter((r) => !r.valid).length;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Tabs */}
      <Paper elevation={0} sx={{ mb: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: 3 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            px: 1,
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.9rem',
            },
          }}
        >
          <Tab label="Одиночная проверка" />
          <Tab label="Пакетная проверка" />
        </Tabs>
      </Paper>

      {/* Single Mode */}
      {tab === 0 && (
        <>
          <Paper elevation={0} sx={{ p: 3, mb: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: 3 }}>
            <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 500, color: 'text.secondary' }}>
              Введите email для проверки
            </Typography>
            <TextField
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@domain.com"
              sx={{ '& .MuiInputBase-input': { fontFamily: 'monospace', fontSize: '1.1rem' } }}
              slotProps={{
                input: {
                  endAdornment: email.trim() ? (
                    <IconButton size="small" onClick={() => setEmail('')} sx={{ mr: 0.5 }}>
                      <CancelIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                    </IconButton>
                  ) : null,
                },
              }}
            />

            {email.trim() && (
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                {allPassed ? (
                  <Chip
                    icon={<CheckCircleIcon />}
                    label="Email валиден"
                    color="success"
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                  />
                ) : (
                  <Chip
                    icon={<CancelIcon />}
                    label="Email невалиден"
                    color="error"
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                  />
                )}
              </Box>
            )}
          </Paper>

          {/* Validation Checks */}
          {checks.length > 0 && (
            <Paper elevation={0} sx={{ p: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Результаты проверки
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {checks.map((check, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: check.passed
                        ? alpha(theme.palette.success.main, 0.06)
                        : alpha(theme.palette.error.main, 0.06),
                      border: `1px solid ${
                        check.passed
                          ? alpha(theme.palette.success.main, 0.2)
                          : alpha(theme.palette.error.main, 0.2)
                      }`,
                    }}
                  >
                    {check.passed ? (
                      <CheckCircleIcon sx={{ color: 'success.main', fontSize: 22 }} />
                    ) : (
                      <CancelIcon sx={{ color: 'error.main', fontSize: 22 }} />
                    )}
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {check.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          )}
        </>
      )}

      {/* Batch Mode */}
      {tab === 1 && (
        <>
          <Paper elevation={0} sx={{ p: 3, mb: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: 3 }}>
            <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 500, color: 'text.secondary' }}>
              Введите email-адреса (по одному на строку, или через запятую/точку с запятой)
            </Typography>
            <TextField
              fullWidth
              multiline
              minRows={5}
              maxRows={15}
              value={batchText}
              onChange={(e) => setBatchText(e.target.value)}
              placeholder={'user1@example.com\nuser2@domain.ru\ninvalid-email\ntest@test.org'}
              sx={{ '& .MuiInputBase-input': { fontFamily: 'monospace', fontSize: '0.95rem' } }}
            />
          </Paper>

          {batchResults.length > 0 && (
            <Grid container spacing={3}>
              {/* Summary */}
              <Grid size={12}>
                <Paper elevation={0} sx={{ p: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Итоги проверки
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Chip
                      label={`Всего: ${batchResults.length}`}
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                    <Chip
                      icon={<CheckCircleIcon />}
                      label={`Валидных: ${validCount}`}
                      color="success"
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                    <Chip
                      icon={<CancelIcon />}
                      label={`Невалидных: ${invalidCount}`}
                      color="error"
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                </Paper>
              </Grid>

              {/* Results List */}
              <Grid size={12}>
                <Paper elevation={0} sx={{ p: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Детальные результаты
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {batchResults.map((result, i) => (
                      <Box
                        key={i}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          p: 1.5,
                          borderRadius: 2,
                          backgroundColor: result.valid
                            ? alpha(theme.palette.success.main, 0.05)
                            : alpha(theme.palette.error.main, 0.05),
                          border: `1px solid ${
                            result.valid
                              ? alpha(theme.palette.success.main, 0.15)
                              : alpha(theme.palette.error.main, 0.15)
                          }`,
                        }}
                      >
                        {result.valid ? (
                          <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />
                        ) : (
                          <CancelIcon sx={{ color: 'error.main', fontSize: 20 }} />
                        )}
                        <Typography
                          variant="body2"
                          sx={{ fontFamily: 'monospace', fontWeight: 500, flex: 1, wordBreak: 'break-all' }}
                        >
                          {result.email}
                        </Typography>
                        <Chip
                          label={result.valid ? 'Валиден' : 'Невалиден'}
                          size="small"
                          color={result.valid ? 'success' : 'error'}
                          variant="outlined"
                          sx={{ fontSize: '0.75rem' }}
                        />
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          )}
        </>
      )}
    </Box>
  );
}
