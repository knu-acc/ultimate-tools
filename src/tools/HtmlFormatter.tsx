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
  ToggleButtonGroup,
  ToggleButton,
  useTheme,
  alpha,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

type IndentType = '2' | '4' | 'tab';

function getIndentStr(type: IndentType): string {
  if (type === 'tab') return '\t';
  return ' '.repeat(Number(type));
}

// Self-closing / void HTML tags
const voidTags = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr',
]);

// Tags whose content should be preserved as-is (inline)
const preserveTags = new Set(['script', 'style', 'pre', 'code', 'textarea']);

function beautifyHtml(html: string, indentType: IndentType): string {
  if (!html.trim()) return '';

  const indent = getIndentStr(indentType);
  const result: string[] = [];
  let level = 0;

  // Tokenize: split into tags and text
  const tokens: string[] = [];
  const regex = /(<\/?[^>]+\/?>|[^<]+)/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const token = match[1];
    if (token.trim()) {
      tokens.push(token);
    }
  }

  let preserveContent = false;
  let preserveTagName = '';

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    // Check if we're inside a preserve tag
    if (preserveContent) {
      // Check for closing preserve tag
      const closeMatch = token.match(/^<\/(\w+)\s*>/);
      if (closeMatch && closeMatch[1].toLowerCase() === preserveTagName) {
        preserveContent = false;
        result.push(token.trim());
        level = Math.max(0, level - 1);
        continue;
      }
      // Preserve content as-is
      result[result.length - 1] += token;
      continue;
    }

    // Self-closing tag (explicit) like <br/> or <img ... />
    if (/^<[^/][^>]*\/>$/.test(token)) {
      result.push(indent.repeat(level) + token.trim());
      continue;
    }

    // Closing tag
    if (/^<\//.test(token)) {
      level = Math.max(0, level - 1);
      result.push(indent.repeat(level) + token.trim());
      continue;
    }

    // Opening tag
    if (/^<[a-zA-Z]/.test(token)) {
      const tagNameMatch = token.match(/^<(\w+)/);
      const tagName = tagNameMatch ? tagNameMatch[1].toLowerCase() : '';

      result.push(indent.repeat(level) + token.trim());

      // Check for void/self-closing tags
      if (voidTags.has(tagName)) {
        continue;
      }

      // Check for preserve tags
      if (preserveTags.has(tagName)) {
        preserveContent = true;
        preserveTagName = tagName;
        level++;
        continue;
      }

      level++;
      continue;
    }

    // Text content
    const trimmed = token.trim();
    if (trimmed) {
      result.push(indent.repeat(level) + trimmed);
    }
  }

  return result.join('\n').trim();
}

function minifyHtml(html: string): string {
  if (!html.trim()) return '';
  let result = html;
  // Remove HTML comments (but not conditionals)
  result = result.replace(/<!--(?!\[)[\s\S]*?-->/g, '');
  // Collapse whitespace between tags
  result = result.replace(/>\s+</g, '><');
  // Collapse whitespace
  result = result.replace(/\s+/g, ' ');
  return result.trim();
}

function getByteSize(str: string): number {
  return new TextEncoder().encode(str).length;
}

export default function HtmlFormatter() {
  const theme = useTheme();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [indentType, setIndentType] = useState<IndentType>('2');
  const [lastAction, setLastAction] = useState<string>('');

  const handleBeautify = () => {
    const result = beautifyHtml(input, indentType);
    setOutput(result);
    setLastAction('beautify');
    setCopied(false);
  };

  const handleMinify = () => {
    const result = minifyHtml(input);
    setOutput(result);
    setLastAction('minify');
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
    const lines = output.split('\n').length;
    const savings = originalSize > 0
      ? ((1 - resultSize / originalSize) * 100).toFixed(1)
      : '0';
    return { originalSize, resultSize, lines, savings };
  }, [input, output]);

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 3,
          background: alpha(theme.palette.primary.main, 0.02),
        }}
      >
        {/* Indent options */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
            Отступ:
          </Typography>
          <ToggleButtonGroup
            value={indentType}
            exclusive
            onChange={(_, val) => val && setIndentType(val as IndentType)}
            size="small"
          >
            <ToggleButton value="2" sx={{ textTransform: 'none', px: 2 }}>
              2 пробела
            </ToggleButton>
            <ToggleButton value="4" sx={{ textTransform: 'none', px: 2 }}>
              4 пробела
            </ToggleButton>
            <ToggleButton value="tab" sx={{ textTransform: 'none', px: 2 }}>
              Табуляция
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Input */}
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
          Исходный HTML
        </Typography>
        <TextField
          multiline
          rows={12}
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Вставьте HTML код сюда..."
          sx={{
            mb: 2.5,
            '& .MuiInputBase-root': {
              fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
              fontSize: '0.85rem',
              lineHeight: 1.6,
            },
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            },
          }}
        />

        {/* Action buttons */}
        <Grid container spacing={1.5} sx={{ mb: 2.5, justifyContent: 'center' }}>
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
        </Grid>

        {/* Stats */}
        {stats && (
          <Box sx={{ display: 'flex', gap: 1, mb: 2.5, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Chip
              size="small"
              label={`${stats.lines} строк`}
              variant="outlined"
              sx={{ fontSize: '0.75rem' }}
            />
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
            {lastAction === 'minify' && parseFloat(stats.savings) > 0 && (
              <Chip
                size="small"
                label={`Экономия: ${stats.savings}%`}
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                Результат
              </Typography>
              <IconButton
                onClick={copyToClipboard}
                size="small"
                color={copied ? 'success' : 'default'}
                title={copied ? 'Скопировано!' : 'Копировать'}
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
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
                    : alpha(theme.palette.grey[50], 1),
                },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          </Box>
        )}
      </Paper>
    </Box>
  );
}
