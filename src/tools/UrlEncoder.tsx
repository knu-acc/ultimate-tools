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
  alpha,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import SwapVertIcon from '@mui/icons-material/SwapVert';

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
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode' | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
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
      setError(`Ошибка кодирования: ${(e as Error).message}`);
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
      setError(`Ошибка декодирования: некорректная URL-строка. ${(e as Error).message}`);
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

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clear = () => {
    setInput('');
    setOutput('');
    setMode(null);
    setError('');
    setShowComparison(false);
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
            Входной текст
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {suggestion === 'decode' && (
              <Chip
                label="Обнаружена закодированная строка"
                size="small"
                color="info"
                variant="outlined"
                onClick={handleDecode}
                sx={{ cursor: 'pointer' }}
              />
            )}
            <Chip
              label={`${input.length} символов`}
              size="small"
              variant="outlined"
              sx={{ fontVariantNumeric: 'tabular-nums' }}
            />
          </Box>
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
          placeholder="Введите текст или URL-строку..."
          sx={{
            mb: 2,
            '& .MuiInputBase-root': { fontFamily: 'monospace', fontSize: '0.875rem' },
          }}
        />

        {/* Action buttons */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center', mb: 2 }}>
          <Button variant="contained" onClick={handleEncode} disabled={!input.trim()}>
            Кодировать
          </Button>
          <Button variant="contained" onClick={handleDecode} disabled={!input.trim()}>
            Декодировать
          </Button>
          <Tooltip title="Поменять местами ввод и вывод">
            <span>
              <IconButton onClick={swapInputOutput} disabled={!output} color="primary">
                <SwapVertIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Button variant="outlined" onClick={clear} color="inherit">
            Очистить
          </Button>
        </Box>

        {/* Error */}
        {error && (
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 2,
              borderRadius: 2,
              background: alpha(theme.palette.error.main, 0.08),
              border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                  Результат
                </Typography>
                <Chip
                  label={mode === 'encode' ? 'Закодировано' : 'Декодировано'}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label={`${output.length} символов`}
                  size="small"
                  variant="outlined"
                  sx={{ fontVariantNumeric: 'tabular-nums' }}
                />
                <Tooltip title={copied ? 'Скопировано!' : 'Копировать'}>
                  <IconButton
                    onClick={() => copyToClipboard(output)}
                    size="small"
                    color={copied ? 'success' : 'default'}
                  >
                    {copied ? <CheckIcon /> : <ContentCopyIcon />}
                  </IconButton>
                </Tooltip>
              </Box>
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
                  background: theme.palette.background.default,
                },
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
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 3,
              background: theme.palette.background.default,
            }}
          >
            <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
              Сравнение: encodeURI и encodeURIComponent
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
              encodeURI не кодирует спецсимволы URL (: / ? # и др.), а encodeURIComponent кодирует всё, кроме букв, цифр и - _ . ~
            </Typography>

            {/* encodeURI */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Chip label="encodeURI" size="small" color="secondary" variant="outlined" />
                <Tooltip title="Копировать">
                  <IconButton size="small" onClick={() => copyToClipboard(encodeURIResult)}>
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  wordBreak: 'break-all',
                  p: 1.5,
                  borderRadius: 2,
                  background: alpha(theme.palette.secondary.main, 0.06),
                  border: `1px solid ${alpha(theme.palette.secondary.main, 0.15)}`,
                }}
              >
                {encodeURIResult}
              </Typography>
            </Box>

            {/* encodeURIComponent */}
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Chip label="encodeURIComponent" size="small" color="primary" variant="outlined" />
                <Tooltip title="Копировать">
                  <IconButton size="small" onClick={() => copyToClipboard(encodeURIComponentResult)}>
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  wordBreak: 'break-all',
                  p: 1.5,
                  borderRadius: 2,
                  background: alpha(theme.palette.primary.main, 0.06),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
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
                  borderRadius: 2,
                  background: alpha(theme.palette.warning.main, 0.08),
                  border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Результаты отличаются. encodeURIComponent безопаснее для кодирования отдельных параметров, а encodeURI подходит для полных URL-адресов.
                </Typography>
              </Paper>
            )}
          </Paper>
        )}
      </Paper>
    </Box>
  );
}
