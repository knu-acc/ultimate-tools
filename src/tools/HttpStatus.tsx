'use client';

import { useState } from 'react';
import {
  Box, Typography, Paper, TextField, Grid, Chip, alpha, useTheme
} from '@mui/material';
import { useLanguage } from '@/src/i18n/LanguageContext';

const STATUSES: Record<number, { text: string; descRu: string; descEn: string; category: string }> = {
  100: { text: 'Continue', descRu: 'Сервер получил заголовки запроса, клиент может продолжить', descEn: 'Server received request headers, client may continue', category: 'info' },
  101: { text: 'Switching Protocols', descRu: 'Сервер переключает протокол', descEn: 'Server is switching protocols', category: 'info' },
  200: { text: 'OK', descRu: 'Запрос выполнен успешно', descEn: 'Request succeeded', category: 'success' },
  201: { text: 'Created', descRu: 'Ресурс успешно создан', descEn: 'Resource successfully created', category: 'success' },
  204: { text: 'No Content', descRu: 'Запрос успешен, но нет содержимого для ответа', descEn: 'Request succeeded, no content to return', category: 'success' },
  206: { text: 'Partial Content', descRu: 'Частичное содержимое (Range запросы)', descEn: 'Partial content (Range requests)', category: 'success' },
  301: { text: 'Moved Permanently', descRu: 'Ресурс перемещён навсегда', descEn: 'Resource moved permanently', category: 'redirect' },
  302: { text: 'Found', descRu: 'Ресурс временно перемещён', descEn: 'Resource temporarily moved', category: 'redirect' },
  304: { text: 'Not Modified', descRu: 'Ресурс не изменился (кэширование)', descEn: 'Resource not modified (caching)', category: 'redirect' },
  307: { text: 'Temporary Redirect', descRu: 'Временный редирект с сохранением метода', descEn: 'Temporary redirect preserving method', category: 'redirect' },
  308: { text: 'Permanent Redirect', descRu: 'Постоянный редирект с сохранением метода', descEn: 'Permanent redirect preserving method', category: 'redirect' },
  400: { text: 'Bad Request', descRu: 'Неправильный синтаксис запроса', descEn: 'Invalid request syntax', category: 'client' },
  401: { text: 'Unauthorized', descRu: 'Требуется аутентификация', descEn: 'Authentication required', category: 'client' },
  403: { text: 'Forbidden', descRu: 'Доступ запрещён', descEn: 'Access forbidden', category: 'client' },
  404: { text: 'Not Found', descRu: 'Ресурс не найден', descEn: 'Resource not found', category: 'client' },
  405: { text: 'Method Not Allowed', descRu: 'HTTP-метод не разрешён', descEn: 'HTTP method not allowed', category: 'client' },
  408: { text: 'Request Timeout', descRu: 'Время ожидания истекло', descEn: 'Request timeout', category: 'client' },
  409: { text: 'Conflict', descRu: 'Конфликт при обработке запроса', descEn: 'Conflict processing request', category: 'client' },
  410: { text: 'Gone', descRu: 'Ресурс удалён навсегда', descEn: 'Resource permanently deleted', category: 'client' },
  413: { text: 'Payload Too Large', descRu: 'Тело запроса слишком большое', descEn: 'Request body too large', category: 'client' },
  415: { text: 'Unsupported Media Type', descRu: 'Неподдерживаемый тип содержимого', descEn: 'Unsupported content type', category: 'client' },
  422: { text: 'Unprocessable Entity', descRu: 'Невозможно обработать содержимое', descEn: 'Cannot process content', category: 'client' },
  429: { text: 'Too Many Requests', descRu: 'Слишком много запросов (rate limit)', descEn: 'Too many requests (rate limit)', category: 'client' },
  500: { text: 'Internal Server Error', descRu: 'Внутренняя ошибка сервера', descEn: 'Internal server error', category: 'server' },
  502: { text: 'Bad Gateway', descRu: 'Неправильный ответ от вышестоящего сервера', descEn: 'Invalid response from upstream server', category: 'server' },
  503: { text: 'Service Unavailable', descRu: 'Сервис временно недоступен', descEn: 'Service temporarily unavailable', category: 'server' },
  504: { text: 'Gateway Timeout', descRu: 'Тайм-аут от вышестоящего сервера', descEn: 'Timeout from upstream server', category: 'server' }
};

const CATEGORIES: Record<string, { labelRu: string; labelEn: string; color: string }> = {
  info: { labelRu: '1xx Информация', labelEn: '1xx Informational', color: '#2196f3' },
  success: { labelRu: '2xx Успех', labelEn: '2xx Success', color: '#4CAF50' },
  redirect: { labelRu: '3xx Перенаправление', labelEn: '3xx Redirection', color: '#ff9800' },
  client: { labelRu: '4xx Ошибки клиента', labelEn: '4xx Client Errors', color: '#f44336' },
  server: { labelRu: '5xx Ошибки сервера', labelEn: '5xx Server Errors', color: '#9c27b0' }
};

export default function HttpStatus() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = Object.entries(STATUSES).filter(([code, info]) => {
    if (filter !== 'all' && info.category !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      const desc = isEn ? info.descEn : info.descRu;
      return code.includes(q) || info.text.toLowerCase().includes(q) || desc.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{ p: { xs: 2, sm: 3 }, mb: 2, borderRadius: 18, background: theme.palette.surfaceContainerLow }}
      >
        <TextField
          fullWidth
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={isEn ? "Search by code or description..." : "Поиск по коду или описанию..."}
          size="small"
          sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 10 } }}
        />

        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip label={isEn ? 'All' : 'Все'} onClick={() => setFilter('all')} sx={{ fontWeight: filter === 'all' ? 700 : 400, bgcolor: filter === 'all' ? theme.palette.surfaceContainerHigh : undefined }} />
          {Object.entries(CATEGORIES).map(([key, cat]) => (
            <Chip key={key} label={isEn ? cat.labelEn : cat.labelRu} onClick={() => setFilter(key)} sx={{ fontWeight: filter === key ? 700 : 400, bgcolor: filter === key ? alpha(cat.color, 0.15) : undefined, color: filter === key ? cat.color : undefined }} />
          ))}
        </Box>
      </Paper>

      <Grid container spacing={1.5}>
        {filtered.map(([code, info]) => {
          const cat = CATEGORIES[info.category];
          return (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={code}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: 10, '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) }, transitionProperty: 'background-color', transitionDuration: '200ms' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Chip label={code} size="small" sx={{ fontWeight: 700, bgcolor: alpha(cat.color, 0.12), color: cat.color, fontFamily: 'monospace' }} />
                  <Typography variant="body2" fontWeight={600}>{info.text}</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">{isEn ? info.descEn : info.descRu}</Typography>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
