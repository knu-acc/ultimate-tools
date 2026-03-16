'use client';

import React, { useState, useEffect, useRef } from 'react';
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
import { usePathname } from 'next/navigation';
import { useThemeMode } from '@/src/theme/ThemeRegistry';
import { toolGroups, getToolBySlug } from '@/src/data/tools';
import DynamicIcon from './DynamicIcon';
import SearchDialog from './SearchDialog';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '@/src/i18n/LanguageContext';

export default function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { mode, setMode } = useThemeMode();
  const { locale, t, lHref } = useLanguage();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [highlightGroup, setHighlightGroup] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const pathname = usePathname();

  // Determine current group from URL
  const currentGroupSlug = React.useMemo(() => {
    const toolMatch = pathname.match(/\/tools\/([^/]+)/);
    if (toolMatch) {
      const tool = getToolBySlug(toolMatch[1]);
      if (tool) {
        const group = toolGroups.find(g => g.id === tool.groupId);
        return group?.slug || null;
      }
    }
    const groupMatch = pathname.match(/\/group\/([^/]+)/);
    if (groupMatch) return groupMatch[1];
    return null;
  }, [pathname]);

  // Auto-scroll to current group when drawer opens
  useEffect(() => {
    if (drawerOpen && currentGroupSlug && listRef.current) {
      const timer = setTimeout(() => {
        const el = listRef.current?.querySelector(`[data-group-slug="${currentGroupSlug}"]`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // MD3: brief highlight using standard motion (max 500ms)
          setHighlightGroup(currentGroupSlug);
          setTimeout(() => setHighlightGroup(null), 500);
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [drawerOpen, currentGroupSlug]);

  const toggleTheme = () => {
    if (mode === 'light') setMode('dark');
    else if (mode === 'dark') setMode('system');
    else setMode('light');
  };

  const themeIcon = mode === 'light' ? <LightMode /> : mode === 'dark' ? <DarkMode /> : <SettingsBrightness />;

  return (
    <>
      {/*
        MD3 Top App Bar
        Spec: https://m3.material.io/components/top-app-bar/specs
        - Container color: surface (background.default)
        - Height: 64dp (uniform, mobile and desktop)
        - No elevation shadow on scroll-at-top state
      */}
      <AppBar
        position="sticky"
        elevation={0}
        component="header"
        aria-label="Главная навигация"
        sx={{
          // MD3 Top App Bar Container Color = surface
          bgcolor: theme.palette.background.default,
          color: theme.palette.text.primary,
          // MD3: bottom border as subtle divider instead of shadow
          borderBottom: `1px solid ${theme.palette.divider}`,
          transitionProperty: 'background-color',
          transitionDuration: theme.md3?.motion.duration.medium2 ?? '300ms',
          transitionTimingFunction: theme.md3?.motion.easing.standard ?? 'cubic-bezier(0.2, 0, 0, 1)',
        }}
      >
        {/* MD3 Top App Bar: height = 64dp (uniform across all breakpoints) */}
        <Toolbar sx={{ gap: 1, minHeight: 64, height: 64 }}>
          {isMobile && (
            <IconButton
              onClick={() => setDrawerOpen(true)}
              edge="start"
              size="large"
              aria-label="Открыть меню навигации"
              aria-expanded={drawerOpen}
              aria-controls="mobile-navigation-drawer"
            >
              <MenuIcon />
            </IconButton>
          )}

          <Link href={lHref('/')} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 10,
                bgcolor: theme.palette.primary.main,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography sx={{ color: theme.palette.primary.contrastText, fontWeight: 700, fontSize: 16 }}>U</Typography>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 500, display: { xs: 'none', sm: 'block' } }}>
              Ultimate Tools
            </Typography>
          </Link>

          {!isMobile && (
            <Box component="nav" aria-label="Разделы сайта" sx={{ display: 'flex', gap: 0.5, ml: 2 }}>
              {[
                { label: t('nav.converters'), href: lHref('/group/converters') },
                { label: t('nav.calculators'), href: lHref('/group/calculators') },
                { label: t('nav.generators'), href: lHref('/group/generators') },
                { label: t('nav.dev'), href: lHref('/group/developers') },
                { label: t('nav.blog'), href: lHref('/blog') },
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
                    // MD3 state layer: 8% primary on hover
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.08) },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ flexGrow: 1 }} />

          {/*
            MD3 Search Bar
            Spec: https://m3.material.io/components/search/specs
            - Height: 56dp
            - Border-radius: 28dp (full rounded = half of height)
            - Container color: surfaceContainerHigh
          */}
          {/* Mobile: round icon button; Desktop: full search bar */}
          {isMobile ? (
            <IconButton
              onClick={() => setSearchOpen(true)}
              aria-label={t('nav.search')}
              size="large"
            >
              <SearchIcon />
            </IconButton>
          ) : (
            <Box
              onClick={() => setSearchOpen(true)}
              role="button"
              tabIndex={0}
              aria-label={t('nav.search')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSearchOpen(true); } }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 2,
                height: 44,
                borderRadius: 999,
                bgcolor: theme.palette.surfaceContainerHigh,
                cursor: 'pointer',
                minWidth: { sm: 180, md: 240 },
                transitionProperty: 'background-color',
                transitionDuration: theme.md3?.motion.duration.short4 ?? '200ms',
                transitionTimingFunction: theme.md3?.motion.easing.standard ?? 'cubic-bezier(0.2, 0, 0, 1)',
                '&:hover': { bgcolor: theme.palette.surfaceContainerHighest },
              }}
            >
              <SearchIcon sx={{ color: theme.palette.text.secondary, fontSize: 20 }} />
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary, flexGrow: 1 }}>
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
          )}

          <LanguageSwitcher />

          <IconButton
            onClick={toggleTheme}
            sx={{ ml: 0.5 }}
            size="large"
            aria-label={mode === 'light' ? 'Переключить на тёмную тему' : mode === 'dark' ? 'Переключить на системную тему' : 'Переключить на светлую тему'}
          >
            {themeIcon}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/*
        MD3 Navigation Drawer (Modal)
        Spec: https://m3.material.io/components/navigation-drawer/specs
        - Width: 360dp
        - Container color: surfaceContainerLow
        - Corner radius on trailing edge: 16dp (large)
      */}
      <Drawer
        id="mobile-navigation-drawer"
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          component: 'nav',
          'aria-label': 'Мобильная навигация',
          sx: {
            // MD3 Navigation Drawer width = 360dp
            width: 360,
            bgcolor: theme.palette.surfaceContainerLow,
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" fontWeight={600}>{t('nav.categories')}</Typography>
          <IconButton onClick={() => setDrawerOpen(false)} size="small" aria-label="Закрыть меню"><Close /></IconButton>
        </Box>
        <Divider />
        <List ref={listRef} sx={{ px: 1.5, py: 1 }}>
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={Link}
              href={lHref('/')}
              onClick={() => setDrawerOpen(false)}
              sx={{ borderRadius: 999, py: 1 }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}><Home sx={{ fontSize: 22 }} /></ListItemIcon>
              <ListItemText primary={t('nav.drawer.home')} primaryTypographyProps={{ fontWeight: 500, fontSize: '0.875rem' }} />
            </ListItemButton>
          </ListItem>
          {toolGroups.map(group => {
            const isHighlighted = highlightGroup === group.slug;
            return (
              <ListItem
                key={group.id}
                disablePadding
                sx={{ mb: 0.25 }}
                data-group-slug={group.slug}
              >
                <ListItemButton
                  component={Link}
                  href={lHref(`/group/${group.slug}`)}
                  onClick={() => setDrawerOpen(false)}
                  sx={{
                    borderRadius: 999,
                    py: 0.75,
                    // MD3 state layer: 8% group color on hover
                    '&:hover': { bgcolor: alpha(group.color, 0.08) },
                    ...(currentGroupSlug === group.slug && {
                      bgcolor: alpha(group.color, 0.08),
                      '& .MuiListItemText-primary': { fontWeight: 700 },
                    }),
                    // MD3 motion: max 500ms, standard easing (replaced 2.4s non-standard animation)
                    ...(isHighlighted && {
                      bgcolor: alpha(group.color, 0.12),
                      transitionProperty: 'background-color',
                      transitionDuration: theme.md3?.motion.duration.medium4 ?? '400ms',
                      transitionTimingFunction: theme.md3?.motion.easing.emphasizedDecelerate ?? 'cubic-bezier(0.05, 0.7, 0.1, 1)',
                    }),
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <DynamicIcon name={group.icon} sx={{ color: group.color, fontSize: 22 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={locale === 'en' ? (group.nameEn || group.name) : group.name}
                    primaryTypographyProps={{ fontWeight: 500, fontSize: '0.875rem' }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
          <Divider sx={{ my: 1 }} />
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              href={lHref('/blog')}
              onClick={() => setDrawerOpen(false)}
              sx={{ borderRadius: 999, py: 1 }}
            >
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
