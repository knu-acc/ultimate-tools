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
import { useLanguage } from '@/src/i18n/LanguageContext';

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

function getIpClass(ipNum: number): { ru: string; en: string } {
  const first = (ipNum >>> 24) & 255;
  if (first < 128) return { ru: 'A', en: 'A' };
  if (first < 192) return { ru: 'B', en: 'B' };
  if (first < 224) return { ru: 'C', en: 'C' };
  if (first < 240) return { ru: 'D (мультикаст)', en: 'D (multicast)' };
  return { ru: 'E (зарезервирован)', en: 'E (reserved)' };
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
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const [ip, setIp] = useState('192.168.1.100');
  const [cidr, setCidr] = useState(24);

  const valid = isValidIp(ip);
  const result = valid ? calcSubnet(ip, cidr) : null;

  const resultCards = result
    ? [
        { label: isEn ? 'Network Address' : 'Адрес сети', value: result.network },
        { label: isEn ? 'Broadcast Address' : 'Широковещательный адрес', value: result.broadcast },
        { label: isEn ? 'Subnet Mask' : 'Маска подсети', value: result.mask },
        { label: isEn ? 'Wildcard Mask' : 'Обратная маска (Wildcard)', value: result.wildcard },
        { label: isEn ? 'First Host' : 'Первый хост', value: result.firstHost },
        { label: isEn ? 'Last Host' : 'Последний хост', value: result.lastHost },
        { label: isEn ? 'Total Hosts' : 'Количество хостов', value: result.totalHosts.toLocaleString(isEn ? 'en-US' : 'ru-RU') },
        { label: isEn ? 'IP Class' : 'Класс IP', value: isEn ? result.ipClass.en : result.ipClass.ru },
        { label: isEn ? 'Private Address' : 'Частный адрес', value: result.isPrivate ? (isEn ? 'Yes' : 'Да') : (isEn ? 'No' : 'Нет') },
      ]
    : [];

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Input */}
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
          {isEn ? 'Enter IP address and CIDR prefix' : 'Введите IP-адрес и префикс CIDR'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            size="small"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            placeholder="192.168.1.0"
            error={ip !== '' && !valid}
            helperText={ip !== '' && !valid ? (isEn ? 'Invalid IP address' : 'Некорректный IP-адрес') : ''}
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
            {isEn ? 'Reset' : 'Сбросить'}
          </Button>
        </Box>
      </Paper>

      {/* Results */}
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

          {/* Binary representation */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 3
            }}
          >
            <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
              {isEn ? 'Binary Representation' : 'Двоичное представление'}
            </Typography>
            {[
              { label: isEn ? 'IP Address' : 'IP-адрес', value: result.ipBinary },
              { label: isEn ? 'Subnet Mask' : 'Маска подсети', value: result.maskBinary },
              { label: isEn ? 'Network Address' : 'Адрес сети', value: result.networkBinary },
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
