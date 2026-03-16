'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box, Typography, Paper, Grid, Button, alpha, useTheme
} from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { useLanguage } from '@/src/i18n/LanguageContext';

const TEXTS_RU = [
  'Быстрая коричневая лиса перепрыгнула через ленивую собаку. Этот текст содержит все буквы алфавита.',
  'Программирование — это искусство говорить компьютеру, что именно он должен делать.',
  'Каждый день приносит новые возможности для тех, кто готов их использовать и двигаться вперёд.',
  'Технологии не стоят на месте, и каждый год появляются всё более удивительные изобретения.',
  'Лучший способ предсказать будущее — это создать его своими руками и умом.',
];

const TEXTS_EN = [
  'The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet.',
  'Programming is the art of telling a computer exactly what it should do.',
  'Every day brings new opportunities for those who are ready to seize them and move forward.',
  'Technology never stands still, and every year brings ever more amazing inventions.',
  'The best way to predict the future is to create it with your own hands and mind.',
];

export default function TypingSpeed() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const TEXTS = isEn ? TEXTS_EN : TEXTS_RU;
  const [text, setText] = useState(TEXTS[0]);
  const [typed, setTyped] = useState('');
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const [errors, setErrors] = useState(0);
  const inputRef = useRef<HTMLDivElement>(null);

  const reset = useCallback(() => {
    const newText = TEXTS[Math.floor(Math.random() * TEXTS.length)];
    setText(newText);
    setTyped('');
    setStarted(false);
    setFinished(false);
    setStartTime(0);
    setEndTime(0);
    setErrors(0);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (finished) return;
    if (e.key === 'Escape') { reset(); return; }
    if (e.key.length !== 1 && e.key !== 'Backspace') return;
    e.preventDefault();

    if (!started) {
      setStarted(true);
      setStartTime(Date.now());
    }

    if (e.key === 'Backspace') {
      setTyped(prev => prev.slice(0, -1));
      return;
    }

    const newTyped = typed + e.key;
    const expectedChar = text[typed.length];

    if (e.key !== expectedChar) {
      setErrors(prev => prev + 1);
    }

    setTyped(newTyped);

    if (newTyped.length >= text.length) {
      setFinished(true);
      setEndTime(Date.now());
    }
  }, [typed, text, started, finished, reset]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const elapsed = finished
    ? (endTime - startTime) / 1000
    : started
      ? (Date.now() - startTime) / 1000
      : 0;

  const words = typed.trim().split(/\s+/).filter(Boolean).length;
  const wpm = elapsed > 0 ? Math.round((words / elapsed) * 60) : 0;
  const cpm = elapsed > 0 ? Math.round((typed.length / elapsed) * 60) : 0;
  const accuracy = typed.length > 0 ? Math.round(((typed.length - errors) / typed.length) * 100) : 100;
  const progress = (typed.length / text.length) * 100;

  // Live timer
  const [, setTick] = useState(0);
  useEffect(() => {
    if (started && !finished) {
      const interval = setInterval(() => setTick(t => t + 1), 100);
      return () => clearInterval(interval);
    }
  }, [started, finished]);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Text display */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
          bgcolor: theme.palette.surfaceContainerLow,
          mb: 2,
          cursor: 'text',
          minHeight: 100
        }}
        ref={inputRef}
        tabIndex={0}
      >
        <Typography variant="body1" sx={{ fontSize: '1.15rem', lineHeight: 2, fontFamily: 'monospace' }}>
          {text.split('').map((char, i) => {
            let color = theme.palette.text.secondary;
            let bg = 'transparent';
            if (i < typed.length) {
              color = typed[i] === char ? theme.palette.success.main : theme.palette.error.main;
              if (typed[i] !== char) bg = alpha(theme.palette.error.main, 0.1);
            }
            if (i === typed.length) {
              bg = alpha(theme.palette.primary.main, 0.2);
            }
            return (
              <span key={i} style={{ color, backgroundColor: bg, borderRadius: 2, padding: '1px 0' }}>
                {char}
              </span>
            );
          })}
        </Typography>
      </Paper>

      {/* Progress bar */}
      <Box sx={{ height: 4, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), mb: 2, overflow: 'hidden' }}>
        <Box sx={{ height: '100%', width: `${progress}%`, bgcolor: theme.palette.primary.main, transition: 'width 0.1s', borderRadius: 2 }} />
      </Box>

      {/* Stats */}
      <Grid container spacing={1.5} sx={{ mb: 2 }}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: theme.palette.surfaceContainerLow, textAlign: 'center', transition: 'all 200ms ease', '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) } }}>
            <Typography variant="h4" fontWeight={700} color="primary">{wpm}</Typography>
            <Typography variant="caption" color="text.secondary">{isEn ? 'Words/min (WPM)' : 'Слов/мин (WPM)'}</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: alpha(theme.palette.success.main, 0.06), textAlign: 'center', transition: 'all 200ms ease', '&:hover': { bgcolor: alpha(theme.palette.success.main, 0.1) } }}>
            <Typography variant="h4" fontWeight={700} sx={{ color: theme.palette.success.main }}>{accuracy}%</Typography>
            <Typography variant="caption" color="text.secondary">{isEn ? 'Accuracy' : 'Точность'}</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: alpha(theme.palette.warning.main, 0.06), textAlign: 'center', transition: 'all 200ms ease', '&:hover': { bgcolor: alpha(theme.palette.warning.main, 0.1) } }}>
            <Typography variant="h4" fontWeight={700} sx={{ color: theme.palette.warning.main }}>{cpm}</Typography>
            <Typography variant="caption" color="text.secondary">{isEn ? 'Chars/min (CPM)' : 'Симв/мин (CPM)'}</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: alpha(theme.palette.error.main, 0.06), textAlign: 'center', transition: 'all 200ms ease', '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.1) } }}>
            <Typography variant="h4" fontWeight={700} sx={{ color: theme.palette.error.main }}>{errors}</Typography>
            <Typography variant="caption" color="text.secondary">{isEn ? 'Errors' : 'Ошибки'}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
        <Button variant="outlined" startIcon={<Refresh />} onClick={reset} sx={{ borderRadius: 5 }}>
          {isEn ? 'Restart (Esc)' : 'Заново (Esc)'}
        </Button>
      </Box>

      {!started && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
          {isEn ? 'Start typing to begin the test' : 'Начните печатать, чтобы запустить тест'}
        </Typography>
      )}

      {finished && (
        <Paper elevation={0} sx={{ mt: 2, p: { xs: 2, sm: 3 }, borderRadius: 3, bgcolor: alpha(theme.palette.success.main, 0.08), textAlign: 'center' }}>
          <Typography variant="h6" fontWeight={600} color="success.main">
            {isEn ? `Done! ${wpm} WPM with ${accuracy}% accuracy` : `Готово! ${wpm} WPM с точностью ${accuracy}%`}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isEn ? `Time: ${elapsed.toFixed(1)} sec` : `Время: ${elapsed.toFixed(1)} сек`}
          </Typography>
        </Paper>
      )}
    </Box>
  );
}
