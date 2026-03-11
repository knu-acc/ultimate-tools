'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  IconButton,
  Tooltip,
  Grid,
  useTheme,
  alpha,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import SwapVertIcon from '@mui/icons-material/SwapVert';

type CaseType =
  | 'upper'
  | 'lower'
  | 'title'
  | 'sentence'
  | 'camel'
  | 'pascal'
  | 'snake'
  | 'kebab'
  | 'constant';

const CASE_OPTIONS: { type: CaseType; label: string; example: string }[] = [
  { type: 'upper', label: 'ВЕРХНИЙ РЕГИСТР', example: 'ПРИМЕР ТЕКСТА' },
  { type: 'lower', label: 'нижний регистр', example: 'пример текста' },
  { type: 'title', label: 'Каждое Слово С Заглавной', example: 'Пример Текста' },
  { type: 'sentence', label: 'Как в предложении', example: 'Пример текста' },
  { type: 'camel', label: 'camelCase', example: 'exampleText' },
  { type: 'pascal', label: 'PascalCase', example: 'ExampleText' },
  { type: 'snake', label: 'snake_case', example: 'example_text' },
  { type: 'kebab', label: 'kebab-case', example: 'example-text' },
  { type: 'constant', label: 'CONSTANT_CASE', example: 'EXAMPLE_TEXT' },
];

function splitWords(text: string): string[] {
  return text
    .replace(/([a-zа-яё])([A-ZА-ЯЁ])/g, '$1 $2')
    .replace(/[_\-]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function convertCase(text: string, type: CaseType): string {
  if (!text.trim()) return '';

  switch (type) {
    case 'upper':
      return text.toUpperCase();
    case 'lower':
      return text.toLowerCase();
    case 'title':
      return text
        .toLowerCase()
        .replace(/(^|\s)\S/g, (c) => c.toUpperCase());
    case 'sentence':
      return text
        .toLowerCase()
        .replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase());
    case 'camel': {
      const words = splitWords(text);
      return words
        .map((w, i) =>
          i === 0
            ? w.toLowerCase()
            : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
        )
        .join('');
    }
    case 'pascal': {
      const words = splitWords(text);
      return words
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join('');
    }
    case 'snake':
      return splitWords(text)
        .map((w) => w.toLowerCase())
        .join('_');
    case 'kebab':
      return splitWords(text)
        .map((w) => w.toLowerCase())
        .join('-');
    case 'constant':
      return splitWords(text)
        .map((w) => w.toUpperCase())
        .join('_');
    default:
      return text;
  }
}

export default function CaseConverter() {
  const theme = useTheme();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [activeCase, setActiveCase] = useState<CaseType | null>(null);
  const [copied, setCopied] = useState(false);

  const handleConvert = (type: CaseType) => {
    const result = convertCase(input, type);
    setOutput(result);
    setActiveCase(type);
    setCopied(false);
  };

  const copyToClipboard = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const useAsInput = () => {
    if (output) {
      setInput(output);
      setOutput('');
      setActiveCase(null);
    }
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
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: 'text.secondary' }}>
          Исходный текст
        </Typography>
        <TextField
          multiline
          rows={4}
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Введите текст для конвертации..."
          sx={{ mb: 3 }}
        />

        {/* Conversion buttons */}
        <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 500, color: 'text.secondary' }}>
          Выберите формат
        </Typography>
        <Grid container spacing={1} sx={{ mb: 3 }}>
          {CASE_OPTIONS.map((opt) => (
            <Grid size={{ xs: 6, sm: 4, md: 3 }} key={opt.type}>
              <Button
                variant={activeCase === opt.type ? 'contained' : 'outlined'}
                fullWidth
                onClick={() => handleConvert(opt.type)}
                disabled={!input.trim()}
                sx={{
                  textTransform: 'none',
                  flexDirection: 'column',
                  py: 1.5,
                  borderRadius: 2,
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                  {opt.label}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ opacity: 0.7, fontFamily: 'monospace', fontSize: '0.7rem' }}
                >
                  {opt.example}
                </Typography>
              </Button>
            </Grid>
          ))}
        </Grid>

        {/* Output */}
        {output && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                Результат
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Tooltip title="Использовать как входной текст">
                  <IconButton onClick={useAsInput} size="small">
                    <SwapVertIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title={copied ? 'Скопировано!' : 'Копировать'}>
                  <IconButton onClick={copyToClipboard} size="small" color={copied ? 'success' : 'default'}>
                    {copied ? <CheckIcon /> : <ContentCopyIcon />}
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            <TextField
              multiline
              rows={4}
              fullWidth
              value={output}
              slotProps={{ input: { readOnly: true } }}
              sx={{
                '& .MuiInputBase-root': { fontFamily: 'monospace', background: theme.palette.background.default },
              }}
            />
          </Box>
        )}
      </Paper>
    </Box>
  );
}
