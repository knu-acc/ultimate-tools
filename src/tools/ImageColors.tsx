'use client';

import { useState, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Chip,
  TextField,
  useTheme,
  alpha
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PaletteIcon from '@mui/icons-material/Palette';
import DeleteIcon from '@mui/icons-material/Delete';
import { CopyButton } from '@/src/components/CopyButton';
import { useLanguage } from '@/src/i18n/LanguageContext';


interface ColorInfo {
  hex: string;
  r: number;
  g: number;
  b: number;
  count: number;
  percentage: number;
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('').toUpperCase();
}

function quantize(value: number, levels: number): number {
  const step = 256 / levels;
  return Math.min(Math.round(Math.floor(value / step) * step + step / 2), 255);
}

function extractColors(imageData: ImageData, maxColors: number = 12): ColorInfo[] {
  const colorMap = new Map<string, { r: number; g: number; b: number; count: number }>();
  const data = imageData.data;
  const totalPixels = data.length / 4;
  const sampleStep = Math.max(1, Math.floor(totalPixels / 10000));

  for (let i = 0; i < data.length; i += 4 * sampleStep) {
    const r = quantize(data[i], 32);
    const g = quantize(data[i + 1], 32);
    const b = quantize(data[i + 2], 32);
    const a = data[i + 3];

    if (a < 128) continue;

    const key = `${r},${g},${b}`;
    const existing = colorMap.get(key);
    if (existing) {
      existing.count++;
    } else {
      colorMap.set(key, { r, g, b, count: 1 });
    }
  }

  const sampledPixels = Math.floor(totalPixels / sampleStep);
  const sorted = Array.from(colorMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, maxColors);

  return sorted.map((c) => ({
    hex: rgbToHex(c.r, c.g, c.b),
    r: c.r,
    g: c.g,
    b: c.b,
    count: c.count,
    percentage: Math.round((c.count / sampledPixels) * 100 * 10) / 10
  }));
}

export default function ImageColors() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const [colors, setColors] = useState<ColorInfo[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const processImage = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setImageUrl(url);

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Scale down for performance
      const maxDim = 300;
      let w = img.width;
      let h = img.height;
      if (w > maxDim || h > maxDim) {
        const scale = maxDim / Math.max(w, h);
        w = Math.floor(w * scale);
        h = Math.floor(h * scale);
      }

      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0, w, h);
      const imageData = ctx.getImageData(0, 0, w, h);
      const extracted = extractColors(imageData, 12);
      setColors(extracted);
    };
    img.src = url;
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        processImage(file);
      }
    },
    [processImage]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processImage(file);
    },
    [processImage]
  );

  const clearAll = useCallback(() => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl('');
    setColors([]);
  }, [imageUrl]);

  const generateCssVariables = useCallback(() => {
    return colors
      .map((c, i) => `  --color-${i + 1}: ${c.hex};`)
      .join('\n');
  }, [colors]);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />

      {!imageUrl ? (
        <Paper
          elevation={0}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          sx={{
            p: 6,
            textAlign: 'center',
            cursor: 'pointer',
            border: `2px dashed ${dragging ? theme.palette.primary.main : theme.palette.divider}`,
            borderRadius: 3,
            backgroundColor: dragging
              ? theme.palette.surfaceContainerLow
              : alpha(theme.palette.background.default, 0.5),
            transitionProperty: 'background-color', transitionDuration: '250ms', transitionTimingFunction: 'ease',
            '&:hover': {
              borderColor: theme.palette.primary.main,
              backgroundColor: theme.palette.surfaceContainerLow
            }
          }}
        >
          <CloudUploadIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.6 }} />
          <Typography variant="h6" sx={{ mb: 1 }}>
            {isEn ? 'Drop an image here' : 'Перетащите изображение сюда'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {isEn ? 'or click to select a file' : 'или нажмите для выбора файла'}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
            <Chip label="PNG" size="small" variant="outlined" />
            <Chip label="JPEG" size="small" variant="outlined" />
            <Chip label="WebP" size="small" variant="outlined" />
          </Box>
        </Paper>
      ) : (
        <>
          {/* Image preview and palette */}
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 5 }}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 3 },
                  borderRadius: 3,
                  bgcolor: theme.palette.surfaceContainerLow,
                  transitionProperty: 'background-color', transitionDuration: '200ms', transitionTimingFunction: 'ease',
                  '&:hover': { background: alpha(theme.palette.primary.main, 0.04) }
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {isEn ? 'Image' : 'Изображение'}
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={clearAll}
                  >
                    {isEn ? 'Clear' : 'Очистить'}
                  </Button>
                </Box>
                <Box
                  sx={{
                    borderRadius: 2,
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: alpha(theme.palette.background.default, 0.5)
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt="Source"
                    style={{ maxWidth: '100%', maxHeight: 300, objectFit: 'contain' }}
                  />
                </Box>

                {/* Color strip */}
                {colors.length > 0 && (
                  <Box
                    sx={{
                      mt: 2,
                      display: 'flex',
                      height: 40,
                      borderRadius: 2,
                      overflow: 'hidden'
                    }}
                  >
                    {colors.map((c, i) => (
                      <Box
                        key={i}
                        sx={{
                          flex: c.percentage,
                          backgroundColor: c.hex,
                          minWidth: 4
                        }}
                      />
                    ))}
                  </Box>
                )}
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 7 }}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 3 },
                  borderRadius: 3,
                  bgcolor: theme.palette.surfaceContainerLow,
                  transitionProperty: 'background-color', transitionDuration: '200ms', transitionTimingFunction: 'ease',
                  '&:hover': { background: alpha(theme.palette.primary.main, 0.04) }
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PaletteIcon fontSize="small" /> {isEn ? `Dominant colors (${colors.length})` : `Доминирующие цвета (${colors.length})`}
                  </Typography>
                </Box>
                <Grid container spacing={1.5}>
                  {colors.map((c, i) => (
                    <Grid size={{ xs: 6, sm: 4 }} key={i}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          transitionProperty: 'background-color', transitionDuration: '150ms', transitionTimingFunction: 'ease',
                          '&:hover': {
                            borderColor: theme.palette.primary.main,
                            backgroundColor: theme.palette.surfaceContainerLow
                          }
                        }}
                      >
                        <Box
                          sx={{
                            width: '100%',
                            height: 48,
                            borderRadius: 1.5,
                            backgroundColor: c.hex,
                            mb: 1,
                            border: `1px solid ${alpha(theme.palette.text.primary, 0.1)}`
                          }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '0.75rem' }}>
                              {c.hex}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                              rgb({c.r}, {c.g}, {c.b})
                            </Typography>
                          </Box>
                          <CopyButton text={c.hex} size="small" />
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {c.percentage}%
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          </Grid>

          {/* CSS Variables export */}
          {colors.length > 0 && (
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 3 },
                mt: 2,
                borderRadius: 3,
                bgcolor: theme.palette.surfaceContainerLow,
                transitionProperty: 'background-color', transitionDuration: '200ms', transitionTimingFunction: 'ease',
                '&:hover': { background: alpha(theme.palette.primary.main, 0.04) }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {isEn ? 'Export as CSS variables' : 'Экспорт как CSS переменные'}
                </Typography>
                <CopyButton text={`:root {\n${generateCssVariables()}\n}`} />
              </Box>
              <TextField
                fullWidth
                multiline
                rows={Math.min(colors.length + 2, 14)}
                value={`:root {\n${generateCssVariables()}\n}`}
                slotProps={{
                  input: {
                    readOnly: true,
                    sx: { fontFamily: 'monospace', fontSize: '0.8rem' }
                  }
                }}
              />
            </Paper>
          )}
        </>
      )}
    </Box>
  );
}
