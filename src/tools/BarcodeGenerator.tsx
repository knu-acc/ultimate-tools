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
  useTheme } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

type BarcodeType = 'code128' | 'ean13' | 'code39';

// Code128 encoding tables
const CODE128_START_B = 104;
const CODE128_STOP = 106;

const CODE128B: Record<string, number> = {};
(() => {
  // Space (32) to DEL (127) maps to values 0-95
  for (let i = 32; i <= 126; i++) {
    CODE128B[String.fromCharCode(i)] = i - 32;
  }
})();

const CODE128_PATTERNS: number[][] = [
  [2,1,2,2,2,2],[2,2,2,1,2,2],[2,2,2,2,2,1],[1,2,1,2,2,3],[1,2,1,3,2,2],
  [1,3,1,2,2,2],[1,2,2,2,1,3],[1,2,2,3,1,2],[1,3,2,2,1,2],[2,2,1,2,1,3],
  [2,2,1,3,1,2],[2,3,1,2,1,2],[1,1,2,2,3,2],[1,2,2,1,3,2],[1,2,2,2,3,1],
  [1,1,3,2,2,2],[1,2,3,1,2,2],[1,2,3,2,2,1],[2,2,3,2,1,1],[2,2,1,1,3,2],
  [2,2,1,2,3,1],[2,1,3,2,1,2],[2,2,3,1,1,2],[3,1,2,1,3,1],[3,1,1,2,2,2],
  [3,2,1,1,2,2],[3,2,1,2,2,1],[3,1,2,2,1,2],[3,2,2,1,1,2],[3,2,2,2,1,1],
  [2,1,2,1,2,3],[2,1,2,3,2,1],[2,3,2,1,2,1],[1,1,1,3,2,3],[1,3,1,1,2,3],
  [1,3,1,3,2,1],[1,1,2,3,1,3],[1,3,2,1,1,3],[1,3,2,3,1,1],[2,1,1,3,1,3],
  [2,3,1,1,1,3],[2,3,1,3,1,1],[1,1,2,1,3,3],[1,1,2,3,3,1],[1,3,2,1,3,1],
  [1,1,3,1,2,3],[1,1,3,3,2,1],[1,3,3,1,2,1],[3,1,3,1,2,1],[2,1,1,3,3,1],
  [2,3,1,1,3,1],[2,1,3,1,1,3],[2,1,3,3,1,1],[2,1,3,1,3,1],[3,1,1,1,2,3],
  [3,1,1,3,2,1],[3,3,1,1,2,1],[3,1,2,1,1,3],[3,1,2,3,1,1],[3,3,2,1,1,1],
  [3,1,4,1,1,1],[2,2,1,4,1,1],[4,3,1,1,1,1],[1,1,1,2,2,4],[1,1,1,4,2,2],
  [1,2,1,1,2,4],[1,2,1,4,2,1],[1,4,1,1,2,2],[1,4,1,2,2,1],[1,1,2,2,1,4],
  [1,1,2,4,1,2],[1,2,2,1,1,4],[1,2,2,4,1,1],[1,4,2,1,1,2],[1,4,2,2,1,1],
  [2,4,1,2,1,1],[2,2,1,1,1,4],[4,1,3,1,1,1],[2,4,1,1,1,2],[1,3,4,1,1,1],
  [1,1,1,2,4,2],[1,2,1,1,4,2],[1,2,1,2,4,1],[1,1,4,2,1,2],[1,2,4,1,1,2],
  [1,2,4,2,1,1],[4,1,1,2,1,2],[4,2,1,1,1,2],[4,2,1,2,1,1],[2,1,2,1,4,1],
  [2,1,4,1,2,1],[4,1,2,1,2,1],[1,1,1,1,4,3],[1,1,1,3,4,1],[1,3,1,1,4,1],
  [1,1,4,1,1,3],[1,1,4,3,1,1],[4,1,1,1,1,3],[4,1,1,3,1,1],[1,1,3,1,4,1],
  [1,1,4,1,3,1],[3,1,1,1,4,1],[4,1,1,1,3,1],[2,1,1,4,1,2],[2,1,1,2,1,4],
  [2,1,1,2,3,2],[2,3,3,1,1,1,2],
];

