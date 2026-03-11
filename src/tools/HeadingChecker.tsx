'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Chip,
  alpha,
  useTheme,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import TitleIcon from '@mui/icons-material/Title';
import InfoIcon from '@mui/icons-material/Info';

interface HeadingEntry {
  level: number;
  text: string;
  line: number;
}

interface AnalysisIssue {
  type: 'error' | 'warning' | 'success';
  message: string;
}

function parseHeadings(html: string): HeadingEntry[] {
  const headings: HeadingEntry[] = [];
  const regex = /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1]);
    // Strip inner HTML tags
    const text = match[2].replace(/<[^>]*>/g, '').trim();
    const line = html.substring(0, match.index).split('\n').length;
    headings.push({ level, text, line });
  }
  return headings;
}

function analyzeHeadings(headings: HeadingEntry[]): AnalysisIssue[] {
  const issues: AnalysisIssue[] = [];

  if (headings.length === 0) {
    issues.push({ type: 'warning', message: 'Заголовки не найдены в HTML' });
    return issues;
  }

  // Check for H1
  const h1Count = headings.filter((h) => h.level === 1).length;
  if (h1Count === 0) {
    issues.push({ type: 'error', message: 'Отсутствует H1 — каждая страница должна иметь один заголовок H1' });
  } else if (h1Count > 1) {
    issues.push({ type: 'error', message: `Найдено ${h1Count} заголовков H1 — рекомендуется только один H1 на страницу` });
  } else {
    issues.push({ type: 'success', message: 'Ровно один H1 — отлично' });
  }

  // Check if H1 is first
  if (headings.length > 0 && headings[0].level !== 1) {
    issues.push({ type: 'warning', message: 'Первый заголовок — не H1. Рекомендуется начинать с H1' });
  }

  // Check for skipped levels
  for (let i = 1; i < headings.length; i++) {
    const diff = headings[i].level - headings[i - 1].level;
    if (diff > 1) {
      issues.push({
        type: 'warning',
        message: `Пропущен уровень: H${headings[i - 1].level} → H${headings[i].level} (строка ${headings[i].line}). Не пропускайте уровни заголовков`,
      });
    }
  }

  // Check for empty headings
  const empty = headings.filter((h) => !h.text);
  if (empty.length > 0) {
    issues.push({ type: 'error', message: `Найдено пустых заголовков: ${empty.length}` });
  }

  // SEO recommendations
  const h1 = headings.find((h) => h.level === 1);
  if (h1 && h1.text.length > 70) {
    issues.push({ type: 'warning', message: 'H1 слишком длинный (>70 символов). Рекомендуется до 60-70 символов' });
  }

  if (h1Count === 1 && headings[0].level === 1 && !headings.some((h, i) => i > 0 && h.level - headings[i - 1].level > 1)) {
    if (!empty.length) {
      issues.push({ type: 'success', message: 'Структура заголовков корректна' });
    }
  }

  return issues;
}

const LEVEL_COLORS = ['', '#1976d2', '#2e7d32', '#ed6c02', '#d32f2f', '#7b1fa2', '#0288d1'];

