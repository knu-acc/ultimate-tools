'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Alert,
  Chip,
  Grid,
  useTheme,
  alpha
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { CopyButton } from '@/src/components/CopyButton';
import { useLanguage } from '@/src/i18n/LanguageContext';


interface YamlError {
  message: string;
  line?: number;
}

function parseYaml(yaml: string): unknown {
  const lines = yaml.split('\n');
  let idx = 0;

  function skipEmpty() {
    while (idx < lines.length) {
      const trimmed = lines[idx].trim();
      if (trimmed === '' || trimmed.startsWith('#')) {
        idx++;
      } else {
        break;
      }
    }
  }

  function getIndent(line: string): number {
    const match = line.match(/^(\s*)/);
    return match ? match[1].length : 0;
  }

  function parseValue(val: string): unknown {
    const trimmed = val.trim();
    if (trimmed === '' || trimmed === '~' || trimmed === 'null') return null;
    if (trimmed === 'true') return true;
    if (trimmed === 'false') return false;
    if (/^-?\d+$/.test(trimmed)) return parseInt(trimmed, 10);
    if (/^-?\d+\.\d+$/.test(trimmed)) return parseFloat(trimmed);
    if (/^-?\d+(\.\d+)?[eE][+-]?\d+$/.test(trimmed)) return parseFloat(trimmed);
    // Handle quoted strings
    if ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
        (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
      return trimmed.slice(1, -1);
    }
    // Inline array [a, b, c]
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      const inner = trimmed.slice(1, -1);
      if (inner.trim() === '') return [];
      return inner.split(',').map(s => parseValue(s));
    }
    // Inline object {a: b, c: d}
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      const inner = trimmed.slice(1, -1);
      if (inner.trim() === '') return {};
      const obj: Record<string, unknown> = {};
      const parts = inner.split(',');
      for (const part of parts) {
        const colonIdx = part.indexOf(':');
        if (colonIdx !== -1) {
          const k = part.slice(0, colonIdx).trim();
          const v = part.slice(colonIdx + 1).trim();
          obj[k] = parseValue(v);
        }
      }
      return obj;
    }
    return trimmed;
  }

  function parseBlock(baseIndent: number): unknown {
    skipEmpty();
    if (idx >= lines.length) return null;

    const firstLine = lines[idx];
    const firstTrimmed = firstLine.trim();

    // Check if this is an array
    if (firstTrimmed.startsWith('- ') || firstTrimmed === '-') {
      const arr: unknown[] = [];
      while (idx < lines.length) {
        skipEmpty();
        if (idx >= lines.length) break;
        const line = lines[idx];
        const indent = getIndent(line);
        if (indent < baseIndent) break;
        if (indent > baseIndent) break;
        const trimmed = line.trim();
        if (!trimmed.startsWith('-')) break;

        idx++;
        const afterDash = trimmed.slice(1).trim();

        if (afterDash === '') {
          // Nested block under array item
          skipEmpty();
          if (idx < lines.length) {
            const nextIndent = getIndent(lines[idx]);
            if (nextIndent > baseIndent) {
              arr.push(parseBlock(nextIndent));
            } else {
              arr.push(null);
            }
          } else {
            arr.push(null);
          }
        } else if (afterDash.includes(': ') || afterDash.endsWith(':')) {
          // Inline key-value after dash, treat as object
          const colonIdx = afterDash.indexOf(':');
          const key = afterDash.slice(0, colonIdx).trim();
          const valStr = afterDash.slice(colonIdx + 1).trim();
          const obj: Record<string, unknown> = {};

          if (valStr === '') {
            skipEmpty();
            if (idx < lines.length) {
              const nextIndent = getIndent(lines[idx]);
              if (nextIndent > baseIndent) {
                obj[key] = parseBlock(nextIndent);
              } else {
                obj[key] = null;
              }
            } else {
              obj[key] = null;
            }
          } else {
            obj[key] = parseValue(valStr);
          }

          // Check for more keys at deeper indent
          skipEmpty();
          while (idx < lines.length) {
            const nextLine = lines[idx];
            const nextIndent = getIndent(nextLine);
            if (nextIndent <= baseIndent) break;
            const nextTrimmed = nextLine.trim();
            if (nextTrimmed.startsWith('-')) break;
            if (nextTrimmed.includes(': ') || nextTrimmed.endsWith(':')) {
              const cIdx = nextTrimmed.indexOf(':');
              const k = nextTrimmed.slice(0, cIdx).trim();
              const v = nextTrimmed.slice(cIdx + 1).trim();
              idx++;
              if (v === '') {
                skipEmpty();
                if (idx < lines.length) {
                  const ni = getIndent(lines[idx]);
                  if (ni > nextIndent) {
                    obj[k] = parseBlock(ni);
                  } else {
                    obj[k] = null;
                  }
                } else {
                  obj[k] = null;
                }
              } else {
                obj[k] = parseValue(v);
              }
            } else {
              break;
            }
          }

          arr.push(obj);
        } else {
          arr.push(parseValue(afterDash));
        }
      }
      return arr;
    }

    // Object parsing
    if (firstTrimmed.includes(': ') || firstTrimmed.endsWith(':')) {
      const obj: Record<string, unknown> = {};
      while (idx < lines.length) {
        skipEmpty();
        if (idx >= lines.length) break;
        const line = lines[idx];
        const indent = getIndent(line);
        if (indent < baseIndent) break;
        if (indent > baseIndent) break;
        const trimmed = line.trim();
        if (trimmed.startsWith('-')) break;

        const colonIdx = trimmed.indexOf(':');
        if (colonIdx === -1) break;

        const key = trimmed.slice(0, colonIdx).trim();
        const valStr = trimmed.slice(colonIdx + 1).trim();
        idx++;

        if (valStr === '') {
          skipEmpty();
          if (idx < lines.length) {
            const nextIndent = getIndent(lines[idx]);
            if (nextIndent > baseIndent) {
              obj[key] = parseBlock(nextIndent);
            } else {
              obj[key] = null;
            }
          } else {
            obj[key] = null;
          }
        } else {
          obj[key] = parseValue(valStr);
        }
      }
      return obj;
    }

    // Scalar
    idx++;
    return parseValue(firstTrimmed);
  }

  skipEmpty();
  if (idx >= lines.length) return null;

  // Handle document start marker
  if (lines[idx]?.trim() === '---') {
    idx++;
    skipEmpty();
  }

  const indent = getIndent(lines[idx] || '');
  return parseBlock(indent);
}

