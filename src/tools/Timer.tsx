'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Tab,
  Tabs,
  TextField,
  Grid,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  IconButton,
  useTheme,
  alpha
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import FlagIcon from '@mui/icons-material/Flag';
import DeleteIcon from '@mui/icons-material/Delete';
import AlarmIcon from '@mui/icons-material/Alarm';
import TimerIcon from '@mui/icons-material/Timer';

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const centiseconds = Math.floor((ms % 1000) / 10);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`;
}

function formatTimerDisplay(ms: number): string {
  if (ms <= 0) return '00:00:00';
  const totalSeconds = Math.ceil(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

interface Lap {
  number: number;
  time: number;
  total: number;
}

export default function TimerComponent() {
  const theme = useTheme();
  const [tab, setTab] = useState(0);

  // Timer state
  const [timerHours, setTimerHours] = useState('0');
  const [timerMinutes, setTimerMinutes] = useState('5');
  const [timerSeconds, setTimerSeconds] = useState('0');
  const [timerRemaining, setTimerRemaining] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerFinished, setTimerFinished] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerEndRef = useRef(0);
  const audioRef = useRef<AudioContext | null>(null);

  // Stopwatch state
  const [swElapsed, setSwElapsed] = useState(0);
  const [swRunning, setSwRunning] = useState(false);
  const [laps, setLaps] = useState<Lap[]>([]);
  const swRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const swStartRef = useRef(0);
  const swAccumulatedRef = useRef(0);

  // --- Timer Logic ---
  const startTimer = useCallback(() => {
    const totalMs =
      (parseInt(timerHours) || 0) * 3600000 +
      (parseInt(timerMinutes) || 0) * 60000 +
      (parseInt(timerSeconds) || 0) * 1000;

    if (totalMs <= 0) return;

    if (timerRemaining > 0 && !timerFinished) {
      // Resume
      timerEndRef.current = Date.now() + timerRemaining;
    } else {
      // New start
      setTimerRemaining(totalMs);
      timerEndRef.current = Date.now() + totalMs;
      setTimerFinished(false);
    }

    setTimerRunning(true);
    timerRef.current = setInterval(() => {
      const remaining = timerEndRef.current - Date.now();
      if (remaining <= 0) {
        setTimerRemaining(0);
        setTimerRunning(false);
        setTimerFinished(true);
        if (timerRef.current) clearInterval(timerRef.current);
        playAlarm();
      } else {
        setTimerRemaining(remaining);
      }
    }, 50);
  }, [timerHours, timerMinutes, timerSeconds, timerRemaining, timerFinished]);

  const pauseTimer = useCallback(() => {
    setTimerRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const resetTimer = useCallback(() => {
    setTimerRunning(false);
    setTimerFinished(false);
    setTimerRemaining(0);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const playAlarm = () => {
    try {
      const ctx = new AudioContext();
      audioRef.current = ctx;
      const playBeep = (startTime: number, freq: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.3, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
        osc.start(startTime);
        osc.stop(startTime + 0.3);
      };
      for (let i = 0; i < 4; i++) {
        playBeep(ctx.currentTime + i * 0.4, 880);
        playBeep(ctx.currentTime + i * 0.4 + 0.15, 1100);
      }
    } catch { /* Audio not available */ }
  };

  // --- Stopwatch Logic ---
  const startStopwatch = useCallback(() => {
    swStartRef.current = Date.now();
    setSwRunning(true);
    swRef.current = setInterval(() => {
      setSwElapsed(swAccumulatedRef.current + (Date.now() - swStartRef.current));
    }, 30);
  }, []);

  const pauseStopwatch = useCallback(() => {
    swAccumulatedRef.current += Date.now() - swStartRef.current;
    setSwRunning(false);
    if (swRef.current) clearInterval(swRef.current);
  }, []);

  const resetStopwatch = useCallback(() => {
    setSwRunning(false);
    setSwElapsed(0);
    swAccumulatedRef.current = 0;
    setLaps([]);
    if (swRef.current) clearInterval(swRef.current);
  }, []);

  const addLap = useCallback(() => {
    const currentTotal = swElapsed;
    const prevTotal = laps.length > 0 ? laps[0].total : 0;
    const lapTime = currentTotal - prevTotal;

    setLaps((prev) => [
      { number: prev.length + 1, time: lapTime, total: currentTotal },
      ...prev,
    ]);
  }, [swElapsed, laps]);

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (swRef.current) clearInterval(swRef.current);
    };
  }, []);

  const timerProgress = (() => {
    const totalMs =
      (parseInt(timerHours) || 0) * 3600000 +
      (parseInt(timerMinutes) || 0) * 60000 +
      (parseInt(timerSeconds) || 0) * 1000;
    if (totalMs <= 0) return 0;
    return ((totalMs - timerRemaining) / totalMs) * 100;
  })();

  const bestLap = laps.length > 0 ? Math.min(...laps.map((l) => l.time)) : 0;
  const worstLap = laps.length > 0 ? Math.max(...laps.map((l) => l.time)) : 0;

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto' }}>
      <Paper elevation={0} sx={{ }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="fullWidth"
          sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}
        >
          <Tab icon={<AlarmIcon />} label="Таймер" />
          <Tab icon={<TimerIcon />} label="Секундомер" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* Timer Tab */}
          {tab === 0 && (
            <Box>
              {/* Timer Display */}
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography
                  sx={{
                    fontFamily: 'monospace',
                    fontSize: { xs: '2.5rem', sm: '4rem' },
                    fontWeight: 300,
                    letterSpacing: 4,
                    color: timerFinished
                      ? 'error.main'
                      : timerRunning
                        ? 'primary.main'
                        : 'text.primary',
                    transition: 'color 300ms ease'
                  }}
                >
                  {timerRemaining > 0 || timerRunning
                    ? formatTimerDisplay(timerRemaining)
                    : formatTimerDisplay(
                        (parseInt(timerHours) || 0) * 3600000 +
                          (parseInt(timerMinutes) || 0) * 60000 +
                          (parseInt(timerSeconds) || 0) * 1000
                      )}
                </Typography>

                {timerFinished && (
                  <Chip label="Время вышло!" color="error" sx={{ mt: 1, fontSize: '1rem', py: 2 }} />
                )}

                {/* Progress bar */}
                {(timerRunning || timerRemaining > 0) && (
                  <Box
                    sx={{
                      mt: 2,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: theme.palette.surfaceContainerHigh,
                      overflow: 'hidden'
                    }}
                  >
                    <Box
                      sx={{
                        height: '100%',
                        width: `${timerProgress}%`,
                        backgroundColor: 'primary.main',
                        borderRadius: 3,
                        transition: 'width 100ms linear'
                      }}
                    />
                  </Box>
                )}
              </Box>

              {/* Timer Input */}
              {!timerRunning && timerRemaining === 0 && (
                <Grid container spacing={2} sx={{ mb: 3, justifyContent: 'center' }}>
                  <Grid size={{ xs: 4 }}>
                    <TextField
                      label="Часы"
                      type="number"
                      value={timerHours}
                      onChange={(e) => setTimerHours(e.target.value)}
                      fullWidth
                      slotProps={{ htmlInput: { min: 0, max: 99 } }}
                      sx={{ '& input': { textAlign: 'center', fontSize: '1.3rem', fontFamily: 'monospace' } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 4 }}>
                    <TextField
                      label="Минуты"
                      type="number"
                      value={timerMinutes}
                      onChange={(e) => setTimerMinutes(e.target.value)}
                      fullWidth
                      slotProps={{ htmlInput: { min: 0, max: 59 } }}
                      sx={{ '& input': { textAlign: 'center', fontSize: '1.3rem', fontFamily: 'monospace' } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 4 }}>
                    <TextField
                      label="Секунды"
                      type="number"
                      value={timerSeconds}
                      onChange={(e) => setTimerSeconds(e.target.value)}
                      fullWidth
                      slotProps={{ htmlInput: { min: 0, max: 59 } }}
                      sx={{ '& input': { textAlign: 'center', fontSize: '1.3rem', fontFamily: 'monospace' } }}
                    />
                  </Grid>
                </Grid>
              )}

              {/* Timer Controls */}
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                {!timerRunning ? (
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<PlayArrowIcon />}
                    onClick={startTimer}
                    sx={{ px: 4 }}
                  >
                    {timerRemaining > 0 ? 'Продолжить' : 'Старт'}
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<PauseIcon />}
                    onClick={pauseTimer}
                    sx={{ px: 4 }}
                  >
                    Пауза
                  </Button>
                )}
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<RestartAltIcon />}
                  onClick={resetTimer}
                  color="secondary"
                >
                  Сброс
                </Button>
              </Box>

              {/* Quick presets */}
              {!timerRunning && timerRemaining === 0 && (
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
                  {[
                    { label: '1 мин', h: '0', m: '1', s: '0' },
                    { label: '5 мин', h: '0', m: '5', s: '0' },
                    { label: '10 мин', h: '0', m: '10', s: '0' },
                    { label: '15 мин', h: '0', m: '15', s: '0' },
                    { label: '30 мин', h: '0', m: '30', s: '0' },
                    { label: '1 час', h: '1', m: '0', s: '0' },
                  ].map((preset) => (
                    <Chip
                      key={preset.label}
                      label={preset.label}
                      variant="outlined"
                      clickable
                      onClick={() => {
                        setTimerHours(preset.h);
                        setTimerMinutes(preset.m);
                        setTimerSeconds(preset.s);
                      }}
                    />
                  ))}
                </Box>
              )}
            </Box>
          )}

          {/* Stopwatch Tab */}
          {tab === 1 && (
            <Box>
              {/* Stopwatch Display */}
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography
                  sx={{
                    fontFamily: 'monospace',
                    fontSize: { xs: '2.5rem', sm: '4rem' },
                    fontWeight: 300,
                    letterSpacing: 4,
                    color: swRunning ? 'primary.main' : 'text.primary',
                    transition: 'color 300ms ease'
                  }}
                >
                  {formatTime(swElapsed)}
                </Typography>
              </Box>

              {/* Stopwatch Controls */}
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
                {!swRunning ? (
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<PlayArrowIcon />}
                    onClick={startStopwatch}
                    sx={{ px: 4 }}
                  >
                    {swElapsed > 0 ? 'Продолжить' : 'Старт'}
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<PauseIcon />}
                      onClick={pauseStopwatch}
                      sx={{ px: 4 }}
                    >
                      Пауза
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<FlagIcon />}
                      onClick={addLap}
                      color="secondary"
                    >
                      Круг
                    </Button>
                  </>
                )}
                <IconButton onClick={resetStopwatch} color="error" sx={{ }}>
                  <RestartAltIcon />
                </IconButton>
              </Box>

              {/* Laps */}
              {laps.length > 0 && (
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    overflow: 'hidden'
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      px: 2,
                      py: 1.5,
                      backgroundColor: theme.palette.surfaceContainerLow
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Круги ({laps.length})
                    </Typography>
                    <IconButton size="small" onClick={() => setLaps([])}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Divider />
                  <List
                    dense
                    disablePadding
                    sx={{ maxHeight: 300, overflow: 'auto' }}
                  >
                    {laps.map((lap) => {
                      const isBest = laps.length > 1 && lap.time === bestLap;
                      const isWorst = laps.length > 1 && lap.time === worstLap;

                      return (
                        <ListItem
                          key={lap.number}
                          sx={{
                            backgroundColor: isBest
                              ? alpha(theme.palette.success.main, 0.06)
                              : isWorst
                                ? alpha(theme.palette.error.main, 0.06)
                                : 'transparent'
                          }}
                        >
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Chip label={`#${lap.number}`} size="small" variant="outlined" />
                                  {isBest && <Chip label="Лучший" size="small" color="success" />}
                                  {isWorst && <Chip label="Худший" size="small" color="error" />}
                                </Box>
                                <Box sx={{ textAlign: 'right' }}>
                                  <Typography
                                    variant="body2"
                                    sx={{ fontFamily: 'monospace', fontWeight: 600 }}
                                  >
                                    {formatTime(lap.time)}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                                    {formatTime(lap.total)}
                                  </Typography>
                                </Box>
                              </Box>
                            }
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                </Paper>
              )}
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
