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
  Tabs,
  Tab,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';

interface TabPanelProps {
  children: React.ReactNode;
  value: number;
  index: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  if (value !== index) return null;
  return <Box sx={{ pt: 3 }}>{children}</Box>;
}

interface LinearResult {
  x: number;
  steps: string[];
}

interface QuadraticResult {
  discriminant: number;
  roots: number[];
  steps: string[];
  type: 'two' | 'one' | 'none';
}

export default function EquationSolver() {
  const theme = useTheme();
  const [tab, setTab] = useState(0);

  // Linear: ax + b = 0
  const [linA, setLinA] = useState('');
  const [linB, setLinB] = useState('');
  const [linSolved, setLinSolved] = useState(false);

  // Quadratic: ax² + bx + c = 0
  const [quadA, setQuadA] = useState('');
  const [quadB, setQuadB] = useState('');
  const [quadC, setQuadC] = useState('');
  const [quadSolved, setQuadSolved] = useState(false);

  const formatNum = (n: number): string => {
    if (Number.isInteger(n)) return n.toString();
    return parseFloat(n.toFixed(6)).toString();
  };

  const linearResult = useMemo<LinearResult | string | null>(() => {
    if (!linSolved) return null;
    const a = parseFloat(linA);
    const b = parseFloat(linB);
    if (isNaN(a) || isNaN(b)) return 'Введите корректные числа';

    const steps: string[] = [];
    steps.push(`Уравнение: ${formatNum(a)}x + ${formatNum(b)} = 0`);

    if (a === 0) {
      if (b === 0) {
        steps.push('0 = 0 — тождество');
        return { x: NaN, steps } as unknown as string;
      }
      steps.push(`${formatNum(b)} = 0 — противоречие`);
      return 'Уравнение не имеет решений (a = 0, b ≠ 0)';
    }

    steps.push(`${formatNum(a)}x = ${formatNum(-b)}`);
    const x = -b / a;
    steps.push(`x = ${formatNum(-b)} / ${formatNum(a)}`);
    steps.push(`x = ${formatNum(x)}`);
    return { x, steps };
  }, [linA, linB, linSolved]);

  const quadraticResult = useMemo<QuadraticResult | string | null>(() => {
    if (!quadSolved) return null;
    const a = parseFloat(quadA);
    const b = parseFloat(quadB);
    const c = parseFloat(quadC);
    if (isNaN(a) || isNaN(b) || isNaN(c)) return 'Введите корректные числа';
    if (a === 0) return 'Коэффициент a не может быть равен 0 (это линейное уравнение)';

    const steps: string[] = [];
    steps.push(`Уравнение: ${formatNum(a)}x² + ${formatNum(b)}x + ${formatNum(c)} = 0`);

    const D = b * b - 4 * a * c;
    steps.push(`D = b² − 4ac = ${formatNum(b)}² − 4·${formatNum(a)}·${formatNum(c)} = ${formatNum(D)}`);

    if (D < 0) {
      steps.push('D < 0 — уравнение не имеет действительных корней');
      return { discriminant: D, roots: [], steps, type: 'none' };
    }

    if (D === 0) {
      const x = -b / (2 * a);
      steps.push(`D = 0 — один корень (два совпадающих)`);
      steps.push(`x = −b / (2a) = ${formatNum(-b)} / ${formatNum(2 * a)} = ${formatNum(x)}`);
      return { discriminant: D, roots: [x], steps, type: 'one' };
    }

    const sqrtD = Math.sqrt(D);
    steps.push(`√D = ${formatNum(sqrtD)}`);

    const x1 = (-b + sqrtD) / (2 * a);
    const x2 = (-b - sqrtD) / (2 * a);
    steps.push(`x₁ = (−b + √D) / (2a) = (${formatNum(-b)} + ${formatNum(sqrtD)}) / ${formatNum(2 * a)} = ${formatNum(x1)}`);
    steps.push(`x₂ = (−b − √D) / (2a) = (${formatNum(-b)} − ${formatNum(sqrtD)}) / ${formatNum(2 * a)} = ${formatNum(x2)}`);

    return { discriminant: D, roots: [x1, x2], steps, type: 'two' };
  }, [quadA, quadB, quadC, quadSolved]);

  const StepsList = ({ steps }: { steps: string[] }) => (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        mt: 2,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 3,
        background: alpha(theme.palette.info.main, 0.04),
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5, color: 'text.secondary' }}>
        Пошаговое решение
      </Typography>
      {steps.map((step, i) => (
        <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1 }}>
          <Chip
            label={i + 1}
            size="small"
            sx={{
              minWidth: 28,
              height: 24,
              fontSize: '0.75rem',
              fontWeight: 700,
              backgroundColor: alpha(theme.palette.primary.main, 0.12),
              color: 'primary.main',
            }}
          />
          <Typography
            variant="body2"
            sx={{ fontFamily: 'monospace', fontSize: '0.9rem', pt: 0.2 }}
          >
            {step}
          </Typography>
        </Box>
      ))}
    </Paper>
  );

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          border: `1px solid ${theme.palette.divider}`,
          background: alpha(theme.palette.primary.main, 0.04),
        }}
      >
        <Tabs
          value={tab}
          onChange={(_, v) => {
            setTab(v);
            setLinSolved(false);
            setQuadSolved(false);
          }}
          sx={{
            mb: 1,
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 500, minWidth: 'auto' },
          }}
        >
          <Tab label="Линейное (ax + b = 0)" />
          <Tab label="Квадратное (ax² + bx + c = 0)" />
        </Tabs>

        <Divider />

        {/* Linear equation */}
        <TabPanel value={tab} index={0}>
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            Решение линейного уравнения вида ax + b = 0
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 5 }}>
              <TextField
                fullWidth
                label="Коэффициент a"
                type="number"
                value={linA}
                onChange={(e) => { setLinA(e.target.value); setLinSolved(false); }}
                placeholder="2"
              />
            </Grid>
            <Grid size={{ xs: 2 }} sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">x +</Typography>
            </Grid>
            <Grid size={{ xs: 5 }}>
              <TextField
                fullWidth
                label="Коэффициент b"
                type="number"
                value={linB}
                onChange={(e) => { setLinB(e.target.value); setLinSolved(false); }}
                placeholder="-6"
              />
            </Grid>
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 1 }}>
            <Typography variant="body2" color="text.secondary">= 0</Typography>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => setLinSolved(true)}
              disabled={!linA && !linB}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Решить уравнение
            </Button>
          </Box>

          {typeof linearResult === 'string' && (
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                mt: 2,
                textAlign: 'center',
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 3,
                background: alpha(theme.palette.error.main, 0.06),
              }}
            >
              <Typography variant="body1" sx={{ color: 'error.main', fontWeight: 600 }}>
                {linearResult}
              </Typography>
            </Paper>
          )}

          {linearResult && typeof linearResult === 'object' && 'x' in linearResult && !isNaN((linearResult as LinearResult).x) && (
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
                  Решение
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  x = {formatNum((linearResult as LinearResult).x)}
                </Typography>
              </Paper>
              <StepsList steps={(linearResult as LinearResult).steps} />
            </>
          )}
        </TabPanel>

        {/* Quadratic equation */}
        <TabPanel value={tab} index={1}>
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            Решение квадратного уравнения вида ax² + bx + c = 0
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 3 }}>
              <TextField
                fullWidth
                label="a"
                type="number"
                value={quadA}
                onChange={(e) => { setQuadA(e.target.value); setQuadSolved(false); }}
                placeholder="1"
              />
            </Grid>
            <Grid size={{ xs: 1 }} sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">x² +</Typography>
            </Grid>
            <Grid size={{ xs: 3 }}>
              <TextField
                fullWidth
                label="b"
                type="number"
                value={quadB}
                onChange={(e) => { setQuadB(e.target.value); setQuadSolved(false); }}
                placeholder="-5"
              />
            </Grid>
            <Grid size={{ xs: 1 }} sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">x +</Typography>
            </Grid>
            <Grid size={{ xs: 3 }}>
              <TextField
                fullWidth
                label="c"
                type="number"
                value={quadC}
                onChange={(e) => { setQuadC(e.target.value); setQuadSolved(false); }}
                placeholder="6"
              />
            </Grid>
            <Grid size={{ xs: 1 }} sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">= 0</Typography>
            </Grid>
          </Grid>
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => setQuadSolved(true)}
              disabled={!quadA && !quadB && !quadC}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Решить уравнение
            </Button>
          </Box>

          {typeof quadraticResult === 'string' && (
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                mt: 2,
                textAlign: 'center',
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 3,
                background: alpha(theme.palette.error.main, 0.06),
              }}
            >
              <Typography variant="body1" sx={{ color: 'error.main', fontWeight: 600 }}>
                {quadraticResult}
              </Typography>
            </Paper>
          )}

          {quadraticResult && typeof quadraticResult === 'object' && 'discriminant' in quadraticResult && (
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
                <Box sx={{ mb: 1.5 }}>
                  <Chip
                    label={`D = ${formatNum((quadraticResult as QuadraticResult).discriminant)}`}
                    color={
                      (quadraticResult as QuadraticResult).type === 'none'
                        ? 'error'
                        : (quadraticResult as QuadraticResult).type === 'one'
                          ? 'warning'
                          : 'success'
                    }
                    variant="outlined"
                    sx={{ fontFamily: 'monospace', fontWeight: 600 }}
                  />
                </Box>
                {(quadraticResult as QuadraticResult).type === 'none' && (
                  <Typography variant="h6" sx={{ color: 'error.main', fontWeight: 600 }}>
                    Нет действительных корней
                  </Typography>
                )}
                {(quadraticResult as QuadraticResult).type === 'one' && (
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    x = {formatNum((quadraticResult as QuadraticResult).roots[0])}
                  </Typography>
                )}
                {(quadraticResult as QuadraticResult).type === 'two' && (
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="body2" color="text.secondary">x₁</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        {formatNum((quadraticResult as QuadraticResult).roots[0])}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="body2" color="text.secondary">x₂</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        {formatNum((quadraticResult as QuadraticResult).roots[1])}
                      </Typography>
                    </Grid>
                  </Grid>
                )}
              </Paper>
              <StepsList steps={(quadraticResult as QuadraticResult).steps} />
            </>
          )}
        </TabPanel>
      </Paper>
    </Box>
  );
}
