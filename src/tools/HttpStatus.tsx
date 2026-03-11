'use client';

import { useState } from 'react';
import {
  Box, Typography, Paper, TextField, Grid, Chip, alpha, useTheme
} from '@mui/material';

const STATUSES: Record<number, { text: string; desc: string; category: string }> = {
  100: { text: 'Continue', desc: 'Сервер получил заголовки запроса, клиент может продолжить', category: 'info' },
  101: { text: 'Switching Protocols', desc: 'Сервер переключает протокол', category: 'info' },
  200: { text: 'OK', desc: 'Запрос выполнен успешно', category: 'success' },
  201: { text: 'Created', desc: 'Ресурс успешно создан', category: 'success' },
  204: { text: 'No Content', desc: 'Запрос успешен, но нет содержимого для ответа', category: 'success' },
  206: { text: 'Partial Content', desc: 'Частичное содержимое (Range запросы)', category: 'success' },
  301: { text: 'Moved Permanently', desc: 'Ресурс перемещён навсегда', category: 'redirect' },
  302: { text: 'Found', desc: 'Ресурс временно перемещён', category: 'redirect' },
  304: { text: 'Not Modified', desc: 'Ресурс не изменился (кэширование)', category: 'redirect' },
  307: { text: 'Temporary Redirect', desc: 'Временный редирект с сохранением метода', category: 'redirect' },
  308: { text: 'Permanent Redirect', desc: 'Постоянный редирект с сохранением метода', category: 'redirect' },
  400: { text: 'Bad Request', desc: 'Неправильный синтаксис запроса', category: 'client' },
  401: { text: 'Unauthorized', desc: 'Требуется аутентификация', category: 'client' },
  403: { text: 'Forbidden', desc: 'Доступ запрещён', category: 'client' },
  404: { text: 'Not Found', desc: 'Ресурс не найден', category: 'client' },
  405: { text: 'Method Not Allowed', desc: 'HTTP-метод не разрешён', category: 'client' },
  408: { text: 'Request Timeout', desc: 'Время ожидания истекло', category: 'client' },
  409: { text: 'Conflict', desc: 'Конфликт при обработке запроса', category: 'client' },
  410: { text: 'Gone', desc: 'Ресурс удалён навсегда', category: 'client' },
  413: { text: 'Payload Too Large', desc: 'Тело запроса слишком большое', category: 'client' },
  415: { text: 'Unsupported Media Type', desc: 'Неподдерживаемый тип содержимого', category: 'client' },
  422: { text: 'Unprocessable Entity', desc: 'Невозможно обработать содержимое', category: 'client' },
  429: { text: 'Too Many Requests', desc: 'Слишком много запросов (rate limit)', category: 'client' },
  500: { text: 'Internal Server Error', desc: 'Внутренняя ошибка сервера', category: 'server' },
  502: { text: 'Bad Gateway', desc: 'Неправильный ответ от вышестоящего сервера', category: 'server' },
  503: { text: 'Service Unavailable', desc: 'Сервис временно недоступен', category: 'server' },
  504: { text: 'Gateway Timeout', desc: 'Тайм-аут от вышестоящего сервера', category: 'server' }
};

const CATEGORIES: Record<string, { label: string; color: string }> = {
  info: { label: '1xx Информация', color: '#2196f3' },
  success: { label: '2xx Успех', color: '#4CAF50' },
  redirect: { label: '3xx Перенаправление', color: '#ff9800' },
  client: { label: '4xx Ошибки клиента', color: '#f44336' },
  server: { label: '5xx Ошибки сервера', color: '#9c27b0' }
};

export default function HttpStatus() {
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = Object.entries(STATUSES).filter(([code, info]) => {
    if (filter !== 'all' && info.category !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return code.includes(q) || info.text.toLowerCase().includes(q) || info.desc.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <Box>
      <TextField fullWidth value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск по коду или описанию..." size="small" sx={{ mb: 2 }} />

      <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
        <Chip label="Все" onClick={() => setFilter('all')} sx={{ fontWeight: filter === 'all' ? 700 : 400, bgcolor: filter === 'all' ? theme.palette.surfaceContainerHigh : undefined }} />
        {Object.entries(CATEGORIES).map(([key, cat]) => (
          <Chip key={key} label={cat.label} onClick={() => setFilter(key)} sx={{ fontWeight: filter === key ? 700 : 400, bgcolor: filter === key ? alpha(cat.color, 0.15) : undefined, color: filter === key ? cat.color : undefined }} />
        ))}
      </Box>

      <Grid container spacing={1.5}>
        {filtered.map(([code, info]) => {
          const cat = CATEGORIES[info.category];
          return (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={code}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: 2, '&:hover': { borderColor: cat.color, bgcolor: alpha(cat.color, 0.04) }, transition: 'all 200ms' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Chip label={code} size="small" sx={{ fontWeight: 700, bgcolor: alpha(cat.color, 0.12), color: cat.color, fontFamily: 'monospace' }} />
                  <Typography variant="body2" fontWeight={600}>{info.text}</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">{info.desc}</Typography>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
