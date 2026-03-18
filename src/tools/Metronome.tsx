'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box, Typography, Grid, Button, Chip, alpha, useTheme, IconButton, Slider, TextField, keyframes
} from '@mui/material';
import { PlayArrow, Stop, Remove, Add } from '@mui/icons-material';
import { useLanguage } from '@/src/i18n/LanguageContext';

/* ---- MD3 keyframe animations ---- */
const beatPulse = keyframes`
  0% { transform: scale(1); box-shadow: none; }
  15% { transform: scale(1.35); }
  100% { transform: scale(1); }
`;

const accentPulse = keyframes`
  0% { transform: scale(1); }
  15% { transform: scale(1.5); }
  100% { transform: scale(1); }
`;

const pendulumSwing = keyframes`
  0% { transform: translateX(-18px); opacity: 0.7; }
  50% { transform: translateX(18px); opacity: 1; }
  100% { transform: translateX(-18px); opacity: 0.7; }
`;

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
  const { locale } = useLanguage();
  const isEn = locale === 'en';
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

    osc.frequency.value = isAccent ? 1000 : 800;
    // Schedule gain AT the note's future time — fixes silent non-accent beats
    const targetGain = isAccent ? 0.7 : 0.5;
    gain.gain.setValueAtTime(targetGain, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
    osc.start(time);
    osc.stop(time + 0.1);
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

  useEffect(() => {
    currentBeatRef.current = 0;
    setCurrentBeat(0);
  }, [timeSignature]);

  const beats = getBeatsPerMeasure(timeSignature);
  const primaryColor = theme.palette.primary.main;
  const containerBg = theme.palette.primaryContainer;
  const onContainer = theme.palette.onPrimaryContainer;
  const surfLow = theme.palette.surfaceContainerLow;
  const surfHigh = theme.palette.surfaceContainerHigh;
  const beatDuration = 60 / bpm;

  // Tempo label
  const tempoLabel = bpm < 40 ? 'Grave' : bpm < 60 ? 'Largo' : bpm < 66 ? 'Larghetto'
    : bpm < 76 ? 'Adagio' : bpm < 108 ? 'Andante' : bpm < 120 ? 'Moderato'
    : bpm < 156 ? 'Allegro' : bpm < 176 ? 'Vivace' : bpm < 200 ? 'Presto' : 'Prestissimo';

  return (
    <Box sx={{
      maxWidth: 520,
      mx: 'auto',
      mb: 2,
      borderRadius: '28px',
      bgcolor: surfLow,
      p: { xs: 2.5, sm: 4 },
      transition: 'background 0.3s cubic-bezier(0.2,0,0,1)',
    }}>

      {/* ===== Central BPM Ring ===== */}
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 3,
        position: 'relative',
      }}>
        {/* SVG animated ring */}
        <Box sx={{ position: 'relative', width: 200, height: 200 }}>
          <svg viewBox="0 0 100 100" width="200" height="200" style={{ position: 'absolute', top: 0, left: 0 }}>
            {/* Background track */}
            <circle
              cx="50" cy="50" r="45"
              fill="none"
              stroke={alpha(primaryColor, 0.1)}
              strokeWidth="5"
            />
            {/* BPM progress arc: maps 20-300 to 0-100% */}
            <circle
              cx="50" cy="50" r="45"
              fill="none"
              stroke={isPlaying ? primaryColor : alpha(primaryColor, 0.4)}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * ((bpm - 20) / 280))}
              transform="rotate(-90 50 50)"
              style={{ transition: 'stroke-dashoffset 0.4s cubic-bezier(0.2,0,0,1), stroke 0.3s ease' }}
            />
          </svg>

          {/* Pulsing center circle on beat */}
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 160,
            height: 160,
            borderRadius: '50%',
            bgcolor: isPlaying ? alpha(containerBg, 0.5) : alpha(containerBg, 0.25),
            transition: 'background 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Typography
              sx={{
                fontSize: { xs: 52, sm: 60 },
                fontWeight: 800,
                lineHeight: 1,
                color: onContainer,
                letterSpacing: '-2px',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {bpm}
            </Typography>
            <Typography sx={{
              fontSize: 11,
              fontWeight: 600,
              color: alpha(onContainer, 0.6),
              textTransform: 'uppercase',
              letterSpacing: 1.5,
              mt: 0.25,
            }}>
              {isEn ? 'BPM' : 'уд/мин'}
            </Typography>
            <Typography sx={{
              fontSize: 12,
              fontWeight: 500,
              color: alpha(primaryColor, 0.8),
              mt: 0.5,
            }}>
              {tempoLabel}
            </Typography>
          </Box>
        </Box>

        {/* Pendulum indicator (only visible when playing) */}
        {isPlaying && (
          <Box sx={{
            width: 40,
            height: 4,
            borderRadius: 2,
            bgcolor: primaryColor,
            mt: 1.5,
            animation: `${pendulumSwing} ${beatDuration}s cubic-bezier(0.4,0,0.6,1) infinite`,
          }} />
        )}
      </Box>

      {/* ===== Beat Indicator Dots ===== */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: { xs: 1.5, sm: 2 }, mb: 3 }}>
        {Array.from({ length: beats }, (_, i) => {
          const isActive = isPlaying && currentBeat === i;
          const isAccent = i === 0;
          const dotSize = isAccent ? 22 : 16;
          const activeColor = isAccent ? theme.palette.error.main : primaryColor;

          return (
            <Box
              key={i}
              sx={{
                width: dotSize,
                height: dotSize,
                borderRadius: '50%',
                bgcolor: isActive ? activeColor : alpha(primaryColor, 0.12),
                border: `2px solid ${isActive ? activeColor : alpha(primaryColor, 0.25)}`,
                transition: 'background 0.08s ease, border-color 0.08s ease',
                animation: isActive
                  ? `${isAccent ? accentPulse : beatPulse} ${Math.min(beatDuration * 0.6, 0.35)}s cubic-bezier(0.2,0,0,1)`
                  : 'none',
                boxShadow: isActive
                  ? `0 0 12px 4px ${alpha(activeColor, 0.35)}, 0 0 24px 8px ${alpha(activeColor, 0.15)}`
                  : 'none',
              }}
            />
          );
        })}
      </Box>

      {/* ===== BPM Controls Row ===== */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 2 }}>
        <IconButton
          onClick={() => handleBpmChange(bpm - 5)}
          aria-label="Decrease BPM by 5"
          sx={{
            bgcolor: alpha(primaryColor, 0.08),
            color: primaryColor,
            width: 48,
            height: 48,
            borderRadius: '14px',
            '&:hover': { bgcolor: alpha(primaryColor, 0.16) },
            '&:active': { bgcolor: alpha(primaryColor, 0.24) },
            transition: 'all 0.2s cubic-bezier(0.2,0,0,1)',
          }}
        >
          <Remove fontSize="small" />
        </IconButton>

        <IconButton
          onClick={() => handleBpmChange(bpm - 1)}
          aria-label="Decrease BPM by 1"
          sx={{
            bgcolor: containerBg,
            color: onContainer,
            width: 56,
            height: 56,
            borderRadius: '16px',
            fontSize: 24,
            fontWeight: 700,
            '&:hover': { bgcolor: alpha(containerBg, 0.85) },
            '&:active': { bgcolor: alpha(containerBg, 0.7) },
            transition: 'all 0.2s cubic-bezier(0.2,0,0,1)',
          }}
        >
          <Remove />
        </IconButton>

        <TextField
          value={bpm}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            if (!isNaN(v)) handleBpmChange(v);
          }}
          type="number"
          size="small"
          slotProps={{ htmlInput: { min: 20, max: 300, style: { textAlign: 'center', fontWeight: 700, fontSize: 20, padding: '10px 4px' } } }}
          sx={{
            width: 88,
            '& .MuiOutlinedInput-root': {
              borderRadius: '16px',
              bgcolor: surfHigh,
              '& fieldset': { borderColor: alpha(primaryColor, 0.2) },
              '&:hover fieldset': { borderColor: alpha(primaryColor, 0.4) },
              '&.Mui-focused fieldset': { borderColor: primaryColor },
            }
          }}
        />

        <IconButton
          onClick={() => handleBpmChange(bpm + 1)}
          aria-label="Increase BPM by 1"
          sx={{
            bgcolor: containerBg,
            color: onContainer,
            width: 56,
            height: 56,
            borderRadius: '16px',
            fontSize: 24,
            fontWeight: 700,
            '&:hover': { bgcolor: alpha(containerBg, 0.85) },
            '&:active': { bgcolor: alpha(containerBg, 0.7) },
            transition: 'all 0.2s cubic-bezier(0.2,0,0,1)',
          }}
        >
          <Add />
        </IconButton>

        <IconButton
          onClick={() => handleBpmChange(bpm + 5)}
          aria-label="Increase BPM by 5"
          sx={{
            bgcolor: alpha(primaryColor, 0.08),
            color: primaryColor,
            width: 48,
            height: 48,
            borderRadius: '14px',
            '&:hover': { bgcolor: alpha(primaryColor, 0.16) },
            '&:active': { bgcolor: alpha(primaryColor, 0.24) },
            transition: 'all 0.2s cubic-bezier(0.2,0,0,1)',
          }}
        >
          <Add fontSize="small" />
        </IconButton>
      </Box>

      {/* ===== BPM Slider ===== */}
      <Box sx={{ px: 1, mb: 2.5 }}>
        <Slider
          value={bpm}
          onChange={(_, v) => handleBpmChange(v as number)}
          min={20}
          max={300}
          sx={{
            color: primaryColor,
            height: 6,
            '& .MuiSlider-thumb': {
              width: 22,
              height: 22,
              bgcolor: primaryColor,
              boxShadow: `0 0 0 6px ${alpha(primaryColor, 0.16)}`,
              '&:hover, &.Mui-focusVisible': {
                boxShadow: `0 0 0 8px ${alpha(primaryColor, 0.24)}`,
              },
            },
            '& .MuiSlider-track': {
              borderRadius: 3,
            },
            '& .MuiSlider-rail': {
              bgcolor: alpha(primaryColor, 0.12),
              borderRadius: 3,
            },
          }}
        />
      </Box>

      {/* ===== Quick Tempo Chips (MD3 tonal) ===== */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mb: 3 }}>
        {QUICK_TEMPOS.map((t) => {
          const selected = bpm === t;
          return (
            <Chip
              key={t}
              label={t}
              onClick={() => handleBpmChange(t)}
              sx={{
                fontWeight: 600,
                fontSize: 13,
                borderRadius: '8px',
                height: 36,
                minWidth: 52,
                bgcolor: selected ? containerBg : alpha(primaryColor, 0.06),
                color: selected ? onContainer : theme.palette.text.secondary,
                border: `1px solid ${selected ? alpha(onContainer, 0.2) : alpha(primaryColor, 0.12)}`,
                '&:hover': {
                  bgcolor: selected ? alpha(containerBg, 0.85) : alpha(primaryColor, 0.12),
                },
                transition: 'all 0.2s cubic-bezier(0.2,0,0,1)',
              }}
            />
          );
        })}
      </Box>

      {/* ===== Time Signature (visual cards) ===== */}
      <Typography variant="subtitle2" sx={{
        mb: 1.5,
        textAlign: 'center',
        color: theme.palette.text.secondary,
        fontWeight: 600,
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 1.2,
      }}>
        {isEn ? 'Time Signature' : 'Размер'}
      </Typography>
      <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', mb: 3 }}>
        {TIME_SIGNATURES.map((ts) => {
          const selected = timeSignature === ts;
          const [top, bottom] = ts.split('/');
          return (
            <Box
              key={ts}
              onClick={() => setTimeSignature(ts)}
              sx={{
                width: 56,
                height: 68,
                borderRadius: '16px',
                bgcolor: selected ? containerBg : alpha(primaryColor, 0.04),
                border: `2px solid ${selected ? primaryColor : alpha(primaryColor, 0.12)}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.2,0,0,1)',
                '&:hover': {
                  bgcolor: selected ? alpha(containerBg, 0.85) : alpha(primaryColor, 0.1),
                  transform: 'scale(1.05)',
                },
                '&:active': { transform: 'scale(0.97)' },
                boxShadow: selected
                  ? `0 2px 8px ${alpha(primaryColor, 0.2)}`
                  : 'none',
              }}
            >
              <Typography sx={{
                fontSize: 20,
                fontWeight: 800,
                lineHeight: 1,
                color: selected ? onContainer : theme.palette.text.primary,
              }}>
                {top}
              </Typography>
              <Box sx={{
                width: 20,
                height: 2,
                borderRadius: 1,
                bgcolor: selected ? alpha(onContainer, 0.4) : alpha(primaryColor, 0.2),
                my: 0.3,
              }} />
              <Typography sx={{
                fontSize: 20,
                fontWeight: 800,
                lineHeight: 1,
                color: selected ? onContainer : theme.palette.text.primary,
              }}>
                {bottom}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* ===== Play / Stop & Tap Tempo ===== */}
      <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
        <Grid size={{ xs: 7 }}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            disableElevation
            startIcon={isPlaying ? <Stop /> : <PlayArrow />}
            onClick={togglePlay}
            sx={{
              borderRadius: '18px',
              py: 2,
              fontWeight: 700,
              fontSize: 17,
              textTransform: 'none',
              background: isPlaying
                ? theme.palette.error.main
                : primaryColor,
              color: isPlaying ? theme.palette.error.contrastText : theme.palette.primary.contrastText,
              boxShadow: isPlaying
                ? `0 4px 16px ${alpha(theme.palette.error.main, 0.35)}`
                : `0 4px 16px ${alpha(primaryColor, 0.35)}`,
              '&:hover': {
                background: isPlaying
                  ? theme.palette.error.dark
                  : theme.palette.primary.dark,
                boxShadow: isPlaying
                  ? `0 6px 20px ${alpha(theme.palette.error.main, 0.45)}`
                  : `0 6px 20px ${alpha(primaryColor, 0.45)}`,
              },
              transition: 'all 0.25s cubic-bezier(0.2,0,0,1)',
            }}
          >
            {isPlaying ? (isEn ? 'Stop' : 'Стоп') : (isEn ? 'Start' : 'Старт')}
          </Button>
        </Grid>
        <Grid size={{ xs: 5 }}>
          <Button
            fullWidth
            variant="outlined"
            size="large"
            onClick={handleTapTempo}
            sx={{
              borderRadius: '18px',
              py: 2,
              fontWeight: 700,
              fontSize: 15,
              textTransform: 'none',
              borderColor: alpha(primaryColor, 0.3),
              color: primaryColor,
              bgcolor: alpha(primaryColor, 0.04),
              '&:hover': {
                borderColor: primaryColor,
                bgcolor: alpha(primaryColor, 0.1),
              },
              '&:active': {
                bgcolor: alpha(primaryColor, 0.18),
              },
              transition: 'all 0.2s cubic-bezier(0.2,0,0,1)',
            }}
          >
            {isEn ? 'Tap Tempo' : 'Тап темп'}
          </Button>
        </Grid>
      </Grid>

      <Typography variant="caption" sx={{
        display: 'block',
        textAlign: 'center',
        mt: 1,
        color: alpha(theme.palette.text.secondary, 0.6),
        fontSize: 11,
      }}>
        {isEn ? 'Tap "Tap Tempo" in rhythm to detect BPM' : 'Нажимайте «Тап темп» в ритме для определения BPM'}
      </Typography>
    </Box>
  );
}
