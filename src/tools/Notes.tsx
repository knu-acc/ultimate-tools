'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Grid,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  useTheme,
  alpha,
  Divider,
} from '@mui/material';
import Add from '@mui/icons-material/Add';
import Delete from '@mui/icons-material/Delete';
import StickyNote2 from '@mui/icons-material/StickyNote2';

interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
}

const STORAGE_KEY = 'ulti-notes';

function loadNotes(): Note[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function saveNotes(notes: Note[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {
    // storage full or unavailable
  }
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getWordCount(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export default function Notes() {
  const theme = useTheme();
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = loadNotes();
    setNotes(stored);
    if (stored.length > 0) {
      setActiveId(stored[0].id);
    }
    setLoaded(true);
  }, []);

  // Auto-save on every change
  useEffect(() => {
    if (!loaded) return;
    saveNotes(notes);
  }, [notes, loaded]);

  const activeNote = notes.find((n) => n.id === activeId) || null;

  const handleAdd = useCallback(() => {
    const newNote: Note = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      title: 'Новая заметка',
      content: '',
      updatedAt: Date.now(),
    };
    setNotes((prev) => [newNote, ...prev]);
    setActiveId(newNote.id);
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      setNotes((prev) => {
        const next = prev.filter((n) => n.id !== id);
        if (activeId === id) {
          setActiveId(next.length > 0 ? next[0].id : null);
        }
        return next;
      });
    },
    [activeId],
  );

  const handleTitleChange = useCallback(
    (value: string) => {
      if (!activeId) return;
      setNotes((prev) =>
        prev.map((n) =>
          n.id === activeId ? { ...n, title: value, updatedAt: Date.now() } : n,
        ),
      );
    },
    [activeId],
  );

  const handleContentChange = useCallback(
    (value: string) => {
      if (!activeId) return;
      setNotes((prev) =>
        prev.map((n) =>
          n.id === activeId ? { ...n, content: value, updatedAt: Date.now() } : n,
        ),
      );
    },
    [activeId],
  );

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
      <Grid container spacing={2}>
        {/* Список заметок */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 3,
              overflow: 'hidden',
              height: { md: 600 },
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: alpha(theme.palette.primary.main, 0.04),
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <StickyNote2 sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Заметки ({notes.length})
                </Typography>
              </Box>
              <Button
                size="small"
                variant="contained"
                startIcon={<Add />}
                onClick={handleAdd}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2,
                  boxShadow: 'none',
                  '&:hover': { boxShadow: 'none' },
                }}
              >
                Создать
              </Button>
            </Box>
            <Divider />
            <List
              sx={{
                flex: 1,
                overflowY: 'auto',
                p: 0,
              }}
            >
              {notes.length === 0 && (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <StickyNote2
                    sx={{
                      fontSize: 48,
                      color: alpha(theme.palette.text.secondary, 0.2),
                      mb: 1,
                    }}
                  />
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Нет заметок
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                    Нажмите «Создать» чтобы добавить
                  </Typography>
                </Box>
              )}
              {notes.map((note) => (
                <ListItem
                  key={note.id}
                  disablePadding
                  secondaryAction={
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(note.id);
                      }}
                      sx={{
                        color: 'text.disabled',
                        '&:hover': { color: theme.palette.error.main },
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  }
                >
                  <ListItemButton
                    selected={note.id === activeId}
                    onClick={() => setActiveId(note.id)}
                    sx={{
                      borderRadius: 0,
                      py: 1.5,
                      '&.Mui-selected': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                        borderLeft: `3px solid ${theme.palette.primary.main}`,
                      },
                      '&.Mui-selected:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.12),
                      },
                    }}
                  >
                    <ListItemText
                      primary={note.title || 'Без названия'}
                      secondary={formatDate(note.updatedAt)}
                      primaryTypographyProps={{
                        noWrap: true,
                        fontWeight: note.id === activeId ? 600 : 400,
                        fontSize: '0.9rem',
                      }}
                      secondaryTypographyProps={{
                        fontSize: '0.7rem',
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Редактор */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper
            elevation={0}
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 3,
              height: { md: 600 },
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {activeNote ? (
              <>
                {/* Заголовок заметки */}
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                  }}
                >
                  <TextField
                    fullWidth
                    value={activeNote.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Название заметки..."
                    variant="standard"
                    slotProps={{
                      input: {
                        disableUnderline: true,
                        sx: {
                          fontSize: '1.2rem',
                          fontWeight: 700,
                        },
                      },
                    }}
                  />
                </Box>
                <Divider />

                {/* Содержимое */}
                <Box sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
                  <TextField
                    multiline
                    fullWidth
                    value={activeNote.content}
                    onChange={(e) => handleContentChange(e.target.value)}
                    placeholder="Начните вводить текст заметки..."
                    variant="outlined"
                    sx={{
                      flex: 1,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        fontSize: '0.95rem',
                        lineHeight: 1.7,
                        height: '100%',
                        alignItems: 'flex-start',
                      },
                      '& .MuiInputBase-input': {
                        height: '100% !important',
                        overflow: 'auto !important',
                      },
                    }}
                  />
                </Box>

                {/* Статус-бар */}
                <Divider />
                <Box
                  sx={{
                    px: 2,
                    py: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 1,
                    backgroundColor: alpha(theme.palette.text.primary, 0.02),
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Символов: {activeNote.content.length.toLocaleString('ru-RU')}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Слов: {getWordCount(activeNote.content).toLocaleString('ru-RU')}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                    Изменено: {formatDate(activeNote.updatedAt)}
                  </Typography>
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                }}
              >
                <StickyNote2
                  sx={{
                    fontSize: 64,
                    color: alpha(theme.palette.text.secondary, 0.15),
                  }}
                />
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  Выберите заметку или создайте новую
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
