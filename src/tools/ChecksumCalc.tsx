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
  Tooltip,
  Chip,
  Divider,
  Snackbar,
  useTheme,
  alpha
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { CopyButton } from '@/src/components/CopyButton';


// --- MD5 implementation (Web Crypto does not support MD5) ---
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

  const utf8 = unescape(encodeURIComponent(input));
  return binl2hex(binlMD5(str2binl(utf8), utf8.length * 8));
}

// --- CRC32 implementation ---
function crc32(str: string): string {
  const utf8 = new TextEncoder().encode(str);
  let crc = 0xffffffff;

  // Build table
  const table: number[] = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c;
  }

  for (let i = 0; i < utf8.length; i++) {
    crc = table[(crc ^ utf8[i]) & 0xff] ^ (crc >>> 8);
  }

  return ((crc ^ 0xffffffff) >>> 0).toString(16).padStart(8, '0');
}

// --- SHA via Web Crypto ---
async function sha(algorithm: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

interface HashResult {
  name: string;
  value: string;
  bits: number;
}

export default function ChecksumCalc() {
  const theme = useTheme();

  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState<HashResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [compareHash, setCompareHash] = useState('');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState('');

  const showSnack = (msg: string) => {
    setSnackMsg(msg);
    setSnackOpen(true);
  };

  const generateHashes = useCallback(async () => {
    if (!input) return;
    setLoading(true);
    try {
      const md5Hash = md5(input);
      const crc32Hash = crc32(input);
      const [sha1, sha256, sha512] = await Promise.all([
        sha('SHA-1', input),
        sha('SHA-256', input),
        sha('SHA-512', input),
      ]);
      setHashes([
        { name: 'MD5', value: md5Hash, bits: 128 },
        { name: 'SHA-1', value: sha1, bits: 160 },
        { name: 'SHA-256', value: sha256, bits: 256 },
        { name: 'SHA-512', value: sha512, bits: 512 },
        { name: 'CRC32', value: crc32Hash, bits: 32 },
      ]);
    } catch {
      setHashes([]);
    } finally {
      setLoading(false);
    }
  }, [input]);

  const copyHash = async (value: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedIdx(idx);
      showSnack('Скопировано в буфер обмена');
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch {
      showSnack('Не удалось скопировать');
    }
  };

  const compareNormalized = compareHash.trim().toLowerCase();
  const matchResult = (hash: HashResult) => {
    if (!compareNormalized) return null;
    return hash.value.toLowerCase() === compareNormalized;
  };

  const anyMatch = hashes.length > 0 && compareNormalized
    ? hashes.some((h) => matchResult(h) === true)
    : null;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          background: theme.palette.surfaceContainerLow,
          borderRadius: 3
        }}
      >
        {/* Input */}
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
          Исходный текст
        </Typography>
        <TextField
          multiline
          rows={6}
          fullWidth
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setHashes([]);
          }}
          placeholder="Введите текст для вычисления контрольных сумм..."
          sx={{
            mb: 2,
            '& .MuiInputBase-root': {
              fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
              fontSize: '0.85rem',
              lineHeight: 1.6
            }
          }}
        />

        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Button
            variant="contained"
            onClick={generateHashes}
            disabled={!input.trim() || loading}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            {loading ? 'Вычисление...' : 'Вычислить хеши'}
          </Button>
        </Box>

        {input.trim() && (
          <Box sx={{ mb: 2 }}>
            <Chip
              size="small"
              label={`${new TextEncoder().encode(input).length} байт`}
              variant="outlined"
              sx={{ fontSize: '0.75rem', mr: 1 }}
            />
            <Chip
              size="small"
              label={`${input.length} символов`}
              variant="outlined"
              sx={{ fontSize: '0.75rem' }}
            />
          </Box>
        )}

        {/* Hash Results */}
        {hashes.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Контрольные суммы
            </Typography>

            <Grid container spacing={2}>
              {hashes.map((hash, idx) => {
                const match = matchResult(hash);
                return (
                  <Grid size={{ xs: 12, md: 6 }} key={hash.name}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        border: `1px solid ${
                          match === true
                            ? '#2e7d32'
                            : match === false
                            ? '#c62828'
                            : theme.palette.divider
                        }`,
                        borderRadius: 3,
                        background:
                          match === true
                            ? alpha('#2e7d32', 0.06)
                            : match === false
                            ? alpha('#c62828', 0.04)
                            : theme.palette.background.default,
                        transition: 'border-color 200ms ease, background 200ms ease',
                        '&:hover': {
                          borderColor: match === null ? theme.palette.primary.main : undefined
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
                          {match === true && (
                            <CheckCircleIcon sx={{ fontSize: 18, color: '#2e7d32' }} />
                          )}
                          {match === false && compareNormalized && (
                            <CancelIcon sx={{ fontSize: 18, color: '#c62828' }} />
                          )}
                        </Box>
                        <CopyButton text={hash.value} />
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: '"JetBrains Mono", monospace',
                          fontSize: '0.78rem',
                          wordBreak: 'break-all',
                          lineHeight: 1.6,
                          color: 'text.primary',
                          userSelect: 'all'
                        }}
                      >
                        {hash.value}
                      </Typography>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>

            {/* Compare mode */}
            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Сравнение
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              Вставьте ожидаемый хеш для проверки совпадения
            </Typography>

            <TextField
              fullWidth
              size="small"
              label="Ожидаемый хеш"
              value={compareHash}
              onChange={(e) => setCompareHash(e.target.value)}
              placeholder="Вставьте хеш для сравнения..."
              sx={{
                '& .MuiInputBase-root': {
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '0.85rem'
                }
              }}
            />

            {compareNormalized && hashes.length > 0 && (
              <Box sx={{ mt: 1.5 }}>
                {anyMatch ? (
                  <Chip
                    icon={<CheckCircleIcon />}
                    label="Совпадение найдено"
                    size="small"
                    color="success"
                    variant="outlined"
                  />
                ) : (
                  <Chip
                    icon={<CancelIcon />}
                    label="Совпадений не найдено"
                    size="small"
                    color="error"
                    variant="outlined"
                  />
                )}
              </Box>
            )}
          </>
        )}
      </Paper>

      <Snackbar
        open={snackOpen}
        autoHideDuration={2000}
        onClose={() => setSnackOpen(false)}
        message={snackMsg}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
}
