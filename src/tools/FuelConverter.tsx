'use client';

import { useState } from 'react';
import {
  Box, Typography, Paper, TextField, Grid, alpha, useTheme,
} from '@mui/material';

export default function FuelConverter() {
  const theme = useTheme();
  const [liters100, setLiters100] = useState('8');

  const val = parseFloat(liters100) || 0;
  const mpg = val > 0 ? 235.215 / val : 0;
  const mpgUK = val > 0 ? 282.481 / val : 0;
  const kmPerL = val > 0 ? 100 / val : 0;

  return (
    <Box>
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: `1px solid ${theme.palette.divider}`, mb: 3 }}>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>Расход топлива (л/100км)</Typography>
        <TextField fullWidth type="number" value={liters100} onChange={e => setLiters100(e.target.value)} placeholder="Введите расход" sx={{ mb: 3 }} />

        {val > 0 && (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.06), textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">Мили на галлон (US)</Typography>
                <Typography variant="h4" fontWeight={700} color="primary">{mpg.toFixed(2)} MPG</Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2, bgcolor: alpha(theme.palette.success.main, 0.06), textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">Мили на галлон (UK)</Typography>
                <Typography variant="h4" fontWeight={700} sx={{ color: theme.palette.success.main }}>{mpgUK.toFixed(2)} MPG</Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2, bgcolor: alpha(theme.palette.warning.main, 0.06), textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">Километров на литр</Typography>
                <Typography variant="h4" fontWeight={700} sx={{ color: theme.palette.warning.main }}>{kmPerL.toFixed(2)} км/л</Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2, bgcolor: alpha(theme.palette.error.main, 0.06), textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">Литров на 100 км</Typography>
                <Typography variant="h4" fontWeight={700} sx={{ color: theme.palette.error.main }}>{val.toFixed(2)} л/100км</Typography>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Paper>

      <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>Справка</Typography>
        <Typography variant="body2" color="text.secondary">
          1 US галлон = 3.785 л • 1 UK галлон = 4.546 л • Формула: MPG = 235.215 / (л/100км)
        </Typography>
      </Paper>
    </Box>
  );
}
