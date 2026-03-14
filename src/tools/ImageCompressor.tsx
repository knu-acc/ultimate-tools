'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Slider,
  Grid,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
  TextField,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import CompressIcon from '@mui/icons-material/Compress';
import DeleteIcon from '@mui/icons-material/Delete';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import CloseIcon from '@mui/icons-material/Close';
import FolderZipIcon from '@mui/icons-material/FolderZip';

type OutputFormat = 'image/jpeg' | 'image/png' | 'image/webp' | 'original';

interface ImageItem {
  id: string;
  file: File;
  originalUrl: string;
  resultUrl: string;
  resultBlob: Blob | null;
  originalSize: number;
  resultSize: number;
  originalWidth: number;
  originalHeight: number;
  processing: boolean;
  done: boolean;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Б';
  const units = ['Б', 'КБ', 'МБ', 'ГБ'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
}

function getMimeForFile(file: File, outputFormat: OutputFormat): string {
  if (outputFormat === 'original') {
    if (file.type === 'image/gif' || file.type === 'image/svg+xml' || file.type === 'image/bmp' || file.type === 'image/tiff') {
      return 'image/png';
    }
    return file.type || 'image/png';
  }
  return outputFormat;
}

function getExtension(mime: string): string {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
  };
  return map[mime] || 'png';
}

let idCounter = 0;

