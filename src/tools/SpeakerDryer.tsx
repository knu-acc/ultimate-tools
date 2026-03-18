'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Box, Typography, Button, LinearProgress, alpha, useTheme, Chip,
} from '@mui/material';
import { WaterDrop, PlayArrow, Stop } from '@mui/icons-material';
import { useLanguage } from '@/src/i18n/LanguageContext';

const DURATION = 30; // seconds
const FREQ_START = 150;
const FREQ_END = 165;
const FADE_IN = 1.5;
const FADE_OUT = 0.8;

export default function SpeakerDryer() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';

  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);

  const stopCleanup = useCallback((withFade = true) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    const ctx = audioCtxRef.current;
    const gain = gainRef.current;
    const osc = oscRef.current;

    if (ctx && gain && withFade) {
      gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + FADE_OUT);
    }

    const cleanup = () => {
      try { osc?.stop(); } catch {}
      osc?.disconnect();
      gain?.disconnect();
      if (ctx) { ctx.close().catch(() => {}); audioCtxRef.current = null; }
      oscRef.current = null;
      gainRef.current = null;
    };

    if (withFade) {
      setTimeout(cleanup, (FADE_OUT + 0.1) * 1000);
    } else {
      cleanup();
    }

    setIsRunning(false);
    setProgress(0);
    setTimeLeft(DURATION);
  }, []);

  const start = useCallback(() => {
    try {
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Sweep 150 → 165 Hz over DURATION seconds — this range is effective for membrane vibration
      osc.frequency.setValueAtTime(FREQ_START, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(FREQ_END, ctx.currentTime + DURATION);

      // Fade in to avoid click
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.8, ctx.currentTime + FADE_IN);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscRef.current = osc;
      gainRef.current = gain;
      startTimeRef.current = Date.now();
      setIsRunning(true);
      setProgress(0);
      setTimeLeft(DURATION);

      intervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        const p = Math.min(100, (elapsed / DURATION) * 100);
        setProgress(p);
        setTimeLeft(Math.max(0, Math.ceil(DURATION - elapsed)));
        if (elapsed >= DURATION) stopCleanup(true);
      }, 200);
    } catch {}
  }, [stopCleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopCleanup(false);
  }, [stopCleanup]);

  const primaryColor = theme.palette.primary.main;

  return (
    <Box
      sx={{
        maxWidth: 800,
        mx: 'auto',
        mb: 2,
        borderRadius: 18,
        bgcolor: theme.palette.surfaceContainerLow,
        p: { xs: 2, sm: 3 },
        transition: 'background 0.2s ease',
        '&:hover': { bgcolor: alpha(primaryColor, 0.04) },
      }}
    >
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <WaterDrop sx={{ fontSize: 48, color: primaryColor, mb: 1 }} />
        <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>
          {isEn ? 'Speaker Dryer' : 'Очистка динамика от влаги'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isEn
            ? 'Vibrates speaker membranes with a 150–165 Hz sweep to push out moisture'
            : 'Вибрирует мембрану динамика на 150–165 Гц для выталкивания влаги'}
        </Typography>
      </Box>

      {/* Frequency chip info */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3, flexWrap: 'wrap' }}>
        <Chip label={`${FREQ_START}–${FREQ_END} Hz sweep`} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
        <Chip label={`${DURATION}s`} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
      </Box>

      {/* Progress display */}
      <Box
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 14,
          background: alpha(primaryColor, 0.06),
          border: `1px solid ${alpha(primaryColor, 0.15)}`,
          textAlign: 'center',
        }}
      >
        {isRunning ? (
          <>
            <Typography variant="h2" fontWeight={800} sx={{ color: primaryColor, mb: 1, fontVariantNumeric: 'tabular-nums' }}>
              {timeLeft}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {isEn ? 'Cleaning in progress…' : 'Очистка выполняется…'}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ borderRadius: 4, height: 8, bgcolor: alpha(primaryColor, 0.12) }}
            />
          </>
        ) : (
          <>
            <Typography variant="h2" fontWeight={800} sx={{ color: 'text.disabled', mb: 1 }}>
              {DURATION}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isEn ? 'Press start to remove moisture' : 'Нажмите старт для удаления влаги'}
            </Typography>
          </>
        )}
      </Box>

      {/* Action button */}
      <Button
        fullWidth
        variant="contained"
        size="large"
        startIcon={isRunning ? <Stop /> : <PlayArrow />}
        onClick={isRunning ? () => stopCleanup(true) : start}
        sx={{
          borderRadius: 18,
          py: 1.5,
          fontWeight: 700,
          fontSize: 16,
          background: isRunning ? theme.palette.error.main : primaryColor,
          '&:hover': {
            background: isRunning ? theme.palette.error.dark : theme.palette.primary.dark,
          },
        }}
      >
        {isRunning
          ? (isEn ? 'Stop' : 'Остановить')
          : (isEn ? 'Start cleaning' : 'Начать очистку')}
      </Button>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 2, px: 1 }}>
        {isEn
          ? '⚠️ Set volume to maximum. Hold device face-down during cleaning.'
          : '⚠️ Установите максимальную громкость. Держите устройство экраном вниз.'}
      </Typography>
    </Box>
  );
}
