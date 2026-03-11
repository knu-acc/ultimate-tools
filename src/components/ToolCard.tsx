'use client';

import React from 'react';
import { Card, CardActionArea, CardContent, Typography, Box, alpha, useTheme } from '@mui/material';
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

  if (variant === 'compact') {
    return (
      <Card
        elevation={0}
        sx={{
          bgcolor: theme.palette.surfaceContainerLow,
          transition: 'all 200ms cubic-bezier(0.2, 0, 0, 1)',
          '&:hover': {
            bgcolor: theme.palette.surfaceContainerHigh,
            transform: 'scale(1.02)',
          },
        }}
      >
        <CardActionArea component={Link} href={`/tools/${tool.slug}`} sx={{ p: 2, textAlign: 'center' }}>
          <DynamicIcon name={tool.icon} sx={{ color: theme.palette.onPrimaryContainer, fontSize: 32, mb: 1 }} />
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
            bgcolor: theme.palette.surfaceContainerHigh,
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
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: alpha(theme.palette.primaryContainer, 0.6),
              flexShrink: 0,
            }}
          >
            <DynamicIcon name={tool.icon} sx={{ color: theme.palette.onPrimaryContainer, fontSize: 20 }} />
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
      elevation={1}
      sx={{
        height: '100%',
        bgcolor: theme.palette.surfaceContainerLow,
        transition: 'all 250ms cubic-bezier(0.2, 0, 0, 1)',
        '&:hover': {
          bgcolor: theme.palette.surfaceContainerHigh,
          boxShadow: '0px 1px 2px rgba(0,0,0,0.3), 0px 2px 6px 2px rgba(0,0,0,0.15)',
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
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: theme.palette.primaryContainer,
            }}
          >
            <DynamicIcon name={tool.icon} sx={{ color: theme.palette.onPrimaryContainer, fontSize: 24 }} />
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
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
