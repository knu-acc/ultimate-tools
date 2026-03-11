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
  useTheme,
  alpha
} from '@mui/material';
import { CopyButton } from '@/src/components/CopyButton';

const UNITS = [
  { id: 'watt', name: 'Ватты', short: 'Вт', factor: 1 },
  { id: 'kw', name: 'Киловатты', short: 'кВт', factor: 1000 },
  { id: 'mw', name: 'Мегаватты', short: 'МВт', factor: 1e6 },
  { id: 'hp', name: 'Лошадиные силы', short: 'л.с.', factor: 745.7 },
  { id: 'btu_h', name: 'BTU/час', short: 'BTU/ч', factor: 0.293071 },
  { id: 'cal_s', name: 'Калории/сек', short: 'кал/с', factor: 4.184 },
  { id: 'ft_lbs', name: 'Фут-фунты/сек', short: 'ft·lbf/s', factor: 1.35582 },
];

function fmt(v: number): string {
  if (v === 0) return '0';
  if (Math.abs(v) >= 1e6 || (Math.abs(v) < 0.0001 && v !== 0)) return v.toExponential(4);
  return parseFloat(v.toPrecision(10)).toString();
}

export default function PowerConverter() {
  const theme = useTheme();
  const [value, setValue] = useState('1');
  const [fromUnit, setFromUnit] = useState('kw');

  const num = parseFloat(value);
  const valid = value !== '' && !isNaN(num) && isFinite(num) && num >= 0;
  const source = UNITS.find(u => u.id === fromUnit)!;

  const results = UNITS.filter(u => u.id !== fromUnit).map(u => ({
    ...u,
    converted: valid ? (num * source.factor / u.factor) : 0,
    formatted: valid ? fmt(num * source.factor / u.factor) : '—'
  }));

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 2,
          background: theme.palette.surfaceContainerLow,
          borderRadius: 3
        }}
      >
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            value={value}
            onChange={e => {
              if (e.target.value === '' || /^-?\d*\.?\d*$/.test(e.target.value)) setValue(e.target.value);
            }}
            placeholder="1"
            error={value !== '' && !valid}
            sx={{
              flex: 1,
              minWidth: 180,
              '& .MuiInputBase-root': { fontFamily: 'monospace', fontSize: '1.2rem' }
            }}
            slotProps={{
              input: {
                endAdornment: (
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary', whiteSpace: 'nowrap' }}>
                    {source.short}
                  </Typography>
                )
              }
            }}
          />
          <Select
            value={fromUnit}
            onChange={e => setFromUnit(e.target.value)}
            sx={{ minWidth: 200 }}
          >
            {UNITS.map(u => (
              <MenuItem key={u.id} value={u.id}>
                {u.name} ({u.short})
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Paper>

      {valid && (
        <Grid container spacing={1.5}>
          {results.map(r => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={r.id}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  transition: 'all 200ms ease',
                  '&:hover': { background: alpha(theme.palette.primary.main, 0.04) }
                }}
              >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                    {r.name}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '1.1rem', wordBreak: 'break-all' }}
                  >
                    {r.formatted}
                    <Typography component="span" variant="body2" sx={{ ml: 0.5, color: 'text.secondary', fontWeight: 400 }}>
                      {r.short}
                    </Typography>
                  </Typography>
                </Box>
                <CopyButton text={r.formatted} />
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
