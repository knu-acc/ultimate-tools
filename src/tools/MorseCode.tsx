'use client';

import { useState } from 'react';
import {
  Box, Typography, TextField, Paper, Grid, Chip, useTheme, IconButton, alpha
} from '@mui/material';
import { SwapVert } from '@mui/icons-material';
import { CopyButton } from '@/src/components/CopyButton';
import { useLanguage } from '@/src/i18n/LanguageContext';


const MORSE_MAP: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', '!': '-.-.--', '/': '-..-.',
  '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...', ';': '-.-.-.',
  '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.',
  '$': '...-..-', '@': '.--.-.',
  // Cyrillic
  'А': '.-', 'Б': '-...', 'В': '.--', 'Г': '--.', 'Д': '-..', 'Е': '.',
  'Ж': '...-', 'З': '--..', 'И': '..', 'Й': '.---', 'К': '-.-', 'Л': '.-..',
  'М': '--', 'Н': '-.', 'О': '---', 'П': '.--.', 'Р': '.-.', 'С': '...',
  'Т': '-', 'У': '..-', 'Ф': '..-.', 'Х': '....', 'Ц': '-.-.', 'Ч': '---.',
  'Ш': '----', 'Щ': '--.-', 'Ъ': '--.--', 'Ы': '-.--', 'Ь': '-..-',
  'Э': '..-..', 'Ю': '..--', 'Я': '.-.-', 'Ё': '.'
};

const REVERSE_MORSE: Record<string, string> = {};
Object.entries(MORSE_MAP).forEach(([char, morse]) => {
  if (!REVERSE_MORSE[morse]) REVERSE_MORSE[morse] = char;
});

function textToMorse(text: string): string {
  return text.toUpperCase().split('').map(char => {
    if (char === ' ') return '/';
    return MORSE_MAP[char] || '';
  }).filter(Boolean).join(' ');
}

function morseToText(morse: string): string {
  return morse.split(' / ').map(word =>
    word.split(' ').map(code => REVERSE_MORSE[code] || '').join('')
  ).join(' ');
}

export default function MorseCode() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const output = mode === 'encode' ? textToMorse(input) : morseToText(input);

  const swap = () => {
    setInput(output);
    setMode(prev => prev === 'encode' ? 'decode' : 'encode');
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Chip
          label={isEn ? 'Text → Morse' : 'Текст → Морзе'}
          onClick={() => setMode('encode')}
          sx={{
            fontWeight: mode === 'encode' ? 700 : 400,
            bgcolor: mode === 'encode' ? theme.palette.surfaceContainerHigh : theme.palette.surfaceContainerLow
          }}
        />
        <Chip
          label={isEn ? 'Morse → Text' : 'Морзе → Текст'}
          onClick={() => setMode('decode')}
          sx={{
            fontWeight: mode === 'decode' ? 700 : 400,
            bgcolor: mode === 'decode' ? theme.palette.surfaceContainerHigh : theme.palette.surfaceContainerLow
          }}
        />
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            multiline
            rows={5}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? (isEn ? 'Text...' : 'Текст...') : (isEn ? 'Morse code...' : 'Код Морзе...')}
            sx={{ '& .MuiOutlinedInput-root': { fontFamily: mode === 'decode' ? 'monospace' : 'inherit' } }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5, mb: 1 }}>
            <IconButton size="small" onClick={swap}><SwapVert fontSize="small" /></IconButton>
            <CopyButton text={output} />
          </Box>
          <TextField
            fullWidth
            multiline
            rows={5}
            value={output}
            slotProps={{ input: { readOnly: true } }}
            sx={{
              '& .MuiOutlinedInput-root': {
                fontFamily: mode === 'encode' ? 'monospace' : 'inherit',
                fontSize: mode === 'encode' ? '1.1rem' : '0.875rem',
                letterSpacing: mode === 'encode' ? 2 : 'normal',
                bgcolor: theme.palette.surfaceContainerLow
              }
            }}
          />
        </Grid>
      </Grid>

      <Paper
        elevation={0}
        sx={{
          mt: 2,
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
          bgcolor: theme.palette.surfaceContainerLow,
          transitionProperty: 'background-color', transitionDuration: '200ms', transitionTimingFunction: 'ease',
          '&:hover': { background: alpha(theme.palette.primary.main, 0.04) }
        }}
      >
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {['А .-', 'Б -...', 'В .--', 'Г --.', 'Д -..', 'Е .', 'Ж ...-', 'З --..', 'И ..', 'К -.-',
            'Л .-..', 'М --', 'Н -.', 'О ---', 'П .--.', 'Р .-.', 'С ...', 'Т -', 'У ..-', 'Ф ..-.',
            '1 .----', '2 ..---', '3 ...--', '4 ....-', '5 .....', '6 -....', '7 --...', '8 ---..', '9 ----.', '0 -----',
          ].map(item => {
            const [char, ...morse] = item.split(' ');
            return (
              <Chip
                key={item}
                label={`${char} ${morse.join(' ')}`}
                size="small"
                sx={{ fontFamily: 'monospace', fontSize: '0.7rem' }}
              />
            );
          })}
        </Box>
      </Paper>
    </Box>
  );
}
