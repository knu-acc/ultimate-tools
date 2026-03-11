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
  Divider,
  useTheme,
  alpha,
} from '@mui/material';

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

    steps.push(`\u041f\u0440\u043e\u043f\u043e\u0440\u0446\u0438\u044f: A/B = C/D`);
    steps.push(`\u041f\u0435\u0440\u0435\u043a\u0440\u0451\u0441\u0442\u043d\u043e\u0435 \u0443\u043c\u043d\u043e\u0436\u0435\u043d\u0438\u0435: A \u00d7 D = B \u00d7 C`);

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
      phi: PHI,
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
      steps.push(`\u041d\u043e\u0432\u044b\u0439 \u0440\u0430\u0437\u043c\u0435\u0440 = \u0418\u0441\u0445\u043e\u0434\u043d\u044b\u0439 \u00d7 \u041c\u0430\u0441\u0448\u0442\u0430\u0431`);
      steps.push(`= ${orig} \u00d7 ${factor} = ${result}`);
      return { label: '\u041d\u043e\u0432\u044b\u0439 \u0440\u0430\u0437\u043c\u0435\u0440', value: result, steps };
    } else if (origSize !== '' && scaleFactor === '' && newSize !== '') {
      if (isNaN(orig) || isNaN(target) || orig === 0) return null;
      const result = target / orig;
      steps.push(`\u041c\u0430\u0441\u0448\u0442\u0430\u0431 = \u041d\u043e\u0432\u044b\u0439 / \u0418\u0441\u0445\u043e\u0434\u043d\u044b\u0439`);
      steps.push(`= ${target} / ${orig} = ${result}`);
      return { label: '\u041c\u0430\u0441\u0448\u0442\u0430\u0431', value: result, steps };
    } else if (origSize === '' && scaleFactor !== '' && newSize !== '') {
      if (isNaN(factor) || isNaN(target) || factor === 0) return null;
      const result = target / factor;
      steps.push(`\u0418\u0441\u0445\u043e\u0434\u043d\u044b\u0439 = \u041d\u043e\u0432\u044b\u0439 / \u041c\u0430\u0441\u0448\u0442\u0430\u0431`);
      steps.push(`= ${target} / ${factor} = ${result}`);
      return { label: '\u0418\u0441\u0445\u043e\u0434\u043d\u044b\u0439 \u0440\u0430\u0437\u043c\u0435\u0440', value: result, steps };
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
          p: 3,
          mb: 3,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 3,
        }}
      >
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
          \u041f\u0440\u043e\u043f\u043e\u0440\u0446\u0438\u044f
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
          \u041e\u0441\u0442\u0430\u0432\u044c\u0442\u0435 \u043e\u0434\u043d\u043e \u043f\u043e\u043b\u0435 \u043f\u0443\u0441\u0442\u044b\u043c \u2014 \u043e\u043d\u043e \u0431\u0443\u0434\u0435\u0442 \u0432\u044b\u0447\u0438\u0441\u043b\u0435\u043d\u043e \u0430\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0447\u0435\u0441\u043a\u0438
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
          <TextField
            label="A"
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
            label="B"
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
            label="C"
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
            label="D"
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
            \u041e\u0447\u0438\u0441\u0442\u0438\u0442\u044c
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
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 3,
                background: alpha(theme.palette.primary.main, 0.04),
              }}
            >
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
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 3,
                background: alpha(theme.palette.info.main, 0.04),
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
                \u0420\u0435\u0448\u0435\u043d\u0438\u0435
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
                      backgroundColor: alpha(theme.palette.primary.main, 0.12),
                      color: 'primary.main',
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
          p: 3,
          mb: 3,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 3,
        }}
      >
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
          \u0417\u043e\u043b\u043e\u0442\u043e\u0435 \u0441\u0435\u0447\u0435\u043d\u0438\u0435
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
          \u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0447\u0438\u0441\u043b\u043e, \u0447\u0442\u043e\u0431\u044b \u043d\u0430\u0439\u0442\u0438 \u043f\u0430\u0440\u0443 \u043f\u043e \u0437\u043e\u043b\u043e\u0442\u043e\u043c\u0443 \u0441\u0435\u0447\u0435\u043d\u0438\u044e (\u03c6 \u2248 1,618)
        </Typography>
        <TextField
          fullWidth
          label="\u0427\u0438\u0441\u043b\u043e"
          type="number"
          value={goldenInput}
          onChange={(e) => setGoldenInput(e.target.value)}
          slotProps={{
            input: { sx: { fontFamily: 'monospace', fontSize: '1.1rem' } },
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
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 3,
                  background: alpha('#ff9800', 0.06),
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  \u041c\u0435\u043d\u044c\u0448\u0435\u0435 (\u00f7 \u03c6)
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, fontFamily: 'monospace', color: '#e65100' }}
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
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 3,
                  background: alpha('#9c27b0', 0.06),
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  \u0412\u0432\u0435\u0434\u0451\u043d\u043d\u043e\u0435
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, fontFamily: 'monospace', color: '#9c27b0' }}
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
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 3,
                  background: alpha('#ff9800', 0.06),
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  \u0411\u043e\u043b\u044c\u0448\u0435\u0435 (\u00d7 \u03c6)
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, fontFamily: 'monospace', color: '#e65100' }}
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
          p: 3,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 3,
        }}
      >
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
          \u041a\u0430\u043b\u044c\u043a\u0443\u043b\u044f\u0442\u043e\u0440 \u043c\u0430\u0441\u0448\u0442\u0430\u0431\u0430
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
          \u0417\u0430\u043f\u043e\u043b\u043d\u0438\u0442\u0435 \u0434\u0432\u0430 \u043f\u043e\u043b\u044f \u0438\u0437 \u0442\u0440\u0451\u0445 \u2014 \u0442\u0440\u0435\u0442\u044c\u0435 \u0432\u044b\u0447\u0438\u0441\u043b\u0438\u0442\u0441\u044f \u0430\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0447\u0435\u0441\u043a\u0438
        </Typography>

        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="\u0418\u0441\u0445\u043e\u0434\u043d\u044b\u0439 \u0440\u0430\u0437\u043c\u0435\u0440"
              type="number"
              value={origSize}
              onChange={(e) => setOrigSize(e.target.value)}
              slotProps={{ input: { sx: { fontFamily: 'monospace' } } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="\u041c\u0430\u0441\u0448\u0442\u0430\u0431 (\u043c\u043d\u043e\u0436\u0438\u0442\u0435\u043b\u044c)"
              type="number"
              value={scaleFactor}
              onChange={(e) => setScaleFactor(e.target.value)}
              slotProps={{ input: { sx: { fontFamily: 'monospace' } } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="\u041d\u043e\u0432\u044b\u0439 \u0440\u0430\u0437\u043c\u0435\u0440"
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
            \u041e\u0447\u0438\u0441\u0442\u0438\u0442\u044c
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
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 3,
                background: alpha(theme.palette.primary.main, 0.04),
              }}
            >
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
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 3,
                background: alpha(theme.palette.info.main, 0.04),
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
                      backgroundColor: alpha(theme.palette.primary.main, 0.12),
                      color: 'primary.main',
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
