'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Dialog, DialogContent, TextField, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Typography, Box, Chip, alpha, useTheme, InputAdornment,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import Fuse from 'fuse.js';
import { useRouter } from 'next/navigation';
import { tools, toolGroups, Tool } from '@/src/data/tools';
import DynamicIcon from './DynamicIcon';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SearchDialog({ open, onClose }: Props) {
  const theme = useTheme();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const fuse = useMemo(
    () => new Fuse(tools, {
      keys: [{ name: 'name', weight: 2 }, { name: 'description', weight: 1 }, { name: 'keywords', weight: 1.5 }],
      threshold: 0.3,
      includeScore: true,
    }),
    []
  );

  const results = useMemo(() => {
    if (!query.trim()) return tools.slice(0, 12);
    return fuse.search(query).slice(0, 15).map(r => r.item);
  }, [query, fuse]);

  useEffect(() => { setSelectedIndex(0); }, [query]);
  useEffect(() => { if (!open) { setQuery(''); setSelectedIndex(0); } }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleSelect = useCallback((tool: Tool) => {
    router.push(`/tools/${tool.slug}`);
    onClose();
  }, [router, onClose]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex(i => Math.min(i + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex(i => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter' && results[selectedIndex]) { handleSelect(results[selectedIndex]); }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 7, maxHeight: '70vh' } }}
    >
      <Box sx={{ p: 2, pb: 0 }}>
        <TextField
          autoFocus
          fullWidth
          placeholder="Поиск инструментов..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          slotProps={{
            input: {
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: theme.palette.text.secondary }} /></InputAdornment>,
            },
          }}
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 7,
              bgcolor: alpha(theme.palette.primary.main, 0.04),
              '& fieldset': { border: 'none' },
            },
          }}
        />
      </Box>
      <DialogContent sx={{ p: 1, pt: 1 }}>
        <List dense>
          {results.map((tool, index) => {
            const group = toolGroups.find(g => g.id === tool.groupId);
            return (
              <ListItem key={tool.id} disablePadding>
                <ListItemButton
                  selected={index === selectedIndex}
                  onClick={() => handleSelect(tool)}
                  sx={{
                    borderRadius: 3,
                    mb: 0.5,
                    py: 1,
                    '&.Mui-selected': { bgcolor: alpha(theme.palette.primary.main, 0.08) },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 44 }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 2,
                        bgcolor: alpha(group?.color || theme.palette.primary.main, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <DynamicIcon name={tool.icon} sx={{ color: group?.color || theme.palette.primary.main, fontSize: 18 }} />
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={tool.name}
                    secondary={tool.description}
                    primaryTypographyProps={{ fontWeight: 500, fontSize: 14 }}
                    secondaryTypographyProps={{ fontSize: 12, noWrap: true }}
                  />
                  <Chip
                    label={group?.name}
                    size="small"
                    sx={{ fontSize: 11, height: 22, bgcolor: alpha(group?.color || '#666', 0.08), border: 'none' }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
          {results.length === 0 && query && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Ничего не найдено по запросу «{query}»
              </Typography>
            </Box>
          )}
        </List>
      </DialogContent>
    </Dialog>
  );
}
