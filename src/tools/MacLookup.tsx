'use client';

import { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Grid,
  Button,
  useTheme,
  alpha } from '@mui/material';
import CasinoIcon from '@mui/icons-material/Casino';
import SearchIcon from '@mui/icons-material/Search';
import { CopyButton } from '@/src/components/CopyButton';
import { useLanguage } from '@/src/i18n/LanguageContext';


const ouiDatabase: Record<string, string> = {
  '00:1A:2B': 'Ayecom Technology',
  '00:1B:63': 'Apple',
  '00:1E:C2': 'Apple',
  '00:26:BB': 'Apple',
  '00:50:56': 'VMware',
  '00:0C:29': 'VMware',
  '00:15:5D': 'Microsoft (Hyper-V)',
  '00:1A:11': 'Google',
  '00:1C:B3': 'Apple',
  '00:23:12': 'Apple',
  '00:25:00': 'Apple',
  '08:00:27': 'Oracle VirtualBox',
  '08:00:20': 'Oracle/Sun Microsystems',
  '18:65:90': 'Apple',
  '28:CF:E9': 'Apple',
  '3C:D9:2B': 'Hewlett-Packard',
  '40:B0:76': 'ASUSTek',
  '48:2C:A0': 'Xiaomi',
  '4C:ED:FB': 'ASUSTek',
  '50:46:5D': 'ASUSTek',
  '54:27:1E': 'Apple',
  '5C:F9:DD': 'Apple',
  '68:5B:35': 'Apple',
  '70:56:81': 'Apple',
  '78:31:C1': 'Apple',
  '7C:D1:C3': 'Apple',
  '80:E6:50': 'Apple',
  '84:38:35': 'Apple',
  '88:53:95': 'Apple',
  '8C:85:90': 'Apple',
  '90:B2:1F': 'Apple',
  '94:94:26': 'Apple',
  '98:01:A7': 'Apple',
  'A4:67:06': 'Apple',
  'A8:5C:2C': 'Apple',
  'AC:BC:32': 'Apple',
  'B0:65:BD': 'Apple',
  'B8:27:EB': 'Raspberry Pi Foundation',
  'B8:E8:56': 'Apple',
  'C8:2A:14': 'Apple',
  'D0:03:4B': 'Apple',
  'D8:BB:C1': 'Apple',
  'DC:A6:32': 'Raspberry Pi Foundation',
  'E0:5F:45': 'Apple',
  'E4:CE:8F': 'Apple',
  'F0:18:98': 'Apple',
  'F4:5C:89': 'Apple',
  'FC:FC:48': 'Apple',
  '00:0A:95': 'Apple',
  '00:17:F2': 'Apple',
  '00:21:E9': 'Apple',
  '00:24:36': 'Apple',
  '00:14:22': 'Dell',
  '00:1A:A0': 'Dell',
  '00:06:5B': 'Dell',
  '18:A9:05': 'Hewlett-Packard',
  '00:1E:0B': 'Hewlett-Packard',
  '00:17:A4': 'Hewlett-Packard',
  '00:0F:20': 'Hewlett-Packard',
  '00:1F:29': 'Hewlett-Packard',
  '00:1B:78': 'Hewlett-Packard',
  '00:1A:4B': 'Hewlett-Packard',
  '00:07:E9': 'Intel',
  '00:13:02': 'Intel',
  '00:13:E8': 'Intel',
  '00:15:00': 'Intel',
  '00:1B:21': 'Intel',
  '00:1C:C0': 'Intel',
  '00:1D:E0': 'Intel',
  '00:1E:64': 'Intel',
  '00:1E:67': 'Intel',
  '00:1F:3B': 'Intel',
  '00:1F:3C': 'Intel',
  '00:22:FA': 'Intel',
  '3C:97:0E': 'Intel',
  '58:94:6B': 'Intel',
  '68:05:CA': 'Intel',
  '8C:EC:4B': 'Intel',
  'A4:34:D9': 'Intel',
  '00:00:0C': 'Cisco Systems',
  '00:01:42': 'Cisco Systems',
  '00:01:43': 'Cisco Systems',
  '00:01:63': 'Cisco Systems',
  '00:01:64': 'Cisco Systems',
  '00:01:96': 'Cisco Systems',
  '00:01:97': 'Cisco Systems',
  '00:0E:D7': 'Cisco Systems',
  '00:12:44': 'Cisco Systems',
  '00:1D:A2': 'Cisco Systems',
  '20:37:06': 'Cisco Systems',
  '58:97:1E': 'Cisco Systems',
  '88:75:56': 'Cisco Systems',
  'B0:00:B4': 'Cisco Systems',
  '00:16:6C': 'Samsung',
  '00:17:D5': 'Samsung',
  '00:18:AF': 'Samsung',
  '00:1A:8A': 'Samsung',
  '00:1B:98': 'Samsung',
  '00:1C:43': 'Samsung',
  '00:1D:25': 'Samsung',
  '00:1D:F6': 'Samsung',
  '00:1E:7D': 'Samsung',
  '00:21:19': 'Samsung',
  '00:21:D1': 'Samsung',
  '00:23:39': 'Samsung',
  '00:23:D6': 'Samsung',
  '00:24:54': 'Samsung',
  '00:24:E9': 'Samsung',
  '00:25:66': 'Samsung',
  '00:26:37': 'Samsung',
  '34:23:BA': 'Samsung',
  '38:01:97': 'Samsung',
  '40:0E:85': 'Samsung',
  '4C:BC:A5': 'Samsung',
  '50:01:BB': 'Samsung',
  '50:B7:C3': 'Samsung',
  '58:C3:8B': 'Samsung',
  '64:B8:53': 'Samsung',
  '78:52:1A': 'Samsung',
  '78:BD:BC': 'Samsung',
  '84:25:DB': 'Samsung',
  '84:55:A5': 'Samsung',
  '90:18:7C': 'Samsung',
  '94:35:0A': 'Samsung',
  'A0:82:1F': 'Samsung',
  'AC:5F:3E': 'Samsung',
  'B4:3A:28': 'Samsung',
  'BC:44:86': 'Samsung',
  'BC:72:B1': 'Samsung',
  'C4:73:1E': 'Samsung',
  'CC:07:AB': 'Samsung',
  'D0:22:BE': 'Samsung',
  'D0:66:7B': 'Samsung',
  'D8:90:E8': 'Samsung',
  'E4:12:1D': 'Samsung',
  'E8:03:9A': 'Samsung',
  'F0:25:B7': 'Samsung',
  'F4:7B:5E': 'Samsung',
  'FC:A1:3E': 'Samsung',
  '00:E0:4C': 'Realtek',
  '52:54:00': 'QEMU/KVM',
  '00:1C:42': 'Parallels',
  '00:25:AE': 'Microsoft',
  '28:18:78': 'Microsoft',
  '00:E0:4F': 'Cisco Systems',
  '00:18:82': 'Huawei',
  '00:1E:10': 'Huawei',
  '00:25:9E': 'Huawei',
  '00:46:4B': 'Huawei',
  '04:C0:6F': 'Huawei',
  '0C:37:DC': 'Huawei',
  '10:1B:54': 'Huawei',
  '20:A6:80': 'Huawei',
  '24:09:95': 'Huawei',
  '28:3C:E4': 'Huawei',
  '34:CD:BE': 'Huawei',
  '48:46:FB': 'Huawei',
  '4C:8B:EF': 'Huawei',
  '54:A5:1B': 'Huawei',
  '5C:7D:5E': 'Huawei',
  '60:DE:44': 'Huawei',
  '70:72:3C': 'Huawei',
  '78:D7:52': 'Huawei',
  '80:B6:86': 'Huawei',
  '88:53:D4': 'Huawei',
  '8C:34:FD': 'Huawei',
  '90:17:AC': 'Huawei',
  'AC:E2:15': 'Huawei',
  'C8:D1:5E': 'Huawei',
  'CC:A2:23': 'Huawei',
  'E0:24:7F': 'Huawei',
  'E8:CD:2D': 'Huawei',
  'F4:63:1F': 'Huawei',
  'F8:4A:BF': 'Huawei',
  'FC:48:EF': 'Huawei',
  '00:19:D1': 'Intel',
  '00:24:D6': 'Intel',
  '10:02:B5': 'Intel',
  '34:02:86': 'Intel',
  '40:A6:B7': 'Intel',
  '48:51:B7': 'Intel',
  '4C:79:6E': 'Intel',
  '58:A0:23': 'Intel',
  '64:D4:DA': 'Intel',
  '78:92:9C': 'Intel',
  '80:86:F2': 'Intel',
  '84:3A:4B': 'Intel',
  '8C:8D:28': 'Intel',
  'A0:36:9F': 'Intel',
  'A0:88:69': 'Intel',
  'A4:4C:C8': 'Intel',
  'AC:ED:5C': 'Intel',
  'B4:96:91': 'Intel',
  'B8:08:CF': 'Intel',
  'C8:5B:76': 'Intel',
  'DC:53:60': 'Intel',
  'E8:6A:64': 'Intel',
  'F8:63:3F': 'Intel',
  'FC:77:74': 'Intel',
  '2C:6E:85': 'Intel',
  '00:1D:60': 'ASUSTek',
  '00:22:15': 'ASUSTek',
  '00:23:54': 'ASUSTek',
  '00:24:8C': 'ASUSTek',
  '00:26:18': 'ASUSTek',
  '08:60:6E': 'ASUSTek',
  '10:BF:48': 'ASUSTek',
  '14:DA:E9': 'ASUSTek',
  '1C:87:2C': 'ASUSTek',
  '2C:4D:54': 'ASUSTek',
  '2C:56:DC': 'ASUSTek',
  '30:85:A9': 'ASUSTek',
  '38:D5:47': 'ASUSTek',
  '48:5B:39': 'ASUSTek',
  '54:04:A6': 'ASUSTek',
  '60:45:CB': 'ASUSTek',
  '74:D0:2B': 'ASUSTek',
  '90:E6:BA': 'ASUSTek',
  'A8:5E:45': 'ASUSTek',
  'AC:22:0B': 'ASUSTek',
  'B0:6E:BF': 'ASUSTek',
  'BC:EE:7B': 'ASUSTek',
  'C8:60:00': 'ASUSTek',
  'D8:50:E6': 'ASUSTek',
  'E0:3F:49': 'ASUSTek',
  'F0:79:59': 'ASUSTek',
  'F4:6D:04': 'ASUSTek'
};

