'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  useTheme,
  alpha
} from '@mui/material';
import { CopyButton } from '@/src/components/CopyButton';
import { useLanguage } from '@/src/i18n/LanguageContext';


type IndentType = '2' | '4' | 'tab';

function getIndentStr(type: IndentType): string {
  if (type === 'tab') return '\t';
  return ' '.repeat(Number(type));
}

function beautifyJs(code: string, indentType: IndentType): string {
  if (!code.trim()) return '';

  const indent = getIndentStr(indentType);
  let result = '';
  let level = 0;
  let inString: string | null = null;
  let escaped = false;
  let inSingleLineComment = false;
  let inMultiLineComment = false;
  let i = 0;

  // Normalize whitespace first: collapse multiple spaces/newlines into single space
  const normalized = code.replace(/\r\n/g, '\n');

  const addNewline = () => {
    result = result.replace(/[ \t]+$/, '');
    result += '\n' + indent.repeat(level);
  };

  while (i < normalized.length) {
    const ch = normalized[i];
    const next = normalized[i + 1] || '';

    // Handle escape in strings
    if (escaped) {
      result += ch;
      escaped = false;
      i++;
      continue;
    }

    // Handle single-line comment
    if (inSingleLineComment) {
      result += ch;
      if (ch === '\n') {
        inSingleLineComment = false;
        result += indent.repeat(level);
      }
      i++;
      continue;
    }

    // Handle multi-line comment
    if (inMultiLineComment) {
      result += ch;
      if (ch === '*' && next === '/') {
        result += '/';
        inMultiLineComment = false;
        i += 2;
        continue;
      }
      i++;
      continue;
    }

    // Handle strings
    if (inString) {
      result += ch;
      if (ch === '\\') {
        escaped = true;
      } else if (ch === inString) {
        inString = null;
      }
      i++;
      continue;
    }

    // Detect string start
    if (ch === '"' || ch === "'" || ch === '`') {
      result += ch;
      inString = ch;
      i++;
      continue;
    }

    // Detect comments
    if (ch === '/' && next === '/') {
      result += '//';
      inSingleLineComment = true;
      i += 2;
      continue;
    }
    if (ch === '/' && next === '*') {
      result += '/*';
      inMultiLineComment = true;
      i += 2;
      continue;
    }

    // Opening braces
    if (ch === '{' || ch === '[' || ch === '(') {
      result += ' ' + ch;
      level++;
      addNewline();
      i++;
      continue;
    }

    // Closing braces
    if (ch === '}' || ch === ']' || ch === ')') {
      level = Math.max(0, level - 1);
      addNewline();
      result += ch;
      i++;
      continue;
    }

    // Semicolons - add newline after
    if (ch === ';') {
      result += ';';
      // Don't newline if inside a for() header
      addNewline();
      i++;
      continue;
    }

    // Commas - add newline after for readability
    if (ch === ',') {
      result += ',';
      addNewline();
      i++;
      continue;
    }

    // Skip extra whitespace
    if (ch === ' ' || ch === '\t' || ch === '\n') {
      // Collapse whitespace into a single space
      if (result.length > 0 && !/\s$/.test(result)) {
        result += ' ';
      }
      i++;
      continue;
    }

    result += ch;
    i++;
  }

  // Clean up multiple blank lines
  result = result.replace(/\n{3}/g, '\n\n');
  // Remove trailing whitespace on each line
  result = result.replace(/[ \t]+\n/g, '\n');
  return result.trim();
}

function minifyJs(code: string): string {
  if (!code.trim()) return '';
  let result = '';
  let inString: string | null = null;
  let escaped = false;
  let inSingleLineComment = false;
  let inMultiLineComment = false;
  let lastNonSpace = '';

  for (let i = 0; i < code.length; i++) {
    const ch = code[i];
    const next = code[i + 1] || '';

    if (escaped) {
      result += ch;
      escaped = false;
      continue;
    }

    if (inSingleLineComment) {
      if (ch === '\n') {
        inSingleLineComment = false;
        // Add newline to preserve statement separation
        if (result.length > 0 && !/[;\{\}\n]$/.test(result.trim())) {
          result += '\n';
        }
      }
      continue;
    }

    if (inMultiLineComment) {
      if (ch === '*' && next === '/') {
        inMultiLineComment = false;
        i++;
      }
      continue;
    }

    if (inString) {
      result += ch;
      if (ch === '\\') escaped = true;
      else if (ch === inString) inString = null;
      continue;
    }

    if (ch === '"' || ch === "'" || ch === '`') {
      result += ch;
      inString = ch;
      continue;
    }

    if (ch === '/' && next === '/') {
      inSingleLineComment = true;
      i++;
      continue;
    }
    if (ch === '/' && next === '*') {
      inMultiLineComment = true;
      i++;
      continue;
    }

    if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r') {
      // Keep a single space if needed between identifiers/keywords
      if (result.length > 0 && /[a-zA-Z0-9_$]/.test(lastNonSpace) && i + 1 < code.length) {
        // Look ahead to next non-space character
        let j = i + 1;
        while (j < code.length && (code[j] === ' ' || code[j] === '\t' || code[j] === '\n' || code[j] === '\r')) j++;
        if (j < code.length && /[a-zA-Z0-9_$]/.test(code[j])) {
          result += ' ';
        }
      }
      continue;
    }

    result += ch;
    lastNonSpace = ch;
  }

  return result.trim();
}

