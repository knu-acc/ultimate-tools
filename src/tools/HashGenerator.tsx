'use client';

import { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  IconButton,
  Switch,
  FormControlLabel,
  Grid,
  Tooltip,
  useTheme,
  alpha
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { CopyButton, ShareButton } from '@/src/components/CopyButton';


// Compact MD5 implementation (Web Crypto API does not support MD5)
function md5(input: string): string {
  function safeAdd(x: number, y: number) {
    const lsw = (x & 0xffff) + (y & 0xffff);
    return (((x >> 16) + (y >> 16) + (lsw >> 16)) << 16) | (lsw & 0xffff);
  }
  function bitRotateLeft(num: number, cnt: number) {
    return (num << cnt) | (num >>> (32 - cnt));
  }
  function md5cmn(q: number, a: number, b: number, x: number, s: number, t: number) {
    return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
  }
  function md5ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return md5cmn((b & c) | (~b & d), a, b, x, s, t);
  }
  function md5gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return md5cmn((b & d) | (c & ~d), a, b, x, s, t);
  }
  function md5hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return md5cmn(b ^ c ^ d, a, b, x, s, t);
  }
  function md5ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return md5cmn(c ^ (b | ~d), a, b, x, s, t);
  }

  function binlMD5(x: number[], len: number) {
    x[len >> 5] |= 0x80 << (len % 32);
    x[(((len + 64) >>> 9) << 4) + 14] = len;
    let a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
    for (let i = 0; i < x.length; i += 16) {
      const olda = a, oldb = b, oldc = c, oldd = d;
      a = md5ff(a, b, c, d, x[i],      7, -680876936);
      d = md5ff(d, a, b, c, x[i + 1],  12, -389564586);
      c = md5ff(c, d, a, b, x[i + 2],  17, 606105819);
      b = md5ff(b, c, d, a, x[i + 3],  22, -1044525330);
      a = md5ff(a, b, c, d, x[i + 4],  7, -176418897);
      d = md5ff(d, a, b, c, x[i + 5],  12, 1200080426);
      c = md5ff(c, d, a, b, x[i + 6],  17, -1473231341);
      b = md5ff(b, c, d, a, x[i + 7],  22, -45705983);
      a = md5ff(a, b, c, d, x[i + 8],  7, 1770035416);
      d = md5ff(d, a, b, c, x[i + 9],  12, -1958414417);
      c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
      b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
      a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
      d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
      c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
      b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);

      a = md5gg(a, b, c, d, x[i + 1],  5, -165796510);
      d = md5gg(d, a, b, c, x[i + 6],  9, -1069501632);
      c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
      b = md5gg(b, c, d, a, x[i],      20, -373897302);
      a = md5gg(a, b, c, d, x[i + 5],  5, -701558691);
      d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
      c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
      b = md5gg(b, c, d, a, x[i + 4],  20, -405537848);
      a = md5gg(a, b, c, d, x[i + 9],  5, 568446438);
      d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
      c = md5gg(c, d, a, b, x[i + 3],  14, -187363961);
      b = md5gg(b, c, d, a, x[i + 8],  20, 1163531501);
      a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
      d = md5gg(d, a, b, c, x[i + 2],  9, -51403784);
      c = md5gg(c, d, a, b, x[i + 7],  14, 1735328473);
      b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);

      a = md5hh(a, b, c, d, x[i + 5],  4, -378558);
      d = md5hh(d, a, b, c, x[i + 8],  11, -2022574463);
      c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
      b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
      a = md5hh(a, b, c, d, x[i + 1],  4, -1530992060);
      d = md5hh(d, a, b, c, x[i + 4],  11, 1272893353);
      c = md5hh(c, d, a, b, x[i + 7],  16, -155497632);
      b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
      a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
      d = md5hh(d, a, b, c, x[i],      11, -358537222);
      c = md5hh(c, d, a, b, x[i + 3],  16, -722521979);
      b = md5hh(b, c, d, a, x[i + 6],  23, 76029189);
      a = md5hh(a, b, c, d, x[i + 9],  4, -640364487);
      d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
      c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
      b = md5hh(b, c, d, a, x[i + 2],  23, -995338651);

      a = md5ii(a, b, c, d, x[i],      6, -198630844);
      d = md5ii(d, a, b, c, x[i + 7],  10, 1126891415);
      c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
      b = md5ii(b, c, d, a, x[i + 5],  21, -57434055);
      a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
      d = md5ii(d, a, b, c, x[i + 3],  10, -1894986606);
      c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
      b = md5ii(b, c, d, a, x[i + 1],  21, -2054922799);
      a = md5ii(a, b, c, d, x[i + 8],  6, 1873313359);
      d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
      c = md5ii(c, d, a, b, x[i + 6],  15, -1560198380);
      b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
      a = md5ii(a, b, c, d, x[i + 4],  6, -145523070);
      d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
      c = md5ii(c, d, a, b, x[i + 2],  15, 718787259);
      b = md5ii(b, c, d, a, x[i + 9],  21, -343485551);

      a = safeAdd(a, olda);
      b = safeAdd(b, oldb);
      c = safeAdd(c, oldc);
      d = safeAdd(d, oldd);
    }
    return [a, b, c, d];
  }

  function str2binl(str: string) {
    const bin: number[] = [];
    const mask = (1 << 8) - 1;
    for (let i = 0; i < str.length * 8; i += 8) {
      bin[i >> 5] |= (str.charCodeAt(i / 8) & mask) << (i % 32);
    }
    return bin;
  }

  function binl2hex(binarray: number[]) {
    const hexTab = '0123456789abcdef';
    let str = '';
    for (let i = 0; i < binarray.length * 4; i++) {
      str +=
        hexTab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xf) +
        hexTab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xf);
    }
    return str;
  }

  // Encode to UTF-8 bytes first
  const utf8 = unescape(encodeURIComponent(input));
  return binl2hex(binlMD5(str2binl(utf8), utf8.length * 8));
}

