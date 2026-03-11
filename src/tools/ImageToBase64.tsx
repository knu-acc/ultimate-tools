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
  Tabs,
  Tab,
  useTheme,
  alpha,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ImageIcon from '@mui/icons-material/Image';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Б';
  const units = ['Б', 'КБ', 'МБ', 'ГБ'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
}

export default function ImageToBase64() {
  const theme = useTheme();
  const [mode, setMode] = useState(0); // 0 = image->base64, 1 = base64->image
  const [base64String, setBase64String] = useState('');
  const [dataUri, setDataUri] = useState('');
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number; type: string; width: number; height: number } | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [dragging, setDragging] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [reverseBase64, setReverseBase64] = useState('');
  const [reversePreview, setReversePreview] = useState('');
  const [reverseError, setReverseError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const copyToClipboard = useCallback((text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  }, []);

  const processImage = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setDataUri(result);
      const rawBase64 = result.split(',')[1] || '';
      setBase64String(rawBase64);

      const img = new Image();
      img.onload = () => {
        setFileInfo({
          name: file.name,
          size: file.size,
          type: file.type,
          width: img.width,
          height: img.height,
        });
        setPreviewUrl(result);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  }, []);

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

  const clearAll = useCallback(() => {
    setBase64String('');
    setDataUri('');
    setFileInfo(null);
    setPreviewUrl('');
  }, []);

  const handleReverseBase64 = useCallback((value: string) => {
    setReverseBase64(value);
    setReverseError('');
    setReversePreview('');

    if (!value.trim()) return;

    let src = value.trim();
    if (!src.startsWith('data:')) {
      src = `data:image/png;base64,${src}`;
    }

    const img = new Image();
    img.onload = () => {
      setReversePreview(src);
      setReverseError('');
    };
    img.onerror = () => {
      setReverseError('Невозможно декодировать изображение. Проверьте строку Base64.');
      setReversePreview('');
    };
    img.src = src;
  }, []);

  const getRawBase64 = () => base64String;
  const getHtmlTag = () => `<img src="${dataUri}" alt="image" />`;
  const getCssBackground = () => `background-image: url('${dataUri}');`;

  const outputFormats = [
    { label: 'Data URI', key: 'datauri', getValue: () => dataUri },
    { label: 'Raw Base64', key: 'raw', getValue: getRawBase64 },
    { label: 'HTML <img>', key: 'html', getValue: getHtmlTag },
    { label: 'CSS background', key: 'css', getValue: getCssBackground },
  ];

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />

      <Paper
        elevation={0}
        sx={{ mb: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: 3 }}
      >
        <Tabs
          value={mode}
          onChange={(_, v) => setMode(v)}
          sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}
        >
          <Tab icon={<ImageIcon />} label="Изображение → Base64" iconPosition="start" />
          <Tab icon={<SwapHorizIcon />} label="Base64 → Изображение" iconPosition="start" />
        </Tabs>
      </Paper>

      {mode === 0 && (
        <>
          {!fileInfo ? (
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
                borderRadius: 3,
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
                <Chip label="PNG" size="small" variant="outlined" />
                <Chip label="JPEG" size="small" variant="outlined" />
                <Chip label="GIF" size="small" variant="outlined" />
                <Chip label="WebP" size="small" variant="outlined" />
                <Chip label="SVG" size="small" variant="outlined" />
              </Box>
            </Paper>
          ) : (
            <>
              {/* File info & preview */}
              <Paper
                elevation={0}
                sx={{ p: 3, mb: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: 3 }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Информация о файле</Typography>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<DeleteIcon />}
                    onClick={clearAll}
                  >
                    Очистить
                  </Button>
                </Box>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Box
                      sx={{
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 2,
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: alpha(theme.palette.background.default, 0.5),
                        height: 160,
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={previewUrl}
                        alt="Preview"
                        style={{ maxWidth: '100%', maxHeight: 160, objectFit: 'contain' }}
                      />
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 8 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography variant="body2">
                        <strong>Имя:</strong> {fileInfo.name}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Тип:</strong> {fileInfo.type}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Размер:</strong> {formatFileSize(fileInfo.size)}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Размеры:</strong> {fileInfo.width} × {fileInfo.height} пикселей
                      </Typography>
                      <Typography variant="body2">
                        <strong>Длина Base64:</strong> {base64String.length.toLocaleString()} символов
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>

              {/* Output formats */}
              {outputFormats.map((fmt) => (
                <Paper
                  key={fmt.key}
                  elevation={0}
                  sx={{ p: 3, mb: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 3 }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {fmt.label}
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={copiedField === fmt.key ? <CheckIcon /> : <ContentCopyIcon />}
                      onClick={() => copyToClipboard(fmt.getValue(), fmt.key)}
                      color={copiedField === fmt.key ? 'success' : 'primary'}
                    >
                      {copiedField === fmt.key ? 'Скопировано' : 'Копировать'}
                    </Button>
                  </Box>
                  <TextField
                    fullWidth
                    multiline
                    maxRows={4}
                    value={fmt.getValue()}
                    slotProps={{
                      input: {
                        readOnly: true,
                        sx: { fontFamily: 'monospace', fontSize: '0.8rem' },
                      },
                    }}
                    size="small"
                  />
                </Paper>
              ))}
            </>
          )}
        </>
      )}

      {mode === 1 && (
        <>
          <Paper
            elevation={0}
            sx={{ p: 3, mb: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: 3 }}
          >
            <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
              Вставьте строку Base64 или Data URI
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={6}
              placeholder="data:image/png;base64,iVBORw0KGgo... или просто iVBORw0KGgo..."
              value={reverseBase64}
              onChange={(e) => handleReverseBase64(e.target.value)}
              slotProps={{
                input: {
                  sx: { fontFamily: 'monospace', fontSize: '0.8rem' },
                },
              }}
            />
            {reverseError && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                {reverseError}
              </Typography>
            )}
          </Paper>

          {reversePreview && (
            <Paper
              elevation={0}
              sx={{ p: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: 3 }}
            >
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Предпросмотр изображения
              </Typography>
              <Box
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: alpha(theme.palette.background.default, 0.5),
                  minHeight: 200,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={reversePreview}
                  alt="Decoded"
                  style={{ maxWidth: '100%', maxHeight: 400, objectFit: 'contain' }}
                />
              </Box>
            </Paper>
          )}
        </>
      )}
    </Box>
  );
}
