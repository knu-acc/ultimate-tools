'use client';

import { useState, useMemo } from 'react';
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


const CYRILLIC_MAP: Record<string, string> = {
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
  'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm',
  'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
  'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
  'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
  'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo',
  'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'J', 'К': 'K', 'Л': 'L', 'М': 'M',
  'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
  'Ф': 'F', 'Х': 'Kh', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Shch',
  'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya'
};

type Separator = '-' | '_' | '.';

const SEPARATORS: { value: Separator; label: string }[] = [
  { value: '-', label: 'Дефис (-)' },
  { value: '_', label: 'Нижнее подч. (_)' },
  { value: '.', label: 'Точка (.)' },
];

function transliterate(text: string): string {
  return text
    .split('')
    .map((char) => CYRILLIC_MAP[char] ?? char)
    .join('');
}

function generateSlug(text: string, separator: Separator): string {
  if (!text.trim()) return '';

  return transliterate(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s-_.]/g, '')
    .replace(/[\s\-_.]+/g, separator)
    .replace(new RegExp(`^\\${separator}+|\\${separator}+$`, 'g'), '');
}

export default function SlugGenerator() {
  const theme = useTheme();
  const [input, setInput] = useState('');
  const [separator, setSeparator] = useState<Separator>('-');

  const slug = useMemo(() => generateSlug(input, separator), [input, separator]);

  const fullUrl = slug ? `https://example.com/${slug}` : '';

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      {/* Input */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          background: theme.palette.surfaceContainerLow
        }}
      >
        <Typography variant="body2" sx={{ mb: 2, fontWeight: 500, color: 'text.secondary' }}>
          Введите текст для генерации слага
        </Typography>

        <TextField
          fullWidth
          label="Исходный текст"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Привет мир! Hello World"
          multiline
          minRows={2}
          maxRows={4}
          sx={{ mb: 2 }}
        />

        {/* Separator selector */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', mb: 1 }}>
            Разделитель
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {SEPARATORS.map((sep) => {
              const active = separator === sep.value;
              return (
                <Chip
                  key={sep.value}
                  label={sep.label}
                  onClick={() => setSeparator(sep.value)}
                  variant={active ? 'filled' : 'outlined'}
                  color={active ? 'primary' : 'default'}
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    transition: 'all 0.15s ease'
                  }}
                />
              );
            })}
          </Box>
        </Box>

        {/* Slug output */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            mb: 2,
            minHeight: 56,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            borderRadius: 2,
            border: `2px dashed ${slug ? theme.palette.primary.main : theme.palette.divider}`,
            background: slug
              ? theme.palette.surfaceContainerLow
              : theme.palette.action.hover,
            transition: 'all 0.2s ease'
          }}
        >
          {slug ? (
            <>
              <Typography
                sx={{
                  fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
                  fontSize: '1.15rem',
                  fontWeight: 600,
                  wordBreak: 'break-all',
                  letterSpacing: 0.5,
                  flex: 1,
                  color: 'text.primary'
                }}
              >
                {slug}
              </Typography>
              <CopyButton text={slug} size="small" />
            </>
          ) : (
            <Typography sx={{ color: 'text.disabled', fontStyle: 'italic' }}>
              Слаг появится здесь автоматически
            </Typography>
          )}
        </Paper>

        {/* Character count */}
        {slug && (
          <Box sx={{ display: 'flex', gap: 1.5, mb: 1, flexWrap: 'wrap' }}>
            <Chip
              label={`${slug.length} символов`}
              size="small"
              variant="outlined"
              sx={{ fontWeight: 500, fontSize: '0.8rem' }}
            />
            <Chip
              label={`${input.length} → ${slug.length}`}
              size="small"
              variant="outlined"
              color="primary"
              sx={{ fontWeight: 500, fontSize: '0.8rem' }}
            />
          </Box>
        )}
      </Paper>

      {/* URL Preview */}
      {slug && (
        <Paper
          elevation={0}
          sx={{
            mt: 2,
            p: 2.5,
            borderRadius: 3,
            background: alpha(theme.palette.success.main, 0.03)
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', mb: 1.5 }}>
            Предпросмотр URL
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              p: 1.5,
              borderRadius: 2,
              background: alpha(theme.palette.text.primary, 0.04)
            }}
          >
            <Typography
              sx={{
                fontFamily: '"JetBrains Mono", "Consolas", monospace',
                fontSize: '0.9rem',
                wordBreak: 'break-all',
                flex: 1
              }}
            >
              <Box component="span" sx={{ color: 'text.disabled' }}>
                https://example.com/
              </Box>
              <Box component="span" sx={{ color: 'primary.main', fontWeight: 700 }}>
                {slug}
              </Box>
            </Typography>
            <CopyButton text={fullUrl} size="small" />
          </Box>
        </Paper>
      )}

      {/* Transliteration table hint */}
      {input && /[а-яА-ЯёЁ]/.test(input) && (
        <Paper
          elevation={0}
          sx={{
            mt: 2,
            p: 2,
            borderRadius: 3
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', mb: 1 }}>
            Транслитерация кириллицы
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
            {input
              .split('')
              .filter((ch, i, arr) => /[а-яА-ЯёЁ]/.test(ch) && arr.indexOf(ch) === i)
              .slice(0, 16)
              .map((ch) => (
                <Chip
                  key={ch}
                  label={`${ch} → ${CYRILLIC_MAP[ch] || '?'}`}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontFamily: '"JetBrains Mono", "Consolas", monospace',
                    fontSize: '0.75rem',
                    fontWeight: 500
                  }}
                />
              ))}
          </Box>
        </Paper>
      )}

    </Box>
  );
}
