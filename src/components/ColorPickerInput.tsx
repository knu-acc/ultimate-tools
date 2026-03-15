'use client';

/**
 * ColorPickerInput — Chrome-style color picker for Material Design 3
 * Uses react-colorful for the spectrum/hue slider + MUI Popover
 */

import React, { useState, useRef, useCallback } from 'react';
import { HexColorPicker } from 'react-colorful';
import {
  Box, Popover, Typography, TextField, Tooltip,
  useTheme, alpha, IconButton,
} from '@mui/material';
import { ContentCopy, Check } from '@mui/icons-material';

// MD3 color palette presets (Material Design 3 key colors)
const PRESET_COLORS = [
  '#F44336', '#E91E63', '#9C27B0', '#673AB7',
  '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4',
  '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
  '#FFEB3B', '#FFC107', '#FF9800', '#FF5722',
  '#795548', '#9E9E9E', '#607D8B', '#000000',
  '#FFFFFF', '#F5F5F5', '#BDBDBD', '#616161',
];

interface ColorPickerInputProps {
  value: string;
  onChange: (hex: string) => void;
  label?: string;
  size?: 'small' | 'medium';
  disabled?: boolean;
}

export default function ColorPickerInput({
  value,
  onChange,
  label,
  size = 'medium',
  disabled = false,
}: ColorPickerInputProps) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [hexInput, setHexInput] = useState(value);
  const [copied, setCopied] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  // Sync hex input when value changes externally
  React.useEffect(() => {
    setHexInput(value);
  }, [value]);

  const handleOpen = () => {
    if (!disabled) setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleColorChange = useCallback((hex: string) => {
    onChange(hex);
    setHexInput(hex);
  }, [onChange]);

  const handleHexInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setHexInput(raw);
    // Only apply if valid 6-digit hex
    const clean = raw.startsWith('#') ? raw : '#' + raw;
    if (/^#[0-9A-Fa-f]{6}$/.test(clean)) {
      onChange(clean.toLowerCase());
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const swatchSize = size === 'small' ? 28 : 36;
  const borderRadius = size === 'small' ? 6 : 8;

  return (
    <>
      <Tooltip title={label || value} placement="top">
        <Box
          ref={anchorRef as any}
          component="button"
          onClick={handleOpen}
          disabled={disabled}
          sx={{
            width: swatchSize,
            height: swatchSize,
            borderRadius: `${borderRadius}px`,
            background: value,
            border: `2px solid ${alpha(theme.palette.divider, 0.5)}`,
            cursor: disabled ? 'default' : 'pointer',
            flexShrink: 0,
            outline: 'none',
            padding: 0,
            transition: 'all 150ms cubic-bezier(0.2,0,0,1)',
            '&:hover:not(:disabled)': {
              border: `2px solid ${theme.palette.primary.main}`,
              transform: 'scale(1.08)',
              boxShadow: `0 2px 8px ${alpha(value, 0.5)}`,
            },
            '&:focus-visible': {
              outline: `2px solid ${theme.palette.primary.main}`,
              outlineOffset: 2,
            },
          }}
        />
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorRef.current}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              borderRadius: 3,
              overflow: 'hidden',
              bgcolor: theme.palette.surfaceContainerHigh,
              border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
              boxShadow: '0px 4px 8px 3px rgba(0,0,0,0.15), 0px 1px 3px rgba(0,0,0,0.3)',
              minWidth: 240,
            },
          },
        }}
      >
        <Box sx={{ p: 0 }}>
          {/* Spectrum + Hue slider via react-colorful */}
          <Box
            sx={{
              '& .react-colorful': {
                width: '100% !important',
                height: 'auto',
                borderRadius: 0,
              },
              '& .react-colorful__saturation': {
                height: '160px !important',
                borderRadius: '12px 12px 0 0 !important',
                borderBottom: 'none',
              },
              '& .react-colorful__hue': {
                height: '14px !important',
                margin: '12px 12px 0 !important',
                borderRadius: '7px !important',
              },
              '& .react-colorful__saturation-pointer, & .react-colorful__hue-pointer': {
                width: '18px !important',
                height: '18px !important',
                border: '2px solid white !important',
                boxShadow: '0 1px 4px rgba(0,0,0,0.4) !important',
              },
            }}
          >
            <HexColorPicker color={value} onChange={handleColorChange} />
          </Box>

          {/* Hex input + Copy */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, pt: 1.5, pb: 1 }}>
            <TextField
              size="small"
              value={hexInput}
              onChange={handleHexInput}
              placeholder="#000000"
              slotProps={{
                input: {
                  sx: {
                    fontFamily: 'monospace',
                    fontSize: '0.8125rem',
                    letterSpacing: '0.05em',
                  },
                },
              }}
              sx={{ flex: 1 }}
            />
            <IconButton size="small" onClick={handleCopy} sx={{ borderRadius: 2 }}>
              {copied ? <Check sx={{ fontSize: 18, color: 'success.main' }} /> : <ContentCopy sx={{ fontSize: 18 }} />}
            </IconButton>
          </Box>

          {/* Presets grid */}
          <Box sx={{ px: 1.5, pb: 1.5 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.75, fontWeight: 500 }}>
              Быстрый выбор
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '5px' }}>
              {PRESET_COLORS.map(color => (
                <Tooltip key={color} title={color} placement="top">
                  <Box
                    component="button"
                    onClick={() => handleColorChange(color)}
                    sx={{
                      width: '100%',
                      aspectRatio: '1',
                      borderRadius: '5px',
                      background: color,
                      border: value.toLowerCase() === color.toLowerCase()
                        ? `2px solid ${theme.palette.primary.main}`
                        : `1px solid ${alpha(theme.palette.divider, 0.4)}`,
                      cursor: 'pointer',
                      padding: 0,
                      outline: 'none',
                      transition: 'transform 100ms',
                      '&:hover': { transform: 'scale(1.15)', zIndex: 1 },
                      '&:focus-visible': { outline: `2px solid ${theme.palette.primary.main}` },
                    }}
                  />
                </Tooltip>
              ))}
            </Box>
          </Box>
        </Box>
      </Popover>
    </>
  );
}
