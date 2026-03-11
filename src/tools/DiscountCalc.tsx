'use client';

import React, { useState } from 'react';
import {
  Box, Typography, TextField, Paper, Grid, Chip, alpha, useTheme,
} from '@mui/material';
import { LocalOffer, Percent } from '@mui/icons-material';

export default function DiscountCalc() {
  const theme = useTheme();
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');

  const priceNum = parseFloat(price) || 0;
  const discountNum = parseFloat(discount) || 0;

  const savings = priceNum * (discountNum / 100);
  const finalPrice = priceNum - savings;

  const quickDiscounts = [5, 10, 15, 20, 25, 30, 50, 70];

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Исходная цена (₽)
          </Typography>
          <TextField
            fullWidth
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Введите цену"
            sx={{ mb: 2 }}
          />

          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Скидка (%)
          </Typography>
          <TextField
            fullWidth
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            placeholder="Введите скидку"
            sx={{ mb: 2 }}
          />

          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            Быстрый выбор:
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
            {quickDiscounts.map((d) => (
              <Chip
                key={d}
                label={`${d}%`}
                size="small"
                onClick={() => setDiscount(String(d))}
                sx={{
                  bgcolor: discountNum === d
                    ? alpha(theme.palette.primary.main, 0.15)
                    : alpha(theme.palette.primary.main, 0.05),
                  fontWeight: discountNum === d ? 600 : 400,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.12) },
                }}
              />
            ))}
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          {priceNum > 0 && discountNum > 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: alpha(theme.palette.success.main, 0.08),
                  textAlign: 'center',
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Цена со скидкой
                </Typography>
                <Typography variant="h3" fontWeight={700} sx={{ color: theme.palette.success.main }}>
                  {finalPrice.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} ₽
                </Typography>
              </Paper>

              <Grid container spacing={1.5}>
                <Grid size={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.error.main, 0.06),
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">Вы экономите</Typography>
                    <Typography variant="h6" fontWeight={600} color="error">
                      {savings.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} ₽
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.06),
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">Исходная цена</Typography>
                    <Typography variant="h6" fontWeight={600} sx={{ textDecoration: 'line-through', opacity: 0.6 }}>
                      {priceNum.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} ₽
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              {/* Visual bar */}
              <Paper
                elevation={0}
                sx={{ p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.04) }}
              >
                <Box sx={{ display: 'flex', height: 24, borderRadius: 2, overflow: 'hidden' }}>
                  <Box
                    sx={{
                      width: `${100 - discountNum}%`,
                      bgcolor: theme.palette.success.main,
                      transition: 'width 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600, fontSize: 10 }}>
                      {(100 - discountNum).toFixed(0)}%
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: `${discountNum}%`,
                      bgcolor: theme.palette.error.main,
                      transition: 'width 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600, fontSize: 10 }}>
                      {discountNum}%
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">Оплата</Typography>
                  <Typography variant="caption" color="text.secondary">Скидка</Typography>
                </Box>
              </Paper>
            </Box>
          )}

          {(priceNum <= 0 || discountNum <= 0) && (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                bgcolor: alpha(theme.palette.primary.main, 0.04),
                textAlign: 'center',
              }}
            >
              <LocalOffer sx={{ fontSize: 48, color: theme.palette.text.secondary, mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Введите цену и скидку для расчёта
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
