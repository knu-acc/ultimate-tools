'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Grid,
  Button,
  Chip,
  Divider,
  MenuItem,
  Slider,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import { CopyButton } from '@/src/components/CopyButton';
import { useLanguage } from '@/src/i18n/LanguageContext';


const fieldTypes = [
  { value: 'string', labelRu: 'Строка', labelEn: 'String' },
  { value: 'number', labelRu: 'Число', labelEn: 'Number' },
  { value: 'boolean', labelRu: 'Булево', labelEn: 'Boolean' },
  { value: 'email', labelRu: 'Email', labelEn: 'Email' },
  { value: 'name', labelRu: 'Имя', labelEn: 'Name' },
  { value: 'date', labelRu: 'Дата', labelEn: 'Date' },
  { value: 'uuid', labelRu: 'UUID', labelEn: 'UUID' },
  { value: 'phone', labelRu: 'Телефон', labelEn: 'Phone' },
  { value: 'address', labelRu: 'Адрес', labelEn: 'Address' },
];

interface SchemaField {
  id: number;
  name: string;
  type: string;
}

const presetSchemas: Record<string, SchemaField[]> = {
  users: [
    { id: 1, name: 'id', type: 'uuid' },
    { id: 2, name: 'name', type: 'name' },
    { id: 3, name: 'email', type: 'email' },
    { id: 4, name: 'phone', type: 'phone' },
    { id: 5, name: 'registered', type: 'date' },
    { id: 6, name: 'active', type: 'boolean' },
  ],
  products: [
    { id: 1, name: 'id', type: 'uuid' },
    { id: 2, name: 'title', type: 'string' },
    { id: 3, name: 'price', type: 'number' },
    { id: 4, name: 'inStock', type: 'boolean' },
    { id: 5, name: 'createdAt', type: 'date' },
  ],
  orders: [
    { id: 1, name: 'orderId', type: 'uuid' },
    { id: 2, name: 'customer', type: 'name' },
    { id: 3, name: 'email', type: 'email' },
    { id: 4, name: 'total', type: 'number' },
    { id: 5, name: 'address', type: 'address' },
    { id: 6, name: 'date', type: 'date' },
  ]
};

// --- Generators ---
function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const firstNames = [
  'Александр', 'Мария', 'Дмитрий', 'Елена', 'Сергей', 'Анна', 'Андрей', 'Ольга',
  'Иван', 'Наталья', 'Михаил', 'Татьяна', 'Артём', 'Екатерина', 'Павел', 'Ирина',
];

const lastNames = [
  'Иванов', 'Петров', 'Сидоров', 'Козлов', 'Новиков', 'Морозов', 'Волков', 'Соколов',
  'Лебедев', 'Кузнецов', 'Попов', 'Смирнов', 'Фёдоров', 'Орлов', 'Зайцев', 'Белов',
];

const domains = ['mail.ru', 'yandex.ru', 'gmail.com', 'outlook.com', 'rambler.ru', 'inbox.ru'];

const cities = [
  'Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань',
  'Нижний Новгород', 'Самара', 'Ростов-на-Дону', 'Краснодар', 'Воронеж',
];

const streets = [
  'ул. Ленина', 'ул. Мира', 'пр. Победы', 'ул. Советская', 'ул. Гагарина',
  'ул. Пушкина', 'ул. Кирова', 'пр. Ленинградский', 'ул. Садовая', 'ул. Центральная',
];

const loremWords = [
  'Lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et',
];

function generateValue(type: string): string | number | boolean {
  switch (type) {
    case 'string':
      return Array.from({ length: randomInt(2, 5) }, () => randomElement(loremWords)).join(' ');
    case 'number':
      return Math.round(Math.random() * 10000 * 100) / 100;
    case 'boolean':
      return Math.random() > 0.5;
    case 'email': {
      const first = randomElement(firstNames).toLowerCase();
      const last = randomElement(lastNames).toLowerCase();
      return `${first}.${last}${randomInt(1, 99)}@${randomElement(domains)}`;
    }
    case 'name':
      return `${randomElement(firstNames)} ${randomElement(lastNames)}`;
    case 'date': {
      const start = new Date(2020, 0, 1).getTime();
      const end = new Date().getTime();
      return new Date(start + Math.random() * (end - start)).toISOString().split('T')[0];
    }
    case 'uuid':
      return generateUUID();
    case 'phone':
      return `+7${randomInt(900, 999)}${String(randomInt(1000000, 9999999))}`;
    case 'address':
      return `г. ${randomElement(cities)}, ${randomElement(streets)}, д. ${randomInt(1, 150)}, кв. ${randomInt(1, 200)}`;
    default:
      return '';
  }
}

function jsonToCSV(data: Record<string, unknown>[]): string {
  if (data.length === 0) return '';
  const headers = Object.keys(data[0]);
  const rows = data.map((item) =>
    headers.map((h) => {
      const val = String(item[h] ?? '');
      return val.includes(',') || val.includes('"') || val.includes('\n')
        ? `"${val.replace(/"/g, '""')}"`
        : val;
    }).join(',')
  );
  return [headers.join(','), ...rows].join('\n');
}

let nextFieldId = 100;

