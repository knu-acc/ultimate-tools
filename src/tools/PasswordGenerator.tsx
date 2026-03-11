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


const CHARSETS: Record<string, string> = {
  'A-Z': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  'a-z': 'abcdefghijklmnopqrstuvwxyz',
  '0-9': '0123456789',
  '!@#$': '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

const SLIDER_MARKS = [8, 12, 16, 24, 32].map((v) => ({ value: v, label: String(v) }));

function getStrength(password: string): { label: string; value: number; color: string } {
  let score = 0;
  if (password.length >= 8) score += 10;
  if (password.length >= 12) score += 15;
  if (password.length >= 20) score += 10;
  if (password.length >= 28) score += 5;
  if (/[a-z]/.test(password)) score += 15;
  if (/[A-Z]/.test(password)) score += 15;
  if (/[0-9]/.test(password)) score += 15;
  if (/[^a-zA-Z0-9]/.test(password)) score += 20;

  if (score >= 80) return { label: 'Отличный', value: 100, color: '#2e7d32' };
  if (score >= 60) return { label: 'Надёжный', value: 75, color: '#66bb6a' };
  if (score >= 40) return { label: 'Средний', value: 50, color: '#ffa726' };
  if (score >= 20) return { label: 'Слабый', value: 25, color: '#ef6c00' };
  return { label: 'Очень слабый', value: 10, color: '#d32f2f' };
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
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Box
        sx={{
          p: { xs: 1, md: 0 },
        }}
      >
        {/* Password display */}
        <Paper
          elevation={0}
          onClick={() => password && navigator.clipboard.writeText(password)}
          sx={{
            p: 2.5,
            mb: 2,
            minHeight: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.5,
            borderRadius: 2,
            border: `2px dashed ${password ? theme.palette.primary.main : theme.palette.divider}`,
            background: password
              ? theme.palette.surfaceContainerLow
              : theme.palette.action.hover,
            cursor: password ? 'pointer' : 'default',
            transition: 'all 0.2s ease',
            '&:hover': password
              ? {
                  background: theme.palette.surfaceContainerHigh,
                  borderColor: theme.palette.primary.dark
                }
              : {}
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
              <Typography variant="body2" sx={{ color: strength.color, fontWeight: 700 }}>
                {strength.label}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={strength.value}
              sx={{
                height: 10,
                borderRadius: 5,
                backgroundColor: alpha(theme.palette.text.primary, 0.08),
                transition: 'none',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 5,
                  backgroundColor: strength.color,
                  transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.5s ease'
                }
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
                    transition: 'all 0.15s ease'
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
            sx={{ px: 4, borderRadius: 3, textTransform: 'none', fontWeight: 600 }}
          >
            Сгенерировать
          </Button>
          {password && <CopyButton text={password} />}
        </Box>
      </Box>

      {/* Password history */}
      {history.length > 0 && (
        <Paper
          elevation={0}
          sx={{
            mt: 2,
            p: 2,
            borderRadius: 3
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', mb: 1 }}>
            История (нажмите, чтобы скопировать)
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
            {history.map((pw, i) => (
              <Chip
                key={`${pw}-${i}`}
                label={pw.length > 40 ? pw.slice(0, 37) + '...' : pw}
                onClick={() => navigator.clipboard.writeText(pw)}
                variant="outlined"
                size="small"
                sx={{
                  fontFamily: '"JetBrains Mono", "Consolas", monospace',
                  fontSize: '0.75rem',
                  maxWidth: '100%',
                  justifyContent: 'flex-start',
                  cursor: 'pointer',
                  '&:hover': {
                    background: theme.palette.surfaceContainerHigh
                  }
                }}
              />
            ))}
          </Box>
        </Paper>
      )}

    </Box>
  );
}
