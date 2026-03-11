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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme } from '@mui/material';
import { ContentCopy, Download } from '@mui/icons-material';
import { CopyButton, ShareButton } from '@/src/components/CopyButton';


type QrMode = 'url' | 'text' | 'wifi' | 'vcard';

import { generateQR } from './qrcore';

function generateQRMatrix(text: string): boolean[][] {
  return generateQR(text);
}

export default function QrCodeGen() {
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<QrMode>('url');
  const [size, setSize] = useState(256);

  // URL / Text
  const [urlText, setUrlText] = useState('https://example.com');

  // WiFi
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiEncryption, setWifiEncryption] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');

  // vCard
  const [vcardName, setVcardName] = useState('');
  const [vcardPhone, setVcardPhone] = useState('');
  const [vcardEmail, setVcardEmail] = useState('');
  const [vcardOrg, setVcardOrg] = useState('');

  const getQrContent = useCallback((): string => {
    switch (mode) {
      case 'url':
      case 'text':
        return urlText;
      case 'wifi':
        return `WIFI:T:${wifiEncryption};S:${wifiSsid};P:${wifiPassword};;`;
      case 'vcard': {
        const parts = [
          'BEGIN:VCARD',
          'VERSION:3.0',
        ];
        if (vcardName) parts.push(`FN:${vcardName}`);
        if (vcardPhone) parts.push(`TEL:${vcardPhone}`);
        if (vcardEmail) parts.push(`EMAIL:${vcardEmail}`);
        if (vcardOrg) parts.push(`ORG:${vcardOrg}`);
        parts.push('END:VCARD');
        return parts.join('\n');
      }
      default:
        return '';
    }
  }, [mode, urlText, wifiSsid, wifiPassword, wifiEncryption, vcardName, vcardPhone, vcardEmail, vcardOrg]);

  const drawQR = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const content = getQrContent();
    if (!content.trim()) {
      canvas.width = size;
      canvas.height = size;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = '#999';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Введите данные', size / 2, size / 2);
      return;
    }

    canvas.width = size;
    canvas.height = size;

    const matrix = generateQRMatrix(content);
    const cellSize = size / matrix.length;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);

    ctx.fillStyle = '#000000';
    matrix.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          ctx.fillRect(x * cellSize, y * cellSize, cellSize + 0.5, cellSize + 0.5);
        }
      });
    });
  }, [getQrContent, size]);

  useEffect(() => {
    drawQR();
  }, [drawQR]);

  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, []);

  const handleCopy = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => { if (b) resolve(b); }, 'image/png');
      });
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    } catch {
      // fallback
    }
  }, []);

  const modes: { value: QrMode; label: string }[] = [
    { value: 'url', label: 'URL' },
    { value: 'text', label: 'Текст' },
    { value: 'wifi', label: 'WiFi' },
    { value: 'vcard', label: 'vCard' },
  ];

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Тип содержимого
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
            {modes.map((m) => (
              <Chip
                key={m.value}
                label={m.label}
                onClick={() => setMode(m.value)}
                color={mode === m.value ? 'primary' : 'default'}
                variant={mode === m.value ? 'filled' : 'outlined'}
              />
            ))}
          </Box>

          {/* URL / Text mode */}
          {(mode === 'url' || mode === 'text') && (
            <>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                {mode === 'url' ? 'URL-адрес' : 'Текст'}
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                value={urlText}
                onChange={(e) => setUrlText(e.target.value)}
                placeholder={mode === 'url' ? 'https://example.com' : 'Введите текст...'}
                sx={{ mb: 2 }}
              />
            </>
          )}

          {/* WiFi mode */}
          {mode === 'wifi' && (
            <>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Настройки WiFi
              </Typography>
              <TextField
                fullWidth
                label="Название сети (SSID)"
                value={wifiSsid}
                onChange={(e) => setWifiSsid(e.target.value)}
                placeholder="MyWiFiNetwork"
                size="small"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Пароль"
                value={wifiPassword}
                onChange={(e) => setWifiPassword(e.target.value)}
                placeholder="password123"
                size="small"
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>Шифрование</InputLabel>
                <Select
                  value={wifiEncryption}
                  label="Шифрование"
                  onChange={(e) => setWifiEncryption(e.target.value as 'WPA' | 'WEP' | 'nopass')}
                >
                  <MenuItem value="WPA">WPA/WPA2</MenuItem>
                  <MenuItem value="WEP">WEP</MenuItem>
                  <MenuItem value="nopass">Без пароля</MenuItem>
                </Select>
              </FormControl>
            </>
          )}

          {/* vCard mode */}
          {mode === 'vcard' && (
            <>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Контактные данные
              </Typography>
              <TextField
                fullWidth
                label="Имя"
                value={vcardName}
                onChange={(e) => setVcardName(e.target.value)}
                placeholder="Иван Иванов"
                size="small"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Телефон"
                value={vcardPhone}
                onChange={(e) => setVcardPhone(e.target.value)}
                placeholder="+7 999 123-45-67"
                size="small"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Email"
                value={vcardEmail}
                onChange={(e) => setVcardEmail(e.target.value)}
                placeholder="ivan@example.com"
                size="small"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Организация"
                value={vcardOrg}
                onChange={(e) => setVcardOrg(e.target.value)}
                placeholder="ООО Компания"
                size="small"
                sx={{ mb: 2 }}
              />
            </>
          )}

          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Размер: {size}px
          </Typography>
          <Slider
            value={size}
            onChange={(_, v) => setSize(v as number)}
            min={128}
            max={512}
            step={32}
            sx={{ mb: 2 }}
          />

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            Генератор создаёт полноценные сканируемые QR-коды стандарта ISO 18004.
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: theme.palette.surfaceContainerLow,
              textAlign: 'center'
            }}
          >
            <canvas
              ref={canvasRef}
              style={{
                maxWidth: '100%',
                height: 'auto',
                borderRadius: 8
              }}
            />

            <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center' }}>
              <Button
                variant="contained"
                startIcon={<Download />}
                onClick={handleDownload}
                sx={{ borderRadius: 5 }}
              >
                Скачать PNG
              </Button>
              <Button
                variant="outlined"
                startIcon={<ContentCopy />}
                onClick={handleCopy}
                sx={{ borderRadius: 5 }}
              >
                Копировать
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