export default function JsonDataGen() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';

  const [fields, setFields] = useState<SchemaField[]>([
    { id: 1, name: 'id', type: 'uuid' },
    { id: 2, name: 'name', type: 'name' },
  ]);
  const [count, setCount] = useState(5);
  const [format, setFormat] = useState<'json' | 'csv'>('json');
  const [output, setOutput] = useState('');

  const addField = () => {
    nextFieldId++;
    setFields([...fields, { id: nextFieldId, name: '', type: 'string' }]);
  };

  const removeField = (id: number) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  const updateField = (id: number, key: 'name' | 'type', value: string) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, [key]: value } : f)));
  };

  const loadPreset = (key: string) => {
    const preset = presetSchemas[key];
    if (preset) {
      setFields(preset.map((f, i) => ({ ...f, id: nextFieldId + i + 1 })));
      nextFieldId += preset.length + 1;
      setOutput('');
    }
  };

  const generate = () => {
    const validFields = fields.filter((f) => f.name.trim());
    if (validFields.length === 0) return;

    const data: Record<string, unknown>[] = [];
    for (let i = 0; i < count; i++) {
      const item: Record<string, unknown> = {};
      for (const field of validFields) {
        item[field.name] = generateValue(field.type);
      }
      data.push(item);
    }

    if (format === 'json') {
      setOutput(JSON.stringify(data, null, 2));
    } else {
      setOutput(jsonToCSV(data));
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: { xs: 2, sm: 3 } }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          bgcolor: theme.palette.surfaceContainerLow,
          borderRadius: 18,
          transitionProperty: 'background-color', transitionDuration: '200ms', transitionTimingFunction: 'ease',
          '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) }
        }}
      >
        {/* Presets */}
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
          {isEn ? 'Templates' : 'Шаблоны'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip label={isEn ? 'Users' : 'Пользователи'} size="small" onClick={() => loadPreset('users')} variant="outlined" sx={{ cursor: 'pointer' }} />
          <Chip label={isEn ? 'Products' : 'Товары'} size="small" onClick={() => loadPreset('products')} variant="outlined" sx={{ cursor: 'pointer' }} />
          <Chip label={isEn ? 'Orders' : 'Заказы'} size="small" onClick={() => loadPreset('orders')} variant="outlined" sx={{ cursor: 'pointer' }} />
        </Box>

        {/* Schema builder */}
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
          {isEn ? 'Data schema' : 'Схема данных'}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
          {fields.map((field) => (
            <Box key={field.id} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                size="small"
                placeholder={isEn ? "Field name" : "Имя поля"}
                value={field.name}
                onChange={(e) => updateField(field.id, 'name', e.target.value)}
                sx={{ flex: 1 }}
              />
              <TextField
                size="small"
                select
                placeholder={isEn ? "Type" : "Тип"}
                value={field.type}
                onChange={(e) => updateField(field.id, 'type', e.target.value)}
                sx={{ minWidth: 140 }}
              >
                {fieldTypes.map((t) => (
                  <MenuItem key={t.value} value={t.value}>
                    {isEn ? t.labelEn : t.labelRu}
                  </MenuItem>
                ))}
              </TextField>
              <Tooltip title={isEn ? "Remove field" : "Удалить поле"}>
                <IconButton size="small" onClick={() => removeField(field.id)} color="error">
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          ))}
        </Box>

        <Button
          variant="outlined"
          size="small"
          startIcon={<AddIcon />}
          onClick={addField}
          sx={{ textTransform: 'none', mb: 2 }}
        >
          {isEn ? 'Add field' : 'Добавить поле'}
        </Button>

        <Divider sx={{ my: 2 }} />

        {/* Count and format */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {isEn ? `Number of records: ${count}` : `Количество записей: ${count}`}
            </Typography>
            <Slider
              value={count}
              onChange={(_, val) => setCount(val as number)}
              min={1}
              max={100}
              marks={[
                { value: 1, label: '1' },
                { value: 25, label: '25' },
                { value: 50, label: '50' },
                { value: 100, label: '100' },
              ]}
              valueLabelDisplay="auto"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {isEn ? 'Output format' : 'Формат вывода'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip
                label="JSON"
                size="small"
                onClick={() => setFormat('json')}
                variant={format === 'json' ? 'filled' : 'outlined'}
                color={format === 'json' ? 'primary' : 'default'}
              />
              <Chip
                label="CSV"
                size="small"
                onClick={() => setFormat('csv')}
                variant={format === 'csv' ? 'filled' : 'outlined'}
                color={format === 'csv' ? 'primary' : 'default'}
              />
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Button
            variant="contained"
            onClick={generate}
            disabled={fields.filter((f) => f.name.trim()).length === 0}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            {isEn ? 'Generate' : 'Сгенерировать'}
          </Button>
          {output && (
            <CopyButton text={output} />
          )}
        </Box>

        {/* Output */}
        {output && (
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
              {isEn ? 'Result' : 'Результат'} ({format.toUpperCase()})
            </Typography>
            <TextField
              multiline
              fullWidth
              rows={16}
              value={output}
              slotProps={{
                input: {
                  readOnly: true
                }
              }}
              sx={{
                '& .MuiInputBase-root': {
                  fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
                  fontSize: '0.8rem',
                  lineHeight: 1.5
                },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 10
                }
              }}
            />
            <Box sx={{ mt: 1 }}>
              <Chip
                size="small"
                label={isEn ? `${count} records` : `${count} записей`}
                variant="outlined"
                sx={{ fontSize: '0.75rem' }}
              />
            </Box>
          </Box>
        )}
      </Paper>

    </Box>
  );
}
