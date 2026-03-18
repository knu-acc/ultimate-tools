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
  Slider,
  useTheme,
  alpha
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import FlipIcon from '@mui/icons-material/Flip';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useLanguage } from '@/src/i18n/LanguageContext';

function formatFileSize(bytes: number, isEn: boolean): string {
  if (bytes === 0) return isEn ? '0 B' : '0 Б';
  const units = isEn ? ['B', 'KB', 'MB', 'GB'] : ['Б', 'КБ', 'МБ', 'ГБ'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
}

export default function ImageRotate() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [resultUrl, setResultUrl] = useState<string>('');
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [resultSize, setResultSize] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  // Track result URL in a ref to break the circular dependency:
  // applyTransform → setResultUrl → re-creates applyTransform → triggers effect → infinite loop
  const resultUrlRef = useRef('');
  // RAF throttle refs — batch rapid slider moves into a single frame
  const pendingTransformRef = useRef<{ rotation: number; flipH: boolean; flipV: boolean } | null>(null);
  const rafRef = useRef<number | null>(null);

  const applyTransform = useCallback((img: HTMLImageElement, deg: number, fh: boolean, fv: boolean) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const radians = (deg * Math.PI) / 180;
    const absCos = Math.abs(Math.cos(radians));
    const absSin = Math.abs(Math.sin(radians));

    const newWidth = Math.round(img.width * absCos + img.height * absSin);
    const newHeight = Math.round(img.width * absSin + img.height * absCos);

    canvas.width = newWidth;
    canvas.height = newHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, newWidth, newHeight);
    ctx.save();
    ctx.translate(newWidth / 2, newHeight / 2);
    ctx.rotate(radians);
    ctx.scale(fh ? -1 : 1, fv ? -1 : 1);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    ctx.restore();

    canvas.toBlob((blob) => {
      if (!blob) return;
      // Revoke via ref — no state dependency, so this callback is stable
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
      const newUrl = URL.createObjectURL(blob);
      resultUrlRef.current = newUrl;
      setResultUrl(newUrl);
      setResultSize(blob.size);
    }, 'image/png');
  }, []); // stable — no deps, reads resultUrlRef instead of state

  // RAF-throttled effect: batches rapid slider drags into one frame per rAF tick
  useEffect(() => {
    if (!imageRef.current) return;
    pendingTransformRef.current = { rotation, flipH, flipV };
    if (rafRef.current !== null) return; // already scheduled, will pick up latest values
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const p = pendingTransformRef.current;
      if (p && imageRef.current) applyTransform(imageRef.current, p.rotation, p.flipH, p.flipV);
      pendingTransformRef.current = null;
    });
  }, [rotation, flipH, flipV, applyTransform]);

  const processImage = useCallback((file: File) => {
    if (rafRef.current !== null) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    if (resultUrlRef.current) { URL.revokeObjectURL(resultUrlRef.current); resultUrlRef.current = ''; }
    setOriginalFile(file);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setResultUrl('');
    setResultSize(0);

    const url = URL.createObjectURL(file);
    setOriginalUrl(url);

    const img = new Image();
    img.onload = () => {
      imageRef.current = img;
      setOriginalWidth(img.width);
      setOriginalHeight(img.height);
      applyTransform(img, 0, false, false);
    };
    img.src = url;
  }, [applyTransform]);

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

  const rotateBy = useCallback((deg: number) => {
    setRotation((prev) => {
      let next = (prev + deg) % 360;
      if (next < 0) next += 360;
      return next;
    });
  }, []);

  const downloadResult = useCallback(() => {
    if (!resultUrl || !originalFile) return;
    const suffix = [];
    if (rotation !== 0) suffix.push(`r${rotation}`);
    if (flipH) suffix.push('fh');
    if (flipV) suffix.push('fv');
    const tag = suffix.length > 0 ? '_' + suffix.join('_') : '_transformed';
    const name = originalFile.name.replace(/\.[^.]+$/, '') + `${tag}.png`;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = name;
    a.click();
  }, [resultUrl, originalFile, rotation, flipH, flipV]);

  const clearImage = useCallback(() => {
    if (rafRef.current !== null) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (resultUrlRef.current) { URL.revokeObjectURL(resultUrlRef.current); resultUrlRef.current = ''; }
    setOriginalFile(null);
    setOriginalUrl('');
    setResultUrl('');
    setOriginalWidth(0);
    setOriginalHeight(0);
    setResultSize(0);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    imageRef.current = null;
  }, [originalUrl]); // removed resultUrl dep — tracked via ref now

  const resetTransform = useCallback(() => {
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
  }, []);

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
            {isEn ? 'Drag and drop an image here' : 'Перетащите изображение сюда'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {isEn ? 'or click to select a file' : 'или нажмите для выбора файла'}
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
          <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, mb: 2, borderRadius: 18 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <RotateRightIcon /> {isEn ? 'Rotation and Flip' : 'Поворот и отражение'}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              <Chip
                icon={<RotateLeftIcon />}
                label={isEn ? '90° left' : '90° влево'}
                variant="outlined"
                onClick={() => rotateBy(-90)}
                sx={{ cursor: 'pointer' }}
              />
              <Chip
                icon={<RotateRightIcon />}
                label={isEn ? '90° right' : '90° вправо'}
                variant="outlined"
                onClick={() => rotateBy(90)}
                sx={{ cursor: 'pointer' }}
              />
              <Chip
                label="180°"
                variant="outlined"
                onClick={() => rotateBy(180)}
                sx={{ cursor: 'pointer' }}
              />
              <Chip
                label="270°"
                variant="outlined"
                onClick={() => setRotation(270)}
                sx={{ cursor: 'pointer' }}
              />
            </Box>

            {/* Custom rotation */}
            <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Grid size={{ xs: 12, md: 8 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1, color: 'text.secondary' }}>
                  {isEn ? `Custom angle: ${rotation}°` : `Произвольный угол: ${rotation}°`}
                </Typography>
                <Slider
                  value={rotation}
                  onChange={(_, v) => setRotation(v as number)}
                  min={0}
                  max={359}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(v) => `${v}°`}
                  sx={{ mx: 1 }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  label={isEn ? 'Degrees' : 'Градусы'}
                  type="number"
                  value={rotation}
                  onChange={(e) => {
                    let v = parseInt(e.target.value) || 0;
                    v = ((v % 360) + 360) % 360;
                    setRotation(v);
                  }}
                  inputProps={{ min: 0, max: 359 }}
                />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              <Chip
                icon={<FlipIcon />}
                label={isEn ? 'Horizontal' : 'По горизонтали'}
                variant={flipH ? 'filled' : 'outlined'}
                color={flipH ? 'primary' : 'default'}
                onClick={() => setFlipH(!flipH)}
                sx={{ cursor: 'pointer' }}
              />
              <Chip
                icon={<FlipIcon sx={{ transform: 'rotate(90deg)' }} />}
                label={isEn ? 'Vertical' : 'По вертикали'}
                variant={flipV ? 'filled' : 'outlined'}
                color={flipV ? 'primary' : 'default'}
                onClick={() => setFlipV(!flipV)}
                sx={{ cursor: 'pointer' }}
              />
            </Box>

            {/* Action buttons */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={downloadResult}
                disabled={!resultUrl}
              >
                {isEn ? 'Download' : 'Скачать'}
              </Button>
              <Button
                variant="outlined"
                startIcon={<RestartAltIcon />}
                onClick={resetTransform}
              >
                {isEn ? 'Reset' : 'Сбросить'}
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
                <Typography variant="caption" color="text.secondary">{isEn ? 'Transform' : 'Трансформация'}</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {rotation}°
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {flipH && flipV
                    ? (isEn ? 'Flip: H + V' : 'Отражение: H + V')
                    : flipH
                    ? (isEn ? 'Flip: H' : 'Отражение: H')
                    : flipV
                    ? (isEn ? 'Flip: V' : 'Отражение: V')
                    : (isEn ? 'No flip' : 'Без отражения')}
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
                  background: resultUrl ? alpha(theme.palette.success.main, 0.06) : undefined
                }}
              >
                <Typography variant="caption" color="text.secondary">{isEn ? 'Result' : 'Результат'}</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: resultUrl ? 'success.main' : 'text.disabled' }}>
                  {resultUrl ? formatFileSize(resultSize, isEn) : '—'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {isEn ? 'Ready to download' : 'Готово к скачиванию'}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Preview */}
          <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 18 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <ImageIcon /> {isEn ? 'Preview' : 'Предпросмотр'}
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography
                  variant="body2"
                  sx={{ mb: 1, fontWeight: 500, color: 'text.secondary', textAlign: 'center' }}
                >
                  {isEn ? 'Original' : 'Оригинал'}
                </Typography>
                <Box
                  sx={{
                    borderRadius: 10,
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
                  {isEn ? 'Result' : 'Результат'}
                </Typography>
                <Box
                  sx={{
                    borderRadius: 10,
                    overflow: 'hidden',
                    backgroundColor: alpha(theme.palette.background.default, 0.5),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 200
                  }}
                >
                  {resultUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={resultUrl}
                      alt="Result"
                      style={{ maxWidth: '100%', maxHeight: 400, objectFit: 'contain' }}
                    />
                  ) : (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                      <ImageIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {isEn ? 'Processing...' : 'Обработка...'}
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
