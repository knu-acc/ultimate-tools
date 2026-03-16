'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Grid,
  Slider,
  Select,
  MenuItem,
  IconButton,
  useTheme,
  alpha,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import { useLanguage } from '@/src/i18n/LanguageContext';

export default function TextToSpeech() {
  const theme = useTheme();
  const [text, setText] = useState('');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
  const [highlightLength, setHighlightLength] = useState(0);
  const [supported, setSupported] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const { locale } = useLanguage();
  const isEn = locale === 'en';

  // Load voices
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setSupported(false);
      return;
    }

    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      if (available.length > 0) {
        setVoices(available);
        if (!selectedVoice) {
          const ruVoice = available.find((v) => v.lang.startsWith('ru'));
          const defaultVoice = available.find((v) => v.default);
          setSelectedVoice(
            (ruVoice || defaultVoice || available[0])?.name || ''
          );
        }
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      window.speechSynthesis.cancel();
    };
  }, [selectedVoice]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setHighlightIndex(null);
    setHighlightLength(0);
    utteranceRef.current = null;
  }, []);

  const play = useCallback(() => {
    if (!text.trim()) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    // Stop any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find((v) => v.name === selectedVoice);
    if (voice) utterance.voice = voice;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        setHighlightIndex(event.charIndex);
        setHighlightLength(event.charLength || 0);
      }
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setHighlightIndex(null);
      setHighlightLength(0);
      utteranceRef.current = null;
    };

    utterance.onerror = (event) => {
      if (event.error !== 'canceled') {
        setIsPlaying(false);
        setIsPaused(false);
        setHighlightIndex(null);
        setHighlightLength(0);
      }
      utteranceRef.current = null;
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  }, [text, voices, selectedVoice, rate, pitch, volume, isPaused]);

  const pause = useCallback(() => {
    window.speechSynthesis.pause();
    setIsPaused(true);
    setIsPlaying(false);
  }, []);

  // Build highlighted text
  const renderHighlightedText = () => {
    if (highlightIndex === null || !text) {
      return (
        <Typography
          variant="body1"
          sx={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            color: text ? theme.palette.text.primary : theme.palette.text.disabled,
            minHeight: 100,
            lineHeight: 1.8
          }}
        >
          {text || (isEn ? 'Text for speech will appear here...' : 'Текст для озвучивания появится здесь...')}
        </Typography>
      );
    }

    const before = text.slice(0, highlightIndex);
    const word = text.slice(highlightIndex, highlightIndex + (highlightLength || 1));
    const after = text.slice(highlightIndex + (highlightLength || 1));

    return (
      <Typography
        variant="body1"
        sx={{
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          minHeight: 100,
          lineHeight: 1.8
        }}
      >
        {before}
        <Box
          component="span"
          sx={{
            backgroundColor: alpha(theme.palette.primary.main, 0.25),
            borderRadius: 0.5,
            px: 0.3,
            py: 0.1,
            transitionProperty: 'background-color', transitionDuration: '100ms', transitionTimingFunction: 'ease'
          }}
        >
          {word}
        </Box>
        {after}
      </Typography>
    );
  };

  const voiceLabel = (v: SpeechSynthesisVoice) => {
    const langTag = v.lang;
    return `${v.name} (${langTag})`;
  };

  if (!supported) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, textAlign: 'center', borderRadius: 3, background: theme.palette.surfaceContainerLow }}>
          <Typography variant="h6" color="error" gutterBottom>
            {isEn ? 'Speech synthesis is not supported' : 'Синтез речи не поддерживается'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isEn
              ? 'Your browser does not support the Web Speech API. Try using Google Chrome or Microsoft Edge.'
              : 'Ваш браузер не поддерживает Web Speech API. Попробуйте использовать Google Chrome или Microsoft Edge.'}
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper elevation={0} sx={{ borderRadius: 3, background: theme.palette.surfaceContainerLow }}>
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          {/* Text Input */}
          <TextField
            fullWidth
            multiline
            minRows={4}
            maxRows={10}
            placeholder={isEn ? 'Enter text to speak...' : 'Введите текст для озвучивания...'}
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isPlaying || isPaused}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': { borderRadius: 3 }
            }}
          />

          {/* Highlighted Preview */}
          {(isPlaying || isPaused) && (
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 2,
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                backgroundColor: theme.palette.surfaceContainerLow,
                maxHeight: 200,
                overflow: 'auto'
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  mb: 1,
                  color: theme.palette.text.secondary,
                  fontWeight: 600
                }}
              >
                {isEn ? 'Playback' : 'Воспроизведение'}
              </Typography>
              {renderHighlightedText()}
            </Paper>
          )}

          {/* Controls */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, mb: 2 }}>
            {!isPlaying ? (
              <Button
                variant="contained"
                size="large"
                startIcon={<PlayArrowIcon />}
                onClick={play}
                disabled={!text.trim()}
                sx={{ px: 4, borderRadius: 3, textTransform: 'none' }}
              >
                {isPaused ? (isEn ? 'Resume' : 'Продолжить') : (isEn ? 'Play' : 'Воспроизвести')}
              </Button>
            ) : (
              <Button
                variant="outlined"
                size="large"
                startIcon={<PauseIcon />}
                onClick={pause}
                sx={{ px: 4, borderRadius: 3, textTransform: 'none' }}
              >
                {isEn ? 'Pause' : 'Пауза'}
              </Button>
            )}
            <IconButton
              onClick={stop}
              disabled={!isPlaying && !isPaused}
              color="error"
              sx={{
                borderRadius: 3,
                width: 48,
                height: 48
              }}
            >
              <StopIcon />
            </IconButton>
          </Box>

          {/* Voice Selector */}
          <Box sx={{ mb: 2 }}>
            <Select
              fullWidth
              size="small"
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              disabled={isPlaying || isPaused}
              sx={{ borderRadius: 3 }}
              displayEmpty
            >
              {voices.length === 0 ? (
                <MenuItem value="" disabled>
                  {isEn ? 'No voices found' : 'Голоса не найдены'}
                </MenuItem>
              ) : (
                voices.map((v) => (
                  <MenuItem key={v.name} value={v.name}>
                    {voiceLabel(v)}
                  </MenuItem>
                ))
              )}
            </Select>
          </Box>

          {/* Sliders */}
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: 'text.secondary' }}>
                {isEn ? 'Speed' : 'Скорость'}: {rate.toFixed(1)}x
              </Typography>
              <Slider
                value={rate}
                onChange={(_, v) => setRate(v as number)}
                min={0.5}
                max={2}
                step={0.1}
                disabled={isPlaying || isPaused}
                valueLabelDisplay="auto"
                valueLabelFormat={(v) => `${v.toFixed(1)}x`}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: 'text.secondary' }}>
                {isEn ? 'Pitch' : 'Тон'}: {pitch.toFixed(1)}
              </Typography>
              <Slider
                value={pitch}
                onChange={(_, v) => setPitch(v as number)}
                min={0}
                max={2}
                step={0.1}
                disabled={isPlaying || isPaused}
                valueLabelDisplay="auto"
                valueLabelFormat={(v) => v.toFixed(1)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: 'text.secondary' }}>
                {isEn ? 'Volume' : 'Громкость'}: {Math.round(volume * 100)}%
              </Typography>
              <Slider
                value={volume}
                onChange={(_, v) => setVolume(v as number)}
                min={0}
                max={1}
                step={0.05}
                disabled={isPlaying || isPaused}
                valueLabelDisplay="auto"
                valueLabelFormat={(v) => `${Math.round(v * 100)}%`}
              />
            </Grid>
          </Grid>

          {/* Info */}
          <Box
            sx={{
              mt: 3,
              px: 1.5,
              py: 1,
              borderRadius: 2,
              backgroundColor: theme.palette.surfaceContainerLow,
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 1
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {isEn ? 'Characters' : 'Символов'}: <strong>{text.length}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isEn ? 'Words' : 'Слов'}: <strong>{text.trim() ? text.trim().split(/\s+/).length : 0}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isEn ? 'Available voices' : 'Доступно голосов'}: <strong>{voices.length}</strong>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
