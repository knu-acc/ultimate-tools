'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  IconButton,
  Chip,
  Tooltip,
  useTheme,
  alpha
} from '@mui/material';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { CopyButton } from '@/src/components/CopyButton';
import { useLanguage } from '@/src/i18n/LanguageContext';


function looksEncoded(str: string): boolean {
  return /%[0-9A-Fa-f]{2}/.test(str) || /\+/.test(str);
}

function tryDecode(str: string): { success: boolean; result: string } {
  try {
    const decoded = decodeURIComponent(str);
    return { success: decoded !== str, result: decoded };
  } catch {
    return { success: false, result: '' };
  }
}

export default function UrlEncoder() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode' | null>(null);
  const [error, setError] = useState('');
  const [suggestion, setSuggestion] = useState<'decode' | null>(null);

  // Comparison state
  const [showComparison, setShowComparison] = useState(false);
  const [encodeURIResult, setEncodeURIResult] = useState('');
  const [encodeURIComponentResult, setEncodeURIComponentResult] = useState('');

  // Auto-detect
  useEffect(() => {
    if (input && looksEncoded(input)) {
      const decoded = tryDecode(input);
      setSuggestion(decoded.success ? 'decode' : null);
    } else {
      setSuggestion(null);
    }
  }, [input]);

  const handleEncode = useCallback(() => {
    if (!input.trim()) return;
    try {
      const encoded = encodeURIComponent(input);
      setOutput(encoded);
      setMode('encode');
      setError('');
      setEncodeURIResult(encodeURI(input));
      setEncodeURIComponentResult(encoded);
      setShowComparison(true);
    } catch (e) {
      setError(isEn ? `Encoding error: ${(e as Error).message}` : `Ошибка кодирования: ${(e as Error).message}`);
      setOutput('');
      setShowComparison(false);
    }
  }, [input]);

  const handleDecode = useCallback(() => {
    if (!input.trim()) return;
    try {
      const decoded = decodeURIComponent(input.replace(/\+/g, ' '));
      setOutput(decoded);
      setMode('decode');
      setError('');
      setShowComparison(false);
    } catch (e) {
      setError(isEn ? `Decoding error: invalid URL string. ${(e as Error).message}` : `Ошибка декодирования: некорректная URL-строка. ${(e as Error).message}`);
      setOutput('');
      setShowComparison(false);
    }
  }, [input]);

  const swapInputOutput = useCallback(() => {
    if (!output) return;
    setInput(output);
    setOutput('');
    setMode(null);
    setError('');
    setShowComparison(false);
  }, [output]);

  const clear = () => {
    setInput('');
    setOutput('');
    setMode(null);
    setError('');
    setShowComparison(false);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 2,
          borderRadius: 18,
          background: theme.palette.surfaceContainerLow,
          transitionProperty: 'background-color', transitionDuration: '200ms', transitionTimingFunction: 'ease',
          '&:hover': { background: alpha(theme.palette.primary.main, 0.04) }
        }}
      >
        {/* Input */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 1 }}>
          {suggestion === 'decode' && (
            <Chip
              label={isEn ? 'Encoded string detected' : 'Обнаружена закодированная строка'}
              size="small"
              color="info"
              variant="outlined"
              onClick={handleDecode}
              sx={{ cursor: 'pointer' }}
            />
          )}
        </Box>
        <TextField
          multiline
          rows={5}
          fullWidth
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setOutput('');
            setMode(null);
            setError('');
            setShowComparison(false);
          }}
          placeholder={isEn ? 'Text or URL...' : 'Текст или URL...'}
          sx={{
            mb: 2,
            '& .MuiInputBase-root': { fontFamily: 'monospace', fontSize: '0.875rem' }
          }}
        />

        {/* Action buttons */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center', mb: 2 }}>
          <Button variant="contained" onClick={handleEncode} disabled={!input.trim()}>
            {isEn ? 'Encode' : 'Кодировать'}
          </Button>
          <Button variant="contained" onClick={handleDecode} disabled={!input.trim()}>
            {isEn ? 'Decode' : 'Декодировать'}
          </Button>
          <Tooltip title={isEn ? 'Swap input and output' : 'Поменять местами ввод и вывод'}>
            <span>
              <IconButton onClick={swapInputOutput} disabled={!output} color="primary">
                <SwapVertIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Button variant="outlined" onClick={clear} color="inherit">
            {isEn ? 'Clear' : 'Очистить'}
          </Button>
        </Box>

        {/* Error */}
        {error && (
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 2,
              borderRadius: 18,
              background: alpha(theme.palette.error.main, 0.08)
            }}
          >
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          </Paper>
        )}

        {/* Output */}
        {output && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 1 }}>
              <CopyButton text={output} />
            </Box>
            <TextField
              multiline
              rows={5}
              fullWidth
              value={output}
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

        {/* encodeURI vs encodeURIComponent comparison */}
        {showComparison && (
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 18,
              background: alpha(theme.palette.text.primary, 0.03)
            }}
          >
            <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
              {isEn ? 'Comparison: encodeURI vs encodeURIComponent' : 'Сравнение: encodeURI и encodeURIComponent'}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
              {isEn ? 'encodeURI does not encode URL special characters (: / ? # etc.), while encodeURIComponent encodes everything except letters, digits, and - _ . ~' : 'encodeURI не кодирует спецсимволы URL (: / ? # и др.), а encodeURIComponent кодирует всё, кроме букв, цифр и - _ . ~'}
            </Typography>

            {/* encodeURI */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Chip label="encodeURI" size="small" color="secondary" variant="outlined" />
                <CopyButton text={encodeURIResult} />
              </Box>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  wordBreak: 'break-all',
                  p: 1.5,
                  borderRadius: 10,
                  background: alpha(theme.palette.secondary.main, 0.06)
                }}
              >
                {encodeURIResult}
              </Typography>
            </Box>

            {/* encodeURIComponent */}
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Chip label="encodeURIComponent" size="small" color="primary" variant="outlined" />
                <CopyButton text={encodeURIComponentResult} />
              </Box>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  wordBreak: 'break-all',
                  p: 1.5,
                  borderRadius: 10,
                  background: theme.palette.surfaceContainerLow
                }}
              >
                {encodeURIComponentResult}
              </Typography>
            </Box>

            {/* Highlight difference if any */}
            {encodeURIResult !== encodeURIComponentResult && (
              <Paper
                elevation={0}
                sx={{
                  mt: 2,
                  p: 1.5,
                  borderRadius: 18,
                  background: alpha(theme.palette.warning.main, 0.08)
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {isEn ? 'Results differ. encodeURIComponent is safer for encoding individual parameters, while encodeURI is suitable for complete URLs.' : 'Результаты отличаются. encodeURIComponent безопаснее для кодирования отдельных параметров, а encodeURI подходит для полных URL-адресов.'}
                </Typography>
              </Paper>
            )}
          </Paper>
        )}
      </Paper>
    </Box>
  );
}
