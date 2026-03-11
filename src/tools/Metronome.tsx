'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box, Typography, Paper, Grid, Button, Chip, alpha, useTheme, IconButton, Slider, TextField,
} from '@mui/material';
import { PlayArrow, Stop } from '@mui/icons-material';

type TimeSignature = '2/4' | '3/4' | '4/4' | '6/8';

const QUICK_TEMPOS = [60, 80, 100, 120, 140, 160];
const TIME_SIGNATURES: TimeSignature[] = ['2/4', '3/4', '4/4', '6/8'];

function getBeatsPerMeasure(ts: TimeSignature): number {
  switch (ts) {
    case '2/4': return 2;
    case '3/4': return 3;
    case '4/4': return 4;
    case '6/8': return 6;
  }
}

export default function Metronome() {
  const theme = useTheme();
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeSignature, setTimeSignature] = useState<TimeSignature>('4/4');
  const [currentBeat, setCurrentBeat] = useState(0);
  const [tapTimes, setTapTimes] = useState<number[]>([]);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);
  const nextNoteTimeRef = useRef(0);
  const currentBeatRef = useRef(0);
  const isPlayingRef = useRef(false);
  const bpmRef = useRef(bpm);
  const timeSignatureRef = useRef(timeSignature);

  bpmRef.current = bpm;
  timeSignatureRef.current = timeSignature;

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const playClick = useCallback((time: number, isAccent: boolean) => {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.value = isAccent ? 1000 : 700;
    gain.gain.value = isAccent ? 0.6 : 0.3;

    osc.start(time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
    osc.stop(time + 0.05);
  }, [getAudioContext]);

  const scheduler = useCallback(() => {
    const ctx = getAudioContext();
    const scheduleAhead = 0.1;

    while (nextNoteTimeRef.current < ctx.currentTime + scheduleAhead) {
      const beats = getBeatsPerMeasure(timeSignatureRef.current);
      const isAccent = currentBeatRef.current === 0;

      playClick(nextNoteTimeRef.current, isAccent);

      const beatDisplay = currentBeatRef.current;
      setTimeout(() => {
        setCurrentBeat(beatDisplay);
      }, (nextNoteTimeRef.current - ctx.currentTime) * 1000);

      const secondsPerBeat = 60.0 / bpmRef.current;
      nextNoteTimeRef.current += secondsPerBeat;
      currentBeatRef.current = (currentBeatRef.current + 1) % beats;
    }
  }, [getAudioContext, playClick]);

  const startMetronome = useCallback(() => {
    const ctx = getAudioContext();
    currentBeatRef.current = 0;
    nextNoteTimeRef.current = ctx.currentTime;
    isPlayingRef.current = true;
    setIsPlaying(true);

    const tick = () => {
      if (!isPlayingRef.current) return;
      scheduler();
      timerRef.current = window.setTimeout(tick, 25);
    };
    tick();
  }, [getAudioContext, scheduler]);

  const stopMetronome = useCallback(() => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    setCurrentBeat(0);
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      stopMetronome();
    } else {
      startMetronome();
    }
  }, [isPlaying, startMetronome, stopMetronome]);

  const handleBpmChange = useCallback((value: number) => {
    const clamped = Math.min(300, Math.max(20, value));
    setBpm(clamped);
  }, []);

  const handleTapTempo = useCallback(() => {
    const now = Date.now();
    setTapTimes(prev => {
      const recent = [...prev, now].filter(t => now - t < 3000);
      if (recent.length >= 2) {
        const intervals: number[] = [];
        for (let i = 1; i < recent.length; i++) {
          intervals.push(recent[i] - recent[i - 1]);
        }
        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const tapBpm = Math.round(60000 / avgInterval);
        if (tapBpm >= 20 && tapBpm <= 300) {
          setBpm(tapBpm);
        }
      }
      return recent;
    });
  }, []);

  useEffect(() => {
    return () => {
      isPlayingRef.current = false;
      if (timerRef.current !== null) clearTimeout(timerRef.current);
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
    };
  }, []);

  // Reset beat counter when time signature changes
  useEffect(() => {
    currentBeatRef.current = 0;
    setCurrentBeat(0);
  }, [timeSignature]);

  const beats = getBeatsPerMeasure(timeSignature);
  const primaryColor = theme.palette.primary.main;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        background: alpha(theme.palette.background.paper, 0.8),
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}
    >
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Метроном
      </Typography>

      {/* Beat Indicator */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, my: 3 }}>
        {Array.from({ length: beats }, (_, i) => (
          <Box
            key={i}
            sx={{
              width: i === 0 ? 40 : 32,
              height: i === 0 ? 40 : 32,
              borderRadius: '50%',
              border: `2px solid ${alpha(primaryColor, 0.3)}`,
              background:
                isPlaying && currentBeat === i
                  ? i === 0
                    ? theme.palette.error.main
                    : primaryColor
                  : alpha(primaryColor, 0.08),
              transition: 'background 0.05s ease',
              boxShadow:
                isPlaying && currentBeat === i
                  ? `0 0 16px ${alpha(i === 0 ? theme.palette.error.main : primaryColor, 0.5)}`
                  : 'none',
            }}
          />
        ))}
      </Box>

      {/* BPM Display */}
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography variant="h2" fontWeight={800} sx={{ color: primaryColor }}>
          {bpm}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          уд/мин
        </Typography>
      </Box>

      {/* BPM Controls */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
        <IconButton
          onClick={() => handleBpmChange(bpm - 1)}
          sx={{
            border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
            borderRadius: 3,
            width: 44,
            height: 44,
          }}
        >
          <Typography variant="h6" fontWeight={700}>−</Typography>
        </IconButton>

        <TextField
          value={bpm}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            if (!isNaN(v)) handleBpmChange(v);
          }}
          type="number"
          size="small"
          inputProps={{ min: 20, max: 300, style: { textAlign: 'center', fontWeight: 700, fontSize: 18 } }}
          sx={{ width: 100 }}
        />

        <IconButton
          onClick={() => handleBpmChange(bpm + 1)}
          sx={{
            border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
            borderRadius: 3,
            width: 44,
            height: 44,
          }}
        >
          <Typography variant="h6" fontWeight={700}>+</Typography>
        </IconButton>
      </Box>

      {/* BPM Slider */}
      <Box sx={{ px: 2, mb: 2 }}>
        <Slider
          value={bpm}
          onChange={(_, v) => handleBpmChange(v as number)}
          min={20}
          max={300}
          sx={{ color: primaryColor }}
        />
      </Box>

      {/* Quick Tempo Chips */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mb: 3 }}>
        {QUICK_TEMPOS.map((t) => (
          <Chip
            key={t}
            label={t}
            onClick={() => handleBpmChange(t)}
            variant={bpm === t ? 'filled' : 'outlined'}
            color={bpm === t ? 'primary' : 'default'}
            sx={{ fontWeight: 600, borderRadius: 2 }}
          />
        ))}
      </Box>

      {/* Time Signature */}
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, textAlign: 'center' }}>
        Размер
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mb: 3 }}>
        {TIME_SIGNATURES.map((ts) => (
          <Chip
            key={ts}
            label={ts}
            onClick={() => setTimeSignature(ts)}
            variant={timeSignature === ts ? 'filled' : 'outlined'}
            color={timeSignature === ts ? 'primary' : 'default'}
            sx={{ fontWeight: 600, borderRadius: 2, minWidth: 56 }}
          />
        ))}
      </Box>

      {/* Play / Stop & Tap Tempo */}
      <Grid container spacing={2} sx={{ mb: 1 }}>
        <Grid size={{ xs: 6 }}>
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
              background: isPlaying
                ? theme.palette.error.main
                : primaryColor,
              '&:hover': {
                background: isPlaying
                  ? theme.palette.error.dark
                  : theme.palette.primary.dark,
              },
            }}
          >
            {isPlaying ? 'Стоп' : 'Старт'}
          </Button>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Button
            fullWidth
            variant="outlined"
            size="large"
            onClick={handleTapTempo}
            sx={{
              borderRadius: 3,
              py: 1.5,
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            Тап темп
          </Button>
        </Grid>
      </Grid>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
        Нажимайте «Тап темп» в ритме для определения BPM
      </Typography>
    </Paper>
  );
}
