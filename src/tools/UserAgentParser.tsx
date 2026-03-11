'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Grid,
  Chip,
  Button,
  useTheme,
  alpha,
} from '@mui/material';

interface ParsedUA {
  browser: string;
  browserVersion: string;
  engine: string;
  engineVersion: string;
  os: string;
  osVersion: string;
  deviceType: string;
  architecture: string;
}

function parseUserAgent(ua: string): ParsedUA {
  const result: ParsedUA = {
    browser: 'Неизвестно',
    browserVersion: '',
    engine: 'Неизвестно',
    engineVersion: '',
    os: 'Неизвестно',
    osVersion: '',
    deviceType: 'Десктоп',
    architecture: '',
  };

  if (!ua) return result;

  // OS detection
  if (/Windows NT 10\.0/.test(ua)) {
    result.os = 'Windows';
    result.osVersion = '10/11';
  } else if (/Windows NT 6\.3/.test(ua)) {
    result.os = 'Windows';
    result.osVersion = '8.1';
  } else if (/Windows NT 6\.2/.test(ua)) {
    result.os = 'Windows';
    result.osVersion = '8';
  } else if (/Windows NT 6\.1/.test(ua)) {
    result.os = 'Windows';
    result.osVersion = '7';
  } else if (/Windows/.test(ua)) {
    result.os = 'Windows';
    const m = ua.match(/Windows NT (\d+\.\d+)/);
    result.osVersion = m ? m[1] : '';
  } else if (/Mac OS X/.test(ua)) {
    result.os = 'macOS';
    const m = ua.match(/Mac OS X (\d+[._]\d+[._]?\d*)/);
    result.osVersion = m ? m[1].replace(/_/g, '.') : '';
  } else if (/iPhone|iPad|iPod/.test(ua)) {
    result.os = 'iOS';
    const m = ua.match(/OS (\d+[._]\d+[._]?\d*)/);
    result.osVersion = m ? m[1].replace(/_/g, '.') : '';
    result.deviceType = /iPad/.test(ua) ? 'Планшет' : 'Мобильный';
  } else if (/Android/.test(ua)) {
    result.os = 'Android';
    const m = ua.match(/Android (\d+\.?\d*\.?\d*)/);
    result.osVersion = m ? m[1] : '';
    result.deviceType = /Mobile/.test(ua) ? 'Мобильный' : 'Планшет';
  } else if (/CrOS/.test(ua)) {
    result.os = 'Chrome OS';
  } else if (/Linux/.test(ua)) {
    result.os = 'Linux';
    if (/Ubuntu/.test(ua)) result.osVersion = 'Ubuntu';
    else if (/Fedora/.test(ua)) result.osVersion = 'Fedora';
    else if (/Debian/.test(ua)) result.osVersion = 'Debian';
  }

  // Architecture
  if (/x86_64|x64|Win64|WOW64|amd64/.test(ua)) {
    result.architecture = 'x86_64';
  } else if (/arm64|aarch64/.test(ua)) {
    result.architecture = 'ARM64';
  } else if (/armv\d+/.test(ua)) {
    const m = ua.match(/armv(\d+)/);
    result.architecture = m ? 'ARMv' + m[1] : 'ARM';
  } else if (/i[36]86|x86/.test(ua)) {
    result.architecture = 'x86';
  }

  // Engine detection
  if (/AppleWebKit\/(\S+)/.test(ua)) {
    result.engine = 'WebKit';
    const m = ua.match(/AppleWebKit\/(\S+)/);
    result.engineVersion = m ? m[1] : '';
    if (/Blink/.test(ua) || (/Chrome/.test(ua) && !/Edge\//.test(ua))) {
      result.engine = 'Blink';
    }
  } else if (/Gecko\/(\S+)/.test(ua)) {
    result.engine = 'Gecko';
    const m = ua.match(/rv:(\S+)/);
    result.engineVersion = m ? m[1] : '';
  } else if (/Trident\/(\S+)/.test(ua)) {
    result.engine = 'Trident';
    const m = ua.match(/Trident\/(\S+)/);
    result.engineVersion = m ? m[1] : '';
  } else if (/Presto\/(\S+)/.test(ua)) {
    result.engine = 'Presto';
    const m = ua.match(/Presto\/(\S+)/);
    result.engineVersion = m ? m[1] : '';
  }

  // Browser detection (order matters)
  if (/Edg\/(\S+)/.test(ua)) {
    result.browser = 'Microsoft Edge';
    const m = ua.match(/Edg\/(\S+)/);
    result.browserVersion = m ? m[1] : '';
  } else if (/OPR\/(\S+)/.test(ua) || /Opera\/(\S+)/.test(ua)) {
    result.browser = 'Opera';
    const m = ua.match(/OPR\/(\S+)/) || ua.match(/Opera\/(\S+)/);
    result.browserVersion = m ? m[1] : '';
  } else if (/YaBrowser\/(\S+)/.test(ua)) {
    result.browser = 'Яндекс Браузер';
    const m = ua.match(/YaBrowser\/(\S+)/);
    result.browserVersion = m ? m[1] : '';
  } else if (/Vivaldi\/(\S+)/.test(ua)) {
    result.browser = 'Vivaldi';
    const m = ua.match(/Vivaldi\/(\S+)/);
    result.browserVersion = m ? m[1] : '';
  } else if (/Brave/.test(ua)) {
    result.browser = 'Brave';
    const m = ua.match(/Chrome\/(\S+)/);
    result.browserVersion = m ? m[1] : '';
  } else if (/SamsungBrowser\/(\S+)/.test(ua)) {
    result.browser = 'Samsung Internet';
    const m = ua.match(/SamsungBrowser\/(\S+)/);
    result.browserVersion = m ? m[1] : '';
  } else if (/Firefox\/(\S+)/.test(ua)) {
    result.browser = 'Firefox';
    const m = ua.match(/Firefox\/(\S+)/);
    result.browserVersion = m ? m[1] : '';
  } else if (/Chrome\/(\S+)/.test(ua) && !/Chromium/.test(ua)) {
    result.browser = 'Google Chrome';
    const m = ua.match(/Chrome\/(\S+)/);
    result.browserVersion = m ? m[1] : '';
  } else if (/Safari\/(\S+)/.test(ua) && /Version\/(\S+)/.test(ua)) {
    result.browser = 'Safari';
    const m = ua.match(/Version\/(\S+)/);
    result.browserVersion = m ? m[1] : '';
  } else if (/MSIE (\S+)/.test(ua) || /Trident/.test(ua)) {
    result.browser = 'Internet Explorer';
    const m = ua.match(/MSIE (\d+\.\d+)/) || ua.match(/rv:(\d+\.\d+)/);
    result.browserVersion = m ? m[1] : '';
  }

  // Bot detection
  if (/bot|crawler|spider|crawling/i.test(ua)) {
    result.deviceType = 'Бот';
    if (/Googlebot/.test(ua)) result.browser = 'Googlebot';
    else if (/Bingbot/.test(ua)) result.browser = 'Bingbot';
    else if (/YandexBot/.test(ua)) result.browser = 'YandexBot';
  }

  return result;
}

const commonUserAgents = [
  {
    label: 'Chrome (Windows)',
    ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  },
  {
    label: 'Firefox (Linux)',
    ua: 'Mozilla/5.0 (X11; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0',
  },
  {
    label: 'Safari (macOS)',
    ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
  },
  {
    label: 'Edge (Windows)',
    ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
  },
  {
    label: 'Chrome (Android)',
    ua: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
  },
  {
    label: 'Safari (iPhone)',
    ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
  },
  {
    label: 'Googlebot',
    ua: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  },
  {
    label: 'Яндекс Браузер',
    ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 YaBrowser/24.1.0.0 Safari/537.36',
  },
];

export default function UserAgentParser() {
  const theme = useTheme();
  const [userAgent, setUserAgent] = useState(
    typeof navigator !== 'undefined' ? navigator.userAgent : ''
  );

  const parsed = parseUserAgent(userAgent);

  const infoCards = [
    { label: 'Браузер', value: parsed.browser, sub: parsed.browserVersion },
    { label: 'Операционная система', value: parsed.os, sub: parsed.osVersion },
    { label: 'Тип устройства', value: parsed.deviceType, sub: '' },
    { label: 'Движок', value: parsed.engine, sub: parsed.engineVersion },
    { label: 'Архитектура', value: parsed.architecture || 'Не определена', sub: '' },
  ];

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      {/* Ввод */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`,
          background: alpha(theme.palette.primary.main, 0.04),
        }}
      >
        <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 600, color: 'text.secondary' }}>
          Строка User-Agent
        </Typography>
        <TextField
          size="small"
          fullWidth
          multiline
          minRows={2}
          maxRows={4}
          value={userAgent}
          onChange={(e) => setUserAgent(e.target.value)}
          placeholder="Вставьте строку User-Agent..."
          slotProps={{ htmlInput: { style: { fontFamily: 'monospace', fontSize: '0.85rem' } } }}
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            size="small"
            onClick={() =>
              setUserAgent(typeof navigator !== 'undefined' ? navigator.userAgent : '')
            }
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Мой браузер
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setUserAgent('')}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Очистить
          </Button>
        </Box>
      </Paper>

      {/* Быстрый выбор */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 600, color: 'text.secondary' }}>
          Популярные User-Agent строки
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {commonUserAgents.map((item) => (
            <Chip
              key={item.label}
              label={item.label}
              size="small"
              variant="outlined"
              onClick={() => setUserAgent(item.ua)}
              sx={{
                borderRadius: 2,
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  borderColor: theme.palette.primary.main,
                },
              }}
            />
          ))}
        </Box>
      </Paper>

      {/* Результаты */}
      {userAgent && (
        <Grid container spacing={2}>
          {infoCards.map((card) => (
            <Grid size={{ xs: 12, sm: 6 }} key={card.label}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  transition: 'all 200ms ease',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    background: alpha(theme.palette.primary.main, 0.04),
                  },
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 600,
                    color: 'text.secondary',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  {card.label}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5 }}>
                  {card.value}
                </Typography>
                {card.sub && (
                  <Typography
                    variant="body2"
                    sx={{ color: 'text.secondary', fontFamily: 'monospace', mt: 0.25 }}
                  >
                    {card.sub}
                  </Typography>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
