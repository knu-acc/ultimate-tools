'use client';

import React, { useState, useCallback } from 'react';
import {
  Box, Typography, TextField, Button, Grid, Chip, Paper,
  FormControlLabel, Switch, Divider, Alert, useTheme, alpha,
  ToggleButton, ToggleButtonGroup, Tooltip,
} from '@mui/material';
import {
  ContentCopy, DeleteSweep, CheckCircle, AutoFixHigh,
  RestartAlt, FormatClear,
} from '@mui/icons-material';
import { useLanguage } from '@/src/i18n/LanguageContext';

// ============================================================
// Операции форматирования
// ============================================================

interface Operation {
  id: string;
  label: string;
  labelEn: string;
  description: string;
  descriptionEn: string;
  fn: (text: string) => string;
}

const operations: Operation[] = [
  {
    id: 'trim-lines',
    label: 'Убрать пробелы по краям строк',
    labelEn: 'Trim line whitespace',
    description: 'Удаляет начальные и конечные пробелы в каждой строке',
    descriptionEn: 'Removes leading and trailing spaces from each line',
    fn: (text) => text.split('\n').map(l => l.trim()).join('\n'),
  },
  {
    id: 'remove-extra-spaces',
    label: 'Убрать лишние пробелы',
    labelEn: 'Remove extra spaces',
    description: 'Сжимает несколько пробелов подряд в один',
    descriptionEn: 'Compresses multiple consecutive spaces into one',
    fn: (text) => text.replace(/[ \t]+/g, ' '),
  },
  {
    id: 'remove-empty-lines',
    label: 'Удалить пустые строки',
    labelEn: 'Remove empty lines',
    description: 'Убирает строки, содержащие только пробелы или полностью пустые',
    descriptionEn: 'Removes lines that are empty or contain only whitespace',
    fn: (text) => text.split('\n').filter(l => l.trim().length > 0).join('\n'),
  },
  {
    id: 'remove-duplicate-lines',
    label: 'Удалить дубликаты строк',
    labelEn: 'Remove duplicate lines',
    description: 'Оставляет только уникальные строки (первые вхождения)',
    descriptionEn: 'Keeps only unique lines (first occurrences)',
    fn: (text) => {
      const seen = new Set<string>();
      return text.split('\n').filter(l => {
        const key = l.trim();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      }).join('\n');
    },
  },
  {
    id: 'tabs-to-spaces',
    label: 'Табы → пробелы',
    labelEn: 'Tabs → spaces',
    description: 'Заменяет символы табуляции на пробелы (2 пробела)',
    descriptionEn: 'Replaces tab characters with spaces (2 spaces)',
    fn: (text) => text.replace(/\t/g, '  '),
  },
  {
    id: 'spaces-to-tabs',
    label: 'Пробелы → табы',
    labelEn: 'Spaces → tabs',
    description: 'Заменяет двойные пробелы на символы табуляции',
    descriptionEn: 'Replaces double spaces with tab characters',
    fn: (text) => text.replace(/  /g, '\t'),
  },
  {
    id: 'join-lines',
    label: 'Объединить в одну строку',
    labelEn: 'Join into one line',
    description: 'Удаляет все переносы строк — текст становится одной строкой',
    descriptionEn: 'Removes all line breaks — text becomes one line',
    fn: (text) => text.replace(/\n+/g, ' ').trim(),
  },
  {
    id: 'one-sentence-per-line',
    label: 'Каждое предложение на новой строке',
    labelEn: 'One sentence per line',
    description: 'Разбивает текст по предложениям (. ! ?)',
    descriptionEn: 'Splits text by sentences (. ! ?)',
    fn: (text) => text.replace(/([.!?])\s+/g, '$1\n').trim(),
  },
  {
    id: 'remove-punctuation',
    label: 'Удалить знаки пунктуации',
    labelEn: 'Remove punctuation',
    description: 'Убирает точки, запятые, тире и прочие знаки',
    descriptionEn: 'Removes periods, commas, dashes and other marks',
    fn: (text) => text.replace(/[.,!?;:'"()\-–—[\]{}/\\|@#$%^&*+=~`<>]/g, ''),
  },
  {
    id: 'remove-numbers',
    label: 'Удалить цифры',
    labelEn: 'Remove digits',
    description: 'Удаляет все цифры из текста',
    descriptionEn: 'Removes all digits from text',
    fn: (text) => text.replace(/\d/g, ''),
  },
  {
    id: 'remove-special-chars',
    label: 'Удалить спецсимволы',
    labelEn: 'Remove special chars',
    description: 'Оставляет только буквы, цифры и пробелы',
    descriptionEn: 'Keeps only letters, digits and spaces',
    fn: (text) => text.replace(/[^a-zA-Zа-яёА-ЯЁ0-9\s\n]/g, ''),
  },
  {
    id: 'normalize-unicode',
    label: 'Нормализовать Unicode (NFKC)',
    labelEn: 'Normalize Unicode (NFKC)',
    description: 'Приводит Unicode-символы к нормальной форме',
    descriptionEn: 'Normalizes Unicode characters to canonical form',
    fn: (text) => text.normalize('NFKC'),
  },
  {
    id: 'lowercase',
    label: 'Строчные буквы',
    labelEn: 'Lowercase',
    description: 'Преобразует весь текст в нижний регистр',
    descriptionEn: 'Converts all text to lowercase',
    fn: (text) => text.toLowerCase(),
  },
  {
    id: 'uppercase',
    label: 'ЗАГЛАВНЫЕ БУКВЫ',
    labelEn: 'UPPERCASE',
    description: 'Преобразует весь текст в верхний регистр',
    descriptionEn: 'Converts all text to uppercase',
    fn: (text) => text.toUpperCase(),
  },
  {
    id: 'capitalize',
    label: 'Первая буква заглавная',
    labelEn: 'Capitalize first letter',
    description: 'Делает заглавной первую букву каждого предложения',
    descriptionEn: 'Capitalizes the first letter of each sentence',
    fn: (text) => text.replace(/(^|[.!?]\s+)([a-zа-яё])/g, (_, sep, ch) => sep + ch.toUpperCase()),
  },
  {
    id: 'add-line-numbers',
    label: 'Пронумеровать строки',
    labelEn: 'Number lines',
    description: 'Добавляет порядковый номер в начало каждой строки',
    descriptionEn: 'Adds a sequential number at the beginning of each line',
    fn: (text) => text.split('\n').map((l, i) => `${i + 1}. ${l}`).join('\n'),
  },
  {
    id: 'sort-lines-asc',
    label: 'Сортировать строки (А→Я)',
    labelEn: 'Sort lines (A→Z)',
    description: 'Сортирует строки по алфавиту',
    descriptionEn: 'Sorts lines alphabetically',
    fn: (text) => text.split('\n').sort((a, b) => a.localeCompare(b, 'ru')).join('\n'),
  },
  {
    id: 'sort-lines-desc',
    label: 'Сортировать строки (Я→А)',
    labelEn: 'Sort lines (Z→A)',
    description: 'Сортирует строки по алфавиту в обратном порядке',
    descriptionEn: 'Sorts lines alphabetically in reverse order',
    fn: (text) => text.split('\n').sort((a, b) => b.localeCompare(a, 'ru')).join('\n'),
  },
  {
    id: 'reverse-lines',
    label: 'Перевернуть порядок строк',
    labelEn: 'Reverse line order',
    description: 'Меняет порядок строк на обратный',
    descriptionEn: 'Reverses the order of lines',
    fn: (text) => text.split('\n').reverse().join('\n'),
  },
  {
    id: 'shuffle-lines',
    label: 'Перемешать строки',
    labelEn: 'Shuffle lines',
    description: 'Случайно перемешивает строки текста',
    descriptionEn: 'Randomly shuffles lines of text',
    fn: (text) => {
      const lines = text.split('\n');
      for (let i = lines.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [lines[i], lines[j]] = [lines[j], lines[i]];
      }
      return lines.join('\n');
    },
  },
];

// Группировка операций
const operationGroups = [
  {
    label: 'Пробелы и переносы',
    labelEn: 'Spaces & line breaks',
    ids: ['trim-lines', 'remove-extra-spaces', 'remove-empty-lines', 'tabs-to-spaces', 'spaces-to-tabs', 'join-lines', 'one-sentence-per-line'],
  },
  {
    label: 'Дубликаты и символы',
    labelEn: 'Duplicates & characters',
    ids: ['remove-duplicate-lines', 'remove-punctuation', 'remove-numbers', 'remove-special-chars', 'normalize-unicode'],
  },
  {
    label: 'Регистр',
    labelEn: 'Case',
    ids: ['lowercase', 'uppercase', 'capitalize'],
  },
  {
    label: 'Порядок строк',
    labelEn: 'Line order',
    ids: ['add-line-numbers', 'sort-lines-asc', 'sort-lines-desc', 'reverse-lines', 'shuffle-lines'],
  },
];

// Быстрые пресеты
const presets = [
  {
    label: 'Очистка текста',
    labelEn: 'Clean text',
    description: 'Убрать лишние пробелы, пустые строки и пронормализовать',
    descriptionEn: 'Remove extra spaces, empty lines and normalize',
    ops: ['trim-lines', 'remove-extra-spaces', 'remove-empty-lines', 'normalize-unicode'],
  },
  {
    label: 'Список строк',
    labelEn: 'Line list',
    description: 'Убрать пустые строки, дубликаты, отсортировать',
    descriptionEn: 'Remove empty lines, duplicates, sort',
    ops: ['trim-lines', 'remove-empty-lines', 'remove-duplicate-lines', 'sort-lines-asc'],
  },
  {
    label: 'Код / Данные',
    labelEn: 'Code / Data',
    description: 'Нормализовать отступы, убрать пустые строки',
    descriptionEn: 'Normalize indentation, remove empty lines',
    ops: ['trim-lines', 'tabs-to-spaces', 'remove-empty-lines'],
  },
  {
    label: 'Минимизировать',
    labelEn: 'Minimize',
    description: 'Объединить всё в одну строку без лишних пробелов',
    descriptionEn: 'Join everything into one line without extra spaces',
    ops: ['trim-lines', 'remove-extra-spaces', 'join-lines'],
  },
];

// ============================================================
// Component
// ============================================================

export default function TextFormatterTool() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [selectedOps, setSelectedOps] = useState<string[]>([
    'trim-lines', 'remove-extra-spaces', 'remove-empty-lines',
  ]);
  const [copied, setCopied] = useState(false);
  const [livePreview, setLivePreview] = useState(false);

  const applyOps = useCallback((text: string, ops: string[]) => {
    let result = text;
    for (const opId of ops) {
      const op = operations.find(o => o.id === opId);
      if (op) result = op.fn(result);
    }
    return result;
  }, []);

  const handleProcess = () => {
    const result = applyOps(input, selectedOps);
    setOutput(result);
  };

  const handleInputChange = (val: string) => {
    setInput(val);
    if (livePreview) {
      setOutput(applyOps(val, selectedOps));
    }
  };

  const handleOpsChange = (ops: string[]) => {
    setSelectedOps(ops);
    if (livePreview && input) {
      setOutput(applyOps(input, ops));
    }
  };

  const handlePreset = (ops: string[]) => {
    setSelectedOps(ops);
    if (input) setOutput(applyOps(input, ops));
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inputStats = {
    lines: input.split('\n').length,
    words: input.trim() ? input.trim().split(/\s+/).length : 0,
    chars: input.length,
  };

  const outputStats = {
    lines: output.split('\n').length,
    words: output.trim() ? output.trim().split(/\s+/).length : 0,
    chars: output.length,
  };

  return (
    <Box>
      {/* Пресеты */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block', fontWeight: 500 }}>
          {isEn ? 'Quick presets:' : 'Быстрые пресеты:'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {presets.map(preset => (
            <Tooltip key={preset.label} title={isEn ? preset.descriptionEn : preset.description}>
              <Chip
                label={isEn ? preset.labelEn : preset.label}
                onClick={() => handlePreset(preset.ops)}
                variant="outlined"
                sx={{ cursor: 'pointer' }}
              />
            </Tooltip>
          ))}
        </Box>
      </Box>

      <Grid container spacing={2}>
        {/* Левая: ввод */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" fontWeight={500}>{isEn ? 'Source text' : 'Исходный текст'}</Typography>
            <Typography variant="caption" color="text.secondary">
              {isEn ? `${inputStats.lines} lines · ${inputStats.words} words · ${inputStats.chars} chars` : `${inputStats.lines} стр · ${inputStats.words} сл · ${inputStats.chars} симв`}
            </Typography>
          </Box>
          <TextField
            multiline
            rows={12}
            fullWidth
            placeholder={isEn ? "Paste text to process..." : "Вставьте текст для обработки..."}
            value={input}
            onChange={e => handleInputChange(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: 10, fontFamily: 'monospace', fontSize: '0.8rem' },
            }}
          />
        </Grid>

        {/* Правая: вывод */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" fontWeight={500}>{isEn ? 'Result' : 'Результат'}</Typography>
            <Typography variant="caption" color="text.secondary">
              {output ? (isEn ? `${outputStats.lines} lines · ${outputStats.words} words · ${outputStats.chars} chars` : `${outputStats.lines} стр · ${outputStats.words} сл · ${outputStats.chars} симв`) : '—'}
            </Typography>
          </Box>
          <TextField
            multiline
            rows={12}
            fullWidth
            placeholder={isEn ? "Result will appear here..." : "Результат появится здесь..."}
            value={output}
            slotProps={{ input: { readOnly: true } }}
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: 10, fontFamily: 'monospace', fontSize: '0.8rem' },
            }}
          />
        </Grid>
      </Grid>

      {/* Статистика изменений */}
      {input && output && (
        <Box sx={{ mt: 1.5, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {inputStats.chars !== outputStats.chars && (
            <Chip
              size="small"
              label={`${isEn ? 'Chars' : 'Символов'}: ${inputStats.chars} → ${outputStats.chars} (${outputStats.chars - inputStats.chars > 0 ? '+' : ''}${outputStats.chars - inputStats.chars})`}
              color={outputStats.chars < inputStats.chars ? 'success' : 'default'}
              variant="outlined"
            />
          )}
          {inputStats.lines !== outputStats.lines && (
            <Chip
              size="small"
              label={`${isEn ? 'Lines' : 'Строк'}: ${inputStats.lines} → ${outputStats.lines}`}
              color={outputStats.lines < inputStats.lines ? 'success' : 'default'}
              variant="outlined"
            />
          )}
        </Box>
      )}

      {/* Кнопки управления */}
      <Box sx={{ mt: 2, display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
        <Button
          variant="contained"
          onClick={handleProcess}
          disabled={!input || selectedOps.length === 0}
          startIcon={<AutoFixHigh />}
          sx={{ borderRadius: 18 }}
        >
          Применить
        </Button>
        <Button
          variant="outlined"
          onClick={handleCopy}
          disabled={!output}
          startIcon={copied ? <CheckCircle /> : <ContentCopy />}
          color={copied ? 'success' : 'primary'}
          sx={{ borderRadius: 18 }}
        >
          {copied ? 'Скопировано!' : 'Копировать'}
        </Button>
        <Button
          variant="text"
          onClick={() => { setInput(''); setOutput(''); }}
          startIcon={<RestartAlt />}
          sx={{ borderRadius: 18 }}
          color="inherit"
        >
          Очистить
        </Button>
        <FormControlLabel
          control={
            <Switch
              size="small"
              checked={livePreview}
              onChange={e => setLivePreview(e.target.checked)}
            />
          }
          label={<Typography variant="caption">{isEn ? 'Auto-preview' : 'Авто-превью'}</Typography>}
          sx={{ ml: 'auto' }}
        />
      </Box>

      <Divider sx={{ my: 2.5 }} />

      {/* Операции */}
      <Typography variant="body2" fontWeight={600} sx={{ mb: 1.5 }}>
        Операции ({selectedOps.length} выбрано — применяются по порядку)
      </Typography>

      {operationGroups.map(group => (
        <Box key={group.label} sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            {group.label}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
            {group.ids.map(id => {
              const op = operations.find(o => o.id === id)!;
              const isSelected = selectedOps.includes(id);
              return (
                <Tooltip key={id} title={op.description} placement="top">
                  <Chip
                    label={op.label}
                    onClick={() => {
                      const newOps = isSelected
                        ? selectedOps.filter(o => o !== id)
                        : [...selectedOps, id];
                      handleOpsChange(newOps);
                    }}
                    color={isSelected ? 'primary' : 'default'}
                    variant={isSelected ? 'filled' : 'outlined'}
                    sx={{ cursor: 'pointer', borderRadius: 10 }}
                    icon={isSelected ? <CheckCircle sx={{ fontSize: '16px !important' }} /> : undefined}
                  />
                </Tooltip>
              );
            })}
          </Box>
        </Box>
      ))}

      {selectedOps.length === 0 && (
        <Alert severity="info" sx={{ borderRadius: 10 }}>
          Выберите хотя бы одну операцию из списка выше
        </Alert>
      )}

      {selectedOps.length > 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mt: 1,
            borderRadius: 10,
            bgcolor: alpha(theme.palette.primary.main, 0.04),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
          }}
        >
          <Typography variant="caption" color="text.secondary" fontWeight={500}>
            Порядок применения: {' '}
          </Typography>
          <Typography variant="caption" color="primary.main">
            {selectedOps.map(id => operations.find(o => o.id === id)?.label).join(' → ')}
          </Typography>
        </Paper>
      )}
    </Box>
  );
}
