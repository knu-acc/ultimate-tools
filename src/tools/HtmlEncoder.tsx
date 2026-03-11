'use client';

import React, { useState } from 'react';
import {
  Box, Typography, TextField, Paper, Grid, Button, Chip, useTheme, IconButton
} from '@mui/material';
import { ContentCopy, SwapVert } from '@mui/icons-material';
import { CopyButton, ShareButton } from '@/src/components/CopyButton';


export default function HtmlEncoder() {
  const theme = useTheme();
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

  const copy = () => navigator.clipboard.writeText(output);
  const swap = () => {
    setInput(output);
    setMode(prev => prev === 'encode' ? 'decode' : 'encode');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Chip
          label="Кодировать"
          onClick={() => setMode('encode')}
          sx={{
            fontWeight: mode === 'encode' ? 700 : 400,
            bgcolor: mode === 'encode' ? theme.palette.surfaceContainerHigh : theme.palette.surfaceContainerLow
          }}
        />
        <Chip
          label="Декодировать"
          onClick={() => setMode('decode')}
          sx={{
            fontWeight: mode === 'decode' ? 700 : 400,
            bgcolor: mode === 'decode' ? theme.palette.surfaceContainerHigh : theme.palette.surfaceContainerLow
          }}
        />
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            {mode === 'encode' ? 'Исходный HTML' : 'Закодированный текст'}
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={8}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? '<p>Пример HTML</p>' : '&lt;p&gt;Пример&lt;/p&gt;'}
            sx={{ '& .MuiOutlinedInput-root': { fontFamily: 'monospace', fontSize: '0.85rem' } }}
          />
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <Chip label={`${input.length} символов`} size="small" />
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="subtitle2" fontWeight={600}>
              Результат
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton size="small" onClick={swap} title="Поменять местами">
                <SwapVert fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={copy} title="Копировать">
                <ContentCopy fontSize="small" />
              </IconButton>
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
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <Chip label={`${output.length} символов`} size="small" />
          </Box>
        </Grid>
      </Grid>

      {/* Common entities reference */}
      <Paper
        elevation={0}
        sx={{ mt: 3, p: 2, borderRadius: 2, bgcolor: theme.palette.surfaceContainerLow }}
      >
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Частые HTML-сущности
        </Typography>
        <Grid container spacing={1}>
          {[
            { char: '<', entity: '&lt;' },
            { char: '>', entity: '&gt;' },
            { char: '&', entity: '&amp;' },
            { char: '"', entity: '&quot;' },
            { char: "'", entity: '&#039;' },
            { char: '©', entity: '&copy;' },
            { char: '®', entity: '&reg;' },
            { char: '€', entity: '&euro;' },
            { char: '—', entity: '&mdash;' },
            { char: '→', entity: '&rarr;' },
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