export default function HeadingChecker() {
  const theme = useTheme();
  const [html, setHtml] = useState('');

  const headings = useMemo(() => parseHeadings(html), [html]);
  const issues = useMemo(() => analyzeHeadings(headings), [headings]);

  const errorCount = issues.filter((i) => i.type === 'error').length;
  const warningCount = issues.filter((i) => i.type === 'warning').length;
  const successCount = issues.filter((i) => i.type === 'success').length;

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'error': return <ErrorIcon sx={{ fontSize: 18, color: 'error.main' }} />;
      case 'warning': return <WarningIcon sx={{ fontSize: 18, color: 'warning.main' }} />;
      case 'success': return <CheckCircleIcon sx={{ fontSize: 18, color: 'success.main' }} />;
      default: return null;
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      {/* Input */}
      <Paper
        elevation={0}
        sx={{ p: 3, mb: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: 3 }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5 }}>
          Вставьте HTML-код
        </Typography>
        <TextField
          multiline
          rows={10}
          value={html}
          onChange={(e) => setHtml(e.target.value)}
          fullWidth
          placeholder={'<h1>Заголовок страницы</h1>\n<h2>Подзаголовок</h2>\n<h3>Секция</h3>'}
          slotProps={{
            input: {
              sx: { fontFamily: 'monospace', fontSize: 13 },
            },
          }}
        />
      </Paper>

      {headings.length > 0 && (
        <Grid container spacing={3}>
          {/* Hierarchy */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper
              elevation={0}
              sx={{ p: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: 3 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <TitleIcon color="primary" fontSize="small" />
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  Структура заголовков
                </Typography>
                <Chip label={`${headings.length}`} size="small" variant="outlined" sx={{ ml: 'auto' }} />
              </Box>

              {headings.map((h, i) => (
                <Box
                  key={i}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    py: 0.8,
                    pl: (h.level - 1) * 3,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    '&:last-child': { borderBottom: 'none' },
                  }}
                >
                  <Chip
                    label={`H${h.level}`}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      fontSize: 11,
                      minWidth: 36,
                      backgroundColor: alpha(LEVEL_COLORS[h.level], 0.12),
                      color: LEVEL_COLORS[h.level],
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: h.level <= 2 ? 600 : 400,
                      fontSize: 14 - (h.level - 1),
                      flex: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {h.text || <em style={{ color: theme.palette.text.secondary }}>пусто</em>}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    стр. {h.line}
                  </Typography>
                </Box>
              ))}
            </Paper>
          </Grid>

          {/* Analysis */}
          <Grid size={{ xs: 12, md: 5 }}>
            {/* Stats */}
            <Grid container spacing={1} sx={{ mb: 2 }}>
              <Grid size={{ xs: 4 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    textAlign: 'center',
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 3,
                    backgroundColor: errorCount > 0 ? alpha(theme.palette.error.main, 0.06) : undefined,
                  }}
                >
                  <Typography variant="h6" color={errorCount > 0 ? 'error' : 'text.primary'} sx={{ fontWeight: 700 }}>
                    {errorCount}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Ошибки</Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 4 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    textAlign: 'center',
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 3,
                    backgroundColor: warningCount > 0 ? alpha(theme.palette.warning.main, 0.06) : undefined,
                  }}
                >
                  <Typography variant="h6" color={warningCount > 0 ? 'warning.main' : 'text.primary'} sx={{ fontWeight: 700 }}>
                    {warningCount}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Предупреждения</Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 4 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    textAlign: 'center',
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 3,
                    backgroundColor: successCount > 0 ? alpha(theme.palette.success.main, 0.06) : undefined,
                  }}
                >
                  <Typography variant="h6" color={successCount > 0 ? 'success.main' : 'text.primary'} sx={{ fontWeight: 700 }}>
                    {successCount}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Успешно</Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Issues */}
            <Paper
              elevation={0}
              sx={{ p: 2, mb: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 3 }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5 }}>
                Результаты анализа
              </Typography>
              {issues.map((issue, i) => (
                <Box
                  key={i}
                  sx={{
                    display: 'flex',
                    gap: 1,
                    py: 1,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    '&:last-child': { borderBottom: 'none' },
                    alignItems: 'flex-start',
                  }}
                >
                  {getIssueIcon(issue.type)}
                  <Typography variant="body2" sx={{ fontSize: 13 }}>
                    {issue.message}
                  </Typography>
                </Box>
              ))}
            </Paper>

            {/* SEO tips */}
            <Paper
              elevation={0}
              sx={{ p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 3 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <InfoIcon fontSize="small" color="primary" />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  SEO рекомендации
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" component="div">
                <Box component="ul" sx={{ pl: 2, m: 0, '& li': { mb: 0.5 } }}>
                  <li>Используйте один H1 на страницу — это главный заголовок</li>
                  <li>Не пропускайте уровни (H1 → H2 → H3, не H1 → H3)</li>
                  <li>H1 должен содержать основное ключевое слово</li>
                  <li>Длина H1 — до 60-70 символов</li>
                  <li>Заголовки должны быть осмысленными и описывать содержимое</li>
                  <li>Не используйте заголовки только для стилизации текста</li>
                </Box>
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}

      {html.length > 0 && headings.length === 0 && (
        <Paper
          elevation={0}
          sx={{ p: 4, textAlign: 'center', border: `1px solid ${theme.palette.divider}`, borderRadius: 3 }}
        >
          <WarningIcon sx={{ fontSize: 48, color: 'warning.main', mb: 1 }} />
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            Заголовки не найдены
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Убедитесь, что HTML содержит теги &lt;h1&gt; — &lt;h6&gt;
          </Typography>
        </Paper>
      )}
    </Box>
  );
}
