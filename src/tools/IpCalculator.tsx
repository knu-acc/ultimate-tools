'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Select,
  MenuItem,
  Grid,
  Button,
  useTheme,
  alpha } from '@mui/material';

function isValidIp(ip: string): boolean {
  const parts = ip.split('.');
  if (parts.length !== 4) return false;
  return parts.every((p) => {
    const n = parseInt(p, 10);
    return !isNaN(n) && n >= 0 && n <= 255 && p === n.toString();
  });
}

function ipToNumber(ip: string): number {
  const parts = ip.split('.').map(Number);
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
}

function numberToIp(num: number): string {
  return [
    (num >>> 24) & 255,
    (num >>> 16) & 255,
    (num >>> 8) & 255,
    num & 255,
  ].join('.');
}

function numberToBinary(num: number): string {
  return [
    ((num >>> 24) & 255).toString(2).padStart(8, '0'),
    ((num >>> 16) & 255).toString(2).padStart(8, '0'),
    ((num >>> 8) & 255).toString(2).padStart(8, '0'),
    (num & 255).toString(2).padStart(8, '0'),
  ].join('.');
}

function calcSubnet(ip: string, cidr: number) {
  const ipNum = ipToNumber(ip);
  const mask = cidr === 0 ? 0 : (0xffffffff << (32 - cidr)) >>> 0;
  const wildcard = (~mask) >>> 0;
  const network = (ipNum & mask) >>> 0;
  const broadcast = (network | wildcard) >>> 0;
  const totalHosts = cidr >= 31 ? (cidr === 32 ? 1 : 2) : Math.pow(2, 32 - cidr) - 2;
  const firstHost = cidr >= 31 ? network : (network + 1) >>> 0;
  const lastHost = cidr >= 31 ? broadcast : (broadcast - 1) >>> 0;

  return {
    network: numberToIp(network),
    broadcast: numberToIp(broadcast),
    mask: numberToIp(mask),
    wildcard: numberToIp(wildcard),
    firstHost: numberToIp(firstHost),
    lastHost: numberToIp(lastHost),
    totalHosts,
    ipBinary: numberToBinary(ipNum),
    maskBinary: numberToBinary(mask),
    networkBinary: numberToBinary(network),
    ipClass: getIpClass(ipNum),
    isPrivate: isPrivateIp(ipNum)
  };
}

function getIpClass(ipNum: number): string {
  const first = (ipNum >>> 24) & 255;
  if (first < 128) return 'A';
  if (first < 192) return 'B';
  if (first < 224) return 'C';
  if (first < 240) return 'D (мультикаст)';
  return 'E (зарезервирован)';
}

function isPrivateIp(ipNum: number): boolean {
  const first = (ipNum >>> 24) & 255;
  const second = (ipNum >>> 16) & 255;
  if (first === 10) return true;
  if (first === 172 && second >= 16 && second <= 31) return true;
  if (first === 192 && second === 168) return true;
  return false;
}

export default function IpCalculator() {
  const theme = useTheme();
  const [ip, setIp] = useState('192.168.1.100');
  const [cidr, setCidr] = useState(24);

  const valid = isValidIp(ip);
  const result = valid ? calcSubnet(ip, cidr) : null;

  const resultCards = result
    ? [
        { label: 'Адрес сети', value: result.network },
        { label: 'Широковещательный адрес', value: result.broadcast },
        { label: 'Маска подсети', value: result.mask },
        { label: 'Обратная маска (Wildcard)', value: result.wildcard },
        { label: 'Первый хост', value: result.firstHost },
        { label: 'Последний хост', value: result.lastHost },
        { label: 'Количество хостов', value: result.totalHosts.toLocaleString('ru-RU') },
        { label: 'Класс IP', value: result.ipClass },
        { label: 'Частный адрес', value: result.isPrivate ? 'Да' : 'Нет' },
      ]
    : [];

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Ввод */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 2,
          borderRadius: 3,
          background: theme.palette.surfaceContainerLow
        }}
      >
        <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 600, color: 'text.secondary' }}>
          Введите IP-адрес и префикс CIDR
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            size="small"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            placeholder="192.168.1.0"
            error={ip !== '' && !valid}
            helperText={ip !== '' && !valid ? 'Некорректный IP-адрес' : ''}
            slotProps={{ htmlInput: { style: { fontFamily: 'monospace', fontSize: '1.1rem' } } }}
            sx={{ flex: 2, minWidth: 200 }}
          />
          <Select
            size="small"
            value={cidr}
            onChange={(e) => setCidr(Number(e.target.value))}
            sx={{ flex: 1, minWidth: 120, borderRadius: 2 }}
          >
            {Array.from({ length: 33 }, (_, i) => (
              <MenuItem key={i} value={i}>
                /{i}
              </MenuItem>
            ))}
          </Select>
          <Button
            variant="contained"
            onClick={() => {
              setIp('192.168.1.100');
              setCidr(24);
            }}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Сбросить
          </Button>
        </Box>
      </Paper>

      {/* Результаты */}
      {result && (
        <>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            {resultCards.map((card) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={card.label}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    textAlign: 'center',
                    transition: 'all 200ms ease',
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      background: alpha(theme.palette.primary.main, 0.04)
                    }
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}
                  >
                    {card.label}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, fontFamily: 'monospace', mt: 0.5 }}
                  >
                    {card.value}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Двоичное представление */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 3
            }}
          >
            <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
              Двоичное представление
            </Typography>
            {[
              { label: 'IP-адрес', value: result.ipBinary },
              { label: 'Маска подсети', value: result.maskBinary },
              { label: 'Адрес сети', value: result.networkBinary },
            ].map((row) => (
              <Box
                key={row.label}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 1.5,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  '&:last-child': { borderBottom: 'none' },
                  flexWrap: 'wrap',
                  gap: 1
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary', minWidth: 140 }}>
                  {row.label}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontFamily: 'monospace', fontSize: '0.95rem', letterSpacing: 0.5 }}
                >
                  {row.value}
                </Typography>
              </Box>
            ))}
          </Paper>
        </>
      )}
    </Box>
  );
}
