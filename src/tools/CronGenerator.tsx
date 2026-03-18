'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Grid,
  Chip,
  MenuItem,
  useTheme,
  alpha
} from '@mui/material';
import { CopyButton } from '@/src/components/CopyButton';
import { useLanguage } from '@/src/i18n/LanguageContext';


interface CronState {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
}

interface Preset {
  label: string;
  labelEn: string;
  cron: CronState;
  description: string;
  descriptionEn: string;
}

const presets: Preset[] = [
  {
    label: 'Каждую минуту',
    labelEn: 'Every minute',
    cron: { minute: '*', hour: '*', dayOfMonth: '*', month: '*', dayOfWeek: '*' },
    description: 'Выполняется каждую минуту',
    descriptionEn: 'Runs every minute',
  },
  {
    label: 'Каждый час',
    labelEn: 'Every hour',
    cron: { minute: '0', hour: '*', dayOfMonth: '*', month: '*', dayOfWeek: '*' },
    description: 'Выполняется в начале каждого часа',
    descriptionEn: 'Runs at the start of every hour',
  },
  {
    label: 'Ежедневно (полночь)',
    labelEn: 'Daily (midnight)',
    cron: { minute: '0', hour: '0', dayOfMonth: '*', month: '*', dayOfWeek: '*' },
    description: 'Выполняется каждый день в полночь',
    descriptionEn: 'Runs every day at midnight',
  },
  {
    label: 'Ежедневно (9:00)',
    labelEn: 'Daily (9:00)',
    cron: { minute: '0', hour: '9', dayOfMonth: '*', month: '*', dayOfWeek: '*' },
    description: 'Выполняется каждый день в 9:00',
    descriptionEn: 'Runs every day at 9:00 AM',
  },
  {
    label: 'Еженедельно (пн)',
    labelEn: 'Weekly (Mon)',
    cron: { minute: '0', hour: '0', dayOfMonth: '*', month: '*', dayOfWeek: '1' },
    description: 'Выполняется каждый понедельник в полночь',
    descriptionEn: 'Runs every Monday at midnight',
  },
  {
    label: 'Ежемесячно',
    labelEn: 'Monthly',
    cron: { minute: '0', hour: '0', dayOfMonth: '1', month: '*', dayOfWeek: '*' },
    description: 'Выполняется 1-го числа каждого месяца в полночь',
    descriptionEn: 'Runs on the 1st of every month at midnight',
  },
  {
    label: 'Каждые 5 минут',
    labelEn: 'Every 5 minutes',
    cron: { minute: '*/5', hour: '*', dayOfMonth: '*', month: '*', dayOfWeek: '*' },
    description: 'Выполняется каждые 5 минут',
    descriptionEn: 'Runs every 5 minutes',
  },
  {
    label: 'Каждые 30 минут',
    labelEn: 'Every 30 minutes',
    cron: { minute: '*/30', hour: '*', dayOfMonth: '*', month: '*', dayOfWeek: '*' },
    description: 'Выполняется каждые 30 минут',
    descriptionEn: 'Runs every 30 minutes',
  },
  {
    label: 'Будни (пн-пт, 9:00)',
    labelEn: 'Weekdays (Mon-Fri, 9:00)',
    cron: { minute: '0', hour: '9', dayOfMonth: '*', month: '*', dayOfWeek: '1-5' },
    description: 'Выполняется с понедельника по пятницу в 9:00',
    descriptionEn: 'Runs Monday through Friday at 9:00 AM',
  },
  {
    label: 'Ежегодно',
    labelEn: 'Yearly',
    cron: { minute: '0', hour: '0', dayOfMonth: '1', month: '1', dayOfWeek: '*' },
    description: 'Выполняется 1 января в полночь',
    descriptionEn: 'Runs on January 1st at midnight',
  },
];

const monthNamesRu = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];

const monthNamesEn = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const dayOfWeekNamesRu = [
  'Воскресенье', 'Понедельник', 'Вторник', 'Среда',
  'Четверг', 'Пятница', 'Суббота',
];