export default function ImageCompressor() {
  const theme = useTheme();
  const [images, setImages] = useState<ImageItem[]>([]);
  const [quality, setQuality] = useState(80);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('image/jpeg');
  const [scalePercent, setScalePercent] = useState(100); // 100 = original size, 50 = half
  const [customScale, setCustomScale] = useState('');
  const [dragging, setDragging] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imagesRef = useRef<ImageItem[]>([]);

  // Keep ref in sync with state for use in callbacks
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  // Process a single image with current settings
  const processOne = useCallback((item: ImageItem, q: number, fmt: OutputFormat, scale: number): Promise<{ url: string; size: number; blob: Blob | null }> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const factor = scale / 100;
        const w = Math.max(1, Math.round(img.width * factor));
        const h = Math.max(1, Math.round(img.height * factor));

        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) { resolve({ url: '', size: 0, blob: null }); return; }

        const mime = getMimeForFile(item.file, fmt);

        ctx.clearRect(0, 0, w, h);
        if (mime === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, w, h);
        }
        ctx.drawImage(img, 0, 0, w, h);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({ url: URL.createObjectURL(blob), size: blob.size, blob });
            } else {
              resolve({ url: '', size: 0, blob: null });
            }
          },
          mime,
          mime === 'image/png' ? undefined : q / 100
        );
      };
      img.onerror = () => resolve({ url: '', size: 0, blob: null });
      img.src = item.originalUrl;
    });
  }, []);

  // Reprocess all images when settings change
  useEffect(() => {
    if (images.length === 0) return;

    let cancelled = false;

    const reprocess = async () => {
      const currentImages = imagesRef.current;
      setImages(prev => prev.map(img => ({ ...img, processing: true })));

      for (const item of currentImages) {
        if (cancelled) break;
        const result = await processOne(item, quality, outputFormat, scalePercent);
        if (cancelled) break;
        setImages(prev => prev.map(img =>
          img.id === item.id
            ? { ...img, resultUrl: result.url, resultBlob: result.blob, resultSize: result.size, processing: false, done: true }
            : img
        ));
      }
    };

    const timer = setTimeout(reprocess, 300);
    return () => { cancelled = true; clearTimeout(timer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quality, outputFormat, scalePercent]);

  const addFiles = useCallback(async (files: File[]) => {
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    if (imageFiles.length === 0) return;

    const newItems: ImageItem[] = [];

    for (const file of imageFiles) {
      const url = URL.createObjectURL(file);
      const dims = await new Promise<{ w: number; h: number }>((resolve) => {
        const img = new Image();
        img.onload = () => resolve({ w: img.width, h: img.height });
        img.onerror = () => resolve({ w: 0, h: 0 });
        img.src = url;
      });

      newItems.push({
        id: `img_${++idCounter}`,
        file,
        originalUrl: url,
        resultUrl: '',
        resultBlob: null,
        originalSize: file.size,
        resultSize: 0,
        originalWidth: dims.w,
        originalHeight: dims.h,
        processing: true,
        done: false,
      });
    }

    setImages(prev => [...prev, ...newItems]);

    // Process new items
    for (const item of newItems) {
      const result = await processOne(item, quality, outputFormat, scalePercent);
      setImages(prev => prev.map(img =>
        img.id === item.id
          ? { ...img, resultUrl: result.url, resultBlob: result.blob, resultSize: result.size, processing: false, done: true }
          : img
      ));
    }
  }, [quality, outputFormat, scalePercent, processOne]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
  }, [addFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    addFiles(files);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [addFiles]);

  // Clipboard paste
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      const files: File[] = [];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) files.push(file);
        }
      }

      if (files.length > 0) {
        e.preventDefault();
        addFiles(files);
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [addFiles]);

  const removeImage = useCallback((id: string) => {
    setImages(prev => {
      const item = prev.find(i => i.id === id);
      if (item) {
        URL.revokeObjectURL(item.originalUrl);
        if (item.resultUrl) URL.revokeObjectURL(item.resultUrl);
      }
      return prev.filter(i => i.id !== id);
    });
  }, []);

  const clearAll = useCallback(() => {
    images.forEach(item => {
      URL.revokeObjectURL(item.originalUrl);
      if (item.resultUrl) URL.revokeObjectURL(item.resultUrl);
    });
    setImages([]);
  }, [images]);

  const downloadOne = useCallback((item: ImageItem) => {
    if (!item.resultUrl) return;
    const mime = getMimeForFile(item.file, outputFormat);
    const ext = getExtension(mime);
    const baseName = item.file.name.replace(/\.[^.]+$/, '');
    const suffix = scalePercent < 100 ? `_${scalePercent}pct` : '_optimized';
    const name = `${baseName}${suffix}.${ext}`;

    const a = document.createElement('a');
    a.href = item.resultUrl;
    a.download = name;
    a.click();
  }, [outputFormat, scalePercent]);

  const downloadAll = useCallback(async () => {
    const currentImages = imagesRef.current;
    const doneImages = currentImages.filter(i => i.done && i.resultUrl && i.resultBlob);
    if (doneImages.length === 0) return;

    if (doneImages.length === 1) {
      downloadOne(doneImages[0]);
      return;
    }

    setDownloading(true);
    try {
      const JSZipModule = (await import('jszip')).default;
      const zip = new JSZipModule();

      const usedNames = new Set<string>();
      for (const item of doneImages) {
        if (!item.resultBlob) continue;
        const mime = getMimeForFile(item.file, outputFormat);
        const ext = getExtension(mime);
        const baseName = item.file.name.replace(/\.[^.]+$/, '');
        const suffix = scalePercent < 100 ? `_${scalePercent}pct` : '_optimized';
        let fileName = `${baseName}${suffix}.${ext}`;

        // Deduplicate filenames
        let counter = 1;
        while (usedNames.has(fileName)) {
          fileName = `${baseName}${suffix}_${counter}.${ext}`;
          counter++;
        }
        usedNames.add(fileName);

        zip.file(fileName, item.resultBlob);
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(zipBlob);
      a.download = `images_${doneImages.length}.zip`;
      a.click();
      URL.revokeObjectURL(a.href);
    } finally {
      setDownloading(false);
    }
  }, [outputFormat, scalePercent, downloadOne]);

  const totalOriginal = images.reduce((s, i) => s + i.originalSize, 0);
  const totalResult = images.reduce((s, i) => s + i.resultSize, 0);
  const totalRatio = totalOriginal > 0 ? ((1 - totalResult / totalOriginal) * 100) : 0;
  const processingCount = images.filter(i => i.processing).length;
  const doneCount = images.filter(i => i.done).length;

  const scalePresets = [
    { label: 'Оригинал', value: 100 },
    { label: '-10%', value: 90 },
    { label: '-20%', value: 80 },
    { label: '-30%', value: 70 },
    { label: '-40%', value: 60 },
    { label: '-50%', value: 50 },
  ];

  const applyCustomScale = () => {
    const val = parseInt(customScale);
    if (val > 0 && val <= 100) {
      setScalePercent(val);
      setCustomScale('');
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />

      {/* Drop Zone */}
      <Paper
        elevation={0}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        sx={{
          p: images.length > 0 ? 3 : 6,
          textAlign: 'center',
          cursor: 'pointer',
          border: `2px dashed ${dragging ? theme.palette.primary.main : theme.palette.divider}`,
          borderRadius: 3,
          backgroundColor: dragging
            ? theme.palette.surfaceContainerLow
            : alpha(theme.palette.background.default, 0.5),
          transition: 'all 250ms ease',
          mb: 2,
          '&:hover': {
            borderColor: theme.palette.primary.main,
            backgroundColor: theme.palette.surfaceContainerLow,
          },
        }}
      >
        <CloudUploadIcon sx={{ fontSize: images.length > 0 ? 36 : 64, color: 'text.secondary', mb: 1, opacity: 0.6 }} />
        <Typography variant={images.length > 0 ? 'body1' : 'h6'} sx={{ mb: 0.5 }}>
          {images.length > 0 ? 'Добавить ещё изображения' : 'Перетащите изображения сюда'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          или нажмите для выбора • Ctrl+V для вставки из буфера
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Chip label="JPEG" size="small" variant="outlined" />
          <Chip label="PNG" size="small" variant="outlined" />
          <Chip label="WebP" size="small" variant="outlined" />
          <Chip label="GIF" size="small" variant="outlined" />
          <Chip label="BMP" size="small" variant="outlined" />
          <Chip label="SVG" size="small" variant="outlined" />
          <Chip label="TIFF" size="small" variant="outlined" />
          <Chip label="AVIF" size="small" variant="outlined" />
          <Chip label="ICO" size="small" variant="outlined" />
        </Box>
      </Paper>

      {images.length > 0 && (
        <>
          {/* Settings */}
          <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, mb: 2, borderRadius: 3 }}>
            <Grid container spacing={3}>
              {/* Compression */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CompressIcon fontSize="small" /> Сжатие
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5, color: 'text.secondary' }}>
                  Качество: {quality}%
                </Typography>
                <Slider
                  value={quality}
                  onChange={(_, v) => setQuality(v as number)}
                  min={1}
                  max={100}
                  valueLabelDisplay="auto"
                  sx={{ mx: 1 }}
                />
                <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                  <InputLabel>Формат</InputLabel>
                  <Select
                    value={outputFormat}
                    label="Формат"
                    onChange={(e) => setOutputFormat(e.target.value as OutputFormat)}
                  >
                    <MenuItem value="original">Оригинальный</MenuItem>
                    <MenuItem value="image/jpeg">JPEG</MenuItem>
                    <MenuItem value="image/png">PNG</MenuItem>
                    <MenuItem value="image/webp">WebP</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Resize */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AspectRatioIcon fontSize="small" /> Размер: {scalePercent}%
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 2 }}>
                  {scalePresets.map((p) => (
                    <Chip
                      key={p.value}
                      label={p.label}
                      size="small"
                      variant={scalePercent === p.value ? 'filled' : 'outlined'}
                      color={scalePercent === p.value ? 'primary' : 'default'}
                      onClick={() => setScalePercent(p.value)}
                      sx={{ cursor: 'pointer' }}
                    />
                  ))}
                </Box>

                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <TextField
                    size="small"
                    label="Свой %"
                    type="number"
                    value={customScale}
                    onChange={(e) => setCustomScale(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') applyCustomScale(); }}
                    inputProps={{ min: 1, max: 100 }}
                    sx={{ width: 100 }}
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={applyCustomScale}
                    disabled={!customScale || parseInt(customScale) < 1 || parseInt(customScale) > 100}
                  >
                    Применить
                  </Button>
                  {scalePercent < 100 && images.length > 0 && images[0].originalWidth > 0 && (
                    <Typography variant="caption" color="text.secondary">
                      {Math.round(images[0].originalWidth * scalePercent / 100)}×{Math.round(images[0].originalHeight * scalePercent / 100)} px
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Stats Bar */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Paper elevation={0} sx={{ p: 1.5, textAlign: 'center', borderRadius: 3 }}>
                <Typography variant="caption" color="text.secondary">Файлов</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>{images.length}</Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Paper elevation={0} sx={{ p: 1.5, textAlign: 'center', borderRadius: 3 }}>
                <Typography variant="caption" color="text.secondary">До</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>{formatFileSize(totalOriginal)}</Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Paper elevation={0} sx={{ p: 1.5, textAlign: 'center', borderRadius: 3 }}>
                <Typography variant="caption" color="text.secondary">После</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {formatFileSize(totalResult)}
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 1.5,
                  textAlign: 'center',
                  borderRadius: 3,
                  background: totalRatio > 0
                    ? alpha(theme.palette.success.main, 0.06)
                    : totalResult > 0 ? alpha(theme.palette.error.main, 0.06) : undefined,
                }}
              >
                <Typography variant="caption" color="text.secondary">Сжатие</Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: totalRatio > 0 ? 'success.main' : totalResult > 0 ? 'error.main' : 'text.primary',
                  }}
                >
                  {totalResult > 0 ? `${totalRatio > 0 ? '-' : '+'}${Math.abs(totalRatio).toFixed(1)}%` : '—'}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Action buttons */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={downloading ? undefined : (images.length > 1 ? <FolderZipIcon /> : <DownloadIcon />)}
              onClick={downloadAll}
              disabled={doneCount === 0 || downloading}
            >
              {downloading
                ? 'Упаковка...'
                : images.length > 1
                  ? `Скачать все (${doneCount} шт.) ZIP`
                  : 'Скачать'
              }
            </Button>
            <Button
              variant="outlined"
              onClick={() => fileInputRef.current?.click()}
              startIcon={<CloudUploadIcon />}
            >
              Добавить
            </Button>
            <Tooltip title="Вставить из буфера (Ctrl+V)">
              <Button variant="outlined" startIcon={<ContentPasteIcon />} onClick={() => {
                navigator.clipboard.read?.().then(async (clipboardItems) => {
                  const files: File[] = [];
                  for (const clipItem of clipboardItems) {
                    for (const type of clipItem.types) {
                      if (type.startsWith('image/')) {
                        const blob = await clipItem.getType(type);
                        files.push(new File([blob], `clipboard_${Date.now()}.${getExtension(type)}`, { type }));
                      }
                    }
                  }
                  if (files.length > 0) addFiles(files);
                }).catch(() => {});
              }}>
                Вставить
              </Button>
            </Tooltip>
            <Button variant="outlined" color="error" onClick={clearAll} startIcon={<DeleteIcon />}>
              Очистить
            </Button>
          </Box>

          {processingCount > 0 && (
            <LinearProgress sx={{ mb: 2, borderRadius: 2 }} />
          )}

          {/* Image list */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {images.map((item) => {
              const ratio = item.originalSize > 0 && item.resultSize > 0
                ? ((1 - item.resultSize / item.originalSize) * 100)
                : 0;
              const newW = Math.round(item.originalWidth * scalePercent / 100);
              const newH = Math.round(item.originalHeight * scalePercent / 100);

              return (
                <Paper
                  key={item.id}
                  elevation={0}
                  sx={{
                    p: 1.5,
                    borderRadius: 2.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    transition: 'background-color 200ms',
                    '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.03) },
                  }}
                >
                  {/* Thumbnail */}
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: 2,
                      overflow: 'hidden',
                      flexShrink: 0,
                      backgroundColor: alpha(theme.palette.background.default, 0.5),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.resultUrl || item.originalUrl}
                      alt={item.file.name}
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }}
                    />
                  </Box>

                  {/* Info */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.file.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.originalWidth}×{item.originalHeight} • {formatFileSize(item.originalSize)}
                      {item.done && (
                        <>
                          {' → '}
                          <Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>
                            {formatFileSize(item.resultSize)}
                          </Box>
                          {scalePercent < 100 && ` • ${newW}×${newH}`}
                        </>
                      )}
                    </Typography>
                    {item.processing && <LinearProgress sx={{ mt: 0.5, borderRadius: 1, height: 2 }} />}
                  </Box>

                  {/* Compression badge */}
                  {item.done && (
                    <Chip
                      label={`${ratio > 0 ? '-' : '+'}${Math.abs(ratio).toFixed(0)}%`}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        color: ratio > 0 ? 'success.main' : 'error.main',
                        bgcolor: ratio > 0
                          ? alpha(theme.palette.success.main, 0.08)
                          : alpha(theme.palette.error.main, 0.08),
                        border: 'none',
                      }}
                    />
                  )}

                  {/* Actions */}
                  <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
                    <Tooltip title="Скачать">
                      <span>
                        <IconButton
                          size="small"
                          onClick={() => downloadOne(item)}
                          disabled={!item.done}
                        >
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Удалить">
                      <IconButton size="small" onClick={() => removeImage(item.id)} color="error">
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Paper>
              );
            })}
          </Box>
        </>
      )}
    </Box>
  );
}
