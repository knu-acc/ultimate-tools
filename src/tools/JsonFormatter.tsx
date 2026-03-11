'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Alert,
  ButtonGroup,
  Snackbar,
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DataObjectIcon from '@mui/icons-material/DataObject';
import CompressIcon from '@mui/icons-material/Compress';
import VerifiedIcon from '@mui/icons-material/Verified';
import { CopyButton, ShareButton } from '@/src/components/CopyButton';


interface JsonError {
  message: string;
  position?: number;
  line?: number;
  column?: number;
}

function parseErrorPosition(errMsg: string): { line?: number; column?: number; position?: number } {
  // Try to extract position from JSON parse error messages
  const posMatch = errMsg.match(/position\s+(\d+)/i);
  const lineMatch = errMsg.match(/line\s+(\d+)/i);
  const colMatch = errMsg.match(/column\s+(\d+)/i);
  return {
    position: posMatch ? parseInt(posMatch[1]) : undefined,
    line: lineMatch ? parseInt(lineMatch[1]) : undefined,
    column: colMatch ? parseInt(colMatch[1]) : undefined
  };
}

function positionToLineCol(text: string, position: number): { line: number; column: number } {
  const lines = text.substring(0, position).split('\n');
  return { line: lines.length, column: (lines[lines.length - 1]?.length ?? 0) + 1 };
}

function countKeys(obj: unknown): number {
  if (obj === null || typeof obj !== 'object') return 0;
  if (Array.isArray(obj)) {
    return obj.reduce((sum: number, item) => sum + countKeys(item), 0);
  }
  const keys = Object.keys(obj as Record<string, unknown>);
  return keys.length + keys.reduce((sum: number, k) => sum + countKeys((obj as Record<string, unknown>)[k]), 0);
}

function syntaxHighlight(json: string): string {
  // Escape HTML first
  const escaped = json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return escaped.replace(
    /("(\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      let cls = 'color: #6f42c1'; // number (purple)
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'color: #005cc5'; // key (blue)
        } else {
          cls = 'color: #22863a'; // string (green)
        }
      } else if (/true|false/.test(match)) {
        cls = 'color: #d73a49'; // boolean (red)
      } else if (/null/.test(match)) {
        cls = 'color: #999'; // null (gray)
      }
      return `<span style="${cls}">${match}</span>`;
    }
  );
}

