'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Grid,
  Chip,
  Tabs,
  Tab,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import { CopyButton } from '@/src/components/CopyButton';

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
  identity?: boolean;
}

interface QuadraticResult {
  discriminant: number;
  roots: number[];
  steps: string[];
  type: 'two' | 'one' | 'none';
}

type LinearOutcome = LinearResult | { error: string } | null;
type QuadraticOutcome = QuadraticResult | { error: string } | null;

function isLinearResult(v: LinearOutcome): v is LinearResult {
  return v !== null && 'steps' in v;
}

function isQuadraticResult(v: QuadraticOutcome): v is QuadraticResult {
  return v !== null && 'discriminant' in v;
}

function isError(v: LinearOutcome | QuadraticOutcome): v is { error: string } {
  return v !== null && 'error' in v;
}

export default function EquationSolver() {
  const theme = useTheme();
  const [tab, setTab] = useState(0);

  const [linA, setLinA] = useState('');
  const [linB, setLinB] = useState('');

  const [quadA, setQuadA] = useState('');
  const [quadB, setQuadB] = useState('');
  const [quadC, setQuadC] = useState('');

  const formatNum = (n: number): string => {
    if (Number.isInteger(n)) return n.toString();
    return parseFloat(n.toFixed(6)).toString();
  };

  const linearResult = useMemo<LinearOutcome>(() => {
    if (linA === '' && linB === '') return null;
    const a = parseFloat(linA);
    const b = parseFloat(linB);
    if (isNaN(a) || isNaN(b)) return null;

    const steps: string[] = [];
    steps.push(`${formatNum(a)}x + ${formatNum(b)} = 0`);

    if (a === 0) {
      if (b === 0) {
        steps.push('0 = 0 -- тождество');
        return { x: NaN, steps, identity: true };
      }
      return { error: 'Уравнение не имеет решений (a = 0, b \u2260 0)' };
    }

    steps.push(`${formatNum(a)}x = ${formatNum(-b)}`);
    const x = -b / a;
    steps.push(`x = ${formatNum(-b)} / ${formatNum(a)}`);
    steps.push(`x = ${formatNum(x)}`);
    return { x, steps };
  }, [linA, linB]);

  const quadraticResult = useMemo<QuadraticOutcome>(() => {
    if (quadA === '' && quadB === '' && quadC === '') return null;
    const a = parseFloat(quadA);
    const b = parseFloat(quadB);
    const c = parseFloat(quadC);
    if (isNaN(a) || isNaN(b) || isNaN(c)) return null;
    if (a === 0) return { error: 'Коэффициент a не может быть равен 0 (это линейное уравнение)' };

    const steps: string[] = [];
    steps.push(`${formatNum(a)}x\u00B2 + ${formatNum(b)}x + ${formatNum(c)} = 0`);

    const D = b * b - 4 * a * c;
    steps.push(`D = b\u00B2 \u2212 4ac = ${formatNum(b)}\u00B2 \u2212 4\u00B7${formatNum(a)}\u00B7${formatNum(c)} = ${formatNum(D)}`);

    if (D < 0) {
      steps.push('D < 0 \u2014 уравнение не имеет действительных корней');
      return { discriminant: D, roots: [], steps, type: 'none' };
    }

    if (D === 0) {
      const x = -b / (2 * a);
      steps.push('D = 0 \u2014 один корень (два совпадающих)');
      steps.push(`x = \u2212b / (2a) = ${formatNum(-b)} / ${formatNum(2 * a)} = ${formatNum(x)}`);
      return { discriminant: D, roots: [x], steps, type: 'one' };
    }

    const sqrtD = Math.sqrt(D);
    steps.push(`\u221AD = ${formatNum(sqrtD)}`);

    const x1 = (-b + sqrtD) / (2 * a);
    const x2 = (-b - sqrtD) / (2 * a);
    steps.push(`x\u2081 = (\u2212b + \u221AD) / (2a) = (${formatNum(-b)} + ${formatNum(sqrtD)}) / ${formatNum(2 * a)} = ${formatNum(x1)}`);
    steps.push(`x\u2082 = (\u2212b \u2212 \u221AD) / (2a) = (${formatNum(-b)} \u2212 ${formatNum(sqrtD)}) / ${formatNum(2 * a)} = ${formatNum(x2)}`);

    return { discriminant: D, roots: [x1, x2], steps, type: 'two' };
  }, [quadA, quadB, quadC]);

  const linearCopyText = useMemo(() => {
    if (!isLinearResult(linearResult)) return '';
    if (linearResult.identity) return 'Тождество: 0 = 0';
    if (isNaN(linearResult.x)) return '';
    return `x = ${formatNum(linearResult.x)}`;
  }, [linearResult]);

  const quadraticCopyText = useMemo(() => {
    if (!isQuadraticResult(quadraticResult)) return '';
    if (quadraticResult.type === 'none') return 'Нет действительных корней';
    if (quadraticResult.type === 'one') return `x = ${formatNum(quadraticResult.roots[0])}`;
    return `x\u2081 = ${formatNum(quadraticResult.roots[0])}, x\u2082 = ${formatNum(quadraticResult.roots[1])}`;
  }, [quadraticResult]);

  const StepsList = ({ steps }: { steps: string[] }) => (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        mt: 2,
        borderRadius: 3,
        background: alpha(theme.palette.info.main, 0.04)
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
              backgroundColor: theme.palette.surfaceContainerHigh,
              color: 'primary.main'
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

  const ResultCard = ({ children, copyText }: { children: React.ReactNode; copyText: string }) => (
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
      {copyText && (
        <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
          <CopyButton text={copyText} />
        </Box>
      )}
      {children}
    </Paper>
  );

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 2,
          borderRadius: 3,
          background: theme.palette.surfaceContainerLow,
          transition: 'background 0.2s ease',
          '&:hover': { background: alpha(theme.palette.primary.main, 0.04) }
        }}
      >
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            mb: 1,
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 500, minWidth: 'auto' }
          }}
        >
          <Tab label="Линейное (ax + b = 0)" />
          <Tab label="Квадратное (ax\u00B2 + bx + c = 0)" />
        </Tabs>

        <Divider />

        {/* Linear equation */}
        <TabPanel value={tab} index={0}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 5 }}>
              <TextField
                fullWidth
                type="number"
                value={linA}
                onChange={(e) => setLinA(e.target.value)}
                placeholder="a"
              />
            </Grid>
            <Grid size={{ xs: 2 }} sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">x +</Typography>
            </Grid>
            <Grid size={{ xs: 5 }}>
              <TextField
                fullWidth
                type="number"
                value={linB}
                onChange={(e) => setLinB(e.target.value)}
                placeholder="b"
              />
            </Grid>
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 1 }}>
            <Typography variant="body2" color="text.secondary">= 0</Typography>
          </Box>

          {isError(linearResult) && (
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                mt: 2,
                textAlign: 'center',
                borderRadius: 3,
                background: alpha(theme.palette.error.main, 0.06)
              }}
            >
              <Typography variant="body1" sx={{ color: 'error.main', fontWeight: 600 }}>
                {linearResult.error}
              </Typography>
            </Paper>
          )}

          {isLinearResult(linearResult) && linearResult.identity && (
            <ResultCard copyText={linearCopyText}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                Тождество: 0 = 0
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Верно при любом x
              </Typography>
            </ResultCard>
          )}

          {isLinearResult(linearResult) && !isNaN(linearResult.x) && !linearResult.identity && (
            <>
              <ResultCard copyText={linearCopyText}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Решение
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  x = {formatNum(linearResult.x)}
                </Typography>
              </ResultCard>
              <StepsList steps={linearResult.steps} />
            </>
          )}
        </TabPanel>

        {/* Quadratic equation */}
        <TabPanel value={tab} index={1}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                fullWidth
                type="number"
                value={quadA}
                onChange={(e) => setQuadA(e.target.value)}
                placeholder="a"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 1 }} sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">x² +</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                fullWidth
                type="number"
                value={quadB}
                onChange={(e) => setQuadB(e.target.value)}
                placeholder="b"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 1 }} sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">x +</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                fullWidth
                type="number"
                value={quadC}
                onChange={(e) => setQuadC(e.target.value)}
                placeholder="c"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 1 }} sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">= 0</Typography>
            </Grid>
          </Grid>

          {isError(quadraticResult) && (
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                mt: 2,
                textAlign: 'center',
                borderRadius: 3,
                background: alpha(theme.palette.error.main, 0.06)
              }}
            >
              <Typography variant="body1" sx={{ color: 'error.main', fontWeight: 600 }}>
                {quadraticResult.error}
              </Typography>
            </Paper>
          )}

          {isQuadraticResult(quadraticResult) && (
            <>
              <ResultCard copyText={quadraticCopyText}>
                <Box sx={{ mb: 1.5 }}>
                  <Chip
                    label={`D = ${formatNum(quadraticResult.discriminant)}`}
                    color={
                      quadraticResult.type === 'none'
                        ? 'error'
                        : quadraticResult.type === 'one'
                          ? 'warning'
                          : 'success'
                    }
                    variant="outlined"
                    sx={{ fontFamily: 'monospace', fontWeight: 600 }}
                  />
                </Box>
                {quadraticResult.type === 'none' && (
                  <Typography variant="h6" sx={{ color: 'error.main', fontWeight: 600 }}>
                    Нет действительных корней
                  </Typography>
                )}
                {quadraticResult.type === 'one' && (
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    x = {formatNum(quadraticResult.roots[0])}
                  </Typography>
                )}
                {quadraticResult.type === 'two' && (
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="body2" color="text.secondary">x&#x2081;</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        {formatNum(quadraticResult.roots[0])}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="body2" color="text.secondary">x&#x2082;</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        {formatNum(quadraticResult.roots[1])}
                      </Typography>
                    </Grid>
                  </Grid>
                )}
              </ResultCard>
              <StepsList steps={quadraticResult.steps} />
            </>
          )}
        </TabPanel>
      </Paper>
    </Box>
  );
}
