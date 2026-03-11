'use client';

import { useState, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  IconButton,
  Tooltip,
  ButtonGroup,
  Alert,
  Chip,
  useTheme } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { CopyButton, ShareButton } from '@/src/components/CopyButton';


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
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode' | null>(null);
  const [copied, setCopied] = useState(false);
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
      setError(`Ошибка кодирования: ${(e as Error).message}`);
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
      setError(`Ошибка декодирования: ${(e as Error).message}`);
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

  const copyToClipboard = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clear = () => {
    setInput('');
    setOutput('');
    setError('');
    setMode(null);
    setFileName('');
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: theme.palette.surfaceContainerLow
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
            Перетащите файл или нажмите для выбора
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
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: 'text.secondary' }}>
          Текст
        </Typography>
        <TextField
          multiline
          rows={6}
          fullWidth
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setFileName('');
          }}
          placeholder="Введите текст или Base64 строку..."
          sx={{
            mb: 2,
            '& .MuiInputBase-root': { fontFamily: 'monospace', fontSize: '0.875rem' }
          }}
        />

        {/* Action buttons */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center', mb: 2 }}>
          <ButtonGroup variant="contained">
            <Button startIcon={<LockIcon />} onClick={encode} disabled={!input}>
              Кодировать
            </Button>
            <Button startIcon={<LockOpenIcon />} onClick={decode} disabled={!input}>
              Декодировать
            </Button>
            <Button startIcon={<AutoFixHighIcon />} onClick={autoDetect} disabled={!input}>
              Авто
            </Button>
          </ButtonGroup>
          <Button variant="outlined" startIcon={<DeleteOutlineIcon />} onClick={clear} color="inherit">
            Очистить
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                  Результат
                </Typography>
                <Chip
                  label={mode === 'encode' ? 'Закодировано' : 'Декодировано'}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Box>
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
                  background: theme.palette.background.default
                }
              }}
            />
          </Box>
        )}
      </Paper>
    </Box>
  );
}
