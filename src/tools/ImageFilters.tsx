'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  Slider,
  alpha,
  useTheme
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import CompareIcon from '@mui/icons-material/Compare';
import { useLanguage } from '@/src/i18n/LanguageContext';

interface FilterState {
  brightness: number;
  contrast: number;
  saturate: number;
  blur: number;
  grayscale: number;
  sepia: number;
  hueRotate: number;
}

const DEFAULT_FILTERS: FilterState = {
  brightness: 100,
  contrast: 100,
  saturate: 100,
  blur: 0,
  grayscale: 0,
  sepia: 0,
  hueRotate: 0
};

interface FilterSliderDef {
  key: keyof FilterState;
  labelRu: string;
  labelEn: string;
  min: number;
  max: number;
  unit: string;
}

const FILTER_SLIDERS: FilterSliderDef[] = [
  { key: 'brightness', labelRu: 'Яркость', labelEn: 'Brightness', min: 0, max: 200, unit: '%' },
  { key: 'contrast', labelRu: 'Контраст', labelEn: 'Contrast', min: 0, max: 200, unit: '%' },
  { key: 'saturate', labelRu: 'Насыщенность', labelEn: 'Saturation', min: 0, max: 200, unit: '%' },
  { key: 'blur', labelRu: 'Размытие', labelEn: 'Blur', min: 0, max: 20, unit: 'px' },
  { key: 'grayscale', labelRu: 'Оттенки серого', labelEn: 'Grayscale', min: 0, max: 100, unit: '%' },
  { key: 'sepia', labelRu: 'Сепия', labelEn: 'Sepia', min: 0, max: 100, unit: '%' },
  { key: 'hueRotate', labelRu: 'Поворот оттенка', labelEn: 'Hue Rotate', min: 0, max: 360, unit: '°' },
];

interface Preset {
  labelRu: string;
  labelEn: string;
  filters: FilterState;
}

const PRESETS: Preset[] = [
  { labelRu: 'Оригинал', labelEn: 'Original', filters: { ...DEFAULT_FILTERS } },
  { labelRu: 'Ч/Б', labelEn: 'B&W', filters: { ...DEFAULT_FILTERS, grayscale: 100 } },
  { labelRu: 'Сепия', labelEn: 'Sepia', filters: { ...DEFAULT_FILTERS, sepia: 80 } },
  { labelRu: 'Яркий', labelEn: 'Vivid', filters: { ...DEFAULT_FILTERS, brightness: 130, contrast: 130, saturate: 150 } },
  { labelRu: 'Тёплый', labelEn: 'Warm', filters: { ...DEFAULT_FILTERS, sepia: 30, saturate: 130, brightness: 110 } },
  { labelRu: 'Холодный', labelEn: 'Cool', filters: { ...DEFAULT_FILTERS, saturate: 80, brightness: 110, hueRotate: 190 } },
];

function buildFilterString(f: FilterState): string {
  return `brightness(${f.brightness}%) contrast(${f.contrast}%) saturate(${f.saturate}%) blur(${f.blur}px) grayscale(${f.grayscale}%) sepia(${f.sepia}%) hue-rotate(${f.hueRotate}deg)`;
}

export default function ImageFilters() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [originalUrl, setOriginalUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [filters, setFilters] = useState<FilterState>({ ...DEFAULT_FILTERS });
  const [dragging, setDragging] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const applyFilters = useCallback(() => {
    if (!image || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.filter = buildFilterString(filters);
    ctx.drawImage(image, 0, 0);
    ctx.filter = 'none';
  }, [image, filters]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    setFileName(file.name);
    const url = URL.createObjectURL(file);
    setOriginalUrl(url);
    const img = new Image();
    img.onload = () => setImage(img);
    img.src = url;
    setFilters({ ...DEFAULT_FILTERS });
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const downloadFiltered = useCallback(() => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = fileName.replace(/\.[^.]+$/, '') + '_filtered.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  }, [fileName]);

  const clearImage = useCallback(() => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    setImage(null);
    setOriginalUrl('');
    setFileName('');
    setFilters({ ...DEFAULT_FILTERS });
  }, [originalUrl]);

  const updateFilter = (key: keyof FilterState, value: number) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />

      {!image && (
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
            {isEn ? 'Drag and drop an image here' : 'Перетащите изображение сюда'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isEn ? 'or click to select a file' : 'или нажмите для выбора файла'}
          </Typography>
        </Paper>
      )}

      {image && (
        <>
          {/* Presets */}
          <Paper
            elevation={0}
            sx={{ p: { xs: 2, sm: 3 }, mb: 2, borderRadius: 3 }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5 }}>
              {isEn ? 'Presets' : 'Пресеты'}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {PRESETS.map((preset) => (
                <Chip
                  key={preset.labelRu}
                  label={isEn ? preset.labelEn : preset.labelRu}
                  onClick={() => setFilters({ ...preset.filters })}
                  variant="outlined"
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Box>
          </Paper>

          {/* Sliders */}
          <Paper
            elevation={0}
            sx={{ p: { xs: 2, sm: 3 }, mb: 2, borderRadius: 3 }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
              {isEn ? 'Filter Settings' : 'Настройки фильтров'}
            </Typography>
            <Grid container spacing={2}>
              {FILTER_SLIDERS.map((s) => (
                <Grid key={s.key} size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    {isEn ? s.labelEn : s.labelRu}: {filters[s.key]}{s.unit}
                  </Typography>
                  <Slider
                    value={filters[s.key]}
                    onChange={(_, v) => updateFilter(s.key, v as number)}
                    min={s.min}
                    max={s.max}
                    step={s.key === 'blur' ? 0.5 : 1}
                    size="small"
                  />
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Actions */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Button variant="contained" startIcon={<DownloadIcon />} onClick={downloadFiltered}>
              {isEn ? 'Download Result' : 'Скачать результат'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => setFilters({ ...DEFAULT_FILTERS })}
            >
              {isEn ? 'Reset' : 'Сбросить'}
            </Button>
            <Button variant="outlined" color="error" onClick={clearImage} sx={{ minWidth: 48 }}>
              <DeleteIcon />
            </Button>
          </Box>

          {/* Preview */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper
                elevation={0}
                sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <CompareIcon fontSize="small" color="action" />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {isEn ? 'Original' : 'Оригинал'}
                  </Typography>
                </Box>
                <Box
                  component="img"
                  src={originalUrl}
                  alt="Original"
                  sx={{
                    width: '100%',
                    maxHeight: 400,
                    objectFit: 'contain',
                    borderRadius: 2,
                    display: 'block'
                  }}
                />
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper
                elevation={0}
                sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <CompareIcon fontSize="small" color="primary" />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {isEn ? 'Result' : 'Результат'}
                  </Typography>
                </Box>
                <Box
                  component="canvas"
                  ref={canvasRef}
                  sx={{
                    width: '100%',
                    maxHeight: 400,
                    objectFit: 'contain',
                    borderRadius: 2,
                    display: 'block'
                  }}
                />
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
}
