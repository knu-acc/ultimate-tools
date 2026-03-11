'use client';

import React, { useState, useMemo } from 'react';
import {
  Box, Typography, Paper, Grid, Button, Chip, TextField, alpha, useTheme,
  IconButton, Tooltip, Dialog, DialogTitle, DialogContent,
} from '@mui/material';
import { ContentCopy, Search, History, Close } from '@mui/icons-material';

interface CharInfo {
  char: string;
  codePoint: number;
  hex: string;
  name: string;
}

const CATEGORIES: Record<string, { label: string; ranges: [number, number][] }> = {
  arrows: {
    label: 'Стрелки',
    ranges: [[0x2190, 0x21FF]],
  },
  math: {
    label: 'Математика',
    ranges: [[0x2200, 0x22FF]],
  },
  currency: {
    label: 'Валюты',
    ranges: [[0x0024, 0x0024], [0x00A2, 0x00A5], [0x20A0, 0x20CF]],
  },
  emoji: {
    label: 'Эмодзи',
    ranges: [[0x1F600, 0x1F64F]],
  },
  boxDrawing: {
    label: 'Рисование рамок',
    ranges: [[0x2500, 0x257F]],
  },
  greek: {
    label: 'Греческий',
    ranges: [[0x0391, 0x03C9]],
  },
  cyrillic: {
    label: 'Кириллица',
    ranges: [[0x0410, 0x044F]],
  },
};

function getCharName(cp: number): string {
  // Basic name lookup for common ranges
  if (cp >= 0x0041 && cp <= 0x005A) return `LATIN CAPITAL LETTER ${String.fromCodePoint(cp)}`;
  if (cp >= 0x0061 && cp <= 0x007A) return `LATIN SMALL LETTER ${String.fromCodePoint(cp)}`;
  if (cp >= 0x0030 && cp <= 0x0039) return `DIGIT ${String.fromCodePoint(cp)}`;
  if (cp >= 0x0410 && cp <= 0x042F) return `CYRILLIC CAPITAL LETTER`;
  if (cp >= 0x0430 && cp <= 0x044F) return `CYRILLIC SMALL LETTER`;
  if (cp >= 0x0391 && cp <= 0x03A9) return `GREEK CAPITAL LETTER`;
  if (cp >= 0x03B1 && cp <= 0x03C9) return `GREEK SMALL LETTER`;
  if (cp >= 0x2190 && cp <= 0x21FF) return `ARROW`;
  if (cp >= 0x2200 && cp <= 0x22FF) return `MATHEMATICAL OPERATOR`;
  if (cp >= 0x2500 && cp <= 0x257F) return `BOX DRAWING`;
  if (cp >= 0x20A0 && cp <= 0x20CF) return `CURRENCY SYMBOL`;
  if (cp >= 0x1F600 && cp <= 0x1F64F) return `EMOTICON`;
  if (cp === 0x0024) return 'DOLLAR SIGN';
  if (cp === 0x00A2) return 'CENT SIGN';
  if (cp === 0x00A3) return 'POUND SIGN';
  if (cp === 0x00A4) return 'CURRENCY SIGN';
  if (cp === 0x00A5) return 'YEN SIGN';
  return `U+${cp.toString(16).toUpperCase().padStart(4, '0')}`;
}

function getUtf8Bytes(char: string): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(char);
  return Array.from(bytes).map(b => b.toString(16).toUpperCase().padStart(2, '0')).join(' ');
}

function getHtmlEntity(cp: number): string {
  return `&#${cp};`;
}

function getCssEscape(cp: number): string {
  return `\\${cp.toString(16).toUpperCase()}`;
}

function getCategoryChars(ranges: [number, number][]): CharInfo[] {
  const chars: CharInfo[] = [];
  for (const [start, end] of ranges) {
    for (let cp = start; cp <= end && chars.length < 200; cp++) {
      try {
        const char = String.fromCodePoint(cp);
        chars.push({
          char,
          codePoint: cp,
          hex: `U+${cp.toString(16).toUpperCase().padStart(4, '0')}`,
          name: getCharName(cp),
        });
      } catch {
        // skip invalid
      }
    }
  }
  return chars;
}

