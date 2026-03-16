'use client';

import { useState } from 'react';
import { IconButton, Tooltip, Box, alpha, useTheme } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import ShareIcon from '@mui/icons-material/Share';

// Robust clipboard copy with execCommand fallback
export async function copyText(text: string): Promise<boolean> {
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {}
  }
  // Fallback for denied permissions or older browsers
  try {
    const el = document.createElement('textarea');
    el.value = text;
    el.setAttribute('readonly', '');
    el.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;';
    document.body.appendChild(el);
    el.select();
    el.setSelectionRange(0, 99999);
    const ok = document.execCommand('copy');
    document.body.removeChild(el);
    return ok;
  } catch {
    return false;
  }
}

interface CopyButtonProps {
  text: string;
  size?: 'small' | 'medium';
  tooltip?: string;
}

export function CopyButton({ text, size = 'small', tooltip = 'Копировать' }: CopyButtonProps) {
  const theme = useTheme();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyText(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Tooltip title={copied ? 'Скопировано!' : tooltip}>
      <Box
        component="span"
        sx={{
          display: 'inline-flex',
          bgcolor: copied
            ? alpha(theme.palette.success.main, 0.12)
            : theme.palette.surfaceContainerHigh,
          borderRadius: 10,
          transitionProperty: 'background-color',
          transitionDuration: '200ms',
          transitionTimingFunction: 'cubic-bezier(0.2, 0, 0, 1)',
          '&:hover': {
            bgcolor: copied
              ? alpha(theme.palette.success.main, 0.18)
              : theme.palette.surfaceContainerHighest,
          },
        }}
      >
        <IconButton size={size} onClick={handleCopy} color={copied ? 'success' : 'default'}>
          {copied
            ? <CheckIcon sx={{ fontSize: size === 'small' ? 16 : 20 }} />
            : <ContentCopyIcon sx={{ fontSize: size === 'small' ? 16 : 20 }} />}
        </IconButton>
      </Box>
    </Tooltip>
  );
}

interface ShareButtonProps {
  text: string;
  title?: string;
  url?: string;
}

export function ShareButton({ text, title, url }: ShareButtonProps) {
  const theme = useTheme();
  const [shared, setShared] = useState(false);

  const handleShare = async () => {
    const shareData: ShareData = {
      text,
      title: title ?? document.title,
      url: url ?? window.location.href,
    };

    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
        setShared(true);
      } else {
        // Fallback: copy URL to clipboard
        await copyText(url ?? window.location.href);
        setShared(true);
      }
      setTimeout(() => setShared(false), 2000);
    } catch {}
  };

  return (
    <Tooltip title={shared ? 'Поделились!' : 'Поделиться'}>
      <Box
        component="span"
        sx={{
          display: 'inline-flex',
          bgcolor: shared
            ? alpha(theme.palette.success.main, 0.12)
            : theme.palette.surfaceContainerHigh,
          borderRadius: 10,
          transitionProperty: 'background-color',
          transitionDuration: '200ms',
          transitionTimingFunction: 'cubic-bezier(0.2, 0, 0, 1)',
          '&:hover': {
            bgcolor: shared
              ? alpha(theme.palette.success.main, 0.18)
              : theme.palette.surfaceContainerHighest,
          },
        }}
      >
        <IconButton size="small" onClick={handleShare} color={shared ? 'success' : 'default'}>
          {shared
            ? <CheckIcon sx={{ fontSize: 16 }} />
            : <ShareIcon sx={{ fontSize: 16 }} />}
        </IconButton>
      </Box>
    </Tooltip>
  );
}
