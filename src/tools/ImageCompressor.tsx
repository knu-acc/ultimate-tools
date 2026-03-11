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
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import ImageIcon from '@mui/icons-material/Image';
import CompressIcon from '@mui/icons-material/Compress';
import DeleteIcon from '@mui/icons-material/Delete';

type OutputFormat = 'image/jpeg' | 'image/png' | 'image/webp';

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Б';
  const units = ['Б', 'КБ', 'МБ', 'ГБ'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
}

export default function ImageCompressor() {
  const theme = useTheme();
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [compressedUrl, setCompressedUrl] = useState<string>('');
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [quality, setQuality] = useState(75);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('image/jpeg');
  const [processing, setProcessing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const processImage = useCallback(
    (file: File) => {
      setOriginalFile(file);
      setOriginalSize(file.size);

      const url = URL.createObjectURL(file);
      setOriginalUrl(url);

      const img = new Image();
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
        compressImage(img, quality, outputFormat);
      };
      img.src = url;
    },
    [quality, outputFormat]
  );

  const compressImage = useCallback(
    (img: HTMLImageElement, q: number, format: OutputFormat) => {
      setProcessing(true);

      requestAnimationFrame(() => {
        const canvas = canvasRef.current;
        if (!canvas) { setProcessing(false); return; }

        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) { setProcessing(false); return; }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // For PNG transparency support with JPEG output, fill white background
        if (format === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compUrl = URL.createObjectURL(blob);
              setCompressedUrl(compUrl);
              setCompressedSize(blob.size);
            }
            setProcessing(false);
          },
          format,
          q / 100
        );
      });
    },
    []
  );

  // Recompress when quality or format changes
  useEffect(() => {
    if (!originalUrl) return;

    const img = new Image();
    img.onload = () => compressImage(img, quality, outputFormat);
    img.src = originalUrl;
  }, [quality, outputFormat, originalUrl, compressImage]);

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

  const downloadCompressed = useCallback(() => {
    if (!compressedUrl || !originalFile) return;

    const ext = outputFormat === 'image/jpeg' ? 'jpg' : outputFormat === 'image/png' ? 'png' : 'webp';
    const name = originalFile.name.replace(/\.[^.]+$/, '') + `_compressed.${ext}`;

    const a = document.createElement('a');
    a.href = compressedUrl;
    a.download = name;
    a.click();
  }, [compressedUrl, originalFile, outputFormat]);

  const clearImage = useCallback(() => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    setOriginalFile(null);
    setOriginalUrl('');
    setCompressedUrl('');
    setOriginalSize(0);
    setCompressedSize(0);
    setImageDimensions({ width: 0, height: 0 });
  }, [originalUrl, compressedUrl]);

  const compressionRatio = originalSize > 0 ? ((1 - compressedSize / originalSize) * 100) : 0;

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />

      {/* Drop Zone */}
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
            borderRadius: 4,
            backgroundColor: dragging
              ? alpha(theme.palette.primary.main, 0.06)
              : alpha(theme.palette.background.default, 0.5),
            transition: 'all 250ms ease',
            '&:hover': {
              borderColor: theme.palette.primary.main,
              backgroundColor: alpha(theme.palette.primary.main, 0.04),
            },
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
          </Box>
        </Paper>
      )}

      {/* Controls */}
      {originalFile && (
        <>
          <Paper elevation={0} sx={{ p: 3, mb: 3, border: `1px solid ${theme.palette.divider}` }}>
            <Grid container spacing={3} alignItems="center">
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1, color: 'text.secondary' }}>
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
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Формат</InputLabel>
                  <Select
                    value={outputFormat}
                    label="Формат"
                    onChange={(e) => setOutputFormat(e.target.value as OutputFormat)}
                  >
                    <MenuItem value="image/jpeg">JPEG</MenuItem>
                    <MenuItem value="image/png">PNG</MenuItem>
                    <MenuItem value="image/webp">WebP</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={downloadCompressed}
                    disabled={!compressedUrl || processing}
                    fullWidth
                  >
                    Скачать
                  </Button>
                  <Button variant="outlined" onClick={clearImage} color="error" sx={{ minWidth: 48 }}>
                    <DeleteIcon />
                  </Button>
                </Box>
              </Grid>
            </Grid>

            {processing && <LinearProgress sx={{ mt: 2, borderRadius: 2 }} />}
          </Paper>

          {/* Stats */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  textAlign: 'center',
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 3,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Оригинал
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {formatFileSize(originalSize)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {imageDimensions.width} x {imageDimensions.height}
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  textAlign: 'center',
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 3,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Сжатый
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {formatFileSize(compressedSize)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Качество: {quality}%
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  textAlign: 'center',
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 3,
                  background:
                    compressionRatio > 0
                      ? alpha(theme.palette.success.main, 0.06)
                      : alpha(theme.palette.error.main, 0.06),
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Сжатие
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: compressionRatio > 0 ? 'success.main' : 'error.main',
                  }}
                >
                  {compressionRatio > 0 ? '-' : '+'}{Math.abs(compressionRatio).toFixed(1)}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {compressionRatio > 0 ? 'Экономия' : 'Увеличение'}:{' '}
                  {formatFileSize(Math.abs(originalSize - compressedSize))}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Preview */}
          <Paper elevation={0} sx={{ p: 3, border: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <CompressIcon /> Предпросмотр
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
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    overflow: 'hidden',
                    backgroundColor: alpha(theme.palette.background.default, 0.5),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 200,
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
                  Сжатый
                </Typography>
                <Box
                  sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    overflow: 'hidden',
                    backgroundColor: alpha(theme.palette.background.default, 0.5),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 200,
                  }}
                >
                  {compressedUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={compressedUrl}
                      alt="Compressed"
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
