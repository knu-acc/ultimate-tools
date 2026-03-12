'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Chip,
  List,
  ListItem,
  ListItemText,
  useTheme,
  alpha
} from '@mui/material';
import { CopyButton } from '@/src/components/CopyButton';


type ExtractionType = 'emails' | 'urls' | 'phones' | 'ips' | 'numbers';

interface ExtractionOption {
  type: ExtractionType;
  label: string;
  description: string;
  pattern: RegExp;
}

const EXTRACTION_OPTIONS: ExtractionOption[] = [
  {
    type: 'emails',
    label: 'Email',
    description: 'Адреса электронной почты',
    pattern: /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2}/g
  },
  {
    type: 'urls',
    label: 'URL',
    description: 'Ссылки и веб-адреса',
    pattern: /https?:\/\/[^\s<>"{}|\\^`[\]]+/g
  },
  {
    type: 'phones',
    label: 'Телефоны',
    description: 'Номера телефонов',
    pattern: /(?:\+?\d{1,3}[\s\-.]?)?\(?\d{2,4}\)?[\s\-.]?\d{2,4}[\s\-.]?\d{2,4}(?:[\s\-.]?\d{2,4})?/g
  },
  {
    type: 'ips',
    label: 'IP-адреса',
    description: 'IPv4 адреса',
    pattern: /\b(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\b/g
  },
  {
    type: 'numbers',
    label: 'Числа',
    description: 'Числовые значения',
    pattern: /-?\d+(?:[.,]\d+)?(?:\s?%)?/g
  },
];

function extractUnique(text: string, pattern: RegExp): string[] {
  if (!text.trim()) return [];
  const matches = text.match(pattern);
  if (!matches) return [];
  return [...new Set(matches.map((m) => m.trim()).filter(Boolean))];
}

export default function StringExtractor() {
  const theme = useTheme();
  const [input, setInput] = useState('');
  const [activeTypes, setActiveTypes] = useState<ExtractionType[]>(['emails']);

  const toggleType = (type: ExtractionType) => {
    setActiveTypes((prev) =>
      prev.includes(type) ? (prev.length > 1 ? prev.filter((t) => t !== type) : prev) : [...prev, type]
    );
  };

  const results = useMemo(() => {
    const allResults: { type: ExtractionType; label: string; value: string }[] = [];
    for (const opt of EXTRACTION_OPTIONS) {
      if (!activeTypes.includes(opt.type)) continue;
      const found = extractUnique(input, opt.pattern);
      for (const val of found) {
        allResults.push({ type: opt.type, label: opt.label, value: val });
      }
    }
    return allResults;
  }, [input, activeTypes]);

  const totalCount = results.length;

  const handleClear = () => {
    setInput('');
  };

  const getChipColor = (type: ExtractionType): 'primary' | 'secondary' | 'success' | 'warning' | 'info' => {
    const map: Record<ExtractionType, 'primary' | 'secondary' | 'success' | 'warning' | 'info'> = {
      emails: 'primary',
      urls: 'secondary',
      phones: 'success',
      ips: 'warning',
      numbers: 'info'
    };
    return map[type];
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 2,
          borderRadius: 3,
          background: theme.palette.surfaceContainerLow
        }}
      >
        <TextField
          multiline
          rows={6}
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Текст для извлечения данных..."
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {EXTRACTION_OPTIONS.map((opt) => (
            <Chip
              key={opt.type}
              label={opt.label}
              variant={activeTypes.includes(opt.type) ? 'filled' : 'outlined'}
              color={activeTypes.includes(opt.type) ? getChipColor(opt.type) : 'default'}
              onClick={() => toggleType(opt.type)}
              sx={{ borderRadius: 2 }}
            />
          ))}
        </Box>

        {/* Results count and actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              background: alpha(
                totalCount > 0 ? theme.palette.success.main : theme.palette.text.disabled,
                0.1
              ),
              border: `1px solid ${alpha(
                totalCount > 0 ? theme.palette.success.main : theme.palette.text.disabled,
                0.3
              )}`
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {totalCount > 0
                ? `Найдено: ${totalCount}`
                : input.trim()
                  ? 'Ничего не найдено'
                  : 'Введите текст для анализа'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <CopyButton text={results.map((r) => r.value).join('\n')} />
            <Button
              variant="text"
              size="small"
              onClick={handleClear}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              Очистить
            </Button>
          </Box>
        </Box>

        {/* Results list */}
        {results.length > 0 && (
          <Paper
            variant="outlined"
            sx={{
              maxHeight: 350,
              overflow: 'auto',
              borderRadius: 3,
              background: theme.palette.background.default
            }}
          >
            <List dense disablePadding>
              {results.map((item, index) => (
                <ListItem
                  key={`${item.type}-${item.value}-${index}`}
                  divider={index < results.length - 1}
                  secondaryAction={
                    <CopyButton text={item.value} size="small" />
                  }
                  sx={{
                    '&:hover': {
                      background: alpha(theme.palette.primary.main, 0.04)
                    }
                  }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          label={item.label}
                          size="small"
                          color={getChipColor(item.type)}
                          variant="outlined"
                          sx={{ borderRadius: 1.5, fontSize: '0.7rem', height: 22 }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: 'monospace',
                            wordBreak: 'break-all'
                          }}
                        >
                          {item.value}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}

        {/* Empty state */}
        {input.trim() && results.length === 0 && (
          <Box
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: 2,
              border: `1px dashed ${theme.palette.divider}`
            }}
          >
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Не удалось найти данные выбранных типов в тексте.
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled', mt: 0.5, display: 'block' }}>
              Попробуйте выбрать другой тип извлечения или проверьте текст.
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
