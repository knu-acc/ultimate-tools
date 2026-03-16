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
  Tabs,
  Tab,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useLanguage } from '@/src/i18n/LanguageContext';

interface ValidationCheck {
  labelEn: string;
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
  const tldValid = domainValid && tldPart.length >= 2 && /^[a-zA-Z]{2}$/.test(tldPart);

  const localValid = localPart.length > 0 && /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(localPart) && !localPart.startsWith('.') && !localPart.endsWith('.') && !localPart.includes('..');

  const formatValid = hasAt && parts.length === 2 && localValid && domainValid && tldValid;

  return [
    { label: 'Корректный формат', labelEn: 'Valid format', passed: formatValid },
    { label: 'Содержит символ @', labelEn: 'Contains @ symbol', passed: hasAt && parts.length === 2 },
    { label: 'Валидный домен', labelEn: 'Valid domain', passed: domainValid },
    { label: 'Валидный TLD (домен верхнего уровня)', labelEn: 'Valid TLD (top-level domain)', passed: tldValid },
    { label: 'Валидная локальная часть', labelEn: 'Valid local part', passed: localValid },
    { label: 'Нет двойных точек', labelEn: 'No double dots', passed: !trimmed.includes('..') },
  ];
}

function isEmailValid(email: string): boolean {
  const checks = validateEmail(email.trim());
  return checks.length > 0 && checks.every((c) => c.passed);
}

export default function EmailValidator() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
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
    <Box sx={{ maxWidth: 800, mx: 'auto', p: { xs: 2, sm: 3 } }}>
      {/* Tabs */}
      <Paper elevation={0} sx={{ mb: 2, borderRadius: 18, bgcolor: theme.palette.surfaceContainerLow }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            px: 1,
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.9rem'
            }
          }}
        >
          <Tab label={isEn ? 'Single check' : 'Одиночная проверка'} />
          <Tab label={isEn ? 'Batch check' : 'Пакетная проверка'} />
        </Tabs>
      </Paper>

      {/* Single Mode */}
      {tab === 0 && (
        <>
          <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, mb: 2, borderRadius: 18, bgcolor: theme.palette.surfaceContainerLow, transitionProperty: 'background-color', transitionDuration: '200ms', transitionTimingFunction: 'ease', '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) } }}>
            <TextField
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@domain.com"
              sx={{ '& .MuiInputBase-input': { fontFamily: 'monospace', fontSize: '1.1rem' } }}
            />

            {email.trim() && (
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                {allPassed ? (
                  <Chip
                    icon={<CheckCircleIcon />}
                    label={isEn ? 'Email is valid' : 'Email валиден'}
                    color="success"
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                  />
                ) : (
                  <Chip
                    icon={<CancelIcon />}
                    label={isEn ? 'Email is invalid' : 'Email невалиден'}
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
            <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 18, bgcolor: theme.palette.surfaceContainerLow, transitionProperty: 'background-color', transitionDuration: '200ms', transitionTimingFunction: 'ease', '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) } }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                {isEn ? 'Validation results' : 'Результаты проверки'}
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
                      borderRadius: 10,
                      backgroundColor: check.passed
                        ? alpha(theme.palette.success.main, 0.06)
                        : alpha(theme.palette.error.main, 0.06),
                      border: `1px solid ${
                        check.passed
                          ? alpha(theme.palette.success.main, 0.2)
                          : alpha(theme.palette.error.main, 0.2)
                      }`
                    }}
                  >
                    {check.passed ? (
                      <CheckCircleIcon sx={{ color: 'success.main', fontSize: 22 }} />
                    ) : (
                      <CancelIcon sx={{ color: 'error.main', fontSize: 22 }} />
                    )}
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {isEn ? check.labelEn : check.label}
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
          <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, mb: 2, borderRadius: 18, bgcolor: theme.palette.surfaceContainerLow, transitionProperty: 'background-color', transitionDuration: '200ms', transitionTimingFunction: 'ease', '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) } }}>
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
            <Grid container spacing={2}>
              {/* Summary */}
              <Grid size={12}>
                <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 18, bgcolor: theme.palette.surfaceContainerLow }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                    {isEn ? 'Summary' : 'Итоги проверки'}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Chip
                      label={`${isEn ? 'Total' : 'Всего'}: ${batchResults.length}`}
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                    <Chip
                      icon={<CheckCircleIcon />}
                      label={`${isEn ? 'Valid' : 'Валидных'}: ${validCount}`}
                      color="success"
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                    <Chip
                      icon={<CancelIcon />}
                      label={`${isEn ? 'Invalid' : 'Невалидных'}: ${invalidCount}`}
                      color="error"
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                </Paper>
              </Grid>

              {/* Results List */}
              <Grid size={12}>
                <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 18, bgcolor: theme.palette.surfaceContainerLow }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                    {isEn ? 'Detailed results' : 'Детальные результаты'}
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
                          borderRadius: 10,
                          backgroundColor: result.valid
                            ? alpha(theme.palette.success.main, 0.05)
                            : alpha(theme.palette.error.main, 0.05),
                          border: `1px solid ${
                            result.valid
                              ? alpha(theme.palette.success.main, 0.15)
                              : alpha(theme.palette.error.main, 0.15)
                          }`
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
                          label={result.valid ? (isEn ? 'Valid' : 'Валиден') : (isEn ? 'Invalid' : 'Невалиден')}
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
