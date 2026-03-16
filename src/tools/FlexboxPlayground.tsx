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


const ITEM_COLORS = ['#1976d2', '#388e3c', '#f57c00', '#7b1fa2', '#c62828'];

const FLEX_DIRECTIONS = ['row', 'column', 'row-reverse', 'column-reverse'] as const;
const JUSTIFY_CONTENT = ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'] as const;
const ALIGN_ITEMS = ['flex-start', 'flex-end', 'center', 'stretch', 'baseline'] as const;
const FLEX_WRAP = ['nowrap', 'wrap', 'wrap-reverse'] as const;

interface ItemProps {
  flexGrow: number;
  flexShrink: number;
  flexBasis: string;
}

export default function FlexboxPlayground() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const [flexDirection, setFlexDirection] = useState<string>('row');
  const [justifyContent, setJustifyContent] = useState<string>('flex-start');
  const [alignItems, setAlignItems] = useState<string>('stretch');
  const [flexWrap, setFlexWrap] = useState<string>('nowrap');
  const [gap, setGap] = useState('8');
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [itemProps, setItemProps] = useState<ItemProps[]>(
    Array(5).fill(null).map(() => ({ flexGrow: 0, flexShrink: 1, flexBasis: 'auto' }))
  );
  const updateItemProp = (index: number, prop: keyof ItemProps, value: string | number) => {
    setItemProps((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [prop]: value };
      return next;
    });
  };

  const generateCss = () => {
    let css = `.container {\n  display: flex;\n  flex-direction: ${flexDirection};\n  justify-content: ${justifyContent};\n  align-items: ${alignItems};\n  flex-wrap: ${flexWrap};\n  gap: ${gap}px;\n}`;

    itemProps.forEach((item, i) => {
      if (item.flexGrow !== 0 || item.flexShrink !== 1 || item.flexBasis !== 'auto') {
        css += `\n\n.item-${i + 1} {\n  flex-grow: ${item.flexGrow};\n  flex-shrink: ${item.flexShrink};\n  flex-basis: ${item.flexBasis};\n}`;
      }
    });

    return css;
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
          borderRadius: 3,
          background: theme.palette.surfaceContainerLow
        }}
      >
        {/* Container Controls */}
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700, color: 'text.primary' }}>
          {isEn ? 'Container properties' : 'Свойства контейнера'}
        </Typography>

        {renderChipRow('flex-direction', FLEX_DIRECTIONS, flexDirection, setFlexDirection)}
        {renderChipRow('justify-content', JUSTIFY_CONTENT, justifyContent, setJustifyContent)}
        {renderChipRow('align-items', ALIGN_ITEMS, alignItems, setAlignItems)}
        {renderChipRow('flex-wrap', FLEX_WRAP, flexWrap, setFlexWrap)}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
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

        {/* Preview */}
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700, color: 'text.primary' }}>
          {isEn ? 'Preview' : 'Предварительный просмотр'}
        </Typography>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            border: `2px dashed ${theme.palette.divider}`,
            borderRadius: 2,
            minHeight: 200,
            mb: 2.5,
            display: 'flex',
            flexDirection: flexDirection as 'row',
            justifyContent,
            alignItems,
            flexWrap: flexWrap as 'nowrap',
            gap: `${gap}px`,
            overflow: 'auto'
          }}
        >
          {ITEM_COLORS.map((color, i) => (
            <Box
              key={i}
              onClick={() => setSelectedItem(selectedItem === i ? null : i)}
              sx={{
                minWidth: 60,
                minHeight: 60,
                bgcolor: alpha(color, 0.85),
                borderRadius: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: selectedItem === i ? `3px solid ${theme.palette.text.primary}` : '3px solid transparent',
                transition: 'border 0.15s',
                flexGrow: itemProps[i].flexGrow,
                flexShrink: itemProps[i].flexShrink,
                flexBasis: itemProps[i].flexBasis
              }}
            >
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>
                {i + 1}
              </Typography>
            </Box>
          ))}
        </Paper>

        {/* Individual item controls */}
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700, color: 'text.primary' }}>
          {isEn ? 'Item properties' : 'Свойства элемента'}
          {selectedItem !== null ? ` #${selectedItem + 1}` : isEn ? ' (select an item)' : ' (выберите элемент)'}
        </Typography>

        {selectedItem !== null ? (
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2.5, alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                flex-grow:
              </Typography>
              <TextField
                size="small"
                type="number"
                value={itemProps[selectedItem].flexGrow}
                onChange={(e) => updateItemProp(selectedItem, 'flexGrow', Number(e.target.value))}
                sx={{ width: 70 }}
                slotProps={{
                  input: {
                    sx: { fontSize: '0.85rem' }
                  }
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                flex-shrink:
              </Typography>
              <TextField
                size="small"
                type="number"
                value={itemProps[selectedItem].flexShrink}
                onChange={(e) => updateItemProp(selectedItem, 'flexShrink', Number(e.target.value))}
                sx={{ width: 70 }}
                slotProps={{
                  input: {
                    sx: { fontSize: '0.85rem' }
                  }
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                flex-basis:
              </Typography>
              <TextField
                size="small"
                value={itemProps[selectedItem].flexBasis}
                onChange={(e) => updateItemProp(selectedItem, 'flexBasis', e.target.value)}
                sx={{ width: 100 }}
                slotProps={{
                  input: {
                    sx: { fontSize: '0.85rem' }
                  }
                }}
              />
            </Box>
          </Box>
        ) : (
          <Typography variant="body2" sx={{ color: 'text.disabled', mb: 2.5 }}>
            {isEn ? 'Click on an item in the preview area to configure its properties' : 'Нажмите на элемент в области предварительного просмотра, чтобы настроить его свойства'}
          </Typography>
        )}

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
            borderRadius: 2,
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
