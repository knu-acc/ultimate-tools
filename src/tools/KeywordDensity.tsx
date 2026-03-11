'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Grid,
  Slider,
  Switch,
  Chip,
  Tabs,
  Tab,
  alpha,
  useTheme
} from '@mui/material';

const STOP_WORDS = new Set([
  'и', 'в', 'на', 'с', 'по', 'за', 'к', 'от', 'из', 'у', 'о', 'об',
  'а', 'но', 'да', 'не', 'ни', 'что', 'как', 'это', 'он', 'она', 'оно',
  'они', 'мы', 'вы', 'я', 'ты', 'его', 'её', 'их', 'мой', 'твой', 'свой',
  'наш', 'ваш', 'все', 'всё', 'сам', 'то', 'те', 'та', 'тот', 'эта', 'эти',
  'этот', 'при', 'для', 'до', 'под', 'над', 'без', 'между', 'через',
  'бы', 'же', 'ли', 'уже', 'ещё', 'ну', 'вот', 'так', 'тоже', 'также',
  'если', 'когда', 'где', 'или', 'чтобы', 'хотя', 'потому', 'только',
  'быть', 'был', 'была', 'было', 'были', 'есть', 'будет', 'будут',
  'который', 'которая', 'которое', 'которые', 'этого', 'этой', 'этих',
  'может', 'можно', 'нет', 'даже', 'после', 'перед', 'более', 'очень',
  'во', 'со', 'ко', 'про', 'чем', 'кто', 'нас', 'вас', 'вам', 'нам',
  'ему', 'ей', 'им', 'ним', 'ней', 'себя', 'себе', 'собой',
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'shall', 'can', 'need', 'must',
  'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as',
  'into', 'through', 'during', 'before', 'after', 'above', 'below',
  'and', 'but', 'or', 'nor', 'not', 'so', 'yet', 'both', 'either',
  'neither', 'each', 'every', 'all', 'any', 'few', 'more', 'most',
  'other', 'some', 'such', 'no', 'only', 'own', 'same', 'than',
  'too', 'very', 'just', 'because', 'if', 'when', 'where', 'how',
  'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those',
  'it', 'its', 'he', 'she', 'they', 'them', 'their', 'we', 'you',
  'i', 'me', 'my', 'mine', 'your', 'yours', 'his', 'her', 'hers',
  'our', 'ours', 'theirs', 'am',
]);

interface WordStat {
  word: string;
  count: number;
  density: number;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .split(/\s+/)
    .filter((w) => w.length > 0);
}

function getNgrams(words: string[], n: number): string[] {
  const ngrams: string[] = [];
  for (let i = 0; i <= words.length - n; i++) {
    ngrams.push(words.slice(i, i + n).join(' '));
  }
  return ngrams;
}

function countFrequency(items: string[]): Map<string, number> {
  const freq = new Map<string, number>();
  items.forEach((item) => {
    freq.set(item, (freq.get(item) || 0) + 1);
  });
  return freq;
}

