'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box, Typography, Paper, Grid, Button, Chip, TextField, alpha, useTheme, Slider,
  Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { Download } from '@mui/icons-material';

type BarcodeType = 'code128' | 'code39' | 'ean13' | 'ean8' | 'upca';

// Code128 encoding tables
const CODE128_START_B = 104;
const CODE128_STOP = 106;

const CODE128B: Record<string, number> = {};
for (let i = 0; i < 95; i++) {
  CODE128B[String.fromCharCode(32 + i)] = i;
}

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

const STOP_PATTERN = [2,3,3,1,1,1,2];

// Code39 encoding
const CODE39_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. $/+%*';
const CODE39_PATTERNS: string[] = [
  'nnnwwnwnn','wnnnnnnwn','nnwnnnnwn','wnwnnnnnn','nnnwnnnwn','wnnwnnnnn',
  'nnwwnnnnn','nnnnnwnwn','wnnnnwnnn','nnwnnwnnn','wnnnnnnwn','nnwnnnnwn',
  'wnwnnnnnn','nnnwnnnwn','wnnwnnnnn','nnwwnnnnn','nnnnnwnwn','wnnnnwnnn',
  'nnwnnwnnn','nnnwnwnnn','wnnnnnnwn','nnwnnnnwn','wnwnnnnnn','nnnwnnnwn',
  'wnnwnnnnn','nnwwnnnnn','nnnnnwnwn','wnnnnwnnn','nnwnnwnnn','nnnwnwnnn',
  'wnnnnnnwn','nnwnnnnwn','wnwnnnnnn','nnnwnnnwn','wnnwnnnnn','nnwwnnnnn',
  'nwnnnwnnn','wnnnnnwnw','nwnnnnwnw','nwnwnnnnn','nwnwnwnnn','nwnwnwnnn',
  'nnnnnwnwn','nwnnnwnwn',
];

// Proper Code39 binary patterns
const CODE39_BINARY: Record<string, string> = {
  '0': '101001101101', '1': '110100101011', '2': '101100101011', '3': '110110010101',
  '4': '101001101011', '5': '110100110101', '6': '101100110101', '7': '101001011011',
  '8': '110100101101', '9': '101100101101', 'A': '110101001011', 'B': '101101001011',
  'C': '110110100101', 'D': '101011001011', 'E': '110101100101', 'F': '101101100101',
  'G': '101010011011', 'H': '110101001101', 'I': '101101001101', 'J': '101011001101',
  'K': '110101010011', 'L': '101101010011', 'M': '110110101001', 'N': '101011010011',
  'O': '110101101001', 'P': '101101101001', 'Q': '101010110011', 'R': '110101011001',
  'S': '101101011001', 'T': '101011011001', 'U': '110010101011', 'V': '100110101011',
  'W': '110011010101', 'X': '100101101011', 'Y': '110010110101', 'Z': '100110110101',
  '-': '100101011011', '.': '110010101101', ' ': '100110101101', '$': '100100100101',
  '/': '100100101001', '+': '100101001001', '%': '101001001001', '*': '100101101101'
};

function encodeCode128(text: string): number[] {
  const values: number[] = [CODE128_START_B];
  for (const ch of text) {
    const val = CODE128B[ch];
    if (val !== undefined) values.push(val);
  }

  // Calculate checksum
  let checksum = values[0];
  for (let i = 1; i < values.length; i++) {
    checksum += values[i] * i;
  }
  checksum = checksum % 103;
  values.push(checksum);
  values.push(CODE128_STOP);

  return values;
}

function calculateEAN13CheckDigit(digits: string): number {
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const d = parseInt(digits[i], 10);
    sum += i % 2 === 0 ? d : d * 3;
  }
  return (10 - (sum % 10)) % 10;
}

function calculateEAN8CheckDigit(digits: string): number {
  let sum = 0;
  for (let i = 0; i < 7; i++) {
    const d = parseInt(digits[i], 10);
    sum += i % 2 === 0 ? d * 3 : d;
  }
  return (10 - (sum % 10)) % 10;
}

