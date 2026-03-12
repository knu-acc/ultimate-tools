'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Grid,
  Chip,
  Switch,
  FormControlLabel,
  useTheme,
  alpha
} from '@mui/material';
import { CopyButton } from '@/src/components/CopyButton';


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
      removed: total - uniqueLines.length
    }
  };
}

export default function RemoveDuplicates() {
  const theme = useTheme();
  const [input, setInput] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [trimWhitespace, setTrimWhitespace] = useState(true);

  const { result, stats } = useMemo(
    () => removeDuplicateLines(input, caseSensitive, trimWhitespace),
    [input, caseSensitive, trimWhitespace]
  );

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 2,
          borderRadius: 3,
          background: theme.palette.surfaceContainerLow
        }}
      >
        <TextField
          multiline
          rows={5}
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Текст..."
          sx={{
            mb: 2,
            '& .MuiInputBase-root': { fontFamily: 'monospace', fontSize: '0.875rem' }
          }}
        />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
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

        {input.trim() && (
          <Grid container spacing={1.5} sx={{ mb: 2 }}>
            <Grid size={{ xs: 4 }}>
              <Box
                sx={{
                  textAlign: 'center',
                  p: 1.5,
                  borderRadius: 3,
                  background: alpha(theme.palette.info.main, 0.06)
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
                  background: alpha(theme.palette.success.main, 0.06)
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
                  background: alpha(theme.palette.error.main, 0.06)
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

        {result && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 1, alignItems: 'center' }}>
              {stats.removed > 0 && (
                <Chip label={`−${stats.removed}`} size="small" color="success" sx={{ fontWeight: 600 }} />
              )}
              <CopyButton text={result} />
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
                  background: alpha(theme.palette.text.primary, 0.03)
                }
              }}
            />
          </Box>
        )}
      </Paper>
    </Box>
  );
}
