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
  Switch,
  FormControlLabel,
  useTheme,
  alpha,
} from '@mui/material';

interface MatchInfo {
  index: number;
  length: number;
  text: string;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildRegex(
  search: string,
  caseSensitive: boolean,
  wholeWord: boolean,
  regexMode: boolean
): RegExp | null {
  if (!search) return null;

  try {
    let pattern = regexMode ? search : escapeRegex(search);
    if (wholeWord && !regexMode) {
      pattern = `\\b${pattern}\\b`;
    }
    const flags = caseSensitive ? 'g' : 'gi';
    return new RegExp(pattern, flags);
  } catch {
    return null;
  }
}

function findMatches(text: string, regex: RegExp | null): MatchInfo[] {
  if (!regex || !text) return [];
  const matches: MatchInfo[] = [];
  let match: RegExpExecArray | null;
  const safeRegex = new RegExp(regex.source, regex.flags);
  while ((match = safeRegex.exec(text)) !== null) {
    if (match[0].length === 0) {
      safeRegex.lastIndex++;
      continue;
    }
    matches.push({
      index: match.index,
      length: match[0].length,
      text: match[0],
    });
    if (matches.length > 10000) break;
  }
  return matches;
}

export default function TextReplace() {
  const theme = useTheme();
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [replace, setReplace] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [regexMode, setRegexMode] = useState(false);
  const [regexError, setRegexError] = useState('');

  const regex = useMemo(() => {
    setRegexError('');
    if (!search) return null;
    try {
      return buildRegex(search, caseSensitive, wholeWord, regexMode);
    } catch (e) {
      setRegexError(e instanceof Error ? e.message : 'Ошибка регулярного выражения');
      return null;
    }
  }, [search, caseSensitive, wholeWord, regexMode]);

  const matches = useMemo(() => findMatches(input, regex), [input, regex]);

  const highlightedPreview = useMemo(() => {
    if (!input || matches.length === 0) return null;

    const parts: { text: string; highlighted: boolean }[] = [];
    let lastIndex = 0;

    for (const m of matches) {
      if (m.index > lastIndex) {
        parts.push({ text: input.slice(lastIndex, m.index), highlighted: false });
      }
      parts.push({ text: input.slice(m.index, m.index + m.length), highlighted: true });
      lastIndex = m.index + m.length;
    }
    if (lastIndex < input.length) {
      parts.push({ text: input.slice(lastIndex), highlighted: false });
    }
    return parts;
  }, [input, matches]);

  const handleReplaceFirst = () => {
    if (!regex || !input || matches.length === 0) return;
    const firstMatch = matches[0];
    const before = input.slice(0, firstMatch.index);
    const after = input.slice(firstMatch.index + firstMatch.length);
    let replacement = replace;
    if (regexMode) {
      try {
        const singleRegex = new RegExp(regex.source, regex.flags.replace('g', ''));
        const matchResult = input.slice(firstMatch.index).match(singleRegex);
        if (matchResult) {
          replacement = replace.replace(/\$(\d+)/g, (_, n) => matchResult[Number(n)] ?? '');
        }
      } catch {
        // fallback to plain replacement
      }
    }
    setInput(before + replacement + after);
  };

  const handleReplaceAll = () => {
    if (!regex || !input) return;
    try {
      const result = input.replace(regex, replace);
      setInput(result);
    } catch {
      // invalid replacement pattern
    }
  };

  const handleClear = () => {
    setInput('');
    setSearch('');
    setReplace('');
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
        {/* Input text */}
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: 'text.secondary' }}>
          Исходный текст
        </Typography>
        <TextField
          multiline
          rows={6}
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Введите или вставьте текст..."
          sx={{ mb: 3 }}
        />

        {/* Search and Replace fields */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: 'text.secondary' }}>
              Найти
            </Typography>
            <TextField
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Текст для поиска..."
              error={!!regexError}
              helperText={regexError || undefined}
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: 'text.secondary' }}>
              Заменить на
            </Typography>
            <TextField
              fullWidth
              value={replace}
              onChange={(e) => setReplace(e.target.value)}
              placeholder="Текст замены..."
              size="small"
            />
          </Grid>
        </Grid>

        {/* Options */}
        <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 500, color: 'text.secondary' }}>
          Параметры поиска
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2, alignItems: 'center' }}>
          <Chip
            label="Учитывать регистр"
            variant={caseSensitive ? 'filled' : 'outlined'}
            color={caseSensitive ? 'primary' : 'default'}
            onClick={() => setCaseSensitive(!caseSensitive)}
            sx={{ borderRadius: 2 }}
          />
          <Chip
            label="Слово целиком"
            variant={wholeWord ? 'filled' : 'outlined'}
            color={wholeWord ? 'primary' : 'default'}
            onClick={() => {
              setWholeWord(!wholeWord);
              if (!wholeWord) setRegexMode(false);
            }}
            sx={{ borderRadius: 2 }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={regexMode}
                onChange={(e) => {
                  setRegexMode(e.target.checked);
                  if (e.target.checked) setWholeWord(false);
                }}
                size="small"
              />
            }
            label={
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Регулярные выражения
              </Typography>
            }
          />
        </Box>

        {/* Match count */}
        {search && (
          <Box
            sx={{
              mb: 2,
              p: 1.5,
              borderRadius: 2,
              background: alpha(
                matches.length > 0 ? theme.palette.success.main : theme.palette.warning.main,
                0.1
              ),
              border: `1px solid ${alpha(
                matches.length > 0 ? theme.palette.success.main : theme.palette.warning.main,
                0.3
              )}`,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {matches.length > 0
                ? `Найдено совпадений: ${matches.length}`
                : 'Совпадений не найдено'}
            </Typography>
          </Box>
        )}

        {/* Action buttons */}
        <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            onClick={handleReplaceFirst}
            disabled={!search || !input || matches.length === 0}
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            Заменить первое
          </Button>
          <Button
            variant="contained"
            onClick={handleReplaceAll}
            disabled={!search || !input || matches.length === 0}
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            Заменить все
          </Button>
          <Button
            variant="text"
            onClick={handleClear}
            sx={{ textTransform: 'none', borderRadius: 2, ml: 'auto' }}
          >
            Очистить
          </Button>
        </Box>

        {/* Highlighted preview */}
        {highlightedPreview && highlightedPreview.length > 0 && (
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: 'text.secondary' }}>
              Предпросмотр совпадений
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                maxHeight: 250,
                overflow: 'auto',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                lineHeight: 1.7,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                background: theme.palette.background.default,
              }}
            >
              {highlightedPreview.map((part, i) =>
                part.highlighted ? (
                  <Box
                    component="span"
                    key={i}
                    sx={{
                      background: alpha(theme.palette.warning.main, 0.35),
                      borderRadius: '3px',
                      px: 0.3,
                      py: 0.1,
                      border: `1px solid ${alpha(theme.palette.warning.main, 0.5)}`,
                    }}
                  >
                    {part.text}
                  </Box>
                ) : (
                  <span key={i}>{part.text}</span>
                )
              )}
            </Paper>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
