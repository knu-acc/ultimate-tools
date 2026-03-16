'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  Paper,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import { CopyButton } from '@/src/components/CopyButton';
import { useLanguage } from '@/src/i18n/LanguageContext';


interface MatchInfo {
  match: string;
  index: number;
  groups: string[];
}

export default function RegexTester() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const [pattern, setPattern] = useState('');
  const [testString, setTestString] = useState('');
  const [flags, setFlags] = useState({ g: true, i: false, m: false, s: false });
  const toggleFlag = (flag: keyof typeof flags) => {
    setFlags((prev) => ({ ...prev, [flag]: !prev[flag] }));
  };

  const flagString = useMemo(() => {
    return Object.entries(flags)
      .filter(([, v]) => v)
      .map(([k]) => k)
      .join('');
  }, [flags]);

  const { matches, error, highlighted } = useMemo(() => {
    if (!pattern || !testString) {
      return { matches: [] as MatchInfo[], error: null, highlighted: testString };
    }

    try {
      const regex = new RegExp(pattern, flagString);
      const foundMatches: MatchInfo[] = [];
      let match: RegExpExecArray | null;

      if (flags.g) {
        while ((match = regex.exec(testString)) !== null) {
          foundMatches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1)
          });
          if (match[0].length === 0) regex.lastIndex++;
        }
      } else {
        match = regex.exec(testString);
        if (match) {
          foundMatches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1)
          });
        }
      }

      // Build highlighted string
      let html = '';
      let lastIndex = 0;
      const sortedMatches = [...foundMatches].sort((a, b) => a.index - b.index);

      for (const m of sortedMatches) {
        html += escapeHtml(testString.slice(lastIndex, m.index));
        html += `<mark style="background-color: ${alpha(theme.palette.primary.main, 0.3)}; border-radius: 4px; padding: 1px 2px;">${escapeHtml(m.match)}</mark>`;
        lastIndex = m.index + m.match.length;
      }
      html += escapeHtml(testString.slice(lastIndex));

      return { matches: foundMatches, error: null, highlighted: html };
    } catch (e) {
      return {
        matches: [] as MatchInfo[],
        error: (e as Error).message,
        highlighted: testString
      };
    }
  }, [pattern, testString, flagString, flags.g, theme.palette.primary.main]);

  function escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  const flagDescriptions: Record<string, string> = {
    g: isEn ? 'Global search' : 'Глобальный поиск',
    i: isEn ? 'Case insensitive' : 'Без учёта регистра',
    m: isEn ? 'Multiline' : 'Многострочный',
    s: isEn ? 'Dot matches \\n' : 'Точка включает \\n'
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Pattern Input */}
      <Paper
        elevation={0}
        sx={{ p: { xs: 2, sm: 3 }, mb: 2, borderRadius: 18, background: theme.palette.surfaceContainerLow }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontFamily: 'monospace', fontSize: '1.2rem' }}>
            /
          </Typography>
          <TextField
            fullWidth
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder={isEn ? "Enter regular expression..." : "Введите регулярное выражение..."}
            variant="outlined"
            sx={{ '& .MuiInputBase-input': { fontFamily: 'monospace' } }}
          />
          <Typography variant="body1" sx={{ color: 'text.secondary', fontFamily: 'monospace', fontSize: '1.2rem' }}>
            /{flagString}
          </Typography>
          <CopyButton text={`/${pattern}/${flagString}`} size="small" />
        </Box>

        <FormGroup row>
          {Object.entries(flagDescriptions).map(([flag, desc]) => (
            <FormControlLabel
              key={flag}
              control={
                <Checkbox
                  checked={flags[flag as keyof typeof flags]}
                  onChange={() => toggleFlag(flag as keyof typeof flags)}
                  size="small"
                />
              }
              label={
                <Typography variant="body2">
                  <strong>{flag}</strong> — {desc}
                </Typography>
              }
            />
          ))}
        </FormGroup>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 18 }}>
          {error}
        </Alert>
      )}

      {/* Test String */}
      <Paper
        elevation={0}
        sx={{ p: { xs: 2, sm: 3 }, mb: 2, borderRadius: 18, background: theme.palette.surfaceContainerLow }}
      >
        <TextField
          fullWidth
          multiline
          rows={5}
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          placeholder={isEn ? "Enter test string..." : "Введите текст для проверки..."}
          sx={{ '& .MuiInputBase-input': { fontFamily: 'monospace' } }}
        />
      </Paper>

      {/* Highlighted Results */}
      {testString && pattern && !error && (
        <Paper
          elevation={0}
          sx={{ p: { xs: 2, sm: 3 }, mb: 2, borderRadius: 18, background: theme.palette.surfaceContainerLow }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
              {isEn ? 'Highlighting' : 'Подсветка'}
            </Typography>
            <Chip
              label={isEn ? `${matches.length} ${matches.length === 1 ? 'match' : 'matches'}` : `${matches.length} ${matches.length === 1 ? 'совпадение' : 'совпадений'}`}
              color={matches.length > 0 ? 'primary' : 'default'}
              size="small"
            />
          </Box>
          <Box
            sx={{
              p: 2,
              borderRadius: 10,
              backgroundColor: alpha(theme.palette.background.default, 0.5),
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              lineHeight: 1.8
            }}
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        </Paper>
      )}

      {/* Match List */}
      {matches.length > 0 && (
        <Paper
          elevation={0}
          sx={{ p: { xs: 2, sm: 3 }, borderRadius: 18, background: theme.palette.surfaceContainerLow }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary', mb: 2 }}>
            {isEn ? 'Matches' : 'Совпадения'}
          </Typography>
          <List disablePadding>
            {matches.map((m, i) => (
              <Box key={i}>
                {i > 0 && <Divider />}
                <ListItem sx={{ px: 1 }}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip label={`#${i + 1}`} size="small" variant="outlined" />
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: 'monospace',
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            px: 1,
                            py: 0.25,
                            borderRadius: 1
                          }}
                        >
                          {`"${m.match}"`}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {isEn ? 'position' : 'позиция'}: {m.index}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      m.groups.length > 0 ? (
                        <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {m.groups.map((g, gi) => (
                            <Chip
                              key={gi}
                              label={isEn ? `Group ${gi + 1}: "${g}"` : `Группа ${gi + 1}: "${g}"`}
                              size="small"
                              variant="outlined"
                              sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}
                            />
                          ))}
                        </Box>
                      ) : undefined
                    }
                  />
                </ListItem>
              </Box>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}
