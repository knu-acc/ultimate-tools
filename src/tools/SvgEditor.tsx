'use client';

import { useState, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Grid,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const DEFAULT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <rect x="10" y="10" width="180" height="180" rx="20" fill="#4A90D9" stroke="#2C5F8A" stroke-width="3"/>
  <circle cx="100" cy="85" r="35" fill="#FFD93D"/>
  <text x="100" y="160" text-anchor="middle" font-size="18" fill="white" font-family="sans-serif">Привет SVG!</text>
</svg>`;

const SVG_TEMPLATES: { label: string; code: string }[] = [
  {
    label: 'Прямоугольник',
    code: '  <rect x="50" y="50" width="100" height="60" rx="5" fill="#4CAF50" stroke="#388E3C" stroke-width="2"/>',
  },
  {
    label: 'Круг',
    code: '  <circle cx="100" cy="100" r="40" fill="#2196F3" stroke="#1565C0" stroke-width="2"/>',
  },
  {
    label: 'Линия',
    code: '  <line x1="20" y1="20" x2="180" y2="180" stroke="#F44336" stroke-width="3" stroke-linecap="round"/>',
  },
  {
    label: 'Текст',
    code: '  <text x="100" y="100" text-anchor="middle" font-size="16" fill="#333" font-family="sans-serif">Текст</text>',
  },
  {
    label: 'Путь',
    code: '  <path d="M50 150 Q100 50 150 150" fill="none" stroke="#9C27B0" stroke-width="3"/>',
  },
];

export default function SvgEditor() {
  const theme = useTheme();
  const [svgCode, setSvgCode] = useState(DEFAULT_SVG);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const validateSvg = useCallback((code: string): boolean => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(code, 'image/svg+xml');
      const parseError = doc.querySelector('parsererror');
      if (parseError) {
        setError(parseError.textContent?.slice(0, 200) || 'Ошибка парсинга SVG');
        return false;
      }
      setError('');
      return true;
    } catch {
      setError('Невозможно разобрать SVG код');
      return false;
    }
  }, []);

  const handleCodeChange = useCallback(
    (value: string) => {
      setSvgCode(value);
      validateSvg(value);
    },
    [validateSvg]
  );

  const insertTemplate = useCallback(
    (templateCode: string) => {
      const textarea = textareaRef.current;
      if (!textarea) {
        // Insert before closing </svg>
        const closingIndex = svgCode.lastIndexOf('</svg>');
        if (closingIndex !== -1) {
          const newCode = svgCode.slice(0, closingIndex) + templateCode + '\n' + svgCode.slice(closingIndex);
          handleCodeChange(newCode);
        } else {
          handleCodeChange(svgCode + '\n' + templateCode);
        }
        return;
      }

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      if (start !== undefined && start === end && start > 0) {
        const newCode = svgCode.slice(0, start) + '\n' + templateCode + svgCode.slice(end);
        handleCodeChange(newCode);
      } else {
        const closingIndex = svgCode.lastIndexOf('</svg>');
        if (closingIndex !== -1) {
          const newCode = svgCode.slice(0, closingIndex) + templateCode + '\n' + svgCode.slice(closingIndex);
          handleCodeChange(newCode);
        }
      }
    },
    [svgCode, handleCodeChange]
  );

  const copyCode = useCallback(() => {
    navigator.clipboard.writeText(svgCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [svgCode]);

  const downloadSvg = useCallback(() => {
    const blob = new Blob([svgCode], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'image.svg';
    a.click();
    URL.revokeObjectURL(url);
  }, [svgCode]);

  const getSvgInfo = useCallback(() => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgCode, 'image/svg+xml');
      const svgEl = doc.querySelector('svg');
      if (!svgEl) return null;
      return {
        width: svgEl.getAttribute('width') || 'auto',
        height: svgEl.getAttribute('height') || 'auto',
        viewBox: svgEl.getAttribute('viewBox') || 'нет',
        elements: svgEl.children.length,
      };
    } catch {
      return null;
    }
  }, [svgCode]);

  const svgInfo = getSvgInfo();

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
      {/* Quick insert buttons */}
      <Paper
        elevation={0}
        sx={{ p: 2, mb: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: 3 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
            Быстрая вставка:
          </Typography>
          {SVG_TEMPLATES.map((t) => (
            <Button
              key={t.label}
              size="small"
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => insertTemplate(t.code)}
            >
              {t.label}
            </Button>
          ))}
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Code editor */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{ p: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: 3, height: '100%' }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                SVG Код
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
                  onClick={copyCode}
                  color={copied ? 'success' : 'primary'}
                >
                  {copied ? 'Скопировано' : 'Копировать'}
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={downloadSvg}
                >
                  Скачать
                </Button>
              </Box>
            </Box>
            <TextField
              fullWidth
              multiline
              rows={20}
              value={svgCode}
              onChange={(e) => handleCodeChange(e.target.value)}
              inputRef={textareaRef}
              slotProps={{
                input: {
                  sx: {
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    lineHeight: 1.5,
                  },
                },
              }}
            />
            {error && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5 }}>
                <ErrorOutlineIcon color="error" fontSize="small" />
                <Typography variant="body2" color="error" sx={{ fontSize: '0.8rem' }}>
                  {error}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Preview */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{ p: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: 3, height: '100%' }}
          >
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Предпросмотр
            </Typography>
            <Box
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                p: 2,
                minHeight: 300,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: alpha(theme.palette.background.default, 0.5),
                overflow: 'hidden',
                // Checkerboard pattern for transparency
                backgroundImage: `linear-gradient(45deg, ${alpha(theme.palette.text.primary, 0.05)} 25%, transparent 25%),
                  linear-gradient(-45deg, ${alpha(theme.palette.text.primary, 0.05)} 25%, transparent 25%),
                  linear-gradient(45deg, transparent 75%, ${alpha(theme.palette.text.primary, 0.05)} 75%),
                  linear-gradient(-45deg, transparent 75%, ${alpha(theme.palette.text.primary, 0.05)} 75%)`,
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
              }}
            >
              {!error && svgCode.trim() && (
                <Box
                  sx={{ maxWidth: '100%', maxHeight: 400, '& svg': { maxWidth: '100%', maxHeight: 400 } }}
                  dangerouslySetInnerHTML={{ __html: svgCode }}
                />
              )}
              {error && (
                <Typography variant="body2" color="text.secondary">
                  Исправьте ошибки в SVG коде
                </Typography>
              )}
            </Box>

            {/* SVG Info */}
            {svgInfo && (
              <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip label={`Ширина: ${svgInfo.width}`} size="small" variant="outlined" />
                <Chip label={`Высота: ${svgInfo.height}`} size="small" variant="outlined" />
                <Chip label={`viewBox: ${svgInfo.viewBox}`} size="small" variant="outlined" />
                <Chip label={`Элементов: ${svgInfo.elements}`} size="small" variant="outlined" />
                <Chip label={`Размер: ${new Blob([svgCode]).size} Б`} size="small" variant="outlined" />
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
