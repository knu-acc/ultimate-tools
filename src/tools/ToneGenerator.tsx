'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box, Typography, Paper, Grid, Button, Chip, alpha, useTheme, Slider, TextField
} from '@mui/material';
import { PlayArrow, Stop } from '@mui/icons-material';

type WaveformType = 'sine' | 'square' | 'triangle' | 'sawtooth';

const WAVEFORMS: { type: WaveformType; label: string }[] = [
  { type: 'sine', label: 'Синус' },
  { type: 'square', label: 'Квадрат' },
  { type: 'triangle', label: 'Треугольник' },
  { type: 'sawtooth', label: 'Пила' },
];

const QUICK_FREQUENCIES = [
  { freq: 261.63, label: 'C4 (До)' },
  { freq: 329.63, label: 'E4 (Ми)' },
  { freq: 392, label: 'G4 (Соль)' },
  { freq: 440, label: 'A4 (Ля)' },
];

function formatFrequency(freq: number): string {
  if (freq >= 1000) return `${(freq / 1000).toFixed(2)} кГц`;
  return `${freq.toFixed(2)} Гц`;
}

function getNoteName(freq: number): string | null {
  const noteNames = ['До', 'До#', 'Ре', 'Ре#', 'Ми', 'Фа', 'Фа#', 'Соль', 'Соль#', 'Ля', 'Ля#', 'Си'];
  const semitones = 12 * Math.log2(freq / 440);
  const rounded = Math.round(semitones);
  if (Math.abs(semitones - rounded) > 0.15) return null;
  const noteIndex = ((rounded % 12) + 12 + 9) % 12; // A4 = index 9
  const octave = 4 + Math.floor((rounded + 9) / 12);
  return `${noteNames[noteIndex]}${octave}`;
}

