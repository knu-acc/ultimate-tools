'use client';

import { useState, useCallback } from 'react';
import {
  Box, Typography, Paper, Grid, Button, Chip, TextField, alpha, useTheme
} from '@mui/material';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { CopyButton } from '@/src/components/CopyButton';
import { useLanguage } from '@/src/i18n/LanguageContext';

interface AspectPreset {
  label: string;
  w: number;
  h: number;
}

const PRESETS: AspectPreset[] = [
  { label: '16:9', w: 16, h: 9 },
  { label: '4:3', w: 4, h: 3 },
  { label: '21:9', w: 21, h: 9 },
  { label: '1:1', w: 1, h: 1 },
  { label: '9:16', w: 9, h: 16 },
];

interface Resolution {
  name: string;
  width: number;
  height: number;
  aspect: string;
}

const COMMON_RESOLUTIONS: Resolution[] = [
  { name: 'SD (480p)', width: 640, height: 480, aspect: '4:3' },
  { name: 'HD (720p)', width: 1280, height: 720, aspect: '16:9' },
  { name: 'Full HD (1080p)', width: 1920, height: 1080, aspect: '16:9' },
  { name: 'QHD (1440p)', width: 2560, height: 1440, aspect: '16:9' },
  { name: '4K UHD', width: 3840, height: 2160, aspect: '16:9' },
  { name: '8K UHD', width: 7680, height: 4320, aspect: '16:9' },
  { name: 'Instagram Post', width: 1080, height: 1080, aspect: '1:1' },
  { name: 'Instagram Reels', width: 1080, height: 1920, aspect: '9:16' },
  { name: 'YouTube Shorts', width: 1080, height: 1920, aspect: '9:16' },
  { name: 'TikTok', width: 1080, height: 1920, aspect: '9:16' },
  { name: 'Ultrawide', width: 2560, height: 1080, aspect: '21:9' },
  { name: 'Super Ultrawide', width: 3440, height: 1440, aspect: '21:9' },
  { name: 'DCI 4K (Cinema)', width: 4096, height: 2160, aspect: '256:135' },
  { name: 'Cinemascope', width: 2560, height: 1080, aspect: '21:9' },
];

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function getAspectRatio(w: number, h: number): string {
  if (w <= 0 || h <= 0) return '—';
  const d = gcd(w, h);
  return `${w / d}:${h / d}`;
}