function formatMac(input: string): string {
  const cleaned = input.replace(/[^a-fA-F0-9]/g, '').toUpperCase();
  const pairs = cleaned.match(/.{1,2}/g) || [];
  return pairs.slice(0, 6).join(':');
}

function isValidMac(mac: string): boolean {
  return /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/.test(mac);
}

function lookupOui(mac: string): { manufacturer: string; oui: string } | null {
  const oui = mac.toUpperCase().slice(0, 8);
  const manufacturer = ouiDatabase[oui];
  if (manufacturer) return { manufacturer, oui };
  return null;
}

function generateRandomMac(): string {
  const hexChars = '0123456789ABCDEF';
  const parts: string[] = [];
  for (let i = 0; i < 6; i++) {
    let byte = '';
    for (let j = 0; j < 2; j++) {
      byte += hexChars[Math.floor(Math.random() * 16)];
    }
    if (i === 0) {
      let val = parseInt(byte, 16);
      val = val & 0xfe;
      byte = val.toString(16).toUpperCase().padStart(2, '0');
    }
    parts.push(byte);
  }
  return parts.join(':');
}

export default function MacLookup() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ manufacturer: string; oui: string; formatted: string } | null>(null);
  const [error, setError] = useState('');

  const handleInputChange = (value: string) => {
    const formatted = formatMac(value);
    setInput(formatted);
    setError('');
    setResult(null);
  };

  const handleLookup = useCallback(() => {
    if (!isValidMac(input)) {
      setError(isEn ? 'Invalid MAC address format. Expected: XX:XX:XX:XX:XX:XX' : 'Неверный формат MAC-адреса. Ожидается: XX:XX:XX:XX:XX:XX');
      setResult(null);
      return;
    }
    const found = lookupOui(input);
    if (found) {
      setResult({ ...found, formatted: input.toUpperCase() });
      setError('');
    } else {
      setResult({ manufacturer: isEn ? 'Unknown manufacturer' : 'Неизвестный производитель', oui: input.toUpperCase().slice(0, 8), formatted: input.toUpperCase() });
      setError('');
    }
  }, [input, isEn]);

  const handleRandom = () => {
    const mac = generateRandomMac();
    setInput(mac);
    setError('');
    const found = lookupOui(mac);
    if (found) {
      setResult({ ...found, formatted: mac });
    } else {
      setResult({ manufacturer: isEn ? 'Unknown manufacturer' : 'Неизвестный производитель', oui: mac.slice(0, 8), formatted: mac });
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 2,
          borderRadius: 18
        }}
      >
        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
          {isEn ? 'Enter a MAC address to identify the device manufacturer' : 'Введите MAC-адрес для определения производителя устройства'}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder={isEn ? 'MAC address (00:1A:2B:3C:4D:5E)' : 'MAC-адрес (00:1A:2B:3C:4D:5E)'}
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
            error={!!error}
            helperText={error}
            slotProps={{
              htmlInput: { maxLength: 17, style: { fontFamily: 'monospace', textTransform: 'uppercase' } }
            }}
          />
          <Button
            variant="contained"
            onClick={handleLookup}
            startIcon={<SearchIcon />}
            sx={{ minWidth: 120, borderRadius: 10 }}
          >
            {isEn ? 'Search' : 'Найти'}
          </Button>
        </Box>

        <Button
          variant="outlined"
          onClick={handleRandom}
          startIcon={<CasinoIcon />}
          sx={{ mb: 2, borderRadius: 10 }}
        >
          {isEn ? 'Random MAC' : 'Случайный MAC'}
        </Button>

        {result && (
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 18,
              background: theme.palette.surfaceContainerLow
            }}
          >
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                  {isEn ? 'Manufacturer' : 'Производитель'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {result.manufacturer}
                  </Typography>
                  <CopyButton text={result.manufacturer} />
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                  {isEn ? 'OUI Prefix' : 'OUI-префикс'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontFamily: 'monospace', fontWeight: 500 }}>
                    {result.oui}
                  </Typography>
                  <CopyButton text={result.oui} />
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                  {isEn ? 'Formatted MAC' : 'Форматированный MAC'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontFamily: 'monospace', fontWeight: 500 }}>
                    {result.formatted}
                  </Typography>
                  <CopyButton text={result.formatted} />
                </Box>
              </Grid>
            </Grid>
          </Paper>
        )}
      </Paper>
    </Box>
  );
}
