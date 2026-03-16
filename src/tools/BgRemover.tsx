'use client';

import { useState, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Slider,
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useLanguage } from '@/src/i18n/LanguageContext';

export default function BgRemover() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState('');
  const [resultUrl, setResultUrl] = useState('');
  const [dragging, setDragging] = useState(false);
  const [tolerance, setTolerance] = useState(30);
  const [selectedColor, setSelectedColor] = useState<{ r: number; g: number; b: number } | null>(null);
  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const drawImageOnCanvas = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(img, 0, 0);
  }, []);

  const processImage = useCallback((file: File) => {
    setOriginalFile(file);
    setResultUrl('');
    setSelectedColor(null);

    const url = URL.createObjectURL(file);
    setOriginalUrl(url);

    const img = new Image();
    img.onload = () => {
      imageRef.current = img;
      setImgWidth(img.width);
      setImgHeight(img.height);
      drawImageOnCanvas(img);
    };
    img.src = url;
  }, [drawImageOnCanvas]);

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

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    setSelectedColor({ r: pixel[0], g: pixel[1], b: pixel[2] });
  }, []);

  const removeBackground = useCallback(() => {
    if (!selectedColor || !imageRef.current) return;

    const canvas = canvasRef.current;
    const preview = previewCanvasRef.current;
    if (!canvas || !preview) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Redraw original
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imageRef.current, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const { r, g, b } = selectedColor;

    for (let i = 0; i < data.length; i += 4) {
      const dr = data[i] - r;
      const dg = data[i + 1] - g;
      const db = data[i + 2] - b;
      const distance = Math.sqrt(dr * dr + dg * dg + db * db);

      if (distance <= tolerance) {
        // Fully transparent
        data[i + 3] = 0;
      } else if (distance <= tolerance * 1.5) {
        // Partial transparency for smooth edges
        const alpha = Math.round(((distance - tolerance) / (tolerance * 0.5)) * 255);
        data[i + 3] = Math.min(data[i + 3], alpha);
      }
    }

    // Draw result on preview canvas with checkered background
    preview.width = canvas.width;
    preview.height = canvas.height;
    const pCtx = preview.getContext('2d');
    if (!pCtx) return;

    // Checkered pattern
    const checkSize = 10;
    for (let cy = 0; cy < preview.height; cy += checkSize) {
      for (let cx = 0; cx < preview.width; cx += checkSize) {
        pCtx.fillStyle = ((cx / checkSize + cy / checkSize) % 2 === 0) ? '#ffffff' : '#e0e0e0';
        pCtx.fillRect(cx, cy, checkSize, checkSize);
      }
    }

    // Put modified data onto main canvas, then draw onto preview
    ctx.putImageData(imageData, 0, 0);
    pCtx.drawImage(canvas, 0, 0);

    // Generate result URL
    canvas.toBlob((blob) => {
      if (blob) {
        if (resultUrl) URL.revokeObjectURL(resultUrl);
        setResultUrl(URL.createObjectURL(blob));
      }
    }, 'image/png');
  }, [selectedColor, tolerance, resultUrl]);

  const handleDownload = useCallback(() => {
    if (!resultUrl || !originalFile) return;
    const name = originalFile.name.replace(/\.[^.]+$/, '') + '_no_bg.png';
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = name;
    a.click();
  }, [resultUrl, originalFile]);

  const clearImage = useCallback(() => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setOriginalFile(null);
    setOriginalUrl('');
    setResultUrl('');
    setSelectedColor(null);
    setImgWidth(0);
    setImgHeight(0);
    imageRef.current = null;
  }, [originalUrl, resultUrl]);

  const resetResult = useCallback(() => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl('');
    setSelectedColor(null);
    if (imageRef.current) {
      drawImageOnCanvas(imageRef.current);
    }
  }, [resultUrl, drawImageOnCanvas]);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
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
            borderRadius: 3,
            backgroundColor: dragging
              ? theme.palette.surfaceContainerLow
              : alpha(theme.palette.background.default, 0.5),
            transition: 'all 250ms ease',
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
          <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, mb: 2, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <ColorLensIcon /> {isEn ? 'Background removal settings' : 'Настройки удаления фона'}
            </Typography>

            <Grid container spacing={3} alignItems="center">
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1, color: 'text.secondary' }}>
                  {isEn ? `Color tolerance: ${tolerance}` : `Допуск цвета: ${tolerance}`}
                </Typography>
                <Slider
                  value={tolerance}
                  onChange={(_, v) => setTolerance(v as number)}
                  min={1}
                  max={150}
                  valueLabelDisplay="auto"
                />
                <Typography variant="caption" color="text.secondary">
                  {isEn ? 'Higher values remove more similar colors' : 'Чем выше значение, тем больше похожих цветов будет удалено'}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                    {isEn ? 'Selected color:' : 'Выбранный цвет:'}
                  </Typography>
                  {selectedColor ? (
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: 1,
                        backgroundColor: `rgb(${selectedColor.r}, ${selectedColor.g}, ${selectedColor.b})`
                      }}
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      {isEn ? 'Click on the image' : 'Кликните на изображение'}
                    </Typography>
                  )}
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {isEn ? 'Click the color in the image you want to remove' : 'Кликните по цвету на изображении, который нужно удалить'}
                </Typography>
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                onClick={removeBackground}
                disabled={!selectedColor}
              >
                {isEn ? 'Remove background' : 'Удалить фон'}
              </Button>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={handleDownload}
                disabled={!resultUrl}
              >
                {isEn ? 'Download PNG' : 'Скачать PNG'}
              </Button>
              <Button
                variant="outlined"
                startIcon={<RestartAltIcon />}
                onClick={resetResult}
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
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper
                elevation={0}
                sx={{ p: 2, textAlign: 'center', borderRadius: 3, transition: 'background-color 200ms', '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.04) } }}
              >
                <Typography variant="caption" color="text.secondary">{isEn ? 'Image size' : 'Размер изображения'}</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {imgWidth} x {imgHeight}
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  textAlign: 'center',
                  borderRadius: 3,
                  background: resultUrl ? alpha(theme.palette.success.main, 0.06) : undefined
                }}
              >
                <Typography variant="caption" color="text.secondary">{isEn ? 'Status' : 'Статус'}</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: resultUrl ? 'success.main' : 'text.disabled' }}>
                  {resultUrl ? (isEn ? 'Done' : 'Готово') : (isEn ? 'Waiting' : 'Ожидание')}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Source canvas - clickable */}
          <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, mb: 2, borderRadius: 3 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              {isEn ? 'Source image (click to select background color)' : 'Исходное изображение (кликните для выбора цвета фона)'}
            </Typography>
            <Box
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center',
                backgroundColor: alpha(theme.palette.background.default, 0.5)
              }}
            >
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                style={{ maxWidth: '100%', height: 'auto', cursor: 'crosshair', display: 'block' }}
              />
            </Box>
          </Paper>

          {/* Preview with checkered background */}
          {resultUrl && (
            <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                {isEn ? 'Result (transparent background)' : 'Результат (прозрачный фон)'}
              </Typography>
              <Box
                sx={{
                  borderRadius: 2,
                  overflow: 'hidden',
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <canvas
                  ref={previewCanvasRef}
                  style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
                />
              </Box>
            </Paper>
          )}

          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            {isEn ? 'This is a simple color-based background removal tool. For complex images, use specialized AI services.' : 'Это простой инструмент удаления фона на основе цвета. Для сложных изображений используйте специализированные AI-сервисы.'}
          </Typography>
        </>
      )}
    </Box>
  );
}
