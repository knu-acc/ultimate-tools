'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  IconButton,
  Grid,
  Chip,
  Switch,
  FormControlLabel,
  useTheme,
  alpha,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

interface Stats {
  total: number;
  unique: number;
  removed: number;
}

function removeDuplicateLines(
  text: string,
  caseSensitive: boolean,
  trimWhitespace: boolean
): { result: string; stats: Stats } {
  if (!text.trim()) {
    return { result: '', stats: { total: 0, unique: 0, removed: 0 } };
  }

  const lines = text.split('\n');
  const total = lines.length;
  const seen = new Set<string>();
  const uniqueLines: string[] = [];

  for (const line of lines) {
    let key = trimWhitespace ? line.trim() : line;
    if (!caseSensitive) {
      key = key.toLowerCase();
    }

    if (!seen.has(key)) {
      seen.add(key);
      uniqueLines.push(trimWhitespace ? line.trim() : line);
    }
  }

  return {
    result: uniqueLines.join('\n'),
    stats: {
      total,
      unique: uniqueLines.length,
      removed: total - uniqueLines.length,
    },
  };
}

export default function RemoveDuplicates() {
  const theme = useTheme();
  const [input, setInput] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [trimWhitespace, setTrimWhitespace] = useState(true);
  const [copied, setCopied] = useState(false);

  const { result, stats } = useMemo(
    () => removeDuplicateLines(input, caseSensitive, trimWhitespace),
    [input, caseSensitive, trimWhitespace]
  );

  const copyToClipboard = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          border: `1px solid ${theme.palette.divider}`,
          background: alpha(theme.palette.primary.main, 0.04),
        }}
      >
        {/* Input */}
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: 'text.secondary' }}>
          Исходный текст
        </Typography>
        <TextField
          multiline
          rows={6}
          fullWidth
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setCopied(false);
          }}
          placeholder="Введите текст с дублирующимися строками..."
          sx={{
            mb: 2,
            '& .MuiInputBase-root': { fontFamily: 'monospace', fontSize: '0.875rem' },
          }}
        />

        {/* Options */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            mb: 3,
            p: 2,
            borderRadius: 3,
            border: `1px solid ${theme.palette.divider}`,
            background: alpha(theme.palette.background.default, 0.6),
          }}
        >
          <FormControlLabel
            control={
              <Switch
                checked={caseSensitive}
                onChange={(e) => setCaseSensitive(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Учитывать регистр
              </Typography>
            }
          />
          <FormControlLabel
            control={
              <Switch
                checked={trimWhitespace}
                onChange={(e) => setTrimWhitespace(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Убирать пробелы по краям
              </Typography>
            }
          />
        </Box>

        {/* Stats */}
        {input.trim() && (
          <Grid container spacing={1.5} sx={{ mb: 3 }}>
            <Grid size={{ xs: 4 }}>
              <Box
                sx={{
                  textAlign: 'center',
                  p: 1.5,
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  background: alpha(theme.palette.info.main, 0.06),
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, color: theme.palette.info.main }}
                >
                  {stats.total}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Всего строк
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 4 }}>
              <Box
                sx={{
                  textAlign: 'center',
                  p: 1.5,
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  background: alpha(theme.palette.success.main, 0.06),
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, color: theme.palette.success.main }}
                >
                  {stats.unique}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Уникальных
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 4 }}>
              <Box
                sx={{
                  textAlign: 'center',
                  p: 1.5,
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  background: alpha(theme.palette.error.main, 0.06),
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, color: theme.palette.error.main }}
                >
                  {stats.removed}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Удалено дублей
                </Typography>
              </Box>
            </Grid>
          </Grid>
        )}

        {/* Output */}
        {result && (
          <Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                  Результат
                </Typography>
                <Chip
                  label={`−${stats.removed} дублей`}
                  size="small"
                  color={stats.removed > 0 ? 'success' : 'default'}
                  variant="outlined"
                />
              </Box>
              <Button
                size="small"
                startIcon={<ContentCopyIcon />}
                onClick={copyToClipboard}
                color={copied ? 'success' : 'primary'}
                variant="outlined"
                sx={{ textTransform: 'none', borderRadius: 2 }}
              >
                {copied ? 'Скопировано!' : 'Копировать'}
              </Button>
            </Box>
            <TextField
              multiline
              rows={6}
              fullWidth
              value={result}
              slotProps={{ input: { readOnly: true } }}
              sx={{
                '& .MuiInputBase-root': {
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  background: theme.palette.background.default,
                },
              }}
            />
          </Box>
        )}
      </Paper>
    </Box>
  );
}
