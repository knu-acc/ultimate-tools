'use client';

import { useState } from 'react';
import {
  Box, Typography, TextField, Paper, Grid, Chip, useTheme, IconButton, alpha
} from '@mui/material';
import { SwapVert } from '@mui/icons-material';
import { CopyButton } from '@/src/components/CopyButton';
import { useLanguage } from '@/src/i18n/LanguageContext';


export default function HtmlEncoder() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const encode = (text: string): string => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      .replace(/\//g, '&#x2F;');
  };

  const decode = (text: string): string => {
    const doc = new DOMParser().parseFromString(text, 'text/html');
    return doc.documentElement.textContent || '';
  };

  const output = mode === 'encode' ? encode(input) : decode(input);

  const swap = () => {
    setInput(output);
    setMode(prev => prev === 'encode' ? 'decode' : 'encode');
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Chip
          label={isEn ? 'Encode' : 'Кодировать'}
          onClick={() => setMode('encode')}
          sx={{
            fontWeight: mode === 'encode' ? 700 : 400,
            bgcolor: mode === 'encode' ? theme.palette.surfaceContainerHigh : theme.palette.surfaceContainerLow
          }}
        />
        <Chip
          label={isEn ? 'Decode' : 'Декодировать'}
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
            rows={8}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? '<p>HTML</p>' : '&lt;p&gt;HTML&lt;/p&gt;'}
            sx={{ '& .MuiOutlinedInput-root': { fontFamily: 'monospace', fontSize: '0.85rem' } }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mb: 1 }}>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton size="small" onClick={swap} title={isEn ? 'Swap' : 'Поменять местами'}>
                <SwapVert fontSize="small" />
              </IconButton>
              <CopyButton text={output} />
            </Box>
          </Box>
          <TextField
            fullWidth
            multiline
            rows={8}
            value={output}
            slotProps={{ input: { readOnly: true } }}
            sx={{
              '& .MuiOutlinedInput-root': {
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                bgcolor: theme.palette.surfaceContainerLow
              }
            }}
          />
        </Grid>
      </Grid>

      {/* Common entities reference */}
      <Paper
        elevation={0}
        sx={{
          mt: 2,
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
          bgcolor: theme.palette.surfaceContainerLow,
          transition: 'all 200ms ease',
          '&:hover': { background: alpha(theme.palette.primary.main, 0.04) }
        }}
      >
        <Grid container spacing={1}>
          {[
            { char: '<', entity: '&lt;' },
            { char: '>', entity: '&gt;' },
            { char: '&', entity: '&amp;' },
            { char: '"', entity: '&quot;' },
            { char: "'", entity: '&#039;' },
            { char: '\u00a9', entity: '&copy;' },
            { char: '\u00ae', entity: '&reg;' },
            { char: '\u20ac', entity: '&euro;' },
            { char: '\u2014', entity: '&mdash;' },
            { char: '\u2192', entity: '&rarr;' },
          ].map(({ char, entity }) => (
            <Grid key={entity} size={{ xs: 6, sm: 4, md: 2.4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body1" fontWeight={700} sx={{ width: 24 }}>{char}</Typography>
                <Typography variant="caption" sx={{ fontFamily: 'monospace', color: theme.palette.text.secondary }}>
                  {entity}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
}
