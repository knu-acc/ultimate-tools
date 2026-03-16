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
import { useLanguage } from '@/src/i18n/LanguageContext';

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
      text: match[0]
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
  const { locale } = useLanguage();
  const isEn = locale === 'en';

  const regex = useMemo(() => {
    setRegexError('');
    if (!search) return null;
    try {
      return buildRegex(search, caseSensitive, wholeWord, regexMode);
    } catch (e) {
      setRegexError(e instanceof Error ? e.message : (isEn ? 'Regex error' : 'Ошибка регулярного выражения'));
      return null;
    }
  }, [search, caseSensitive, wholeWord, regexMode, isEn]);

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
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 2,
          borderRadius: 18,
          background: theme.palette.surfaceContainerLow
        }}
      >
        <TextField
          multiline
          rows={5}
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isEn ? 'Text...' : 'Текст...'}
          sx={{ mb: 2 }}
        />

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isEn ? 'Find...' : 'Найти...'}
              error={!!regexError}
              helperText={regexError || undefined}
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              value={replace}
              onChange={(e) => setReplace(e.target.value)}
              placeholder={isEn ? 'Replace with...' : 'Заменить на...'}
              size="small"
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2, alignItems: 'center' }}>
          <Chip
            label={isEn ? 'Case sensitive' : 'Учитывать регистр'}
            variant={caseSensitive ? 'filled' : 'outlined'}
            color={caseSensitive ? 'primary' : 'default'}
            onClick={() => setCaseSensitive(!caseSensitive)}
            sx={{ borderRadius: 10 }}
          />
          <Chip
            label={isEn ? 'Whole word' : 'Слово целиком'}
            variant={wholeWord ? 'filled' : 'outlined'}
            color={wholeWord ? 'primary' : 'default'}
            onClick={() => {
              setWholeWord(!wholeWord);
              if (!wholeWord) setRegexMode(false);
            }}
            sx={{ borderRadius: 10 }}
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
                {isEn ? 'Regular expressions' : 'Регулярные выражения'}
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
              borderRadius: 10,
              background: alpha(
                matches.length > 0 ? theme.palette.success.main : theme.palette.warning.main,
                0.1
              )
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {matches.length > 0
                ? (isEn ? `Matches found: ${matches.length}` : `Найдено совпадений: ${matches.length}`)
                : (isEn ? 'No matches found' : 'Совпадений не найдено')}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            onClick={handleReplaceFirst}
            disabled={!search || !input || matches.length === 0}
            sx={{ textTransform: 'none', borderRadius: 10 }}
          >
            {isEn ? 'Replace first' : 'Заменить первое'}
          </Button>
          <Button
            variant="contained"
            onClick={handleReplaceAll}
            disabled={!search || !input || matches.length === 0}
            sx={{ textTransform: 'none', borderRadius: 10 }}
          >
            {isEn ? 'Replace all' : 'Заменить все'}
          </Button>
          <Button
            variant="text"
            onClick={handleClear}
            sx={{ textTransform: 'none', borderRadius: 10, ml: 'auto' }}
          >
            {isEn ? 'Clear' : 'Очистить'}
          </Button>
        </Box>

        {highlightedPreview && highlightedPreview.length > 0 && (
          <Box>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                maxHeight: 250,
                overflow: 'auto',
                borderRadius: 18,
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                lineHeight: 1.7,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                background: theme.palette.background.default
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
                      fontWeight: 600
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
