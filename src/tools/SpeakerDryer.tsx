'use client';

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import {
  Box, Typography, Button, LinearProgress, alpha, useTheme, Chip,
} from '@mui/material';
import { WaterDrop, PlayArrow, Stop } from '@mui/icons-material';
import { useLanguage } from '@/src/i18n/LanguageContext';

const DURATION = 90; // seconds total
const FADE_IN = 1.5;
const FADE_OUT = 0.8;

interface FrequencyPass {
  label: string;
  labelRu: string;
  freqStart: number;
  freqEnd: number;
}

const PASSES: FrequencyPass[] = [
  { label: 'Low', labelRu: 'Низкие', freqStart: 150, freqEnd: 165 },
  { label: 'Mid', labelRu: 'Средние', freqStart: 165, freqEnd: 200 },
  { label: 'Mid-High', labelRu: 'Выше средних', freqStart: 200, freqEnd: 300 },
  { label: 'High', labelRu: 'Высокие', freqStart: 300, freqEnd: 500 },
];

const PASS_DURATION = DURATION / PASSES.length; // 22.5s each

function getPassIndex(elapsed: number): number {
  return Math.min(PASSES.length - 1, Math.floor(elapsed / PASS_DURATION));
}

function getCurrentFreq(elapsed: number): number {
  const idx = getPassIndex(elapsed);
  const pass = PASSES[idx];
  const passElapsed = elapsed - idx * PASS_DURATION;
  const t = Math.min(1, passElapsed / PASS_DURATION);
  return pass.freqStart + (pass.freqEnd - pass.freqStart) * t;
}

// Simple animated wave visualization
function FrequencyWave({ frequency, isRunning, color }: { frequency: number; isRunning: boolean; color: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const phaseRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      if (!isRunning) {
        // Draw flat line when idle
        ctx.beginPath();
        ctx.strokeStyle = alpha(color, 0.2);
        ctx.lineWidth = 2;
        ctx.moveTo(0, h / 2);
        ctx.lineTo(w, h / 2);
        ctx.stroke();
        return;
      }

      // Map frequency to visual wavelength (more cycles for higher freq)
      const cycles = 2 + (frequency - 150) / 50;
      const speed = 0.04 + (frequency - 150) * 0.00005;
      phaseRef.current += speed;

      // Draw multiple layered waves
      for (let layer = 0; layer < 3; layer++) {
        const layerAlpha = 0.4 - layer * 0.12;
        const amp = (h * 0.35) - layer * 6;
        ctx.beginPath();
        ctx.strokeStyle = alpha(color, layerAlpha);
        ctx.lineWidth = 3 - layer * 0.8;

        for (let x = 0; x <= w; x++) {
          const t = x / w;
          const y = h / 2 + Math.sin(t * Math.PI * 2 * cycles + phaseRef.current + layer * 0.8) * amp;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    if (isRunning) {
      animRef.current = requestAnimationFrame(draw);
    } else {
      draw();
    }

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isRunning, frequency, color]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: 80, display: 'block', borderRadius: 12 }}
    />
  );
}

