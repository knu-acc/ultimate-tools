'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Grid,
  Tabs,
  Tab,
  Divider,
  Chip,
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

function factorialBig(n: number): bigint {
  if (n < 0) return BigInt(0);
  if (n <= 1) return BigInt(1);
  let result = BigInt(1);
  for (let i = BigInt(2); i <= BigInt(n); i++) {
    result *= i;
  }
  return result;
}

function formatBigInt(val: bigint): string {
  const str = val.toString();
  if (str.length <= 20) return str;
  return str.slice(0, 10) + '...' + str.slice(-10) + ` (${str.length} цифр)`;
}

export default function FactorialCalc() {
  const theme = useTheme();
  const [tab, setTab] = useState(0);

  const [factN, setFactN] = useState('');
  const [permN, setPermN] = useState('');
  const [permR, setPermR] = useState('');
  const [combN, setCombN] = useState('');
  const [combR, setCombR] = useState('');

  const factResult = useMemo(() => {
    const n = parseInt(factN);
    if (isNaN(n) || n < 0 || n > 1000) return null;
    const result = factorialBig(n);
    const steps: string[] = [];
    if (n <= 12) {
      const parts: string[] = [];
      for (let i = n; i >= 1; i--) parts.push(i.toString());
      steps.push(`${n}! = ${parts.join(' \u00d7 ')}`);
      let running = 1;
      for (let i = 2; i <= n; i++) {
        running *= i;
        steps.push(`${i - 1 === 1 ? '1' : `${running / i}`} \u00d7 ${i} = ${running}`);
      }
    }
    return { value: result, steps, n };
  }, [factN]);

  const permResult = useMemo(() => {
    const n = parseInt(permN);
    const r = parseInt(permR);
    if (isNaN(n) || isNaN(r) || n < 0 || r < 0 || r > n || n > 1000) return null;
    const nFact = factorialBig(n);
    const nrFact = factorialBig(n - r);
    const result = nFact / nrFact;
    const steps = [
      `P(${n}, ${r}) = ${n}! / (${n} - ${r})!`,
      `= ${n}! / ${n - r}!`,
      `= ${formatBigInt(nFact)} / ${formatBigInt(nrFact)}`,
      `= ${formatBigInt(result)}`,
    ];
    return { value: result, steps };
  }, [permN, permR]);

  const combResult = useMemo(() => {
    const n = parseInt(combN);
    const r = parseInt(combR);
    if (isNaN(n) || isNaN(r) || n < 0 || r < 0 || r > n || n > 1000) return null;
    const nFact = factorialBig(n);
    const rFact = factorialBig(r);
    const nrFact = factorialBig(n - r);
    const result = nFact / (rFact * nrFact);
    const steps = [
      `C(${n}, ${r}) = ${n}! / (${r}! \u00d7 (${n} - ${r})!)`,
      `= ${n}! / (${r}! \u00d7 ${n - r}!)`,
      `= ${formatBigInt(nFact)} / (${formatBigInt(rFact)} \u00d7 ${formatBigInt(nrFact)})`,
      `= ${formatBigInt(result)}`,
    ];
    return { value: result, steps };
  }, [combN, combR]);

  const commonValues = [
    { n: 0, val: '1' },
    { n: 1, val: '1' },
    { n: 2, val: '2' },
    { n: 3, val: '6' },
    { n: 4, val: '24' },
    { n: 5, val: '120' },
    { n: 6, val: '720' },
    { n: 7, val: '5 040' },
    { n: 8, val: '40 320' },
    { n: 9, val: '362 880' },
    { n: 10, val: '3 628 800' },
    { n: 12, val: '479 001 600' },
    { n: 15, val: '1 307 674 368 000' },
    { n: 20, val: '2 432 902 008 176 640 000' },
  ];

  const StepDisplay = ({ steps }: { steps: string[] }) => (
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
        Пошаговое решение
      </Typography>
      {steps.map((step, idx) => (
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
  );

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 2,
          borderRadius: 3,
          background: theme.palette.surfaceContainerLow
        }}
      >
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            mb: 1,
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 500, minWidth: 'auto' }
          }}
        >
          <Tab label="Факториал (n!)" />
          <Tab label="Перестановки P(n,r)" />
          <Tab label="Сочетания C(n,r)" />
        </Tabs>
        <Divider />

        {/* Factorial */}
        <TabPanel value={tab} index={0}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            <Chip label="n! = 1 * 2 * ... * n" size="small" variant="outlined" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }} />
            <Chip label="max n = 1000" size="small" sx={{ fontFamily: 'monospace', fontSize: '0.8rem', backgroundColor: theme.palette.surfaceContainerHigh }} />
          </Box>
          <TextField
            fullWidth
            placeholder="n"
            type="number"
            value={factN}
            onChange={(e) => setFactN(e.target.value)}
            slotProps={{
              input: { sx: { fontFamily: 'monospace', fontSize: '1.1rem' } }
            }}
          />
          {factResult && (
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
                  <CopyButton text={factResult.value.toString()} />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  {factResult.n}!
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: 'primary.main',
                    fontFamily: 'monospace',
                    wordBreak: 'break-all'
                  }}
                >
                  {formatBigInt(factResult.value)}
                </Typography>
              </Paper>
              {factResult.steps.length > 0 && <StepDisplay steps={factResult.steps} />}
            </>
          )}
        </TabPanel>

        {/* Permutations */}
        <TabPanel value={tab} index={1}>
          <Box sx={{ mb: 2 }}>
            <Chip label="P(n, r) = n! / (n - r)!" size="small" variant="outlined" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }} />
          </Box>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                placeholder="n"
                type="number"
                value={permN}
                onChange={(e) => setPermN(e.target.value)}
                slotProps={{
                  input: { sx: { fontFamily: 'monospace' } }
                }}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                placeholder="r"
                type="number"
                value={permR}
                onChange={(e) => setPermR(e.target.value)}
                slotProps={{
                  input: { sx: { fontFamily: 'monospace' } }
                }}
              />
            </Grid>
          </Grid>
          {permResult && (
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
                  <CopyButton text={permResult.value.toString()} />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  P({permN}, {permR})
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: 'primary.main',
                    fontFamily: 'monospace',
                    wordBreak: 'break-all'
                  }}
                >
                  {formatBigInt(permResult.value)}
                </Typography>
              </Paper>
              <StepDisplay steps={permResult.steps} />
            </>
          )}
        </TabPanel>

        {/* Combinations */}
        <TabPanel value={tab} index={2}>
          <Box sx={{ mb: 2 }}>
            <Chip label="C(n, r) = n! / (r! * (n - r)!)" size="small" variant="outlined" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }} />
          </Box>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                placeholder="n"
                type="number"
                value={combN}
                onChange={(e) => setCombN(e.target.value)}
                slotProps={{
                  input: { sx: { fontFamily: 'monospace' } }
                }}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                placeholder="r"
                type="number"
                value={combR}
                onChange={(e) => setCombR(e.target.value)}
                slotProps={{
                  input: { sx: { fontFamily: 'monospace' } }
                }}
              />
            </Grid>
          </Grid>
          {combResult && (
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
                  <CopyButton text={combResult.value.toString()} />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  C({combN}, {combR})
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: 'primary.main',
                    fontFamily: 'monospace',
                    wordBreak: 'break-all'
                  }}
                >
                  {formatBigInt(combResult.value)}
                </Typography>
              </Paper>
              <StepDisplay steps={combResult.steps} />
            </>
          )}
        </TabPanel>
      </Paper>

      {/* Common values reference table */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
          background: theme.palette.surfaceContainerLow
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Таблица факториалов
        </Typography>
        <Box
          component="table"
          sx={{
            width: '100%',
            borderCollapse: 'collapse',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            '& th, & td': {
              px: 1.5,
              py: 0.75,
              textAlign: 'left',
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.3)}`
            },
            '& th': {
              fontWeight: 600,
              color: 'text.secondary',
              fontSize: '0.8rem'
            },
            '& tr:last-child td': {
              borderBottom: 'none'
            },
            '& tr:hover td': {
              backgroundColor: alpha(theme.palette.primary.main, 0.04)
            }
          }}
        >
          <thead>
            <tr>
              <Box component="th" sx={{ width: 60 }}>n</Box>
              <th>n!</th>
              <Box component="th" sx={{ width: 40 }} />
            </tr>
          </thead>
          <tbody>
            {commonValues.map(({ n, val }) => (
              <tr key={n}>
                <td>
                  <Chip
                    label={n}
                    size="small"
                    sx={{
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      height: 24,
                      minWidth: 32,
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      color: 'primary.main'
                    }}
                  />
                </td>
                <td>{val}</td>
                <td>
                  <CopyButton text={val.replace(/\s/g, '')} />
                </td>
              </tr>
            ))}
          </tbody>
        </Box>
      </Paper>
    </Box>
  );
}
