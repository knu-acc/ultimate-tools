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

// ============================================================
// Операции форматирования
// ============================================================

interface Operation {
  id: string;
  label: string;
  description: string;
  fn: (text: string) => string;
}

const operations: Operation[] = [
  {
    id: 'trim-lines',
    label: 'Убрать пробелы по краям строк',
    description: 'Удаляет начальные и конечные пробелы в каждой строке',
    fn: (text) => text.split('\n').map(l => l.trim()).join('\n'),
  },
  {
    id: 'remove-extra-spaces',
    label: 'Убрать лишние пробелы',
    description: 'Сжимает несколько пробелов подряд в один',
    fn: (text) => text.replace(/[ \t]+/g, ' '),
  },
  {
    id: 'remove-empty-lines',
    label: 'Удалить пустые строки',
    description: 'Убирает строки, содержащие только пробелы или полностью пустые',
    fn: (text) => text.split('\n').filter(l => l.trim().length > 0).join('\n'),
  },
  {
    id: 'remove-duplicate-lines',
    label: 'Удалить дубликаты строк',
    description: 'Оставляет только уникальные строки (первые вхождения)',
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
    description: 'Заменяет символы табуляции на пробелы (2 пробела)',
    fn: (text) => text.replace(/\t/g, '  '),
  },
  {
    id: 'spaces-to-tabs',
    label: 'Пробелы → табы',
    description: 'Заменяет двойные пробелы на символы табуляции',
    fn: (text) => text.replace(/  /g, '\t'),
  },
  {
    id: 'join-lines',
    label: 'Объединить в одну строку',
    description: 'Удаляет все переносы строк — текст становится одной строкой',
    fn: (text) => text.replace(/\n+/g, ' ').trim(),
  },
  {
    id: 'one-sentence-per-line',
    label: 'Каждое предложение на новой строке',
    description: 'Разбивает текст по предложениям (. ! ?)',
    fn: (text) => text.replace(/([.!?])\s+/g, '$1\n').trim(),
  },
  {
    id: 'remove-punctuation',
    label: 'Удалить знаки пунктуации',
    description: 'Убирает точки, запятые, тире и прочие знаки',
    fn: (text) => text.replace(/[.,!?;:'"()\-–—[\]{}/\\|@#$%^&*+=~`<>]/g, ''),
  },
  {
    id: 'remove-numbers',
    label: 'Удалить цифры',
    description: 'Удаляет все цифры из текста',
    fn: (text) => text.replace(/\d/g, ''),
  },
  {
    id: 'remove-special-chars',
    label: 'Удалить спецсимволы',
    description: 'Оставляет только буквы, цифры и пробелы',
    fn: (text) => text.replace(/[^a-zA-Zа-яёА-ЯЁ0-9\s\n]/g, ''),
  },
  {
    id: 'normalize-unicode',
    label: 'Нормализовать Unicode (NFKC)',
    description: 'Приводит Unicode-символы к нормальной форме',
    fn: (text) => text.normalize('NFKC'),
  },
  {
    id: 'lowercase',
    label: 'Строчные буквы',
    description: 'Преобразует весь текст в нижний регистр',
    fn: (text) => text.toLowerCase(),
  },
  {
    id: 'uppercase',
    label: 'ЗАГЛАВНЫЕ БУКВЫ',
    description: 'Преобразует весь текст в верхний регистр',
    fn: (text) => text.toUpperCase(),
  },
  {
    id: 'capitalize',
    label: 'Первая буква заглавная',
    description: 'Делает заглавной первую букву каждого предложения',
    fn: (text) => text.replace(/(^|[.!?]\s+)([a-zа-яё])/g, (_, sep, ch) => sep + ch.toUpperCase()),
  },
  {
    id: 'add-line-numbers',
    label: 'Пронумеровать строки',
    description: 'Добавляет порядковый номер в начало каждой строки',
    fn: (text) => text.split('\n').map((l, i) => `${i + 1}. ${l}`).join('\n'),
  },
  {
    id: 'sort-lines-asc',
    label: 'Сортировать строки (А→Я)',
    description: 'Сортирует строки по алфавиту',
    fn: (text) => text.split('\n').sort((a, b) => a.localeCompare(b, 'ru')).join('\n'),
  },
  {
    id: 'sort-lines-desc',
    label: 'Сортировать строки (Я→А)',
    description: 'Сортирует строки по алфавиту в обратном порядке',
    fn: (text) => text.split('\n').sort((a, b) => b.localeCompare(a, 'ru')).join('\n'),
  },
  {
    id: 'reverse-lines',
    label: 'Перевернуть порядок строк',
    description: 'Меняет порядок строк на обратный',
    fn: (text) => text.split('\n').reverse().join('\n'),
  },
  {
    id: 'shuffle-lines',
    label: 'Перемешать строки',
    description: 'Случайно перемешивает строки текста',
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
    ids: ['trim-lines', 'remove-extra-spaces', 'remove-empty-lines', 'tabs-to-spaces', 'spaces-to-tabs', 'join-lines', 'one-sentence-per-line'],
  },
  {
    label: 'Дубликаты и символы',
    ids: ['remove-duplicate-lines', 'remove-punctuation', 'remove-numbers', 'remove-special-chars', 'normalize-unicode'],
  },
  {
    label: 'Регистр',
    ids: ['lowercase', 'uppercase', 'capitalize'],
  },
  {
    label: 'Порядок строк',
    ids: ['add-line-numbers', 'sort-lines-asc', 'sort-lines-desc', 'reverse-lines', 'shuffle-lines'],
  },
];

// Быстрые пресеты
const presets = [
  {
    label: 'Очистка текста',
    description: 'Убрать лишние пробелы, пустые строки и пронормализовать',
    ops: ['trim-lines', 'remove-extra-spaces', 'remove-empty-lines', 'normalize-unicode'],
  },
  {
    label: 'Список строк',
    description: 'Убрать пустые строки, дубликаты, отсортировать',
    ops: ['trim-lines', 'remove-empty-lines', 'remove-duplicate-lines', 'sort-lines-asc'],
  },
  {
    label: 'Код / Данные',
    description: 'Нормализовать отступы, убрать пустые строки',
    ops: ['trim-lines', 'tabs-to-spaces', 'remove-empty-lines'],
  },
  {
    label: 'Минимизировать',
    description: 'Объединить всё в одну строку без лишних пробелов',
    ops: ['trim-lines', 'remove-extra-spaces', 'join-lines'],
  },
];

// ============================================================
// Component
// ============================================================

export default function TextFormatterTool() {
  const theme = useTheme();
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
          Быстрые пресеты:
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {presets.map(preset => (
            <Tooltip key={preset.label} title={preset.description}>
              <Chip
                label={preset.label}
                size="small"
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
            <Typography variant="body2" fontWeight={500}>Исходный текст</Typography>
            <Typography variant="caption" color="text.secondary">
              {inputStats.lines} стр · {inputStats.words} сл · {inputStats.chars} симв
            </Typography>
          </Box>
          <TextField
            multiline
            rows={12}
            fullWidth
            placeholder="Вставьте текст для обработки..."
            value={input}
            onChange={e => handleInputChange(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: 2, fontFamily: 'monospace', fontSize: '0.8rem' },
            }}
          />
        </Grid>

        {/* Правая: вывод */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" fontWeight={500}>Результат</Typography>
            <Typography variant="caption" color="text.secondary">
              {output ? `${outputStats.lines} стр · ${outputStats.words} сл · ${outputStats.chars} симв` : '—'}
            </Typography>
          </Box>
          <TextField
            multiline
            rows={12}
            fullWidth
            placeholder="Результат появится здесь..."
            value={output}
            slotProps={{ input: { readOnly: true } }}
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: 2, fontFamily: 'monospace', fontSize: '0.8rem' },
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
              label={`Символов: ${inputStats.chars} → ${outputStats.chars} (${outputStats.chars - inputStats.chars > 0 ? '+' : ''}${outputStats.chars - inputStats.chars})`}
              color={outputStats.chars < inputStats.chars ? 'success' : 'default'}
              variant="outlined"
            />
          )}
          {inputStats.lines !== outputStats.lines && (
            <Chip
              size="small"
              label={`Строк: ${inputStats.lines} → ${outputStats.lines}`}
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
          sx={{ borderRadius: 5 }}
        >
          Применить
        </Button>
        <Button
          variant="outlined"
          onClick={handleCopy}
          disabled={!output}
          startIcon={copied ? <CheckCircle /> : <ContentCopy />}
          color={copied ? 'success' : 'primary'}
          sx={{ borderRadius: 5 }}
        >
          {copied ? 'Скопировано!' : 'Копировать'}
        </Button>
        <Button
          variant="text"
          onClick={() => { setInput(''); setOutput(''); }}
          startIcon={<RestartAlt />}
          sx={{ borderRadius: 5 }}
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
          label={<Typography variant="caption">Авто-превью</Typography>}
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
                    size="small"
                    onClick={() => {
                      const newOps = isSelected
                        ? selectedOps.filter(o => o !== id)
                        : [...selectedOps, id];
                      handleOpsChange(newOps);
                    }}
                    color={isSelected ? 'primary' : 'default'}
                    variant={isSelected ? 'filled' : 'outlined'}
                    sx={{ cursor: 'pointer', borderRadius: 2 }}
                    icon={isSelected ? <CheckCircle sx={{ fontSize: '14px !important' }} /> : undefined}
                  />
                </Tooltip>
              );
            })}
          </Box>
        </Box>
      ))}

      {selectedOps.length === 0 && (
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          Выберите хотя бы одну операцию из списка выше
        </Alert>
      )}

      {selectedOps.length > 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mt: 1,
            borderRadius: 2,
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