async function sha(algorithm: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

interface HashResult {
  name: string;
  algorithm: string;
  value: string;
  bits: number;
}

export default function HashGenerator() {
  const theme = useTheme();
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState<HashResult[]>([]);
  const [uppercase, setUppercase] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const generateHashes = useCallback(async () => {
    if (!input) return;
    setLoading(true);
    try {
      const md5Hash = md5(input);
      const [sha1, sha256, sha512] = await Promise.all([
        sha('SHA-1', input),
        sha('SHA-256', input),
        sha('SHA-512', input),
      ]);
      setHashes([
        { name: 'MD5', algorithm: 'MD5', value: md5Hash, bits: 128 },
        { name: 'SHA-1', algorithm: 'SHA-1', value: sha1, bits: 160 },
        { name: 'SHA-256', algorithm: 'SHA-256', value: sha256, bits: 256 },
        { name: 'SHA-512', algorithm: 'SHA-512', value: sha512, bits: 512 },
      ]);
    } catch {
      setHashes([]);
    } finally {
      setLoading(false);
    }
  }, [input]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput(e.target.value);
      setHashes([]);
    },
    []
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && e.ctrlKey) {
        generateHashes();
      }
    },
    [generateHashes]
  );

  const copyHash = async (value: string, idx: number) => {
    const text = uppercase ? value.toUpperCase() : value;
    await navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const formatHash = (value: string) => (uppercase ? value.toUpperCase() : value);

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          background: theme.palette.surfaceContainerLow
        }}
      >
        {/* Input */}
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: 'text.secondary' }}>
          Исходный текст
        </Typography>
        <TextField
          multiline
          rows={5}
          fullWidth
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Введите текст для хеширования..."
          sx={{
            mb: 2,
            '& .MuiInputBase-root': { fontFamily: 'monospace', fontSize: '0.875rem' }
          }}
        />

        {/* Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
          <Box
            component="button"
            onClick={generateHashes}
            disabled={!input.trim() || loading}
            sx={{
              px: 3,
              py: 1,
              border: 'none',
              borderRadius: 2,
              cursor: !input.trim() || loading ? 'not-allowed' : 'pointer',
              fontWeight: 600,
              fontSize: '0.875rem',
              color: theme.palette.primary.contrastText,
              background: !input.trim() || loading
                ? theme.palette.action.disabledBackground
                : theme.palette.primary.main,
              '&:hover': {
                background: !input.trim() || loading
                  ? undefined
                  : theme.palette.primary.dark
              },
              transition: 'background 200ms ease'
            }}
          >
            {loading ? 'Генерация...' : 'Сгенерировать хеши'}
          </Box>
          <FormControlLabel
            control={
              <Switch
                checked={uppercase}
                onChange={(e) => setUppercase(e.target.checked)}
                size="small"
              />
            }
            label={
              <Typography variant="body2" color="text.secondary">
                Верхний регистр
              </Typography>
            }
          />
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
          Подсказка: Ctrl + Enter для быстрой генерации
        </Typography>

        {/* Hash Results */}
        {hashes.length > 0 && (
          <Grid container spacing={2}>
            {hashes.map((hash, idx) => (
              <Grid size={{ xs: 12, md: 6 }} key={hash.algorithm}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    background: theme.palette.background.default,
                    transition: 'border-color 200ms ease',
                    '&:hover': {
                      borderColor: theme.palette.primary.main
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {hash.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          px: 1,
                          py: 0.25,
                          borderRadius: 1,
                          background: alpha(theme.palette.primary.main, 0.1),
                          color: theme.palette.primary.main,
                          fontWeight: 500
                        }}
                      >
                        {hash.bits} бит
                      </Typography>
                    </Box>
                    <CopyButton text={hash.value} />
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: 'monospace',
                      fontSize: '0.8rem',
                      wordBreak: 'break-all',
                      lineHeight: 1.6,
                      color: 'text.primary',
                      userSelect: 'all'
                    }}
                  >
                    {formatHash(hash.value)}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Empty state */}
        {hashes.length === 0 && input.trim() && !loading && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Нажмите &laquo;Сгенерировать хеши&raquo; для получения результатов
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
