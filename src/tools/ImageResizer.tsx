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
  alpha,
  IconButton,
  Tooltip
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import ImageIcon from '@mui/icons-material/Image';
import DeleteIcon from '@mui/icons-material/Delete';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Б';
  const units = ['Б', 'КБ', 'МБ', 'ГБ'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
}

export default function ImageResizer() {
  const theme = useTheme();
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [resizedUrl, setResizedUrl] = useState<string>('');
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [newWidth, setNewWidth] = useState(0);
  const [newHeight, setNewHeight] = useState(0);
  const [lockAspect, setLockAspect] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [originalSize, setOriginalSize] = useState(0);
  const [resizedSize, setResizedSize] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const resizeImage = useCallback((img: HTMLImageElement, w: number, h: number) => {
    const canvas = canvasRef.current;
    if (!canvas || w <= 0 || h <= 0) return;

    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);

    canvas.toBlob((blob) => {
      if (blob) {
        if (resizedUrl) URL.revokeObjectURL(resizedUrl);
        setResizedUrl(URL.createObjectURL(blob));
        setResizedSize(blob.size);
      }
    }, 'image/png');
  }, [resizedUrl]);

  const processImage = useCallback((file: File) => {
    setOriginalFile(file);
    setOriginalSize(file.size);

    const url = URL.createObjectURL(file);
    setOriginalUrl(url);

    const img = new Image();
    img.onload = () => {
      imageRef.current = img;
      setOriginalWidth(img.width);
      setOriginalHeight(img.height);
      setNewWidth(img.width);
      setNewHeight(img.height);
    };
    img.src = url;
  }, []);

  useEffect(() => {
    if (imageRef.current && newWidth > 0 && newHeight > 0) {
      resizeImage(imageRef.current, newWidth, newHeight);
    }
  }, [newWidth, newHeight, resizeImage]);

  const handleWidthChange = useCallback((value: string) => {
    const w = parseInt(value) || 0;
    setNewWidth(w);
    if (lockAspect && originalWidth > 0 && w > 0) {
      const ratio = originalHeight / originalWidth;
      setNewHeight(Math.round(w * ratio));
    }
  }, [lockAspect, originalWidth, originalHeight]);

  const handleHeightChange = useCallback((value: string) => {
    const h = parseInt(value) || 0;
    setNewHeight(h);
    if (lockAspect && originalHeight > 0 && h > 0) {
      const ratio = originalWidth / originalHeight;
      setNewWidth(Math.round(h * ratio));
    }
  }, [lockAspect, originalWidth, originalHeight]);

  const applyPreset = useCallback((w: number, h: number) => {
    setNewWidth(w);
    setNewHeight(h);
  }, []);

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

  const downloadResized = useCallback(() => {
    if (!resizedUrl || !originalFile) return;
    const name = originalFile.name.replace(/\.[^.]+$/, '') + `_${newWidth}x${newHeight}.png`;
    const a = document.createElement('a');
    a.href = resizedUrl;
    a.download = name;
    a.click();
  }, [resizedUrl, originalFile, newWidth, newHeight]);

  const clearImage = useCallback(() => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (resizedUrl) URL.revokeObjectURL(resizedUrl);
    setOriginalFile(null);
    setOriginalUrl('');
    setResizedUrl('');
    setOriginalSize(0);
    setResizedSize(0);
    setOriginalWidth(0);
    setOriginalHeight(0);
    setNewWidth(0);
    setNewHeight(0);
    imageRef.current = null;
  }, [originalUrl, resizedUrl]);

  const presets = [
    { label: '1920x1080', w: 1920, h: 1080 },
    { label: '1280x720', w: 1280, h: 720 },
    { label: '800x600', w: 800, h: 600 },
    { label: '640x480', w: 640, h: 480 },
    { label: '256x256', w: 256, h: 256 },
    { label: '128x128', w: 128, h: 128 },
  ];

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
            Перетащите изображение сюда
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            или нажмите для выбора файла
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
            <Chip label="JPEG" size="small" variant="outlined" />
            <Chip label="PNG" size="small" variant="outlined" />
            <Chip label="WebP" size="small" variant="outlined" />
            <Chip label="GIF" size="small" variant="outlined" />
          </Box>
        </Paper>
      )}

      {originalFile && (
        <>
          {/* Controls */}
          <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, mb: 2, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <AspectRatioIcon /> Размеры
            </Typography>

            <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Grid size={{ xs: 5 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Ширина (px)"
                  type="number"
                  value={newWidth || ''}
                  onChange={(e) => handleWidthChange(e.target.value)}
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid size={{ xs: 2 }} sx={{ textAlign: 'center' }}>
                <Tooltip title={lockAspect ? 'Разблокировать пропорции' : 'Заблокировать пропорции'}>
                  <IconButton onClick={() => setLockAspect(!lockAspect)} color={lockAspect ? 'primary' : 'default'}>
                    {lockAspect ? <LockIcon /> : <LockOpenIcon />}
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid size={{ xs: 5 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Высота (px)"
                  type="number"
                  value={newHeight || ''}
                  onChange={(e) => handleHeightChange(e.target.value)}
                  inputProps={{ min: 1 }}
                />
              </Grid>
            </Grid>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
              Пресеты
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {presets.map((p) => (
                <Chip
                  key={p.label}
                  label={p.label}
                  size="small"
                  variant="outlined"
                  onClick={() => applyPreset(p.w, p.h)}
                  sx={{ cursor: 'pointer' }}
                />
              ))}
              <Chip
                label="Оригинал"
                size="small"
                color="primary"
                variant="outlined"
                onClick={() => applyPreset(originalWidth, originalHeight)}
                sx={{ cursor: 'pointer' }}
              />
              <Chip
                label="50%"
                size="small"
                variant="outlined"
                onClick={() => applyPreset(Math.round(originalWidth / 2), Math.round(originalHeight / 2))}
                sx={{ cursor: 'pointer' }}
              />
              <Chip
                label="25%"
                size="small"
                variant="outlined"
                onClick={() => applyPreset(Math.round(originalWidth / 4), Math.round(originalHeight / 4))}
                sx={{ cursor: 'pointer' }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={downloadResized}
                disabled={!resizedUrl}
              >
                Скачать
              </Button>
              <Button variant="outlined" onClick={clearImage} color="error" sx={{ minWidth: 48 }}>
                <DeleteIcon />
              </Button>
            </Box>
          </Paper>

          {/* Stats */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Paper
                elevation={0}
                sx={{ p: 2, textAlign: 'center', borderRadius: 3, transition: 'background-color 200ms', '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.04) } }}
              >
                <Typography variant="caption" color="text.secondary">Оригинал</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {originalWidth} x {originalHeight}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatFileSize(originalSize)}
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Paper
                elevation={0}
                sx={{ p: 2, textAlign: 'center', borderRadius: 3, transition: 'background-color 200ms', '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.04) } }}
              >
                <Typography variant="caption" color="text.secondary">Новый размер</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {newWidth} x {newHeight}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatFileSize(resizedSize)}
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  textAlign: 'center',
                  borderRadius: 3,
                  background: alpha(theme.palette.info.main, 0.06)
                }}
              >
                <Typography variant="caption" color="text.secondary">Масштаб</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'info.main' }}>
                  {originalWidth > 0 ? ((newWidth / originalWidth) * 100).toFixed(1) : 0}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  от оригинала
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Preview */}
          <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <ImageIcon /> Предпросмотр
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography
                  variant="body2"
                  sx={{ mb: 1, fontWeight: 500, color: 'text.secondary', textAlign: 'center' }}
                >
                  Оригинал
                </Typography>
                <Box
                  sx={{
                    borderRadius: 2,
                    overflow: 'hidden',
                    backgroundColor: alpha(theme.palette.background.default, 0.5),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 200
                  }}
                >
                  {originalUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={originalUrl}
                      alt="Original"
                      style={{ maxWidth: '100%', maxHeight: 400, objectFit: 'contain' }}
                    />
                  )}
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography
                  variant="body2"
                  sx={{ mb: 1, fontWeight: 500, color: 'text.secondary', textAlign: 'center' }}
                >
                  Результат
                </Typography>
                <Box
                  sx={{
                    borderRadius: 2,
                    overflow: 'hidden',
                    backgroundColor: alpha(theme.palette.background.default, 0.5),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 200
                  }}
                >
                  {resizedUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={resizedUrl}
                      alt="Resized"
                      style={{ maxWidth: '100%', maxHeight: 400, objectFit: 'contain' }}
                    />
                  ) : (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                      <ImageIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Обработка...
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </>
      )}
    </Box>
  );
}
