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
  IconButton,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';

interface IncomeSource {
  id: number;
  name: string;
  amount: string;
}

interface ExpenseCategory {
  id: number;
  name: string;
  amount: string;
}

const DEFAULT_CATEGORIES = [
  'Жильё',
  'Еда',
  'Транспорт',
  'Развлечения',
  'Здоровье',
  'Одежда',
  'Прочее',
];

const CATEGORY_COLORS = [
  '#1565c0',
  '#2e7d32',
  '#ef6c00',
  '#7b1fa2',
  '#c62828',
  '#00838f',
  '#546e7a',
  '#ad1457',
  '#4527a0',
  '#1b5e20',
];

let nextId = 100;

export default function BudgetPlanner() {
  const theme = useTheme();

  const [incomes, setIncomes] = useState<IncomeSource[]>([
    { id: 1, name: 'Зарплата', amount: '' },
  ]);

  const [expenses, setExpenses] = useState<ExpenseCategory[]>(
    DEFAULT_CATEGORIES.map((name, i) => ({ id: i + 10, name, amount: '' }))
  );

  const addIncome = () => {
    setIncomes((prev) => [...prev, { id: nextId++, name: '', amount: '' }]);
  };

  const removeIncome = (id: number) => {
    setIncomes((prev) => prev.filter((i) => i.id !== id));
  };

  const updateIncome = (id: number, field: 'name' | 'amount', value: string) => {
    setIncomes((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
  };

  const addExpense = () => {
    setExpenses((prev) => [...prev, { id: nextId++, name: '', amount: '' }]);
  };

  const removeExpense = (id: number) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const updateExpense = (id: number, field: 'name' | 'amount', value: string) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  };

  const results = useMemo(() => {
    const totalIncome = incomes.reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
    const balance = totalIncome - totalExpenses;

    const expenseBreakdown = expenses
      .filter((e) => parseFloat(e.amount) > 0)
      .map((e, idx) => {
        const amount = parseFloat(e.amount) || 0;
        const pct = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
        const pctOfIncome = totalIncome > 0 ? (amount / totalIncome) * 100 : 0;
        return {
          name: e.name || `Категория ${idx + 1}`,
          amount,
          pct,
          pctOfIncome,
          color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
        };
      })
      .sort((a, b) => b.amount - a.amount);

    // 50/30/20 rule
    const needs = totalIncome * 0.5;
    const wants = totalIncome * 0.3;
    const savings = totalIncome * 0.2;

    return {
      totalIncome,
      totalExpenses,
      balance,
      expenseBreakdown,
      needs,
      wants,
      savings,
      hasData: totalIncome > 0 || totalExpenses > 0,
    };
  }, [incomes, expenses]);

  const fmt = (n: number) =>
    n.toLocaleString('ru-RU', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const fmtPct = (n: number) =>
    n.toLocaleString('ru-RU', { maximumFractionDigits: 1 });

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto' }}>
      {/* Income section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 3,
          background: alpha('#2e7d32', 0.02),
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
            Доходы
          </Typography>
          <Button
            size="small"
            startIcon={<AddIcon />}
            onClick={addIncome}
            sx={{ textTransform: 'none' }}
          >
            Добавить
          </Button>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {incomes.map((income) => (
            <Box key={income.id} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
              <TextField
                label="Источник"
                size="small"
                value={income.name}
                onChange={(e) => updateIncome(income.id, 'name', e.target.value)}
                sx={{ flex: 1 }}
              />
              <TextField
                label="Сумма (₽)"
                size="small"
                type="number"
                value={income.amount}
                onChange={(e) => updateIncome(income.id, 'amount', e.target.value)}
                sx={{ width: 150 }}
                slotProps={{
                  input: { inputProps: { min: 0, step: 100 } },
                }}
              />
              {incomes.length > 1 && (
                <IconButton
                  size="small"
                  onClick={() => removeIncome(income.id)}
                  sx={{ mt: 0.5, color: 'text.disabled' }}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Expense section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 3,
          background: alpha('#c62828', 0.02),
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
            Расходы
          </Typography>
          <Button
            size="small"
            startIcon={<AddIcon />}
            onClick={addExpense}
            sx={{ textTransform: 'none' }}
          >
            Добавить
          </Button>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {expenses.map((expense) => (
            <Box key={expense.id} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
              <TextField
                label="Категория"
                size="small"
                value={expense.name}
                onChange={(e) => updateExpense(expense.id, 'name', e.target.value)}
                sx={{ flex: 1 }}
              />
              <TextField
                label="Сумма (₽)"
                size="small"
                type="number"
                value={expense.amount}
                onChange={(e) => updateExpense(expense.id, 'amount', e.target.value)}
                sx={{ width: 150 }}
                slotProps={{
                  input: { inputProps: { min: 0, step: 100 } },
                }}
              />
              <IconButton
                size="small"
                onClick={() => removeExpense(expense.id)}
                sx={{ mt: 0.5, color: 'text.disabled' }}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Summary */}
      {results.hasData && (
        <>
          {/* Totals */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  textAlign: 'center',
                  borderRadius: 3,
                  border: `1px solid ${alpha('#2e7d32', 0.3)}`,
                  background: alpha('#2e7d32', 0.05),
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Общий доход
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#2e7d32' }}>
                  {fmt(results.totalIncome)} ₽
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  textAlign: 'center',
                  borderRadius: 3,
                  border: `1px solid ${alpha('#c62828', 0.3)}`,
                  background: alpha('#c62828', 0.05),
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Общие расходы
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#c62828' }}>
                  {fmt(results.totalExpenses)} ₽
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  textAlign: 'center',
                  borderRadius: 3,
                  border: `1px solid ${alpha(results.balance >= 0 ? '#2e7d32' : '#c62828', 0.3)}`,
                  background: alpha(results.balance >= 0 ? '#2e7d32' : '#c62828', 0.05),
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Баланс
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: results.balance >= 0 ? '#2e7d32' : '#c62828' }}>
                  {results.balance >= 0 ? '+' : ''}{fmt(results.balance)} ₽
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Expense breakdown */}
          {results.expenseBreakdown.length > 0 && (
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 3,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 3,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', mb: 2 }}>
                Распределение расходов
              </Typography>

              {/* Visual bar */}
              <Box
                sx={{
                  display: 'flex',
                  height: 24,
                  borderRadius: 12,
                  overflow: 'hidden',
                  mb: 2,
                }}
              >
                {results.expenseBreakdown.map((item) => (
                  <Box
                    key={item.name}
                    sx={{
                      width: `${item.pct}%`,
                      backgroundColor: item.color,
                      minWidth: item.pct > 0 ? 2 : 0,
                      transition: 'width 0.3s ease',
                    }}
                  />
                ))}
              </Box>

              {/* Category details */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {results.expenseBreakdown.map((item) => (
                  <Box key={item.name}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            backgroundColor: item.color,
                            flexShrink: 0,
                          }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {item.name}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                          {fmt(item.amount)} ₽
                        </Typography>
                        <Chip
                          label={`${fmtPct(item.pct)}%`}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.7rem',
                            backgroundColor: alpha(item.color, 0.12),
                            color: item.color,
                            height: 22,
                          }}
                        />
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: alpha(item.color, 0.1),
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        sx={{
                          height: '100%',
                          width: `${item.pct}%`,
                          borderRadius: 3,
                          backgroundColor: item.color,
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          )}

          {/* 50/30/20 Rule */}
          {results.totalIncome > 0 && (
            <Paper
              elevation={0}
              sx={{
                p: 3,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 3,
                background: alpha(theme.palette.primary.main, 0.02),
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', mb: 0.5 }}>
                Правило 50/30/20
              </Typography>
              <Typography variant="caption" color="text.disabled" sx={{ mb: 2, display: 'block' }}>
                Рекомендуемое распределение бюджета на основе вашего дохода
              </Typography>

              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                {[
                  {
                    label: 'Необходимое',
                    pct: 50,
                    amount: results.needs,
                    color: '#1565c0',
                    desc: 'Жильё, еда, транспорт, коммуналка',
                  },
                  {
                    label: 'Желания',
                    pct: 30,
                    amount: results.wants,
                    color: '#ef6c00',
                    desc: 'Развлечения, хобби, рестораны',
                  },
                  {
                    label: 'Сбережения',
                    pct: 20,
                    amount: results.savings,
                    color: '#2e7d32',
                    desc: 'Накопления, инвестиции, долги',
                  },
                ].map((rule) => (
                  <Grid key={rule.label} size={{ xs: 12, sm: 4 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        borderRadius: 2,
                        border: `1px solid ${alpha(rule.color, 0.25)}`,
                        background: alpha(rule.color, 0.04),
                      }}
                    >
                      <Chip
                        label={`${rule.pct}%`}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          backgroundColor: alpha(rule.color, 0.15),
                          color: rule.color,
                          mb: 1,
                        }}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {rule.label}
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: rule.color, my: 0.5 }}>
                        {fmt(rule.amount)} ₽
                      </Typography>
                      <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.65rem' }}>
                        {rule.desc}
                      </Typography>
                    </Paper>
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