export default function UnicodeLookup() {
  const theme = useTheme();
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('arrows');
  const [selectedChar, setSelectedChar] = useState<CharInfo | null>(null);
  const [recentChars, setRecentChars] = useState<CharInfo[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const categoryChars = useMemo(() => {
    const cat = CATEGORIES[selectedCategory];
    if (!cat) return [];
    return getCategoryChars(cat.ranges);
  }, [selectedCategory]);

  const searchResults = useMemo(() => {
    const q = searchText.trim();
    if (!q) return null;

    const results: CharInfo[] = [];

    // Check if input is a character
    if (q.length === 1 || (q.length === 2 && q.codePointAt(0)! > 0xFFFF)) {
      const cp = q.codePointAt(0)!;
      results.push({
        char: q,
        codePoint: cp,
        hex: `U+${cp.toString(16).toUpperCase().padStart(4, '0')}`,
        name: getCharName(cp),
      });
    }

    // Check if input is U+XXXX format
    const uMatch = q.match(/^[Uu]\+?([0-9A-Fa-f]{1,6})$/);
    if (uMatch) {
      const cp = parseInt(uMatch[1], 16);
      if (cp >= 0 && cp <= 0x10FFFF) {
        try {
          const char = String.fromCodePoint(cp);
          if (!results.some(r => r.codePoint === cp)) {
            results.push({
              char,
              codePoint: cp,
              hex: `U+${cp.toString(16).toUpperCase().padStart(4, '0')}`,
              name: getCharName(cp),
            });
          }
        } catch {
          // invalid
        }
      }
    }

    // Check if input is decimal number
    const decMatch = q.match(/^(\d+)$/);
    if (decMatch) {
      const cp = parseInt(decMatch[1], 10);
      if (cp >= 0 && cp <= 0x10FFFF) {
        try {
          const char = String.fromCodePoint(cp);
          if (!results.some(r => r.codePoint === cp)) {
            results.push({
              char,
              codePoint: cp,
              hex: `U+${cp.toString(16).toUpperCase().padStart(4, '0')}`,
              name: getCharName(cp),
            });
          }
        } catch {
          // invalid
        }
      }
    }

    return results.length > 0 ? results : null;
  }, [searchText]);

  const handleCharClick = (info: CharInfo) => {
    setSelectedChar(info);
    setDetailOpen(true);
    setRecentChars(prev => {
      const filtered = prev.filter(c => c.codePoint !== info.codePoint);
      return [info, ...filtered].slice(0, 20);
    });
  };

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <Box>
      {/* Search */}
      <TextField
        fullWidth
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="Введите символ, U+0041 или код..."
        sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
        slotProps={{
          input: {
            startAdornment: <Search sx={{ color: theme.palette.text.secondary, mr: 1 }} />,
          },
        }}
      />

      {/* Search results */}
      {searchResults && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Результаты поиска
          </Typography>
          {searchResults.map((info, i) => (
            <Paper
              key={i}
              elevation={0}
              sx={{
                p: 2,
                mb: 1,
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                cursor: 'pointer',
                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.03) },
              }}
              onClick={() => handleCharClick(info)}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 2, sm: 1 }}>
                  <Typography variant="h3" textAlign="center">{info.char}</Typography>
                </Grid>
                <Grid size={{ xs: 10, sm: 11 }}>
                  <Grid container spacing={1}>
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <Typography variant="caption" color="text.secondary">Код</Typography>
                      <Typography variant="body2" fontWeight={600}>{info.hex}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <Typography variant="caption" color="text.secondary">UTF-8</Typography>
                      <Typography variant="body2" fontFamily="monospace">{getUtf8Bytes(info.char)}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <Typography variant="caption" color="text.secondary">HTML</Typography>
                      <Typography variant="body2" fontFamily="monospace">{getHtmlEntity(info.codePoint)}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <Typography variant="caption" color="text.secondary">CSS</Typography>
                      <Typography variant="body2" fontFamily="monospace">{getCssEscape(info.codePoint)}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          ))}
        </Box>
      )}

      {/* Category browser */}
      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
        Категории
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        {Object.entries(CATEGORIES).map(([key, cat]) => (
          <Chip
            key={key}
            label={cat.label}
            onClick={() => setSelectedCategory(key)}
            sx={{
              fontWeight: 600,
              cursor: 'pointer',
              bgcolor: selectedCategory === key
                ? alpha(theme.palette.primary.main, 0.15)
                : alpha(theme.palette.primary.main, 0.04),
              color: selectedCategory === key ? theme.palette.primary.main : theme.palette.text.primary,
            }}
          />
        ))}
      </Box>

      {/* Character grid */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`,
          mb: 3,
        }}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {categoryChars.map((info, i) => (
            <Tooltip key={i} title={info.hex}>
              <Box
                onClick={() => handleCharClick(info)}
                sx={{
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 1.5,
                  cursor: 'pointer',
                  fontSize: '1.25rem',
                  border: `1px solid transparent`,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    border: `1px solid ${theme.palette.primary.main}`,
                  },
                  transition: 'all 0.15s ease',
                }}
              >
                {info.char}
              </Box>
            </Tooltip>
          ))}
        </Box>
      </Paper>

      {/* Recently viewed */}
      {recentChars.length > 0 && (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <History sx={{ fontSize: 18, color: theme.palette.text.secondary }} />
            <Typography variant="subtitle2" fontWeight={600}>
              Недавно просмотренные
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {recentChars.map((info, i) => (
              <Tooltip key={i} title={`${info.hex} — ${info.name}`}>
                <Box
                  onClick={() => handleCharClick(info)}
                  sx={{
                    width: 36,
                    height: 36,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 1.5,
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) },
                  }}
                >
                  {info.char}
                </Box>
              </Tooltip>
            ))}
          </Box>
        </Box>
      )}

      {/* Detail dialog */}
      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth="xs" fullWidth>
        {selectedChar && (
          <>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              Информация о символе
              <IconButton size="small" onClick={() => setDetailOpen(false)}>
                <Close fontSize="small" />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h1" sx={{ fontSize: '4rem' }}>
                  {selectedChar.char}
                </Typography>
                <Button
                  size="small"
                  startIcon={<ContentCopy />}
                  onClick={() => copyText(selectedChar.char, 'char')}
                  sx={{ borderRadius: '16px', mt: 1 }}
                >
                  {copied === 'char' ? 'Скопировано!' : 'Копировать символ'}
                </Button>
              </Box>

              {[
                { label: 'Код Unicode', value: selectedChar.hex, key: 'hex' },
                { label: 'Десятичный', value: String(selectedChar.codePoint), key: 'dec' },
                { label: 'UTF-8 байты', value: getUtf8Bytes(selectedChar.char), key: 'utf8' },
                { label: 'HTML-сущность', value: getHtmlEntity(selectedChar.codePoint), key: 'html' },
                { label: 'CSS-escape', value: getCssEscape(selectedChar.codePoint), key: 'css' },
                { label: 'Имя', value: selectedChar.name, key: 'name' },
              ].map(row => (
                <Box
                  key={row.key}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    py: 1,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Box>
                    <Typography variant="caption" color="text.secondary">{row.label}</Typography>
                    <Typography variant="body2" fontFamily="monospace" fontWeight={600}>{row.value}</Typography>
                  </Box>
                  <Tooltip title={copied === row.key ? 'Скопировано!' : 'Копировать'}>
                    <IconButton size="small" onClick={() => copyText(row.value, row.key)}>
                      <ContentCopy fontSize="small" sx={{
                        color: copied === row.key ? theme.palette.success.main : theme.palette.text.secondary,
                      }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              ))}
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
}