function calculateUPCACheckDigit(digits: string): number {
  let sum = 0;
  for (let i = 0; i < 11; i++) {
    const d = parseInt(digits[i], 10);
    sum += i % 2 === 0 ? d * 3 : d;
  }
  return (10 - (sum % 10)) % 10;
}

// EAN encoding patterns
const EAN_L: string[] = ['0001101','0011001','0010011','0111101','0100011','0110001','0101111','0111011','0110111','0001011'];
const EAN_G: string[] = ['0100111','0110011','0011011','0100001','0011101','0111001','0000101','0010001','0001001','0010111'];
const EAN_R: string[] = ['1110010','1100110','1101100','1000010','1011100','1001110','1010000','1000100','1001000','1110100'];
const EAN_PARITY: string[] = ['LLLLLL','LLGLGG','LLGGLG','LLGGGL','LGLLGG','LGGLLG','LGGGLL','LGLGLG','LGLGGL','LGGLGL'];

function drawBarcode(
  ctx: CanvasRenderingContext2D,
  type: BarcodeType,
  text: string,
  barWidth: number,
  height: number,
  showText: boolean,
) {
  const textHeight = showText ? 20 : 0;
  const barsHeight = height - textHeight;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  let x = 10; // left padding

  const drawBar = (width: number, black: boolean) => {
    if (black) {
      ctx.fillStyle = '#000000';
      ctx.fillRect(x, 0, width, barsHeight);
    }
    x += width;
  };

  const drawBars = (pattern: string) => {
    for (let i = 0; i < pattern.length; i++) {
      drawBar(barWidth, pattern[i] === '1');
    }
  };

  if (type === 'code128') {
    const values = encodeCode128(text);
    // Quiet zone
    x = 10 * barWidth;

    for (let vi = 0; vi < values.length; vi++) {
      const val = values[vi];
      const pattern = vi === values.length - 1 ? STOP_PATTERN : CODE128_PATTERNS[val];
      if (!pattern) continue;

      for (let pi = 0; pi < pattern.length; pi++) {
        const w = pattern[pi] * barWidth;
        drawBar(w, pi % 2 === 0);
      }
    }

    const totalWidth = x + 10 * barWidth;
    ctx.canvas.width = totalWidth;
    // Redraw
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, totalWidth, height);
    x = 10 * barWidth;
    for (let vi = 0; vi < values.length; vi++) {
      const val = values[vi];
      const pattern = vi === values.length - 1 ? STOP_PATTERN : CODE128_PATTERNS[val];
      if (!pattern) continue;
      for (let pi = 0; pi < pattern.length; pi++) {
        const w = pattern[pi] * barWidth;
        drawBar(w, pi % 2 === 0);
      }
    }

    if (showText) {
      ctx.fillStyle = '#000000';
      ctx.font = `${Math.max(12, barWidth * 8)}px monospace`;
      ctx.textAlign = 'center';
      ctx.fillText(text, totalWidth / 2, height - 3);
    }

  } else if (type === 'code39') {
    const data = `*${text.toUpperCase()}*`;
    x = 10 * barWidth;

    for (const ch of data) {
      const pattern = CODE39_BINARY[ch];
      if (!pattern) continue;
      drawBars(pattern);
      drawBar(barWidth, false); // inter-character gap
    }

    if (showText) {
      ctx.fillStyle = '#000000';
      ctx.font = `${Math.max(12, barWidth * 8)}px monospace`;
      ctx.textAlign = 'center';
      ctx.fillText(text.toUpperCase(), ctx.canvas.width / 2, height - 3);
    }

  } else if (type === 'ean13') {
    let digits = text.replace(/\D/g, '').padEnd(12, '0').slice(0, 12);
    const check = calculateEAN13CheckDigit(digits);
    digits += check;

    const startGuard = '101';
    const centerGuard = '01010';
    const endGuard = '101';
    const firstDigit = parseInt(digits[0], 10);
    const parity = EAN_PARITY[firstDigit];

    const totalBits = 3 + 42 + 5 + 42 + 3;
    const totalWidth = totalBits * barWidth + 20 * barWidth;
    ctx.canvas.width = totalWidth;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, totalWidth, height);

    x = 10 * barWidth;
    drawBars(startGuard);

    for (let i = 0; i < 6; i++) {
      const d = parseInt(digits[i + 1], 10);
      const enc = parity[i] === 'L' ? EAN_L[d] : EAN_G[d];
      drawBars(enc);
    }

    drawBars(centerGuard);

    for (let i = 0; i < 6; i++) {
      const d = parseInt(digits[i + 7], 10);
      drawBars(EAN_R[d]);
    }

    drawBars(endGuard);

    if (showText) {
      ctx.fillStyle = '#000000';
      ctx.font = `${Math.max(12, barWidth * 8)}px monospace`;
      ctx.textAlign = 'center';
      ctx.fillText(digits, totalWidth / 2, height - 3);
    }

  } else if (type === 'ean8') {
    let digits = text.replace(/\D/g, '').padEnd(7, '0').slice(0, 7);
    const check = calculateEAN8CheckDigit(digits);
    digits += check;

    const totalBits = 3 + 28 + 5 + 28 + 3;
    const totalWidth = totalBits * barWidth + 20 * barWidth;
    ctx.canvas.width = totalWidth;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, totalWidth, height);

    x = 10 * barWidth;
    drawBars('101'); // start

    for (let i = 0; i < 4; i++) {
      const d = parseInt(digits[i], 10);
      drawBars(EAN_L[d]);
    }

    drawBars('01010'); // center

    for (let i = 4; i < 8; i++) {
      const d = parseInt(digits[i], 10);
      drawBars(EAN_R[d]);
    }

    drawBars('101'); // end

    if (showText) {
      ctx.fillStyle = '#000000';
      ctx.font = `${Math.max(12, barWidth * 8)}px monospace`;
      ctx.textAlign = 'center';
      ctx.fillText(digits, totalWidth / 2, height - 3);
    }

  } else if (type === 'upca') {
    let digits = text.replace(/\D/g, '').padEnd(11, '0').slice(0, 11);
    const check = calculateUPCACheckDigit(digits);
    digits += check;

    const totalBits = 3 + 42 + 5 + 42 + 3;
    const totalWidth = totalBits * barWidth + 20 * barWidth;
    ctx.canvas.width = totalWidth;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, totalWidth, height);

    x = 10 * barWidth;
    drawBars('101');

    for (let i = 0; i < 6; i++) {
      const d = parseInt(digits[i], 10);
      drawBars(EAN_L[d]);
    }

    drawBars('01010');

    for (let i = 6; i < 12; i++) {
      const d = parseInt(digits[i], 10);
      drawBars(EAN_R[d]);
    }

    drawBars('101');

    if (showText) {
      ctx.fillStyle = '#000000';
      ctx.font = `${Math.max(12, barWidth * 8)}px monospace`;
      ctx.textAlign = 'center';
      ctx.fillText(digits, totalWidth / 2, height - 3);
    }
  }
}

