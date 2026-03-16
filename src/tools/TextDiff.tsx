'use client';

import { useState, useMemo } from 'react';
import {
  Box, Typography, TextField, Paper, Grid, Chip, alpha, useTheme
} from '@mui/material';
import { useLanguage } from '@/src/i18n/LanguageContext';

interface DiffLine {
  type: 'added' | 'removed' | 'same';
  text: string;
  lineNum1?: number;
  lineNum2?: number;
}

function computeDiff(text1: string, text2: string): DiffLine[] {
  const lines1 = text1.split('\n');
  const lines2 = text2.split('\n');
  const result: DiffLine[] = [];

  // Simple LCS-based diff
  const m = lines1.length;
  const n = lines2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (lines1[i - 1] === lines2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack
  let i = m, j = n;
  const stack: DiffLine[] = [];
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && lines1[i - 1] === lines2[j - 1]) {
      stack.push({ type: 'same', text: lines1[i - 1], lineNum1: i, lineNum2: j });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      stack.push({ type: 'added', text: lines2[j - 1], lineNum2: j });
      j--;
    } else {
      stack.push({ type: 'removed', text: lines1[i - 1], lineNum1: i });
      i--;
    }
  }

  return stack.reverse();
}

export default function TextDiff() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');

  const diff = useMemo(() => {
    if (!text1 && !text2) return [];
    return computeDiff(text1, text2);
  }, [text1, text2]);

  const stats = useMemo(() => {
    const added = diff.filter(d => d.type === 'added').length;
    const removed = diff.filter(d => d.type === 'removed').length;
    const same = diff.filter(d => d.type === 'same').length;
    return { added, removed, same, total: diff.length };
  }, [diff]);

  const getLineColor = (type: string) => {
    switch (type) {
      case 'added': return alpha('#4caf50', 0.12);
      case 'removed': return alpha('#f44336', 0.12);
      default: return 'transparent';
    }
  };

  const getLinePrefix = (type: string) => {
    switch (type) {
      case 'added': return '+';
      case 'removed': return '-';
      default: return ' ';
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 2,
          borderRadius: 18,
          background: theme.palette.surfaceContainerLow
        }}
      >
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              multiline
              rows={10}
              value={text1}
              onChange={(e) => setText1(e.target.value)}
              placeholder={isEn ? "Original text..." : "Оригинальный текст..."}
              sx={{
                '& .MuiOutlinedInput-root': { fontFamily: 'monospace', fontSize: '0.85rem' }
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              multiline
              rows={10}
              value={text2}
              onChange={(e) => setText2(e.target.value)}
              placeholder={isEn ? "Modified text..." : "Изменённый текст..."}
              sx={{
                '& .MuiOutlinedInput-root': { fontFamily: 'monospace', fontSize: '0.85rem' }
              }}
            />
          </Grid>
        </Grid>

      {/* Stats */}
      {diff.length > 0 && (
        <>
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            <Chip
              label={`+${stats.added} ${isEn ? 'added' : 'добавлено'}`}
              size="small"
              sx={{ bgcolor: alpha('#4caf50', 0.12), color: '#2e7d32', fontWeight: 600 }}
            />
            <Chip
              label={`-${stats.removed} ${isEn ? 'removed' : 'удалено'}`}
              size="small"
              sx={{ bgcolor: alpha('#f44336', 0.12), color: '#c62828', fontWeight: 600 }}
            />
            <Chip
              label={`${stats.same} ${isEn ? 'unchanged' : 'без изменений'}`}
              size="small"
            />
          </Box>

          {/* Diff output */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: 18,
              overflow: 'hidden',
              maxHeight: 400,
              overflowY: 'auto'
            }}
          >
            {diff.map((line, idx) => (
              <Box
                key={idx}
                sx={{
                  display: 'flex',
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  lineHeight: '20px',
                  bgcolor: getLineColor(line.type),
                  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) }
                }}
              >
                <Box sx={{ width: 32, textAlign: 'center', color: theme.palette.text.secondary, flexShrink: 0, py: 0.25 }}>
                  {line.lineNum1 || ''}
                </Box>
                <Box sx={{ width: 32, textAlign: 'center', color: theme.palette.text.secondary, flexShrink: 0, py: 0.25 }}>
                  {line.lineNum2 || ''}
                </Box>
                <Box sx={{
                  width: 20,
                  textAlign: 'center',
                  fontWeight: 700,
                  color: line.type === 'added' ? '#2e7d32' : line.type === 'removed' ? '#c62828' : theme.palette.text.secondary,
                  flexShrink: 0,
                  py: 0.25
                }}>
                  {getLinePrefix(line.type)}
                </Box>
                <Box sx={{ flex: 1, whiteSpace: 'pre-wrap', wordBreak: 'break-all', py: 0.25, pr: 1 }}>
                  {line.text}
                </Box>
              </Box>
            ))}
          </Paper>
        </>
      )}

      {diff.length === 0 && text1 && text2 && (
        <Paper
          elevation={0}
          sx={{ p: 3, textAlign: 'center', borderRadius: 18, bgcolor: alpha('#4caf50', 0.06) }}
        >
          <Typography color="success.main" fontWeight={600}>
            {isEn ? 'Texts are identical!' : 'Тексты идентичны!'}
          </Typography>
        </Paper>
      )}
      </Paper>
    </Box>
  );
}
