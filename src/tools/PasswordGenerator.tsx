'use client';

import { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Slider,
  Chip,
  LinearProgress,
  useTheme,
  alpha
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import LockIcon from '@mui/icons-material/Lock';
import { CopyButton } from '@/src/components/CopyButton';
import { useLanguage } from '@/src/i18n/LanguageContext';

const CHARSETS: Record<string, string> = {
  'A-Z': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  'a-z': 'abcdefghijklmnopqrstuvwxyz',
  '0-9': '0123456789',
  '!@#$': '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

const SLIDER_MARKS = [8, 12, 16, 24, 32].map((v) => ({ value: v, label: String(v) }));

type PaletteKey = 'success' | 'warning' | 'error';

function getStrength(password: string): { label: string; value: number; paletteKey: PaletteKey } {
  let score = 0;
  if (password.length >= 8) score += 10;
  if (password.length >= 12) score += 15;
  if (password.length >= 20) score += 10;
  if (password.length >= 28) score += 5;
  if (/[a-z]/.test(password)) score += 15;
  if (/[A-Z]/.test(password)) score += 15;
  if (/[0-9]/.test(password)) score += 15;
  if (/[^a-zA-Z0-9]/.test(password)) score += 20;

  if (score >= 80) return { label: 'Отличный', value: 100, paletteKey: 'success' };
  if (score >= 60) return { label: 'Надёжный', value: 75, paletteKey: 'success' };
  if (score >= 40) return { label: 'Средний', value: 50, paletteKey: 'warning' };
  if (score >= 20) return { label: 'Слабый', value: 25, paletteKey: 'warning' };
  return { label: 'Очень слабый', value: 10, paletteKey: 'error' };
}

export default function PasswordGenerator() {
  const theme = useTheme();
  const [length, setLength] = useState(16);
  const [activeCharsets, setActiveCharsets] = useState<string[]>(['A-Z', 'a-z', '0-9', '!@#$']);
  const [password, setPassword] = useState('');
  const [history, setHistory] = useState<string[]>([]);

  const toggleCharset = (key: string) => {
    setActiveCharsets((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const generate = useCallback(() => {
    let charset = '';
    for (const key of activeCharsets) {
      charset += CHARSETS[key];
    }
    if (!charset) return;

    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    const result = Array.from(array)
      .map((n) => charset[n % charset.length])
      .join('');

    setPassword(result);
    setHistory((prev) => {
      const next = [result, ...prev.filter((p) => p !== result)];
      return next.slice(0, 5);
    });
  }, [length, activeCharsets]);

  const strength = password ? getStrength(password) : null;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: { xs: 2, sm: 3 } }}>
      {/* Password display */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          mb: 2,
          minHeight: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1.5,
          borderRadius: 18,
          background: password
            ? theme.palette.surfaceContainerLow
            : theme.palette.action.hover,
          transition: `all ${theme.md3?.motion.duration.short4 ?? '200ms'} ${theme.md3?.motion.easing.standard ?? 'cubic-bezier(0.2, 0, 0, 1)'}`,
          '&:hover': {
            background: alpha(theme.palette.primary.main, 0.04),
          },
        }}
      >
        {password ? (
          <>
            <LockIcon sx={{ color: 'primary.main', fontSize: 22, flexShrink: 0 }} />
            <Typography
              sx={{
                fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
                fontSize: { xs: '1rem', sm: '1.25rem' },
                fontWeight: 600,
                wordBreak: 'break-all',
                letterSpacing: 1.5,
                textAlign: 'center',
                flex: 1
              }}
            >
              {password}
            </Typography>
          </>
        ) : (
          <Typography sx={{ color: 'text.disabled' }}>...</Typography>
        )}
      </Paper>

      {/* Strength bar */}
      {strength && (
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              Надёжность
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette[strength.paletteKey].main, fontWeight: 700 }}>
              {strength.label}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={strength.value}
            sx={{
              height: 10,
              borderRadius: 999,
              backgroundColor: alpha(theme.palette.text.primary, 0.08),
              transition: 'none',
              '& .MuiLinearProgress-bar': {
                borderRadius: 999,
                backgroundColor: theme.palette[strength.paletteKey].main,
                transition: `width ${theme.md3?.motion.duration.medium4 ?? '400ms'} ${theme.md3?.motion.easing.standard ?? 'cubic-bezier(0.2, 0, 0, 1)'}, background-color ${theme.md3?.motion.duration.medium4 ?? '400ms'} ${theme.md3?.motion.easing.standard ?? 'cubic-bezier(0.2, 0, 0, 1)'}`,
              },
            }}
          />
        </Box>
      )}

      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
            Длина пароля
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              fontFamily: 'monospace',
              minWidth: 28,
              textAlign: 'right'
            }}
          >
            {length}
          </Typography>
        </Box>
        <Slider
          value={length}
          onChange={(_, v) => setLength(v as number)}
          min={4}
          max={64}
          step={1}
          marks={SLIDER_MARKS}
          valueLabelDisplay="auto"
          sx={{
            '& .MuiSlider-markLabel': {
              fontSize: '0.7rem',
              color: 'text.disabled'
            }
          }}
        />
      </Box>

      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {Object.keys(CHARSETS).map((key) => {
            const active = activeCharsets.includes(key);
            return (
              <Chip
                key={key}
                label={key}
                onClick={() => toggleCharset(key)}
                variant={active ? 'filled' : 'outlined'}
                color={active ? 'primary' : 'default'}
                sx={{
                  fontFamily: 'monospace',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  px: 1,
                  transitionProperty: 'background-color, color', transitionDuration: '150ms', transitionTimingFunction: 'cubic-bezier(0.2, 0, 0, 1)'
                }}
              />
            );
          })}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', alignItems: 'center', mb: 1 }}>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={generate}
          disabled={activeCharsets.length === 0}
          sx={{ px: 4, borderRadius: 18, textTransform: 'none', fontWeight: 600 }}
        >
          Сгенерировать
        </Button>
        {password && <CopyButton text={password} />}
      </Box>

      {/* Password history */}
      {history.length > 0 && (
        <Paper
          elevation={0}
          sx={{
            mt: 2,
            p: 2,
            borderRadius: 18,
            background: theme.palette.surfaceContainerLow
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', mb: 1 }}>
            История
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
            {history.map((pw, i) => (
              <Box
                key={`${pw}-${i}`}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 10,
                  '&:hover': {
                    background: alpha(theme.palette.primary.main, 0.04)
                  }
                }}
              >
                <Typography
                  sx={{
                    fontFamily: '"JetBrains Mono", "Consolas", monospace',
                    fontSize: '0.75rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    flex: 1,
                    mr: 1
                  }}
                >
                  {pw}
                </Typography>
                <CopyButton text={pw} size="small" />
              </Box>
            ))}
          </Box>
        </Paper>
      )}
    </Box>
  );
}
