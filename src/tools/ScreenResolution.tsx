'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  TextField,
  useTheme,
  alpha
} from '@mui/material';
import MonitorIcon from '@mui/icons-material/Monitor';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import TabletIcon from '@mui/icons-material/Tablet';
import LaptopIcon from '@mui/icons-material/Laptop';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import { useLanguage } from '@/src/i18n/LanguageContext';

type Category = 'all' | 'desktop' | 'laptop' | 'tablet' | 'phone';

interface ScreenInfo {
  name: string;
  nameEn?: string;
  width: number;
  height: number;
  aspect: string;
  ppi: number;
  category: Category;
}

const RESOLUTIONS: ScreenInfo[] = [
  // Desktop
  { name: 'HD (720p)', width: 1280, height: 720, aspect: '16:9', ppi: 0, category: 'desktop' },
  { name: 'Full HD (1080p)', width: 1920, height: 1080, aspect: '16:9', ppi: 82, category: 'desktop' },
  { name: 'QHD (1440p)', width: 2560, height: 1440, aspect: '16:9', ppi: 109, category: 'desktop' },
  { name: '4K UHD', width: 3840, height: 2160, aspect: '16:9', ppi: 163, category: 'desktop' },
  { name: '5K', width: 5120, height: 2880, aspect: '16:9', ppi: 218, category: 'desktop' },
  { name: '8K UHD', width: 7680, height: 4320, aspect: '16:9', ppi: 326, category: 'desktop' },
  { name: 'Ultrawide FHD', width: 2560, height: 1080, aspect: '21:9', ppi: 82, category: 'desktop' },
  { name: 'Ultrawide QHD', width: 3440, height: 1440, aspect: '21:9', ppi: 109, category: 'desktop' },
  { name: 'Super Ultrawide', width: 5120, height: 1440, aspect: '32:9', ppi: 109, category: 'desktop' },
  // Laptop
  { name: 'MacBook Air 13"', width: 2560, height: 1600, aspect: '16:10', ppi: 227, category: 'laptop' },
  { name: 'MacBook Pro 14"', width: 3024, height: 1964, aspect: '3:2', ppi: 254, category: 'laptop' },
  { name: 'MacBook Pro 16"', width: 3456, height: 2234, aspect: '3:2', ppi: 254, category: 'laptop' },
  { name: 'Ноутбук HD', nameEn: 'Laptop HD', width: 1366, height: 768, aspect: '16:9', ppi: 112, category: 'laptop' },
  { name: 'Ноутбук FHD 14"', nameEn: 'Laptop FHD 14"', width: 1920, height: 1080, aspect: '16:9', ppi: 157, category: 'laptop' },
  { name: 'Ноутбук FHD 15.6"', nameEn: 'Laptop FHD 15.6"', width: 1920, height: 1080, aspect: '16:9', ppi: 141, category: 'laptop' },
  { name: 'Ноутбук QHD 14"', nameEn: 'Laptop QHD 14"', width: 2560, height: 1440, aspect: '16:9', ppi: 210, category: 'laptop' },
  // Tablet
  { name: 'iPad 10.9"', width: 2360, height: 1640, aspect: '3:2', ppi: 264, category: 'tablet' },
  { name: 'iPad Pro 11"', width: 2388, height: 1668, aspect: '3:2', ppi: 264, category: 'tablet' },
  { name: 'iPad Pro 12.9"', width: 2732, height: 2048, aspect: '4:3', ppi: 264, category: 'tablet' },
  { name: 'iPad Mini', width: 2266, height: 1488, aspect: '3:2', ppi: 326, category: 'tablet' },
  { name: 'Samsung Tab S9', width: 2560, height: 1600, aspect: '16:10', ppi: 274, category: 'tablet' },
  { name: 'Android Планшет HD', nameEn: 'Android Tablet HD', width: 1280, height: 800, aspect: '16:10', ppi: 189, category: 'tablet' },
  // Phone
  { name: 'iPhone 15 Pro Max', width: 2796, height: 1290, aspect: '19.5:9', ppi: 460, category: 'phone' },
  { name: 'iPhone 15 Pro', width: 2556, height: 1179, aspect: '19.5:9', ppi: 460, category: 'phone' },
  { name: 'iPhone 15', width: 2556, height: 1179, aspect: '19.5:9', ppi: 460, category: 'phone' },
  { name: 'iPhone SE', width: 1334, height: 750, aspect: '16:9', ppi: 326, category: 'phone' },
  { name: 'Samsung Galaxy S24', width: 2340, height: 1080, aspect: '19.5:9', ppi: 416, category: 'phone' },
  { name: 'Samsung Galaxy S24 Ultra', width: 3120, height: 1440, aspect: '19.5:9', ppi: 505, category: 'phone' },
  { name: 'Pixel 8', width: 2400, height: 1080, aspect: '20:9', ppi: 428, category: 'phone' },
  { name: 'Pixel 8 Pro', width: 2992, height: 1344, aspect: '20:9', ppi: 489, category: 'phone' },
];

