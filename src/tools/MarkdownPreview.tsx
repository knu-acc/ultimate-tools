'use client';

import { useState } from 'react';
import {
  Box, Typography, TextField, Paper, Grid, Chip, alpha, useTheme, IconButton
} from '@mui/material';
import { FormatBold, FormatItalic, Code, FormatListBulleted, Title } from '@mui/icons-material';
import { CopyButton } from '@/src/components/CopyButton';


const defaultMd = `# Заголовок 1
## Заголовок 2
### Заголовок 3

Это **жирный** текст и *курсивный* текст.

- Элемент списка 1
- Элемент списка 2
- Элемент списка 3

1. Нумерованный пункт
2. Второй пункт
3. Третий пункт

> Это цитата. Markdown — простой язык разметки.

\`inline code\` и блок кода:

\`\`\`
function hello() {
  console.log("Привет мир!");
}
\`\`\`

[Ссылка на UTools](https://utools.app)

---

| Столбец 1 | Столбец 2 | Столбец 3 |
|-----------|-----------|-----------|
| Ячейка 1  | Ячейка 2  | Ячейка 3  |
| Ячейка 4  | Ячейка 5  | Ячейка 6  |
`;

function parseMarkdown(md: string): string {
  let html = md
    // Code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre style="background:#1e1e1e;color:#d4d4d4;padding:12px;border-radius:8px;overflow-x:auto;font-size:13px"><code>$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code style="background:rgba(0,0,0,0.06);padding:2px 6px;border-radius:4px;font-size:13px">$1</code>')
    // Headers
    .replace(/^### (.+)$/gm, '<h3 style="margin:16px 0 8px;font-size:1.1rem;font-weight:600">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 style="margin:20px 0 10px;font-size:1.3rem;font-weight:600">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 style="margin:24px 0 12px;font-size:1.6rem;font-weight:700">$1</h1>')
    // Bold + Italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Blockquote
    .replace(/^> (.+)$/gm, '<blockquote style="border-left:4px solid #6750A4;padding:8px 16px;margin:12px 0;background:rgba(103,80,164,0.05);border-radius:0 8px 8px 0">$1</blockquote>')
    // Horizontal rule
    .replace(/^---$/gm, '<hr style="border:none;border-top:1px solid #ddd;margin:16px 0">')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:#6750A4;text-decoration:underline" target="_blank" rel="noopener">$1</a>')
    // Unordered list
    .replace(/^- (.+)$/gm, '<li style="margin:4px 0">$1</li>')
    // Ordered list
    .replace(/^\d+\. (.+)$/gm, '<li style="margin:4px 0">$1</li>')
    // Tables
    .replace(/^\|(.+)\|$/gm, (match) => {
      const cells = match.split('|').filter(c => c.trim()).map(c => c.trim());
      if (cells.every(c => /^[-:]+$/.test(c))) return '';
      const tag = cells.some(c => /^[-:]+$/.test(c)) ? 'th' : 'td';
      return '<tr>' + cells.map(c => `<${tag} style="padding:8px 12px;border:1px solid #ddd;text-align:left">${c}</${tag}>`).join('') + '</tr>';
    })
    // Paragraphs
    .replace(/\n\n/g, '</p><p style="margin:8px 0">')
    .replace(/\n/g, '<br>');

  // Wrap tables
  html = html.replace(/(<tr>[\s\S]*?<\/tr>)/g, '<table style="border-collapse:collapse;width:100%;margin:12px 0">$1</table>');
  // Wrap lists
  html = html.replace(/(<li[\s\S]*?<\/li>)+/g, '<ul style="padding-left:24px;margin:8px 0">$&</ul>');

  return `<div style="line-height:1.7;font-size:15px"><p style="margin:8px 0">${html}</p></div>`;
}

export default function MarkdownPreview() {
  const theme = useTheme();
  const [markdown, setMarkdown] = useState(defaultMd);

  const insertAtCursor = (before: string, after: string = '') => {
    setMarkdown(prev => prev + before + after);
  };

  const stats = {
    chars: markdown.length,
    words: markdown.trim() ? markdown.trim().split(/\s+/).length : 0,
    lines: markdown.split('\n').length
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 2,
          borderRadius: 3,
          background: theme.palette.surfaceContainerLow
        }}
      >
        {/* Toolbar */}
        <Box sx={{ display: 'flex', gap: 0.5, mb: 2, flexWrap: 'wrap' }}>
          <IconButton size="small" onClick={() => insertAtCursor('**', '**')} title="Жирный"
            sx={{ '&:hover': { background: alpha(theme.palette.primary.main, 0.04) } }}>
            <FormatBold fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => insertAtCursor('*', '*')} title="Курсив"
            sx={{ '&:hover': { background: alpha(theme.palette.primary.main, 0.04) } }}>
            <FormatItalic fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => insertAtCursor('`', '`')} title="Код"
            sx={{ '&:hover': { background: alpha(theme.palette.primary.main, 0.04) } }}>
            <Code fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => insertAtCursor('\n- ')} title="Список"
            sx={{ '&:hover': { background: alpha(theme.palette.primary.main, 0.04) } }}>
            <FormatListBulleted fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => insertAtCursor('\n## ')} title="Заголовок"
            sx={{ '&:hover': { background: alpha(theme.palette.primary.main, 0.04) } }}>
            <Title fontSize="small" />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Chip label={`${stats.chars} символов`} size="small" />
          <Chip label={`${stats.words} слов`} size="small" />
          <Chip label={`${stats.lines} строк`} size="small" />
        </Box>

        <Grid container spacing={2}>
          {/* Editor */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              multiline
              rows={20}
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Markdown..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontFamily: 'monospace',
                  fontSize: '0.875rem'
                }
              }}
            />
          </Grid>

          {/* Preview */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mb: 1 }}>
              <CopyButton text={parseMarkdown(markdown)} />
            </Box>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                minHeight: 440,
                maxHeight: 440,
                overflow: 'auto',
                bgcolor: alpha(theme.palette.background.paper, 0.5)
              }}
            >
              <div dangerouslySetInnerHTML={{ __html: parseMarkdown(markdown) }} />
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