export default function ToneGenerator() {
  const theme = useTheme();
  const [frequency, setFrequency] = useState(440);
  const [waveform, setWaveform] = useState<WaveformType>('sine');
  const [volume, setVolume] = useState(50);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const startTone = useCallback(() => {
    try {
      const ctx = audioCtxRef.current || new AudioContext();
      audioCtxRef.current = ctx;

      if (ctx.state === 'suspended') ctx.resume();

      // Clean up previous nodes
      if (oscillatorRef.current) {
        try { oscillatorRef.current.stop(); } catch {}
        oscillatorRef.current.disconnect();
      }
      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = waveform;
      osc.frequency.value = frequency;
      gain.gain.value = volume / 100;

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscillatorRef.current = osc;
      gainNodeRef.current = gain;
      setIsPlaying(true);
    } catch {}
  }, [frequency, waveform, volume]);

  const stopTone = useCallback(() => {
    if (oscillatorRef.current) {
      try {
        if (gainNodeRef.current) {
          const ctx = audioCtxRef.current;
          if (ctx) {
            gainNodeRef.current.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);
          }
        }
        setTimeout(() => {
          try { oscillatorRef.current?.stop(); } catch {}
          oscillatorRef.current?.disconnect();
          oscillatorRef.current = null;
        }, 30);
      } catch {}
    }
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      stopTone();
    } else {
      startTone();
    }
  }, [isPlaying, startTone, stopTone]);

  // Update oscillator params live while playing
  useEffect(() => {
    if (isPlaying && oscillatorRef.current) {
      oscillatorRef.current.frequency.value = frequency;
    }
  }, [frequency, isPlaying]);

  useEffect(() => {
    if (isPlaying && oscillatorRef.current) {
      oscillatorRef.current.type = waveform;
    }
  }, [waveform, isPlaying]);

  useEffect(() => {
    if (isPlaying && gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume / 100;
    }
  }, [volume, isPlaying]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      try { oscillatorRef.current?.stop(); } catch {}
      oscillatorRef.current?.disconnect();
      gainNodeRef.current?.disconnect();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
    };
  }, []);

  const handleFrequencyChange = useCallback((value: number) => {
    const clamped = Math.min(20000, Math.max(20, value));
    setFrequency(clamped);
  }, []);

  const primaryColor = theme.palette.primary.main;
  const noteName = getNoteName(frequency);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        background: alpha(theme.palette.background.paper, 0.8),
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
      }}
    >
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Генератор тона
      </Typography>

      {/* Frequency Display */}
      <Box
        sx={{
          textAlign: 'center',
          my: 3,
          p: 3,
          borderRadius: 4,
          background: alpha(primaryColor, 0.06),
          border: `1px solid ${alpha(primaryColor, 0.15)}`
        }}
      >
        <Typography variant="h3" fontWeight={800} sx={{ color: primaryColor }}>
          {formatFrequency(frequency)}
        </Typography>
        {noteName && (
          <Typography variant="h6" sx={{ color: alpha(primaryColor, 0.7), mt: 0.5 }}>
            ≈ {noteName}
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Форма волны: {WAVEFORMS.find(w => w.type === waveform)?.label}
        </Typography>
      </Box>

      {/* Frequency Input */}
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
        Частота (Гц)
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
        <TextField
          value={frequency}
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            if (!isNaN(v)) handleFrequencyChange(v);
          }}
          type="number"
          size="small"
          inputProps={{ min: 20, max: 20000, step: 1, style: { textAlign: 'center', fontWeight: 700 } }}
          sx={{ width: 130 }}
        />
        <Typography variant="caption" color="text.secondary">
          20 — 20 000 Гц
        </Typography>
      </Box>

      {/* Frequency Slider */}
      <Box sx={{ px: 1, mb: 2 }}>
        <Slider
          value={Math.log2(frequency)}
          onChange={(_, v) => {
            const val = v as number;
            handleFrequencyChange(Math.round(Math.pow(2, val) * 100) / 100);
          }}
          min={Math.log2(20)}
          max={Math.log2(20000)}
          step={0.01}
          sx={{ color: primaryColor }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption" color="text.secondary">20 Гц</Typography>
          <Typography variant="caption" color="text.secondary">20 кГц</Typography>
        </Box>
      </Box>

      {/* Quick Frequency Chips */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mb: 3 }}>
        {QUICK_FREQUENCIES.map((f) => (
          <Chip
            key={f.freq}
            label={f.label}
            onClick={() => handleFrequencyChange(f.freq)}
            variant={frequency === f.freq ? 'filled' : 'outlined'}
            color={frequency === f.freq ? 'primary' : 'default'}
            sx={{ fontWeight: 600, borderRadius: 2 }}
          />
        ))}
      </Box>

      {/* Waveform Selector */}
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
        Форма волны
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mb: 3 }}>
        {WAVEFORMS.map((w) => (
          <Chip
            key={w.type}
            label={w.label}
            onClick={() => setWaveform(w.type)}
            variant={waveform === w.type ? 'filled' : 'outlined'}
            color={waveform === w.type ? 'primary' : 'default'}
            sx={{ fontWeight: 600, borderRadius: 2, minWidth: 80 }}
          />
        ))}
      </Box>

      {/* Volume Slider */}
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
        Громкость: {volume}%
      </Typography>
      <Box sx={{ px: 1, mb: 3 }}>
        <Slider
          value={volume}
          onChange={(_, v) => setVolume(v as number)}
          min={0}
          max={100}
          sx={{ color: primaryColor }}
        />
      </Box>

      {/* Play / Stop */}
      <Button
        fullWidth
        variant="contained"
        size="large"
        startIcon={isPlaying ? <Stop /> : <PlayArrow />}
        onClick={togglePlay}
        sx={{
          borderRadius: 3,
          py: 1.5,
          fontWeight: 700,
          fontSize: 16,
          background: isPlaying ? theme.palette.error.main : primaryColor,
          '&:hover': {
            background: isPlaying ? theme.palette.error.dark : theme.palette.primary.dark
          }
        }}
      >
        {isPlaying ? 'Остановить' : 'Воспроизвести'}
      </Button>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 2 }}>
        Используется Web Audio API для генерации звука
      </Typography>
    </Paper>
  );
}
