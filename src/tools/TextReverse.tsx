'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Chip,
  IconButton,
  useTheme,
  alpha
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { CopyButton, ShareButton } from '@/src/components/CopyButton';


type ReverseMode = 'chars' | 'words' | 'lines' | 'mirror';

const MODES: { mode: ReverseMode; label: string; description: string }[] = [
  { mode: 'chars', label: 'Символы', description: 'Перевернуть символы' },
  { mode: 'words', label: 'Слова', description: 'Перевернуть порядок слов' },
  { mode: 'lines', label: 'Строки', description: 'Перевернуть порядок строк' },
  { mode: 'mirror', label: 'Зеркало', description: 'Перевернуть вверх ногами' },
];

// Unicode flip map for mirror mode
const FLIP_MAP: Record<string, string> = {
  a: '\u0250', b: 'q', c: '\u0254', d: 'p', e: '\u01DD', f: '\u025F',
  g: '\u0183', h: '\u0265', i: '\u0131', j: '\u027E', k: '\u029E', l: 'l',
  m: '\u026F', n: 'u', o: 'o', p: 'd', q: 'b', r: '\u0279', s: 's',
  t: '\u0287', u: 'n', v: '\u028C', w: '\u028D', x: 'x', y: '\u028E', z: 'z',
  A: '\u2200', B: '\u15FA', C: '\u0186', D: '\u15E1', E: '\u018E', F: '\u2132',
  G: '\u2141', H: 'H', I: 'I', J: '\u017F', K: '\u22CA', L: '\u2142',
  M: 'W', N: 'N', O: 'O', P: '\u0500', Q: '\u038C', R: '\u1D1A',
  S: 'S', T: '\u22A5', U: '\u2229', V: '\u039B', W: 'M', X: 'X',
  Y: '\u2144', Z: 'Z',
  '0': '0', '1': '\u0196', '2': '\u1105', '3': '\u0190', '4': '\u3123',
  '5': '\u03DB', '6': '9', '7': '\u3125', '8': '8', '9': '6',
  '.': '\u02D9', ',': '\u2018', '?': '\u00BF', '!': '\u00A1',
  '(': ')', ')': '(', '[': ']', ']': '[', '{': '}', '}': '{',
  '<': '>', '>': '<', '&': '\u214B', '_': '\u203E',
  "'": ',', '"': '\u201E', '`': ',', ';': '\u061B'
};

function reverseChars(text: string): string {
  // Use Array.from to handle Unicode surrogate pairs correctly
  return Array.from(text).reverse().join('');
}

function reverseWords(text: string): string {
  return text
    .split('\n')
    .map((line) => line.split(/(\s+)/).reverse().join(''))
    .join('\n');
}

function reverseLines(text: string): string {
  return text.split('\n').reverse().join('\n');
}

function mirrorText(text: string): string {
  const flipped = Array.from(text)
    .map((ch) => FLIP_MAP[ch] ?? ch)
    .reverse()
    .join('');
  // Also reverse line order so multi-line text reads correctly upside-down
  return flipped.split('\n').reverse().join('\n');
}

function applyReverse(text: string, mode: ReverseMode): string {
  if (!text) return '';
  switch (mode) {
    case 'chars':
      return reverseChars(text);
    case 'words':
      return reverseWords(text);
    case 'lines':
      return reverseLines(text);
    case 'mirror':
      return mirrorText(text);
    default:
      return text;
  }
}

export default function TextReverse() {
  const theme = useTheme();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [activeMode, setActiveMode] = useState<ReverseMode>('chars');
  const [copied, setCopied] = useState(false);

  const handleModeChange = (mode: ReverseMode) => {
    setActiveMode(mode);
    setCopied(false);
    if (input.trim()) {
      setOutput(applyReverse(input, mode));
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    setCopied(false);
    if (value.trim()) {
      setOutput(applyReverse(value, activeMode));
    } else {
      setOutput('');
    }
  };

  const handleReverse = () => {
    const result = applyReverse(input, activeMode);
    setOutput(result);
    setCopied(false);
  };

  const copyToClipboard = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          background: theme.palette.surfaceContainerLowest
        }}
      >
        {/* Input */}
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
          Исходный текст
        </Typography>
        <TextField
          multiline
          rows={6}
          fullWidth
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Введите текст для переворота..."
          sx={{
            mb: 2.5,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2
            }
          }}
        />

        {/* Mode selection */}
        <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 600, color: 'text.secondary' }}>
          Режим переворота
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2.5 }}>
          {MODES.map((m) => (
            <Chip
              key={m.mode}
              label={m.label}
              onClick={() => handleModeChange(m.mode)}
              variant={activeMode === m.mode ? 'filled' : 'outlined'}
              color={activeMode === m.mode ? 'primary' : 'default'}
              sx={{
                fontWeight: 600,
                fontSize: '0.85rem',
                borderRadius: 2,
                px: 1
              }}
            />
          ))}
        </Box>

        {/* Reverse button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2.5 }}>
          <Button
            variant="contained"
            onClick={handleReverse}
            disabled={!input.trim()}
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, px: 4 }}
          >
            Перевернуть
          </Button>
        </Box>

        {/* Output */}
        {output && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                Результат
              </Typography>
              <CopyButton text={output} />
            </Box>
            <TextField
              multiline
              rows={6}
              fullWidth
              value={output}
              slotProps={{ input: { readOnly: true } }}
              sx={{
                '& .MuiInputBase-root': {
                  background: theme.palette.mode === 'dark'
                    ? alpha(theme.palette.common.black, 0.3)
                    : alpha(theme.palette.grey[50], 1)
                },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
          </Box>
        )}
      </Paper>
    </Box>
  );
}
