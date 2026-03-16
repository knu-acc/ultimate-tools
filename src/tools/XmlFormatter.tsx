'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Alert,
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FormatIndentIncreaseIcon from '@mui/icons-material/FormatIndentIncrease';
import CompressIcon from '@mui/icons-material/Compress';
import { CopyButton } from '@/src/components/CopyButton';
import { useLanguage } from '@/src/i18n/LanguageContext';


function formatXml(xml: string, indentStr: string): string {
  // Remove existing whitespace between tags
  let formatted = '';
  let inTag = false;
  let inCdata = false;
  let inComment = false;
  let depth = 0;
  let i = 0;

  // Normalize: remove whitespace between tags
  const cleaned = xml.replace(/>\s+</g, '><').trim();

  const getIndent = (level: number) => indentStr.repeat(level);

  while (i < cleaned.length) {
    // Check for CDATA
    if (cleaned.substring(i, i + 9) === '<![CDATA[') {
      const cdataEnd = cleaned.indexOf(']]>', i);
      if (cdataEnd === -1) {
        formatted += cleaned.substring(i);
        break;
      }
      formatted += '\n' + getIndent(depth) + cleaned.substring(i, cdataEnd + 3);
      i = cdataEnd + 3;
      continue;
    }

    // Check for comment
    if (cleaned.substring(i, i + 4) === '<!--') {
      const commentEnd = cleaned.indexOf('-->', i);
      if (commentEnd === -1) {
        formatted += cleaned.substring(i);
        break;
      }
      formatted += '\n' + getIndent(depth) + cleaned.substring(i, commentEnd + 3);
      i = commentEnd + 3;
      continue;
    }

    // Check for processing instruction <?...?>
    if (cleaned.substring(i, i + 2) === '<?') {
      const piEnd = cleaned.indexOf('?>', i);
      if (piEnd === -1) {
        formatted += cleaned.substring(i);
        break;
      }
      formatted += '\n' + getIndent(depth) + cleaned.substring(i, piEnd + 2);
      i = piEnd + 2;
      continue;
    }

    // Closing tag
    if (cleaned.substring(i, i + 2) === '</') {
      const tagEnd = cleaned.indexOf('>', i);
      if (tagEnd === -1) {
        formatted += cleaned.substring(i);
        break;
      }
      depth = Math.max(0, depth - 1);
      formatted += '\n' + getIndent(depth) + cleaned.substring(i, tagEnd + 1);
      i = tagEnd + 1;
      continue;
    }

    // Opening tag
    if (cleaned[i] === '<') {
      const tagEnd = cleaned.indexOf('>', i);
      if (tagEnd === -1) {
        formatted += cleaned.substring(i);
        break;
      }
      const tag = cleaned.substring(i, tagEnd + 1);
      const isSelfClosing = tag.endsWith('/>');

      // Check if this tag has inline text content (no child tags)
      const hasInlineText = !isSelfClosing && tagEnd + 1 < cleaned.length && cleaned[tagEnd + 1] !== '<';

      if (hasInlineText) {
        const nextTagStart = cleaned.indexOf('<', tagEnd + 1);
        if (nextTagStart !== -1 && cleaned.substring(nextTagStart, nextTagStart + 2) === '</') {
          const closingEnd = cleaned.indexOf('>', nextTagStart);
          if (closingEnd !== -1) {
            const textContent = cleaned.substring(tagEnd + 1, nextTagStart);
            const closingTag = cleaned.substring(nextTagStart, closingEnd + 1);
            formatted += '\n' + getIndent(depth) + tag + textContent + closingTag;
            i = closingEnd + 1;
            continue;
          }
        }
      }

      formatted += '\n' + getIndent(depth) + tag;
      if (!isSelfClosing) {
        depth++;
      }
      i = tagEnd + 1;
      continue;
    }

    // Text content
    const nextTag = cleaned.indexOf('<', i);
    if (nextTag === -1) {
      const text = cleaned.substring(i).trim();
      if (text) {
        formatted += '\n' + getIndent(depth) + text;
      }
      break;
    } else {
      const text = cleaned.substring(i, nextTag).trim();
      if (text) {
        formatted += '\n' + getIndent(depth) + text;
      }
      i = nextTag;
    }
  }

  return formatted.trim();
}

