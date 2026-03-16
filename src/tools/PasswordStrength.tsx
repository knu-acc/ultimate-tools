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
import { CopyButton } from '@/src/components/CopyButton';
import { useLanguage } from '@/src/i18n/LanguageContext';


interface StrengthInfo {
  score: number; // 0-4
  label: string;
  color: string;
  crackTime: string;
}

export default function PasswordStrength() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
      { score: 0, label: isEn ? 'Very weak' : 'Очень слабый', color: theme.palette.error.main, crackTime: isEn ? 'less than a second' : 'менее секунды' },
      { score: 1, label: isEn ? 'Weak' : 'Слабый', color: theme.palette.warning.main, crackTime: isEn ? 'a few minutes' : 'несколько минут' },
      { score: 2, label: isEn ? 'Medium' : 'Средний', color: theme.palette.warning.dark, crackTime: isEn ? 'a few hours' : 'несколько часов' },
      { score: 3, label: isEn ? 'Good' : 'Хороший', color: theme.palette.success.main, crackTime: isEn ? 'several months' : 'несколько месяцев' },
      { score: 4, label: isEn ? 'Excellent' : 'Отличный', color: theme.palette.success.dark, crackTime: isEn ? 'hundreds of years' : 'сотни лет' },
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
    if (isEn) {
      if (secondsToCrack < 1) crackTime = 'less than a second';
      else if (secondsToCrack < 60) crackTime = `~${Math.floor(secondsToCrack)} sec.`;
      else if (secondsToCrack < 3600) crackTime = `~${Math.floor(secondsToCrack / 60)} min.`;
      else if (secondsToCrack < 86400) crackTime = `~${Math.floor(secondsToCrack / 3600)} hr.`;
      else if (secondsToCrack < 86400 * 30) crackTime = `~${Math.floor(secondsToCrack / 86400)} days`;
      else if (secondsToCrack < 86400 * 365) crackTime = `~${Math.floor(secondsToCrack / (86400 * 30))} mo.`;
      else if (secondsToCrack < 86400 * 365 * 1e6) crackTime = `~${Math.floor(secondsToCrack / (86400 * 365)).toLocaleString('en-US')} years`;
      else crackTime = 'practically forever';
    } else {
      if (secondsToCrack < 1) crackTime = 'менее секунды';
      else if (secondsToCrack < 60) crackTime = `~${Math.floor(secondsToCrack)} сек.`;
      else if (secondsToCrack < 3600) crackTime = `~${Math.floor(secondsToCrack / 60)} мин.`;
      else if (secondsToCrack < 86400) crackTime = `~${Math.floor(secondsToCrack / 3600)} ч.`;
      else if (secondsToCrack < 86400 * 30) crackTime = `~${Math.floor(secondsToCrack / 86400)} дн.`;
      else if (secondsToCrack < 86400 * 365) crackTime = `~${Math.floor(secondsToCrack / (86400 * 30))} мес.`;
      else if (secondsToCrack < 86400 * 365 * 1e6) crackTime = `~${Math.floor(secondsToCrack / (86400 * 365)).toLocaleString('ru-RU')} лет`;
      else crackTime = 'практически вечность';
    }

    return { ...levels[score], crackTime };
  }, [password, theme.palette, isEn]);

  const suggestions = useMemo(() => {
    const tips: string[] = [];
    if (!analysis.length8) tips.push(isEn ? 'Use at least 8 characters' : 'Используйте минимум 8 символов');
    if (!analysis.length12) tips.push(isEn ? 'Use 12+ characters for better security' : 'Для лучшей защиты используйте 12+ символов');
    if (!analysis.uppercase) tips.push(isEn ? 'Add uppercase letters' : 'Добавьте заглавные буквы');
    if (!analysis.lowercase) tips.push(isEn ? 'Add lowercase letters' : 'Добавьте строчные буквы');
    if (!analysis.digits) tips.push(isEn ? 'Add digits' : 'Добавьте цифры');
    if (!analysis.special) tips.push(isEn ? 'Add special characters (!@#$%...)' : 'Добавьте специальные символы (!@#$%...)');
    if (!analysis.noRepeating) tips.push(isEn ? 'Avoid repeating characters' : 'Избегайте повторяющихся символов');
    if (!analysis.noSequential) tips.push(isEn ? 'Avoid sequences (123, abc)' : 'Избегайте последовательностей (123, abc)');
    if (!analysis.noCommon) tips.push(isEn ? 'Do not use common passwords' : 'Не используйте распространённые пароли');
    return tips;
  }, [analysis, isEn]);

  const criteriaList = [
    { key: 'length8', label: isEn ? 'At least 8 characters' : 'Минимум 8 символов' },
    { key: 'length12', label: isEn ? 'At least 12 characters' : 'Минимум 12 символов' },
    { key: 'lowercase', label: isEn ? 'Lowercase letters' : 'Строчные буквы' },
    { key: 'uppercase', label: isEn ? 'Uppercase letters' : 'Заглавные буквы' },
    { key: 'digits', label: isEn ? 'Digits' : 'Цифры' },
    { key: 'special', label: isEn ? 'Special characters' : 'Специальные символы' },
    { key: 'noRepeating', label: isEn ? 'No repeats (aaa)' : 'Без повторов (aaa)' },
    { key: 'noSequential', label: isEn ? 'No sequences' : 'Без последовательностей' },
    { key: 'noCommon', label: isEn ? 'Not a common password' : 'Не распространённый пароль' },
  ];

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: { xs: 2, sm: 3 } }}>
      <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, mb: 2, borderRadius: theme.shape?.medium ?? 12, bgcolor: theme.palette.surfaceContainerLow, transition: `background-color ${theme.md3?.motion.duration.short4 ?? '200ms'} ${theme.md3?.motion.easing.standard ?? 'cubic-bezier(0.2, 0, 0, 1)'}`, '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) } }}>
        <TextField
          fullWidth
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={isEn ? 'Password...' : 'Пароль...'}
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
        {password && (
          <Box sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }} style={{ color: strength.color }}>
                {strength.label}
              </Typography>
              <Chip
                label={`${isEn ? 'Crack time' : 'Взлом'}: ${strength.crackTime}`}
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
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, height: '100%', borderRadius: 3, bgcolor: theme.palette.surfaceContainerLow, transitionProperty: 'background-color', transitionDuration: '200ms', transitionTimingFunction: 'ease', '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) } }}>
              <Typography variant="body2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>
                {isEn ? 'Characters' : 'Символы'}
              </Typography>
              {charAnalysis && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {[
                    { label: isEn ? 'Lowercase' : 'Строчные', count: charAnalysis.lower, color: theme.palette.primary.main },
                    { label: isEn ? 'Uppercase' : 'Заглавные', count: charAnalysis.upper, color: theme.palette.secondary.main },
                    { label: isEn ? 'Digits' : 'Цифры', count: charAnalysis.digits, color: theme.palette.info.main },
                    { label: isEn ? 'Special' : 'Специальные', count: charAnalysis.special, color: theme.palette.warning.main },
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
                    label={`${isEn ? 'Total characters' : 'Всего символов'}: ${charAnalysis.total}`}
                    size="small"
                    sx={{ alignSelf: 'flex-start', mt: 1 }}
                  />
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, height: '100%', borderRadius: 3, bgcolor: theme.palette.surfaceContainerLow, transitionProperty: 'background-color', transitionDuration: '200ms', transitionTimingFunction: 'ease', '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) } }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
                {isEn ? 'Criteria' : 'Критерии'}
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

          {suggestions.length > 0 && (
            <Grid size={12}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 3 },
                  borderRadius: 3,
                  bgcolor: alpha(theme.palette.warning.main, 0.04),
                  transitionProperty: 'background-color', transitionDuration: '200ms', transitionTimingFunction: 'ease',
                  '&:hover': { bgcolor: alpha(theme.palette.warning.main, 0.07) }
                }}
              >
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