export default function KeywordDensity() {
  const theme = useTheme();
  const [text, setText] = useState('');
  const [minLength, setMinLength] = useState(2);
  const [excludeStopWords, setExcludeStopWords] = useState(true);
  const [topN, setTopN] = useState(30);
  const [ngramTab, setNgramTab] = useState(0);

  const analysis = useMemo(() => {
    const words = tokenize(text);
    if (words.length === 0) return { unigrams: [], bigrams: [], trigrams: [], totalWords: 0 };

    const filteredWords = words.filter((w) => {
      if (w.length < minLength) return false;
      if (excludeStopWords && STOP_WORDS.has(w)) return false;
      return true;
    });

    const totalWords = words.length;

    const buildStats = (items: string[]): WordStat[] => {
      const freq = countFrequency(items);
      return Array.from(freq.entries())
        .map(([word, count]) => ({
          word,
          count,
          density: (count / totalWords) * 100
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, topN);
    };

    const unigrams = buildStats(filteredWords);

    const bigramTokens = getNgrams(
      words.filter((w) => {
        if (w.length < minLength) return false;
        if (excludeStopWords && STOP_WORDS.has(w)) return false;
        return true;
      }),
      2
    );
    const bigrams = buildStats(bigramTokens);

    const trigramTokens = getNgrams(
      words.filter((w) => {
        if (w.length < minLength) return false;
        if (excludeStopWords && STOP_WORDS.has(w)) return false;
        return true;
      }),
      3
    );
    const trigrams = buildStats(trigramTokens);

    return { unigrams, bigrams, trigrams, totalWords };
  }, [text, minLength, excludeStopWords, topN]);

  const currentData =
    ngramTab === 0 ? analysis.unigrams : ngramTab === 1 ? analysis.bigrams : analysis.trigrams;

  const maxCount = currentData.length > 0 ? currentData[0].count : 1;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Input */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 2,
          borderRadius: 3
        }}
      >
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Текст для анализа
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={8}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Вставьте текст для анализа плотности ключевых слов..."
          size="small"
        />
        {analysis.totalWords > 0 && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Всего слов: {analysis.totalWords}
          </Typography>
        )}
      </Paper>

      {/* Filters */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 2,
          borderRadius: 3
        }}
      >
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Настройки фильтрации
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Минимальная длина слова: {minLength}
            </Typography>
            <Slider
              value={minLength}
              onChange={(_, v) => setMinLength(v as number)}
              min={1}
              max={10}
              marks={[
                { value: 1, label: '1' },
                { value: 5, label: '5' },
                { value: 10, label: '10' },
              ]}
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Топ слов: {topN}
            </Typography>
            <Slider
              value={topN}
              onChange={(_, v) => setTopN(v as number)}
              min={10}
              max={100}
              step={5}
              marks={[
                { value: 10, label: '10' },
                { value: 50, label: '50' },
                { value: 100, label: '100' },
              ]}
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Switch
                checked={excludeStopWords}
                onChange={(e) => setExcludeStopWords(e.target.checked)}
                size="small"
              />
              <Typography variant="body2" color="text.secondary">
                Исключить стоп-слова
              </Typography>
            </Box>
            {excludeStopWords && (
              <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {['и', 'в', 'на', 'с', 'не', 'что', 'как', 'это'].map((w) => (
                  <Chip
                    key={w}
                    label={w}
                    size="small"
                    sx={{
                      fontSize: '0.7rem',
                      height: 20,
                      bgcolor: alpha(theme.palette.error.main, 0.08),
                      textDecoration: 'line-through'
                    }}
                  />
                ))}
                <Chip
                  label="..."
                  size="small"
                  sx={{
                    fontSize: '0.7rem',
                    height: 20,
                    bgcolor: alpha(theme.palette.text.primary, 0.05)
                  }}
                />
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>

      {/* Results */}
      {analysis.totalWords > 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3
          }}
        >
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Результаты анализа
          </Typography>

          <Tabs
            value={ngramTab}
            onChange={(_, v) => setNgramTab(v)}
            sx={{ mb: 2, borderBottom: `1px solid ${theme.palette.divider}` }}
          >
            <Tab label="Слова" />
            <Tab label="2-граммы" />
            <Tab label="3-граммы" />
          </Tabs>

          {currentData.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
              Нет данных для отображения. Попробуйте изменить настройки фильтрации.
            </Typography>
          ) : (
            <>
              {/* Header */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  py: 1,
                  px: 1.5,
                  mb: 0.5,
                  borderBottom: `1px solid ${theme.palette.divider}`
                }}
              >
                <Typography
                  variant="caption"
                  fontWeight={700}
                  color="text.secondary"
                  sx={{ width: 30, textAlign: 'center' }}
                >
                  #
                </Typography>
                <Typography
                  variant="caption"
                  fontWeight={700}
                  color="text.secondary"
                  sx={{ flex: 1, minWidth: 100 }}
                >
                  Слово
                </Typography>
                <Typography
                  variant="caption"
                  fontWeight={700}
                  color="text.secondary"
                  sx={{ width: 60, textAlign: 'center' }}
                >
                  Кол-во
                </Typography>
                <Typography
                  variant="caption"
                  fontWeight={700}
                  color="text.secondary"
                  sx={{ width: 70, textAlign: 'center' }}
                >
                  Плотность
                </Typography>
                <Box sx={{ flex: 1, minWidth: 100 }} />
              </Box>

              {/* Rows */}
              {currentData.map((item, index) => (
                <Box
                  key={item.word}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    py: 0.75,
                    px: 1.5,
                    borderRadius: 1,
                    transition: 'background 0.15s ease',
                    '&:hover': {
                      bgcolor: theme.palette.surfaceContainerLow
                    }
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ width: 30, textAlign: 'center' }}
                  >
                    {index + 1}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      flex: 1,
                      minWidth: 100,
                      fontWeight: 500,
                      fontFamily: 'monospace',
                      fontSize: '0.85rem'
                    }}
                  >
                    {item.word}
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{ width: 60, textAlign: 'center' }}
                  >
                    {item.count}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ width: 70, textAlign: 'center', fontFamily: 'monospace', fontSize: '0.8rem' }}
                  >
                    {item.density.toFixed(2)}%
                  </Typography>
                  <Box sx={{ flex: 1, minWidth: 100 }}>
                    <Box
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        overflow: 'hidden'
                      }}
                    >
                      <Box
                        sx={{
                          height: '100%',
                          width: `${(item.count / maxCount) * 100}%`,
                          borderRadius: 4,
                          bgcolor: theme.palette.primary.main,
                          transition: 'width 0.3s ease'
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              ))}
            </>
          )}
        </Paper>
      )}
    </Box>
  );
}