// Code39 character set
const CODE39_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. $/+%*';
const CODE39_PATTERNS = [
  '101001101101','110100101011','101100101011','110110010101','101001101011',
  '110100110101','101100110101','101001011011','110100101101','101100101101',
  '110101001011','101101001011','110110100101','101011001011','110101100101',
  '101101100101','101010011011','110101001101','101101001101','101011001101',
  '110101010011','101101010011','110110101001','101011010011','110101101001',
  '101101101001','101010110011','110101011001','101101011001','101011011001',
  '110010101011','100110101011','110011010101','100101101011','110010110101',
  '100110110101','100101011011','110010101101','100110101101','100100100101',
  '100100101001','100101001001','101001001001','100101101101',
];

function encodeCode128(text: string): number[] {
  const values: number[] = [CODE128_START_B];
  for (const char of text) {
    const val = CODE128B[char];
    if (val !== undefined) values.push(val);
  }
  // Checksum
  let checksum = values[0];
  for (let i = 1; i < values.length; i++) {
    checksum += values[i] * i;
  }
  values.push(checksum % 103);
  values.push(CODE128_STOP);
  return values;
}

function encodeEAN13(digits: string): string | null {
  if (digits.length < 12) return null;
  const d = digits.slice(0, 12).split('').map(Number);
  // Calculate check digit
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += d[i] * (i % 2 === 0 ? 1 : 3);
  }
  const check = (10 - (sum % 10)) % 10;
  d.push(check);

  const L = ['0001101','0011001','0010011','0111101','0100011','0110001','0101111','0111011','0110111','0001011'];
  const G = ['0100111','0110011','0011011','0100001','0011101','0111001','0000101','0010001','0001001','0010111'];
  const R = ['1110010','1100110','1101100','1000010','1011100','1001110','1010000','1000100','1001000','1110100'];

  const parity = [
    'LLLLLL','LLGLGG','LLGGLG','LLGGGL','LGLLGG',
    'LGGLLG','LGGGLL','LGLGLG','LGLGGL','LGGLGL',
  ];

  let bars = '101'; // Start guard
  const p = parity[d[0]];
  for (let i = 1; i <= 6; i++) {
    bars += p[i - 1] === 'L' ? L[d[i]] : G[d[i]];
  }
  bars += '01010'; // Center guard
  for (let i = 7; i <= 12; i++) {
    bars += R[d[i]];
  }
  bars += '101'; // End guard
  return bars;
}

function encodeCode39(text: string): string {
  const upper = ('*' + text.toUpperCase() + '*');
  let bars = '';
  for (const char of upper) {
    const idx = CODE39_CHARS.indexOf(char);
    if (idx >= 0) {
      bars += CODE39_PATTERNS[idx] + '0';
    }
  }
  return bars;
}

