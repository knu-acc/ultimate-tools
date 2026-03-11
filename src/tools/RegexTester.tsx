'use client';

import { useState, useMemo, useCallback } from 'react';
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
  IconButton,
  Tooltip,
  useTheme,
  alpha
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { CopyButton, ShareButton } from '@/src/components/CopyButton';


interface MatchInfo {
  match: string;
  index: number;
  groups: string[];
}

export default function RegexTester() {
  const theme = useTheme();
  const [pattern, setPattern] = useState('');
  const [testString, setTestString] = useState('');
  const [flags, setFlags] = useState({ g: true, i: false, m: false, s: false });
  const [copied, setCopied] = useState(false);

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
        html += `<mark style="background-color: ${alpha(theme.palette.primary.main, 0.3)}; border-radius: 3px; padding: 1px 2px;">${escapeHtml(m.match)}</mark>`;
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

  const copyRegex = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(`/${pattern}/${flagString}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  }, [pattern, flagString]);

  const flagDescriptions: Record<string, string> = {
    g: 'Глобальный поиск',
    i: 'Без учёта регистра',
    m: 'Многострочный',
    s: 'Точка включает \\n'
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      {/* Pattern Input */}
      <Paper
        elevation={0}
        sx={{ p: 3, mb: 3 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontFamily: 'monospace', fontSize: '1.2rem' }}>
            /
          </Typography>
          <TextField
            fullWidth
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="Введите регулярное выражение..."
            variant="outlined"
            sx={{ '& .MuiInputBase-input': { fontFamily: 'monospace' } }}
          />
          <Typography variant="body1" sx={{ color: 'text.secondary', fontFamily: 'monospace', fontSize: '1.2rem' }}>
            /{flagString}
          </Typography>
          <Tooltip title={copied ? 'Скопировано!' : 'Копировать'}>
            <IconButton onClick={copyRegex} size="small">
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
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
        <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
          {error}
        </Alert>
      )}

      {/* Test String */}
      <Paper
        elevation={0}
        sx={{ p: 3, mb: 3 }}
      >
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: 'text.secondary' }}>
          Тестовая строка
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={5}
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          placeholder="Введите текст для проверки..."
          sx={{ '& .MuiInputBase-input': { fontFamily: 'monospace' } }}
        />
      </Paper>

      {/* Highlighted Results */}
      {testString && pattern && !error && (
        <Paper
          elevation={0}
          sx={{ p: 3, mb: 3 }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
              Результат с подсветкой
            </Typography>
            <Chip
              label={`${matches.length} ${matches.length === 1 ? 'совпадение' : 'совпадений'}`}
              color={matches.length > 0 ? 'primary' : 'default'}
              size="small"
            />
          </Box>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
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
          sx={{ p: 3 }}
        >
          <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', mb: 2 }}>
            Список совпадений
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
                          позиция: {m.index}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      m.groups.length > 0 ? (
                        <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {m.groups.map((g, gi) => (
                            <Chip
                              key={gi}
                              label={`Группа ${gi + 1}: "${g}"`}
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