export default function BarcodeGen() {
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState('Hello123');
  const [barcodeType, setBarcodeType] = useState<BarcodeType>('code128');
  const [barWidth, setBarWidth] = useState(2);
  const [barcodeHeight, setBarcodeHeight] = useState(100);
  const [showText, setShowText] = useState(true);
  const [error, setError] = useState('');

  const validateInput = useCallback((val: string, type: BarcodeType): string => {
    if (!val.trim()) return 'Введите данные для кодирования';
    if (type === 'ean13') {
      const digits = val.replace(/\D/g, '');
      if (digits.length < 12) return 'EAN-13 требует минимум 12 цифр';
    }
    if (type === 'ean8') {
      const digits = val.replace(/\D/g, '');
      if (digits.length < 7) return 'EAN-8 требует минимум 7 цифр';
    }
    if (type === 'upca') {
      const digits = val.replace(/\D/g, '');
      if (digits.length < 11) return 'UPC-A требует минимум 11 цифр';
    }
    if (type === 'code39') {
      const valid = /^[0-9A-Z\-. $/+%]+$/i.test(val);
      if (!valid) return 'Code39 поддерживает: 0-9, A-Z, -, ., пробел, $, /, +, %';
    }
    return '';
  }, []);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const err = validateInput(text, barcodeType);
    if (err) {
      setError(err);
      canvas.width = 300;
      canvas.height = barcodeHeight;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 300, barcodeHeight);
      ctx.fillStyle = '#999999';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(err, 150, barcodeHeight / 2);
      return;
    }

    setError('');

    // Set initial canvas size (drawBarcode may resize)
    canvas.width = 400;
    canvas.height = barcodeHeight;

    drawBarcode(ctx, barcodeType, text, barWidth, barcodeHeight, showText);
  }, [text, barcodeType, barWidth, barcodeHeight, showText, validateInput]);

  useEffect(() => {
    render();
  }, [render]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `barcode-${barcodeType}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleTypeChange = (type: BarcodeType) => {
    setBarcodeType(type);
    // Set a sensible default value
    if (type === 'ean13') setText('4006381333931');
    else if (type === 'ean8') setText('96385074');
    else if (type === 'upca') setText('012345678905');
    else if (type === 'code39') setText('HELLO');
    else setText('Hello123');
  };

  const typeOptions: { value: BarcodeType; label: string }[] = [
    { value: 'code128', label: 'Code 128' },
    { value: 'code39', label: 'Code 39' },
    { value: 'ean13', label: 'EAN-13' },
    { value: 'ean8', label: 'EAN-8' },
    { value: 'upca', label: 'UPC-A' },
  ];

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Данные
          </Typography>
          <TextField
            fullWidth
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Введите текст или число..."
            error={!!error}
            helperText={error || undefined}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          />

          {/* Barcode type */}
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Тип штрих-кода
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            {typeOptions.map(opt => (
              <Chip
                key={opt.value}
                label={opt.label}
                onClick={() => handleTypeChange(opt.value)}
                sx={{
                  fontWeight: 600,
                  cursor: 'pointer',
                  bgcolor: barcodeType === opt.value
                    ? alpha(theme.palette.primary.main, 0.15)
                    : theme.palette.surfaceContainerLow,
                  color: barcodeType === opt.value ? theme.palette.primary.main : theme.palette.text.primary
                }}
              />
            ))}
          </Box>

          {/* Bar width */}
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Ширина линий: x{barWidth}
          </Typography>
          <Slider
            value={barWidth}
            onChange={(_, v) => setBarWidth(v as number)}
            min={1}
            max={5}
            step={1}
            marks
            sx={{ mb: 2, mx: 1 }}
          />

          {/* Height */}
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Высота: {barcodeHeight}px
          </Typography>
          <Slider
            value={barcodeHeight}
            onChange={(_, v) => setBarcodeHeight(v as number)}
            min={40}
            max={200}
            step={10}
            sx={{ mb: 2, mx: 1 }}
          />

          {/* Show text toggle */}
          <Box sx={{ mb: 2 }}>
            <Chip
              label={showText ? 'Текст под штрих-кодом: Вкл' : 'Текст под штрих-кодом: Выкл'}
              onClick={() => setShowText(!showText)}
              sx={{
                fontWeight: 600,
                cursor: 'pointer',
                bgcolor: showText
                  ? alpha(theme.palette.primary.main, 0.15)
                  : theme.palette.surfaceContainerLow,
                color: showText ? theme.palette.primary.main : theme.palette.text.primary
              }}
            />
          </Box>

          <Button
            variant="contained"
            fullWidth
            size="large"
            startIcon={<Download />}
            onClick={handleDownload}
            disabled={!!error}
            sx={{ borderRadius: 6, py: 1.2 }}
          >
            Скачать PNG
          </Button>

          {(barcodeType === 'ean13' || barcodeType === 'ean8' || barcodeType === 'upca') && !error && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Контрольная цифра рассчитывается автоматически
            </Typography>
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: theme.palette.surfaceContainerLow,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <Box
              sx={{
                bgcolor: '#ffffff',
                p: 2,
                borderRadius: 2,
                display: 'inline-block'
              }}
            >
              <canvas
                ref={canvasRef}
                style={{
                  maxWidth: '100%',
                  height: 'auto'
                }}
              />
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
              {typeOptions.find(t => t.value === barcodeType)?.label} | Множитель: x{barWidth} | Высота: {barcodeHeight}px
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