export default function JsonFormatter() {
  const theme = useTheme();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<JsonError | null>(null);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState('');
  const [lastAction, setLastAction] = useState<string>('');

  const showSnack = (msg: string) => {
    setSnackMsg(msg);
    setSnackOpen(true);
  };

  const handleError = (e: unknown) => {
    const msg = (e as Error).message;
    const pos = parseErrorPosition(msg);
    let line = pos.line;
    let column = pos.column;
    if (!line && pos.position !== undefined) {
      const lc = positionToLineCol(input, pos.position);
      line = lc.line;
      column = lc.column;
    }
    setError({ message: msg, position: pos.position, line, column });
    setOutput('');
  };

  const formatJson = () => {
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setError(null);
      setLastAction('format');
      showSnack('JSON отформатирован');
    } catch (e) {
      handleError(e);
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setError(null);
      setLastAction('minify');
      showSnack('JSON минифицирован');
    } catch (e) {
      handleError(e);
    }
  };

  const validateJson = () => {
    try {
      JSON.parse(input);
      setError(null);
      setOutput('');
      setLastAction('validate');
      showSnack('JSON валиден!');
    } catch (e) {
      handleError(e);
      setLastAction('validate');
    }
  };

  const copyOutput = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      showSnack('Скопировано в буфер обмена');
    } catch {
      showSnack('Не удалось скопировать');
    }
  };

  const clear = () => {
    setInput('');
    setOutput('');
    setError(null);
    setLastAction('');
    showSnack('Очищено');
  };

  const stats = useMemo(() => {
    if (!output) return null;
    const lines = output.split('\n').length;
    const bytes = new TextEncoder().encode(output).length;
    let keys = 0;
    try {
      keys = countKeys(JSON.parse(output));
    } catch {
      /* ignore */
    }
    return { lines, bytes, keys };
  }, [output]);

  const highlightedHtml = useMemo(() => {
    if (!output || lastAction === 'validate') return '';
    return syntaxHighlight(output);
  }, [output, lastAction]);

  const outputLineCount = output ? output.split('\n').length : 0;

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
        {/* Input area */}
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
          Входные данные
        </Typography>
        <TextField
          multiline
          rows={12}
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Вставьте JSON сюда...'
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
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: 'center', mb: 2.5 }}>
          <ButtonGroup variant="contained" sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Button
              startIcon={<DataObjectIcon />}
              onClick={formatJson}
              disabled={!input}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Форматировать
            </Button>
            <Button
              startIcon={<CompressIcon />}
              onClick={minifyJson}
              disabled={!input}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Минифицировать
            </Button>
            <Button
              startIcon={<VerifiedIcon />}
              onClick={validateJson}
              disabled={!input}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Валидировать
            </Button>
          </ButtonGroup>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<ContentCopyIcon />}
              onClick={copyOutput}
              disabled={!output}
              sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
            >
              Копировать
            </Button>
            <Button
              variant="outlined"
              startIcon={<DeleteOutlineIcon />}
              onClick={clear}
              color="inherit"
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              Очистить
            </Button>
          </Box>
        </Box>

        {/* Error display */}
        {error && (
          <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
              Ошибка парсинга JSON
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
              {error.message}
            </Typography>
            {(error.line || error.position !== undefined) && (
              <Typography
                variant="caption"
                sx={{ display: 'block', mt: 0.5, color: 'error.dark' }}
              >
                {error.line && `Строка: ${error.line}`}
                {error.column && `, Столбец: ${error.column}`}
                {error.position !== undefined && ` (позиция: ${error.position})`}
              </Typography>
            )}
          </Alert>
        )}

        {/* Validation success */}
        {lastAction === 'validate' && !error && !output && (
          <Alert severity="success" sx={{ mb: 2.5, borderRadius: 2 }}>
            JSON валиден!
          </Alert>
        )}

        {/* Output area */}
        {output && lastAction !== 'validate' && (
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
              Результат
            </Typography>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 2,
                overflow: 'auto',
                maxHeight: 450,
                background: theme.palette.mode === 'dark'
                  ? alpha(theme.palette.common.black, 0.3)
                  : alpha(theme.palette.grey[50], 1)
              }}
            >
              <Box sx={{ display: 'flex' }}>
                {/* Line numbers */}
                {outputLineCount > 1 && (
                  <Box
                    sx={{
                      p: 1.5,
                      pr: 1,
                      borderRight: `1px solid ${theme.palette.divider}`,
                      background: alpha(theme.palette.text.primary, 0.03),
                      userSelect: 'none',
                      textAlign: 'right',
                      minWidth: 44,
                      flexShrink: 0
                    }}
                  >
                    {Array.from({ length: outputLineCount }, (_, i) => (
                      <Typography
                        key={i}
                        component="div"
                        sx={{
                          fontFamily: '"JetBrains Mono", monospace',
                          fontSize: '0.78rem',
                          color: 'text.disabled',
                          lineHeight: '1.6rem'
                        }}
                      >
                        {i + 1}
                      </Typography>
                    ))}
                  </Box>
                )}
                {/* Syntax-highlighted code */}
                <Box sx={{ p: 1.5, flex: 1, overflow: 'auto' }}>
                  <Box
                    component="pre"
                    dangerouslySetInnerHTML={{ __html: highlightedHtml }}
                    sx={{
                      fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
                      fontSize: '0.78rem',
                      lineHeight: '1.6rem',
                      m: 0,
                      whiteSpace: 'pre'
                    }}
                  />
                </Box>
              </Box>
            </Paper>

            {/* Stats bar */}
            {stats && (
              <Box sx={{ display: 'flex', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
                <Chip
                  size="small"
                  label={`${stats.lines} строк`}
                  variant="outlined"
                  sx={{ fontSize: '0.75rem' }}
                />
                <Chip
                  size="small"
                  label={`${stats.bytes.toLocaleString()} байт`}
                  variant="outlined"
                  sx={{ fontSize: '0.75rem' }}
                />
                <Chip
                  size="small"
                  label={`${stats.keys} ключей`}
                  variant="outlined"
                  sx={{ fontSize: '0.75rem' }}
                />
              </Box>
            )}
          </Box>
        )}
      </Paper>

      {/* Snackbar */}
      <Snackbar
        open={snackOpen}
        autoHideDuration={2000}
        onClose={() => setSnackOpen(false)}
        message={snackMsg}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
}
