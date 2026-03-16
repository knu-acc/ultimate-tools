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
  Alert,
  useTheme,
  alpha
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { useLanguage } from '@/src/i18n/LanguageContext';

type BarcodeType = 'code128' | 'ean13' | 'code39';

// ── Code 128 (Code Set B: ASCII 32–126) ─────────────────────────────────────
const CODE128_START_B = 104;
const CODE128_STOP = 106;

const CODE128B: Record<string, number> = {};
(() => {
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

function encodeCode128(text: string): { values: number[]; invalidChars: string[] } {
  const values: number[] = [CODE128_START_B];
  const invalidChars: string[] = [];
  for (const char of text) {
    const val = CODE128B[char];
    if (val !== undefined) {
      values.push(val);
    } else {
      if (!invalidChars.includes(char)) invalidChars.push(char);
    }
  }
  let checksum = values[0];
  for (let i = 1; i < values.length; i++) {
    checksum += values[i] * i;
  }
  values.push(checksum % 103);
  values.push(CODE128_STOP);
  return { values, invalidChars };
}

// ── EAN-13 ───────────────────────────────────────────────────────────────────
function calcEAN13Check(digits12: number[]): number {
  let sum = 0;
  for (let i = 0; i < 12; i++) sum += digits12[i] * (i % 2 === 0 ? 1 : 3);
  return (10 - (sum % 10)) % 10;
}

function encodeEAN13(digits: string): { bars: string; display: string } | null {
  const clean = digits.replace(/\D/g, '');
  if (clean.length < 12) return null;

  const d = clean.slice(0, 12).split('').map(Number);
  const check = calcEAN13Check(d);
  d.push(check);

  const L = ['0001101','0011001','0010011','0111101','0100011','0110001','0101111','0111011','0110111','0001011'];
  const G = ['0100111','0110011','0011011','0100001','0011101','0111001','0000101','0010001','0001001','0010111'];
  const R = ['1110010','1100110','1101100','1000010','1011100','1001110','1010000','1000100','1001000','1110100'];
  const parityTable = [
    'LLLLLL','LLGLGG','LLGGLG','LLGGGL','LGLLGG',
    'LGGLLG','LGGGLL','LGLGLG','LGLGGL','LGGLGL',
  ];

  let bars = '101'; // left guard
  const p = parityTable[d[0]];
  for (let i = 1; i <= 6; i++) bars += p[i - 1] === 'L' ? L[d[i]] : G[d[i]];
  bars += '01010'; // center guard
  for (let i = 7; i <= 12; i++) bars += R[d[i]];
  bars += '101'; // right guard

  return { bars, display: d.join('') };
}

// ── Code 39 ──────────────────────────────────────────────────────────────────
// Each pattern is a binary run-length string.
// '1' = narrow element (1 unit), '11' = wide element (3 units by renderer).
// The renderer uses run-length detection so '1' → narrowWidth, '11' → wideWidth (3×).
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

function validateCode39(text: string): string[] {
  const validChars = CODE39_CHARS.replace('*', ''); // * is reserved for start/stop
  const invalid: string[] = [];
  for (const char of text.toUpperCase()) {
    if (!validChars.includes(char) && !invalid.includes(char)) {
      invalid.push(char);
    }
  }
  return invalid;
}

function encodeCode39(text: string): string {
  const upper = '*' + text.toUpperCase() + '*';
  let bars = '';
  for (let ci = 0; ci < upper.length; ci++) {
    const char = upper[ci];
    const idx = CODE39_CHARS.indexOf(char);
    if (idx >= 0) {
      bars += CODE39_PATTERNS[idx];
      if (ci < upper.length - 1) bars += '0'; // narrow inter-character gap
    }
  }
  return bars;
}

// Render Code39 bars with proper narrow:wide = 1:3 ratio using run-length detection
function renderCode39(
  ctx: CanvasRenderingContext2D,
  bars: string,
  x: number,
  y: number,
  narrowW: number,
  height: number
): number {
  const wideW = narrowW * 3;
  let pos = x;
  let i = 0;
  ctx.fillStyle = '#000000';
  while (i < bars.length) {
    const bit = bars[i];
    let runLen = 1;
    while (i + runLen < bars.length && bars[i + runLen] === bit) runLen++;
    const pw = runLen > 1 ? wideW : narrowW;
    if (bit === '1') ctx.fillRect(pos, y, pw, height);
    pos += pw;
    i += runLen;
  }
  return pos;
}

function getCode39TotalWidth(bars: string, narrowW: number): number {
  const wideW = narrowW * 3;
  let total = 0;
  let i = 0;
  while (i < bars.length) {
    const bit = bars[i];
    let runLen = 1;
    while (i + runLen < bars.length && bars[i + runLen] === bit) runLen++;
    total += runLen > 1 ? wideW : narrowW;
    i += runLen;
  }
  return total;
}

// ── Component ────────────────────────────────────────────────────────────────
export default function BarcodeGenerator() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
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

    const clearCanvas = (w = 200, h = 80) => {
      canvas.width = w;
      canvas.height = h;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
    };

    if (!text.trim()) { clearCanvas(); return; }

    const paddingX = 20;
    const paddingY = 10;
    const textHeight = showText ? 24 : 0;

    // ── Code 128 ──
    if (barcodeType === 'code128') {
      const { values, invalidChars } = encodeCode128(text);

      if (invalidChars.length > 0) {
        setError(isEn ? `Invalid characters for Code 128: ${invalidChars.map(c => `"${c}"`).join(', ')} (ASCII 32–126 allowed)` : `Недопустимые символы для Code 128: ${invalidChars.map(c => `"${c}"`).join(', ')} (допустимы ASCII 32–126)`);
      }

      let totalBars = 0;
      values.forEach((val) => {
        const pattern = CODE128_PATTERNS[val];
        if (pattern) totalBars += pattern.reduce((a, b) => a + b, 0);
      });

      canvas.width = totalBars * barWidth + paddingX * 2;
      canvas.height = barHeight + paddingY * 2 + textHeight;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      let x = paddingX;
      values.forEach((val) => {
        const pattern = CODE128_PATTERNS[val];
        if (!pattern) return;
        for (let i = 0; i < pattern.length; i++) {
          const w = pattern[i] * barWidth;
          ctx.fillStyle = i % 2 === 0 ? '#000000' : '#ffffff';
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

    // ── EAN-13 ──
    } else if (barcodeType === 'ean13') {
      const clean = text.replace(/\D/g, '');
      if (clean.length < 12) {
        setError(isEn ? 'EAN-13 requires at least 12 digits' : 'EAN-13 требует минимум 12 цифр');
        clearCanvas();
        return;
      }

      const result = encodeEAN13(clean);
      if (!result) { clearCanvas(); return; }
      const { bars, display } = result;

      canvas.width = bars.length * barWidth + paddingX * 2;
      canvas.height = barHeight + paddingY * 2 + textHeight;
      ctx.fillStyle = '#ffffff';
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
        ctx.fillText(display, canvas.width / 2, barHeight + paddingY + 18);
      }

    // ── Code 39 ──
    } else if (barcodeType === 'code39') {
      const invalidChars = validateCode39(text);
      if (invalidChars.length > 0) {
        setError(isEn ? `Invalid characters for Code 39: ${invalidChars.map(c => `"${c}"`).join(', ')}` : `Недопустимые символы для Code 39: ${invalidChars.map(c => `"${c}"`).join(', ')}`);
        clearCanvas();
        return;
      }

      const bars = encodeCode39(text);
      const totalWidth = getCode39TotalWidth(bars, barWidth);

      canvas.width = totalWidth + paddingX * 2;
      canvas.height = barHeight + paddingY * 2 + textHeight;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      renderCode39(ctx, bars, paddingX, paddingY, barWidth, barHeight);

      if (showText) {
        ctx.fillStyle = '#000000';
        ctx.font = '14px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('*' + text.toUpperCase() + '*', canvas.width / 2, barHeight + paddingY + 18);
      }
    }
  }, [text, barcodeType, barWidth, barHeight, showText]);

  useEffect(() => { drawBarcode(); }, [drawBarcode]);

  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `barcode_${barcodeType}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [barcodeType]);

  const handleTypeChange = (type: BarcodeType) => {
    setBarcodeType(type);
    setError('');
    if (type === 'ean13') setText('590123412345');
    else if (type === 'code39') setText('HELLO-WORLD');
    else setText('Hello, World!');
  };

  const types: { value: BarcodeType; label: string; hint: string }[] = [
    { value: 'code128', label: 'Code 128', hint: isEn ? 'ASCII 32–126, any length' : 'ASCII 32–126, любая длина' },
    { value: 'ean13',   label: 'EAN-13',   hint: isEn ? '12–13 digits' : '12–13 цифр' },
    { value: 'code39',  label: 'Code 39',  hint: isEn ? 'Digits, A–Z, -. $/+%' : 'Цифры, A–Z, -. $/+%' },
  ];

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              mb: 2,
              borderRadius: 18,
              bgcolor: theme.palette.surfaceContainerLow,
              transitionProperty: 'background-color', transitionDuration: '200ms', transitionTimingFunction: 'ease',
              '&:hover': { background: alpha(theme.palette.primary.main, 0.04) }
            }}
          >
            <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary', fontWeight: 600 }}>
              {isEn ? 'Barcode format' : 'Формат штрих-кода'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              {types.map((t) => (
                <Chip
                  key={t.value}
                  label={t.label}
                  onClick={() => handleTypeChange(t.value)}
                  color={barcodeType === t.value ? 'primary' : 'default'}
                  variant={barcodeType === t.value ? 'filled' : 'outlined'}
                  title={t.hint}
                />
              ))}
            </Box>

            <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', mb: 1.5 }}>
              {types.find(t => t.value === barcodeType)?.hint}
            </Typography>

            <TextField
              fullWidth
              label={isEn ? 'Data' : 'Данные'}
              value={text}
              onChange={(e) => { setText(e.target.value); setError(''); }}
              placeholder={
                barcodeType === 'ean13' ? (isEn ? '12 or 13 digits' : '12 или 13 цифр') :
                barcodeType === 'code39' ? 'HELLO-WORLD' :
                'Hello, World!'
              }
              size="small"
              error={!!error}
              sx={{ mb: 2 }}
            />

            {error && (
              <Alert severity="warning" sx={{ mb: 2, borderRadius: 10 }}>
                {error}
              </Alert>
            )}

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', mb: 1 }}>
                {isEn ? `Line width: ${barWidth}px` : `Ширина линии: ${barWidth}px`}
              </Typography>
              <Slider
                value={barWidth}
                onChange={(_, v) => setBarWidth(v as number)}
                min={1}
                max={5}
                step={1}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', mb: 1 }}>
                {isEn ? `Height: ${barHeight}px` : `Высота: ${barHeight}px`}
              </Typography>
              <Slider
                value={barHeight}
                onChange={(_, v) => setBarHeight(v as number)}
                min={40}
                max={200}
                step={10}
              />
            </Box>

            <FormControlLabel
              control={<Switch checked={showText} onChange={(e) => setShowText(e.target.checked)} />}
              label={isEn ? 'Show text' : 'Показать текст'}
            />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
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
            <Box
              sx={{
                borderRadius: 10,
                overflow: 'auto',
                backgroundColor: '#fff',
                border: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 150,
                p: 2
              }}
            >
              <canvas ref={canvasRef} style={{ display: 'block', maxWidth: '100%' }} />
            </Box>

            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={handleDownload}
                disabled={!text.trim() || !!error}
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
