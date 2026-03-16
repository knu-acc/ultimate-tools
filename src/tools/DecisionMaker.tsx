'use client';

import { useState } from 'react';
import {
  Box, Typography, Paper, TextField, Button, Chip, alpha, useTheme, IconButton
} from '@mui/material';
import { Delete, Add, Casino } from '@mui/icons-material';
import { useLanguage } from '@/src/i18n/LanguageContext';

export default function DecisionMaker() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const [options, setOptions] = useState<string[]>(['', '']);
  const [result, setResult] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const addOption = () => setOptions([...options, '']);
  const removeOption = (i: number) => { if (options.length > 2) setOptions(options.filter((_, idx) => idx !== i)); };
  const updateOption = (i: number, val: string) => { const n = [...options]; n[i] = val; setOptions(n); };

  const validOptions = options.filter(o => o.trim());

  const decide = () => {
    if (validOptions.length < 2) return;
    setIsAnimating(true);
    setResult(null);

    let count = 0;
    const interval = setInterval(() => {
      setResult(validOptions[Math.floor(Math.random() * validOptions.length)]);
      count++;
      if (count > 15) {
        clearInterval(interval);
        setResult(validOptions[Math.floor(Math.random() * validOptions.length)]);
        setIsAnimating(false);
      }
    }, 100);
  };

  return (
    <Box sx={{
      maxWidth: 800,
      mx: 'auto',
      mb: 2,
      borderRadius: 3,
      bgcolor: theme.palette.surfaceContainerLow,
      p: { xs: 2, sm: 3 },
      transition: 'background 0.2s ease',
      '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) }
    }}>
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, mb: 2 }}>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>{isEn ? 'Options' : 'Варианты выбора'}</Typography>
        {options.map((opt, i) => (
          <Box key={i} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
            <Chip label={i + 1} size="small" sx={{ minWidth: 32 }} />
            <TextField fullWidth size="small" value={opt} onChange={e => updateOption(i, e.target.value)} placeholder={isEn ? `Option ${i + 1}` : `Вариант ${i + 1}`} />
            {options.length > 2 && (
              <IconButton size="small" onClick={() => removeOption(i)} color="error"><Delete fontSize="small" /></IconButton>
            )}
          </Box>
        ))}
        <Button startIcon={<Add />} onClick={addOption} size="small" sx={{ mt: 1 }}>{isEn ? 'Add option' : 'Добавить вариант'}</Button>
      </Paper>

      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Button variant="contained" size="large" startIcon={<Casino />} onClick={decide} disabled={validOptions.length < 2 || isAnimating} sx={{ borderRadius: 7, px: 4 }}>
          {isEn ? 'Choose!' : 'Выбрать!'}
        </Button>
      </Box>

      {result && (
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3, bgcolor: theme.palette.surfaceContainerHigh, textAlign: 'center', border: `2px solid ${theme.palette.primary.main}`, transitionProperty: 'background-color', transitionDuration: '300ms' }}>
          <Typography variant="caption" color="text.secondary">{isAnimating ? (isEn ? 'Choosing...' : 'Выбираю...') : (isEn ? 'Result:' : 'Результат:')}</Typography>
          <Typography variant="h3" fontWeight={700} color="primary" sx={{ mt: 1, transitionProperty: 'background-color', transitionDuration: '100ms' }}>
            {result}
          </Typography>
        </Paper>
      )}
    </Box>
  );
}
