'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  Paper,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  InputAdornment,
  Grid,
  useTheme,
  alpha
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { CopyButton, ShareButton } from '@/src/components/CopyButton';


interface StrengthInfo {
  score: number; // 0-4
  label: string;
  color: string;
  crackTime: string;
}

export default function PasswordStrength() {
  const theme = useTheme();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const analysis = useMemo(() => {
    const checks = {
      length8: password.length >= 8,
      length12: password.length >= 12,
      length16: password.length >= 16,
      lowercase: /[a-zа-яё]/.test(password),
      uppercase: /[A-ZА-ЯЁ]/.test(password),
      digits: /[0-9]/.test(password),
      special: /[^a-zA-Zа-яёА-ЯЁ0-9]/.test(password),
      noRepeating: !/(.)\1{2}/.test(password),
      noSequential: !/(012|123|234|345|456|567|678|789|abc|bcd|cde|def)/i.test(password),
      noCommon: !/(password|qwerty|123456|admin|letmein|welcome|пароль)/i.test(password)
    };

    return checks;
  }, [password]);

  const charAnalysis = useMemo(() => {
    if (!password) return null;
    const lower = (password.match(/[a-zа-яё]/g) || []).length;
    const upper = (password.match(/[A-ZА-ЯЁ]/g) || []).length;
    const digits = (password.match(/[0-9]/g) || []).length;
    const special = password.length - lower - upper - digits;

    return { lower, upper, digits, special, total: password.length };
  }, [password]);

  const strength = useMemo((): StrengthInfo => {
    if (!password) return { score: 0, label: '', color: theme.palette.divider, crackTime: '' };

    let score = 0;
    const len = password.length;

    // Length scoring
    if (len >= 8) score += 1;
    if (len >= 12) score += 1;
    if (len >= 16) score += 1;

    // Character variety
    const types = [
      /[a-zа-яё]/.test(password),
      /[A-ZА-ЯЁ]/.test(password),
      /[0-9]/.test(password),
      /[^a-zA-Zа-яёА-ЯЁ0-9]/.test(password),
    ].filter(Boolean).length;
    score += types;

    // Penalties
    if (/(password|qwerty|123456|admin|пароль)/i.test(password)) score -= 3;
    if (/(.)\1{2}/.test(password)) score -= 1;

    // Normalize to 0-4
    score = Math.max(0, Math.min(4, Math.floor(score / 2)));

    const levels: StrengthInfo[] = [
      { score: 0, label: 'Очень слабый', color: '#d32f2f', crackTime: 'менее секунды' },
      { score: 1, label: 'Слабый', color: '#f57c00', crackTime: 'несколько минут' },
      { score: 2, label: 'Средний', color: '#fbc02d', crackTime: 'несколько часов' },
      { score: 3, label: 'Хороший', color: '#388e3c', crackTime: 'несколько месяцев' },
      { score: 4, label: 'Отличный', color: '#1b5e20', crackTime: 'сотни лет' },
    ];

    // Better crack time estimate based on entropy
    let poolSize = 0;
    if (/[a-z]/.test(password)) poolSize += 26;
    if (/[A-Z]/.test(password)) poolSize += 26;
    if (/[а-яё]/i.test(password)) poolSize += 66;
    if (/[0-9]/.test(password)) poolSize += 10;
    if (/[^a-zA-Zа-яёА-ЯЁ0-9]/.test(password)) poolSize += 32;

    const entropy = len * Math.log2(Math.max(poolSize, 1));
    const guessesPerSecond = 1e10;
    const secondsToCrack = Math.pow(2, entropy) / guessesPerSecond;

    let crackTime: string;
    if (secondsToCrack < 1) crackTime = 'менее секунды';
    else if (secondsToCrack < 60) crackTime = `~${Math.floor(secondsToCrack)} сек.`;
    else if (secondsToCrack < 3600) crackTime = `~${Math.floor(secondsToCrack / 60)} мин.`;
    else if (secondsToCrack < 86400) crackTime = `~${Math.floor(secondsToCrack / 3600)} ч.`;
    else if (secondsToCrack < 86400 * 30) crackTime = `~${Math.floor(secondsToCrack / 86400)} дн.`;
    else if (secondsToCrack < 86400 * 365) crackTime = `~${Math.floor(secondsToCrack / (86400 * 30))} мес.`;
    else if (secondsToCrack < 86400 * 365 * 1e6) crackTime = `~${Math.floor(secondsToCrack / (86400 * 365)).toLocaleString('ru-RU')} лет`;
    else crackTime = 'практически вечность';

    return { ...levels[score], crackTime };
  }, [password, theme.palette.divider]);

  const suggestions = useMemo(() => {
    const tips: string[] = [];
    if (!analysis.length8) tips.push('Используйте минимум 8 символов');
    if (!analysis.length12) tips.push('Для лучшей защиты используйте 12+ символов');
    if (!analysis.uppercase) tips.push('Добавьте заглавные буквы');
    if (!analysis.lowercase) tips.push('Добавьте строчные буквы');
    if (!analysis.digits) tips.push('Добавьте цифры');
    if (!analysis.special) tips.push('Добавьте специальные символы (!@#$%...)');
    if (!analysis.noRepeating) tips.push('Избегайте повторяющихся символов');
    if (!analysis.noSequential) tips.push('Избегайте последовательностей (123, abc)');
    if (!analysis.noCommon) tips.push('Не используйте распространённые пароли');
    return tips;
  }, [analysis]);

  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  const criteriaList = [
    { key: 'length8', label: 'Минимум 8 символов' },
    { key: 'length12', label: 'Минимум 12 символов' },
    { key: 'lowercase', label: 'Строчные буквы' },
    { key: 'uppercase', label: 'Заглавные буквы' },
    { key: 'digits', label: 'Цифры' },
    { key: 'special', label: 'Специальные символы' },
    { key: 'noRepeating', label: 'Без повторов (aaa)' },
    { key: 'noSequential', label: 'Без последовательностей' },
    { key: 'noCommon', label: 'Не распространённый пароль' },
  ];

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Password Input */}
      <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
        <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 500, color: 'text.secondary' }}>
          Введите пароль для проверки
        </Typography>
        <TextField
          fullWidth
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Введите пароль..."
          sx={{ '& .MuiInputBase-input': { fontFamily: 'monospace', fontSize: '1.1rem' } }}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <CopyButton text={password} />
                  <IconButton onClick={() => setShowPassword(!showPassword)} size="small">
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              )
            }
          }}
        />
        {copied && (
          <Typography variant="caption" color="success.main" sx={{ mt: 0.5, display: 'block' }}>
            Скопировано!
          </Typography>
        )}

        {/* Strength Meter */}
        {password && (
          <Box sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }} style={{ color: strength.color }}>
                {strength.label}
              </Typography>
              <Chip
                label={`Взлом: ${strength.crackTime}`}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.75rem' }}
              />
            </Box>
            <LinearProgress
              variant="determinate"
              value={(strength.score + 1) * 20}
              sx={{
                height: 10,
                borderRadius: 5,
                backgroundColor: alpha(strength.color, 0.15),
                '& .MuiLinearProgress-bar': {
                  backgroundColor: strength.color,
                  borderRadius: 5
                }
              }}
            />
          </Box>
        )}
      </Paper>

      {password && (
        <Grid container spacing={3}>
          {/* Character Analysis */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper elevation={0} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Анализ символов
              </Typography>
              {charAnalysis && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {[
                    { label: 'Строчные', count: charAnalysis.lower, color: theme.palette.primary.main },
                    { label: 'Заглавные', count: charAnalysis.upper, color: theme.palette.secondary.main },
                    { label: 'Цифры', count: charAnalysis.digits, color: theme.palette.info.main },
                    { label: 'Специальные', count: charAnalysis.special, color: theme.palette.warning.main },
                  ].map((item) => (
                    <Box key={item.label}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2">{item.label}</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {item.count}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={charAnalysis.total ? (item.count / charAnalysis.total) * 100 : 0}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: alpha(item.color, 0.12),
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: item.color,
                            borderRadius: 3
                          }
                        }}
                      />
                    </Box>
                  ))}
                  <Chip
                    label={`Всего символов: ${charAnalysis.total}`}
                    size="small"
                    sx={{ alignSelf: 'flex-start', mt: 1 }}
                  />
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Criteria Checklist */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper elevation={0} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Критерии
              </Typography>
              <List dense disablePadding>
                {criteriaList.map(({ key, label }) => {
                  const passed = analysis[key as keyof typeof analysis];
                  return (
                    <ListItem key={key} disableGutters sx={{ py: 0.3 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        {passed ? (
                          <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />
                        ) : (
                          <CancelIcon sx={{ color: 'error.main', fontSize: 20 }} />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            variant="body2"
                            sx={{
                              color: passed ? 'text.primary' : 'text.secondary',
                              textDecoration: passed ? 'none' : 'none'
                            }}
                          >
                            {label}
                          </Typography>
                        }
                      />
                    </ListItem>
                  );
                })}
              </List>
            </Paper>
          </Grid>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <Grid size={12}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  background: alpha(theme.palette.warning.main, 0.04)
                }}
              >
                <Typography variant="h6" sx={{ mb: 1.5 }}>
                  Рекомендации
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {suggestions.map((tip, i) => (
                    <Chip key={i} label={tip} variant="outlined" color="warning" size="small" />
                  ))}
                </Box>
              </Paper>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
}
