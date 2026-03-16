'use client';

import { useState, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  ButtonGroup,
  Alert,
  Chip,
  useTheme,
  alpha } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { CopyButton } from '@/src/components/CopyButton';
import { useLanguage } from '@/src/i18n/LanguageContext';


function isBase64(str: string): boolean {
  if (!str || str.length % 4 !== 0) return false;
  try {
    return btoa(atob(str)) === str;
  } catch {
    return false;
  }
}

export default function Base64Encoder() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode' | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const encode = useCallback(() => {
    try {
      // Handle Unicode properly
      const encoded = btoa(
        encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (_, p1) =>
          String.fromCharCode(parseInt(p1, 16))
        )
      );
      setOutput(encoded);
      setError('');
      setMode('encode');
    } catch (e) {
      setError(isEn ? `Encoding error: ${(e as Error).message}` : `Ошибка кодирования: ${(e as Error).message}`);
      setOutput('');
    }
  }, [input]);

  const decode = useCallback(() => {
    try {
      const decoded = decodeURIComponent(
        Array.from(atob(input), (c) =>
          '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        ).join('')
      );
      setOutput(decoded);
      setError('');
      setMode('decode');
    } catch (e) {
      setError(isEn ? `Decoding error: ${(e as Error).message}` : `Ошибка декодирования: ${(e as Error).message}`);
      setOutput('');
    }
  }, [input]);

  const autoDetect = useCallback(() => {
    if (!input.trim()) return;
    if (isBase64(input.trim())) {
      decode();
    } else {
      encode();
    }
  }, [input, encode, decode]);

  const handleFile = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Extract base64 part from data URL
      const base64 = result.split(',')[1] || result;
      setInput(base64);
      setOutput('');
      setMode(null);
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const clear = () => {
    setInput('');
    setOutput('');
    setError('');
    setMode(null);
    setFileName('');
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 2,
          borderRadius: 3,
          background: theme.palette.surfaceContainerLow,
          transition: 'all 200ms ease',
          '&:hover': { background: alpha(theme.palette.primary.main, 0.04) }
        }}
      >
        {/* File drop zone */}
        <Box
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          sx={{
            mb: 2,
            p: 3,
            border: `2px dashed ${dragOver ? theme.palette.primary.main : theme.palette.divider}`,
            borderRadius: 3,
            textAlign: 'center',
            cursor: 'pointer',
            background: dragOver ? theme.palette.surfaceContainerHigh : 'transparent',
            transition: 'all 200ms ease',
            '&:hover': {
              borderColor: theme.palette.primary.main,
              background: theme.palette.surfaceContainerLow
            }
          }}
        >
          <UploadFileIcon sx={{ fontSize: 32, color: 'text.secondary', mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {isEn ? 'Drag and drop a file or click to select' : 'Перетащите файл или нажмите для выбора'}
          </Typography>
          {fileName && (
            <Chip label={fileName} size="small" sx={{ mt: 1 }} onDelete={() => setFileName('')} />
          )}
          <input
            ref={fileInputRef}
            type="file"
            hidden
            onChange={handleFileInput}
          />
        </Box>

        {/* Input */}
        <TextField
          multiline
          rows={6}
          fullWidth
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setFileName('');
          }}
          placeholder={isEn ? 'Text or Base64...' : 'Текст или Base64...'}
          sx={{
            mb: 2,
            '& .MuiInputBase-root': { fontFamily: 'monospace', fontSize: '0.875rem' }
          }}
        />

        {/* Action buttons */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center', mb: 2 }}>
          <ButtonGroup variant="contained">
            <Button onClick={encode} disabled={!input}>
              {isEn ? 'Encode' : 'Кодировать'}
            </Button>
            <Button onClick={decode} disabled={!input}>
              {isEn ? 'Decode' : 'Декодировать'}
            </Button>
            <Button onClick={autoDetect} disabled={!input}>
              {isEn ? 'Auto' : 'Авто'}
            </Button>
          </ButtonGroup>
          <Button variant="outlined" onClick={clear} color="inherit">
            {isEn ? 'Clear' : 'Очистить'}
          </Button>
        </Box>

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Output */}
        {output && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 1 }}>
              <CopyButton text={output} />
            </Box>
            <TextField
              multiline
              rows={6}
              fullWidth
              value={output}
              slotProps={{ input: { readOnly: true } }}
              sx={{
                '& .MuiInputBase-root': {
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  background: alpha(theme.palette.text.primary, 0.03)
                }
              }}
            />
          </Box>
        )}
      </Paper>
    </Box>
  );
}
