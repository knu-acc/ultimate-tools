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
import { useLanguage } from '@/src/i18n/LanguageContext';

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
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const [input, setInput] = useState('');
  const [separator, setSeparator] = useState<Separator>('-');

  const separators: { value: Separator; label: string }[] = [
    { value: '-', label: isEn ? 'Hyphen (-)' : 'Дефис (-)' },
    { value: '_', label: isEn ? 'Underscore (_)' : 'Нижнее подч. (_)' },
    { value: '.', label: isEn ? 'Dot (.)' : 'Точка (.)' },
  ];

  const slug = useMemo(() => generateSlug(input, separator), [input, separator]);

  const fullUrl = slug ? `https://example.com/${slug}` : '';

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: { xs: 2, sm: 3 } }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
          background: theme.palette.surfaceContainerLow
        }}
      >
        <TextField
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isEn ? 'Text to generate slug...' : 'Текст для генерации слага...'}
          multiline
          minRows={2}
          maxRows={4}
          sx={{ mb: 2 }}
        />

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {separators.map((sep) => {
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
                    transitionProperty: 'background-color', transitionDuration: '150ms', transitionTimingFunction: 'ease'
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
            borderRadius: 3,
            background: slug
              ? alpha(theme.palette.primary.main, 0.04)
              : theme.palette.action.hover,
            transitionProperty: 'background-color', transitionDuration: '200ms', transitionTimingFunction: 'ease'
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
              {isEn ? 'Slug will appear here automatically' : 'Слаг появится здесь автоматически'}
            </Typography>
          )}
        </Paper>

        {slug && (
          <Box sx={{ display: 'flex', gap: 1.5, mb: 1, flexWrap: 'wrap' }}>
            <Chip
              label={isEn ? `${slug.length} characters` : `${slug.length} символов`}
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
            background: theme.palette.surfaceContainerLow,
            '&:hover': { background: alpha(theme.palette.primary.main, 0.04) }
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', mb: 1.5 }}>
            {isEn ? 'URL Preview' : 'Предпросмотр URL'}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              p: 1.5,
              borderRadius: 3,
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
            borderRadius: 3,
            background: theme.palette.surfaceContainerLow
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', mb: 1 }}>
            {isEn ? 'Cyrillic transliteration' : 'Транслитерация кириллицы'}
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