function toYaml(value: unknown, indent: number = 0): string {
  const prefix = '  '.repeat(indent);

  if (value === null || value === undefined) return prefix + 'null\n';
  if (typeof value === 'boolean') return prefix + (value ? 'true' : 'false') + '\n';
  if (typeof value === 'number') return prefix + String(value) + '\n';
  if (typeof value === 'string') {
    if (value.includes('\n') || value.includes(':') || value.includes('#') ||
        value.startsWith(' ') || value.endsWith(' ') ||
        value === 'true' || value === 'false' || value === 'null' ||
        /^-?\d+(\.\d+)?$/.test(value)) {
      return prefix + JSON.stringify(value) + '\n';
    }
    return prefix + value + '\n';
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return prefix + '[]\n';
    let result = '';
    for (const item of value) {
      if (item !== null && typeof item === 'object' && !Array.isArray(item)) {
        const entries = Object.entries(item as Record<string, unknown>);
        if (entries.length > 0) {
          const [firstKey, firstVal] = entries[0];
          if (firstVal !== null && typeof firstVal === 'object') {
            result += prefix + '- ' + firstKey + ':\n';
            result += toYaml(firstVal, indent + 2).trimStart() ? toYaml(firstVal, indent + 2) : '';
          } else {
            const scalarStr = toYaml(firstVal, 0).trim();
            result += prefix + '- ' + firstKey + ': ' + scalarStr + '\n';
          }
          for (let i = 1; i < entries.length; i++) {
            const [k, v] = entries[i];
            if (v !== null && typeof v === 'object') {
              result += prefix + '  ' + k + ':\n';
              result += toYaml(v, indent + 2);
            } else {
              const sv = toYaml(v, 0).trim();
              result += prefix + '  ' + k + ': ' + sv + '\n';
            }
          }
          continue;
        }
      }
      if (item !== null && typeof item === 'object') {
        result += prefix + '-\n';
        result += toYaml(item, indent + 1);
      } else {
        const sv = toYaml(item, 0).trim();
        result += prefix + '- ' + sv + '\n';
      }
    }
    return result;
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return prefix + '{}\n';
    let result = '';
    for (const [key, val] of entries) {
      if (val !== null && typeof val === 'object') {
        result += prefix + key + ':\n';
        result += toYaml(val, indent + 1);
      } else {
        const sv = toYaml(val, 0).trim();
        result += prefix + key + ': ' + sv + '\n';
      }
    }
    return result;
  }

  return prefix + String(value) + '\n';
}