export default function VideoAspect() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const [width, setWidth] = useState('1920');
  const [height, setHeight] = useState('1080');
  const [locked, setLocked] = useState(false);
  const [lockedRatio, setLockedRatio] = useState<{ w: number; h: number } | null>(null);

  const w = parseInt(width) || 0;
  const h = parseInt(height) || 0;
  const ratio = getAspectRatio(w, h);

  const handleLockToggle = () => {
    if (!locked && w > 0 && h > 0) {
      const d = gcd(w, h);
      setLockedRatio({ w: w / d, h: h / d });
      setLocked(true);
    } else {
      setLocked(false);
      setLockedRatio(null);
    }
  };

  const handleWidthChange = useCallback((val: string) => {
    const num = val.replace(/\D/g, '');
    setWidth(num);
    if (locked && lockedRatio && parseInt(num) > 0) {
      setHeight(String(Math.round((parseInt(num) * lockedRatio.h) / lockedRatio.w)));
    }
  }, [locked, lockedRatio]);

  const handleHeightChange = useCallback((val: string) => {
    const num = val.replace(/\D/g, '');
    setHeight(num);
    if (locked && lockedRatio && parseInt(num) > 0) {
      setWidth(String(Math.round((parseInt(num) * lockedRatio.w) / lockedRatio.h)));
    }
  }, [locked, lockedRatio]);

  const applyPreset = (preset: AspectPreset) => {
    const d = gcd(preset.w, preset.h);
    setLockedRatio({ w: preset.w / d, h: preset.h / d });
    setLocked(true);
    const resolution = COMMON_RESOLUTIONS.find((r) => r.aspect === preset.label);
    if (resolution) {
      setWidth(String(resolution.width));
      setHeight(String(resolution.height));
    } else {
      setWidth(String(preset.w * 120));
      setHeight(String(preset.h * 120));
    }
  };

  const applyResolution = (res: Resolution) => {
    setWidth(String(res.width));
    setHeight(String(res.height));
    const d = gcd(res.width, res.height);
    setLockedRatio({ w: res.width / d, h: res.height / d });
    setLocked(true);
  };

  const maxPreviewSize = 250;
  let previewW = maxPreviewSize;
  let previewH = maxPreviewSize;
  if (w > 0 && h > 0) {
    if (w >= h) {
      previewW = maxPreviewSize;
      previewH = Math.round((h / w) * maxPreviewSize);
    } else {
      previewH = maxPreviewSize;
      previewW = Math.round((w / h) * maxPreviewSize);
    }
  }

  return (
    <Box sx={{
      maxWidth: 800,
      mx: 'auto',
      mb: 2,
      borderRadius: 3,
      bgcolor: theme.palette.surfaceContainerLow,
      p: { xs: 2, sm: 3 },
      transition: 'background 0.2s ease',
      '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) }
    }}>
      {/* Input */}
      <Paper
        elevation={0}
        sx={{ p: { xs: 2, sm: 3 }, mb: 2, borderRadius: 3 }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              value={width}
              onChange={(e) => handleWidthChange(e.target.value)}
              fullWidth
              size="small"
              placeholder={isEn ? 'Width (px)' : 'Ширина (px)'}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 1 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Button
                onClick={handleLockToggle}
                variant={locked ? 'contained' : 'outlined'}
                sx={{ minWidth: 40, width: 40, height: 40 }}
              >
                {locked ? <LockIcon fontSize="small" /> : <LockOpenIcon fontSize="small" />}
              </Button>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              value={height}
              onChange={(e) => handleHeightChange(e.target.value)}
              fullWidth
              size="small"
              placeholder={isEn ? 'Height (px)' : 'Высота (px)'}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <CopyButton text={`${w}x${h} (${ratio})`} tooltip={isEn ? 'Copy' : 'Копировать'} />
          </Grid>
        </Grid>

        {locked && (
          <Typography variant="caption" color="primary" sx={{ mt: 1, display: 'block' }}>
            {isEn ? 'Aspect ratio locked. Changing one value will automatically recalculate the other.' : 'Пропорции заблокированы. Изменение одного значения автоматически пересчитает другое.'}
          </Typography>
        )}
      </Paper>

      {/* Ratio and Preview */}
      <Grid container spacing={3} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              textAlign: 'center',
              borderRadius: 3,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <AspectRatioIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {ratio}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {w > 0 && h > 0 ? `${w} x ${h} ${isEn ? 'pixels' : 'пикселей'}` : (isEn ? 'Enter dimensions' : 'Введите размеры')}
            </Typography>
            {w > 0 && h > 0 && (
              <Typography variant="caption" color="text.secondary">
                {(w * h / 1000000).toFixed(2)} {isEn ? 'megapixels' : 'мегапикселей'}
              </Typography>
            )}
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Box
              sx={{
                width: previewW,
                height: previewH,
                border: `2px solid ${theme.palette.primary.main}`,
                borderRadius: 2,
                backgroundColor: theme.palette.surfaceContainerHigh,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transitionProperty: 'background-color', transitionDuration: '300ms', transitionTimingFunction: 'ease'
              }}
            >
              <Typography variant="caption" color="primary" sx={{ fontWeight: 600 }}>
                {ratio}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Presets */}
      <Paper
        elevation={0}
        sx={{ p: { xs: 2, sm: 3 }, mb: 2, borderRadius: 3 }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5 }}>
          {isEn ? 'Aspect ratios' : 'Пропорции'}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {PRESETS.map((p) => (
            <Chip
              key={p.label}
              label={p.label}
              onClick={() => applyPreset(p)}
              variant={ratio === p.label ? 'filled' : 'outlined'}
              color={ratio === p.label ? 'primary' : 'default'}
              sx={{ cursor: 'pointer' }}
            />
          ))}
        </Box>
      </Paper>

      {/* Resolution table */}
      <Paper
        elevation={0}
        sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
          {isEn ? 'Common resolutions' : 'Распространённые разрешения'}
        </Typography>
        <Box sx={{ overflowX: 'auto' }}>
          <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <Box component="tr" sx={{ borderBottom: `2px solid ${theme.palette.divider}` }}>
                <Box component="th" sx={{ py: 1, px: 1.5, textAlign: 'left' }}>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>{isEn ? 'Name' : 'Название'}</Typography>
                </Box>
                <Box component="th" sx={{ py: 1, px: 1.5, textAlign: 'left' }}>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>{isEn ? 'Resolution' : 'Разрешение'}</Typography>
                </Box>
                <Box component="th" sx={{ py: 1, px: 1.5, textAlign: 'left' }}>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>{isEn ? 'Aspect ratio' : 'Пропорции'}</Typography>
                </Box>
                <Box component="th" sx={{ py: 1, px: 1.5, textAlign: 'right' }}>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>{isEn ? 'Action' : 'Действие'}</Typography>
                </Box>
              </Box>
            </thead>
            <tbody>
              {COMMON_RESOLUTIONS.map((res) => (
                <Box
                  component="tr"
                  key={res.name}
                  sx={{
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    '&:hover': { backgroundColor: theme.palette.surfaceContainerLow }
                  }}
                >
                  <Box component="td" sx={{ py: 1.2, px: 1.5 }}>
                    <Typography variant="body2">{res.name}</Typography>
                  </Box>
                  <Box component="td" sx={{ py: 1.2, px: 1.5 }}>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {res.width} x {res.height}
                    </Typography>
                  </Box>
                  <Box component="td" sx={{ py: 1.2, px: 1.5 }}>
                    <Chip label={res.aspect} size="small" variant="outlined" />
                  </Box>
                  <Box component="td" sx={{ py: 1.2, px: 1.5, textAlign: 'right' }}>
                    <Button size="small" onClick={() => applyResolution(res)}>
                      {isEn ? 'Apply' : 'Применить'}
                    </Button>
                  </Box>
                </Box>
              ))}
            </tbody>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
