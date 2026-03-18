'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Box, Typography, Paper, Grid, Button, Slider, TextField, alpha, useTheme
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import TimerIcon from '@mui/icons-material/Timer';
import { useLanguage } from '@/src/i18n/LanguageContext';

type NoiseType = 'white' | 'pink' | 'brown';

interface NoiseOption {
  type: NoiseType;
  label: string;
  description: string;
}

const NOISE_OPTIONS: NoiseOption[] = [
  { type: 'white', label: 'Белый шум', description: 'Равномерный шум на всех частотах' },
  { type: 'pink', label: 'Розовый шум', description: 'Убывание 3 дБ на октаву' },
  { type: 'brown', label: 'Коричневый шум', description: 'Убывание 6 дБ на октаву' },
];

const BUFFER_SIZE = 4096;
const BAR_COUNT = 24;

export default function NoiseGenerator() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';

  const NOISE_OPTIONS_I18N: NoiseOption[] = [
    { type: 'white', label: isEn ? 'White Noise' : 'Белый шум', description: isEn ? 'Uniform noise across all frequencies' : 'Равномерный шум на всех частотах' },
    { type: 'pink', label: isEn ? 'Pink Noise' : 'Розовый шум', description: isEn ? '3 dB decrease per octave' : 'Убывание 3 дБ на октаву' },
    { type: 'brown', label: isEn ? 'Brown Noise' : 'Коричневый шум', description: isEn ? '6 dB decrease per octave' : 'Убывание 6 дБ на октаву' },
  ];
  const [noiseType, setNoiseType] = useState<NoiseType>('white');
  const [volume, setVolume] = useState(50);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState<string>('');
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [bars, setBars] = useState<number[]>(Array(BAR_COUNT).fill(5));

  const audioCtxRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const b0Ref = useRef(0);
  const b1Ref = useRef(0);
  const b2Ref = useRef(0);
  const b3Ref = useRef(0);
  const b4Ref = useRef(0);
  const b5Ref = useRef(0);
  const b6Ref = useRef(0);
  const lastOutRef = useRef(0);

  const stopNoise = useCallback(() => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (gainRef.current) {
      gainRef.current.disconnect();
      gainRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (animRef.current) {
      clearInterval(animRef.current);
      animRef.current = null;
    }
    setIsPlaying(false);
    setTimeRemaining(null);
    setBars(Array(BAR_COUNT).fill(5));
    b0Ref.current = 0;
    b1Ref.current = 0;
    b2Ref.current = 0;
    b3Ref.current = 0;
    b4Ref.current = 0;
    b5Ref.current = 0;
    b6Ref.current = 0;
    lastOutRef.current = 0;
  }, []);

  const startNoise = useCallback(() => {
    stopNoise();

    const ctx = new AudioContext();
    audioCtxRef.current = ctx;

    const gain = ctx.createGain();
    // Fade in over 1.5 s — eliminates the harsh click on start
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(volume / 100, ctx.currentTime + 1.5);
    gain.connect(ctx.destination);
    gainRef.current = gain;

    const processor = ctx.createScriptProcessor(BUFFER_SIZE, 1, 1);
    const currentType = noiseType;

    processor.onaudioprocess = (e) => {
      const output = e.outputBuffer.getChannelData(0);
      for (let i = 0; i < output.length; i++) {
        const white = Math.random() * 2 - 1;

        if (currentType === 'white') {
          output[i] = white;
        } else if (currentType === 'pink') {
          b0Ref.current = 0.99886 * b0Ref.current + white * 0.0555179;
          b1Ref.current = 0.99332 * b1Ref.current + white * 0.0750759;
          b2Ref.current = 0.96900 * b2Ref.current + white * 0.1538520;
          b3Ref.current = 0.86650 * b3Ref.current + white * 0.3104856;
          b4Ref.current = 0.55000 * b4Ref.current + white * 0.5329522;
          b5Ref.current = -0.7616 * b5Ref.current - white * 0.0168980;
          output[i] = (b0Ref.current + b1Ref.current + b2Ref.current + b3Ref.current + b4Ref.current + b5Ref.current + b6Ref.current + white * 0.5362) * 0.11;
          b6Ref.current = white * 0.115926;
        } else {
          // Brown noise: integrate then hard-clamp to prevent clipping
          const brown = (lastOutRef.current + (0.02 * white)) / 1.02;
          lastOutRef.current = brown;
          output[i] = Math.max(-1, Math.min(1, brown * 3.5));
        }
      }
    };

    processor.connect(gain);
    processorRef.current = processor;

    animRef.current = setInterval(() => {
      setBars(Array.from({ length: BAR_COUNT }, () => Math.random() * 80 + 10));
    }, 100);

    const mins = parseInt(timerMinutes);
    if (mins > 0) {
      let remaining = mins * 60;
      setTimeRemaining(remaining);
      timerRef.current = setInterval(() => {
        remaining--;
        setTimeRemaining(remaining);
        if (remaining <= 0) {
          stopNoise();
        }
      }, 1000);
    }

    setIsPlaying(true);
  }, [noiseType, volume, timerMinutes, stopNoise]);

  useEffect(() => {
    if (gainRef.current) {
      gainRef.current.gain.value = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    return () => stopNoise();
  }, [stopNoise]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <Box sx={{
      maxWidth: 800,
      mx: 'auto',
      mb: 2,
      borderRadius: 18,
      bgcolor: theme.palette.surfaceContainerLow,
      p: { xs: 2, sm: 3 },
      transition: 'background 0.2s ease',
      '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) }
    }}>
      {/* Noise type selector */}
      <Paper
        elevation={0}
        sx={{ p: { xs: 2, sm: 3 }, mb: 2, borderRadius: 18 }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
          {isEn ? 'Noise Type' : 'Тип шума'}
        </Typography>
        <Grid container spacing={2}>
          {NOISE_OPTIONS_I18N.map((opt) => (
            <Grid key={opt.type} size={{ xs: 12, sm: 4 }}>
              <Paper
                elevation={0}
                onClick={() => { if (!isPlaying) setNoiseType(opt.type); }}
                sx={{
                  p: 2,
                  textAlign: 'center',
                  cursor: isPlaying ? 'default' : 'pointer',
                  border: `2px solid ${noiseType === opt.type ? theme.palette.primary.main : theme.palette.divider}`,
                  borderRadius: 18,
                  backgroundColor: noiseType === opt.type
                    ? theme.palette.surfaceContainerHigh
                    : 'transparent',
                  transitionProperty: 'background-color', transitionDuration: '200ms',
                  '&:hover': !isPlaying ? {
                    borderColor: theme.palette.primary.main
                  } : {}
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {opt.label}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {opt.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Waveform visualization */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 2,
          borderRadius: 18,
          backgroundColor: alpha(theme.palette.background.default, 0.5)
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            gap: '3px',
            height: 100
          }}
        >
          {bars.map((h, i) => (
            <Box
              key={i}
              sx={{
                width: `${100 / BAR_COUNT - 1}%`,
                height: `${isPlaying ? h : 5}%`,
                backgroundColor: isPlaying ? theme.palette.primary.main : theme.palette.divider,
                borderRadius: 1,
                transition: 'height 100ms ease',
                opacity: isPlaying ? 0.8 : 0.3
              }}
            />
          ))}
        </Box>
        {timeRemaining !== null && (
          <Typography variant="body2" sx={{ textAlign: 'center', mt: 2, fontWeight: 600 }}>
            {isEn ? 'Remaining' : 'Осталось'}: {formatTime(timeRemaining)}
          </Typography>
        )}
      </Paper>

      {/* Controls */}
      <Paper
        elevation={0}
        sx={{ p: { xs: 2, sm: 3 }, mb: 2, borderRadius: 18 }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, mb: 1, color: 'text.secondary' }}>
              {isEn ? 'Volume' : 'Громкость'}: {volume}%
            </Typography>
            <Slider
              value={volume}
              onChange={(_, v) => setVolume(v as number)}
              min={0}
              max={100}
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField
              value={timerMinutes}
              onChange={(e) => setTimerMinutes(e.target.value.replace(/\D/g, ''))}
              size="small"
              fullWidth
              placeholder={isEn ? 'Timer (min)' : 'Таймер (мин)'}
              disabled={isPlaying}
              slotProps={{
                input: {
                  startAdornment: <TimerIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                }
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={isPlaying ? stopNoise : startNoise}
              startIcon={isPlaying ? <StopIcon /> : <PlayArrowIcon />}
              color={isPlaying ? 'error' : 'primary'}
              sx={{ height: 40 }}
            >
              {isPlaying ? (isEn ? 'Stop' : 'Стоп') : (isEn ? 'Play' : 'Играть')}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Info */}
      <Paper
        elevation={0}
        sx={{ p: { xs: 2, sm: 3 }, borderRadius: 18 }}
      >
        <Typography variant="caption" color="text.secondary">
          {isEn
            ? 'The generator uses the Web Audio API. White noise contains uniform frequencies. Pink noise decreases by 3 dB/octave and helps with sleep. Brown noise is even deeper, decreasing by 6 dB/octave.'
            : 'Генератор использует Web Audio API. Белый шум содержит равномерные частоты. Розовый шум уменьшается на 3 дБ/октаву и помогает при засыпании. Коричневый шум ещё более глубокий, с убыванием 6 дБ/октаву.'}
        </Typography>
      </Paper>
    </Box>
  );
}