export default function SpeakerDryer() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';

  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [currentPassIdx, setCurrentPassIdx] = useState(0);
  const [currentFreq, setCurrentFreq] = useState(PASSES[0].freqStart);

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
      try { osc?.stop(); } catch { /* already stopped */ }
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
    setCurrentPassIdx(0);
    setCurrentFreq(PASSES[0].freqStart);
  }, []);

  const start = useCallback(() => {
    try {
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';

      // Schedule full multi-pass frequency sweep
      let time = ctx.currentTime;
      osc.frequency.setValueAtTime(PASSES[0].freqStart, time);
      for (const pass of PASSES) {
        osc.frequency.linearRampToValueAtTime(pass.freqStart, time);
        osc.frequency.linearRampToValueAtTime(pass.freqEnd, time + PASS_DURATION);
        time += PASS_DURATION;
      }

      // Fade in
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
      setCurrentPassIdx(0);
      setCurrentFreq(PASSES[0].freqStart);

      intervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        const p = Math.min(100, (elapsed / DURATION) * 100);
        setProgress(p);
        setTimeLeft(Math.max(0, Math.ceil(DURATION - elapsed)));
        setCurrentPassIdx(getPassIndex(elapsed));
        setCurrentFreq(Math.round(getCurrentFreq(elapsed)));
        if (elapsed >= DURATION) stopCleanup(true);
      }, 100);
    } catch { /* AudioContext not supported */ }
  }, [stopCleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopCleanup(false);
  }, [stopCleanup]);

  const primaryColor = theme.palette.primary.main;
  const currentPass = PASSES[currentPassIdx];

  const passChips = useMemo(() => PASSES.map((p, i) => ({
    label: `${isEn ? p.label : p.labelRu}: ${p.freqStart}–${p.freqEnd} Hz`,
    active: isRunning && currentPassIdx === i,
    done: isRunning && currentPassIdx > i,
  })), [isEn, isRunning, currentPassIdx]);

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
            ? 'Multi-pass frequency sweep (150–500 Hz) to push out moisture over 90 seconds'
            : 'Многоэтапный sweep частот (150–500 Гц) для выталкивания влаги за 90 секунд'}
        </Typography>
      </Box>

      {/* Pass indicators */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3, flexWrap: 'wrap' }}>
        {passChips.map((chip, i) => (
          <Chip
            key={i}
            label={chip.label}
            size="small"
            variant={chip.active ? 'filled' : 'outlined'}
            color={chip.active ? 'primary' : chip.done ? 'success' : 'default'}
            sx={{
              fontWeight: 600,
              transition: 'all 0.3s ease',
              ...(chip.active && {
                boxShadow: `0 0 12px ${alpha(primaryColor, 0.4)}`,
              }),
            }}
          />
        ))}
      </Box>

      {/* Wave visualization */}
      <Box
        sx={{
          mb: 3,
          borderRadius: 14,
          overflow: 'hidden',
          background: alpha(primaryColor, 0.04),
          border: `1px solid ${alpha(primaryColor, 0.1)}`,
        }}
      >
        <FrequencyWave frequency={currentFreq} isRunning={isRunning} color={primaryColor} />
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
            <Typography variant="h2" fontWeight={800} sx={{ color: primaryColor, mb: 0.5, fontVariantNumeric: 'tabular-nums' }}>
              {timeLeft}
            </Typography>

            <Typography variant="body2" fontWeight={600} sx={{ color: primaryColor, mb: 0.5 }}>
              {isEn
                ? `Pass ${currentPassIdx + 1}/${PASSES.length} — ${currentPass.label} (${currentFreq} Hz)`
                : `Этап ${currentPassIdx + 1}/${PASSES.length} — ${currentPass.labelRu} (${currentFreq} Гц)`}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {isEn ? 'Cleaning in progress...' : 'Очистка выполняется...'}
            </Typography>

            {/* Overall progress */}
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ borderRadius: 4, height: 8, bgcolor: alpha(primaryColor, 0.12), mb: 1 }}
            />
            {/* Pass progress */}
            <LinearProgress
              variant="determinate"
              value={Math.min(100, ((progress / 100 * DURATION - currentPassIdx * PASS_DURATION) / PASS_DURATION) * 100)}
              sx={{
                borderRadius: 4,
                height: 4,
                bgcolor: alpha(primaryColor, 0.08),
                '& .MuiLinearProgress-bar': { bgcolor: alpha(primaryColor, 0.5) },
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              {isEn ? 'Pass progress' : 'Прогресс этапа'}
            </Typography>
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
          ? 'Set volume to maximum. Hold device face-down during cleaning.'
          : 'Установите максимальную громкость. Держите устройство экраном вниз.'}
      </Typography>
    </Box>
  );
}
