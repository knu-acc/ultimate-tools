'use client';

import { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Grid,
  Button,
  IconButton,
  Slider,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
  alpha
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { CopyButton } from '@/src/components/CopyButton';

type FieldType = 'firstName' | 'lastName' | 'email' | 'phone' | 'number' | 'boolean' | 'date' | 'uuid' | 'city' | 'country' | 'company';

interface FieldDef {
  id: number;
  name: string;
  type: FieldType;
  min?: number;
  max?: number;
}

const FIRST_NAMES = [
  'Александр', 'Мария', 'Дмитрий', 'Анна', 'Сергей', 'Елена', 'Андрей', 'Ольга',
  'Иван', 'Наталья', 'Михаил', 'Екатерина', 'Алексей', 'Татьяна', 'Николай',
  'Светлана', 'Павел', 'Ирина', 'Владимир', 'Юлия', 'Артём', 'Валерия',
  'Максим', 'Полина', 'Роман', 'Дарья', 'Кирилл', 'Виктория', 'Евгений', 'Ксения',
];

const LAST_NAMES = [
  'Иванов', 'Смирнов', 'Кузнецов', 'Попов', 'Васильев', 'Петров', 'Соколов',
  'Михайлов', 'Новиков', 'Фёдоров', 'Морозов', 'Волков', 'Алексеев', 'Лебедев',
  'Семёнов', 'Егоров', 'Павлов', 'Козлов', 'Степанов', 'Николаев', 'Орлов',
  'Андреев', 'Макаров', 'Никитин', 'Захаров',
];

const CITIES = [
  'Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань',
  'Нижний Новгород', 'Челябинск', 'Самара', 'Омск', 'Ростов-на-Дону',
  'Уфа', 'Красноярск', 'Воронеж', 'Пермь', 'Волгоград',
  'Краснодар', 'Саратов', 'Тюмень', 'Тольятти', 'Ижевск',
];

const COUNTRIES = [
  'Россия', 'США', 'Китай', 'Германия', 'Франция', 'Великобритания',
  'Япония', 'Канада', 'Бразилия', 'Австралия', 'Индия', 'Италия',
  'Испания', 'Южная Корея', 'Мексика', 'Нидерланды', 'Швейцария',
  'Турция', 'Швеция', 'Польша',
];

const COMPANIES = [
  'ТехноСофт', 'МедиаГрупп', 'АльфаСтрой', 'ДатаЛаб', 'ИнноТех',
  'ГлобалТрейд', 'СмартСервис', 'ВебСтудия', 'КлаудСистемс', 'ФинТек',
  'БизнесКонсалт', 'ЭкоПроект', 'ЛогистикПро', 'АйТиСолюшнс', 'МаркетПлюс',
  'ПроСтарт', 'ДиджиталВейв', 'СайберТек', 'НетВоркс', 'АналитикПро',
];

const EMAIL_DOMAINS = ['mail.ru', 'yandex.ru', 'gmail.com', 'outlook.com', 'inbox.ru', 'bk.ru', 'list.ru', 'rambler.ru'];

const FIELD_TYPES: { value: FieldType; label: string }[] = [
  { value: 'firstName', label: 'Имя' },
  { value: 'lastName', label: 'Фамилия' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Телефон' },
  { value: 'number', label: 'Число' },
  { value: 'boolean', label: 'Булево' },
  { value: 'date', label: 'Дата' },
  { value: 'uuid', label: 'UUID' },
  { value: 'city', label: 'Город' },
  { value: 'country', label: 'Страна' },
  { value: 'company', label: 'Компания' },
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function generatePhone(): string {
  const code = Math.floor(900 + Math.random() * 100);
  const num = Math.floor(1000000 + Math.random() * 9000000);
  return `+7 (${code}) ${num.toString().slice(0, 3)}-${num.toString().slice(3, 5)}-${num.toString().slice(5, 7)}`;
}

function generateDate(): string {
  const start = new Date(2020, 0, 1).getTime();
  const end = new Date(2026, 0, 1).getTime();
  const d = new Date(start + Math.random() * (end - start));
  return d.toISOString().slice(0, 10);
}

function generateEmail(): string {
  const fn = randomItem(FIRST_NAMES).toLowerCase();
  const ln = randomItem(LAST_NAMES).toLowerCase();
  const translitMap: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
  };
  const translit = (s: string) => s.split('').map((c) => translitMap[c] || c).join('');
  const num = Math.floor(Math.random() * 100);
  return `${translit(fn)}.${translit(ln)}${num}@${randomItem(EMAIL_DOMAINS)}`;
}

function generateValue(field: FieldDef): string | number | boolean {
  switch (field.type) {
    case 'firstName': return randomItem(FIRST_NAMES);
    case 'lastName': return randomItem(LAST_NAMES);
    case 'email': return generateEmail();
    case 'phone': return generatePhone();
    case 'number': {
      const min = field.min ?? 0;
      const max = field.max ?? 1000;
      return Math.floor(min + Math.random() * (max - min + 1));
    }
    case 'boolean': return Math.random() > 0.5;
    case 'date': return generateDate();
    case 'uuid': return generateUUID();
    case 'city': return randomItem(CITIES);
    case 'country': return randomItem(COUNTRIES);
    case 'company': return randomItem(COMPANIES);
    default: return '';
  }
}

function toCSV(data: Record<string, string | number | boolean>[]): string {
  if (data.length === 0) return '';
  const headers = Object.keys(data[0]);
  const lines = [headers.join(',')];
  data.forEach((row) => {
    const values = headers.map((h) => {
      const v = row[h];
      if (typeof v === 'string' && (v.includes(',') || v.includes('"') || v.includes('\n'))) {
        return `"${v.replace(/"/g, '""')}"`;
      }
      return String(v);
    });
    lines.push(values.join(','));
  });
  return lines.join('\n');
}

export default function MockdataGenerator() {
  const theme = useTheme();
  const [fields, setFields] = useState<FieldDef[]>([
    { id: 1, name: 'id', type: 'uuid' },
    { id: 2, name: 'firstName', type: 'firstName' },
    { id: 3, name: 'lastName', type: 'lastName' },
    { id: 4, name: 'email', type: 'email' },
  ]);
  const [count, setCount] = useState(10);
  const [format, setFormat] = useState<'json' | 'csv'>('json');
  const [output, setOutput] = useState('');
  const nextId = useState(5)[0];
  const idRef = { current: nextId };

  const addField = () => {
    idRef.current++;
    setFields((prev) => [...prev, { id: idRef.current, name: `field${prev.length + 1}`, type: 'firstName' }]);
  };

  const removeField = (id: number) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
  };

  const updateField = (id: number, updates: Partial<FieldDef>) => {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const generate = useCallback(() => {
    if (fields.length === 0) return;
    const data: Record<string, string | number | boolean>[] = [];
    for (let i = 0; i < count; i++) {
      const row: Record<string, string | number | boolean> = {};
      fields.forEach((field) => {
        row[field.name] = generateValue(field);
      });
      data.push(row);
    }
    if (format === 'json') {
      setOutput(JSON.stringify(data, null, 2));
    } else {
      setOutput(toCSV(data));
    }
  }, [fields, count, format]);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: { xs: 2, sm: 3 } }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 2,
          borderRadius: 3,
          background: theme.palette.surfaceContainerLow
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>
          Схема данных
        </Typography>

        {fields.map((field) => (
          <Box key={field.id} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
            <TextField
              size="small"
              value={field.name}
              onChange={(e) => updateField(field.id, { name: e.target.value })}
              placeholder="Имя поля"
              sx={{ flex: 1 }}
              slotProps={{
                htmlInput: { style: { fontFamily: 'monospace' } }
              }}
            />
            <TextField
              select
              size="small"
              value={field.type}
              onChange={(e) => updateField(field.id, { type: e.target.value as FieldType })}
              sx={{ minWidth: 150 }}
            >
              {FIELD_TYPES.map((ft) => (
                <MenuItem key={ft.value} value={ft.value}>
                  {ft.label}
                </MenuItem>
              ))}
            </TextField>
            {field.type === 'number' && (
              <>
                <TextField
                  size="small"
                  type="number"
                  value={field.min ?? 0}
                  onChange={(e) => updateField(field.id, { min: parseInt(e.target.value) || 0 })}
                  placeholder="Мин"
                  sx={{ width: 80 }}
                />
                <TextField
                  size="small"
                  type="number"
                  value={field.max ?? 1000}
                  onChange={(e) => updateField(field.id, { max: parseInt(e.target.value) || 1000 })}
                  placeholder="Макс"
                  sx={{ width: 80 }}
                />
              </>
            )}
            <IconButton size="small" onClick={() => removeField(field.id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}

        <Button
          size="small"
          startIcon={<AddIcon />}
          onClick={addField}
          sx={{ mt: 1, borderRadius: 3 }}
        >
          Добавить поле
        </Button>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 2,
          borderRadius: 3,
          background: theme.palette.surfaceContainerLow
        }}
      >
        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
              Количество записей: {count}
            </Typography>
            <Slider
              value={count}
              onChange={(_, v) => setCount(v as number)}
              min={1}
              max={100}
              valueLabelDisplay="auto"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <ToggleButtonGroup
              exclusive
              value={format}
              onChange={(_, v) => v && setFormat(v)}
              size="small"
              fullWidth
            >
              <ToggleButton value="json" sx={{ borderRadius: 2 }}>JSON</ToggleButton>
              <ToggleButton value="csv" sx={{ borderRadius: 2 }}>CSV</ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<PlayArrowIcon />}
              onClick={generate}
              sx={{ borderRadius: 3, height: 40, textTransform: 'none', fontWeight: 600 }}
            >
              Сгенерировать
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {output && (
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 3,
            background: theme.palette.surfaceContainerLow
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
              Результат
            </Typography>
            <CopyButton text={output} />
          </Box>
          <TextField
            fullWidth
            multiline
            rows={16}
            value={output}
            slotProps={{
              htmlInput: {
                readOnly: true,
                style: { fontFamily: 'monospace', fontSize: '0.8rem', lineHeight: 1.5 }
              }
            }}
            sx={{
              '& .MuiInputBase-root': {
                backgroundColor: alpha(theme.palette.background.default, 0.5),
                borderRadius: 3
              }
            }}
          />
        </Paper>
      )}
    </Box>
  );
}
