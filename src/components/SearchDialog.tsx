'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, memo } from 'react';
import {
  Dialog, DialogContent, TextField, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Typography, Box, Chip, alpha, useTheme, InputAdornment,
} from '@mui/material';
import { listItemButtonClasses } from '@mui/material/ListItemButton';
import { Search as SearchIcon } from '@mui/icons-material';
import Fuse from 'fuse.js';
import { useRouter } from 'next/navigation';
import { tools, toolGroups, Tool } from '@/src/data/tools';
import DynamicIcon from './DynamicIcon';
import { useLanguage } from '@/src/i18n/LanguageContext';

interface Props {
  open: boolean;
  onClose: () => void;
}

// Module-level singleton — Fuse index is built once, reused across renders & mounts
let fuseInstance: Fuse<Tool> | null = null;
function getFuse(): Fuse<Tool> {
  if (!fuseInstance) {
    fuseInstance = new Fuse(tools, {
      keys: [{ name: 'name', weight: 2 }, { name: 'description', weight: 1 }, { name: 'keywords', weight: 1.5 }],
      threshold: 0.3,
      includeScore: true,
    });
  }
  return fuseInstance;
}

const defaultResults = tools.slice(0, 12);

export default memo(function SearchDialog({ open, onClose }: Props) {
  const theme = useTheme();
  const router = useRouter();
  const { lHref, locale, t } = useLanguage();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Debounce search input — Fuse.search on 200+ items per keystroke is wasteful
  const handleQueryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedQuery(val), 150);
  }, []);

  const results = useMemo(() => {
    if (!debouncedQuery.trim()) return defaultResults;
    return getFuse().search(debouncedQuery).slice(0, 15).map(r => r.item);
  }, [debouncedQuery]);

  useEffect(() => { setSelectedIndex(0); }, [debouncedQuery]);
  useEffect(() => {
    if (!open) {
      setQuery('');
      setDebouncedQuery('');
      setSelectedIndex(0);
    }
  }, [open]);

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
    router.push(lHref(`/tools/${tool.slug}`));
    onClose();
  }, [router, onClose, lHref]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex(i => Math.min(i + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex(i => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter' && results[selectedIndex]) { handleSelect(results[selectedIndex]); }
  }, [results, selectedIndex, handleSelect]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 18, maxHeight: '70vh' } }}
    >
      <Box sx={{ p: 2, pb: 0 }}>
        <TextField
          autoFocus
          fullWidth
          placeholder={t('nav.searchPlaceholder')}
          value={query}
          onChange={handleQueryChange}
          onKeyDown={handleKeyDown}
          slotProps={{
            input: {
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: theme.palette.text.secondary }} /></InputAdornment>,
            },
          }}
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 18,
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
                    borderRadius: 10,
                    mb: 0.5,
                    py: 1,
                    [`&.${listItemButtonClasses.selected}`]: { bgcolor: alpha(theme.palette.primary.main, 0.08) },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 44 }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
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
                    primary={locale === 'en' ? ((tool as any).nameEn || tool.name) : tool.name}
                    secondary={locale === 'en' ? ((tool as any).descriptionEn || tool.description) : tool.description}
                    primaryTypographyProps={{ fontWeight: 500, fontSize: 14 }}
                    secondaryTypographyProps={{ fontSize: 12, noWrap: true }}
                  />
                  <Chip
                    label={locale === 'en' ? ((group as any)?.nameEn || group?.name) : group?.name}
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
                {locale === 'en' ? `Nothing found for "${query}"` : `Ничего не найдено по запросу «${query}»`}
              </Typography>
            </Box>
          )}
        </List>
      </DialogContent>
    </Dialog>
  );
});