const dayOfWeekNamesEn = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday',
  'Thursday', 'Friday', 'Saturday',
];

function getMinuteOptions(isEn: boolean) {
  return [
    { value: '*', label: isEn ? 'Every (*)' : 'Каждую (*)' },
    { value: '*/5', label: isEn ? 'Every 5 min' : 'Каждые 5 мин' },
    { value: '*/10', label: isEn ? 'Every 10 min' : 'Каждые 10 мин' },
    { value: '*/15', label: isEn ? 'Every 15 min' : 'Каждые 15 мин' },
    { value: '*/30', label: isEn ? 'Every 30 min' : 'Каждые 30 мин' },
    ...Array.from({ length: 60 }, (_, i) => ({ value: String(i), label: String(i) })),
  ];
}

function getHourOptions(isEn: boolean) {
  return [
    { value: '*', label: isEn ? 'Every (*)' : 'Каждый (*)' },
    { value: '*/2', label: isEn ? 'Every 2 h' : 'Каждые 2 ч' },
    { value: '*/4', label: isEn ? 'Every 4 h' : 'Каждые 4 ч' },
    { value: '*/6', label: isEn ? 'Every 6 h' : 'Каждые 6 ч' },
    { value: '*/12', label: isEn ? 'Every 12 h' : 'Каждые 12 ч' },
    ...Array.from({ length: 24 }, (_, i) => ({ value: String(i), label: `${i}:00` })),
  ];
}

function getDayOfMonthOptions(isEn: boolean) {
  return [
    { value: '*', label: isEn ? 'Every (*)' : 'Каждый (*)' },
    { value: '*/2', label: isEn ? 'Every other day' : 'Через день' },
    ...Array.from({ length: 31 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) })),
  ];
}

function getMonthOptions(isEn: boolean) {
  const names = isEn ? monthNamesEn : monthNamesRu;
  return [
    { value: '*', label: isEn ? 'Every (*)' : 'Каждый (*)' },
    ...names.map((name, i) => ({ value: String(i + 1), label: name })),
  ];
}

function getDayOfWeekOptions(isEn: boolean) {
  const names = isEn ? dayOfWeekNamesEn : dayOfWeekNamesRu;
  return [
    { value: '*', label: isEn ? 'Every (*)' : 'Каждый (*)' },
    { value: '1-5', label: isEn ? 'Weekdays (Mon-Fri)' : 'Будни (пн-пт)' },
    { value: '0,6', label: isEn ? 'Weekends (Sat-Sun)' : 'Выходные (сб-вс)' },
    ...names.map((name, i) => ({ value: String(i), label: name })),
  ];
}

