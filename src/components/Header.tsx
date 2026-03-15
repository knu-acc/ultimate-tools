'use client';

import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Box, Drawer,
  List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  useMediaQuery, useTheme, Button, Divider, alpha,
} from '@mui/material';
import {
  Menu as MenuIcon, Search as SearchIcon, DarkMode, LightMode,
  SettingsBrightness, Close, Home, Article,
} from '@mui/icons-material';
import Link from 'next/link';
import { useThemeMode } from '@/src/theme/ThemeRegistry';
import { toolGroups } from '@/src/data/tools';
import DynamicIcon from './DynamicIcon';
import SearchDialog from './SearchDialog';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '@/src/i18n/LanguageContext';

export default function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { mode, setMode } = useThemeMode();
  const { t } = useLanguage();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const toggleTheme = () => {
    if (mode === 'light') setMode('dark');
    else if (mode === 'dark') setMode('system');
    else setMode('light');
  };

  const themeIcon = mode === 'light' ? <LightMode /> : mode === 'dark' ? <DarkMode /> : <SettingsBrightness />;

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: alpha(theme.palette.surfaceContainerLow, 0.95),
          backdropFilter: 'blur(20px)',
          boxShadow: '0px 1px 2px rgba(0,0,0,0.3), 0px 1px 3px 1px rgba(0,0,0,0.15)',
          color: theme.palette.text.primary,
        }}
      >
        <Toolbar sx={{ gap: 1, minHeight: { xs: 56, md: 64 } }}>
          {isMobile && (
            <IconButton onClick={() => setDrawerOpen(true)} edge="start" size="large">
              <MenuIcon />
            </IconButton>
          )}

          <Link href="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 2,
                bgcolor: theme.palette.primary.main,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography sx={{ color: theme.palette.primary.contrastText, fontWeight: 700, fontSize: 16 }}>U</Typography>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.125rem', display: { xs: 'none', sm: 'block' } }}>
              Ultimate Tools
            </Typography>
          </Link>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 0.5, ml: 2 }}>
              {[
                { label: t('nav.converters'), href: '/group/converters' },
                { label: t('nav.calculators'), href: '/group/calculators' },
                { label: t('nav.generators'), href: '/group/generators' },
                { label: t('nav.dev'), href: '/group/developers' },
                { label: t('nav.blog'), href: '/blog' },
              ].map(item => (
                <Button
                  key={item.href}
                  component={Link}
                  href={item.href}
                  color="inherit"
                  size="small"
                  sx={{
                    px: 2,
                    fontWeight: 400,
                    fontSize: '0.875rem',
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.08) },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ flexGrow: 1 }} />

          {/* MD3 Search bar */}
          <Box
            onClick={() => setSearchOpen(true)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              height: 40,
              borderRadius: 7,
              bgcolor: theme.palette.surfaceContainerHigh,
              cursor: 'pointer',
              minWidth: { xs: 40, sm: 180, md: 240 },
              transition: 'all 200ms cubic-bezier(0.2, 0, 0, 1)',
              '&:hover': { bgcolor: theme.palette.surfaceContainerHighest },
            }}
          >
            <SearchIcon sx={{ color: theme.palette.text.secondary, fontSize: 20 }} />
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, display: { xs: 'none', sm: 'block' }, flexGrow: 1 }}>
              {t('nav.search')}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                px: 0.75, py: 0.25, borderRadius: 1,
                bgcolor: alpha(theme.palette.text.primary, 0.06),
                display: { xs: 'none', md: 'block' },
                fontFamily: 'monospace', fontSize: '0.6875rem',
              }}
            >
              {t('nav.searchShortcut')}
            </Typography>
          </Box>

          <LanguageSwitcher />

          <IconButton onClick={toggleTheme} sx={{ ml: 0.5 }} size="large">
            {themeIcon}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* MD3 Navigation Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: { width: 320, bgcolor: theme.palette.surfaceContainerLow },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" fontWeight={600}>{t('nav.categories')}</Typography>
          <IconButton onClick={() => setDrawerOpen(false)} size="small"><Close /></IconButton>
        </Box>
        <Divider />
        <List sx={{ px: 1.5, py: 1 }}>
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton component={Link} href="/" onClick={() => setDrawerOpen(false)} sx={{ borderRadius: 7, py: 1 }}>
              <ListItemIcon sx={{ minWidth: 40 }}><Home sx={{ fontSize: 22 }} /></ListItemIcon>
              <ListItemText primary={t('nav.drawer.home')} primaryTypographyProps={{ fontWeight: 500, fontSize: '0.875rem' }} />
            </ListItemButton>
          </ListItem>
          {toolGroups.map(group => (
            <ListItem key={group.id} disablePadding sx={{ mb: 0.25 }}>
              <ListItemButton
                component={Link}
                href={`/group/${group.slug}`}
                onClick={() => setDrawerOpen(false)}
                sx={{ borderRadius: 7, py: 0.75, '&:hover': { bgcolor: alpha(group.color, 0.08) } }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <DynamicIcon name={group.icon} sx={{ color: group.color, fontSize: 22 }} />
                </ListItemIcon>
                <ListItemText primary={group.name} primaryTypographyProps={{ fontWeight: 500, fontSize: '0.875rem' }} />
              </ListItemButton>
            </ListItem>
          ))}
          <Divider sx={{ my: 1 }} />
          <ListItem disablePadding>
            <ListItemButton component={Link} href="/blog" onClick={() => setDrawerOpen(false)} sx={{ borderRadius: 7, py: 1 }}>
              <ListItemIcon sx={{ minWidth: 40 }}><Article sx={{ fontSize: 22 }} /></ListItemIcon>
              <ListItemText primary={t('nav.blog')} primaryTypographyProps={{ fontWeight: 500, fontSize: '0.875rem' }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
