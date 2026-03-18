'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  TextField,
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import CropIcon from '@mui/icons-material/Crop';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useLanguage } from '@/src/i18n/LanguageContext';

function formatFileSize(bytes: number, isEn: boolean = false): string {
  if (bytes === 0) return isEn ? '0 B' : '0 Б';
  const units = isEn ? ['B', 'KB', 'MB', 'GB'] : ['Б', 'КБ', 'МБ', 'ГБ'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
}

interface CropRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export default function ImageCrop() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [croppedUrl, setCroppedUrl] = useState<string>('');
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [croppedSize, setCroppedSize] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [cropRect, setCropRect] = useState<CropRect>({ x: 0, y: 0, w: 0, h: 0 });
  const [isDraggingCrop, setIsDraggingCrop] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [displayScale, setDisplayScale] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cropCanvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const drawCropOverlay = useCallback((rect: CropRect) => {
    const canvas = cropCanvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Dark overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Clear crop area
    const sx = rect.x * displayScale;
    const sy = rect.y * displayScale;
    const sw = rect.w * displayScale;
    const sh = rect.h * displayScale;

    if (sw > 0 && sh > 0) {
      ctx.clearRect(sx, sy, sw, sh);
      ctx.drawImage(
        img,
        rect.x, rect.y, rect.w, rect.h,
        sx, sy, sw, sh
      );

      // Border
      ctx.strokeStyle = theme.palette.primary.main;
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 3]);
      ctx.strokeRect(sx, sy, sw, sh);
      ctx.setLineDash([]);

      // Corner handles
      const handleSize = 8;
      ctx.fillStyle = theme.palette.primary.main;
      const corners = [
        [sx, sy],
        [sx + sw, sy],
        [sx, sy + sh],
        [sx + sw, sy + sh],
      ];
      corners.forEach(([cx, cy]) => {
        ctx.fillRect(cx - handleSize / 2, cy - handleSize / 2, handleSize, handleSize);
      });

      // Dimensions label
      ctx.fillStyle = theme.palette.primary.main;
      ctx.font = '12px sans-serif';
      const label = `${Math.round(rect.w)} x ${Math.round(rect.h)}`;
      const textY = sy > 20 ? sy - 6 : sy + sh + 16;
      ctx.fillText(label, sx, textY);
    }
  }, [displayScale, theme.palette.primary.main]);

  const setupCanvas = useCallback((img: HTMLImageElement) => {
    const canvas = cropCanvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const maxWidth = container.clientWidth || 800;
    const scale = Math.min(1, maxWidth / img.width);
    setDisplayScale(scale);

    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
  }, []);

  const processImage = useCallback((file: File) => {
    setOriginalFile(file);
    setCroppedUrl('');
    setCroppedSize(0);
    setCropRect({ x: 0, y: 0, w: 0, h: 0 });

    const url = URL.createObjectURL(file);
    setOriginalUrl(url);

    const img = new Image();
    img.onload = () => {
      imageRef.current = img;
      setOriginalWidth(img.width);
      setOriginalHeight(img.height);
      setupCanvas(img);
    };
    img.src = url;
  }, [setupCanvas]);

  useEffect(() => {
    const handleResize = () => {
      if (imageRef.current) {
        setupCanvas(imageRef.current);
        drawCropOverlay(cropRect);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setupCanvas, drawCropOverlay, cropRect]);

  // Pointer events: handles mouse, touch and stylus uniformly
  const getPointerCoords = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = cropCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / displayScale;
    const y = (e.clientY - rect.top) / displayScale;
    return { x, y };
  }, [displayScale]);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    // Capture pointer so move/up fire even if finger leaves canvas
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    const coords = getPointerCoords(e);
    setIsDraggingCrop(true);
    setDragStart(coords);
    setCropRect({ x: coords.x, y: coords.y, w: 0, h: 0 });
    setCroppedUrl('');
    setCroppedSize(0);
  }, [getPointerCoords]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingCrop) return;
    e.preventDefault();
    const coords = getPointerCoords(e);
    const img = imageRef.current;
    if (!img) return;

    const x = Math.max(0, Math.min(dragStart.x, coords.x));
    const y = Math.max(0, Math.min(dragStart.y, coords.y));
    const w = Math.min(Math.abs(coords.x - dragStart.x), img.width - x);
    const h = Math.min(Math.abs(coords.y - dragStart.y), img.height - y);

    const newRect = { x, y, w, h };
    setCropRect(newRect);
    drawCropOverlay(newRect);
  }, [isDraggingCrop, dragStart, getPointerCoords, drawCropOverlay]);

  const handlePointerUp = useCallback(() => {
    setIsDraggingCrop(false);
  }, []);

  const performCrop = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img || cropRect.w <= 0 || cropRect.h <= 0) return;

    const cx = Math.round(cropRect.x);
    const cy = Math.round(cropRect.y);
    const cw = Math.round(cropRect.w);
    const ch = Math.round(cropRect.h);

    canvas.width = cw;
    canvas.height = ch;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(img, cx, cy, cw, ch, 0, 0, cw, ch);

    canvas.toBlob((blob) => {
      if (blob) {
        if (croppedUrl) URL.revokeObjectURL(croppedUrl);
        setCroppedUrl(URL.createObjectURL(blob));
        setCroppedSize(blob.size);
      }
    }, 'image/png');
  }, [cropRect, croppedUrl]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      processImage(file);
    }
  }, [processImage]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImage(file);
  }, [processImage]);

  const downloadCropped = useCallback(() => {
    if (!croppedUrl || !originalFile) return;
    const name = originalFile.name.replace(/\.[^.]+$/, '') + '_cropped.png';
    const a = document.createElement('a');
    a.href = croppedUrl;
    a.download = name;
    a.click();
  }, [croppedUrl, originalFile]);

  const clearImage = useCallback(() => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (croppedUrl) URL.revokeObjectURL(croppedUrl);
    setOriginalFile(null);
    setOriginalUrl('');
    setCroppedUrl('');
    setOriginalWidth(0);
    setOriginalHeight(0);
    setCroppedSize(0);
    setCropRect({ x: 0, y: 0, w: 0, h: 0 });
    imageRef.current = null;
  }, [originalUrl, croppedUrl]);

  const resetCrop = useCallback(() => {
    setCropRect({ x: 0, y: 0, w: 0, h: 0 });
    setCroppedUrl('');
    setCroppedSize(0);
    if (imageRef.current) {
      setupCanvas(imageRef.current);
    }
  }, [setupCanvas]);

  const handleCropInputChange = useCallback((field: keyof CropRect, value: string) => {
    const num = parseInt(value) || 0;
    const newRect = { ...cropRect, [field]: Math.max(0, num) };
    if (imageRef.current) {
      newRect.x = Math.min(newRect.x, imageRef.current.width - newRect.w);
      newRect.y = Math.min(newRect.y, imageRef.current.height - newRect.h);
      newRect.w = Math.min(newRect.w, imageRef.current.width - newRect.x);
      newRect.h = Math.min(newRect.h, imageRef.current.height - newRect.y);
    }
    setCropRect(newRect);
    drawCropOverlay(newRect);
  }, [cropRect, drawCropOverlay]);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />

      {!originalFile && (
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
            borderRadius: 18,
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
            <Chip label="JPEG" size="small" variant="outlined" />
            <Chip label="PNG" size="small" variant="outlined" />
            <Chip label="WebP" size="small" variant="outlined" />
          </Box>
        </Paper>
      )}

      {originalFile && (
        <>
          {/* Controls */}
          <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, mb: 2, borderRadius: 18 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <CropIcon /> {isEn ? 'Crop parameters' : 'Параметры обрезки'}
            </Typography>

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="X"
                  type="number"
                  value={Math.round(cropRect.x) || ''}
                  onChange={(e) => handleCropInputChange('x', e.target.value)}
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Y"
                  type="number"
                  value={Math.round(cropRect.y) || ''}
                  onChange={(e) => handleCropInputChange('y', e.target.value)}
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <TextField
                  fullWidth
                  size="small"
                  label={isEn ? "Width" : "Ширина"}
                  type="number"
                  value={Math.round(cropRect.w) || ''}
                  onChange={(e) => handleCropInputChange('w', e.target.value)}
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <TextField
                  fullWidth
                  size="small"
                  label={isEn ? "Height" : "Высота"}
                  type="number"
                  value={Math.round(cropRect.h) || ''}
                  onChange={(e) => handleCropInputChange('h', e.target.value)}
                  inputProps={{ min: 0 }}
                />
              </Grid>
            </Grid>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {isEn ? 'Draw a crop area on the image with your mouse or enter coordinates manually' : 'Нарисуйте область обрезки мышью на изображении или введите координаты вручную'}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<CropIcon />}
                onClick={performCrop}
                disabled={cropRect.w <= 0 || cropRect.h <= 0}
              >
                {isEn ? 'Crop' : 'Обрезать'}
              </Button>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={downloadCropped}
                disabled={!croppedUrl}
              >
                {isEn ? 'Download' : 'Скачать'}
              </Button>
              <Button
                variant="outlined"
                startIcon={<RestartAltIcon />}
                onClick={resetCrop}
              >
                {isEn ? 'Reset' : 'Сбросить'}
              </Button>
              <Button variant="outlined" onClick={clearImage} color="error" sx={{ minWidth: 48 }}>
                <DeleteIcon />
              </Button>
            </Box>
          </Paper>

          {/* Info */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Paper
                elevation={0}
                sx={{ p: 2, textAlign: 'center', borderRadius: 18, transitionProperty: 'background-color', transitionDuration: '200ms', '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.04) } }}
              >
                <Typography variant="caption" color="text.secondary">{isEn ? 'Original' : 'Оригинал'}</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {originalWidth} x {originalHeight}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatFileSize(originalFile.size, isEn)}
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Paper
                elevation={0}
                sx={{ p: 2, textAlign: 'center', borderRadius: 18, transitionProperty: 'background-color', transitionDuration: '200ms', '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.04) } }}
              >
                <Typography variant="caption" color="text.secondary">{isEn ? 'Crop area' : 'Область обрезки'}</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {Math.round(cropRect.w)} x {Math.round(cropRect.h)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {isEn ? 'Position' : 'Позиция'}: {Math.round(cropRect.x)}, {Math.round(cropRect.y)}
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  textAlign: 'center',
                  borderRadius: 18,
                  background: croppedUrl ? alpha(theme.palette.success.main, 0.06) : undefined
                }}
              >
                <Typography variant="caption" color="text.secondary">{isEn ? 'Result' : 'Результат'}</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: croppedUrl ? 'success.main' : 'text.disabled' }}>
                  {croppedUrl ? formatFileSize(croppedSize, isEn) : '—'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {croppedUrl ? (isEn ? 'Ready to download' : 'Готово к скачиванию') : (isEn ? 'Waiting for crop' : 'Ожидание обрезки')}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Crop Canvas */}
          <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, mb: 2, borderRadius: 18 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <CropIcon /> {isEn ? 'Select area' : 'Выберите область'}
            </Typography>
            <Box
              ref={containerRef}
              sx={{
                borderRadius: 10,
                overflow: 'hidden',
                backgroundColor: alpha(theme.palette.background.default, 0.5),
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <canvas
                ref={cropCanvasRef}
                style={{ cursor: 'crosshair', maxWidth: '100%', display: 'block', touchAction: 'none' }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
              />
            </Box>
          </Paper>

          {/* Cropped Preview */}
          {croppedUrl && (
            <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 18 }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <ImageIcon /> {isEn ? 'Crop result' : 'Результат обрезки'}
              </Typography>
              <Box
                sx={{
                  borderRadius: 10,
                  overflow: 'hidden',
                  backgroundColor: alpha(theme.palette.background.default, 0.5),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 100
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={croppedUrl}
                  alt="Cropped"
                  style={{ maxWidth: '100%', maxHeight: 400, objectFit: 'contain' }}
                />
              </Box>
            </Paper>
          )}
        </>
      )}
    </Box>
  );
}