function minifyXml(xml: string): string {
  return xml
    .replace(/>\s+</g, '><')
    .replace(/\s+/g, ' ')
    .replace(/>\s+/g, '>')
    .replace(/\s+</g, '<')
    .trim();
}

function validateXml(xml: string, isEn: boolean): { valid: boolean; error?: string; line?: number } {
  const trimmed = xml.trim();
  if (!trimmed) return { valid: false, error: isEn ? 'XML is empty' : 'XML пуст' };

  // Simple validation: check for matching tags
  const tagStack: string[] = [];
  const tagRegex = /<\/?([a-zA-Z_][\w.-]*)[^>]*\/?>/g;
  let match;

  while ((match = tagRegex.exec(trimmed)) !== null) {
    const fullMatch = match[0];
    const tagName = match[1];

    if (fullMatch.startsWith('<?') || fullMatch.startsWith('<!')) continue;
    if (fullMatch.endsWith('/>')) continue;

    if (fullMatch.startsWith('</')) {
      if (tagStack.length === 0) {
        const line = trimmed.substring(0, match.index).split('\n').length;
        return { valid: false, error: isEn ? `Unexpected closing tag </${tagName}>` : `Неожиданный закрывающий тег </${tagName}>`, line };
      }
      const expected = tagStack.pop();
      if (expected !== tagName) {
        const line = trimmed.substring(0, match.index).split('\n').length;
        return { valid: false, error: isEn ? `Expected </${expected}>, got </${tagName}>` : `Ожидался </${expected}>, получен </${tagName}>`, line };
      }
    } else {
      tagStack.push(tagName);
    }
  }

  if (tagStack.length > 0) {
    return { valid: false, error: isEn ? `Unclosed tag: <${tagStack[tagStack.length - 1]}>` : `Незакрытый тег: <${tagStack[tagStack.length - 1]}>` };
  }

  return { valid: true };
}

type IndentOption = '2' | '4' | 'tab';

