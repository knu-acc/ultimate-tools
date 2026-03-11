'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Grid,
  Button,
  IconButton,
  Tooltip,
  Chip,
  MenuItem,
  alpha,
  useTheme
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import { CopyButton } from '@/src/components/CopyButton';


interface Rule {
  id: number;
  type: 'Allow' | 'Disallow';
  path: string;
}

export default function RobotsGenerator() {
  const theme = useTheme();
  const [userAgent, setUserAgent] = useState('*');
  const [rules, setRules] = useState<Rule[]>([{ id: 1, type: 'Disallow', path: '' }]);
  const [sitemapUrl, setSitemapUrl] = useState('');
  const [crawlDelay, setCrawlDelay] = useState('');
  const [nextId, setNextId] = useState(2);

  const addRule = () => {
    setRules([...rules, { id: nextId, type: 'Disallow', path: '' }]);
    setNextId(nextId + 1);
  };

  const removeRule = (id: number) => {
    if (rules.length > 1) {
      setRules(rules.filter((r) => r.id !== id));
    }
  };

  const updateRule = (id: number, field: 'type' | 'path', value: string) => {
    setRules(rules.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const applyPreset = (preset: 'allow' | 'disallow' | 'standard') => {
    switch (preset) {
      case 'allow':
        setUserAgent('*');
        setRules([{ id: nextId, type: 'Allow', path: '/' }]);
        setNextId(nextId + 1);
        break;
      case 'disallow':
        setUserAgent('*');
        setRules([{ id: nextId, type: 'Disallow', path: '/' }]);
        setNextId(nextId + 1);
        break;
      case 'standard':
        setUserAgent('*');
        setRules([
          { id: nextId, type: 'Disallow', path: '/admin/' },
          { id: nextId + 1, type: 'Disallow', path: '/private/' },
          { id: nextId + 2, type: 'Disallow', path: '/tmp/' },
          { id: nextId + 3, type: 'Allow', path: '/' },
        ]);
        setNextId(nextId + 4);
        break;
    }
  };

  const generateContent = (): string => {
    const lines: string[] = [];
    lines.push(`User-agent: ${userAgent}`);
    rules.forEach((rule) => {
      if (rule.path !== undefined) {
        lines.push(`${rule.type}: ${rule.path}`);
      }
    });
    if (crawlDelay) {
      lines.push(`Crawl-delay: ${crawlDelay}`);
    }
    lines.push('');
    if (sitemapUrl) {
      lines.push(`Sitemap: ${sitemapUrl}`);
    }
    return lines.join('\n').trimEnd();
  };

  const content = generateContent();

  const downloadFile = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'robots.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Presets */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 2,
          borderRadius: 3
        }}
      >
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Шаблоны
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label="Разрешить всё"
            onClick={() => applyPreset('allow')}
            sx={{
              cursor: 'pointer',
              bgcolor: alpha(theme.palette.success.main, 0.1),
              '&:hover': { bgcolor: alpha(theme.palette.success.main, 0.2) }
            }}
          />
          <Chip
            label="Запретить всё"
            onClick={() => applyPreset('disallow')}
            sx={{
              cursor: 'pointer',
              bgcolor: alpha(theme.palette.error.main, 0.1),
              '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.2) }
            }}
          />
          <Chip
            label="Стандартный"
            onClick={() => applyPreset('standard')}
            sx={{
              cursor: 'pointer',
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
            }}
          />
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Settings */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3
            }}
          >
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Настройки
            </Typography>

            <TextField
              fullWidth
              size="small"
              label="User-agent"
              value={userAgent}
              onChange={(e) => setUserAgent(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ mb: 1 }}>
              Правила
            </Typography>
            {rules.map((rule) => (
              <Box key={rule.id} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                <TextField
                  size="small"
                  select
                  value={rule.type}
                  onChange={(e) => updateRule(rule.id, 'type', e.target.value)}
                  sx={{ width: 130 }}
                >
                  <MenuItem value="Allow">Allow</MenuItem>
                  <MenuItem value="Disallow">Disallow</MenuItem>
                </TextField>
                <TextField
                  size="small"
                  placeholder="/path/"
                  value={rule.path}
                  onChange={(e) => updateRule(rule.id, 'path', e.target.value)}
                  sx={{ flex: 1, '& .MuiInputBase-root': { fontFamily: 'monospace' } }}
                />
                <IconButton
                  size="small"
                  onClick={() => removeRule(rule.id)}
                  disabled={rules.length <= 1}
                  color="error"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}

            <Button
              size="small"
              startIcon={<AddIcon />}
              onClick={addRule}
              sx={{ mb: 2, borderRadius: 4 }}
            >
              Добавить правило
            </Button>

            <TextField
              fullWidth
              size="small"
              label="Sitemap URL"
              value={sitemapUrl}
              onChange={(e) => setSitemapUrl(e.target.value)}
              placeholder="https://example.com/sitemap.xml"
              sx={{ mb: 2, '& .MuiInputBase-root': { fontFamily: 'monospace' } }}
            />

            <TextField
              fullWidth
              size="small"
              label="Crawl-delay (секунды)"
              type="number"
              value={crawlDelay}
              onChange={(e) => setCrawlDelay(e.target.value)}
              slotProps={{ htmlInput: { min: 0 } }}
            />
          </Paper>
        </Grid>

        {/* Preview */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle2" fontWeight={600}>
                Предпросмотр robots.txt
              </Typography>
              <CopyButton text={content} />
            </Box>

            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: theme.palette.surfaceContainerLow,
                minHeight: 200
              }}
            >
              <Typography
                component="pre"
                sx={{
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  whiteSpace: 'pre-wrap',
                  m: 0
                }}
              >
                {content}
              </Typography>
            </Paper>

            <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
              <CopyButton text={content} />
              <Button
                size="small"
                startIcon={<DownloadIcon />}
                onClick={downloadFile}
                sx={{ borderRadius: 4 }}
              >
                Скачать robots.txt
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
