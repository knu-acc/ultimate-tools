'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Slider,
  Chip,
  Switch,
  FormControlLabel,
  useTheme,
  alpha
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import DevicesIcon from '@mui/icons-material/Devices';
import ColorPickerInput from '@/src/components/ColorPickerInput';
import { useLanguage } from '@/src/i18n/LanguageContext';

type DeviceFrame = 'browser' | 'iphone' | 'macbook' | 'ipad';

export default function ScreenshotMockup() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [device, setDevice] = useState<DeviceFrame>('browser');
  const [bgColor, setBgColor] = useState('#667eea');
  const [bgGradient, setBgGradient] = useState('#764ba2');
  const [padding, setPadding] = useState(60);
  const [shadow, setShadow] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const drawMockup = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Device dimensions relative to image
    let frameTop = 0;
    let frameBottom = 0;
    let frameSide = 0;
    let cornerRadius = 12;

    switch (device) {
      case 'browser':
        frameTop = 40;
        frameBottom = 0;
        frameSide = 0;
        cornerRadius = 10;
        break;
      case 'iphone':
        frameTop = 80;
        frameBottom = 80;
        frameSide = 20;
        cornerRadius = 40;
        break;
      case 'macbook':
        frameTop = 30;
        frameBottom = 40;
        frameSide = 10;
        cornerRadius = 14;
        break;
      case 'ipad':
        frameTop = 50;
        frameBottom = 50;
        frameSide = 30;
        cornerRadius = 24;
        break;
    }

    const deviceWidth = img.width + frameSide * 2;
    const deviceHeight = img.height + frameTop + frameBottom;
    const totalWidth = deviceWidth + padding * 2;
    const totalHeight = deviceHeight + padding * 2;

    canvas.width = totalWidth;
    canvas.height = totalHeight;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, totalWidth, totalHeight);
    grad.addColorStop(0, bgColor);
    grad.addColorStop(1, bgGradient);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, totalWidth, totalHeight);

    const dx = padding;
    const dy = padding;

    // Shadow
    if (shadow) {
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 40;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 20;
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.roundRect(dx, dy, deviceWidth, deviceHeight, cornerRadius);
      ctx.fill();
      ctx.restore();
    }

    // Device frame body
    ctx.fillStyle = device === 'macbook' ? '#e0e0e0' : '#1a1a1a';
    ctx.beginPath();
    ctx.roundRect(dx, dy, deviceWidth, deviceHeight, cornerRadius);
    ctx.fill();

    // Device-specific decorations
    switch (device) {
      case 'browser': {
        // Title bar
        ctx.fillStyle = '#2d2d2d';
        ctx.beginPath();
        ctx.roundRect(dx, dy, deviceWidth, frameTop, [cornerRadius, cornerRadius, 0, 0]);
        ctx.fill();
        // Traffic lights
        const dots = [
          { color: '#ff5f57', x: dx + 16, y: dy + frameTop / 2 },
          { color: '#ffbd2e', x: dx + 36, y: dy + frameTop / 2 },
          { color: '#28c840', x: dx + 56, y: dy + frameTop / 2 },
        ];
        dots.forEach(({ color, x, y }) => {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(x, y, 6, 0, Math.PI * 2);
          ctx.fill();
        });
        // URL bar
        ctx.fillStyle = '#404040';
        ctx.beginPath();
        ctx.roundRect(dx + 80, dy + 10, deviceWidth - 100, frameTop - 20, 6);
        ctx.fill();
        break;
      }
      case 'iphone': {
        // Notch / Dynamic Island
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        const notchW = 120;
        const notchH = 30;
        ctx.roundRect(dx + (deviceWidth - notchW) / 2, dy + 15, notchW, notchH, 15);
        ctx.fill();
        // Home indicator
        ctx.fillStyle = '#555';
        ctx.beginPath();
        ctx.roundRect(dx + (deviceWidth - 120) / 2, dy + deviceHeight - 30, 120, 5, 3);
        ctx.fill();
        break;
      }
      case 'macbook': {
        // Top bezel with camera
        ctx.fillStyle = '#c0c0c0';
        ctx.beginPath();
        ctx.roundRect(dx, dy, deviceWidth, frameTop, [cornerRadius, cornerRadius, 0, 0]);
        ctx.fill();
        // Camera dot
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.arc(dx + deviceWidth / 2, dy + frameTop / 2, 4, 0, Math.PI * 2);
        ctx.fill();
        // Bottom hinge
        ctx.fillStyle = '#d0d0d0';
        ctx.beginPath();
        ctx.roundRect(dx - 20, dy + deviceHeight, deviceWidth + 40, frameBottom, [0, 0, 6, 6]);
        ctx.fill();
        ctx.fillStyle = '#b0b0b0';
        ctx.fillRect(dx - 20, dy + deviceHeight, deviceWidth + 40, 4);
        break;
      }
      case 'ipad': {
        // Camera
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.arc(dx + deviceWidth / 2, dy + 25, 5, 0, Math.PI * 2);
        ctx.fill();
        // Home button
        ctx.strokeStyle = '#444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(dx + deviceWidth / 2, dy + deviceHeight - 25, 14, 0, Math.PI * 2);
        ctx.stroke();
        break;
      }
    }

    // Draw screenshot image
    const imgX = dx + frameSide;
    const imgY = dy + frameTop;
    ctx.drawImage(img, imgX, imgY, img.width, img.height);
  }, [device, bgColor, bgGradient, padding, shadow]);

  useEffect(() => {
    if (imageRef.current) {
      drawMockup();
    }
  }, [drawMockup]);

  const processImage = useCallback((file: File) => {
    setOriginalFile(file);
    const url = URL.createObjectURL(file);

    const img = new Image();
    img.onload = () => {
      imageRef.current = img;
      drawMockup();
    };
    img.src = url;
  }, [drawMockup]);

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

  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'mockup.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, []);

  const clearImage = useCallback(() => {
    setOriginalFile(null);
    imageRef.current = null;
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  const devices: { value: DeviceFrame; label: string }[] = [
    { value: 'browser', label: isEn ? 'Browser' : 'Браузер' },
    { value: 'iphone', label: 'iPhone' },
    { value: 'macbook', label: 'MacBook' },
    { value: 'ipad', label: 'iPad' },
  ];

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
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
            {isEn ? 'Drag and drop a screenshot here' : 'Перетащите скриншот сюда'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isEn ? 'or click to select a file' : 'или нажмите для выбора файла'}
          </Typography>
        </Paper>
      )}

      {originalFile && (
        <>
          <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, mb: 2, borderRadius: 18 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <DevicesIcon /> {isEn ? 'Mockup settings' : 'Настройки мокапа'}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              {devices.map((d) => (
                <Chip
                  key={d.value}
                  label={d.label}
                  onClick={() => setDevice(d.value)}
                  color={device === d.value ? 'primary' : 'default'}
                  variant={device === d.value ? 'filled' : 'outlined'}
                />
              ))}
            </Box>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1, color: 'text.secondary' }}>
                  {isEn ? 'Padding' : 'Отступ'}: {padding}px
                </Typography>
                <Slider
                  value={padding}
                  onChange={(_, v) => setPadding(v as number)}
                  min={0}
                  max={150}
                  valueLabelDisplay="auto"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={shadow}
                      onChange={(e) => setShadow(e.target.checked)}
                    />
                  }
                  label={isEn ? 'Shadow' : 'Тень'}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary">{isEn ? 'Background color (start)' : 'Цвет фона (начало)'}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <ColorPickerInput value={bgColor} onChange={setBgColor} label={isEn ? 'Background color' : 'Цвет фона'} size="small" />
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{bgColor}</Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary">{isEn ? 'Background color (end)' : 'Цвет фона (конец)'}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <ColorPickerInput value={bgGradient} onChange={setBgGradient} label={isEn ? 'Background color (end)' : 'Цвет фона (конец)'} size="small" />
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{bgGradient}</Typography>
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', gap: 1, mt: 3, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={handleDownload}
              >
                {isEn ? 'Download PNG' : 'Скачать PNG'}
              </Button>
              <Button variant="outlined" onClick={clearImage} color="error" sx={{ minWidth: 48 }}>
                <DeleteIcon />
              </Button>
            </Box>
          </Paper>

          {/* Preview */}
          <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 18 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              {isEn ? 'Preview' : 'Предпросмотр'}
            </Typography>
            <Box
              sx={{
                borderRadius: 10,
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center',
                backgroundColor: alpha(theme.palette.background.default, 0.5)
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
