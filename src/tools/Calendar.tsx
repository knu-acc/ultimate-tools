'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  IconButton,
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TodayIcon from '@mui/icons-material/Today';
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';
import GridViewIcon from '@mui/icons-material/GridView';
import { useLanguage } from '@/src/i18n/LanguageContext';

const WEEKDAYS_RU = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const WEEKDAYS_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS_RU = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];
const MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const MONTHS_SHORT_RU = [
  'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
  'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек',
];
const MONTHS_SHORT_EN = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

interface Holiday {
  month: number;
  day: number;
  nameRu: string;
  nameEn: string;
}

const HOLIDAYS: Holiday[] = [
  { month: 1, day: 1, nameRu: 'Новый год', nameEn: 'New Year' },
  { month: 2, day: 23, nameRu: 'День защитника Отечества', nameEn: 'Defender of the Fatherland Day' },
  { month: 3, day: 8, nameRu: 'Международный женский день', nameEn: 'International Women\'s Day' },
  { month: 5, day: 1, nameRu: 'Праздник Весны и Труда', nameEn: 'Spring and Labour Day' },
  { month: 5, day: 9, nameRu: 'День Победы', nameEn: 'Victory Day' },
  { month: 6, day: 12, nameRu: 'День России', nameEn: 'Russia Day' },
  { month: 11, day: 4, nameRu: 'День народного единства', nameEn: 'Unity Day' },
  { month: 12, day: 31, nameRu: 'Канун Нового года', nameEn: 'New Year\'s Eve' },
];

function getHoliday(month: number, day: number): Holiday | undefined {
  return HOLIDAYS.find((h) => h.month === month + 1 && h.day === day);
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Monday = 0
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}

function getISOWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function daysBetween(a: Date, b: Date): number {
  const aDate = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const bDate = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((bDate.getTime() - aDate.getTime()) / 86400000);
}

