'use client';

import React from 'react';
import { Card, CardActionArea, CardContent, Typography, Box, Chip, alpha, useTheme } from '@mui/material';
import Link from 'next/link';
import { Tool, toolGroups } from '@/src/data/tools';
import DynamicIcon from './DynamicIcon';

interface Props {
  tool: Tool;
  showGroup?: boolean;
  variant?: 'default' | 'compact' | 'horizontal';
}

export default function ToolCard({ tool, showGroup = false, variant = 'default' }: Props) {
  const theme = useTheme();
  const group = toolGroups.find(g => g.id === tool.groupId);
  const iconColor = group?.color || theme.palette.primary.main;

  if (variant === 'compact') {
    return (
      <Card
        elevation={0}
        sx={{
          bgcolor: alpha(iconColor, 0.05),
          border: 'none',
          transition: `all 200ms cubic-bezier(0.2, 0, 0, 1)`,
          '&:hover': {
            bgcolor: alpha(iconColor, 0.1),
            transform: 'scale(1.02)',
          },
        }}
      >
        <CardActionArea component={Link} href={`/tools/${tool.slug}`} sx={{ p: 2, textAlign: 'center' }}>
          <DynamicIcon name={tool.icon} sx={{ color: iconColor, fontSize: 32, mb: 1 }} />
          <Typography variant="body2" fontWeight={500} noWrap>
            {tool.name}
          </Typography>
        </CardActionArea>
      </Card>
    );
  }

  if (variant === 'horizontal') {
    return (
      <Card
        elevation={0}
        sx={{
          bgcolor: 'transparent',
          transition: `all 200ms cubic-bezier(0.2, 0, 0, 1)`,
          '&:hover': {
            bgcolor: alpha(theme.palette.primary.main, 0.05),
          },
        }}
      >
        <CardActionArea
          component={Link}
          href={`/tools/${tool.slug}`}
          sx={{ display: 'flex', alignItems: 'center', p: 1.5, gap: 2 }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: alpha(iconColor, 0.08),
              flexShrink: 0,
            }}
          >
            <DynamicIcon name={tool.icon} sx={{ color: iconColor, fontSize: 20 }} />
          </Box>
          <Box sx={{ minWidth: 0, flexGrow: 1 }}>
            <Typography variant="body2" fontWeight={500} noWrap>
              {tool.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {tool.description}
            </Typography>
          </Box>
        </CardActionArea>
      </Card>
    );
  }

  // Default variant — MD3 filled card
  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        bgcolor: theme.palette.mode === 'dark'
          ? alpha(theme.palette.primary.main, 0.05)
          : alpha(iconColor, 0.04),
        border: 'none',
        transition: `all 250ms cubic-bezier(0.2, 0, 0, 1)`,
        '&:hover': {
          bgcolor: theme.palette.mode === 'dark'
            ? alpha(theme.palette.primary.main, 0.1)
            : alpha(iconColor, 0.08),
          boxShadow: `0px 1px 2px rgba(0,0,0,0.3), 0px 1px 3px 1px rgba(0,0,0,0.15)`,
          transform: 'translateY(-1px)',
        },
      }}
    >
      <CardActionArea
        component={Link}
        href={`/tools/${tool.slug}`}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          p: 0,
        }}
      >
        <CardContent sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1.5, p: 2.5 }}>
          {/* Icon */}
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: alpha(iconColor, theme.palette.mode === 'dark' ? 0.15 : 0.1),
            }}
          >
            <DynamicIcon name={tool.icon} sx={{ color: iconColor, fontSize: 24 }} />
          </Box>

          {/* Title + group */}
          <Box>
            <Typography variant="subtitle1" fontWeight={500} sx={{ lineHeight: 1.3, mb: 0.3 }}>
              {tool.name}
            </Typography>
            {showGroup && group && (
              <Typography variant="caption" color="text.secondary">
                {group.name}
              </Typography>
            )}
          </Box>

          {/* Description */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.5,
            }}
          >
            {tool.description}
          </Typography>

          {/* Status chip */}
          {tool.implemented && (
            <Chip
              label="Готов"
              size="small"
              sx={{
                alignSelf: 'flex-start',
                height: 24,
                fontSize: '0.6875rem',
                fontWeight: 500,
                bgcolor: alpha(theme.palette.success.main, 0.12),
                color: theme.palette.success.main,
                border: 'none',
              }}
            />
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
