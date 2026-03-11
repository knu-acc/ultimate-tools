'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  TextField,
  Slider,
  Chip,
  Switch,
  FormControlLabel,
  useTheme,
  alpha,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import TextFieldsIcon from '@mui/icons-material/TextFields';

type TextPosition = 'top' | 'bottom' | 'center';

export default function MemeGenerator() {
  const theme = useTheme();
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [pasteUrl, setPasteUrl] = useState('');
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [fontSize, setFontSize] = useState(48);
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [strokeEnabled, setStrokeEnabled] = useState(true);
  const [textPosition, setTextPosition] = useState<TextPosition>('top');
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const drawMeme = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(img, 0, 0);

    // Text style - Impact-like
    const scaledFontSize = Math.round(fontSize * (img.width / 600));
    ctx.font = `bold ${scaledFontSize}px Impact, Arial Black, sans-serif`;
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    if (strokeEnabled) {
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = Math.max(2, scaledFontSize / 12);
      ctx.lineJoin = 'round';
    }

    const drawText = (text: string, yPos: number) => {
      if (!text) return;
      const lines = text.toUpperCase().split('\n');
      lines.forEach((line, i) => {
        const y = yPos + i * (scaledFontSize + 4);
        const x = canvas.width / 2;
        if (strokeEnabled) {
          ctx.strokeText(line, x, y);
        }
        ctx.fillText(line, x, y);
      });
    };

    const padding = scaledFontSize * 0.4;

    if (textPosition === 'top' || textPosition === 'center') {
      const yTop = textPosition === 'center'
        ? (canvas.height - scaledFontSize) / 2
        : padding;
      drawText(topText, yTop);
    } else {
      drawText(topText, padding);
    }

    if (bottomText) {
      const lines = bottomText.split('\n');
      const totalHeight = lines.length * (scaledFontSize + 4);
      const yBottom = canvas.height - totalHeight - padding;
      drawText(bottomText, yBottom);
    }
  }, [topText, bottomText, fontSize, textColor, strokeEnabled, textPosition]);

  useEffect(() => {
    if (imageRef.current) {
      drawMeme();
    }
  }, [drawMeme]);

  const loadImage = useCallback((src: string) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageRef.current = img;
      drawMeme();
    };
    img.src = src;
  }, [drawMeme]);

  const processImage = useCallback((file: File) => {
    setOriginalFile(file);
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    loadImage(url);
  }, [loadImage]);

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

  const handlePasteUrl = useCallback(() => {
    if (!pasteUrl.trim()) return;
    setImageUrl(pasteUrl);
    loadImage(pasteUrl);
    setOriginalFile(null);
  }, [pasteUrl, loadImage]);

  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'meme.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, []);

  const clearAll = useCallback(() => {
    if (imageUrl && originalFile) URL.revokeObjectURL(imageUrl);
    setOriginalFile(null);
    setImageUrl('');
    setPasteUrl('');
    setTopText('');
    setBottomText('');
    imageRef.current = null;
  }, [imageUrl, originalFile]);

  const hasImage = !!imageRef.current;

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />

      {!hasImage && (
        <>
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
              mb: 2,
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
            <Typography variant="body2" color="text.secondary">
              или нажмите для выбора файла
            </Typography>
          </Paper>

          <Paper elevation={0} sx={{ p: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: 3 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Или вставьте URL изображения
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                value={pasteUrl}
                onChange={(e) => setPasteUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
              <Button variant="contained" onClick={handlePasteUrl} disabled={!pasteUrl.trim()}>
                Загрузить
              </Button>
            </Box>
          </Paper>
        </>
      )}

      {hasImage && (
        <>
          <Paper elevation={0} sx={{ p: 3, mb: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextFieldsIcon /> Настройки мема
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Верхний текст"
                  value={topText}
                  onChange={(e) => setTopText(e.target.value)}
                  multiline
                  rows={2}
                  placeholder="КОГДА ТЫ..."
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Нижний текст"
                  value={bottomText}
                  onChange={(e) => setBottomText(e.target.value)}
                  multiline
                  rows={2}
                  placeholder="НО ПОТОМ..."
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1, color: 'text.secondary' }}>
                  Размер шрифта: {fontSize}px
                </Typography>
                <Slider
                  value={fontSize}
                  onChange={(_, v) => setFontSize(v as number)}
                  min={20}
                  max={80}
                  valueLabelDisplay="auto"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1, color: 'text.secondary' }}>
                  Цвет текста
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    style={{ width: 40, height: 32, border: 'none', cursor: 'pointer' }}
                  />
                  <Typography variant="body2">{textColor}</Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={strokeEnabled}
                      onChange={(e) => setStrokeEnabled(e.target.checked)}
                    />
                  }
                  label="Обводка текста"
                />
              </Grid>
            </Grid>

            <Typography variant="body2" sx={{ fontWeight: 500, mt: 2, mb: 1, color: 'text.secondary' }}>
              Позиция текста
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              {([
                { value: 'top', label: 'Сверху' },
                { value: 'bottom', label: 'Снизу' },
                { value: 'center', label: 'По центру' },
              ] as { value: TextPosition; label: string }[]).map((pos) => (
                <Chip
                  key={pos.value}
                  label={pos.label}
                  onClick={() => setTextPosition(pos.value)}
                  color={textPosition === pos.value ? 'primary' : 'default'}
                  variant={textPosition === pos.value ? 'filled' : 'outlined'}
                />
              ))}
            </Box>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={handleDownload}
              >
                Скачать мем
              </Button>
              <Button variant="outlined" onClick={clearAll} color="error" sx={{ minWidth: 48 }}>
                <DeleteIcon />
              </Button>
            </Box>
          </Paper>

          {/* Preview */}
          <Paper elevation={0} sx={{ p: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: 3 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Предпросмотр
            </Typography>
            <Box
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center',
                backgroundColor: alpha(theme.palette.background.default, 0.5),
              }}
            >
              <canvas
                ref={canvasRef}
                style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
              />
            </Box>
          </Paper>
        </>
      )}
    </Box>
  );
}