function getByteSize(str: string): number {
  return new TextEncoder().encode(str).length;
}

export default function JsBeautifier() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indentType, setIndentType] = useState<IndentType>('2');
  const [lastAction, setLastAction] = useState<string>('');

  const handleBeautify = () => {
    const result = beautifyJs(input, indentType);
    setOutput(result);
    setLastAction('beautify');
  };

  const handleMinify = () => {
    const result = minifyJs(input);
    setOutput(result);
    setLastAction('minify');
  };

  const stats = useMemo(() => {
    if (!output || !input.trim()) return null;
    const originalSize = getByteSize(input);
    const resultSize = getByteSize(output);
    const lines = output.split('\n').length;
    const savings = originalSize > 0
      ? ((1 - resultSize / originalSize) * 100).toFixed(1)
      : '0';
    return { originalSize, resultSize, lines, savings };
  }, [input, output]);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 18,
          background: theme.palette.surfaceContainerLow
        }}
      >
        {/* Indent options */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
            {isEn ? 'Indent:' : 'Отступ:'}
          </Typography>
          <ToggleButtonGroup
            value={indentType}
            exclusive
            onChange={(_, val) => val && setIndentType(val as IndentType)}
            size="small"
          >
            <ToggleButton value="2" sx={{ textTransform: 'none', px: 2 }}>
              {isEn ? '2 spaces' : '2 пробела'}
            </ToggleButton>
            <ToggleButton value="4" sx={{ textTransform: 'none', px: 2 }}>
              {isEn ? '4 spaces' : '4 пробела'}
            </ToggleButton>
            <ToggleButton value="tab" sx={{ textTransform: 'none', px: 2 }}>
              {isEn ? 'Tab' : 'Табуляция'}
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <TextField
          multiline
          rows={12}
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isEn ? 'Paste JS/TS code here...' : 'Вставьте JS/TS код сюда...'}
          sx={{
            mb: 2.5,
            '& .MuiInputBase-root': {
              fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
              fontSize: '0.85rem',
              lineHeight: 1.6
            },
            '& .MuiOutlinedInput-root': {
              borderRadius: 10
            }
          }}
        />

        {/* Action buttons */}
        <Box sx={{ display: 'flex', gap: 1.5, mb: 2.5, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            onClick={handleBeautify}
            disabled={!input.trim()}
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 10, px: 3 }}
          >
            {isEn ? 'Beautify' : 'Форматировать'}
          </Button>
          <Button
            variant="contained"
            onClick={handleMinify}
            disabled={!input.trim()}
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 10, px: 3 }}
          >
            {isEn ? 'Minify' : 'Минифицировать'}
          </Button>
        </Box>

        {/* Stats */}
        {stats && (
          <Box sx={{ display: 'flex', gap: 1, mb: 2.5, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Chip
              size="small"
              label={isEn ? `${stats.lines} lines` : `${stats.lines} строк`}
              variant="outlined"
              sx={{ fontSize: '0.75rem' }}
            />
            <Chip
              size="small"
              label={isEn ? `Original: ${stats.originalSize.toLocaleString()} bytes` : `Исходный: ${stats.originalSize.toLocaleString()} байт`}
              variant="outlined"
              sx={{ fontSize: '0.75rem' }}
            />
            <Chip
              size="small"
              label={isEn ? `Result: ${stats.resultSize.toLocaleString()} bytes` : `Результат: ${stats.resultSize.toLocaleString()} байт`}
              variant="outlined"
              sx={{ fontSize: '0.75rem' }}
            />
            {lastAction === 'minify' && parseFloat(stats.savings) > 0 && (
              <Chip
                size="small"
                label={isEn ? `Savings: ${stats.savings}%` : `Экономия: ${stats.savings}%`}
                variant="outlined"
                color="success"
                sx={{ fontSize: '0.75rem' }}
              />
            )}
          </Box>
        )}

        {/* Output */}
        {output && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
              <CopyButton text={output} />
            </Box>
            <TextField
              multiline
              rows={12}
              fullWidth
              value={output}
              slotProps={{ input: { readOnly: true } }}
              sx={{
                '& .MuiInputBase-root': {
                  fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
                  fontSize: '0.85rem',
                  lineHeight: 1.6,
                  background: theme.palette.mode === 'dark'
                    ? alpha(theme.palette.common.black, 0.3)
                    : alpha(theme.palette.grey[50], 1)
                },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 10
                }
              }}
            />
          </Box>
        )}
      </Paper>
    </Box>
  );
}
