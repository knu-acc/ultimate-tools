'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Chip,
  alpha,
  useTheme
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import PlaceIcon from '@mui/icons-material/Place';
import { CopyButton, ShareButton } from '@/src/components/CopyButton';


interface Coordinate {
  lat: number;
  lon: number;
}

interface DMS {
  degrees: number;
  minutes: number;
  seconds: number;
  direction: string;
}

interface DDM {
  degrees: number;
  decimalMinutes: number;
  direction: string;
}

interface Preset {
  label: string;
  lat: number;
  lon: number;
}

const PRESETS: Preset[] = [
  { label: 'Москва', lat: 55.7558, lon: 37.6173 },
  { label: 'Лондон', lat: 51.5074, lon: -0.1278 },
  { label: 'Нью-Йорк', lat: 40.7128, lon: -74.006 },
  { label: 'Токио', lat: 35.6762, lon: 139.6503 },
];

function ddToDms(dd: number, isLat: boolean): DMS {
  const dir = isLat ? (dd >= 0 ? 'N' : 'S') : (dd >= 0 ? 'E' : 'W');
  const abs = Math.abs(dd);
  const degrees = Math.floor(abs);
  const minFloat = (abs - degrees) * 60;
  const minutes = Math.floor(minFloat);
  const seconds = parseFloat(((minFloat - minutes) * 60).toFixed(4));
  return { degrees, minutes, seconds, direction: dir };
}

function ddToDdm(dd: number, isLat: boolean): DDM {
  const dir = isLat ? (dd >= 0 ? 'N' : 'S') : (dd >= 0 ? 'E' : 'W');
  const abs = Math.abs(dd);
  const degrees = Math.floor(abs);
  const decimalMinutes = parseFloat(((abs - degrees) * 60).toFixed(6));
  return { degrees, decimalMinutes, direction: dir };
}

function dmsToString(dms: DMS): string {
  return `${dms.degrees}\u00B0 ${dms.minutes}' ${dms.seconds}" ${dms.direction}`;
}

function ddmToString(ddm: DDM): string {
  return `${ddm.degrees}\u00B0 ${ddm.decimalMinutes}' ${ddm.direction}`;
}

function formatDD(val: number): string {
  return val.toFixed(6);
}

