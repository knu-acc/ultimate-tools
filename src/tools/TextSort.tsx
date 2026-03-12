'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  Paper,
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import { CopyButton } from '@/src/components/CopyButton';


type SortMode = 'az' | 'za' | 'num-asc' | 'num-desc' | 'length' | 'shuffle';

interface SortOption {
  key: SortMode;
  label: string;
  color: string;
}

const SORT_OPTIONS: SortOption[] = [
  { key: 'az', label: 'А → Я', color: '#2196f3' },
  { key: 'za', label: 'Я → А', color: '#9c27b0' },
  { key: 'num-asc', label: 'По числу ↑', color: '#4caf50' },
  { key: 'num-desc', label: 'По числу ↓', color: '#ff9800' },
  { key: 'length', label: 'По длине', color: '#e91e63' },
  { key: 'shuffle', label: 'Перемешать', color: '#607d8b' },
];

function extractNumber(line: string): number {
  const match = line.match(/-?\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : Infinity;
}

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function sortLines(lines: string[], mode: SortMode): string[] {
  if (lines.length === 0) return [];

  switch (mode) {
    case 'az':
      return [...lines].sort((a, b) => a.localeCompare(b, 'ru'));
    case 'za':
      return [...lines].sort((a, b) => b.localeCompare(a, 'ru'));
    case 'num-asc':
      return [...lines].sort((a, b) => extractNumber(a) - extractNumber(b));
    case 'num-desc':
      return [...lines].sort((a, b) => extractNumber(b) - extractNumber(a));
    case 'length':
      return [...lines].sort((a, b) => a.length - b.length);
    case 'shuffle':
      return shuffleArray(lines);
    default:
      return lines;
  }
}

export default function TextSort() {
  const theme = useTheme();
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<SortMode>('az');
  const [shuffleKey, setShuffleKey] = useState(0);

  const lines = useMemo(() => {
    return input.split('\n').filter((line) => line.trim().length > 0);
  }, [input]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const sorted = useMemo(() => sortLines(lines, mode), [lines, mode, shuffleKey]);

  const outputText = sorted.join('\n');

  const handleModeChange = (newMode: SortMode) => {
    if (newMode === 'shuffle') {
      setShuffleKey((k) => k + 1);
    }
    setMode(newMode);
  };

  const activeOption = SORT_OPTIONS.find((o) => o.key === mode);
  const activeColor = activeOption?.color ?? theme.palette.primary.main;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, mb: 2, borderRadius: 3, background: theme.palette.surfaceContainerLow }}>
        <TextField
          fullWidth
          multiline
          minRows={6}
          maxRows={16}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={'Яблоко\nБанан\nВишня\nАпельсин'}
          sx={{
            '& .MuiInputBase-input': {
              fontFamily: 'monospace',
              fontSize: '0.95rem',
              lineHeight: 1.6
            }
          }}
        />
      </Paper>

      <Paper elevation={0} sx={{ p: 3, mb: 2, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {SORT_OPTIONS.map((option) => {
            const isActive = mode === option.key;
            return (
              <Chip
                key={option.key}
                label={option.label}
                onClick={() => handleModeChange(option.key)}
                sx={{
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  backgroundColor: isActive ? alpha(option.color, 0.15) : 'transparent',
                  color: isActive ? option.color : 'text.secondary',
                  border: `1.5px solid ${isActive ? option.color : 'transparent'}`,
                  transition: 'all 200ms ease',
                  '&:hover': {
                    backgroundColor: alpha(option.color, 0.1),
                    borderColor: option.color
                  }
                }}
              />
            );
          })}
        </Box>
      </Paper>

      {lines.length > 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 2,
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Chip
            label={`${lines.length} ${getLineWord(lines.length)}`}
            size="small"
            sx={{
              fontWeight: 600,
              fontSize: '0.75rem',
              backgroundColor: alpha(activeColor, 0.12),
              color: activeColor
            }}
          />
          <Typography variant="body2" color="text.secondary">
            Сортировка: {activeOption?.label}
          </Typography>
        </Paper>
      )}

      {sorted.length > 0 && (
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
            <CopyButton text={outputText} />
          </Box>
          <TextField
            fullWidth
            multiline
            minRows={6}
            maxRows={16}
            value={outputText}
            slotProps={{ input: { readOnly: true } }}
            sx={{
              '& .MuiInputBase-input': {
                fontFamily: 'monospace',
                fontSize: '0.95rem',
                lineHeight: 1.6
              },
              '& .MuiOutlinedInput-root': {
                backgroundColor: alpha(activeColor, 0.02)
              }
            }}
          />
        </Paper>
      )}
    </Box>
  );
}

function getLineWord(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod100 >= 11 && mod100 <= 19) return 'строк';
  if (mod10 === 1) return 'строка';
  if (mod10 >= 2 && mod10 <= 4) return 'строки';
  return 'строк';
}
