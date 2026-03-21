'use client';

import React, { memo } from 'react';
import { Card, CardActionArea, CardContent, Typography, Box, alpha, useTheme } from '@mui/material';
import Link from 'next/link';
import { Tool, toolGroups } from '@/src/data/tools';
import DynamicIcon from './DynamicIcon';
import { useLanguage } from '@/src/i18n/LanguageContext';
import { getToolName, getToolDescription, getGroupName } from '@/src/data/toolLocalization';

interface Props {
  tool: Tool;
  showGroup?: boolean;
  variant?: 'default' | 'compact' | 'horizontal';
}

// memo: ~50+ ToolCards on homepage; prevents re-render when parent state changes
// (search dialog open/close, theme toggle) but tool/locale haven't changed.
export default memo(function ToolCard({ tool, showGroup = false, variant = 'default' }: Props) {
  const theme = useTheme();
  const { lHref, locale } = useLanguage();
  const group = toolGroups.find(g => g.id === tool.groupId);
  const toolName = getToolName(tool, locale);
  const toolDesc = getToolDescription(tool, locale);
  const groupName = group ? getGroupName(group, locale) : '';

  const groupColor = group?.color ?? theme.palette.primary.main;
  const motionDuration = theme.md3?.motion.duration.short4 ?? '200ms';
  const motionEasing = theme.md3?.motion.easing.standard ?? 'cubic-bezier(0.2, 0, 0, 1)';

  if (variant === 'compact') {
    return (
      /*
        MD3 Filled Card — Compact
        Spec: https://m3.material.io/components/cards/specs
        Hover: MD3 state layer = 8% onSurface overlay (no translateY/scale)
        State layer implemented via background-color change (surfaceContainerLow → High)
      */
      <Card
        elevation={0}
        sx={{
          bgcolor: theme.palette.surfaceContainerLow,
          borderRadius: 18,
          border: `1px solid ${theme.palette.outlineVariant ?? alpha(theme.palette.divider, 0.5)}`,
          transitionProperty: 'background-color, border-color',
          transitionDuration: motionDuration,
          transitionTimingFunction: motionEasing,
          '&:hover': {
            bgcolor: theme.palette.surfaceContainerHigh,
            borderColor: alpha(groupColor, 0.3),
          },
        }}
      >
        <CardActionArea
          component={Link}
          href={lHref(`/tools/${tool.slug}`)}
          sx={{ p: 2, textAlign: 'center' }}
        >
          <DynamicIcon name={tool.icon} sx={{ color: groupColor, fontSize: 32, mb: 1 }} />
          <Typography variant="body2" fontWeight={500} noWrap>
            {toolName}
          </Typography>
        </CardActionArea>
      </Card>
    );
  }

  if (variant === 'horizontal') {
    return (
      /*
        MD3 Filled Card — Horizontal
        Hover: state layer 8% via surfaceContainerHigh background
      */
      <Card
        elevation={0}
        sx={{
          bgcolor: 'transparent',
          // MD3: animate specific properties only
          transitionProperty: 'background-color',
          transitionDuration: motionDuration,
          transitionTimingFunction: motionEasing,
          '&:hover': {
            bgcolor: theme.palette.surfaceContainerHigh,
          },
        }}
      >
        <CardActionArea
          component={Link}
          href={lHref(`/tools/${tool.slug}`)}
          sx={{ display: 'flex', alignItems: 'center', p: 1.5, gap: 2 }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: alpha(groupColor, 0.12),
              flexShrink: 0,
            }}
          >
            <DynamicIcon name={tool.icon} sx={{ color: groupColor, fontSize: 20 }} />
          </Box>
          <Box sx={{ minWidth: 0, flexGrow: 1 }}>
            <Typography variant="body2" fontWeight={500} noWrap>
              {toolName}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {toolDesc}
            </Typography>
          </Box>
        </CardActionArea>
      </Card>
    );
  }

  // Default variant — MD3 Filled Card
  // Spec: https://m3.material.io/components/cards/specs
  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        bgcolor: theme.palette.surfaceContainerLow,
        borderRadius: 18,
        border: `1px solid ${theme.palette.outlineVariant ?? alpha(theme.palette.divider, 0.5)}`,
        transitionProperty: 'background-color, border-color',
        transitionDuration: theme.md3?.motion.duration.medium1 ?? '250ms',
        transitionTimingFunction: motionEasing,
        '&:hover': {
          bgcolor: theme.palette.surfaceContainerHighest,
          borderColor: alpha(groupColor, 0.3),
        },
      }}
    >
      <CardActionArea
        component={Link}
        href={lHref(`/tools/${tool.slug}`)}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          p: 0,
        }}
      >
        <CardContent sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1.5, p: 2.5 }}>
          {/* MD3 Icon Container: 48×48dp, medium (12dp) border-radius, group-color tinted */}
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: alpha(groupColor, 0.12),
            }}
          >
            <DynamicIcon name={tool.icon} sx={{ color: groupColor, fontSize: 24 }} />
          </Box>

          {/* Title + group */}
          <Box>
            <Typography variant="subtitle1" fontWeight={500} sx={{ lineHeight: 1.3, mb: 0.3 }}>
              {toolName}
            </Typography>
            {showGroup && group && (
              <Typography variant="caption" sx={{ color: groupColor }}>
                {groupName}
              </Typography>
            )}
          </Box>

          {/* Description — MD3 Body Medium, 2-line clamp */}
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
            {toolDesc}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
});