export default function BarcodeGenerator() {
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState('123456789012');
  const [barcodeType, setBarcodeType] = useState<BarcodeType>('code128');
  const [barWidth, setBarWidth] = useState(2);
  const [barHeight, setBarHeight] = useState(100);
  const [showText, setShowText] = useState(true);
  const [error, setError] = useState('');

  const drawBarcode = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setError('');

    if (!text.trim()) {
      canvas.width = 200;
      canvas.height = 50;
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, 200, 50);
      return;
    }

    const paddingX = 20;
    const paddingY = 10;
    const textHeight = showText ? 24 : 0;

    if (barcodeType === 'code128') {
      const values = encodeCode128(text);
      // Calculate total width
      let totalBars = 0;
      values.forEach((val, idx) => {
        const pattern = CODE128_PATTERNS[val];
        if (pattern) {
          totalBars += pattern.reduce((a, b) => a + b, 0);
        }
      });

      canvas.width = totalBars * barWidth + paddingX * 2;
      canvas.height = barHeight + paddingY * 2 + textHeight;

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      let x = paddingX;
      values.forEach((val) => {
        const pattern = CODE128_PATTERNS[val];
        if (!pattern) return;
        for (let i = 0; i < pattern.length; i++) {
          const w = pattern[i] * barWidth;
          ctx.fillStyle = i % 2 === 0 ? '#000000' : '#FFFFFF';
          ctx.fillRect(x, paddingY, w, barHeight);
          x += w;
        }
      });

      if (showText) {
        ctx.fillStyle = '#000000';
        ctx.font = '14px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(text, canvas.width / 2, barHeight + paddingY + 18);
      }
    } else if (barcodeType === 'ean13') {
      const cleanDigits = text.replace(/\D/g, '');
      if (cleanDigits.length < 12) {
        setError('EAN-13 требует минимум 12 цифр');
        canvas.width = 200;
        canvas.height = 50;
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, 200, 50);
        return;
      }
      const bars = encodeEAN13(cleanDigits);
      if (!bars) return;

      canvas.width = bars.length * barWidth + paddingX * 2;
      canvas.height = barHeight + paddingY * 2 + textHeight;

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < bars.length; i++) {
        if (bars[i] === '1') {
          ctx.fillStyle = '#000000';
          ctx.fillRect(paddingX + i * barWidth, paddingY, barWidth, barHeight);
        }
      }

      if (showText) {
        const d = cleanDigits.slice(0, 12).split('').map(Number);
        let sum = 0;
        for (let i = 0; i < 12; i++) sum += d[i] * (i % 2 === 0 ? 1 : 3);
        const check = (10 - (sum % 10)) % 10;
        const display = cleanDigits.slice(0, 12) + check;
        ctx.fillStyle = '#000000';
        ctx.font = '14px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(display, canvas.width / 2, barHeight + paddingY + 18);
      }
    } else if (barcodeType === 'code39') {
      const bars = encodeCode39(text);
      canvas.width = bars.length * barWidth + paddingX * 2;
      canvas.height = barHeight + paddingY * 2 + textHeight;

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < bars.length; i++) {
        if (bars[i] === '1') {
          ctx.fillStyle = '#000000';
          ctx.fillRect(paddingX + i * barWidth, paddingY, barWidth, barHeight);
        }
      }

      if (showText) {
        ctx.fillStyle = '#000000';
        ctx.font = '14px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('*' + text.toUpperCase() + '*', canvas.width / 2, barHeight + paddingY + 18);
      }
    }
  }, [text, barcodeType, barWidth, barHeight, showText]);

  useEffect(() => {
    drawBarcode();
  }, [drawBarcode]);

  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `barcode_${barcodeType}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [barcodeType]);

  const types: { value: BarcodeType; label: string }[] = [
    { value: 'code128', label: 'Code 128' },
    { value: 'ean13', label: 'EAN-13' },
    { value: 'code39', label: 'Code 39' },
  ];

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Тип штрих-кода
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            {types.map((t) => (
              <Chip
                key={t.value}
                label={t.label}
                onClick={() => setBarcodeType(t.value)}
                color={barcodeType === t.value ? 'primary' : 'default'}
                variant={barcodeType === t.value ? 'filled' : 'outlined'}
              />
            ))}
          </Box>

          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            {barcodeType === 'ean13' ? 'Цифры (минимум 12)' : 'Текст / число'}
          </Typography>
          <TextField
            fullWidth
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={barcodeType === 'ean13' ? '123456789012' : 'Введите данные...'}
            size="small"
            error={!!error}
            helperText={error}
            sx={{ mb: 2 }}
          />

          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Ширина линии: {barWidth}px
          </Typography>
          <Slider
            value={barWidth}
            onChange={(_, v) => setBarWidth(v as number)}
            min={1}
            max={5}
            step={1}
            sx={{ mb: 2 }}
          />

          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Высота: {barHeight}px
          </Typography>
          <Slider
            value={barHeight}
            onChange={(_, v) => setBarHeight(v as number)}
            min={40}
            max={200}
            step={10}
            sx={{ mb: 2 }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={showText}
                onChange={(e) => setShowText(e.target.checked)}
              />
            }
            label="Показать текст"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              textAlign: 'center'
            }}
          >
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Предпросмотр
            </Typography>
            <Box
              sx={{
                borderRadius: 2,
                overflow: 'auto',
                backgroundColor: '#fff',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 150,
                p: 2
              }}
            >
              <canvas ref={canvasRef} style={{ display: 'block' }} />
            </Box>

            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={handleDownload}
                disabled={!text.trim() || !!error}
                sx={{ borderRadius: 5 }}
              >
                Скачать PNG
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