export default function ScreenResolution() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category>('all');
  const [screenInfo, setScreenInfo] = useState({ width: 0, height: 0, pixelRatio: 1, colorDepth: 0 });

  const categoryLabels: Record<Category, { label: string; icon: React.ReactNode }> = {
    all: { label: isEn ? 'All' : 'Все', icon: <MonitorIcon fontSize="small" /> },
    desktop: { label: isEn ? 'Desktop' : 'Десктоп', icon: <DesktopWindowsIcon fontSize="small" /> },
    laptop: { label: isEn ? 'Laptop' : 'Ноутбук', icon: <LaptopIcon fontSize="small" /> },
    tablet: { label: isEn ? 'Tablet' : 'Планшет', icon: <TabletIcon fontSize="small" /> },
    phone: { label: isEn ? 'Phone' : 'Телефон', icon: <PhoneAndroidIcon fontSize="small" /> }
  };

  function formatPixels(total: number): string {
    if (total >= 1000000) return `${(total / 1000000).toFixed(2)} ${isEn ? 'MP' : 'Мп'}`;
    return `${(total / 1000).toFixed(0)} ${isEn ? 'KP' : 'Кп'}`;
  }

  useEffect(() => {
    setScreenInfo({
      width: window.screen.width,
      height: window.screen.height,
      pixelRatio: window.devicePixelRatio || 1,
      colorDepth: window.screen.colorDepth
    });
  }, []);

  const filtered = RESOLUTIONS.filter((r) => {
    if (category !== 'all' && r.category !== category) return false;
    if (search) {
      const q = search.toLowerCase();
      const displayName = isEn && r.nameEn ? r.nameEn : r.name;
      return (
        displayName.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        `${r.width}x${r.height}`.includes(q) ||
        `${r.width} x ${r.height}`.includes(q) ||
        r.aspect.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const tableHeaders = isEn
    ? ['Name', 'Resolution', 'Aspect', 'Pixels', 'PPI', 'Category']
    : ['Название', 'Разрешение', 'Пропорции', 'Пиксели', 'PPI', 'Категория'];

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Current screen */}
      <Paper
        elevation={0}
        sx={{ p: { xs: 2, sm: 3 }, mb: 2, borderRadius: 3 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <MonitorIcon color="primary" />
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {isEn ? 'Your screen' : 'Ваш экран'}
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Paper
              elevation={0}
              sx={{ p: 2, textAlign: 'center', borderRadius: 3, transition: 'all 200ms ease', '&:hover': { background: alpha(theme.palette.primary.main, 0.04) } }}
            >
              <Typography variant="caption" color="text.secondary">{isEn ? 'Resolution' : 'Разрешение'}</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {screenInfo.width} x {screenInfo.height}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Paper
              elevation={0}
              sx={{ p: 2, textAlign: 'center', borderRadius: 3, transition: 'all 200ms ease', '&:hover': { background: alpha(theme.palette.primary.main, 0.04) } }}
            >
              <Typography variant="caption" color="text.secondary">{isEn ? 'Physical' : 'Физическое'}</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {Math.round(screenInfo.width * screenInfo.pixelRatio)} x {Math.round(screenInfo.height * screenInfo.pixelRatio)}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Paper
              elevation={0}
              sx={{ p: 2, textAlign: 'center', borderRadius: 3, transition: 'all 200ms ease', '&:hover': { background: alpha(theme.palette.primary.main, 0.04) } }}
            >
              <Typography variant="caption" color="text.secondary">Pixel Ratio</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {screenInfo.pixelRatio}x
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Paper
              elevation={0}
              sx={{ p: 2, textAlign: 'center', borderRadius: 3, transition: 'all 200ms ease', '&:hover': { background: alpha(theme.palette.primary.main, 0.04) } }}
            >
              <Typography variant="caption" color="text.secondary">{isEn ? 'Color depth' : 'Глубина цвета'}</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {screenInfo.colorDepth} {isEn ? 'bit' : 'бит'}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      {/* Search & filters */}
      <Paper
        elevation={0}
        sx={{ p: { xs: 2, sm: 3 }, mb: 2, borderRadius: 3 }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              placeholder={isEn ? 'Search by name or resolution' : 'Поиск по названию или разрешению'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {(Object.keys(categoryLabels) as Category[]).map((cat) => (
                <Chip
                  key={cat}
                  label={categoryLabels[cat].label}
                  icon={categoryLabels[cat].icon as React.ReactElement}
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

      {/* Table */}
      <Paper
        elevation={0}
        sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}
      >
        <Box sx={{ overflowX: 'auto' }}>
          <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <Box component="tr" sx={{ borderBottom: `2px solid ${theme.palette.divider}` }}>
                {tableHeaders.map((h) => (
                  <Box component="th" key={h} sx={{ py: 1, px: 1.5, textAlign: 'left' }}>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>{h}</Typography>
                  </Box>
                ))}
              </Box>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <Box
                  component="tr"
                  key={r.name}
                  sx={{
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    '&:hover': { backgroundColor: theme.palette.surfaceContainerLow }
                  }}
                >
                  <Box component="td" sx={{ py: 1.2, px: 1.5 }}>
                    <Typography variant="body2">{isEn && r.nameEn ? r.nameEn : r.name}</Typography>
                  </Box>
                  <Box component="td" sx={{ py: 1.2, px: 1.5 }}>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {r.width} x {r.height}
                    </Typography>
                  </Box>
                  <Box component="td" sx={{ py: 1.2, px: 1.5 }}>
                    <Chip label={r.aspect} size="small" variant="outlined" />
                  </Box>
                  <Box component="td" sx={{ py: 1.2, px: 1.5 }}>
                    <Typography variant="body2">{formatPixels(r.width * r.height)}</Typography>
                  </Box>
                  <Box component="td" sx={{ py: 1.2, px: 1.5 }}>
                    <Typography variant="body2">{r.ppi > 0 ? r.ppi : '—'}</Typography>
                  </Box>
                  <Box component="td" sx={{ py: 1.2, px: 1.5 }}>
                    <Chip
                      label={categoryLabels[r.category].label}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </Box>
              ))}
              {filtered.length === 0 && (
                <Box component="tr">
                  <Box component="td" colSpan={6} sx={{ py: 4, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      {isEn ? 'Nothing found' : 'Ничего не найдено'}
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
