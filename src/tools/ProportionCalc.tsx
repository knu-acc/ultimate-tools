'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Grid,
  Button,
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import { CopyButton } from '@/src/components/CopyButton';

const PHI = (1 + Math.sqrt(5)) / 2;

export default function ProportionCalc() {
  const theme = useTheme();

  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [c, setC] = useState('');
  const [d, setD] = useState('');

  const [goldenInput, setGoldenInput] = useState('');

  const [origSize, setOrigSize] = useState('');
  const [scaleFactor, setScaleFactor] = useState('');
  const [newSize, setNewSize] = useState('');

  // Proportion: A/B = C/D - find the missing value
  const proportionResult = useMemo(() => {
    const vals = [a, b, c, d].map((v) => (v === '' ? null : parseFloat(v)));
    const emptyCount = vals.filter((v) => v === null).length;

    if (emptyCount !== 1) return null;

    const [va, vb, vc, vd] = vals;
    const steps: string[] = [];
    let missing: number;
    let missingLabel: string;

    steps.push(`Пропорция: A/B = C/D`);
    steps.push(`Перекрёстное умножение: A \u00d7 D = B \u00d7 C`);

    if (va === null && vb !== null && vc !== null && vd !== null) {
      if (vd === 0) return null;
      missing = (vb * vc) / vd;
      missingLabel = 'A';
      steps.push(`A = (B \u00d7 C) / D = (${vb} \u00d7 ${vc}) / ${vd} = ${missing}`);
    } else if (vb === null && va !== null && vc !== null && vd !== null) {
      if (vc === 0) return null;
      missing = (va * vd) / vc;
      missingLabel = 'B';
      steps.push(`B = (A \u00d7 D) / C = (${va} \u00d7 ${vd}) / ${vc} = ${missing}`);
    } else if (vc === null && va !== null && vb !== null && vd !== null) {
      if (vb === 0) return null;
      missing = (va * vd) / vb;
      missingLabel = 'C';
      steps.push(`C = (A \u00d7 D) / B = (${va} \u00d7 ${vd}) / ${vb} = ${missing}`);
    } else if (vd === null && va !== null && vb !== null && vc !== null) {
      if (va === 0) return null;
      missing = (vb * vc) / va;
      missingLabel = 'D';
      steps.push(`D = (B \u00d7 C) / A = (${vb} \u00d7 ${vc}) / ${va} = ${missing}`);
    } else {
      return null;
    }

    return { missing, missingLabel, steps };
  }, [a, b, c, d]);

  // Golden ratio
  const goldenResult = useMemo(() => {
    const val = parseFloat(goldenInput);
    if (isNaN(val) || val <= 0) return null;
    return {
      larger: val * PHI,
      smaller: val / PHI,
      phi: PHI
    };
  }, [goldenInput]);

  // Scale calculator
  const scaleResult = useMemo(() => {
    const orig = parseFloat(origSize);
    const factor = parseFloat(scaleFactor);
    const target = parseFloat(newSize);

    const filledCount = [origSize, scaleFactor, newSize].filter((v) => v !== '').length;
    if (filledCount !== 2) return null;

    const steps: string[] = [];

    if (origSize !== '' && scaleFactor !== '' && newSize === '') {
      if (isNaN(orig) || isNaN(factor)) return null;
      const result = orig * factor;
      steps.push(`Новый размер = Исходный \u00d7 Масштаб`);
      steps.push(`= ${orig} \u00d7 ${factor} = ${result}`);
      return { label: 'Новый размер', value: result, steps };
    } else if (origSize !== '' && scaleFactor === '' && newSize !== '') {
      if (isNaN(orig) || isNaN(target) || orig === 0) return null;
      const result = target / orig;
      steps.push(`Масштаб = Новый / Исходный`);
      steps.push(`= ${target} / ${orig} = ${result}`);
      return { label: 'Масштаб', value: result, steps };
    } else if (origSize === '' && scaleFactor !== '' && newSize !== '') {
      if (isNaN(factor) || isNaN(target) || factor === 0) return null;
      const result = target / factor;
      steps.push(`Исходный = Новый / Масштаб`);
      steps.push(`= ${target} / ${factor} = ${result}`);
      return { label: 'Исходный размер', value: result, steps };
    }
    return null;
  }, [origSize, scaleFactor, newSize]);

  const formatNum = (n: number) => {
    if (Number.isInteger(n)) return n.toLocaleString('ru-RU');
    return n.toLocaleString('ru-RU', { maximumFractionDigits: 6 });
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Proportion calculator */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 2,
          borderRadius: 3,
          background: theme.palette.surfaceContainerLow
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Пропорция
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
          <TextField
            placeholder="A"
            type="number"
            value={a}
            onChange={(e) => setA(e.target.value)}
            size="small"
            sx={{ width: 100 }}
            slotProps={{ input: { sx: { fontFamily: 'monospace', textAlign: 'center' } } }}
          />
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.secondary' }}>
            /
          </Typography>
          <TextField
            placeholder="B"
            type="number"
            value={b}
            onChange={(e) => setB(e.target.value)}
            size="small"
            sx={{ width: 100 }}
            slotProps={{ input: { sx: { fontFamily: 'monospace', textAlign: 'center' } } }}
          />
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.secondary', mx: 1 }}>
            =
          </Typography>
          <TextField
            placeholder="C"
            type="number"
            value={c}
            onChange={(e) => setC(e.target.value)}
            size="small"
            sx={{ width: 100 }}
            slotProps={{ input: { sx: { fontFamily: 'monospace', textAlign: 'center' } } }}
          />
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.secondary' }}>
            /
          </Typography>
          <TextField
            placeholder="D"
            type="number"
            value={d}
            onChange={(e) => setD(e.target.value)}
            size="small"
            sx={{ width: 100 }}
            slotProps={{ input: { sx: { fontFamily: 'monospace', textAlign: 'center' } } }}
          />
        </Box>

        <Box sx={{ mt: 1.5, textAlign: 'center' }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => { setA(''); setB(''); setC(''); setD(''); }}
            sx={{ textTransform: 'none' }}
          >
            Очистить
          </Button>
        </Box>

        {proportionResult && (
          <>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                mt: 2,
                textAlign: 'center',
                borderRadius: 3,
                background: theme.palette.surfaceContainerLow,
                position: 'relative'
              }}
            >
              <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                <CopyButton text={proportionResult.missing.toString()} />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                {proportionResult.missingLabel} =
              </Typography>
              <Typography
                variant="h3"
                sx={{ fontWeight: 700, fontFamily: 'monospace', color: 'primary.main' }}
              >
                {formatNum(proportionResult.missing)}
              </Typography>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 2,
                mt: 2,
                borderRadius: 3,
                background: alpha(theme.palette.info.main, 0.04)
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
                Решение
              </Typography>
              {proportionResult.steps.map((step, idx) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Chip
                    label={idx + 1}
                    size="small"
                    sx={{
                      minWidth: 24,
                      height: 22,
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      backgroundColor: theme.palette.surfaceContainerHigh,
                      color: 'primary.main'
                    }}
                  />
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                    {step}
                  </Typography>
                </Box>
              ))}
            </Paper>
          </>
        )}
      </Paper>

      {/* Golden ratio */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 2,
          borderRadius: 3,
          background: theme.palette.surfaceContainerLow
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Золотое сечение
          </Typography>
          <Chip label={`\u03c6 \u2248 1,618`} size="small" variant="outlined" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }} />
        </Box>
        <TextField
          fullWidth
          placeholder="100"
          type="number"
          value={goldenInput}
          onChange={(e) => setGoldenInput(e.target.value)}
          slotProps={{
            input: { sx: { fontFamily: 'monospace', fontSize: '1.1rem' } }
          }}
        />

        {goldenResult && (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  textAlign: 'center',
                  borderRadius: 3,
                  background: alpha(theme.palette.warning.main, 0.06),
                  position: 'relative'
                }}
              >
                <Box sx={{ position: 'absolute', top: 4, right: 4 }}>
                  <CopyButton text={goldenResult.smaller.toString()} />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Меньшее (/ \u03c6)
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, fontFamily: 'monospace', color: theme.palette.warning.dark }}
                >
                  {formatNum(goldenResult.smaller)}
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  textAlign: 'center',
                  borderRadius: 3,
                  background: alpha(theme.palette.secondary.main, 0.06)
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Введённое
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, fontFamily: 'monospace', color: theme.palette.secondary.main }}
                >
                  {goldenInput}
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  textAlign: 'center',
                  borderRadius: 3,
                  background: alpha(theme.palette.warning.main, 0.06),
                  position: 'relative'
                }}
              >
                <Box sx={{ position: 'absolute', top: 4, right: 4 }}>
                  <CopyButton text={goldenResult.larger.toString()} />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Большее (* \u03c6)
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, fontFamily: 'monospace', color: theme.palette.warning.dark }}
                >
                  {formatNum(goldenResult.larger)}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Paper>

      {/* Scale calculator */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
          background: theme.palette.surfaceContainerLow
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Калькулятор масштаба
        </Typography>

        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              placeholder="Исходный"
              type="number"
              value={origSize}
              onChange={(e) => setOrigSize(e.target.value)}
              slotProps={{ input: { sx: { fontFamily: 'monospace' } } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              placeholder="Масштаб"
              type="number"
              value={scaleFactor}
              onChange={(e) => setScaleFactor(e.target.value)}
              slotProps={{ input: { sx: { fontFamily: 'monospace' } } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              placeholder="Новый"
              type="number"
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              slotProps={{ input: { sx: { fontFamily: 'monospace' } } }}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 1.5, textAlign: 'center' }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => { setOrigSize(''); setScaleFactor(''); setNewSize(''); }}
            sx={{ textTransform: 'none' }}
          >
            Очистить
          </Button>
        </Box>

        {scaleResult && (
          <>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                mt: 2,
                textAlign: 'center',
                borderRadius: 3,
                background: theme.palette.surfaceContainerLow,
                position: 'relative'
              }}
            >
              <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                <CopyButton text={scaleResult.value.toString()} />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                {scaleResult.label}
              </Typography>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, fontFamily: 'monospace', color: 'primary.main' }}
              >
                {formatNum(scaleResult.value)}
              </Typography>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 2,
                mt: 2,
                borderRadius: 3,
                background: alpha(theme.palette.info.main, 0.04)
              }}
            >
              {scaleResult.steps.map((step, idx) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Chip
                    label={idx + 1}
                    size="small"
                    sx={{
                      minWidth: 24,
                      height: 22,
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      backgroundColor: theme.palette.surfaceContainerHigh,
                      color: 'primary.main'
                    }}
                  />
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                    {step}
                  </Typography>
                </Box>
              ))}
            </Paper>
          </>
        )}
      </Paper>
    </Box>
  );
}
