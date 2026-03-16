'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box, Typography, Paper, Button, Chip, alpha, useTheme, IconButton, Slider
} from '@mui/material';
import { PlayArrow, Pause, Refresh, SkipNext, Settings } from '@mui/icons-material';
import { useLanguage } from '@/src/i18n/LanguageContext';

type Phase = 'work' | 'break' | 'longBreak';

export default function PomodoroTimer() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);
  const [longBreakInterval, setLongBreakInterval] = useState(4);
  const [phase, setPhase] = useState<Phase>('work');
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const audioRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const getPhaseLabel = (p: Phase): string => {
    switch (p) {
      case 'work': return isEn ? 'Work' : 'Работа';
      case 'break': return isEn ? 'Break' : 'Перерыв';
      case 'longBreak': return isEn ? 'Long break' : 'Длинный перерыв';
    }
  };

  const getPhaseColor = (p: Phase): string => {
    switch (p) {
      case 'work': return theme.palette.error.main;
      case 'break': return theme.palette.success.main;
      case 'longBreak': return '#2196F3';
    }
  };

  const getPhaseDuration = (p: Phase): number => {
    switch (p) {
      case 'work': return workDuration * 60;
      case 'break': return breakDuration * 60;
      case 'longBreak': return longBreakDuration * 60;
    }
  };

  const playBeep = useCallback(() => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      gain.gain.value = 0.3;
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.stop(ctx.currentTime + 0.5);
    } catch {}
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            playBeep();
            // Switch phase
            if (phase === 'work') {
              const newCompleted = completedPomodoros + 1;
              setCompletedPomodoros(newCompleted);
              if (newCompleted % longBreakInterval === 0) {
                setPhase('longBreak');
                return longBreakDuration * 60;
              } else {
                setPhase('break');
                return breakDuration * 60;
              }
            } else {
              setPhase('work');
              return workDuration * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, phase, workDuration, breakDuration, longBreakDuration, longBreakInterval, completedPomodoros, playBeep]);

  const formatTime = (s: number): string => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const reset = () => {
    setIsRunning(false);
    setPhase('work');
    setSecondsLeft(workDuration * 60);
    setCompletedPomodoros(0);
  };

  const skipPhase = () => {
    setIsRunning(false);
    if (phase === 'work') {
      const newCompleted = completedPomodoros + 1;
      setCompletedPomodoros(newCompleted);
      if (newCompleted % longBreakInterval === 0) {
        setPhase('longBreak');
        setSecondsLeft(longBreakDuration * 60);
      } else {
        setPhase('break');
        setSecondsLeft(breakDuration * 60);
      }
    } else {
      setPhase('work');
      setSecondsLeft(workDuration * 60);
    }
  };

  const progress = 1 - secondsLeft / getPhaseDuration(phase);
  const circumference = 2 * Math.PI * 120;

  return (
    <Box sx={{ textAlign: 'center' }}>
      {/* Phase chips */}
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 2 }}>
        {(['work', 'break', 'longBreak'] as Phase[]).map(p => (
          <Chip
            key={p}
            label={getPhaseLabel(p)}
            onClick={() => {
              setPhase(p);
              setSecondsLeft(getPhaseDuration(p));
              setIsRunning(false);
            }}
            sx={{
              fontWeight: phase === p ? 700 : 400,
              bgcolor: phase === p ? alpha(getPhaseColor(p), 0.15) : theme.palette.surfaceContainerLow,
              color: phase === p ? getPhaseColor(p) : theme.palette.text.primary,
              border: phase === p ? `2px solid ${alpha(getPhaseColor(p), 0.3)}` : '2px solid transparent'
            }}
          />
        ))}
      </Box>

      {/* Circular timer */}
      <Box sx={{ position: 'relative', width: 280, height: 280, mx: 'auto', mb: 2 }}>
        <svg width="280" height="280" style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx="140" cy="140" r="120"
            fill="none"
            stroke={alpha(getPhaseColor(phase), 0.1)}
            strokeWidth="8"
          />
          <circle
            cx="140" cy="140" r="120"
            fill="none"
            stroke={getPhaseColor(phase)}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="h2" fontWeight={300} sx={{ fontFamily: 'monospace', letterSpacing: 2 }}>
            {formatTime(secondsLeft)}
          </Typography>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {getPhaseLabel(phase)}
          </Typography>
        </Box>
      </Box>

      {/* Controls */}
      <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', mb: 2 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={isRunning ? <Pause /> : <PlayArrow />}
          onClick={() => setIsRunning(!isRunning)}
          sx={{
            borderRadius: 7,
            px: 4,
            bgcolor: getPhaseColor(phase),
            '&:hover': { bgcolor: alpha(getPhaseColor(phase), 0.85) }
          }}
        >
          {isRunning ? (isEn ? 'Pause' : 'Пауза') : (isEn ? 'Start' : 'Старт')}
        </Button>
        <IconButton onClick={skipPhase} sx={{ }}>
          <SkipNext />
        </IconButton>
        <IconButton onClick={reset} sx={{ }}>
          <Refresh />
        </IconButton>
        <IconButton onClick={() => setShowSettings(!showSettings)} sx={{ }}>
          <Settings />
        </IconButton>
      </Box>

      {/* Pomodoro counter */}
      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center', mb: 2 }}>
        {Array.from({ length: longBreakInterval }).map((_, i) => (
          <Box
            key={i}
            sx={{
              width: 16,
              height: 16,
              borderRadius: '50%',
              bgcolor: i < (completedPomodoros % longBreakInterval)
                ? getPhaseColor('work')
                : alpha(theme.palette.text.secondary, 0.15),
              transition: 'bgcolor 0.3s'
            }}
          />
        ))}
        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
          {completedPomodoros} {isEn ? 'pomodoros' : 'помодоро'}
        </Typography>
      </Box>

      {/* Settings */}
      {showSettings && (
        <Paper
          elevation={0}
          sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, bgcolor: theme.palette.surfaceContainerLow, maxWidth: 400, mx: 'auto' }}
        >
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>{isEn ? 'Settings' : 'Настройки'}</Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {isEn ? 'Work' : 'Работа'}: {workDuration} {isEn ? 'min' : 'мин'}
          </Typography>
          <Slider value={workDuration} onChange={(_, v) => { setWorkDuration(v as number); if (phase === 'work') setSecondsLeft((v as number) * 60); }} min={1} max={60} sx={{ mb: 1 }} />

          <Typography variant="body2" color="text.secondary">
            {isEn ? 'Break' : 'Перерыв'}: {breakDuration} {isEn ? 'min' : 'мин'}
          </Typography>
          <Slider value={breakDuration} onChange={(_, v) => { setBreakDuration(v as number); if (phase === 'break') setSecondsLeft((v as number) * 60); }} min={1} max={30} sx={{ mb: 1 }} />

          <Typography variant="body2" color="text.secondary">
            {isEn ? 'Long break' : 'Длинный перерыв'}: {longBreakDuration} {isEn ? 'min' : 'мин'}
          </Typography>
          <Slider value={longBreakDuration} onChange={(_, v) => { setLongBreakDuration(v as number); if (phase === 'longBreak') setSecondsLeft((v as number) * 60); }} min={5} max={45} sx={{ mb: 1 }} />

          <Typography variant="body2" color="text.secondary">
            {isEn ? 'Long break every' : 'Длинный перерыв каждые'}: {longBreakInterval} {isEn ? 'pomodoros' : 'помодоро'}
          </Typography>
          <Slider value={longBreakInterval} onChange={(_, v) => setLongBreakInterval(v as number)} min={2} max={8} />
        </Paper>
      )}
    </Box>
  );
}