function describeCron(cron: CronState, isEn: boolean): string {
  const { minute, hour, dayOfMonth, month, dayOfWeek } = cron;
  const monthNames = isEn ? monthNamesEn : monthNamesRu;
  const dayOfWeekNames = isEn ? dayOfWeekNamesEn : dayOfWeekNamesRu;

  // Check presets first
  for (const preset of presets) {
    if (
      preset.cron.minute === minute &&
      preset.cron.hour === hour &&
      preset.cron.dayOfMonth === dayOfMonth &&
      preset.cron.month === month &&
      preset.cron.dayOfWeek === dayOfWeek
    ) {
      return isEn ? preset.descriptionEn : preset.description;
    }
  }

  const parts: string[] = [];

  // Minute description
  if (minute === '*') {
    parts.push(isEn ? 'every minute' : 'каждую минуту');
  } else if (minute.startsWith('*/')) {
    parts.push(isEn ? `every ${minute.slice(2)} min` : `каждые ${minute.slice(2)} мин.`);
  } else {
    parts.push(isEn ? `at minute ${minute}` : `в ${minute} мин.`);
  }

  // Hour description
  if (hour === '*') {
    parts.push(isEn ? 'every hour' : 'каждый час');
  } else if (hour.startsWith('*/')) {
    parts.push(isEn ? `every ${hour.slice(2)} h` : `каждые ${hour.slice(2)} ч.`);
  } else {
    parts.push(isEn ? `at ${hour}:00` : `в ${hour}:00`);
  }

  // Day of month
  if (dayOfMonth !== '*') {
    if (dayOfMonth.startsWith('*/')) {
      parts.push(isEn ? `every ${dayOfMonth.slice(2)} days` : `каждые ${dayOfMonth.slice(2)} дн.`);
    } else {
      parts.push(isEn ? `on day ${dayOfMonth}` : `${dayOfMonth}-го числа`);
    }
  }

  // Month
  if (month !== '*') {
    const mIdx = parseInt(month) - 1;
    if (mIdx >= 0 && mIdx < 12) {
      parts.push(isEn ? `in ${monthNames[mIdx]}` : `в ${monthNames[mIdx].toLowerCase()}`);
    } else {
      parts.push(isEn ? `month: ${month}` : `месяц: ${month}`);
    }
  }

  // Day of week
  if (dayOfWeek !== '*') {
    if (dayOfWeek === '1-5') {
      parts.push(isEn ? 'on weekdays (Mon-Fri)' : 'по будням (пн-пт)');
    } else if (dayOfWeek === '0,6') {
      parts.push(isEn ? 'on weekends (Sat-Sun)' : 'по выходным (сб-вс)');
    } else {
      const dIdx = parseInt(dayOfWeek);
      if (dIdx >= 0 && dIdx < 7) {
        parts.push(isEn ? `on ${dayOfWeekNames[dIdx]}` : `по ${dayOfWeekNames[dIdx].toLowerCase()}м`);
      } else {
        parts.push(isEn ? `day of week: ${dayOfWeek}` : `день недели: ${dayOfWeek}`);
      }
    }
  }

  return parts.join(', ');
}

