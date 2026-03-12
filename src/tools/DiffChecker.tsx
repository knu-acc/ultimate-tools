'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Chip,
  Grid,
  useTheme,
  alpha
} from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  text: string;
  leftNum?: number;
  rightNum?: number;
}

function computeDiff(original: string, modified: string): DiffLine[] {
  const origLines = original.split('\n');
  const modLines = modified.split('\n');
  const m = origLines.length;
  const n = modLines.length;

  // LCS via DP
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (origLines[i - 1] === modLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to build diff
  const result: DiffLine[] = [];
  let i = m;
  let j = n;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && origLines[i - 1] === modLines[j - 1]) {
      result.unshift({ type: 'unchanged', text: origLines[i - 1], leftNum: i, rightNum: j });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ type: 'added', text: modLines[j - 1], rightNum: j });
      j--;
    } else if (i > 0) {
      result.unshift({ type: 'removed', text: origLines[i - 1], leftNum: i });
      i--;
    }
  }

  return result;
}

export default function DiffChecker() {
  const theme = useTheme();
  const [original, setOriginal] = useState('');
  const [modified, setModified] = useState('');
  const [diffResult, setDiffResult] = useState<DiffLine[] | null>(null);

  const handleCompare = () => {
    if (!original && !modified) return;
    const diff = computeDiff(original, modified);
    setDiffResult(diff);
  };

  const clear = () => {
    setOriginal('');
    setModified('');
    setDiffResult(null);
  };

  const stats = useMemo(() => {
    if (!diffResult) return null;
    const added = diffResult.filter((l) => l.type === 'added').length;
    const removed = diffResult.filter((l) => l.type === 'removed').length;
    const unchanged = diffResult.filter((l) => l.type === 'unchanged').length;
    return { added, removed, unchanged, total: diffResult.length };
  }, [diffResult]);

  const getBgColor = (type: DiffLine['type']) => {
    if (type === 'added') {
      return theme.palette.mode === 'dark'
        ? alpha('#2e7d32', 0.25)
        : alpha('#4caf50', 0.12);
    }
    if (type === 'removed') {
      return theme.palette.mode === 'dark'
        ? alpha('#c62828', 0.25)
        : alpha('#f44336', 0.12);
    }
    return 'transparent';
  };

  const getLineColor = (type: DiffLine['type']) => {
    if (type === 'added') return theme.palette.success.main;
    if (type === 'removed') return theme.palette.error.main;
    return 'text.disabled';
  };

  const getPrefix = (type: DiffLine['type']) => {
    if (type === 'added') return '+';
    if (type === 'removed') return '-';
    return ' ';
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
          background: theme.palette.surfaceContainerLow
        }}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              multiline
              rows={12}
              fullWidth
              value={original}
              onChange={(e) => setOriginal(e.target.value)}
              placeholder="Оригинальный текст..."
              sx={{
                '& .MuiInputBase-root': {
                  fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
                  fontSize: '0.85rem',
                  lineHeight: 1.6
                },
                '& .MuiOutlinedInput-root': { borderRadius: 2 }
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              multiline
              rows={12}
              fullWidth
              value={modified}
              onChange={(e) => setModified(e.target.value)}
              placeholder="Изменённый текст..."
              sx={{
                '& .MuiInputBase-root': {
                  fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
                  fontSize: '0.85rem',
                  lineHeight: 1.6
                },
                '& .MuiOutlinedInput-root': { borderRadius: 2 }
              }}
            />
          </Grid>
        </Grid>

        {/* Buttons */}
        <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', mt: 2.5, mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<CompareArrowsIcon />}
            onClick={handleCompare}
            disabled={!original && !modified}
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
          >
            Сравнить
          </Button>
          <Button
            variant="outlined"
            startIcon={<DeleteOutlineIcon />}
            onClick={clear}
            color="inherit"
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            Очистить
          </Button>
        </Box>

        {/* Stats */}
        {stats && (
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 2, flexWrap: 'wrap' }}>
            <Chip
              size="small"
              label={`+${stats.added} добавлено`}
              sx={{
                fontSize: '0.75rem',
                bgcolor: alpha(theme.palette.success.main, 0.1),
                color: theme.palette.success.main,
                fontWeight: 600
              }}
            />
            <Chip
              size="small"
              label={`-${stats.removed} удалено`}
              sx={{
                fontSize: '0.75rem',
                bgcolor: alpha(theme.palette.error.main, 0.1),
                color: theme.palette.error.main,
                fontWeight: 600
              }}
            />
            <Chip
              size="small"
              label={`${stats.unchanged} без изменений`}
              variant="outlined"
              sx={{ fontSize: '0.75rem' }}
            />
          </Box>
        )}

        {/* Diff output */}
        {diffResult && (
          <Paper
            elevation={0}
            sx={{
              borderRadius: 2,
              overflow: 'auto',
              maxHeight: 500
            }}
          >
            {diffResult.map((line, idx) => (
              <Box
                key={idx}
                sx={{
                  display: 'flex',
                  background: getBgColor(line.type),
                  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                  '&:last-child': { borderBottom: 'none' },
                  minHeight: 28
                }}
              >
                {/* Left line number */}
                <Box
                  sx={{
                    width: 48,
                    flexShrink: 0,
                    textAlign: 'right',
                    pr: 1,
                    pl: 0.5,
                    py: 0.25,
                    borderRight: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                    userSelect: 'none'
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '0.72rem',
                      color: 'text.disabled',
                      lineHeight: '24px'
                    }}
                  >
                    {line.leftNum ?? ''}
                  </Typography>
                </Box>

                {/* Right line number */}
                <Box
                  sx={{
                    width: 48,
                    flexShrink: 0,
                    textAlign: 'right',
                    pr: 1,
                    pl: 0.5,
                    py: 0.25,
                    borderRight: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                    userSelect: 'none'
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '0.72rem',
                      color: 'text.disabled',
                      lineHeight: '24px'
                    }}
                  >
                    {line.rightNum ?? ''}
                  </Typography>
                </Box>

                {/* Prefix (+/-/ ) */}
                <Box
                  sx={{
                    width: 24,
                    flexShrink: 0,
                    textAlign: 'center',
                    py: 0.25,
                    borderRight: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                    userSelect: 'none'
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: getLineColor(line.type),
                      lineHeight: '24px'
                    }}
                  >
                    {getPrefix(line.type)}
                  </Typography>
                </Box>

                {/* Content */}
                <Box sx={{ flex: 1, px: 1, py: 0.25, overflow: 'hidden' }}>
                  <Typography
                    component="pre"
                    sx={{
                      fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
                      fontSize: '0.8rem',
                      lineHeight: '24px',
                      m: 0,
                      whiteSpace: 'pre',
                      color: line.type === 'unchanged' ? 'text.secondary' : 'text.primary'
                    }}
                  >
                    {line.text}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Paper>
        )}
      </Paper>

    </Box>
  );
}
