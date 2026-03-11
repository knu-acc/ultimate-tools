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
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

type MimeCategory = 'all' | 'text' | 'image' | 'audio' | 'video' | 'application' | 'font';

interface MimeEntry {
  ext: string;
  mime: string;
  description: string;
  category: MimeCategory;
}

const MIME_DATA: MimeEntry[] = [
  // Text
  { ext: '.html', mime: 'text/html', description: 'HTML-документ', category: 'text' },
  { ext: '.css', mime: 'text/css', description: 'Таблица стилей CSS', category: 'text' },
  { ext: '.csv', mime: 'text/csv', description: 'Файл CSV', category: 'text' },
  { ext: '.txt', mime: 'text/plain', description: 'Текстовый файл', category: 'text' },
  { ext: '.xml', mime: 'text/xml', description: 'Документ XML', category: 'text' },
  { ext: '.js', mime: 'text/javascript', description: 'JavaScript', category: 'text' },
  { ext: '.mjs', mime: 'text/javascript', description: 'JavaScript модуль', category: 'text' },
  { ext: '.md', mime: 'text/markdown', description: 'Markdown', category: 'text' },
  { ext: '.ics', mime: 'text/calendar', description: 'Календарь iCalendar', category: 'text' },
  // Image
  { ext: '.jpg', mime: 'image/jpeg', description: 'Изображение JPEG', category: 'image' },
  { ext: '.jpeg', mime: 'image/jpeg', description: 'Изображение JPEG', category: 'image' },
  { ext: '.png', mime: 'image/png', description: 'Изображение PNG', category: 'image' },
  { ext: '.gif', mime: 'image/gif', description: 'Анимация GIF', category: 'image' },
  { ext: '.webp', mime: 'image/webp', description: 'Изображение WebP', category: 'image' },
  { ext: '.svg', mime: 'image/svg+xml', description: 'Векторная графика SVG', category: 'image' },
  { ext: '.ico', mime: 'image/x-icon', description: 'Иконка', category: 'image' },
  { ext: '.bmp', mime: 'image/bmp', description: 'Растровый BMP', category: 'image' },
  { ext: '.tiff', mime: 'image/tiff', description: 'Изображение TIFF', category: 'image' },
  { ext: '.avif', mime: 'image/avif', description: 'Изображение AVIF', category: 'image' },
  { ext: '.heic', mime: 'image/heic', description: 'Изображение HEIC', category: 'image' },
  // Audio
  { ext: '.mp3', mime: 'audio/mpeg', description: 'Аудио MP3', category: 'audio' },
  { ext: '.wav', mime: 'audio/wav', description: 'Аудио WAV', category: 'audio' },
  { ext: '.ogg', mime: 'audio/ogg', description: 'Аудио OGG', category: 'audio' },
  { ext: '.flac', mime: 'audio/flac', description: 'Аудио FLAC', category: 'audio' },
  { ext: '.aac', mime: 'audio/aac', description: 'Аудио AAC', category: 'audio' },
  { ext: '.m4a', mime: 'audio/mp4', description: 'Аудио M4A', category: 'audio' },
  { ext: '.weba', mime: 'audio/webm', description: 'Аудио WebM', category: 'audio' },
  { ext: '.opus', mime: 'audio/opus', description: 'Аудио Opus', category: 'audio' },
  { ext: '.midi', mime: 'audio/midi', description: 'MIDI файл', category: 'audio' },
  // Video
  { ext: '.mp4', mime: 'video/mp4', description: 'Видео MP4', category: 'video' },
  { ext: '.webm', mime: 'video/webm', description: 'Видео WebM', category: 'video' },
  { ext: '.avi', mime: 'video/x-msvideo', description: 'Видео AVI', category: 'video' },
  { ext: '.mov', mime: 'video/quicktime', description: 'Видео QuickTime', category: 'video' },
  { ext: '.mkv', mime: 'video/x-matroska', description: 'Видео MKV', category: 'video' },
  { ext: '.wmv', mime: 'video/x-ms-wmv', description: 'Видео WMV', category: 'video' },
  { ext: '.flv', mime: 'video/x-flv', description: 'Видео FLV', category: 'video' },
  { ext: '.mpeg', mime: 'video/mpeg', description: 'Видео MPEG', category: 'video' },
  { ext: '.3gp', mime: 'video/3gpp', description: 'Видео 3GP', category: 'video' },
  // Application
  { ext: '.json', mime: 'application/json', description: 'Данные JSON', category: 'application' },
  { ext: '.pdf', mime: 'application/pdf', description: 'Документ PDF', category: 'application' },
  { ext: '.zip', mime: 'application/zip', description: 'Архив ZIP', category: 'application' },
  { ext: '.gz', mime: 'application/gzip', description: 'Архив GZIP', category: 'application' },
  { ext: '.tar', mime: 'application/x-tar', description: 'Архив TAR', category: 'application' },
  { ext: '.rar', mime: 'application/vnd.rar', description: 'Архив RAR', category: 'application' },
  { ext: '.7z', mime: 'application/x-7z-compressed', description: 'Архив 7-Zip', category: 'application' },
  { ext: '.doc', mime: 'application/msword', description: 'Документ Word', category: 'application' },
  { ext: '.docx', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', description: 'Документ Word (OOXML)', category: 'application' },
  { ext: '.xls', mime: 'application/vnd.ms-excel', description: 'Таблица Excel', category: 'application' },
  { ext: '.xlsx', mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', description: 'Таблица Excel (OOXML)', category: 'application' },
  { ext: '.ppt', mime: 'application/vnd.ms-powerpoint', description: 'Презентация PowerPoint', category: 'application' },
  { ext: '.pptx', mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', description: 'Презентация PowerPoint (OOXML)', category: 'application' },
  { ext: '.odt', mime: 'application/vnd.oasis.opendocument.text', description: 'Документ OpenDocument', category: 'application' },
  { ext: '.ods', mime: 'application/vnd.oasis.opendocument.spreadsheet', description: 'Таблица OpenDocument', category: 'application' },
  { ext: '.exe', mime: 'application/x-msdownload', description: 'Исполняемый файл Windows', category: 'application' },
  { ext: '.dmg', mime: 'application/x-apple-diskimage', description: 'Образ диска macOS', category: 'application' },
  { ext: '.apk', mime: 'application/vnd.android.package-archive', description: 'Пакет Android', category: 'application' },
  { ext: '.iso', mime: 'application/x-iso9660-image', description: 'Образ ISO', category: 'application' },
  { ext: '.swf', mime: 'application/x-shockwave-flash', description: 'Flash SWF', category: 'application' },
  { ext: '.wasm', mime: 'application/wasm', description: 'WebAssembly', category: 'application' },
  { ext: '.sql', mime: 'application/sql', description: 'SQL-скрипт', category: 'application' },
  { ext: '.yaml', mime: 'application/x-yaml', description: 'Файл YAML', category: 'application' },
  { ext: '.bin', mime: 'application/octet-stream', description: 'Бинарные данные', category: 'application' },
  // Font
  { ext: '.woff', mime: 'font/woff', description: 'Шрифт WOFF', category: 'font' },
  { ext: '.woff2', mime: 'font/woff2', description: 'Шрифт WOFF2', category: 'font' },
  { ext: '.ttf', mime: 'font/ttf', description: 'Шрифт TrueType', category: 'font' },
  { ext: '.otf', mime: 'font/otf', description: 'Шрифт OpenType', category: 'font' },
  { ext: '.eot', mime: 'application/vnd.ms-fontobject', description: 'Шрифт EOT', category: 'font' },
];

const CATEGORY_LABELS: Record<MimeCategory, string> = {
  all: 'Все',
  text: 'Текст',
  image: 'Изображения',
  audio: 'Аудио',
  video: 'Видео',
  application: 'Приложения',
  font: 'Шрифты',
};

export default function MimeTypes() {
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<MimeCategory>('all');
  const [copied, setCopied] = useState('');

  const filtered = useMemo(() => {
    return MIME_DATA.filter((m) => {
      if (category !== 'all' && m.category !== category) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          m.ext.toLowerCase().includes(q) ||
          m.mime.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [search, category]);

  const copyMime = (mime: string) => {
    navigator.clipboard.writeText(mime);
    setCopied(mime);
    setTimeout(() => setCopied(''), 1500);
  };

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const m of MIME_DATA) {
      counts[m.category] = (counts[m.category] || 0) + 1;
    }
    return counts;
  }, []);

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
      {/* Search & filter */}
      <Paper
        elevation={0}
        sx={{ p: 2, mb: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: 3 }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 5 }}>
            <TextField
              label="Поиск по расширению или MIME типу"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              fullWidth
              placeholder=".jpg, image/jpeg, PDF..."
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 7 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {(Object.keys(CATEGORY_LABELS) as MimeCategory[]).map((cat) => (
                <Chip
                  key={cat}
                  label={`${CATEGORY_LABELS[cat]}${cat !== 'all' ? ` (${categoryCounts[cat] || 0})` : ''}`}
                  onClick={() => setCategory(cat)}
                  variant={category === cat ? 'filled' : 'outlined'}
                  color={category === cat ? 'primary' : 'default'}
                  size="small"
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Results count */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
        Найдено: {filtered.length} из {MIME_DATA.length}
      </Typography>

      {/* Table */}
      <Paper
        elevation={0}
        sx={{ p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 3 }}
      >
        <Box sx={{ overflowX: 'auto' }}>
          <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <Box component="tr" sx={{ borderBottom: `2px solid ${theme.palette.divider}` }}>
                {['Расширение', 'MIME тип', 'Описание', 'Категория', ''].map((h, i) => (
                  <Box component="th" key={i} sx={{ py: 1, px: 1.5, textAlign: 'left' }}>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>{h}</Typography>
                  </Box>
                ))}
              </Box>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <Box
                  component="tr"
                  key={m.ext + m.mime}
                  onClick={() => copyMime(m.mime)}
                  sx={{
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.04) },
                  }}
                >
                  <Box component="td" sx={{ py: 1.2, px: 1.5 }}>
                    <Chip label={m.ext} size="small" variant="outlined" sx={{ fontFamily: 'monospace', fontWeight: 600 }} />
                  </Box>
                  <Box component="td" sx={{ py: 1.2, px: 1.5 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: 'monospace',
                        fontSize: 12,
                        color: copied === m.mime ? 'success.main' : 'text.primary',
                        fontWeight: copied === m.mime ? 600 : 400,
                      }}
                    >
                      {copied === m.mime ? 'Скопировано!' : m.mime}
                    </Typography>
                  </Box>
                  <Box component="td" sx={{ py: 1.2, px: 1.5 }}>
                    <Typography variant="body2">{m.description}</Typography>
                  </Box>
                  <Box component="td" sx={{ py: 1.2, px: 1.5 }}>
                    <Chip label={CATEGORY_LABELS[m.category]} size="small" variant="outlined" />
                  </Box>
                  <Box component="td" sx={{ py: 1.2, px: 1.5 }}>
                    <ContentCopyIcon sx={{ fontSize: 16, color: 'text.secondary', opacity: 0.5 }} />
                  </Box>
                </Box>
              ))}
              {filtered.length === 0 && (
                <Box component="tr">
                  <Box component="td" colSpan={5} sx={{ py: 4, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Ничего не найдено
                    </Typography>
                  </Box>
                </Box>
              )}
            </tbody>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
