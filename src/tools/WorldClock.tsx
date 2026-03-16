'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Grid,
  Chip,
  IconButton,
  useTheme,
  alpha
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useLanguage } from '@/src/i18n/LanguageContext';

interface CityInfo {
  name: string;
  offset: number;
}

interface CityData {
  nameRu: string;
  nameEn: string;
  offset: number;
}

const ALL_CITIES_DATA: CityData[] = [
  { nameRu: 'Москва', nameEn: 'Moscow', offset: 3 },
  { nameRu: 'Лондон', nameEn: 'London', offset: 0 },
  { nameRu: 'Нью-Йорк', nameEn: 'New York', offset: -5 },
  { nameRu: 'Токио', nameEn: 'Tokyo', offset: 9 },
  { nameRu: 'Сидней', nameEn: 'Sydney', offset: 11 },
  { nameRu: 'Берлин', nameEn: 'Berlin', offset: 1 },
  { nameRu: 'Дубай', nameEn: 'Dubai', offset: 4 },
  { nameRu: 'Пекин', nameEn: 'Beijing', offset: 8 },
  { nameRu: 'Лос-Анджелес', nameEn: 'Los Angeles', offset: -8 },
  { nameRu: 'Стамбул', nameEn: 'Istanbul', offset: 3 },
  { nameRu: 'Сингапур', nameEn: 'Singapore', offset: 8 },
  { nameRu: 'Мумбаи', nameEn: 'Mumbai', offset: 5.5 },
];

function getTimeForOffset(offset: number): Date {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + offset * 3600000);
}

function formatTime(date: Date, isEn: boolean): string {
  return date.toLocaleTimeString(isEn ? 'en-US' : 'ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
}

function formatDate(date: Date, isEn: boolean): string {
  if (isEn) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }
  const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
  const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function isDaytime(hour: number): boolean {
  return hour >= 6 && hour < 21;
}

function formatOffset(offset: number): string {
  const sign = offset >= 0 ? '+' : '';
  if (offset % 1 === 0) return `UTC${sign}${offset}`;
  const h = Math.trunc(offset);
  const m = Math.abs(offset % 1) * 60;
  return `UTC${sign}${h}:${String(m).padStart(2, '0')}`;
}

export default function WorldClock() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';

  const ALL_CITIES: CityInfo[] = ALL_CITIES_DATA.map(c => ({
    name: isEn ? c.nameEn : c.nameRu,
    offset: c.offset
  }));

  const defaultCitiesRu = ['Москва', 'Лондон', 'Нью-Йорк', 'Токио', 'Дубай', 'Пекин'];
  const defaultCitiesEn = ['Moscow', 'London', 'New York', 'Tokyo', 'Dubai', 'Beijing'];
  const [selected, setSelected] = useState<string[]>(isEn ? defaultCitiesEn : defaultCitiesRu);
  const [search, setSearch] = useState('');
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const selectedCities = ALL_CITIES.filter((c) => selected.includes(c.name));
  const availableCities = ALL_CITIES.filter(
    (c) => !selected.includes(c.name) && c.name.toLowerCase().includes(search.toLowerCase())
  );

  const removeCity = (name: string) => {
    setSelected((prev) => prev.filter((n) => n !== name));
  };

  const addCity = (name: string) => {
    setSelected((prev) => [...prev, name]);
    setSearch('');
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Box
        sx={{
          p: { xs: 1, md: 0 },
        }}
      >
        {/* Search and add */}
        <Box sx={{ mb: 2 }}>
          <TextField
            placeholder={isEn ? 'Search city...' : 'Поиск города...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
            size="small"
            slotProps={{
              htmlInput: { autoComplete: 'off' }
            }}
          />
          {search && availableCities.length > 0 && (
            <Paper
              elevation={2}
              sx={{
                borderRadius: 18,
                mt: 1,
                p: 1,
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                bgcolor: theme.palette.surfaceContainerHigh,
              }}
            >
              {availableCities.map((city) => (
                <Chip
                  key={city.name}
                  label={`${city.name} (${formatOffset(city.offset)})`}
                  icon={<AddIcon />}
                  variant="outlined"
                  clickable
                  onClick={() => addCity(city.name)}
                />
              ))}
            </Paper>
          )}
          {search && availableCities.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {isEn ? 'City not found' : 'Город не найден'}
            </Typography>
          )}
        </Box>

        {/* Clock Grid */}
        <Grid container spacing={2}>
          {selectedCities.map((city) => {
            const time = getTimeForOffset(city.offset);
            const hour = time.getHours();
            const isDay = isDaytime(hour);

            return (
              <Grid key={city.name} size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper
                  elevation={1}
                  sx={{
                    borderRadius: 18,
                    p: 2,
                    position: 'relative',
                    backgroundColor: isDay
                      ? alpha(theme.palette.warning.main, 0.04)
                      : alpha(theme.palette.info.main, 0.06),
                    transition: `all 250ms cubic-bezier(0.2, 0, 0, 1)`,
                    '&:hover': {
                      backgroundColor: isDay
                        ? alpha(theme.palette.warning.main, 0.08)
                        : alpha(theme.palette.info.main, 0.1),
                    },
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => removeCity(city.name)}
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    {isDay ? (
                      <LightModeIcon sx={{ color: 'warning.main', fontSize: 20 }} />
                    ) : (
                      <DarkModeIcon sx={{ color: 'info.main', fontSize: 20 }} />
                    )}
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {city.name}
                    </Typography>
                  </Box>

                  <Chip
                    label={formatOffset(city.offset)}
                    size="small"
                    variant="outlined"
                    sx={{ mb: 1.5 }}
                  />

                  <Typography
                    sx={{
                      fontFamily: 'monospace',
                      fontSize: '2rem',
                      fontWeight: 300,
                      letterSpacing: 2,
                      color: 'text.primary'
                    }}
                  >
                    {formatTime(time, isEn)}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {formatDate(time, isEn)}
                  </Typography>

                  <Chip
                    label={isDay ? (isEn ? 'Day' : 'День') : (isEn ? 'Night' : 'Ночь')}
                    size="small"
                    sx={{
                      mt: 1,
                      backgroundColor: isDay
                        ? alpha(theme.palette.warning.main, 0.15)
                        : alpha(theme.palette.info.main, 0.15),
                      color: isDay
                        ? theme.palette.mode === 'dark' ? theme.palette.warning.main : theme.palette.warning.dark
                        : theme.palette.mode === 'dark' ? theme.palette.info.main : theme.palette.info.dark
                    }}
                  />
                </Paper>
              </Grid>
            );
          })}
        </Grid>

        {selectedCities.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">
              {isEn ? 'Add cities using the search above' : 'Добавьте города через поиск выше'}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