export default function CronGenerator() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const [cron, setCron] = useState<CronState>({
    minute: '0',
    hour: '*',
    dayOfMonth: '*',
    month: '*',
    dayOfWeek: '*'
  });
  const minuteOptions = useMemo(() => getMinuteOptions(isEn), [isEn]);
  const hourOptions = useMemo(() => getHourOptions(isEn), [isEn]);
  const dayOfMonthOptions = useMemo(() => getDayOfMonthOptions(isEn), [isEn]);
  const monthOptions = useMemo(() => getMonthOptions(isEn), [isEn]);
  const dayOfWeekOptions = useMemo(() => getDayOfWeekOptions(isEn), [isEn]);

  const cronExpression = useMemo(() => {
    return `${cron.minute} ${cron.hour} ${cron.dayOfMonth} ${cron.month} ${cron.dayOfWeek}`;
  }, [cron]);

  const description = useMemo(() => describeCron(cron, isEn), [cron, isEn]);

  const updateField = (field: keyof CronState, value: string) => {
    setCron((prev) => ({ ...prev, [field]: value }));
  };

  const applyPreset = (preset: Preset) => {
    setCron({ ...preset.cron });
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 18,
          background: theme.palette.surfaceContainerLow
        }}
      >
        {/* Presets */}
        <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 600, color: 'text.secondary' }}>
          {isEn ? 'Templates' : 'Шаблоны'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          {presets.map((preset) => (
            <Chip
              key={preset.label}
              label={isEn ? preset.labelEn : preset.label}
              onClick={() => applyPreset(preset)}
              variant="outlined"
              sx={{
                cursor: 'pointer',
                fontSize: '0.8rem',
                '&:hover': {
                  background: theme.palette.surfaceContainerHigh,
                  borderColor: theme.palette.primary.main
                }
              }}
            />
          ))}
        </Box>

        {/* Dropdowns */}
        <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 600, color: 'text.secondary' }}>
          {isEn ? 'Configuration' : 'Настройка'}
        </Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <TextField
              select
              fullWidth
              label={isEn ? 'Minute' : 'Минута'}
              value={cron.minute}
              onChange={(e) => updateField('minute', e.target.value)}
              size="small"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 10 } }}
            >
              {minuteOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <TextField
              select
              fullWidth
              label={isEn ? 'Hour' : 'Час'}
              value={cron.hour}
              onChange={(e) => updateField('hour', e.target.value)}
              size="small"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 10 } }}
            >
              {hourOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <TextField
              select
              fullWidth
              label={isEn ? 'Day of month' : 'День месяца'}
              value={cron.dayOfMonth}
              onChange={(e) => updateField('dayOfMonth', e.target.value)}
              size="small"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 10 } }}
            >
              {dayOfMonthOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <TextField
              select
              fullWidth
              label={isEn ? 'Month' : 'Месяц'}
              value={cron.month}
              onChange={(e) => updateField('month', e.target.value)}
              size="small"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 10 } }}
            >
              {monthOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <TextField
              select
              fullWidth
              label={isEn ? 'Day of week' : 'День недели'}
              value={cron.dayOfWeek}
              onChange={(e) => updateField('dayOfWeek', e.target.value)}
              size="small"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 10 } }}
            >
              {dayOfWeekOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        {/* Cron expression result */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            mb: 2.5,
            borderRadius: 10,
            background: theme.palette.mode === 'dark'
              ? alpha(theme.palette.common.black, 0.3)
              : alpha(theme.palette.grey[50], 1),
            textAlign: 'center'
          }}
        >
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
            {isEn ? 'Cron Expression' : 'Cron-выражение'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
            <Typography
              variant="h5"
              sx={{
                fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
                fontWeight: 700,
                letterSpacing: 2,
                color: theme.palette.primary.main
              }}
            >
              {cronExpression}
            </Typography>
            <CopyButton text={cronExpression} />
          </Box>
        </Paper>

        {/* Field labels */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 1,
            mb: 2.5,
            flexWrap: 'wrap'
          }}
        >
          {[
            { label: isEn ? 'Minute' : 'Минута', value: cron.minute },
            { label: isEn ? 'Hour' : 'Час', value: cron.hour },
            { label: isEn ? 'Day' : 'День', value: cron.dayOfMonth },
            { label: isEn ? 'Month' : 'Месяц', value: cron.month },
            { label: isEn ? 'Weekday' : 'День нед.', value: cron.dayOfWeek },
          ].map((item) => (
            <Chip
              key={item.label}
              size="small"
              label={`${item.label}: ${item.value}`}
              variant="outlined"
              sx={{ fontSize: '0.75rem', fontFamily: 'monospace' }}
            />
          ))}
        </Box>

        {/* Description */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            borderRadius: 10,
            background: theme.palette.surfaceContainerLow
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary', mb: 0.5 }}>
            {isEn ? 'Description' : 'Описание'}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {description}
          </Typography>
        </Paper>

        {/* Manual input */}
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="* * * * *"
              sx={{
                '& .MuiInputBase-root': {
                  fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
                  fontSize: '0.9rem'
                },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 10
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const val = (e.target as HTMLInputElement).value.trim();
                  const parts = val.split(/\s+/);
                  if (parts.length === 5) {
                    setCron({
                      minute: parts[0],
                      hour: parts[1],
                      dayOfMonth: parts[2],
                      month: parts[3],
                      dayOfWeek: parts[4]
                    });
                  }
                }
              }}
            />
            <Button
              variant="contained"
              onClick={() => {
                const el = document.querySelector<HTMLInputElement>(
                  'input[placeholder="* * * * *"]'
                );
                if (el) {
                  const parts = el.value.trim().split(/\s+/);
                  if (parts.length === 5) {
                    setCron({
                      minute: parts[0],
                      hour: parts[1],
                      dayOfMonth: parts[2],
                      month: parts[3],
                      dayOfWeek: parts[4]
                    });
                  }
                }
              }}
              sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 10, px: 3, whiteSpace: 'nowrap' }}
            >
              {isEn ? 'Apply' : 'Применить'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
