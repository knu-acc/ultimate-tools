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
  return str.slice(0, 10) + '...' + str.slice(-10) + ` (${str.length} \u0446\u0438\u0444\u0440)`;
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
        \u041f\u043e\u0448\u0430\u0433\u043e\u0432\u043e\u0435 \u0440\u0435\u0448\u0435\u043d\u0438\u0435
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
          p: 3,
          mb: 3,
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
          <Tab label="\u0424\u0430\u043a\u0442\u043e\u0440\u0438\u0430\u043b (n!)" />
          <Tab label="\u041f\u0435\u0440\u0435\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0438 P(n,r)" />
          <Tab label="\u0421\u043e\u0447\u0435\u0442\u0430\u043d\u0438\u044f C(n,r)" />
        </Tabs>
        <Divider />

        {/* Factorial */}
        <TabPanel value={tab} index={0}>
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            \u0412\u044b\u0447\u0438\u0441\u043b\u0438\u0442\u044c \u0444\u0430\u043a\u0442\u043e\u0440\u0438\u0430\u043b \u0447\u0438\u0441\u043b\u0430 n (n! = 1 \u00d7 2 \u00d7 ... \u00d7 n). \u041c\u0430\u043a\u0441\u0438\u043c\u0443\u043c n = 1000.
          </Typography>
          <TextField
            fullWidth
            label="\u0427\u0438\u0441\u043b\u043e n"
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
                  background: theme.palette.surfaceContainerLow
                }}
              >
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
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            \u041f\u0435\u0440\u0435\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0438 \u0431\u0435\u0437 \u043f\u043e\u0432\u0442\u043e\u0440\u0435\u043d\u0438\u0439: P(n, r) = n! / (n - r)!
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="n (\u0432\u0441\u0435\u0433\u043e \u044d\u043b\u0435\u043c\u0435\u043d\u0442\u043e\u0432)"
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
                label="r (\u0432\u044b\u0431\u0438\u0440\u0430\u0435\u043c)"
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
                  background: theme.palette.surfaceContainerLow
                }}
              >
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
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            \u0421\u043e\u0447\u0435\u0442\u0430\u043d\u0438\u044f \u0431\u0435\u0437 \u043f\u043e\u0432\u0442\u043e\u0440\u0435\u043d\u0438\u0439: C(n, r) = n! / (r! \u00d7 (n - r)!)
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="n (\u0432\u0441\u0435\u0433\u043e \u044d\u043b\u0435\u043c\u0435\u043d\u0442\u043e\u0432)"
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
                label="r (\u0432\u044b\u0431\u0438\u0440\u0430\u0435\u043c)"
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
                  background: theme.palette.surfaceContainerLow
                }}
              >
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
          p: 3,
          borderRadius: 3
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          \u0422\u0430\u0431\u043b\u0438\u0446\u0430 \u0444\u0430\u043a\u0442\u043e\u0440\u0438\u0430\u043b\u043e\u0432
        </Typography>
        <Grid container spacing={1}>
          {commonValues.map(({ n, val }) => (
            <Grid size={{ xs: 6, sm: 4 }} key={n}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 1,
                  borderRadius: 2,
                  background: theme.palette.surfaceContainerLow,
                  border: `1px solid ${alpha(theme.palette.divider, 0.5)}`
                }}
              >
                <Chip
                  label={`${n}!`}
                  size="small"
                  sx={{
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    color: 'primary.main'
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{ fontFamily: 'monospace', fontWeight: 500, fontSize: '0.8rem' }}
                >
                  {val}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
}
