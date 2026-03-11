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
  Slider,
  MenuItem,
  alpha,
  useTheme
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { CopyButton } from '@/src/components/CopyButton';


interface SitemapEntry {
  id: number;
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: number;
}

export default function SitemapGenerator() {
  const theme = useTheme();
  const [entries, setEntries] = useState<SitemapEntry[]>([]);
  const [loc, setLoc] = useState('');
  const [lastmod, setLastmod] = useState('');
  const [changefreq, setChangefreq] = useState('weekly');
  const [priority, setPriority] = useState(0.5);
  const [bulkText, setBulkText] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [nextId, setNextId] = useState(1);

  const addEntry = () => {
    if (!loc.trim()) return;

    if (editingId !== null) {
      setEntries(
        entries.map((e) =>
          e.id === editingId ? { ...e, loc: loc.trim(), lastmod, changefreq, priority } : e
        )
      );
      setEditingId(null);
    } else {
      setEntries([...entries, { id: nextId, loc: loc.trim(), lastmod, changefreq, priority }]);
      setNextId(nextId + 1);
    }
    setLoc('');
    setLastmod('');
    setChangefreq('weekly');
    setPriority(0.5);
  };

  const editEntry = (entry: SitemapEntry) => {
    setEditingId(entry.id);
    setLoc(entry.loc);
    setLastmod(entry.lastmod);
    setChangefreq(entry.changefreq);
    setPriority(entry.priority);
  };

  const deleteEntry = (id: number) => {
    setEntries(entries.filter((e) => e.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setLoc('');
      setLastmod('');
      setChangefreq('weekly');
      setPriority(0.5);
    }
  };

  const bulkAdd = () => {
    const urls = bulkText
      .split('\n')
      .map((u) => u.trim())
      .filter((u) => u.length > 0);
    let id = nextId;
    const newEntries = urls.map((url) => ({
      id: id++,
      loc: url,
      lastmod: '',
      changefreq: 'weekly',
      priority: 0.5
    }));
    setEntries([...entries, ...newEntries]);
    setNextId(id);
    setBulkText('');
  };

  const generateXml = (): string => {
    const lines: string[] = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ];
    entries.forEach((entry) => {
      lines.push('  <url>');
      lines.push(`    <loc>${escapeXml(entry.loc)}</loc>`);
      if (entry.lastmod) {
        lines.push(`    <lastmod>${entry.lastmod}</lastmod>`);
      }
      lines.push(`    <changefreq>${entry.changefreq}</changefreq>`);
      lines.push(`    <priority>${entry.priority.toFixed(1)}</priority>`);
      lines.push('  </url>');
    });
    lines.push('</urlset>');
    return lines.join('\n');
  };

  const escapeXml = (str: string): string => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  const xml = generateXml();

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Add URL form */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 2,
          borderRadius: 3
        }}
      >
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          {editingId !== null ? 'Редактирование URL' : 'Добавить URL'}
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              size="small"
              label="URL (loc)"
              value={loc}
              onChange={(e) => setLoc(e.target.value)}
              placeholder="https://example.com/page"
              sx={{ '& .MuiInputBase-root': { fontFamily: 'monospace' } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              size="small"
              label="Дата изменения (lastmod)"
              type="date"
              value={lastmod}
              onChange={(e) => setLastmod(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              size="small"
              select
              label="Частота обновления (changefreq)"
              value={changefreq}
              onChange={(e) => setChangefreq(e.target.value)}
            >
              <MenuItem value="always">always</MenuItem>
              <MenuItem value="hourly">hourly</MenuItem>
              <MenuItem value="daily">daily</MenuItem>
              <MenuItem value="weekly">weekly</MenuItem>
              <MenuItem value="monthly">monthly</MenuItem>
              <MenuItem value="yearly">yearly</MenuItem>
              <MenuItem value="never">never</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Приоритет: {priority.toFixed(1)}
            </Typography>
            <Slider
              value={priority}
              onChange={(_, v) => setPriority(v as number)}
              min={0}
              max={1}
              step={0.1}
              marks={[
                { value: 0, label: '0.0' },
                { value: 0.5, label: '0.5' },
                { value: 1, label: '1.0' },
              ]}
              size="small"
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Button
            variant="contained"
            size="small"
            startIcon={editingId !== null ? <EditIcon /> : <AddIcon />}
            onClick={addEntry}
            disabled={!loc.trim()}
            sx={{ borderRadius: 4 }}
          >
            {editingId !== null ? 'Сохранить' : 'Добавить'}
          </Button>
          {editingId !== null && (
            <Button
              size="small"
              onClick={() => {
                setEditingId(null);
                setLoc('');
                setLastmod('');
                setChangefreq('weekly');
                setPriority(0.5);
              }}
              sx={{ borderRadius: 4 }}
            >
              Отмена
            </Button>
          )}
        </Box>
      </Paper>

      {/* Bulk add */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 2,
          borderRadius: 3
        }}
      >
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Массовое добавление
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
          Вставьте URL-адреса, по одному на строку
        </Typography>
        <TextField
          fullWidth
          size="small"
          multiline
          rows={4}
          value={bulkText}
          onChange={(e) => setBulkText(e.target.value)}
          placeholder={'https://example.com/page1\nhttps://example.com/page2\nhttps://example.com/page3'}
          sx={{ mb: 1, '& .MuiInputBase-root': { fontFamily: 'monospace' } }}
        />
        <Button
          size="small"
          startIcon={<AddIcon />}
          onClick={bulkAdd}
          disabled={!bulkText.trim()}
          sx={{ borderRadius: 4 }}
        >
          Добавить все
        </Button>
      </Paper>

      {/* URL list */}
      {entries.length > 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 2,
            borderRadius: 3
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle2" fontWeight={600}>
              Список URL
            </Typography>
            <Chip
              label={`${entries.length} URL`}
              size="small"
              sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}
            />
          </Box>

          {entries.map((entry) => (
            <Paper
              key={entry.id}
              elevation={0}
              sx={{
                p: 1.5,
                mb: 1,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                bgcolor: editingId === entry.id ? theme.palette.surfaceContainerLow : 'transparent'
              }}
            >
              <Box sx={{ flex: 1, overflow: 'hidden' }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {entry.loc}
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                  <Chip label={entry.changefreq} size="small" sx={{ fontSize: '0.7rem', height: 20 }} />
                  <Chip
                    label={`${entry.priority.toFixed(1)}`}
                    size="small"
                    sx={{ fontSize: '0.7rem', height: 20 }}
                  />
                  {entry.lastmod && (
                    <Chip label={entry.lastmod} size="small" sx={{ fontSize: '0.7rem', height: 20 }} />
                  )}
                </Box>
              </Box>
              <IconButton size="small" onClick={() => editEntry(entry)}>
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => deleteEntry(entry.id)} color="error">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Paper>
          ))}
        </Paper>
      )}

      {/* XML Preview */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            XML Предпросмотр
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={`${entries.length} URL`}
              size="small"
              sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}
            />
            <CopyButton text={xml} />
          </Box>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: theme.palette.surfaceContainerLow,
            maxHeight: 400,
            overflow: 'auto'
          }}
        >
          <Typography
            component="pre"
            sx={{
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              m: 0
            }}
          >
            {xml}
          </Typography>
        </Paper>

        <Box sx={{ mt: 1.5 }}>
          <CopyButton text={xml} />
        </Box>
      </Paper>
    </Box>
  );
}