export default function YamlJson() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const [yaml, setYaml] = useState('');
  const [json, setJson] = useState('');
  const [error, setError] = useState<YamlError | null>(null);

  const yamlToJson = () => {
    try {
      if (!yaml.trim()) {
        setError({ message: isEn ? 'Enter YAML to convert' : 'Введите YAML для конвертации' });
        return;
      }
      const parsed = parseYaml(yaml);
      setJson(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (e) {
      const msg = (e as Error).message;
      const lineMatch = msg.match(/line\s+(\d+)/i);
      setError({
        message: isEn ? `YAML parsing error: ${msg}` : `Ошибка парсинга YAML: ${msg}`,
        line: lineMatch ? parseInt(lineMatch[1]) : undefined
      });
    }
  };

  const jsonToYaml = () => {
    try {
      if (!json.trim()) {
        setError({ message: isEn ? 'Enter JSON to convert' : 'Введите JSON для конвертации' });
        return;
      }
      const parsed = JSON.parse(json);
      setYaml(toYaml(parsed).trimEnd());
      setError(null);
    } catch (e) {
      const msg = (e as Error).message;
      setError({ message: isEn ? `JSON parsing error: ${msg}` : `Ошибка парсинга JSON: ${msg}` });
    }
  };

  const clear = () => {
    setYaml('');
    setJson('');
    setError(null);
  };

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
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {error.message}
            </Typography>
            {error.line && (
              <Typography variant="caption" sx={{ color: 'error.dark' }}>
                {isEn ? 'Line' : 'Строка'}: {error.line}
              </Typography>
            )}
          </Alert>
        )}

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                YAML
              </Typography>
              <CopyButton text={yaml} tooltip={isEn ? 'Copy' : 'Копировать'} />
            </Box>
            <TextField
              multiline
              rows={16}
              fullWidth
              value={yaml}
              onChange={(e) => setYaml(e.target.value)}
              placeholder={isEn ? 'name: Example\nage: 25\nitems:\n  - apple\n  - banana' : 'name: Пример\nage: 25\nitems:\n  - яблоко\n  - банан'}
              sx={{
                '& .MuiInputBase-root': {
                  fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
                  fontSize: '0.85rem',
                  lineHeight: 1.6
                },
                '& .MuiOutlinedInput-root': { borderRadius: 2 }
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 2 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                gap: 1.5,
                pt: { xs: 0, sm: 4 }
              }}
            >
              <Button
                variant="contained"
                onClick={yamlToJson}
                disabled={!yaml}
                endIcon={<ArrowForwardIcon />}
                sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, minWidth: 140 }}
              >
                YAML → JSON
              </Button>
              <Button
                variant="contained"
                onClick={jsonToYaml}
                disabled={!json}
                startIcon={<ArrowBackIcon />}
                sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, minWidth: 140 }}
              >
                JSON → YAML
              </Button>
              <Button
                variant="outlined"
                startIcon={<DeleteOutlineIcon />}
                onClick={clear}
                color="inherit"
                sx={{ textTransform: 'none', borderRadius: 2, mt: 1 }}
              >
                {isEn ? 'Clear' : 'Очистить'}
              </Button>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                JSON
              </Typography>
              <CopyButton text={json} tooltip={isEn ? 'Copy' : 'Копировать'} />
            </Box>
            <TextField
              multiline
              rows={16}
              fullWidth
              value={json}
              onChange={(e) => setJson(e.target.value)}
              placeholder={isEn ? '{\n  "name": "Example",\n  "age": 25,\n  "items": ["apple", "banana"]\n}' : '{\n  "name": "Пример",\n  "age": 25,\n  "items": ["яблоко", "банан"]\n}'}
              sx={{
                '& .MuiInputBase-root': {
                  fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
                  fontSize: '0.85rem',
                  lineHeight: 1.6
                },
                '& .MuiOutlinedInput-root': { borderRadius: 2 }
              }}
            />
          </Grid>
        </Grid>

        {/* Stats */}
        <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          {yaml && (
            <Chip
              size="small"
              label={`YAML: ${yaml.split('\n').length} ${isEn ? 'lines' : 'строк'}, ${new TextEncoder().encode(yaml).length} ${isEn ? 'bytes' : 'байт'}`}
              variant="outlined"
              sx={{ fontSize: '0.75rem' }}
            />
          )}
          {json && (
            <Chip
              size="small"
              label={`JSON: ${json.split('\n').length} ${isEn ? 'lines' : 'строк'}, ${new TextEncoder().encode(json).length} ${isEn ? 'bytes' : 'байт'}`}
              variant="outlined"
              sx={{ fontSize: '0.75rem' }}
            />
          )}
        </Box>
      </Paper>

    </Box>
  );
}
