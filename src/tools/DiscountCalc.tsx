'use client';

import { useState } from 'react';
import {
  Box, Typography, TextField, Paper, Grid, Chip, alpha, useTheme
} from '@mui/material';
import CurrencySelector, { getCurrency } from '@/src/components/CurrencySelector';
import { LocalOffer } from '@mui/icons-material';
import { useLanguage } from '@/src/i18n/LanguageContext';

export default function DiscountCalc() {
  const theme = useTheme();
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const [currency, setCurrency] = useState('RUB');
  const sym = getCurrency(currency).symbol;
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');

  const priceNum = parseFloat(price) || 0;
  const discountNum = parseFloat(discount) || 0;

  const savings = priceNum * (discountNum / 100);
  const finalPrice = priceNum - savings;

  const quickDiscounts = [5, 10, 15, 20, 25, 30, 50, 70];

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <CurrencySelector value={currency} onChange={setCurrency} />
      </Box>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label={isEn ? `Original price (${sym})` : `Исходная цена (${sym})`}
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder={isEn ? 'e.g.: 5000' : 'Например: 5000'}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label={isEn ? 'Discount (%)' : 'Скидка (%)'}
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            placeholder={isEn ? 'e.g.: 20' : 'Например: 20'}
            sx={{ mb: 2 }}
          />

          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            {isEn ? 'Quick select:' : 'Быстрый выбор:'}
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
                    : theme.palette.surfaceContainerLow,
                  fontWeight: discountNum === d ? 600 : 400,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: theme.palette.surfaceContainerHigh }
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
                  borderRadius: 18,
                  bgcolor: alpha(theme.palette.success.main, 0.08),
                  textAlign: 'center'
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {isEn ? 'Discounted price' : 'Цена со скидкой'}
                </Typography>
                <Typography variant="h3" fontWeight={700} sx={{ color: theme.palette.success.main }}>
                  {finalPrice.toLocaleString(isEn ? 'en-US' : 'ru-RU', { minimumFractionDigits: 2 })} {sym}
                </Typography>
              </Paper>

              <Grid container spacing={1.5}>
                <Grid size={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 18,
                      bgcolor: alpha(theme.palette.error.main, 0.06),
                      textAlign: 'center',
                      transition: 'background 150ms ease',
                      '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.10) }
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">{isEn ? 'You save' : 'Вы экономите'}</Typography>
                    <Typography variant="h6" fontWeight={600} color="error">
                      {savings.toLocaleString(isEn ? 'en-US' : 'ru-RU', { minimumFractionDigits: 2 })} {sym}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 18,
                      bgcolor: theme.palette.surfaceContainerLow,
                      textAlign: 'center',
                      transition: 'background 150ms ease',
                      '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) }
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">{isEn ? 'Original price' : 'Исходная цена'}</Typography>
                    <Typography variant="h6" fontWeight={600} sx={{ textDecoration: 'line-through', opacity: 0.6 }}>
                      {priceNum.toLocaleString(isEn ? 'en-US' : 'ru-RU', { minimumFractionDigits: 2 })} {sym}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              {/* Visual bar */}
              <Paper
                elevation={0}
                sx={{ p: 2, borderRadius: 18, bgcolor: theme.palette.surfaceContainerLow }}
              >
                <Box sx={{ display: 'flex', height: 24, borderRadius: 18, overflow: 'hidden' }}>
                  <Box
                    sx={{
                      width: `${100 - discountNum}%`,
                      bgcolor: theme.palette.success.main,
                      transition: 'width 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
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
                      justifyContent: 'center'
                    }}
                  >
                    <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600, fontSize: 10 }}>
                      {discountNum}%
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">{isEn ? 'Payment' : 'Оплата'}</Typography>
                  <Typography variant="caption" color="text.secondary">{isEn ? 'Discount' : 'Скидка'}</Typography>
                </Box>
              </Paper>
            </Box>
          )}

          {(priceNum <= 0 || discountNum <= 0) && (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 18,
                bgcolor: theme.palette.surfaceContainerLow,
                textAlign: 'center'
              }}
            >
              <LocalOffer sx={{ fontSize: 48, color: theme.palette.text.secondary, mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {isEn ? 'Enter price and discount to calculate' : 'Введите цену и скидку для расчёта'}
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
