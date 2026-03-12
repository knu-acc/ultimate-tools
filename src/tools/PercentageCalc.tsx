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
  Chip,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import PercentIcon from '@mui/icons-material/Percent';
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

export default function PercentageCalc() {
  const theme = useTheme();
  const [tab, setTab] = useState(0);

  // Mode 1: What is X% of Y
  const [pctOf_x, setPctOf_x] = useState('');
  const [pctOf_y, setPctOf_y] = useState('');

  // Mode 2: X is what % of Y
  const [whatPct_x, setWhatPct_x] = useState('');
  const [whatPct_y, setWhatPct_y] = useState('');

  // Mode 3: Percentage change from X to Y
  const [change_x, setChange_x] = useState('');
  const [change_y, setChange_y] = useState('');

  // Mode 4: Add/subtract % from value
  const [addSub_pct, setAddSub_pct] = useState('');
  const [addSub_val, setAddSub_val] = useState('');

  const result1 = useMemo(() => {
    const x = parseFloat(pctOf_x);
    const y = parseFloat(pctOf_y);
    if (isNaN(x) || isNaN(y)) return null;
    return (x / 100) * y;
  }, [pctOf_x, pctOf_y]);

  const result2 = useMemo(() => {
    const x = parseFloat(whatPct_x);
    const y = parseFloat(whatPct_y);
    if (isNaN(x) || isNaN(y) || y === 0) return null;
    return (x / y) * 100;
  }, [whatPct_x, whatPct_y]);

  const result3 = useMemo(() => {
    const x = parseFloat(change_x);
    const y = parseFloat(change_y);
    if (isNaN(x) || isNaN(y) || x === 0) return null;
    return ((y - x) / Math.abs(x)) * 100;
  }, [change_x, change_y]);

  const result4 = useMemo(() => {
    const pct = parseFloat(addSub_pct);
    const val = parseFloat(addSub_val);
    if (isNaN(pct) || isNaN(val)) return null;
    const addResult = val + (val * pct) / 100;
    const subResult = val - (val * pct) / 100;
    return { add: addResult, sub: subResult };
  }, [addSub_pct, addSub_val]);

  const formatNum = (n: number) => {
    if (Number.isInteger(n)) return n.toLocaleString('ru-RU');
    return n.toLocaleString('ru-RU', { maximumFractionDigits: 6 });
  };

  const ResultDisplay = ({ label, value }: { label: string; value: string }) => (
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
        {label}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
          {value}
        </Typography>
        <CopyButton text={value} />
      </Box>
    </Paper>
  );

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
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
          <Tab label="X% от Y" />
          <Tab label="X это сколько % от Y" />
          <Tab label="Изменение в %" />
          <Tab label="Прибавить / вычесть %" />
        </Tabs>

        <Divider />

        {/* Mode 1: What is X% of Y */}
        <TabPanel value={tab} index={0}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 5 }}>
              <TextField
                fullWidth
                label="Процент (X)"
                type="number"
                value={pctOf_x}
                onChange={(e) => setPctOf_x(e.target.value)}
                slotProps={{
                  input: { endAdornment: <PercentIcon sx={{ color: 'text.disabled', fontSize: 18 }} /> }
                }}
              />
            </Grid>
            <Grid size={{ xs: 2 }} sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                от
              </Typography>
            </Grid>
            <Grid size={{ xs: 5 }}>
              <TextField
                fullWidth
                label="Число (Y)"
                type="number"
                value={pctOf_y}
                onChange={(e) => setPctOf_y(e.target.value)}
              />
            </Grid>
          </Grid>
          {result1 !== null && (
            <ResultDisplay label={`${pctOf_x}% от ${pctOf_y}`} value={formatNum(result1)} />
          )}
        </TabPanel>

        {/* Mode 2: X is what % of Y */}
        <TabPanel value={tab} index={1}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 5 }}>
              <TextField
                fullWidth
                label="Число (X)"
                type="number"
                value={whatPct_x}
                onChange={(e) => setWhatPct_x(e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 2 }} sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                от
              </Typography>
            </Grid>
            <Grid size={{ xs: 5 }}>
              <TextField
                fullWidth
                label="Число (Y)"
                type="number"
                value={whatPct_y}
                onChange={(e) => setWhatPct_y(e.target.value)}
              />
            </Grid>
          </Grid>
          {result2 !== null && (
            <ResultDisplay label={`${whatPct_x} это`} value={`${formatNum(result2)}%`} />
          )}
        </TabPanel>

        {/* Mode 3: Percentage change */}
        <TabPanel value={tab} index={2}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 5 }}>
              <TextField
                fullWidth
                label="Исходное (X)"
                type="number"
                value={change_x}
                onChange={(e) => setChange_x(e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 2 }} sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                →
              </Typography>
            </Grid>
            <Grid size={{ xs: 5 }}>
              <TextField
                fullWidth
                label="Новое (Y)"
                type="number"
                value={change_y}
                onChange={(e) => setChange_y(e.target.value)}
              />
            </Grid>
          </Grid>
          {result3 !== null && (
            <ResultDisplay
              label="Изменение"
              value={`${result3 >= 0 ? '+' : ''}${formatNum(result3)}%`}
            />
          )}
          {result3 !== null && (
            <Box sx={{ mt: 1.5, textAlign: 'center' }}>
              <Chip
                label={result3 > 0 ? 'Увеличение' : result3 < 0 ? 'Уменьшение' : 'Без изменений'}
                color={result3 > 0 ? 'success' : result3 < 0 ? 'error' : 'default'}
                variant="outlined"
              />
            </Box>
          )}
        </TabPanel>

        {/* Mode 4: Add/subtract % */}
        <TabPanel value={tab} index={3}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 5 }}>
              <TextField
                fullWidth
                label="Процент"
                type="number"
                value={addSub_pct}
                onChange={(e) => setAddSub_pct(e.target.value)}
                slotProps={{
                  input: { endAdornment: <PercentIcon sx={{ color: 'text.disabled', fontSize: 18 }} /> }
                }}
              />
            </Grid>
            <Grid size={{ xs: 2 }} sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                к
              </Typography>
            </Grid>
            <Grid size={{ xs: 5 }}>
              <TextField
                fullWidth
                label="Число"
                type="number"
                value={addSub_val}
                onChange={(e) => setAddSub_val(e.target.value)}
              />
            </Grid>
          </Grid>
          {result4 && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    textAlign: 'center',
                    borderRadius: 3,
                    background: alpha(theme.palette.success.main, 0.06)
                  }}
                >
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    + {addSub_pct}%
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.success.main }}>
                      {formatNum(result4.add)}
                    </Typography>
                    <CopyButton text={formatNum(result4.add)} />
                  </Box>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    textAlign: 'center',
                    borderRadius: 3,
                    background: alpha(theme.palette.error.main, 0.06)
                  }}
                >
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    - {addSub_pct}%
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.error.main }}>
                      {formatNum(result4.sub)}
                    </Typography>
                    <CopyButton text={formatNum(result4.sub)} />
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          )}
        </TabPanel>
      </Paper>
    </Box>
  );
}
