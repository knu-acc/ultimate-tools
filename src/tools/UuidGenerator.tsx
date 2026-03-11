'use client';

import { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  IconButton,
  Tooltip,
  Slider,
  FormControlLabel,
  Checkbox,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FingerprintIcon from '@mui/icons-material/Fingerprint';

function generateUuidV4(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant 1
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export default function UuidGenerator() {
  const theme = useTheme();
  const [count, setCount] = useState(1);
  const [uuids, setUuids] = useState<string[]>([]);
  const [uppercase, setUppercase] = useState(false);
  const [withDashes, setWithDashes] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const formatUuid = useCallback(
    (uuid: string) => {
      let result = withDashes ? uuid : uuid.replace(/-/g, '');
      return uppercase ? result.toUpperCase() : result.toLowerCase();
    },
    [uppercase, withDashes]
  );

  const generate = () => {
    const newUuids = Array.from({ length: count }, () => generateUuidV4());
    setUuids(newUuids);
    setCopiedIndex(null);
    setCopiedAll(false);
  };

  const copyOne = async (index: number) => {
    await navigator.clipboard.writeText(formatUuid(uuids[index]));
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyAll = async () => {
    const text = uuids.map(formatUuid).join('\n');
    await navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const clear = () => {
    setUuids([]);
    setCopiedIndex(null);
    setCopiedAll(false);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          border: `1px solid ${theme.palette.divider}`,
          background: alpha(theme.palette.primary.main, 0.04),
        }}
      >
        {/* Count slider */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
              Количество UUID
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
              {count}
            </Typography>
          </Box>
          <Slider
            value={count}
            onChange={(_, v) => setCount(v as number)}
            min={1}
            max={100}
            step={1}
            valueLabelDisplay="auto"
          />
        </Box>

        {/* Options */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 6 }}>
            <FormControlLabel
              control={<Checkbox checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} />}
              label={<Typography variant="body2">ВЕРХНИЙ РЕГИСТР</Typography>}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <FormControlLabel
              control={<Checkbox checked={withDashes} onChange={(e) => setWithDashes(e.target.checked)} />}
              label={<Typography variant="body2">С дефисами</Typography>}
            />
          </Grid>
        </Grid>

        {/* Generate button */}
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 2 }}>
          <Button variant="contained" size="large" startIcon={<RefreshIcon />} onClick={generate} sx={{ px: 5 }}>
            Сгенерировать
          </Button>
          {uuids.length > 0 && (
            <Button variant="outlined" startIcon={<DeleteOutlineIcon />} onClick={clear} color="inherit">
              Очистить
            </Button>
          )}
        </Box>
      </Paper>

      {/* Results */}
      {uuids.length > 0 && (
        <Paper elevation={0} sx={{ p: 3, border: `1px solid ${theme.palette.divider}` }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FingerprintIcon sx={{ color: 'primary.main', fontSize: 20 }} />
              <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                Сгенерировано: {uuids.length}
              </Typography>
            </Box>
            <Tooltip title={copiedAll ? 'Скопировано!' : 'Копировать все'}>
              <Button
                size="small"
                variant="outlined"
                startIcon={copiedAll ? <CheckIcon /> : <ContentCopyIcon />}
                onClick={copyAll}
                color={copiedAll ? 'success' : 'primary'}
              >
                Копировать все
              </Button>
            </Tooltip>
          </Box>

          <Divider sx={{ mb: 1 }} />

          <List dense sx={{ maxHeight: 400, overflow: 'auto' }}>
            {uuids.map((uuid, i) => (
              <ListItem
                key={i}
                secondaryAction={
                  <Tooltip title={copiedIndex === i ? 'Скопировано!' : 'Копировать'}>
                    <IconButton edge="end" onClick={() => copyOne(i)} size="small" color={copiedIndex === i ? 'success' : 'default'}>
                      {copiedIndex === i ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
                    </IconButton>
                  </Tooltip>
                }
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  '&:hover': { background: alpha(theme.palette.primary.main, 0.04) },
                }}
              >
                <Chip label={i + 1} size="small" sx={{ mr: 1.5, minWidth: 32, fontWeight: 600 }} />
                <ListItemText
                  primary={
                    <Typography sx={{ fontFamily: 'monospace', fontSize: '0.875rem', wordBreak: 'break-all' }}>
                      {formatUuid(uuid)}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}
