'use client';

import { useState, useMemo } from 'react';
import {
  Box, Typography, Paper, TextField, Grid, Button,
  Chip, IconButton, useTheme, alpha, InputAdornment,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CurrencySelector, { getCurrency } from '@/src/components/CurrencySelector';
import { useLanguage } from '@/src/i18n/LanguageContext';

interface IncomeSource { id: number; name: string; amount: string; }
interface ExpenseCategory { id: number; name: string; amount: string; emoji: string; color: string; }

const DEFAULT_EXPENSES_RU: Array<Omit<ExpenseCategory, 'id'>> = [
  { name: 'Жильё',        emoji: '🏠', amount: '', color: '#1565c0' },
  { name: 'Еда',          emoji: '🍔', amount: '', color: '#2e7d32' },
  { name: 'Транспорт',    emoji: '🚗', amount: '', color: '#ef6c00' },
  { name: 'Развлечения',  emoji: '🎮', amount: '', color: '#7b1fa2' },
  { name: 'Здоровье',     emoji: '💊', amount: '', color: '#c62828' },
  { name: 'Одежда',       emoji: '👕', amount: '', color: '#00838f' },
  { name: 'Прочее',       emoji: '📦', amount: '', color: '#546e7a' },
];

const DEFAULT_EXPENSES_EN: Array<Omit<ExpenseCategory, 'id'>> = [
  { name: 'Housing',        emoji: '🏠', amount: '', color: '#1565c0' },
  { name: 'Food',           emoji: '🍔', amount: '', color: '#2e7d32' },
  { name: 'Transport',      emoji: '🚗', amount: '', color: '#ef6c00' },
  { name: 'Entertainment',  emoji: '🎮', amount: '', color: '#7b1fa2' },
  { name: 'Health',         emoji: '💊', amount: '', color: '#c62828' },
  { name: 'Clothing',       emoji: '👕', amount: '', color: '#00838f' },
  { name: 'Other',          emoji: '📦', amount: '', color: '#546e7a' },
];

const EXTRA_COLORS = ['#ad1457', '#4527a0', '#1b5e20', '#4a148c', '#006064'];

let nextId = 100;

export default function BudgetPlanner() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { locale } = useLanguage();
  const isEn = locale === 'en';
  const [currency, setCurrency] = useState('RUB');
  const sym = getCurrency(currency).symbol;

  const DEFAULT_EXPENSES = isEn ? DEFAULT_EXPENSES_EN : DEFAULT_EXPENSES_RU;

  const [incomes, setIncomes] = useState<IncomeSource[]>([
    { id: 1, name: isEn ? 'Salary' : 'Зарплата', amount: '' },
  ]);
  const [expenses, setExpenses] = useState<ExpenseCategory[]>(
    DEFAULT_EXPENSES.map((e, i) => ({ ...e, id: i + 10 }))
  );

  const addIncome = () => setIncomes(p => [...p, { id: nextId++, name: isEn ? 'Source' : 'Источник', amount: '' }]);
  const removeIncome = (id: number) => setIncomes(p => p.filter(i => i.id !== id));
  const updateIncome = (id: number, field: 'name' | 'amount', value: string) =>
    setIncomes(p => p.map(i => i.id === id ? { ...i, [field]: value } : i));

  const addExpense = () => {
    const color = EXTRA_COLORS[expenses.length % EXTRA_COLORS.length];
    setExpenses(p => [...p, { id: nextId++, name: isEn ? 'Category' : 'Категория', emoji: '📌', amount: '', color }]);
  };
  const removeExpense = (id: number) => setExpenses(p => p.filter(e => e.id !== id));
  const updateExpense = (id: number, field: 'name' | 'amount', value: string) =>
    setExpenses(p => p.map(e => e.id === id ? { ...e, [field]: value } : e));

  const results = useMemo(() => {
    const totalIncome = incomes.reduce((s, i) => s + (parseFloat(i.amount) || 0), 0);
    const totalExpenses = expenses.reduce((s, e) => s + (parseFloat(e.amount) || 0), 0);
    const balance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100) : 0;

    const breakdown = expenses
      .filter(e => parseFloat(e.amount) > 0)
      .map(e => ({
        ...e,
        amount: parseFloat(e.amount),
        pct: totalExpenses > 0 ? (parseFloat(e.amount) / totalExpenses) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    return { totalIncome, totalExpenses, balance, savingsRate, breakdown, hasData: totalIncome > 0 || totalExpenses > 0 };
  }, [incomes, expenses]);

  const fmt = (n: number) => n.toLocaleString(isEn ? 'en-US' : 'ru-RU', { maximumFractionDigits: 0 });

  const summaryCards = [
    { label: isEn ? 'Income' : 'Доходы', value: results.totalIncome, icon: <TrendingUpIcon />, color: '#2e7d32' },
    { label: isEn ? 'Expenses' : 'Расходы', value: results.totalExpenses, icon: <TrendingDownIcon />, color: '#c62828' },
    { label: isEn ? 'Balance' : 'Баланс', value: results.balance, icon: <AccountBalanceWalletIcon />, color: results.balance >= 0 ? '#1565c0' : '#c62828' },
  ];

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Header with currency */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>{isEn ? 'Budget Planner' : 'Планировщик бюджета'}</Typography>
        <CurrencySelector value={currency} onChange={setCurrency} />
      </Box>

      {/* Summary cards — always visible */}
      <Grid container spacing={1.5} sx={{ mb: 2 }}>
        {summaryCards.map(card => (
          <Grid key={card.label} size={{ xs: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 1.5, sm: 2 },
                borderRadius: 18,
                bgcolor: alpha(card.color, isDark ? 0.15 : 0.07),
                border: `1px solid ${alpha(card.color, 0.2)}`,
                textAlign: 'center',
                transitionProperty: 'background-color', transitionDuration: '200ms', transitionTimingFunction: 'ease',
                '&:hover': { bgcolor: alpha(card.color, isDark ? 0.2 : 0.1) },
              }}
            >
              <Box sx={{ color: card.color, mb: 0.5, '& svg': { fontSize: 20 } }}>{card.icon}</Box>
              <Typography variant="caption" color="text.secondary" display="block">{card.label}</Typography>
              <Typography
                variant="subtitle2"
                fontWeight={700}
                sx={{ color: card.color, fontFamily: 'monospace', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
              >
                {card.value < 0 ? '-' : card.value > 0 && (card.label === 'Баланс' || card.label === 'Balance') ? '+' : ''}
                {fmt(Math.abs(card.value))} {sym}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Income */}
      <Paper elevation={0} sx={{ p: { xs: 2, sm: 2.5 }, mb: 2, borderRadius: 18, bgcolor: theme.palette.surfaceContainerLow, transitionProperty: 'background-color', transitionDuration: '200ms', transitionTimingFunction: 'ease', '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ fontSize: '1.1rem' }}>💰</Box>
            <Typography variant="subtitle2" fontWeight={600}>{isEn ? 'Income' : 'Доходы'}</Typography>
            {results.totalIncome > 0 && (
              <Chip label={`${fmt(results.totalIncome)} ${sym}`} size="small"
                sx={{ bgcolor: alpha('#2e7d32', 0.1), color: '#2e7d32', fontWeight: 600 }} />
            )}
          </Box>
          <Button size="small" startIcon={<AddIcon />} onClick={addIncome} variant="outlined"
            sx={{ borderRadius: 18, textTransform: 'none' }}>
            {isEn ? 'Add' : 'Добавить'}
          </Button>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {incomes.map((income) => (
            <Box
              key={income.id}
              sx={{
                display: 'flex', alignItems: 'center', gap: 1,
                p: 1.5, borderRadius: 10,
                bgcolor: alpha('#2e7d32', isDark ? 0.08 : 0.04),
                border: `1px solid ${alpha('#2e7d32', 0.15)}`,
              }}
            >
              <TextField
                size="small"
                value={income.name}
                onChange={(e) => updateIncome(income.id, 'name', e.target.value)}
                variant="standard"
                sx={{ flex: 1, '& .MuiInput-underline:before': { borderBottom: 'none' }, '& input': { fontWeight: 500, fontSize: '0.875rem' } }}
                slotProps={{ input: { disableUnderline: true } }}
              />
              <TextField
                size="small"
                type="number"
                value={income.amount}
                onChange={(e) => updateIncome(income.id, 'amount', e.target.value)}
                placeholder="0"
                variant="outlined"
                sx={{ width: 130 }}
                slotProps={{
                  input: {
                    endAdornment: <InputAdornment position="end"><Typography variant="caption" color="text.secondary">{sym}</Typography></InputAdornment>,
                    inputProps: { min: 0, step: 100 },
                  }
                }}
              />
              {incomes.length > 1 && (
                <IconButton size="small" onClick={() => removeIncome(income.id)} sx={{ color: 'text.disabled' }}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Expenses */}
      <Paper elevation={0} sx={{ p: { xs: 2, sm: 2.5 }, mb: 2, borderRadius: 18, bgcolor: theme.palette.surfaceContainerLow, transitionProperty: 'background-color', transitionDuration: '200ms', transitionTimingFunction: 'ease', '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ fontSize: '1.1rem' }}>💸</Box>
            <Typography variant="subtitle2" fontWeight={600}>{isEn ? 'Expenses' : 'Расходы'}</Typography>
            {results.totalExpenses > 0 && (
              <Chip label={`${fmt(results.totalExpenses)} ${sym}`} size="small"
                sx={{ bgcolor: alpha('#c62828', 0.1), color: '#c62828', fontWeight: 600 }} />
            )}
          </Box>
          <Button size="small" startIcon={<AddIcon />} onClick={addExpense} variant="outlined"
            sx={{ borderRadius: 18, textTransform: 'none' }}>
            {isEn ? 'Category' : 'Категория'}
          </Button>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {expenses.map((expense) => {
            const amt = parseFloat(expense.amount) || 0;
            const pctOfIncome = results.totalIncome > 0 ? (amt / results.totalIncome) * 100 : 0;
            return (
              <Box key={expense.id}>
                <Box
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5,
                    borderRadius: 10,
                    borderLeft: `3px solid ${expense.color}`,
                    bgcolor: alpha(expense.color, isDark ? 0.06 : 0.03),
                  }}
                >
                  <Box sx={{ fontSize: '1.1rem', flexShrink: 0 }}>{expense.emoji}</Box>
                  <TextField
                    size="small"
                    value={expense.name}
                    onChange={(e) => updateExpense(expense.id, 'name', e.target.value)}
                    variant="standard"
                    sx={{
                      flex: 1,
                      '& input': { fontWeight: 500, fontSize: '0.875rem', color: 'text.primary' }
                    }}
                    slotProps={{ input: { disableUnderline: true } }}
                  />
                  <TextField
                    size="small"
                    type="number"
                    value={expense.amount}
                    onChange={(e) => updateExpense(expense.id, 'amount', e.target.value)}
                    placeholder="0"
                    variant="outlined"
                    sx={{ width: 130, flexShrink: 0 }}
                    slotProps={{
                      input: {
                        endAdornment: <InputAdornment position="end"><Typography variant="caption" color="text.secondary">{sym}</Typography></InputAdornment>,
                        inputProps: { min: 0, step: 100 },
                      }
                    }}
                  />
                  <IconButton size="small" onClick={() => removeExpense(expense.id)} sx={{ color: 'text.disabled', flexShrink: 0 }}>
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Box>
                {/* Mini progress bar */}
                {amt > 0 && results.totalIncome > 0 && (
                  <Box sx={{ mx: 1.5, mt: 0.25, height: 3, borderRadius: 10, bgcolor: alpha(expense.color, 0.12) }}>
                    <Box sx={{
                      height: '100%', borderRadius: 10,
                      width: `${Math.min(pctOfIncome, 100)}%`,
                      bgcolor: expense.color,
                      transition: 'width 0.4s cubic-bezier(0.2, 0, 0, 1)',
                    }} />
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
      </Paper>

      {/* Analytics — only when there's data */}
      {results.hasData && (
        <>
          {/* Expense distribution bar */}
          {results.breakdown.length > 0 && (
            <Paper elevation={0} sx={{ p: { xs: 2, sm: 2.5 }, mb: 2, borderRadius: 18, bgcolor: theme.palette.surfaceContainerLow, transitionProperty: 'background-color', transitionDuration: '200ms', transitionTimingFunction: 'ease', '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) } }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
                {isEn ? 'Expense Distribution' : 'Распределение расходов'}
              </Typography>
              <Box sx={{ display: 'flex', height: 20, borderRadius: 10, overflow: 'hidden', mb: 2 }}>
                {results.breakdown.map(item => (
                  <Box key={item.name} sx={{
                    width: `${item.pct}%`, bgcolor: item.color,
                    minWidth: item.pct > 0 ? 2 : 0,
                    transition: 'width 0.4s cubic-bezier(0.2, 0, 0, 1)',
                  }} />
                ))}
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                {results.breakdown.map(item => (
                  <Box key={item.name} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: item.color, flexShrink: 0 }} />
                    <Typography variant="body2" sx={{ flex: 1 }}>{item.emoji} {item.name}</Typography>
                    <Typography variant="body2" fontWeight={600} sx={{ fontFamily: 'monospace' }}>
                      {fmt(item.amount)} {sym}
                    </Typography>
                    <Chip label={`${item.pct.toFixed(0)}%`} size="small" sx={{
                      height: 20, fontSize: '0.7rem', fontWeight: 600,
                      bgcolor: alpha(item.color, 0.12), color: item.color,
                    }} />
                  </Box>
                ))}
              </Box>
            </Paper>
          )}

          {/* Savings rate */}
          {results.totalIncome > 0 && (
            <Paper elevation={0} sx={{ p: { xs: 2, sm: 2.5 }, mb: 2, borderRadius: 18, bgcolor: theme.palette.surfaceContainerLow, transitionProperty: 'background-color', transitionDuration: '200ms', transitionTimingFunction: 'ease', '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" fontWeight={600}>{isEn ? 'Savings Rate' : 'Норма сбережений'}</Typography>
                <Chip
                  label={`${results.savingsRate.toFixed(1)}%`}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    bgcolor: alpha(results.savingsRate >= 20 ? '#2e7d32' : results.savingsRate >= 10 ? '#ef6c00' : '#c62828', 0.12),
                    color: results.savingsRate >= 20 ? '#2e7d32' : results.savingsRate >= 10 ? '#ef6c00' : '#c62828',
                  }}
                />
              </Box>
              <Box sx={{ height: 8, borderRadius: 18, bgcolor: theme.palette.surfaceContainerHigh, overflow: 'hidden' }}>
                <Box sx={{
                  height: '100%', borderRadius: 18,
                  width: `${Math.max(0, Math.min(100, results.savingsRate))}%`,
                  bgcolor: results.savingsRate >= 20 ? '#2e7d32' : results.savingsRate >= 10 ? '#ef6c00' : '#c62828',
                  transition: 'width 0.4s cubic-bezier(0.2, 0, 0, 1)',
                }} />
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.75, display: 'block' }}>
                {isEn ? 'It is recommended to save 20%+ of income' : 'Рекомендуется откладывать 20%+ от дохода'}
              </Typography>
            </Paper>
          )}

          {/* 50/30/20 rule */}
          {results.totalIncome > 0 && (
            <Paper elevation={0} sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: 18, bgcolor: theme.palette.surfaceContainerLow, transitionProperty: 'background-color', transitionDuration: '200ms', transitionTimingFunction: 'ease', '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) } }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>{isEn ? '50/30/20 Rule' : 'Правило 50/30/20'}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                {isEn ? `Recommended allocation of your income ${fmt(results.totalIncome)} ${sym}` : `Рекомендуемое распределение от вашего дохода ${fmt(results.totalIncome)} ${sym}`}
              </Typography>
              <Grid container spacing={1.5}>
                {[
                  { label: isEn ? 'Needs' : 'Необходимое', pct: 50, amount: results.totalIncome * 0.5, color: '#1565c0', desc: isEn ? 'Housing, food, transport' : 'Жильё, еда, транспорт' },
                  { label: isEn ? 'Wants' : 'Желания', pct: 30, amount: results.totalIncome * 0.3, color: '#ef6c00', desc: isEn ? 'Hobbies, restaurants' : 'Хобби, рестораны' },
                  { label: isEn ? 'Savings' : 'Сбережения', pct: 20, amount: results.totalIncome * 0.2, color: '#2e7d32', desc: isEn ? 'Savings, investments' : 'Накопления, инвестиции' },
                ].map(rule => (
                  <Grid key={rule.label} size={{ xs: 12, sm: 4 }}>
                    <Box sx={{
                      p: 1.5, borderRadius: 10, textAlign: 'center',
                      bgcolor: alpha(rule.color, isDark ? 0.1 : 0.05),
                      border: `1px solid ${alpha(rule.color, 0.2)}`,
                    }}>
                      <Chip label={`${rule.pct}%`} size="small" sx={{ fontWeight: 700, bgcolor: alpha(rule.color, 0.15), color: rule.color, mb: 0.75 }} />
                      <Typography variant="body2" fontWeight={600}>{rule.label}</Typography>
                      <Typography variant="subtitle2" fontWeight={700} sx={{ color: rule.color }}>
                        {fmt(rule.amount)} {sym}
                      </Typography>
                      <Typography variant="caption" color="text.disabled">{rule.desc}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          )}
        </>
      )}
    </Box>
  );
}
