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
  useTheme,
  alpha
} from '@mui/material';
import { Download } from '@mui/icons-material';
import { useLanguage } from '@/src/i18n/LanguageContext';

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

  const [urlText, setUrlText] = useState('https://example.com');
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiEncryption, setWifiEncryption] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [vcardName, setVcardName] = useState('');
  const [vcardPhone, setVcardPhone] = useState('');
  const [vcardEmail, setVcardEmail] = useState('');
  const [vcardOrg, setVcardOrg] = useState('');
  const { locale } = useLanguage();
  const isEn = locale === 'en';

  const getQrContent = useCallback((): string => {
    switch (mode) {
      case 'url':
      case 'text':
        return urlText;
      case 'wifi':
        return `WIFI:T:${wifiEncryption};S:${wifiSsid};P:${wifiPassword};;`;
      case 'vcard': {
        const parts = ['BEGIN:VCARD', 'VERSION:3.0'];
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
      ctx.fillText(isEn ? 'Enter data' : 'Введите данные', size / 2, size / 2);
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
  }, [getQrContent, size, isEn]);

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

  const modes: { value: QrMode; label: string }[] = [
    { value: 'url', label: 'URL' },
    { value: 'text', label: isEn ? 'Text' : 'Текст' },
    { value: 'wifi', label: 'WiFi' },
    { value: 'vcard', label: 'vCard' },
  ];

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: { xs: 2, sm: 3 } }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
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

          {(mode === 'url' || mode === 'text') && (
            <TextField
              fullWidth
              multiline
              rows={3}
              value={urlText}
              onChange={(e) => setUrlText(e.target.value)}
              placeholder={mode === 'url' ? 'https://example.com' : (isEn ? 'Enter text...' : 'Введите текст...')}
              sx={{ mb: 2 }}
            />
          )}

          {mode === 'wifi' && (
            <>
              <TextField
                fullWidth
                value={wifiSsid}
                onChange={(e) => setWifiSsid(e.target.value)}
                placeholder={isEn ? 'Network name (SSID)' : 'Название сети (SSID)'}
                size="small"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                value={wifiPassword}
                onChange={(e) => setWifiPassword(e.target.value)}
                placeholder={isEn ? 'Password' : 'Пароль'}
                size="small"
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>{isEn ? 'Encryption' : 'Шифрование'}</InputLabel>
                <Select
                  value={wifiEncryption}
                  label={isEn ? 'Encryption' : 'Шифрование'}
                  onChange={(e) => setWifiEncryption(e.target.value as 'WPA' | 'WEP' | 'nopass')}
                >
                  <MenuItem value="WPA">WPA/WPA2</MenuItem>
                  <MenuItem value="WEP">WEP</MenuItem>
                  <MenuItem value="nopass">{isEn ? 'No password' : 'Без пароля'}</MenuItem>
                </Select>
              </FormControl>
            </>
          )}

          {mode === 'vcard' && (
            <>
              <TextField
                fullWidth
                value={vcardName}
                onChange={(e) => setVcardName(e.target.value)}
                placeholder={isEn ? 'Name' : 'Имя'}
                size="small"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                value={vcardPhone}
                onChange={(e) => setVcardPhone(e.target.value)}
                placeholder="+7 999 123-45-67"
                size="small"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                value={vcardEmail}
                onChange={(e) => setVcardEmail(e.target.value)}
                placeholder="Email"
                size="small"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                value={vcardOrg}
                onChange={(e) => setVcardOrg(e.target.value)}
                placeholder={isEn ? 'Organization' : 'Организация'}
                size="small"
                sx={{ mb: 2 }}
              />
            </>
          )}

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', mb: 1 }}>
              {isEn ? 'Size' : 'Размер'}: {size}px
            </Typography>
            <Slider
              value={size}
              onChange={(_, v) => setSize(v as number)}
              min={128}
              max={512}
              step={32}
            />
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 18,
              bgcolor: theme.palette.surfaceContainerLow,
              textAlign: 'center',
              transitionProperty: 'background-color', transitionDuration: '200ms', transitionTimingFunction: 'ease',
              '&:hover': { background: alpha(theme.palette.primary.main, 0.04) }
            }}
          >
            <canvas
              ref={canvasRef}
              style={{
                maxWidth: '100%',
                height: 'auto',
                borderRadius: 18
              }}
            />

            <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center' }}>
              <Button
                variant="contained"
                startIcon={<Download />}
                onClick={handleDownload}
                sx={{ borderRadius: 18, textTransform: 'none', fontWeight: 600 }}
              >
                {isEn ? 'Download PNG' : 'Скачать PNG'}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
