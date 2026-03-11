'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Grid,
  Chip,
  IconButton,
  useTheme,
  alpha
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { CopyButton, ShareButton } from '@/src/components/CopyButton';


function minifyCss(css: string): string {
  if (!css.trim()) return '';
  let result = css;
  // Remove comments
  result = result.replace(/\/\*[\s\S]*?\*\//g, '');
  // Remove newlines and extra whitespace
  result = result.replace(/\s+/g, ' ');
  // Remove spaces around special characters
  result = result.replace(/\s*([{}:;,>~+])\s*/g, '$1');
  // Remove trailing semicolons before closing braces
  result = result.replace(/;}/g, '}');
  // Remove leading/trailing whitespace
  result = result.trim();
  return result;
}

function beautifyCss(css: string): string {
  if (!css.trim()) return '';
  // First minify to normalize
  let result = minifyCss(css);
  if (!result) return '';

  let output = '';
  let indent = 0;
  const indentStr = '  ';

  for (let i = 0; i < result.length; i++) {
    const ch = result[i];

    if (ch === '{') {
      output += ' {\n';
      indent++;
      output += indentStr.repeat(indent);
    } else if (ch === '}') {
      // Remove trailing whitespace on current line
      output = output.replace(/\s+$/, '');
      output += '\n';
      indent = Math.max(0, indent - 1);
      output += indentStr.repeat(indent) + '}\n';
      // Add extra newline between rule blocks at top level
      if (indent === 0 && i < result.length - 1) {
        output += '\n';
      }
      if (indent > 0) {
        output += indentStr.repeat(indent);
      }
    } else if (ch === ';') {
      output += ';\n';
      if (i < result.length - 1 && result[i + 1] !== '}') {
        output += indentStr.repeat(indent);
      }
    } else if (ch === ',' && indent === 0) {
      output += ',\n';
    } else {
      // Add space after colon in property declarations
      if (ch === ':' && indent > 0) {
        output += ': ';
        // Skip any existing space after colon
        while (i + 1 < result.length && result[i + 1] === ' ') i++;
      } else {
        output += ch;
      }
    }
  }

  return output.replace(/\n{3}/g, '\n\n').trim();
}

function getByteSize(str: string): number {
  return new TextEncoder().encode(str).length;
}

export default function CssMinifier() {
  const theme = useTheme();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [lastAction, setLastAction] = useState<string>('');

  const handleMinify = () => {
    const result = minifyCss(input);
    setOutput(result);
    setLastAction('minify');
    setCopied(false);
  };

  const handleBeautify = () => {
    const result = beautifyCss(input);
    setOutput(result);
    setLastAction('beautify');
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

  const stats = useMemo(() => {
    if (!output || !input.trim()) return null;
    const originalSize = getByteSize(input);
    const resultSize = getByteSize(output);
    const savings = originalSize > 0
      ? ((1 - resultSize / originalSize) * 100).toFixed(1)
      : '0';
    return { originalSize, resultSize, savings };
  }, [input, output]);

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
          Исходный CSS
        </Typography>
        <TextField
          multiline
          rows={10}
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Вставьте CSS код сюда..."
          sx={{
            mb: 2.5,
            '& .MuiInputBase-root': {
              fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
              fontSize: '0.85rem',
              lineHeight: 1.6
            },
            '& .MuiOutlinedInput-root': {
              borderRadius: 2
            }
          }}
        />

        {/* Action buttons */}
        <Grid container spacing={1.5} sx={{ mb: 2.5, justifyContent: 'center' }}>
          <Grid>
            <Button
              variant="contained"
              onClick={handleMinify}
              disabled={!input.trim()}
              sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, px: 3 }}
            >
              Минифицировать
            </Button>
          </Grid>
          <Grid>
            <Button
              variant="contained"
              onClick={handleBeautify}
              disabled={!input.trim()}
              sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, px: 3 }}
            >
              Форматировать
            </Button>
          </Grid>
        </Grid>

        {/* Stats */}
        {stats && (
          <Box sx={{ display: 'flex', gap: 1, mb: 2.5, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Chip
              size="small"
              label={`Исходный: ${stats.originalSize.toLocaleString()} байт`}
              variant="outlined"
              sx={{ fontSize: '0.75rem' }}
            />
            <Chip
              size="small"
              label={`Результат: ${stats.resultSize.toLocaleString()} байт`}
              variant="outlined"
              sx={{ fontSize: '0.75rem' }}
            />
            <Chip
              size="small"
              label={
                lastAction === 'minify'
                  ? `Экономия: ${stats.savings}%`
                  : `Разница: ${stats.savings}%`
              }
              variant="outlined"
              color={lastAction === 'minify' && parseFloat(stats.savings) > 0 ? 'success' : 'default'}
              sx={{ fontSize: '0.75rem' }}
            />
          </Box>
        )}

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
              rows={10}
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
