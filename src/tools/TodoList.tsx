'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  List,
  ListItem,
  Checkbox,
  IconButton,
  Chip,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useLanguage } from '@/src/i18n/LanguageContext';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

type FilterType = 'all' | 'active' | 'completed';

const STORAGE_KEY = 'utools-todos';

function loadTodos(): Todo[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}

function saveTodos(todos: Todo[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    /* Storage full or unavailable */
  }
}

export default function TodoList() {
  const theme = useTheme();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [loaded, setLoaded] = useState(false);
  const { locale } = useLanguage();
  const isEn = locale === 'en';

  // Load from localStorage on mount
  useEffect(() => {
    setTodos(loadTodos());
    setLoaded(true);
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    if (loaded) {
      saveTodos(todos);
    }
  }, [todos, loaded]);

  const addTodo = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setTodos((prev) => [
      ...prev,
      { id: Date.now(), text: trimmed, completed: false },
    ]);
    setInput('');
  }, [input]);

  const toggleTodo = useCallback((id: number) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }, []);

  const deleteTodo = useCallback((id: number) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTodo();
    }
  };

  const filteredTodos = todos.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const totalCount = todos.length;
  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = totalCount - activeCount;

  const filters: { key: FilterType; label: string; labelEn: string }[] = [
    { key: 'all', label: 'Все', labelEn: 'All' },
    { key: 'active', label: 'Активные', labelEn: 'Active' },
    { key: 'completed', label: 'Завершённые', labelEn: 'Completed' },
  ];

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
          {/* Input */}
          <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
            <TextField
              fullWidth
              placeholder={isEn ? 'Add a new task...' : 'Добавить новую задачу...'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3
                }
              }}
            />
            <Button
              variant="contained"
              onClick={addTodo}
              disabled={!input.trim()}
              startIcon={<AddIcon />}
              sx={{
                borderRadius: 3,
                px: 3,
                whiteSpace: 'nowrap',
                textTransform: 'none'
              }}
            >
              {isEn ? 'Add' : 'Добавить'}
            </Button>
          </Box>

          {/* Filters */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            {filters.map((f) => (
              <Chip
                key={f.key}
                label={isEn ? f.labelEn : f.label}
                variant={filter === f.key ? 'filled' : 'outlined'}
                color={filter === f.key ? 'primary' : 'default'}
                clickable
                onClick={() => setFilter(f.key)}
                sx={{ borderRadius: 2 }}
              />
            ))}
          </Box>

          {/* Stats */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              mb: 2,
              px: 1.5,
              py: 1,
              borderRadius: 2,
              backgroundColor: theme.palette.surfaceContainerLow
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {isEn ? 'Total' : 'Всего'}: <strong>{totalCount}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isEn ? 'Active' : 'Активных'}: <strong>{activeCount}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isEn ? 'Completed' : 'Завершённых'}: <strong>{completedCount}</strong>
            </Typography>
          </Box>

          <Divider sx={{ mb: 1 }} />

          {/* Task List */}
          {filteredTodos.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="body1" color="text.secondary">
                {totalCount === 0
                  ? (isEn ? 'Task list is empty. Add your first task!' : 'Список задач пуст. Добавьте первую задачу!')
                  : filter === 'active'
                    ? (isEn ? 'No active tasks' : 'Нет активных задач')
                    : (isEn ? 'No completed tasks' : 'Нет завершённых задач')}
              </Typography>
            </Box>
          ) : (
            <List disablePadding sx={{ mb: 1 }}>
              {filteredTodos.map((todo) => (
                <ListItem
                  key={todo.id}
                  disablePadding
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    py: 0.5,
                    px: 1,
                    borderRadius: 2,
                    transition: 'background-color 150ms ease',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.action.hover, 0.5)
                    }
                  }}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => deleteTodo(todo.id)}
                      sx={{
                        color: theme.palette.text.secondary,
                        '&:hover': { color: theme.palette.error.main }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  }
                >
                  <Checkbox
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    size="small"
                    sx={{ mr: 0.5 }}
                  />
                  <Typography
                    variant="body1"
                    sx={{
                      textDecoration: todo.completed ? 'line-through' : 'none',
                      color: todo.completed
                        ? theme.palette.text.disabled
                        : theme.palette.text.primary,
                      transition: 'color 200ms ease, text-decoration 200ms ease',
                      wordBreak: 'break-word',
                      flex: 1,
                      pr: 4
                    }}
                  >
                    {todo.text}
                  </Typography>
                </ListItem>
              ))}
            </List>
          )}

          {/* Clear completed */}
          {completedCount > 0 && (
            <>
              <Divider sx={{ mt: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={clearCompleted}
                  sx={{
                    borderRadius: 3,
                    textTransform: 'none'
                  }}
                >
                  {isEn ? `Clear completed (${completedCount})` : `Очистить завершённые (${completedCount})`}
                </Button>
              </Box>
            </>
          )}
      </Paper>
    </Box>
  );
}
