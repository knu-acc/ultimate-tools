'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import { CopyButton } from '@/src/components/CopyButton';
import { useLanguage } from '@/src/i18n/LanguageContext';


type ReverseMode = 'chars' | 'words' | 'lines' | 'mirror';

interface ModeOption {
  mode: ReverseMode;
  label: string;
  labelEn: string;
  description: string;
  descriptionEn: string;
}

const MODES: ModeOption[] = [
  { mode: 'chars', label: 'Символы', labelEn: 'Characters', description: 'Перевернуть символы', descriptionEn: 'Reverse characters' },
  { mode: 'words', label: 'Слова', labelEn: 'Words', description: 'Перевернуть порядок слов', descriptionEn: 'Reverse word order' },
  { mode: 'lines', label: 'Строки', labelEn: 'Lines', description: 'Перевернуть порядок строк', descriptionEn: 'Reverse line order' },
  { mode: 'mirror', label: 'Зеркало', labelEn: 'Mirror', description: 'Перевернуть вверх ногами', descriptionEn: 'Flip upside down' },
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
  const { locale } = useLanguage();
  const isEn = locale === 'en';

  const handleModeChange = (mode: ReverseMode) => {
    setActiveMode(mode);
    if (input.trim()) {
      setOutput(applyReverse(input, mode));
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    if (value.trim()) {
      setOutput(applyReverse(value, activeMode));
    } else {
      setOutput('');
    }
  };

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
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={isEn ? 'Text...' : 'Текст...'}
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          {MODES.map((m) => (
            <Chip
              key={m.mode}
              label={isEn ? m.labelEn : m.label}
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

        {output && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
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
