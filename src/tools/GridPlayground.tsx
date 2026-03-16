'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import { CopyButton } from '@/src/components/CopyButton';
import { useLanguage } from '@/src/i18n/LanguageContext';


const ITEM_COLORS = ['#1976d2', '#388e3c', '#f57c00', '#7b1fa2', '#c62828', '#00838f'];

const JUSTIFY_ITEMS = ['start', 'end', 'center', 'stretch'] as const;
const ALIGN_ITEMS = ['start', 'end', 'center', 'stretch'] as const;

interface Preset {
  label: string;
  labelEn: string;
  columns: string;
  rows: string;
}

const PRESETS: Preset[] = [
  { label: '2 колонки', labelEn: '2 columns', columns: '1fr 1fr', rows: 'auto' },
  { label: '3 колонки', labelEn: '3 columns', columns: '1fr 1fr 1fr', rows: 'auto' },
  { label: 'Holy Grail', labelEn: 'Holy Grail', columns: '200px 1fr 200px', rows: 'auto 1fr auto' },
  { label: 'Сайдбар', labelEn: 'Sidebar', columns: '250px 1fr', rows: 'auto' },
];

export default function GridPlayground() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const [columns, setColumns] = useState('1fr 1fr 1fr');
  const [rows, setRows] = useState('auto');
  const [gap, setGap] = useState('8');
  const [justifyItems, setJustifyItems] = useState<string>('stretch');
  const [alignItems, setAlignItems] = useState<string>('stretch');
  const applyPreset = (preset: Preset) => {
    setColumns(preset.columns);
    setRows(preset.rows);
  };

  const generateCss = () => {
    return `.container {\n  display: grid;\n  grid-template-columns: ${columns};\n  grid-template-rows: ${rows};\n  gap: ${gap}px;\n  justify-items: ${justifyItems};\n  align-items: ${alignItems};\n}`;
  };

  const renderChipRow = (
    label: string,
    options: readonly string[],
    value: string,
    onChange: (v: string) => void
  ) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
      <Typography
        variant="body2"
        sx={{ fontWeight: 600, color: 'text.secondary', minWidth: 130, flexShrink: 0 }}
      >
        {label}:
      </Typography>
      {options.map((opt) => (
        <Chip
          key={opt}
          label={opt}
          size="small"
          onClick={() => onChange(opt)}
          color={value === opt ? 'primary' : 'default'}
          variant={value === opt ? 'filled' : 'outlined'}
          sx={{ fontSize: '0.75rem' }}
        />
      ))}
    </Box>
  );

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 18,
          background: theme.palette.surfaceContainerLow
        }}
      >
        {/* Presets */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5, flexWrap: 'wrap' }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: 'text.secondary', minWidth: 130, flexShrink: 0 }}
          >
            {isEn ? 'Presets' : 'Пресеты'}:
          </Typography>
          {PRESETS.map((preset) => (
            <Chip
              key={preset.label}
              label={isEn ? preset.labelEn : preset.label}
              size="small"
              onClick={() => applyPreset(preset)}
              variant="outlined"
              sx={{ fontSize: '0.75rem' }}
            />
          ))}
        </Box>

        {/* Grid controls */}
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700, color: 'text.primary' }}>
          {isEn ? 'Container properties' : 'Свойства контейнера'}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: 'text.secondary', minWidth: 130, flexShrink: 0 }}
          >
            grid-template-columns:
          </Typography>
          <TextField
            size="small"
            value={columns}
            onChange={(e) => setColumns(e.target.value)}
            placeholder="1fr 1fr 1fr"
            sx={{ flex: 1, minWidth: 200 }}
            slotProps={{
              input: {
                sx: {
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '0.85rem'
                }
              }
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: 'text.secondary', minWidth: 130, flexShrink: 0 }}
          >
            grid-template-rows:
          </Typography>
          <TextField
            size="small"
            value={rows}
            onChange={(e) => setRows(e.target.value)}
            placeholder="auto"
            sx={{ flex: 1, minWidth: 200 }}
            slotProps={{
              input: {
                sx: {
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '0.85rem'
                }
              }
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: 'text.secondary', minWidth: 130, flexShrink: 0 }}
          >
            gap:
          </Typography>
          <TextField
            size="small"
            value={gap}
            onChange={(e) => setGap(e.target.value)}
            sx={{ width: 80 }}
            slotProps={{
              input: {
                sx: { fontSize: '0.85rem' }
              }
            }}
          />
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>px</Typography>
        </Box>

        {renderChipRow('justify-items', JUSTIFY_ITEMS, justifyItems, setJustifyItems)}
        {renderChipRow('align-items', ALIGN_ITEMS, alignItems, setAlignItems)}

        {/* Preview */}
        <Typography variant="subtitle2" sx={{ mt: 2.5, mb: 1, fontWeight: 700, color: 'text.primary' }}>
          {isEn ? 'Preview' : 'Предварительный просмотр'}
        </Typography>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            border: `2px dashed ${theme.palette.divider}`,
            borderRadius: 10,
            minHeight: 200,
            mb: 2.5,
            display: 'grid',
            gridTemplateColumns: columns,
            gridTemplateRows: rows,
            gap: `${gap}px`,
            justifyItems,
            alignItems,
            overflow: 'auto'
          }}
        >
          {ITEM_COLORS.map((color, i) => (
            <Box
              key={i}
              sx={{
                minWidth: 50,
                minHeight: 60,
                bgcolor: alpha(color, 0.85),
                borderRadius: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 1
              }}
            >
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>
                {i + 1}
              </Typography>
            </Box>
          ))}
        </Paper>

        {/* Generated CSS */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
            {isEn ? 'Generated CSS' : 'Сгенерированный CSS'}
          </Typography>
          <CopyButton text={generateCss()} />
        </Box>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 10,
            bgcolor: theme.palette.mode === 'dark'
              ? alpha(theme.palette.common.black, 0.3)
              : alpha(theme.palette.grey[50], 1)
          }}
        >
          <Typography
            component="pre"
            sx={{
              fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
              fontSize: '0.8rem',
              lineHeight: 1.7,
              m: 0,
              whiteSpace: 'pre-wrap',
              color: 'text.primary'
            }}
          >
            {generateCss()}
          </Typography>
        </Paper>
      </Paper>

    </Box>
  );
}