export default function XmlFormatter() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indentOption, setIndentOption] = useState<IndentOption>('2');
  const [error, setError] = useState<string | null>(null);
  const [errorLine, setErrorLine] = useState<number | undefined>();

  const getIndentStr = (): string => {
    switch (indentOption) {
      case '2': return '  ';
      case '4': return '    ';
      case 'tab': return '\t';
      default: return '  ';
    }
  };

  const handleFormat = () => {
    if (!input.trim()) return;
    const validation = validateXml(input, isEn);
    if (!validation.valid) {
      setError(validation.error || (isEn ? 'XML error' : 'Ошибка XML'));
      setErrorLine(validation.line);
      setOutput('');
      return;
    }
    try {
      const formatted = formatXml(input, getIndentStr());
      setOutput(formatted);
      setError(null);
      setErrorLine(undefined);
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  };

  const handleMinify = () => {
    if (!input.trim()) return;
    try {
      const minified = minifyXml(input);
      setOutput(minified);
      setError(null);
      setErrorLine(undefined);
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  };

  const clear = () => {
    setInput('');
    setOutput('');
    setError(null);
    setErrorLine(undefined);
  };

  const stats = useMemo(() => {
    if (!output) return null;
    const inputBytes = new TextEncoder().encode(input).length;
    const outputBytes = new TextEncoder().encode(output).length;
    const outputLines = output.split('\n').length;
    const tagCount = (output.match(/<[a-zA-Z]/g) || []).length;
    return { inputBytes, outputBytes, outputLines, tagCount };
  }, [input, output]);

  const indentOptions: { value: IndentOption; label: string }[] = [
    { value: '2', label: isEn ? '2 spaces' : '2 пробела' },
    { value: '4', label: isEn ? '4 spaces' : '4 пробела' },
    { value: 'tab', label: isEn ? 'Tab' : 'Табуляция' },
  ];

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
          background: theme.palette.surfaceContainerLow
        }}
      >
        <TextField
          multiline
          rows={10}
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isEn ? '<root><item id="1"><name>Example</name></item></root>' : '<root><item id="1"><name>Пример</name></item></root>'}
          sx={{
            mb: 2,
            '& .MuiInputBase-root': {
              fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
              fontSize: '0.85rem',
              lineHeight: 1.6
            },
            '& .MuiOutlinedInput-root': { borderRadius: 2 }
          }}
        />

        {/* Indent options */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary', mr: 1 }}>
            {isEn ? 'Indent:' : 'Отступ:'}
          </Typography>
          {indentOptions.map((opt) => (
            <Chip
              key={opt.value}
              label={opt.label}
              size="small"
              onClick={() => setIndentOption(opt.value)}
              color={indentOption === opt.value ? 'primary' : 'default'}
              variant={indentOption === opt.value ? 'filled' : 'outlined'}
              sx={{ fontSize: '0.8rem' }}
            />
          ))}
        </Box>

        {/* Buttons */}
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: 'center', mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<FormatIndentIncreaseIcon />}
            onClick={handleFormat}
            disabled={!input}
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
          >
            {isEn ? 'Format' : 'Форматировать'}
          </Button>
          <Button
            variant="contained"
            startIcon={<CompressIcon />}
            onClick={handleMinify}
            disabled={!input}
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
          >
            {isEn ? 'Minify' : 'Минифицировать'}
          </Button>
          <CopyButton text={output} tooltip={isEn ? 'Copy' : 'Копировать'} />
          <Button
            variant="outlined"
            startIcon={<DeleteOutlineIcon />}
            onClick={clear}
            color="inherit"
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            {isEn ? 'Clear' : 'Очистить'}
          </Button>
        </Box>

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {error}
            </Typography>
            {errorLine && (
              <Typography variant="caption" sx={{ color: 'error.dark' }}>
                {isEn ? 'Line' : 'Строка'}: {errorLine}
              </Typography>
            )}
          </Alert>
        )}

        {/* Output */}
        {output && (
          <Box>
            <TextField
              multiline
              rows={12}
              fullWidth
              value={output}
              slotProps={{
                input: {
                  readOnly: true
                }
              }}
              sx={{
                '& .MuiInputBase-root': {
                  fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
                  fontSize: '0.85rem',
                  lineHeight: 1.6
                },
                '& .MuiOutlinedInput-root': { borderRadius: 2 }
              }}
            />

            {/* Stats */}
            {stats && (
              <Box sx={{ display: 'flex', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
                <Chip
                  size="small"
                  label={`${stats.outputLines} ${isEn ? 'lines' : 'строк'}`}
                  variant="outlined"
                  sx={{ fontSize: '0.75rem' }}
                />
                <Chip
                  size="small"
                  label={`${stats.outputBytes.toLocaleString()} ${isEn ? 'bytes' : 'байт'}`}
                  variant="outlined"
                  sx={{ fontSize: '0.75rem' }}
                />
                <Chip
                  size="small"
                  label={`${stats.tagCount} ${isEn ? 'tags' : 'тегов'}`}
                  variant="outlined"
                  sx={{ fontSize: '0.75rem' }}
                />
                {stats.inputBytes !== stats.outputBytes && (
                  <Chip
                    size="small"
                    label={`${stats.inputBytes > stats.outputBytes ? '-' : '+'}${Math.abs(stats.outputBytes - stats.inputBytes)} ${isEn ? 'bytes' : 'байт'}`}
                    variant="outlined"
                    color={stats.inputBytes > stats.outputBytes ? 'success' : 'default'}
                    sx={{ fontSize: '0.75rem' }}
                  />
                )}
              </Box>
            )}
          </Box>
        )}
      </Paper>

    </Box>
  );
}