export default function Calendar() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const WEEKDAYS = isEn ? WEEKDAYS_EN : WEEKDAYS_RU;
  const MONTHS = isEn ? MONTHS_EN : MONTHS_RU;
  const MONTHS_SHORT = isEn ? MONTHS_SHORT_EN : MONTHS_SHORT_RU;
  const holidayName = (h: Holiday) => isEn ? h.nameEn : h.nameRu;
  // Use stable initial values for SSR, then sync on mount to avoid hydration mismatch
  const [today, setToday] = useState(() => new Date(2024, 0, 1));
  const [year, setYear] = useState(2024);
  const [month, setMonth] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [yearView, setYearView] = useState(false);

  useEffect(() => {
    const now = new Date();
    setToday(now);
    setYear(now.getFullYear());
    setMonth(now.getMonth());
  }, []);

  const goToToday = () => {
    const now = new Date();
    setYear(now.getFullYear());
    setMonth(now.getMonth());
    setSelectedDate(null);
    setYearView(false);
  };

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  };

  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  };

  const isToday = (d: number, m: number, y: number) =>
    d === today.getDate() && m === today.getMonth() && y === today.getFullYear();

  const isSelected = (d: number, m: number, y: number) =>
    selectedDate !== null &&
    d === selectedDate.getDate() &&
    m === selectedDate.getMonth() &&
    y === selectedDate.getFullYear();

  const renderMonthGrid = (m: number, y: number, compact = false) => {
    const daysInMonth = getDaysInMonth(y, m);
    const firstDay = getFirstDayOfWeek(y, m);
    const cells: (number | null)[] = [];

    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);

    const cellSize = compact ? 28 : 40;
    const fontSize = compact ? '0.7rem' : '0.875rem';

    return (
      <Box>
        {/* Weekday header */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0 }}>
          {WEEKDAYS.map((wd) => (
            <Box key={wd} sx={{ textAlign: 'center', py: compact ? 0.25 : 0.5 }}>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  fontSize: compact ? '0.6rem' : '0.75rem',
                  color: 'text.secondary'
                }}
              >
                {wd}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Days */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0 }}>
          {cells.map((day, idx) => {
            if (day === null) {
              return <Box key={`empty-${idx}`} sx={{ height: cellSize }} />;
            }

            const holiday = getHoliday(m, day);
            const todayMatch = isToday(day, m, y);
            const selectedMatch = isSelected(day, m, y);
            const dayOfWeek = (firstDay + day - 1) % 7;
            const isWeekend = dayOfWeek >= 5;

            return (
              <Box
                key={day}
                onClick={() => {
                  setSelectedDate(new Date(y, m, day));
                  if (yearView) {
                    setMonth(m);
                    setYearView(false);
                  }
                }}
                sx={{
                  height: cellSize,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  borderRadius: '50%',
                  position: 'relative',
                  backgroundColor: selectedMatch
                    ? 'primary.main'
                    : todayMatch
                      ? theme.palette.surfaceContainerHigh
                      : 'transparent',
                  '&:hover': {
                    backgroundColor: selectedMatch
                      ? 'primary.dark'
                      : alpha(theme.palette.primary.main, 0.04)
                  },
                  transitionProperty: 'background-color', transitionDuration: '150ms'
                }}
              >
                <Typography
                  sx={{
                    fontSize,
                    fontWeight: todayMatch || selectedMatch ? 700 : 400,
                    color: selectedMatch
                      ? 'primary.contrastText'
                      : holiday
                        ? 'error.main'
                        : isWeekend
                          ? 'error.light'
                          : 'text.primary'
                  }}
                >
                  {day}
                </Typography>
                {holiday && !compact && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 2,
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      backgroundColor: selectedMatch ? 'primary.contrastText' : 'error.main'
                    }}
                  />
                )}
              </Box>
            );
          })}
        </Box>
      </Box>
    );
  };

  // Selected date info
  const renderSelectedInfo = () => {
    if (!selectedDate) return null;

    const dayOfYear = getDayOfYear(selectedDate);
    const weekNumber = getISOWeekNumber(selectedDate);
    const diff = daysBetween(today, selectedDate);
    const holiday = getHoliday(selectedDate.getMonth(), selectedDate.getDate());

    let diffText = isEn ? 'Today' : 'Сегодня';
    if (diff > 0) diffText = isEn ? `in ${diff} days` : `через ${diff} дн.`;
    else if (diff < 0) diffText = isEn ? `${Math.abs(diff)} days ago` : `${Math.abs(diff)} дн. назад`;

    return (
      <Paper
        elevation={0}
        sx={{
          borderRadius: 18,
          p: 2,
          mt: 2,
          backgroundColor: theme.palette.surfaceContainerLow
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
          {selectedDate.getDate()} {MONTHS[selectedDate.getMonth()]} {selectedDate.getFullYear()}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Chip label={isEn ? `Day of year: ${dayOfYear}` : `День года: ${dayOfYear}`} size="small" variant="outlined" />
          <Chip label={isEn ? `Week: ${weekNumber}` : `Неделя: ${weekNumber}`} size="small" variant="outlined" />
          <Chip
            label={diffText}
            size="small"
            color={diff === 0 ? 'primary' : diff > 0 ? 'info' : 'default'}
          />
          {holiday && (
            <Chip label={holidayName(holiday)} size="small" color="error" />
          )}
        </Box>
      </Paper>
    );
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 18,
          p: { xs: 2, sm: 3 }
        }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {!yearView && (
              <>
                <IconButton onClick={prevMonth} size="small">
                  <ChevronLeftIcon />
                </IconButton>
                <Typography variant="h6" sx={{ fontWeight: 600, minWidth: 200, textAlign: 'center' }}>
                  {MONTHS[month]} {year}
                </Typography>
                <IconButton onClick={nextMonth} size="small">
                  <ChevronRightIcon />
                </IconButton>
              </>
            )}
            {yearView && (
              <>
                <IconButton onClick={() => setYear(year - 1)} size="small">
                  <ChevronLeftIcon />
                </IconButton>
                <Typography variant="h6" sx={{ fontWeight: 600, minWidth: 100, textAlign: 'center' }}>
                  {year}
                </Typography>
                <IconButton onClick={() => setYear(year + 1)} size="small">
                  <ChevronRightIcon />
                </IconButton>
              </>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<TodayIcon />}
              onClick={goToToday}
            >
              {isEn ? 'Today' : 'Сегодня'}
            </Button>
            <IconButton
              onClick={() => setYearView(!yearView)}
              sx={{
                borderRadius: 10
              }}
            >
              {yearView ? <CalendarViewMonthIcon /> : <GridViewIcon />}
            </IconButton>
          </Box>
        </Box>

        {/* Holidays legend */}
        {!yearView && (
          <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {HOLIDAYS.filter((h) => h.month === month + 1).map((h) => (
              <Chip
                key={`${h.month}-${h.day}`}
                label={`${h.day}: ${holidayName(h)}`}
                size="small"
                color="error"
                variant="outlined"
              />
            ))}
          </Box>
        )}

        {/* Month view */}
        {!yearView && renderMonthGrid(month, year)}

        {/* Year view */}
        {yearView && (
          <Grid container spacing={2}>
            {Array.from({ length: 12 }, (_, m) => (
              <Grid key={m} size={{ xs: 6, sm: 4, md: 3 }}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 10,
                    p: 1,
                    cursor: 'pointer',
                    backgroundColor: m === today.getMonth() && year === today.getFullYear()
                      ? theme.palette.surfaceContainerLow
                      : 'transparent',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.04)
                    }
                  }}
                  onClick={() => {
                    setMonth(m);
                    setYearView(false);
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      mb: 0.5,
                      textAlign: 'center',
                      color: m === today.getMonth() && year === today.getFullYear()
                        ? 'primary.main'
                        : 'text.primary'
                    }}
                  >
                    {MONTHS_SHORT[m]}
                  </Typography>
                  {renderMonthGrid(m, year, true)}
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Selected date info */}
        {renderSelectedInfo()}
      </Paper>
    </Box>
  );
}