export default function CoordinateConverter() {
  const theme = useTheme();
  const [latInput, setLatInput] = useState('55.7558');
  const [lonInput, setLonInput] = useState('37.6173');
  const [copied, setCopied] = useState('');

  const lat = parseFloat(latInput);
  const lon = parseFloat(lonInput);

  const isValid = useMemo(() => {
    if (isNaN(lat) || isNaN(lon)) return false;
    return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
  }, [lat, lon]);

  const latDms = useMemo(() => (isValid ? ddToDms(lat, true) : null), [lat, isValid]);
  const lonDms = useMemo(() => (isValid ? ddToDms(lon, false) : null), [lon, isValid]);
  const latDdm = useMemo(() => (isValid ? ddToDdm(lat, true) : null), [lat, isValid]);
  const lonDdm = useMemo(() => (isValid ? ddToDdm(lon, false) : null), [lon, isValid]);

  const ddString = isValid ? `${formatDD(lat)}, ${formatDD(lon)}` : '';
  const dmsString = latDms && lonDms ? `${dmsToString(latDms)}, ${dmsToString(lonDms)}` : '';
  const ddmString = latDdm && lonDdm ? `${ddmToString(latDdm)}, ${ddmToString(lonDdm)}` : '';

  const copy = useCallback((text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 1500);
  }, []);

  const applyPreset = (preset: Preset) => {
    setLatInput(preset.lat.toString());
    setLonInput(preset.lon.toString());
  };

  const latError = latInput && (isNaN(parseFloat(latInput)) || parseFloat(latInput) < -90 || parseFloat(latInput) > 90);
  const lonError = lonInput && (isNaN(parseFloat(lonInput)) || parseFloat(lonInput) < -180 || parseFloat(lonInput) > 180);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Input */}
      <Paper
        elevation={0}
        sx={{ p: 3, mb: 3, borderRadius: 3 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <MyLocationIcon color="primary" fontSize="small" />
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            Введите координаты (десятичные градусы)
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Широта (Latitude)"
              value={latInput}
              onChange={(e) => setLatInput(e.target.value)}
              fullWidth
              size="small"
              error={!!latError}
              helperText={latError ? 'Диапазон: -90 до 90' : ' '}
              placeholder="-90 ... 90"
              slotProps={{
                input: {
                  sx: { fontFamily: 'monospace' }
                }
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Долгота (Longitude)"
              value={lonInput}
              onChange={(e) => setLonInput(e.target.value)}
              fullWidth
              size="small"
              error={!!lonError}
              helperText={lonError ? 'Диапазон: -180 до 180' : ' '}
              placeholder="-180 ... 180"
              slotProps={{
                input: {
                  sx: { fontFamily: 'monospace' }
                }
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Quick presets */}
      <Paper
        elevation={0}
        sx={{ p: 2, mb: 3, borderRadius: 3 }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5 }}>
          Быстрый выбор
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {PRESETS.map((p) => (
            <Chip
              key={p.label}
              label={p.label}
              icon={<PlaceIcon />}
              onClick={() => applyPreset(p)}
              variant="outlined"
              sx={{ cursor: 'pointer' }}
            />
          ))}
        </Box>
      </Paper>

      {/* Results */}
      {isValid && (
        <Grid container spacing={2}>
          {/* DD */}
          <Grid size={{ xs: 12 }}>
            <Paper
              elevation={0}
              sx={{ p: 2.5, borderRadius: 3 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  DD (Десятичные градусы)
                </Typography>
                <Button
                  size="small"
                  startIcon={<ContentCopyIcon />}
                  onClick={() => copy(ddString, 'dd')}
                  color={copied === 'dd' ? 'success' : 'primary'}
                >
                  {copied === 'dd' ? 'Скопировано' : 'Копировать'}
                </Button>
              </Box>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: 'monospace',
                  fontSize: 16,
                  p: 1.5,
                  backgroundColor: alpha(theme.palette.background.default, 0.5),
                  borderRadius: 2
                }}
              >
                {ddString}
              </Typography>
            </Paper>
          </Grid>

          {/* DMS */}
          <Grid size={{ xs: 12 }}>
            <Paper
              elevation={0}
              sx={{ p: 2.5, borderRadius: 3 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  DMS (Градусы, минуты, секунды)
                </Typography>
                <Button
                  size="small"
                  startIcon={<ContentCopyIcon />}
                  onClick={() => copy(dmsString, 'dms')}
                  color={copied === 'dms' ? 'success' : 'primary'}
                >
                  {copied === 'dms' ? 'Скопировано' : 'Копировать'}
                </Button>
              </Box>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: 'monospace',
                  fontSize: 16,
                  p: 1.5,
                  backgroundColor: alpha(theme.palette.background.default, 0.5),
                  borderRadius: 2
                }}
              >
                {dmsString}
              </Typography>
            </Paper>
          </Grid>

          {/* DDM */}
          <Grid size={{ xs: 12 }}>
            <Paper
              elevation={0}
              sx={{ p: 2.5, borderRadius: 3 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  DDM (Градусы, десятичные минуты)
                </Typography>
                <Button
                  size="small"
                  startIcon={<ContentCopyIcon />}
                  onClick={() => copy(ddmString, 'ddm')}
                  color={copied === 'ddm' ? 'success' : 'primary'}
                >
                  {copied === 'ddm' ? 'Скопировано' : 'Копировать'}
                </Button>
              </Box>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: 'monospace',
                  fontSize: 16,
                  p: 1.5,
                  backgroundColor: alpha(theme.palette.background.default, 0.5),
                  borderRadius: 2
                }}
              >
                {ddmString}
              </Typography>
            </Paper>
          </Grid>

          {/* Detail breakdown */}
          <Grid size={{ xs: 12 }}>
            <Paper
              elevation={0}
              sx={{ p: 2, borderRadius: 3 }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
                Подробная информация
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Широта
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">Десятичные градусы:</Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{formatDD(lat)}</Typography>
                    </Box>
                    {latDms && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">Градусы:</Typography>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{latDms.degrees}°</Typography>
                      </Box>
                    )}
                    {latDms && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">Минуты:</Typography>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{latDms.minutes}'</Typography>
                      </Box>
                    )}
                    {latDms && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">Секунды:</Typography>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{latDms.seconds}"</Typography>
                      </Box>
                    )}
                    {latDms && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">Направление:</Typography>
                        <Chip label={latDms.direction === 'N' ? 'Северная' : 'Южная'} size="small" variant="outlined" />
                      </Box>
                    )}
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Долгота
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">Десятичные градусы:</Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{formatDD(lon)}</Typography>
                    </Box>
                    {lonDms && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">Градусы:</Typography>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{lonDms.degrees}°</Typography>
                      </Box>
                    )}
                    {lonDms && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">Минуты:</Typography>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{lonDms.minutes}'</Typography>
                      </Box>
                    )}
                    {lonDms && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">Секунды:</Typography>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{lonDms.seconds}"</Typography>
                      </Box>
                    )}
                    {lonDms && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">Направление:</Typography>
                        <Chip label={lonDms.direction === 'E' ? 'Восточная' : 'Западная'} size="small" variant="outlined" />
                      </Box>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}

      {!isValid && (latInput || lonInput) && (
        <Paper
          elevation={0}
          sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}
        >
          <Typography variant="body2" color="text.secondary">
            Введите корректные координаты для конвертации
          </Typography>
        </Paper>
      )}
    </Box>
  );
}
