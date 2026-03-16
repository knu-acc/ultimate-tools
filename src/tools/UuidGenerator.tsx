'use client';

import { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Slider,
  FormControlLabel,
  Checkbox,
  Grid,
  List,
  ListItem,
  ListItemText,
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { CopyButton } from '@/src/components/CopyButton';
import { useLanguage } from '@/src/i18n/LanguageContext';

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
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const [count, setCount] = useState(1);
  const [uuids, setUuids] = useState<string[]>([]);
  const [uppercase, setUppercase] = useState(false);
  const [withDashes, setWithDashes] = useState(true);
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
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: { xs: 2, sm: 3 } }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 2,
          borderRadius: 18,
          background: theme.palette.surfaceContainerLow
        }}
      >
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
              {isEn ? 'Count' : 'Количество'}
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

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 6 }}>
            <FormControlLabel
              control={<Checkbox checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} />}
              label={<Typography variant="body2">{isEn ? 'UPPERCASE' : 'ВЕРХНИЙ РЕГИСТР'}</Typography>}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <FormControlLabel
              control={<Checkbox checked={withDashes} onChange={(e) => setWithDashes(e.target.checked)} />}
              label={<Typography variant="body2">{isEn ? 'With dashes' : 'С дефисами'}</Typography>}
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button variant="contained" startIcon={<RefreshIcon />} onClick={generate} sx={{ px: 4, textTransform: 'none', fontWeight: 600, borderRadius: 18 }}>
            {isEn ? 'Generate' : 'Сгенерировать'}
          </Button>
        </Box>
      </Paper>

      {uuids.length > 0 && (
        <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 18, background: theme.palette.surfaceContainerLow }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Chip label={`${uuids.length} UUID`} size="small" sx={{ fontWeight: 600 }} />
            <CopyButton text={uuids.map(formatUuid).join('\n')} />
          </Box>

          <List dense sx={{ maxHeight: 400, overflow: 'auto' }}>
            {uuids.map((uuid, i) => (
              <ListItem
                key={i}
                secondaryAction={
                  <CopyButton text={formatUuid(uuids[i])} />
                }
                sx={{
                  borderRadius: 10,
                  mb: 0.5,
                  '&:hover': { background: alpha(theme.palette.primary.main, 0.04) }
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
